/**
 * Verificador externo — solo raíz de evidencia (WP-HUB-107).
 * Cero autocertificación: no abre dirs vivos H/M.
 */
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join, resolve, basename } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { digestObject } from "../cadena/hash.mjs";
import { transitionAllowed } from "../podstore/tipestate.mjs";
import { evaluatePodAcl } from "../podstore/acl.mjs";
import {
  REQUIRED_EVIDENCE_PIECES,
  SEALED_PACK_DOCS,
  computePackDigest,
} from "../ceremonia/evidence-pack.mjs";
import {
  ACTOR_H,
  ACTOR_M,
  REQUIRED_SHUTDOWN_VERBS,
  EXPECTED_ACTIVITY_PAIRS,
  EXPECTED_PAIR_KEYS,
  activityPairKey,
} from "../ceremonia/constants.mjs";
import { computeCoverage } from "../ceremonia/evidence.mjs";
import { causalDigest } from "../ceremonia/envelope.mjs";
import { FRONTIER, failFrontier, VerifierError } from "./errors.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const kitRoot = resolve(here, "../..");
const require = createRequire(import.meta.url);

/**
 * @param {string} evidenceRoot
 * @param {{ now?: string|Date|number }} [opts]
 * @returns {{ ok: true, runId: string, checks: string[] }}
 */
export function verificarEvidencia(evidenceRoot, opts = {}) {
  const root = resolve(evidenceRoot);
  const checks = [];

  if (!existsSync(root) || !statSync(root).isDirectory()) {
    failFrontier(FRONTIER.PIEZA_AUSENTE, `evidence root inexistente: ${root}`);
  }

  // Cero autocertificación: solo pieces bajo evidence/
  for (const rel of REQUIRED_EVIDENCE_PIECES) {
    const abs = join(root, rel);
    if (!existsSync(abs)) {
      failFrontier(FRONTIER.PIEZA_AUSENTE, rel);
    }
  }
  checks.push("piezas pack presentes");

  const report = readJson(join(root, "report.json"));
  const packManifest = readJson(join(root, "pack/manifest.json"));
  const aclDoc = readJson(join(root, "pack/acl.json"));
  const tipestateDoc = readJson(join(root, "pack/tipestate.json"));
  const vectorDoc = readJson(join(root, "pack/vector-mock.json"));
  const cortosDoc = readJson(join(root, "pack/cortos.json"));
  const shutdownDoc = readJson(join(root, "pack/shutdown.json"));
  const provenanceDoc = readJson(join(root, "pack/provenance.json"));

  // Wires leídos UNA vez: toda recomputación parte de aquí, no del report.
  // La evidencia se valida ANTES que el reporte: el reporte es la afirmación,
  // activities/ es el hecho. Así cada fallo sale con su nombre propio en vez
  // del de un guardián de cardinalidad que salta antes por casualidad.
  const wires = readAllWires(root);

  const wireVerbs = validateActivities(root, report, provenanceDoc, wires);
  checks.push("wire + JSON-LD + hashes");

  validateBilateralCausal(wires);
  checks.push("cadena causal H/M desde wires");

  validateReport(report, root, wires);
  checks.push("reporte");

  validateProvenance(provenanceDoc, report, wires);
  checks.push("provenance");

  validateCoverage(report, provenanceDoc, wires);
  checks.push("cobertura");

  validateAcl(aclDoc, opts.now ?? aclDoc.evaluatedAt ?? "2026-08-02T00:11:00.000Z");
  checks.push("ACL");

  validateTipestate(tipestateDoc);
  checks.push("tipestate");

  validateVectorMock(vectorDoc);
  checks.push("VectorMock declarado");

  validateCortos(cortosDoc);
  checks.push("cortos→Onfalo");

  validateShutdown(shutdownDoc, report, wireVerbs);
  checks.push("shutdown");

  if (packManifest.runId !== report.runId) {
    failFrontier(
      FRONTIER.PROVENANCE_ROTA,
      `pack.runId≠report.runId (${packManifest.runId}≠${report.runId})`,
    );
  }

  validatePackSeal(packManifest, root, report);
  checks.push("sello del pack recomputado");

  return { ok: true, runId: report.runId, checks };
}

