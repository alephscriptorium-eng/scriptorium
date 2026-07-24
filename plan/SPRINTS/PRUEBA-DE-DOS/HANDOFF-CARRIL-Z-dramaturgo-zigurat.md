# HANDOFF · CARRIL-Z · Dramaturgo (absorción del editor narrativo legado) + Zigurat opt-in

| dato | valor |
| ---- | ----- |
| Emisor | carril **S** · ventana vigilante-S (workspace `scriptorium`) |
| Fecha | 2026-07-24 |
| Vía | **(a) handoff** · GO custodio en sesión vigilante-S 2026-07-24 (Camino A ratificado: "absorber-concepto y archivar" el editor narrativo legado, veredicto del cierre sprint-game-city 2026-07-21; asiento formal DA-S2x a discreción del orquestador de base) |
| Escritura fuera de `C:\S\scriptorium` (o en `codebase/<x>-sdk`) | **ninguna** |
| Borrados ejecutados por S | **cero** |

## Destinatario(s) (carril(es) dueño(s))

1. **Carril Z** (`C:\S_LAB\z-sdk\plan` · vigía SOL vía custodio) — recibe dos
   mandatos: **(1) Dramaturgo completo** (absorción del dominio narrativo del
   editor legado bajo vocabulario propio del carril) y **(2) Zigurat opt-in**
   (diseño de acople IDE que desbloquea el horizonte WP-U73). Numeración
   `WP-Unnn`, plan detallado, briefs y gates `Rn-Z` son del carril — aquí
   solo mandato + dirección esbozada + recursos (regla 6 del protocolo de
   handoff base↔carriles).

Fronteras declaradas (a estos carriles NO se les pide nada en este handoff):
- **Carril A**: archivo del repo legado y asiento DAS-1 de su `plan/DECISIONES.md` — obra suya, cuando su carril despierte.
- **Carril O**: despliegue del sidecar blobstore en el pub — paso ops del custodio, fuera de Z.
- **Obra de la extensión VS Code** (submódulo de a-sdk): se documenta la dirección; no se encola aquí.

## Contexto de la decisión

- El cierre del sprint-game-city (2026-07-21) recomendó para el editor
  narrativo legado (barrio 08 del censo CIUDAD): **absorber-concepto y
  archivar** — el concepto ya fue portado vía WP-Z11 (`@zeus/linea-editor`).
- El custodio ratifica ese camino (Camino A, sesión vigilante-S 2026-07-24).
- El **gate de ceguera** de WP-Z11 (patrón `NovelistEditor|\bnovela\b`) se
  respeta íntegro: todo lo pedido aquí usa vocabulario del carril
  (dramaturgo · línea · acto · personaje · reparto). El nombre legado no
  entra en código; el corpus sí entra como datos.

## Pedido 1 — Mandato «Dramaturgo completo»

Partición **propuesta** en cinco trozos (el carril decide numeración, olas y
estimaciones). Objetivo global: personajes como entidad de primera clase,
relación 1 actor – N personajes anclada a identidad federada, y los hilos de
escenas como líneas/story-boards contratables por la ciudad.

### T1 · Proyección de mutaciones a tools MCP (cierra el hueco genérico)

**Qué:** hoy `projectRoutesToMcp` proyecta solo GET
(`packages/engine/http-contract/src/mcp-project.mjs:65`); las mutaciones se
escriben como tools a mano en cada paquete. Añadir `projectRoutesToMcpTools()`
(RouteEntry no-GET → tool MCP: nombre desde `id`, `inputSchema` desde el zod
de `request.{params,body}`) + un `bindProjectedHttpWriters` simétrico al
lector existente. Resultado: un dominio se declara **una vez** como
`RouteEntry[]` y obtiene REST + resources MCP + tools MCP sin remapeo.
**CA sugerido (ejes I/IV):** unit tests del proyector; `spec:generate` y
gates intactos; piloto opcional: migrar las tools manuales de
`linea-editor/src/tools.mjs` al proyector.
**Dependencias:** ninguna. Beneficia a todos los paquetes del carril.

### T2 · Kit de reparto (engine)

**Qué:** paquete engine de dominio puro (nombre a criterio del carril, p. ej.
`@zeus/reparto-kit`): entidad `Personaje`; relación **reparto** 1 actor – N
personajes **anclada a `ssbId`** (la peer-card es efímera/revocable — la
identidad durable es el `@…ed25519` que viaja en ella; patrón ya practicado
en WP-U93 y `protocol/src/peer-card-seat.mjs`); integridad referencial
(el legado referenciaba por arrays de IDs sin cascada); autorización de
intents por personaje vía `protocol/src/acl.mjs` (un actor solo emite
intents de personajes de su reparto).
**Restricciones:** regla engine (sin transporte) y D-8 (sin conceptos de un
solo juego). **CA (ejes I/II):** tests de dominio; gate de ceguera PASS.
**Dependencias:** ninguna (paralelo a T1).

