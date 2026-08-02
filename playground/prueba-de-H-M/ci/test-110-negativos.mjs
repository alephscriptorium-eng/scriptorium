#!/usr/bin/env node
/**
 * WP-HUB-110 · matriz de negativos.
 *
 * CONTRATO DEL ARNÉS (lo que lo distingue del anterior)
 * -----------------------------------------------------
 *  1. PASS exige un **valor devuelto** `Refusal` con la frontera esperada.
 *     Ninguna excepción, de ninguna clase, produce nunca un PASS. El canal de
 *     fallo del provocador y el de éxito son mecanismos distintos.
 *  2. La matriz se contrasta por **igualdad de conjuntos** contra el catálogo
 *     de fronteras, no por cardinalidad: una frontera duplicada y otra
 *     ausente ya no se compensan.
 *  3. Se imprime denominador: `n/N` verificados.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  MATRIX,
  NEG_FRONTIER,
  NEG_INJECTION,
  Refusal,
  ProvocadorError,
} from "../lib/negativos/index.mjs";
import { runCeremonia, actasRoot } from "../lib/ceremonia/index.mjs";
import { verificarEvidencia } from "../lib/verificador/verificar.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const kitRoot = path.resolve(here, "..");
const BASE_RUN_ID = "neg-110-base";
let failed = 0;

function ok(msg) {
  console.log(`test-110-negativos: PASS — ${msg}`);
}
function fail(msg) {
  console.error(`test-110-negativos: FAIL — ${msg}`);
  failed += 1;
}

/**
 * Los dos canales no se pueden confundir: si `Refusal` fuese un `Error`, un
 * `catch` genérico volvería a poder fabricar un PASS. Se fija por test.
 */
function assertCanalesSeparados() {
  const refusalEsError = Object.create(Refusal.prototype) instanceof Error;
  if (refusalEsError) {
    fail("Refusal es un Error: el canal de éxito podría llegar por throw");
    return;
  }
  const provocadorEsError = Object.create(ProvocadorError.prototype) instanceof Error;
  if (!provocadorEsError) {
    fail("ProvocadorError no es un Error: el canal de fallo no se lanza");
    return;
  }
  ok("canales separados (éxito=return Refusal · fallo=throw ProvocadorError)");
}

/** Igualdad de CONJUNTOS + cero duplicados, con denominador. */
function assertMatrizCubreElCatalogo() {
  const catalogo = new Set(Object.values(NEG_FRONTIER));
  const filas = MATRIX.map((r) => r.frontier);
  const duplicadas = filas.filter((f, i) => filas.indexOf(f) !== i);
  if (duplicadas.length > 0) {
    fail(`fronteras duplicadas en MATRIX: ${[...new Set(duplicadas)].join(", ")}`);
  }
  const enMatriz = new Set(filas);
  const faltan = [...catalogo].filter((f) => !enMatriz.has(f));
  const sobran = [...enMatriz].filter((f) => !catalogo.has(f));
  if (faltan.length > 0) fail(`fronteras del catálogo sin fila: ${faltan.join(", ")}`);
  if (sobran.length > 0) fail(`filas fuera del catálogo: ${sobran.join(", ")}`);
  if (duplicadas.length === 0 && faltan.length === 0 && sobran.length === 0) {
    ok(`matriz = catálogo por igualdad de conjuntos (${enMatriz.size}/${catalogo.size})`);
  }
}

/**
 * Pack de evidencia que YA pasa, construido una vez con reloj y leases
 * INYECTADOS (no congelados en producción).
 * @param {string} workRoot
 */
function buildPassPack(workRoot) {
  const res = runCeremonia({
    kitRoot,
    runId: BASE_RUN_ID,
    forceNew: true,
    ...NEG_INJECTION,
  });
  if (!res.ok || res.report?.verdict !== "pass") {
    throw new Error(`la corrida base no pasa: verdict=${res.report?.verdict}`);
  }
  const dst = path.join(workRoot, "pack-base");
  fs.cpSync(res.evidenceRoot, dst, { recursive: true });
  fs.rmSync(res.runRoot, { recursive: true, force: true });
  const v = verificarEvidencia(dst);
  if (!v?.ok) throw new Error("el pack base no verifica ok");
  return dst;
}

