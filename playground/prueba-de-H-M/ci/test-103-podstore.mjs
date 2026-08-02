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
  isValidAclEntry,
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

const TEST_PERMISSIONS = ["unit.start", "unit.inspect", "unit.stop", "pod.policy"];

function inflateBilateral(provider, unitId, acl = null, opts = {}) {
  provider.requestInflate({
    unitId,
    actorIri: provider.maestroIri,
    identity: { actorIri: provider.maestroIri, actorId: "maestro-m" },
  });
  const expires =
    opts.expiresAt ?? new Date(Date.now() + 3600_000).toISOString();
  return provider.issueLease({
    unitId,
    actorIri: provider.hostIri,
    permissions: opts.permissions ?? TEST_PERMISSIONS,
    expiresAt: expires,
    identity: { actorIri: provider.maestroIri, actorId: "maestro-m" },
    acl,
  });
}

/** ACL que concede a maestro-m todo el vocabulario de prueba. */
function fullAcl(actor = "maestro-m") {
  return [{ actor, verbs: [...TEST_PERMISSIONS] }];
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

  const { pod } = inflateBilateral(p, "bartleby", fullAcl());
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

  const A = { actor: "maestro-m" };
  p.transition("bartleby", "ready", A);
  p.transition("bartleby", "running", A);
  p.transition("bartleby", "paused", A);
  p.transition("bartleby", "stopped", A);
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

  p.setAcl("portal", null, { actor: p.hostIri });
  const om2 = p.authorize({ unitId: "portal", actor: "maestro-m", verb: "unit.inspect" });
  if (om2.allowed || om2.reason !== "acl-omitted") fail("setAcl null → omitted");

  p.setAcl("portal", [{ actor: "maestro-m", verbs: ["unit.inspect"] }], {
    actor: p.hostIri,
  });
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
    inflateBilateral(p, id, fullAcl());
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
  inflateBilateral(p, "loreador", fullAcl());
  let bad = "";
  try {
    // inflated→running no está en la tabla (falta pasar por ready)
    p.transition("loreador", "running", { actor: "maestro-m" });
  } catch (e) {
    bad = String(e.message);
  }
  if (!/transición ilegal/.test(bad)) {
    fail(`inflated→running debía ser ilegal por tipestate, got: ${bad}`);
  }
  ok("transición ilegal rechazada");
}

