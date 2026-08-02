/**
 * Cristalizador mock — inspecciona capacidades y emite machine manifest.
 * NO materializa líneas (eso es Pipeline).
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { SIMULACRO_DECLARED } from "./constants.mjs";
import { digestObject } from "./hash.mjs";

/**
 * @param {{ catalogDir: string, barrioId?: string, machineId?: string }} opts
 */
export function crystallizeMachineManifest(opts) {
  const catalogDir = opts.catalogDir;
  const files = readdirSync(catalogDir).filter((f) => f.endsWith(".json"));
  const units = [];
  const capabilities = new Set();

  for (const file of files) {
    const unit = JSON.parse(readFileSync(join(catalogDir, file), "utf8"));
    units.push(unit.unitId);
    for (const verb of unit.verbs ?? []) capabilities.add(verb);
  }

  units.sort();
  const caps = [...capabilities].sort();

  const manifest = {
    machineId: opts.machineId ?? "hm-fm-playground-mock",
    barrioId: opts.barrioId ?? "document-machine-sdk",
    simulacro: {
      mock: true,
      declared: SIMULACRO_DECLARED,
    },
    capabilities: caps,
    units,
    status: "ready",
    deployedAt: "2026-08-02T00:00:00.000Z",
  };

  return {
    unitId: "cristalizador",
    verb: "machine.deploy",
    mock: true,
    note: "Prepara infraestructura; no suplanta a Pipeline (line.materialize).",
    manifest,
    digest: digestObject(manifest),
  };
}
