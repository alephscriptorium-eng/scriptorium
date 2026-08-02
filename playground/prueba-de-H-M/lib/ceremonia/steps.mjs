/**
 * Handlers de los 11 pasos bloqueantes (reutiliza cadena + podstore).
 */
import { join } from "node:path";
import {
  loadSealedPieces,
  analyzeAll,
  crystallizeMachineManifest,
  indexAnalyses,
  materializeLines,
  buildFuturesGraph,
  instantiateUniverses,
  emitCortos,
  queryCortos,
  assertOnfaloTrace,
} from "../cadena/index.mjs";
import { digestObject } from "../cadena/hash.mjs";
import { universeRunnerUnitId } from "../podstore/index.mjs";
import { ACTOR_H, ACTOR_M, SIMULACRO_NOTE } from "./constants.mjs";

function inflateLease(provider, unitId) {
  provider.requestInflate({
    unitId,
    actorIri: ACTOR_M,
    identity: { actorId: "maestro-m", role: "M", trusted: true },
  });
  const expiresAt = new Date(Date.UTC(2026, 11, 31, 23, 59, 59)).toISOString();
  return provider.issueLease({
    unitId,
    actorIri: ACTOR_H,
    permissions: ["unit.start", "unit.inspect", "artifact.data"],
    expiresAt,
    identity: { actorId: "maestro-m", role: "M", trusted: true },
    acl: [
      {
        actor: ACTOR_M,
        verbs: ["unit.start", "unit.inspect", "artifact.data"],
        expiresAt,
      },
      {
        actor: ACTOR_H,
        verbs: ["unit.inspect", "pod.revoke", "unit.stop"],
        expiresAt,
      },
    ],
  });
}

function ensureReady(provider, unitId) {
  const pod = provider.describe(unitId);
  if (pod.state === "inflated") {
    provider.transition(unitId, "ready");
  }
}

/**
 * @param {import("./run-ceremonia.mjs").CeremonyContext} ctx
 * @param {number} order
 */
export function executeStep(ctx, order) {
  switch (order) {
    case 1:
      return step1Preflight(ctx);
    case 2:
      return step2Room(ctx);
    case 3:
      return step3InflateCore(ctx);
    case 4:
      return step4DeployRest(ctx);
    case 5:
      return step5IngestAnalyze(ctx);
    case 6:
      return step6Vector(ctx);
    case 7:
      return step7Lines(ctx);
    case 8:
      return step8Graph(ctx);
    case 9:
      return step9Universes(ctx);
    case 10:
      return step10Cortos(ctx);
    case 11:
      return step11TraceCoverageShutdown(ctx);
    default:
      throw new Error(`paso desconocido: ${order}`);
  }
}

function step1Preflight(ctx) {
  const identities = {
    H: { actorId: "anfitrion-h", actorIri: ACTOR_H, side: "H", trusted: true },
    M: { actorId: "maestro-m", actorIri: ACTOR_M, side: "M", trusted: true },
  };
  if (!identities.H.trusted || !identities.M.trusted) {
    throw new Error("preflight: identidad H/M inválida");
  }
  ctx.state.identities = identities;
  ctx.provider.declareStaticCatalog();
  // portal materializado temprano para hospedar eventos de preflight/room
  inflateLease(ctx.provider, "portal");
  ensureReady(ctx.provider, "portal");
  return {
    object: `urn:scriptorium:hm:${ctx.runId}:ceremony:barrio-lore-v1`,
    target: `urn:scriptorium:hm:${ctx.runId}:room:barrio-lore`,
    instrument: "portal",
    unitId: "portal",
    context: {
      unitId: "portal",
      preflight: "pass",
      identities: { H: identities.H.actorId, M: identities.M.actorId },
      simulacro: SIMULACRO_NOTE,
    },
    artifactRef: null,
  };
}

