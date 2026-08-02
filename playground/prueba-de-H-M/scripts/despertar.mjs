#!/usr/bin/env node
/**
 * CLI · despertar lore-voz desde evidencia (WP-HUB-109).
 *
 *   node scripts/despertar.mjs --evidence <path> [--out <dir>] [--kit <root>]
 *   node scripts/despertar.mjs --revert [--out <dir>]   # sin evidencia → dormido
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { despertarLoreVoz } from "../lib/despertar/index.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const defaultKit = path.resolve(here, "..");

function arg(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : null;
}

const revert = process.argv.includes("--revert");
const evidence = revert ? null : arg("--evidence");
const outDir = arg("--out") || undefined;
const kitRoot = arg("--kit") || defaultKit;
const mapaPath = arg("--mapa") || undefined;

if (!revert && !evidence) {
  console.error(
    "uso: despertar.mjs --evidence <evidenceRoot> | --revert [--out dir]",
  );
  process.exit(2);
}

const result = despertarLoreVoz({
  kitRoot,
  evidenceRoot: evidence,
  outDir,
  mapaPath,
});

console.log(
  JSON.stringify(
    {
      awake: result.awake,
      distritoEstado: result.distritoEstado,
      outDir: result.outDir,
      actas: result.actasDoc?.actas?.length ?? 0,
      elencoBindings: result.elencoDoc?.bindings?.length ?? 0,
      mapaHook: result.mapaHook,
      evidenceReason: result.inspection.reason ?? null,
    },
    null,
    2,
  ),
);
process.exit(0);
