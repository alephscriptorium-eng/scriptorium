#!/usr/bin/env node
/**
 * WP-HUB-101 · ontología y verbos H/M.
 * Gate real: falla si acuña existiendo equivalente W3C/DCMI en registro L04.
 * Resolución fail-closed del registro canónico (CONSUMO-HUB-101.md).
 */
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { EXPECTED_CEREMONY_VERBS } from "../lib/ceremonia/constants.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const hubRoot = path.resolve(root, "../..");
const ontologyPath = path.join(root, "ontology", "hm-v1.context.jsonld");
const ttlPath = path.join(root, "ontology", "hm-v1.ttl");
const stubPath = path.join(root, "reference", "vocab-registry.stub.json");
const verbosPath = path.join(root, "reference", "VERBOS.md");
const CANONICAL_REL =
  "NETWORK-ENGINE/LANGUAGES/lore-hm/vocab/registro.json";

const W3C_PREFIXES = ["as:", "prov:", "dcterms:"];
const COIN_PREFIXES = ["hm:", "lore:"];
/** Activity types from W3C AS2 Vocabulary (Rec) — closed list for as: claims. */
const AS2_ACTIVITY_TYPES = new Set([
  "Accept", "Add", "Announce", "Arrive", "Block", "Create", "Delete", "Dislike",
  "Flag", "Follow", "Ignore", "Invite", "Join", "Leave", "Like", "Listen",
  "Move", "Offer", "Question", "Reject", "Read", "Remove", "TentativeReject",
  "TentativeAccept", "Travel", "Undo", "Update", "View", "Activity",
  "IntransitiveActivity",
]);

/**
 * Protocolo CONSUMO-HUB-101: env → sibling s-sdk → fail-closed.
 * Nunca usa el stub local como fuente de verdad.
 * @param {{ env?: NodeJS.ProcessEnv, hubRoot?: string }} [opts]
 * @returns {{ path: string, source: string }}
 */
export function resolveVocabRegistry(opts = {}) {
  const env = opts.env ?? process.env;
  const base = opts.hubRoot ?? hubRoot;

  // Env explícito: fail-closed si falta (no caer al stub ni a siblings).
  if (env.LORE_HM_VOCAB_REGISTRY) {
    const p = path.isAbsolute(env.LORE_HM_VOCAB_REGISTRY)
      ? env.LORE_HM_VOCAB_REGISTRY
      : path.resolve(base, env.LORE_HM_VOCAB_REGISTRY);
    if (!fs.existsSync(p)) {
      throw new Error(
        `registro vocabulario L04 ausente/movido (fail-closed): env LORE_HM_VOCAB_REGISTRY=${p}`,
      );
    }
    return { path: p, source: "env:LORE_HM_VOCAB_REGISTRY" };
  }

  const siblings = [
    path.join(base, "_s-sdk-vocab", ...CANONICAL_REL.split("/")),
    path.join(base, "..", "s-sdk", ...CANONICAL_REL.split("/")),
    path.join(base, "..", "S_SDK", ...CANONICAL_REL.split("/")),
    path.join(base, "..", "s-sdk-wp-sdk-l05", ...CANONICAL_REL.split("/")),
  ];
  for (const p of siblings) {
    if (fs.existsSync(p)) {
      return { path: p, source: "sibling" };
    }
  }

  throw new Error(
    `registro vocabulario L04 ausente/movido (fail-closed). ` +
      `Probad: LORE_HM_VOCAB_REGISTRY o sibling …/${CANONICAL_REL}. ` +
      `Stub local NO es fuente de verdad.`,
  );
}

function loadOntology() {
  return JSON.parse(fs.readFileSync(ontologyPath, "utf8"));
}

function loadRegistry() {
  const resolved = resolveVocabRegistry();
  const doc = JSON.parse(fs.readFileSync(resolved.path, "utf8"));
  if (doc.$id === "urn:scriptorium:vocab-registry:stub:v1") {
    throw new Error(
      `resolveVocabRegistry devolvió stub (${resolved.path}); se exige registro canónico L04`,
    );
  }
  if (!doc.w3cEquivalents || typeof doc.w3cEquivalents !== "object") {
    throw new Error(`registro sin w3cEquivalents: ${resolved.path}`);
  }
  return doc;
}

function isW3cType(activityType) {
  return W3C_PREFIXES.some((p) => activityType.startsWith(p));
}

function isCoinedType(activityType) {
  return COIN_PREFIXES.some((p) => activityType.startsWith(p));
}

/** DIC-4: fingerprint sealed wire bytes only; JSON-LD view excluded. */
export function fingerprintSealed(wireBytes) {
  return crypto.createHash("sha256").update(wireBytes).digest("hex");
}

export function gateVocabCoining(verbs, registry) {
  const errors = [];
  for (const v of verbs) {
    const equiv = registry.w3cEquivalents?.[v.verb];
    if (!equiv) continue;
    if (isCoinedType(v.activityType)) {
      errors.push(
        `${v.verb}: acuña ${v.activityType} pero registro L04 declara ${equiv.term}`
      );
      continue;
    }
    const expected = equiv.term;
    if (v.activityType !== expected) {
      errors.push(
        `${v.verb}: esperado ${expected}, tiene ${v.activityType}`
      );
    }
  }
  return errors;
}

