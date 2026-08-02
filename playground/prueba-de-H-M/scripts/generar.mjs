#!/usr/bin/env node
/**
 * WP-HUB-102 · generador idempotente de corridas HM (simulacro playground).
 *
 * Uso:
 *   node scripts/generar.mjs --scenario <id> --run <run-id> [--sin-install] [--force-new]
 *
 * Produce `.runs/<run-id>/{H,M,evidence,room.json,manifest.json}`.
 * Spike 112: Future Machine NO CORRE — todo es simulacro playground.
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { findMachinePath } from "../lib/rutas-maquina.mjs";

const KIT_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const RUNS_ROOT = join(KIT_ROOT, ".runs");

const SIDES = ["H", "M"];
const SIDE_META = {
  H: {
    actorId: "anfitrion-h",
    role: "anfitrión",
    mandate: "Aloja nodo/autoridad, valida identidad, emite/revoca leases y observa.",
  },
  M: {
    actorId: "maestro-m",
    role: "maestro",
    mandate: "Solicita inflación, controla Future Machine simulada y consulta resultados.",
  },
};

function fail(msg, code = 1) {
  console.error(`[generar] FAIL — ${msg}`);
  process.exit(code);
}

function usage() {
  console.error(
    "uso: node scripts/generar.mjs --scenario <id> --run <run-id> [--sin-install] [--force-new]",
  );
  process.exit(2);
}

function parseArgs(argv) {
  const out = {
    scenario: null,
    run: null,
    sinInstall: false,
    forceNew: false,
  };
  const args = argv.slice(2);
  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    if (a === "--sin-install" || a === "--no-install") {
      out.sinInstall = true;
      continue;
    }
    if (a === "--force-new") {
      out.forceNew = true;
      continue;
    }
    if (a === "--scenario") {
      const v = args[++i];
      if (!v || v.startsWith("--")) fail("--scenario requiere valor", 2);
      out.scenario = v;
      continue;
    }
    if (a === "--run") {
      const v = args[++i];
      if (!v || v.startsWith("--")) fail("--run requiere valor", 2);
      out.run = v;
      continue;
    }
    if (a === "--help" || a === "-h") usage();
    fail(`flag desconocida: ${a}`, 2);
  }
  return out;
}

function sha256Text(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  const keys = Object.keys(value).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(",")}}`;
}

function relPosix(from, to) {
  return relative(from, to).split(sep).join("/");
}

function loadScenario(scenarioId) {
  const scenarioPath = join(KIT_ROOT, "scenarios", scenarioId, "scenario.json");
  if (!existsSync(scenarioPath)) {
    fail(`escenario no encontrado: scenarios/${scenarioId}/scenario.json`);
  }
  const scenario = JSON.parse(readFileSync(scenarioPath, "utf8"));
  if (scenario.scenarioId !== scenarioId) {
    fail(`scenarioId interno (${scenario.scenarioId}) ≠ --scenario (${scenarioId})`);
  }
  if (!scenario.simulacro?.futureMachine) {
    fail("escenario sin simulacro.futureMachine=true (herencia spike 112)");
  }
  return scenario;
}

function handoffBody(side, scenario, runId) {
  const meta = SIDE_META[side];
  const peer = side === "H" ? "M" : "H";
  return `# Handoff · ventana ${side} (simulacro playground)

> **Simulacro explícito** (spike WP-HUB-112): Future Machine viva **NO CORRE**.
> Esta corrida es playground-mock; no afirma deploy contra e-sdk.

| campo | valor |
| ----- | ----- |
| runId | \`${runId}\` |
| scenarioId | \`${scenario.scenarioId}\` |
| lado | \`${side}\` (${meta.role}) |
| actorId | \`${meta.actorId}\` |
| peer | \`${peer}\` |
| roomIri | \`urn:scriptorium:hm:${runId}:room:barrio-lore\` |
| evidence | \`../evidence/\` (relativo a esta ventana) |

## Mandato

${meta.mandate}

## Env (sin defaults silenciosos)

Completá \`env.json\` de esta ventana. El generador **no** inventa URLs,
puertos ni rutas de máquina. Claves requeridas deben setearse explícitamente
antes de operar la ceremonia (WPs posteriores).

## Room

Descriptor compartido en \`../room.json\` (IRI lógica; rutas relativas al run).

## Evidencia

Raíz: \`../evidence/\`. Solo IRIs lógicas y rutas relativas al run; nada de rutas absolutas del host.
`;
}

function envDoc(side, scenario, runId) {
  const meta = SIDE_META[side];
  return {
    schema: "hm-run-env/v1",
    runId,
    scenarioId: scenario.scenarioId,
    side,
    actorId: meta.actorId,
    simulacro: {
      futureMachine: true,
      runtime: "playground-mock",
      declared:
        "Future Machine no corre hoy; kit playground simula ceremonia (spike WP-HUB-112).",
    },
    required: {
      HM_ROOM_IRI: null,
      HM_PEER_SIDE: null,
      HM_EVIDENCE_ROOT: null,
    },
    note:
      "Sin defaults silenciosos: el operador debe asignar required.* explícitamente. Valores sugeridos lógicos (no aplicados): HM_ROOM_IRI=urn:scriptorium:hm:<run-id>:room:barrio-lore; HM_PEER_SIDE=H|M; HM_EVIDENCE_ROOT=../evidence",
    paths: {
      room: "../room.json",
      evidence: "../evidence",
      manifest: "../manifest.json",
      handoff: "./handoff.md",
    },
  };
}

function roomDoc(scenario, runId) {
  return {
    roomIri: `urn:scriptorium:hm:${runId}:room:barrio-lore`,
    runId,
    scenarioId: scenario.scenarioId,
    barrioId: scenario.barrioId,
    distrito: scenario.distrito,
    simulacro: {
      futureMachine: true,
      runtime: "playground-mock",
    },
    peers: {
      H: { actorId: SIDE_META.H.actorId, sidePath: "H" },
      M: { actorId: SIDE_META.M.actorId, sidePath: "M" },
    },
    ceremonyId: scenario.ceremony?.id ?? null,
  };
}

function packageDoc(side, runId) {
  return {
    name: `@scriptorium/hm-run-${side.toLowerCase()}-${runId}`,
    private: true,
    version: "0.0.0",
    description: `Ventana ${side} · corrida ${runId} · simulacro playground LORE-HM`,
    type: "module",
    license: "UNLICENSED",
    scripts: {
      "check-env": "node -e \"const e=require('./env.json'); const m=e.required||{}; for (const k of Object.keys(m)) { if (m[k]==null||m[k]==='') { console.error('missing '+k); process.exit(1);} } console.log('env ok');\"",
    },
  };
}

function evidenceReadme(runId, scenarioId) {
  return `# Evidencia · run \`${runId}\`

Raíz de evidencia de la corrida (simulacro playground).

- scenarioId: \`${scenarioId}\`
- Relativa al run: \`evidence/\`
- Solo IRIs lógicas y rutas relativas al kit/run; prohibido filtrar rutas absolutas del host.
`;
}

/** Artefactos sellados (relativos al run root), contenido canónico. */
function buildArtifacts(scenario, runId) {
  const files = new Map();
  files.set("room.json", `${JSON.stringify(roomDoc(scenario, runId), null, 2)}\n`);
  files.set("evidence/README.md", evidenceReadme(runId, scenario.scenarioId));
  for (const side of SIDES) {
    files.set(`${side}/handoff.md`, handoffBody(side, scenario, runId));
    files.set(
      `${side}/env.json`,
      `${JSON.stringify(envDoc(side, scenario, runId), null, 2)}\n`,
    );
    files.set(
      `${side}/package.json`,
      `${JSON.stringify(packageDoc(side, runId), null, 2)}\n`,
    );
    files.set(
      `${side}/side.json`,
      `${JSON.stringify(
        {
          side,
          runId,
          scenarioId: scenario.scenarioId,
          actorId: SIDE_META[side].actorId,
          peerPath: side === "H" ? "../M" : "../H",
          roomPath: "../room.json",
          evidencePath: "../evidence",
          simulacro: true,
        },
        null,
        2,
      )}\n`,
    );
  }
  return files;
}

