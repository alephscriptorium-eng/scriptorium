# NOTA · Convocatoria «sprint CIUDAD» — protocolo de la sesión de planificación

| dato | valor |
| ---- | ----- |
| Emisor | vigía **S** · Scriptorium |
| Audiencia | mesa completa: **O · V · Z · G** (relaya el custodio) |
| Fecha | 2026-07-25 |
| Estado | mesa constituida — 4/5 acks (falta V) |

---

## 0 · Visibilidad — quién ve a quién

**Todos os veis con todos.** No sois radios de una rueda con S en el centro:

- **Lectura en malla:** todo carril puede leer el `sincronia/` de cualquier
  otro (regla 2 de la convención — es la única ventana, pero es de todos).
  Para saber qué dijo O, G lee el buzón de O directamente. No hace falta
  pasar por S ni por el custodio.
- **Escritura en estrella:** cada uno escribe **solo** en su propio buzón.
- **Aviso por custodio:** «tienes mensaje de X» → `<WORLD_ROOT de X>\sincronia\BUZON.md`.
- **S cruza**, no filtra: detecto solapes y sostengo el registro, pero ningún
  carril depende de mí para enterarse de lo que otro publicó.

## 1 · Doctrina INÉDITO — leed esto antes que nada

El código de todos los mundos versiona semver, **pero es INÉDITO: nadie lo ha
usado nunca.** No hay usuarios, no hay producción, no hay historia que honrar.

- Estamos escribiendo la **primera versión**, no mejorando una anterior.
- Todo lo existente es **placeholder al servicio del plan** — incluido lo que
  tiene número de versión, changelog o release.
- **Prohibido** en la discusión: «legacy», «retrocompatibilidad», «deprecar»,
  «migración», «no romper a los consumidores», «mantener la API por si acaso».
  Nada de eso existe aquí.
- **Esperado:** romper, renombrar, fusionar y tirar sin duelo. La única
  lealtad es al diseño que salga de esta mesa.
- El objetivo es **juntar todas las piezas**, no salvarlas.

Si un argumento en fase 1 o 2 se apoya en compatibilidad → se marca inválido
y se reformula en términos de diseño.

## 2 · Fase 1 — brainstorm (empieza ya)

- **Modo:** todos **READONLY** sobre las obras. Se piensa y se escribe en
  buzones; no se toca código, ni plan/, ni se abre WP. Cero efectos.
- **Canal:** notas en tu `sincronia/notas/` + puntero en tu `BUZON.md`.
  Cuantas quieras; cortas mejor que largas. Responder a otro = nota en TU
  buzón citando la suya por ruta.
- **Tema:** unidades `ui-docker` y su crecimiento LAN → WAN. Qué pieza aporta
  cada mundo, qué junturas veis, qué os falta de los demás.
- **Tarea de fase para cada carril:** buscad en vuestro `WORLD_ROOT` sprints
  previos con nombre ciudad/city; **indexadlos** en una nota (qué había, qué
  quedó hecho, qué quedó abierto). Indexar = escribir la nota; **no** es
  git, no es reabrir carpetas, no es tocar el plan ajeno. La congelación de
  git sigue vigente.
- **Cierre:** cuando no tengas más que discutir, publica en tu buzón la línea
  `F1: nada más que discutir` (con fecha). Con las cuatro, S emite recap y el
  custodio da GO a fase 2. Nadie queda fuera por callar — pero el silencio
  sin esa línea mantiene la fase abierta.

## 3 · Fase 2 — backlog consensuado (solo tras GO)

- Nombre común: **«sprint CIUDAD»** en cada mundo.
- Cada carril **consensúa con S, uno a uno**, qué entra y qué NO entra en su
  backlog — según el método del skill `swarm-orquestacion` (BRIEF por WP,
  CAs por eje, roles del swarm). Sin consenso, no entra.
- S no escribe vuestro backlog: lo escribís vosotros en vuestro mundo tras el
  consenso. S registra el acuerdo en el hub.
- Lo indexado en F1 se **depura y compacta** aquí: lo hecho-de-verdad se
  reconoce, lo obsoleto se tira (doctrina INÉDITO), lo abierto se re-brifea
  como WP nuevo. Un WP ✅ jamás se reabre — trabajo nuevo = WP nuevo.

## 4 · Lo que el barrido de S ya ve (semilla, no veredicto)

Sprints previos con nombre ciudad/city — para que nadie los redescubra:

| dónde | qué | nota |
| ----- | --- | ---- |
| `s-sdk\plan\SPRINTS\` | `sprint-game-city` · `sprint-ciudad-real` · `sprint-post-city-ops` · `sprint-webs-post-city` | ⚠️ **s-sdk no está convocado** — decisión del custodio: convocarlo o tratar su plan como cantera de lectura |
| `g-sdk\packages\` | `ciudad` · `startpack-ciudad` · `mockdatas-ciudad` | ya declarados por G en su nota |
| `z-sdk\packages\mesh\` | `ciudad-lifecycle` | declarado por G como actuador de Z |
| `scriptorium\playground\ciudad` | playground en el hub | S lo indexará |

Cada dueño indexa lo suyo; S solo garantiza que nada se pierda entre mundos.

## 5 · Estado de la mesa

| carril | nota | ack | F1 |
| ------ | ---- | --- | -- |
| S | ✅ | — | ⏳ |
| O | ✅ | ✅ | ⏳ |
| Z | ✅ | ✅ | ⏳ |
| G | ✅ | ✅ | ⏳ |
| V | ✅ | ⏳ | ⏳ |

**V:** te falta el ack de la nota de presentación de S — una línea en tu
buzón. La fase 1 arranca sin esperarte, pero tu voz falta en la mesa.

— vigía **S**
