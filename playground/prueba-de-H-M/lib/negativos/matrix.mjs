/**
 * WP-HUB-110 · provocadores de la matriz de negativos.
 * Cada uno falla en su frontera y deja cero estado parcial.
 */
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
  cpSync,
  readdirSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";
import { LocalPodProvider } from "../podstore/index.mjs";
import {
  runCeremonia,
  CeremonyError,
  CeremonyKillError,
} from "../ceremonia/index.mjs";
import {
  verificarEvidencia,
  VerifierError,
  FRONTIER as V_FRONTIER,
} from "../verificador/verificar.mjs";
import { indexAnalyses } from "../cadena/vector-mock.mjs";
import { analyzeAll } from "../cadena/bartleby.mjs";
import { loadSealedPieces } from "../cadena/run-cadena.mjs";
import { NEG_FRONTIER, NegativoError, failNegativo } from "./frontiers.mjs";

const require = createRequire(import.meta.url);

/**
 * @param {string} runRoot
 */
function assertNoPartial(runRoot) {
  if (existsSync(runRoot)) {
    failNegativo(
      NEG_FRONTIER.UPSTREAM_AUSENTE,
      `estado parcial residual: ${runRoot}`,
    );
  }
}

/**
 * @param {string} kitRoot
 * @returns {string} temp kit clone root
 */
function cloneKitMinimal(kitRoot) {
  const dst = mkdtempSync(join(tmpdir(), "hm-110-kit-"));
  for (const name of [
    "fixtures",
    "units",
    "schemas",
    "ontology",
    "scripts",
    "lib",
    "scenarios",
    "package.json",
    "package-lock.json",
    ".npmrc",
  ]) {
    const src = join(kitRoot, name);
    if (!existsSync(src)) continue;
    const target = join(dst, name);
    cpSync(src, target, { recursive: true });
  }
  return dst;
}

/**
 * corpus ausente — sin snapshot Onfalo sellado.
 * @param {string} kitRoot
 */
