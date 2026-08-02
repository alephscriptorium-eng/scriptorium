#!/usr/bin/env node
/**
 * Suite mínima LORE-HM (WP-HUB-113 + WP-HUB-100 + WP-HUB-102 + WP-HUB-103).
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
  // WP-HUB-102
  "ci/test-102-generador.mjs",
  "scripts/generar.mjs",
  // # WP-HUB-103
  "ci/test-103-podstore.mjs",
  "lib/podstore/LocalPodProvider.mjs",
  "lib/podstore/tipestate.mjs",
  "lib/podstore/acl.mjs",
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

// WP-HUB-100 · schemas dominio + linea-kit reuse
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

const test100 = path.join(here, "test-100-schemas.mjs");
const run100 = spawnSync(process.execPath, [test100], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env },
});
if (run100.status !== 0) fail("test-100-schemas.mjs falló");

// WP-HUB-102 · generador idempotente
const test102 = path.join(here, "test-102-generador.mjs");
const run102 = spawnSync(process.execPath, [test102], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env },
});
if (run102.status !== 0) fail("test-102-generador.mjs falló");

// # WP-HUB-103 · LocalPodProvider / leases / tipestate
const test103 = path.join(here, "test-103-podstore.mjs");
const run103 = spawnSync(process.execPath, [test103], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env },
});
if (run103.status !== 0) fail("test-103-podstore.mjs falló");

console.log("lore-hm suite: PASS");
console.log(`root: ${root.replaceAll("\\", "/")}`);
process.exit(0);
