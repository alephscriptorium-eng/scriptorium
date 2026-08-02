/**
 * WP-HUB-110 · provocadores de la matriz de negativos.
 *
 * REGLA DE LA CASA
 * ----------------
 * Un provocador **ataca al sistema y deja que el SISTEMA falle**. Si el
 * provocador tiene que lanzar él la frontera, no está probando nada.
 *
 * Por eso aquí:
 *   · El único camino a PASS es `return new Refusal({...})`, y una `Refusal`
 *     exige el error real del sistema más evidencia comprobada.
 *   · Todo lo demás lanza `ProvocadorError` (el provocador no probó nada) o
 *     `sistemaNoSeNego(...)` (el guardián no está). Ambos son FAIL.
 *   · Ningún `catch` reetiqueta. Un error del sistema que no encaja con la
 *     firma esperada NO se convierte en la frontera: se denuncia.
 *
 * CRITERIO DE CIERRE (el que este programa se ganó)
 * -------------------------------------------------
 * Un negativo no está verificado hasta que se DESACTIVA su guardián y se
 * comprueba que enrojece. Cada fila de MATRIX declara su guardián con fichero
 * y ancla exacta para que el experimento sea repetible: ver REPORTE-ZV-110.md.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, resolve, sep } from "node:path";
import { createRequire } from "node:module";
import { LocalPodProvider } from "../podstore/index.mjs";
import {
  runCeremonia,
  CeremonyError,
  CeremonyKillError,
  actasRoot,
} from "../ceremonia/index.mjs";
import { CEREMONY_STEPS, ACTOR_M } from "../ceremonia/constants.mjs";
import {
  verificarEvidencia,
  VerifierError,
  FRONTIER as V_FRONTIER,
} from "../verificador/verificar.mjs";
import { runCadena } from "../cadena/run-cadena.mjs";
import {
  NEG_FRONTIER,
  Refusal,
  provocadorRoto,
  sistemaNoSeNego,
} from "./frontiers.mjs";

const require = createRequire(import.meta.url);

/**
 * Reloj y leases INYECTADOS (no congelados en producción): los provocadores
 * necesitan corridas repetibles, la ceremonia por defecto sigue usando
 * `Date.now` y leases aleatorios.
 */
export const NEG_CLOCK_ISO = "2026-08-02T00:03:00.000Z";
export const NEG_INJECTION = Object.freeze({
  clock: () => Date.parse(NEG_CLOCK_ISO),
  leaseIdFactory: (unitId) => `lease-${unitId}-neg110`,
});

// ── utilidades ────────────────────────────────────────────────────────────

/** @param {string} p */
function norm(p) {
  return resolve(p).split(sep).join("/").toLowerCase();
}

/** @param {string} p */
function readJson(p) {
  return JSON.parse(readFileSync(p, "utf8"));
}

/** @param {string} p @param {unknown} v */
function writeJson(p, v) {
  writeFileSync(p, `${JSON.stringify(v, null, 2)}\n`);
}

/**
 * Copia aislada del pack de evidencia que YA pasó. Cada provocador trabaja
 * sobre la suya: nadie hereda la rotura del anterior.
 * @param {NegContext} ctx
 * @param {string} tag
 */
function isolatedPack(ctx, tag) {
  const dst = join(ctx.workRoot, `pack-${tag}`);
  rmSync(dst, { recursive: true, force: true });
  cpSync(ctx.passPackRoot, dst, { recursive: true });
  return dst;
}

/**
 * El pack copiado verifica LIMPIO antes de tocarlo.
 *
 * Sin esto un negativo puede salir verde por una rotura que ya venía de casa:
 * el verificador se negaría igual y el provocador se colgaría la medalla.
 * @param {string} packRoot
 * @param {string} frontier
 */
function assertPackVerificaLimpio(packRoot, frontier) {
  try {
    const r = verificarEvidencia(packRoot);
    if (!r?.ok) {
      provocadorRoto(frontier, `el pack base no verifica ok: ${JSON.stringify(r)}`);
    }
  } catch (e) {
    // El mensaje no da por hecho que la culpa sea del pack: si el verificador
    // revienta por otra razón, decir «el pack ya venía roto» sería mentir
    // sobre la causa. Se reporta lo que se sabe, tal cual.
    const clase = e?.constructor?.name ?? typeof e;
    const frontera = e?.frontier ? ` frontera=«${e.frontier}»` : "";
    const msg = e?.message ?? String(e);
    provocadorRoto(
      frontier,
      `verificarEvidencia falló sobre el pack base, así que este negativo no probaría nada: ` +
        `${clase}${frontera} «${msg}»`,
      { cause: e },
    );
  }
}

