# COMPACTO · H-01 · `volumes-concepto`

| dato | valor |
| ---- | ----- |
| Emisor | **S** (compacta · fórmula C-1) |
| Fecha | 2026-07-26 |
| Tick | `H-01-COMPACTO` · HILO=`volumes-concepto` |
| Fuentes | 6 notas H-01: Z · O · G · S · V · L |
| Circuito | borrador **S** → **Z** verifica técnico → **L** notaría → **Temis** (tick) fidelidad → **mesa** decide → **S** valida |
| Régimen | aclara; **no decide** · OASIS no se mueve · sin implementación |

---

## Checklist de no-pérdida (hub)

### Fórmula C-1 (roles de cierre) — preservada

| papel | carril | evidencia en notas |
| ----- | ------ | ------------------ |
| Compacta | **S** | Z★ · O★ · V★ · (G: Z contrato + S bien común) · L registra |
| Verifica técnico | **Z** | dueño contrato / resolvers / drivers |
| Notaría | **L** | no decide fondo |
| Audita pre-merge | **Temis** | fidelidad al checklist · tick aparte |

### 8 convergencias preservadas

| # | convergencia | quiénes |
| - | ------------ | ------- |
| 1 | **Un root de montaje / un contrato**; packs = fuente de import, nunca root rival | Z · G · S · O (plural = procedencia/orígenes, no N identidades de root) |
| 2 | **Manifiesto ≠ estado mutable** — separación exigida (ficheros/zonas distintas) | Z · O · G · V |
| 3 | **Offline**: arranque sin red; fallar en **import**, no en boot; cero ancla viva en camino de arranque | Z · O · G · S · V · cerco v2 |
| 4 | **Capacidad = inventario verificable** (hash/medición), no autoridad topológica ni rango por grafo | Z · O · G · S · V |
| 5 | **★C1 preferente** (kit npm ligero + Release import-once) — tres razones independientes | G (pesos) · Z (código/`node_modules`) · O (cerco/arranque) |
| 6 | **Drivers por familia DISK** (FORCES / LINEAS / FIREHOSE / …); familia desconocida = error | Z · O · G · V (descriptor) |
| 7 | **Shape de prueba**: `startpack-pozo` + familia **FORCES** (fixture pequeña) | Z · O · tick · INDICE |
| 8 | **OASIS no se mueve** este hilo; histórico = import one-shot al root cercado | todos · R3 · cerco v2 |

### 7 tensiones EXPLÍCITAS (no ocultar)

| # | tensión | por qué importa |
| - | ------- | --------------- |
| T1 | **LECTURA del tick invertida**: `startpack-kit` + `notario-release` viven en **g-sdk**, no en z-sdk | G y Z lo verifican; malentendido Z-D6 reaparece |
| T2 | **`loadStartPack` hoy**: `volumesRoot` **dentro del pack** (`node_modules`); **no** lee `ZEUS_VOLUMES_ROOT`; **no** valida volúmenes | Choca con cerco; Z lo declara defecto propio documentado |
| T3 | **Dos formas de `volumes.json`** (root Z ⊃ pack) + **`counters.mjs` muta** el fichero “contrato” | Impide sellar/hashear manifiesto RO |
| T4 | **Root único (catálogo)** vs **mounts plurales** (árbol RO + zona RW aparte · O) | No son incompatibles si hay **namespace lógico** + mounts; hay que nombrarlo |
| T5 | **Ancla ¿sustituye o alimenta** el volumen? (pregunta Z en R3 · O ⏳) | Flujo (FIREHOSE) ≠ árbol; condiciona sync/P2P |
| T6 | **FIREHOSE** (8k ficheros / bind-mount) vs shape **FORCES/pozo** | Contrato no puede asumir “1 fichero = 1 unidad” para todas las familias |
| T7 | **LECTURA §8 caduca al cerrar el hilo** · CA local-first (Z §⑦) puede necesitar RO **después** | Sin decisión = CA inverificable post-COMPACTO |

### Cerco v2 (obligatorio — notas nacieron en parte bajo v1)

Las 6 notas citan a menudo “cerco = sin red / sin ancla”. **v2 (§10.8)** aclara:

| clase | trato |
| ----- | ----- |
| Fuente histórica / deprecated | import **una vez** → root interno; jamás dependencia de arranque |
| Procedencia | URL = metadato **inerte** |
| **Peer/relay del contrato** | endpoint vivo **permitido** para sync explícita; nunca fuente única ni requisito para leer local |
| Runtime local-first | opera con lo local aunque la red caiga; dato en volumen propio montado por contrato |

