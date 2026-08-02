/**
 * Envelope Activity + wire sellado + view.jsonld (DIC-4: huella = wire).
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { digestObject, sha256Digest, stableStringify } from "../cadena/hash.mjs";
import {
  CAUSAL_STRIPPED_FIELDS,
  CAUSAL_STRIPPED_CONTEXT_FIELDS,
} from "./constants.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const defaultOntology = join(here, "../../ontology/hm-v1.context.jsonld");

/**
 * @param {object} opts
 * @param {string} opts.id
 * @param {string} opts.actor
 * @param {string} opts.verb
 * @param {string} opts.object
 * @param {string} [opts.target]
 * @param {object} [opts.context]
 * @param {string} [opts.instrument]
 * @param {string} opts.timestamp
 * @param {"pass"|"fail"|"pending"} opts.result
 * @param {{ source: string, upstream?: string[] }} opts.provenance
 */
export function buildEnvelope(opts) {
  const env = {
    id: opts.id,
    actor: opts.actor,
    verb: opts.verb,
    object: opts.object,
    timestamp: opts.timestamp,
    result: opts.result,
    provenance: {
      source: opts.provenance.source,
      upstream: [...(opts.provenance.upstream ?? [])],
    },
  };
  if (opts.target != null) env.target = opts.target;
  if (opts.context != null) env.context = opts.context;
  if (opts.instrument != null) env.instrument = opts.instrument;
  return env;
}

/**
 * Núcleo causal — fila compartida H/M.
 *
 * DERIVADO de CAUSAL_STRIPPED_FIELDS / CAUSAL_STRIPPED_CONTEXT_FIELDS: se quita
 * lo que es marca del observador y entra TODO lo demás, incluidos campos que
 * aún no existen. Antes era una allowlist positiva que solo coincidía con la
 * constante por intención del autor: divergir era silencioso e imposible de
 * detectar. Ver CAUSAL_SHARED_STATEMENT para el enunciado exacto.
 */
export function causalCore(envelope) {
  /** @type {Record<string, unknown>} */
  const core = {};
  for (const [k, v] of Object.entries(envelope)) {
    if (CAUSAL_STRIPPED_FIELDS.includes(k)) continue;
    core[k] = v;
  }
  // El sufijo :H/:M del id es marca de observador, no del hecho registrado.
  core.id = String(envelope.id).replace(/:(H|M)$/, "");
  // Normalizaciones estables (target ausente ≡ target null, upstream ausente ≡ []).
  // Se conserva el resto de `provenance`: normalizar no puede convertirse en
  // una allowlist encubierta que descarte campos en silencio.
  core.target = envelope.target ?? null;
  core.provenance = {
    ...(envelope.provenance ?? {}),
    source: envelope.provenance?.source ?? null,
    upstream: [...(envelope.provenance?.upstream ?? [])],
  };
  if (envelope.context != null && typeof envelope.context === "object") {
    /** @type {Record<string, unknown>} */
    const ctx = {};
    for (const [k, v] of Object.entries(envelope.context)) {
      if (CAUSAL_STRIPPED_CONTEXT_FIELDS.includes(k)) continue;
      ctx[k] = v;
    }
    core.context = ctx;
  }
  return core;
}

export function causalDigest(envelope) {
  return digestObject(causalCore(envelope));
}

/** Sella wire: digest = sha256 del envelope sin campo digest. */
export function sealWire(envelope) {
  const digest = digestObject(envelope);
  return { ...envelope, digest };
}

/**
 * Vista JSON-LD aditiva — NO entra en la huella del wire.
 * @param {object} sealed — envelope con digest
 * @param {{ ontologyPath?: string }} [opts]
 */
export function buildViewJsonLd(sealed, opts = {}) {
  const ontologyPath = opts.ontologyPath ?? defaultOntology;
  const ontology = JSON.parse(readFileSync(ontologyPath, "utf8"));
  const verbEntry = (ontology["hm:verbs"] ?? []).find((v) => v.verb === sealed.verb);
  const activityType = verbEntry?.activityType ?? "as:Activity";
  return {
    "@context": [
      "https://www.w3.org/ns/activitystreams",
      {
        prov: "http://www.w3.org/ns/prov#",
        hm: "urn:scriptorium:hm:v1:",
        lore: "urn:scriptorium:lore:v1:",
      },
    ],
    "@id": sealed.id,
    "@type": activityType,
    "as:actor": { "@id": sealed.actor },
    "as:object": sealed.object,
    "as:published": sealed.timestamp,
    "hm:verb": sealed.verb,
    "hm:result": sealed.result,
    "hm:digest": sealed.digest,
    "prov:wasDerivedFrom": (sealed.provenance?.upstream ?? []).map((u) => ({
      "@id": u,
    })),
    "hm:viewNote":
      "Vista aditiva; huella DIC-4 = sha256(bytes wire.json), no de esta vista.",
  };
}

export function wireBytes(sealed) {
  return Buffer.from(stableStringify(sealed), "utf8");
}

export function huellaLedger(sealed) {
  return sha256Digest(wireBytes(sealed));
}

export { digestObject, stableStringify };
