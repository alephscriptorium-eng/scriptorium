#!/usr/bin/env node
/**
 * WP-HUB-110 · consumidor limpio:
 * npm ci en checkout temporal · generación sin sibling paths ·
 * runtime offline tras seed · rerun determinista · shutdown sin huérfanos.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { runCeremonia } from "../lib/ceremonia/index.mjs";
import { withOfflineGuard } from "../lib/offline/index.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const kitRoot = path.resolve(here, "..");
const hubRoot = path.resolve(kitRoot, "../..");
let failed = 0;

/** Campos de tiempo / aleatorios declarados — excluidos del compare byte-a-byte. */
const TIME_FIELDS = Object.freeze([
  "issuedAt",
  "expiresAt",
  "requestedAt",
  "generatedAt",
  "sealedAt",
  "leaseId",
  "timestamp",
  "signedAt",
]);

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

function listFiles(dir, base = dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    if (name === "node_modules" || name === ".git") continue;
    const abs = path.join(dir, name);
    const st = fs.statSync(abs);
    if (st.isDirectory()) listFiles(abs, base, acc);
    else acc.push(abs);
  }
  return acc;
}

function relPosix(from, to) {
  return path.relative(from, to).split(path.sep).join("/");
}

/**
 * Copia kit a checkout temporal (sin node_modules / .runs).
 * @returns {string}
 */
function materializeTempCheckout() {
  const dst = fs.mkdtempSync(path.join(os.tmpdir(), "hm-110-consumer-"));
  const copyNames = [
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
  ];
  for (const name of copyNames) {
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
    if (rel.startsWith("node_modules/")) continue;
    let text;
    try {
      text = fs.readFileSync(abs, "utf8");
    } catch {
      continue;
    }
    for (const re of SIBLING_PATTERNS) {
      if (re.test(text) || re.test(rel) || re.test(abs)) {
        hits.push(`${rel} ~ ${re}`);
      }
    }
  }
  return hits;
}

/**
 * Normaliza JSON: elimina campos de tiempo declarados (recursivo).
 * @param {unknown} value
 * @returns {unknown}
 */
function stripTimeFields(value) {
  if (Array.isArray(value)) return value.map(stripTimeFields);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (TIME_FIELDS.includes(k)) continue;
      out[k] = stripTimeFields(v);
    }
    return out;
  }
  return value;
}

/**
 * Snapshot de árbol con tiempo strippeado en .json / .jsonld.
 * @param {string} dir
 */
function snapshotNormalized(dir) {
  const out = {};
  for (const abs of listFiles(dir)) {
    const rel = relPosix(dir, abs);
    if (rel.includes("node_modules/")) continue;
    if (rel.includes(".podstore/")) continue;
    const raw = fs.readFileSync(abs);
    if (/\.(json|jsonld)$/i.test(rel)) {
      try {
        const parsed = JSON.parse(raw.toString("utf8"));
        out[rel] = JSON.stringify(stripTimeFields(parsed));
        continue;
      } catch {
        /* fallthrough text */
      }
    }
    // Texto (md/ndjson/…) en utf8 para poder normalizar runId embebido
    if (/\.(md|txt|ndjson|csv)$/i.test(rel) || !rel.includes(".")) {
      out[rel] = raw.toString("utf8");
      continue;
    }
    out[rel] = raw.toString("base64");
  }
  return out;
}

function snapshotsEqual(a, b) {
  const ka = Object.keys(a).sort();
  const kb = Object.keys(b).sort();
  if (ka.join("\0") !== kb.join("\0")) {
    return {
      ok: false,
      reason: `keys diverge +${ka.filter((k) => !b[k]).length}/-${kb.filter((k) => !a[k]).length}`,
    };
  }
  for (const k of ka) {
    if (a[k] !== b[k]) return { ok: false, reason: `byte diverge: ${k}` };
  }
  return { ok: true };
}

