/**
 * LocalPodProvider — files-first playground (WP-HUB-103).
 *
 * IRI lógica: urn:scriptorium:hm:<run-id>:pod:<unit-id>
 * Ubicación física: resuelta por manifest interno; NUNCA publicada como ruta.
 * Inflación bilateral: M emite unit.inflate → H valida + pod.lease → materialize.
 *
 * Frontera Solid: simulation=true; isSolidPod=false siempre.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  POD_STATES,
  PROVIDER_META,
  STATIC_UNIT_IDS,
  TRANSITION_VERB,
  POLICY_VERB,
  podIri,
  universeRunnerUnitId,
} from "./constants.mjs";
import { assertTransition, assertTipestateExhaustive } from "./tipestate.mjs";
import { evaluatePodAcl } from "./acl.mjs";

assertTipestateExhaustive();

/**
 * @typedef {{
 *   unitId: string,
 *   type: "agent"|"machine",
 *   condition: "bootstrap"|"deployed"|"dynamic",
 *   kind?: "static"|"dynamic-runner",
 * }} UnitSpec
 */

export class LocalPodProvider {
  /**
   * @param {object} opts
   * @param {string} opts.runId
   * @param {string} opts.storeRoot — raíz privada de archivos (no se publica)
   * @param {string} [opts.hostIri]
   * @param {string} [opts.maestroIri]
   * @param {() => number} [opts.clock] — fuente de tiempo INYECTADA (ms epoch).
   *   Por defecto `Date.now`. No congela nada en producción: quien quiera una
   *   corrida reproducible inyecta su reloj y se hace responsable de él.
   * @param {(unitId: string) => string} [opts.leaseIdFactory] — fuente de
   *   identidad de lease INYECTADA. Por defecto aleatoria (4 bytes). Es el
   *   único origen de no-determinismo del pack de evidencia.
   */
  constructor(opts) {
    if (!opts?.runId || typeof opts.runId !== "string") {
      throw new Error("LocalPodProvider: runId requerido");
    }
    if (!opts?.storeRoot || typeof opts.storeRoot !== "string") {
      throw new Error("LocalPodProvider: storeRoot requerido");
    }
    if (opts.runId.includes(":")) {
      throw new Error("LocalPodProvider: runId no puede contener ':'");
    }

    this.runId = opts.runId;
    this.hostIri = opts.hostIri ?? "urn:scriptorium:hm:actor:anfitrion-h";
    this.maestroIri = opts.maestroIri ?? "urn:scriptorium:hm:actor:maestro-m";

    /** @private @type {() => number} */
    this._clock = typeof opts.clock === "function" ? opts.clock : Date.now;
    /** @private @type {(unitId: string) => string} */
    this._leaseIdFactory =
      typeof opts.leaseIdFactory === "function"
        ? opts.leaseIdFactory
        : (unitId) => `lease-${unitId}-${crypto.randomBytes(4).toString("hex")}`;

    /** @private */
    this._storeRoot = path.resolve(opts.storeRoot);
    /** @private @type {Map<string, object>} */
    this._pods = new Map();
    /** @private @type {Map<string, string>} unitId → abs path (privado) */
    this._paths = new Map();
    /** @private @type {Map<string, object>} */
    this._pendingInflate = new Map();
    /** @private @type {Map<string, object>} */
    this._leases = new Map();
    /** @private @type {Array<{ unitId: string, from: string, to: string }>} */
    this._tipestateLog = [];

    fs.mkdirSync(this._storeRoot, { recursive: true });
    this._writeManifest();
  }

  /** Metadatos públicos — nunca Solid real. */
  get meta() {
    return { ...PROVIDER_META };
  }

  /**
   * Vista pública del manifest: IRIs, sin rutas de máquina.
   */
  publicManifest() {
    const entries = {};
    for (const [unitId, pod] of this._pods) {
      entries[unitId] = {
        podIri: pod.podIri,
        unitId: pod.unitId,
        state: pod.state,
        kind: pod.kind,
      };
    }
    return {
      provider: { ...PROVIDER_META },
      runId: this.runId,
      entries,
      // Intencionalmente ausente: storeRoot / fsPath / machine paths
    };
  }

