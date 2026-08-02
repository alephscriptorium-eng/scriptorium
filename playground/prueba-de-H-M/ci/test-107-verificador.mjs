#!/usr/bin/env node
/**
 * WP-HUB-107 · CA verificador externo (solo evidence root).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { runCeremonia } from "../lib/ceremonia/index.mjs";
import {
  verificarEvidencia,
  VerifierError,
  FRONTIER,
} from "../lib/verificador/verificar.mjs";
import { digestObject } from "../lib/cadena/hash.mjs";
import {
  SEALED_PACK_DOCS,
  computePackDigest,
} from "../lib/ceremonia/evidence-pack.mjs";
import { computeCoverage, renderReportMd } from "../lib/ceremonia/evidence.mjs";
import {
  REQUIRED_SHUTDOWN_VERBS,
  EXPECTED_ACTIVITY_PAIRS,
  CEREMONY_STEPS,
} from "../lib/ceremonia/constants.mjs";
import { causalDigest } from "../lib/ceremonia/envelope.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const kitRoot = path.resolve(here, "..");
let failed = 0;

function ok(msg) {
  console.log(`test-107-verificador: PASS — ${msg}`);
}

function fail(msg) {
  console.error(`test-107-verificador: FAIL — ${msg}`);
  failed += 1;
}

function ensureDeps() {
  if (!fs.existsSync(path.join(kitRoot, "node_modules/ajv"))) {
    const npm = spawnSync("npm", ["install", "--no-audit", "--no-fund"], {
      cwd: kitRoot,
      stdio: "inherit",
      shell: true,
    });
    if (npm.status !== 0) fail("npm install falló");
  }
}

/** Copia recursively — Node 16+ cpSync. */
function copyDir(src, dst) {
  fs.cpSync(src, dst, { recursive: true });
}

