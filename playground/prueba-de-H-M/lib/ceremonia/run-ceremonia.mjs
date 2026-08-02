/**
 * Orquestador ceremonia barrio-lore-v1 — 11 pasos bloqueantes (WP-HUB-106).
 */
import {
  existsSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  readFileSync,
  appendFileSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { LocalPodProvider } from "../podstore/index.mjs";
import { digestObject } from "../cadena/hash.mjs";
import {
  CEREMONY_ID,
  CEREMONY_STEPS,
  SCENARIO_ID,
  SIDE_ACTOR,
  SIMULACRO_NOTE,
} from "./constants.mjs";
import {
  buildEnvelope,
  sealWire,
  buildViewJsonLd,
  causalDigest,
  wireBytes,
} from "./envelope.mjs";
import { signHalf } from "./sign.mjs";
import { buildEvidenceReport, writeEvidenceReports } from "./evidence.mjs";
import { sealEvidencePack } from "./evidence-pack.mjs";
import { executeStep } from "./steps.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const defaultKitRoot = join(here, "../..");

export class CeremonyError extends Error {
  /**
   * @param {string} message
   * @param {{ step?: number, code?: string }} [meta]
   */
  constructor(message, meta = {}) {
    super(message);
    this.name = "CeremonyError";
    this.step = meta.step;
    this.code = meta.code ?? "ceremony-error";
  }
}

export class CeremonyKillError extends CeremonyError {
  /** @param {number} step */
  constructor(step) {
    super(`kill inyectado en paso ${step}`, { step, code: "kill" });
    this.name = "CeremonyKillError";
  }
}

/**
 * @typedef {{
 *   kitRoot: string,
 *   runId: string,
 *   runRoot: string,
 *   provider: import("../podstore/LocalPodProvider.mjs").LocalPodProvider,
 *   state: Record<string, unknown>,
 * }} CeremonyContext
 */

/**
 * @param {{
 *   kitRoot?: string,
 *   runId?: string,
 *   killAtStep?: number,
 *   skipStep?: number,
 *   forceNew?: boolean,
 *   generateRun?: boolean,
 * }} [opts]
 */
export function runCeremonia(opts = {}) {
  const kitRoot = opts.kitRoot ?? defaultKitRoot;
  const runId = opts.runId ?? `ceremonia-${Date.now().toString(36)}`;
  const runRoot = join(kitRoot, ".runs", runId);
  const evidenceRoot = join(runRoot, "evidence");
  const storeRoot = join(runRoot, ".podstore");

  if (opts.generateRun !== false) {
    ensureRunSkeleton(kitRoot, runId, opts.forceNew === true);
  } else {
    mkdirSync(join(runRoot, "H"), { recursive: true });
    mkdirSync(join(runRoot, "M"), { recursive: true });
    mkdirSync(evidenceRoot, { recursive: true });
  }

  // Reset evidencia viva de esta corrida
  rmSync(join(evidenceRoot, "activities"), { recursive: true, force: true });
  rmSync(storeRoot, { recursive: true, force: true });
  for (const side of ["H", "M"]) {
    const chainPath = join(runRoot, side, "chain.ndjson");
    if (existsSync(chainPath)) rmSync(chainPath, { force: true });
    const sigPath = join(runRoot, side, "signatures.json");
    if (existsSync(sigPath)) rmSync(sigPath, { force: true });
  }
  rmSync(join(evidenceRoot, "report.json"), { force: true });
  rmSync(join(evidenceRoot, "report.md"), { force: true });

  const provider = new LocalPodProvider({
    runId,
    storeRoot,
    hostIri: SIDE_ACTOR.H,
    maestroIri: SIDE_ACTOR.M,
  });

  /** @type {CeremonyContext} */
  const ctx = {
    kitRoot,
    runId,
    runRoot,
    provider,
    state: {},
  };

  /** @type {Map<number, { causalDigest: string, activityIds: { H: string, M: string } }>} */
  const completed = new Map();
  /** @type {object[]} */
  const allEvents = [];
  /** @type {string[]} */
  const hashes = [];
  /** @type {{ H: object[], M: object[] }} */
  const signatures = { H: [], M: [] };
  /** @type {object[]} */
  const failures = [];

  try {
    for (const step of CEREMONY_STEPS) {
      // upstream bloqueante
      for (const up of step.upstream) {
        if (!completed.has(up)) {
          throw new CeremonyError(
            `paso ${step.order}: falta upstream paso ${up}`,
            { step: step.order, code: "missing-upstream" },
          );
        }
      }

      if (opts.skipStep === step.order) {
        // Simula omisión — el siguiente fallará por upstream
        continue;
      }

      if (opts.killAtStep === step.order) {
        throw new CeremonyKillError(step.order);
      }

      const outcome = executeStep(ctx, step.order);
      const upstreamDigests = step.upstream.map(
        (n) => completed.get(n).causalDigest,
      );

      const recorded = recordBilateralActivity(ctx, {
        step,
        outcome,
        upstreamDigests,
        evidenceRoot,
        signatures,
        hashes,
        allEvents,
      });

      // Secondary verbs (análisis, query, shutdown…)
      for (const sec of outcome.secondaryEvents ?? []) {
        recordBilateralActivity(ctx, {
          step: {
            order: step.order,
            verb: sec.verb,
            unitId: sec.unitId,
            description: `secondary:${sec.verb}`,
          },
          outcome: {
            object: sec.object,
            target: sec.target,
            instrument: sec.instrument,
            unitId: sec.unitId,
            context: sec.context,
          },
          upstreamDigests: [recorded.causalDigest],
          evidenceRoot,
          signatures,
          hashes,
          allEvents,
          secondary: true,
        });
      }

      completed.set(step.order, {
        causalDigest: recorded.causalDigest,
        activityIds: recorded.activityIds,
      });

      // Evento en pod de la unidad
      try {
        ctx.provider.recordEvent(outcome.unitId, {
          type: "ceremony.activity",
          step: step.order,
          verb: step.verb,
          causalDigest: recorded.causalDigest,
          activityIds: recorded.activityIds,
        });
      } catch {
        // portal/step1 ya materializado; si falla es error real
        throw new CeremonyError(
          `no se pudo registrar evento en pod ${outcome.unitId}`,
          { step: step.order, code: "pod-event" },
        );
      }
    }

    if (completed.size !== CEREMONY_STEPS.length) {
      throw new CeremonyError(
        `ceremonia incompleta: ${completed.size}/${CEREMONY_STEPS.length}`,
        { code: "incomplete" },
      );
    }

    const pods = ctx.provider.listPods().map((p) => p.podIri);
    const report = buildEvidenceReport({
      runId,
      events: allEvents,
      pods,
      artifactChainDigest:
        /** @type {string} */ (ctx.state.artifactChainDigest) ??
        digestObject([...completed.values()].map((c) => c.causalDigest)),
      hashes,
      cortosQueried: /** @type {string[]} */ (ctx.state.cortosQueried ?? []),
      failures: failures.map(String),
      residualProcesses: /** @type {string[]} */ (
        ctx.state.residualProcesses ?? []
      ),
      generatedAt: "2026-08-02T00:11:00.000Z",
    });
    writeEvidenceReports(evidenceRoot, report);
    sealEvidencePack(evidenceRoot, {
      runId,
      provider,
      state: ctx.state,
      hashes,
      report,
    });

    for (const side of ["H", "M"]) {
      writeFileSync(
        join(runRoot, side, "signatures.json"),
        `${JSON.stringify(signatures[side], null, 2)}\n`,
      );
    }

    writeFileSync(
      join(runRoot, "ceremony-manifest.json"),
      `${JSON.stringify(
        {
          ceremonyId: CEREMONY_ID,
          scenarioId: SCENARIO_ID,
          runId,
          stepsCompleted: [...completed.keys()],
          verdict: report.verdict,
          simulacro: SIMULACRO_NOTE,
        },
        null,
        2,
      )}\n`,
    );

    // Handoffs releídos DESDE DISCO y comparados en el camino real. Antes
    // `compareCausalChains` solo se invocaba desde el test: la ceremonia no
    // comprobaba jamás que sus dos actas coincidieran.
    const chainH = readChain(runRoot, "H");
    const chainM = readChain(runRoot, "M");
    const cmp = compareCausalChains(chainH, chainM);
    if (!cmp.ok) {
      throw new CeremonyError(`handoffs H/M divergen: ${cmp.reason}`, {
        code: "causal-diverge",
      });
    }

    return {
      ok: true,
      runId,
      runRoot,
      evidenceRoot,
      report,
      completed: [...completed.entries()].map(([order, v]) => ({
        order,
        ...v,
      })),
      chainH,
      chainM,
      signatures,
      state: ctx.state,
    };
  } catch (err) {
    // Cero estado parcial: wipe completo de la corrida
    wipePartialState(runRoot, provider);
    if (err instanceof CeremonyError) throw err;
    throw new CeremonyError(String(err.message || err), {
      code: "unexpected",
    });
  }
}

/**
 * @param {CeremonyContext} ctx
 * @param {object} args
 */
function recordBilateralActivity(ctx, args) {
  const {
    step,
    outcome,
    upstreamDigests,
    evidenceRoot,
    signatures,
    hashes,
    allEvents,
    secondary = false,
  } = args;

  const baseId = secondary
    ? `urn:scriptorium:hm:${ctx.runId}:step:${step.order}:${step.verb}:sec`
    : `urn:scriptorium:hm:${ctx.runId}:step:${step.order}:${step.verb}`;

  const ts = stepTimestamp(step.order, secondary);
  /** @type {{ H: string, M: string }} */
  const activityIds = { H: `${baseId}:H`, M: `${baseId}:M` };
  let sharedCausal = null;

  for (const side of /** @type {const} */ (["H", "M"])) {
    const envelope = buildEnvelope({
      id: activityIds[side],
      actor: SIDE_ACTOR[side],
      verb: step.verb,
      object: outcome.object,
      target: outcome.target,
      instrument: outcome.instrument,
      timestamp: ts,
      result: "pass",
      provenance: {
        source: `ceremony:${CEREMONY_ID}`,
        upstream: upstreamDigests,
      },
      context: {
        ...outcome.context,
        step: step.order,
        side,
        timestamps: {
          started: ts,
          completed: ts,
        },
      },
    });
    const sealed = sealWire(envelope);
    const cDig = causalDigest(sealed);
    if (sharedCausal == null) sharedCausal = cDig;
    else if (sharedCausal !== cDig) {
      throw new CeremonyError(
        `cadena causal diverge en paso ${step.order} lado ${side}`,
        { step: step.order, code: "causal-diverge" },
      );
    }

    const view = buildViewJsonLd(sealed, {
      ontologyPath: join(ctx.kitRoot, "ontology/hm-v1.context.jsonld"),
    });

    const actDir = join(
      evidenceRoot,
      "activities",
      `step-${String(step.order).padStart(2, "0")}-${step.verb.replace(/\./g, "_")}-${side}`,
    );
    mkdirSync(actDir, { recursive: true });
    const wirePath = join(actDir, "wire.json");
    const viewPath = join(actDir, "view.jsonld");
    // Bytes sellados canónicos (DIC-4)
    const bytes = wireBytes(sealed);
    writeFileSync(wirePath, bytes);
    writeFileSync(viewPath, `${JSON.stringify(view, null, 2)}\n`);

    const sig = signHalf(side, sealed);
    signatures[side].push(sig);
    hashes.push(sealed.digest);

    const row = {
      step: step.order,
      verb: step.verb,
      object: outcome.object,
      causalDigest: cDig,
      wireDigest: sealed.digest,
      activityId: sealed.id,
      side,
      secondary,
    };
    appendFileSync(join(ctx.runRoot, side, "chain.ndjson"), `${JSON.stringify(row)}\n`);
    allEvents.push(sealed);
  }

  return {
    causalDigest: sharedCausal,
    activityIds,
  };
}

function stepTimestamp(order, secondary) {
  const sec = secondary ? 30 : 0;
  return new Date(Date.UTC(2026, 7, 2, 0, order, sec)).toISOString();
}

function readChain(runRoot, side) {
  const p = join(runRoot, side, "chain.ndjson");
  if (!existsSync(p)) return [];
  return readFileSync(p, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function ensureRunSkeleton(kitRoot, runId, forceNew) {
  const gen = join(kitRoot, "scripts/generar.mjs");
  const args = [
    gen,
    "--scenario",
    SCENARIO_ID,
    "--run",
    runId,
    "--sin-install",
  ];
  if (forceNew) args.push("--force-new");
  const r = spawnSync(process.execPath, args, {
    cwd: kitRoot,
    encoding: "utf8",
  });
  if (r.status !== 0) {
    // Fallback mínimo si generar falla (p.ej. idempotencia)
    const runRoot = join(kitRoot, ".runs", runId);
    mkdirSync(join(runRoot, "H"), { recursive: true });
    mkdirSync(join(runRoot, "M"), { recursive: true });
    mkdirSync(join(runRoot, "evidence"), { recursive: true });
    if (!existsSync(join(runRoot, "room.json"))) {
      writeFileSync(
        join(runRoot, "room.json"),
        `${JSON.stringify(
          {
            roomIri: `urn:scriptorium:hm:${runId}:room:barrio-lore`,
            runId,
            scenarioId: SCENARIO_ID,
          },
          null,
          2,
        )}\n`,
      );
    }
  }
}

/**
 * @param {string} runRoot
 * @param {import("../podstore/LocalPodProvider.mjs").LocalPodProvider} provider
 */
export function wipePartialState(runRoot, provider) {
  try {
    provider.wipe();
  } catch {
    /* ignore */
  }
  if (existsSync(runRoot)) {
    rmSync(runRoot, { recursive: true, force: true });
  }
}

/**
 * Compara handoffs H/M (cadena causal compartida).
 *
 * Empareja por IDENTIDAD de actividad, no por posición: comparar chainH[i] con
 * chainM[i] solo funciona porque hoy un único bucle escribe las dos filas en
 * el mismo orden. Emparejar por `activityId` sin el sufijo del observador
 * sobrevive a que las dos mitades se escriban por separado algún día.
 *
 * Comprueba además las marcas del observador: `side` debe diferir y el sello
 * propio (`wireDigest`) también; si coincidieran, no habría dos actas sino una
 * copiada dos veces.
 *
 * @param {object[]} chainH
 * @param {object[]} chainM
 */
export function compareCausalChains(chainH, chainM) {
  if (chainH.length !== chainM.length) {
    return {
      ok: false,
      reason: `longitud H=${chainH.length} M=${chainM.length}`,
    };
  }
  const baseOf = (row) => String(row.activityId ?? "").replace(/:(H|M)$/, "");
  /** @type {Map<string, object>} */
  const byBaseM = new Map();
  for (const row of chainM) {
    const b = baseOf(row);
    if (byBaseM.has(b)) {
      return { ok: false, reason: `M repite la actividad ${b}` };
    }
    byBaseM.set(b, row);
  }

  for (const a of chainH) {
    const base = baseOf(a);
    const b = byBaseM.get(base);
    if (!b) {
      return { ok: false, reason: `M no registró la actividad ${base}`, rowH: a };
    }
    if (
      a.step !== b.step ||
      a.verb !== b.verb ||
      a.object !== b.object ||
      a.causalDigest !== b.causalDigest ||
      Boolean(a.secondary) !== Boolean(b.secondary)
    ) {
      return {
        ok: false,
        reason: `${base}: diverge step/verb/object/causalDigest/secondary`,
        rowH: a,
        rowM: b,
      };
    }
    if (a.side === b.side) {
      return { ok: false, reason: `${base}: ambas filas dicen side=${a.side}` };
    }
    if (a.wireDigest === b.wireDigest) {
      return {
        ok: false,
        reason: `${base}: wireDigest idéntico — no son dos actas`,
      };
    }
  }
  return { ok: true, rows: chainH.length };
}