/**
 * Ejecuta el ataque y devuelve el error del sistema, o denuncia que no hubo.
 * @param {string} frontier
 * @param {string} queHizo — descripción del ataque, para el mensaje de fallo
 * @param {() => unknown} attack
 * @returns {unknown} el error tal cual lo lanzó el sistema
 */
function elSistemaDebeNegarse(frontier, queHizo, attack) {
  let value;
  try {
    value = attack();
  } catch (e) {
    return e;
  }
  return sistemaNoSeNego(
    frontier,
    `${queHizo} → el sistema siguió adelante y devolvió ${JSON.stringify(value)?.slice(0, 200) ?? "undefined"}`,
  );
}

/**
 * Exige que el error del sistema sea de la clase y frontera esperadas.
 * No reetiqueta: si no encaja, el negativo FALLA.
 * @param {string} frontier
 * @param {unknown} err
 * @param {string} expectedFrontier
 */
function exigirVerifierError(frontier, err, expectedFrontier) {
  if (!(err instanceof VerifierError)) {
    provocadorRoto(
      frontier,
      `el sistema falló, pero no es el verificador: ${err?.constructor?.name} «${err?.message ?? err}»`,
      { cause: err },
    );
  }
  if (err.frontier !== expectedFrontier) {
    provocadorRoto(
      frontier,
      `el verificador se negó por OTRA frontera: esperaba «${expectedFrontier}», dio «${err.frontier}» (${err.message})`,
      { cause: err },
    );
  }
  return err;
}

/** ajv es opcional en el verificador: si falta, el guardián de schema queda
 * DESARMADO en silencio (`activitySchemaValidate = null`, `catch {}`). Un
 * negativo de schema con el guardián desarmado no vale: se denuncia. */
function exigirAjvArmado(frontier) {
  try {
    require.resolve("ajv/dist/2020.js");
  } catch (e) {
    provocadorRoto(
      frontier,
      "ajv no resuelve: el verificador salta su chequeo de schema en silencio y el negativo sería vacuo",
      { cause: e },
    );
  }
}

/**
 * @typedef {{
 *   kitRoot: string,
 *   workRoot: string,
 *   passPackRoot: string,
 * }} NegContext
 */

// ── 1 · corpus ausente ────────────────────────────────────────────────────

/**
 * Ataca `runCadena` sobre un clon del kit SIN snapshot Onfalo sellado.
 *
 * FRONTERA DECLARADA: el kit **no** tiene guardián con nombre propio para
 * esto — `loadSealedPieces` lee el manifest sin más y lo que sale es el
 * ENOENT crudo de `fs`. Aquí no se reetiqueta ese ENOENT como «corpus
 * ausente»: se comprueba que el fallo es ENOENT **y que su `path` es
 * exactamente el manifest del clon**, y se declara `systemFrontier: null`.
 * @param {NegContext} ctx
 */
export function provokeCorpusAusente(ctx) {
  const F = NEG_FRONTIER.CORPUS_AUSENTE;
  const clone = join(ctx.workRoot, "kit-corpus-ausente");
  rmSync(clone, { recursive: true, force: true });
  for (const name of ["fixtures", "units"]) {
    const src = join(ctx.kitRoot, name);
    if (!existsSync(src)) provocadorRoto(F, `el kit no tiene ${name}/`);
    cpSync(src, join(clone, name), { recursive: true });
  }

  const onfalo = join(clone, "fixtures/onfalo");
  const manifestPath = join(onfalo, "source.manifest.json");
  if (!existsSync(manifestPath)) {
    provocadorRoto(F, `no había corpus que quitar en ${manifestPath}`);
  }
  rmSync(onfalo, { recursive: true, force: true });
  mkdirSync(onfalo, { recursive: true });
  if (existsSync(manifestPath)) {
    provocadorRoto(F, "el corpus sobrevivió al borrado; el ataque no se montó");
  }

  const err = elSistemaDebeNegarse(
    F,
    "runCadena sobre un kit sin snapshot Onfalo sellado",
    () => runCadena({ kitRoot: clone }),
  );

  const code = /** @type {{code?: string}} */ (err)?.code;
  const path = /** @type {{path?: string}} */ (err)?.path;
  if (code !== "ENOENT" || !path || norm(path) !== norm(manifestPath)) {
    provocadorRoto(
      F,
      `el sistema falló, pero no por el corpus que quité: code=${code} path=${path} msg=${/** @type {Error} */ (err)?.message}`,
      { cause: err },
    );
  }

  return new Refusal({
    frontier: F,
    systemFrontier: null,
    systemError: err,
    evidence: {
      guardian: "lib/cadena/run-cadena.mjs · loadSealedPieces lee source.manifest.json",
      errno: code,
      pathNegado: norm(path),
      manifestBorrado: norm(manifestPath),
      nota: "el kit no nombra esta frontera; se verifica la negativa y su origen, no un nombre inventado",
    },
  });
}

