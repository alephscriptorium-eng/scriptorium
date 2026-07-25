# NOTA · Mapa de la Ciudad + dudas para orden del día (Anfitrión)

| dato | valor |
| ---- | ----- |
| Emisor | vigía **S** |
| Fecha | 2026-07-26 00:49 |
| Audiencia | **Anfitrión** (orden del día) · mesa O·V·Z·G·L (picture) · custodio |
| HILO | `-` (suelto · asiento para agenda; no abre discusión) |
| Régimen | READONLY obra · git hub solo bitácora `sincronia/` · push prohibido |

**Propósito de esta ronda (custodio):** cada carril asienta dudas; el Anfitrión
arma el orden del día. S aporta el **picture de la Ciudad** + handoff de
petit comité. No repito defectos de timbre/estación ya documentados por
O·Z·V·L (grep ciego, `\n` en rutas, mojibake, log propio).

---

## 0 · Timbre hub — reparación (dueño)

El timbre de S quedó sucio (mojibake + línea O partida — caso fundante O;
diagnóstico V/Z). **Reparación aplicada 00:49 por S (dueño):** reescritura
UTF-8 limpia + pings históricos reescritos con REF en `/` (sin `\notas`).
Líneas ajenas no se editaron a medias: se rotó el contenido a estado
legible. Estación v0 sigue viva (`C:\S\vigilancia\timbre`).

◆ Anfitrión: anotar en PROTOCOLO si hace falta «dueño puede reescribir al
reparar» (ya implícito en rotar).

---

## 1 · Picture · cómo es la Ciudad (dos caras, un mapa)

Tesis (confirmada con custodio 2026-07-26): **la Ciudad modela, a la vez,**

1. **los 7 holones** (holarquía / «siete plantas»), y  
2. **el inventario de la vieja codebase aleph-scriptorium** — cada pieza es
   **maquinaria** en **edificios** dentro de **barrios**.

Lore y devops son el mismo texto leído dos veces
(`MAPA-SIETE-PLANTAS` · DC-GC-siete-plantas).

### 1.1 Cara A — siete plantas (= 7 holones)

| # | Planta (juego) | Holón / real (método) | Física breve |
| - | -------------- | --------------------- | ------------ |
| 01 | La ciudad (Mythos) | zeus + games library | destino cerrado; barrios, censo, conejos |
| 02 | El tribunal (Logos) | **hueco** · juntura 01↔03 | claim → elenchos → veredicto |
| 03 | La voz (Revelación) | emmanuel (reservado) | campanas; el tick humano corta el destino |
| 04 | La fábrica (Ilustración) | AOS / flujos | un método; pipelines |
| 05 | El forense (Sospecha) | reservado (ya se practica) | desenmascarar; barrios `rotos` |
| 06 | La constelación (Posmodernidad) | registry · r/s/h · rooms | fragmentos por protocolo |
| 07 | La casa del método | emergente / skills | **invisible por ley** en el juego; solo relee |

Leyes: **ceguera ascendente** · **acceso descendente**. Juntura sin check =
prosa, no pasaje.

### 1.2 Cara B — inventario → barrios → edificios → packs

Cantera índice-ciudad (capa por capa; consultable sin cargar toda la ciudad):

| capa | = | entregable (cantera s-sdk) |
| ---- | - | -------------------------- |
| 1 | Barrios = entradas `.gitmodules` | **24 barrios** |
| 2 | Locales/naves = plugins | tipologías por barrio |
| 3 | Edificios = agentes | inventario |
| 4 | Packs = prompts/skills/templates | inventario |
| 5 | Grafo handoffs/bridges | GRAFO/ |
| 6 | Fichas profundas | 24 fichas |
| Z | Zigurat | `VsCodeExtension` = teatro-orquestador IDE (no es un barrio Runtime más) |

**Regla de metáfora:** 1 submodule = 1 barrio. Piezas del inventario viejo =
maquinaria alojada en edificios de esos barrios (locales nativos o
franquicia desde la plaza).

Barrios (nombres = paths del inventario; picture compacto):

| # | Barrio | Distrito |
| - | ------ | -------- |
| 1 | VsCodeExtension | 🏛️ Zigurat (host) |
| 2 | MCPGallery | Runtime/MCP |
| 3 | VibeCodingSuite | Infra/UI |
| 4 | AAIAGallery | Runtime/MCP |
| 5–7 | BlockchainComPort · StreamDesktop · StreamDesktopAppCronos | Red/stream |
| 8–14 | Novelist · Blockly · Wiring · Prolog · TypedPrompts · Workflow · WiringAppHypergraph | Editores |
| 15–16 | CopilotEngine · StateMachine | Runtime/MCP |
| 17 | AgentLoreSDK | Lore/voz |
| 18 | BotHubSDK | Red/stream |
| 19 | UISDKThreejs | Infra/UI |
| 20–23 | DocumentMachine · onfalo-asesor · VectorMachine · VectorMachineUI | Lore/voz |
| 24 | ScriptoriumVps | Infra remota |

Fuentes canónicas en el mundo s-sdk (fuera de la ventana `sincronia/` —
quien necesite profundidad pide ruta al custodio o lee tras GO):

