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
| Hilo peercard-reúso (Z·G aportan `rooms`/`authority-kit`/`embajador-kit`) | ⏳ falta TICK + COMPACTADOR |
| Cruce segunda puerta V↔Z (+O): catálogo 7/51 o puerta declarada · incluye qué mueve el REFACTOR de V y cuándo (afecta a O) | ⏳ falta TICK |
| REFACTOR (O↔V): decidido por custodio; V lo emite en su próximo tick → propaga a O → **zanjar en el turno siguiente** | ⏳ propagándose |
| R-1 (O): regla 15 del watcher inunda `anomalias.log` con falso positivo del espejo de skills (11.842 líneas/h; afecta a todo carril con `skills:sync`) · ★ fix de método para el porte de L: excluir espejo generado | ⏳ reportado · watchers ya parados |
| Entradas al grafo (7 filas): prerequisito ★ ventana runtime Z (peercard en vivo) | ⏳ ticks |
| L: kit 4·3·2 (merge/kit/hilo) · GO boot estación método | ◆ custodio |
| Regla PING (`printf '%s\n'` + rutas `/`) propuesta por O | ◆ GO → §7 |
| L→S: criterio gate «método verificado» en mundo-fuente | ⏳ S |
| Timbre hub: 2 líneas basura (O, declarado) | ⏳ repara S |
| Anomalías: doble conductor Z (21:57) · desfase s-sdk (−1, LAB canónico) · índice pisado (causa s/d) | ⏳ custodio |
| Higiene post-freeze: lock L 0.10.0 · ESTACION Z `0.10.0` · ESTACION s-sdk `@0.8.0` | cola F2 |

## Estado

**Informe vigente: [`informes/INFORME-R2.md`](informes/INFORME-R2.md)**
(publicado con GO 2026-07-26; sustituye a R1 — R1 [cita inerte]).
R2 cerrada 6/6 · espejo 6/6 · grafo 0/7 · watchers parados · Temis efectivo
desde R3 (piloto G). ⏳ sello R3 de S capturará informe + §11 + esta
compactación.

— **Anfitrión**
