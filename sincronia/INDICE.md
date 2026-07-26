# ÍNDICE · mesa de sincronía

Punto de reunión de los carriles. Vive en el Scriptorium porque es la codebase
que reúne el método que todos ejecutan. **Apunta, no contiene.**

Abierto el **2026-07-25** por el **Anfitrión** (entonces con el gorro de
vigía-S; gorro cedido a la consola S ese mismo día —
`notas/NOTA-ANFITRION-2026-07-25-renombre-sucesion.md`).
Tema: **crecimiento holón de las unidades `ui-docker`, de LAN a WAN.**
Protocolo de identidad, firma y leyenda TUI: [`PROTOCOLO.md`](PROTOCOLO.md).

---

## Quién es quién

| voz | es | habla en |
| --- | -- | -------- |
| **custodio** | el humano · relaya, da GO | consolas |
| **Anfitrión** | sesión del hub `C:\S` · mantiene índice + protocolo · **no es S** | sesión + estos ficheros |
| **S · O · V · Z · G · L** | los seis carriles, cada uno con su mundo | sus buzones |

Regla de identidad (dura): anúnciate y firma en cada salida; si el custodio
te llama por otra letra, **aborta y verifica** — `PROTOCOLO.md` §2.

## Reparto de esta ronda

| principal | shadow | responsabilidad |
| --------- | ------ | --------------- |
| **O** | **Z** | O trabaja su codebase; Z aporta/verifica el runtime |
| **V** | **G** | V trabaja su codebase; G aporta/explica dominio y mapa |

**S + Anfitrión + custodio** velan por el bien común. **L** registra solo
protocolo y consensos validados para su futura transformación en skill.

Estado de control: **PRE-F1 · modo TICK · no auto**. Una nota visible no es
una orden. Solo se procesa un alcance tras tick TUI validado por el custodio;
sin él rige `NO_TICK_VALIDADO=NO_PROCESAR` (`PROTOCOLO.md` §5).

## Mapa de buzones

| carril | `WORLD_ROOT` | buzón (ruta estable) | nota | ack | F1 |
| ------ | ------------ | -------------------- | ---- | --- | -- |
| **S** | `C:\S` (vela `C:\S_LAB\s-sdk`) | `C:\S\scriptorium\sincronia\BUZON.md` | ✅ preparación | — (vigía) | — no iniciada |
| **O** | `C:\S_LAB\o-sdk` | `C:\S_LAB\o-sdk\sincronia\BUZON.md` | ✅ preparación | ✅ 22:10 | — no iniciada |
| **V** | `C:\S_LAB\v-sdk` | `C:\S_LAB\v-sdk\sincronia\BUZON.md` | ✅ preparación | ✅ ~22:30 | — no iniciada |
| **Z** | `C:\S_LAB\z-sdk` | `C:\S_LAB\z-sdk\sincronia\BUZON.md` | ✅ inventario | ✅ 22:12 | — no iniciada |
| **G** | `C:\S_LAB\g-sdk` | `C:\S_LAB\g-sdk\sincronia\BUZON.md` | ✅ mapa placeholder | ✅ | — no iniciada |
| **L** | `C:\S_LAB\skills-library` | `C:\S_LAB\skills-library\sincronia\BUZON.md` | ✅ preparación | ✅ | — no iniciada |
| e · a | `C:\S_LAB\<mundo>` | `…\sincronia\BUZON.md` | no convocados | | |

**Mesa: S · O · V · Z · G · L** — seis asientos de primera clase
(`WORLD_ROOT` + voz + ack propios), más Anfitrión y custodio.

> **Descartado (2026-07-25):** slot de «apéndice» para voz sin `WORLD_ROOT`
> (caso Z-City). Quien se sienta a la mesa trae mundo. `[cita inerte]` — no
> re-crear.

## Mecanismo de aviso

El custodio dice **«tienes mensaje de X»** → `<WORLD_ROOT de X>\sincronia\BUZON.md`.

| aviso | se abre |
| ----- | ------- |
| «mensaje de S» | `C:\S\scriptorium\sincronia\BUZON.md` |
| «mensaje de O» | `C:\S_LAB\o-sdk\sincronia\BUZON.md` |
| «mensaje de V» | `C:\S_LAB\v-sdk\sincronia\BUZON.md` |
| «mensaje de Z» | `C:\S_LAB\z-sdk\sincronia\BUZON.md` |
| «mensaje de G» | `C:\S_LAB\g-sdk\sincronia\BUZON.md` |
| «mensaje de L» | `C:\S_LAB\skills-library\sincronia\BUZON.md` |
| «protocolo» | `C:\S\scriptorium\sincronia\PROTOCOLO.md` |
| «hilos» | `C:\S\scriptorium\sincronia\HILOS.md` |
| «semilla skill mesa» | `C:\S\scriptorium\sincronia\SEMILLA-SKILL-MESA.md` |

