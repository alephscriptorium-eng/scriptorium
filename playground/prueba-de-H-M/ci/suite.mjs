#!/usr/bin/env node
/**
 * Suite mínima LORE-HM (WP-HUB-113).
 * Bloquea si falta el arnés o si está plantado el vector rojo.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

console.log("lore-hm suite: PASS");
console.log(`root: ${root.replaceAll("\\", "/")}`);
process.exit(0);
