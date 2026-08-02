#!/usr/bin/env node
/**
 * WP-HUB-111 · escenarios descubribles + conformidad comun + v1 allowlist.
 *
 * Correcciones ZV (auditoría adversarial 2026-08-02):
 *  · §6 EJECUTA de verdad cada escenario (spawn de `scripts/generar.mjs`).
 *    Antes este fichero no llamaba a nada: sólo validaba JSON, mientras la CA
 *    decía «corre». Alcance honesto en `lib/escenarios/ejecutar.mjs`.
 *  · `ok()` incondicional eliminado: cada bloque con bucle cuenta sus fallos
 *    y sólo canta PASS si el contador quedó en cero.
 *  · Cifras duras fuera: los umbrales se derivan de `V1_SCENARIO_IDS` y de un
 *    recuento independiente del disco, y toda cifra sale con denominador.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import Ajv2020Module from "ajv/dist/2020.js";
import {
  discoverScenarios,
  runConformidadSuite,
  classifyV1,
  isV1Scenario,
  ejecutarEscenario,
  CONFORMIDAD_CHECKS,
  PROMOTION_CLAIM_KEYS,
  V1_SCENARIO_IDS,
  V1_BARRIO_ID,
} from "../lib/escenarios/index.mjs";

const Ajv2020 = Ajv2020Module.default ?? Ajv2020Module;
const here = path.dirname(fileURLToPath(import.meta.url));
const kitRoot = path.resolve(here, "..");
let failed = 0;

function ok(msg) {
  console.log(`test-111-escenarios: PASS — ${msg}`);
}

function fail(msg) {
  console.error(`test-111-escenarios: FAIL — ${msg}`);
  failed += 1;
}

/**
 * Bloque con bucle: canta PASS sólo si su propio contador quedó en cero.
 * (Antes había un `ok()` incondicional tras el bucle de campos obligatorios,
 * que se imprimía aunque dentro hubiera fallado algo.)
 */
function bloque(nombre, fn) {
  const antes = failed;
  const resumen = fn();
  const caidos = failed - antes;
  if (caidos === 0) ok(`${nombre} — ${resumen}`);
  else console.error(`test-111-escenarios: bloque «${nombre}» con ${caidos} fallo(s)`);
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

function loadScenarioSchemaValidator() {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: false,
    validateFormats: false,
  });
  const schema = JSON.parse(
    fs.readFileSync(path.join(kitRoot, "schemas/scenario.schema.json"), "utf8"),
  );
  return ajv.compile(schema);
}

/**
 * Recuento independiente de `discover.mjs`: si el descubrimiento se cableara a
 * una lista, este denominador dejaría de cuadrar.
 * @returns {string[]}
 */
function recuentoDirectoDeDisco() {
  const root = path.join(kitRoot, "scenarios");
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .filter((e) => fs.existsSync(path.join(root, e.name, "scenario.json")))
    .map((e) => e.name)
    .sort();
}

/** Ficheros del arnés que NO deben nombrar escenario concreto alguno. */
function arnesMenciona(id) {
  const harnessDir = path.join(kitRoot, "lib/escenarios");
  const hits = [];
  for (const f of fs.readdirSync(harnessDir).filter((f) => f.endsWith(".mjs"))) {
    const body = fs.readFileSync(path.join(harnessDir, f), "utf8");
    if (body.includes(id)) hits.push(f);
  }
  return hits;
}

ensureDeps();

// ── 1) Descubrimiento por carpeta, con denominador medido dos veces ─────────
const discovered = discoverScenarios(kitRoot);
const ids = discovered.map((d) => d.scenarioId).sort();
const enDisco = recuentoDirectoDeDisco();

bloque("descubrimiento", () => {
  if (JSON.stringify(ids) !== JSON.stringify(enDisco)) {
    fail(
      `discovery ${ids.length}/${enDisco.length} no coincide con el disco: [${ids}] vs [${enDisco}]`,
    );
  }
  // Umbral derivado: tiene que haber al menos un escenario MÁS que la allowlist
  // v1; si no, «descubrible» no significaría nada. Sin cifra dura.
  const minimo = V1_SCENARIO_IDS.length + 1;
  if (ids.length < minimo) {
    fail(`esperaba ≥${minimo} escenarios (|v1|=${V1_SCENARIO_IDS.length} + 1), hay ${ids.length}: ${ids.join(",")}`);
  }
  for (const v1id of V1_SCENARIO_IDS) {
    if (!ids.includes(v1id)) fail(`falta el escenario v1 declarado: ${v1id}`);
  }
  if (!ids.includes("segundo-minimo")) {
    fail("falta segundo-minimo (el segundo escenario que entrega este WP)");
  }
  return `${ids.length}/${enDisco.length} escenarios descubiertos: ${ids.join(", ")}`;
});

const noV1Ids = ids.filter((id) => !isV1Scenario(id));