// ── 7. La política gobierna el camino real (ZV ⑤) ──────────────────────────
{
  const FUT = new Date(Date.now() + 3600_000).toISOString();

  // 7.1 — Un lease sin caducidad válida y futura no es un lease.
  // Se llama a issueLease en crudo: cualquier helper con `?? porDefecto`
  // taparía justo los casos «omitido» y «null» que hay que probar.
  const CASOS_EXPIRES = [
    ["1999", { expiresAt: "1999-01-01T00:00:00.000Z" }],
    ["no-fecha", { expiresAt: "no-soy-una-fecha" }],
    ["omitido", {}],
    ["null", { expiresAt: null }],
    ["numero", { expiresAt: 12345 }],
  ];
  for (const [etiqueta, campo] of CASOS_EXPIRES) {
    const p = makeProvider();
    p.declare({ unitId: "portal", type: "agent", condition: "bootstrap" });
    p.requestInflate({
      unitId: "portal",
      actorIri: p.maestroIri,
      identity: { actorIri: p.maestroIri },
    });
    let threw = false;
    try {
      p.issueLease({
        unitId: "portal",
        actorIri: p.hostIri,
        permissions: TEST_PERMISSIONS,
        identity: { actorIri: p.maestroIri },
        acl: fullAcl(),
        ...campo,
      });
    } catch {
      threw = true;
    }
    if (!threw) fail(`lease con expiresAt ${etiqueta} debía rechazarse`);
  }
  ok(`lease sin expiresAt válido y futuro rechazado (${CASOS_EXPIRES.map(([e]) => e).join(" · ")})`);

  // 7.2 — transition() consulta la política: sin ACL no se mueve el pod.
  {
    const p = makeProvider();
    p.declare({ unitId: "portal", type: "agent", condition: "bootstrap" });
    inflateBilateral(p, "portal", []);
    let denied = false;
    try {
      p.transition("portal", "ready", { actor: "maestro-m" });
    } catch (e) {
      denied = /denegada/.test(String(e.message));
    }
    if (!denied) fail("transition con ACL vacía debía denegarse");

    // ni un actor ajeno con ACL de otro
    const p2 = makeProvider();
    p2.declare({ unitId: "portal", type: "agent", condition: "bootstrap" });
    inflateBilateral(p2, "portal", fullAcl());
    let denied2 = false;
    try {
      p2.transition("portal", "ready", { actor: "intruso" });
    } catch (e) {
      denied2 = /denegada/.test(String(e.message));
    }
    if (!denied2) fail("transition de actor sin ACL debía denegarse");

    // y sin actor no se puede ni pedir
    let noActor = false;
    try {
      p2.transition("portal", "ready");
    } catch (e) {
      noActor = /actor requerido/.test(String(e.message));
    }
    if (!noActor) fail("transition sin actor debía exigir actor");
    ok("transition autorizada por la política (ACL vacía · actor ajeno · sin actor)");
  }

  // 7.3 — permissions del lease acotan lo que la ACL puede conceder.
  {
    const p = makeProvider();
    p.declare({ unitId: "portal", type: "agent", condition: "bootstrap" });
    let threw = false;
    try {
      inflateBilateral(p, "portal", [{ actor: "maestro-m", verbs: ["unit.start"] }], {
        permissions: ["unit.inspect"],
      });
    } catch (e) {
      threw = /fuera de permissions/.test(String(e.message));
    }
    if (!threw) fail("ACL que excede permissions debía rechazarse");
    ok("permissions del lease acotan la ACL");
  }

  // 7.4 — setAcl exige autoridad y DEJA EVENTO.
  {
    const p = makeProvider();
    p.declare({ unitId: "portal", type: "agent", condition: "bootstrap" });
    inflateBilateral(p, "portal", fullAcl());

    let noActor = false;
    try {
      p.setAcl("portal", [{ actor: "x", verbs: ["unit.start"] }]);
    } catch (e) {
      noActor = /actor requerido/.test(String(e.message));
    }
    if (!noActor) fail("setAcl sin actor debía exigir actor");

    let noAuth = false;
    try {
      p.setAcl("portal", [{ actor: "x", verbs: ["unit.start"] }], {
        actor: "intruso",
      });
    } catch (e) {
      noAuth = /sin autoridad/.test(String(e.message));
    }
    if (!noAuth) fail("setAcl de actor sin autoridad debía denegarse");

    const evPath = path.join(p._paths.get("portal"), "events.ndjson");
    const readEvents = () =>
      fs
        .readFileSync(evPath, "utf8")
        .split("\n")
        .filter(Boolean)
        .map((l) => JSON.parse(l));

    if (readEvents().filter((e) => e.type === "acl.set.denied").length !== 1) {
      fail("el intento denegado de setAcl debía dejar evento acl.set.denied");
    }

    const before = readEvents().length;
    p.setAcl("portal", [{ actor: "maestro-m", verbs: ["unit.inspect"] }], {
      actor: p.hostIri,
      reason: "rotacion",
    });
    const after = readEvents();
    const sets = after.filter((e) => e.type === "acl.set");
    if (after.length <= before) fail("setAcl legítimo no dejó evento");
    if (sets.length !== 1) fail(`esperado 1 acl.set, got ${sets.length}`);
    if (!sets[0].previousDigest || !sets[0].nextDigest) {
      fail("acl.set sin huella previa/siguiente");
    }
    if (sets[0].previousDigest === sets[0].nextDigest) {
      fail("acl.set con huellas idénticas pese al cambio");
    }
    ok("setAcl exige autoridad, acota por permissions y deja evento (concedido y denegado)");
  }

  // 7.5 — el comodín no concede.
  {
    if (isValidAclEntry({ actor: "x", verbs: ["*"] })) {
      fail("verbs:['*'] debía ser entrada ACL inválida");
    }
    const d = evaluatePodAcl({
      acl: [{ actor: "x", verbs: ["*"] }],
      actor: "x",
      verb: "verbo.jamas.declarado",
    });
    if (d.allowed || d.reason !== "acl-invalid") {
      fail(`comodín debía dar acl-invalid: ${JSON.stringify(d)}`);
    }
    ok("verbs:['*'] no concede: entrada inválida");
  }

  // 7.6 — un lease caducado deniega aunque la ACL siga diciendo que sí.
  {
    const p = makeProvider();
    p.declare({ unitId: "portal", type: "agent", condition: "bootstrap" });
    // ACL SIN expiresAt: solo puede pararlo la caducidad del lease.
    inflateBilateral(p, "portal", [
      { actor: "maestro-m", verbs: ["unit.start"] },
    ], { expiresAt: FUT });

    const vivo = p.authorize({
      unitId: "portal",
      actor: "maestro-m",
      verb: "unit.start",
    });
    if (!vivo.allowed) fail(`con lease vivo debía conceder: ${vivo.reason}`);

    const caduco = p.authorize({
      unitId: "portal",
      actor: "maestro-m",
      verb: "unit.start",
      now: new Date(Date.parse(FUT) + 60_000),
    });
    if (caduco.allowed || caduco.reason !== "lease-expired") {
      fail(`lease caducado debía denegar: ${JSON.stringify(caduco)}`);
    }
    ok("lease caducado deniega aunque la ACL no tenga expiresAt");
  }

  // 7.7 — identidad de M: se retira la autoafirmación `trusted:true`.
  {
    const p = makeProvider();
    p.declare({ unitId: "portal", type: "agent", condition: "bootstrap" });
    p.requestInflate({
      unitId: "portal",
      actorIri: p.maestroIri,
      identity: { role: "M", trusted: true },
    });
    let threw = false;
    try {
      p.issueLease({
        unitId: "portal",
        actorIri: p.hostIri,
        permissions: TEST_PERMISSIONS,
        expiresAt: FUT,
        identity: { role: "M", trusted: true },
        acl: fullAcl(),
      });
    } catch (e) {
      threw = /identidad M inválida/.test(String(e.message));
    }
    if (!threw) fail("identidad autoafirmada {role:'M',trusted:true} debía rechazarse");

    // Un actorIri que NO es el de M tampoco cuela.
    const p2 = makeProvider();
    p2.declare({ unitId: "portal", type: "agent", condition: "bootstrap" });
    p2.requestInflate({
      unitId: "portal",
      actorIri: p2.maestroIri,
      identity: { actorIri: "urn:quien:sea" },
    });
    let threw2 = false;
    try {
      p2.issueLease({
        unitId: "portal",
        actorIri: p2.hostIri,
        permissions: TEST_PERMISSIONS,
        expiresAt: FUT,
        identity: { actorIri: "urn:quien:sea" },
        acl: fullAcl(),
      });
    } catch {
      threw2 = true;
    }
    if (!threw2) fail("identidad con actorIri ajeno debía rechazarse");
    ok("identidad de M contrastada contra maestroIri (sin rama trusted:true)");
  }
}

if (failed > 0) {
  console.error(`test-103-podstore: FAIL (${failed} fallos)`);
  process.exit(1);
}
console.log("test-103-podstore: PASS");
process.exit(0);
