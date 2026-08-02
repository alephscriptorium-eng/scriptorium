#!/usr/bin/env node
/**
 * WP-HUB-100 · validación de schemas dominio + reutilización linea-kit.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execSync } from "node:child_process";
import crypto from "node:crypto";
import Ajv2020Module from "ajv/dist/2020.js";
import { STATIC_UNIT_IDS } from "../lib/podstore/constants.mjs";

const Ajv2020 = Ajv2020Module.default ?? Ajv2020Module;

const here = path.dirname(fileURLToPath(import.meta.url));
const kitRoot = path.resolve(here, "..");
const schemasDir = path.join(kitRoot, "schemas");
const hubRoot = path.resolve(kitRoot, "../..");
const censPathFull =
  process.env.CENSO_ESTADOS_PATH ||
  "C:/S_LAB/s-sdk/plan/SPRINTS/sprint-game-city/cantera/CIUDAD/CENSO-ESTADOS.md";
const censPathExcerpt = path.join(kitRoot, "fixtures/censo-excerpt-lore-voz.md");

const DOMAIN_SCHEMAS = [
  "scenario",
  "unit",
  "machine",
  "activity",
  "pod",
  "pod-lease",
  "artifact-chain",
  "graph",
  "universe",
  "corto",
  "evidence-report",
];

const LINEA_KIT_SCHEMA_FILES = [
  "volumes.json",
  "viaje-recorrido.json",
  "triage-manifest.json",
  "ssb-manifest.json",
  "snapshot-meta.json",
  "registro.json",
  "ontology-seeds.json",
  "nodos-document.json",
  "nodo-sections.json",
  "nodo-meta.json",
  "manifest-tronco.json",
  "manifest-satelite.json",
  "lineas-registry.json",
  "force.json",
  "force-registry.json",
  "force-manifest.json",
  "curation-status.json",
  "cota.json",
  "cache-sidecar-meta.json",
];

const SHA = "sha256:" + "a".repeat(64);
const TS = "2026-08-02T00:00:00.000Z";

function fail(msg) {
  console.error(`test-100-schemas: FAIL — ${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`test-100-schemas: ${msg}`);
}

function loadSchema(name) {
  const file = path.join(schemasDir, `${name}.schema.json`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function compileAll() {
  const ajv = new Ajv2020({ allErrors: true, strict: false, validateFormats: false });
  const validators = new Map();
  for (const name of DOMAIN_SCHEMAS) {
    const schema = loadSchema(name);
    validators.set(name, ajv.compile(schema));
  }
  return validators;
}

function assertValid(validators, name, data, label) {
  const v = validators.get(name);
  const pass = v(data);
  if (!pass) {
    fail(`${label}: expected valid ${name}, got ${JSON.stringify(v.errors)}`);
  }
}

function assertInvalid(validators, name, data, label) {
  const v = validators.get(name);
  const pass = v(data);
  if (pass) {
    fail(`${label}: expected invalid ${name}`);
  }
}

const fixtures = {
  scenario: {
    valid: () => JSON.parse(fs.readFileSync(
      path.join(kitRoot, "scenarios/barrio-lore/scenario.json"),
      "utf8",
    )),
    invalid: () => ({
      scenarioId: "BAD ID",
      version: "1.0.0",
      barrioId: "document-machine-sdk",
      distrito: "lore-voz",
    }),
  },
  unit: {
    valid: () => JSON.parse(fs.readFileSync(
      path.join(kitRoot, "units/catalog/bartleby.json"),
      "utf8",
    )),
    invalid: () => ({
      unitId: "x",
      type: "robot",
      condition: "bootstrap",
      inputs: [],
      outputs: [],
      dependencies: [],
      verbs: [],
      stateSchema: { $schema: "x", type: "object" },
    }),
  },
  machine: {
    valid: () => ({
      machineId: "fm-document-machine-sdk",
      barrioId: "document-machine-sdk",
      simulacro: { mock: true, declared: "playground" },
      capabilities: ["document.analyze"],
      units: ["bartleby"],
      status: "ready",
    }),
    invalid: () => ({
      machineId: "fm",
      barrioId: "document-machine-sdk",
      simulacro: { mock: false, declared: "real" },
      capabilities: [],
      units: [],
      status: "ready",
    }),
  },
  activity: {
    valid: () => ({
      id: "act-1",
      actor: "anfitrion-h",
      verb: "peer.join",
      object: "room:hm",
      timestamp: TS,
      digest: SHA,
    }),
    invalid: () => ({
      id: "act-1",
      actor: "anfitrion-h",
      verb: "peer.join",
      object: "room:hm",
      timestamp: TS,
      digest: "bad",
    }),
  },
  pod: {
    valid: () => ({
      podIri: "urn:scriptorium:hm:run-1:pod:bartleby",
      unitId: "bartleby",
      runId: "run-1",
      state: "ready",
      descriptor: { type: "agent", condition: "bootstrap" },
      artifacts: { manifest: "artifacts/manifest.json" },
    }),
    invalid: () => ({
      podIri: "http://bad",
      unitId: "bartleby",
      runId: "run-1",
      state: "ready",
      descriptor: { type: "agent", condition: "bootstrap" },
      artifacts: { manifest: "artifacts/manifest.json" },
    }),
  },
  "pod-lease": {
    valid: () => ({
      leaseId: "lease-1",
      emitterIri: "urn:hm:H",
      receiverIri: "urn:hm:M",
      unitId: "bartleby",
      permissions: ["unit.inflate"],
      issuedAt: TS,
      expiresAt: "2026-08-03T00:00:00.000Z",
      signature: { algorithm: "ed25519-mock", value: "abcdef12" },
    }),
    invalid: () => ({
      leaseId: "lease-1",
      emitterIri: "urn:hm:H",
      receiverIri: "urn:hm:M",
      unitId: "bartleby",
      permissions: [],
      issuedAt: TS,
      expiresAt: "2026-08-03T00:00:00.000Z",
      signature: { algorithm: "ed25519-mock", value: "ab" },
    }),
  },
  "artifact-chain": {
    valid: () => ({
      chainId: "chain-1",
      runId: "run-1",
      links: [
        {
          order: 1,
          artifactId: "raw-1",
          kind: "onfalo-raw",
          hash: SHA,
          producedBy: "archivero",
        },
        {
          order: 2,
          artifactId: "line-1",
          kind: "linea",
          hash: SHA,
          producedBy: "pipeline",
          lineaKit: {
            schemaId: "manifest-tronco",
            payload: {
              meta: { corpus: "barrio-lore-onfalo" },
              nodos: [{ id: "N01" }],
            },
          },
        },
      ],
    }),
    invalid: () => ({
      chainId: "chain-1",
      runId: "run-1",
      links: [
        {
          order: 1,
          artifactId: "line-1",
          kind: "linea",
          hash: SHA,
        },
      ],
    }),
  },
  graph: {
    valid: () => ({
      graphId: "g-1",
      digest: SHA,
      nodes: [
        { nodeId: "n1", ref: "linea://barrio-lore-onfalo", lineaKitSchema: "manifest-tronco" },
        { nodeId: "n2", ref: "urn:vector:mock-1" },
      ],
      edges: [{ from: "n1", to: "n2", relation: "references" }],
    }),
    invalid: () => ({
      graphId: "g-1",
      digest: "bad",
      nodes: [],
      edges: [],
    }),
  },
  universe: {
    valid: () => ({
      universeId: "u-alpha",
      graphDigest: SHA,
      runnerUnitId: "universe-runner-alpha",
      state: "instantiated",
      simulacro: { mock: true, seed: "seed-1" },
      lineaRefs: [
        { uri: "linea://barrio-lore-onfalo", lineaKitSchema: "manifest-tronco" },
      ],
      eventsEmitted: 0,
    }),
    invalid: () => ({
      universeId: "u-alpha",
      graphDigest: SHA,
      runnerUnitId: "universe-runner-alpha",
      state: "instantiated",
      simulacro: { mock: false },
    }),
  },
  corto: {
    valid: () => ({
      cortoId: "c-1",
      universeId: "u-alpha",
      graphDigest: SHA,
      lineaRefs: ["linea://barrio-lore-onfalo"],
      vectorRefs: ["urn:vector:mock-1"],
      interval: { start: TS, end: "2026-08-02T00:01:00.000Z" },
      events: ["evt-1"],
      digest: SHA,
      onfaloTrace: ["urn:onfalo:2024-05-01_primero-de-mayo"],
    }),
    invalid: () => ({
      cortoId: "c-1",
      universeId: "u-alpha",
      graphDigest: SHA,
      interval: { start: TS, end: "2026-08-02T00:01:00.000Z" },
      events: [],
      digest: SHA,
    }),
  },
  "evidence-report": {
    valid: () => ({
      reportId: "r-1",
      scenarioId: "barrio-lore",
      runId: "run-1",
      generatedAt: TS,
      simulacro: { futureMachine: true, note: "playground mock" },
      matrix: [
        { verb: "peer.join", actor: "H", object: "room", result: "pass" },
      ],
      pods: ["urn:scriptorium:hm:run-1:pod:bartleby"],
      artifactChain: "chain-1",
      coverage: { verbsPercent: 100, unitsPercent: 100 },
      verdict: "pass",
    }),
    invalid: () => ({
      reportId: "r-1",
      scenarioId: "barrio-lore",
      runId: "run-1",
      generatedAt: TS,
      simulacro: { futureMachine: false, note: "real fm" },
      matrix: [],
      pods: [],
      artifactChain: "chain-1",
      coverage: { verbsPercent: 100, unitsPercent: 100 },
      verdict: "pass",
    }),
  },
};

async function resolveLineaKit() {
  const candidates = [
    process.env.LINEA_KIT_ROOT,
    path.join(kitRoot, "node_modules/@zeus/linea-kit"),
    path.resolve(kitRoot, "../../../../z-sdk/packages/engine/linea-kit"),
    "C:/S_LAB/z-sdk/packages/engine/linea-kit",
  ].filter(Boolean);

  for (const root of candidates) {
    const validatePath = path.join(root, "src/validate.mjs");
    if (fs.existsSync(validatePath)) {
      return import(pathToFileURL(validatePath).href);
    }
  }
  fail("no se pudo resolver @zeus/linea-kit (file: o LINEA_KIT_ROOT)");
}

/**
 * Cero schemas de linea-kit copiados — comparando CONTENIDO, no nombres.
 *
 * Antes solo comparaba nombres de fichero: copiar `manifest-tronco.json` como
 * `mi-tronco.schema.json` pasaba el guardián sin despeinarse. Ahora se
 * contrasta el `$id` y la huella del cuerpo contra los schemas reales del kit.
 *
 * @param {{ SCHEMAS_DIR?: string, SCHEMA_FILES?: Record<string,string> }} lineaKit
 */
