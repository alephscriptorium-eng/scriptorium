/**
 * Demiurgo mock — dos universos deterministas con bifurcación REAL
 * (divergencia de contenido, no copias).
 */
import {
  LINE_FUTUROS,
  LINE_ONFALO,
  UNIVERSE_ALPHA,
  UNIVERSE_BETA,
} from "./constants.mjs";
import { digestObject, sha256Hex } from "./hash.mjs";

/**
 * @param {{
 *   graph: { digest: string },
 *   lines: Record<string, { uri: string, lineaKitSchema: string }>,
 *   vectorMock: { embeddings: Array<{ urn: string }> },
 *   pieces: Array<{ pieceId: string }>,
 * }} ctx
 */
export function instantiateUniverses(ctx) {
  const graphDigest = ctx.graph.digest;
  const lineaRefs = [
    {
      uri: ctx.lines[LINE_ONFALO].uri,
      lineaKitSchema: "manifest-tronco",
    },
    {
      uri: ctx.lines[LINE_FUTUROS].uri,
      lineaKitSchema: "manifest-tronco",
    },
  ];

  const branches = [
    {
      universeId: UNIVERSE_ALPHA,
      seed: "bifurcation-alpha-v1",
      branchLabel: "alpha-consejos",
      focusPieceId: ctx.pieces[0]?.pieceId,
      divergenceThesis:
        "Prioriza consejo/poder obrero como polo dominante del grafo.",
    },
    {
      universeId: UNIVERSE_BETA,
      seed: "bifurcation-beta-v1",
      branchLabel: "beta-partido",
      focusPieceId: ctx.pieces[1]?.pieceId ?? ctx.pieces[0]?.pieceId,
      divergenceThesis:
        "Prioriza Partido/hegemonía como polo dominante del grafo.",
    },
  ];

  const universes = branches.map((b) => {
    const contentFingerprint = sha256Hex(
      `${b.seed}|${b.branchLabel}|${b.focusPieceId}|${b.divergenceThesis}|${graphDigest}`,
    );
    const runnerLog = [
      `runner.start seed=${b.seed}`,
      `branch=${b.branchLabel}`,
      `focus=${b.focusPieceId}`,
      `thesis=${b.divergenceThesis}`,
      `vectorRefs=${ctx.vectorMock.embeddings.map((e) => e.urn).join(",")}`,
      `fingerprint=${contentFingerprint}`,
      "runner.complete",
    ];
    return {
      universeId: b.universeId,
      graphDigest,
      runnerUnitId: `universe-runner-${b.universeId.replace(/^universe-/, "")}`,
      state: "completed",
      simulacro: { mock: true, seed: b.seed },
      lineaRefs,
      eventsEmitted: runnerLog.length,
      branch: {
        label: b.branchLabel,
        focusPieceId: b.focusPieceId,
        thesis: b.divergenceThesis,
        contentFingerprint: `sha256:${contentFingerprint}`,
      },
      runnerLog,
      digest: digestObject({
        universeId: b.universeId,
        seed: b.seed,
        thesis: b.divergenceThesis,
        fingerprint: contentFingerprint,
      }),
    };
  });

  if (universes[0].digest === universes[1].digest) {
    throw new Error("bifurcación fallida: universos idénticos");
  }
  if (
    universes[0].branch.contentFingerprint ===
    universes[1].branch.contentFingerprint
  ) {
    throw new Error("bifurcación fallida: fingerprints idénticos");
  }

  return {
    unitId: "demiurgo",
    verb: "universe.instantiate",
    mock: true,
    universes,
  };
}