  /**
   * Serializa un pod para API pública (sin rutas absolutas de máquina).
   * @param {string} unitId
   */
  describe(unitId) {
    const pod = this._require(unitId);
    return {
      podIri: pod.podIri,
      unitId: pod.unitId,
      runId: pod.runId,
      state: pod.state,
      kind: pod.kind,
      descriptor: { ...pod.descriptor },
      leaseRef: pod.leaseRef ?? null,
      acl: pod.acl ? pod.acl.map((e) => ({ ...e, verbs: [...e.verbs] })) : null,
      artifacts: {
        manifest: "artifacts/manifest.json",
        inbox: "inbox/",
        outbox: "outbox/",
      },
      eventsPath: "events.ndjson",
      provider: { ...PROVIDER_META },
    };
  }

  /**
   * Declara unidad (estado declared). NO materializa archivos aún.
   * @param {UnitSpec} spec
   */
  declare(spec) {
    const unitId = spec.unitId;
    this._assertUnitId(unitId);
    if (this._pods.has(unitId)) {
      throw new Error(`pod ya declarado: ${unitId}`);
    }
    const pod = {
      podIri: podIri(this.runId, unitId),
      unitId,
      runId: this.runId,
      state: "declared",
      kind: spec.kind ?? (spec.condition === "dynamic" ? "dynamic-runner" : "static"),
      descriptor: {
        type: spec.type,
        condition: spec.condition,
      },
      leaseRef: null,
      acl: null,
      materialized: false,
    };
    this._pods.set(unitId, pod);
    this._writeManifest();
    return this.describe(unitId);
  }

  /**
   * Declara las 10 unidades estáticas del catálogo barrio-lore.
   * @param {Iterable<UnitSpec>} [catalog]
   */
  declareStaticCatalog(catalog) {
    const list = catalog
      ? [...catalog]
      : STATIC_UNIT_IDS.map((unitId) => ({
          unitId,
          type: unitId === "vector-mock" || unitId === "pipeline" ? "machine" : "agent",
          condition: "bootstrap",
          kind: "static",
        }));
    return list.map((s) => this.declare(s));
  }

  /**
   * Declara runner dinámico universe-runner-<id>.
   * @param {string} universeId
   */
  declareUniverseRunner(universeId) {
    const unitId = universeRunnerUnitId(universeId);
    return this.declare({
      unitId,
      type: "machine",
      condition: "dynamic",
      kind: "dynamic-runner",
    });
  }

  /**
   * M emite unit.inflate — registra pedido; no materializa.
   * @param {object} req
   * @param {string} req.unitId
   * @param {string} req.actorIri — debe ser M
   * @param {object} [req.identity]
   */
  requestInflate(req) {
    const { unitId, actorIri, identity = {} } = req;
    const pod = this._require(unitId);
    if (pod.state !== "declared") {
      throw new Error(`unit.inflate solo desde declared (actual=${pod.state})`);
    }
    if (actorIri !== this.maestroIri) {
      throw new Error("unit.inflate: solo M (maestro) puede emitir");
    }
    const ticket = {
      verb: "unit.inflate",
      unitId,
      actorIri,
      identity,
      requestedAt: this._nowIso(req.now),
    };
    this._pendingInflate.set(unitId, ticket);
    this._appendEvent(unitId, { type: "unit.inflate", ...ticket }, false);
    return { ok: true, ticket };
  }

