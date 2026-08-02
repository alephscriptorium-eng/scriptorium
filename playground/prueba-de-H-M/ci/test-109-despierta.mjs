#!/usr/bin/env node
/**
 * WP-HUB-109 · CA despertar lore-voz + actas + elenco novelist.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import Ajv2020Module from "ajv/dist/2020.js";
import { runCeremonia } from "../lib/ceremonia/index.mjs";
import {
  despertarLoreVoz,
  readCensoRuntime,
  ESTADO_DESPIERTO,
  ESTADO_DORMIDO,
  DISTRITO_LORE_VOZ,
  BARRIO_NOVELIST,
  loadMapaProyeccion,
  MAPA_PROYECCION_CANDIDATES,
} from "../lib/despertar/index.mjs";

const Ajv2020 = Ajv2020Module.default ?? Ajv2020Module;
const here = path.dirname(fileURLToPath(import.meta.url));
const kitRoot = path.resolve(here, "..");
let failed = 0;

function ok(msg) {
  console.log(`test-109-despierta: PASS — ${msg}`);
}

function fail(msg) {
  console.error(`test-109-despierta: FAIL — ${msg}`);
  failed += 1;
}

function ensureDeps() {
  if (!fs.existsSync(path.join(kitRoot, "node_modules/ajv"))) {
    const npm = spawnSync("npm", ["install", "--no-audit", "--no-fund"], {
      cwd: kitRoot,
      stdio: "inherit",
      shell: true,
    });
    if (npm.status !== 0) fail("npm install falló");
  }
}

function loadValidator(name) {
  const ajv = new Ajv2020({ allErrors: true, strict: false, validateFormats: false });
  const schema = JSON.parse(
    fs.readFileSync(path.join(kitRoot, "schemas", `${name}.schema.json`), "utf8"),
  );
  return ajv.compile(schema);
}

function main() {
  ensureDeps();

  const runId = `test-109-${Date.now().toString(36)}`;
  const outDir = path.join(kitRoot, ".runs", `_despierta-109-${runId}`);

  let ceremony;
  try {
    ceremony = runCeremonia({ kitRoot, runId, forceNew: true });
  } catch (e) {
    fail(`ceremonia fixture: ${e.message || e}`);
    console.error(`test-109-despierta: FAIL (${failed})`);
    process.exit(1);
  }

  const evidenceRoot = ceremony.evidenceRoot;

  // ── 1. Hook 108: sin proyección → noop (no inventa barrios) ─────────────
  const mapa = loadMapaProyeccion(kitRoot);
  if (mapa !== null) {
    // Si 108 ya aterrizó en este árbol, el hook debe consumirla sin romper.
    ok(`hook mapa activo: ${mapa.path}`);
  } else {
    const missing = MAPA_PROYECCION_CANDIDATES.every(
      (rel) => !fs.existsSync(path.join(kitRoot, rel)),
    );
    if (!missing) fail("candidatos mapa existen pero loadMapaProyeccion=null");
    else ok("hook 108 noop (proyección ausente — candidates documentados)");
  }

  // ── 2. Despertar por evidencia → despierto + actas + elenco ─────────────
  let wake;
  try {
    wake = despertarLoreVoz({ kitRoot, evidenceRoot, outDir });
  } catch (e) {
    fail(`despertar: ${e.message || e}`);
    console.error(`test-109-despierta: FAIL (${failed})`);
    process.exit(1);
  }

  if (!wake.awake || wake.distritoEstado !== ESTADO_DESPIERTO) {
    fail(`esperado despierto, got awake=${wake.awake} estado=${wake.distritoEstado}`);
  } else {
    ok("distrito lore-voz despierto por evidencia");
  }

  const runtime = readCensoRuntime(outDir);
  if (!runtime || runtime.distrito !== DISTRITO_LORE_VOZ) {
    fail("censo-runtime ausente o distrito incorrecto");
  } else if (!runtime.derivedFromEvidence) {
    fail("censo-runtime.derivedFromEvidence debe ser true");
  } else if (
    !runtime.barrios.every((b) => b.estadoRuntime === ESTADO_DESPIERTO)
  ) {
    fail("no todos los barrios lore-voz están despierto");
  } else {
    ok(`censo runtime · ${runtime.barrios.length} barrios lore-voz despierto`);
  }

  const vCenso = loadValidator("censo-runtime");
  if (!vCenso(runtime)) {
    fail(`censo-runtime schema: ${JSON.stringify(vCenso.errors)}`);
  } else {
    ok("censo-runtime schema");
  }

  // ── 3. Cada acta: unidad, verbo, huella ─────────────────────────────────
  const actas = wake.actasDoc?.actas ?? [];
  if (actas.length < 1) {
    fail("cero actas");
  } else {
    let actasOk = true;
    for (const a of actas) {
      if (!a.unidad || !a.verbo || !a.huella?.startsWith("sha256:")) {
        fail(`acta incompleta: ${JSON.stringify(a)}`);
        actasOk = false;
      }
      const onePath = path.join(outDir, "actas", `${a.unidad}.json`);
      if (!fs.existsSync(onePath)) {
        fail(`falta acta por unidad: ${a.unidad}`);
        actasOk = false;
      } else {
        const one = JSON.parse(fs.readFileSync(onePath, "utf8"));
        const vActa = loadValidator("acta-unidad");
        if (!vActa(one)) {
          fail(`acta ${a.unidad} schema: ${JSON.stringify(vActa.errors)}`);
          actasOk = false;
        }
      }
    }
    if (actasOk) ok(`actas por unidad · ${actas.length} (unidad+verbo+huella)`);
  }

  // ── 4. Identidad H/M ≥2 personajes + lease cada uno (novelist, no pipeline)
  const elenco = wake.elencoDoc;
  if (!elenco || elenco.sourceBarrioId !== BARRIO_NOVELIST) {
    fail("elenco no cita novelist-editor");
  } else if (elenco.notPipeline !== true || elenco.aporte !== "elenco") {
    fail("elenco debe ser aporte=elenco notPipeline=true");
  } else {
    const bySide = { H: [], M: [] };
    for (const b of elenco.bindings) {
      bySide[b.identity]?.push(b);
    }
    let elOk = true;
    for (const side of ["H", "M"]) {
      if (bySide[side].length < 2) {
        fail(`identidad ${side}: <2 personajes (${bySide[side].length})`);
        elOk = false;
      }
      for (const b of bySide[side]) {
        if (!b.lease?.leaseId || b.lease.notPipeline !== true) {
          fail(`personaje ${b.character?.characterId} sin lease novelist`);
          elOk = false;
        }
      }
    }
    const vEl = loadValidator("elenco-identidad");
    if (!vEl(elenco)) {
      fail(`elenco schema: ${JSON.stringify(vEl.errors)}`);
      elOk = false;
    }
    if (elOk) {
      ok(
        `elenco novelist · H=${bySide.H.length} M=${bySide.M.length} con lease c/u (no pipeline)`,
      );
    }
  }

  // ── 5. CA clave: revertir evidencia → estado vuelve SOLO (sin edición a mano)
  const beforeRevert = readCensoRuntime(outDir);
  const digestDespierto = beforeRevert.digest;

  // Simula «revertir evidencia»: proyección sin evidenceRoot
  const sleep = despertarLoreVoz({
    kitRoot,
    evidenceRoot: null,
    outDir,
  });
  if (sleep.awake || sleep.distritoEstado !== ESTADO_DORMIDO) {
    fail(
      `tras revertir evidencia debía dormido; got awake=${sleep.awake} estado=${sleep.distritoEstado}`,
    );
  } else {
    ok("revirtiendo evidencia → distrito vuelve a dormido solo");
  }

  const after = readCensoRuntime(outDir);
  if (!after || after.derivedFromEvidence !== false) {
    fail("tras revert: derivedFromEvidence debe ser false");
  } else if (after.digest === digestDespierto) {
    fail("digest runtime no cambió al revertir (estado no derivado)");
  } else if (!after.barrios.every((b) => b.estadoRuntime === ESTADO_DORMIDO)) {
    fail("barrios no volvieron a dormido");
  } else if (fs.existsSync(path.join(outDir, "actas.json"))) {
    fail("actas no debieron persistir tras revert");
  } else {
    ok("estado runtime regenerado sin edición a mano (actas limpias)");
  }

  // ── 6. Edición a mano no manda: forzar despierto en JSON y re-proyectar
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "censo-runtime.json"),
    `${JSON.stringify(
      {
        ...after,
        derivedFromEvidence: true,
        barrios: after.barrios.map((b) => ({
          ...b,
          estadoRuntime: ESTADO_DESPIERTO,
        })),
      },
      null,
      2,
    )}\n`,
  );
  const again = despertarLoreVoz({ kitRoot, evidenceRoot: null, outDir });
  const forced = readCensoRuntime(outDir);
  if (
    again.distritoEstado === ESTADO_DORMIDO &&
    forced.barrios.every((b) => b.estadoRuntime === ESTADO_DORMIDO) &&
    forced.derivedFromEvidence === false
  ) {
    ok("edición a mano ignorada — proyección sin evidencia restaura dormido");
  } else {
    fail("edición a mano prevaleció sobre proyección");
  }

  // ── 7. Re-despertar con evidencia restaura despierto
  const rewake = despertarLoreVoz({ kitRoot, evidenceRoot, outDir });
  if (rewake.awake && rewake.distritoEstado === ESTADO_DESPIERTO) {
    ok("re-aplicar evidencia → despierto de nuevo");
  } else {
    fail("re-despertar falló");
  }

  // cleanup corrida aislada
  fs.rmSync(outDir, { recursive: true, force: true });

  if (failed > 0) {
    console.error(`test-109-despierta: FAIL (${failed})`);
    process.exit(1);
  }
  console.log("test-109-despierta: PASS");
  process.exit(0);
}

main();
