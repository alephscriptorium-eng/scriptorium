/**
 * WP-HUB-111 · suite de conformidad común para todo scenario.json descubierto.
 * Declara (y comprueba): barrio canónico, fixture, unidades, verbos, CA, cleanup.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * @typedef {{ ok: boolean, errors: string[], checks: string[] }} ConformidadResult
 */

/**
 * @param {object} scenario
 * @param {string} kitRoot
 * @returns {ConformidadResult}
 */
export function checkConformidad(scenario, kitRoot) {
  const errors = [];
  const checks = [];

  const id = scenario?.scenarioId ?? "(sin-id)";

  if (typeof scenario.barrioId !== "string" || !scenario.barrioId.trim()) {
    errors.push(`${id}: falta barrio canónico (barrioId)`);
  } else {
    checks.push(`barrio=${scenario.barrioId}`);
  }

  if (typeof scenario.distrito !== "string" || !scenario.distrito.trim()) {
    errors.push(`${id}: falta distrito`);
  } else {
    checks.push(`distrito=${scenario.distrito}`);
  }

  const fixture = scenario.fixture;
  if (!fixture || typeof fixture !== "object") {
    errors.push(`${id}: falta fixture declarado`);
  } else if (typeof fixture.path !== "string" || !fixture.path.trim()) {
    errors.push(`${id}: fixture.path ausente`);
  } else {
    const abs = join(kitRoot, fixture.path);
    if (!existsSync(abs)) {
      errors.push(`${id}: fixture.path no existe: ${fixture.path}`);
    } else {
      checks.push(`fixture=${fixture.path}`);
    }
  }

  if (!Array.isArray(scenario.units) || scenario.units.length < 1) {
    errors.push(`${id}: units vacío o ausente`);
  } else {
    checks.push(`units=${scenario.units.length}`);
  }

  const steps = scenario.ceremony?.steps;
  if (!Array.isArray(steps) || steps.length < 1) {
    errors.push(`${id}: ceremony.steps (verbos) vacío o ausente`);
  } else {
    const missingVerb = steps.filter(
      (s) => typeof s?.verb !== "string" || !s.verb.trim(),
    );
    if (missingVerb.length) {
      errors.push(`${id}: ${missingVerb.length} paso(s) sin verbo`);
    } else {
      checks.push(`verbos=${steps.length}`);
    }
  }

  if (
    !Array.isArray(scenario.acceptanceCriteria) ||
    scenario.acceptanceCriteria.length < 1
  ) {
    errors.push(`${id}: acceptanceCriteria (CA) vacío o ausente`);
  } else {
    checks.push(`ca=${scenario.acceptanceCriteria.length}`);
  }

  const cleanup = scenario.cleanup;
  if (!cleanup || typeof cleanup !== "object") {
    errors.push(`${id}: falta cleanup`);
  } else {
    if (
      !Array.isArray(cleanup.shutdownVerbs) ||
      cleanup.shutdownVerbs.length < 1
    ) {
      errors.push(`${id}: cleanup.shutdownVerbs vacío o ausente`);
    }
    if (typeof cleanup.removeRuns !== "boolean") {
      errors.push(`${id}: cleanup.removeRuns debe ser boolean`);
    }
    if (
      Array.isArray(cleanup.shutdownVerbs) &&
      cleanup.shutdownVerbs.length >= 1 &&
      typeof cleanup.removeRuns === "boolean"
    ) {
      checks.push(`cleanup=ok`);
    }
  }

  return { ok: errors.length === 0, errors, checks };
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