/**
 * Sello del pack RECOMPUTADO desde los seis documentos en disco.
 *
 * Antes solo se comparaba `pack.runId === report.runId`: el campo `digest`
 * del manifest no lo leía nadie, así que podía valer sha256:f×64 —o el pack
 * podía mutarse sin tocarlo— y el veredicto seguía siendo ok.
 * @param {object} packManifest
 * @param {string} root
 * @param {object} report
 */
function validatePackSeal(packManifest, root, report) {
  if (typeof packManifest.digest !== "string" || !packManifest.digest) {
    failFrontier(FRONTIER.SELLO_PACK_ROTO, "manifest sin digest");
  }

  // La lista `required` también es autodeclarada: contrastarla con la raíz.
  const declaredRequired = [...(packManifest.required ?? [])].sort();
  const trustRequired = [...REQUIRED_EVIDENCE_PIECES].sort();
  if (JSON.stringify(declaredRequired) !== JSON.stringify(trustRequired)) {
    failFrontier(
      FRONTIER.SELLO_PACK_ROTO,
      `manifest.required ≠ raíz de confianza (${declaredRequired.length} vs ${trustRequired.length})`,
    );
  }

  /** @type {Record<string, unknown>} */
  const docs = {};
  for (const { key, rel } of SEALED_PACK_DOCS) {
    docs[key] = readJson(join(root, rel));
  }
  const expected = computePackDigest(docs, report.verdict);
  if (packManifest.digest !== expected) {
    failFrontier(
      FRONTIER.SELLO_PACK_ROTO,
      `digest declarado=${packManifest.digest} recomputado=${expected}`,
    );
  }
}

/**
 * Lee todos los wires una vez. Fuente de TODA recomputación posterior.
 * @param {string} root
 * @returns {Array<{ dir: string, wire: object }>}
 */
function readAllWires(root) {
  const actRoot = join(root, "activities");
  if (!existsSync(actRoot)) {
    failFrontier(FRONTIER.PIEZA_AUSENTE, "activities/");
  }
  /** @type {Array<{ dir: string, wire: object }>} */
  const out = [];
  for (const dir of readdirSync(actRoot)) {
    if (!statSync(join(actRoot, dir)).isDirectory()) continue;
    const wirePath = join(actRoot, dir, "wire.json");
    if (!existsSync(wirePath)) {
      failFrontier(FRONTIER.PIEZA_AUSENTE, `activities/${dir}/wire.json`);
    }
    out.push({ dir, wire: JSON.parse(readFileSync(wirePath, "utf8")) });
  }
  return out;
}

function validateReport(report, root, wires) {
  if (!report || typeof report !== "object") {
    failFrontier(FRONTIER.REPORTE_INVALIDO, "report.json no es objeto");
  }
  for (const k of [
    "reportId",
    "scenarioId",
    "runId",
    "matrix",
    "coverage",
    "verdict",
    "artifactChain",
  ]) {
    if (report[k] == null) {
      failFrontier(FRONTIER.REPORTE_INVALIDO, `falta campo ${k}`);
    }
  }
  // La matriz debe tener UNA fila por mitad registrada: cifra derivada de la
  // raíz de confianza (17 parejas × 2), no el «≥11» que dejaba borrar filas.
  const expectedRows = EXPECTED_ACTIVITY_PAIRS.length * 2;
  if (!Array.isArray(report.matrix) || report.matrix.length !== expectedRows) {
    failFrontier(
      FRONTIER.REPORTE_INVALIDO,
      `matrix ${report.matrix?.length ?? 0} filas ≠ ${expectedRows} esperadas (${EXPECTED_ACTIVITY_PAIRS.length} parejas × 2)`,
    );
  }
  // Y sus verbos deben ser exactamente los de los wires: la matriz no puede
  // declarar un reparto de verbos que la evidencia no respalda.
  const matrixVerbs = tally(report.matrix.map((m) => m.verb));
  const wireVerbTally = tally(wires.map((w) => w.wire.verb));
  const matrixDiff = tallyDiff(matrixVerbs, wireVerbTally);
  if (matrixDiff) {
    failFrontier(
      FRONTIER.REPORTE_INVALIDO,
      `matrix no coincide con wires: ${matrixDiff}`,
    );
  }
  if (report.verdict !== "pass") {
    failFrontier(FRONTIER.REPORTE_INVALIDO, `verdict=${report.verdict}`);
  }
  const md = readFileSync(join(root, "report.md"), "utf8");
  if (!md.includes(report.reportId) || !md.includes("desde eventos")) {
    failFrontier(FRONTIER.REPORTE_INVALIDO, "report.md no derivado");
  }

  // Schema si ajv disponible
  try {
    const mod = require("ajv/dist/2020.js");
    const Ajv2020 = mod.default ?? mod;
    const ajv = new Ajv2020({
      allErrors: true,
      strict: false,
      validateFormats: false,
    });
    const schema = JSON.parse(
      readFileSync(join(kitRoot, "schemas/evidence-report.schema.json"), "utf8"),
    );
    const validate = ajv.compile(schema);
    if (!validate(report)) {
      failFrontier(
        FRONTIER.REPORTE_INVALIDO,
        `schema: ${JSON.stringify(validate.errors?.[0])}`,
      );
    }
  } catch (e) {
    if (e instanceof VerifierError) throw e;
    // ajv ausente: sigue con checks estructurales
  }
}

