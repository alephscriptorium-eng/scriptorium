/**
 * WP-HUB-111 · allowlist v1.
 * Sólo Barrio LORE (escenario canónico barrio-lore) entra en v1.
 * Autodeclaraciones en scenario.json (v1, promoteToV1, …) NO promueven.
 */

/** @type {readonly string[]} */
export const V1_SCENARIO_IDS = Object.freeze(["barrio-lore"]);

/** Barrio canónico del único escenario v1. */
export const V1_BARRIO_ID = "document-machine-sdk";

/**
 * @param {string} scenarioId
 * @returns {boolean}
 */
export function isV1Scenario(scenarioId) {
  return V1_SCENARIO_IDS.includes(scenarioId);
}

/**
 * Clasifica escenarios descubiertos. Ignora cualquier flag de auto-promoción
 * en el JSON del escenario.
 *
 * @param {Array<{ scenarioId: string, data?: object }>} discovered
 * @returns {{ v1: string[], nonV1: string[] }}
 */
export function classifyV1(discovered) {
  const v1 = [];
  const nonV1 = [];
  for (const d of discovered) {
    if (isV1Scenario(d.scenarioId)) v1.push(d.scenarioId);
    else nonV1.push(d.scenarioId);
  }
  return { v1, nonV1 };
}