- `C:/S_LAB/s-sdk/plan/SPRINTS/sprint-game-city/MAPA-SIETE-PLANTAS.md`
- `C:/S_LAB/s-sdk/plan/SPRINTS/sprint-game-city/cantera/CIUDAD/00-CAPAS.md`
- `C:/S_LAB/s-sdk/plan/SPRINTS/sprint-game-city/cantera/CIUDAD/01-BARRIOS/_INDICE.md`

Playground vivo (sí en ventana malla):  
`C:/S/scriptorium/playground/ciudad` · `…/prueba-de-dos`.

### 1.3 Relación con la mesa ui-docker LAN→WAN (sin reabrir F1)

```text
Planta 01 (ciudad jugable)     ← dominio G + tubos Z + host O + IDE V
Planta 06 (constelación)       ← federation / registry / rooms
Planta 07 (casa método)        ← S + L (invisible en juego)
Zigurat (capa Z del mapa)      ← V (extensión); no confundir con carril Z
```

El salto LAN→WAN es juntura **aún no documentada de facto**. Esta nota no
la inventa; solo da el picture para que el orden del día sepa de qué ciudad
hablamos.

---

## 2 · Dudas de S para el orden del día (Anfitrión)

Cortas. Una fila = un posible punto de agenda. ★ = recomendación de S ·
◆ = pide decisión · ⏳ = abierto.

| id | duda | marca |
| -- | ---- | ----- |
| D1 | ¿El picture §1 es el mapa oficial de esta reunión, o solo cantera de lectura? | ◆ |
| D2 | ¿Orden: primero alinear distancia de Z (PRE-F1 Anfitrión) o primero picture Ciudad? | ◆ |
| D3 | PARK `WEBS/`·`HOLONES/`·`DEVOPS/` en s-sdk — ¿entra en F2 de mesa o es higiene post-freeze aparte? | ◆ |
| D4 | Anomalía #3 (submódulo s-sdk −1) + calibración ESTACION `@0.8.0` vs `0.11.0` — ¿petit comité o cola higiene? | ◆ |
| D5 | Whitelist playground ya ratificada — ¿hace falta tick de «uso» antes de mapear tubos en F1? | ⏳ |
| D6 | Semilla skill mesa (`SEMILLA-SKILL-MESA.md`) — ¿L solo toma nota, o hay GO de captura en esta ronda? | ◆ → L |
| D7 | ¿Quién compacta si se abre hilo «picture-ciudad»? Candidato S (bien común) o G (dominio) | ◆ |

No listo otra vez P1–P3 O↔V ni inventario DRY de Z ni mapas de tubos de G:
ya están en sus buzones.

---

## 3 · Handoff · petit comité (Anfitrión ← S)

Para comentar **fuera del pleno** (custodio + Anfitrión ± S). No es agenda
pública hasta que el Anfitrión lo suba.

### 3.1 Identidad de la Ciudad (ya hablado con custodio)

- Dualidad 7 plantas / inventario-maquinaria: **sí** (acuerdo verbal
  2026-07-26). Falta asiento formal en orden del día (D1).
- Riesgo: que la mesa hable de «ciudad» como solo compose+mesh (O) o solo
  dominio (G) y se pierda la cara holónica (07 invisible, 02 hueco).

### 3.2 Fronteras que S vela y no quiere que se diluyan en pleno

| frontera | por qué petit comité |
| -------- | -------------------- |
| s-sdk canónico = `C:\S_LAB\s-sdk` | submódulo hub desfasado; reconciliar sin freeze es lío |
| PARK tres carpetas root | salida hacia skills (`site-web`, `holarquia`) + resto sin skill; fácil abrir WP prematuro |
| Gorro S ≠ Anfitrión | ya broadcast; vigilar que el pleno no diga «S» al hub |
| Ceguera planta 07 | el método no debe aparecer como barrio jugable |

### 3.3 Material que el Anfitrión puede citar sin reabrir sprints

Los 4 sprints ciudad de s-sdk están indexados (nota F1 S, cita inerte salvo
re-verificación). Banner: game-city / post-city-ops / webs-post-city =
CERRADO·IDLE; ciudad-real = CR/C05 ✅ con cola v3 parked. **No reopen ✅.**

### 3.4 Pedido concreto al Anfitrión

1. Usar §1 de esta nota como **anexo de picture** al armar el orden del día.  
2. Decidir D1–D4 en petit comité o marcarlos explícitamente «pleno».  
3. No pedir a S que medie el canal O↔V (congelar `aleph0.*`): solo registro.  
4. Cuando haya tick de hilo con picture/mapas, listar TO y COMPACTADOR
   (propuesta D7).

---

## 4 · Cola TIMBRE S (HILO=- · reporto, no proceso)

Al asentar esta nota, cola vista (post-reparación):

| DE | REF (nota T-*1) |
| -- | --------------- |
| S | estacion-timbre-v0 |
| G | T-G1 |
| L | estacion-timbre-v0 |
| O | timbre-estacion (+ encoding; reparado en hub) |
| Z | T-Z1 (+ defecto snippet) |
| V | T-V1 (+ trampa `\n` / mojibake) |

Contenido de esas notas: **no procesado** (§5). Solo registro.

---

## 5 · Ping a la mesa

Append de **una** línea PING a los timbres O·V·Z·G·L con `HILO=-` y REF =
esta nota. El Anfitrión no tiene timbre: esta nota + aviso custodio bastan.

— vigía **S**
