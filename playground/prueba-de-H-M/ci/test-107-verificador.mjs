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
});

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
  try {
    const v = verificarEvidencia(isoEvidence);
    if (!v.ok || v.checks.length < 8) {
      fail(`checks insuficientes: ${v.checks?.length}`);
    } else {
      ok(`verificador PASS (${v.checks.length} checks) runId=${v.runId}`);
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
