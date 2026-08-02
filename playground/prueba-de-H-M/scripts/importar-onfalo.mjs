#!/usr/bin/env node
/**
 * WP-HUB-104 · import-once build-time de corpus Onfalo (simulacro playground).
 *
 * Uso:
 *   # Build-time: licencia+secretos ANTES de copiar; escribe snapshot sellado
 *   node scripts/importar-onfalo.mjs --source-root <path> [--attest <path>] [--out <dir>] [--force]
 *
 *   # Corrida normal: consume SOLO el snapshot sellado (sin OASIS / sin source-root)
 *   node scripts/importar-onfalo.mjs --consume-sealed [--out <dir>]
 *
 * Spike 112: Future Machine NO CORRE — kit = simulacro playground.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { findMachinePath, assertNoMachinePaths } from "../lib/rutas-maquina.mjs";

const KIT_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DEFAULT_OUT = join(KIT_ROOT, "fixtures", "onfalo");

/** Piezas exactas del BRIEF (hashes medidos sobre SOURCE-ROOT canónico). */
export const EXPECTED_PIECES = Object.freeze([
  Object.freeze({
    id: "2024-05-01_primero-de-mayo",
    sourceRelativePath: "2024-05-01_primero-de-mayo.md",
    relativePath: "pieces/2024-05-01_primero-de-mayo.md",
    mediaType: "text/markdown",
    size: 26228,
    sha256: "a186993d4420792d94a261ed68a801793af033a5fe32f0b00be224c780c9796a",
  }),
  Object.freeze({
    id: "2026-05-01_auge-de-la-educacion-emocional",
    sourceRelativePath: "2026-05-01_auge-de-la-educacion-emocional.md",
    relativePath: "pieces/2026-05-01_auge-de-la-educacion-emocional.md",
    mediaType: "text/markdown",
    size: 12388,
    sha256: "86f3cb6deb8d01cef4546a81fc650fff0913291aeb7ad3dfa504d9a7c02186f0",
  }),
]);

const LOGICAL_REPO = "onfalo-asesor-sdk";
const LOGICAL_PATH = "PROYECTOS/BARTLEBY/corpus/editoriales";

const SECRET_PATTERNS = [
  /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bghp_[A-Za-z0-9]{36}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/,
  /\b(api[_-]?key|secret[_-]?key|access[_-]?token|auth[_-]?token)\s*[:=]\s*['"][^'"]{8,}['"]/i,
  /\bpassword\s*[:=]\s*['"][^'"]{6,}['"]/i,
];

// Raíz única compartida con generar.mjs — antes eran dos listas distintas y
// ninguna cubría C:/S_LAB/.

function fail(msg, code = 1) {
  console.error(`[importar-onfalo] FAIL — ${msg}`);
  process.exit(code);
}

function usage() {
  console.error(`uso:
  node scripts/importar-onfalo.mjs --source-root <path> [--attest <path>] [--out <dir>] [--force]
  node scripts/importar-onfalo.mjs --consume-sealed [--out <dir>]`);
  process.exit(2);
}

function parseArgs(argv) {
  const out = {
    sourceRoot: null,
    attest: null,
    outDir: DEFAULT_OUT,
    force: false,
    consumeSealed: false,
  };
  const args = argv.slice(2);
  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    if (a === "--help" || a === "-h") usage();
    if (a === "--force") {
      out.force = true;
      continue;
    }
    if (a === "--consume-sealed" || a === "--sealed-only") {
      out.consumeSealed = true;
      continue;
    }
    if (a === "--source-root") {
      const v = args[++i];
      if (!v || v.startsWith("--")) fail("--source-root requiere valor", 2);
      out.sourceRoot = v;
      continue;
    }
    if (a === "--attest") {
      const v = args[++i];
      if (!v || v.startsWith("--")) fail("--attest requiere valor", 2);
      out.attest = v;
      continue;
    }
    if (a === "--out") {
      const v = args[++i];
      if (!v || v.startsWith("--")) fail("--out requiere valor", 2);
      out.outDir = resolve(KIT_ROOT, v);
      continue;
    }
    fail(`flag desconocida: ${a}`, 2);
  }
  return out;
}

