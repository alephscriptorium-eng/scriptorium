# BACKLOG · sprint PORTAL-NUMERO-0

Estados: ⬜ pendiente · 🔶 en curso · ✅ aceptado.

> Arco de la COLA del workspace (NO es INITIAL-BASE). GO custodio
> 2026-07-22 · «contenido portal numero-0 / aleph-null». Carril: **S** ·
> gates vigía: rondas `Rn-S`. Principio: **PORT, NO REWRITE**.
> **NO reabre IB-13** (esqueleto web cerrado en INITIAL-BASE).

## Fuentes del WP (lectura íntegra · worker ejecuta, no inventa)

| fuente | rama / tip | artefacto |
| ------ | ---------- | --------- |
| Base Vigilante-S | `scriptorium-vigilancia` @ `b12d26f` | `ENTREGA-VIGILANTE-S-contenido-aleph-null-2026-07-22.md` |
| Complemento Fable | `script_sdk-addenda` @ `5f0a11b` | `ENTREGA-COMPLEMENTO-FABLE-aleph-null-2026-07-22.md` |

**Regla de fusión (dentro del complemento):** la base del Vigilante-S
**manda**; bloques C-* se insertan donde indica el complemento; si la
base ya cubre la idea, se omite el bloque. **C-1 es CORE** (entra
siempre). C-6 = semillas número 1 — **fuera de este WP**.

## Ola N0-1 · Contenido del portal (número 0)

- ✅ **N0-01 · Contenido portal aleph-null (número 0)** — ejecutar la
  entrega fusionada (base V-S + C-1 CORE + insertos C-2…C-5 aplicables)
  sobre el esqueleto IB-13: portada renovada, 4 páginas nuevas
  (`/constelacion`, `/metodo`, `/ciudad`, `/cola`), enriquecimiento de
  `/proyecto`, nav/sidebar 6 entradas. **Piel NO se toca** (issue #15
  librería; re-pielado = WP futuro tras 0.6.x del skill).
  **CA:** ver `BRIEFS/N0-01.md` (fusión aplicada).
  _Brief:_ `BRIEFS/N0-01.md` · merge `wp/n0-01-contenido-portal-numero-0`
  · obra `eee068524a681eeb52622804b067b04706fd2a44`
  · reporte `REPORTES/N0-01-contenido-portal-numero-0.md`
  · **Aceptado** post obra local verde (docs:build/verificar); C8
    post-deploy 5 rutas → re-chequeo Vigilante-S en **R10-S**.

## Gate / estado lote

- Sprint INITIAL-BASE **cerrado** (R8-S · INFORME-VIGIA-R8-S.md · tip
  cierre ratificado en main).
- Gate R9-S: **PASS** · `INFORME-VIGIA-R9-S.md` · tip despacho `3c1c97f`.
- ✅ **N0-01** aceptado · merge post-aceptación · AVISO **R10-S** emitido.
- Sugerencia post-cierre (vigía-sesión; **no ejecutar aún**): sellar
  resultado como tag **`release/numero-0`** (primer release del repo) —
  acta del cero; solo tras R10-S OK + CHANGELOG (abajo). **Tag no
  ejecutado** en este cierre de obra.

## Pre-tag · CHANGELOG (nota Vigilante-S · R8-S · práctica método)

- ▶ **Gobierno · `CHANGELOG.md` en raíz** — preparado/actualizado desde
  WPs ✅ (INITIAL-BASE + N0-01) **sin tag**. El gate del release
  (`release/numero-0`) cruzará **WPs ✅ ↔ CHANGELOG** tras R10-S OK.
  No inventar entradas fuera del backlog cerrado.

## Vetos del arco

- Worker ejecuta la entrega; **no inventa claims** (CA 3).
- Escritura solo `docs/**` + reporte del WP (en este repo).
- Paquete: siempre `@alephscript/skills-scriptorium` (alias corto = 404).
- Cero arqueología · cero force · network-sdk solo remote epsylon ·
  PORT NO REWRITE · cero bump gitlinks.
- C8 post-deploy de las 5 rutas: lo re-chequea el **Vigilante-S** (no
  fingir C8 deploy en el WP).