function writeJson(p, obj) {
  fs.writeFileSync(p, `${JSON.stringify(obj, null, 2)}\n`);
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

/** Slug ASCII estable para rutas Windows (evita tildes en el path). */
const FRONTIER_SLUG = Object.freeze({
  [FRONTIER.HASH_ROTO]: "hash-roto",
  [FRONTIER.ACL_EXPIRADA]: "acl-expirada",
  [FRONTIER.TRANSICION_ILEGAL]: "transicion-ilegal",
  [FRONTIER.CORTO_SIN_TRAZA_ONFALO]: "corto-sin-traza-onfalo",
  [FRONTIER.VECTORMOCK_SIN_DECLARAR]: "vectormock-sin-declarar",
  [FRONTIER.PIEZA_AUSENTE]: "pieza-ausente",
  [FRONTIER.SHUTDOWN_INCOMPLETO]: "shutdown-incompleto",
  [FRONTIER.SHUTDOWN_AUTOCERTIFICADO]: "shutdown-autocertificado",
  [FRONTIER.CADENA_CAUSAL_DIVERGE]: "cadena-causal-diverge",
  [FRONTIER.SELLO_PACK_ROTO]: "sello-pack-roto",
  [FRONTIER.COBERTURA_AUTOCERTIFICADA]: "cobertura-autocertificada",
  [FRONTIER.PAREJA_INESPERADA]: "pareja-inesperada",
  [FRONTIER.REPORTE_INVALIDO]: "reporte-invalido",
  [FRONTIER.PROVENANCE_ROTA]: "provenance-rota",
  [FRONTIER.COBERTURA_INSUFICIENTE]: "cobertura-insuficiente",
  [FRONTIER.WIRE_INVALIDO]: "wire-invalido",
  [FRONTIER.VIEW_JSONLD_INVALIDO]: "view-jsonld-invalido",
});

const ACTOR_H_IRI = "urn:scriptorium:hm:actor:anfitrion-h";
const ACTOR_M_IRI = "urn:scriptorium:hm:actor:maestro-m";

/**
 * Atacante «reparador»: rehace matriz, hashes, cobertura y sello del pack para
 * que el negativo dependa del guardián PROFUNDO y no del primero que salta.
 * Sin esto los negativos se apuntarían un tanto que no es suyo.
 * @param {string} dir
 */
function repairSuperficial(dir) {
  const acts = path.join(dir, "activities");

  // ── (0) RE-ANCLA TOPOLÓGICO de la cadena de upstream ────────────────────
  // Este reparador hacía cuatro de cinco: no rehacía `provenance.upstream`,
  // así que varios negativos habrían enrojecido por «provenance rota» antes
  // de llegar al guardián que decían probar — el mismo tanto ajeno que este
  // fichero intenta evitar. Se reconstruye el enganche declarado y se resella
  // en orden de dependencia (el causalDigest depende del upstream).
  {
    const entradas = fs
      .readdirSync(acts)
      .map((d) => ({ d, w: readJson(path.join(acts, d, "wire.json")) }));
    const porClave = new Map();
    for (const e of entradas) {
      const base = String(e.w.id).replace(/:(H|M)$/, "");
      const m = /:step:(\d+):([^:]+)(:sec)?$/.exec(base);
      if (!m) continue;
      const clave = `${Number(m[1])}|${m[2]}|${m[3] ? "sec" : "pri"}`;
      if (!porClave.has(clave)) porClave.set(clave, []);
      porClave.get(clave).push(e);
    }
    const causalPorClave = new Map();
    const orden = [...EXPECTED_ACTIVITY_PAIRS].sort(
      (a, b) => a.step - b.step || (a.secondary ? 1 : -1),
    );
    for (const p of orden) {
      const clave = `${p.step}|${p.verb}|${p.secondary ? "sec" : "pri"}`;
      const grupo = porClave.get(clave);
      if (!grupo) continue;
      const claveP = (n) => `${n}|${CEREMONY_STEPS[n - 1].verb}|pri`;
      const ups = p.secondary
        ? [causalPorClave.get(claveP(p.step))].filter(Boolean)
        : CEREMONY_STEPS[p.step - 1].upstream
            .map((u) => causalPorClave.get(claveP(u)))
            .filter(Boolean);
      for (const e of grupo) {
        const { digest: _viejo, ...resto } = e.w;
        resto.provenance = { ...resto.provenance, upstream: [...ups] };
        const sellado = { ...resto, digest: digestObject(resto) };
        writeJson(path.join(acts, e.d, "wire.json"), sellado);
        const vp = path.join(acts, e.d, "view.jsonld");
        if (fs.existsSync(vp)) {
          const v = readJson(vp);
          v["@id"] = sellado.id;
          v["hm:verb"] = sellado.verb;
          v["hm:result"] = sellado.result;
          v["hm:digest"] = sellado.digest;
          v["prov:wasDerivedFrom"] = ups.map((u) => ({ "@id": u }));
          writeJson(vp, v);
        }
        e.w = sellado;
      }
      causalPorClave.set(clave, causalDigest(grupo[0].w));
    }
  }

  repairShallow(dir);
}

/**
 * Capa superficial del reparador: report/matriz/hashes/cobertura/md y sello.
 * Se expone aparte para que un negativo pueda romper la cadena DESPUÉS del
 * re-ancla topológico sin que éste se la vuelva a arreglar.
 * @param {string} dir
 */
function repairShallow(dir) {
  const acts = path.join(dir, "activities");
  const wires = fs
    .readdirSync(acts)
    .map((d) => readJson(path.join(acts, d, "wire.json")));
  const hashes = wires.map((w) => w.digest);
  const cov = computeCoverage(wires);
  const coverage = {
    verbsPercent: cov.verbsPercent,
    unitsPercent: cov.unitsPercent,
  };

  const report = readJson(path.join(dir, "report.json"));
  report.hashes = hashes;
  // `result` sale del wire, no de un "pass" escrito a mano: el reparador
  // dependía de que nadie mirase ese campo.
  report.matrix = wires.map((w) => ({
    verb: w.verb,
    actor: w.actor,
    object: w.object,
    result: w.result,
  }));
  report.coverage = coverage;
  writeJson(path.join(dir, "report.json"), report);
  // report.md es el render del JSON, no dos líneas con las palabras mágicas.
  fs.writeFileSync(path.join(dir, "report.md"), renderReportMd(report));

  const prov = readJson(path.join(dir, "pack/provenance.json"));
  prov.hashes = hashes;
  prov.coverage = coverage;
  prov.activityCount = wires.length;
  writeJson(path.join(dir, "pack/provenance.json"), prov);

  const docs = {};
  for (const { key, rel } of SEALED_PACK_DOCS) {
    docs[key] = readJson(path.join(dir, rel));
  }
  const man = readJson(path.join(dir, "pack/manifest.json"));
  man.digest = computePackDigest(docs, report.verdict);
  writeJson(path.join(dir, "pack/manifest.json"), man);
}

/** Fabrica una pareja bilateral H/M coherente consigo misma. */
function fabricatePair(acts, sample, sampleView, order, verb, tag, runId) {
  const base = `urn:scriptorium:hm:${runId}:step:${order}:${verb}`;
  for (const side of ["H", "M"]) {
    const env = {
      id: `${base}:${side}`,
      actor: side === "H" ? ACTOR_H_IRI : ACTOR_M_IRI,
      verb,
      object: `urn:${tag}:${order}`,
      target: sample.target ?? null,
      instrument: "portal",
      timestamp: sample.timestamp,
      result: "pass",
      provenance: { source: "ceremony:barrio-lore-v1", upstream: [] },
      context: { unitId: "portal", side, step: order },
    };
    const sealed = { ...env, digest: digestObject(env) };
    const d = path.join(
      acts,
      `${tag}-${order}-${verb.replace(/\./g, "_")}-${side}`,
    );
    fs.mkdirSync(d, { recursive: true });
    writeJson(path.join(d, "wire.json"), sealed);
    writeJson(path.join(d, "view.jsonld"), {
      ...sampleView,
      "@id": sealed.id,
      "hm:verb": verb,
      "hm:digest": sealed.digest,
      "prov:wasDerivedFrom": [],
    });
  }
}

/**
 * @param {string} frontier
 * @param {(isoRoot: string) => void} mutate
 * @param {string} isoBase
 */
function expectFrontier(frontier, mutate, isoBase) {
  const slug = FRONTIER_SLUG[frontier] ?? frontier.replace(/\s+/g, "-");
  const dir = path.join(isoBase, `neg-${slug}-${Date.now().toString(36)}`);
  copyDir(path.join(isoBase, "evidence-pass"), dir);
  mutate(dir);
  try {
    verificarEvidencia(dir);
    fail(`negativo "${frontier}" debió fallar`);
  } catch (e) {
    if (e instanceof VerifierError && e.frontier === frontier) {
      ok(`negativo «${frontier}»`);
    } else {
      fail(
        `negativo "${frontier}": got ${e?.frontier || e?.message || e} (espera ${frontier})`,
      );
    }
  }
  fs.rmSync(dir, { recursive: true, force: true });
}

function main() {
  ensureDeps();

  const runId = `test-107-${Date.now().toString(36)}`;
  let result;
  try {
    result = runCeremonia({ kitRoot, runId, forceNew: true });
  } catch (e) {
    fail(`ceremonia fixture: ${e.message || e}`);
    console.error(`test-107-verificador: FAIL (${failed})`);
    process.exit(1);
  }

  // Raíz aislada: SOLO evidence — sin hermanos H/M
  const isoBase = path.join(kitRoot, ".runs", `_iso-107-${runId}`);
  fs.mkdirSync(isoBase, { recursive: true });
  const isoEvidence = path.join(isoBase, "evidence-pass");
  copyDir(result.evidenceRoot, isoEvidence);

  // Prueba de aislamiento: no hay H/ ni M/ junto a la copia
  if (
    fs.existsSync(path.join(isoBase, "H")) ||
    fs.existsSync(path.join(isoBase, "M"))
  ) {
    fail("fixture aislada no debe tener H/M");
  } else {
    ok("fixture aislada sin dirs vivos H/M");
  }

  // ── 1. PASS sobre evidence root ─────────────────────────────────────────
  // Los checks se fijan POR NOMBRE, no por cardinalidad: `checks.length < 8`
  // dejaba borrar tres comprobaciones —incluida la cadena causal— y seguir
  // en verde. Cambiar esta lista obliga a cambiar el guardián a propósito.
  const REQUIRED_CHECKS = Object.freeze([
    "piezas pack presentes",
    "reporte",
    "wire + JSON-LD + hashes",
    "cadena causal H/M desde wires",
    "provenance",
    "cobertura",
    "ACL",
    "tipestate",
    "VectorMock declarado",
    "cortos→Onfalo",
    "shutdown",
    "sello del pack recomputado",
  ]);
  try {
    const v = verificarEvidencia(isoEvidence);
    if (!v.ok) {
      fail("verificador no devolvió ok");
    } else {
      const missing = REQUIRED_CHECKS.filter((c) => !v.checks.includes(c));
      const extra = v.checks.filter((c) => !REQUIRED_CHECKS.includes(c));
      // Registrar uno DOS VECES daba verde: faltaba comparar multiplicidad.
      const dup = v.checks.filter((c, i) => v.checks.indexOf(c) !== i);
      if (missing.length > 0) {
        fail(`checks ausentes por nombre: ${missing.join(" · ")}`);
      } else if (extra.length > 0) {
        fail(`checks no declarados en el guardián: ${extra.join(" · ")}`);
      } else if (dup.length > 0) {
        fail(`checks registrados por duplicado: ${dup.join(" · ")}`);
      } else if (v.checks.length !== REQUIRED_CHECKS.length) {
        fail(`checks=${v.checks.length} ≠ ${REQUIRED_CHECKS.length} declarados`);
      } else {
        ok(`verificador PASS — ${REQUIRED_CHECKS.length} checks fijados por nombre`);
      }
    }
  } catch (e) {
    fail(`verificador feliz: ${e.message || e}`);
  }

  // CLI
  const cli = spawnSync(
    process.execPath,
    [
      path.join(kitRoot, "scripts/verificar-evidencia.mjs"),
      "--evidence",
      isoEvidence,
    ],
    { cwd: kitRoot, encoding: "utf8" },
  );
  if (cli.status !== 0) {
    fail(`CLI verificar-evidencia: ${cli.stderr || cli.stdout}`);
  } else {
    ok("CLI scripts/verificar-evidencia.mjs");
  }

  // Pieza ausente
  expectFrontier(
    FRONTIER.PIEZA_AUSENTE,
    (dir) => {
      fs.rmSync(path.join(dir, "pack/manifest.json"), { force: true });
    },
    isoBase,
  );

  // Hash roto
  expectFrontier(
    FRONTIER.HASH_ROTO,
    (dir) => {
      const acts = path.join(dir, "activities");
      const first = fs.readdirSync(acts)[0];
      const wirePath = path.join(acts, first, "wire.json");
      const wire = readJson(wirePath);
      wire.digest = "sha256:" + "0".repeat(64);
      writeJson(wirePath, wire);
    },
    isoBase,
  );

  // ACL expirada
  expectFrontier(
    FRONTIER.ACL_EXPIRADA,
    (dir) => {
      const acl = readJson(path.join(dir, "pack/acl.json"));
      for (const entry of acl.entries) {
        if (!entry.acl) continue;
        for (const row of entry.acl) {
          row.expiresAt = "2020-01-01T00:00:00.000Z";
        }
      }
      writeJson(path.join(dir, "pack/acl.json"), acl);
    },
    isoBase,
  );

  // Transición ilegal
  expectFrontier(
    FRONTIER.TRANSICION_ILEGAL,
    (dir) => {
      const tip = readJson(path.join(dir, "pack/tipestate.json"));
      tip.transitions.push({
        unitId: "portal",
        from: "stopped",
        to: "running",
      });
      writeJson(path.join(dir, "pack/tipestate.json"), tip);
    },
    isoBase,
  );

  // Corto sin traza Onfalo
  expectFrontier(
    FRONTIER.CORTO_SIN_TRAZA_ONFALO,
    (dir) => {
      const cortos = readJson(path.join(dir, "pack/cortos.json"));
      if (cortos.cortos[0]) cortos.cortos[0].onfaloTrace = [];
      writeJson(path.join(dir, "pack/cortos.json"), cortos);
    },
    isoBase,
  );

  // VectorMock sin declarar
  expectFrontier(
    FRONTIER.VECTORMOCK_SIN_DECLARAR,
    (dir) => {
      const v = readJson(path.join(dir, "pack/vector-mock.json"));
      v.mock = false;
      v.declared = false;
      writeJson(path.join(dir, "pack/vector-mock.json"), v);
    },
    isoBase,
  );

  // Shutdown dopado: pack declara verbos presentes pero los wires no existen.
  // Ahora salta ANTES, y por nombre propio: borrar la evidencia de session.exit
  // rompe la biyección con CEREMONY_STEPS, no solo el recuento de shutdown.
  expectFrontier(
    FRONTIER.PAREJA_INESPERADA,
    (dir) => {
      const acts = path.join(dir, "activities");
      for (const name of fs.readdirSync(acts)) {
        const wirePath = path.join(acts, name, "wire.json");
        const wire = readJson(wirePath);
        if (wire.verb === "session.exit") {
          fs.rmSync(path.join(acts, name), { recursive: true, force: true });
        }
      }
      const shut = readJson(path.join(dir, "pack/shutdown.json"));
      shut.verbsPresent = [...REQUIRED_SHUTDOWN_VERBS];
      writeJson(path.join(dir, "pack/shutdown.json"), shut);
      repairSuperficial(dir);
    },
    isoBase,
  );

  // Shutdown incompleto propiamente dicho: el pack se declara sucio.
  expectFrontier(
    FRONTIER.SHUTDOWN_INCOMPLETO,
    (dir) => {
      const shut = readJson(path.join(dir, "pack/shutdown.json"));
      shut.clean = false;
      shut.residualProcesses = ["portal:proceso-vivo"];
      writeJson(path.join(dir, "pack/shutdown.json"), shut);
      repairSuperficial(dir);
    },
    isoBase,
  );

  // Autocertificación: requiredVerbs del pack ≠ raíz de confianza
  expectFrontier(
    FRONTIER.SHUTDOWN_AUTOCERTIFICADO,
    (dir) => {
      const shut = readJson(path.join(dir, "pack/shutdown.json"));
      shut.requiredVerbs = ["peer.join"];
      shut.verbsPresent = ["peer.join"];
      writeJson(path.join(dir, "pack/shutdown.json"), shut);
    },
    isoBase,
  );

  // Cadena causal: mutar object en wire M (re-sellado + hashes/report alineados)
  expectFrontier(
    FRONTIER.CADENA_CAUSAL_DIVERGE,
    (dir) => {
      const acts = path.join(dir, "activities");
      for (const name of fs.readdirSync(acts)) {
        const wirePath = path.join(acts, name, "wire.json");
        const viewPath = path.join(acts, name, "view.jsonld");
        const wire = readJson(wirePath);
        if (wire.context?.side === "M" || /:M$/.test(wire.id)) {
          const oldDigest = wire.digest;
          const { digest: _old, ...rest } = wire;
          rest.object = `${rest.object}#tampered`;
          const sealed = { ...rest, digest: digestObject(rest) };
          writeJson(wirePath, sealed);
          if (fs.existsSync(viewPath)) {
            const view = readJson(viewPath);
            view["hm:digest"] = sealed.digest;
            if (view.object != null) view.object = sealed.object;
            writeJson(viewPath, view);
          }
          // Mantener hashes del pack coherentes para no disparar HASH_ROTO antes
          for (const rel of ["report.json", "pack/provenance.json"]) {
            const p = path.join(dir, rel);
            const doc = readJson(p);
            if (Array.isArray(doc.hashes)) {
              doc.hashes = doc.hashes.map((h) =>
                h === oldDigest ? sealed.digest : h,
              );
              writeJson(p, doc);
            }
          }
          break;
        }
      }
    },
    isoBase,
  );

  // ── Negativos ZV: el verificador ya no certifica lo que el pack declara ──

  // Cobertura autodeclarada: 34 filas a `verbo.inventado` + coverage 100/100.
  // Antes daba ok=true; la cobertura se leía, no se recomputaba.
  expectFrontier(
    FRONTIER.REPORTE_INVALIDO,
    (dir) => {
      const r = readJson(path.join(dir, "report.json"));
      r.matrix = r.matrix.map((m) => ({ ...m, verb: "verbo.inventado" }));
      r.coverage = { verbsPercent: 100, unitsPercent: 100 };
      writeJson(path.join(dir, "report.json"), r);
    },
    isoBase,
  );

  // Cobertura mentida con matriz y wires intactos → autocertificada.
  expectFrontier(
    FRONTIER.COBERTURA_AUTOCERTIFICADA,
    (dir) => {
      const r = readJson(path.join(dir, "report.json"));
      r.coverage = { verbsPercent: 90, unitsPercent: 90 };
      writeJson(path.join(dir, "report.json"), r);
      fs.writeFileSync(path.join(dir, "report.md"), renderReportMd(r));
    },
    isoBase,
  );

  // Sello del pack: digest inventado. Antes nadie lo recomputaba jamás.
  expectFrontier(
    FRONTIER.SELLO_PACK_ROTO,
    (dir) => {
      const m = readJson(path.join(dir, "pack/manifest.json"));
      m.digest = `sha256:${"f".repeat(64)}`;
      writeJson(path.join(dir, "pack/manifest.json"), m);
    },
    isoBase,
  );

  // Sello del pack: contenido mutado sin tocar el digest declarado.
  expectFrontier(
    FRONTIER.SELLO_PACK_ROTO,
    (dir) => {
      const c = readJson(path.join(dir, "pack/cortos.json"));
      c.inyectado = "el manifest no lo nota";
      writeJson(path.join(dir, "pack/cortos.json"), c);
    },
    isoBase,
  );

  // Hashes: 50 basura en report.hashes. Antes ⊆ sin recíproco → pasaba.
  expectFrontier(
    FRONTIER.HASH_ROTO,
    (dir) => {
      const r = readJson(path.join(dir, "report.json"));
      for (let i = 0; i < 50; i++) {
        r.hashes.push(`sha256:${String(i).padStart(64, "b")}`);
      }
      writeJson(path.join(dir, "report.json"), r);
    },
    isoBase,
  );

  // Parejas ENTERAMENTE fabricadas — con matriz, hashes, cobertura y sello
  // reparados por el atacante. Solo el cruce contra CEREMONY_STEPS lo para.
  expectFrontier(
    FRONTIER.PAREJA_INESPERADA,
    (dir) => {
      const acts = path.join(dir, "activities");
      const d0 = fs.readdirSync(acts)[0];
      const sample = readJson(path.join(acts, d0, "wire.json"));
      const sampleView = readJson(path.join(acts, d0, "view.jsonld"));
      for (const d of fs.readdirSync(acts)) {
        fs.rmSync(path.join(acts, d), { recursive: true, force: true });
      }
      const verbs = [
        ...REQUIRED_SHUTDOWN_VERBS,
        "zzz.a", "zzz.b", "zzz.c", "zzz.d", "zzz.e", "zzz.f",
        "zzz.g", "zzz.h", "zzz.i", "zzz.j", "zzz.k", "zzz.l",
      ];
      const runId = readJson(path.join(dir, "report.json")).runId;
      verbs.forEach((v, i) =>
        fabricatePair(acts, sample, sampleView, i + 1, v, "fab", runId),
      );
      repairSuperficial(dir);
    },
    isoBase,
  );

  // Borrar 6 pasos REALES y reponerlos con parejas fabricadas: la cardinalidad
  // vuelve a cuadrar (17 parejas / 34 activities) y aun así debe enrojecer.
  expectFrontier(
    FRONTIER.PAREJA_INESPERADA,
    (dir) => {
      const acts = path.join(dir, "activities");
      const byBase = new Map();
      for (const d of fs.readdirSync(acts)) {
        const w = readJson(path.join(acts, d, "wire.json"));
        const b = String(w.id).replace(/:(H|M)$/, "");
        if (!byBase.has(b)) byBase.set(b, { dirs: [], verb: w.verb });
        byBase.get(b).dirs.push(d);
      }
      const d0 = fs.readdirSync(acts)[0];
      const sample = readJson(path.join(acts, d0, "wire.json"));
      const sampleView = readJson(path.join(acts, d0, "view.jsonld"));
      const victims = [...byBase.keys()]
        .filter((k) => !REQUIRED_SHUTDOWN_VERBS.includes(byBase.get(k).verb))
        .slice(0, 6);
      for (const k of victims) {
        for (const d of byBase.get(k).dirs) {
          fs.rmSync(path.join(acts, d), { recursive: true, force: true });
        }
      }
      const runId = readJson(path.join(dir, "report.json")).runId;
      ["zzz.a", "zzz.b", "zzz.c", "zzz.d", "zzz.e", "zzz.f"].forEach((v, i) =>
        fabricatePair(acts, sample, sampleView, 90 + i, v, "rep", runId),
      );
      repairSuperficial(dir);
    },
    isoBase,
  );

  // Suplantar el verbo de un paso real de forma internamente coherente.
  expectFrontier(
    FRONTIER.PAREJA_INESPERADA,
    (dir) => {
      const acts = path.join(dir, "activities");
      for (const d of fs.readdirSync(acts)) {
        const wp = path.join(acts, d, "wire.json");
        const w = readJson(wp);
        if (w.verb !== "graph.bifurcate") continue;
        const { digest: _old, ...rest } = w;
        rest.verb = "graph.inventado";
        rest.id = String(rest.id).replace("graph.bifurcate", "graph.inventado");
        const sealed = { ...rest, digest: digestObject(rest) };
        writeJson(wp, sealed);
        const vp = path.join(acts, d, "view.jsonld");
        const v = readJson(vp);
        v["@id"] = sealed.id;
        v["hm:verb"] = sealed.verb;
        v["hm:digest"] = sealed.digest;
        writeJson(vp, v);
      }
      repairSuperficial(dir);
    },
    isoBase,
  );

  // Cadena causal: dos mitades que registran instrument/context DISTINTOS.
  // Cada una es coherente consigo misma; antes pasaba, incluido el check nuevo.
  expectFrontier(
    FRONTIER.CADENA_CAUSAL_DIVERGE,
    (dir) => {
      const acts = path.join(dir, "activities");
      for (const d of fs.readdirSync(acts)) {
        const wp = path.join(acts, d, "wire.json");
        const w = readJson(wp);
        if (w.context?.side !== "M") continue;
        const { digest: _old, ...rest } = w;
        rest.instrument = "demiurgo";
        rest.context = { ...rest.context, unitId: "vector-mock", anio: 1999 };
        const sealed = { ...rest, digest: digestObject(rest) };
        writeJson(wp, sealed);
        const vp = path.join(acts, d, "view.jsonld");
        const v = readJson(vp);
        v["hm:digest"] = sealed.digest;
        writeJson(vp, v);
      }
      repairSuperficial(dir);
    },
    isoBase,
  );

  // Provenance: upstream inventado en AMBAS mitades (causalmente coherente).
  // Se repara PRIMERO y se rompe DESPUÉS: si no, el re-ancla topológico del
  // reparador arreglaría justo lo que este negativo quiere romper.
  expectFrontier(
    FRONTIER.CADENA_CAUSAL_DIVERGE,
    (dir) => {
      repairSuperficial(dir);
      const acts = path.join(dir, "activities");
      const byBase = new Map();
      for (const d of fs.readdirSync(acts)) {
        const w = readJson(path.join(acts, d, "wire.json"));
        const b = String(w.id).replace(/:(H|M)$/, "");
        if (!byBase.has(b)) byBase.set(b, []);
        byBase.get(b).push(d);
      }
      const target = [...byBase.values()].find(
        (ds) =>
          (readJson(path.join(acts, ds[0], "wire.json")).provenance?.upstream ?? [])
            .length > 0,
      );
      for (const d of target) {
        const wp = path.join(acts, d, "wire.json");
        const w = readJson(wp);
        const { digest: _old, ...rest } = w;
        rest.provenance = {
          ...rest.provenance,
          upstream: [`sha256:${"9".repeat(64)}`],
        };
        const sealed = { ...rest, digest: digestObject(rest) };
        writeJson(wp, sealed);
        const vp = path.join(acts, d, "view.jsonld");
        const v = readJson(vp);
        v["hm:digest"] = sealed.digest;
        writeJson(vp, v);
      }
      repairShallow(dir);
    },
    isoBase,
  );

  // ── Devolución ZV-HUB: cuatro bloqueantes de la contrarrevisión ─────────

  // B1 · Una corrida ENTERA fabricada con las claves exactas. La biyección
  // comparaba la clave y no la corrida: 34 actividades de un runId que nunca
  // existió, con cero solapamiento con la real, pasaban los doce checks.
  expectFrontier(
    FRONTIER.PAREJA_INESPERADA,
    (dir) => {
      const acts = path.join(dir, "activities");
      const d0 = fs.readdirSync(acts)[0];
      const sample = readJson(path.join(acts, d0, "wire.json"));
      const sampleView = readJson(path.join(acts, d0, "view.jsonld"));
      for (const d of fs.readdirSync(acts)) {
        fs.rmSync(path.join(acts, d), { recursive: true, force: true });
      }
      for (const p of EXPECTED_ACTIVITY_PAIRS) {
        fabricatePair(
          acts,
          sample,
          sampleView,
          p.step,
          p.verb,
          "fantasma",
          "CORRIDA-QUE-NUNCA-EXISTIO",
        );
      }
      repairSuperficial(dir);
    },
    isoBase,
  );

  // B1b · Vaciar la cadena: el check llamado «cadena causal» no exigía que
  // hubiera cadena. Los 34 wires con upstream:[] daban ok=true.
  expectFrontier(
    FRONTIER.CADENA_CAUSAL_DIVERGE,
    (dir) => {
      repairSuperficial(dir);
      const acts = path.join(dir, "activities");
      for (const d of fs.readdirSync(acts)) {
        const wp = path.join(acts, d, "wire.json");
        const w = readJson(wp);
        const { digest: _old, ...rest } = w;
        rest.provenance = { ...rest.provenance, upstream: [] };
        const sealed = { ...rest, digest: digestObject(rest) };
        writeJson(wp, sealed);
        const vp = path.join(acts, d, "view.jsonld");
        const v = readJson(vp);
        v["hm:digest"] = sealed.digest;
        v["prov:wasDerivedFrom"] = [];
        writeJson(vp, v);
      }
      repairShallow(dir);
    },
    isoBase,
  );

  // B2 · `wire.result` no lo leía nadie: 34 mitades en "fail" con
  // report.verdict "pass" daban ok=true.
  expectFrontier(
    FRONTIER.REPORTE_INVALIDO,
    (dir) => {
      const acts = path.join(dir, "activities");
      for (const d of fs.readdirSync(acts)) {
        const wp = path.join(acts, d, "wire.json");
        const w = readJson(wp);
        const { digest: _old, ...rest } = w;
        rest.result = "fail";
        writeJson(wp, { ...rest, digest: digestObject(rest) });
      }
      repairSuperficial(dir);
    },
    isoBase,
  );

  // B2b · La matriz se contrastaba por recuento de verbos: `actor` y `object`
  // de cada fila eran libres.
  expectFrontier(
    FRONTIER.REPORTE_INVALIDO,
    (dir) => {
      repairSuperficial(dir);
      const r = readJson(path.join(dir, "report.json"));
      r.matrix = r.matrix.map((m) => ({ ...m, actor: "urn:quien:sea" }));
      writeJson(path.join(dir, "report.json"), r);
      fs.writeFileSync(path.join(dir, "report.md"), renderReportMd(r));
    },
    isoBase,
  );

  // report.md tenía contenido libre: bastaba con que citara dos cadenas.
  expectFrontier(
    FRONTIER.REPORTE_INVALIDO,
    (dir) => {
      const r = readJson(path.join(dir, "report.json"));
      fs.writeFileSync(
        path.join(dir, "report.md"),
        `# ${r.reportId}\n\n> desde eventos\n(todo lo demás inventado)\n`,
      );
    },
    isoBase,
  );

  // La CA de apagado limpio se quedaba sin sujeto.
  expectFrontier(
    FRONTIER.SHUTDOWN_INCOMPLETO,
    (dir) => {
      const t = readJson(path.join(dir, "pack/tipestate.json"));
      t.transitions = [t.transitions[0]];
      t.finals = {};
      writeJson(path.join(dir, "pack/tipestate.json"), t);
      repairSuperficial(dir);
    },
    isoBase,
  );

  // Una sola ACL positiva no es una política bilateral.
  expectFrontier(
    FRONTIER.PIEZA_AUSENTE,
    (dir) => {
      const a = readJson(path.join(dir, "pack/acl.json"));
      for (const e of a.entries) {
        if (e.acl) e.acl = e.acl.map((r) => ({ ...r, verbs: ["unit.inspect"] }));
      }
      writeJson(path.join(dir, "pack/acl.json"), a);
      repairSuperficial(dir);
    },
    isoBase,
  );

  // ceremonyId/scenarioId eran dos campos libres; ahora van contra la raíz.
  expectFrontier(
    FRONTIER.PROVENANCE_ROTA,
    (dir) => {
      const p = readJson(path.join(dir, "pack/provenance.json"));
      p.ceremonyId = "ceremonia-que-no-es";
      writeJson(path.join(dir, "pack/provenance.json"), p);
      repairSuperficial(dir);
    },
    isoBase,
  );

  // artifactChain nunca se recomputaba, teniendo el cruce en la evidencia.
  expectFrontier(
    FRONTIER.PROVENANCE_ROTA,
    (dir) => {
      repairSuperficial(dir);
      const r = readJson(path.join(dir, "report.json"));
      r.artifactChain = `sha256:${"a".repeat(64)}`;
      writeJson(path.join(dir, "report.json"), r);
      fs.writeFileSync(path.join(dir, "report.md"), renderReportMd(r));
      const p = readJson(path.join(dir, "pack/provenance.json"));
      p.artifactChain = r.artifactChain;
      writeJson(path.join(dir, "pack/provenance.json"), p);
      const docs = {};
      for (const { key, rel } of SEALED_PACK_DOCS) {
        docs[key] = readJson(path.join(dir, rel));
      }
      const man = readJson(path.join(dir, "pack/manifest.json"));
      man.digest = computePackDigest(docs, r.verdict);
      writeJson(path.join(dir, "pack/manifest.json"), man);
    },
    isoBase,
  );

  // cleanup
  if (!process.env.KEEP_HM_RUNS) {
    fs.rmSync(result.runRoot, { recursive: true, force: true });
    fs.rmSync(isoBase, { recursive: true, force: true });
  }

  if (failed > 0) {
    console.error(`test-107-verificador: FAIL (${failed})`);
    process.exit(1);
  }
  console.log("test-107-verificador: PASS");
  process.exit(0);
}

main();