  /**
   * H valida identidad y emite pod.lease → materializa → inflated.
   * @param {object} req
   * @param {string} req.unitId
   * @param {string} req.actorIri — debe ser H
   * @param {string[]} req.permissions
   * @param {string} req.expiresAt
   * @param {object} [req.identity] — identidad de M a validar
   * @param {import("./acl.mjs").AclEntry[]} [req.acl] — capacidades transportadas al pod
   */
  issueLease(req) {
    const { unitId, actorIri, permissions, expiresAt, identity = {}, acl = null } = req;
    const pod = this._require(unitId);
    if (actorIri !== this.hostIri) {
      throw new Error("pod.lease: solo H (anfitrión) puede emitir");
    }
    if (!this._pendingInflate.has(unitId)) {
      throw new Error("pod.lease: falta unit.inflate pendiente de M");
    }
    if (pod.state !== "declared") {
      throw new Error(`pod.lease solo desde declared (actual=${pod.state})`);
    }
    if (!this._validateMaestroIdentity(identity)) {
      throw new Error("pod.lease: identidad M inválida");
    }
    if (!Array.isArray(permissions) || permissions.length === 0) {
      throw new Error("pod.lease: permissions requeridas");
    }

    // Un lease sin caducidad válida y futura no es un lease.
    // Antes se aceptaba expiresAt en 1999, "no-soy-una-fecha" y omitido.
    const nowMs = this._nowMs(req.now);
    if (typeof expiresAt !== "string" || expiresAt.length === 0) {
      throw new Error("pod.lease: expiresAt requerido (ISO-8601)");
    }
    const expMs = Date.parse(expiresAt);
    if (Number.isNaN(expMs)) {
      throw new Error(`pod.lease: expiresAt no es fecha ISO: ${expiresAt}`);
    }
    if (expMs <= nowMs) {
      throw new Error(`pod.lease: expiresAt ya caducado: ${expiresAt}`);
    }

    // La ACL transportada no puede conceder verbos fuera de las permissions
    // del lease: si el lease no transporta la capacidad, el pod no puede darla.
    for (const entry of acl ?? []) {
      for (const v of entry?.verbs ?? []) {
        if (!permissions.includes(v)) {
          throw new Error(
            `pod.lease: la ACL concede '${v}' fuera de permissions [${permissions.join(", ")}]`,
          );
        }
      }
    }

    const issuedAt = new Date(nowMs).toISOString();
    const leaseId = this._leaseIdFactory(unitId);
    const lease = {
      leaseId,
      emitterIri: this.hostIri,
      receiverIri: this.maestroIri,
      unitId,
      permissions: [...permissions],
      issuedAt,
      expiresAt,
      signature: {
        algorithm: "hm-sim-hmac-sha256",
        value: crypto
          .createHmac("sha256", "hm-playground-sim")
          .update(`${leaseId}|${unitId}|${issuedAt}|${expiresAt}`)
          .digest("hex"),
      },
    };

    // declared → leased
    assertTransition(pod.state, "leased");
    this._tipestateLog.push({ unitId, from: pod.state, to: "leased" });
    pod.state = "leased";
    pod.leaseRef = lease.leaseId;
    pod.acl = acl;
    this._leases.set(leaseId, lease);
    this._pendingInflate.delete(unitId);
    this._writeManifest();

    // materialize only after lease
    this._materialize(unitId);
    assertTransition(pod.state, "inflated");
    this._tipestateLog.push({ unitId, from: pod.state, to: "inflated" });
    pod.state = "inflated";
    this._writePodFiles(unitId);
    this._appendEvent(unitId, { type: "pod.lease", leaseId, permissions }, true);
    this._writeManifest();

    return { lease, pod: this.describe(unitId) };
  }

  /**
   * Avanza tipestate (post-inflated). AUTORIZADO por la política del pod.
   *
   * Antes movía el pod sin consultar nada: `authorize()` no se invocaba en
   * ningún punto del camino de ejecución, solo desde el test. La ceremonia
   * transicionaba seis veces sin autorizar.
   *
   * @param {string} unitId
   * @param {string} to
   * @param {{ actor: string, now?: Date|string|number }} opts
   */
  transition(unitId, to, opts) {
    const pod = this._require(unitId);
    const actor = opts?.actor;
    if (typeof actor !== "string" || actor.length === 0) {
      throw new Error(
        `transition ${unitId}→${to}: actor requerido (la política decide, no el llamador)`,
      );
    }
    const verb = TRANSITION_VERB[to];
    if (!verb) {
      throw new Error(`transition: sin verbo declarado para el estado '${to}'`);
    }
    const decision = this.authorize({ unitId, actor, verb, now: opts?.now });
    if (!decision.allowed) {
      throw new Error(
        `transition ${unitId}: ${pod.state}→${to} denegada para ${actor} (${verb}): ${decision.reason}`,
      );
    }

    assertTransition(pod.state, to);
    const from = pod.state;
    this._tipestateLog.push({ unitId, from, to });
    pod.state = to;
    if (pod.materialized) {
      this._writePodFiles(unitId);
      this._appendEvent(unitId, { type: "state.transition", from, to }, true);
    }
    this._writeManifest();
    return this.describe(unitId);
  }

