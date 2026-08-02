#!/usr/bin/env node
/**
 * WP-HUB-110 · consumidor limpio.
 *
 * LO QUE ESTA VERSIÓN DEJA DE FINGIR
 * ----------------------------------
 * · **Offline instrumentado donde importa.** La guardia va dentro de cada
 *   proceso hijo vía `NODE_OPTIONS=--import lib/offline/preload.mjs`, y
 *   BLOQUEA. Antes era un monkeypatch en el padre —ciego a `generar.mjs` y a
 *   la ceremonia, que son procesos aparte— y además sólo anotaba.
 * · **Puertos comprobados.** Cada `listen()` de cada proceso queda registrado.
 *   Antes no había ni una referencia a puertos en todo el test, y la CA los
 *   exigía.
 * · **Procesos: se cuentan los que hay, no los que no hay.** `residualProcesses`
 *   era la lista de unidades cuya transición lanzó: no había procesos de SO en
 *   ninguna parte, así que nada podía quedar huérfano. Aquí se instrumenta
 *   `child_process.*`, se recogen los PID reales creados y se comprueba que
 *   ninguno sigue vivo.
 * · **Determinismo sin trucos.** Se comparan los árboles COMPLETOS byte a byte,
 *   sin borrar ningún campo. El reloj y el `leaseId` se INYECTAN por CLI; no
 *   hay reloj congelado en producción. Y hay control: una corrida con otro
 *   reloj tiene que DIFERIR, o la comparación no demostraría nada.
 * · **Nada se salta en silencio.** El chequeo de tipestate exige el fichero.
 * · **Cero escrituras fuera del checkout temporal.** No se instala nada en el
 *   árbol del hub.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { OFFLINE_LOG_ENV } from "../lib/offline/index.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const kitRoot = path.resolve(here, "..");
const hubRoot = path.resolve(kitRoot, "../..");
let failed = 0;

/** Reloj y semilla de lease inyectados para la corrida reproducible. */
const DET_NOW = "2026-08-02T00:03:00.000Z";
const DET_SEED = "consumidor110";
/** Control de falsabilidad: otro reloj tiene que dar OTROS bytes. */
const CONTROL_NOW = "2026-09-15T12:34:56.000Z";

const SIBLING_PATTERNS = [
  /C:[\\/]S[\\/]/i,
  /C:[\\/]S_LAB[\\/]/i,
  /[\\/]zeus[\\/]/i,
  /[\\/]v-sdk[\\/]/i,
  /[\\/]e-sdk[\\/]/i,
  /[\\/]o-sdk[\\/]/i,
  /[\\/]g-sdk[\\/]/i,
  /\.\.[\\/]zeus/i,
  /\.\.[\\/]v-sdk/i,
  /\.\.[\\/]scriptorium-wp-/i,
];

function ok(msg) {
  console.log(`test-110-consumidor-limpio: PASS — ${msg}`);
}
function fail(msg) {
  console.error(`test-110-consumidor-limpio: FAIL — ${msg}`);
  failed += 1;
}

function listFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    if (name === "node_modules" || name === ".git") continue;
    const abs = path.join(dir, name);
    const st = fs.statSync(abs);
    if (st.isDirectory()) listFiles(abs, acc);
    else acc.push(abs);
  }
  return acc;
}

const relPosix = (from, to) => path.relative(from, to).split(path.sep).join("/");

/** Copia el kit a un checkout temporal (sin node_modules ni .runs). */
function materializeTempCheckout() {
  const dst = fs.mkdtempSync(path.join(os.tmpdir(), "hm-110-consumer-"));
  for (const name of [
    "ci",
    "ciudad",
    "fixtures",
    "lib",
    "ontology",
    "reference",
    "scenarios",
    "schemas",
    "scripts",
    "units",
    "package.json",
    "package-lock.json",
    ".npmrc",
    ".gitignore",
    "README.md",
  ]) {
    const src = path.join(kitRoot, name);
    if (!fs.existsSync(src)) continue;
    fs.cpSync(src, path.join(dst, name), { recursive: true });
  }
  return dst;
}

