#!/usr/bin/env node
/**
 * WP-HUB-103 · CA LocalPodProvider / tipestate / ACL / inflación bilateral.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  LocalPodProvider,
  PROVIDER_META,
  STATIC_UNIT_IDS,
  POD_STATES,
  TRANSITION_TABLE,
  assertTipestateExhaustive,
  transitionAllowed,
  evaluatePodAcl,
  podIri,
  universeRunnerUnitId,
} from "../lib/podstore/index.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const kitRoot = path.resolve(here, "..");
let failed = 0;

function fail(msg) {
  console.error(`test-103-podstore: FAIL — ${msg}`);
  failed += 1;
}

function ok(msg) {
  console.log(`test-103-podstore: ${msg}`);
}

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "hm-podstore-103-"));
}

function makeProvider(runId = "run-103") {
  return new LocalPodProvider({
    runId,
    storeRoot: tmpRoot(),
  });
}

function inflateBilateral(provider, unitId, acl = null) {
  provider.requestInflate({
    unitId,
    actorIri: provider.maestroIri,
    identity: { actorId: "maestro-m", role: "M", trusted: true },
  });
  const expires = new Date(Date.now() + 3600_000).toISOString();
  return provider.issueLease({
    unitId,
    actorIri: provider.hostIri,
    permissions: ["unit.start", "unit.inspect"],
    expiresAt: expires,
    identity: { actorId: "maestro-m", role: "M", trusted: true },
    acl,
  });
}

// ── 1. Marca simulación (nunca Solid) ──────────────────────────────────────
{
  const p = makeProvider();
  const meta = p.meta;
  if (meta.simulation !== true) fail("meta.simulation debe ser true");
  if (meta.isSolidPod !== false) fail("meta.isSolidPod debe ser false");
  if (meta.solidCompatible !== false) fail("meta.solidCompatible debe ser false");
  if (meta.solidPod !== false) fail("meta.solidPod debe ser false");
  if (PROVIDER_META.isSolidPod !== false) fail("PROVIDER_META.isSolidPod");
  const pub = JSON.stringify(p.publicManifest());
  if (/solid\s*pod\s*real/i.test(pub) && !/nunca|no es|simul/i.test(pub)) {
    fail("manifest público no debe presentarse como Solid real");
  }
  if (pub.includes("isSolidPod\":true")) fail("isSolidPod true en publicManifest");
  ok("marca simulación (nunca Solid real)");
}

// ── 2. Tipestate exhaustivo ────────────────────────────────────────────────
{
  try {
    assertTipestateExhaustive();
    ok("assertTipestateExhaustive");
  } catch (e) {
    fail(String(e.message || e));
  }
  const schemaPath = path.join(kitRoot, "schemas/pod.schema.json");
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const enumStates = schema.properties.state.enum;
  if (enumStates.length !== POD_STATES.length) {
    fail(`schema enum (${enumStates.length}) ≠ POD_STATES (${POD_STATES.length})`);
  }
  for (const s of enumStates) {
    if (!POD_STATES.includes(s)) fail(`schema state ${s} no en POD_STATES`);
    if (!(s in TRANSITION_TABLE)) fail(`falta TRANSITION_TABLE[${s}]`);
  }
  // Añadir estado sin caso rompe: simulamos comprobando que unknown → assertNever
  let threw = false;
  try {
    transitionAllowed("not-a-real-state", "leased");
  } catch {
    threw = true;
  }
  if (!threw) fail("estado desconocido debería romper (assertNever)");
  ok("tipestate exhaustivo + schema alineado");
}

// ── 3. Inflación bilateral + contenido mínimo + IRI ────────────────────────
{
  const p = makeProvider("run-abc");
  p.declare({ unitId: "bartleby", type: "agent", condition: "bootstrap" });
  const iri = podIri("run-abc", "bartleby");
  if (p.describe("bartleby").podIri !== iri) fail("IRI lógica incorrecta");
  if (p.describe("bartleby").state !== "declared") fail("estado inicial declared");

  // Sin lease no hay path materializado en public API
  const before = p.publicManifest();
  if (JSON.stringify(before).includes(p._storeRoot.replaceAll("\\", "/"))) {
    fail("publicManifest filtró storeRoot");
  }
  if (JSON.stringify(p.describe("bartleby")).match(/[A-Za-z]:\\/)) {
    fail("describe publicó ruta Windows");
  }

  // Inflate sin lease no materializa
  p.requestInflate({
    unitId: "bartleby",
    actorIri: p.maestroIri,
    identity: { actorId: "maestro-m" },
  });
  if (p._paths.has("bartleby")) fail("no debe materializar antes de lease");

  // Lease sin inflate pendiente falla
  const p2 = makeProvider("run-x");
  p2.declare({ unitId: "bartleby", type: "agent", condition: "bootstrap" });
  let leaseWithoutInflate = false;
  try {
    p2.issueLease({
      unitId: "bartleby",
      actorIri: p2.hostIri,
      permissions: ["unit.start"],
      expiresAt: new Date(Date.now() + 1000).toISOString(),
      identity: { actorId: "maestro-m" },
    });
  } catch {
    leaseWithoutInflate = true;
  }
  if (!leaseWithoutInflate) fail("lease sin inflate debía fallar");

  const { pod } = inflateBilateral(p, "bartleby", [
    { actor: "maestro-m", verbs: ["unit.start"] },
  ]);
  if (pod.state !== "inflated") fail(`post-lease state=${pod.state}, esperado inflated`);

  const abs = p._paths.get("bartleby");
  const required = [
    "descriptor.jsonld",
    "state.json",
    "events.ndjson",
    "artifacts/manifest.json",
    "inbox",
    "outbox",
  ];
  for (const rel of required) {
    if (!fs.existsSync(path.join(abs, rel))) fail(`falta contenido pod: ${rel}`);
  }
  const desc = JSON.parse(fs.readFileSync(path.join(abs, "descriptor.jsonld"), "utf8"));
  if (desc.provider?.isSolidPod !== false) fail("descriptor.jsonld sin marca no-Solid");

  p.transition("bartleby", "ready");
  p.transition("bartleby", "running");
  p.transition("bartleby", "paused");
  p.transition("bartleby", "stopped");
  ok("inflación bilateral + tipestate + contenido mínimo + IRI");
}

// ── 4. ACL: positiva / omitida / inválida / expirada + no admin override ───
{
  const now = Date.parse("2026-08-02T12:00:00.000Z");

  // positiva
  let d = evaluatePodAcl({
    acl: [{ actor: "maestro-m", verbs: ["unit.start"] }],
    actor: "maestro-m",
    verb: "unit.start",
    now,
  });
  if (!d.allowed || d.reason !== "acl-positive") fail(`ACL positiva: ${JSON.stringify(d)}`);

  // omitida
  d = evaluatePodAcl({ acl: null, actor: "maestro-m", verb: "unit.start", now });
  if (d.allowed || d.reason !== "acl-omitted") fail(`ACL omitida: ${JSON.stringify(d)}`);
  d = evaluatePodAcl({ acl: [], actor: "maestro-m", verb: "unit.start", now });
  if (d.allowed || d.reason !== "acl-omitted") fail(`ACL []: ${JSON.stringify(d)}`);

  // inválida
  d = evaluatePodAcl({
    acl: [{ actor: "x", verbs: [] }, { bogus: true }],
    actor: "x",
    verb: "unit.start",
    now,
  });
  if (d.allowed || d.reason !== "acl-invalid") fail(`ACL inválida: ${JSON.stringify(d)}`);

  // expirada
  d = evaluatePodAcl({
    acl: [
      {
        actor: "maestro-m",
        verbs: ["unit.start"],
        expiresAt: "2026-08-01T00:00:00.000Z",
      },
    ],
    actor: "maestro-m",
    verb: "unit.start",
    now,
  });
  if (d.allowed || d.reason !== "acl-expired") fail(`ACL expirada: ${JSON.stringify(d)}`);

  // via provider + intento admin override
  const p = makeProvider();
  p.declare({ unitId: "portal", type: "agent", condition: "bootstrap" });
  inflateBilateral(p, "portal", [
    { actor: "maestro-m", verbs: ["unit.inspect"] },
  ]);

  const pos = p.authorize({ unitId: "portal", actor: "maestro-m", verb: "unit.inspect" });
  if (!pos.allowed) fail("provider ACL positiva");

  const omit = p.authorize({ unitId: "portal", actor: "otro", verb: "unit.inspect" });
  if (omit.allowed) fail("actor sin ACL debía denegar");

  p.setAcl("portal", null);
  const om2 = p.authorize({ unitId: "portal", actor: "maestro-m", verb: "unit.inspect" });
  if (om2.allowed || om2.reason !== "acl-omitted") fail("setAcl null → omitted");

  p.setAcl("portal", [{ actor: "maestro-m", verbs: ["unit.inspect"] }]);
  const adm = p.authorize({
    unitId: "portal",
    actor: "admin",
    verb: "unit.inspect",
    adminOverride: true,
  });
  if (adm.allowed || adm.reason !== "admin-override-rejected") {
    fail(`admin override debía rechazarse: ${JSON.stringify(adm)}`);
  }
  // admin con override tampoco gana aunque ACL positiva de otro
  const adm2 = p.authorize({
    unitId: "portal",
    actor: "maestro-m",
    verb: "unit.inspect",
    adminOverride: true,
  });
  if (adm2.allowed) fail("adminOverride=true nunca concede (incluso con ACL del actor)");

  ok("ACL positiva/omitida/inválida/expirada + no admin override");
}

// ── 5. Diez pods estáticos + runners dinámicos ─────────────────────────────
{
  const p = makeProvider("run-catalog");
  p.declareStaticCatalog();
  const runners = ["u-alfa", "u-beta"];
  for (const id of runners) p.declareUniverseRunner(id);

  const ids = p.listUnitIds();
  if (STATIC_UNIT_IDS.length !== 10) fail("STATIC_UNIT_IDS debe ser 10");
  for (const id of STATIC_UNIT_IDS) {
    if (!ids.includes(id)) fail(`falta pod estático ${id}`);
  }
  for (const id of runners) {
    const uid = universeRunnerUnitId(id);
    if (!ids.includes(uid)) fail(`falta runner ${uid}`);
    if (p.describe(uid).kind !== "dynamic-runner") fail(`kind runner ${uid}`);
  }

  for (const id of [...STATIC_UNIT_IDS, ...runners.map(universeRunnerUnitId)]) {
    inflateBilateral(p, id, [{ actor: "maestro-m", verbs: ["*"] }]);
    if (p.describe(id).state !== "inflated") fail(`${id} no inflated`);
    const pub = p.describe(id);
    if (JSON.stringify(pub).includes(p._storeRoot)) {
      fail(`${id}: describe filtró storeRoot`);
    }
  }

  if (p.listPods().length !== 10 + runners.length) {
    fail(`esperados ${10 + runners.length} pods, got ${p.listPods().length}`);
  }
  ok(`10 estáticos + ${runners.length} universe-runner dinámicos`);
}

// ── 6. Transición ilegal rompe ─────────────────────────────────────────────
{
  const p = makeProvider();
  p.declare({ unitId: "loreador", type: "agent", condition: "bootstrap" });
  let bad = false;
  try {
    p.transition("loreador", "running");
  } catch {
    bad = true;
  }
  if (!bad) fail("declared→running debía ser ilegal");
  ok("transición ilegal rechazada");
}

if (failed > 0) {
  console.error(`test-103-podstore: FAIL (${failed} fallos)`);
  process.exit(1);
}
console.log("test-103-podstore: PASS");
process.exit(0);