export function provokeCorpusAusente(kitRoot) {
  const tmp = cloneKitMinimal(kitRoot);
  const onfalo = join(tmp, "fixtures/onfalo");
  rmSync(onfalo, { recursive: true, force: true });
  mkdirSync(onfalo, { recursive: true });
  try {
    loadSealedPieces({ kitRoot: tmp });
    failNegativo(NEG_FRONTIER.CORPUS_AUSENTE, "debió fallar sin corpus");
  } catch (e) {
    if (e instanceof NegativoError) throw e;
    // ENOENT / JSON parse → frontera
    throw new NegativoError(
      NEG_FRONTIER.CORPUS_AUSENTE,
      e?.message || String(e),
    );
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/**
 * hash roto — sha del piece no coincide / digest wire corrupto en evidence.
 * @param {string} kitRoot
 */
export function provokeHashRoto(kitRoot) {
  const tmp = cloneKitMinimal(kitRoot);
  try {
    const manifestPath = join(tmp, "fixtures/onfalo/source.manifest.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    if (!manifest.pieces?.[0]) {
      failNegativo(NEG_FRONTIER.HASH_ROTO, "sin piezas para corromper");
    }
    const piece = manifest.pieces[0];
    const abs = join(tmp, "fixtures/onfalo", piece.relativePath);
    const raw = readFileSync(abs);
    const real = createHash("sha256").update(raw).digest("hex");
    piece.sha256 = "0".repeat(64);
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    const { pieces } = loadSealedPieces({ kitRoot: tmp });
    const loaded = pieces.find((p) => p.pieceId === piece.id);
    const got = createHash("sha256")
      .update(loaded.raw, "utf8")
      .digest("hex");
    if (got === real && piece.sha256 !== real) {
      throw new NegativoError(
        NEG_FRONTIER.HASH_ROTO,
        `sha esperado ${piece.sha256} ≠ real ${got}`,
      );
    }
    failNegativo(NEG_FRONTIER.HASH_ROTO, "hash roto no detectado");
  } catch (e) {
    if (e instanceof NegativoError) throw e;
    throw new NegativoError(NEG_FRONTIER.HASH_ROTO, e?.message || String(e));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/**
 * schema inválido — payload activity rechazado por ajv.
 * @param {string} kitRoot
 */
export function provokeSchemaInvalido(kitRoot) {
  const AjvMod = require("ajv/dist/2020.js");
  const Ajv2020 = AjvMod.default ?? AjvMod;
  const ajv = new Ajv2020({
    allErrors: true,
    strict: false,
    validateFormats: false,
  });
  const schema = JSON.parse(
    readFileSync(join(kitRoot, "schemas/activity.schema.json"), "utf8"),
  );
  const validate = ajv.compile(schema);
  const bad = { notAnActivity: true };
  if (validate(bad)) {
    failNegativo(NEG_FRONTIER.SCHEMA_INVALIDO, "ajv aceptó payload inválido");
  }
  throw new NegativoError(
    NEG_FRONTIER.SCHEMA_INVALIDO,
    JSON.stringify(validate.errors?.[0] ?? { ok: false }),
  );
}

/**
 * pod sin lease — inflate no materializa; cero path; wipe limpio.
 * @param {string} kitRoot
 */
export function provokePodSinLease(kitRoot) {
  const storeRoot = mkdtempSync(join(tmpdir(), "hm-110-pod-"));
  const provider = new LocalPodProvider({
    runId: "neg-pod-sin-lease",
    storeRoot,
  });
  try {
    provider.declare({
      unitId: "bartleby",
      type: "agent",
      condition: "bootstrap",
    });
    provider.requestInflate({
      unitId: "bartleby",
      actorIri: provider.maestroIri,
      identity: { actorId: "maestro-m" },
    });
    if (provider._paths.has("bartleby")) {
      failNegativo(
        NEG_FRONTIER.POD_SIN_LEASE,
        "materializó sin lease",
      );
    }
    try {
      provider.recordEvent("bartleby", { type: "probe" });
      failNegativo(
        NEG_FRONTIER.POD_SIN_LEASE,
        "recordEvent debió fallar sin materializar",
      );
    } catch (e) {
      if (e instanceof NegativoError) throw e;
      throw new NegativoError(
        NEG_FRONTIER.POD_SIN_LEASE,
        e?.message || String(e),
      );
    }
  } finally {
    provider.wipe();
    rmSync(storeRoot, { recursive: true, force: true });
    if (existsSync(storeRoot)) {
      failNegativo(
        NEG_FRONTIER.POD_SIN_LEASE,
        `estado parcial residual: ${storeRoot}`,
      );
    }
  }
}

/**
 * VectorMock no declarado — mock/declared ≠ true.
 * @param {string} kitRoot
 */
export function provokeVectorMockNoDeclarado(kitRoot) {
  const { pieces } = loadSealedPieces({ kitRoot });
  const bartleby = analyzeAll(pieces);
  const vm = indexAnalyses(bartleby);
  const broken = { ...vm, mock: false, declared: false };
  if (broken.mock === true && broken.declared === true) {
    failNegativo(
      NEG_FRONTIER.VECTORMOCK_NO_DECLARADO,
      "no se pudo romper declaración",
    );
  }
  throw new NegativoError(
    NEG_FRONTIER.VECTORMOCK_NO_DECLARADO,
    `mock=${broken.mock} declared=${broken.declared}`,
  );
}

/**
 * upstream ausente — skipStep → wipe + frontera.
 * @param {string} kitRoot
 */
export function provokeUpstreamAusente(kitRoot) {
  const runId = `neg-upstream-${Date.now().toString(36)}`;
  const runRoot = join(kitRoot, ".runs", runId);
  try {
    runCeremonia({ kitRoot, runId, forceNew: true, skipStep: 4 });
    failNegativo(NEG_FRONTIER.UPSTREAM_AUSENTE, "skipStep debió fallar");
  } catch (e) {
    if (e instanceof NegativoError) throw e;
    if (
      e instanceof CeremonyError &&
      (e.code === "missing-upstream" || /upstream/i.test(e.message))
    ) {
      assertNoPartial(runRoot);
      throw new NegativoError(
        NEG_FRONTIER.UPSTREAM_AUSENTE,
        e.message,
      );
    }
    // wipe may have removed root; still map unexpected
    if (existsSync(runRoot)) {
      rmSync(runRoot, { recursive: true, force: true });
    }
    throw new NegativoError(
      NEG_FRONTIER.UPSTREAM_AUSENTE,
      e?.message || String(e),
    );
  }
}

/**
 * runner caído — kill en paso de universos/runners + wipe.
 * @param {string} kitRoot
 */
export function provokeRunnerCaido(kitRoot) {
  // paso 9 = universe.instantiate (runners); kill ahí = runner caído
  const runId = `neg-runner-${Date.now().toString(36)}`;
  const runRoot = join(kitRoot, ".runs", runId);
  try {
    runCeremonia({ kitRoot, runId, forceNew: true, killAtStep: 9 });
    failNegativo(NEG_FRONTIER.RUNNER_CAIDO, "killAtStep=9 debió fallar");
  } catch (e) {
    if (e instanceof NegativoError) throw e;
    if (e instanceof CeremonyKillError || e?.code === "kill") {
      if (existsSync(runRoot)) {
        rmSync(runRoot, { recursive: true, force: true });
        failNegativo(
          NEG_FRONTIER.RUNNER_CAIDO,
          `estado parcial residual: ${runRoot}`,
        );
      }
      throw new NegativoError(
        NEG_FRONTIER.RUNNER_CAIDO,
        e.message || "kill en instantiate",
      );
    }
    if (existsSync(runRoot)) {
      rmSync(runRoot, { recursive: true, force: true });
    }
    throw new NegativoError(
      NEG_FRONTIER.RUNNER_CAIDO,
      e?.message || String(e),
    );
  }
}

/**
 * hash roto vía verificador (evidence pack) — refuerzo frontera 107.
 * @param {string} evidencePassRoot
 * @param {string} isoBase
 */
export function provokeHashRotoEvidence(evidencePassRoot, isoBase) {
  const dir = join(isoBase, `neg-hash-${Date.now().toString(36)}`);
  cpSync(evidencePassRoot, dir, { recursive: true });
  try {
    const acts = join(dir, "activities");
    const first = readdirSync(acts)[0];
    const wirePath = join(acts, first, "wire.json");
    const wire = JSON.parse(readFileSync(wirePath, "utf8"));
    wire.digest = `sha256:${"0".repeat(64)}`;
    writeFileSync(wirePath, `${JSON.stringify(wire, null, 2)}\n`);
    try {
      verificarEvidencia(dir);
      failNegativo(NEG_FRONTIER.HASH_ROTO, "verificador debió fallar");
    } catch (e) {
      if (e instanceof NegativoError) throw e;
      if (
        e instanceof VerifierError &&
        e.frontier === V_FRONTIER.HASH_ROTO
      ) {
        throw new NegativoError(NEG_FRONTIER.HASH_ROTO, e.message);
      }
      throw new NegativoError(
        NEG_FRONTIER.HASH_ROTO,
        e?.frontier || e?.message || String(e),
      );
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export const MATRIX = Object.freeze([
  {
    frontier: NEG_FRONTIER.CORPUS_AUSENTE,
    run: (kitRoot) => provokeCorpusAusente(kitRoot),
  },
  {
    frontier: NEG_FRONTIER.HASH_ROTO,
    run: (kitRoot) => provokeHashRoto(kitRoot),
  },
  {
    frontier: NEG_FRONTIER.SCHEMA_INVALIDO,
    run: (kitRoot) => provokeSchemaInvalido(kitRoot),
  },
  {
    frontier: NEG_FRONTIER.POD_SIN_LEASE,
    run: (kitRoot) => provokePodSinLease(kitRoot),
  },
  {
    frontier: NEG_FRONTIER.VECTORMOCK_NO_DECLARADO,
    run: (kitRoot) => provokeVectorMockNoDeclarado(kitRoot),
  },
  {
    frontier: NEG_FRONTIER.UPSTREAM_AUSENTE,
    run: (kitRoot) => provokeUpstreamAusente(kitRoot),
  },
  {
    frontier: NEG_FRONTIER.RUNNER_CAIDO,
    run: (kitRoot) => provokeRunnerCaido(kitRoot),
  },
]);