### T3 · Story-board con personajes

**Qué:** extender `@zeus/story-board-schema`: los actos pueden referenciar
personajes (refs-only, disciplina SPEC-horse-blobs — nunca corpus embebido).
Campo opcional: los story-boards existentes siguen válidos. El ciclo
editorial `raw → triaged → canon` queda intacto como ciclo de publicación.
**Dependencias:** T2 (vocabulario de personaje).

### T4 · Mutaciones gateadas de autoría

**Qué:** en `@zeus/linea-editor` (o paquete mesh hermano, a criterio del
carril): CRUD de personajes/reparto declarado como `RouteEntry[]`
consumiendo T1 (cero tools a mano); `export_story_board` extendido con
reparto; gate `requireMutationApproval` como el actual. Si es paquete nuevo:
alta canónica (puerto en `presets-sdk/src/env`, entrada en
`mcp-launcher/src/catalog.mjs`, scripts raíz, oferta horse, changeset).
**Dependencias:** T1 + T2 + T3.

### T5 · Migración del corpus legado

**Qué:** importador one-off (tooling, fuera del engine): el corpus del
editor legado (4 obras · 61 escenas · 33 personajes · 19 capítulos en su
`novel-data.json`) + la obra `itaca-digital` archivada en a-sdk → líneas y
story-boards con `editorialStatus: raw`; personajes → T2. El importador
puede vivir donde el carril decida; el nombre legado no aparece en código
del carril (ceguera) — solo en las rutas fuente de este handoff.
**Dependencias:** T2 + T3 (T4 opcional).

## Pedido 2 — Mandato «Zigurat opt-in» (desbloqueo del horizonte WP-U73)

**Marco:** `WP-U73 · El teatro de la capa 2 SSB` (codename
BOE-Arrakis-Theater-Elenco) está archivado en `plan/BACKLOG-HISTORICO.md`
(~línea 1396) del carril como "no se planifica hasta que exista diseño
cerrado", dependiente del spike externo SPIKE-10-OASIS-IDENTITY. Este
mandato **aporta el diseño que faltaba** y pide al carril valorar su
desarchivo como épica. No pide implementar la capa 2 federada.

**Qué es el Zigurat:** la capa transversal "Z" de la ciudad — la extensión
VS Code (submódulo `vscode-alephscript-extension` de a-sdk; código vivo hoy
solo en el espejo legado) leída como "teatro-orquestador IDE que opera la
ciudad". Definición canónica en la cantera de s-sdk
(`plan/SPRINTS/sprint-game-city/cantera/CIUDAD/00-ZIGURAT/`). El concepto
"elenco" ya se reencarnó en el carril como widget agnóstico `cast-table`
(`packages/engine/view-kit/src/widgets.mjs`, WP-U116, `panel-elenco` alias).

**Dirección propuesta (el carril traza su plan):**

1. **Contrato de consumo IDE** — lo único enteramente en territorio Z, y el
   primer trozo natural si hay GO: definir qué resources/tools expone la
   ciudad para que una interfaz IDE se acople **opt-in** — catálogo de
   barrios (`launcher://catalog`), reparto y story-boards (T2–T4), join de
   room con emisión de peer-card. Invariante: nada de engine/mesh depende de
   la extensión; el acople es una fila más del inventario del consumidor.
2. **Lado extensión** (territorio a-sdk; aquí solo dirección): externalizar
   hosts/puertos/prefijos a config única; catálogo dinámico desde
   `launcher://catalog` en lugar de su lista fija de tareas; separar
   "elenco de juego" (agentes con servidor MCP) del "elenco teatral"
   (compañías de agentes IDE), que hoy conviven bajo el mismo nombre.
3. **Invariantes de frontera L1/L2** (obligatorios en cualquier diseño):
   - L1 = ∞, L2 = sesión: el estado vivo de Room nunca se presenta como
     registro canónico del pub.
   - Honestidad de sincronía: lo no desplegado se muestra `⏳`, no se finge.
   - La única identidad transfronteriza es la peer-card con `ssbId` +
     `seatSignature` verificable (`peer-card-seat`, WP-U93) — nunca un
     userId ad-hoc de la UI.
   - No fusionar los dos "Arrakis": la casa LARP ARRakis (Tribe SSB real,
     con código en el mundo O) y la "Casa Arrakis" teatral (rol
     pub/snapshotter/notario, hoy solo visión) son objetos distintos.
   - Nada de la sala escribe directo al pub: todo retorno a L1 pasa por
     cristalización explícita (hash + firmas + summary, tipo BOE); jamás
     publicar `parliamentLaw` desde L2.