// ── 2 · hash roto ─────────────────────────────────────────────────────────

/**
 * Altera el CUERPO de un wire dejando su `digest` declarado intacto, y deja
 * que el verificador recompute.
 *
 * Aislamiento del guardián: como el digest declarado no cambia, sigue estando
 * en `report.hashes` y en `pack/provenance.hashes`, así que la biyección de
 * hashes NO salta. El único que puede cazar esto es la recomputación
 * (`digest !== digestObject(wire sin digest)`).
 * @param {NegContext} ctx
 */
export function provokeHashRoto(ctx) {
  const F = NEG_FRONTIER.HASH_ROTO;
  const packRoot = isolatedPack(ctx, "hash-roto");
  assertPackVerificaLimpio(packRoot, F);

  const actsRoot = join(packRoot, "activities");
  const dirs = readdirSync(actsRoot).sort();
  if (dirs.length === 0) provocadorRoto(F, "el pack no tiene actividades que corromper");
  const targetDir = dirs[0];
  const wirePath = join(actsRoot, targetDir, "wire.json");
  const wire = readJson(wirePath);
  if (typeof wire?.provenance?.source !== "string") {
    provocadorRoto(F, `${targetDir}/wire.json no tiene provenance.source que alterar`);
  }
  const digestAntes = wire.digest;
  wire.provenance = {
    ...wire.provenance,
    source: `${wire.provenance.source}#hm110-cuerpo-alterado`,
  };
  writeJson(wirePath, wire);
  if (readJson(wirePath).digest !== digestAntes) {
    provocadorRoto(F, "el ataque tocó el digest declarado; ya no aísla la recomputación");
  }

  const err = elSistemaDebeNegarse(
    F,
    `verificarEvidencia con el cuerpo de ${targetDir} alterado y su digest declarado intacto`,
    () => verificarEvidencia(packRoot),
  );
  exigirVerifierError(F, err, V_FRONTIER.HASH_ROTO);
  // Pin al guardián concreto: la recomputación dice `expected=`; la biyección
  // de hashes dice otra cosa. Si saltara la otra, este negativo no habría
  // probado la recomputación y debe fallar.
  if (!/expected=/.test(/** @type {Error} */ (err).message)) {
    provocadorRoto(
      F,
      `frontera correcta pero de otro guardián (no es la recomputación): ${/** @type {Error} */ (err).message}`,
      { cause: err },
    );
  }

  return new Refusal({
    frontier: F,
    systemFrontier: V_FRONTIER.HASH_ROTO,
    systemError: err,
    evidence: {
      guardian: "lib/verificador/verificar.mjs · if (digest !== expected) → HASH_ROTO",
      actividad: targetDir,
      digestDeclaradoIntacto: digestAntes,
    },
  });
}

// ── 3 · schema inválido ───────────────────────────────────────────────────

/**
 * Mete una propiedad desconocida en `report.json`. El schema del kit declara
 * `additionalProperties: false`, así que ajv —el de la VÍA DEL KIT, compilado
 * por el verificador, no uno que compile este test— la rechaza.
 *
 * Aislamiento: el campo extra no lo lee ningún otro chequeo (ni la matriz, ni
 * los hashes, ni el render de report.md, ni el sello del pack, que sólo cubre
 * `report.verdict`). Si se desarma ajv, el pack verifica limpio.
 * @param {NegContext} ctx
 */
