/**
 * WP-HUB-110 · fronteras con nombre propio (matriz de negativos).
 * Cada negativo falla en su frontera; cero estado parcial.
 */

export const NEG_FRONTIER = Object.freeze({
  CORPUS_AUSENTE: "corpus ausente",
  HASH_ROTO: "hash roto",
  SCHEMA_INVALIDO: "schema inválido",
  POD_SIN_LEASE: "pod sin lease",
  VECTORMOCK_NO_DECLARADO: "VectorMock no declarado",
  UPSTREAM_AUSENTE: "upstream ausente",
  RUNNER_CAIDO: "runner caído",
});

export class NegativoError extends Error {
  /**
   * @param {string} frontier
   * @param {string} detail
   */
  constructor(frontier, detail) {
    super(`${frontier}: ${detail}`);
    this.name = "NegativoError";
    this.frontier = frontier;
    this.code = frontier;
  }
}

/**
 * @param {string} frontier
 * @param {string} detail
 * @returns {never}
 */
export function failNegativo(frontier, detail) {
  throw new NegativoError(frontier, detail);
}
