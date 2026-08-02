/** WP-HUB-111 · arnés de escenarios descubribles */
export { discoverScenarios } from "./discover.mjs";
export {
  CONFORMIDAD_CHECKS,
  cargarReferentes,
  checkConformidad,
  runConformidadSuite,
} from "./conformidad.mjs";
export {
  V1_SCENARIO_IDS,
  V1_BARRIO_ID,
  PROMOTION_CLAIM_KEYS,
  isV1Scenario,
  classifyV1,
  readPromotionClaims,
} from "./v1-allowlist.mjs";
export { ejecutarEscenario } from "./ejecutar.mjs";
