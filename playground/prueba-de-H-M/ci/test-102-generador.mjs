#!/usr/bin/env node
/**
 * WP-HUB-102 · CA del generador idempotente.
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const here = fileURLToPath(new URL(".", import.meta.url));
const kitRoot = join(here, "..");
const generar = join(kitRoot, "scripts", "generar.mjs");
const runsRoot = join(kitRoot, ".runs");
const RUN_ID = `test-102-${process.pid}`;
const runDir = join(runsRoot, RUN_ID);

let failed = 0;

function ok(msg) {
  console.log(`test-102-generador: PASS — ${msg}`);
}

function fail(msg) {
  console.error(`test-102-generador: FAIL — ${msg}`);
  failed += 1;
}

function relPosix(from, to) {
  return relative(from, to).split(sep).join("/");
}

function listFiles(dir, base = dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) listFiles(abs, base, acc);
    else acc.push(abs);
  }
  return acc;
}

function runGenerar(extraArgs = []) {
  const args = [
    generar,
    "--scenario",
    "barrio-lore",
    "--run",
    RUN_ID,
    "--sin-install",
    ...extraArgs,
  ];
  return spawnSync(process.execPath, args, {
    cwd: kitRoot,
    encoding: "utf8",
    env: { ...process.env },
  });
}

function cleanup() {
  if (existsSync(runDir)) rmSync(runDir, { recursive: true, force: true });
}

function assertExit(r, code, label) {
  if (r.status !== code) {
    fail(
      `${label}: exit=${r.status} esperado=${code}\nstdout:\n${r.stdout}\nstderr:\n${r.stderr}`,
    );
    return false;
  }
  return true;
}

function snapshotTree(dir) {
  const out = {};
  for (const abs of listFiles(dir)) {
    out[relPosix(dir, abs)] = readFileSync(abs, "utf8");
  }
  return out;
}

function treesEqual(a, b) {
  const ka = Object.keys(a).sort();
  const kb = Object.keys(b).sort();
  if (ka.join("\0") !== kb.join("\0")) return false;
  return ka.every((k) => a[k] === b[k]);
}

// --- prep ---
cleanup();
mkdirSync(runsRoot, { recursive: true });

if (!existsSync(generar)) {
  fail(`falta ${relPosix(kitRoot, generar)}`);
  process.exit(1);
}

// 1) primera corrida crea
{
  const r = runGenerar();
  if (assertExit(r, 0, "primera corrida")) {
    if (!existsSync(join(runDir, "manifest.json"))) fail("falta manifest.json");
    else if (!existsSync(join(runDir, "H", "handoff.md"))) fail("falta H/handoff.md");
    else if (!existsSync(join(runDir, "M", "handoff.md"))) fail("falta M/handoff.md");
    else if (!existsSync(join(runDir, "room.json"))) fail("falta room.json");
    else if (!existsSync(join(runDir, "evidence"))) fail("falta evidence/");
    else {
      const man = JSON.parse(readFileSync(join(runDir, "manifest.json"), "utf8"));
      if (!man.seal?.startsWith("sha256:")) fail("manifest sin seal sha256");
      else if (!r.stdout.includes('"status": "created"')) fail("stdout sin status created");
      else ok("primera corrida materializa H/M/evidence/manifest sellado");
    }
  }
}

const snapAfterCreate = snapshotTree(runDir);

// 2) segunda corrida = no-op medido
{
  const r = runGenerar();
  if (assertExit(r, 0, "segunda corrida")) {
    if (!r.stdout.includes('"status": "no-op"')) fail("segunda corrida sin status no-op");
    else if (!/"filesChecked":\s*[1-9]/.test(r.stdout)) fail("no-op sin filesChecked>0");
    else if (!/"written":\s*0/.test(r.stdout)) fail("no-op sin written:0");
    else if (!treesEqual(snapAfterCreate, snapshotTree(runDir))) {
      fail("segunda corrida mutó el árbol (no es no-op)");
    } else ok("dos corridas seguidas = no-op medido");
  }
}

// 3) drift de manifest falla y no sobrescribe
{
  const manifestPath = join(runDir, "manifest.json");
  const original = readFileSync(manifestPath, "utf8");
  const man = JSON.parse(original);
  man.seal = "sha256:" + "0".repeat(64);
  writeFileSync(manifestPath, `${JSON.stringify(man, null, 2)}\n`);
  const before = snapshotTree(runDir);
  const r = runGenerar();
  const after = snapshotTree(runDir);
  if (r.status === 0) fail("drift manifest debió fallar (exit≠0)");
  else if (!/drift de manifest/i.test(r.stderr)) fail("stderr sin 'drift de manifest'");
  else if (!treesEqual(before, after)) fail("drift manifest sobrescribió el árbol");
  else ok("drift de manifest falla ruidoso y no sobrescribe");
  // restaurar para siguiente caso
  writeFileSync(manifestPath, original);
}

// 4) drift de artefactos falla y no sobrescribe
{
  // re-sync a estado bueno
  const r0 = runGenerar(["--force-new"]);
  if (!assertExit(r0, 0, "force-new tras drift manifest")) {
    cleanup();
    process.exit(1);
  }
  const handoff = join(runDir, "H", "handoff.md");
  const originalHandoff = readFileSync(handoff, "utf8");
  writeFileSync(handoff, originalHandoff + "\n<!-- DRIFT-TEST -->\n");
  const before = snapshotTree(runDir);
  const r = runGenerar();
  const after = snapshotTree(runDir);
  if (r.status === 0) fail("drift artefactos debió fallar (exit≠0)");
  else if (!/drift de artefactos/i.test(r.stderr)) fail("stderr sin 'drift de artefactos'");
  else if (!treesEqual(before, after)) fail("drift artefactos sobrescribió el árbol");
  else if (!after["H/handoff.md"].includes("DRIFT-TEST")) {
    fail("handoff alterado fue restaurado (overwrite indebido)");
  } else ok("drift de artefactos falla ruidoso y no sobrescribe");
}

// 5) grep cero rutas de máquina en generado
{
  const r0 = runGenerar(["--force-new"]);
  if (!assertExit(r0, 0, "force-new para grep rutas")) {
    cleanup();
    process.exit(1);
  }
  const hits = [];
  for (const abs of listFiles(runDir)) {
    const body = readFileSync(abs, "utf8");
    if (/C:\\Users/i.test(body) || /C:\/Users/i.test(body)) {
      hits.push(relPosix(runDir, abs));
    }
  }
  if (hits.length) fail(`rutas de máquina en: ${hits.join(", ")}`);
  else ok("grep cero C:\\Users / C:/Users en generado");
}

// 6) resume solo si manifest coincide
{
  // estado limpio ya de (5)
  const rOk = runGenerar();
  if (!assertExit(rOk, 0, "resume con manifest coincidente")) {
    /* counted */
  } else if (!rOk.stdout.includes('"status": "no-op"')) {
    fail("resume con manifest OK no fue no-op");
  } else ok("reanuda (no-op) sólo si el manifest coincide");

  const manPath = join(runDir, "manifest.json");
  const man = JSON.parse(readFileSync(manPath, "utf8"));
  man.scenarioId = "tampered-scenario";
  // sellar distinto
  man.seal = "sha256:" + "f".repeat(64);
  writeFileSync(manPath, `${JSON.stringify(man, null, 2)}\n`);
  const rBad = runGenerar();
  if (rBad.status === 0) fail("resume con manifest distinto debió fallar");
  else if (!/no se sobrescribe/i.test(rBad.stderr) && !/drift/i.test(rBad.stderr)) {
    fail("resume negado sin mensaje de drift/no-overwrite");
  } else ok("no reanuda si el manifest no coincide");
}

// 7) flags obligatorios sin defaults silenciosos
{
  const r1 = spawnSync(process.execPath, [generar, "--run", "x", "--sin-install"], {
    cwd: kitRoot,
    encoding: "utf8",
  });
  const r2 = spawnSync(
    process.execPath,
    [generar, "--scenario", "barrio-lore", "--sin-install"],
    { cwd: kitRoot, encoding: "utf8" },
  );
  if (r1.status === 0 || r2.status === 0) fail("debió exigir --scenario y --run");
  else ok("--scenario y --run obligatorios (sin defaults silenciosos)");
}

// frontera: no tocar prueba-de-dos
{
  const git = spawnSync(
    "git",
    ["-C", join(kitRoot, "../.."), "status", "--porcelain", "playground/prueba-de-dos"],
    { encoding: "utf8" },
  );
  if (git.status !== 0) fail("git status prueba-de-dos falló");
  else if (git.stdout.trim()) fail(`prueba-de-dos sucio:\n${git.stdout}`);
  else ok("prueba-de-dos sin cambios");
}

cleanup();

if (failed > 0) {
  console.error(`test-102-generador: FAIL (${failed} casos)`);
  process.exit(1);
}
console.log("test-102-generador: PASS");
process.exit(0);
