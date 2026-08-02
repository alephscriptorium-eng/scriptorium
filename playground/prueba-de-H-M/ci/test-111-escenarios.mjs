#!/usr/bin/env node
/**
 * WP-HUB-111 · escenarios descubribles + conformidad comun + v1 allowlist.
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
    fs.readFileSync(
      path.join(kitRoot, "schemas/scenario.schema.json"),
      "utf8",
    ),
  );
  return ajv.compile(schema);
}

function harnessMentionsSegundoMinimo() {
  const harnessDir = path.join(kitRoot, "lib/escenarios");
  const files = fs.readdirSync(harnessDir).filter((f) => f.endsWith(".mjs"));
  for (const f of files) {
    const body = fs.readFileSync(path.join(harnessDir, f), "utf8");
    if (body.includes("segundo-minimo")) return f;
  }
  return null;
}

ensureDeps();

// 1) Descubrimiento por glob de carpetas
const discovered = discoverScenarios(kitRoot);
const ids = discovered.map((d) => d.scenarioId).sort();
if (ids.length < 2) {
  fail(`esperaba ≥2 escenarios, got ${ids.length}: ${ids.join(",")}`);
} else {
  ok(`descubiertos ${ids.length}: ${ids.join(", ")}`);
}

if (!ids.includes("barrio-lore")) fail("falta barrio-lore");
else ok("barrio-lore descubierto");

if (!ids.includes("segundo-minimo")) fail("falta segundo-minimo");
else ok("segundo-minimo descubierto (sin lista hardcodeada de ids)");

// 2) Segundo escenario corre sin tocar el arnés (cero mención en lib/escenarios)
const leak = harnessMentionsSegundoMinimo();
if (leak) fail(`arnés menciona segundo-minimo en ${leak} — debe bastar scenarios/`);
else ok("arnés sin mención a segundo-minimo (solo discovery por carpeta)");

// 3) Conformidad común + schema
const validate = loadScenarioSchemaValidator();
for (const d of discovered) {
  if (!validate(d.data)) {
    fail(
      `schema ${d.scenarioId}: ${JSON.stringify(validate.errors?.slice(0, 3))}`,
    );
  } else {
    ok(`schema OK — ${d.scenarioId}`);
  }
}

const conf = runConformidadSuite(discovered, kitRoot);
for (const r of conf.results) {
  if (!r.ok) fail(`${r.scenarioId}: ${r.errors.join("; ")}`);
  else ok(`conformidad OK — ${r.scenarioId} (${r.checks.join(", ")})`);
}
if (!conf.ok) fail("suite conformidad con errores");
else ok("suite conformidad común: todos PASS");

// Campos obligatorios del BRIEF
for (const d of discovered) {
  const s = d.data;
  const required = [
    ["barrioId", s.barrioId],
    ["fixture", s.fixture],
    ["units", s.units],
    ["verbos", s.ceremony?.steps],
    ["CA", s.acceptanceCriteria],
    ["cleanup", s.cleanup],
  ];
  for (const [label, val] of required) {
    if (val == null || (Array.isArray(val) && val.length === 0)) {
      fail(`${d.scenarioId}: no declara ${label}`);
    }
  }
}
ok("todo escenario declara barrio, fixture, units, verbos, CA, cleanup");

// 4) v1: sólo Barrio LORE — discovery NO promueve
const { v1, nonV1 } = classifyV1(discovered);
if (JSON.stringify(v1) !== JSON.stringify([...V1_SCENARIO_IDS].sort())) {
  fail(`v1 set inesperado: ${JSON.stringify(v1)} esperado ${JSON.stringify([...V1_SCENARIO_IDS])}`);
} else {
  ok(`v1 allowlist = [${v1.join(", ")}]`);
}

if (!nonV1.includes("segundo-minimo")) {
  fail("segundo-minimo debería estar en nonV1");
} else {
  ok("segundo-minimo descubierto pero NO promovido a v1");
}

if (isV1Scenario("segundo-minimo")) {
  fail("isV1Scenario(segundo-minimo) no debe ser true");
} else {
  ok("isV1Scenario(segundo-minimo)=false");
}

const lore = discovered.find((d) => d.scenarioId === "barrio-lore");
if (!lore || lore.data.barrioId !== V1_BARRIO_ID) {
  fail(`barrio-lore debe tener barrioId=${V1_BARRIO_ID}`);
} else {
  ok(`único v1 anclado a barrio ${V1_BARRIO_ID}`);
}

// 5) Auto-declaración hostil no promueve
const hostile = {
  scenarioId: "segundo-minimo",
  data: {
    scenarioId: "segundo-minimo",
    v1: true,
    promoteToV1: true,
    tier: "v1",
    barrioId: V1_BARRIO_ID,
  },
};
const hostileClass = classifyV1([hostile, lore]);
if (hostileClass.v1.includes("segundo-minimo")) {
  fail("auto-declaración v1/promoteToV1 promovió segundo-minimo (no debe)");
} else {
  ok("hostil-omite: flags v1/promoteToV1 en JSON no promueven");
}

if (hostileClass.v1.length !== 1 || hostileClass.v1[0] !== "barrio-lore") {
  fail(`classifyV1 hostil alteró v1: ${JSON.stringify(hostileClass.v1)}`);
} else {
  ok("classifyV1 estable ante flags hostiles");
}

if (failed > 0) {
  console.error(`test-111-escenarios: FAIL (${failed})`);
  process.exit(1);
}
console.log("test-111-escenarios: PASS");
process.exit(0);
