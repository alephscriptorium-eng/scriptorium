/**
 * Firma por mitad: cada lado firma SOLO actividades de su actor.
 */
import { createHmac } from "node:crypto";
import { SIDE_ACTOR, SIDE_SIGN_SECRET } from "./constants.mjs";

/**
 * @param {"H"|"M"} side
 * @param {object} sealed — envelope sellado con digest
 */
export function signHalf(side, sealed) {
  const expectedActor = SIDE_ACTOR[side];
  if (!expectedActor) {
    throw new Error(`signHalf: lado desconocido ${side}`);
  }
  if (sealed.actor !== expectedActor) {
    throw new Error(
      `signHalf: ${side} no puede firmar actor ajeno (${sealed.actor})`,
    );
  }
  const secret = SIDE_SIGN_SECRET[side];
  const payload = `${sealed.id}|${sealed.digest}|${sealed.actor}`;
  const value = createHmac("sha256", secret).update(payload).digest("hex");
  return {
    side,
    activityId: sealed.id,
    digest: sealed.digest,
    algorithm: "hm-sim-hmac-sha256",
    value: `sha256:${value}`,
    signedAt: sealed.timestamp,
  };
}

/**
 * Verifica que un lado no pueda firmar la actividad del peer.
 * @param {"H"|"M"} side
 * @param {object} sealed
 * @returns {boolean} true si el rechazo es correcto
 */
export function assertCannotSignPeer(side, sealed) {
  try {
    signHalf(side, sealed);
    return false;
  } catch (e) {
    return /no puede firmar actor ajeno/.test(String(e.message || e));
  }
}
