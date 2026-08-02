/**
 * Orquesta la cadena lore determinista (WP-HUB-105).
 * Solo handlers playground mock; consume snapshot Onfalo sellado (104).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeAll } from "./bartleby.mjs";
import { crystallizeMachineManifest } from "./cristalizador.mjs";
import { indexAnalyses } from "./vector-mock.mjs";
import { materializeLines } from "./pipeline-lines.mjs";
import { buildFuturesGraph } from "./grafista.mjs";
import { instantiateUniverses } from "./demiurgo.mjs";
import { emitCortos, queryCortos, assertOnfaloTrace } from "./dramaturgo.mjs";
import { digestObject } from "./hash.mjs";

const here = fileURLToPath(new URL(".", import.meta.url));
const defaultKitRoot = join(here, "../..");

/**
 * @param {{ kitRoot?: string }} [opts]
 */
export function loadSealedPieces(opts = {}) {
  const kitRoot = opts.kitRoot ?? defaultKitRoot;
  const manifestPath = join(kitRoot, "fixtures/onfalo/source.manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const pieces = manifest.pieces.map((p) => {
    const abs = join(kitRoot, "fixtures/onfalo", p.relativePath);
    return {
      pieceId: p.id,
      sha256: p.sha256,
      relativePath: p.relativePath,
      raw: readFileSync(abs, "utf8"),
    };
  });
  return { manifest, pieces };
}

/**
 * @param {{ kitRoot?: string }} [opts]
 */
export function runCadena(opts = {}) {
  const kitRoot = opts.kitRoot ?? defaultKitRoot;
  const catalogDir = join(kitRoot, "units/catalog");
  const { manifest, pieces } = loadSealedPieces({ kitRoot });

  const cristalizador = crystallizeMachineManifest({
    catalogDir,
    barrioId: "document-machine-sdk",
    machineId: "hm-fm-playground-mock",
  });

  const bartleby = analyzeAll(pieces);
  const vectorMock = indexAnalyses(bartleby);
  const pipeline = materializeLines({ pieces, bartleby, vectorMock });
  const grafista = buildFuturesGraph({
    lines: pipeline.lines,
    vectorMock,
  });
  const demiurgo = instantiateUniverses({
    graph: grafista.graph,
    lines: pipeline.lines,
    vectorMock,
    pieces,
  });
  const dramaturgo = emitCortos({
    universes: demiurgo.universes,
    vectorMock,
    pieces,
  });

  const sealedIds = new Set(pieces.map((p) => p.pieceId));
  assertOnfaloTrace(dramaturgo.cortos, sealedIds);

  const artifactChain = {
    chainId: "chain-barrio-lore-105",
    runId: "run-cadena-105",
    links: [
      {
        order: 1,
        artifactId: "onfalo-snapshot",
        kind: "onfalo-raw",
        hash: `sha256:${manifest.seal.value}`,
        producedBy: "archivero",
      },
      {
        order: 2,
        artifactId: "analysis-batch",
        kind: "analysis",
        hash: bartleby.digest,
        producedBy: "bartleby",
        upstream: ["onfalo-snapshot"],
      },
      {
        order: 3,
        artifactId: "vector-index",
        kind: "vector-mock",
        hash: vectorMock.digest,
        producedBy: "vector-mock",
        upstream: ["analysis-batch"],
      },
      {
        order: 4,
        artifactId: "linea-onfalo",
        kind: "linea",
        hash: pipeline.lines["barrio-lore-onfalo"].digest,
        producedBy: "pipeline",
        lineaKit: {
          schemaId: "manifest-tronco",
          payload: pipeline.lines["barrio-lore-onfalo"].payload,
        },
        upstream: ["analysis-batch", "vector-index"],
      },
      {
        order: 5,
        artifactId: "linea-futuros",
        kind: "linea",
        hash: pipeline.lines["barrio-lore-futuros"].digest,
        producedBy: "pipeline",
        lineaKit: {
          schemaId: "manifest-tronco",
          payload: pipeline.lines["barrio-lore-futuros"].payload,
        },
        upstream: ["linea-onfalo"],
      },
      {
        order: 6,
        artifactId: "futures-graph",
        kind: "graph",
        hash: grafista.graph.digest,
        producedBy: "grafista",
        upstream: ["linea-onfalo", "linea-futuros", "vector-index"],
      },
      {
        order: 7,
        artifactId: "universes",
        kind: "universe",
        hash: digestObject(demiurgo.universes.map((u) => u.digest)),
        producedBy: "demiurgo",
        upstream: ["futures-graph"],
      },
      {
        order: 8,
        artifactId: "cortos",
        kind: "corto",
        hash: digestObject(dramaturgo.cortos.map((c) => c.digest)),
        producedBy: "dramaturgo",
        upstream: ["universes"],
      },
    ],
  };

  return {
    mock: true,
    runtime: "playground-mock",
    onfaloManifest: {
      seal: manifest.seal,
      pieceIds: pieces.map((p) => p.pieceId),
    },
    cristalizador,
    bartleby,
    vectorMock,
    pipeline,
    grafista,
    demiurgo,
    dramaturgo,
    artifactChain,
    queryCortos: (filter) => queryCortos(dramaturgo.cortos, filter),
  };
}
