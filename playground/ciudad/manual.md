# Manual · playground ciudad (una ventana por rol)

Evolución de la [prueba de dos](../prueba-de-dos/manual.md): en vez de dos
ventanas genéricas (H/M), **una ventana-operador por rol del juego**
`@zeus/ciudad`. Todo el control pasa por scripts de `package.json` — cada
ventana trae los comandos de su rol, su `.env` (actor · puerto · room) y su
`handoff.md` como cuaderno del operador.

## 1. Los roles del juego

Del README de `@zeus/ciudad` (§Roles + §Tres jugadores):

| carpeta | rol catálogo | verbo | quién es |
| ------- | ------------ | ----- | -------- |
| `autoridad/` | authority | sostiene | Una room, una autoridad: nodo rooms + engine del juego |
| `residente/` | `operator` | filtra | Ligado a un edificio; nace con `wake` (barrio `vivo`) |
| `visitante/` | `player` | saborea | Entra, camina entre anchors, anuncia en plaza |
| `corriente/` | `player` | canaliza | Camino rabbit; default del `join` (peer MCP) |
| `cronista/` | `dj` | narra | Solo narrar: re-emite actos como `announce` en plaza |

Los clientes de mirada (tablero de jugadores, proyector dramaturgo) no son
roles de partida: son **miradores** — ver §8.

## 2. Requisitos

- Node `>=22` (los scripts usan `--env-file`).
- Alcance al registry `https://npm.scriptorium.escrivivir.co` (scopes
  `@zeus` y `@alephscript`; los fija el `.npmrc` del kit y de cada ventana).
- Una ventana de operador (humano o agente) por rol. No hacen falta las
  cinco: el mínimo jugable es `autoridad` + un jugador.
- Aviso de disco: cada ventana instala su propio stack (~centenares de MB).
  Generá solo los roles que vayas a abrir.

## 3. Recrear las carpetas

Desde `playground/ciudad/`:

```bash
npm run roles                       # lista los roles del juego
npm run generate                    # las cinco ventanas + npm install
npm run generate autoridad_corriente    # solo un subconjunto
npm run generate:sin-install        # solo ficheros, sin npm install
```

Cada carpeta-rol queda con `package.json` (stack + scripts del rol),
`.npmrc`, `.env` y `handoff.md`. El generador es idempotente: no pisa
ficheros con contenido; re-ejecutarlo es seguro.

## 4. Orden de arranque

1. **`autoridad/`** — `npm run nodo` (rooms en `:3017`) y, con el nodo
   vivo, `npm run autoridad` (engine ciudad, room `CIUDAD_DEMO`).
   Si hay nodo externo, se declara en `.env` (`ZEUS_SCRIPTORIUM_URL`) y
   solo corre `npm run autoridad`.
2. **Jugadores** (`residente/`, `visitante/`, `corriente/`) — cada uno
   `npm run mcp`: levanta su MCP de jugador (un proceso = un actor; puerto
   propio en `.env`: 4141/4142/4143) con tools `player_join` ·
   `player_walk` · `player_announce` · `player_wake` · `player_state` ·
   `player_leer_parte`.
3. **`cronista/`** — `npm run mcp` (puerto 4144); juega solo con
   `player_announce` + `player_state` (narrar, no intervenir).

Gap conocido (v0.1.0 publicada): el tool `player_join` del MCP no expone
`playerType`; el dominio resuelve `corriente` por defecto y el residente
se distingue **por sus actos** (`wake`/`sleep` sobre su edificio). Se
registra como observación, no se parchea desde aquí.

## 5. Identidad

Igual que en la prueba de dos: cada peer declara su vía —card vigente,
card emitida o anonimato— según
[PEERCARD.md](../prueba-de-dos/reference/PEERCARD.md) (submanual
compartido; no se duplica aquí).

## 6. Validación de la experiencia (CA del playground)

La corrida se da por buena solo si **todo** esto consta en los handoffs de
las ventanas participantes, con evidencia literal (logs, snapshots):

- [ ] Autoridad arriba con `game: ciudad` y startpack cargado.
- [ ] Todos los jugadores presentes en la misma room (snapshot con sus
      actores).
- [ ] Cada rol ejerció **su verbo** al menos una vez y otro lo vio
      reflejado: residente `wake`, visitante/corriente `walk`+`announce`,
      cronista `announce` narrativo.
- [ ] La vía de identidad de cada peer quedó declarada.
- [ ] Registro rellenado en el `handoff.md` de cada ventana.

Lo no comprobado se marca `<pendiente>` — nunca se da por hecho.

## 7. Qué entra a git

| qué | ¿git? |
| --- | ----- |
| El kit (manual, handoffs plantilla, generador, `.npmrc`) | Sí |
| Carpetas-rol generadas (node_modules, `.env`, handoffs vivos) | No — regenerables (`.gitignore`) |

El resultado de una corrida se reporta al `plan/` del carril, no
commiteando las carpetas-rol.

## 8. Miradores (UIs) — ver la ciudad sin jugarla

Hay dos capas de UI, y conviene no confundirlas:

**Con el stack instalado** (gratis en la ventana `autoridad/`):

| UI | dónde | qué muestra |
| -- | ----- | ----------- |
| Runtime del nodo | `http://localhost:3017/runtime` | La página del nodo rooms |
| Admin UI (Socket.IO) | `http://localhost:3017/admin/` (alias `/ui/`) | Sockets, rooms y tráfico en vivo |

**La malla de miradores** (`presets-sdk` §`DEFAULT_ZEUS_UI_MESH`, puertos
3012–3026) **no viaja por el registry**: son apps del monorepo
`codebase/z-sdk` (`packages/mesh/*`). Se levantan desde ahí, apuntando al
mismo nodo (`ZEUS_SCRIPTORIUM_URL` / puertos `ZEUS_PORT_*`):

| mirador | slot · puerto | workspace | arranque (desde `codebase/z-sdk`) |
| ------- | ------------- | --------- | --------------------------------- |
| 🎛️ Tablero | `player` · 3013 | `@zeus/player-ui` | `npm start -w @zeus/player-ui` |
| 🔥 Firehose | `firehose` · 3016 | `@zeus/firehose-browser` | `npm start -w @zeus/firehose-browser` |
| 📂 Cache | `view` · 3015 | `@zeus/cache-browser` | `npm start -w @zeus/cache-browser` |
| 🧊 Visor 3D | `player3d` · 3018 | `@zeus/player-3d-ui` | `npm start -w @zeus/player-3d-ui` |
| 🛰️ 3D Monitor | `debug3d` · 3019 | `@zeus/3d-monitor` | `npm start -w @zeus/3d-monitor` |
| 🎛️ Operador | `operator` · 3020 | `@zeus/operator-ui` | Angular: `npm run build:all` primero |

(Hay más en la malla — editor 3012, ARG console 3021, WebRTC 3022/3023,
pozo 3025, SOLVE 3026 — mismo patrón, mismo monorepo.)

Regla del playground: los miradores **miran, no juegan** — no cuentan
como ventanas-rol ni entran en el CA de §6. Si una corrida usa miradores,
se anota cuáles en el Registro de la ventana que los abrió (normalmente
`autoridad/`).
