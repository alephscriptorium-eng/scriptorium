/**
 * Tipestate de pod HM — chequeo exhaustivo.
 * Añadir un estado a POD_STATES sin su caso en `transitionAllowed` o
 * sin entrada en TRANSITION_TABLE rompe el test de exhaustividad.
 */
import { POD_STATES } from "./constants.mjs";

/**
 * Tabla canónica: cada estado de POD_STATES DEBE tener clave aquí.
 * Terminales: stopped, failed → [].
 * @type {Readonly<Record<string, readonly string[]>>}
 */
export const TRANSITION_TABLE = Object.freeze({
  declared: Object.freeze(["leased", "failed"]),
  leased: Object.freeze(["inflated", "failed"]),
  inflated: Object.freeze(["ready", "failed"]),
  ready: Object.freeze(["running", "failed"]),
  running: Object.freeze(["paused", "stopped", "failed"]),
  paused: Object.freeze(["running", "stopped", "failed"]),
  stopped: Object.freeze([]),
  failed: Object.freeze([]),
});

/**
 * @param {never} x
 * @returns {never}
 */
export function assertNeverState(x) {
  throw new Error(`tipestate: estado no manejado: ${JSON.stringify(x)}`);
}

/**
 * Switch exhaustivo sobre `from`. Si se añade un miembro a POD_STATES
 * sin case, el default llama assertNeverState (rompe en runtime/test).
 *
 * @param {string} from
 * @param {string} to
 * @returns {boolean}
 */
export function transitionAllowed(from, to) {
  switch (from) {
    case "declared":
      return to === "leased" || to === "failed";
    case "leased":
      return to === "inflated" || to === "failed";
    case "inflated":
      return to === "ready" || to === "failed";
    case "ready":
      return to === "running" || to === "failed";
    case "running":
      return to === "paused" || to === "stopped" || to === "failed";
    case "paused":
      return to === "running" || to === "stopped" || to === "failed";
    case "stopped":
      return false;
    case "failed":
      return false;
    default:
      return assertNeverState(from);
  }
}

/**
 * Verifica que TRANSITION_TABLE cubre exactamente POD_STATES.
 * Llamar desde tests / boot — fallo = contrato tipestate roto.
 */
export function assertTipestateExhaustive() {
  const tableKeys = Object.keys(TRANSITION_TABLE).sort();
  const states = [...POD_STATES].sort();
  if (tableKeys.length !== states.length) {
    throw new Error(
      `tipestate: TRANSITION_TABLE (${tableKeys.length}) ≠ POD_STATES (${states.length})`,
    );
  }
  for (const s of states) {
    if (!(s in TRANSITION_TABLE)) {
      throw new Error(`tipestate: falta TRANSITION_TABLE[${s}]`);
    }
    // Cruzar switch ↔ tabla
    for (const dest of POD_STATES) {
      const bySwitch = transitionAllowed(s, dest);
      const byTable = TRANSITION_TABLE[s].includes(dest);
      if (bySwitch !== byTable) {
        throw new Error(
          `tipestate: divergencia ${s}→${dest}: switch=${bySwitch} table=${byTable}`,
        );
      }
    }
  }
  return true;
}

/**
 * @param {string} from
 * @param {string} to
 */
export function assertTransition(from, to) {
  if (!POD_STATES.includes(/** @type {*} */ (from))) {
    throw new Error(`tipestate: from desconocido: ${from}`);
  }
  if (!POD_STATES.includes(/** @type {*} */ (to))) {
    throw new Error(`tipestate: to desconocido: ${to}`);
  }
  if (!transitionAllowed(from, to)) {
    throw new Error(`tipestate: transición ilegal ${from} → ${to}`);
  }
}
