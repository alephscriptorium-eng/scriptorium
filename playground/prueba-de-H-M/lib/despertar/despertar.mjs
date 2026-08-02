/**
 * WP-HUB-109 · despertar distrito lore-voz por evidencia de corrida.
 *
 * El estado del censo runtime se DERIVA — nunca se edita a mano la cantera.
 * Sin evidencia válida → dormido; con evidencia pass → despierto + actas + elenco.
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { digestObject } from "../cadena/hash.mjs";
import { verificarEvidencia } from "../verificador/verificar.mjs";
import {
  DISTRITO_LORE_VOZ,
  ESTADO_DORMIDO,
  ESTADO_DESPIERTO,
  DEFAULT_OUT_REL,
  BARRIO_NOVELIST,
} from "./constants.mjs";
import { loadCensoIds } from "./censo-ids.mjs";
import {
  loadMapaProyeccion,
  assertBarriosEnMapa,
} from "./projection-hook.mjs";
import {
  collectActasFromEvidence,
  sealActasDoc,
  writeActas,
} from "./actas.mjs";
import {
  loadElencoFixture,
  bindElencoConLeases,
  writeElenco,
} from "./elenco.mjs";

/**
 * @param {string} evidenceRoot
 * @returns {{ ok: boolean, reason?: string, runId?: string, report?: object }}
 */
export function inspectEvidenceForWake(evidenceRoot) {
  if (!evidenceRoot || !existsSync(evidenceRoot)) {
    return { ok: false, reason: "evidence-ausente" };
  }
  const reportPath = join(evidenceRoot, "report.json");
  if (!existsSync(reportPath)) {
    return { ok: false, reason: "report-ausente" };
  }
  let report;
  try {
    report = JSON.parse(readFileSync(reportPath, "utf8"));
  } catch {
    return { ok: false, reason: "report-invalido" };
  }
  if (report.verdict !== "pass") {
    return { ok: false, reason: `verdict=${report.verdict}`, runId: report.runId, report };
  }
  try {
    verificarEvidencia(evidenceRoot);
  } catch (e) {
    return {
      ok: false,
      reason: `verificador:${e?.frontier || e?.message || e}`,
      runId: report.runId,
      report,
    };
  }
  return { ok: true, runId: report.runId, report };
}

/**
 * Proyecta censo runtime + actas + elenco desde evidencia (o reverso a dormido).
 *
 * @param {{
 *   kitRoot: string,
 *   evidenceRoot?: string|null,
 *   outDir?: string,
 *   mapaPath?: string,
 *   barrioId?: string,
 * }} opts
 */
export function despertarLoreVoz(opts) {
  const kitRoot = resolve(opts.kitRoot);
  const outDir = resolve(opts.outDir ?? join(kitRoot, DEFAULT_OUT_REL));
  const barrioId = opts.barrioId ?? "document-machine-sdk";

  const { loreVoz, novelist } = loadCensoIds(kitRoot);
  const loreIds = loreVoz.map((r) => r.id);
  if (!loreIds.includes(barrioId)) {
    throw new Error(
      `barrioId ${barrioId} no está en excerpt lore-voz (ids: ${loreIds.join(",")})`,
    );
  }

  const mapaLoaded = loadMapaProyeccion(kitRoot, { mapaPath: opts.mapaPath });
  const mapaCheck = assertBarriosEnMapa(mapaLoaded, [
    ...loreIds,
    BARRIO_NOVELIST,
  ]);

  const inspection = inspectEvidenceForWake(opts.evidenceRoot ?? null);
  const awake = inspection.ok === true;

  /** @type {Array<{ id: string, slug: string, distrito: string, estadoCantera: string, estadoRuntime: string }>} */
  const barrios = loreVoz.map((r) => ({
    id: r.id,
    slug: r.slug,
    distrito: r.distrito,
    estadoCantera: r.estado,
    estadoRuntime: awake ? ESTADO_DESPIERTO : ESTADO_DORMIDO,
  }));

  const novelistRow = novelist.find((r) => r.id === BARRIO_NOVELIST);
  const censoRuntime = {
    kind: "hm-censo-runtime",
    version: 1,
    distrito: DISTRITO_LORE_VOZ,
    barrioFoco: barrioId,
    derivedFromEvidence: awake,
    evidenceRunId: inspection.runId ?? null,
    evidenceReason: inspection.reason ?? null,
    mapaHook: mapaCheck.hooked
      ? { active: true, path: mapaCheck.path, checked: mapaCheck.checked }
      : { active: false, note: "WP-HUB-108 proyección ausente — hook noop" },
    novelist: {
      id: novelistRow.id,
      distrito: novelistRow.distrito,
      estadoCantera: novelistRow.estado,
      aporte: "elenco",
      notPipeline: true,
    },
    barrios,
    generatedAt: "2026-08-02T00:12:00.000Z",
  };
  censoRuntime.digest = digestObject({
    distrito: censoRuntime.distrito,
    derivedFromEvidence: censoRuntime.derivedFromEvidence,
    evidenceRunId: censoRuntime.evidenceRunId,
    barrios: censoRuntime.barrios,
  });

  // Regenerar salida completa (estado solo por proyección, no edición parcial)
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    join(outDir, "censo-runtime.json"),
    `${JSON.stringify(censoRuntime, null, 2)}\n`,
  );

  /** @type {object|null} */
  let actasDoc = null;
  /** @type {object|null} */
  let elencoDoc = null;

  if (awake) {
    const actas = collectActasFromEvidence(/** @type {string} */ (opts.evidenceRoot));
    if (actas.length === 0) {
      throw new Error("evidencia pass pero cero actas por unidad");
    }
    for (const a of actas) {
      if (!a.unidad || !a.verbo || !a.huella) {
        throw new Error(`acta incompleta: ${JSON.stringify(a)}`);
      }
    }
    actasDoc = sealActasDoc(actas, {
      runId: /** @type {string} */ (inspection.runId),
      distrito: DISTRITO_LORE_VOZ,
      barrioId,
    });
    writeActas(outDir, actasDoc);

    const fixture = loadElencoFixture(kitRoot);
    elencoDoc = bindElencoConLeases(
      fixture,
      /** @type {string} */ (inspection.runId),
    );
    // ≥2 por identidad ya validado en bindElencoConLeases
    writeElenco(outDir, elencoDoc);
  }

  const distritoEstado = awake ? ESTADO_DESPIERTO : ESTADO_DORMIDO;

  return {
    ok: true,
    awake,
    distritoEstado,
    outDir: outDir.replaceAll("\\", "/"),
    censoRuntime,
    actasDoc,
    elencoDoc,
    mapaHook: censoRuntime.mapaHook,
    inspection,
  };
}

/**
 * Lee el estado runtime ya proyectado (para asserts de CA).
 * @param {string} outDir
 */
export function readCensoRuntime(outDir) {
  const p = join(outDir, "censo-runtime.json");
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, "utf8"));
}
