/**
 * Constantes LocalPodProvider (WP-HUB-103).
 * Marca explícita de simulación: este proveedor NUNCA es un Pod Solid real.
 */

/** @type {readonly ["declared","leased","inflated","ready","running","paused","stopped","failed"]} */
export const POD_STATES = Object.freeze([
  "declared",
  "leased",
  "inflated",
  "ready",
  "running",
  "paused",
  "stopped",
  "failed",
]);

/** Metadatos públicos del proveedor — frontera simulación vs Solid. */
export const PROVIDER_META = Object.freeze({
  providerId: "local-pod-provider",
  kind: "files-first-simulation",
  simulation: true,
  isSolidPod: false,
  solidCompatible: false,
  solidPod: false,
  declared:
    "LocalPodProvider es simulacro playground (spike WP-HUB-112 / FM NO CORRE); " +
    "nunca se presenta como Pod Solid real.",
});

export const STATIC_UNIT_IDS = Object.freeze([
  "loreador",
  "bartleby",
  "archivero",
  "vector-mock",
  "grafista",
  "demiurgo",
  "dramaturgo",
  "pipeline",
  "portal",
  "cristalizador",
]);

export const POD_IRI_PREFIX = "urn:scriptorium:hm:";

/**
 * @param {string} runId
 * @param {string} unitId
 */
export function podIri(runId, unitId) {
  return `${POD_IRI_PREFIX}${runId}:pod:${unitId}`;
}

/**
 * @param {string} universeId
 */
export function universeRunnerUnitId(universeId) {
  return `universe-runner-${universeId}`;
}