function sealPayload(scenario, runId, artifactHashes) {
  return {
    schema: "hm-run-manifest/v1",
    runId,
    scenarioId: scenario.scenarioId,
    barrioId: scenario.barrioId,
    distrito: scenario.distrito,
    simulacro: {
      futureMachine: true,
      runtime: "playground-mock",
      declared: scenario.simulacro.declared,
    },
    sides: SIDES.slice(),
    artifacts: artifactHashes,
  };
}

function buildManifest(scenario, runId, files) {
  const artifactHashes = {};
  for (const [rel, content] of [...files.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    artifactHashes[rel] = `sha256:${sha256Text(content)}`;
  }
  const payload = sealPayload(scenario, runId, artifactHashes);
  const seal = `sha256:${sha256Text(stableStringify(payload))}`;
  return {
    ...payload,
    seal,
    sealedAt: "playground-fixed",
  };
}

function listFilesRecursive(dir, base = dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) {
      listFilesRecursive(abs, base, acc);
    } else {
      acc.push(relPosix(base, abs));
    }
  }
  return acc;
}

function readExistingArtifacts(runDir) {
  const map = new Map();
  for (const rel of listFilesRecursive(runDir)) {
    if (rel === "manifest.json") continue;
    map.set(rel, readFileSync(join(runDir, rel), "utf8"));
  }
  return map;
}

// Gemelo eliminado: el patrón vive en lib/rutas-maquina.mjs. La copia local
// solo miraba C:/Users y dejaba pasar C:/S_LAB y cualquier otra unidad.
function assertNoMachinePaths(content, label) {
  const hit = findMachinePath(content);
  if (hit) {
    fail(`ruta de máquina (${hit.nombre}) filtrada en ${label}: …${hit.muestra}…`);
  }
}

