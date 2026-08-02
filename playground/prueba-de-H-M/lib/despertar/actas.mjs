/**
 * Actas por unidad desde evidencia de ceremonia (unidad · verbo · huella).
 */
import { existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { digestObject } from "../cadena/hash.mjs";

/**
 * Lee activities/<id>/wire.json y agrupa por unidad.
 * @param {string} evidenceRoot
 * @returns {Array<{ unidad: string, verbo: string, huella: string, activityId: string }>}
 */
export function collectActasFromEvidence(evidenceRoot) {
  const actRoot = join(evidenceRoot, "activities");
  if (!existsSync(actRoot)) {
    throw new Error(`evidence sin activities/: ${actRoot}`);
  }

  /** @type {Map<string, { unidad: string, verbo: string, huella: string, activityId: string, order: number }>} */
  const byUnit = new Map();

  for (const name of readdirSync(actRoot)) {
    const wirePath = join(actRoot, name, "wire.json");
    if (!existsSync(wirePath)) continue;
    const wire = JSON.parse(readFileSync(wirePath, "utf8"));
    const unidad =
      wire.context?.unitId ||
      wire.instrument ||
      null;
    if (!unidad || typeof unidad !== "string") continue;
    if (wire.result !== "pass") continue;

    const huella = wire.digest;
    if (!huella || typeof huella !== "string") {
      throw new Error(`wire sin digest (huella): ${wirePath}`);
    }
    const verbo = wire.verb;
    if (!verbo) throw new Error(`wire sin verbo: ${wirePath}`);

    // Preferir el primer wire H (o cualquiera) por unidad — una acta/unidad
    if (byUnit.has(unidad)) continue;
    const orderMatch = String(wire.id || name).match(/step-(\d+)/);
    const order = orderMatch ? Number(orderMatch[1]) : 99;
    byUnit.set(unidad, {
      unidad,
      verbo,
      huella,
      activityId: wire.id ?? name,
      order,
    });
  }

  return [...byUnit.values()]
    .sort((a, b) => a.order - b.order || a.unidad.localeCompare(b.unidad))
    .map(({ unidad, verbo, huella, activityId }) => ({
      unidad,
      verbo,
      huella,
      activityId,
    }));
}

/**
 * @param {Array<{ unidad: string, verbo: string, huella: string, activityId: string }>} actas
 * @param {{ runId: string, distrito: string, barrioId: string }} meta
 */
export function sealActasDoc(actas, meta) {
  const body = {
    kind: "hm-actas-unidad",
    version: 1,
    runId: meta.runId,
    distrito: meta.distrito,
    barrioId: meta.barrioId,
    actas: actas.map((a) => ({
      unidad: a.unidad,
      verbo: a.verbo,
      huella: a.huella,
      activityId: a.activityId,
    })),
  };
  return {
    ...body,
    digest: digestObject(body),
  };
}

/**
 * @param {string} outDir
 * @param {object} actasDoc
 */
export function writeActas(outDir, actasDoc) {
  mkdirSync(outDir, { recursive: true });
  const jsonPath = join(outDir, "actas.json");
  writeFileSync(jsonPath, `${JSON.stringify(actasDoc, null, 2)}\n`);

  const perUnit = join(outDir, "actas");
  mkdirSync(perUnit, { recursive: true });
  for (const a of actasDoc.actas) {
    const one = {
      kind: "hm-acta-unidad",
      version: 1,
      runId: actasDoc.runId,
      unidad: a.unidad,
      verbo: a.verbo,
      huella: a.huella,
      activityId: a.activityId,
    };
    writeFileSync(
      join(perUnit, `${a.unidad}.json`),
      `${JSON.stringify(one, null, 2)}\n`,
    );
  }
  return { jsonPath, count: actasDoc.actas.length };
}
