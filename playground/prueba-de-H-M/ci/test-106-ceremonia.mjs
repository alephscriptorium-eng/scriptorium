#!/usr/bin/env node
/**
 * WP-HUB-106 · CA ceremonia bilateral barrio-lore-v1 (11 pasos bloqueantes).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import {
  runCeremonia,
  compareCausalChains,
  CeremonyKillError,
  CeremonyError,
  CEREMONY_STEPS,
  SIDE_ACTOR,
  readFailureActa,
  signHalf,
  assertCannotSignPeer,
  sealWire,
  buildEnvelope,
  buildViewJsonLd,
  wireBytes,
  huellaLedger,
} from "../lib/ceremonia/index.mjs";
import { causalDigest } from "../lib/ceremonia/envelope.mjs";
import {
  CAUSAL_STRIPPED_FIELDS,
  CAUSAL_STRIPPED_CONTEXT_FIELDS,
  EXPECTED_ACTIVITY_PAIRS,
} from "../lib/ceremonia/constants.mjs";

/** Valor distinto del original, del mismo tipo cuando es posible. */
function mutateValue(v) {
  if (typeof v === "string") return `${v}#zv-mutado`;
  if (typeof v === "number") return v + 1;
  if (typeof v === "boolean") return !v;
  if (Array.isArray(v)) return [...v, "zv-mutado"];
  if (v && typeof v === "object") return { ...v, zvMutado: true };
  return "zv-mutado";
}

const here = path.dirname(fileURLToPath(import.meta.url));
const kitRoot = path.resolve(here, "..");
const require = createRequire(import.meta.url);
let failed = 0;

function ok(msg) {
  console.log(`test-106-ceremonia: PASS — ${msg}`);
}

