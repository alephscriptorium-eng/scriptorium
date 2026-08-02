#!/usr/bin/env node
/**
 * WP-HUB-108 · CA mapa 7 holones × 6 distritos × 24 barrios.
 */
import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  CONTEO,
  DISTRITO_HOLON,
  loadSealedMapa,
  parseCenso,
  validateProjection,
} from "../scripts/generar-mapa.mjs";

const here = fileURLToPath(new URL(".", import.meta.url));
const kitRoot = join(here, "..");
const generar = join(kitRoot, "scripts", "generar-mapa.mjs");
const sealedOut = join(kitRoot, "fixtures", "mapa");
const CANTERA =
  "C:/S_LAB/s-sdk/plan/SPRINTS/sprint-game-city/cantera/CIUDAD";
const HOLONES_MD = "C:/S_LAB/s-sdk/DEVOPS/METODOLOGIA/HOLONES.md";
const HOLONES_ROOT = "C:/S_LAB/s-sdk/HOLONES";

let failed = 0;

function ok(msg) {
  console.log(`test-108-mapa: PASS — ${msg}`);
}

function fail(msg) {
  console.error(`test-108-mapa: FAIL — ${msg}`);
  failed += 1;
}

function run(args, cwd = kitRoot) {
  return spawnSync(process.execPath, [generar, ...args], {
    cwd,
    encoding: "utf8",
  });
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

// --- 1. Artefactos sellados presentes ---
for (const rel of [
  "fixtures/mapa/mapa.json",
  "fixtures/mapa/source.manifest.json",
  "fixtures/mapa/ASIGNACION.md",
  "fixtures/mapa/excerpts/CENSO-ESTADOS.md",
  "fixtures/mapa/excerpts/HOLONES.md",
  "fixtures/mapa/excerpts/handoffs-barrios.tsv",
  "scripts/generar-mapa.mjs",
]) {
  if (!existsSync(join(kitRoot, rel))) fail(`falta ${rel}`);
  else ok(`artefacto ${rel}`);
}

// --- 2. CA estructura 7×6×24 ---
const { mapa } = loadSealedMapa(sealedOut);
const errs = validateProjection(mapa);
if (errs.length) fail(`validateProjection: ${errs.join("; ")}`);
else ok("validateProjection 7×6×24");

if (
  mapa.barrios.length === CONTEO.BARRIOS &&
  mapa.distritos.length === CONTEO.DISTRITOS &&
  mapa.holones.length === CONTEO.HOLONES
) {
  ok(`conteos ${CONTEO.HOLONES} holones × ${CONTEO.DISTRITOS} distritos × ${CONTEO.BARRIOS} barrios`);
} else {
  fail(`conteos mal: ${JSON.stringify(mapa.counts)}`);
}

// --- 3. Cada barrio: distrito + holón; cero slugs inventados vs excerpt/censo ---
const excerptCenso = readFileSync(
  join(sealedOut, "excerpts", "CENSO-ESTADOS.md"),
  "utf8",
);
const censoIds = new Set(parseCenso(excerptCenso).map((b) => b.id));
let barrioOk = true;
for (const b of mapa.barrios) {
  if (!b.distrito || !b.holonId) {
    fail(`barrio ${b.id} sin distrito/holón`);
    barrioOk = false;
  }
  if (!censoIds.has(b.id)) {
    fail(`slug inventado ${b.id}`);
    barrioOk = false;
  }
  if (DISTRITO_HOLON[b.distrito] !== b.holonId) {
    fail(`asignación rota ${b.id}`);
    barrioOk = false;
  }
}
if (barrioOk) ok(`${CONTEO.BARRIOS} barrios con distrito+holón; cero slugs inventados`);

// --- 4. Holones ≥1 barrio O razón; 05/06/07 especiales ---
let holOk = true;
for (const h of mapa.holones) {
  const n = (h.barrios || []).length;
  if (n === 0 && !h.razonSinBarrio) {
    fail(`holón ${h.id} sin barrio ni razón`);
    holOk = false;
  }
}
const h05 = mapa.holones.find((h) => h.id === "05");
const h06 = mapa.holones.find((h) => h.id === "06");
const h07 = mapa.holones.find((h) => h.id === "07");
if (h05?.runtimeKind !== "cantera" || h05.barrios.length !== 0 || !h05.razonSinBarrio) {
  fail("holón 05 debe ser cantera sin barrio + razón");
  holOk = false;
}
if (
  h06?.runtimeKind !== "constelacion" ||
  h06.barrios.length !== 0 ||
  !h06.razonSinBarrio
) {
  fail("holón 06 debe ser constelacion sin barrio + razón");
  holOk = false;
}
if (h07?.runtimeKind !== "metodo" || h07.barrios.length !== 0 || !h07.razonSinBarrio) {
  fail("holón 07 debe ser método sin barrio + razón");
  holOk = false;
}
if (holOk) ok("holones 05=cantera 06=constelación 07=método (sin fingir runtime)");

// --- 5. consume-sealed (runtime sin cantera) ---
{
  const r = run(["--consume-sealed"]);
  if (assertExit(r, 0, "consume-sealed")) ok("consume-sealed exit 0");
}

// --- 6. gate (cantera viva si hay mount S; si no, excerpt contrastado en runner) ---
{
  const canteraLive =
    existsSync(join(CANTERA, "CENSO-ESTADOS.md")) && existsSync(HOLONES_MD);
  const gateArgs = canteraLive
    ? [
        "--gate",
        "--cantera-root",
        CANTERA,
        "--holones-md",
        HOLONES_MD,
        "--holones-root",
        HOLONES_ROOT,
      ]
    : ["--gate-sin-cantera"];
  const r = run(gateArgs);
  if (assertExit(r, 0, "gate cantera≡proyección")) {
    ok(
      canteraLive
        ? "gate cantera≡proyección exit 0"
        : "gate DEGRADADO explícito exit 0 (cantera ausente en runner)",
    );
  }

  // --- 6b. ROJO: un gate que pasa cuando la fuente no está no es un gate ---
  // Antes `--gate` con cantera ausente imprimía «gate OK» y salía 0: el mismo
  // resultado que cuando todo va bien.
  {
    const ausente = run(["--gate", "--cantera-root", join(tmpdir(), "cantera-que-no-existe-hm108")]);
    if (ausente.status === 0) {
      fail("gate con cantera ausente debió fallar (exit≠0)");
    } else if (!/gate sin cantera/.test(`${ausente.stderr}${ausente.stdout}`)) {
      fail(`gate ausente falló por otra razón: ${ausente.stderr || ausente.stdout}`);
    } else {
      ok(`gate con cantera ausente falla (exit ${ausente.status})`);
    }
    // y el modo degradado sigue disponible, pero solo si se pide por su nombre
    const degradado = run([
      "--gate-sin-cantera",
      "--cantera-root",
      join(tmpdir(), "cantera-que-no-existe-hm108"),
    ]);
    if (degradado.status !== 0) {
      fail(`--gate-sin-cantera debía pasar: ${degradado.stderr || degradado.stdout}`);
    } else if (!/DEGRADADO/.test(`${degradado.stdout}${degradado.stderr}`)) {
      fail("el gate degradado debe decir que lo es");
    } else {
      ok("--gate-sin-cantera pasa y se declara degradado");
    }
  }

  // --- 7. gate falla si proyección diverge (excerpt/seal roto) ---
  const tmp = mkdtempSync(join(tmpdir(), "hm-108-div-"));
  try {
    mkdirSync(join(tmp, "excerpts"), { recursive: true });
    for (const rel of [
      "mapa.json",
      "source.manifest.json",
      "ASIGNACION.md",
      "excerpts/CENSO-ESTADOS.md",
      "excerpts/HOLONES.md",
      "excerpts/handoffs-barrios.tsv",
      "excerpts/GRAFO-handoffs-counts.json",
    ]) {
      const src = join(sealedOut, rel);
      if (existsSync(src)) {
        mkdirSync(join(tmp, rel, ".."), { recursive: true });
        copyFileSync(src, join(tmp, rel));
      }
    }
    const broken = JSON.parse(readFileSync(join(tmp, "mapa.json"), "utf8"));
    // break excerpt censo (remove a row) → seal hash diverge
    const cens = readFileSync(join(tmp, "excerpts", "CENSO-ESTADOS.md"), "utf8");
    writeFileSync(
      join(tmp, "excerpts", "CENSO-ESTADOS.md"),
      cens.replace(
        /\| vscode-extension \| vscode-extension \| VsCodeExtension \| zigurat \| vivo \|\r?\n/,
        "",
      ),
    );
    const negArgs = canteraLive
      ? ["--gate", "--cantera-root", CANTERA, "--out", tmp]
      : ["--gate", "--out", tmp];
    const rNeg = run(negArgs);
    if (rNeg.status !== 0) {
      ok("gate falla si cantera/proyección divergen (exit≠0)");
    } else {
      fail("gate debió fallar ante divergencia");
    }

    broken.barrios[0].id = "barrio-inventado-xyz";
    broken.barrios[0].slug = "barrio-inventado-xyz";
    const ve = validateProjection(broken);
    if (ve.length > 0) ok("validateProjection rechaza slug inventado");
    else fail("validateProjection debió rechazar slug inventado");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

// --- 8. HOLONES root listing presente en proyección ---
if (Array.isArray(mapa.sources?.holonesRootEntries)) {
  ok(`HOLONES/ root entries=${mapa.sources.holonesRootEntries.length}`);
} else {
  fail("falta sources.holonesRootEntries");
}

if (failed > 0) {
  console.error(`test-108-mapa: FAIL (${failed})`);
  process.exit(1);
}
console.log("test-108-mapa: PASS");
process.exit(0);
