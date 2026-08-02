/**
 * Genera evidence/report.json + report.md DESDE eventos (nunca a mano).
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  EXPECTED_CEREMONY_VERBS,
  EXPECTED_CEREMONY_UNITS,
  SCENARIO_ID,
  SIMULACRO_NOTE,
} from "./constants.mjs";
import { digestObject } from "../cadena/hash.mjs";

/**
 * Cobertura DESDE eventos contra la raíz de confianza.
 *
 * Única fórmula: el productor la usa para escribir report.coverage y el
 * verificador la usa para RECOMPUTARLA desde activities/ y contrastar. Antes
 * el conjunto esperado vivía inline aquí y el verificador se limitaba a leer
 * el número que el productor había escrito.
 *
 * @param {Array<{ verb?: string, context?: { unitId?: string } }>} events
 */
export function computeCoverage(events) {
  const verbsSeen = new Set(events.map((e) => e.verb).filter(Boolean));
  const unitsSeen = new Set(
    events.map((e) => e.context?.unitId).filter(Boolean),
  );
  const verbsHit = EXPECTED_CEREMONY_VERBS.filter((v) => verbsSeen.has(v));
  const unitsHit = EXPECTED_CEREMONY_UNITS.filter((u) => unitsSeen.has(u));
  return {
    verbsPercent: Math.round(
      (100 * verbsHit.length) / EXPECTED_CEREMONY_VERBS.length,
    ),
    unitsPercent: Math.round(
      (100 * unitsHit.length) / EXPECTED_CEREMONY_UNITS.length,
    ),
    missingVerbs: EXPECTED_CEREMONY_VERBS.filter((v) => !verbsSeen.has(v)),
    missingUnits: EXPECTED_CEREMONY_UNITS.filter((u) => !unitsSeen.has(u)),
  };
}

/**
 * @param {{
 *   runId: string,
 *   events: Array<object>,
 *   pods: string[],
 *   artifactChainDigest: string,
 *   hashes: string[],
 *   cortosQueried: string[],
 *   failures: string[],
 *   residualProcesses: string[],
 *   generatedAt?: string,
 * }} input
 */
export function buildEvidenceReport(input) {
  const matrix = input.events.map((e) => ({
    verb: e.verb,
    actor: e.actor,
    object: e.object,
    result: e.result === "pass" ? "pass" : e.result === "fail" ? "fail" : "skip",
  }));

  const { verbsPercent, unitsPercent } = computeCoverage(input.events);

  const allPass =
    input.failures.length === 0 &&
    matrix.every((m) => m.result === "pass") &&
    input.residualProcesses.length === 0;

  return {
    reportId: `evidence-${input.runId}`,
    scenarioId: SCENARIO_ID,
    runId: input.runId,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    simulacro: {
      futureMachine: true,
      note: SIMULACRO_NOTE,
    },
    matrix,
    pods: [...input.pods],
    artifactChain: input.artifactChainDigest,
    hashes: [...input.hashes],
    coverage: {
      verbsPercent,
      unitsPercent,
    },
    cortosQueried: [...input.cortosQueried],
    failures: [...input.failures],
    residualProcesses: [...input.residualProcesses],
    verdict: allPass ? "pass" : "fail",
  };
}

/**
 * Markdown derivado del report JSON (misma fuente de eventos).
 * @param {object} report
 */
export function renderReportMd(report) {
  const lines = [
    `# Evidence report · \`${report.runId}\``,
    "",
    `> Generado desde eventos de ceremonia (no a mano). verdict=\`${report.verdict}\``,
    "",
    `| campo | valor |`,
    `| ----- | ----- |`,
    `| reportId | \`${report.reportId}\` |`,
    `| scenarioId | \`${report.scenarioId}\` |`,
    `| generatedAt | \`${report.generatedAt}\` |`,
    `| simulacro | FM=\`${report.simulacro.futureMachine}\` |`,
    `| artifactChain | \`${report.artifactChain}\` |`,
    `| coverage verbs | ${report.coverage.verbsPercent}% |`,
    `| coverage units | ${report.coverage.unitsPercent}% |`,
    "",
    "## Matriz verbo / actor / object / result",
    "",
    "| verb | actor | object | result |",
    "| ---- | ----- | ------ | ------ |",
  ];
  for (const row of report.matrix) {
    lines.push(
      `| \`${row.verb}\` | \`${row.actor}\` | \`${row.object}\` | ${row.result} |`,
    );
  }
  lines.push("", "## Pods", "");
  for (const p of report.pods) lines.push(`- \`${p}\``);
  lines.push("", "## Cortos consultados", "");
  if (report.cortosQueried.length === 0) lines.push("- _(ninguno)_");
  else for (const c of report.cortosQueried) lines.push(`- \`${c}\``);
  lines.push("", "## Fallos", "");
  if (report.failures.length === 0) lines.push("- _(ninguno)_");
  else for (const f of report.failures) lines.push(`- ${f}`);
  lines.push("", "## Procesos residuales", "");
  if (report.residualProcesses.length === 0) lines.push("- _(ninguno)_");
  else for (const r of report.residualProcesses) lines.push(`- ${r}`);
  lines.push("", "## Hashes", "");
  for (const h of report.hashes) lines.push(`- \`${h}\``);
  lines.push("");
  return lines.join("\n");
}

/**
 * @param {string} evidenceRoot
 * @param {object} report
 */
export function writeEvidenceReports(evidenceRoot, report) {
  mkdirSync(evidenceRoot, { recursive: true });
  const jsonPath = join(evidenceRoot, "report.json");
  const mdPath = join(evidenceRoot, "report.md");
  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(mdPath, renderReportMd(report));
  return { jsonPath, mdPath, digest: digestObject(report) };
}
