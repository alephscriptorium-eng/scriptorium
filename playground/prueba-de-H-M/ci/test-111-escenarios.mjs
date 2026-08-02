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

/**
 * Único fichero del arnés autorizado a nombrar un escenario, y sólo si ese
 * escenario está en la allowlist: la allowlist v1 ES su contenido declarado.
 * Cualquier otro fichero de `lib/escenarios/` que nombre un id —v1 o no— es
 * cableado.
 */
const ARNES_ALLOWLIST = "v1-allowlist.mjs";

/**
 * Ficheros del arnés que nombran `id` sin tener derecho a hacerlo.
 *
 * Corrección ZV vuelta 2: antes esto sólo se aplicaba a los ids **no-v1**, de
 * modo que cablear el id v1 dentro de `lib/escenarios/` no lo habría visto
 * nadie. Ahora se barren **todos** los ids descubiertos y la única excepción
 * está declarada arriba.
 */
/**
 * Todos los `.mjs` del arnés, **recursivo**.
 *
 * Corrección ZV vuelta 3: era `readdirSync` plano, así que
 * `lib/escenarios/sub/cableado.mjs` pasaba sin que nadie lo viera.
 */
function ficherosDelArnes(dir = path.join(kitRoot, "lib/escenarios"), rel = "") {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    const camino = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...ficherosDelArnes(abs, camino));
    else if (e.name.endsWith(".mjs")) out.push({ rel: camino, abs });
  }
  return out.sort((a, b) => a.rel.localeCompare(b.rel));
}

/** Cuerpo sin comentarios: un comentario no cablea comportamiento. */
function sinComentarios(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

function arnesMencionaIndebidamente(id) {
  const permitidoEnAllowlist = isV1Scenario(id);
  const hits = [];
  for (const { rel, abs } of ficherosDelArnes()) {
    if (rel === ARNES_ALLOWLIST && permitidoEnAllowlist) continue;
    // Aquí NO se despojan comentarios, a propósito: la afirmación de este WP es
    // que el arnés no nombra escenarios **en absoluto**, ni de pasada.
    if (fs.readFileSync(abs, "utf8").includes(id)) hits.push(rel);
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

// ── 2) El arnés no nombra NINGÚN escenario descubierto (ni v1 ni no-v1) ─────
bloque("arnés sin hardcode", () => {
  for (const id of ids) {
    const hits = arnesMencionaIndebidamente(id);
    if (hits.length) {
      fail(`el arnés menciona «${id}» en ${hits.join(", ")} — debe bastar scenarios/`);
    }
  }
  // La excepción se estrecha: en el fichero de allowlist, el id v1 sólo vale
  // una vez —la de V1_SCENARIO_IDS— y se cuenta sobre el CÓDIGO, sin comillas
  // de por medio.
  //
  // Corrección ZV vuelta 3: se contaba `split(`"${v1id}"`)`, sólo comillas
  // dobles, así que una segunda aparición con comillas simples pasaba. Ahora se
  // despojan comentarios (que no cablean) y se cuenta el id desnudo, de modo
  // que da igual cómo se cite.
  const allowlistCodigo = sinComentarios(
    fs.readFileSync(path.join(kitRoot, "lib/escenarios", ARNES_ALLOWLIST), "utf8"),
  );
  for (const v1id of V1_SCENARIO_IDS) {
    const apariciones = allowlistCodigo.split(v1id).length - 1;
    if (apariciones !== 1) {
      fail(`«${v1id}» aparece ${apariciones} vez/veces en el código de ${ARNES_ALLOWLIST}; sólo vale la de V1_SCENARIO_IDS`);
    }
  }
  const nFicheros = ficherosDelArnes().length;
  return `0/${ids.length} escenarios cableados en ${nFicheros} fichero(s) de lib/escenarios/** (recursivo; excepción declarada: ${V1_SCENARIO_IDS.length} id v1 dentro de ${ARNES_ALLOWLIST})`;
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
  const fallados = r.verdicts.filter((v) => v.estado === "fail");
  const idsFallados = fallados.map((v) => v.id);
  // No basta con que enrojezca: tiene que enrojecer POR EL HUÉRFANO. Un fallo
  // de carga de referentes usa el mismo id de chequeo y colaría aquí como si
  // el negativo hubiera funcionado.
  const motivoEsperado = new Map([
    ["units.en-catalogo", "no-existe"],
    ["verbos.en-ontologia", "verbo.inventado"],
  ]);
  for (const [checkId, huerfano] of motivoEsperado) {
    const v = fallados.find((x) => x.id === checkId);
    if (!v) {
      fail(`el negativo no enrojeció ${checkId} (fallados: ${idsFallados.join(", ") || "ninguno"})`);
      continue;
    }
    if (!v.detail.includes(huerfano)) {
      fail(`${checkId} enrojeció por otro motivo, no por el huérfano «${huerfano}»: ${v.detail}`);
    }
  }
  return `units/verbo huérfanos ⇒ ${idsFallados.length}/${r.total} en rojo, y los ${motivoEsperado.size} nombran su huérfano (${fallados.map((v) => `${v.id}:«${v.detail}»`).join(" · ")})`;
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
const { v1, nonV1, ignoredClaims, inspected, clavesLeidas } = classifyV1(discovered);
const v1Esperado = [...V1_SCENARIO_IDS].sort();
// Denominador calculado por el test, no aceptado de la librería: si classifyV1
// deja de recorrer los datos, este cruce enrojece.
const clavesEsperadas = discovered.reduce(
  (n, d) => n + Object.keys(d.data ?? {}).length,
  0,
);

bloque("allowlist v1", () => {
  if (JSON.stringify([...v1].sort()) !== JSON.stringify(v1Esperado)) {
    fail(`v1 = ${JSON.stringify(v1)} ≠ allowlist ${JSON.stringify(v1Esperado)}`);
  }
  if (inspected !== discovered.length) {
    fail(`classifyV1 inspeccionó ${inspected}/${discovered.length} escenarios`);
  }
  if (clavesLeidas !== clavesEsperadas) {
    fail(`classifyV1 recorrió ${clavesLeidas}/${clavesEsperadas} claves de datos`);
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
  return `${v1.length}/${discovered.length} en v1 [${v1.join(", ")}] · ${nonV1.length} fuera · ${clavesLeidas}/${clavesEsperadas} claves recorridas · barrio ${V1_BARRIO_ID}`;
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
