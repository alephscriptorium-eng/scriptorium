/**
 * Bartleby mock determinista — 5 secciones + metadatos.
 * Sin LLM / sin agentes OASIS (herencia WP-HUB-112).
 */
import { SECTION_IDS, SECTION_TITLES } from "./constants.mjs";
import { digestObject, sha256Hex } from "./hash.mjs";

function countMatches(text, re) {
  const m = text.match(re);
  return m ? m.length : 0;
}

function extractHeadings(raw) {
  return [...raw.matchAll(/^#{1,3}\s+(.+)$/gm)].map((m) => m[1].trim());
}

function extractCitations(raw) {
  const quoted = [...raw.matchAll(/[«"]([^»"]{8,120})[»"]/g)].map((m) =>
    m[1].trim(),
  );
  return quoted.slice(0, 8);
}

/**
 * @param {{ pieceId: string, raw: string, sha256?: string }} piece
 */
export function analyzePiece(piece) {
  const raw = piece.raw ?? "";
  const headings = extractHeadings(raw);
  const citations = extractCitations(raw);
  const obligation = countMatches(
    raw,
    /\b(debe|deben|necesario|hay que|tiene que|tienen que)\b/gi,
  );
  const wordCount = raw.split(/\s+/).filter(Boolean).length;
  const contentHash = piece.sha256 ?? sha256Hex(raw);

  const sections = SECTION_IDS.map((id, index) => {
    const title = SECTION_TITLES[id];
    const snippet = headings[index] ?? headings[0] ?? piece.pieceId;
    return {
      id,
      title,
      summary: `[mock] ${title} · ancla="${snippet}" · words=${wordCount} · hash=${contentHash.slice(0, 12)}`,
      markers: {
        headingsSample: headings.slice(0, 3),
        citationsSample: citations.slice(0, 2),
        obligationVerbs: obligation,
      },
    };
  });

  const meta = {
    pieceId: piece.pieceId,
    contentHash: `sha256:${contentHash}`,
    sectionsCount: 5,
    linajePrimarioNodos: Math.min(5, Math.max(1, citations.length)),
    linajeExclusionNodos: Math.min(3, Math.max(0, Math.floor(obligation / 10))),
    categoriasTaxonomicas: Math.min(6, Math.max(2, headings.length)),
    mecanismosRetoricos: Math.min(5, Math.max(1, citations.length)),
    frecuenciaVerbosObligacion: obligation,
    emergenciasIdentificadas: 1,
    ausenciasEstructurales: 1,
    nickCorriente: "[mock-restitutiva]",
    posicionCorpus: "mock-playground",
    mock: true,
    runtime: "playground-mock",
  };

  if (sections.length !== 5) {
    throw new Error(`Bartleby exige 5 secciones, obtuvo ${sections.length}`);
  }

  const analysis = {
    unitId: "bartleby",
    verb: "document.analyze",
    pieceId: piece.pieceId,
    onfaloUrn: `urn:onfalo:${piece.pieceId}`,
    sections,
    meta,
    mock: true,
  };
  analysis.digest = digestObject({
    pieceId: analysis.pieceId,
    sections,
    meta,
  });
  return analysis;
}

/**
 * @param {Array<{ pieceId: string, raw: string, sha256?: string }>} pieces
 */
export function analyzeAll(pieces) {
  const analyses = pieces.map(analyzePiece);
  return {
    unitId: "bartleby",
    verb: "document.analyze",
    mock: true,
    analyses,
    sectionsCount: analyses.reduce((n, a) => n + a.sections.length, 0),
    digest: digestObject(analyses.map((a) => a.digest)),
  };
}
