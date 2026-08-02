/**
 * Dramaturgo mock — hm:CortoDeEjecucion = chunk del log del runner (no literario).
 * corto.query filtra y traza hasta raw Onfalo del snapshot 104.
 */
import { LINE_FUTUROS, LINE_ONFALO } from "./constants.mjs";
import { digestObject } from "./hash.mjs";

/**
 * @param {{
 *   universes: Array<{
 *     universeId: string,
 *     graphDigest: string,
 *     runnerLog: string[],
 *     branch: { focusPieceId: string },
 *     simulacro: { seed: string },
 *   }>,
 *   vectorMock: { embeddings: Array<{ urn: string, pieceId: string }> },
 *   pieces: Array<{ pieceId: string }>,
 * }} ctx
 */
export function emitCortos(ctx) {
  const cortos = ctx.universes.map((u, index) => {
    const focus = u.branch.focusPieceId;
    const vectorRefs = ctx.vectorMock.embeddings
      .filter((e) => e.pieceId === focus)
      .map((e) => e.urn);
    const onfaloTrace = [`urn:onfalo:${focus}`];
    const events = u.runnerLog.map(
      (line, i) => `evt-${u.universeId}-${i}:${line}`,
    );
    const body = {
      cortoId: `corto-${u.universeId}-chunk-0`,
      universeId: u.universeId,
      graphDigest: u.graphDigest,
      lineaRefs: [`linea://${LINE_ONFALO}`, `linea://${LINE_FUTUROS}`],
      vectorRefs,
      interval: {
        start: `2026-08-02T00:0${index}:00.000Z`,
        end: `2026-08-02T00:0${index}:30.000Z`,
      },
      events,
      onfaloTrace,
      unitId: "dramaturgo",
      verb: "corto.emit",
      runnerSeed: u.simulacro.seed,
    };
    return {
      ...body,
      digest: digestObject({
        cortoId: body.cortoId,
        events: body.events,
        onfaloTrace: body.onfaloTrace,
      }),
    };
  });

  return {
    unitId: "dramaturgo",
    verb: "corto.emit",
    mock: true,
    cortos,
  };
}

/**
 * @param {Array<object>} cortos
 * @param {{
 *   universeId?: string,
 *   unitId?: string,
 *   verb?: string,
 *   start?: string,
 *   end?: string,
 * }} filter
 */
export function queryCortos(cortos, filter = {}) {
  return cortos.filter((c) => {
    if (filter.universeId && c.universeId !== filter.universeId) return false;
    if (filter.unitId && c.unitId !== filter.unitId) return false;
    if (filter.verb && c.verb !== filter.verb) return false;
    if (filter.start && c.interval.start < filter.start) return false;
    if (filter.end && c.interval.end > filter.end) return false;
    return true;
  });
}

/**
 * Verifica que cada corto traza a un pieceId del snapshot Onfalo.
 * @param {Array<object>} cortos
 * @param {Set<string>|string[]} sealedPieceIds
 */
export function assertOnfaloTrace(cortos, sealedPieceIds) {
  const sealed = sealedPieceIds instanceof Set
    ? sealedPieceIds
    : new Set(sealedPieceIds);
  for (const c of cortos) {
    if (!Array.isArray(c.onfaloTrace) || c.onfaloTrace.length === 0) {
      throw new Error(`corto ${c.cortoId} sin onfaloTrace`);
    }
    for (const urn of c.onfaloTrace) {
      const m = /^urn:onfalo:(.+)$/.exec(urn);
      if (!m || !sealed.has(m[1])) {
        throw new Error(
          `corto ${c.cortoId} traza a Onfalo desconocido: ${urn}`,
        );
      }
    }
  }
  return true;
}