export function provokeSchemaInvalido(ctx) {
  const F = NEG_FRONTIER.SCHEMA_INVALIDO;
  exigirAjvArmado(F);
  const packRoot = isolatedPack(ctx, "schema-invalido");
  assertPackVerificaLimpio(packRoot, F);

  const reportPath = join(packRoot, "report.json");
  const report = readJson(reportPath);
  if ("hm110CampoNoDeclarado" in report) {
    provocadorRoto(F, "el report ya traía el campo del ataque");
  }
  report.hm110CampoNoDeclarado = { intruso: true };
  writeJson(reportPath, report);

  const err = elSistemaDebeNegarse(
    F,
    "verificarEvidencia con un campo no declarado en report.json",
    () => verificarEvidencia(packRoot),
  );
  exigirVerifierError(F, err, V_FRONTIER.REPORTE_INVALIDO);
  if (!/reporte inválido: schema:/.test(/** @type {Error} */ (err).message)) {
    provocadorRoto(
      F,
      `«reporte inválido» sí, pero no por schema: ${/** @type {Error} */ (err).message}`,
      { cause: err },
    );
  }

  return new Refusal({
    frontier: F,
    systemFrontier: V_FRONTIER.REPORTE_INVALIDO,
    systemError: err,
    evidence: {
      guardian:
        "lib/verificador/verificar.mjs · ajv(evidence-report.schema.json) → REPORTE_INVALIDO «schema:»",
      campoIntruso: "hm110CampoNoDeclarado",
      ajvArmado: true,
    },
  });
}

// ── 4 · pod sin lease ─────────────────────────────────────────────────────

/**
 * Sin lease el pod no se mueve, no registra y no existe en disco.
 *
 * Se comprueban las tres piernas contra el SISTEMA:
 *   a) `transition` → denegada por la política (sin lease no hay ACL vigente);
 *   b) `recordEvent` → rechazado por no materializado;
 *   c) disco → `pods/` no existe: `_materialize` sólo cuelga de `issueLease`.
 * @param {NegContext} ctx
 */
export function provokePodSinLease(ctx) {
  const F = NEG_FRONTIER.POD_SIN_LEASE;
  const storeRoot = join(ctx.workRoot, "podstore-sin-lease");
  rmSync(storeRoot, { recursive: true, force: true });
  const provider = new LocalPodProvider({
    runId: "neg-pod-sin-lease",
    storeRoot,
    ...NEG_INJECTION,
  });

  try {
    provider.declare({ unitId: "bartleby", type: "agent", condition: "bootstrap" });
    provider.requestInflate({
      unitId: "bartleby",
      actorIri: provider.maestroIri,
      identity: { actorIri: provider.maestroIri, actorId: "maestro-m" },
    });
    // Deliberadamente NO se emite lease.

    const errTransition = elSistemaDebeNegarse(
      F,
      "transition bartleby→ready sin lease",
      () => provider.transition("bartleby", "ready", { actor: ACTOR_M }),
    );
    if (!/denegada/.test(/** @type {Error} */ (errTransition).message)) {
      provocadorRoto(
        F,
        `transition falló, pero no por la política: ${/** @type {Error} */ (errTransition).message}`,
        { cause: errTransition },
      );
    }

    const errEvent = elSistemaDebeNegarse(
      F,
      "recordEvent sobre un pod sin lease",
      () => provider.recordEvent("bartleby", { type: "hm110-probe" }),
    );
    if (!/no materializado/.test(/** @type {Error} */ (errEvent).message)) {
      provocadorRoto(
        F,
        `recordEvent falló, pero no por materialización: ${/** @type {Error} */ (errEvent).message}`,
        { cause: errEvent },
      );
    }

    const podsDir = join(storeRoot, "pods");
    const materializados = existsSync(podsDir) ? readdirSync(podsDir) : [];
    if (materializados.length > 0) {
      sistemaNoSeNego(
        F,
        `EL POD MATERIALIZÓ SIN LEASE en ${podsDir}: ${materializados.join(",")}`,
      );
    }

    return new Refusal({
      frontier: F,
      systemFrontier: null,
      systemError: errEvent,
      evidence: {
        guardian:
          "lib/podstore/LocalPodProvider.mjs · recordEvent: if (!pod.materialized) throw",
        transitionDenegada: /** @type {Error} */ (errTransition).message,
        recordEventRechazado: /** @type {Error} */ (errEvent).message,
        podsMaterializados: materializados.length,
      },
    });
  } finally {
    provider.wipe();
    rmSync(storeRoot, { recursive: true, force: true });
  }
}

// ── 5 · VectorMock no declarado ───────────────────────────────────────────

/**
 * `pack/vector-mock.json` con `mock:false`. El sello del pack se comprueba el
 * ÚLTIMO, así que quien caza esto es `validateVectorMock`, no el sello.
 * @param {NegContext} ctx
 */
