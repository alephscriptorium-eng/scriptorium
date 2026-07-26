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
| **Z-D6 reencuadrado (Temis)**: A/B era **falso dilema** — npm kit FOSS + Release pack autocontenido son complementarios desde fuente/notario únicos (evidencia: `publishConfig` ×6 + `notario-release.mjs` dual). ◆ queda la **frontera `volumes/`: C1 (★ discutir primero) vs C2** — G mide tarballs, Z define import/`loadStartPack`, O consume. C8 del README se corrige tras la frontera; nada se publica sin CA de canal limpio | ◆ G+Z+custodio |
| **Relay/payload — VEREDICTO (Z, con cita)**: contenido **NO PUEDE** (misma referencia, `relay.mjs:37,:7`) · sobre SÍ · paso SÍ (allowlist 8 + `MAKE_MASTER` suprimido, **descarte silencioso**). **El modelo de O se sostiene** en contenido; fallan 2 cosas: bridge = cuello con corte sin traza (riesgo #1 de O realizado → CA punto 5) · **colapso de identidad** (`scriptorium-bridge` único + secreto compartido: el transporte borra de quién viene) → `Z-D7` → hilo peercard | ✅ respondida · avisos al hilo/mesa |
| **6 líneas de investigación de Temis — todas elevadas, ninguna decidida** (orden del custodio: decisión de equipo): ① genealogía OASIS (censo) ② root único local (3 ubicaciones candidatas) ③ paridad local↔VPS (contrato, no path) ④ evolución segmentador Python→U80→U81→U176 ⑤ matriz Z-D5 9 campos ⑥ S/G proyectan sus DRAFTs si se adopta la dirección | ⏳ equipo · retick Z integra ⑤ |
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

**Informe vigente: [`informes/INFORME-R3.md`](informes/INFORME-R3.md)**
(R1/R2 [cita inerte]). VOLUMES: mapa cerrado (lab limpio ✅✅ · fuente
histórica OASIS censada · root VPS existe, ruta ⏳) · relay respondido ·
O↔V **zanjado** · **cerco exterior** asentado (§10.8) · ⛔ **GATE POST-R3
en curso**: bitácora + compactar + push × 6 carriles + hub. ◆ vivas: canal
packs (A/B) · ancla-vs-volumen (O) · ruta root local/VPS · retick R7-Z
(7 correcciones de censo). Grafo 0/7 (espera Z-D1). Temis: censo OASIS ✅,
pasadas privadas con custodio entre rondas.

— **Anfitrión**