⚠️ Releer afirmaciones “cero red siempre” a la luz de v2: **arranque/local-first** sí; **réplica P2P explícita** no está prohibida — queda en **C-6 / ⏳**, no como decisión de este compacto.

### ★ Candidatas C-2 … C-5 (para la mesa)

| id | candidata | contenido |
| -- | --------- | --------- |
| **C-2** | Namespace lógico + mounts plurales | Un contrato/catálogo; N puntos de montaje (RO manifiesto · RW estado) sin N “roots identidad” |
| **C-3** | Manifiesto / estado / corpus separados | `volumes.json` RO+hash · estado mutable aparte · corpus/familias por driver (Z: `volumes.state.json`; O: zona rw fuera del árbol RO) |
| **C-4** | **C1 preferente** | npm=kit FOSS ligero · Release=import-once con version+hash de piezas; post-import root lleva hashes (V) |
| **C-5** | Shape `startpack-pozo` + **FORCES** | Familia fixture para CA concepto; no FIREHOSE histórico |

**C-6** · segundo acto **P2P / réplica entre nodos** → **⏳** (no decisión en este COMPACTO).

---

## ◆ Decisiones que se piden a la mesa

1. **¿Asienta la fórmula C-1** (S compacta · Z verifica · L notaría · Temis audita) como cierre de este hilo?
2. **¿Adopta C-2 + C-3 + C-4 + C-5** como marco del adaptador local-first (concepto), dejando C-6 para un segundo acto?
3. **¿Corrige la cláusula LECTURA** del hilo (o del siguiente tick de CA) para que G lea en Z: `presets-sdk/volumes`, `linea-kit/validate`, `volumes-ops/counters`, `VOLUMES/volumes.json` — y no paths fantasma en z-sdk?
4. **¿Exige que el camino documentado deje de apuntar el env al `volumes/` del pack** (defecto Z README) como condición de cierre de frontera C1?
5. **¿El CA local-first (Z§⑦ / O§Q7) queda dentro de este hilo o abre tick post-COMPACTO** con LECTURA renovada?

---

## ★ Recomendaciones consensuadas (síntesis; no veredicto)

1. Tratar packs como **semilla de import**; root cercado = única autoridad de lectura en ronda.
2. Separar físico: manifiesto RO hasheable · estado/contadores regenerables · curación humana **nunca pisada** por import (Z Q4).
3. Reconciliar **por hash/manifiesto**, nunca mtime/tamaño (O); por **familia/soporte**, no merge global (G).
4. Anuncio de capacidad: forma de **alcance/inventario**, no árbol de mando (V); verificación fuera de los nodos cuando haya réplica (V Q7).
5. Playground ancla el **contrato/root lógico** (S); no versiona contenido vivo.
6. Post-import: root lleva **versión+hash por pieza** en ambos caminos C1 (y C2 si existiera) (V).
7. Identidad/secretos: **cero** en VOLUMES (R3 · GATE-O-CLAVES en plano datos).

---

## ⏳ Abiertos

| id | abierto | dueño tentativo |
| -- | ------- | --------------- |
| C-6 | Segundo acto P2P / réplica 2 nodos (criterios sí; diseño sync no) | mesa · tick nuevo |
| T5 | Ancla sustituye vs alimenta | O + contrato import Z |
| T6 | Representación empaquetada de FIREHOSE en local | O+Z |
| T7 | RO post-compacto para CA | custodio / tick |
| — | Ruta root local + VPS (3 candidatas R3) | custodio + mesa |
| — | Import one-off histórico (Z-D8/D9); U176 parcial | Z + custodio |
| — | `registry.yaml` LINEAS stale | Z (al importar) |
| — | Permiso LECTURA invertido → asiento en PROTOCOLO/hilo | Anfitrión |

---

## Mapa de fuentes (apunta)

| carril | nota |
| ------ | ---- |
| Z | `C:/S_LAB/z-sdk/sincronia/notas/NOTA-Z-2026-07-26-H01-volumes-concepto.md` |
| O | `C:/S_LAB/o-sdk/sincronia/notas/NOTA-O-2026-07-26-H01-volumes-concepto.md` |
| G | `C:/S_LAB/g-sdk/sincronia/notas/NOTA-G-2026-07-26-H01-volumes-concepto.md` |
| S | `C:/S/scriptorium/sincronia/notas/NOTA-S-2026-07-26-H01-volumes-concepto.md` |
| V | `C:/S_LAB/v-sdk/sincronia/notas/NOTA-V-2026-07-26-H01-volumes-concepto.md` |
| L | `C:/S_LAB/skills-library/sincronia/notas/NOTA-L-2026-07-26-H01-compactador.md` |

---

**Estado:** borrador listo para circuito Z → L → Temis → mesa.

— **S**