  /**
   * Snapshot exportable a evidence/ (sin rutas de host) — WP-HUB-107.
   * @returns {{
   *   tipestate: Array<{ unitId: string, from: string, to: string }>,
   *   acls: Array<{ unitId: string, podIri: string, acl: object[]|null, finalState: string }>,
   * }}
   */
  exportEvidenceSnapshot() {
    return {
      tipestate: this._tipestateLog.map((t) => ({ ...t })),
      acls: this.listUnitIds().map((unitId) => {
        const pod = this._require(unitId);
        return {
          unitId,
          podIri: pod.podIri,
          acl: pod.acl
            ? pod.acl.map((e) => ({ ...e, verbs: [...e.verbs] }))
            : null,
          finalState: pod.state,
        };
      }),
    };
  }

  /**
   * El POD decide la política (no H). adminOverride nunca concede.
   * @param {object} opts
   * @param {string} opts.unitId
   * @param {string} opts.actor
   * @param {string} opts.verb
   * @param {Date|string|number} [opts.now]
   * @param {boolean} [opts.adminOverride]
   */
  authorize(opts) {
    const pod = this._require(opts.unitId);
    const nowMs = this._nowMs(opts.now);

    let decision = evaluatePodAcl({
      acl: pod.acl,
      actor: opts.actor,
      verb: opts.verb,
      now: nowMs,
      adminOverride: opts.adminOverride,
    });

    // Un lease caducado deniega aunque la ACL siga diciendo que sí.
    // Antes la caducidad del lease no la miraba nadie: solo la de la fila ACL.
    if (decision.allowed) {
      const lease = pod.leaseRef ? this._leases.get(pod.leaseRef) : null;
      if (!lease) {
        decision = { allowed: false, reason: "lease-ausente" };
      } else if (Date.parse(lease.expiresAt) <= nowMs) {
        decision = { allowed: false, reason: "lease-expired" };
      } else if (!lease.permissions.includes(opts.verb)) {
        // Las permissions del lease acotan lo que el pod puede conceder.
        decision = { allowed: false, reason: "verbo-fuera-de-permissions" };
      }
    }

    if (pod.materialized) {
      this._appendEvent(
        opts.unitId,
        {
          type: "acl.decision",
          actor: opts.actor,
          verb: opts.verb,
          adminOverride: !!opts.adminOverride,
          ...decision,
        },
        true,
      );
    }
    return decision;
  }