export function provokeVectorMockNoDeclarado(ctx) {
  const F = NEG_FRONTIER.VECTORMOCK_NO_DECLARADO;
  const packRoot = isolatedPack(ctx, "vectormock");
  assertPackVerificaLimpio(packRoot, F);

  const vmPath = join(packRoot, "pack/vector-mock.json");
  const vm = readJson(vmPath);
  if (vm.mock !== true || vm.declared !== true) {
    provocadorRoto(F, `el pack base ya declaraba mock=${vm.mock} declared=${vm.declared}`);
  }
  vm.mock = false;
  writeJson(vmPath, vm);

  const err = elSistemaDebeNegarse(
    F,
    "verificarEvidencia con pack/vector-mock.json mock=false",
    () => verificarEvidencia(packRoot),
  );
  exigirVerifierError(F, err, V_FRONTIER.VECTORMOCK_SIN_DECLARAR);

  return new Refusal({
    frontier: F,
    systemFrontier: V_FRONTIER.VECTORMOCK_SIN_DECLARAR,
    systemError: err,
    evidence: {
      guardian:
        "lib/verificador/verificar.mjs · validateVectorMock: mock!==true || declared!==true",
      mutacion: "pack/vector-mock.json .mock=false",
    },
  });
}

// ── 6 · upstream ausente ──────────────────────────────────────────────────

/**
 * Omite el paso 4 y deja que el paso 5 se estrelle contra su upstream.
 * @param {NegContext} ctx
 */
export function provokeUpstreamAusente(ctx) {
  const F = NEG_FRONTIER.UPSTREAM_AUSENTE;
  const runId = "neg-110-upstream";
  const runRoot = join(ctx.kitRoot, ".runs", runId);
  const actaPath = join(actasRoot(ctx.kitRoot), `${runId}.json`);
  rmSync(runRoot, { recursive: true, force: true });
  rmSync(actaPath, { force: true });

  const err = elSistemaDebeNegarse(F, "runCeremonia con skipStep=4", () =>
    runCeremonia({
      kitRoot: ctx.kitRoot,
      runId,
      forceNew: true,
      skipStep: 4,
      ...NEG_INJECTION,
    }),
  );

  if (!(err instanceof CeremonyError) || err.code !== "missing-upstream") {
    provocadorRoto(
      F,
      `la ceremonia falló por otra cosa: ${err?.constructor?.name} code=${/** @type {CeremonyError} */ (err)?.code} «${/** @type {Error} */ (err)?.message}»`,
      { cause: err },
    );
  }

  // Cero estado parcial: el runRoot no sobrevive.
  if (existsSync(runRoot)) {
    const residuo = readdirSync(runRoot);
    rmSync(runRoot, { recursive: true, force: true });
    sistemaNoSeNego(F, `estado parcial residual en ${runRoot}: ${residuo.join(",")}`);
  }
  // …y sí sobrevive el acta, que vive fuera del runRoot a propósito.
  if (!existsSync(actaPath)) {
    provocadorRoto(F, `la ceremonia se negó pero no dejó acta en ${actaPath}`);
  }
  const acta = readJson(actaPath);
  if (acta.frontier !== "upstream ausente") {
    provocadorRoto(F, `el acta nombra otra frontera: ${acta.frontier}`);
  }
  rmSync(actaPath, { force: true });

  return new Refusal({
    frontier: F,
    systemFrontier: acta.frontier,
    systemError: err,
    evidence: {
      guardian:
        "lib/ceremonia/run-ceremonia.mjs · for (up of step.upstream) if (!completed.has(up)) → missing-upstream",
      pasoQueFalla: /** @type {CeremonyError} */ (err).step,
      runRootBorrado: true,
      actaFuraDelRunRoot: acta.frontier,
    },
  });
}

// ── 7 · runner caído ──────────────────────────────────────────────────────

/**
 * Mata la ceremonia en el paso que instancia universos y runners, y exige que
 * el sistema no deje media corrida en disco.
 * @param {NegContext} ctx
 */
