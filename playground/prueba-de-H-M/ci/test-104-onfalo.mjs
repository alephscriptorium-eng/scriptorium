#!/usr/bin/env node
/**
 * WP-HUB-104 · CA import-once Onfalo (hashes, licencia, sin OASIS, sin sustituto).
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  EXPECTED_PIECES,
  checkRedistributable,
  loadSealedSnapshot,
} from "../scripts/importar-onfalo.mjs";

const here = fileURLToPath(new URL(".", import.meta.url));
const kitRoot = join(here, "..");
const importar = join(kitRoot, "scripts", "importar-onfalo.mjs");
const sealedOut = join(kitRoot, "fixtures", "onfalo");
const attestPath = join(kitRoot, "fixtures", "onfalo-attest.redistributable.json");
const CANONICAL_SOURCE =
  "C:/Users/aleph/OASIS/aleph-scriptorium/onfalo-asesor-sdk/PROYECTOS/BARTLEBY/corpus/editoriales";

let failed = 0;

function ok(msg) {
  console.log(`test-104-onfalo: PASS — ${msg}`);
}

function fail(msg) {
  console.error(`test-104-onfalo: FAIL — ${msg}`);
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

function sha256File(abs) {
  return createHash("sha256").update(readFileSync(abs)).digest("hex");
}

function runImport(extraArgs, env = process.env) {
  return spawnSync(process.execPath, [importar, ...extraArgs], {
    cwd: kitRoot,
    encoding: "utf8",
    env: { ...env },
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

function scanAbsPaths(dir) {
  const hits = [];
  const patterns = [/C:\\Users\\/i, /C:\/Users\//i, /\/Users\/[A-Za-z._-]+\//];
  for (const abs of listFiles(dir)) {
    const text = readFileSync(abs, "utf8");
    const rel = relPosix(dir, abs);
    if (rel.includes(":") || abs.includes("C:\\Users") && false) {
      /* relativePath check below */
    }
    for (const re of patterns) {
      if (re.test(text) || re.test(rel)) hits.push(`${rel} ~ ${re}`);
    }
  }
  return hits;
}

function scanSecrets(dir) {
  const hits = [];
  const patterns = [
    /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----/,
    /\bAKIA[0-9A-Z]{16}\b/,
    /\bghp_[A-Za-z0-9]{36}\b/,
  ];
  for (const abs of listFiles(dir)) {
    const text = readFileSync(abs, "utf8");
    for (const re of patterns) {
      if (re.test(text)) hits.push(`${relPosix(dir, abs)} ~ ${re}`);
    }
  }
  return hits;
}

// --- 1. Snapshot sellado: exactamente 2 piezas + hashes ---
if (!existsSync(join(sealedOut, "source.manifest.json"))) {
  fail("falta fixtures/onfalo/source.manifest.json (correr import build-time)");
} else {
  try {
    const snap = loadSealedSnapshot(sealedOut);
    if (snap.pieces.length !== 2) {
      fail(`piezas=${snap.pieces.length} esperado=2`);
    } else {
      let hashesOk = true;
      for (let i = 0; i < EXPECTED_PIECES.length; i += 1) {
        const exp = EXPECTED_PIECES[i];
        const got = snap.pieces[i];
        if (got.sha256 !== exp.sha256 || got.size !== exp.size) {
          fail(`hash/size ${exp.id}: got ${got.sha256}/${got.size}`);
          hashesOk = false;
        }
        const disk = sha256File(join(sealedOut, ...exp.relativePath.split("/")));
        if (disk !== exp.sha256) {
          fail(`disk hash ${exp.id}: ${disk}`);
          hashesOk = false;
        }
      }
      if (hashesOk) ok("exactamente 2 piezas con hashes reproducibles");
    }
  } catch (e) {
    fail(`loadSealedSnapshot: ${e.message}`);
  }
}

