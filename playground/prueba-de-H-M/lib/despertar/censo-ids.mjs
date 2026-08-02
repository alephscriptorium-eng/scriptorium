/**
 * Parser de excerpts CENSO — solo ids ya censados (cero inventados).
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  CENSO_EXCERPT_LORE_VOZ,
  CENSO_EXCERPT_NOVELIST,
  DISTRITO_LORE_VOZ,
  BARRIO_NOVELIST,
} from "./constants.mjs";

/**
 * @param {string} md
 * @returns {Array<{ id: string, slug: string, label: string, distrito: string, estado: string }>}
 */
export function parseCensoExcerptMd(md) {
  const rows = [];
  for (const line of md.split(/\r?\n/)) {
    if (!line.startsWith("|")) continue;
    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter((c, i, arr) => i > 0 && i < arr.length);
    if (cells.length < 5) continue;
    if (cells[0] === "id" || /^-+$/.test(cells[0]) || cells[0] === "--") continue;
    rows.push({
      id: cells[0],
      slug: cells[1],
      label: cells[2],
      distrito: cells[3],
      estado: cells[4],
    });
  }
  return rows;
}

/**
 * @param {string} kitRoot
 * @returns {{ loreVoz: ReturnType<typeof parseCensoExcerptMd>, novelist: ReturnType<typeof parseCensoExcerptMd> }}
 */
export function loadCensoIds(kitRoot) {
  const lorePath = join(kitRoot, CENSO_EXCERPT_LORE_VOZ);
  const novPath = join(kitRoot, CENSO_EXCERPT_NOVELIST);
  if (!existsSync(lorePath)) {
    throw new Error(`falta excerpt censo lore-voz: ${lorePath}`);
  }
  if (!existsSync(novPath)) {
    throw new Error(`falta excerpt censo novelist: ${novPath}`);
  }
  const loreVoz = parseCensoExcerptMd(readFileSync(lorePath, "utf8"));
  const novelist = parseCensoExcerptMd(readFileSync(novPath, "utf8"));

  if (loreVoz.length === 0) throw new Error("excerpt lore-voz sin filas");
  for (const row of loreVoz) {
    if (row.distrito !== DISTRITO_LORE_VOZ) {
      throw new Error(
        `id ${row.id}: distrito=${row.distrito} (espera ${DISTRITO_LORE_VOZ})`,
      );
    }
  }
  const nov = novelist.find((r) => r.id === BARRIO_NOVELIST);
  if (!nov) {
    throw new Error(`excerpt novelist sin id canónico ${BARRIO_NOVELIST}`);
  }
  return { loreVoz, novelist };
}