function scanSiblingHits(root) {
  const hits = [];
  for (const abs of listFiles(root)) {
    const rel = relPosix(root, abs);
    let text;
    try {
      text = fs.readFileSync(abs, "utf8");
    } catch {
      continue;
    }
    for (const re of SIBLING_PATTERNS) {
      if (re.test(text) || re.test(rel)) hits.push(`${rel} ~ ${re}`);
    }
  }
  return hits;
}

/** Snapshot BYTE A BYTE del árbol completo. Cero campos excluidos. */
function snapshotBytes(dir) {
  const out = {};
  for (const abs of listFiles(dir)) {
    out[relPosix(dir, abs)] = fs.readFileSync(abs).toString("base64");
  }
  return out;
}

function snapshotsEqual(a, b) {
  const ka = Object.keys(a).sort();
  const kb = Object.keys(b).sort();
  if (ka.join("\0") !== kb.join("\0")) {
    const soloA = ka.filter((k) => !(k in b));
    const soloB = kb.filter((k) => !(k in a));
    return { ok: false, reason: `claves divergen (+${soloA.length}/-${soloB.length})` };
  }
  const distintos = ka.filter((k) => a[k] !== b[k]);
  if (distintos.length > 0) {
    return {
      ok: false,
      reason: `${distintos.length}/${ka.length} ficheros divergen: ${distintos.slice(0, 3).join(", ")}`,
      distintos: distintos.length,
      total: ka.length,
    };
  }
  return { ok: true, total: ka.length };
}

// ── fase offline: instrumentación que viaja a los hijos ───────────────────

/**
 * Env que instala la guardia BLOQUEANTE en todo descendiente Node y hace que
 * cada uno deje su parte en `logDir`.
 * @param {string} consumerRoot
 * @param {string} logDir
 */
function offlineEnv(consumerRoot, logDir) {
  const preload = pathToFileURL(
    path.join(consumerRoot, "lib/offline/preload.mjs"),
  ).href;
  const prev = process.env.NODE_OPTIONS ? `${process.env.NODE_OPTIONS} ` : "";
  return {
    ...process.env,
    NODE_OPTIONS: `${prev}--import ${preload}`,
    [OFFLINE_LOG_ENV]: logDir,
  };
}

/** Lee todos los partes de los procesos de la fase offline. */
function readOfflineParts(logDir) {
  if (!fs.existsSync(logDir)) return [];
  return fs
    .readdirSync(logDir)
    .filter((n) => n.endsWith(".json"))
    .map((n) => JSON.parse(fs.readFileSync(path.join(logDir, n), "utf8")));
}

/** @param {number} pid */
function sigueVivo(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    if (e?.code === "ESRCH") return false;
    // EPERM u otro: no se puede afirmar que esté muerto → se dice.
    return `indeterminado(${e?.code})`;
  }
}

/**
 * Barrido de huérfanos POR EL SISTEMA OPERATIVO, no por lo que el arnés
 * recuerde haber lanzado.
 *
 * Por qué hace falta: el cruce censo↔partes demuestra `partes ⊆ censo`, nunca
 * lo contrario y nunca el universo. Un proceso creado por una vía que la
 * instrumentación no intercepta —`import { spawn }`— y lanzado sin el env
 * offline no deja parte, no entra en el censo, y por tanto no entra en el
 * denominador: el arnés imprimía «0 vivos al cierre» con huérfanos vivos.
 * Comprobado inyectando exactamente ese proceso (G10).
 *
 * Esto lo acota desde fuera: se pregunta al SO por procesos VIVOS cuyo padre
 * sea alguno de los PIDs que sí conocemos. El huérfano de G10 cuelga del
 * proceso de ceremonia, que está en el censo, así que aparece aunque su
 * creación fuera invisible.
 *
 * LÍMITES, declarados: sólo Windows; sólo alcanza a hijos directos de PIDs
 * conocidos (un nieto de un proceso invisible sigue fuera); y los PID se
 * reciclan, así que se contrasta la fecha de creación contra el inicio de la
 * corrida para no acusar a un proceso ajeno que heredó el número.
 *
 * @param {Set<number>} censoPids
 * @param {Date} desde
 */