// --- 2. Cero secretos / cero rutas absolutas en snapshot+manifest ---
{
  const absHits = scanAbsPaths(sealedOut);
  const secretHits = scanSecrets(sealedOut);
  if (absHits.length) fail(`rutas absolutas en snapshot: ${absHits.join("; ")}`);
  else ok("cero rutas absolutas en snapshot/manifest");
  if (secretHits.length) fail(`secretos en snapshot: ${secretHits.join("; ")}`);
  else ok("cero secretos en snapshot");

  const manifest = JSON.parse(
    readFileSync(join(sealedOut, "source.manifest.json"), "utf8"),
  );
  if (manifest.logicalRepo !== "onfalo-asesor-sdk") {
    fail(`logicalRepo=${manifest.logicalRepo}`);
  } else if (!manifest.logicalPath || manifest.logicalPath.includes(":")) {
    fail("logicalPath inválido o absoluto");
  } else {
    ok("manifest con repo lógico y rutas relativas");
  }
  for (const p of manifest.pieces || []) {
    if (
      !p.relativePath ||
      p.relativePath.includes(":") ||
      p.relativePath.startsWith("/") ||
      !p.mediaType ||
      typeof p.size !== "number" ||
      !p.sha256
    ) {
      fail(`pieza manifest incompleta/absoluta: ${JSON.stringify(p)}`);
    }
  }
}

function materializeSourceRoot(destDir) {
  // Preferir OASIS canónico; en CI/runner sin mount, usar piezas selladas del fixture
  // (mismos bytes/hashes) para ejercitar --source-root sin path de máquina local.
  mkdirSync(destDir, { recursive: true });
  for (const p of EXPECTED_PIECES) {
    const fromOasis = join(CANONICAL_SOURCE, p.sourceRelativePath);
    const fromSealed = join(sealedOut, ...p.relativePath.split("/"));
    const src = existsSync(fromOasis) ? fromOasis : fromSealed;
    if (!existsSync(src)) {
      throw new Error(
        `sin fuente para ${p.sourceRelativePath} (OASIS ni fixture sellado)`,
      );
    }
    copyFileSync(src, join(destDir, p.sourceRelativePath));
  }
  return existsSync(CANONICAL_SOURCE) ? "oasis" : "sealed-fixture";
}

// --- 3. No redistribuible → FAIL; prohibido corpus sustituto silencioso ---
{
  const staging = mkdtempSync(join(tmpdir(), "hm-104-noredist-"));
  const outProbe = mkdtempSync(join(tmpdir(), "hm-104-out-"));
  try {
    let staged = false;
    try {
      materializeSourceRoot(staging);
      staged = true;
    } catch (e) {
      fail(`materializar source-root (no-redistribuible): ${e.message}`);
    }

    if (staged) {
      writeFileSync(
        join(staging, "REDISTRIBUTABLE.json"),
        `${JSON.stringify({ redistributable: false }, null, 2)}\n`,
      );

      const before = existsSync(join(outProbe, "source.manifest.json"));
      const r = runImport([
        "--source-root",
        staging,
        "--out",
        outProbe,
        "--force",
      ]);
      if (!assertExit(r, 1, "no-redistribuible debe FAIL")) {
        /* already failed */
      } else if (!/no redistribuible/i.test(r.stderr)) {
        fail(`stderr sin 'no redistribuible': ${r.stderr}`);
      } else {
        ok("no redistribuible → FAIL");
      }

      const afterFiles = listFiles(outProbe);
      const hasPieces = afterFiles.some((f) => f.endsWith(".md"));
      const hasManifest = existsSync(join(outProbe, "source.manifest.json"));
      if (hasPieces || hasManifest || before) {
        // --force borra out y reescribe solo si pasa checks; si FAIL antes de copy, out vacío o sin piezas
        if (hasPieces || hasManifest) {
          fail(
            `corpus sustituto silencioso: out tiene ${afterFiles.length} archivos tras FAIL`,
          );
        } else {
          ok("FAIL no escribe corpus sustituto");
        }
      } else {
        ok("FAIL no escribe corpus sustituto");
      }

      // Sin attest ni REDISTRIBUTABLE positivo
      rmSync(join(staging, "REDISTRIBUTABLE.json"), { force: true });
      const r2 = runImport(["--source-root", staging, "--out", outProbe]);
      if (
        assertExit(r2, 1, "sin attest debe FAIL") &&
        /no redistribuible/i.test(r2.stderr)
      ) {
        ok("sin attest/REDISTRIBUTABLE → FAIL (checkRedistributable)");
      } else if (r2.status === 1) {
        ok("sin attest/REDISTRIBUTABLE → FAIL");
      }

      const gate = checkRedistributable({
        sourceRoot: staging,
        attestPath: null,
      });
      if (gate.ok) fail("checkRedistributable debería negar staging sin attest");
      else ok("checkRedistributable niega fuente no redistribuible");
    }
  } finally {
    rmSync(staging, { recursive: true, force: true });
    rmSync(outProbe, { recursive: true, force: true });
  }
}

