/**
 * WP-HUB-109 · despertar lore-voz — constantes e ids de censo (no inventados).
 */

/** Distrito que despierta tras ceremonia. */
export const DISTRITO_LORE_VOZ = "lore-voz";

/** Barrio que aporta elenco (NO pipeline). Id canónico CENSO-ESTADOS. */
export const BARRIO_NOVELIST = "novelist-editor";
export const DISTRITO_NOVELIST = "runtime-mcp";

/** Estados jugables del censo runtime (distintos del enum cantera vivo|latente|…). */
export const ESTADO_DORMIDO = "dormido";
export const ESTADO_DESPIERTO = "despierto";

/**
 * Rutas candidatas de la proyección/mapa de WP-HUB-108.
 * Si ninguna existe, el hook devuelve null y 109 opera solo con excerpts.
 */
export const MAPA_PROYECCION_CANDIDATES = Object.freeze([
  "ciudad/proyeccion/mapa-holones-distritos.json",
  "fixtures/mapa-holones-distritos.json",
]);

export const CENSO_EXCERPT_LORE_VOZ = "fixtures/censo-excerpt-lore-voz.md";
export const CENSO_EXCERPT_NOVELIST = "fixtures/censo-excerpt-novelist-editor.md";
export const ELENCO_FIXTURE = "fixtures/novelist-elenco.json";

/** Salida por defecto bajo ciudad/ (runtime derivado; regenerable). */
export const DEFAULT_OUT_REL = "ciudad/censo-runtime";
