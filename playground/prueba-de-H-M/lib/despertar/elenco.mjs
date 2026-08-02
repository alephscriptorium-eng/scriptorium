/**
 * Elenco NovelistEditor (runtime-mcp) → identidades H/M.
 * Aporta personajes + lease cada uno. NO es pipeline.
 */
import { createHmac, randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { digestObject } from "../cadena/hash.mjs";
import { ACTOR_H, ACTOR_M } from "../ceremonia/constants.mjs";
import {
  BARRIO_NOVELIST,
  DISTRITO_NOVELIST,
  ELENCO_FIXTURE,
} from "./constants.mjs";

/**
 * @param {string} kitRoot
 */
export function loadElencoFixture(kitRoot) {
  const p = join(kitRoot, ELENCO_FIXTURE);
  if (!existsSync(p)) throw new Error(`falta elenco novelist: ${p}`);
  const doc = JSON.parse(readFileSync(p, "utf8"));
  if (doc.sourceBarrioId !== BARRIO_NOVELIST) {
    throw new Error(
      `elenco sourceBarrioId=${doc.sourceBarrioId} (espera ${BARRIO_NOVELIST})`,
    );
  }
  if (doc.sourceDistrito !== DISTRITO_NOVELIST) {
    throw new Error(
      `elenco sourceDistrito=${doc.sourceDistrito} (espera ${DISTRITO_NOVELIST})`,
    );
  }
  if (doc.aporte !== "elenco" || doc.notPipeline !== true) {
    throw new Error("elenco debe declarar aporte=elenco y notPipeline=true");
  }
  return doc;
}

/**
 * Emite lease por personaje (sim playground; distinto de leases de unidades pipeline).
 * @param {{ characterId: string, identity: "H"|"M", runId: string }} opts
 */
export function issueCharacterLease(opts) {
  const emitterIri = ACTOR_H;
  const receiverIri = opts.identity === "H" ? ACTOR_H : ACTOR_M;
  const issuedAt = "2026-08-02T00:12:00.000Z";
  const expiresAt = "2026-08-02T12:00:00.000Z";
  const leaseId = `lease-char-${opts.characterId}-${opts.runId}`;
  const payload = `${leaseId}|${opts.characterId}|${issuedAt}|${expiresAt}`;
  const value = createHmac("sha256", "hm-novelist-elenco-lease-v1")
    .update(payload)
    .digest("hex");
  return {
    leaseId,
    emitterIri,
    receiverIri,
    characterId: opts.characterId,
    unitId: `character:${opts.characterId}`,
    permissions: ["character.bind", "pod.observe"],
    issuedAt,
    expiresAt,
    signature: { algorithm: "hmac-sha256", value },
    sourceBarrioId: BARRIO_NOVELIST,
    notPipeline: true,
  };
}

/**
 * @param {object} elencoFixture
 * @param {string} runId
 */
export function bindElencoConLeases(elencoFixture, runId) {
  /** @type {Array<object>} */
  const bound = [];

  for (const side of /** @type {const} */ (["H", "M"])) {
    const block = elencoFixture.identities?.[side];
    if (!block?.characters || !Array.isArray(block.characters)) {
      throw new Error(`elenco sin characters[] para identidad ${side}`);
    }
    if (block.characters.length < 2) {
      throw new Error(
        `identidad ${side}: se exigen ≥2 personajes novelist (got ${block.characters.length})`,
      );
    }
    for (const ch of block.characters) {
      if (!ch.characterId) throw new Error(`personaje sin characterId (${side})`);
      const lease = issueCharacterLease({
        characterId: ch.characterId,
        identity: side,
        runId,
      });
      bound.push({
        identity: side,
        actorId: block.actorId,
        character: {
          characterId: ch.characterId,
          name: ch.name,
          description: ch.description ?? "",
        },
        lease,
      });
    }
  }

  const doc = {
    kind: "hm-elenco-identidad",
    version: 1,
    runId,
    sourceBarrioId: BARRIO_NOVELIST,
    sourceDistrito: DISTRITO_NOVELIST,
    aporte: "elenco",
    notPipeline: true,
    bindings: bound,
  };
  return { ...doc, digest: digestObject(doc) };
}

/**
 * @param {string} outDir
 * @param {object} elencoDoc
 */
export function writeElenco(outDir, elencoDoc) {
  mkdirSync(outDir, { recursive: true });
  const p = join(outDir, "elenco.json");
  writeFileSync(p, `${JSON.stringify(elencoDoc, null, 2)}\n`);
  return p;
}

/** nonce opcional para tests que quieran forzar leaseIds distintos */
export function _testNonce() {
  return randomBytes(2).toString("hex");
}
