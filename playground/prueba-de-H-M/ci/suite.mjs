#!/usr/bin/env node
/**
 * Suite mínima LORE-HM (113+100…107+109+110).
 * Bloquea si falta el arnés o si está plantado el vector rojo.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const plant = path.join(here, "ROJO-PLANTADO");

function fail(msg) {
  console.error(`lore-hm suite: FAIL — ${msg}`);
  process.exit(1);
}

if (fs.existsSync(plant)) {
  const body = fs.readFileSync(plant, "utf8").trim();
  console.error("lore-hm suite: ROJO PLANTADO (WP-HUB-113 vector)");
  console.error(body || "(marcador vacío)");
  process.exit(1);
}

const required = [
  "ci/suite.mjs",
  "ci/VECTOR-ROJO.md",
  "ci/guarda-continue-on-error.sh",
  // WP-HUB-100
  "ci/test-100-schemas.mjs",
  "schemas/scenario.schema.json",
  "scenarios/barrio-lore/scenario.json",
  "units/catalog/bartleby.json",
  "package.json",
  // WP-HUB-101
  "ci/test-101-ontologia.mjs",
  "ontology/hm-v1.context.jsonld",
  "ontology/hm-v1.ttl",
  "reference/VERBOS.md",
  // WP-HUB-102
  "ci/test-102-generador.mjs",
  "scripts/generar.mjs",
  // WP-HUB-103
  "ci/test-103-podstore.mjs",
  "lib/podstore/LocalPodProvider.mjs",
  "lib/podstore/tipestate.mjs",
  "lib/podstore/acl.mjs",
  // WP-HUB-104
  "ci/test-104-onfalo.mjs",
  "scripts/importar-onfalo.mjs",
  "fixtures/onfalo/source.manifest.json",
  "fixtures/onfalo-attest.redistributable.json",
  // # WP-HUB-105
  "ci/test-105-cadena.mjs",
  "lib/cadena/run-cadena.mjs",
  "lib/cadena/bartleby.mjs",
  "lib/cadena/cristalizador.mjs",
  "lib/cadena/vector-mock.mjs",
  // # WP-HUB-106
  "ci/test-106-ceremonia.mjs",
  "lib/ceremonia/run-ceremonia.mjs",
  "lib/ceremonia/steps.mjs",
  "lib/ceremonia/envelope.mjs",
  "scripts/ceremonia.mjs",
  // # WP-HUB-107
  "ci/test-107-verificador.mjs",
  "scripts/verificar-evidencia.mjs",
  "lib/verificador/verificar.mjs",
  "lib/ceremonia/evidence-pack.mjs",
  // # WP-HUB-108
  "ci/test-108-mapa.mjs",
  "scripts/generar-mapa.mjs",
  "fixtures/mapa/mapa.json",
  // # WP-HUB-109
  "ci/test-109-despierta.mjs",
  "scripts/despertar.mjs",
  "lib/despertar/despertar.mjs",
  "lib/despertar/actas.mjs",
  "lib/despertar/elenco.mjs",
  "lib/despertar/projection-hook.mjs",
  "fixtures/censo-excerpt-lore-voz.md",
  "fixtures/censo-excerpt-novelist-editor.md",
  "fixtures/novelist-elenco.json",
  "ciudad/README.md",
  // # WP-HUB-110
  "ci/test-110-negativos.mjs",
  "ci/test-110-consumidor-limpio.mjs",
  "lib/negativos/frontiers.mjs",
  "lib/negativos/matrix.mjs",
  "lib/offline/instrument.mjs",
];

for (const rel of required) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) fail(`falta ${rel}`);
}

const pkgPath = path.resolve(root, "../../package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
if (pkg.scripts?.["skills:ceguera"] !==
  "bash node_modules/@alephscript/skills-scriptorium/skills/swarm-orquestacion/scripts/comprobar-ceguera.sh") {
  fail("package.json sin script skills:ceguera canónico");
}
if (pkg.scripts?.["test:lore-hm"] !== "node playground/prueba-de-H-M/ci/suite.mjs") {
  fail("package.json sin script test:lore-hm");
}

const wf = path.resolve(root, "../../.github/workflows/ci-lore-hm.yml");
if (!fs.existsSync(wf)) fail("falta .github/workflows/ci-lore-hm.yml");

const kitPkg = path.join(root, "package.json");
if (!fs.existsSync(kitPkg)) fail("falta package.json del kit");

const kitNodeModules = path.join(root, "node_modules/ajv");
if (!fs.existsSync(kitNodeModules)) {
  const npm = spawnSync("npm", ["install", "--no-audit", "--no-fund"], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
  if (npm.status !== 0) fail("npm install en kit falló");
}

function runTest(rel, label) {
  const abs = path.join(here, rel);
  const run = spawnSync(process.execPath, [abs], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env },
  });
  if (run.status !== 0) fail(`${label} falló`);
}

runTest("test-100-schemas.mjs", "test-100-schemas.mjs");

// WP-HUB-101 (node --test historically; also try direct)
{
  const test101 = path.join(here, "test-101-ontologia.mjs");
  const r101 = spawnSync(process.execPath, ["--test", test101], {
    stdio: "inherit",
    cwd: path.resolve(root, "../.."),
  });
  if (r101.status !== 0) fail("test-101-ontologia.mjs");
}

runTest("test-102-generador.mjs", "test-102-generador.mjs");
runTest("test-103-podstore.mjs", "test-103-podstore.mjs");
runTest("test-104-onfalo.mjs", "test-104-onfalo.mjs");

// # WP-HUB-105 · cadena lore determinista
const test105 = path.join(here, "test-105-cadena.mjs");
const run105 = spawnSync(process.execPath, [test105], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env },
});
if (run105.status !== 0) fail("test-105-cadena.mjs falló");

// # WP-HUB-106 · ceremonia bilateral 11 pasos
const test106 = path.join(here, "test-106-ceremonia.mjs");
const run106 = spawnSync(process.execPath, [test106], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env },
});
if (run106.status !== 0) fail("test-106-ceremonia.mjs falló");

// # WP-HUB-107 · verificador externo (cierra GHM)
const test107 = path.join(here, "test-107-verificador.mjs");
const run107 = spawnSync(process.execPath, [test107], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env },
});
if (run107.status !== 0) fail("test-107-verificador.mjs falló");

// # WP-HUB-108 · mapa 7×6×24
const test108 = path.join(here, "test-108-mapa.mjs");
const run108 = spawnSync(process.execPath, [test108], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env },
});
if (run108.status !== 0) fail("test-108-mapa.mjs falló");

// # WP-HUB-109 · despertar lore-voz + actas + elenco
const test109 = path.join(here, "test-109-despierta.mjs");
const run109 = spawnSync(process.execPath, [test109], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env },
});
if (run109.status !== 0) fail("test-109-despierta.mjs falló");

// # WP-HUB-110 · matriz negativos + consumidor limpio
runTest("test-110-negativos.mjs", "test-110-negativos.mjs");
runTest("test-110-consumidor-limpio.mjs", "test-110-consumidor-limpio.mjs");

console.log("lore-hm suite: PASS");
console.log(`root: ${root.replaceAll("\\", "/")}`);
process.exit(0);
