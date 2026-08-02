#!/usr/bin/env node
/**
 * WP-HUB-106 · CLI ceremonia bilateral barrio-lore-v1
 *
 * Uso:
 *   node scripts/ceremonia.mjs --run <run-id> [--force-new]
 *                              [--now <iso>] [--lease-seed <s>]
 *
 * `--now` y `--lease-seed` INYECTAN reloj e identidad de lease (WP-HUB-110).
 * Sin ellas la ceremonia usa `Date.now` y leases aleatorios, como en
 * producción: no hay nada congelado por defecto. Con ellas, dos corridas con
 * los mismos valores son byte a byte iguales, que es lo que permite
 * demostrar reproducibilidad sin borrar campos antes de comparar.
 */
import { runCeremonia, CeremonyError } from "../lib/ceremonia/index.mjs";

function usage() {
  console.error(
    "uso: node scripts/ceremonia.mjs --run <run-id> [--force-new] [--now <iso>] [--lease-seed <s>]",
  );
  process.exit(2);
}

function parseArgs(argv) {
  const out = { run: null, forceNew: false, now: null, leaseSeed: null };
  const args = argv.slice(2);
  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    if (a === "--run") {
      const v = args[++i];
      if (!v || v.startsWith("--")) usage();
      out.run = v;
      continue;
    }
    if (a === "--now") {
      const v = args[++i];
      if (!v || v.startsWith("--")) usage();
      if (Number.isNaN(Date.parse(v))) {
        console.error(`[ceremonia] --now no es fecha ISO: ${v}`);
        process.exit(2);
      }
      out.now = v;
      continue;
    }
    if (a === "--lease-seed") {
      const v = args[++i];
      if (!v || v.startsWith("--")) usage();
      out.leaseSeed = v;
      continue;
    }
    if (a === "--force-new") {
      out.forceNew = true;
      continue;
    }
    if (a === "--help" || a === "-h") usage();
    console.error(`[ceremonia] flag desconocida: ${a}`);
    usage();
  }
  return out;
}

const opts = parseArgs(process.argv);
if (!opts.run) usage();

try {
  const result = runCeremonia({
    runId: opts.run,
    forceNew: opts.forceNew,
    ...(opts.now ? { clock: () => Date.parse(opts.now) } : {}),
    ...(opts.leaseSeed
      ? { leaseIdFactory: (unitId) => `lease-${unitId}-${opts.leaseSeed}` }
      : {}),
  });
  console.log(`[ceremonia] PASS — runId=${result.runId} verdict=${result.report.verdict}`);
  console.log(`[ceremonia] evidence=${result.evidenceRoot.replaceAll("\\", "/")}`);
  console.log(`[ceremonia] chain rows H=M=${result.chainH.length}`);
  process.exit(result.report.verdict === "pass" ? 0 : 1);
} catch (err) {
  const msg = err instanceof CeremonyError ? err.message : String(err.message || err);
  console.error(`[ceremonia] FAIL — ${msg}`);
  process.exit(1);
}