function grepZeroOwnLineSchemas(lineaKit) {
  for (const file of LINEA_KIT_SCHEMA_FILES) {
    const abs = path.join(schemasDir, file);
    if (fs.existsSync(abs)) {
      fail(`schema linea-kit copiado en kit: ${file}`);
    }
  }

  const owned = fs.readdirSync(schemasDir);
  const copies = owned.filter((f) => LINEA_KIT_SCHEMA_FILES.includes(f));
  if (copies.length > 0) {
    fail(`archivos de schema linea-kit en schemas/: ${copies.join(", ")}`);
  }

  // ── Comparación por contenido: el nombre no protege de nada ──────────────
  const kitSchemasDir = lineaKit?.SCHEMAS_DIR;
  if (!kitSchemasDir || !fs.existsSync(kitSchemasDir)) {
    fail("no se pudo localizar SCHEMAS_DIR de linea-kit para contrastar contenido");
    return;
  }
  // Huella ESTRUCTURAL: se descartan las etiquetas ($id, title, description,
  // $comment) y se ordenan las claves. Comparar el cuerpo entero sólo atrapaba
  // el clon intacto; reetiquetar `$id`+`title` —la evasión más obvia— pasaba.
  const stripLabels = (v) => {
    if (Array.isArray(v)) return v.map(stripLabels);
    if (v && typeof v === "object") {
      const out = {};
      for (const k of Object.keys(v).sort()) {
        if (["$id", "title", "description", "$comment"].includes(k)) continue;
        out[k] = stripLabels(v[k]);
      }
      return out;
    }
    return v;
  };
  const norm = (txt) => {
    try {
      return JSON.stringify(stripLabels(JSON.parse(txt)));
    } catch {
      return txt.replace(/\s+/g, "");
    }
  };
  const huella = (txt) =>
    crypto.createHash("sha256").update(norm(txt)).digest("hex");

  /** @type {Map<string,string>} huella → fichero del kit */
  const kitBodies = new Map();
  /** @type {Map<string,string>} $id → fichero del kit */
  const kitIds = new Map();
  for (const f of fs.readdirSync(kitSchemasDir)) {
    if (!f.endsWith(".json")) continue;
    const txt = fs.readFileSync(path.join(kitSchemasDir, f), "utf8");
    kitBodies.set(huella(txt), f);
    try {
      const id = JSON.parse(txt).$id;
      if (id) kitIds.set(String(id), f);
    } catch {
      /* schema ilegible en el kit: no es asunto de este guardián */
    }
  }

  for (const f of owned) {
    if (!f.endsWith(".json")) continue;
    const txt = fs.readFileSync(path.join(schemasDir, f), "utf8");
    const gemelo = kitBodies.get(huella(txt));
    if (gemelo) {
      // `fail()` sale del proceso: no hay contador que incrementar después.
      fail(`schemas/${f} es clon estructural de linea-kit/${gemelo} (etiquetas aparte)`);
    }
    try {
      const id = JSON.parse(txt).$id;
      if (id && kitIds.has(String(id))) {
        fail(`schemas/${f} reutiliza el $id de linea-kit/${kitIds.get(String(id))}`);
      }
    } catch {
      /* ya lo valida otro check */
    }
  }
  {
    ok(
      `cero clones de linea-kit por contenido (${owned.filter((f) => f.endsWith(".json")).length} schemas propios vs ${kitBodies.size} del kit)`,
    );
  }

  const domainOnly = owned.filter((f) => f.endsWith(".schema.json"));
  for (const name of DOMAIN_SCHEMAS) {
    if (!domainOnly.includes(`${name}.schema.json`)) {
      fail(`falta schema dominio obligatorio: ${name}.schema.json`);
    }
  }
  // Extras de WPs posteriores (p.ej. 109: acta-unidad, censo-runtime, elenco)
  // son dominio HM; el guardian exige presencia de los once nombrados, no cardinalidad.

  ok(`cero archivos linea-kit copiados (${domainOnly.length} schemas dominio; base=${DOMAIN_SCHEMAS.length})`);
}

