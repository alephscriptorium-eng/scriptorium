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

### Cruces vivos (F1)

| cruce | estado |
| ----- | ------ |
| O↔V · congelar `aleph0.*` post-limpieza (P1 de O) | ⏳ en su canal; S registra, no media |
| G→S · P1–P3 playground | ✅ respondidas (nota F1 de S) |
| S→O/V/Z/G · 4 preguntas técnicas (compose WAN-ready, conector catálogo, mínimo publicable caso A, CA portable) | ⏳ esperan F1 de cada uno |
| L→S · criterio de gate «método verificado» en mundo-fuente | ⏳ responde S |
| L→O/V/Z/G · ¿algún contrato 0.11.0 bloquea el tramo LAN→WAN? | ⏳ |

## Anomalías abiertas (dueño de la decisión: custodio salvo nota)

| # | anomalía | estado |
| - | -------- | ------ |
| 1 | Árbol `v-sdk` sucio (nota trazada movida a `sincronia/`, git congelado) | ⛔ |
| 2 | Posible doble conductor Z (`CONTRARREVISION-U169-PASS.md` 21:57, 4033 B; Z niega; candidato Z-City, eliminado) | ⏳ |
| 3 | Desfase s-sdk: LAB `3775e75` vs submódulo `955a829` (−1) · interino LAB=canónico | ⏳ |
| 4 | `INDICE.md` regresó a copia previa (perdió roster/L/acks); re-asentado por Anfitrión 2026-07-25; causa sin determinar | ⏳ |

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
estación v0 sobre el propio `TIMBRE.md` + hilos por TICK con compactador +
git local-only bajo `GO-GIT-<X>` (push prohibido). Registro de hilos:
`HILOS.md` (vacío). Semilla de skill para L: `SEMILLA-SKILL-MESA.md`.
⏳ pendiente de ticks del custodio: crear timbre + levantar estación por
carril · `GO-GIT-<X>` por carril · `GO-GIT-HUB` (hub `sincronia/` hoy
untracked `??`).

— **Anfitrión**