// ── 2) El arnés no nombra ningún escenario no-v1 ────────────────────────────
bloque("arnés sin hardcode", () => {
  for (const id of noV1Ids) {
    const hits = arnesMenciona(id);
    if (hits.length) fail(`el arnés menciona «${id}» en ${hits.join(", ")} — debe bastar scenarios/`);
  }
  return `0/${noV1Ids.length} escenarios no-v1 mencionados en lib/escenarios/*.mjs`;
});

// ── 3) Schema JSON ──────────────────────────────────────────────────────────
const validate = loadScenarioSchemaValidator();
bloque("schema", () => {
  let validos = 0;
  for (const d of discovered) {
    if (validate(d.data)) validos += 1;
    else fail(`schema ${d.scenarioId}: ${JSON.stringify(validate.errors?.slice(0, 3))}`);
  }
  return `${validos}/${discovered.length} conformes a schemas/scenario.schema.json`;
});

// ── 4) Conformidad común: presencia Y referencia ────────────────────────────
const conf = runConformidadSuite(discovered, kitRoot);
const totalChecks = CONFORMIDAD_CHECKS.length;
const referencialesDeclarados = CONFORMIDAD_CHECKS.filter(([, clase]) => clase === "referencia").length;

bloque("conformidad común", () => {
  let pasados = 0;
  for (const r of conf.results) {
    if (!r.ok) {
      fail(`${r.scenarioId}: ${r.pasados}/${r.total} chequeos — ${r.errors.join("; ")}`);
      continue;
    }
    if (r.total !== totalChecks) {
      fail(`${r.scenarioId}: ${r.total} veredictos ≠ ${totalChecks} chequeos declarados`);
      continue;
    }
    if (r.referenciales !== referencialesDeclarados) {
      fail(`${r.scenarioId}: ${r.referenciales} chequeos de referencia ≠ ${referencialesDeclarados}`);
      continue;
    }
    pasados += 1;
    console.log(
      `  · ${r.scenarioId}: ${r.pasados}/${r.total} (${r.referenciales} referenciales) — ${r.checks.join(", ")}`,
    );
  }
  if (!conf.ok) fail("suite de conformidad con errores");
  return `${pasados}/${conf.results.length} escenarios · ${totalChecks} chequeos c/u (${referencialesDeclarados} de referencia)`;
});

// Negativo vivo: un escenario que nombra una unidad inexistente y un verbo
// inventado DEBE fallar. Sin esto, los chequeos de referencia no se ejercitan.
bloque("negativo de referencia", () => {
  const base = discovered.find((d) => isV1Scenario(d.scenarioId))?.data;
  if (!base) {
    fail("no hay escenario v1 del que derivar el negativo");
    return "sin base";
  }
  const roto = JSON.parse(JSON.stringify(base));
  roto.scenarioId = "negativo-en-memoria";
  roto.units = ["no-existe"];
  roto.ceremony.steps = [{ order: 1, verb: "verbo.inventado", description: "no está en la ontología" }];
  const r = runConformidadSuite([{ scenarioId: roto.scenarioId, data: roto }], kitRoot).results[0];
  const idsFallados = r.verdicts.filter((v) => v.estado === "fail").map((v) => v.id);
  for (const esperado of ["units.en-catalogo", "verbos.en-ontologia"]) {
    if (!idsFallados.includes(esperado)) {
      fail(`el negativo no enrojeció ${esperado} (fallados: ${idsFallados.join(", ") || "ninguno"})`);
    }
  }
  return `units/verbo huérfanos ⇒ ${idsFallados.length}/${r.total} chequeos en rojo (${idsFallados.join(", ")})`;
});

// ── 5) Campos obligatorios del BRIEF (bucle con contador propio) ────────────
bloque("campos del BRIEF", () => {
  const campos = ["barrioId", "fixture", "units", "verbos", "CA", "cleanup"];
  let completos = 0;
  for (const d of discovered) {
    const s = d.data;
    const valores = new Map([
      ["barrioId", s.barrioId],
      ["fixture", s.fixture],
      ["units", s.units],
      ["verbos", s.ceremony?.steps],
      ["CA", s.acceptanceCriteria],
      ["cleanup", s.cleanup],
    ]);
    let faltan = 0;
    for (const campo of campos) {
      const val = valores.get(campo);
      if (val == null || (Array.isArray(val) && val.length === 0)) {
        fail(`${d.scenarioId}: no declara ${campo}`);
        faltan += 1;
      }
    }
    if (faltan === 0) completos += 1;
  }
  return `${completos}/${discovered.length} escenarios con los ${campos.length} campos (${campos.join(", ")})`;
});

// ── 6) v1: sólo la allowlist; el descubrimiento NO promueve ─────────────────
const { v1, nonV1, ignoredClaims, inspected } = classifyV1(discovered);
const v1Esperado = [...V1_SCENARIO_IDS].sort();

