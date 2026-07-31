# ESTRUCTURA · anclas G del starter-kit (WP-G52)

| dato | valor |
| ---- | ----- |
| Qué | La estructura (packs + env) que ancla la obra G en el playground, **citable por ruta de playground** — sin rutas hermanas a otros checkouts |
| Regla | **Anclar = declarar el contrato de obtención** (nombre + versión + canal, hash si es medible en local). Cero tarballs copiados, cero symlinks, cero `node_modules` |
| Grafo | [`../GRAFO-STARTERKIT.md`](../GRAFO-STARTERKIT.md) — lo mantiene el Anfitrión; esta carpeta **no** lo toca |
| Fuente censada | repo G `Z_SDK-games-library` (`github.com/alephscriptorium-eng/Z_SDK-games-library`), commit local `daef20b`, censo RO 2026-07-31 |
| Para V | V21 espera citar la estructura por ruta `playground/...`. El **mapeo opt-in** de V sobre estas anclas es obra de V: aquí se describe el material disponible, no se prescribe su elección |

## 1. Censo de piezas G (los 7 packs reales)

6 startpacks de juego + 1 kit (loader), todos `@zeus/*@0.1.0`, todos
publicables al registry `https://npm.scriptorium.escrivivir.co` y a GitHub
Release del repo G (tag `startpack-<game>-v<versión>`). Ficha-ancla por pack:

| pack | rol | contenido (resumen) | tarball declarado | ficha (ruta citable) |
| ---- | --- | ------------------- | ----------------- | -------------------- |
| `@zeus/startpack-ciudad` | startpack · ciudad | topología ciudad: plaza + zigurat, 6 distritos, 24 barrios, catálogo `arbol`, `scene.mjs` | 9 f · 42 793 B | `playground/prueba-de-dos/estructura/packs/startpack-ciudad.md` |
| `@zeus/startpack-delta` | startpack · delta | semillas + volumes sintéticos + acta; objetivo labeled 10 / excavated 2 | 21 f · 19 404 B | `playground/prueba-de-dos/estructura/packs/startpack-delta.md` |
| `@zeus/startpack-pozo` | startpack · pozo | semillas + volumes sintéticos + acta; objetivo emptied 1 | 15 f · 6 526 B | `playground/prueba-de-dos/estructura/packs/startpack-pozo.md` |
| `@zeus/startpack-plaza` | startpack · plaza | narrativo mínimo: story-board + línea + casos | 29 f · 19 369 B | `playground/prueba-de-dos/estructura/packs/startpack-plaza.md` |
| `@zeus/startpack-sketch` | startpack · sketch | mínimo parametrizable: escena + labelset + línea + casos | 34 f · 23 067 B | `playground/prueba-de-dos/estructura/packs/startpack-sketch.md` |
| `@zeus/startpack-solve-coagula` | startpack · solve-coagula | dramaturgia + fixture linea-aleph; objetivo cases 3 | 14 f · 21 377 B | `playground/prueba-de-dos/estructura/packs/startpack-solve-coagula.md` |
| `@zeus/startpack-kit` | kit (loader) | `loadStartPack` único para todos los packs; dependencia de los 6 | 3 f · 5 438 B | `playground/prueba-de-dos/estructura/packs/startpack-kit.md` |

Cada ficha lleva: contrato (nombre + versión + canal npm + canal GitHub
Release), hash medido en local (`npm pack --dry-run`: shasum + integrity),
tamaños, contenido y evidencia `ruta:línea` dentro del repo G.

## 2. Mapa · pieza G ↔ nodo del grafo

Nodos según [`../GRAFO-STARTERKIT.md`](../GRAFO-STARTERKIT.md) (§Grafo
previsto). El ancla dice qué pieza G da materia a cada nodo; **quién marca y
cómo entra lo dice el grafo, no esta carpeta**.