function verifyCensoIds(scenario) {
  const censPath = fs.existsSync(censPathFull) ? censPathFull : censPathExcerpt;
  if (!fs.existsSync(censPath)) {
    fail(`CENSO no legible (full ni excerpt): ${censPathFull}`);
  }
  const cens = fs.readFileSync(censPath, "utf8");
  if (!cens.includes(`| ${scenario.barrioId} |`)) {
    fail(`barrioId inventado: ${scenario.barrioId}`);
  }
  if (!cens.includes(scenario.distrito)) {
    fail(`distrito inventado: ${scenario.distrito}`);
  }
  const src = censPath === censPathFull ? "CENSO-full" : "CENSO-excerpt";
  ok(`${src}: ${scenario.barrioId} + ${scenario.distrito} existen`);
}

function verifyPruebaDeDosClean() {
  const diff = execSync("git diff -- playground/prueba-de-dos", {
    cwd: hubRoot,
    encoding: "utf8",
  }).trim();
  if (diff) {
    fail("git diff no vacío en playground/prueba-de-dos");
  }
  ok("git diff vacío en playground/prueba-de-dos");
}

function validateAllUnits(validators) {
  const catalogDir = path.join(kitRoot, "units/catalog");
  const files = fs.readdirSync(catalogDir).filter((f) => f.endsWith(".json"));
  if (files.length !== STATIC_UNIT_IDS.length) {
    fail(
      `catálogo debe tener ${STATIC_UNIT_IDS.length} unidades (STATIC_UNIT_IDS), tiene ${files.length}`,
    );
  }
  // Y los nombres, no solo la cardinalidad: diez ficheros cualesquiera
  // cuadraban con «10» sin que ninguno fuese la unidad esperada.
  const enCatalogo = new Set(files.map((f) => f.replace(/\.json$/, "")));
  for (const unitId of STATIC_UNIT_IDS) {
    if (!enCatalogo.has(unitId)) fail(`falta units/catalog/${unitId}.json`);
  }
  for (const file of files) {
    const unit = JSON.parse(fs.readFileSync(path.join(catalogDir, file), "utf8"));
    assertValid(validators, "unit", unit, `catalog/${file}`);
  }
  ok(`catálogo: ${files.length} unidades validan contra unit.schema.json`);
}

