#!/usr/bin/env node
/**
 * WP-HUB-107 · verificador externo de evidencia.
 *
 * Uso:
 *   node scripts/verificar-evidencia.mjs --evidence <ruta-raíz-evidencia>
 *
 * Solo abre la raíz de evidencia. No consulta dirs vivos H/M.
 */
import { resolve } from "node:path";
import {
  verificarEvidencia,
  VerifierError,
  FRONTIER,
} from "../lib/verificador/verificar.mjs";

function usage() {
  console.error(
    "uso: node scripts/verificar-evidencia.mjs --evidence <evidence-root>",
  );
  process.exit(2);
}

function parseArgs(argv) {
  /** @type {{ evidence?: string }} */
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--evidence" || a === "-e") {
      out.evidence = argv[++i];
    } else if (a === "--help" || a === "-h") {
      usage();
    } else {
      console.error(`[verificar-evidencia] flag desconocida: ${a}`);
      usage();
    }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
if (!args.evidence) usage();

try {
  const result = verificarEvidencia(resolve(args.evidence));
  console.log(
    `[verificar-evidencia] PASS — runId=${result.runId} checks=${result.checks.length}`,
  );
  for (const c of result.checks) {
    console.log(`  · ${c}`);
  }
  process.exit(0);
} catch (err) {
  if (err instanceof VerifierError) {
    console.error(`[verificar-evidencia] FAIL — ${err.frontier}`);
    console.error(`  ${err.message}`);
    process.exit(1);
  }
  console.error(`[verificar-evidencia] FAIL — ${err?.message || err}`);
  process.exit(1);
}

export { FRONTIER };