function step2Room(ctx) {
  if (!ctx.state.identities) throw new Error("upstream ausente: identidades");
  const roomIri = `urn:scriptorium:hm:${ctx.runId}:room:barrio-lore`;
  ctx.state.room = {
    roomIri,
    authority: ACTOR_H,
    peers: ["H", "M"],
    barrioId: "document-machine-sdk",
    distrito: "lore-voz",
  };
  return {
    object: roomIri,
    target: ACTOR_H,
    instrument: "portal",
    unitId: "portal",
    context: {
      unitId: "portal",
      room: ctx.state.room,
      authority: "anfitrion-h",
    },
    artifactRef: null,
  };
}

function step3InflateCore(ctx) {
  if (!ctx.state.room) throw new Error("upstream ausente: room");
  const leases = {};
  for (const unitId of ["bartleby", "cristalizador"]) {
    const { lease } = inflateLease(ctx.provider, unitId);
    ensureReady(ctx.provider, unitId);
    leases[unitId] = lease.leaseId;
  }
  ctx.state.coreLeases = leases;
  return {
    object: "urn:scriptorium:hm:unit:bartleby+cristalizador",
    target: ACTOR_H,
    instrument: "bartleby",
    unitId: "bartleby",
    context: {
      unitId: "bartleby",
      inflated: ["bartleby", "cristalizador"],
      leases,
      bilateral: "M.inflate→H.lease",
    },
    artifactRef: null,
  };
}

function step4DeployRest(ctx) {
  if (!ctx.state.coreLeases) throw new Error("upstream ausente: core leases");
  const catalogDir = join(ctx.kitRoot, "units/catalog");
  const cristalizador = crystallizeMachineManifest({
    catalogDir,
    barrioId: "document-machine-sdk",
    machineId: "hm-fm-playground-mock",
  });
  ctx.state.cristalizador = cristalizador;

  const rest = [
    "loreador",
    "archivero",
    "vector-mock",
    "grafista",
    "demiurgo",
    "dramaturgo",
    "pipeline",
  ];
  const deployed = [];
  for (const unitId of rest) {
    inflateLease(ctx.provider, unitId);
    ensureReady(ctx.provider, unitId);
    ctx.provider.transition(unitId, "running");
    deployed.push(unitId);
  }
  for (const unitId of ["bartleby", "cristalizador", "portal"]) {
    const st = ctx.provider.describe(unitId).state;
    if (st === "ready") ctx.provider.transition(unitId, "running");
  }
  ctx.state.deployed = deployed;
  return {
    object: cristalizador.manifest.machineId,
    target: `urn:scriptorium:hm:${ctx.runId}:machine`,
    instrument: "cristalizador",
    unitId: "cristalizador",
    context: {
      unitId: "cristalizador",
      machineDigest: cristalizador.digest,
      deployed,
      mock: true,
    },
    artifactRef: cristalizador.digest,
  };
}

function step5IngestAnalyze(ctx) {
  if (!ctx.state.cristalizador) throw new Error("upstream ausente: machine");
  const { manifest, pieces } = loadSealedPieces({ kitRoot: ctx.kitRoot });
  const bartleby = analyzeAll(pieces);
  ctx.state.pieces = pieces;
  ctx.state.onfaloManifest = manifest;
  ctx.state.bartleby = bartleby;
  return {
    object: `sha256:${manifest.seal.value}`,
    target: "urn:onfalo:snapshot",
    instrument: "archivero",
    unitId: "archivero",
    context: {
      unitId: "archivero",
      ingest: "onfalo-import-once",
      pieceIds: pieces.map((p) => p.pieceId),
      analysisDigest: bartleby.digest,
      secondaryVerb: "document.analyze",
    },
    artifactRef: bartleby.digest,
    secondaryEvents: [
      {
        verb: "document.analyze",
        object: bartleby.digest,
        unitId: "bartleby",
        instrument: "bartleby",
        context: {
          unitId: "bartleby",
          analyses: bartleby.analyses.length,
          mock: true,
        },
      },
    ],
  };
}

