/**
 * VectorMock determinista — embeddings + vecinos.
 * mock=true SIEMPRE; algoritmo y seed declarados; cero red / cero LLM.
 */
import {
  VECTOR_ALGORITHM,
  VECTOR_DIMS,
  VECTOR_SEED,
} from "./constants.mjs";
import { digestObject, sha256Hex } from "./hash.mjs";

function embedText(text, seed, dims) {
  const vec = new Array(dims).fill(0);
  const tokens = String(text)
    .toLowerCase()
    .split(/[^a-z0-9áéíóúñü]+/i)
    .filter((t) => t.length > 2);
  for (const token of tokens) {
    const h = sha256Hex(`${seed}:${token}`);
    for (let i = 0; i < dims; i++) {
      const byte = parseInt(h.slice(i * 2, i * 2 + 2), 16);
      vec[i] += (byte / 255) * 2 - 1;
    }
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => Number((v / norm).toFixed(6)));
}

function cosine(a, b) {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return Number(dot.toFixed(6));
}

/**
 * @param {{ analyses: Array<{ pieceId: string, sections: Array<{ summary: string }>, digest: string }> }} bartleby
 * @param {{ algorithm?: string, seed?: string }} [opts]
 */
export function indexAnalyses(bartleby, opts = {}) {
  const algorithm = opts.algorithm ?? VECTOR_ALGORITHM;
  const seed = opts.seed ?? VECTOR_SEED;
  const embeddings = [];

  for (const analysis of bartleby.analyses) {
    const text = analysis.sections.map((s) => s.summary).join("\n");
    const vector = embedText(text, seed, VECTOR_DIMS);
    const urn = `urn:vector:mock:${analysis.pieceId}`;
    embeddings.push({
      urn,
      pieceId: analysis.pieceId,
      onfaloUrn: analysis.onfaloUrn,
      analysisDigest: analysis.digest,
      vector,
      dims: VECTOR_DIMS,
    });
  }

  const neighbors = [];
  for (let i = 0; i < embeddings.length; i++) {
    const ranked = [];
    for (let j = 0; j < embeddings.length; j++) {
      if (i === j) continue;
      ranked.push({
        urn: embeddings[j].urn,
        score: cosine(embeddings[i].vector, embeddings[j].vector),
      });
    }
    ranked.sort((a, b) => b.score - a.score);
    neighbors.push({
      urn: embeddings[i].urn,
      nearest: ranked.slice(0, 3),
    });
  }

  const result = {
    unitId: "vector-mock",
    verb: "vector.mock-index",
    mock: true,
    algorithm,
    seed,
    dims: VECTOR_DIMS,
    embeddings,
    neighbors,
  };
  result.digest = digestObject({
    algorithm,
    seed,
    embeddings: embeddings.map((e) => ({ urn: e.urn, vector: e.vector })),
    neighbors,
  });

  if (result.mock !== true) {
    throw new Error("VectorMock exige mock=true");
  }
  return result;
}
