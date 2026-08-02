/**
 * WP-HUB-110 · guardia offline.
 *
 * QUÉ CAMBIA RESPECTO A LA VERSIÓN QUE NO PROBABA NADA
 * -----------------------------------------------------
 *  1. **Bloquea**, no anota. Antes registraba la salida y la dejaba pasar: una
 *     corrida con red seguía siendo una corrida con red.
 *  2. **Fail-closed**. `isLoopbackHost(null)` devolvía `true`, y `0.0.0.0` y
 *     `::` contaban como loopback. Ahora lo desconocido y los comodines son
 *     violación: no se presume inocencia de un host que no se sabe cuál es.
 *  3. **Cubre lo que se usaba para saltársela**: `net.Socket.prototype.connect`,
 *     `tls.connect` y `http2.connect` estaban sin parchear.
 *  4. **Llega a los procesos hijo**. La guardia in-process era estructuralmente
 *     ciega a `npm ci` y a `generar.mjs`, que son procesos aparte. Ahora se
 *     instala también en ellos vía `NODE_OPTIONS=--import lib/offline/preload.mjs`
 *     y cada hijo deja su parte en un fichero que el padre lee.
 *  5. **Mide puertos y procesos**: `listen()` y `child_process.*` quedan
 *     registrados, para que «sin puertos ni procesos huérfanos» sea una
 *     comprobación y no una declaración.
 *
 * LÍMITE DECLARADO, Y ES MÁS ESTRECHO DE LO QUE PARECE
 * -----------------------------------------------------
 * Esta guardia sustituye **propiedades del namespace** de un builtin. Node
 * fija el binding de un *named export* al instanciar el módulo, así que:
 *
 *     import childProcess from "node:child_process";
 *     childProcess.spawnSync(...)      // ← interceptado
 *
 *     import { spawnSync } from "node:child_process";
 *     spawnSync(...)                   // ← NO interceptado. Medido:
 *                                      //   named import   -> false
 *                                      //   namespace prop -> true
 *
 * Lo mismo vale para `import { lookup } from "node:dns"` y para cualquier
 * `new dns.Resolver()`, que trae sus propios métodos. Un binario nativo o un
 * hijo que no sea Node también quedan fuera. No se afirma más que eso.
 *
 * Es la misma trampa que ya costó cara en otro mundo de este programa: un
 * monkey-patch de `fs` que no alcanzaba a `import { writeFileSync }` y una
 * sonda que «funcionaba» por accidente. Mundos distintos, mismo mecanismo.
 */
import net from "node:net";
import tls from "node:tls";
import http from "node:http";
import https from "node:https";
import http2 from "node:http2";
import dns from "node:dns";
import dnsPromises from "node:dns/promises";
import childProcess from "node:child_process";

export const OFFLINE_LOG_ENV = "HM_OFFLINE_LOG";

export class OfflineViolation extends Error {
  /** @param {string} api @param {string} host */
  constructor(api, host) {
    super(`offline: salida no-loopback bloqueada — ${api} → ${host}`);
    this.name = "OfflineViolation";
    this.api = api;
    this.host = host;
  }
}

/**
 * Loopback de verdad. Fail-closed: lo que no se sabe, no pasa.
 * `0.0.0.0` y `::` son comodines de escucha, no destinos loopback.
 * @param {unknown} host
 */