function fail(msg) {
  console.error(`test-106-ceremonia: FAIL — ${msg}`);
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

function loadAjv() {
  const mod = require("ajv/dist/2020.js");
  const Ajv2020 = mod.default ?? mod;
  return new Ajv2020({ allErrors: true, strict: false, validateFormats: false });
}

function main() {
  ensureDeps();
  const ajv = loadAjv();
  const activitySchema = JSON.parse(
    fs.readFileSync(path.join(kitRoot, "schemas/activity.schema.json"), "utf8"),
  );
  const evidenceSchema = JSON.parse(
    fs.readFileSync(
      path.join(kitRoot, "schemas/evidence-report.schema.json"),
      "utf8",
    ),
  );
  const validateActivity = ajv.compile(activitySchema);
  const validateEvidence = ajv.compile(evidenceSchema);

  // ── 1. Corrida feliz ────────────────────────────────────────────────────
  const runId = `test-106-${Date.now().toString(36)}`;
  let result;
  try {
    result = runCeremonia({ kitRoot, runId, forceNew: true });
  } catch (e) {
    fail(`corrida feliz: ${e.message || e}`);
    console.error(`test-106-ceremonia: FAIL (${failed})`);
    process.exit(1);
  }

  if (!result.ok || result.report.verdict !== "pass") {
    fail("verdict != pass");
  } else {
    ok("corrida feliz verdict=pass");
  }

  // ── 2. Misma cadena causal fila a fila ──────────────────────────────────
  const cmp = compareCausalChains(result.chainH, result.chainM);
  if (!cmp.ok) {
    fail(`cadena causal H≠M: ${cmp.reason}`);
  } else if (cmp.rows < CEREMONY_STEPS.length) {
    fail(`cadena corta: ${cmp.rows} < ${CEREMONY_STEPS.length}`);
  } else {
    ok(`H y M misma cadena causal fila a fila (${cmp.rows} filas)`);
  }

  // Test rojo: mutar object en M → compareCausalChains detecta diverge
  {
    const tamperedM = result.chainM.map((row, i) =>
      i === 0 ? { ...row, object: `${row.object}#tampered`, causalDigest: "sha256:dead" } : row,
    );
    const bad = compareCausalChains(result.chainH, tamperedM);
    if (bad.ok) {
      fail("compareCausalChains debió fallar tras mutar object M");
    } else {
      ok("rojo: compareCausalChains detecta diverge H/M (object/digest)");
    }
  }

  // ── 2b. CAUSAL_STRIPPED_FIELDS gobierna de verdad el núcleo causal ───────
  // Propiedad, no cifra: un campo cambia el causalDigest SI Y SOLO SI no está
  // declarado como marca del observador. Antes `causalCore` era una allowlist
  // positiva y la constante no la importaba nadie: podían divergir en silencio
  // y ningún test podía enrojecer.
  {
    const acts = path.join(result.evidenceRoot, "activities");
    const sampleDir = fs.readdirSync(acts)[0];
    const wire = JSON.parse(
      fs.readFileSync(path.join(acts, sampleDir, "wire.json"), "utf8"),
    );
    const baseline = causalDigest(wire);
    const problems = [];

    for (const key of Object.keys(wire)) {
      if (key === "id") continue; // el sufijo :H/:M se normaliza aparte
      const mutated = { ...wire, [key]: mutateValue(wire[key]) };
      const changed = causalDigest(mutated) !== baseline;
      const declaredStripped = CAUSAL_STRIPPED_FIELDS.includes(key);
      if (changed === declaredStripped) {
        problems.push(
          `${key}: mutar ${changed ? "cambia" : "no cambia"} el digest pero ` +
            `${declaredStripped ? "está" : "no está"} en CAUSAL_STRIPPED_FIELDS`,
        );
      }
    }

    for (const key of Object.keys(wire.context ?? {})) {
      const mutated = {
        ...wire,
        context: { ...wire.context, [key]: mutateValue(wire.context[key]) },
      };
      const changed = causalDigest(mutated) !== baseline;
      const declaredStripped = CAUSAL_STRIPPED_CONTEXT_FIELDS.includes(key);
      if (changed === declaredStripped) {
        problems.push(
          `context.${key}: mutar ${changed ? "cambia" : "no cambia"} el digest ` +
            `pero ${declaredStripped ? "está" : "no está"} en CAUSAL_STRIPPED_CONTEXT_FIELDS`,
        );
      }
    }

    // Un campo NUEVO debe entrar en el núcleo por defecto (denylist, no allowlist).
    const withNovel = { ...wire, campoNuevoInventado: "xyz" };
    if (causalDigest(withNovel) === baseline) {
      problems.push(
        "un campo nuevo del envelope no altera el núcleo causal: sigue siendo allowlist",
      );
    }

    if (problems.length > 0) {
      fail(`CAUSAL_STRIPPED_FIELDS desincronizado:\n    - ${problems.join("\n    - ")}`);
    } else {
      ok(
        `CAUSAL_STRIPPED_FIELDS gobierna causalCore ` +
          `(${Object.keys(wire).length} campos + ${Object.keys(wire.context ?? {}).length} de context probados uno a uno)`,
      );
    }
  }

  // ── 2c. instrument y context SÍ entran en el núcleo causal ──────────────
  // El vector del auditor: dos mitades internamente coherentes que registran
  // instrumento y unidad distintos. Antes pasaba el verificador entero.
  {
    const acts = path.join(result.evidenceRoot, "activities");
    const sampleDir = fs.readdirSync(acts)[0];
    const wire = JSON.parse(
      fs.readFileSync(path.join(acts, sampleDir, "wire.json"), "utf8"),
    );
    const otraMitad = {
      ...wire,
      instrument: "demiurgo",
      context: { ...wire.context, unitId: "vector-mock", anio: 1999 },
    };
    if (causalDigest(otraMitad) === causalDigest(wire)) {
      fail("instrument/context fuera del núcleo causal: dos mitades distintas comparten digest");
    } else {
      ok("rojo: instrument y context divergentes rompen el núcleo causal");
    }
  }

  // Primarios: 11 pasos presentes
  const primaryH = result.chainH.filter((r) => !r.secondary);
  if (primaryH.length !== CEREMONY_STEPS.length) {
    fail(`pasos primarios H=${primaryH.length} (espera ${CEREMONY_STEPS.length})`);
  } else {
    ok(`${CEREMONY_STEPS.length} pasos primarios en handoff H`);
  }

  // ── 3. Wire + view + schema activity ────────────────────────────────────
  const actRoot = path.join(result.evidenceRoot, "activities");
  const actDirs = fs.readdirSync(actRoot);
  let wireCount = 0;
  for (const dir of actDirs) {
    const wirePath = path.join(actRoot, dir, "wire.json");
    const viewPath = path.join(actRoot, dir, "view.jsonld");
    if (!fs.existsSync(wirePath) || !fs.existsSync(viewPath)) {
      fail(`faltan wire/view en ${dir}`);
      continue;
    }
    const sealed = JSON.parse(fs.readFileSync(wirePath, "utf8"));
    if (!validateActivity(sealed)) {
      fail(`activity schema: ${dir} ${JSON.stringify(validateActivity.errors)}`);
    }
    wireCount += 1;
    // DIC-4: mutar vista no cambia huella del wire
    const view = JSON.parse(fs.readFileSync(viewPath, "utf8"));
    const h1 = huellaLedger(sealed);
    view.extraMutation = "solo-vista";
    const h2 = huellaLedger(sealed);
    if (h1 !== h2) fail("DIC-4 roto: vista afectó huella");
  }
  const wiresEsperados = EXPECTED_ACTIVITY_PAIRS.length * 2;
  if (wireCount !== wiresEsperados) {
    fail(`wire count ${wireCount} ≠ ${wiresEsperados} (${EXPECTED_ACTIVITY_PAIRS.length} parejas × 2)`);
  } else {
    ok(`wire.json sellado + view.jsonld ×${wireCount}`);
  }

  // ── 4. Cada mitad firma sólo la suya ────────────────────────────────────
  const sigH = result.signatures.H;
  const sigM = result.signatures.M;
  if (sigH.length === 0 || sigM.length === 0) {
    fail("faltan firmas");
  }
  let foreignOk = true;
  for (const s of sigH) {
    if (!s.activityId.endsWith(":H")) {
      fail(`H firmó activity ajena ${s.activityId}`);
      foreignOk = false;
    }
  }
  for (const s of sigM) {
    if (!s.activityId.endsWith(":M")) {
      fail(`M firmó activity ajena ${s.activityId}`);
      foreignOk = false;
    }
  }
  const peerEnv = sealWire(
    buildEnvelope({
      id: "urn:test:peer",
      actor: SIDE_ACTOR.M,
      verb: "peer.join",
      object: "x",
      timestamp: "2026-08-02T00:00:00.000Z",
      result: "pass",
      provenance: { source: "test", upstream: [] },
    }),
  );
  if (!assertCannotSignPeer("H", peerEnv)) {
    fail("H pudo firmar actividad de M");
    foreignOk = false;
  }
  try {
    signHalf("M", peerEnv);
  } catch {
    fail("M debería firmar su propia actividad");
    foreignOk = false;
  }
  if (foreignOk) ok("cada mitad firma sólo la suya");

  // ── 5. Evidence desde eventos (no a mano) ───────────────────────────────
  const reportPath = path.join(result.evidenceRoot, "report.json");
  const reportMdPath = path.join(result.evidenceRoot, "report.md");
  if (!fs.existsSync(reportPath) || !fs.existsSync(reportMdPath)) {
    fail("faltan report.json / report.md");
  } else {
    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    if (!validateEvidence(report)) {
      fail(`evidence schema: ${JSON.stringify(validateEvidence.errors)}`);
    } else if (report.matrix.length !== EXPECTED_ACTIVITY_PAIRS.length * 2) {
      fail("matrix incompleta");
    } else if (!report.artifactChain || !report.coverage) {
      fail("report sin artifactChain/coverage");
    } else if ((report.cortosQueried ?? []).length < 1) {
      fail("cortosQueried vacío");
    } else {
      const md = fs.readFileSync(reportMdPath, "utf8");
      if (!md.includes(report.reportId) || !md.includes("desde eventos")) {
        fail("report.md no derivado del report");
      } else {
        ok("evidence/report.json + report.md desde eventos");
      }
    }
  }

  // ── 6. Ningún paso sin upstream ─────────────────────────────────────────
  const skipRun = `test-106-skip-${Date.now().toString(36)}`;
  let upstreamBlocked = false;
  try {
    runCeremonia({ kitRoot, runId: skipRun, forceNew: true, skipStep: 5 });
    fail("skipStep=5 debió fallar en paso 6");
  } catch (e) {
    if (
      e instanceof CeremonyError &&
      (e.code === "missing-upstream" || /upstream/i.test(e.message))
    ) {
      upstreamBlocked = true;
      ok("ningún paso continúa sin upstream");
    } else {
      fail(`skipStep error inesperado: ${e.message || e}`);
    }
  }
  const skipRoot = path.join(kitRoot, ".runs", skipRun);
  if (fs.existsSync(skipRoot)) {
    fail("skipStep dejó estado parcial (runRoot existe)");
  } else if (upstreamBlocked) {
    /* already ok */
  }

  // ── 7. Fallo → cero estado parcial (matar en cada uno de los 11) ───────
  let killPass = 0;
  let actaPass = true;
  for (let step = 1; step <= CEREMONY_STEPS.length; step += 1) {
    const kid = `test-106-kill-${step}-${Date.now().toString(36)}`;
    const killRoot = path.join(kitRoot, ".runs", kid);
    try {
      runCeremonia({ kitRoot, runId: kid, forceNew: true, killAtStep: step });
      fail(`killAtStep=${step} no lanzó`);
      continue;
    } catch (e) {
      if (!(e instanceof CeremonyKillError) && e.code !== "kill") {
        fail(`killAtStep=${step}: ${e.message || e}`);
        continue;
      }
    }
    if (fs.existsSync(killRoot)) {
      fail(`killAtStep=${step}: estado parcial en ${killRoot}`);
    } else {
      killPass += 1;
    }

    // ── El fracaso DEJA ACTA, fuera del root que se borra ────────────────
    const acta = readFailureActa(kitRoot, kid);
    if (!acta) {
      fail(`killAtStep=${step}: sin acta de fracaso`);
      actaPass = false;
    } else if (acta.verdict !== "fail") {
      fail(`killAtStep=${step}: acta con verdict=${acta.verdict}`);
      actaPass = false;
    } else if (acta.step !== step) {
      fail(`killAtStep=${step}: el acta dice step=${acta.step}`);
      actaPass = false;
    } else if (acta.verb !== CEREMONY_STEPS[step - 1].verb) {
      fail(`killAtStep=${step}: el acta dice verb=${acta.verb}`);
      actaPass = false;
    } else if (acta.stepsCompleted.length !== step - 1) {
      fail(
        `killAtStep=${step}: acta con ${acta.stepsCompleted.length} pasos completados (espera ${step - 1})`,
      );
      actaPass = false;
    } else if (!acta.wipedRunRoot) {
      fail(`killAtStep=${step}: el acta no declara qué se borró`);
      actaPass = false;
    }
  }
  if (killPass === CEREMONY_STEPS.length) {
    ok(`fallo→cero estado parcial (kill en cada uno de los ${CEREMONY_STEPS.length})`);
  } else {
    fail(`kill limpio solo ${killPass}/${CEREMONY_STEPS.length}`);
  }
  if (actaPass) {
    ok(
      `fallo→acta con paso, verbo y causa fuera del runRoot borrado (${CEREMONY_STEPS.length}/${CEREMONY_STEPS.length})`,
    );
  }

  // ── 7b. ROJO: un fallo NO inyectado (throw genuino) también deja acta ────
  // Antes, un throw real en la cadena no daba veredicto negativo: daba que
  // `report.json` no existía en absoluto. El wipe se lleva la corrida entera.
  {
    const kid = `test-106-genuino-${Date.now().toString(36)}`;
    const genRoot = path.join(kitRoot, ".runs", kid);
    let lanzo = false;
    try {
      // upstream imposible: el paso 2 exige identidades del 1
      runCeremonia({ kitRoot, runId: kid, forceNew: true, skipStep: 1 });
    } catch {
      lanzo = true;
    }
    const acta = readFailureActa(kitRoot, kid);
    if (!lanzo) {
      fail("skipStep=1 debía romper la cadena de upstream");
    } else if (fs.existsSync(genRoot)) {
      fail("el wipe dejó estado parcial tras fallo genuino");
    } else if (!acta || acta.verdict !== "fail") {
      fail("fallo genuino sin acta de veredicto negativo");
    } else if (!acta.message || acta.step == null) {
      fail(`acta sin paso o sin causa: ${JSON.stringify(acta)}`);
    } else {
      ok(
        `fallo genuino deja acta (step=${acta.step} code=${acta.code}) y el wipe se mantiene`,
      );
    }
  }

  // ── 8. Eventos en pods ──────────────────────────────────────────────────
  const privateManifest = path.join(result.runRoot, ".podstore", "manifest.private.json");
  if (!fs.existsSync(privateManifest)) {
    // tras éxito el podstore sigue vivo
    fail("podstore ausente tras corrida feliz");
  } else {
    const priv = JSON.parse(fs.readFileSync(privateManifest, "utf8"));
    let eventsFound = 0;
    for (const [unitId, meta] of Object.entries(priv.pods ?? {})) {
      if (!meta.fsPath) continue;
      const ev = path.join(meta.fsPath, "events.ndjson");
      if (fs.existsSync(ev)) {
        const body = fs.readFileSync(ev, "utf8");
        if (body.includes("ceremony.activity")) eventsFound += 1;
      }
    }
    if (eventsFound < 1) fail("ningún pod con ceremony.activity");
    else ok(`eventos ceremony.activity en ${eventsFound} pods`);
  }

  // ── 9. Scenario alineado a 11 pasos ─────────────────────────────────────
  const scenario = JSON.parse(
    fs.readFileSync(
      path.join(kitRoot, "scenarios/barrio-lore/scenario.json"),
      "utf8",
    ),
  );
  if (scenario.ceremony?.id !== "barrio-lore-v1") {
    fail("ceremony.id != barrio-lore-v1");
  } else if (scenario.ceremony.steps.length !== CEREMONY_STEPS.length) {
    fail(`scenario steps=${scenario.ceremony.steps.length}`);
  } else {
    const verbs = scenario.ceremony.steps.map((s) => s.verb);
    const expected = CEREMONY_STEPS.map((s) => s.verb);
    if (JSON.stringify(verbs) !== JSON.stringify(expected)) {
      fail(`scenario verbs diverge: ${verbs.join(",")} vs ${expected.join(",")}`);
    } else {
      ok("scenario barrio-lore-v1 · 11 pasos alineados");
    }
  }

  // cleanup corrida feliz (opcional; deja evidencia si DEBUG)
  if (!process.env.KEEP_HM_RUNS) {
    fs.rmSync(result.runRoot, { recursive: true, force: true });
  }

  if (failed > 0) {
    console.error(`test-106-ceremonia: FAIL (${failed})`);
    process.exit(1);
  }
  console.log("test-106-ceremonia: PASS");
  process.exit(0);
}

main();
