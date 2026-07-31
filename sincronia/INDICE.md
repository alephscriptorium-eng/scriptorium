# ÍNDICE · mesa de sincronía

Hub de la mesa. **Apunta, no contiene**; compacto por doctrina (§3): la
historia vive en la cadena de sellos de `CUADERNOS`.
Tema: **crecimiento holón de unidades `ui-docker`, LAN → WAN** ·
sprint **CIUDAD** (docs; objetivo: **crear** los backlogs y mover las
**51 piezas** de Z del 4 % al 100 %).
Contrato completo: [`PROTOCOLO.md`](PROTOCOLO.md) §0–§11.

## Quién es quién

| voz | es | canal |
| --- | -- | ----- |
| **custodio** | humano · valida ticks, da GO | consolas |
| **Anfitrión** | hub `C:\S` · neutro · mantiene sala, merjea, no decide fondo | sesión + estos ficheros |
| **S O V Z G L** | carriles · un mundo cada uno | sus buzones |
| **Temis** | auditor en sombra (§11) · cura entregas en la pausa del tick | meta (fuera de sala) |

Reparto de ronda: **O**+shadow **Z** · **V**+shadow **G** · **L** notario ·
S+Anfitrión+custodio velan. Modo **TICK** (`NO_TICK_VALIDADO=NO_PROCESAR`).
Identidad: anúnciate/firma; nombre cruzado → aborta (§1–§2).

## Buzones · CUADERNOS · estado R2

| carril | `WORLD_ROOT` | rama `CUADERNOS` | tip ✅ | R2 |
| ------ | ------------ | ---------------- | ------ | -- |
| S | `C:\S` (vela `s-sdk`) | `scriptorium-vigilancia` | `6b2ba25` (sello R2 `37c675a`) | ✅ |
| O | `C:\S_LAB\o-sdk` | `o_sdk-vigilancia` (censo corregido: `o_sdk` = rescate ajeno, intacta) | `9b94422` (verif. O `e451926`, ancestro ✓) | ✅ + addenda |
| V | `C:\S_LAB\v-sdk` | `v_sdk-vigilancia` | `7ad07ea` | ✅ |
| Z | `C:\S_LAB\z-sdk` | `z_sdk-vigilancia` | `e21c0dd` | ✅ |
| G | `C:\S_LAB\g-sdk` | `g_sdk-vigilancia` | `a0dfa3c` | ✅ |
| L | `C:\S_LAB\skills-library` | `skills_library-vigilancia` | `76a1165` | ✅ |

Buzón = `<WORLD_ROOT>\sincronia\BUZON.md` · aviso: «mensaje de X» → ese
fichero · «protocolo» / «hilos» / «semilla skill mesa» → ficheros homónimos
de esta carpeta. **Espejo GitHub: 6/6** ✅ (queda delta de sala → próximo
sello). Grafo prueba-1: **0/7 marcas**
(`playground/prueba-de-dos/GRAFO-STARTERKIT.md`).
**Watchers: PARADOS hasta nueva orden** (custodio hace de timbre; estado se
refresca desde el handoff/informe del orquestador en cada tick).

## Reglas (resumen; contrato en PROTOCOLO)

1. Un buzón, un dueño — única excepción: 1 línea `PING` en timbre ajeno (§7).
2. Ventana de lectura entre carriles: `sincronia/` de todos + `playground/`.
   Resto de mundos: opaco. (Temis: lectura omnímoda `C:\S`+`C:\S_LAB`.)
3. Apuntar, no contener · compactar y reemplazar (§3).
4. `⏳`/`<pendiente>` no se rellenan por inferencia · fuentes: **curado
   manda** (§5) · una nota por turno · DRAFT.md al día con `BLOQUEA:`.

## Sobre la mesa (asientos R1, comprimidos)

| carril | aporta |
| ------ | ------ |
| O | suelo/puertas/registro · compose por patrón (env central `presets-sdk`) · sin servicio autoridad (card viaja con quien entra) |
| V | Zigurat (estructura+lienzo; playground ANTES que IDE, opt-in) · REFACTOR concedido · censo propio 6 usadas/2 verificadas |
| Z | denominador **51** · sacadas de facto 2 · 17 invisibles (`rooms`, `authority-kit`) · P0×4 publicados · catálogo 14/7 |
| G | catálogo juegos (ciudad ★) · ficha Ciudad (MCP `:4133`, intents, deps) |
| S | picture 7 plantas ↔ 24 barrios · 4 sprints ciudad indexados · PARK WEBS/HOLONES/DEVOPS |
| L | fuente método `0.11.0` · cadena 4·3·2 propuesta (★ kit blando) |

## Vivo (cruces ⏳ · decisiones ◆)