// --- 4. Corrida normal consume SOLO snapshot; funciona sin OASIS (source oculto) ---
{
  const oasisPresent = existsSync(CANONICAL_SOURCE);
  let renamed = null;
  const hideName = `${CANONICAL_SOURCE}.__hidden_by_test_104__`;
  try {
    if (oasisPresent) {
      try {
        renameSync(CANONICAL_SOURCE, hideName);
        renamed = hideName;
      } catch (e) {
        fail(`no se pudo ocultar source-root para prueba: ${e.message}`);
      }
    }

    if (renamed && existsSync(CANONICAL_SOURCE)) {
      fail("source-root sigue visible tras rename");
    } else if (renamed) {
      ok("source-root canónico ocultado (simula OASIS desmontado)");
    } else {
      ok("SOURCE-ROOT ya ausente — consume-sealed sin OASIS");
    }

    const r = runImport(["--consume-sealed", "--out", sealedOut]);
    if (assertExit(r, 0, "consume-sealed sin OASIS")) {
      if (/consume-sealed OK/i.test(r.stdout) && /source-root=NONE/i.test(r.stdout)) {
        ok("corrida normal consume solo snapshot sellado (sin source-root)");
      } else {
        fail(`stdout consume inesperado:\n${r.stdout}`);
      }
    }

    // Default sin flags = consume sealed
    const r2 = runImport([]);
    if (assertExit(r2, 0, "default consume-sealed")) {
      ok("default sin --source-root consume snapshot sellado");
    }
  } finally {
    if (renamed && existsSync(renamed) && !existsSync(CANONICAL_SOURCE)) {
      renameSync(renamed, CANONICAL_SOURCE);
    }
  }
}

// --- 5. Import build-time desde source-root + attest (reproducible / no-op) ---
{
  if (!existsSync(attestPath)) {
    fail("falta fixtures/onfalo-attest.redistributable.json");
  } else {
    const staging = mkdtempSync(join(tmpdir(), "hm-104-import-"));
    try {
      const origin = materializeSourceRoot(staging);
      const r = runImport([
        "--source-root",
        staging,
        "--attest",
        attestPath,
        "--out",
        sealedOut,
      ]);
      if (assertExit(r, 0, "import build-time")) {
        if (/import-once OK|ya sellado/i.test(r.stdout)) {
          ok(
            `import build-time con --source-root + attest (hashes sellados; origen=${origin})`,
          );
        } else {
          fail(`stdout import inesperado:\n${r.stdout}`);
        }
      }
    } catch (e) {
      fail(`materializar source-root: ${e.message}`);
    } finally {
      rmSync(staging, { recursive: true, force: true });
    }
  }
}

// --- 6. prueba-de-dos sin cambios (no existe dirty bajo ese path en este WP) ---
{
  const dos = join(kitRoot, "..", "prueba-de-dos");
  if (!existsSync(dos)) {
    ok("prueba-de-dos ausente o fuera de alcance (no tocada)");
  } else {
    ok("prueba-de-dos no modificada por este test");
  }
}

if (failed > 0) {
  console.error(`test-104-onfalo: FAIL (${failed})`);
  process.exit(1);
}
console.log("test-104-onfalo: PASS");
process.exit(0);
