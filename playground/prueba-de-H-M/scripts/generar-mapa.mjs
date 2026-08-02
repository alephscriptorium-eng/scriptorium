#!/usr/bin/env node
/**
 * WP-HUB-108 · proyección sellada 7 holones × 6 distritos × 24 barrios.
 *
 * Build-time (import-once):
 *   node scripts/generar-mapa.mjs --cantera-root <path> [--holones-root <path>] [--force]
 *
 * Gate / consumo sellado (runtime NO abre cantera):
 *   node scripts/generar-mapa.mjs --gate [--cantera-root <path>]
 *   node scripts/generar-mapa.mjs --consume-sealed
 *
 * Gate falla (exit ≠ 0) si cantera y proyección divergen, o si hay slugs inventados.
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const KIT_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DEFAULT_OUT = join(KIT_ROOT, "fixtures", "mapa");

const DEFAULT_CANTERA = "C:/S_LAB/s-sdk/plan/SPRINTS/sprint-game-city/cantera/CIUDAD";
const DEFAULT_HOLONES_MD = "C:/S_LAB/s-sdk/DEVOPS/METODOLOGIA/HOLONES.md";
const DEFAULT_HOLONES_ROOT = "C:/S_LAB/s-sdk/HOLONES";

/** Distrito canónico → holón jugable (01–04). 05/06/07 sin barrios (razón escrita). */
export const DISTRITO_HOLON = Object.freeze({
  zigurat: "01",
  editores: "02",
  "lore-voz": "03",
  "red-stream": "04",
  "runtime-mcp": "04",
  "infra-ui": "04",
});

export const HOLONES_META = Object.freeze([
  Object.freeze({
    id: "01",
    slug: "mythos",
    name: "Mythos (Zeus/Homero)",
    runtimeKind: "anchor",
    razonSinBarrio: null,
    note: "Cosmos cerrado / host Zigurat (ancla zeus).",
  }),
  Object.freeze({
    id: "02",
    slug: "logos",
    name: "Logos (Sócrates/Platón)",
    runtimeKind: "anchor",
    razonSinBarrio: null,
    note: "Dialéctica / editores visuales — razón que busca tras apariencias.",
  }),
  Object.freeze({
    id: "03",
    slug: "revelacion",
    name: "Revelación (Cristo / E-SDK)",
    runtimeKind: "anchor",
    razonSinBarrio: null,
    note: "Distrito lore-voz · Document Machine (L01 MAPA-HOLONICO).",
  }),
  Object.freeze({
    id: "04",
    slug: "ilustracion",
    name: "Razón inmanente (Ilustración / Network-Engine)",
    runtimeKind: "anchor",
    razonSinBarrio: null,
    note: "Embudo secularizado: red-stream + runtime-mcp + infra-ui.",
  }),
  Object.freeze({
    id: "05",
    slug: "sospecha",
    name: "Sospecha (Nietzsche/Marx/Freud)",
    runtimeKind: "cantera",
    razonSinBarrio:
      "Anclado a cantera/agujero negro (aleph-scriptorium · HOLONES/05-*); sin fingir runtime de barrio.",
    note: "Material histórico RO; no dependencia runtime del juego.",
  }),
  Object.freeze({
    id: "06",
    slug: "posmodernidad",
    name: "Posmodernidad (Lyotard/Foucault)",
    runtimeKind: "constelacion",
    razonSinBarrio:
      "Anclado a constelación spinoff (registry + fragmentos · HOLONES/06-*); sin fingir runtime de barrio.",
    note: "Material histórico RO; no dependencia runtime del juego.",
  }),
  Object.freeze({
    id: "07",
    slug: "script-sdk",
    name: "SCRIPT_SDK (holarquía como método)",
    runtimeKind: "metodo",
    razonSinBarrio:
      "Método / notaría (holón 07): relee y ancla; no es un barrio de la ciudad jugable.",
    note: "Gobierno metodológico; cero barrio fingido.",
  }),
]);