| nodo del grafo | pieza G que lo ancla | por qué (evidencia en la ficha) |
| -------------- | -------------------- | ------------------------------- |
| AUTH CIUDAD (custodio) | `@zeus/startpack-ciudad` | la autoridad de ciudad **exige** el startpack (Z02) y de él carga la topología |
| BARRIO (S · auth) | `@zeus/startpack-ciudad` | los barrios (24 anclas con `estado`) y distritos son semillas de este pack — el barrio del grafo es una de esas anclas |
| EDIFICIO-1 (root V · peercard → G) | un startpack de juego, **a elección del root** — candidatos: delta, pozo, plaza, sketch, solve-coagula | cada edificio ancla su ronda con un pack de juego; la elección es el **mapeo opt-in de V**: `<pendiente>` (no se prescribe aquí) |
| EDIFICIO-2 (root O · peercard → Z) | un startpack de juego, a elección del root (mismos candidatos) | ídem — mapeo opt-in de O: `<pendiente>` |
| shadows (G, Z, L) | no anclan pack: anotan | su materia es acta/peercard; **todo pack de juego trae `acta/ACTA.md`** declarada en su manifest — el shadow tiene dónde anotar sin pieza propia |
| transversal (todas las ventanas) | `@zeus/startpack-kit` | loader único: cualquier nodo que cargue un pack pasa por él (dependencia de los 6) |

Piezas `@zeus` del stack de la demo que **no** son de este censo (engine:
`authority-kit`, `protocol`, `rooms`, `socket-server`, `presets-sdk`): ya son
citables por contrato npm en
`playground/prueba-de-dos/scripts/generar.mjs` (constante `STACK`) — mismo
principio, otro repo fuente.

## 3. Env de la demo

Fichero de ejemplo comentado (variables que el playground necesita, con
evidencia por variable):
`playground/prueba-de-dos/estructura/env/demo.env.example`.

Contrato del env: los overrides de directorio (`ZEUS_STARTPACK_CIUDAD` /
`ZEUS_STARTPACK_ROOT`) solo apuntan a un **root propio del playground**
(árbol descomprimido por el operador bajo su ventana) — jamás a un pack
instalado ni a otro checkout.

## 4. CHECKLIST (CA del backlog) · pieza G citable sin sibling path

Citable = existe una ruta `playground/...` que declara su contrato completo;
ninguna referencia sale del playground por ruta de disco.

| pieza G | citable por | ¿sin sibling path? |
| ------- | ----------- | ------------------ |
| `@zeus/startpack-ciudad@0.1.0` | `playground/prueba-de-dos/estructura/packs/startpack-ciudad.md` | **sí** |
| `@zeus/startpack-delta@0.1.0` | `playground/prueba-de-dos/estructura/packs/startpack-delta.md` | **sí** |
| `@zeus/startpack-pozo@0.1.0` | `playground/prueba-de-dos/estructura/packs/startpack-pozo.md` | **sí** |
| `@zeus/startpack-plaza@0.1.0` | `playground/prueba-de-dos/estructura/packs/startpack-plaza.md` | **sí** |
| `@zeus/startpack-sketch@0.1.0` | `playground/prueba-de-dos/estructura/packs/startpack-sketch.md` | **sí** |
| `@zeus/startpack-solve-coagula@0.1.0` | `playground/prueba-de-dos/estructura/packs/startpack-solve-coagula.md` | **sí** |
| `@zeus/startpack-kit@0.1.0` | `playground/prueba-de-dos/estructura/packs/startpack-kit.md` | **sí** |
| env de la demo (contrato de variables) | `playground/prueba-de-dos/estructura/env/demo.env.example` | **sí** |
| mapa pack ↔ nodo del grafo | `playground/prueba-de-dos/estructura/ESTRUCTURA.md` (§2) | **sí** |

Verificación mecánica: `grep` de rutas hermanas (absolutas de disco o `../`
fuera del playground) sobre `playground/prueba-de-dos/estructura/` = **0**.
Las únicas rutas relativas usadas apuntan dentro del propio playground
(`../GRAFO-STARTERKIT.md`, `../../reference/PEERCARD.md`).

Pendiente honesto: la existencia efectiva de cada GitHub Release y de la
versión publicada en el registry no se verificó en línea (censo sin red);
el canal queda **declarado** con su evidencia de workflow, no comprobado.

— WP-G52 · carril G (obra en playground del HUB)
