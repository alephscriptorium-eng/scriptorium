/**
 * Rutas de máquina: una sola definición para todos los guardianes.
 *
 * Antes vivía duplicada en `scripts/importar-onfalo.mjs` (ABSOLUTE_PATH_PATTERNS)
 * y `scripts/generar.mjs` (assertNoMachinePaths), y ninguna de las dos cubría
 * `C:/S_LAB/` — solo `C:/Users/`. Dos copias que hay que recordar cambiar a la
 * vez son dos copias que acaban divergiendo: aquí hay una.
 *
 * Cubre cualquier unidad de Windows (no solo C:), rutas UNC y homes POSIX.
 */

/**
 * La letra de unidad debe ir precedida de algo que NO sea letra, para no
 * confundir `https://` (la `s` va tras `p`) con la unidad `S:/`.
 */
const DRIVE = /(?:^|[^A-Za-z])([A-Za-z]:[\\/])/;

export const MACHINE_PATH_PATTERNS = Object.freeze([
  Object.freeze({ nombre: "unidad-windows", re: DRIVE }),
  Object.freeze({ nombre: "unc", re: /\\\\[A-Za-z0-9._-]+\\[A-Za-z0-9._$-]+/ }),
  Object.freeze({ nombre: "home-macos", re: /\/Users\/[A-Za-z0-9._-]+\// }),
  Object.freeze({ nombre: "home-linux", re: /\/home\/[A-Za-z0-9._-]+\// }),
]);

/**
 * @param {string} text
 * @returns {{ nombre: string, muestra: string }|null}
 */
export function findMachinePath(text) {
  if (typeof text !== "string") return null;
  for (const { nombre, re } of MACHINE_PATH_PATTERNS) {
    const m = re.exec(text);
    if (m) {
      const at = m.index;
      return {
        nombre,
        muestra: text.slice(Math.max(0, at - 20), at + 60).replace(/\s+/g, " "),
      };
    }
  }
  return null;
}

/**
 * @param {string} text
 * @param {string} label
 * @throws si el contenido lleva una ruta de máquina
 */
export function assertNoMachinePaths(text, label) {
  const hit = findMachinePath(text);
  if (hit) {
    throw new Error(
      `ruta de máquina (${hit.nombre}) en ${label}: …${hit.muestra}…`,
    );
  }
}