function validateActivities(root, report, provenanceDoc, wires) {
  const actRoot = join(root, "activities");
  if (!existsSync(actRoot)) {
    failFrontier(FRONTIER.PIEZA_AUSENTE, "activities/");
  }

  let activitySchemaValidate = null;
  try {
    const mod = require("ajv/dist/2020.js");
    const Ajv2020 = mod.default ?? mod;
    const ajv = new Ajv2020({
      allErrors: true,
      strict: false,
      validateFormats: false,
    });
    const schema = JSON.parse(
      readFileSync(join(kitRoot, "schemas/activity.schema.json"), "utf8"),
    );
    activitySchemaValidate = ajv.compile(schema);
  } catch {
    activitySchemaValidate = null;
  }

  // Sin recuento propio: la cifra dura `< 22` desaparece y no se sustituye por
  // otra. Quién sobra y quién falta lo dice la biyección de validateBilateralCausal
  // contra CEREMONY_STEPS, que además lo dice con nombre y apellido.
  const dirs = readdirSync(actRoot).filter((d) =>
    statSync(join(actRoot, d)).isDirectory(),
  );

  /** @type {string[]} */
  const digests = [];
  /** @type {Set<string>} */
  const wireVerbs = new Set();
  for (const dir of dirs) {
    const wirePath = join(actRoot, dir, "wire.json");
    const viewPath = join(actRoot, dir, "view.jsonld");
    if (!existsSync(wirePath)) {
      failFrontier(FRONTIER.PIEZA_AUSENTE, `activities/${dir}/wire.json`);
    }
    if (!existsSync(viewPath)) {
      failFrontier(FRONTIER.PIEZA_AUSENTE, `activities/${dir}/view.jsonld`);
    }

    const wire = JSON.parse(readFileSync(wirePath, "utf8"));
    if (activitySchemaValidate && !activitySchemaValidate(wire)) {
      failFrontier(
        FRONTIER.WIRE_INVALIDO,
        `${dir}: ${JSON.stringify(activitySchemaValidate.errors?.[0])}`,
      );
    }
    if (typeof wire.verb === "string") wireVerbs.add(wire.verb);

    // Hash: digest declarado = digestObject(envelope sin digest)
    const { digest, ...without } = wire;
    if (!digest || typeof digest !== "string") {
      failFrontier(FRONTIER.HASH_ROTO, `${dir}: sin digest`);
    }
    const expected = digestObject(without);
    if (digest !== expected) {
      failFrontier(
        FRONTIER.HASH_ROTO,
        `${basename(dir)}: digest=${digest} expected=${expected}`,
      );
    }
    digests.push(digest);

    // JSON-LD (expansión estructural aditiva)
    const view = JSON.parse(readFileSync(viewPath, "utf8"));
    if (!view["@context"] || !view["@id"] || !view["@type"]) {
      failFrontier(FRONTIER.VIEW_JSONLD_INVALIDO, `${dir}: faltan @context/@id/@type`);
    }
    if (view["@id"] !== wire.id) {
      failFrontier(
        FRONTIER.VIEW_JSONLD_INVALIDO,
        `${dir}: @id≠wire.id`,
      );
    }
    if (view["hm:verb"] !== wire.verb) {
      failFrontier(
        FRONTIER.VIEW_JSONLD_INVALIDO,
        `${dir}: hm:verb≠wire.verb`,
      );
    }
    if (view["hm:digest"] !== wire.digest) {
      failFrontier(
        FRONTIER.VIEW_JSONLD_INVALIDO,
        `${dir}: hm:digest≠wire.digest`,
      );
    }
    if (!Array.isArray(view["prov:wasDerivedFrom"])) {
      failFrontier(
        FRONTIER.VIEW_JSONLD_INVALIDO,
        `${dir}: falta prov:wasDerivedFrom`,
      );
    }

    // Provenance en wire
    if (!wire.provenance?.source) {
      failFrontier(FRONTIER.PROVENANCE_ROTA, `${dir}: sin provenance.source`);
    }
  }

  // BIYECCIÓN, no ⊆: cada digest de wire debe estar reportado Y cada hash
  // reportado debe corresponder a un wire real. Sin el recíproco se podían
  // inyectar 50 hashes basura en report.hashes y el veredicto seguía ok.
  const actual = new Set(digests);
  for (const [label, list] of [
    ["report.hashes", report.hashes ?? []],
    ["pack/provenance.hashes", provenanceDoc.hashes ?? []],
  ]) {
    for (const d of actual) {
      if (!list.includes(d)) {
        failFrontier(FRONTIER.HASH_ROTO, `digest de wire ausente en ${label}: ${d}`);
      }
    }
    for (const h of list) {
      if (!actual.has(h)) {
        failFrontier(
          FRONTIER.HASH_ROTO,
          `${label} declara un hash sin wire que lo respalde: ${h}`,
        );
      }
    }
  }
  return wireVerbs;
}

