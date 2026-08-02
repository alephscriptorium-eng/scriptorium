#!/usr/bin/env node
/**
 * WP-HUB-106 · CLI ceremonia bilateral barrio-lore-v1
 *
 * Uso:
 *   node scripts/ceremonia.mjs --run <run-id> [--force-new]
 */
import { runCeremonia, CeremonyError } from "../lib/ceremonia/index.mjs";

function usage() {
  console.error("uso: node scripts/ceremonia.mjs --run <run-id> [--force-new]");
  process.exit(2);
}

function parseArgs(argv) {
  const out = { run: null, forceNew: false };
  const args = argv.slice(2);
  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    if (a === "--run") {
      const v = args[++i];
      if (!v || v.startsWith("--")) usage();
      out.run = v;
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