/**
 * Cifras de la proyección, en UN solo sitio.
 *
 * `HOLONES` y `DISTRITOS` se derivan de sus catálogos (7 y 6 dejan de estar
 * escritos). `BARRIOS` no se puede derivar —el censo ES la fuente— así que
 * queda como pin declarado: antes el 24 estaba escrito cuatro veces y el 7 y
 * el 6 tres veces cada uno, sin relación entre sí.
 */
export const CONTEO = Object.freeze({
  get HOLONES() {
    return HOLONES_META.length;
  },
  get DISTRITOS() {
    return Object.keys(DISTRITO_HOLON).length;
  },
  /** Pin explícito del censo sellado (no derivable: el censo es la fuente). */
  BARRIOS: 24,
});

const DISTRITO_DISPLAY = Object.freeze({
  zigurat: "Zigurat",
  editores: "Editores visuales",
  "red-stream": "Red / stream",
  "runtime-mcp": "Runtime / MCP",
  "lore-voz": "Lore / voz",
  "infra-ui": "Infra / UI",
});

function fail(msg, code = 1) {
  console.error(`[generar-mapa] FAIL — ${msg}`);
  process.exit(code);
}

function usage() {
  console.error(`uso:
  node scripts/generar-mapa.mjs --cantera-root <path> [--holones-md <path>] [--holones-root <path>] [--out <dir>] [--force]
  node scripts/generar-mapa.mjs --gate [--cantera-root <path>] [--out <dir>]
  node scripts/generar-mapa.mjs --gate-sin-cantera [--out <dir>]   (gate degradado)
  node scripts/generar-mapa.mjs --consume-sealed [--out <dir>]`);
  process.exit(2);
}

function parseArgs(argv) {
  const out = {
    canteraRoot: null,
    allowMissingCantera: false,
    holonesMd: null,
    holonesRoot: null,
    outDir: DEFAULT_OUT,
    force: false,
    gate: false,
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
    if (a === "--gate" || a === "--check") {
      out.gate = true;
      continue;
    }
    // Gate degradado EXPLICITO: contrasta solo el excerpt sellado. Existe para
    // runners sin la cantera montada, pero hay que pedirlo por su nombre.
    if (a === "--gate-sin-cantera") {
      out.gate = true;
      out.allowMissingCantera = true;
      continue;
    }
    if (a === "--consume-sealed" || a === "--sealed-only") {
      out.consumeSealed = true;
      continue;
    }
    if (a === "--cantera-root") {
      const v = args[++i];
      if (!v || v.startsWith("--")) fail("--cantera-root requiere valor", 2);
      out.canteraRoot = resolve(v);
      continue;
    }
    if (a === "--holones-md") {
      const v = args[++i];
      if (!v || v.startsWith("--")) fail("--holones-md requiere valor", 2);
      out.holonesMd = resolve(v);
      continue;
    }
    if (a === "--holones-root") {
      const v = args[++i];
      if (!v || v.startsWith("--")) fail("--holones-root requiere valor", 2);
      out.holonesRoot = resolve(v);
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

function sha256Text(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function sha256File(abs) {
  return createHash("sha256").update(readFileSync(abs)).digest("hex");
}

function posix(p) {
  return p.replaceAll("\\", "/");
}

/** Parse CENSO-ESTADOS.md table → barrios[]. */
export function parseCenso(md) {
  const barrios = [];
  for (const line of md.split(/\r?\n/)) {
    if (!/^\|/.test(line)) continue;
    if (/^\|\s*-+/.test(line) || /\| id \|/i.test(line)) continue;
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.length < 5) continue;
    const [id, slug, displayName, distrito, estado] = cells;
    if (!id || id === "id") continue;
    barrios.push({ id, slug, displayName, distrito, estado });
  }
  return barrios;
}

/** Parse HOLONES.md registry table → [{id,name,...}]. */
export function parseHolonesMd(md) {
  const rows = [];
  for (const line of md.split(/\r?\n/)) {
    if (!/^\|\s*0[1-7]\s*\|/.test(line)) continue;
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.length < 4) continue;
    const id = cells[0].padStart(2, "0");
    const nameCell = cells[1].replace(/\[([^\]]+)\]\([^)]+\)/, "$1");
    rows.push({
      id,
      name: nameCell,
      capa: cells[2],
      origen: cells[3],
      estado: cells[4] ?? "",
    });
  }
  return rows;
}