| ítem | estado |
| ---- | ------ |
| **O↔V zanjable**: O entregó los 4 datos — el acoplamiento **no existe en código** («hoy no hay consumo»); V libre para su REFACTOR interno; única interfaz futura = O-c↔O-d (nace nueva, se diseña) | ◆ declarar zanjado |
| **U93 confirmada de facto por Z** (`peer-card-gate.mjs`: sin card no hay ni `room-join`) · propuesta 3 capas + CA×4 (clave: card inválida **rechaza**, no degrada) → `Z-D4` | ⏳ tick refactor (post-mesa) |
| **Entrada al grafo — reconectada**: la ◆ de V (¿`rooms` o `signaling`?) la responde `Z-D1`: entrada por `socket-server`+`rooms` (`CLIENT_REGISTER`, 2 modalidades) → el riesgo de WP-V18 se disuelve si Z-D1 confirma en runtime | ⏳ **Z-D1 = prerequisito de las 7 marcas** |
| **VOLUMES — mapa cerrado en el lab**: Z verificó contrato (`synthetic-fixtures-only`, 4 slots, DISK_01/04 diferidos por diseño) + host sin root ni env; Temis verificó S/G ✅ sin contradicciones. **Idea-fuerza elevada (Temis): VOLUMES son del mesh — portar UNA vez la genealogía histórica a un `ZEUS_VOLUMES_ROOT` del Scriptorium** (fuente readonly → import → root común anclado en playground → mismo contrato en VPS) | ◆ custodio declara: fuente histórica = OASIS/SCRIPTORIUM_V0 (⏳) · VPS volumen datos (⏳) · quién censa OASIS (fuera de alcance de todos) |
| **Z-D6**: falso dilema resuelto (kit npm + pack Release complementarios) · **G ya midió**: Σ 6 packs ~32 kB tgz / volumes ~50 kB; mockdatas 64 kB/656 kB; corpus histórico fuera de tarballs · **★ G propone C1 normativo** (el riesgo es el primer corpus >1 MB, no hoy) · falta la mitad de Z (`loadStartPack`/contrato import, viene en R7-Z) → cruce dentro de H-01 · C8 README tras frontera · nada se publica sin CA de canal limpio | frontera C1/C2: **decide la mesa** (en H-01, compactada) |
| **Lectura cruzada por hilo** asentada (§8): el TICK de hilo puede conceder `LECTURA=<rutas RO>` recíproca acotada — pedida por Z (evitar «consenso sobre declaraciones mutuas»); backstop = auditor omnímodo vía informe | ✅ |
| GATE POST-R3: **6/6 ✅** — tips remotos avanzados verificados (o `66629f0` · v `9ddc977` · z `e493d3b` · g `4d4e790` · L `c9ecd2b` · hub `e587641`) | ✅ red de seguridad completa |
| **H-01 · circuito de compacto EN CURSO**: borrador de S ✅ (`notas/COMPACTO-volumes-concepto.md`, apto-tras-ajuste según pre-análisis meta) → **Z verifica técnico ⏳ → L notaría ⏳ → Temis contraste final** (warnings sellados en META, sin filtrar — Opción B del Anfitrión: independencia de roles se respeta y se mide) → mesa decide → custodio valida → informe R4 | 🔶 |
| **Directriz de equilibrio (custodio)**: especificación > organización interna · consensos cuanto antes · **backlog real en `plan/` de cada world_root** = destino inmediato post-compacto (F2: DRAFT → plan/BACKLOG con check final) | vigente |
| **Relay/payload — VEREDICTO (Z, con cita)**: contenido **NO PUEDE** (misma referencia, `relay.mjs:37,:7`) · sobre SÍ · paso SÍ (allowlist 8 + `MAKE_MASTER` suprimido, **descarte silencioso**). **El modelo de O se sostiene** en contenido; fallan 2 cosas: bridge = cuello con corte sin traza (riesgo #1 de O realizado → CA punto 5) · **colapso de identidad** (`scriptorium-bridge` único + secreto compartido: el transporte borra de quién viene) → `Z-D7` → hilo peercard | ✅ respondida · avisos al hilo/mesa |
| **6 líneas de investigación de Temis — todas elevadas, ninguna decidida** (orden del custodio: decisión de equipo): ① genealogía OASIS (censo) ② root único local (3 ubicaciones candidatas) ③ paridad local↔VPS (contrato, no path) ④ evolución segmentador Python→U80→U81→U176 ⑤ matriz Z-D5 9 campos ⑥ S/G proyectan sus DRAFTs si se adopta la dirección | ⏳ equipo · retick Z integra ⑤ |
| **CERCO v2** asentado (§10.8): 4 clases — histórico se porta · provenance inerte · **peer/relay del contrato = endpoint vivo permitido** · runtime local-first. Corrige la lectura amplia que aislaba la red | ✅ |
| **HILO: VOLUMES-CONCEPTO** (mesa completa) — adaptador local-first con replicación P2P: 3 formas de root (se preservan) · contrato 10 temas · drivers por familia · **tres momentos: instalar (kit npm) → sembrar (pack Release) → sincronizar (P2P)** — absorbe el ◆ ancla-vs-volumen · 7 preguntas de apertura · shape con familia fixture, sin mover OASIS | **decide la MESA** — H-01 listo; primer acto del hilo: confirmar COMPACTADOR (★ Z o S) |
| Mesa Z+S+G+O → L a skill: `GATE-O-CLAVES` (+ ★ W-1 de V: inspeccionar **artefacto final**, caso empírico R6-V) · federación por tramos · modelo nodo/relay | ⏳ tick mesa + COMPACTADOR |
| Hilo peercard-reúso (`Z-D2`, con G) — reformulado tras §2.a: qué cambia si la base es anónima | ⏳ TICK + COMPACTADOR |
| Segunda puerta / catálogo 7→51 (`Z-D3`) — aparcado tras holón-7 por el propio Z | cola |
| Saneamiento credenciales O | ⛔ **denegado y cerrado por custodio** — solo planificación; `GATE-O-CLAVES` sigue como diseño |
| Encargo B.3 → **WP-V26** (editor de config de la demo, dep O-c) · env demo **validado por Z** con condición: **generar desde `presets-sdk/env`, no transcribir** · formato ★ `.env` plano | ✅ aceptado · a backlog al cierre |
| O-j **proyectado por mano de O** (j.1 modelo · j.2 `CA-ANTI-AUTORIDAD`×5 · j.3 U93 como dep. Z) — frontera de autoría cumplida | ✅ |
| Solape observabilidad V↔O: **no hay** (transporte/O vs dominio/V — cerrado por custodio) · wishlist V: W-1 (→mesa claves) · W-2 (conejillo Forgejo Actions) · W-3 (criterio UI) | ✅ / ★ registradas |
| R-1 (regla 15 inunda logs con espejo skills) — fix de método al porte de L | ⏳ · watchers parados |
| L: kit 4·3·2 (◆) · 3 asientos post-mesa bajo WP-L-02 · GO boot estación (⏳) | ◆/⏳ custodio |
| S: **sello R3 pendiente** (capturará INFORME-R2+§11+compactación+R4/R5) · timbre hub 2 líneas · NEXT: ¿indexa cantera→generate en molde (docs)? | ⏳ tick S |
| Regla PING (`printf`+rutas `/`) ◆ (baja prioridad: custodio es el timbre) · L→S criterio gate mundo-fuente ⏳ | menor |
| Anomalías: doble conductor Z · desfase s-sdk (−1) · índice pisado | ⏳ custodio |
| Higiene post-freeze: lock L · ESTACION Z/s-sdk | cola F2 |

## Estado

**Informe vigente: [`informes/INFORME-R5.md`](informes/INFORME-R5.md)**
(R1–R4 [cita inerte]). **SESIÓN SWARM EN CURSO (2026-07-31)**: GO del
custodio a ejecución por olas; **Anfitrión orquesta** workers background
(`swarm-orquestacion` v0.7 · claim de carriles Z·V·G·L, consolas dispose).
Decisiones **②③④⑤ tomadas y asentadas** (`plan/PLAN-SCRIPTORIUM-V1.md`);
① ratificación **progresiva por GO de ola**. **▶ SWARM DESCONGELADO
(2026-07-31, tras el reinicio)** — restauración verificada: los 6 tips del
freeze intactos y worktree `v-v66` conservado.
**Historia del freeze: [`FREEZE-2026-07-31.md`](FREEZE-2026-07-31.md)** (ya
consumido; vale como procedimiento para el próximo).
**En vuelo:** Z·**U204** (driver FIREHOSE, carril D 6/8) · V·**V66** (corrección
de la devolución, misma rama). **Encolado al final:** intake `WPS_QUEUE` de S
(ficha y cerco en `s-sdk/WPS_QUEUE/ENCOLADO.md` · puntero Z `U244`).

Resumen: **Ola 0 4/4 ✅** (+V77/V78) · **Ola 1 11/11 ✅** · **Ola 2 10/11 ✅**
(V66 **devuelto** por contrarrevisión: 3 bypass no cazados — obra viva en
rama, no en main; corrección en vuelo) · **carril D 5/8** (U199→U203; U204
despachado). Gates: G1-Z ✓ · G2-Z ✓ (matriz-51 verde sobre main integrado) ·
R7-V parcial (arnés local verde, run CI ⏳). **Grafo: 1/7 marcas** — fila Z
estampada con evidencia de runtime. **Gate V21 ABIERTO**: la UI de V puede
construirse sobre la estructura de playground. 8 contrarrevisiones
adversariales (6 PASS · 2 devoluciones, una ya corregida y aceptada).
Cero trabajo sin commitear · todo lo aceptado en GitHub. Push por ola/agrupación con GO
(evitar push-force). O al final (VPS/PODs diferidos: U209→P2 · U243).
Detalle: `notas/NOTA-ANFITRION-2026-07-31-swarm.md`.
Vivos: Z-D1/grafo 0/7 · CA canal limpio · CA local-first · segundo acto
C-6 · anomalías menores en cola. Watchers parados · espejo 6/6 · cadena de
sellos íntegra hasta R5b (`b79e0e3`).

— **Anfitrión**