/** @param {string[]} xs */
function tally(xs) {
  /** @type {Map<string, number>} */
  const m = new Map();
  for (const x of xs) m.set(x, (m.get(x) ?? 0) + 1);
  return m;
}

/**
 * @param {Map<string, number>} a
 * @param {Map<string, number>} b
 * @returns {string|null} descripción de la primera divergencia
 */
function tallyDiff(a, b) {
  for (const [k, n] of a) {
    const m = b.get(k) ?? 0;
    if (n !== m) return `${k}: ${n} vs ${m}`;
  }
  for (const [k, n] of b) {
    if (!a.has(k)) return `${k}: 0 vs ${n}`;
  }
  return null;
}

/**
 * Dos observadores (wires H y M): recomputea causalDigest por pareja.
 * No confía en chain.ndjson del productor.
 *
 * Y cruza cada pareja contra CEREMONY_STEPS (vía EXPECTED_PAIR_KEYS): antes
 * el único requisito era `paired ≥ 11`, una cifra dura que aceptaba once
 * parejas enteramente fabricadas y aceptaba borrar seis pasos reales mientras
 * quedaran once. Ahora la relación es biyectiva: cada paso declarado por la
 * ceremonia tiene su pareja, y no hay parejas que la ceremonia no declare.
 *
 * @param {Array<{ dir: string, wire: object }>} wires
 */