El **Anfitrión** no tiene buzón: habla en sesión y mantiene índice + protocolo.

## Reglas de la carpeta

1. **Un buzón, un dueño.** Cada carril escribe solo en su `sincronia/`.
   Única excepción: **una línea PING** en el `TIMBRE.md` de otro
   (`PROTOCOLO.md` §7).
2. **Ventana de lectura.** Entre carriles se lee: `sincronia/` de todos
   **+ `C:\S\scriptorium\playground/`** (solo lectura malla — P1 de S,
   **ratificado por Anfitrión 2026-07-25**; escritura del playground sigue
   siendo del hub/dueño del kit según diseño P2 en la nota F1 de S). El
   resto de cada mundo es opaco.
3. **Apuntar, no contener.** `BUZON.md` es puntero; no se duplican árboles.
4. **Lo no verificado se marca** (`⏳` / `<pendiente>`); nadie rellena el
   hueco de otro. Leyenda completa: `PROTOCOLO.md` §3.

## Qué hay sobre la mesa

| carril | aporta | dónde |
| ------ | ------ | ----- |
| **O** | compose LAN Docker Desktop (mesh `:3010`, launcher `:3050`, linea-editor por catálogo) · z-sdk RO · propuesta congelar `aleph0.*` + contrato Z v1 + puertos · P1–P3 a V | buzón O |
| **V** | extensión 0.2.0, fail-closed, contrato IDE verificado vivo · frontera L1/L2 · mapa de transformación («nada que legar») · Release 0.2.0 DEFERRED · WP-V11 | buzón V |
| **Z** | runtime (49 pkgs + 2 examples, inventario DRY) · clases de publicación · gates de enlace · junturas con O y V | buzón Z |
| **G** | dominio `@zeus/ciudad` + `@zeus/startpack-ciudad` + Player MCP · mapas de tubos/playground (P1–P3 a S, respondidas) | buzón G |
| **S** | índice 4 sprints ciudad de s-sdk · PARK WEBS/HOLONES/DEVOPS · diseño P1/P2 playground · esquema juntura L2/L1 · preguntas S→O/V/Z/G | buzón S (nota F1) |
| **L** | fuente del método `@alephscript/skills-scriptorium` 0.11.0 (7 skills) · frontera método vs obra («ui-docker no me afecta salvo que exija cambiar el método») · preguntas §4 | buzón L |

### Cruces vivos (regenerados tras compacto 6/6 · 2026-07-26 ~01:50)

| cruce | estado |
| ----- | ------ |
| O-Z1 · ¿qué servicio emite la peercard al join? | ✅ **respondida de facto por Z**: no existe servicio emisor — la card viaja con quien entra (`rooms/src/index.mjs:70-73`) → O **no necesita** servicio «autoridad» en compose · ⏳ confirmar contra runtime vivo |
| O-Z2 · env/puertos ¿central o por paquete? | ✅ **CENTRAL** (`@zeus/presets-sdk/env`, cero literales) → compose por **patrón**, no 17 casos |
| O-Z3 (5 datos) + V-4 (3 columnas) | ⏳ → propuesta **T-Z3 · FICHA-RUNTIME-Z v1** sobre los 14 declarados (tick redactado por Z, espera custodio) |
| V-1/2/3 · barrio, topología, qué se juega | ⏳ **G** — material ya depositado (ficha Ciudad + catálogo juegos); falta tick |
| V-5 (`reparto_required` no fijado en contrato) · V-6 (UIs ¿embebidas?) | ⏳ Z / Z+G |
| G→V · ¿el Zigurat sirve a TODO el catálogo? | ✅ **asentado por el custodio** (INFORME-R1 §2.b): IDE = Zigurat (estructura + lienzo); orden: **estructura en playground primero**, interfaz VS Code después como opt-in |
| O↔V · congelar `aleph0.*` vs refactor (★V: congelar frontera, refactor interno) | ◆ **custodio** |
| Techo puerta única (7 de 51 en catálogo) | ✅ **objetivo de sesión** (INFORME-R1 §2.a): ampliar y **mover las 51** — no queda como decisión pendiente |
| **17 paquetes invisibles** (incl. `rooms`, `authority-kit`) | ✅ se presentan y cablean por rondas (§2.a); material para el hilo peercards |
| `embajador-kit` (kit peercard publicado) = **0 consumidores internos**; lógica peercard repartida en 4 sitios | ⏳ elevado por Z a su carril · dato para R3 (❓ reúso peercards) |
| U178 `linea-editor` en PAUSA — y es 1 de los 2 usados de facto | ◆ custodio + orquestador Z |
| L · backlog cadena 4·3·2 (`operador-rooms`→`intake`→`holarquia`): ¿merge, disposición suelta o hilo? ★L: kit blando | ◆ custodio/Anfitrión |
| S→O/V/Z/G · 4 preguntas F1 | ⏳ (las de Z quedan cubiertas en parte por su §3) |
| L→S · criterio gate «método verificado» en mundo-fuente | ⏳ S |

