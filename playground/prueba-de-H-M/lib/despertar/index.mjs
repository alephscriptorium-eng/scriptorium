/** WP-HUB-109 · despertar lore-voz */
export {
  DISTRITO_LORE_VOZ,
  BARRIO_NOVELIST,
  DISTRITO_NOVELIST,
  ESTADO_DORMIDO,
  ESTADO_DESPIERTO,
  MAPA_PROYECCION_CANDIDATES,
  DEFAULT_OUT_REL,
} from "./constants.mjs";
export { parseCensoExcerptMd, loadCensoIds } from "./censo-ids.mjs";
export {
  loadMapaProyeccion,
  assertBarriosEnMapa,
} from "./projection-hook.mjs";
export {
  collectActasFromEvidence,
  sealActasDoc,
  writeActas,
} from "./actas.mjs";
export {
  loadElencoFixture,
  issueCharacterLease,
  bindElencoConLeases,
  writeElenco,
} from "./elenco.mjs";
export {
  inspectEvidenceForWake,
  despertarLoreVoz,
  readCensoRuntime,
} from "./despertar.mjs";
