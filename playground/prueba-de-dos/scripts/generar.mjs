#!/usr/bin/env node
// Generador de la prueba de dos: `npm run generate A_B`
// Crea H/ (operador A) y M/ (operador B), npm-inicializadas con su stack.
// No pisa ficheros existentes con contenido; `--sin-install` omite npm install.

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)));

// Mapa operador → carpeta (contrato de la prueba: A vive en H = Human, B en M = Machine)
const OPERADORES = { A: 'H', B: 'M' };
// Semántica de las ventanas
const NOMBRES = { H: 'Human', M: 'Machine' };

// Stack que validó la inicialización de H (2026-07-23)
const STACK = {
  '@zeus/authority-kit': '^0.4.1',
  '@zeus/ciudad': '^0.1.0',
  '@zeus/presets-sdk': '^0.1.2',
  '@zeus/protocol': '^0.4.0',
  '@zeus/rooms': '^0.1.1',
  '@zeus/socket-server': '^0.1.1',
  '@zeus/startpack-ciudad': '^0.1.0',
  '@zeus/startpack-kit': '^0.1.0'
};

const args = process.argv.slice(2).filter((a) => a !== '--');
const sinInstall = args.includes('--sin-install') || args.includes('--no-install');
const spec = args.find((a) => !a.startsWith('--')) ?? 'A_B';

const operadores = spec.split('_').map((s) => s.trim().toUpperCase()).filter(Boolean);
const desconocidos = operadores.filter((o) => !(o in OPERADORES));
if (desconocidos.length > 0 || operadores.length === 0) {
  console.error(`uso: npm run generate A_B [-- --sin-install] · operadores válidos: ${Object.keys(OPERADORES).join(', ')}`);
  process.exit(2);
}

// Escribe solo si el destino no existe o está vacío (idempotente, sin clobber)
function escribirSiFalta(ruta, contenido, etiqueta) {
  if (existsSync(ruta) && statSync(ruta).size > 0) {
    console.log(`  · ya existe: ${etiqueta}`);
    return;
  }
  writeFileSync(ruta, contenido);
  console.log(`  + escrito: ${etiqueta}`);
}

for (const op of operadores) {
  const carpeta = OPERADORES[op];
  const destino = join(RAIZ, carpeta);
  console.log(`[generar] operador ${op} → ${carpeta}/`);
  mkdirSync(destino, { recursive: true });

  const pkg = {
    name: carpeta.toLowerCase(),
    private: true,
    version: '1.0.0',
    description: `Ventana ${carpeta} (${NOMBRES[carpeta]} · operador ${op}) · prueba de dos`,
    main: 'index.js',
    scripts: { test: 'echo "Error: no test specified" && exit 1' },
    license: 'ISC',
    dependencies: STACK
  };
  escribirSiFalta(join(destino, 'package.json'), JSON.stringify(pkg, null, 2) + '\n', `${carpeta}/package.json`);
  escribirSiFalta(join(destino, '.npmrc'), readFileSync(join(RAIZ, '.npmrc')), `${carpeta}/.npmrc`);

  const plantilla = join(RAIZ, 'handoffs', `handoff-${carpeta}.md`);
  escribirSiFalta(join(destino, 'handoff.md'), readFileSync(plantilla), `${carpeta}/handoff.md`);

  if (sinInstall) {
    console.log('  · npm install omitido (--sin-install)');
    continue;
  }
  console.log(`  … npm install en ${carpeta}/`);
  const r = spawnSync('npm', ['install'], { cwd: destino, stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.status !== 0) {
    console.error(`[generar] npm install falló en ${carpeta}/ (exit ${r.status})`);
    process.exit(1);
  }
}

console.log('[generar] listo. Siguiente: cada operador abre su carpeta y sigue su handoff.md');
