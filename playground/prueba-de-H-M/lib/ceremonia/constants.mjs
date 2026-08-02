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
 * Verbos secundarios que emiten pasos concretos (raíz de confianza).
 * Antes vivían inline en evidence.mjs; el verificador no podía cruzarlos.
 */
export const CEREMONY_SECONDARY_VERBS = Object.freeze([
  Object.freeze({ step: 5, verb: "document.analyze", unitId: "bartleby" }),
  Object.freeze({ step: 10, verb: "corto.query", unitId: "dramaturgo" }),
  Object.freeze({ step: 11, verb: "provenance.trace", unitId: "portal" }),
  Object.freeze({ step: 11, verb: "unit.stop", unitId: "portal" }),
  Object.freeze({ step: 11, verb: "pod.revoke", unitId: "portal" }),
  Object.freeze({ step: 11, verb: "session.exit", unitId: "portal" }),
]);

/**
 * Índice de parejas bilaterales esperadas (primarias + secundarias).
 * ÚNICA fuente de las cifras 17 parejas / 34 activities: nadie las escribe a mano.
 */
export const EXPECTED_ACTIVITY_PAIRS = Object.freeze([
  ...CEREMONY_STEPS.map((s) =>
    Object.freeze({
      step: s.order,
      verb: s.verb,
      unitId: s.unitId,
      secondary: false,
    }),
  ),
  ...CEREMONY_SECONDARY_VERBS.map((s) =>
    Object.freeze({ step: s.step, verb: s.verb, unitId: s.unitId, secondary: true }),
  ),
]);

/** Clave canónica de una pareja: paso|verbo|secundario. */
export function activityPairKey(step, verb, secondary) {
  return `${step}|${verb}|${secondary ? "sec" : "pri"}`;
}

/** Claves esperadas — el verificador exige biyección contra activities/. */
export const EXPECTED_PAIR_KEYS = Object.freeze(
  EXPECTED_ACTIVITY_PAIRS.map((p) => activityPairKey(p.step, p.verb, p.secondary)),
);

/** Verbos esperados por cobertura (derivado, no escrito a mano). */
export const EXPECTED_CEREMONY_VERBS = Object.freeze([
  ...new Set(EXPECTED_ACTIVITY_PAIRS.map((p) => p.verb)),
]);

/** Unidades esperadas por cobertura (derivado de los pasos primarios). */
export const EXPECTED_CEREMONY_UNITS = Object.freeze([
  ...new Set(CEREMONY_STEPS.map((s) => s.unitId)),
]);

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

/**
 * Marcas del observador: lo ÚNICO que puede diferir entre las dos mitades.
 *
 * `causalCore()` DERIVA de esta lista por denylist (quitar), no por allowlist
 * (elegir). La diferencia importa: con allowlist un campo nuevo del envelope
 * queda fuera del núcleo en silencio y nadie se entera; con denylist entra por
 * defecto y hay que decidir explícitamente excluirlo.
 *
 * `instrument` y `timestamp` SÍ entran en el núcleo (medido: idénticos en las
 * 34 mitades de una corrida real). Antes se excluían, y por eso dos mitades que
 * registraban instrumentos distintos pasaban el verificador.
 */
export const CAUSAL_STRIPPED_FIELDS = Object.freeze(["actor", "digest"]);

/** Campos de `context` propios del observador (idem: solo `side` difiere). */
export const CAUSAL_STRIPPED_CONTEXT_FIELDS = Object.freeze(["side"]);

/**
 * Lo que comparten las dos mitades, dicho con precisión para la CA:
 * todo lo que registran salvo quién lo registra (`actor`), de qué lado
 * (`context.side`), el sufijo `:H`/`:M` del `id`, y su propio sello (`digest`).
 */
export const CAUSAL_SHARED_STATEMENT =
  "Las dos mitades comparten id (sin sufijo :H/:M), verb, object, target, " +
  "result, provenance, instrument, timestamp y context salvo `side`. " +
  "Difieren solo en actor, context.side, el sufijo del id y su propio digest.";