export function provokeRunnerCaido(ctx) {
  const F = NEG_FRONTIER.RUNNER_CAIDO;
  const KILL_STEP = 9;
  const paso = CEREMONY_STEPS.find((s) => s.order === KILL_STEP);
  // Si la numeración cambia, este provocador deja de hablar de runners: que
  // se rompa ruidosamente en vez de seguir diciendo «runner caído».
  if (paso?.verb !== "universe.instantiate") {
    provocadorRoto(
      F,
      `el paso ${KILL_STEP} ya no instancia runners (verb=${paso?.verb}); el negativo dejaría de probar lo que dice`,
    );
  }

  const runId = "neg-110-runner";
  const runRoot = join(ctx.kitRoot, ".runs", runId);
  const actaPath = join(actasRoot(ctx.kitRoot), `${runId}.json`);
  rmSync(runRoot, { recursive: true, force: true });
  rmSync(actaPath, { force: true });

  const err = elSistemaDebeNegarse(F, `runCeremonia con killAtStep=${KILL_STEP}`, () =>
    runCeremonia({
      kitRoot: ctx.kitRoot,
      runId,
      forceNew: true,
      killAtStep: KILL_STEP,
      ...NEG_INJECTION,
    }),
  );

  if (!(err instanceof CeremonyKillError) || err.step !== KILL_STEP) {
    provocadorRoto(
      F,
      `la ceremonia falló por otra cosa: ${err?.constructor?.name} step=${/** @type {CeremonyError} */ (err)?.step} «${/** @type {Error} */ (err)?.message}»`,
      { cause: err },
    );
  }

  if (existsSync(runRoot)) {
    const residuo = readdirSync(runRoot);
    rmSync(runRoot, { recursive: true, force: true });
    sistemaNoSeNego(
      F,
      `runner caído dejó estado parcial en ${runRoot}: ${residuo.join(",")}`,
    );
  }
  if (!existsSync(actaPath)) {
    provocadorRoto(F, `la caída no dejó acta en ${actaPath}`);
  }
  const acta = readJson(actaPath);
  if (acta.step !== KILL_STEP || acta.verb !== paso.verb) {
    provocadorRoto(
      F,
      `el acta no sitúa la caída donde ocurrió: step=${acta.step} verb=${acta.verb}`,
    );
  }
  rmSync(actaPath, { force: true });

  return new Refusal({
    frontier: F,
    systemFrontier: acta.frontier,
    systemError: err,
    evidence: {
      guardian:
        "lib/ceremonia/run-ceremonia.mjs · wipePartialState(runRoot, provider) en el catch",
      pasoMuerto: `${KILL_STEP}:${paso.verb}`,
      runRootBorrado: true,
      actaFueraDelRunRoot: `${acta.step}:${acta.verb}`,
    },
  });
}

// ── matriz ────────────────────────────────────────────────────────────────

/**
 * Una fila por frontera. `guardian` no es adorno: es la dirección exacta que
 * hay que desactivar para comprobar que el negativo enrojece.
 */
export const MATRIX = Object.freeze([
  Object.freeze({
    frontier: NEG_FRONTIER.CORPUS_AUSENTE,
    guardian: "lib/cadena/run-cadena.mjs · loadSealedPieces → lectura de source.manifest.json",
    run: provokeCorpusAusente,
  }),
  Object.freeze({
    frontier: NEG_FRONTIER.HASH_ROTO,
    guardian: "lib/verificador/verificar.mjs · if (digest !== expected) failFrontier(HASH_ROTO)",
    run: provokeHashRoto,
  }),
  Object.freeze({
    frontier: NEG_FRONTIER.SCHEMA_INVALIDO,
    guardian: "lib/verificador/verificar.mjs · if (!validate(report)) failFrontier(REPORTE_INVALIDO, schema:)",
    run: provokeSchemaInvalido,
  }),
  Object.freeze({
    frontier: NEG_FRONTIER.POD_SIN_LEASE,
    guardian: "lib/podstore/LocalPodProvider.mjs · recordEvent: if (!pod.materialized) throw",
    run: provokePodSinLease,
  }),
  Object.freeze({
    frontier: NEG_FRONTIER.VECTORMOCK_NO_DECLARADO,
    guardian: "lib/verificador/verificar.mjs · validateVectorMock: mock!==true || declared!==true",
    run: provokeVectorMockNoDeclarado,
  }),
  Object.freeze({
    frontier: NEG_FRONTIER.UPSTREAM_AUSENTE,
    guardian: "lib/ceremonia/run-ceremonia.mjs · if (!completed.has(up)) → missing-upstream",
    run: provokeUpstreamAusente,
  }),
  Object.freeze({
    frontier: NEG_FRONTIER.RUNNER_CAIDO,
    guardian: "lib/ceremonia/run-ceremonia.mjs · wipePartialState(runRoot, provider)",
    run: provokeRunnerCaido,
  }),
]);