  /**
   * Instala/reemplaza ACL en el pod (capacidades que H transportó; el pod guarda).
   *
   * Exige autoridad y DEJA EVENTO. Antes bastaba `setAcl(unitId, acl)`: sin
   * actor, sin lease, sin firma y sin rastro — cualquiera reescribía la
   * política del pod y no quedaba constancia de que hubiera pasado.
   *
   * Autoridad: el emisor del lease (H), o un actor con `pod.policy` en la ACL
   * vigente. El lease debe estar vivo.
   *
   * @param {string} unitId
   * @param {import("./acl.mjs").AclEntry[]|null} acl
   * @param {{ actor: string, now?: Date|string|number, reason?: string }} opts
   */
  setAcl(unitId, acl, opts) {
    const pod = this._require(unitId);
    const actor = opts?.actor;
    if (typeof actor !== "string" || actor.length === 0) {
      throw new Error(`setAcl ${unitId}: actor requerido`);
    }
    const nowMs = this._nowMs(opts?.now);

    const lease = pod.leaseRef ? this._leases.get(pod.leaseRef) : null;
    if (!lease) {
      throw new Error(`setAcl ${unitId}: sin lease vigente`);
    }
    if (Date.parse(lease.expiresAt) <= nowMs) {
      throw new Error(`setAcl ${unitId}: lease caducado (${lease.expiresAt})`);
    }

    const isEmitter = actor === lease.emitterIri;
    const byPolicy = evaluatePodAcl({
      acl: pod.acl,
      actor,
      verb: POLICY_VERB,
      now: nowMs,
    });
    if (!isEmitter && !byPolicy.allowed) {
      this._appendEvent(
        unitId,
        {
          type: "acl.set.denied",
          actor,
          reason: byPolicy.reason,
          leaseRef: lease.leaseId,
        },
        true,
      );
      throw new Error(
        `setAcl ${unitId}: ${actor} sin autoridad (${byPolicy.reason})`,
      );
    }

    // La nueva política tampoco puede exceder las permissions del lease.
    for (const entry of acl ?? []) {
      for (const v of entry?.verbs ?? []) {
        if (!lease.permissions.includes(v) && v !== POLICY_VERB) {
          throw new Error(
            `setAcl ${unitId}: '${v}' fuera de permissions del lease`,
          );
        }
      }
    }

    const previous = pod.acl;
    pod.acl = acl;
    if (pod.materialized) this._writePodFiles(unitId);
    this._appendEvent(
      unitId,
      {
        type: "acl.set",
        actor,
        via: isEmitter ? "lease-emitter" : POLICY_VERB,
        leaseRef: lease.leaseId,
        reason: opts?.reason ?? null,
        previousDigest: aclDigest(previous),
        nextDigest: aclDigest(acl),
      },
      true,
    );
    this._writeManifest();
  }

  listUnitIds() {
    return [...this._pods.keys()];
  }

  listPods() {
    return this.listUnitIds().map((id) => this.describe(id));
  }

  getLease(leaseId) {
    return this._leases.get(leaseId) ?? null;
  }

  /**
   * Append a ceremony/activity event to a materialized pod (WP-HUB-106).
   * @param {string} unitId
   * @param {object} event
   */
  recordEvent(unitId, event) {
    const pod = this._require(unitId);
    if (!pod.materialized) {
      throw new Error(`recordEvent: pod no materializado: ${unitId}`);
    }
    this._appendEvent(unitId, event, true);
  }

  /**
   * Wipe all materialized pod files for this provider (cero estado parcial).
   */
  wipe() {
    this._pods.clear();
    this._paths.clear();
    this._pendingInflate.clear();
    this._leases.clear();
    if (fs.existsSync(this._storeRoot)) {
      fs.rmSync(this._storeRoot, { recursive: true, force: true });
    }
  }

  /**
   * @private
   * Identidad de M contra la identidad conocida del proveedor.
   *
   * Se retira la rama `{ role:'M', trusted:true }`: era autoafirmación pura
   * —cualquiera que se declarase de confianza lo era—. Queda el contraste
   * contra `maestroIri`.
   *
   * FRONTERA DECLARADA: en este simulacro no hay autoridad de credenciales.
   * Quien llama sigue aportando la identidad, y el único gate real es que
   * `issueLease` solo lo puede invocar H. Cerrar esto de verdad exige una
   * peercard firmada y verificable, que no existe en el playground: es
   * contrato pendiente, no código que se pueda escribir aquí.
   */
  _validateMaestroIdentity(identity) {
    if (!identity || typeof identity !== "object") return false;
    const id = /** @type {Record<string, unknown>} */ (identity);
    if (id.actorIri != null) return id.actorIri === this.maestroIri;
    return id.actorId === "maestro-m";
  }

  /** @private */
  _assertUnitId(unitId) {
    if (!/^[a-z][a-z0-9-]*$/.test(unitId)) {
      throw new Error(`unitId inválido: ${unitId}`);
    }
  }

  /**
   * @private
   * Instante actual en ms. Un `now` explícito del llamador manda sobre el
   * reloj inyectado; el reloj inyectado manda sobre `Date.now`.
   * @param {Date|string|number} [explicit]
   */
  _nowMs(explicit) {
    if (explicit != null) return new Date(explicit).getTime();
    return this._clock();
  }

  /** @private @param {Date|string|number} [explicit] */
  _nowIso(explicit) {
    return new Date(this._nowMs(explicit)).toISOString();
  }

