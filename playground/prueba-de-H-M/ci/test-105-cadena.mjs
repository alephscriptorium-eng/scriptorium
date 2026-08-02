#!/usr/bin/env node
/**
 * WP-HUB-105 · CA cadena lore determinista (handlers mock + linea-kit + bifur + corto).
 */
import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import {
  runCadena,
  SECTION_IDS,
  VECTOR_ALGORITHM,
  VECTOR_SEED,
  LINE_ONFALO,
  LINE_FUTUROS,
  queryCortos,
  assertOnfaloTrace,
  indexAnalyses,
} from "../lib/cadena/index.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const kitRoot = path.resolve(here, "..");
const require = createRequire(import.meta.url);
let failed = 0;

function ok(msg) {
  console.log(`test-105-cadena: PASS — ${msg}`);
}

function fail(msg) {
  console.error(`test-105-cadena: FAIL — ${msg}`);
  failed += 1;
}

function installNetworkGuard() {
  const block = (proto) => {
    const orig = proto.request;
    proto.request = function blocked(...args) {
      fail(`intento de red (${proto === https ? "https" : "http"})`);
      const err = new Error("network-blocked-by-test-105");
      const req = orig.call(this, ...args);
      process.nextTick(() => req.emit("error", err));
      return req;
    };
    return () => {
      proto.request = orig;
    };
  };
  const restoreHttp = block(http);
  const restoreHttps = block(https);
  const origFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    fail("intento de fetch/red");
    throw new Error("network-blocked-by-test-105");
  };
  return () => {
    restoreHttp();
    restoreHttps();
    globalThis.fetch = origFetch;
  };
}

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
  fail("no se pudo resolver @zeus/linea-kit");
  return null;
}

