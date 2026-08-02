/**
 * WP-HUB-110 · instrumentación offline (cero salidas no-loopback).
 * Parchea net/http/https/dns/fetch durante la corrida; no declara — mide.
 */
import net from "node:net";
import http from "node:http";
import https from "node:https";
import dns from "node:dns";
import dnsPromises from "node:dns/promises";

const LOOPBACK = new Set(["127.0.0.1", "::1", "localhost", "0.0.0.0", "::"]);

/**
 * @param {unknown} host
 * @returns {boolean}
 */
function isLoopbackHost(host) {
  if (host == null) return true;
  const h = String(host).trim().toLowerCase();
  if (!h) return true;
  if (LOOPBACK.has(h)) return true;
  if (h.startsWith("127.")) return true;
  return false;
}

/**
 * @returns {{
 *   violations: Array<{ api: string, host: string, detail?: string }>,
 *   restore: () => void,
 *   assertClean: () => void,
 * }}
 */
export function installOfflineGuard() {
  /** @type {Array<{ api: string, host: string, detail?: string }>} */
  const violations = [];

  function note(api, host) {
    const h = host == null ? "" : String(host);
    if (isLoopbackHost(h)) return;
    violations.push({ api, host: h });
  }

  const orig = {
    netConnect: net.connect,
    netCreateConnection: net.createConnection,
    httpRequest: http.request,
    httpsRequest: https.request,
    dnsLookup: dns.lookup,
    dnsResolve: dns.resolve,
    dnsResolve4: dns.resolve4,
    dnsResolve6: dns.resolve6,
    dnsPromisesLookup: dnsPromises.lookup,
    fetch: globalThis.fetch,
  };

  function wrapNetConnect(fn, api) {
    return function patchedConnect(...args) {
      let host = null;
      if (typeof args[0] === "object" && args[0] !== null) {
        host = args[0].host ?? args[0].hostname ?? null;
      } else if (typeof args[0] === "number") {
        host = typeof args[1] === "string" ? args[1] : "127.0.0.1";
      } else if (typeof args[0] === "string") {
        host = args[0].includes("/") ? "127.0.0.1" : args[0];
      }
      note(api, host);
      return fn.apply(this, args);
    };
  }

  function wrapHttpRequest(fn, api) {
    return function patchedRequest(...args) {
      let host = null;
      const first = args[0];
      if (typeof first === "string" || first instanceof URL) {
        try {
          host = new URL(String(first)).hostname;
        } catch {
          host = String(first);
        }
      } else if (first && typeof first === "object") {
        host = first.hostname ?? first.host ?? null;
        if (host && String(host).includes(":")) {
          host = String(host).split(":")[0];
        }
      }
      note(api, host);
      return fn.apply(this, args);
    };
  }

  net.connect = wrapNetConnect(orig.netConnect, "net.connect");
  net.createConnection = wrapNetConnect(
    orig.netCreateConnection,
    "net.createConnection",
  );
  http.request = wrapHttpRequest(orig.httpRequest, "http.request");
  https.request = wrapHttpRequest(orig.httpsRequest, "https.request");

  dns.lookup = function patchedLookup(hostname, ...rest) {
    note("dns.lookup", hostname);
    return orig.dnsLookup.call(this, hostname, ...rest);
  };
  dns.resolve = function patchedResolve(hostname, ...rest) {
    note("dns.resolve", hostname);
    return orig.dnsResolve.call(this, hostname, ...rest);
  };
  dns.resolve4 = function patchedResolve4(hostname, ...rest) {
    note("dns.resolve4", hostname);
    return orig.dnsResolve4.call(this, hostname, ...rest);
  };
  dns.resolve6 = function patchedResolve6(hostname, ...rest) {
    note("dns.resolve6", hostname);
    return orig.dnsResolve6.call(this, hostname, ...rest);
  };
  dnsPromises.lookup = async function patchedLookup(hostname, ...rest) {
    note("dns.promises.lookup", hostname);
    return orig.dnsPromisesLookup.call(this, hostname, ...rest);
  };

  if (typeof orig.fetch === "function") {
    globalThis.fetch = function patchedFetch(input, init) {
      let host = null;
      try {
        const url =
          typeof input === "string" || input instanceof URL
            ? new URL(String(input))
            : input && input.url
              ? new URL(String(input.url))
              : null;
        host = url?.hostname ?? null;
      } catch {
        host = String(input);
      }
      note("fetch", host);
      return orig.fetch.call(this, input, init);
    };
  }

  function restore() {
    net.connect = orig.netConnect;
    net.createConnection = orig.netCreateConnection;
    http.request = orig.httpRequest;
    https.request = orig.httpsRequest;
    dns.lookup = orig.dnsLookup;
    dns.resolve = orig.dnsResolve;
    dns.resolve4 = orig.dnsResolve4;
    dns.resolve6 = orig.dnsResolve6;
    dnsPromises.lookup = orig.dnsPromisesLookup;
    if (orig.fetch) globalThis.fetch = orig.fetch;
  }

  function assertClean() {
    if (violations.length > 0) {
      const sample = violations
        .slice(0, 5)
        .map((v) => `${v.api}→${v.host}`)
        .join("; ");
      throw new Error(
        `offline rotas: ${violations.length} salidas no-loopback (${sample})`,
      );
    }
  }

  return { violations, restore, assertClean };
}

/**
 * Ejecuta fn bajo guardia offline (sync).
 * @template T
 * @param {() => T} fn
 * @returns {T}
 */
export function withOfflineGuard(fn) {
  const guard = installOfflineGuard();
  try {
    const result = fn();
    guard.assertClean();
    return result;
  } finally {
    guard.restore();
  }
}
