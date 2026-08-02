/**
 * Hook WP-HUB-108 · proyección/mapa holones×distritos.
 * Si 108 aún no materializó el JSON, retorna null (109 no inventa barrios).
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { MAPA_PROYECCION_CANDIDATES } from "./constants.mjs";

/**
 * @param {string} kitRoot
 * @param {{ mapaPath?: string }} [opts]
 * @returns {{ path: string, mapa: object } | null}
 */
export function loadMapaProyeccion(kitRoot, opts = {}) {
  const explicit =
    opts.mapaPath ||
    process.env.HM_MAPA_PROYECCION_PATH ||
    null;

  const candidates = explicit
    ? [explicit]
    : MAPA_PROYECCION_CANDIDATES.map((rel) => join(kitRoot, rel));

  for (const cand of candidates) {
    const abs = resolve(cand);
    if (!existsSync(abs)) continue;
    const mapa = JSON.parse(readFileSync(abs, "utf8"));
    return { path: abs.replaceAll("\\", "/"), mapa };
  }
  return null;
}

/**
 * Si hay mapa, exige que cada id de barrio esté en la proyección.
 * Sin mapa: no-op (hook vacío hasta 108).
 *
 * @param {{ path: string, mapa: object } | null} loaded
 * @param {string[]} barrioIds
 */
export function assertBarriosEnMapa(loaded, barrioIds) {
  if (!loaded) return { ok: true, hooked: false, checked: 0 };
  const mapa = loaded.mapa;
  const known = new Set();

  if (Array.isArray(mapa.barrios)) {
    for (const b of mapa.barrios) {
      if (b?.id) known.add(b.id);
      if (b?.barrioId) known.add(b.barrioId);
    }
  } else if (mapa.barrios && typeof mapa.barrios === "object") {
    for (const id of Object.keys(mapa.barrios)) known.add(id);
  } else if (Array.isArray(mapa.entries)) {
    for (const e of mapa.entries) {
      if (e?.id) known.add(e.id);
      if (e?.barrioId) known.add(e.barrioId);
    }
  }

  if (known.size === 0) {
    throw new Error(
      `mapa en ${loaded.path} no expone barrios (espera barrios[]|barrios{}|entries[])`,
    );
  }

  const missing = barrioIds.filter((id) => !known.has(id));
  if (missing.length) {
    throw new Error(
      `ids ausentes en proyección 108: ${missing.join(", ")}`,
    );
  }
  return { ok: true, hooked: true, checked: barrioIds.length, path: loaded.path };
}