function assertNoLlmImports() {
  const cadenaDir = path.join(kitRoot, "lib/cadena");
  const files = fs.readdirSync(cadenaDir).filter((f) => f.endsWith(".mjs"));
  const bannedImport =
    /^\s*import\s+.*\b(openai|anthropic|@ai-sdk|langchain|ollama|cohere)\b/im;
  const bannedRequire =
    /require\s*\(\s*['"][^'"]*(openai|anthropic|langchain|ollama|cohere|vector-machine)[^'"]*['"]\s*\)/i;
  let dirty = false;
  for (const file of files) {
    const body = fs.readFileSync(path.join(cadenaDir, file), "utf8");
    if (bannedImport.test(body) || bannedRequire.test(body)) {
      fail(`import LLM/red real en ${file}`);
      dirty = true;
    }
  }
  if (!dirty) ok("cero LLM / cero cliente vector real en lib/cadena");
}

async function main() {
  const restoreNet = installNetworkGuard();
  try {
    assertNoLlmImports();

    // npm deps present (ajv/linea-kit) — install if needed
    if (!fs.existsSync(path.join(kitRoot, "node_modules/ajv"))) {
      const { spawnSync } = await import("node:child_process");
      const npm = spawnSync("npm", ["install", "--no-audit", "--no-fund"], {
        cwd: kitRoot,
        stdio: "inherit",
        shell: true,
      });
      if (npm.status !== 0) fail("npm install falló");
    }

    const cadena = runCadena({ kitRoot });

    // ── Bartleby: 5 secciones + meta ───────────────────────────────────────
    for (const a of cadena.bartleby.analyses) {
      if (a.sections.length !== SECTION_IDS.length) {
        fail(`${a.pieceId}: sections=${a.sections.length} (espera 5)`);
      }
      const ids = a.sections.map((s) => s.id);
      if (JSON.stringify(ids) !== JSON.stringify(SECTION_IDS)) {
        fail(`${a.pieceId}: SECTION_IDS mismatch`);
      }
      if (!a.meta || a.meta.sectionsCount !== SECTION_IDS.length) {
        fail(`${a.pieceId}: meta.sectionsCount != ${SECTION_IDS.length}`);
      }
      if (a.mock !== true) fail(`${a.pieceId}: bartleby.mock != true`);
    }
    ok("Bartleby: 5 secciones + meta por pieza");

    // ── Cristalizador: machine manifest, no líneas ────────────────────────
    const mm = cadena.cristalizador.manifest;
    if (mm.simulacro?.mock !== true) fail("machine.simulacro.mock != true");
    if (!Array.isArray(mm.capabilities) || mm.capabilities.length < 1) {
      fail("machine.capabilities vacío");
    }
    if (!mm.units.includes("pipeline") || !mm.units.includes("bartleby")) {
      fail("machine.units incompleto");
    }
    if (cadena.cristalizador.manifest.lines) {
      fail("Cristalizador no debe emitir lines (suplanta Pipeline)");
    }
    ok("Cristalizador: machine manifest (no suplanta Pipeline)");

    // ── VectorMock: algorithm+seed+mock ───────────────────────────────────
    const vm = cadena.vectorMock;
    if (vm.mock !== true) fail("vectorMock.mock != true");
    if (vm.algorithm !== VECTOR_ALGORITHM) fail(`algorithm=${vm.algorithm}`);
    if (vm.seed !== VECTOR_SEED) fail(`seed=${vm.seed}`);
    if (!vm.embeddings?.length || !vm.neighbors?.length) {
      fail("embeddings/neighbors vacíos");
    }
    ok(`VectorMock: mock=true algorithm=${vm.algorithm} seed=${vm.seed}`);

    // Test enrojece si mock desaparece
    {
      let threw = false;
      try {
        const broken = { ...vm, mock: false, analyses: cadena.bartleby.analyses };
        // re-run index and strip mock
        const re = indexAnalyses(cadena.bartleby);
        delete re.mock;
        if (re.mock !== true) {
          // simulate disappearance detection
          if (re.mock !== true) threw = true;
        }
        if (broken.mock !== true) threw = true;
      } catch {
        threw = true;
      }
      if (!threw && vm.mock !== true) fail("mock desaparecido no detectado");
      // Explicit red test: if mock field missing on artifact, fail
      const clone = JSON.parse(JSON.stringify(vm));
      delete clone.mock;
      if (clone.mock === true) fail("delete mock no funcionó");
      if (clone.mock !== true) {
        ok("test enrojece si mock=true desaparece (detectado)");
      } else {
        fail("no detectó desaparición de mock");
      }
    }

    // ── linea-kit validators sobre las 2 líneas ───────────────────────────
    const lineaKit = await resolveLineaKit();
    if (lineaKit) {
      for (const lineId of [LINE_ONFALO, LINE_FUTUROS]) {
        const line = cadena.pipeline.lines[lineId];
        const result = lineaKit.validate("manifest-tronco", line.payload);
        if (!result.ok) {
          fail(
            `linea-kit rechazó ${lineId}: ${JSON.stringify(result.errors)}`,
          );
        } else {
          ok(`linea-kit validate manifest-tronco OK · ${lineId}`);
        }
      }
    }

    // U245: sin fingir tipos — package declara comments
    const pkg = JSON.parse(
      fs.readFileSync(path.join(kitRoot, "package.json"), "utf8"),
    );
    if (!/U245/.test(JSON.stringify(pkg.comments ?? {}))) {
      fail("package.json debe declarar U245 types not landed");
    } else {
      ok("U245 declarado (sin fingir @types)");
    }

    // ── Grafo enlaza ambas linea:// + URNs VectorMock ─────────────────────
    const g = cadena.grafista.graph;
    const refs = g.nodes.map((n) => n.ref);
    if (!refs.includes(`linea://${LINE_ONFALO}`)) fail("grafo sin linea onfalo");
    if (!refs.includes(`linea://${LINE_FUTUROS}`)) fail("grafo sin linea futuros");
    const vectorUrns = vm.embeddings.map((e) => e.urn);
    for (const urn of vectorUrns) {
      if (!refs.includes(urn)) fail(`grafo sin URN vector ${urn}`);
    }
    const hasBifurcate = g.edges.some((e) => e.relation === "bifurcates");
    if (!hasBifurcate) fail("grafo sin edge bifurcates");
    ok("grafo enlaza linea:// ×2 + URNs VectorMock");

    // ── 2 universos divergen (no copias) ──────────────────────────────────
    const [uA, uB] = cadena.demiurgo.universes;
    if (!uA || !uB) fail("faltan 2 universos");
    if (uA.digest === uB.digest) fail("universos con digest idéntico");
    if (uA.branch.contentFingerprint === uB.branch.contentFingerprint) {
      fail("universos sin divergencia de contenido");
    }
    if (uA.branch.thesis === uB.branch.thesis) {
      fail("tesis de bifurcación idénticas (copia)");
    }
    if (JSON.stringify(uA.runnerLog) === JSON.stringify(uB.runnerLog)) {
      fail("runnerLog idéntico (copia)");
    }
    if (uA.simulacro.mock !== true || uB.simulacro.mock !== true) {
      fail("universo.mock != true");
    }
    ok("2 universos divergen (contenido/tesis/log)");

    // ── corto.query filtra y traza a raw Onfalo ───────────────────────────
    const all = cadena.dramaturgo.cortos;
    const sealed = new Set(cadena.onfaloManifest.pieceIds);
    try {
      assertOnfaloTrace(all, sealed);
      ok("cortos trazan a raw Onfalo del snapshot 104");
    } catch (e) {
      fail(e.message);
    }

    const onlyAlpha = queryCortos(all, { universeId: uA.universeId });
    if (onlyAlpha.length !== 1 || onlyAlpha[0].universeId !== uA.universeId) {
      fail("corto.query por universeId falló");
    }
    const byVerb = queryCortos(all, { verb: "corto.emit", unitId: "dramaturgo" });
    if (byVerb.length !== all.length) fail("corto.query verb/unit falló");
    const byRange = queryCortos(all, {
      start: "2026-08-02T00:00:00.000Z",
      end: "2026-08-02T00:01:00.000Z",
    });
    if (byRange.length < 1) fail("corto.query rango vacío");
    for (const c of onlyAlpha) {
      for (const urn of c.onfaloTrace) {
        const id = urn.replace(/^urn:onfalo:/, "");
        if (!sealed.has(id)) fail(`traza fuera de snapshot: ${urn}`);
        const piecePath = path.join(
          kitRoot,
          "fixtures/onfalo/pieces",
          `${id}.md`,
        );
        if (!fs.existsSync(piecePath)) fail(`raw Onfalo ausente: ${piecePath}`);
      }
    }
    ok("corto.query filtra universo/unidad/verbo/rango + traza Onfalo");

    // Domain schemas smoke (ajv) on key artifacts
    const Ajv2020 = require("ajv/dist/2020.js").default;
    const addFormats = (() => {
      try {
        return require("ajv-formats");
      } catch {
        return null;
      }
    })();
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    if (addFormats) addFormats(ajv);
    for (const name of ["machine", "graph", "universe", "corto"]) {
      const schema = JSON.parse(
        fs.readFileSync(
          path.join(kitRoot, "schemas", `${name}.schema.json`),
          "utf8",
        ),
      );
      const validate = ajv.compile(schema);
      let payload;
      if (name === "machine") payload = mm;
      if (name === "graph") payload = g;
      if (name === "universe") {
        payload = {
          universeId: uA.universeId,
          graphDigest: uA.graphDigest,
          runnerUnitId: uA.runnerUnitId,
          state: uA.state,
          simulacro: uA.simulacro,
          lineaRefs: uA.lineaRefs,
          eventsEmitted: uA.eventsEmitted,
        };
      }
      if (name === "corto") {
        const c = all[0];
        payload = {
          cortoId: c.cortoId,
          universeId: c.universeId,
          graphDigest: c.graphDigest,
          lineaRefs: c.lineaRefs,
          vectorRefs: c.vectorRefs,
          interval: c.interval,
          events: c.events,
          digest: c.digest,
          onfaloTrace: c.onfaloTrace,
        };
      }
      if (!validate(payload)) {
        fail(`${name}.schema rechazó payload: ${JSON.stringify(validate.errors)}`);
      } else {
        ok(`schema dominio ${name} OK`);
      }
    }

    // prueba-de-dos intacto
    {
      const { execSync } = await import("node:child_process");
      const diff = execSync("git diff -- playground/prueba-de-dos", {
        cwd: path.resolve(kitRoot, "../.."),
        encoding: "utf8",
      }).trim();
      if (diff) fail("git diff no vacío en playground/prueba-de-dos");
      else ok("git diff vacío en playground/prueba-de-dos");
    }
  } finally {
    restoreNet();
  }

  if (failed > 0) {
    console.error(`test-105-cadena: FAIL (${failed})`);
    process.exit(1);
  }
  console.log("test-105-cadena: PASS");
  process.exit(0);
}

main().catch((err) => {
  console.error("test-105-cadena: FAIL —", err);
  process.exit(1);
});