function toKebabFromScope(scope) {
  if (scope === "onfalo-asesor-sdk") return "onfalo-asesor-sdk";
  return scope
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

/** Count handoff edges per barrio id from GRAFO/handoffs-barrios.tsv. */
export function parseGrafoHandoffs(tsv) {
  const counts = Object.create(null);
  for (const line of tsv.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const scope = line.split("\t")[0]?.trim();
    if (!scope || scope === "scope") continue;
    const id = toKebabFromScope(scope);
    counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
}

function listBarrioFichas(barriosDir) {
  if (!existsSync(barriosDir)) return [];
  return readdirSync(barriosDir)
    .filter((n) => /^\d{2}-.+\.md$/.test(n))
    .sort();
}

export function buildProjection({
  censoMd,
  holonesMd,
  grafoTsv,
  barrioFichas = [],
  holonesRootListing = [],
}) {
  const censo = parseCenso(censoMd);
  if (censo.length !== CONTEO.BARRIOS) {
    throw new Error(
      `censo debe tener ${CONTEO.BARRIOS} barrios, got ${censo.length}`,
    );
  }

  const holonesReg = parseHolonesMd(holonesMd);
  if (holonesReg.length !== CONTEO.HOLONES) {
    throw new Error(
      `HOLONES.md debe listar ${CONTEO.HOLONES} holones (HOLONES_META), got ${holonesReg.length}`,
    );
  }

  const grafoCounts = parseGrafoHandoffs(grafoTsv || "");
  const censoIds = new Set(censo.map((b) => b.id));

  for (const b of censo) {
    if (b.id !== b.slug) {
      throw new Error(`slug inventado/desalineado: id=${b.id} slug=${b.slug}`);
    }
    if (!DISTRITO_HOLON[b.distrito]) {
      throw new Error(`distrito desconocido en censo: ${b.distrito} (barrio ${b.id})`);
    }
  }

  if (barrioFichas.length) {
    if (barrioFichas.length !== CONTEO.BARRIOS) {
      throw new Error(
        `01-BARRIOS fichas esperadas ${CONTEO.BARRIOS}, got ${barrioFichas.length}`,
      );
    }
  }

  const distritosMap = Object.create(null);
  for (const b of censo) {
    if (!distritosMap[b.distrito]) {
      distritosMap[b.distrito] = {
        id: b.distrito,
        displayName: DISTRITO_DISPLAY[b.distrito] ?? b.distrito,
        holonId: DISTRITO_HOLON[b.distrito],
        barrios: [],
      };
    }
    distritosMap[b.distrito].barrios.push(b.id);
  }
  const distritos = Object.keys(DISTRITO_DISPLAY).map((id) => {
    const d = distritosMap[id];
    if (!d) throw new Error(`falta distrito canónico ${id} en censo`);
    return d;
  });
  if (distritos.length !== CONTEO.DISTRITOS) {
    throw new Error(
      `esperados ${CONTEO.DISTRITOS} distritos (DISTRITO_HOLON), got ${distritos.length}`,
    );
  }

  const barrios = censo.map((b) => ({
    id: b.id,
    slug: b.slug,
    displayName: b.displayName,
    distrito: b.distrito,
    holonId: DISTRITO_HOLON[b.distrito],
    estado: b.estado,
    grafo: { handoffEdges: grafoCounts[b.id] ?? 0 },
  }));

  // Zero invented slugs: every barrio id must be in censo (tautology here) +
  // every grafo key that we care about must map or be absent.
  for (const id of Object.keys(grafoCounts)) {
    if (!censoIds.has(id)) {
      // GRAFO may use scopes not in censo — only fail if we assigned inventados.
      // Soft: ignore unknown scopes in counts (projection only attaches known ids).
    }
  }

  const holones = HOLONES_META.map((h) => {
    const assigned = barrios.filter((b) => b.holonId === h.id).map((b) => b.id);
    if (assigned.length === 0 && !h.razonSinBarrio) {
      throw new Error(`holón ${h.id} sin barrios y sin razón escrita`);
    }
    if (assigned.length > 0 && h.razonSinBarrio) {
      throw new Error(
        `holón ${h.id} no debe fingir runtime: tiene razónSinBarrio pero barrios=${assigned.join(",")}`,
      );
    }
    const reg = holonesReg.find((r) => r.id === h.id);
    return {
      id: h.id,
      slug: h.slug,
      name: h.name,
      runtimeKind: h.runtimeKind,
      barrios: assigned,
      razonSinBarrio: h.razonSinBarrio,
      note: h.note,
      registro: reg
        ? { capa: reg.capa, origen: reg.origen, estado: reg.estado }
        : null,
    };
  });

  // CA: 05/06 cantera/constelación; 07 método
  for (const id of ["05", "06", "07"]) {
    const h = holones.find((x) => x.id === id);
    if (!h.razonSinBarrio || h.barrios.length !== 0) {
      throw new Error(`holón ${id} debe tener razón escrita y cero barrios`);
    }
  }
  if (holones.find((h) => h.id === "05").runtimeKind !== "cantera") {
    throw new Error("holón 05 runtimeKind debe ser cantera");
  }
  if (holones.find((h) => h.id === "06").runtimeKind !== "constelacion") {
    throw new Error("holón 06 runtimeKind debe ser constelacion");
  }
  if (holones.find((h) => h.id === "07").runtimeKind !== "metodo") {
    throw new Error("holón 07 runtimeKind debe ser metodo");
  }

  const projection = {
    kind: "hm-mapa-holones-distritos",
    version: "1.0.0",
    mode: "import-once-projection",
    wp: "WP-HUB-108",
    counts: {
      holones: CONTEO.HOLONES,
      distritos: CONTEO.DISTRITOS,
      barrios: CONTEO.BARRIOS,
    },
    holones,
    distritos,
    barrios,
    asignacion: {
      distritoHolon: { ...DISTRITO_HOLON },
      fuente:
        "Derivado de CENSO-ESTADOS + HOLONES.md + GRAFO; L01 MAPA-HOLONICO (lore-voz→03).",
    },
    sources: {
      censoSha256: sha256Text(censoMd),
      holonesSha256: sha256Text(holonesMd),
      grafoSha256: sha256Text(grafoTsv || ""),
      barrioFichaCount: barrioFichas.length,
      holonesRootEntries: holonesRootListing,
    },
  };

  return projection;
}

function stableStringify(obj) {
  return `${JSON.stringify(obj, null, 2)}\n`;
}

function loadSources(canteraRoot, holonesMdPath, holonesRoot) {
  const censoPath = join(canteraRoot, "CENSO-ESTADOS.md");
  const grafoPath = join(canteraRoot, "GRAFO", "handoffs-barrios.tsv");
  const barriosDir = join(canteraRoot, "01-BARRIOS");
  if (!existsSync(censoPath)) fail(`no existe CENSO: ${censoPath}`);
  if (!existsSync(holonesMdPath)) fail(`no existe HOLONES.md: ${holonesMdPath}`);
  const censoMd = readFileSync(censoPath, "utf8");
  const holonesMd = readFileSync(holonesMdPath, "utf8");
  const grafoTsv = existsSync(grafoPath) ? readFileSync(grafoPath, "utf8") : "";
  const barrioFichas = listBarrioFichas(barriosDir);
  const holonesRootListing = existsSync(holonesRoot)
    ? readdirSync(holonesRoot).filter((n) => !n.startsWith(".")).sort()
    : [];
  return {
    censoMd,
    holonesMd,
    grafoTsv,
    barrioFichas,
    holonesRootListing,
    paths: { censoPath, grafoPath, holonesMdPath, holonesRoot, barriosDir },
  };
}

/**
 * Piezas que el sello del mapa DEBE cubrir — raíz de confianza.
 *
 * `assertSeal` recorría solo `manifest.pieces`, que es autodeclarado, y
 * recomputaba el sello de esa misma lista: sustituir un excerpt y resellar,
 * o dejar `pieces: []` (sello de la cadena vacía), daba exit 0.
 * Es la misma clase que `manifest.required` contra REQUIRED_EVIDENCE_PIECES
 * en el verificador; aquí faltaba aplicar el patrón.
 */
export const SEALED_MAPA_PIECES = Object.freeze([
  "mapa.json",
  "excerpts/CENSO-ESTADOS.md",
  "excerpts/HOLONES.md",
  "excerpts/handoffs-barrios.tsv",
  "excerpts/GRAFO-handoffs-counts.json",
]);

function writeProjection(outDir, projection, sources) {
  mkdirSync(join(outDir, "excerpts"), { recursive: true });
  const mapaBody = stableStringify(projection);
  const mapaPath = join(outDir, "mapa.json");
  writeFileSync(mapaPath, mapaBody);

  writeFileSync(join(outDir, "excerpts", "CENSO-ESTADOS.md"), sources.censoMd);
  writeFileSync(join(outDir, "excerpts", "HOLONES.md"), sources.holonesMd);
  writeFileSync(
    join(outDir, "excerpts", "handoffs-barrios.tsv"),
    sources.grafoTsv || "",
  );
  writeFileSync(
    join(outDir, "excerpts", "GRAFO-handoffs-counts.json"),
    stableStringify(parseGrafoHandoffs(sources.grafoTsv || "")),
  );

  const pieceMeta = SEALED_MAPA_PIECES.map((rel) => {
    const abs = join(outDir, rel);
    return {
      relativePath: rel,
      size: readFileSync(abs).byteLength,
      sha256: sha256File(abs),
    };
  });
  const sealMaterial = pieceMeta.map((p) => `${p.relativePath}:${p.sha256}`).join("\n");
  const manifest = {
    schemaVersion: "1.0.0",
    kind: "hm-mapa-import-once",
    mode: "import-once",
    wp: "WP-HUB-108",
    counts: projection.counts,
    sources: {
      canteraRel: "plan/SPRINTS/sprint-game-city/cantera/CIUDAD",
      holonesMdRel: "DEVOPS/METODOLOGIA/HOLONES.md",
      holonesRootRel: "HOLONES/",
      note: "Runtime consume fixtures/mapa/; no abre cantera S.",
    },
    pieces: pieceMeta,
    seal: { alg: "sha256", value: sha256Text(sealMaterial) },
  };
  writeFileSync(join(outDir, "source.manifest.json"), stableStringify(manifest));
  writeFileSync(
    join(outDir, "ASIGNACION.md"),
    `# Asignación distrito → holón (WP-HUB-108)

Proyección machine-readable en \`mapa.json\`. Runtime **no** abre cantera.

| distrito | holón | nota |
| -------- | ----- | ---- |
| zigurat | 01 Mythos | cosmos cerrado / host IDE |
| editores | 02 Logos | dialéctica / herramientas de razón |
| lore-voz | 03 Revelación | L01 MAPA-HOLONICO · E-SDK |
| red-stream | 04 Ilustración | Network-Engine / red |
| runtime-mcp | 04 Ilustración | embudo de protocolo |
| infra-ui | 04 Ilustración | infra secularizada |

Holones **05** (cantera), **06** (constelación) y **07** (método): **cero barrios**;
razón escrita en \`mapa.json\` → \`holones[].razonSinBarrio\`.
`,
  );
  return { mapaPath, manifest };
}

export function loadSealedMapa(outDir = DEFAULT_OUT) {
  const mapaPath = join(outDir, "mapa.json");
  const manPath = join(outDir, "source.manifest.json");
  if (!existsSync(mapaPath) || !existsSync(manPath)) {
    throw new Error(`proyección sellada ausente en ${posix(outDir)}`);
  }
  const mapa = JSON.parse(readFileSync(mapaPath, "utf8"));
  const manifest = JSON.parse(readFileSync(manPath, "utf8"));
  return { mapa, manifest, mapaPath, manPath };
}

export function validateProjection(mapa) {
  const errors = [];
  if (
    mapa.counts?.barrios !== CONTEO.BARRIOS ||
    mapa.barrios?.length !== CONTEO.BARRIOS
  ) {
    errors.push(
      `barrios≠${CONTEO.BARRIOS} (counts=${mapa.counts?.barrios} len=${mapa.barrios?.length})`,
    );
  }
  if (
    mapa.counts?.distritos !== CONTEO.DISTRITOS ||
    mapa.distritos?.length !== CONTEO.DISTRITOS
  ) {
    errors.push(`distritos≠${CONTEO.DISTRITOS}`);
  }
  if (
    mapa.counts?.holones !== CONTEO.HOLONES ||
    mapa.holones?.length !== CONTEO.HOLONES
  ) {
    errors.push(`holones≠${CONTEO.HOLONES}`);
  }
  const censoIds = new Set((mapa.barrios || []).map((b) => b.id));
  for (const b of mapa.barrios || []) {
    if (!b.distrito || !b.holonId) errors.push(`barrio ${b.id} sin distrito/holón`);
    if (b.id !== b.slug) errors.push(`slug inventado ${b.id}/${b.slug}`);
    if (DISTRITO_HOLON[b.distrito] !== b.holonId) {
      errors.push(`barrio ${b.id}: holón ${b.holonId} ≠ mapa distrito ${b.distrito}`);
    }
  }
  for (const h of mapa.holones || []) {
    const hasBarrios = (h.barrios || []).length > 0;
    const hasRazon = Boolean(h.razonSinBarrio);
    if (!hasBarrios && !hasRazon) errors.push(`holón ${h.id} sin barrios ni razón`);
    for (const id of h.barrios || []) {
      if (!censoIds.has(id)) errors.push(`holón ${h.id} cita slug inventado ${id}`);
    }
  }
  for (const id of ["05", "06", "07"]) {
    const h = (mapa.holones || []).find((x) => x.id === id);
    if (!h) errors.push(`falta holón ${id}`);
    else if ((h.barrios || []).length !== 0 || !h.razonSinBarrio) {
      errors.push(`holón ${id} debe ser sin barrio + razón escrita`);
    }
  }
  return errors;
}

function assertSeal(outDir) {
  const { manifest } = loadSealedMapa(outDir);

  // La LISTA de piezas es tan autodeclarada como los hashes: se contrasta
  // contra la raíz antes de mirar ningún digest.
  const declaradas = [...(manifest.pieces ?? [])].map((p) => p.relativePath).sort();
  const raiz = [...SEALED_MAPA_PIECES].sort();
  if (JSON.stringify(declaradas) !== JSON.stringify(raiz)) {
    fail(
      `manifest.pieces ≠ raíz de confianza: declara [${declaradas.join(", ")}], ` +
        `debe cubrir [${raiz.join(", ")}]`,
    );
  }

  const lines = [];
  for (const p of manifest.pieces) {
    const abs = join(outDir, p.relativePath);
    if (!existsSync(abs)) fail(`pieza ausente: ${p.relativePath}`);
    const dig = sha256File(abs);
    if (dig !== p.sha256) fail(`hash diverge: ${p.relativePath}`);
    lines.push(`${p.relativePath}:${dig}`);
  }
  const seal = sha256Text(lines.join("\n"));
  if (seal !== manifest.seal.value) fail("seal del manifest diverge");
}

function gate({ canteraRoot, holonesMd, holonesRoot, outDir, allowMissingCantera }) {
  assertSeal(outDir);
  const { mapa } = loadSealedMapa(outDir);
  const errs = validateProjection(mapa);
  if (errs.length) fail(`proyección inválida: ${errs.join("; ")}`);

  // Contrast sealed excerpt censo (always) — zero invented slugs
  const excerptCenso = readFileSync(
    join(outDir, "excerpts", "CENSO-ESTADOS.md"),
    "utf8",
  );
  const censoIds = new Set(parseCenso(excerptCenso).map((b) => b.id));
  for (const b of mapa.barrios) {
    if (!censoIds.has(b.id)) fail(`slug inventado (no en censo): ${b.id}`);
  }

  // ── La proyección se RECOMPUTA desde los excerpts sellados ──────────────
  // Un sello prueba integridad, no veracidad: sustituir un excerpt y resellar
  // seguía dando exit 0 porque el manifest quedaba coherente consigo mismo.
  // `mapa.json` es derivado de los excerpts, así que se puede rederivar y
  // contrastar sin necesidad de cantera.
  {
    let rebuilt;
    try {
      rebuilt = buildProjection({
        censoMd: excerptCenso,
        holonesMd: readFileSync(join(outDir, "excerpts", "HOLONES.md"), "utf8"),
        grafoTsv: readFileSync(
          join(outDir, "excerpts", "handoffs-barrios.tsv"),
          "utf8",
        ),
        holonesRootListing: mapa.holonesRootEntries ?? [],
      });
    } catch (e) {
      fail(
        `los excerpts sellados no reconstruyen una proyección válida: ${e.message || e}`,
      );
    }
    const esencia = (m) =>
      stableStringify({
        barrios: m.barrios.map((b) => ({
          id: b.id,
          distrito: b.distrito,
          holonId: b.holonId,
          estado: b.estado,
        })),
        distritos: m.distritos,
        holones: m.holones.map((h) => ({
          id: h.id,
          runtimeKind: h.runtimeKind,
          barrios: h.barrios,
          razonSinBarrio: h.razonSinBarrio,
        })),
        counts: m.counts,
      });
    if (esencia(mapa) !== esencia(rebuilt)) {
      fail("mapa.json no se deriva de los excerpts sellados (excerpt sustituido)");
    }
  }

  const cantera =
    canteraRoot && existsSync(join(canteraRoot, "CENSO-ESTADOS.md"))
      ? canteraRoot
      : null;

  // Un gate que pasa cuando la fuente no está no es un gate.
  // Antes, cantera ausente → «gate OK» y exit 0: exactamente el resultado que
  // se obtiene cuando todo va bien, con lo cual el verde no significaba nada.
  // El modo degradado sigue existiendo pero hay que PEDIRLO por su nombre.
  if (!cantera && !allowMissingCantera) {
    fail(
      `gate sin cantera: no está ${join(canteraRoot ?? DEFAULT_CANTERA, "CENSO-ESTADOS.md")}. ` +
        "Usa --gate-sin-cantera para contrastar solo el excerpt sellado (gate degradado).",
      3,
    );
  }

  if (cantera) {
    const src = loadSources(
      cantera,
      holonesMd || DEFAULT_HOLONES_MD,
      holonesRoot || DEFAULT_HOLONES_ROOT,
    );
    const rebuilt = buildProjection(src);
    const sealedNorm = stableStringify({
      ...mapa,
      sources: undefined,
    });
    const rebuiltNorm = stableStringify({
      ...rebuilt,
      sources: undefined,
    });
    // Compare structural identity of barrios/distritos/holon assignment
    const a = JSON.stringify({
      barrios: mapa.barrios.map((b) => ({
        id: b.id,
        distrito: b.distrito,
        holonId: b.holonId,
        estado: b.estado,
      })),
      distritos: mapa.distritos,
      holones: mapa.holones.map((h) => ({
        id: h.id,
        runtimeKind: h.runtimeKind,
        barrios: h.barrios,
        razonSinBarrio: h.razonSinBarrio,
      })),
    });
    const b = JSON.stringify({
      barrios: rebuilt.barrios.map((x) => ({
        id: x.id,
        distrito: x.distrito,
        holonId: x.holonId,
        estado: x.estado,
      })),
      distritos: rebuilt.distritos,
      holones: rebuilt.holones.map((h) => ({
        id: h.id,
        runtimeKind: h.runtimeKind,
        barrios: h.barrios,
        razonSinBarrio: h.razonSinBarrio,
      })),
    });
    if (a !== b) {
      fail("cantera y proyección divergen (asignación/censo)");
    }
    // Also require excerpt sha matches live cantera censo
    const liveSha = sha256Text(src.censoMd);
    const excerptSha = sha256Text(excerptCenso);
    if (liveSha !== excerptSha) {
      fail("cantera CENSO y excerpt sellado divergen (sha256)");
    }
    void sealedNorm;
    void rebuiltNorm;
    console.log(`[generar-mapa] gate OK — cantera≡proyección barrios=${CONTEO.BARRIOS}`);
  } else {
    console.log(
      `[generar-mapa] gate DEGRADADO — cantera ausente; solo excerpt sellado contrastado (--gate-sin-cantera)`,
    );
  }
  console.log(`[generar-mapa] out=${posix(outDir)}`);
}

function importOnce(args) {
  const canteraRoot = args.canteraRoot || DEFAULT_CANTERA;
  const holonesMd = args.holonesMd || DEFAULT_HOLONES_MD;
  const holonesRoot = args.holonesRoot || DEFAULT_HOLONES_ROOT;
  const outDir = args.outDir;
  if (existsSync(join(outDir, "mapa.json")) && !args.force) {
    console.log(`[generar-mapa] snapshot ya sellado (no-op) out=${posix(outDir)}`);
    gate({ canteraRoot, holonesMd, holonesRoot, outDir, allowMissingCantera: false });
    return;
  }
  if (args.force && existsSync(outDir)) {
    // keep outDir; overwrite files
  }
  const src = loadSources(canteraRoot, holonesMd, holonesRoot);
  const projection = buildProjection(src);
  mkdirSync(outDir, { recursive: true });
  writeProjection(outDir, projection, src);
  console.log(
    `[generar-mapa] import-once OK holones=${CONTEO.HOLONES} distritos=${CONTEO.DISTRITOS} barrios=${CONTEO.BARRIOS} seal=ok`,
  );
  console.log(`[generar-mapa] out=${posix(outDir)}`);
  gate({ canteraRoot, holonesMd, holonesRoot, outDir, allowMissingCantera: false });
}

function consumeSealed(outDir) {
  assertSeal(outDir);
  const { mapa } = loadSealedMapa(outDir);
  const errs = validateProjection(mapa);
  if (errs.length) fail(`proyección inválida: ${errs.join("; ")}`);
  console.log(
    `[generar-mapa] consume-sealed OK barrios=${mapa.barrios.length} seal=ok`,
  );
  console.log(`[generar-mapa] out=${posix(outDir)}`);
  console.log(`[generar-mapa] modo=runtime-sin-cantera`);
}

function main() {
  const args = parseArgs(process.argv);
  if (args.consumeSealed) {
    consumeSealed(args.outDir);
    return;
  }
  if (args.gate) {
    gate({
      canteraRoot: args.canteraRoot || DEFAULT_CANTERA,
      holonesMd: args.holonesMd || DEFAULT_HOLONES_MD,
      holonesRoot: args.holonesRoot || DEFAULT_HOLONES_ROOT,
      outDir: args.outDir,
      allowMissingCantera: args.allowMissingCantera === true,
    });
    return;
  }
  if (!args.canteraRoot && !existsSync(join(DEFAULT_CANTERA, "CENSO-ESTADOS.md"))) {
    // allow generate from defaults if present
    if (!existsSync(join(DEFAULT_CANTERA, "CENSO-ESTADOS.md"))) {
      fail("indique --cantera-root o use --gate/--consume-sealed", 2);
    }
  }
  importOnce(args);
}

const isMain =
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) main();