function writeTree(runDir, files, manifest) {
  mkdirSync(runDir, { recursive: true });
  for (const [rel, content] of files) {
    assertNoMachinePaths(content, rel);
    const abs = join(runDir, rel);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, content, "utf8");
  }
  const manText = `${JSON.stringify(manifest, null, 2)}\n`;
  assertNoMachinePaths(manText, "manifest.json");
  writeFileSync(join(runDir, "manifest.json"), manText, "utf8");
}

function maybeNpmInstall(runDir, sinInstall) {
  if (sinInstall) {
    console.log("[generar] npm install omitido (--sin-install)");
    return;
  }
  for (const side of SIDES) {
    const cwd = join(runDir, side);
    console.log(`[generar] npm install en ${side}/`);
    const r = spawnSync("npm", ["install", "--no-audit", "--no-fund"], {
      cwd,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    if (r.status !== 0) fail(`npm install falló en ${side}/ (exit ${r.status})`);
  }
}

function compareForResume(runDir, expectedFiles, expectedManifest) {
  const manifestPath = join(runDir, "manifest.json");
  if (!existsSync(manifestPath)) {
    return { ok: false, reason: "falta manifest.json — no se reanuda sin sello" };
  }
  let existingManifest;
  try {
    existingManifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch (e) {
    return { ok: false, reason: `manifest.json ilegible: ${e.message}` };
  }

  const expectedSeal = expectedManifest.seal;
  if (existingManifest.seal !== expectedSeal) {
    return {
      ok: false,
      reason: `drift de manifest (seal actual=${existingManifest.seal} esperado=${expectedSeal})`,
      kind: "manifest-drift",
    };
  }
  if (stableStringify(existingManifest) !== stableStringify(expectedManifest)) {
    return {
      ok: false,
      reason: "drift de manifest (contenido ≠ sello esperado; no se reanuda)",
      kind: "manifest-drift",
    };
  }

  // Sellos iguales ⇒ payload de hashes debe coincidir; verificar bytes en disco.
  const existing = readExistingArtifacts(runDir);
  for (const [rel, content] of expectedFiles) {
    if (!existing.has(rel)) {
      return {
        ok: false,
        reason: `drift de artefactos: falta ${rel}`,
        kind: "artifact-drift",
      };
    }
    if (existing.get(rel) !== content) {
      return {
        ok: false,
        reason: `drift de artefactos: contenido distinto en ${rel}`,
        kind: "artifact-drift",
      };
    }
  }
  for (const rel of existing.keys()) {
    if (!expectedFiles.has(rel)) {
      return {
        ok: false,
        reason: `drift de artefactos: archivo extra ${rel}`,
        kind: "artifact-drift",
      };
    }
  }

  return {
    ok: true,
    filesChecked: expectedFiles.size,
    bytesCompared: [...expectedFiles.values()].reduce((n, c) => n + Buffer.byteLength(c, "utf8"), 0),
  };
}

function main() {
  const opts = parseArgs(process.argv);
  if (!opts.scenario) fail("--scenario es obligatorio (sin default silencioso)", 2);
  if (!opts.run) fail("--run es obligatorio (sin default silencioso)", 2);
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(opts.run)) {
    fail("--run inválido (usar [A-Za-z0-9._-]+)", 2);
  }

  const scenario = loadScenario(opts.scenario);
  const runDir = join(RUNS_ROOT, opts.run);
  const files = buildArtifacts(scenario, opts.run);
  const manifest = buildManifest(scenario, opts.run, files);

  console.log(`[generar] scenario=${opts.scenario} run=${opts.run}`);
  console.log("[generar] modo=simulacro-playground (FM no corre · spike 112)");

  if (existsSync(runDir) && opts.forceNew) {
    console.log(`[generar] --force-new: eliminando ${relPosix(KIT_ROOT, runDir)}`);
    rmSync(runDir, { recursive: true, force: true });
  }

  if (existsSync(runDir)) {
    const cmp = compareForResume(runDir, files, manifest);
    if (!cmp.ok) {
      fail(
        `${cmp.reason}. No se sobrescribe. Use --force-new para recrear explícitamente.`,
      );
    }
    console.log("[generar] no-op medido (manifest coincide; artefactos intactos)");
    console.log(
      JSON.stringify(
        {
          status: "no-op",
          runId: opts.run,
          scenarioId: opts.scenario,
          filesChecked: cmp.filesChecked,
          bytesCompared: cmp.bytesCompared,
          written: 0,
          seal: manifest.seal,
        },
        null,
        2,
      ),
    );
    process.exit(0);
  }

  writeTree(runDir, files, manifest);
  maybeNpmInstall(runDir, opts.sinInstall);

  console.log("[generar] corrida materializada");
  console.log(
    JSON.stringify(
      {
        status: "created",
        runId: opts.run,
        scenarioId: opts.scenario,
        runPath: `.runs/${opts.run}`,
        sides: SIDES,
        evidence: `.runs/${opts.run}/evidence`,
        seal: manifest.seal,
        written: files.size + 1,
      },
      null,
      2,
    ),
  );
}

main();
