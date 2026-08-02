/**
 * Sella el pack de evidencia autocontenido (WP-HUB-107).
 * El tercero solo necesita esta raíz — cero dirs vivos H/M.
 */
import { mkdirSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  CEREMONY_ID,
  SCENARIO_ID,
  REQUIRED_SHUTDOWN_VERBS,
} from "./constants.mjs";
import { digestObject } from "../cadena/hash.mjs";

/** Piezas obligatorias bajo evidence/ — falta cualquiera = pieza-ausente. */
export const REQUIRED_EVIDENCE_PIECES = Object.freeze([
  "report.json",
  "report.md",
  "pack/manifest.json",
  "pack/acl.json",
  "pack/tipestate.json",
  "pack/vector-mock.json",
  "pack/cortos.json",
  "pack/shutdown.json",
  "pack/provenance.json",
]);

/**
 * Documentos del pack que entran en el sello, en orden canónico.
 * El verificador recomputa el sello con esta MISMA función leyendo los
 * ficheros de disco: si el productor y el verificador usaran dos copias de
 * la fórmula, el sello volvería a ser autocertificado.
 */
export const SEALED_PACK_DOCS = Object.freeze([
  Object.freeze({ key: "acl", rel: "pack/acl.json" }),
  Object.freeze({ key: "tipestate", rel: "pack/tipestate.json" }),
  Object.freeze({ key: "vector", rel: "pack/vector-mock.json" }),
  Object.freeze({ key: "cortos", rel: "pack/cortos.json" }),
  Object.freeze({ key: "shutdown", rel: "pack/shutdown.json" }),
  Object.freeze({ key: "provenance", rel: "pack/provenance.json" }),
]);

/**
 * Sello del pack — única fórmula, usada por productor y verificador.
 * @param {Record<string, unknown>} docs — por `key` de SEALED_PACK_DOCS
 * @param {string} reportVerdict
 */
export function computePackDigest(docs, reportVerdict) {
  /** @type {Record<string, unknown>} */
  const payload = {};
  for (const { key } of SEALED_PACK_DOCS) {
    payload[key] = docs[key];
  }
  payload.reportVerdict = reportVerdict;
  return digestObject(payload);
}

/**
 * @param {string} evidenceRoot
 * @param {{
 *   runId: string,
 *   provider: import("../podstore/LocalPodProvider.mjs").LocalPodProvider,
 *   state: Record<string, unknown>,
 *   hashes: string[],
 *   report: object,
 * }} input
 */
export function sealEvidencePack(evidenceRoot, input) {
  const packDir = join(evidenceRoot, "pack");
  mkdirSync(packDir, { recursive: true });

  const snap = input.provider.exportEvidenceSnapshot();
  const vectorMock = /** @type {object|undefined} */ (input.state.vectorMock);
  const dramaturgo = /** @type {object|undefined} */ (input.state.dramaturgo);
  const pieces = /** @type {Array<{ pieceId: string }>|undefined} */ (
    input.state.pieces
  );
  const sealedPieceIds = (pieces ?? []).map((p) => p.pieceId);

  const aclDoc = {
    kind: "hm-evidence-acl",
    runId: input.runId,
    evaluatedAt: "2026-08-02T00:11:00.000Z",
    entries: snap.acls,
  };

  const tipestateDoc = {
    kind: "hm-evidence-tipestate",
    runId: input.runId,
    transitions: snap.tipestate,
    finals: Object.fromEntries(
      snap.acls.map((a) => [a.unitId, a.finalState]),
    ),
  };

  const vectorDoc = {
    kind: "hm-evidence-vector-mock",
    runId: input.runId,
    mock: vectorMock?.mock === true,
    algorithm: vectorMock?.algorithm ?? null,
    seed: vectorMock?.seed ?? null,
    digest: vectorMock?.digest ?? null,
    declared: vectorMock?.mock === true,
  };

  const cortosDoc = {
    kind: "hm-evidence-cortos",
    runId: input.runId,
    sealedPieceIds,
    cortos: (dramaturgo?.cortos ?? []).map((c) => ({
      cortoId: c.cortoId,
      onfaloTrace: [...(c.onfaloTrace ?? [])],
      digest: c.digest,
      universeId: c.universeId,
    })),
    cortosQueried: [...(/** @type {string[]} */ (input.state.cortosQueried ?? []))],
  };

  const matrixVerbs = new Set(
    (input.report.matrix ?? []).map((/** @type {{verb:string}} */ m) => m.verb),
  );
  const shutdownDoc = {
    kind: "hm-evidence-shutdown",
    runId: input.runId,
    shutdown: input.state.shutdown === true,
    residualProcesses: [
      ...(/** @type {string[]} */ (input.state.residualProcesses ?? [])),
    ],
    // Declarativo en el pack; el verificador usa REQUIRED_SHUTDOWN_VERBS
    // (raíz de confianza) y recomputea verbsPresent desde wires.
    requiredVerbs: [...REQUIRED_SHUTDOWN_VERBS],
    verbsPresent: REQUIRED_SHUTDOWN_VERBS.filter((v) => matrixVerbs.has(v)),
    clean:
      input.state.shutdown === true &&
      (/** @type {string[]} */ (input.state.residualProcesses ?? [])).length === 0,
  };

  const activityDirs = existsSync(join(evidenceRoot, "activities"))
    ? readdirSync(join(evidenceRoot, "activities"))
    : [];
  const provenanceDoc = {
    kind: "hm-evidence-provenance",
    runId: input.runId,
    ceremonyId: CEREMONY_ID,
    scenarioId: SCENARIO_ID,
    activityCount: activityDirs.length,
    hashes: [...input.hashes],
    artifactChain: input.report.artifactChain,
    coverage: input.report.coverage,
  };

  writeJson(join(packDir, "acl.json"), aclDoc);
  writeJson(join(packDir, "tipestate.json"), tipestateDoc);
  writeJson(join(packDir, "vector-mock.json"), vectorDoc);
  writeJson(join(packDir, "cortos.json"), cortosDoc);
  writeJson(join(packDir, "shutdown.json"), shutdownDoc);
  writeJson(join(packDir, "provenance.json"), provenanceDoc);

  const manifest = {
    kind: "hm-evidence-pack",
    version: 1,
    runId: input.runId,
    ceremonyId: CEREMONY_ID,
    scenarioId: SCENARIO_ID,
    sealedAt: "2026-08-02T00:11:00.000Z",
    required: [...REQUIRED_EVIDENCE_PIECES],
    digest: computePackDigest(
      {
        acl: aclDoc,
        tipestate: tipestateDoc,
        vector: vectorDoc,
        cortos: cortosDoc,
        shutdown: shutdownDoc,
        provenance: provenanceDoc,
      },
      input.report.verdict,
    ),
  };
  writeJson(join(packDir, "manifest.json"), manifest);

  return { packDir, manifest };
}

function writeJson(path, doc) {
  writeFileSync(path, `${JSON.stringify(doc, null, 2)}\n`);
}