function main() {
  assertCanalesSeparados();
  assertMatrizCubreElCatalogo();

  const workRoot = fs.mkdtempSync(path.join(os.tmpdir(), "hm-110-neg-"));
  let passPackRoot;
  try {
    passPackRoot = buildPassPack(workRoot);
    ok(`pack base construido y verificado (${path.basename(passPackRoot)})`);
  } catch (e) {
    fail(`pack base: ${e?.message ?? e}`);
    fs.rmSync(workRoot, { recursive: true, force: true });
    console.error(`test-110-negativos: FAIL (${failed})`);
    process.exit(1);
  }

  const ctx = { kitRoot, workRoot, passPackRoot };
  /** Fronteras del catálogo con negativo verificado (no un contador). */
  const verificadas = [];

  for (const row of MATRIX) {
    let result;
    try {
      result = row.run(ctx);
    } catch (e) {
      // Todo throw es FAIL. Sin excepciones — literalmente.
      fail(
        `negativo «${row.frontier}» — ${e instanceof ProvocadorError ? e.message : `excepción inesperada del provocador: ${e?.stack ?? e}`}`,
      );
      continue;
    }
    if (!(result instanceof Refusal)) {
      fail(
        `negativo «${row.frontier}» — el provocador devolvió ${typeof result}, no una Refusal`,
      );
      continue;
    }
    if (result.frontier !== row.frontier) {
      fail(
        `negativo «${row.frontier}» — la Refusal dice «${result.frontier}»`,
      );
      continue;
    }
    verificadas.push(result.frontier);
    const sf = result.systemFrontier
      ? `frontera del sistema: «${result.systemFrontier}»`
      : "el sistema no nombra esta frontera (declarado)";
    ok(
      `negativo «${row.frontier}» — ${sf} · ${result.systemMessage.slice(0, 120)}`,
    );
  }

  // Denominador = tamaño del CATÁLOGO, no `MATRIX.length`. Con la matriz
  // saboteada (una frontera duplicada y otra ausente) `MATRIX.length` seguía
  // dando 7/7 verde: la corrida la salvaba el chequeo de conjuntos, no esta
  // cifra. Contra el catálogo, la cifra impresa también lo detecta, y además
  // se exige explícitamente que cada frontera del catálogo tenga su verificado.
  // El catálogo se cuenta como CONJUNTO: comparar un numerador `Set` contra un
  // denominador array hacía que un valor duplicado en NEG_FRONTIER imprimiera
  // «7/8» y siguiera en PASS. Y un catálogo con dos claves del mismo valor es
  // un catálogo roto, así que además se dice.
  const catalogoValores = Object.values(NEG_FRONTIER);
  const catalogo = new Set(catalogoValores);
  if (catalogo.size !== catalogoValores.length) {
    fail(
      `catálogo NEG_FRONTIER con valores duplicados: ${catalogoValores.length} claves, ${catalogo.size} fronteras`,
    );
  }
  const fronterasVerificadas = new Set(verificadas);
  const sinVerificar = [...catalogo].filter((f) => !fronterasVerificadas.has(f));
  console.log(
    `test-110-negativos: negativos verificados ${fronterasVerificadas.size}/${catalogo.size} del catálogo` +
      ` (filas en MATRIX: ${MATRIX.length})`,
  );
  if (sinVerificar.length > 0) {
    fail(`fronteras del catálogo sin negativo verificado: ${sinVerificar.join(", ")}`);
  }

  // ── cero estado parcial en el kit ───────────────────────────────────────
  fs.rmSync(workRoot, { recursive: true, force: true });
  if (fs.existsSync(workRoot)) fail(`workRoot no se borró: ${workRoot}`);

  const runsRoot = path.join(kitRoot, ".runs");
  const leftovers = fs.existsSync(runsRoot)
    ? fs.readdirSync(runsRoot).filter((n) => n.startsWith("neg-"))
    : [];
  if (leftovers.length > 0) fail(`estado parcial .runs: ${leftovers.join(",")}`);
  else ok("cero estado parcial .runs/neg-*");

  const actas = actasRoot(kitRoot);
  const actasNeg = fs.existsSync(actas)
    ? fs.readdirSync(actas).filter((n) => n.startsWith("neg-"))
    : [];
  if (actasNeg.length > 0) fail(`actas de negativos sin recoger: ${actasNeg.join(",")}`);
  else ok("cero actas neg-* residuales");

  // Denunciado el residuo, se retira: una corrida en rojo tampoco deja el kit
  // sucio para la siguiente (los residuos ya han contado como FAIL arriba).
  for (const n of leftovers) {
    fs.rmSync(path.join(runsRoot, n), { recursive: true, force: true });
  }
  for (const n of actasNeg) fs.rmSync(path.join(actas, n), { force: true });

  if (failed > 0) {
    console.error(`test-110-negativos: FAIL (${failed})`);
    process.exit(1);
  }
  console.log("test-110-negativos: PASS");
  process.exit(0);
}

main();