function main() {
  // ── 1. npm ci en checkout temporal ──────────────────────────────────────
  const consumerRoot = materializeTempCheckout();
  const npmCi = spawnSync("npm", ["ci", "--no-audit", "--no-fund"], {
    cwd: consumerRoot,
    encoding: "utf8",
    shell: true,
    env: { ...process.env },
  });
  if (npmCi.status !== 0) {
    fail(`npm ci: ${npmCi.stderr || npmCi.stdout}`);
    fs.rmSync(consumerRoot, { recursive: true, force: true });
    console.error(`test-110-consumidor-limpio: FAIL (${failed})`);
    process.exit(1);
  }
  ok("npm ci en checkout temporal");

  // ── 2. generación sin sibling paths ─────────────────────────────────────
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
    { cwd: consumerRoot, encoding: "utf8" },
  );
  if (gen.status !== 0) {
    fail(`generar: ${gen.stderr || gen.stdout}`);
  } else {
    const runRoot = path.join(consumerRoot, ".runs", runId);
    const hits = scanSiblingHits(runRoot);
    if (hits.length > 0) {
      fail(`sibling paths en generación: ${hits.slice(0, 3).join(" | ")}`);
    } else {
      ok("generación sin sibling paths");
    }
  }

  // ── 3–4. offline instrumentado + rerun determinista (mismo runId) ──────
  const detRunId = `${runId}-det`;
  let ceremonyA;
  let ceremonyB;
  try {
    ceremonyA = withOfflineGuard(() =>
      runCeremonia({
        kitRoot: consumerRoot,
        runId: detRunId,
        forceNew: true,
      }),
    );
    if (!ceremonyA.ok || ceremonyA.report?.verdict !== "pass") {
      fail("ceremonia offline verdict≠pass");
    } else {
      ok("runtime offline tras seed (cero salidas no-loopback)");
    }
    const snapA = snapshotNormalized(ceremonyA.evidenceRoot);
    fs.rmSync(ceremonyA.runRoot, { recursive: true, force: true });
    ceremonyB = withOfflineGuard(() =>
      runCeremonia({
        kitRoot: consumerRoot,
        runId: detRunId,
        forceNew: true,
      }),
    );
    if (!ceremonyB.ok) {
      fail("rerun ceremonia falló");
    } else {
      const snapB = snapshotNormalized(ceremonyB.evidenceRoot);
      const cmp = snapshotsEqual(snapA, snapB);
      if (!cmp.ok) fail(`rerun no determinista: ${cmp.reason}`);
      else ok(`rerun byte-a-byte (TIME_FIELDS=${TIME_FIELDS.join(",")})`);
    }
  } catch (e) {
    fail(`offline/rerun: ${e.message || e}`);
  }

  // ── 5. shutdown sin huérfanos ──────────────────────────────────────────
  if (ceremonyB?.ok) {
    const residual = ceremonyB.state?.residualProcesses ?? [];
    if (residual.length > 0) {
      fail(`residualProcesses: ${residual.join(",")}`);
    } else {
      ok("shutdown residualProcesses=[]");
    }
    const pods = ceremonyB.state?.runners ?? [];
    const tipPath = path.join(
      ceremonyB.evidenceRoot,
      "pack/tipestate.json",
    );
    if (fs.existsSync(tipPath)) {
      const tip = JSON.parse(fs.readFileSync(tipPath, "utf8"));
      const badFinals = Object.entries(tip.finals ?? {}).filter(
        ([, st]) => st !== "stopped" && st !== "failed",
      );
      if (badFinals.length > 0) {
        fail(`finals no stopped: ${JSON.stringify(badFinals)}`);
      } else {
        ok("shutdown tipestate finals stopped|failed");
      }
    }
    const locks = listFiles(ceremonyB.runRoot).filter((p) =>
      /\.(lock|pid)$/i.test(p),
    );
    if (locks.length > 0) {
      fail(
        `locks huérfanos: ${locks.map((p) => relPosix(ceremonyB.runRoot, p)).join(",")}`,
      );
    } else {
      ok(`shutdown sin locks/pids (runners=${pods.length})`);
    }
  }

  // ── 6. skills:ceguera desde raíz hub ────────────────────────────────────
  const ceguera = spawnSync("npm", ["run", "skills:ceguera"], {
    cwd: hubRoot,
    encoding: "utf8",
    shell: true,
    env: { ...process.env },
  });
  if (ceguera.status !== 0) {
    // si faltan deps del hub, intentar instalar skills
    if (!fs.existsSync(path.join(hubRoot, "node_modules/@alephscript"))) {
      const hubInstall = spawnSync(
        "npm",
        ["ci", "--no-audit", "--no-fund"],
        {
          cwd: hubRoot,
          encoding: "utf8",
          shell: true,
        },
      );
      if (hubInstall.status !== 0) {
        fail(`hub npm ci (ceguera): ${hubInstall.stderr || hubInstall.stdout}`);
      } else {
        const retry = spawnSync("npm", ["run", "skills:ceguera"], {
          cwd: hubRoot,
          encoding: "utf8",
          shell: true,
        });
        if (retry.status !== 0) {
          fail(`skills:ceguera: ${retry.stderr || retry.stdout}`);
        } else {
          ok("npm run skills:ceguera desde raíz hub PASS");
        }
      }
    } else {
      fail(`skills:ceguera: ${ceguera.stderr || ceguera.stdout}`);
    }
  } else {
    ok("npm run skills:ceguera desde raíz hub PASS");
  }

  // cleanup
  if (!process.env.KEEP_HM_RUNS) {
    fs.rmSync(consumerRoot, { recursive: true, force: true });
  }

  if (failed > 0) {
    console.error(`test-110-consumidor-limpio: FAIL (${failed})`);
    process.exit(1);
  }
  console.log("test-110-consumidor-limpio: PASS");
  process.exit(0);
}

main();
