/**
 * WP-HUB-111 · allowlist v1.
 * Sólo Barrio LORE (escenario canónico barrio-lore) entra en v1.
 * Autodeclaraciones en scenario.json (v1, promoteToV1, …) NO promueven.
 *
 * Corrección ZV (auditoría 2026-08-02): `classifyV1` sólo leía `d.scenarioId` y
 * jamás `d.data`, así que el test «flags hostiles no promueven» era verde **por
 * construcción**: no había código de manejo de banderas que pudiera fallar. La
 * defensa real vivía en el schema (`additionalProperties: false`), no aquí.
 *
 * Ahora `classifyV1` **lee** los datos: no para decidir —la decisión sigue
 * siendo id-only, y eso es deliberado— sino para **contabilizar** qué pretensión
 * de promoción vio y descartó. Eso vuelve la aserción falsable por dos lados:
 *   · si alguien hiciera que las banderas promuevan → `v1` cambia y enrojece;
 *   · si alguien borrara la lectura de datos → `ignoredClaims` queda vacío y
 *     enrojece.
 */

/** @type {readonly string[]} */
export const V1_SCENARIO_IDS = Object.freeze(["barrio-lore"]);

/** Barrio canónico del único escenario v1. */
export const V1_BARRIO_ID = "document-machine-sdk";

/** Claves nombradas que un escenario podría usar para auto-promoverse. */
export const PROMOTION_CLAIM_KEYS = Object.freeze([
  "v1",
  "isV1",
  "promote",
  "promoteToV1",
  "promotion",
  "tier",
  "allowlist",
]);

/** Familias de clave con forma de auto-promoción (por si aparece una nueva). */
const PROMOTION_KEY_SHAPE = /^(v1|isv1|promot|tier|allowlist)/i;

/**
 * @param {string} scenarioId
 * @returns {boolean}
 */
export function isV1Scenario(scenarioId) {
  return V1_SCENARIO_IDS.includes(scenarioId);
}

/**
 * Pretensiones de promoción presentes en el JSON de un escenario.
 * Sólo informa; nunca decide.
 *
 * @param {object|undefined} data
 * @returns {string[]} claves con valor no-falsy, en forma `clave=valor`
 */
export function readPromotionClaims(data) {
  if (!data || typeof data !== "object") return [];
  const claims = [];
  for (const [key, value] of Object.entries(data)) {
    if (!PROMOTION_CLAIM_KEYS.includes(key) && !PROMOTION_KEY_SHAPE.test(key)) continue;
    if (value === false || value === null || value === undefined || value === "") continue;
    claims.push(`${key}=${JSON.stringify(value)}`);
  }
  return claims.sort();
}

/**
 * Clasifica escenarios descubiertos. La pertenencia a v1 se decide **sólo** por
 * `scenarioId` contra `V1_SCENARIO_IDS`; los datos se leen para dejar acta de
 * las pretensiones ignoradas.
 *
 * @param {Array<{ scenarioId: string, data?: object }>} discovered
 * @returns {{
 *   v1: string[],
 *   nonV1: string[],
 *   ignoredClaims: Array<{ scenarioId: string, claims: string[] }>,
 *   inspected: number,
 * }}
 */
export function classifyV1(discovered) {
  const v1 = [];
  const nonV1 = [];
  /** @type {Array<{ scenarioId: string, claims: string[] }>} */
  const ignoredClaims = [];
  let inspected = 0;

  for (const d of discovered) {
    const claims = readPromotionClaims(d.data);
    inspected += 1;

    if (isV1Scenario(d.scenarioId)) {
      v1.push(d.scenarioId);
      continue;
    }
    nonV1.push(d.scenarioId);
    if (claims.length) {
      // Se vio, se nombra y NO se obedece.
      ignoredClaims.push({ scenarioId: d.scenarioId, claims });
    }
  }

  return { v1, nonV1, ignoredClaims, inspected };
}
