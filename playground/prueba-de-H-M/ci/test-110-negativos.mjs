#!/usr/bin/env node
/**
 * WP-HUB-110 · matriz de negativos (frontera propia + cero estado parcial).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  MATRIX,
  NEG_FRONTIER,
  NegativoError,
} from "../lib/negativos/index.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const kitRoot = path.resolve(here, "..");
let failed = 0;

function ok(msg) {
  console.log(`test-110-negativos: PASS — ${msg}`);
}

function fail(msg) {
  console.error(`test-110-negativos: FAIL — ${msg}`);
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

function expectFrontier(frontier, run) {
  try {
    run(kitRoot);
    fail(`negativo «${frontier}» debió fallar`);
  } catch (e) {
    if (e instanceof NegativoError && e.frontier === frontier) {
      ok(`negativo «${frontier}»`);
    } else {
      fail(
        `negativo «${frontier}»: got ${e?.frontier || e?.message || e}`,
      );
    }
  }
}

function main() {
  ensureDeps();

  const expected = [
    NEG_FRONTIER.CORPUS_AUSENTE,
    NEG_FRONTIER.HASH_ROTO,
    NEG_FRONTIER.SCHEMA_INVALIDO,
    NEG_FRONTIER.POD_SIN_LEASE,
    NEG_FRONTIER.VECTORMOCK_NO_DECLARADO,
    NEG_FRONTIER.UPSTREAM_AUSENTE,
    NEG_FRONTIER.RUNNER_CAIDO,
  ];

  if (MATRIX.length !== expected.length) {
    fail(`MATRIX size ${MATRIX.length} ≠ ${expected.length}`);
  }

  for (const row of MATRIX) {
    if (!expected.includes(row.frontier)) {
      fail(`frontera inesperada: ${row.frontier}`);
      continue;
    }
    expectFrontier(row.frontier, row.run);
  }

  // Cero .runs residuales de negativos
  const runsRoot = path.join(kitRoot, ".runs");
  if (fs.existsSync(runsRoot)) {
    const leftovers = fs
      .readdirSync(runsRoot)
      .filter((n) => n.startsWith("neg-"));
    if (leftovers.length > 0) {
      fail(`estado parcial .runs: ${leftovers.join(",")}`);
    } else {
      ok("cero estado parcial .runs/neg-*");
    }
  } else {
    ok("cero estado parcial (.runs ausente)");
  }

  if (failed > 0) {
    console.error(`test-110-negativos: FAIL (${failed})`);
    process.exit(1);
  }
  console.log("test-110-negativos: PASS");
  process.exit(0);
}

main();
