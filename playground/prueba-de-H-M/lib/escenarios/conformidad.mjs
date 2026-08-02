/**
 * WP-HUB-111 · suite de conformidad común para todo scenario.json descubierto.
 *
 * Dos clases de chequeo, separadas a propósito porque miden cosas distintas:
 *
 *  - `presencia`  — el campo está declarado y no está vacío.
 *  - `referencia` — lo que el campo **nombra** existe en el catálogo del kit
 *    (`units/catalog/*.json`, `ontology/hm-v1.context.jsonld`, fixture en disco).
 *
 * Corrección ZV (auditoría 2026-08-02): la versión anterior tenía **sólo**
 * chequeos de presencia, de modo que `units: ["no-existe"]` pasaba y un verbo
 * inventado pasaba. Los cuatro chequeos de clase `referencia` cierran ese hueco.
 * Los referentes se cargan **fail-closed**: si `units/catalog` o la ontología no
 * se pueden leer, el escenario falla en vez de aprobar por catálogo vacío.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Inventario declarado de chequeos. Es el **denominador**: `verdicts` tiene
 * exactamente esta longitud para todo escenario, pase o falle.
 * @type {readonly (readonly [string, "presencia"|"referencia"])[]}
 */
export const CONFORMIDAD_CHECKS = Object.freeze([
  Object.freeze(["barrio", "presencia"]),
  Object.freeze(["distrito", "presencia"]),
  Object.freeze(["fixture.declarado", "presencia"]),
  Object.freeze(["fixture.existe", "referencia"]),
  Object.freeze(["simulacro.futureMachine", "presencia"]),
  Object.freeze(["units.no-vacio", "presencia"]),
  Object.freeze(["units.en-catalogo", "referencia"]),
  Object.freeze(["verbos.no-vacio", "presencia"]),
  Object.freeze(["verbos.nombrados", "presencia"]),
  Object.freeze(["verbos.en-ontologia", "referencia"]),
  Object.freeze(["ca.no-vacio", "presencia"]),
  Object.freeze(["cleanup.declarado", "presencia"]),
  Object.freeze(["cleanup.shutdownVerbs.no-vacio", "presencia"]),
  Object.freeze(["cleanup.shutdownVerbs.en-ontologia", "referencia"]),
  Object.freeze(["cleanup.removeRuns.boolean", "presencia"]),
]);

/** @type {Map<string, { units: Set<string>, verbos: Set<string>, fuentes: string[] }>} */
const REFERENTES_CACHE = new Map();

/**
 * Catálogos del kit contra los que se resuelven las referencias.
 * Lanza si no hay nada que resolver: un catálogo vacío no debe aprobar nada.
 *
 * @param {string} kitRoot
 */
export function cargarReferentes(kitRoot) {
  const cached = REFERENTES_CACHE.get(kitRoot);
  if (cached) return cached;

  const unitsDir = join(kitRoot, "units", "catalog");
  const units = new Set();
  if (existsSync(unitsDir)) {
    for (const file of readdirSync(unitsDir)) {
      if (!file.endsWith(".json")) continue;
      const doc = JSON.parse(readFileSync(join(unitsDir, file), "utf8"));
      if (typeof doc.unitId === "string" && doc.unitId) units.add(doc.unitId);
    }
  }
  if (units.size === 0) {
    throw new Error(`units/catalog vacío o ausente bajo ${kitRoot}`);
  }

  const ontologyPath = join(kitRoot, "ontology", "hm-v1.context.jsonld");
  const verbos = new Set();
  if (existsSync(ontologyPath)) {
    const doc = JSON.parse(readFileSync(ontologyPath, "utf8"));
    for (const entry of doc["hm:verbs"] ?? []) {
      if (typeof entry?.verb === "string" && entry.verb) verbos.add(entry.verb);
    }
  }
  if (verbos.size === 0) {
    throw new Error(`ontology/hm-v1.context.jsonld sin hm:verbs bajo ${kitRoot}`);
  }

  const referentes = {
    units,
    verbos,
    fuentes: ["units/catalog/*.json", "ontology/hm-v1.context.jsonld"],
  };
  REFERENTES_CACHE.set(kitRoot, referentes);
  return referentes;
}

