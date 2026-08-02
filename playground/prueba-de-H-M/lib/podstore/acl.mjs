/**
 * Política de acceso evaluada por el POD (no por H).
 * H solo emite/transporta capacidades; el pod decide.
 *
 * Regla: solo ACL positiva y vigente concede. Omitida / inválida / expirada → deny.
 * No existe override de administrador. No existe comodín.
 */
import { FORBIDDEN_ACL_VERBS } from "./constants.mjs";

/**
 * @typedef {{ actor: string, verbs: string[], expiresAt?: string|null }} AclEntry
 */

/**
 * @param {unknown} entry
 * @returns {entry is AclEntry}
 */
export function isValidAclEntry(entry) {
  if (!entry || typeof entry !== "object") return false;
  const e = /** @type {Record<string, unknown>} */ (entry);
  if (typeof e.actor !== "string" || e.actor.length === 0) return false;
  if (!Array.isArray(e.verbs) || e.verbs.length === 0) return false;
  if (!e.verbs.every((v) => typeof v === "string" && v.length > 0)) return false;
  // El comodín no concede: una entrada que lo use es inválida, no universal.
  // Antes `verbs:["*"]` autorizaba verbos que nadie había declarado nunca.
  if (e.verbs.some((v) => FORBIDDEN_ACL_VERBS.includes(v))) return false;
  if (e.expiresAt != null && typeof e.expiresAt !== "string") return false;
  if (typeof e.expiresAt === "string" && Number.isNaN(Date.parse(e.expiresAt))) {
    return false;
  }
  return true;
}

/**
 * Evalúa si el actor puede ejecutar el verbo según ACL del pod.
 *
 * @param {object} opts
 * @param {AclEntry[]|null|undefined} opts.acl — omitida/null/[] → deny
 * @param {string} opts.actor
 * @param {string} opts.verb
 * @param {Date|string|number} [opts.now]
 * @param {boolean} [opts.adminOverride] — ignorado; nunca concede
 * @returns {{ allowed: boolean, reason: string }}
 */
export function evaluatePodAcl(opts) {
  const { actor, verb, adminOverride = false } = opts;
  const nowMs = opts.now == null ? Date.now() : new Date(opts.now).getTime();

  // Contratos: no hay override admin — si alguien lo pide, se registra y se niega.
  if (adminOverride === true) {
    return {
      allowed: false,
      reason: "admin-override-rejected",
    };
  }

  const acl = opts.acl;
  if (acl == null) {
    return { allowed: false, reason: "acl-omitted" };
  }
  if (!Array.isArray(acl) || acl.length === 0) {
    return { allowed: false, reason: "acl-omitted" };
  }

  /** @type {AclEntry[]} */
  const validEntries = [];
  let sawInvalid = false;
  for (const entry of acl) {
    if (!isValidAclEntry(entry)) {
      sawInvalid = true;
      continue;
    }
    validEntries.push(entry);
  }

  if (validEntries.length === 0) {
    return {
      allowed: false,
      reason: sawInvalid ? "acl-invalid" : "acl-omitted",
    };
  }

  const matching = validEntries.filter((e) => e.actor === actor);
  if (matching.length === 0) {
    return { allowed: false, reason: "acl-no-actor" };
  }

  let anyExpired = false;
  for (const entry of matching) {
    if (entry.expiresAt != null) {
      const exp = Date.parse(entry.expiresAt);
      if (exp <= nowMs) {
        anyExpired = true;
        continue;
      }
    }
    if (entry.verbs.includes(verb)) {
      return { allowed: true, reason: "acl-positive" };
    }
  }

  if (anyExpired) {
    return { allowed: false, reason: "acl-expired" };
  }
  return { allowed: false, reason: "acl-verb-denied" };
}
