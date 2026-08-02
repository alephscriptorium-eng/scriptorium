/**
 * WP-HUB-111 · descubrimiento de scenarios/<id>/scenario.json
 * Sin lista hardcodeada de ids: un escenario nuevo entra solo por existir.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * @typedef {{ scenarioId: string, dirName: string, path: string, data: object }} DiscoveredScenario
 */

/**
 * @param {string} kitRoot
 * @returns {DiscoveredScenario[]}
 */
export function discoverScenarios(kitRoot) {
  const scenariosRoot = join(kitRoot, "scenarios");
  if (!existsSync(scenariosRoot)) {
    throw new Error(`falta scenarios/ bajo ${kitRoot}`);
  }

  const out = [];
  for (const name of readdirSync(scenariosRoot).sort()) {
    const dir = join(scenariosRoot, name);
    if (!statSync(dir).isDirectory()) continue;
    const scenarioPath = join(dir, "scenario.json");
    if (!existsSync(scenarioPath)) continue;

    const data = JSON.parse(readFileSync(scenarioPath, "utf8"));
    if (typeof data.scenarioId !== "string" || !data.scenarioId) {
      throw new Error(`${scenarioPath}: scenarioId ausente o inválido`);
    }
    if (data.scenarioId !== name) {
      throw new Error(
        `${scenarioPath}: scenarioId (${data.scenarioId}) ≠ carpeta (${name})`,
      );
    }
    out.push({
      scenarioId: data.scenarioId,
      dirName: name,
      path: scenarioPath,
      data,
    });
  }
  return out;
}