  /** @private */
  _require(unitId) {
    const pod = this._pods.get(unitId);
    if (!pod) throw new Error(`pod desconocido: ${unitId}`);
    return pod;
  }

  /**
   * Materializa árbol mínimo del pod. Path queda solo en mapa privado.
   * @private
   */
  _materialize(unitId) {
    const pod = this._require(unitId);
    if (pod.materialized) return;
    const abs = path.join(this._storeRoot, "pods", unitId);
    fs.mkdirSync(path.join(abs, "artifacts"), { recursive: true });
    fs.mkdirSync(path.join(abs, "inbox"), { recursive: true });
    fs.mkdirSync(path.join(abs, "outbox"), { recursive: true });
    this._paths.set(unitId, abs);
    pod.materialized = true;
    this._writePodFiles(unitId);
  }

  /** @private */
  _writePodFiles(unitId) {
    const pod = this._require(unitId);
    const abs = this._paths.get(unitId);
    if (!abs) return;

    const descriptor = {
      "@context": "https://www.w3.org/ns/solid/terms#",
      "@id": pod.podIri,
      "@type": "HmLocalPodSimulation",
      unitId: pod.unitId,
      runId: pod.runId,
      provider: { ...PROVIDER_META },
      descriptor: pod.descriptor,
      note: "Simulacro files-first; no es Pod Solid real.",
    };
    fs.writeFileSync(
      path.join(abs, "descriptor.jsonld"),
      JSON.stringify(descriptor, null, 2),
    );

    const state = {
      podIri: pod.podIri,
      unitId: pod.unitId,
      runId: pod.runId,
      state: pod.state,
      leaseRef: pod.leaseRef,
      acl: pod.acl,
      updatedAt: this._nowIso(),
    };
    fs.writeFileSync(path.join(abs, "state.json"), JSON.stringify(state, null, 2));

    const eventsPath = path.join(abs, "events.ndjson");
    if (!fs.existsSync(eventsPath)) {
      fs.writeFileSync(eventsPath, "");
    }

    const artManifest = {
      podIri: pod.podIri,
      artifacts: [],
      inbox: "inbox/",
      outbox: "outbox/",
    };
    fs.writeFileSync(
      path.join(abs, "artifacts", "manifest.json"),
      JSON.stringify(artManifest, null, 2),
    );
  }

  /**
   * @private
   * @param {string} unitId
   * @param {object} event
   * @param {boolean} requireMaterialized
   */
  _appendEvent(unitId, event, requireMaterialized) {
    const abs = this._paths.get(unitId);
    if (!abs) {
      if (requireMaterialized) return;
      // pre-materialize: buffer en memoria vía pending (opcional no-op)
      return;
    }
    const line = JSON.stringify({
      ts: this._nowIso(),
      ...event,
    });
    fs.appendFileSync(path.join(abs, "events.ndjson"), line + "\n");
  }

  /** @private — manifest interno con paths; público via publicManifest() sin paths */
  _writeManifest() {
    const privateManifest = {
      runId: this.runId,
      provider: { ...PROVIDER_META },
      storeRoot: this._storeRoot,
      pods: Object.fromEntries(
        [...this._pods.entries()].map(([unitId, pod]) => [
          unitId,
          {
            podIri: pod.podIri,
            state: pod.state,
            fsPath: this._paths.get(unitId) ?? null,
          },
        ]),
      ),
    };
    fs.writeFileSync(
      path.join(this._storeRoot, "manifest.private.json"),
      JSON.stringify(privateManifest, null, 2),
    );
    // Vista pública (sin rutas)
    fs.writeFileSync(
      path.join(this._storeRoot, "manifest.json"),
      JSON.stringify(this.publicManifest(), null, 2),
    );
  }
}

/** Huella estable de una ACL, para dejar rastro del cambio sin volcarla entera. */
function aclDigest(acl) {
  if (acl == null) return null;
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(acl))
    .digest("hex")
    .slice(0, 16);
}

export {
  POD_STATES,
  PROVIDER_META,
  STATIC_UNIT_IDS,
  TRANSITION_VERB,
  POLICY_VERB,
  podIri,
  universeRunnerUnitId,
};
