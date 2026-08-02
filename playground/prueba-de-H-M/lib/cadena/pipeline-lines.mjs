/**
 * Pipeline mock — materializa dos líneas @zeus/linea-kit (manifest-tronco).
 * Cristalizador NO hace esto.
 */
import { LINE_FUTUROS, LINE_ONFALO } from "./constants.mjs";
import { digestObject } from "./hash.mjs";

/**
 * @param {{
 *   pieces: Array<{ pieceId: string, sha256: string }>,
 *   bartleby: { analyses: Array<{ pieceId: string, digest: string, onfaloUrn: string }> },
 *   vectorMock: { embeddings: Array<{ urn: string, pieceId: string }> },
 * }} ctx
 */
export function materializeLines(ctx) {
  const onfaloNodos = ctx.pieces.map((p, i) => {
    const analysis = ctx.bartleby.analyses.find((a) => a.pieceId === p.pieceId);
    const emb = ctx.vectorMock.embeddings.find((e) => e.pieceId === p.pieceId);
    return {
      id: `ONF-${String(i + 1).padStart(2, "0")}`,
      pieceId: p.pieceId,
      paths: {
        raw: `fixtures/onfalo/pieces/${p.pieceId}.md`,
        analysis: `analysis/${p.pieceId}.json`,
      },
      urls: {
        onfalo: analysis?.onfaloUrn ?? `urn:onfalo:${p.pieceId}`,
        vector: emb?.urn ?? `urn:vector:mock:${p.pieceId}`,
      },
      stage: "raw→análisis→refs-vectoriales",
    };
  });

  const onfalo = {
    meta: {
      corpus: LINE_ONFALO,
      version: "1.0.0",
      generated_at: "2026-08-02T00:00:00.000Z",
      source: "fixtures/onfalo",
      autor_tronco: "pipeline-mock",
      referencia_wp_cima: "WP-HUB-105",
      nodo_count: onfaloNodos.length,
      mock: true,
      chain: "raw→análisis→referencias-vectoriales",
    },
    nodos: onfaloNodos,
  };

  const futurosNodos = [
    {
      id: "FUT-01",
      stage: "grafo",
      paths: { graph: "artifacts/graph.json" },
      urls: { linea_onfalo: `linea://${LINE_ONFALO}` },
    },
    {
      id: "FUT-02",
      stage: "universos",
      paths: { universes: "artifacts/universes.json" },
      urls: {
        alpha: "urn:hm:universe:universe-alpha",
        beta: "urn:hm:universe:universe-beta",
      },
    },
    {
      id: "FUT-03",
      stage: "cortos",
      paths: { cortos: "artifacts/cortos.json" },
      urls: { query: "corto.query" },
    },
  ];

  const futuros = {
    meta: {
      corpus: LINE_FUTUROS,
      version: "1.0.0",
      generated_at: "2026-08-02T00:00:00.000Z",
      source: "grafo→universos→cortos",
      autor_tronco: "pipeline-mock",
      referencia_wp_cima: "WP-HUB-105",
      nodo_count: futurosNodos.length,
      mock: true,
      chain: "grafo→universos→cortos",
    },
    nodos: futurosNodos,
  };

  return {
    unitId: "pipeline",
    verb: "line.materialize",
    mock: true,
    lines: {
      [LINE_ONFALO]: {
        lineId: LINE_ONFALO,
        uri: `linea://${LINE_ONFALO}`,
        lineaKitSchema: "manifest-tronco",
        payload: onfalo,
        digest: digestObject(onfalo),
      },
      [LINE_FUTUROS]: {
        lineId: LINE_FUTUROS,
        uri: `linea://${LINE_FUTUROS}`,
        lineaKitSchema: "manifest-tronco",
        payload: futuros,
        digest: digestObject(futuros),
      },
    },
  };
}
