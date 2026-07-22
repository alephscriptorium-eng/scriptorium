# HANDOFF · IB-23 · Limpieza final S_SDK (WEBS / HOLONES / LLM)

| dato | valor |
| ---- | ----- |
| Emisor | carril **S** · WP IB-23 (workspace `scriptorium`) |
| Fecha | 2026-07-22 |
| Vía | **(a) handoff** · DA-S09 · INFORME-VIGIA-R7-S condición 2 |
| Escritura en `codebase/s-sdk` | **ninguna** (este documento es la nota) |
| Borrados ejecutados por S | **cero** — quedan al carril dueño |

## Destinatario (carril dueño)

**Carril s-sdk / mundo legado S_SDK** — dueño exclusivo del árbol
`codebase/s-sdk` (PARTICION §1/§4). Materializa borrados solo con
**veredicto desechable POR ELEMENTO (acta)** antes de cada borrado.
Cero bump del gitlink workspace en este WP (GO propio).

## Paquete A — WEBS/ (candidatos a borrar · subsumidos por site-web)

**Qué:** instancia legada de capa de contenido del portal s-sdk; el
site-web overall del workspace vive en `docs/` →
`aleph-null.escrivivir.co` (DA-S02 · IB-13).

**Fuentes (SOLO LECTURA · tip gitlink s-sdk
`7db1d4941267d857d93ab4005dcc4ecd0e49ecfb`):**

| artefacto | ruta en `codebase/s-sdk` |
| --------- | ------------------------ |
| README instancia | `WEBS/README.md` |
| Bases 1–3 | `WEBS/BASE-1-ARGUMENTO.md` … `BASE-3-MECANISMO.md` |
| Calibración | `WEBS/CALIBRACION.md` |
| Cantera | `WEBS/CANTERA/00-contexto.md` · `01-inventario-superficies.md` |
| Entrega capa-1 | `WEBS/ENTREGA-CAPA-1/00-NOTA.md` · `01-PAQUETE.md` |
| Entrega I31 | `WEBS/ENTREGA-I31/00-NOTA.md` · `01-PAQUETE.md` |

**Pedido al dueño:** si procede borrar `WEBS/`, emitir acta POR ELEMENTO
(o por árbol con inventario literal) y **después** verificar C8 real
del canal de uso de webs S (no solo build local). Ver
`plan/SPRINTS/INITIAL-BASE/REPORTES/IB-23-ACTA-candidatos-desechables.md`.

## Paquete B — HOLONES/ (paths largos / anidados)

**Qué:** rutas reservadas + **gitlinks anidados** bajo HOLONES (paths
largos). Los submodules canónicos del workspace
(`codebase/{z,g}-sdk`) son la vía; estos anidados no deben vivir bajo
s-sdk.

| artefacto | tipo | tip / nota |
| --------- | ---- | ---------- |
| `HOLONES/01-mythos/games-library` | gitlink 160000 | `d1783646…` (= tip g-sdk workspace) |
| `HOLONES/01-mythos/zeus-sdk` | gitlink 160000 | `d0d9de1d…` (= tip z-sdk workspace) |
| `HOLONES/03-emmanuel/README.md` | fichero | ruta reservada |
| `HOLONES/05-aleph-scriptorium/README.md` | fichero | ruta reservada (DE-I8) |
| `HOLONES/06-aleph-scriptorium/README.md` | fichero | ruta reservada |

**Pedido al dueño:** retirar anidados/paths con acta por elemento;
**no** confundir con bump del gitlink `codebase/s-sdk` en el workspace
(GO propio, fuera de IB-23).

## Paquete C — LLM.md → broche en raíz `C:\S`

**Qué:** acuerdo de trabajo para agentes (memoria→codebase · no inventar).

| origen (lectura) | destino broche (FS, fuera de git) | puntero en repo |
| ---------------- | --------------------------------- | --------------- |
| `codebase/s-sdk/LLM.md` | `C:\S\LLM.md` | `plan/BROCHE-C-S.md` |

El broche en raíz **ya está materializado por el carril S** (autorizado
en brief IB-23). El borrado de `codebase/s-sdk/LLM.md` queda al dueño
con acta (solo tras confirmar que el broche + puntero cubren el
acuerdo).

## Evidencia de partición

- ALCANCE_DIFF IB-23 = `plan/**` del workspace + broche FS `C:\S\LLM.md`.
- `codebase/s-sdk` y demás gitlinks: **no tocados** (pins invariantes).
- Cero borrados en el legado.

## C8 webs S

- **Baseline PRE-handoff (carril S):** `https://aleph-null.escrivivir.co/`
  → HTTP 200 (evidencia en reporte IB-23).
- **C8 post-cambio** (tras borrados en s-sdk): **carril dueño** — no lo
  finge este handoff.

## Cierre del handoff

Cuando el carril dueño acepte y materialice (con actas), que deje nota
de vuelta (cita a este fichero + SHA de su tip s-sdk). Hasta entonces,
el material permanece en el tip gitlink actual sin pérdida.