bloque("allowlist v1", () => {
  if (JSON.stringify([...v1].sort()) !== JSON.stringify(v1Esperado)) {
    fail(`v1 = ${JSON.stringify(v1)} ≠ allowlist ${JSON.stringify(v1Esperado)}`);
  }
  if (inspected !== discovered.length) {
    fail(`classifyV1 inspeccionó ${inspected}/${discovered.length} escenarios`);
  }
  for (const id of noV1Ids) {
    if (!nonV1.includes(id)) fail(`${id} debería estar en nonV1`);
    if (isV1Scenario(id)) fail(`isV1Scenario(${id}) no debe ser true`);
  }
  const lore = discovered.filter((d) => isV1Scenario(d.scenarioId));
  for (const d of lore) {
    if (d.data.barrioId !== V1_BARRIO_ID) {
      fail(`${d.scenarioId} debe anclarse al barrio ${V1_BARRIO_ID}, tiene ${d.data.barrioId}`);
    }
  }
  return `${v1.length}/${discovered.length} en v1 [${v1.join(", ")}] · ${nonV1.length} fuera · barrio ${V1_BARRIO_ID}`;
});

// Hostil: banderas de auto-promoción en el JSON. Dos lados falsables —
// (a) no promueven; (b) classifyV1 las VIO (si dejara de leer `data`,
// `ignoredClaims` quedaría vacío y este bloque enrojece).
bloque("hostil-omite", () => {
  const lore = discovered.find((d) => isV1Scenario(d.scenarioId));
  if (!lore) {
    fail("no hay escenario v1 con el que contrastar el hostil");
    return "sin base";
  }
  const victima = noV1Ids[0];
  if (!victima) {
    fail("no hay escenario no-v1 con el que montar el hostil");
    return "sin víctima";
  }
  const banderas = ["v1", "promoteToV1", "tier"];
  const hostile = {
    scenarioId: victima,
    data: {
      scenarioId: victima,
      v1: true,
      promoteToV1: true,
      tier: "v1",
      barrioId: V1_BARRIO_ID,
    },
  };
  const clasificado = classifyV1([hostile, lore]);
  if (clasificado.v1.includes(victima)) {
    fail(`auto-declaración promovió ${victima} (no debe)`);
  }
  if (JSON.stringify([...clasificado.v1].sort()) !== JSON.stringify(v1Esperado)) {
    fail(`classifyV1 hostil alteró v1: ${JSON.stringify(clasificado.v1)} ≠ ${JSON.stringify(v1Esperado)}`);
  }
  const acta = clasificado.ignoredClaims.find((c) => c.scenarioId === victima);
  if (!acta) {
    fail("classifyV1 no dejó acta de las banderas: ¿volvió a no leer d.data?");
    return "sin acta";
  }
  const vistas = banderas.filter((b) => acta.claims.some((c) => c.startsWith(`${b}=`)));
  if (vistas.length !== banderas.length) {
    fail(`acta incompleta: vio ${vistas.length}/${banderas.length} banderas (${acta.claims.join(", ")})`);
  }
  // Los escenarios reales no pueden llevar estas claves: el schema las veta.
  const colados = discovered.filter((d) =>
    PROMOTION_CLAIM_KEYS.some((k) => Object.hasOwn(d.data, k)),
  );
  if (colados.length) {
    fail(`escenario(s) en disco con clave de auto-promoción: ${colados.map((c) => c.scenarioId).join(", ")}`);
  }
  return `${vistas.length}/${banderas.length} banderas vistas y descartadas sobre «${victima}» · ${clasificado.v1.length}/${v1Esperado.length} en v1 · 0/${discovered.length} escenarios en disco con banderas`;
});

// ── 7) EJECUCIÓN REAL: cada escenario descubierto corre el generador ────────
// Esto es lo que faltaba: spawn de proceso, artefactos en disco, sello y no-op
// medido. Ningún id aparece aquí: se ejecuta lo que se descubrió.
bloque("ejecución real", () => {
  let corridos = 0;
  let sellos = 0;
  for (const d of discovered) {
    const r = ejecutarEscenario(d, kitRoot, { runPrefix: "test-111" });
    for (const linea of r.evidencia) console.log(`  · ${d.scenarioId}: ${linea}`);
    if (!r.ok) {
      fail(`${d.scenarioId} no corrió limpio: ${r.errors.join("; ")}`);
      continue;
    }
    corridos += 1;
    if (r.seal) sellos += 1;
    console.log(
      `  · ${d.scenarioId}: artefactos ${r.artefactos}/${r.esperados} · idempotente=${r.idempotente} · limpiado=${r.limpiado}`,
    );
  }
  return `${corridos}/${discovered.length} escenarios ejecutados con generador real · ${sellos}/${discovered.length} con sello sha256`;
});

if (failed > 0) {
  console.error(`test-111-escenarios: FAIL (${failed})`);
  process.exit(1);
}
console.log("test-111-escenarios: PASS");
process.exit(0);
