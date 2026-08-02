/**
 * WP-HUB-106 · constantes ceremonia barrio-lore-v1 (11 pasos bloqueantes).
 * Spike 112: simulacro playground; FM no corre.
 */

export const CEREMONY_ID = "barrio-lore-v1";
export const SCENARIO_ID = "barrio-lore";

export const ACTOR_H = "urn:scriptorium:hm:actor:anfitrion-h";
export const ACTOR_M = "urn:scriptorium:hm:actor:maestro-m";

export const SIDE_ACTOR = Object.freeze({
  H: ACTOR_H,
  M: ACTOR_M,
});

/** Secretos de firma simulacro — cada mitad firma SOLO la suya. */
export const SIDE_SIGN_SECRET = Object.freeze({
  H: "hm-playground-sign-H-v1",
  M: "hm-playground-sign-M-v1",
});

/**
 * Once pasos bloqueantes (BRIEF WP-HUB-106).
 * Cada paso declara verb primario + unit pod + upstream requerido.
 */
export const CEREMONY_STEPS = Object.freeze([
  {
    order: 1,
    verb: "peer.join",
    description: "Preflight e identidad H/M",
    unitId: "portal",
    upstream: [],
  },
  {
    order: 2,
    verb: "peer.announce",
    description: "Room y autoridad",
    unitId: "portal",
    upstream: [1],
  },
  {
    order: 3,
    verb: "unit.inflate",
    description: "Leases e inflación Bartleby/Cristalizador",
    unitId: "bartleby",
    upstream: [2],
  },
  {
    order: 4,
    verb: "machine.deploy",
    description: "Machine manifest y despliegue del resto",
    unitId: "cristalizador",
    upstream: [3],
  },
  {
    order: 5,
    verb: "source.ingest",
    description: "Ingest Onfalo y análisis Bartleby",
    unitId: "archivero",
    upstream: [4],
  },
  {
    order: 6,
    verb: "vector.mock-index",
    description: "VectorMock determinista",
    unitId: "vector-mock",
    upstream: [5],
  },
  {
    order: 7,
    verb: "line.materialize",
    description: "Dos líneas validadas con linea-kit",
    unitId: "pipeline",
    upstream: [6],
  },
  {
    order: 8,
    verb: "graph.bifurcate",
    description: "Grafo enlazado",
    unitId: "grafista",
    upstream: [7],
  },
  {
    order: 9,
    verb: "universe.instantiate",
    description: "Dos universos con runners y pods",
    unitId: "demiurgo",
    upstream: [8],
  },
  {
    order: 10,
    verb: "corto.emit",
    description: "Emisión y consulta de cortos",
    unitId: "dramaturgo",
    upstream: [9],
  },
  {
    order: 11,
    verb: "coverage.measure",
    description: "Trace, coverage y shutdown limpio",
    unitId: "portal",
    upstream: [10],
  },
]);

export const SIMULACRO_NOTE =
  "Future Machine no corre hoy; ceremonia playground-mock (spike WP-HUB-112).";

/**
 * Raíz de confianza del shutdown (fuera del pack de evidencia).
 * El verificador ignora `shutdownDoc.requiredVerbs` autocertificado.
 */
export const REQUIRED_SHUTDOWN_VERBS = Object.freeze([
  "coverage.measure",
  "provenance.trace",
  "unit.stop",
  "pod.revoke",
  "session.exit",
]);

/** Campos excluidos del núcleo causal H/M (declaración honesta). */
export const CAUSAL_STRIPPED_FIELDS = Object.freeze([
  "actor",
  "timestamp",
  "instrument",
  "context",
  "digest",
]);
