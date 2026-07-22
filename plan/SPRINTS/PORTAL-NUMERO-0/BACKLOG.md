# BACKLOG · sprint PORTAL-NUMERO-0

Estados: ⬜ pendiente · 🔶 en curso · ✅ aceptado.

> Arco de la COLA del workspace (NO es INITIAL-BASE). GO custodio
> 2026-07-22 · «contenido portal numero-0 / aleph-null». Carril: **S** ·
> gates vigía: rondas `Rn-S`. Principio: **PORT, NO REWRITE**.
> **NO reabre IB-13** (esqueleto web cerrado en INITIAL-BASE).
> Secuencia PO post-R10-S: **DA-S12** (tag retenido · piel primero).

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

## Ola N0-2 · Piel (secuencia PO · DA-S12)

Orden literal: **N0-02 → N0-03 → tag `release/numero-0`**. Tag hoy **NO**.

- ⬜ **N0-02 · FAST-TRACK issue #15 · piel fanzine en skill `site-web`**
  — carril librería (`S_SDK-skills-library`): elevar piel canónica a
  asset del skill + **CA estructural C8 anti-regresión** · release
  `0.6.1`/`0.7.0` (secrets sembrados; publish triangulado IB-21).
  Checkout de obra **DECLARADO**: `C:\S\S_SDK-skills-library`.
  **CA:** ver `BRIEFS/N0-02.md`.
  _Brief:_ `BRIEFS/N0-02.md` · **PRE-🔶** · gate **R11-S**
  (`AVISO-VIGIA-R11-S.md`) · **sin PASS no hay 🔶**.

- ⬜ **N0-03 · Re-pielado portal aleph-null** — carril S · alcance
  `docs/.vitepress/theme/**` · consume versión nueva del skill.
  Brief **stub** OK. 🔶 solo tras N0-02 publicado + gate propio.
  **CA:** ver `BRIEFS/N0-03.md` (cerrar al despacho).
  _Brief:_ `BRIEFS/N0-03.md` · stub encolado · sin AVISO de 🔶 aún.

## Gate / estado lote

- Sprint INITIAL-BASE **cerrado** (R8-S · INFORME-VIGIA-R8-S.md · tip
  cierre ratificado en main).
- Gate R9-S: **PASS** · `INFORME-VIGIA-R9-S.md` · tip despacho `3c1c97f`.
- ✅ **N0-01** aceptado · merge post-aceptación · AVISO **R10-S** emitido.
- Gate R10-S: **PASS-con-residual** · `INFORME-VIGIA-R10-S.md` · tip
  `5a7f372` · OK de sellado concedido.
- **Tag `release/numero-0` RETENIDO** (PO · DA-S12) hasta post N0-03 —
  OK de sellado vigente; cambia el cuándo. **Tag no ejecutado.**
- Gate R11-S: **AVISO emitido** · `AVISO-VIGIA-R11-S.md` · pre N0-02 ·
  ⏳ sin PASS no hay 🔶.

## Pre-tag · CHANGELOG (nota Vigilante-S · R8-S · práctica método)

- ▶ **Gobierno · `CHANGELOG.md` en raíz** — preparado/actualizado desde
  WPs ✅ (INITIAL-BASE + N0-01) **sin tag**. El gate del release
  (`release/numero-0`) cruzará **WPs ✅ ↔ CHANGELOG** tras secuencia
  DA-S12 (piel). No inventar entradas fuera del backlog cerrado.
  Notes del tag = sección **Número 0** del CHANGELOG.

## Vetos del arco

- Worker ejecuta la entrega; **no inventa claims** (CA 3).
- N0-01: escritura solo `docs/**` + reporte (piel fuera).
- N0-02: escritura en checkout librería declarado + reporte.
- N0-03: escritura `theme/**` (+ pin skill si aplica) + reporte.
- Paquete: siempre `@alephscript/skills-scriptorium` (alias corto = 404).
- Cero arqueología · cero force · network-sdk solo remote epsylon ·
  PORT NO REWRITE · cero bump gitlinks sin GO.
- C8 post-deploy: lo re-chequea el **Vigilante-S** (no fingir C8 deploy).
- Gates = AVISO → Vigilante-S; **sin PASS no hay 🔶** de WPs nuevos.