function validateBilateralCausal(wires) {
  /** @type {Map<string, { H?: object, M?: object }>} */
  const pairs = new Map();
  for (const { dir, wire } of wires) {
    const side =
      wire.context?.side ??
      (wire.actor === ACTOR_H ? "H" : wire.actor === ACTOR_M ? "M" : null);
    if (side !== "H" && side !== "M") {
      failFrontier(
        FRONTIER.CADENA_CAUSAL_DIVERGE,
        `${dir}: actor/side no es H|M (actor=${wire.actor})`,
      );
    }
    const baseId = String(wire.id ?? "").replace(/:(H|M)$/, "");
    if (!baseId) {
      failFrontier(FRONTIER.CADENA_CAUSAL_DIVERGE, `${dir}: id sin base bilateral`);
    }
    const slot = pairs.get(baseId) ?? {};
    if (slot[side]) {
      failFrontier(
        FRONTIER.PAREJA_INESPERADA,
        `${baseId}: dos wires para el lado ${side}`,
      );
    }
    slot[side] = wire;
    pairs.set(baseId, slot);
  }

  /** @type {Map<string, string>} clave esperada → baseId observado */
  const seenKeys = new Map();

  for (const [baseId, slot] of pairs) {
    if (!slot.H || !slot.M) {
      failFrontier(
        FRONTIER.CADENA_CAUSAL_DIVERGE,
        `pareja incompleta ${baseId}: H=${!!slot.H} M=${!!slot.M}`,
      );
    }
    if (slot.H.actor !== ACTOR_H || slot.M.actor !== ACTOR_M) {
      failFrontier(
        FRONTIER.CADENA_CAUSAL_DIVERGE,
        `${baseId}: actores H/M inválidos`,
      );
    }
    const digH = causalDigest(slot.H);
    const digM = causalDigest(slot.M);
    if (digH !== digM) {
      failFrontier(
        FRONTIER.CADENA_CAUSAL_DIVERGE,
        `${baseId}: causalDigest H≠M (${digH}≠${digM})`,
      );
    }
    if (slot.H.digest === slot.M.digest) {
      failFrontier(
        FRONTIER.CADENA_CAUSAL_DIVERGE,
        `${baseId}: wireDigest H≡M (deben diferir por actor)`,
      );
    }

    // ── Cruce contra la raíz de confianza (CEREMONY_STEPS) ────────────────
    const m = /:step:(\d+):([^:]+)(:sec)?$/.exec(baseId);
    if (!m) {
      failFrontier(
        FRONTIER.PAREJA_INESPERADA,
        `${baseId}: id no sigue :step:<orden>:<verbo>[:sec]`,
      );
    }
    const [, orderRaw, verbFromId, secMark] = m;
    const key = activityPairKey(Number(orderRaw), verbFromId, Boolean(secMark));
    if (!EXPECTED_PAIR_KEYS.includes(key)) {
      failFrontier(
        FRONTIER.PAREJA_INESPERADA,
        `${baseId}: paso/verbo no declarado por la ceremonia (${key})`,
      );
    }
    if (seenKeys.has(key)) {
      failFrontier(
        FRONTIER.PAREJA_INESPERADA,
        `${key}: duplicada (${seenKeys.get(key)} y ${baseId})`,
      );
    }
    seenKeys.set(key, baseId);
    // El verbo del id y el verbo de AMBAS mitades han de coincidir.
    for (const side of ["H", "M"]) {
      if (slot[side].verb !== verbFromId) {
        failFrontier(
          FRONTIER.PAREJA_INESPERADA,
          `${baseId}: wire ${side}.verb=${slot[side].verb} ≠ ${verbFromId} del id`,
        );
      }
    }
  }

  // Ninguna pareja declarada por la ceremonia puede faltar.
  const missing = EXPECTED_PAIR_KEYS.filter((k) => !seenKeys.has(k));
  if (missing.length > 0) {
    failFrontier(
      FRONTIER.PAREJA_INESPERADA,
      `faltan ${missing.length} parejas declaradas: ${missing.join(", ")}`,
    );
  }
}

/**
 * @param {Array<{ dir: string, wire: object }>} wires
 */
function validateProvenance(provenanceDoc, report, wires) {
  if (provenanceDoc.artifactChain !== report.artifactChain) {
    failFrontier(
      FRONTIER.PROVENANCE_ROTA,
      "artifactChain pack≠report",
    );
  }
  if (!provenanceDoc.ceremonyId || !provenanceDoc.scenarioId) {
    failFrontier(FRONTIER.PROVENANCE_ROTA, "falta ceremonyId/scenarioId");
  }
  if (provenanceDoc.activityCount !== wires.length) {
    failFrontier(
      FRONTIER.PROVENANCE_ROTA,
      `pack declara activityCount=${provenanceDoc.activityCount}, hay ${wires.length}`,
    );
  }

  // upstream son causalDigests recomputables: cada uno debe corresponder al
  // núcleo causal de una pareja realmente presente en activities/.
  const causals = new Set(wires.map((w) => causalDigest(w.wire)));
  for (const { dir, wire } of wires) {
    const ups = wire.provenance?.upstream ?? [];
    if (!Array.isArray(ups)) {
      failFrontier(FRONTIER.PROVENANCE_ROTA, `${dir}: upstream no array`);
    }
    for (const u of ups) {
      if (!causals.has(u)) {
        failFrontier(
          FRONTIER.PROVENANCE_ROTA,
          `${dir}: upstream ${u} no corresponde a ninguna actividad presente`,
        );
      }
    }
  }
}

