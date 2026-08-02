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
    const censoPids = new Set(todos.map((c) => c.pid));
    const partesPids = partes.map((p) => p.pid).filter((pid) => pid != null);
    const invisibles = partesPids.filter((pid) => !censoPids.has(pid));

    if (todos.length === 0) {
      fail("no se registró ni un proceso: la instrumentación de procesos no midió nada");
    } else if (invisibles.length > 0) {
      fail(
        `censo incompleto: ${invisibles.length} de ${partesPids.length} procesos dejaron parte ` +
          `offline y NO están en el censo (pids ${invisibles.join(",")}) — existieron y nadie los contó`,
      );
    } else {
      ok(
        `censo cruzado: ${partesPids.length}/${partesPids.length} procesos que dejaron parte están ` +
          `censados (censo ${todos.length} = ${misHijos.length} del test + ${hijosDeHijos.length} nietos)`,
      );
    }

    const vivos = todos.filter((c) => sigueVivo(c.pid) === true);
    const dudosos = todos.filter((c) => typeof sigueVivo(c.pid) === "string");
    const sinCodigo = misHijos.filter((c) => c.status == null);
    if (vivos.length > 0) {
      fail(`procesos huérfanos vivos: ${vivos.map((c) => `${c.que}#${c.pid}`).join(", ")}`);
    } else if (sinCodigo.length > 0) {
      fail(`procesos sin código de salida recogido: ${sinCodigo.map((c) => c.que).join(", ")}`);
    } else if (todos.length > 0) {
      ok(
        `${todos.length} procesos de SO creados, 0 vivos al cierre, ${misHijos.length} con código de salida recogido${dudosos.length ? ` (${dudosos.length} indeterminados)` : ""}`,
      );
    }

  } catch (e) {
    fail(`corrida: ${e?.message ?? e}`);
  } finally {
    if (!process.env.KEEP_HM_RUNS) {
      fs.rmSync(consumerRoot, { recursive: true, force: true });
      fs.rmSync(logDir, { recursive: true, force: true });
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
