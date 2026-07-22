# HANDOFF · IB-22 · Archivo del cascarón + dossiers + joyas

| dato | valor |
| ---- | ----- |
| Emisor | carril **S** · WP IB-22 (workspace `scriptorium`) |
| Fecha | 2026-07-22 |
| Vía | **(a) handoff** · DA-S08 · INFORME-VIGIA-R6-S condición 3 |
| Escritura fuera de `C:\S\scriptorium` | **ninguna** (este documento es la nota) |

## Destinatarios (carriles dueños)

1. **Carril mundo de papel (e-sdk)** — DA-S03: recibe dossiers 16-07
   cuando su orquestador lo acepte. Material preparado abajo; **no**
   aplicado en `codebase/e-sdk` por este WP.
2. **Archivo / cuadernos (partida de nacimiento del cascarón)** —
   genealogía 07-holones como acta de nacimiento del método. Destino
   declarado: rama de cuadernos del mundo S / histórico docs — lo
   materializa el dueño del archivo; aquí queda el paquete listo.

## Paquete A — Partida de nacimiento (cascarón / genealogía 07)

**Qué:** el registro de holones y el holón 07 como acta de que el
método emergió al escribirse el registro.

**Fuentes (SOLO LECTURA en s-sdk tip gitlink actual):**

| artefacto | ruta en `codebase/s-sdk` |
| --------- | ------------------------ |
| Visión / hipótesis | `DEVOPS/VISION.md` |
| Registro de holones | `DEVOPS/METODOLOGIA/HOLONES.md` |
| Holón 07 (método) | `DEVOPS/METODOLOGIA/holones/07-script-sdk.md` |
| Plantilla | `DEVOPS/METODOLOGIA/holones/TEMPLATE.md` |
| Holones 01–06 | `DEVOPS/METODOLOGIA/holones/01-*.md` … `06-*.md` |

**Pedido al dueño del archivo:** conservar como «partida de nacimiento»
(cuaderno o docs histórico) **sin borrar** el árbol `DEVOPS/` en s-sdk
hasta veredicto desechable explícito. IB-23 (limpieza) es GO aparte.

**Copia de trabajo preparada en este workspace (no sustituye al
archivo dueño):** `plan/archivo/partida-nacimiento-07-holones.md`.

## Paquete B — Dossiers 16-07 → mundo de papel (e-sdk)

**Qué:** dossiers de junturas fechados 2026-07-16 (notaría + future-machine).

| dossier | ruta en `codebase/s-sdk` |
| ------- | ------------------------ |
| Notaría tres liturgias | `DEVOPS/METODOLOGIA/holones/junturas/2026-07-16-dossier-notaria-tres-liturgias.md` |
| Holón 03 future-machine | `DEVOPS/METODOLOGIA/holones/junturas/2026-07-16-dossier-holon-03-future-machine.md` |

**Pedido al carril e-sdk:** portar/citar estos dossiers en el plan del
mundo de papel (DA-S03) cuando tenga GO; **no** los escribe el worker S.

## Paquete C — REGISTRO DE JOYAS (cola workspace)

Ya asentado en `plan/REGISTRO-DE-JOYAS.md` (punteros verificados). Los
arcos (voz, futures-engine, Hilbert, conversor, NETWORK-ENGINE) quedan
en cola con GO propio — no son obra de este handoff.

## Evidencia de partición

- ALCANCE_DIFF IB-22 = solo `plan/**` del workspace scriptorium.
- `codebase/e-sdk` y demás gitlinks: **no tocados**.
- Cero borrados en `DEVOPS/`.

## Cierre del handoff

Cuando el carril dueño acepte y materialice, que deje nota de vuelta
(cita a este fichero + SHA de su tip). Hasta entonces, el material
permanece apuntado aquí sin pérdida.
