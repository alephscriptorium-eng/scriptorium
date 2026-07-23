#!/usr/bin/env node
// Generador del playground ciudad: `npm run generate [roles] [-- --sin-install]`
// Crea una carpeta-ventana por rol del juego @zeus/ciudad, npm-inicializada
// con su stack, su .env (actor/puerto/room) y su handoff.md.
// No pisa ficheros existentes con contenido; `--sin-install` omite npm install.

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)));

// Stack consagrado por la prueba de dos (PD-04, 2026-07-23)
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

// Scripts comunes a toda ventana
const SCRIPTS_COMUNES = {
  env: 'node -p "require(\'fs\').readFileSync(\'.env\',\'utf8\')"',
  salud: 'npm view @zeus/protocol version'
};

// Roles del juego @zeus/ciudad (README §Roles + §Tres jugadores):
// player = visitante o corriente · operator = residente · dj = cronista;
// la autoridad sostiene la room (una room, una autoridad).
const ROLES = {
  autoridad: {
    rolCatalogo: 'authority',
    verbo: 'sostiene',
    descripcion: 'Anfitrión: nodo rooms + autoridad de la room (game ciudad)',
    scripts: {
      nodo: 'node --env-file=.env node_modules/@zeus/socket-server/src/index.mjs',
      start: 'node --env-file=.env node_modules/@zeus/socket-server/src/index.mjs',
      autoridad: 'node --env-file=.env node_modules/@zeus/ciudad/src/authority.mjs'
    },
    env: [
      'ZEUS_CIUDAD_ROOM=CIUDAD_DEMO',
      '# CIUDAD_TICK_MS=200',
      '# CIUDAD_STATE_HEARTBEAT_MS=5000',
      '# ZEUS_STARTPACK_CIUDAD=',
      '# Nodo rooms externo: descomentar y apuntar',
      '# ZEUS_SCRIPTORIUM_URL=http://localhost:3017'
    ]
  },
  residente: {
    rolCatalogo: 'operator',
    verbo: 'filtra',
    mcpPort: 4141,
    descripcion: 'Jugador residente (operator): ligado a un edificio, nace con wake'
  },
  visitante: {
    rolCatalogo: 'player',
    verbo: 'saborea',
    mcpPort: 4142,
    descripcion: 'Jugador visitante (player): entra, camina, anuncia'
  },
  corriente: {
    rolCatalogo: 'player',
    verbo: 'canaliza',
    mcpPort: 4143,
    descripcion: 'Jugador corriente (player): camino rabbit, default del join'
  },
  cronista: {
    rolCatalogo: 'dj',
    verbo: 'narra',
    mcpPort: 4144,
    descripcion: 'Cronista (dj): solo narrar — re-emite actos como announce en plaza'
  }
};

// Ventana jugador/cronista: MCP de jugador de @zeus/ciudad (un proceso = un actor)
function scriptsDeJugador() {
  return {
    mcp: 'node --env-file=.env node_modules/@zeus/ciudad/src/player-mcp/start.mjs'
  };
}

function envDeJugador(rol, def) {
  return [
    'ZEUS_CIUDAD_ROOM=CIUDAD_DEMO',
    `ZEUS_CIUDAD_PLAYER_ACTOR=${rol}`,
    `ZEUS_MCP_CIUDAD=${def.mcpPort}`,
    '# Nodo rooms externo: descomentar y apuntar',
    '# ZEUS_SCRIPTORIUM_URL=http://localhost:3017'
  ];
}

const args = process.argv.slice(2).filter((a) => a !== '--');
const sinInstall = args.includes('--sin-install') || args.includes('--no-install');
if (args.includes('--listar')) {
  for (const [rol, def] of Object.entries(ROLES)) {
    console.log(`${rol.padEnd(10)} ${def.rolCatalogo.padEnd(9)} ${def.verbo.padEnd(9)} ${def.descripcion}`);
  }
  process.exit(0);
}
const spec = args.find((a) => !a.startsWith('--'));
const roles = spec
  ? spec.split('_').map((s) => s.trim().toLowerCase()).filter(Boolean)
  : Object.keys(ROLES);
const desconocidos = roles.filter((r) => !(r in ROLES));
if (desconocidos.length > 0 || roles.length === 0) {
  console.error(
    `uso: npm run generate [rol_rol_…] [-- --sin-install] · roles válidos: ${Object.keys(ROLES).join(', ')}`
  );
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

// package.json: si no existe se escribe entero; si existe, fusión suave de
// SOLO la clave scripts (añade los que falten, no pisa nada, no toca deps).
function asegurarPackageJson(ruta, pkgNuevo, etiqueta) {
  if (!existsSync(ruta) || statSync(ruta).size === 0) {
    writeFileSync(ruta, JSON.stringify(pkgNuevo, null, 2) + '\n');
    console.log(`  + escrito: ${etiqueta}`);
    return;
  }
  const actual = JSON.parse(readFileSync(ruta, 'utf8'));
  const faltantes = Object.keys(pkgNuevo.scripts).filter((k) => !(k in (actual.scripts ?? {})));
  if (faltantes.length === 0) {
    console.log(`  · ya existe: ${etiqueta} (scripts al día)`);
    return;
  }
  actual.scripts = {
    ...(actual.scripts ?? {}),
    ...Object.fromEntries(faltantes.map((k) => [k, pkgNuevo.scripts[k]]))
  };
  writeFileSync(ruta, JSON.stringify(actual, null, 2) + '\n');
  console.log(`  ~ actualizado: scripts (${faltantes.join(', ')}) en ${etiqueta}`);
}

for (const rol of roles) {
  const def = ROLES[rol];
  const destino = join(RAIZ, rol);
  console.log(`[generar] rol ${rol} (${def.rolCatalogo}) → ${rol}/`);
  mkdirSync(destino, { recursive: true });

  const scripts = def.scripts ?? scriptsDeJugador();
  const pkg = {
    name: rol,
    private: true,
    version: '1.0.0',
    description: `Ventana ${rol} (${def.rolCatalogo} · ${def.verbo}) · playground ciudad`,
    scripts: { ...scripts, ...SCRIPTS_COMUNES },
    license: 'ISC',
    dependencies: STACK
  };
  asegurarPackageJson(join(destino, 'package.json'), pkg, `${rol}/package.json`);
  escribirSiFalta(join(destino, '.npmrc'), readFileSync(join(RAIZ, '.npmrc')), `${rol}/.npmrc`);

  const lineasEnv = [`# Ventana ${rol} · juego ciudad`, ...(def.env ?? envDeJugador(rol, def)), ''];
  escribirSiFalta(join(destino, '.env'), lineasEnv.join('\n'), `${rol}/.env`);

  const plantilla = join(RAIZ, 'handoffs', `handoff-${rol}.md`);
  escribirSiFalta(join(destino, 'handoff.md'), readFileSync(plantilla), `${rol}/handoff.md`);

  if (sinInstall) {
    console.log('  · npm install omitido (--sin-install)');
    continue;
  }
  console.log(`  … npm install en ${rol}/`);
  const r = spawnSync('npm', ['install'], { cwd: destino, stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.status !== 0) {
    console.error(`[generar] npm install falló en ${rol}/ (exit ${r.status})`);
    process.exit(1);
  }
}

console.log('[generar] listo. Siguiente: cada operador abre su carpeta-rol y sigue su handoff.md');