function sha256Buffer(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  const keys = Object.keys(value).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(",")}}`;
}

function findSecret(text) {
  for (const re of SECRET_PATTERNS) {
    if (re.test(text)) return re;
  }
  return null;
}

function findAbsolutePath(text) {
  return findMachinePath(text);
}

function assertNoSecrets(text, label) {
  const hit = findSecret(text);
  if (hit) throw new Error(`secreto detectado en ${label} (patrón ${hit})`);
}

function assertNoAbsolutePaths(text, label) {
  assertNoMachinePaths(text, label);
}

/**
 * Licencia/redistribución ANTES de copiar.
 * Acepta REDISTRIBUTABLE.json en source-root o --attest externo.
 * Sin señal positiva → FAIL (cero corpus sustituto).
 */
export function checkRedistributable({ sourceRoot, attestPath }) {
  const candidates = [];
  if (attestPath) candidates.push(resolve(attestPath));
  if (sourceRoot) {
    candidates.push(join(sourceRoot, "REDISTRIBUTABLE.json"));
    candidates.push(join(sourceRoot, ".onfalo-redistributable.json"));
  }

  let found = null;
  for (const p of candidates) {
    if (p && existsSync(p)) {
      found = p;
      break;
    }
  }

  if (!found) {
    return {
      ok: false,
      reason:
        "no redistribuible: falta REDISTRIBUTABLE.json en source-root o --attest",
    };
  }

  let doc;
  try {
    doc = JSON.parse(readFileSync(found, "utf8"));
  } catch (e) {
    return { ok: false, reason: `attest ilegible: ${found}: ${e.message}` };
  }

  if (doc.redistributable !== true) {
    return {
      ok: false,
      reason: `no redistribuible: ${found} declara redistributable≠true`,
    };
  }

  if (Array.isArray(doc.allowedSha256) && doc.allowedSha256.length > 0) {
    const allowed = new Set(doc.allowedSha256.map((h) => String(h).toLowerCase()));
    for (const piece of EXPECTED_PIECES) {
      if (!allowed.has(piece.sha256.toLowerCase())) {
        return {
          ok: false,
          reason: `no redistribuible: sha256 ${piece.sha256} fuera del attest`,
        };
      }
    }
  }

  return { ok: true, attestPath: found, doc };
}

function readSourcePiece(sourceRoot, piece) {
  const abs = join(sourceRoot, piece.sourceRelativePath);
  if (!existsSync(abs)) {
    throw new Error(`pieza ausente en source-root: ${piece.sourceRelativePath}`);
  }
  const buf = readFileSync(abs);
  const sha = sha256Buffer(buf);
  if (sha !== piece.sha256) {
    throw new Error(
      `hash no reproducible para ${piece.sourceRelativePath}: got=${sha} expected=${piece.sha256}`,
    );
  }
  if (buf.length !== piece.size) {
    throw new Error(
      `size mismatch ${piece.sourceRelativePath}: got=${buf.length} expected=${piece.size}`,
    );
  }
  const text = buf.toString("utf8");
  assertNoSecrets(text, piece.sourceRelativePath);
  return buf;
}

function buildManifest(piecesMeta) {
  const body = {
    schemaVersion: "1.0.0",
    kind: "onfalo-import-once",
    mode: "import-once",
    logicalRepo: LOGICAL_REPO,
    logicalPath: LOGICAL_PATH,
    simulacro: {
      futureMachine: true,
      declared:
        "Future Machine no corre hoy; snapshot Onfalo es fixture playground (spike WP-HUB-112).",
      runtime: "playground-mock",
    },
    pieceCount: piecesMeta.length,
    pieces: piecesMeta,
  };
  const seal = sha256Buffer(Buffer.from(stableStringify(body), "utf8"));
  return { ...body, seal: { alg: "sha256", value: seal } };
}

function writeSnapshot(outDir, pieceBuffers, { force }) {
  if (existsSync(outDir)) {
    if (!force) {
      // Idempotente si el sello coincide
      try {
        const existing = loadSealedSnapshot(outDir);
        const ok =
          existing.pieces.length === EXPECTED_PIECES.length &&
          existing.pieces.every(
            (p, i) =>
              p.sha256 === EXPECTED_PIECES[i].sha256 &&
              p.relativePath === EXPECTED_PIECES[i].relativePath,
          );
        if (ok) {
          console.log(
            `[importar-onfalo] snapshot ya sellado (no-op) out=${posixPath(outDir)}`,
          );
          return existing.manifest;
        }
      } catch {
        /* rewrite with --force or continue to fail below */
      }
      fail(
        `out ya existe y difiere del sello esperado (use --force): ${posixPath(outDir)}`,
      );
    }
    rmSync(outDir, { recursive: true, force: true });
  }

  mkdirSync(join(outDir, "pieces"), { recursive: true });

  const piecesMeta = [];
  for (let i = 0; i < EXPECTED_PIECES.length; i += 1) {
    const piece = EXPECTED_PIECES[i];
    const buf = pieceBuffers[i];
    const dest = join(outDir, ...piece.relativePath.split("/"));
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, buf);
    piecesMeta.push({
      id: piece.id,
      relativePath: piece.relativePath,
      sourceRelativePath: piece.sourceRelativePath,
      mediaType: piece.mediaType,
      size: piece.size,
      sha256: piece.sha256,
    });
  }

  const manifest = buildManifest(piecesMeta);
  const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;
  assertNoAbsolutePaths(manifestText, "source.manifest.json");
  assertNoSecrets(manifestText, "source.manifest.json");
  writeFileSync(join(outDir, "source.manifest.json"), manifestText, "utf8");

  // Copia attest de redistribución al snapshot (rutas relativas / lógicas)
  writeFileSync(
    join(outDir, "REDISTRIBUTABLE.json"),
    `${JSON.stringify(
      {
        redistributable: true,
        scope: "playground-fixture",
        logicalRepo: LOGICAL_REPO,
        logicalPath: LOGICAL_PATH,
        allowedSha256: EXPECTED_PIECES.map((p) => p.sha256),
        note: "Attest de fixture LORE-HM; no implica licencia del corpus OASIS completo.",
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  return manifest;
}

function posixPath(p) {
  return String(p).split(sep).join("/");
}

/** Consume snapshot sellado (corrida normal; sin source-root). */
export function loadSealedSnapshot(outDir = DEFAULT_OUT) {
  const manifestPath = join(outDir, "source.manifest.json");
  if (!existsSync(manifestPath)) {
    throw new Error(`snapshot ausente: ${posixPath(manifestPath)}`);
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const manifestRaw = readFileSync(manifestPath, "utf8");
  assertNoAbsolutePaths(manifestRaw, "source.manifest.json");
  assertNoSecrets(manifestRaw, "source.manifest.json");

  if (manifest.logicalRepo !== LOGICAL_REPO) {
    throw new Error(`logicalRepo inesperado: ${manifest.logicalRepo}`);
  }
  if (
    !Array.isArray(manifest.pieces) ||
    manifest.pieces.length !== EXPECTED_PIECES.length
  ) {
    throw new Error(`se esperaban exactamente 2 piezas, got=${manifest.pieces?.length}`);
  }

  const pieces = [];
  for (let i = 0; i < EXPECTED_PIECES.length; i += 1) {
    const expected = EXPECTED_PIECES[i];
    const meta = manifest.pieces[i];
    if (!meta || meta.sha256 !== expected.sha256) {
      throw new Error(
        `pieza ${i} sha256 mismatch: manifest=${meta?.sha256} expected=${expected.sha256}`,
      );
    }
    if (meta.relativePath !== expected.relativePath) {
      throw new Error(
        `pieza ${i} relativePath mismatch: ${meta.relativePath} ≠ ${expected.relativePath}`,
      );
    }
    if (meta.relativePath.includes(":") || meta.relativePath.startsWith("/")) {
      throw new Error(`ruta no relativa en manifest: ${meta.relativePath}`);
    }
    const abs = join(outDir, ...meta.relativePath.split("/"));
    if (!existsSync(abs)) {
      throw new Error(`pieza sellada ausente: ${meta.relativePath}`);
    }
    const buf = readFileSync(abs);
    const sha = sha256Buffer(buf);
    if (sha !== expected.sha256 || buf.length !== expected.size) {
      throw new Error(`integridad rota: ${meta.relativePath}`);
    }
    const text = buf.toString("utf8");
    assertNoSecrets(text, meta.relativePath);
    assertNoAbsolutePaths(meta.relativePath, "relativePath");
    pieces.push({ ...meta, bytes: buf });
  }

  // Re-sello
  const { seal: _drop, ...body } = manifest;
  const reseal = sha256Buffer(Buffer.from(stableStringify(body), "utf8"));
  if (manifest.seal?.value !== reseal) {
    throw new Error("seal de source.manifest.json no coincide");
  }

  return { manifest, pieces, outDir };
}

function importOnce({ sourceRoot, attest, outDir, force }) {
  if (!sourceRoot) fail("--source-root es obligatorio en modo import", 2);
  const root = resolve(sourceRoot);
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    fail(`source-root no es directorio: ${root}`);
  }

  // 1) Licencia ANTES de copiar
  const license = checkRedistributable({ sourceRoot: root, attestPath: attest });
  if (!license.ok) {
    fail(license.reason);
  }
  console.log(
    `[importar-onfalo] redistribuible OK attest=${posixPath(license.attestPath)}`,
  );

  // 2) Secretos + hashes ANTES de escribir out
  const buffers = [];
  try {
    for (const piece of EXPECTED_PIECES) {
      buffers.push(readSourcePiece(root, piece));
    }
  } catch (e) {
    fail(e.message);
  }

  // Snapshot = exactamente las 2 piezas del BRIEF (extras en source-root no se copian).
  let manifest;
  try {
    manifest = writeSnapshot(outDir, buffers, { force });
  } catch (e) {
    fail(e.message);
  }
  console.log(
    `[importar-onfalo] import-once OK pieces=2 seal=${manifest.seal.value}`,
  );
  console.log(`[importar-onfalo] out=${posixPath(outDir)}`);
  console.log(`[importar-onfalo] modo=simulacro-playground`);
  return manifest;
}

function consumeSealed(outDir) {
  let snap;
  try {
    snap = loadSealedSnapshot(outDir);
  } catch (e) {
    fail(e.message);
  }
  console.log(
    `[importar-onfalo] consume-sealed OK pieces=${snap.pieces.length} seal=${snap.manifest.seal.value}`,
  );
  console.log(`[importar-onfalo] out=${posixPath(outDir)}`);
  console.log(`[importar-onfalo] modo=simulacro-playground source-root=NONE`);
  for (const p of snap.pieces) {
    console.log(`  - ${p.relativePath} sha256=${p.sha256} size=${p.size}`);
  }
  return snap;
}

function main() {
  const args = parseArgs(process.argv);
  if (args.consumeSealed && args.sourceRoot) {
    fail("no mezclar --consume-sealed con --source-root", 2);
  }
  if (args.consumeSealed || !args.sourceRoot) {
    // Corrida normal sin --source-root = consume sellado
    consumeSealed(args.outDir);
    return;
  }
  importOnce(args);
}

const isMain =
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main();
}