export function isLoopbackHost(host) {
  if (host == null) return false;
  let h = String(host).trim().toLowerCase();
  if (h.startsWith("[") && h.endsWith("]")) h = h.slice(1, -1);
  if (h === "") return false;
  if (h === "localhost" || h === "::1" || h === "0:0:0:0:0:0:0:1") return true;
  if (/^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
  return false;
}

/** Conexiones IPC (pipes/sockets de fichero) no son red. */
function esIpc(arg) {
  if (arg && typeof arg === "object" && typeof arg.path === "string") return true;
  if (typeof arg === "string") {
    return arg.startsWith("\\\\") || arg.startsWith("/") || arg.startsWith(".");
  }
  return false;
}

/**
 * @param {{ block?: boolean }} [opts]
 */
export function installOfflineGuard(opts = {}) {
  const block = opts.block !== false;
  /** @type {Array<{ api: string, host: string }>} */
  const violations = [];
  /** @type {Array<{ api: string, host: string|null, port: unknown }>} */
  const listens = [];
  /** @type {Array<{ api: string, command: string, pid: number|null, status: number|null }>} */
  const children = [];

  /** @param {string} api @param {unknown} host */
  function check(api, host) {
    const h = host == null ? "(desconocido)" : String(host);
    if (isLoopbackHost(host)) return;
    violations.push({ api, host: h });
    if (block) throw new OfflineViolation(api, h);
  }

  const orig = {
    netConnect: net.connect,
    netCreateConnection: net.createConnection,
    socketConnect: net.Socket.prototype.connect,
    serverListen: net.Server.prototype.listen,
    tlsConnect: tls.connect,
    httpRequest: http.request,
    httpsRequest: https.request,
    http2Connect: http2.connect,
    dnsLookup: dns.lookup,
    dnsResolve: dns.resolve,
    dnsResolve4: dns.resolve4,
    dnsResolve6: dns.resolve6,
    dnsResolveAny: dns.resolveAny,
    dnsResolveCname: dns.resolveCname,
    dnsResolveMx: dns.resolveMx,
    dnsResolveTxt: dns.resolveTxt,
    dnsResolveSrv: dns.resolveSrv,
    dnsResolveNs: dns.resolveNs,
    dnsPromisesLookup: dnsPromises.lookup,
    dnsPromisesResolve: dnsPromises.resolve,
    dnsPromisesResolve4: dnsPromises.resolve4,
    dnsPromisesResolve6: dnsPromises.resolve6,
    dnsPromisesResolveAny: dnsPromises.resolveAny,
    fetch: globalThis.fetch,
    spawn: childProcess.spawn,
    spawnSync: childProcess.spawnSync,
    exec: childProcess.exec,
    execFile: childProcess.execFile,
    execFileSync: childProcess.execFileSync,
    execSync: childProcess.execSync,
    fork: childProcess.fork,
  };

  /**
   * Extrae el host de las mil firmas de connect().
   *
   * Ojo con `net.connect(opts)`: por dentro llama a
   * `socket.connect(normalizeArgs(args))`, o sea con un ARRAY `[opts, cb]` como
   * primer argumento. Sin desenvolverlo, el host salía «(desconocido)» y la
   * guardia bloqueaba 127.0.0.1 — un falso positivo que la sonda destapó.
   */
  function hostDeConnect(args) {
    const capa = Array.isArray(args[0]) ? args[0] : args;
    const first = capa[0];
    if (esIpc(first)) return null; // IPC: no es red
    if (first && typeof first === "object") {
      // Host ausente en options = localhost, que es lo que hace Node.
      return first.host ?? first.hostname ?? "localhost";
    }
    if (typeof first === "number") {
      // connect(port[, host]) — sin host, Node usa localhost
      return typeof capa[1] === "string" ? capa[1] : "localhost";
    }
    if (typeof first === "string") return first;
    return "(desconocido)";
  }

  function hostDeUrlOOpts(first) {
    if (typeof first === "string" || first instanceof URL) {
      try {
        return new URL(String(first)).hostname;
      } catch {
        return String(first);
      }
    }
    if (first && typeof first === "object") {
      const h = first.hostname ?? first.host ?? null;
      if (h == null) return "(desconocido)";
      return String(h).includes(":") ? String(h).split(":")[0] : String(h);
    }
    return "(desconocido)";
  }

  function wrapConnect(fn, api) {
    return function patched(...args) {
      const host = hostDeConnect(args);
      if (host !== null) check(api, host);
      return fn.apply(this, args);
    };
  }

  function wrapUrlApi(fn, api) {
    return function patched(...args) {
      check(api, hostDeUrlOOpts(args[0]));
      return fn.apply(this, args);
    };
  }

  function wrapDns(fn, api) {
    return function patched(hostname, ...rest) {
      check(api, hostname);
      return fn.call(this, hostname, ...rest);
    };
  }

  net.connect = wrapConnect(orig.netConnect, "net.connect");
  net.createConnection = wrapConnect(orig.netCreateConnection, "net.createConnection");
  net.Socket.prototype.connect = wrapConnect(orig.socketConnect, "net.Socket.connect");
  tls.connect = wrapConnect(orig.tlsConnect, "tls.connect");
  http.request = wrapUrlApi(orig.httpRequest, "http.request");
  https.request = wrapUrlApi(orig.httpsRequest, "https.request");
  http2.connect = wrapUrlApi(orig.http2Connect, "http2.connect");
  dns.lookup = wrapDns(orig.dnsLookup, "dns.lookup");
  dns.resolve = wrapDns(orig.dnsResolve, "dns.resolve");
  dns.resolve4 = wrapDns(orig.dnsResolve4, "dns.resolve4");
  dns.resolve6 = wrapDns(orig.dnsResolve6, "dns.resolve6");
  dns.resolveAny = wrapDns(orig.dnsResolveAny, "dns.resolveAny");
  dns.resolveCname = wrapDns(orig.dnsResolveCname, "dns.resolveCname");
  dns.resolveMx = wrapDns(orig.dnsResolveMx, "dns.resolveMx");
  dns.resolveTxt = wrapDns(orig.dnsResolveTxt, "dns.resolveTxt");
  dns.resolveSrv = wrapDns(orig.dnsResolveSrv, "dns.resolveSrv");
  dns.resolveNs = wrapDns(orig.dnsResolveNs, "dns.resolveNs");
  dnsPromises.lookup = wrapDns(orig.dnsPromisesLookup, "dns.promises.lookup");
  dnsPromises.resolve = wrapDns(orig.dnsPromisesResolve, "dns.promises.resolve");
  dnsPromises.resolve4 = wrapDns(orig.dnsPromisesResolve4, "dns.promises.resolve4");
  dnsPromises.resolve6 = wrapDns(orig.dnsPromisesResolve6, "dns.promises.resolve6");
  dnsPromises.resolveAny = wrapDns(orig.dnsPromisesResolveAny, "dns.promises.resolveAny");
  // LÍMITE QUE NO SE CIERRA AQUÍ: `new dns.Resolver()` trae sus propios
  // métodos, y `import { lookup } from "node:dns"` fija el binding al
  // instanciar. Ninguno de los dos pasa por estas propiedades. Declarado en
  // REPORTE-ZV-110.md §8.
  if (typeof orig.fetch === "function") {
    globalThis.fetch = wrapUrlApi(orig.fetch, "fetch");
  }

  // Puertos: no se bloquea escuchar, se REGISTRA. «Sin puertos huérfanos» pasa
  // a ser una cifra comprobable en vez de una frase.
  net.Server.prototype.listen = function patchedListen(...args) {
    const first = args[0];
    const port = first && typeof first === "object" ? first.port : first;
    const host = first && typeof first === "object" ? (first.host ?? null) : null;
    listens.push({ api: "net.Server.listen", host, port: port ?? null });
    return orig.serverListen.apply(this, args);
  };

  // Procesos: igual. Se registran para poder demostrar que no queda ninguno.
  function nombreDe(args) {
    const c = args[0];
    return typeof c === "string" ? c : String(c);
  }
  function wrapSpawnAsync(fn, api) {
    return function patched(...args) {
      const child = fn.apply(this, args);
      children.push({
        api,
        command: nombreDe(args),
        pid: child?.pid ?? null,
        status: null,
      });
      return child;
    };
  }
  childProcess.spawn = wrapSpawnAsync(orig.spawn, "spawn");
  childProcess.fork = wrapSpawnAsync(orig.fork, "fork");
  childProcess.exec = wrapSpawnAsync(orig.exec, "exec");
  childProcess.execFile = wrapSpawnAsync(orig.execFile, "execFile");
  childProcess.spawnSync = function patchedSpawnSync(...args) {
    const r = orig.spawnSync.apply(this, args);
    children.push({
      api: "spawnSync",
      command: nombreDe(args),
      pid: r?.pid ?? null,
      status: r?.status ?? null,
    });
    return r;
  };
  // `execSync` y `execFileSync` estaban capturados en `orig` y NUNCA se
  // asignaban: dos de las seis formas de crear un proceso quedaban sin contar
  // y el censo no tenía cómo saberlo.
  childProcess.execSync = function patchedExecSync(...args) {
    try {
      return orig.execSync.apply(this, args);
    } finally {
      children.push({ api: "execSync", command: nombreDe(args), pid: null, status: null });
    }
  };
  childProcess.execFileSync = function patchedExecFileSync(...args) {
    try {
      return orig.execFileSync.apply(this, args);
    } finally {
      children.push({
        api: "execFileSync",
        command: nombreDe(args),
        pid: null,
        status: null,
      });
    }
  };

  function restore() {
    net.connect = orig.netConnect;
    net.createConnection = orig.netCreateConnection;
    net.Socket.prototype.connect = orig.socketConnect;
    net.Server.prototype.listen = orig.serverListen;
    tls.connect = orig.tlsConnect;
    http.request = orig.httpRequest;
    https.request = orig.httpsRequest;
    http2.connect = orig.http2Connect;
    dns.lookup = orig.dnsLookup;
    dns.resolve = orig.dnsResolve;
    dns.resolve4 = orig.dnsResolve4;
    dns.resolve6 = orig.dnsResolve6;
    dns.resolveAny = orig.dnsResolveAny;
    dns.resolveCname = orig.dnsResolveCname;
    dns.resolveMx = orig.dnsResolveMx;
    dns.resolveTxt = orig.dnsResolveTxt;
    dns.resolveSrv = orig.dnsResolveSrv;
    dns.resolveNs = orig.dnsResolveNs;
    dnsPromises.lookup = orig.dnsPromisesLookup;
    dnsPromises.resolve = orig.dnsPromisesResolve;
    dnsPromises.resolve4 = orig.dnsPromisesResolve4;
    dnsPromises.resolve6 = orig.dnsPromisesResolve6;
    dnsPromises.resolveAny = orig.dnsPromisesResolveAny;
    if (orig.fetch) globalThis.fetch = orig.fetch;
    childProcess.spawn = orig.spawn;
    childProcess.spawnSync = orig.spawnSync;
    childProcess.exec = orig.exec;
    childProcess.execFile = orig.execFile;
    childProcess.execSync = orig.execSync;
    childProcess.execFileSync = orig.execFileSync;
    childProcess.fork = orig.fork;
  }

  function snapshot() {
    return {
      violations: [...violations],
      listens: [...listens],
      children: [...children],
    };
  }

  function assertClean() {
    if (violations.length > 0) {
      const sample = violations.slice(0, 5).map((v) => `${v.api}→${v.host}`).join("; ");
      throw new Error(
        `offline rota: ${violations.length} salidas no-loopback (${sample})`,
      );
    }
  }

  return { violations, listens, children, restore, assertClean, snapshot };
}
