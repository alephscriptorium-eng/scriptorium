/**
 * Envelope Activity + wire sellado + view.jsonld (DIC-4: huella = wire).
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { digestObject, sha256Digest, stableStringify } from "../cadena/hash.mjs";

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
 * Excluye actor/timestamp/instrument/context/digest (ver CAUSAL_STRIPPED_FIELDS).
 * La igualdad H/M se verifica recomputeando este núcleo desde wires independientes.
 */
export function causalCore(envelope) {
  return {
    id: envelope.id.replace(/:(H|M)$/, ""),
    verb: envelope.verb,
    object: envelope.object,
    target: envelope.target ?? null,
    result: envelope.result,
    provenance: {
      source: envelope.provenance.source,
      upstream: [...(envelope.provenance.upstream ?? [])],
    },
  };
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