function step6Vector(ctx) {
  if (!ctx.state.bartleby) throw new Error("upstream ausente: análisis");
  const vectorMock = indexAnalyses(ctx.state.bartleby);
  if (vectorMock.mock !== true) {
    throw new Error("VectorMock sin mock=true");
  }
  ctx.state.vectorMock = vectorMock;
  return {
    object: vectorMock.digest,
    target: "urn:scriptorium:hm:vector-mock",
    instrument: "vector-mock",
    unitId: "vector-mock",
    context: {
      unitId: "vector-mock",
      mock: true,
      algorithm: vectorMock.algorithm,
      seed: vectorMock.seed,
    },
    artifactRef: vectorMock.digest,
  };
}

function step7Lines(ctx) {
  if (!ctx.state.vectorMock) throw new Error("upstream ausente: vector");
  const pipeline = materializeLines({
    pieces: ctx.state.pieces,
    bartleby: ctx.state.bartleby,
    vectorMock: ctx.state.vectorMock,
  });
  ctx.state.pipeline = pipeline;
  return {
    object: "linea://barrio-lore-onfalo+barrio-lore-futuros",
    target: "urn:scriptorium:hm:pipeline",
    instrument: "pipeline",
    unitId: "pipeline",
    context: {
      unitId: "pipeline",
      lines: Object.keys(pipeline.lines),
      digests: {
        onfalo: pipeline.lines["barrio-lore-onfalo"].digest,
        futuros: pipeline.lines["barrio-lore-futuros"].digest,
      },
    },
    artifactRef: digestObject(pipeline.lines),
  };
}

function step8Graph(ctx) {
  if (!ctx.state.pipeline) throw new Error("upstream ausente: líneas");
  const grafista = buildFuturesGraph({
    lines: ctx.state.pipeline.lines,
    vectorMock: ctx.state.vectorMock,
  });
  ctx.state.grafista = grafista;
  return {
    object: grafista.graph.digest,
    target: "urn:scriptorium:hm:graph",
    instrument: "grafista",
    unitId: "grafista",
    context: {
      unitId: "grafista",
      nodes: grafista.graph.nodes?.length ?? grafista.nodes?.length,
      linked: true,
    },
    artifactRef: grafista.graph.digest,
  };
}

function step9Universes(ctx) {
  if (!ctx.state.grafista) throw new Error("upstream ausente: grafo");
  const demiurgo = instantiateUniverses({
    graph: ctx.state.grafista.graph,
    lines: ctx.state.pipeline.lines,
    vectorMock: ctx.state.vectorMock,
    pieces: ctx.state.pieces,
  });
  const runners = [];
  for (const u of demiurgo.universes) {
    ctx.provider.declareUniverseRunner(u.universeId);
    const unitId = universeRunnerUnitId(u.universeId);
    inflateLease(ctx.provider, unitId);
    ensureReady(ctx.provider, unitId);
    ctx.provider.transition(unitId, "running");
    runners.push(unitId);
  }
  ctx.state.demiurgo = demiurgo;
  ctx.state.runners = runners;
  return {
    object: digestObject(demiurgo.universes.map((u) => u.digest)),
    target: "urn:scriptorium:hm:universes",
    instrument: "demiurgo",
    unitId: "demiurgo",
    context: {
      unitId: "demiurgo",
      universeIds: demiurgo.universes.map((u) => u.universeId),
      runners,
    },
    artifactRef: digestObject(demiurgo.universes.map((u) => u.digest)),
  };
}