function barrerHuerfanosDelSO(censoPids, desde) {
  if (process.platform !== "win32") {
    return { soportado: false, causa: "plataforma", motivo: `no implementado en ${process.platform}` };
  }
  const padres = [...censoPids, process.pid];
  const filtro = padres.map((pid) => `ParentProcessId=${pid}`).join(" or ");
  // La fecha se pide YA en ISO. PowerShell 5.1 serializa `CreationDate` como
  // `/Date(1785689628467)/`, que `new Date()` no sabe leer: devolvia
  // `Invalid Date`, la comparacion daba NaN y el descarte por fecha NO
  // descartaba NUNCA. Era codigo muerto que ademas prometia una cota que no
  // existia. Se pide ISO y, por si acaso, abajo se sabe leer el formato viejo.
  const r = spawnSync(
    "powershell",
    [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      `Get-CimInstance Win32_Process -Filter "${filtro}" | ` +
        "Select-Object ProcessId,ParentProcessId,Name,@{n='CreationIso';" +
        "e={$_.CreationDate.ToUniversalTime().ToString('o')}} | ConvertTo-Json -Compress",
    ],
    { encoding: "utf8" },
  );
  if (r.status !== 0) {
    return {
      soportado: false,
      causa: "instrumento",
      motivo: `consulta al SO fallo: ${(r.stderr || "").slice(0, 160)}`,
    };
  }
  let filas;
  try {
    const bruto = (r.stdout || "").trim();
    if (!bruto) filas = [];
    else {
      const j = JSON.parse(bruto);
      filas = Array.isArray(j) ? j : [j];
    }
  } catch (e) {
    return { soportado: false, causa: "instrumento", motivo: `respuesta del SO ilegible: ${e.message}` };
  }

  /** ISO primero; `/Date(ms)/` como respaldo. null = no se pudo fechar. */
  function nacimiento(f) {
    const v = f.CreationIso ?? f.CreationDate;
    if (typeof v !== "string" || v === "") return null;
    const ms = /^\/Date\((\d+)\)\/$/.exec(v);
    if (ms) return new Date(Number(ms[1]));
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const propio = r.pid;
  const candidatos = filas.filter(
    (f) => f.ProcessId !== propio && f.ParentProcessId !== propio && f.ProcessId !== process.pid,
  );
  // Sin fecha no se acusa a nadie, pero tampoco se calla: si el instrumento no
  // sabe fechar, es un fallo del instrumento, no un huerfano.
  const sinFecha = candidatos.filter((f) => nacimiento(f) === null);
  const vivos = candidatos.filter((f) => {
    const nacido = nacimiento(f);
    return nacido !== null && nacido >= desde;
  });
  const descartadosPorFecha = candidatos.length - vivos.length - sinFecha.length;
  return { soportado: true, vivos, sinFecha, descartadosPorFecha, candidatos: candidatos.length };
}

// ── corridas ──────────────────────────────────────────────────────────────

/**
 * Ceremonia como CONSUMIDOR: proceso hijo, dentro del checkout temporal,
 * usando su propio `scripts/ceremonia.mjs` y su propio `lib/`.
 */
function runCeremoniaConsumidor(consumerRoot, env, { runId, now, seed = DET_SEED }) {
  return spawnSync(
    process.execPath,
    [
      path.join(consumerRoot, "scripts/ceremonia.mjs"),
      "--run",
      runId,
      "--force-new",
      "--now",
      now,
      "--lease-seed",
      seed,
    ],
    { cwd: consumerRoot, encoding: "utf8", env },
  );
}

/**
 * ¿Muerde la guardia? Un sondeo que intenta salir de verdad, con su propio
 * directorio de partes para no contaminar la medida de la corrida.
 *
 * Sin esto, «cero salidas no-loopback» podría estar verde simplemente porque
 * nadie lo intentó nunca — que es justo el vicio que se está corrigiendo.
 */
function probarQueLaGuardiaMuerde(consumerRoot) {
  const probeDir = fs.mkdtempSync(path.join(os.tmpdir(), "hm-110-probe-"));
  const probePath = path.join(probeDir, "sonda-red.mjs");
  fs.writeFileSync(
    probePath,
    [
      "import net from 'node:net';",
      "const out = { loopback: null, externo: null };",
      "try { const s = net.connect({ host: '127.0.0.1', port: 9 }); s.destroy(); out.loopback = 'permitido'; }",
      "catch (e) { out.loopback = `BLOQUEADO:${e.name}`; }",
      "try { net.connect({ host: 'example.com', port: 443 }); out.externo = 'PERMITIDO'; }",
      "catch (e) { out.externo = `bloqueado:${e.name}`; }",
      "console.log(JSON.stringify(out));",
    ].join("\n"),
  );
  const r = spawnSync(process.execPath, [probePath], {
    cwd: consumerRoot,
    encoding: "utf8",
    env: offlineEnv(consumerRoot, probeDir),
  });
  let veredicto = null;
  try {
    veredicto = JSON.parse((r.stdout || "").trim().split("\n").pop());
  } catch {
    /* se reporta como sonda ilegible */
  }
  const partes = readOfflineParts(probeDir);
  fs.rmSync(probeDir, { recursive: true, force: true });
  // El status REAL de la sonda, no un 0 inventado: si se autoadjudicara el
  // código de salida, «con código de salida recogido» sería una frase vacía.
  return { veredicto, partes, pid: r.pid ?? null, status: r.status ?? null };
}

function main() {
  const arranque = new Date();
  const consumerRoot = materializeTempCheckout();
  const logDir = fs.mkdtempSync(path.join(os.tmpdir(), "hm-110-offlinelog-"));
  /** @type {Array<{ que: string, pid: number|null, status: number|null }>} */
  const misHijos = [];

  const registrar = (que, r) =>
    misHijos.push({ que, pid: r?.pid ?? null, status: r?.status ?? null });

  try {
    // ── 1 · SEED: npm ci en el checkout temporal ────────────────────────────
    // Declarado: esto es la semilla, y la semilla SÍ puede usar red. Lo que la
    // CA exige offline es todo lo que viene después.
    const npmCi = spawnSync("npm", ["ci", "--no-audit", "--no-fund"], {
      cwd: consumerRoot,
      encoding: "utf8",
      shell: true,
      env: { ...process.env },
    });
    registrar("npm ci (seed)", npmCi);
    if (npmCi.status !== 0) {
      fail(`npm ci: ${(npmCi.stderr || npmCi.stdout || "").slice(0, 400)}`);
      throw new Error("sin seed no hay consumidor");
    }
    if (!fs.existsSync(path.join(consumerRoot, "node_modules"))) {
      fail("npm ci terminó en 0 pero no dejó node_modules");
    } else {
      ok("npm ci en checkout temporal (fase seed, red permitida y declarada)");
    }

    const env = offlineEnv(consumerRoot, logDir);

    // ── 2 · generación sin sibling paths (ya offline) ───────────────────────
    const runId = `consumer-110-${process.pid}`;
    const gen = spawnSync(
      process.execPath,
      [
        path.join(consumerRoot, "scripts/generar.mjs"),
        "--scenario",
        "barrio-lore",
        "--run",
        runId,
        "--sin-install",
        "--force-new",
      ],
      { cwd: consumerRoot, encoding: "utf8", env },
    );
    registrar("generar.mjs", gen);
    if (gen.status !== 0) {
      fail(`generar: ${(gen.stderr || gen.stdout || "").slice(0, 400)}`);
    } else {
      const hits = scanSiblingHits(path.join(consumerRoot, ".runs", runId));
      if (hits.length > 0) {
        fail(`sibling paths en generación: ${hits.slice(0, 3).join(" | ")}`);
      } else {
        ok("generación sin sibling paths");
      }
    }

    // ── 3 · rerun determinista: dos corridas, MISMO reloj inyectado ─────────
    const detRunId = `${runId}-det`;
    const detRoot = path.join(consumerRoot, ".runs", detRunId);

    const a = runCeremoniaConsumidor(consumerRoot, env, { runId: detRunId, now: DET_NOW });
    registrar("ceremonia A", a);
    if (a.status !== 0) {
      fail(`ceremonia A: ${(a.stderr || a.stdout || "").slice(0, 400)}`);
    }
    const snapA = snapshotBytes(detRoot);
    fs.rmSync(detRoot, { recursive: true, force: true });

    const b = runCeremoniaConsumidor(consumerRoot, env, { runId: detRunId, now: DET_NOW });
    registrar("ceremonia B", b);
    if (b.status !== 0) {
      fail(`ceremonia B: ${(b.stderr || b.stdout || "").slice(0, 400)}`);
    }
    const snapB = snapshotBytes(detRoot);

    const cmp = snapshotsEqual(snapA, snapB);
    if (Object.keys(snapA).length === 0) {
      fail("la corrida A no dejó árbol que comparar");
    } else if (!cmp.ok) {
      fail(`rerun no determinista: ${cmp.reason}`);
    } else {
      ok(
        `rerun byte a byte sobre el árbol COMPLETO: ${cmp.total}/${cmp.total} ficheros idénticos, cero campos excluidos`,
      );
    }

    // ── 3b · control: otro reloj tiene que DIFERIR ──────────────────────────
    // Sin esto, una comparación que siempre da igual (p. ej. porque se borran
    // los campos que cambian) pasaría por demostración de reproducibilidad.
    fs.rmSync(detRoot, { recursive: true, force: true });
    const c = runCeremoniaConsumidor(consumerRoot, env, {
      runId: detRunId,
      now: CONTROL_NOW,
      seed: `${DET_SEED}-control`,
    });
    registrar("ceremonia control", c);
    if (c.status !== 0) {
      fail(`ceremonia control: ${(c.stderr || c.stdout || "").slice(0, 400)}`);
    }
    const snapC = snapshotBytes(detRoot);
    const cmpC = snapshotsEqual(snapA, snapC);
    if (cmpC.ok) {
      fail(
        "control de falsabilidad: con OTRO reloj y otra semilla los bytes salen iguales — la comparación no demuestra nada",
      );
    } else {
      // Y tiene que alcanzar al PACK DE EVIDENCIA, no sólo al podstore: si sólo
      // divergiera `.podstore/`, la comparación no cubriría lo que se publica.
      const tocaEvidencia = Object.keys(snapA).some(
        (k) => k.startsWith("evidence/") && snapA[k] !== snapC[k],
      );
      if (!tocaEvidencia) {
        fail(
          "control de falsabilidad: la divergencia no alcanza a evidence/ — la comparación no cubre el pack publicado",
        );
      } else {
        ok(`control de falsabilidad: otro reloj+semilla → otros bytes, también en evidence/ (${cmpC.reason})`);
      }
    }

    // ── 4 · offline: cero salidas no-loopback, medidas en cada proceso ──────
    const partes = readOfflineParts(logDir);
    const procesosOffline = 4; // generar + ceremonia A + B + control (mínimo)
    if (partes.length < procesosOffline) {
      fail(
        `sólo ${partes.length} procesos dejaron parte offline; se esperaban al menos ${procesosOffline}: la guardia no viajó a los hijos`,
      );
    } else {
      // «padre e hijos» era falso: el proceso padre NO instala la guardia.
      // Los partes son de los hijos que se lanzan con el env offline y de sus
      // propios nietos.
      ok(
        `guardia offline instalada en ${partes.length} procesos descendientes (el padre no la instala)`,
      );
    }
    const violaciones = partes.flatMap((p) =>
      (p.violations ?? []).map((v) => `${path.basename(String(p.argv?.[0] ?? p.pid))}: ${v.api}→${v.host}`),
    );
    if (violaciones.length > 0) {
      fail(`salidas no-loopback: ${violaciones.slice(0, 5).join(" | ")}`);
    } else {
      ok("cero salidas no-loopback en la fase offline (bloqueante, no anotador)");
    }

    // ── 4b · ¿muerde la guardia? ───────────────────────────────────────────
    const sonda = probarQueLaGuardiaMuerde(consumerRoot);
    registrar("sonda-red", { pid: sonda.pid, status: sonda.status });
    const violSonda = sonda.partes.flatMap((p) => p.violations ?? []);
    if (!sonda.veredicto) {
      fail("la sonda de red no dio veredicto legible: la guardia queda sin comprobar");
    } else if (sonda.veredicto.externo === "PERMITIDO") {
      fail("la guardia NO bloquea: la sonda salió a example.com:443 sin que nadie la parara");
    } else if (violSonda.length === 0) {
      fail("la guardia bloqueó pero no dejó constancia: no hay violación registrada");
    } else if (sonda.veredicto.loopback !== "permitido") {
      fail(`la guardia bloquea 127.0.0.1, que es loopback legítimo: ${sonda.veredicto.loopback}`);
    } else {
      ok(
        `la guardia muerde: externo ${sonda.veredicto.externo} y registrado (${violSonda[0].api}→${violSonda[0].host}); loopback intacto`,
      );
    }

    // ── 5 · puertos: ningún proceso escuchó ────────────────────────────────
    const escuchas = partes.flatMap((p) =>
      (p.listens ?? []).map((l) => `${p.pid}:${l.host ?? "*"}:${l.port}`),
    );
    if (escuchas.length > 0) {
      fail(`puertos abiertos durante la corrida: ${escuchas.join(", ")}`);
    } else {
      ok(`cero puertos abiertos (listen() instrumentado en ${partes.length} procesos)`);
    }

    // ── 7 · shutdown: tipestate EXIGIDO, sin locks ni pids ──────────────────
    const tipPath = path.join(detRoot, "evidence/pack/tipestate.json");
    if (!fs.existsSync(tipPath)) {
      // Antes esto era `if (existsSync(...))`: si el fichero dejaba de
      // escribirse, el chequeo no corría y el test decía PASS.
      fail(`no hay tipestate que comprobar en ${relPosix(consumerRoot, tipPath)}`);
    } else {
      const tip = JSON.parse(fs.readFileSync(tipPath, "utf8"));
      const finals = tip.finals ?? {};
      if (Object.keys(finals).length === 0) {
        fail("tipestate.finals vacío: no hay cierre que comprobar");
      } else {
        const malos = Object.entries(finals).filter(
          ([, st]) => st !== "stopped" && st !== "failed" && st !== "declared",
        );
        if (malos.length > 0) fail(`finals sin cerrar: ${JSON.stringify(malos)}`);
        else ok(`shutdown: ${Object.keys(finals).length} unidades en estado final`);
      }
    }

    const locks = listFiles(detRoot).filter((p) => /\.(lock|pid)$/i.test(p));
    if (locks.length > 0) {
      fail(`locks/pids huérfanos: ${locks.map((p) => relPosix(detRoot, p)).join(",")}`);
    } else {
      ok("cero locks/pids huérfanos en el árbol de la corrida");
    }

    // ── 8 · skills:ceguera desde la raíz del hub ────────────────────────────
    // Fase aparte y declarada: no es parte de la corrida offline, y NO se
    // instala nada aquí. Antes se hacía `npm ci` en el árbol real del hub
    // después de declarar la corrida offline.
    if (!fs.existsSync(path.join(hubRoot, "node_modules/@alephscript"))) {
      fail(
        "skills:ceguera no se puede comprobar: faltan deps del hub y este test NO instala nada fuera de su checkout temporal (corre `npm ci` en el hub antes)",
      );
    } else {
      const ceguera = spawnSync("npm", ["run", "skills:ceguera"], {
        cwd: hubRoot,
        encoding: "utf8",
        shell: true,
        env: { ...process.env },
      });
      registrar("skills:ceguera", ceguera);
      if (ceguera.status !== 0) {
        fail(`skills:ceguera: ${(ceguera.stderr || ceguera.stdout || "").slice(0, 400)}`);
      } else {
        ok("npm run skills:ceguera desde la raíz del hub");
      }
    }

    // ── 9 · censo de procesos, CRUZADO ─────────────────────────────────────
    // Va el ÚLTIMO a propósito: antes corría ANTES que `skills:ceguera`, así
    // que ese proceso se registraba después del recuento y nadie lo miraba.
    //
    // Y sobre todo: se CRUZA. Un censo por sí solo cuenta a los que responden,
    // y los que no responden son justo los que no se supieron interceptar. El
    // dato que lo refuta ya estaba en esta misma función: cada proceso Node
    // bajo la guardia deja su parte con su PID. Si un PID dejó parte y no está
    // en el censo, el censo está incompleto — y eso es FAIL, no silencio.
    const hijosDeHijos = partes.flatMap((p) =>
      (p.children ?? []).map((c) => ({
        que: `${p.pid}→${c.api} ${path.basename(String(c.command))}`,
        pid: c.pid,
      })),
    );
    const todos = [...misHijos, ...hijosDeHijos].filter((c) => c.pid != null);
    // PIDs DISTINTOS, no registros: `cp.exec` deja dos entradas (`exec` y
    // `execFile`) para un solo proceso, así que contar registros infla la
    // cifra. Hoy los diez son distintos; la cifra no debe poder mentir mañana.
    const censoPids = new Set(todos.map((c) => c.pid));
    const partesPids = partes.map((p) => p.pid).filter((pid) => pid != null);
    const invisibles = partesPids.filter((pid) => !censoPids.has(pid));

    // Dos de las seis vías visibles por namespace son INCONTABLES por
    // construcción: `execSync` y `execFileSync` no devuelven pid en Node, así
    // que se registran con `pid: null` y el censo no los puede cruzar. Si las
    // hay, se dice — porque si no, el fallo de arriba le echaría la culpa a
    // «una vía sin interceptar» cuando la causa es que la API no da el dato.
    const incontables = hijosDeHijos.filter((c) => c.pid == null);
    const notaIncontables = incontables.length
      ? ` · ${incontables.length} procesos registrados SIN pid (execSync/execFileSync no lo devuelven):` +
        ` incontables por construcción, no por ceguera`
      : "";

    if (censoPids.size === 0) {
      fail("no se registró ni un proceso: la instrumentación de procesos no midió nada");
    } else if (invisibles.length > 0) {
      fail(
        `censo incompleto: ${invisibles.length} de ${partesPids.length} procesos dejaron parte ` +
          `offline y NO están en el censo (pids ${invisibles.join(",")})${notaIncontables}`,
      );
    } else {
      ok(
        `censo cruzado: ${partesPids.length}/${partesPids.length} procesos que dejaron parte están ` +
          `censados (censo ${censoPids.size} pids distintos = ${misHijos.length} del test + ` +
          `${hijosDeHijos.length} nietos)${notaIncontables}`,
      );
    }

    const vivos = todos.filter((c) => sigueVivo(c.pid) === true);
    const dudosos = todos.filter((c) => typeof sigueVivo(c.pid) === "string");
    const sinCodigo = misHijos.filter((c) => c.status == null);
    if (vivos.length > 0) {
      fail(`procesos huérfanos vivos: ${vivos.map((c) => `${c.que}#${c.pid}`).join(", ")}`);
    } else if (sinCodigo.length > 0) {
      fail(`procesos sin código de salida recogido: ${sinCodigo.map((c) => c.que).join(", ")}`);
    } else if (censoPids.size > 0) {
      ok(
        `${censoPids.size} pids distintos creados, 0 vivos al cierre, ${misHijos.length} con código de salida recogido${dudosos.length ? ` (${dudosos.length} indeterminados)` : ""}`,
      );
    }

    // ── 10 · huérfanos, preguntando al SO ──────────────────────────────────
    // El censo sólo ve lo que la instrumentación intercepta. Esto ve lo que
    // hay. Sin este barrido, «shutdown sin procesos huérfanos» podía
    // imprimirse en verde con huérfanos vivos — demostrado, no supuesto.
    const barrido = barrerHuerfanosDelSO(censoPids, arranque);
    if (!barrido.soportado && barrido.causa === "plataforma") {
      // Límite DECLARADO, no fallo: se dice que no se ha mirado y no se calla.
      console.log(
        `test-110-consumidor-limpio: NO CUBIERTO (límite de plataforma) — barrido de huérfanos del SO: ${barrido.motivo}`,
      );
    } else if (!barrido.soportado) {
      // El instrumento se rompió. Antes esto salía por `console.log` y la suite
      // seguía verde: el barrido se podía neutralizar sin enrojecer nada.
      fail(`el barrido de huérfanos del SO no pudo ejecutarse: ${barrido.motivo}`);
    } else if (barrido.vivos.length > 0 || barrido.sinFecha.length > 0) {
      // Los dos hallazgos son independientes y se reportan LOS DOS. Encadenados
      // con `else if`, una corrida con huérfanos y con filas sin fechar sólo
      // enseñaba el fallo de fechado: seguía en rojo, pero callaba lo peor.
      if (barrido.vivos.length > 0) {
        fail(
          `procesos huérfanos VIVOS según el SO: ` +
            barrido.vivos
              .map((f) => `${f.Name}#${f.ProcessId}(padre ${f.ParentProcessId})`)
              .join(", "),
        );
      }
      if (barrido.sinFecha.length > 0) {
        // Sin fecha no se acusa a nadie —eso sería el falso positivo sin cota
        // que desactiva un guardián— pero tampoco se da por bueno.
        fail(
          `el barrido no pudo fechar ${barrido.sinFecha.length} de ${barrido.candidatos} procesos: ` +
            `sin fecha no se puede distinguir un huérfano de un PID reciclado`,
        );
      }
    } else {
      ok(
        `barrido del SO: cero procesos vivos colgando de los ${censoPids.size + 1} pids conocidos ` +
          `(${barrido.candidatos} candidatos, ${barrido.descartadosPorFecha} descartados por ser anteriores al arranque)`,
      );
    }

  } catch (e) {
    fail(`corrida: ${e?.message ?? e}`);
  } finally {
    // La limpieza NO puede decidir el veredicto. Si un huérfano se quedó con
    // el `cwd` del checkout, `rmSync` lanza `EBUSY` y la excepción se comía la
    // línea `FAIL (n)`: el exit 1 lo ponía el accidente, no la aserción. Un
    // fallo de limpieza es un `fail()` más.
    //
    // CUIDADO CON LA LECTURA: un fallo de borrado es una señal **compatible**
    // con un huérfano vivo, NO equivalente a él. Cualquier proceso ajeno
    // —antivirus, indexador, vista previa— que agarre un fichero del checkout
    // lo produce igual, y el instante de máxima exposición es justo después de
    // que `npm ci` escriba miles de ficheros. Un guardián con falsos positivos
    // se desactiva solo, así que se reintenta.
    //
    // Los reintentos NO tapan al huérfano de verdad, y está medido: Node
    // reintenta el borrado de un FICHERO retenido (EPERM/EBUSY) pero NO el
    // `rmdir` de un directorio que otro proceso tiene como `cwd`, que es el
    // caso del huérfano. Medido con lock transitorio de ~1200 ms:
    //   por defecto        -> EBUSY(EPERM) en    2 ms   (falso positivo)
    //   maxRetries:5/100ms -> BORRADO      en 1049 ms   (falso positivo evitado)
    // y con un proceso vivo reteniendo el `cwd`:
    //   maxRetries:10/100ms -> EBUSY en 0 ms            (huérfano sigue en rojo)
    if (!process.env.KEEP_HM_RUNS) {
      for (const [etiqueta, dir] of [
        ["checkout temporal", consumerRoot],
        ["directorio de partes", logDir],
      ]) {
        try {
          fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
        } catch (e) {
          fail(
            `no se pudo limpiar el ${etiqueta} tras reintentar: ${e.code ?? ""} ${e.message}` +
              ` — compatible con un huérfano vivo, pero también con un lock ajeno`,
          );
        }
      }
    }
  }

  if (failed > 0) {
    console.error(`test-110-consumidor-limpio: FAIL (${failed})`);
    process.exit(1);
  }
  console.log("test-110-consumidor-limpio: PASS");
  process.exit(0);
}

main();
