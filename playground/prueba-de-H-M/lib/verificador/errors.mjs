/**
 * Fronteras con nombre propio (WP-HUB-107) — no error genérico.
 */

export const FRONTIER = Object.freeze({
  HASH_ROTO: "hash roto",
  ACL_EXPIRADA: "ACL expirada",
  TRANSICION_ILEGAL: "transición ilegal",
  CORTO_SIN_TRAZA_ONFALO: "corto sin traza Onfalo",
  VECTORMOCK_SIN_DECLARAR: "VectorMock sin declarar",
  PIEZA_AUSENTE: "pieza ausente",
  WIRE_INVALIDO: "wire inválido",
  VIEW_JSONLD_INVALIDO: "view JSON-LD inválido",
  PROVENANCE_ROTA: "provenance rota",
  COBERTURA_INSUFICIENTE: "cobertura insuficiente",
  REPORTE_INVALIDO: "reporte inválido",
  SHUTDOWN_INCOMPLETO: "shutdown incompleto",
  SHUTDOWN_AUTOCERTIFICADO: "shutdown autocertificado",
  CADENA_CAUSAL_DIVERGE: "cadena causal diverge",
});

export class VerifierError extends Error {
  /**
   * @param {string} frontier — nombre propio de frontera
   * @param {string} detail
   */
  constructor(frontier, detail) {
    super(`${frontier}: ${detail}`);
    this.name = "VerifierError";
    this.frontier = frontier;
    this.code = frontier;
  }
}

/**
 * @param {string} frontier
 * @param {string} detail
 * @returns {never}
 */
export function failFrontier(frontier, detail) {
  throw new VerifierError(frontier, detail);
}