function step10Cortos(ctx) {
  if (!ctx.state.demiurgo) throw new Error("upstream ausente: universos");
  const dramaturgo = emitCortos({
    universes: ctx.state.demiurgo.universes,
    vectorMock: ctx.state.vectorMock,
    pieces: ctx.state.pieces,
  });
  const sealedIds = new Set(ctx.state.pieces.map((p) => p.pieceId));
  assertOnfaloTrace(dramaturgo.cortos, sealedIds);
  const queried = queryCortos(dramaturgo.cortos, { verb: "corto.emit" });
  ctx.state.dramaturgo = dramaturgo;
  ctx.state.cortosQueried = queried.map((c) => c.cortoId);
  return {
    object: digestObject(dramaturgo.cortos.map((c) => c.digest)),
    target: "urn:scriptorium:hm:cortos",
    instrument: "dramaturgo",
    unitId: "dramaturgo",
    context: {
      unitId: "dramaturgo",
      emitted: dramaturgo.cortos.length,
      queried: ctx.state.cortosQueried,
    },
    artifactRef: digestObject(dramaturgo.cortos.map((c) => c.digest)),
    secondaryEvents: [
      {
        verb: "corto.query",
        object: "urn:scriptorium:hm:cortos:query",
        unitId: "dramaturgo",
        instrument: "dramaturgo",
        context: {
          unitId: "dramaturgo",
          hits: ctx.state.cortosQueried,
        },
      },
    ],
  };
}

function step11TraceCoverageShutdown(ctx) {
  if (!ctx.state.dramaturgo) throw new Error("upstream ausente: cortos");
  const chainLinks = [
    ctx.state.onfaloManifest?.seal?.value
      ? `sha256:${ctx.state.onfaloManifest.seal.value}`
      : null,
    ctx.state.bartleby?.digest,
    ctx.state.vectorMock?.digest,
    ctx.state.pipeline?.lines?.["barrio-lore-onfalo"]?.digest,
    ctx.state.grafista?.graph?.digest,
    digestObject(ctx.state.demiurgo.universes.map((u) => u.digest)),
    digestObject(ctx.state.dramaturgo.cortos.map((c) => c.digest)),
  ].filter(Boolean);
  ctx.state.artifactChainDigest = digestObject(chainLinks);
  ctx.state.trace = {
    verb: "provenance.trace",
    links: chainLinks,
  };

  // Shutdown limpio: runners → stopped; estáticos → stopped; revoke leases
  const residual = [];
  for (const unitId of ctx.provider.listUnitIds()) {
    const pod = ctx.provider.describe(unitId);
    try {
      if (pod.state === "running") ctx.provider.transition(unitId, "paused");
      const st = ctx.provider.describe(unitId).state;
      if (st === "paused" || st === "ready") {
        ctx.provider.transition(unitId, "stopped");
      }
    } catch (e) {
      residual.push(`${unitId}:${String(e.message || e)}`);
    }
  }
  ctx.state.residualProcesses = residual;
  ctx.state.shutdown = true;

  return {
    object: ctx.state.artifactChainDigest,
    target: `urn:scriptorium:hm:${ctx.runId}:coverage`,
    instrument: "portal",
    unitId: "portal",
    context: {
      unitId: "portal",
      trace: ctx.state.trace,
      coverage: "from-events",
      shutdown: true,
      residualProcesses: residual,
    },
    artifactRef: ctx.state.artifactChainDigest,
    secondaryEvents: [
      {
        verb: "provenance.trace",
        object: ctx.state.artifactChainDigest,
        unitId: "portal",
        instrument: "portal",
        context: { unitId: "portal", links: chainLinks },
      },
      {
        verb: "unit.stop",
        object: "urn:scriptorium:hm:units:all",
        unitId: "portal",
        instrument: "portal",
        context: { unitId: "portal", stopped: ctx.provider.listUnitIds() },
      },
      {
        verb: "pod.revoke",
        object: "urn:scriptorium:hm:leases:all",
        unitId: "portal",
        instrument: "portal",
        context: { unitId: "portal", revoked: true },
      },
      {
        verb: "session.exit",
        object: `urn:scriptorium:hm:${ctx.runId}:session`,
        unitId: "portal",
        instrument: "portal",
        context: { unitId: "portal", clean: residual.length === 0 },
      },
    ],
  };
}