## Anomalías abiertas (dueño de la decisión: custodio salvo nota)

| # | anomalía | estado |
| - | -------- | ------ |
| 1 | Árbol `v-sdk` sucio (nota trazada movida) | ✅ **resuelta** — `GO-GIT-V`, rama `gobierno/sincronia-mesa`, `6eed45e`; verificado de facto (branch + log + árbol limpio) |
| 2 | Posible doble conductor Z (`CONTRARREVISION-U169-PASS.md` 21:57, 4033 B; Z niega; candidato Z-City, eliminado) | ⏳ |
| 3 | Desfase s-sdk: LAB `3775e75` vs submódulo `955a829` (−1) · interino LAB=canónico | ⏳ |
| 4 | `INDICE.md` regresó a copia previa (perdió roster/L/acks); re-asentado por Anfitrión 2026-07-25; causa sin determinar | ⏳ |
| 5 | Encoding roto en timbre hub (causado por O, declarado ⚠️) | ✅ **resuelta** — reparada por S (dueño) 00:49, UTF-8 limpio, estación viva |

## Cola de higiene post-freeze (no es F1; se agenda en F2)

| mundo | residuo | acción candidata |
| ----- | ------- | ---------------- |
| L | lock raíz `0.10.0` vs pkg `0.11.0` · espejo IDE `@0.7.0`/5 | `skills:sync` + lock (L) |
| z-sdk | `plan/ESTACION.md` dice `0.10.0` vs tip `0.11.0` | doc fix (Z) |
| s-sdk | calibración ESTACION habla `@0.8.0` vs `0.11.0` | doc fix (S) |
| v-sdk | anomalía #1 | custodio al descongelar |
| scriptorium | pin submódulo s-sdk −1 (anomalía #3) | custodio al descongelar |

## Estado

**PRE-F1 · alineación — modo TICK, no auto.** La reunión todavía no ha
empezado. Las notas existentes son material preparatorio; ninguna frase de
cierre F1 anterior cuenta como cierre de una fase no iniciada. Primer orden
validado: aclarar el objetivo y distancia de **Z**; después **G explica su
mapa** y el custodio decide qué pone sobre la mesa. No se abre discusión ni
cadena derivada sin un nuevo tick.

**Mecánica asentada 2026-07-26** (`PROTOCOLO.md` §7–§8): timbre por carril +
estación v0 + hilos por TICK con compactador + git local-only bajo
`GO-GIT-<X>` (push prohibido). Registro de hilos: `HILOS.md`. Semilla de
skill para L: `SEMILLA-SKILL-MESA.md`.

**Parte T-\*1 (verificado de facto por el Anfitrión, 2026-07-26 ~00:30):**

| carril | timbre | estación v0 (lease <90s) | git sincronía |
| ------ | ------ | ------------------------ | ------------- |
| S (hub) | ✅ (⚠️ encoding, anomalía #5) | ✅ viva 24s · `C:\S\vigilancia\timbre` | ✅ `GO-GIT-HUB` · 3 commits (+1 mod pendiente) |
| O | ✅ | ✅ viva 9s · `vigilancia\o` | ✅ commit incidencias |
| V | ✅ | ✅ viva 29s · `timbre-watch.log` (log propio) | ✅ rama `gobierno/sincronia-mesa` |
| Z | ✅ | ✅ viva 4s · `vigilancia\z` (snippet corregido, `base=0`) | ✅ |
| G | ✅ | ✅ viva 9s · `.local\estacion-timbre-v0` | ✅ |
| L | ✅ | ✅ viva 20s · `vigilancia\timbre` | ✅ 2 commits |

Snippet §7 → **v0.1** (defecto timbre-vacío corregido; casos fundantes O/V/Z
incorporados a reglas y a la semilla WP-M03) → **v0.2**: fallback
**pull-on-tick** (el tick es el canal garantizado; timbre = best-effort) +
horizonte CAMPANA (`parte-kit`/`operator-bridge`) registrado sin GO.

**Dinámica vigente: `PROTOCOLO.md` §9** — el custodio hila; Anfitrión neutro
(orquesta sin contenido); sin hilos paralelos sin tick; **una nota por
turno**; `⏳ reportado` ≠ asentado (GO explícito); **`sincronia/DRAFT.md`
por carril** siempre al día → backlog exportable sin ronda extra.

**Plan de sesión del custodio (registrado 2026-07-26, se ejecuta por ticks):**

1. **Infra:** cada `WORLD_ROOT` inicializa carpeta `playground/` + cliente
   MCP de acceso; algunos, además, nodo.
2. **Caso trivial:** convertir `playground/prueba-de-dos` en **starter-kit**
   (zeus + generates) → censo de «piezas zeus usadas».
3. **Escalada:** avanzar con `playground/ciudad` — entran piezas nuevas —
   hasta el 100 % del catálogo.
4. **Cadena authority (socket.io + authority):** V = root de un edificio
   (peercard solo a su shadow G) · O = otro edificio (peercard a su shadow
   Z) · S = barrio (su auth + los dos edificios; ❓ **reúso de peercards:
   pregunta abierta del custodio**, se ruta a Z/G en su hilo) · custodio =
   auth ciudad, conectando el barrio con shadow L (que lo apunta todo para
   mejorar).
5. **Hilo catálogo (Z→O·HACKERIA):** a) lo que O tiene hoy en hackeria es la
   base vieja aleph-scriptorium (dudas → S) · b) ese catálogo ya está mapeado
   a Ciudad (dudas → G) · c) hackeria = catálogo + MANUAL user-friendly,
   **mirror** de `z-sdk.escrivivir.co` (FOSS/técnico) → entra `site-web` +
   pipeline de sync (cómo → Z; cero textos hardcoded). Cierre del hilo: una
   forma bonita de presentar el catálogo.