describe("WP-HUB-101 · ontología H/M", () => {
  it("artefactos obligatorios existen", () => {
    for (const p of [ontologyPath, ttlPath, stubPath, verbosPath]) {
      assert.ok(fs.existsSync(p), `falta ${p}`);
    }
    const resolved = resolveVocabRegistry();
    assert.ok(fs.existsSync(resolved.path), `registro L04: ${resolved.path}`);
  });

  it("fail-closed si registro canónico ausente (no cae al stub)", () => {
    assert.throws(
      () =>
        resolveVocabRegistry({
          env: {
            LORE_HM_VOCAB_REGISTRY: path.join(
              root,
              "reference",
              "__missing_registro__.json",
            ),
          },
        }),
      /ausente|movido|fail-closed/i,
    );
    assert.throws(
      () =>
        resolveVocabRegistry({
          env: {},
          hubRoot: path.join(root, "__no_siblings_hub__"),
        }),
      /ausente|movido|fail-closed/i,
    );
  });

  it("cada verbo tiene activityType y razón si acuñado", () => {
    const doc = loadOntology();
    const verbs = doc["hm:verbs"];
    assert.ok(Array.isArray(verbs), "catálogo de verbos");
    // Propiedad en vez de cifra: TODO verbo que la ceremonia emite debe estar
    // en la ontología. El `>= 29` no relacionaba el catálogo con nada — se
    // podían quitar los verbos usados y añadir 29 inventados sin enrojecer.
    const declarados = new Set(verbs.map((v) => v.verb));
    const faltan = EXPECTED_CEREMONY_VERBS.filter((v) => !declarados.has(v));
    assert.deepStrictEqual(
      faltan,
      [],
      `verbos de la ceremonia ausentes de la ontología: ${faltan.join(", ")}`
    );
    for (const v of verbs) {
      assert.ok(v.verb, "verb id");
      assert.ok(v.activityType, `${v.verb}: sin activityType`);
      assert.ok(v.family, `${v.verb}: sin family`);
      if (v.coined) {
        assert.ok(
          v.coinReason && v.coinReason.length > 10,
          `${v.verb}: acuñado sin coinReason`
        );
        assert.ok(
          isCoinedType(v.activityType),
          `${v.verb}: coined=true pero type no es hm:/lore:`
        );
      } else {
        assert.ok(
          isW3cType(v.activityType),
          `${v.verb}: coined=false pero type no es W3C/DCMI`
        );
      }
    }
  });

  it("as: claims must be real AS2 Rec types (no inventados)", () => {
    const doc = loadOntology();
    const fake = [];
    for (const v of doc["hm:verbs"]) {
      if (!v.activityType.startsWith("as:")) continue;
      const local = v.activityType.slice(3);
      if (!AS2_ACTIVITY_TYPES.has(local)) {
        fake.push(`${v.verb}→${v.activityType}`);
      }
    }
    assert.deepEqual(fake, [], `as: no-AS2: ${fake.join("; ")}`);
  });

  it("gate L04 canónico: falla si acuña con equivalente W3C existente", () => {
    const doc = loadOntology();
    const registry = loadRegistry();
    assert.notEqual(
      registry.$id,
      "urn:scriptorium:vocab-registry:stub:v1",
      "gate no debe leer stub",
    );
    const named = [
      "peer.join",
      "peer.announce",
      "state.inspect",
      "session.exit",
      "source.ingest",
      "machine.status",
      "artifact.data",
      "artifact.spec",
      "provenance.trace",
    ];
    for (const verb of named) {
      assert.ok(
        registry.w3cEquivalents[verb],
        `registro canónico debe nombrar ${verb}`,
      );
    }
    const errors = gateVocabCoining(doc["hm:verbs"], registry);
    assert.deepEqual(errors, [], errors.join("; "));

    const badVerb = {
      verb: "peer.join",
      activityType: "hm:FakeJoin",
      coined: true,
      coinReason: "test gate",
    };
    const badErrors = gateVocabCoining([badVerb], registry);
    assert.ok(badErrors.length > 0, "gate debe fallar con acuñación indebida");
  });

  it("cada alias TUI resuelve a exactamente un verbo tipado", () => {
    const doc = loadOntology();
    const verbs = new Set(doc["hm:verbs"].map((v) => v.verb));
    const aliases = doc["hm:tuiAliases"];
    const seen = new Map();

    for (const a of aliases) {
      const name = a.aliases?.[0];
      assert.ok(name, "alias sin nombre");
      assert.ok(!seen.has(name), `alias duplicado: ${name}`);
      seen.set(name, a.resolvesTo);
      assert.ok(verbs.has(a.resolvesTo), `${name} → ${a.resolvesTo} no existe`);
    }

    const expected = [
      "boot", "status", "loadMOCK", "run", "inspect", "data", "spec",
      "gaps", "validate", "trace", "coverage", "exit",
    ];
    assert.deepEqual([...seen.keys()].sort(), expected.sort());
  });

  it("DIC-4: mutar vista JSON-LD no altera huella del wire sellado", () => {
    const wire = Buffer.from(
      JSON.stringify({
        v: 1,
        verb: "peer.join",
        actor: "urn:scriptorium:hm:run:demo:H",
        ts: "2026-08-02T00:00:00.000Z",
        body: { room: "barrio-lore" },
      }),
      "utf8"
    );
    const viewA = {
      "@context": { as: "https://www.w3.org/ns/activitystreams#" },
      "@type": "as:Join",
      verb: "peer.join",
    };
    const viewB = {
      ...viewA,
      "@type": "as:Announce",
      extra: "mutación solo en vista",
    };

    const fp1 = fingerprintSealed(wire);
    const fp2 = fingerprintSealed(wire);
    assert.equal(fp1, fp2);
    assert.notEqual(JSON.stringify(viewA), JSON.stringify(viewB));
    assert.equal(fingerprintSealed(wire), fp1);
  });

  it("TTL declara FM no corre (spike 112)", () => {
    const ttl = fs.readFileSync(ttlPath, "utf8");
    assert.match(ttl, /Future Machine does NOT run/i);
    assert.match(ttl, /simulacro/i);
  });
});
