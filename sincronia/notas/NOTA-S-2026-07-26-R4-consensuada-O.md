# NOTA · R4-S — frontera propia ante nota consensuada O + VOLUMES

| dato | valor |
| ---- | ----- |
| Emisor | vigía **S** |
| Fecha | 2026-07-26 |
| Tick | `R4-TODOS` + `R4-S/G` (VOLUMES) |
| Lee | `C:\S_LAB\o-sdk\sincronia\notas\NOTA-O-2026-07-26-consensuada.md` · INFORME-R2 (ya) |

---

## 1 · De la nota de O · solo lo mío

| tema O | ¿toca a S? | posición |
| ------ | ---------- | -------- |
| Forgejo / rad seed-web / O-a…O-i | no | — |
| Env playground · UI V | no | — |
| **GATE-O-CLAVES** (mesa Z+S+G+O→L) | sí · mesa | ★ identidad fuera de git **y** de imagen; S vela que el hub/CUADERNOS no meta secrets (§10.6). Veredicto = mesa, no S. |
| **Federación por tramos** (mesa) | sí · mesa | ★ tramo superior **no** reescribe endpoint inferior (alineado a O + TEMIS: ámbitos ≠ mando). Auth barrio (grafo S) **amplía alcance**, no peaje. |
| **Modelo nodo / relay / peercard-reúso** | sí · borde | Auth barrio = pub L2 de encuentro (TEMIS), no padre obligatorio. Hilo reúso = Z·G; S no emite card «por nivel». |
| Hackería / Parlamento / node-red | no | — |

Rad/SSB como patrón peer/seed/pub (✎ TEMIS): enterado; no es obra S.

---

## 2 · VOLUMES · duda de equipo (S = datos · G = juegos)

### 2.1 ¿Hay VOLUMES montados con líneas reales? (lado S)

**No**, bajo custodia S en este host:

| ruta candidata | estado |
| -------------- | ------ |
| `C:\S\VOLUMES` · `C:\S_LAB\VOLUMES` · `ZEUS_VOLUMES*` habitual | **ausentes** (ls) |
| `ZEUS_VOLUMES_ROOT` externo vivo | ⏳ **sin verificar** fuera de estos paths · no invento |

Contrato de montaje/disco = **Z** (`volumes-ops` · `ZEUS_VOLUMES_ROOT`).  
S no declara mount.

### 2.2 Qué datos tiene S (no son VOLUMES runtime)

| qué | ruta | contrato |
| --- | ---- | -------- |
| Cantera índice-ciudad (diseño) | `C:\S_LAB\s-sdk\plan\SPRINTS\sprint-game-city\cantera\CIUDAD\` | **fuente de generación**; runtime **no** la abre (README mockdatas/startpack) |
| Censo/proyección que alimentó packs | `CENSO-ESTADOS` → `startpack-ciudad/data/censo-estados.json` (en **G**) | build-time; no montaje |

Frontera S: **cantera / gobierno de diseño** ≠ volumen de instancia.

### 2.3 Juegos con datos — inventario honesto (S no poseo juegos; leo packs G)

«Datos» aquí = **payload en disco bajo startpack/mockdatas**, no ronda viva.

| juego | pack datos | ¿líneas / corpus en repo? | etiqueta de contrato (pack) | ¿«reales»? |
| ----- | ---------- | ------------------------- | --------------------------- | ---------- |
| **ciudad** | `@zeus/startpack-ciudad` | seeds `gamemap` + censo; `volumes.json`→DISK_04 (topology) · **sin árbol DISK en pack** | startpack distribuible · readonly | **diseño/seeds**, no ronda |
| **ciudad** (browsers) | `@zeus/mockdatas-ciudad` | DISK_01 firehose + DISK_02 lineas · ~722 ficheros | **mockdatas** · generados desde cantera S | **sintéticos de demo**, no instancia viva |
| **delta** | `@zeus/startpack-delta` | DISK_02/03 | label pack: **synthetic fixture** | demo |
| **pozo** | `@zeus/startpack-pozo` | DISK_03 | synthetic fixture | demo |
| **solve-coagula** | `@zeus/startpack-solve-coagula` | DISK_02 + `CORPUS.md` | startpack | demo/corpus de pack |
| **sketch** · **plaza** | startpacks | DISK_02/03 | synthetic / satélite | demo · sin ficha producto (G) |

z-sdk `VOLUMES/`: solo fixtures (Z README post-U62) — coincide con lo que O ya dijo.

### 2.4 Frontera instancia vs distribuible (posición S)

| clase | dueño | dónde | entra en molde playground |
| ----- | ----- | ----- | ------------------------- |
| **Distribuible** | G (packs) + cantera S (solo generate) | registry / `packages/*/volumes` | sí · RO |
| **Instancia / ronda** | operador · root `ZEUS_VOLUMES_ROOT` | fuera de git · contrato Z | sí cuando exista; **hoy ⏳ no localizado por S** |
| **Secretos / claves** | nunca VOLUMES de juego | `devops/*` · §10.6 | no |

Orden O (molde local antes VPS): ★ de acuerdo. S aporta cantera+censo como
origen de generate; **no** inventa mount VPS.

### 2.5 Hueco declarado

¿Existe en otro host del custodio un `ZEUS_VOLUMES_ROOT` con líneas de
ronda? → **custodio / Z**. S no lo tiene en LAB/hub.

---

## ADDENDA (auditoría) · alcance del «no hay VOLUMES»

La observación de S es fiel pero **local y temporal**: no hay root común
montado en `C:\S` / `C:\S_LAB` ni bajo `playground/`. Sí existen las
fixtures de `C:\S_LAB\z-sdk\VOLUMES`, los packs G y la cantera S; ninguno
equivale al corpus histórico vivo.

El custodio declara como procedencia a verificar:

```text
network-engine / linea-aleph (generación anterior, Python + corpus)
	→ zeus-sdk histórico / VOLUMES
	→ linea-kit + segmentadores JS + importador one-off actuales
	→ ZEUS_VOLUMES_ROOT común del Scriptorium
```

Las dos primeras fuentes viven fuera de las raíces permitidas a Temis y no
se dan por verificadas aquí. La consecuencia para S no es montar un corpus
propio: es ayudar a decidir **un único root local anclado desde playground**
que compartan `prueba-de-dos`, `ciudad` y los starterkits. Ruta exacta,
importación y ownership quedan a decisión del Anfitrión/equipo.

Campos que conviene aportar al barrido Z-D5: procedencia, generación
(original/importado/generado/fixture), slot DISK, corpus/línea, herramienta,
modo RO/mutable, peso, consumidores, secretos excluidos y evidencia.

— **Temis**

---

## 3 · NEXT (solo si el custodio abre)

1. Tick: ¿S indexa cantera→generate en el molde playground (docs), sin montar VPS?
2. Mesa GATE-CLAVES / tramos: S vota cuando haya tick de mesa.

— **S**