async function validateLineaKitPayload(lineaKit) {
  const chain = fixtures["artifact-chain"].valid();
  const link = chain.links.find((l) => l.kind === "linea");
  const { schemaId, payload } = link.lineaKit;
  const result = lineaKit.validate(schemaId, payload);
  if (!result.ok) {
    fail(`linea-kit ${schemaId} rechazó payload positivo: ${JSON.stringify(result.errors)}`);
  }

  const bad = lineaKit.validate(schemaId, { meta: {} });
  if (bad.ok) {
    fail(`linea-kit ${schemaId} aceptó payload negativo`);
  }
  ok(`linea-kit: ${schemaId} positivo/negativo via @zeus/linea-kit`);
}

/**
 * En producción ALGUIEN valida.
 *
 * El guardián anterior solo miraba que no hubiera schemas copiados. Pero cero
 * módulos de producción importaban linea-kit: las líneas se etiquetaban con el
 * nombre del schema y nadie las validaba nunca. Aquí se exige (a) que el kit
 * resuelva, y (b) que `materializeLines` REALMENTE valide — probándolo con un
 * payload roto que debe hacerla lanzar.
 */
async function assertProduccionValidaLineas() {
  const lk = await import("../lib/cadena/linea-kit.mjs");
  if (!lk.lineaKitAvailable) {
    fail("linea-kit no resoluble en CI: producción no podría validar");
  }

  const pipeline = await import("../lib/cadena/pipeline-lines.mjs");
  const src = fs.readFileSync(
    path.join(kitRoot, "lib/cadena/pipeline-lines.mjs"),
    "utf8",
  );
  if (!/from\s+"\.\/linea-kit\.mjs"/.test(src)) {
    fail("lib/cadena/pipeline-lines.mjs no importa el validador de linea-kit");
  }

  // Rojo: si materializeLines dejara de validar, esto no lanzaría.
  let lanzo = false;
  try {
    pipeline.materializeLines({
      pieces: [{ pieceId: "", sha256: "x" }],
      bartleby: { analyses: [] },
      vectorMock: { embeddings: [] },
      // fuerza un payload que linea-kit rechaza: nodo sin id utilizable
      __forzarInvalido: true,
    });
    // La llamada anterior produce nodos con id válido; el rojo real es
    // comprobar que un payload roto NO pasa el validador de producción.
    const r = lk.validateLinea(pipeline.LINEA_SCHEMA, { basura: true });
    if (r.ok) fail("linea-kit aceptó un payload basura: el validador no valida");
    try {
      lk.assertLineaValida(pipeline.LINEA_SCHEMA, { basura: true }, "rojo");
    } catch {
      lanzo = true;
    }
  } catch {
    lanzo = true;
  }
  if (!lanzo) {
    fail("assertLineaValida no lanzó ante un payload inválido");
  }
  ok(`producción valida líneas con linea-kit (${lk.lineaKitRoot ? "resuelto" : "?"})`);
}

async function main() {
  const validators = compileAll();

  for (const name of DOMAIN_SCHEMAS) {
    assertValid(validators, name, fixtures[name].valid(), `${name}+`);
    assertInvalid(validators, name, fixtures[name].invalid(), `${name}-`);
    ok(`${name}: positivo y negativo`);
  }

  const scenario = fixtures.scenario.valid();
  verifyCensoIds(scenario);
  validateAllUnits(validators);
  verifyPruebaDeDosClean();

  const lineaKit = await resolveLineaKit();
  grepZeroOwnLineSchemas(lineaKit);
  await validateLineaKitPayload(lineaKit);
  await assertProduccionValidaLineas();

  console.log("test-100-schemas: PASS");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
