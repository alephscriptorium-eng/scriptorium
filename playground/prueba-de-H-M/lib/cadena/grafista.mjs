/**
 * Grafista mock — grafo que enlaza ambas linea:// con URNs VectorMock.
 */
import { LINE_FUTUROS, LINE_ONFALO } from "./constants.mjs";
import { digestObject } from "./hash.mjs";

/**
 * @param {{
 *   lines: Record<string, { uri: string, lineaKitSchema: string }>,
 *   vectorMock: { embeddings: Array<{ urn: string, pieceId: string }> },
 * }} ctx
 */
export function buildFuturesGraph(ctx) {
  const nodes = [
    {
      nodeId: "n-linea-onfalo",
      ref: ctx.lines[LINE_ONFALO].uri,
      lineaKitSchema: "manifest-tronco",
    },
    {
      nodeId: "n-linea-futuros",
      ref: ctx.lines[LINE_FUTUROS].uri,
      lineaKitSchema: "manifest-tronco",
    },
  ];

  for (const emb of ctx.vectorMock.embeddings) {
    nodes.push({
      nodeId: `n-vec-${emb.pieceId}`,
      ref: emb.urn,
    });
  }

  const edges = [
    {
      from: "n-linea-onfalo",
      to: "n-linea-futuros",
      relation: "derives",
    },
  ];

  for (const emb of ctx.vectorMock.embeddings) {
    edges.push({
      from: "n-linea-onfalo",
      to: `n-vec-${emb.pieceId}`,
      relation: "references",
    });
    edges.push({
      from: "n-linea-futuros",
      to: `n-vec-${emb.pieceId}`,
      relation: "references",
    });
  }

  // Bifurcación real hacia dos ramas de universo
  edges.push({
    from: "n-linea-futuros",
    to: "n-linea-onfalo",
    relation: "bifurcates",
  });

  const body = { graphId: "barrio-lore-futures-v1", nodes, edges };
  const digest = digestObject(body);

  return {
    unitId: "grafista",
    verb: "graph.bifurcate",
    mock: true,
    graph: {
      ...body,
      digest,
    },
  };
}
