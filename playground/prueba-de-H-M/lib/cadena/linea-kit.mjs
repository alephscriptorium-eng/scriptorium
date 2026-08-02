/**
 * Resolutor único de @zeus/linea-kit.
 *
 * Antes esta función estaba duplicada en ci/test-100 y ci/test-105 y NINGÚN
 * módulo de producción la usaba: cero ficheros importaban el kit fuera de los
 * tests. Las líneas se etiquetaban `lineaKitSchema: "manifest-tronco"` y nadie
 * las validaba jamás — el nombre del schema era una declaración, no un hecho.
 *
 * Se resuelve en carga de módulo (top-level await) para que
 * `materializeLines()` pueda validar sin volverse asíncrona.
 */
import { existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const kitRoot = resolve(here, "../..");

/** Raíces candidatas, sin rutas de máquina escritas a mano. */
export const LINEA_KIT_CANDIDATES = Object.freeze(
  [
    process.env.LINEA_KIT_ROOT,
    join(kitRoot, "node_modules/@zeus/linea-kit"),
    resolve(kitRoot, "../../../../z-sdk/packages/engine/linea-kit"),
  ].filter(Boolean),
);

async function resolveLineaKit() {
  for (const root of LINEA_KIT_CANDIDATES) {
    const validatePath = join(root, "src/validate.mjs");
    if (existsSync(validatePath)) {
      return {
        root,
        mod: await import(pathToFileURL(validatePath).href),
      };
    }
  }
  return null;
}

const resolved = await resolveLineaKit();

/** @type {string|null} raíz desde la que se cargó el kit (null si no hay). */
export const lineaKitRoot = resolved?.root ?? null;

/** @type {boolean} */
export const lineaKitAvailable = resolved != null;

/**
 * Valida un payload contra un schema de linea-kit.
 *
 * Si el kit no está resoluble devuelve `{ ok:true, skipped:true }`: no se
 * inventa una validación local ni se copia el schema (esa es justo la regla
 * U245). El guardián de CI exige que en CI SÍ esté disponible.
 *
 * @param {string} schemaId
 * @param {unknown} payload
 * @returns {{ ok: boolean, skipped?: boolean, errors?: unknown }}
 */
export function validateLinea(schemaId, payload) {
  if (!resolved) return { ok: true, skipped: true };
  const r = resolved.mod.validate(schemaId, payload);
  return { ok: r.ok === true, errors: r.errors };
}

/**
 * Valida o lanza. Lo usa producción: una línea que no valida no se materializa.
 * @param {string} schemaId
 * @param {unknown} payload
 * @param {string} label
 */
export function assertLineaValida(schemaId, payload, label) {
  const r = validateLinea(schemaId, payload);
  if (!r.ok) {
    throw new Error(
      `linea-kit rechazó ${label} (${schemaId}): ${JSON.stringify(r.errors)}`,
    );
  }
  return r;
}
