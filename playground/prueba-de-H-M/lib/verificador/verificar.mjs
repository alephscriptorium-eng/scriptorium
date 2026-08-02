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
import { REQUIRED_EVIDENCE_PIECES } from "../ceremonia/evidence-pack.mjs";
import {
  ACTOR_H,
  ACTOR_M,
  REQUIRED_SHUTDOWN_VERBS,
} from "../ceremonia/constants.mjs";
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

  validateReport(report, root);
  checks.push("reporte");

  const wireVerbs = validateActivities(root, report, provenanceDoc);
  checks.push("wire + JSON-LD + hashes");

  validateBilateralCausal(root);
  checks.push("cadena causal H/M desde wires");

  validateProvenance(provenanceDoc, report, root);
  checks.push("provenance");

  validateCoverage(report, provenanceDoc);
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

  return { ok: true, runId: report.runId, checks };
}

function validateReport(report, root) {
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
  if (!Array.isArray(report.matrix) || report.matrix.length < 11) {
    failFrontier(
      FRONTIER.REPORTE_INVALIDO,
      `matrix incompleta (${report.matrix?.length ?? 0})`,
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

function validateActivities(root, report, provenanceDoc) {
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

  const dirs = readdirSync(actRoot).filter((d) =>
    statSync(join(actRoot, d)).isDirectory(),
  );
  if (dirs.length < 22) {
    failFrontier(
      FRONTIER.PIEZA_AUSENTE,
      `activities insuficientes (${dirs.length} < 22)`,
    );
  }

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

  // Hashes del report / provenance deben cubrir digests de wire
  const reported = new Set([
    ...(report.hashes ?? []),
    ...(provenanceDoc.hashes ?? []),
  ]);
  for (const d of digests) {
    if (!reported.has(d)) {
      failFrontier(FRONTIER.HASH_ROTO, `digest wire ausente en report/pack: ${d}`);
    }
  }
  return wireVerbs;
}

/**
 * Dos observadores (wires H y M): recomputea causalDigest por pareja.
 * No confía en chain.ndjson del productor.
 */
function validateBilateralCausal(root) {
  const actRoot = join(root, "activities");
  /** @type {Map<string, { H?: object, M?: object }>} */
  const pairs = new Map();
  for (const dir of readdirSync(actRoot)) {
    const wirePath = join(actRoot, dir, "wire.json");
    if (!existsSync(wirePath)) continue;
    const wire = JSON.parse(readFileSync(wirePath, "utf8"));
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
    slot[side] = wire;
    pairs.set(baseId, slot);
  }

  let paired = 0;
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
    paired += 1;
  }
  if (paired < 11) {
    failFrontier(
      FRONTIER.CADENA_CAUSAL_DIVERGE,
      `parejas bilaterales=${paired} (esperado ≥11 primarias)`,
    );
  }
}

function validateProvenance(provenanceDoc, report, root) {
  if (provenanceDoc.artifactChain !== report.artifactChain) {
    failFrontier(
      FRONTIER.PROVENANCE_ROTA,
      "artifactChain pack≠report",
    );
  }
  if (!provenanceDoc.ceremonyId || !provenanceDoc.scenarioId) {
    failFrontier(FRONTIER.PROVENANCE_ROTA, "falta ceremonyId/scenarioId");
  }
  // Cadena: activities con upstream deben referenciar digests previos
  const actRoot = join(root, "activities");
  const digests = new Set();
  for (const dir of readdirSync(actRoot)) {
    const wirePath = join(actRoot, dir, "wire.json");
    if (!existsSync(wirePath)) continue;
    const wire = JSON.parse(readFileSync(wirePath, "utf8"));
    digests.add(wire.digest);
  }
  for (const dir of readdirSync(actRoot)) {
    const wirePath = join(actRoot, dir, "wire.json");
    if (!existsSync(wirePath)) continue;
    const wire = JSON.parse(readFileSync(wirePath, "utf8"));
    const ups = wire.provenance?.upstream ?? [];
    // upstream son causalDigests, no wire digests — solo exigir array
    if (!Array.isArray(ups)) {
      failFrontier(FRONTIER.PROVENANCE_ROTA, `${dir}: upstream no array`);
    }
  }
}

function validateCoverage(report, provenanceDoc) {
  const cov = report.coverage ?? provenanceDoc.coverage;
  if (!cov || typeof cov.verbsPercent !== "number") {
    failFrontier(FRONTIER.COBERTURA_INSUFICIENTE, "coverage ausente");
  }
  if (cov.verbsPercent < 100) {
    failFrontier(
      FRONTIER.COBERTURA_INSUFICIENTE,
      `verbsPercent=${cov.verbsPercent}`,
    );
  }
  if (cov.unitsPercent < 100) {
    failFrontier(
      FRONTIER.COBERTURA_INSUFICIENTE,
      `unitsPercent=${cov.unitsPercent}`,
    );
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