/**
 * Cobertura RECOMPUTADA desde activities/ contra la raíz de confianza.
 *
 * Antes se leía `report.coverage`: bastaba con escribir 100/100 —y podía
 * hacerse con las 34 filas de la matriz sustituidas por `verbo.inventado`—
 * para que el veredicto fuera ok. Ahora el número del productor solo se
 * acepta si coincide con el recomputado.
 *
 * @param {Array<{ wire: object }>} wires
 */
function validateCoverage(report, provenanceDoc, wires) {
  const cov = report.coverage ?? provenanceDoc.coverage;
  if (!cov || typeof cov.verbsPercent !== "number") {
    failFrontier(FRONTIER.COBERTURA_INSUFICIENTE, "coverage ausente");
  }

  const real = computeCoverage(wires.map((w) => w.wire));

  if (real.verbsPercent < 100) {
    failFrontier(
      FRONTIER.COBERTURA_INSUFICIENTE,
      `verbsPercent real=${real.verbsPercent} — verbos sin evidencia: ${real.missingVerbs.join(", ")}`,
    );
  }
  if (real.unitsPercent < 100) {
    failFrontier(
      FRONTIER.COBERTURA_INSUFICIENTE,
      `unitsPercent real=${real.unitsPercent} — unidades sin evidencia: ${real.missingUnits.join(", ")}`,
    );
  }

  // El productor no puede declarar una cobertura distinta de la real.
  for (const [label, declared] of [
    ["report.coverage", report.coverage],
    ["pack/provenance.coverage", provenanceDoc.coverage],
  ]) {
    if (declared == null) continue;
    if (
      declared.verbsPercent !== real.verbsPercent ||
      declared.unitsPercent !== real.unitsPercent
    ) {
      failFrontier(
        FRONTIER.COBERTURA_AUTOCERTIFICADA,
        `${label} declara ${declared.verbsPercent}/${declared.unitsPercent}, recomputado ${real.verbsPercent}/${real.unitsPercent}`,
      );
    }
  }
}

function validateAcl(aclDoc, now) {
  if (!Array.isArray(aclDoc.entries) || aclDoc.entries.length === 0) {
    failFrontier(FRONTIER.PIEZA_AUSENTE, "pack/acl.json entries vacías");
  }
  let sawPositive = false;
  for (const entry of aclDoc.entries) {
    const acl = entry.acl;
    if (!acl || !Array.isArray(acl) || acl.length === 0) {
      // pods sin ACL al shutdown pueden existir; no es el negativo ACL expirada
      continue;
    }
    for (const row of acl) {
      if (row.expiresAt != null && Date.parse(row.expiresAt) <= new Date(now).getTime()) {
        failFrontier(
          FRONTIER.ACL_EXPIRADA,
          `${entry.unitId} actor=${row.actor} expiresAt=${row.expiresAt}`,
        );
      }
      const decision = evaluatePodAcl({
        acl: [row],
        actor: row.actor,
        verb: row.verbs?.[0] ?? "*",
        now,
      });
      if (decision.reason === "acl-expired") {
        failFrontier(
          FRONTIER.ACL_EXPIRADA,
          `${entry.unitId} actor=${row.actor} expiresAt=${row.expiresAt}`,
        );
      }
      if (decision.allowed) sawPositive = true;
    }
  }
  if (!sawPositive) {
    failFrontier(FRONTIER.PIEZA_AUSENTE, "ninguna ACL positiva vigente en pack");
  }
}

function validateTipestate(tipestateDoc) {
  const transitions = tipestateDoc.transitions ?? [];
  if (!Array.isArray(transitions) || transitions.length === 0) {
    failFrontier(FRONTIER.PIEZA_AUSENTE, "tipestate.transitions vacío");
  }
  for (const t of transitions) {
    if (!t.unitId || !t.from || !t.to) {
      failFrontier(FRONTIER.TRANSICION_ILEGAL, `entrada malformada ${JSON.stringify(t)}`);
    }
    if (!transitionAllowed(t.from, t.to)) {
      failFrontier(
        FRONTIER.TRANSICION_ILEGAL,
        `${t.unitId}: ${t.from} → ${t.to}`,
      );
    }
  }
  // Pods que llegaron a ready/running/paused deben cerrar en stopped|failed
  const reached = new Set();
  for (const t of transitions) {
    if (["ready", "running", "paused", "stopped"].includes(t.to)) {
      reached.add(t.unitId);
    }
  }
  const finals = tipestateDoc.finals ?? {};
  for (const unitId of reached) {
    const st = finals[unitId];
    if (st !== "stopped" && st !== "failed") {
      failFrontier(
        FRONTIER.SHUTDOWN_INCOMPLETO,
        `pod ${unitId} finalState=${st}`,
      );
    }
  }
}

