/**
 * WP-HUB-110 · fronteras con nombre propio (matriz de negativos).
 *
 * DOS CANALES QUE NO SE PUEDEN CONFUNDIR
 * --------------------------------------
 * La versión anterior tenía un solo canal: `failNegativo(frontera, detalle)`
 * lanzaba `NegativoError`, y el arnés aceptaba *cualquier* `NegativoError` con
 * la frontera esperada como PASS. Como los propios provocadores usaban
 * `failNegativo` para decir «no conseguí provocar nada» —incluido el caso en
 * que el pod materializaba SIN lease—, una rotura real de seguridad se
 * imprimía como `PASS — negativo «pod sin lease»`.
 *
 * Aquí los dos canales son mecanismos de control de flujo distintos:
 *
 *   · ÉXITO  → el provocador **RETORNA** una `Refusal`. Es el único valor que
 *              el arnés puede convertir en PASS.
 *   · FALLO  → el provocador **LANZA** `ProvocadorError`. Cualquier throw, de
 *              la clase que sea, es FAIL. No hay excepción que valga un PASS.
 *
 * Un `throw` nunca es un `return`: la confusión ya no es un descuido de
 * revisión, es imposible por construcción.
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

/**
 * El SISTEMA se negó. Único resultado que el arnés puede leer como PASS.
 *
 * No es una excepción a propósito: no se lanza, se devuelve. Y no la puede
 * fabricar un `catch` genérico, porque quien la construye tiene que aportar
 * el error real del sistema y la evidencia de que la negativa ocurrió donde
 * se decía.
 */
export class Refusal {
  /**
   * @param {object} input
   * @param {string} input.frontier — frontera del negativo (NEG_FRONTIER)
   * @param {string|null} input.systemFrontier — nombre propio que el SISTEMA
   *   dio a su negativa, o `null` si el sistema no tiene frontera nombrada
   *   para este caso (y entonces se dice, no se inventa).
   * @param {unknown} input.systemError — el error tal cual lo lanzó el sistema
   * @param {Record<string, unknown>} input.evidence — hechos comprobados
   *   (rutas, códigos, residuos) que sostienen la negativa
   */
  constructor(input) {
    if (!input?.frontier) {
      throw new ProvocadorError("(interno)", "Refusal sin frontera");
    }
    if (input.systemError === undefined) {
      throw new ProvocadorError(
        input.frontier,
        "Refusal sin el error del sistema: una negativa que nadie lanzó no es una negativa",
      );
    }
    this.frontier = input.frontier;
    this.systemFrontier = input.systemFrontier ?? null;
    this.systemError = input.systemError;
    this.systemMessage = String(
      /** @type {{message?: string}} */ (input.systemError)?.message ??
        input.systemError,
    );
    this.evidence = Object.freeze({ ...(input.evidence ?? {}) });
    Object.freeze(this);
  }
}

/**
 * El PROVOCADOR falló: no montó el escenario, o el sistema **no** se negó.
 * Nunca es PASS. Se lanza; y como el canal de éxito es `return`, ningún arnés
 * lo puede confundir con una negativa del sistema.
 */
export class ProvocadorError extends Error {
  /**
   * @param {string} frontier
   * @param {string} detail
   * @param {{ cause?: unknown }} [opts]
   */
  constructor(frontier, detail, opts = {}) {
    super(`provocador «${frontier}» no probó nada: ${detail}`);
    this.name = "ProvocadorError";
    this.frontier = frontier;
    this.detail = detail;
    if (opts.cause !== undefined) this.cause = opts.cause;
  }
}

/**
 * El provocador no consiguió provocar. Atajo legible; el canal es el mismo.
 * @param {string} frontier
 * @param {string} detail
 * @param {{ cause?: unknown }} [opts]
 * @returns {never}
 */
export function provocadorRoto(frontier, detail, opts) {
  throw new ProvocadorError(frontier, detail, opts);
}

/**
 * El sistema NO se negó cuando debía. Es el peor resultado posible: significa
 * que el guardián no está, y se dice con esas palabras.
 * @param {string} frontier
 * @param {string} detail
 * @returns {never}
 */
export function sistemaNoSeNego(frontier, detail) {
  throw new ProvocadorError(
    frontier,
    `EL SISTEMA NO SE NEGÓ — ${detail}`,
  );
}