/**
 * @typedef {{ id: string, clase: "presencia"|"referencia", estado: "pass"|"fail", detail: string }} Verdict
 * @typedef {{ ok: boolean, errors: string[], checks: string[], verdicts: Verdict[],
 *             total: number, pasados: number, referenciales: number }} ConformidadResult
 */

/**
 * @param {object} scenario
 * @param {string} kitRoot
 * @returns {ConformidadResult}
 */
export function checkConformidad(scenario, kitRoot) {
  const id = scenario?.scenarioId ?? "(sin-id)";

  /** @type {Verdict[]} */
  const verdicts = [];
  const errors = [];
  const checks = [];
  const clases = new Map(CONFORMIDAD_CHECKS.map(([nombre, clase]) => [nombre, clase]));

  /**
   * @param {string} checkId
   * @param {boolean} pasa
   * @param {string} detail  descripción del veredicto (motivo si falla)
   */
  function veredicto(checkId, pasa, detail) {
    const clase = clases.get(checkId);
    if (!clase) throw new Error(`check no declarado en CONFORMIDAD_CHECKS: ${checkId}`);
    verdicts.push({ id: checkId, clase, estado: pasa ? "pass" : "fail", detail });
    if (pasa) checks.push(`${checkId}=${detail}`);
    else errors.push(`${id}: ${checkId} — ${detail}`);
  }

  /** @type {{ units: Set<string>, verbos: Set<string> } | null} */
  let referentes = null;
  let referentesError = null;
  try {
    referentes = cargarReferentes(kitRoot);
  } catch (error) {
    referentesError = error.message;
  }

  /** Resuelve una referencia; si los catálogos no cargaron, es FAIL, nunca skip. */
  function referencia(checkId, valores, catalogo, etiqueta) {
    if (!referentes) {
      veredicto(checkId, false, `referentes ilegibles (${referentesError})`);
      return;
    }
    if (!Array.isArray(valores)) {
      veredicto(checkId, false, `no hay lista que resolver contra ${etiqueta}`);
      return;
    }
    const huerfanos = valores.filter((v) => !catalogo.has(v));
    if (huerfanos.length) {
      veredicto(
        checkId,
        false,
        `${huerfanos.length}/${valores.length} fuera de ${etiqueta}: ${huerfanos.join(", ")}`,
      );
      return;
    }
    veredicto(checkId, true, `${valores.length}/${valores.length} en ${etiqueta}`);
  }

  // ── barrio / distrito ────────────────────────────────────────────────────
  const barrioOk = typeof scenario?.barrioId === "string" && scenario.barrioId.trim() !== "";
  veredicto("barrio", barrioOk, barrioOk ? scenario.barrioId : "falta barrio canónico (barrioId)");

  const distritoOk = typeof scenario?.distrito === "string" && scenario.distrito.trim() !== "";
  veredicto("distrito", distritoOk, distritoOk ? scenario.distrito : "falta distrito");

  // ── fixture: declarado y existente en disco ──────────────────────────────
  const fixture = scenario?.fixture;
  const fixturePath =
    fixture && typeof fixture === "object" && typeof fixture.path === "string"
      ? fixture.path.trim()
      : "";
  veredicto(
    "fixture.declarado",
    fixturePath !== "",
    fixturePath !== "" ? fixturePath : "fixture ausente o sin path",
  );
  if (fixturePath === "") {
    veredicto("fixture.existe", false, "sin fixture.path que resolver");
  } else {
    const existe = existsSync(join(kitRoot, fixturePath));
    veredicto("fixture.existe", existe, existe ? `en disco: ${fixturePath}` : `no existe: ${fixturePath}`);
  }

  // ── herencia spike 112: el kit es simulacro declarado ─────────────────────
  // `scripts/generar.mjs` rechaza escenarios sin este flag; comprobarlo aquí
  // hace legible el fallo antes de intentar ejecutarlo.
  const simulacroOk = scenario?.simulacro?.futureMachine === true;
  veredicto(
    "simulacro.futureMachine",
    simulacroOk,
    simulacroOk ? "true (simulacro playground declarado)" : "falta simulacro.futureMachine=true (herencia spike 112)",
  );

  // ── units: no vacío + resolubles en units/catalog ─────────────────────────
  const units = scenario?.units;
  const unitsOk = Array.isArray(units) && units.length >= 1;
  veredicto("units.no-vacio", unitsOk, unitsOk ? `${units.length}` : "units vacío o ausente");
  referencia("units.en-catalogo", unitsOk ? units : null, referentes?.units ?? new Set(), "units/catalog");

  // ── verbos de ceremonia: no vacío + nombrados + en la ontología ───────────
  const steps = scenario?.ceremony?.steps;
  const stepsOk = Array.isArray(steps) && steps.length >= 1;
  veredicto("verbos.no-vacio", stepsOk, stepsOk ? `${steps.length} paso(s)` : "ceremony.steps vacío o ausente");

  const verbosDeclarados = stepsOk
    ? steps.map((s) => (typeof s?.verb === "string" ? s.verb.trim() : ""))
    : [];
  const sinVerbo = verbosDeclarados.filter((v) => v === "").length;
  veredicto(
    "verbos.nombrados",
    stepsOk && sinVerbo === 0,
    stepsOk
      ? sinVerbo === 0
        ? `${verbosDeclarados.length}/${verbosDeclarados.length} con verbo`
        : `${sinVerbo}/${verbosDeclarados.length} paso(s) sin verbo`
      : "sin pasos que nombrar",
  );
  referencia(
    "verbos.en-ontologia",
    stepsOk && sinVerbo === 0 ? verbosDeclarados : null,
    referentes?.verbos ?? new Set(),
    "ontology/hm-v1",
  );

  // ── criterios de aceptación ──────────────────────────────────────────────
  const ca = scenario?.acceptanceCriteria;
  const caOk = Array.isArray(ca) && ca.length >= 1;
  veredicto("ca.no-vacio", caOk, caOk ? `${ca.length}` : "acceptanceCriteria vacío o ausente");

  // ── cleanup ──────────────────────────────────────────────────────────────
  const cleanup = scenario?.cleanup;
  const cleanupOk = Boolean(cleanup) && typeof cleanup === "object";
  veredicto("cleanup.declarado", cleanupOk, cleanupOk ? "presente" : "falta cleanup");

  const shutdown = cleanupOk ? cleanup.shutdownVerbs : undefined;
  const shutdownOk = Array.isArray(shutdown) && shutdown.length >= 1;
  veredicto(
    "cleanup.shutdownVerbs.no-vacio",
    shutdownOk,
    shutdownOk ? `${shutdown.length}` : "cleanup.shutdownVerbs vacío o ausente",
  );
  referencia(
    "cleanup.shutdownVerbs.en-ontologia",
    shutdownOk ? shutdown : null,
    referentes?.verbos ?? new Set(),
    "ontology/hm-v1",
  );

  const removeRunsOk = cleanupOk && typeof cleanup.removeRuns === "boolean";
  veredicto(
    "cleanup.removeRuns.boolean",
    removeRunsOk,
    removeRunsOk ? String(cleanup.removeRuns) : "cleanup.removeRuns debe ser boolean",
  );

  if (verdicts.length !== CONFORMIDAD_CHECKS.length) {
    throw new Error(
      `conformidad: ${verdicts.length} veredictos para ${CONFORMIDAD_CHECKS.length} chequeos declarados`,
    );
  }

  return {
    ok: errors.length === 0,
    errors,
    checks,
    verdicts,
    total: CONFORMIDAD_CHECKS.length,
    pasados: verdicts.filter((v) => v.estado === "pass").length,
    referenciales: verdicts.filter((v) => v.clase === "referencia").length,
  };
}

/**
 * @param {Array<{ scenarioId: string, data: object }>} discovered
 * @param {string} kitRoot
 * @returns {{ ok: boolean, results: Array<{ scenarioId: string } & ConformidadResult> }}
 */
export function runConformidadSuite(discovered, kitRoot) {
  const results = discovered.map((d) => ({
    scenarioId: d.scenarioId,
    ...checkConformidad(d.data, kitRoot),
  }));
  return {
    ok: results.every((r) => r.ok),
    results,
  };
}