function validateVectorMock(vectorDoc) {
  if (vectorDoc.mock !== true || vectorDoc.declared !== true) {
    failFrontier(
      FRONTIER.VECTORMOCK_SIN_DECLARAR,
      `mock=${vectorDoc.mock} declared=${vectorDoc.declared}`,
    );
  }
  if (!vectorDoc.algorithm || !vectorDoc.seed || !vectorDoc.digest) {
    failFrontier(
      FRONTIER.VECTORMOCK_SIN_DECLARAR,
      "faltan algorithm/seed/digest",
    );
  }
}

function validateCortos(cortosDoc) {
  const sealed = new Set(cortosDoc.sealedPieceIds ?? []);
  if (sealed.size === 0) {
    failFrontier(FRONTIER.PIEZA_AUSENTE, "sealedPieceIds vacío");
  }
  const cortos = cortosDoc.cortos ?? [];
  if (cortos.length === 0) {
    failFrontier(FRONTIER.PIEZA_AUSENTE, "cortos vacíos");
  }
  for (const c of cortos) {
    if (!Array.isArray(c.onfaloTrace) || c.onfaloTrace.length === 0) {
      failFrontier(
        FRONTIER.CORTO_SIN_TRAZA_ONFALO,
        `${c.cortoId ?? "?"} sin onfaloTrace`,
      );
    }
    for (const urn of c.onfaloTrace) {
      const m = /^urn:onfalo:(.+)$/.exec(urn);
      if (!m || !sealed.has(m[1])) {
        failFrontier(
          FRONTIER.CORTO_SIN_TRAZA_ONFALO,
          `${c.cortoId} traza inválida: ${urn}`,
        );
      }
    }
  }
}

/**
 * Shutdown con raíz de confianza fuera del pack.
 * - required = REQUIRED_SHUTDOWN_VERBS (constants, no shutdownDoc)
 * - present = verbos recomputeados desde wires (no verbsPresent del pack)
 * Si el pack declara requiredVerbs distinto → shutdown autocertificado.
 */
function validateShutdown(shutdownDoc, report, wireVerbs) {
  if (shutdownDoc.shutdown !== true || shutdownDoc.clean !== true) {
    failFrontier(
      FRONTIER.SHUTDOWN_INCOMPLETO,
      `shutdown=${shutdownDoc.shutdown} clean=${shutdownDoc.clean}`,
    );
  }
  if ((shutdownDoc.residualProcesses ?? []).length > 0) {
    failFrontier(
      FRONTIER.SHUTDOWN_INCOMPLETO,
      `residuales: ${shutdownDoc.residualProcesses.join(",")}`,
    );
  }

  const packRequired = [...(shutdownDoc.requiredVerbs ?? [])].sort();
  const trustRequired = [...REQUIRED_SHUTDOWN_VERBS].sort();
  if (JSON.stringify(packRequired) !== JSON.stringify(trustRequired)) {
    failFrontier(
      FRONTIER.SHUTDOWN_AUTOCERTIFICADO,
      `requiredVerbs del pack ≠ raíz de confianza (${packRequired.join(",")} ≠ ${trustRequired.join(",")})`,
    );
  }

  for (const v of REQUIRED_SHUTDOWN_VERBS) {
    if (!wireVerbs.has(v)) {
      failFrontier(
        FRONTIER.SHUTDOWN_INCOMPLETO,
        `falta verbo ${v} en wires (no se acepta verbsPresent dopado del pack)`,
      );
    }
  }

  if ((report.residualProcesses ?? []).length > 0) {
    failFrontier(FRONTIER.SHUTDOWN_INCOMPLETO, "report.residualProcesses no vacío");
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export { FRONTIER, VerifierError };