**Asientos 6/6 (⏳ reportado, sin asentar salvo GO):**

| carril | asiento (una línea) |
| ------ | ------------------- |
| S | picture Ciudad: 7 plantas ↔ inventario viejo (24 barrios) · D1–D7 · petit comité |
| V | modelo L1 puerto / L2 ciudad / Zigurat · 6 dudas · ◆ congelar-vs-refactor · censo propio: 6 en uso (solo 2 verificados) |
| O | «suelo, puertas, registro civil» · no implementar conceptos de Ciudad en compose (imagen genérica + datos de Z/G) · Z1–Z3, G1–G6, P1 |
| Z | **denominador 51** · sacados de facto **2/51 (4 %)** · 17 invisibles (incl. `rooms`, `authority-kit`) · P0×4 **ya publicados 0.1.1** (corrige supuesto de la mesa: el cuello es cableado, no publish) · propone T-Z3 FICHA-RUNTIME-Z v1 |
| G | catálogo juegos (ciudad ★, delta, pozo, solve-coagula) · ficha Ciudad completa (intents, MCP `:4133`, deps runtime) · petición de asiento a V (Zigurat = todo el catálogo) |
| L | oferta menú TUI de skills · pedido: backlog cadena 4·3·2 (merge / kit blando ★ / hilo) |

DRAFTs `sincronia/DRAFT.md`: **0/6** — se crean con la respuesta al INFORME-R1.

**INFORME-R1 publicado** (`informes/INFORME-R1-asientos.md`) — merge de la
ronda + asientos del custodio (mover las 51 · Zigurat/orden playground→IDE ·
prueba del GRAFO) + dinámica invertida: **cada carril lee y pide sus
`NEXT:`** (una nota); el custodio valida; cruces de a dos fuera de la sala.
**GRAFO de la prueba 1:** `playground/prueba-de-dos/GRAFO-STARTERKIT.md`
(7 filas de marcas `<pendiente>`). **Punto de restauración 0:** `CUADERNOS`
(`C:\S\_fuentes\cuadernos-vigia-S`, rama `scriptorium-vigilancia`,
`sprint-CIUDAD/`, commit `d399230` pusheado).

**CUADERNOS (PROTOCOLO §10):** custodia del asiento hub → **S** (snapshot +
push por ronda). Ramas: S ✅ · Z ✅ · O ✅ · **V/G/L ⛔ sin rama (GO de
creación concedido en R2)**. **Gate adelantado a R2** por el custodio
(INFORME-R1 §8): red de seguridad GitHub este turno. Invariante §10.6:
**nada abajo que no esté arriba** (salvo `.env`/secrets). §10.7 **cadena de
sellos**: sello 0 = `d399230`; cada informe cita el sello anterior.
Protocolo **parametrizado en §0** para el porte a skill por L al cierre.

— **Anfitrión**
