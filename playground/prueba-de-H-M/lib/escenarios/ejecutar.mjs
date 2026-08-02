/**
 * WP-HUB-111 · ejecución real de un escenario descubierto.
 *
 * Corrección ZV (auditoría 2026-08-02): la CA decía «un segundo escenario
 * **corre** sin tocar el arnés», pero `ci/test-111-escenarios.mjs` no llamaba a
 * nada: sólo validaba JSON. Esto **ejecuta**: lanza `scripts/generar.mjs` como
 * proceso hijo para el escenario y verifica los artefactos sellados que deja.
 *
 * Qué corre y qué no —dicho aquí para que no vuelva a confundirse:
 *   · CORRE: `scripts/generar.mjs` (spawn real, materializa `.runs/<run>/…`,
 *     sella `manifest.json`, y en la segunda pasada mide no-op idempotente).
 *   · NO CORRE: `lib/ceremonia/run-ceremonia.mjs` — la ceremonia v1 de 11 pasos
 *     está anclada a `barrio-lore` por `lib/ceremonia/constants.mjs`
 *     (`CEREMONY_ID`/`SCENARIO_ID`) y no es genérica sobre escenarios. Correrla
 *     para un escenario no-v1 exigiría tocar el arnés de ceremonia, que es
 *     exactamente lo que la CA prohíbe. Herencia spike 112: Future Machine viva
 *     NO CORRE; todo esto es simulacro playground.
 *
 * Genérico por construcción: no nombra ningún `scenarioId`. Un escenario nuevo
 * se ejecuta por existir en `scenarios/`.
 */
import { existsSync, readFileSync, rmSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";

/** Artefactos que toda corrida generada debe dejar, sea cual sea el escenario. */
const ARTEFACTOS_ESPERADOS = Object.freeze([
  "room.json",
  "manifest.json",
  "evidence/README.md",
  "H/handoff.md",
  "H/env.json",
  "H/side.json",
  "M/handoff.md",
  "M/env.json",
  "M/side.json",
]);

const RUN_ID_OK = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/;

/**
 * Borrado defensivo: sólo dentro de `<kitRoot>/.runs/`, nunca la raíz de runs.
 * Hay precedente de tests de este kit renombrando directorios reales; aquí el
 * borrado se niega si el objetivo no está estrictamente contenido.
 *
 * @param {string} kitRoot
 * @param {string} runDir
 */
function borrarRunSeguro(kitRoot, runDir) {
  const runsRoot = resolve(kitRoot, ".runs");
  const objetivo = resolve(runDir);
  if (objetivo === runsRoot || !objetivo.startsWith(runsRoot + sep)) {
    throw new Error(`cleanup rechazado: ${objetivo} no está dentro de ${runsRoot}`);
  }
  rmSync(objetivo, { recursive: true, force: true });
}

/**
 * Ejecuta un escenario descubierto y verifica su corrida.
 *
 * @param {{ scenarioId: string, data: object }} descubierto
 * @param {string} kitRoot
 * @param {{ runPrefix?: string }} [opts]
 * @returns {{
 *   ok: boolean,
 *   scenarioId: string,
 *   runId: string,
 *   errors: string[],
 *   evidencia: string[],
 *   status: number|null,
 *   seal: string|null,
 *   artefactos: number,
 *   esperados: number,
 *   idempotente: boolean,
 *   limpiado: boolean,
 * }}
 */
export function ejecutarEscenario(descubierto, kitRoot, opts = {}) {
  const { scenarioId, data } = descubierto;
  const runPrefix = opts.runPrefix ?? "hub111";
  const runId = `${runPrefix}-${scenarioId}`;
  const errors = [];
  const evidencia = [];

  if (!RUN_ID_OK.test(runId)) {
    return {
      ok: false,
      scenarioId,
      runId,
      errors: [`runId inválido para el generador: ${runId}`],
      evidencia,
      status: null,
      seal: null,
      artefactos: 0,
      esperados: ARTEFACTOS_ESPERADOS.length,
      idempotente: false,
      limpiado: false,
    };
  }

  const generador = join(kitRoot, "scripts", "generar.mjs");
  const runDir = join(kitRoot, ".runs", runId);

  // Estado previo fuera: la corrida se mide desde cero, no desde restos.
  if (existsSync(runDir)) borrarRunSeguro(kitRoot, runDir);

  const primera = spawnSync(
    process.execPath,
    [generador, "--scenario", scenarioId, "--run", runId, "--sin-install"],
    { cwd: kitRoot, encoding: "utf8" },
  );
  const status = primera.status;
  evidencia.push(
    `node scripts/generar.mjs --scenario ${scenarioId} --run ${runId} --sin-install → exit=${status}`,
  );
  if (status !== 0) {
    errors.push(
      `generar.mjs salió ${status}: ${(primera.stderr || primera.stdout || "").trim().split("\n").slice(-3).join(" | ")}`,
    );
  }

  // Artefactos en disco (no basta con que el proceso diga que fue bien).
  let artefactos = 0;
  for (const rel of ARTEFACTOS_ESPERADOS) {
    if (existsSync(join(runDir, rel))) artefactos += 1;
    else errors.push(`artefacto ausente en la corrida: ${rel}`);
  }

  // Sello y trazabilidad del manifest.
  let seal = null;
  const manifestPath = join(runDir, "manifest.json");
  if (existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
      seal = typeof manifest.seal === "string" ? manifest.seal : null;
      if (!seal || !seal.startsWith("sha256:")) {
        errors.push(`manifest sin sello sha256: ${String(manifest.seal)}`);
      }
      if (manifest.scenarioId !== scenarioId) {
        errors.push(`manifest.scenarioId=${manifest.scenarioId} ≠ ${scenarioId}`);
      }
      if (manifest.barrioId !== data.barrioId) {
        errors.push(`manifest.barrioId=${manifest.barrioId} ≠ ${data.barrioId}`);
      }
      const sellados = Object.keys(manifest.artifacts ?? {}).length;
      evidencia.push(`manifest: seal=${seal} artefactos-sellados=${sellados}`);
    } catch (error) {
      errors.push(`manifest.json ilegible: ${error.message}`);
    }
  }

  // Segunda pasada sin --force-new: debe reconocer la corrida y no reescribir.
  const segunda = spawnSync(
    process.execPath,
    [generador, "--scenario", scenarioId, "--run", runId, "--sin-install"],
    { cwd: kitRoot, encoding: "utf8" },
  );
  const salida2 = `${segunda.stdout ?? ""}${segunda.stderr ?? ""}`;
  const idempotente = segunda.status === 0 && salida2.includes('"status": "no-op"');
  evidencia.push(`rerun sin --force-new → exit=${segunda.status} no-op=${idempotente}`);
  if (!idempotente) {
    errors.push(`rerun no fue no-op medido (exit=${segunda.status})`);
  }

  // Cleanup declarado por el propio escenario.
  let limpiado = false;
  if (data?.cleanup?.removeRuns === true) {
    borrarRunSeguro(kitRoot, runDir);
    limpiado = !existsSync(runDir);
    if (!limpiado) errors.push(`cleanup.removeRuns=true pero ${runId} sigue en disco`);
  }

  return {
    ok: errors.length === 0,
    scenarioId,
    runId,
    errors,
    evidencia,
    status,
    seal,
    artefactos,
    esperados: ARTEFACTOS_ESPERADOS.length,
    idempotente,
    limpiado,
  };
}