4. **Usuarios previstos:** ola 1, la tribe ARRakis del LARP de Oasis (los
   makers/techies — ancla real `larpHouseTribeAnchor` sobre Tribes SSB);
   ola 2, otras tribes orientadas a procesos de parlamento (cimiento ya
   cerrado: WP-U84 exporta `parliamentCandidature`/votes a JSON; no existe
   backlog activo de parlamento — queda en horizonte hasta que el acople
   IDE funcione).

**Pedido concreto a Z:** valorar desarchivar WP-U73 como épica con este
diseño; si hay GO, encolar primero el contrato de consumo IDE; el resto
queda como frontera declarada (extensión → a-sdk; sidecar/pub → O;
identidad federada → SPIKE-10).

## Fuentes (SOLO LECTURA)

En el carril Z (tip actual de `C:\S_LAB\z-sdk`):

| artefacto | ruta |
| --------- | ---- |
| Hueco GET-only del proyector MCP | `packages/engine/http-contract/src/mcp-project.mjs` |
| Peer-card + asiento firmado | `packages/engine/protocol/src/peer-card.mjs` · `peer-card-seat.mjs` · `docs/guide/external-handshake.md` |
| Contrato narrativo canónico | `packages/engine/story-board-schema/schemas/story-board.schema.json` |
| Paquete canónico a imitar | `packages/mesh/linea-editor/` (gate · tools · export-story-board · horse-preset) |
| Elenco reencarnado | `packages/engine/view-kit/src/widgets.mjs` (cast-table, WP-U116) |
| Alta en el circuito | `packages/mesh/mcp-launcher/src/catalog.mjs` · `packages/engine/presets-sdk/src/env/index.mjs` |
| Horizonte WP-U73 · cimiento WP-U84 · dramaturgo WP-U86/U112 | `plan/BACKLOG-HISTORICO.md` · `plan/DATOS.md` §6 |
| Identidad en sala | `plan/REPORTES/briefs/WP-U93-peer-card.md` |

Referencia fuera del carril (SOLO LECTURA, gitlinks/espejos no tocados):

| artefacto | ruta |
| --------- | ---- |
| Cantera Zigurat + barrio 08 | `codebase/s-sdk/plan/SPRINTS/sprint-game-city/cantera/CIUDAD/00-ZIGURAT/` · `01-BARRIOS/08-NovelistEditor.md` · `CIERRE-sprint-game-city-2026-07-21.md` |
| Schemas y corpus legado en a-sdk | `codebase/a-sdk/.github_V1/plugins/novelist/schemas/` · `codebase/a-sdk/ARCHIVO/PLUGINS/NOVELIST/` (obra itaca-digital) · `codebase/a-sdk/plan/DECISIONES.md` (DAS-1) |
| Espejo legado (fuera de `C:\S`, readonly) | `C:\Users\aleph\OASIS\aleph-scriptorium\NovelistEditor\src\resources\` (schemas Zod + `novel-data.json`) · `VsCodeExtension\` (ICompany, mcpConfigurationManager, HackerTasksPanelProvider) · `MCPGallery\ArrakisTheater_OperaConfig.json` |
| Frontera L1/L2 y mundo O | `docs/ciudad.md` (workspace) · `codebase/o-sdk/OASIS_PUB/blobstore-sidecar/` (WP-S14) · `codebase/o-sdk/src/models/larp_model.js` · `codebase/o-sdk/OASIS_PUB/site/parlament/` |

## Evidencia de partición

- ALCANCE_DIFF de este handoff = solo `plan/**` del workspace `scriptorium`
  (este fichero + una entrada en la Cola de `plan/BACKLOG.md`).
- `codebase/*-sdk` y demás gitlinks: **no tocados** · cero bump.
- Espejo legado de OASIS: **solo lectura**, sondeado vía agentes.
- Cero borrados.

## Cierre del handoff

Cuando el carril Z acepte y materialice (encole sus WP-Unnn con briefs
propios), que deje **nota de vuelta** citando este fichero + SHA de su tip.
Hasta entonces, el material permanece apuntado aquí sin pérdida. La
aceptación, numeración y calendario son del carril; este handoff no asume
nada en su nombre.
