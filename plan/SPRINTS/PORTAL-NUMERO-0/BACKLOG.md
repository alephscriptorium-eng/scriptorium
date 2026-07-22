# BACKLOG · sprint PORTAL-NUMERO-0

Estados: ⬜ pendiente · 🔶 en curso · ✅ aceptado.

> Arco de la COLA del workspace (NO es INITIAL-BASE). GO custodio
> 2026-07-22 · «contenido portal numero-0 / aleph-null». Carril: **S** ·
> gates vigía: rondas `Rn-S`. Principio: **PORT, NO REWRITE**.
> **NO reabre IB-13** (esqueleto web cerrado en INITIAL-BASE).
> Secuencia PO: **DA-S13** (tag retenido · piel → re-pielado → BRAND-1
> colofón → tag). Supersede tramo final DA-S12.

## Fuentes del WP (lectura íntegra · worker ejecuta, no inventa)

| fuente | rama / tip | artefacto |
| ------ | ---------- | --------- |
| Base Vigilante-S | `scriptorium-vigilancia` @ `b12d26f` | `ENTREGA-VIGILANTE-S-contenido-aleph-null-2026-07-22.md` |
| Complemento Fable | `script_sdk-addenda` @ `5f0a11b` | `ENTREGA-COMPLEMENTO-FABLE-aleph-null-2026-07-22.md` |
| Cantera branding (PRE-TICK) | `script_sdk-addenda` @ `0567a24` | `cantera/branding/` |

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

## Ola N0-2 · Piel → re-pielado → colofón marca (DA-S13)

Orden literal: **N0-02 → N0-03 → N0-04 (= BRAND-1) → tag `release/numero-0`**.
Tag **SELLADO** @ `40598f0e307921d613dacf1c324415eb4a1b5d32` · arco
cerrado R15-S.

- ✅ **N0-02 · FAST-TRACK issue #15 · piel fanzine en skill `site-web`**
  — carril librería (`S_SDK-skills-library`): elevar piel canónica a
  asset del skill + **CA estructural C8 anti-regresión** · release
  **`0.6.1`** (secrets + publish triangulado IB-21).
  Checkout de obra **DECLARADO**: `C:\S\S_SDK-skills-library`.
  **CA:** ver `BRIEFS/N0-02.md`.
  _Brief:_ `BRIEFS/N0-02.md` · merge `wp/n0-02-site-web-piel-fanzine`
  · obra librería `64883a9f1d525d6ad14759efa13cb788ab68542c` · tag
  `v0.6.1` · Publish CI `29957370542` · npm `@0.6.1`
  · reporte `REPORTES/N0-02-site-web-piel-fanzine.md`
  · **Aceptado** · AVISO **R12-S** emitido (gate pre N0-03).

- ✅ **N0-03 · Re-pielado portal aleph-null** — carril S · alcance
  `docs/.vitepress/theme/**` · pin `@0.6.1` + `skills:sync` + gitlink
  `64883a9` · piel fanzine real (CA estructural local verde).
  **CA:** ver `BRIEFS/N0-03.md` · reporte
  `REPORTES/N0-03-repielado-portal.md`.
  _Brief:_ `BRIEFS/N0-03.md` · merge `wp/n0-03-repielado-portal`
  · obra `985eaa9` · merge `72e1330` · tip PRE `ddbea1a` · 🔶
  `1bd7998` · **Aceptado** · AVISO **R13-S** emitido (C8 post-deploy
  + aceptación).

- ✅ **N0-04 · WP-BRAND-1 · marca / colofón aleph-null** — carril S ·
  `scriptorium/branding/` desde cantera tip `0567a24` · derivados
  `*-web.png` + favicon · LICENSE puntero GL · `/licencia` explicada ·
  CONTRIBUTING/.github desde plantillas. **CA:** ver `BRIEFS/N0-04.md`.
  _Brief:_ `BRIEFS/N0-04.md` · tip PRE `f276690` · obra `18168a2` ·
  merge `de52ba6` · **Aceptado** · AVISO **R14-S** emitido (C8 marca
  post-deploy; **sin PASS no hay tag**).

## COLA hermano · librería → **arco nuevo LIBRERIA-0.7.0**

- ⬜ **WP-BRAND-2 / LIB-070** — **migrado** a sprint
  [`../LIBRERIA-0.7.0/`](../LIBRERIA-0.7.0/BACKLOG.md) · brief
  `../LIBRERIA-0.7.0/BRIEFS/LIB-070.md` · checkout
  **`C:\S_LAB\S_SDK-skills-library`** (clone nuevo; no move) · AVISO
  **R16-S** · **sin PASS no hay 🔶**. Brief histórico
  `BRIEFS/BRAND-2.md` = superseded.

- ✅ **Residual · banner-scriptorium · WP-XS** — GO 2026-07-23: fuente
  cantera `@39caef4` WebP · blob ceros retirado · derivado web ·
  cabecera **scriptorium** (decisión PO). **No reabre N0-04.**
  _Brief:_ `BRIEFS/WP-XS-banner-scriptorium.md` · reporte
  `REPORTES/WP-XS-banner-scriptorium.md`.

## Residual post-tag · corrección de piel (DA-S18 · **no** reabre arco)

- ⬜ **WP-REST-SHELL · restaurar shell familia en aleph-null** — GO
  custodio 2026-07-23 · DA-S18. PORT visual **exacto**
  `codebase/z-sdk/docs` (= CA de look). Conservar N0-01 · CNAME ·
  favicon · `/licencia` · banner (integrado shell · patrón o-sdk).
  Cero `Layout.vue` fanzine. Gate **R20-S** · **sin PASS no hay 🔶**.
  **No** toca sello `release/numero-0`. ∥ olas mundos OK (R19 ≠ este
  gate). _Brief:_ `BRIEFS/WP-REST-SHELL.md` · AVISO
  `AVISO-VIGIA-R20-S.md`.

## Gate / estado lote

- Sprint INITIAL-BASE **cerrado** (R8-S · INFORME-VIGIA-R8-S.md · tip
  cierre ratificado en main).
- Gate R9-S: **PASS** · `INFORME-VIGIA-R9-S.md` · tip despacho `3c1c97f`.
- ✅ **N0-01** aceptado · merge post-aceptación · AVISO **R10-S** emitido.
- Gate R10-S: **PASS-con-residual** · `INFORME-VIGIA-R10-S.md` · tip
  `5a7f372` · OK de sellado concedido.
- Gate R11-S: **PASS** · `INFORME-VIGIA-R11-S.md` · tip PRE-🔶
  `6dbf5adfd1f3961f5aab80c94ddc32de87e79432` · 🔶 N0-02 despachado
  (GO orquestador post branding).
- ✅ **N0-02** aceptado · `@alephscript/skills-scriptorium@0.6.1`
  publicado · AVISO **R12-S** emitido (`AVISO-VIGIA-R12-S.md`).
- Gate R12-S: **PASS** · `INFORME-VIGIA-R12-S.md` · tip PRE-🔶
  `ddbea1a` · 🔶 N0-03 despachado · merge hecho.
- ✅ **N0-03** aceptado · portal consume `@0.6.1` · piel fanzine ·
  AVISO **R13-S** emitido (`AVISO-VIGIA-R13-S.md`).
- Gate R13-S: **PASS** · `INFORME-VIGIA-R13-S.md` · tip PRE-🔶
  `f276690` · autoriza 🔶 N0-04.
- ✅ **N0-04** aceptado · colofón BRAND-1 · AVISO **R14-S** emitido
  (`AVISO-VIGIA-R14-S.md`).
- Gate R14-S: **PASS-con-residual** · `INFORME-VIGIA-R14-S.md` · tip
  `40598f0e307921d613dacf1c324415eb4a1b5d32` · OK de sellado concedido.
- ✅ **Tag `release/numero-0` SELLADO** · commit tagged
  `40598f0e307921d613dacf1c324415eb4a1b5d32` · tag obj
  `69bbc098b91d8e09c15873d5ffbffa6b9c5589be` · notes = CHANGELOG
  §Número 0 · release GitHub publicada.
- AVISO **R15-S** · cierre de arco (`AVISO-VIGIA-R15-S.md`).
- BRAND-2 / LIB-070: arco **LIBRERIA-0.7.0** · AVISO R16-S · **sin 🔶**
  hasta PASS.
- Residual banner-scriptorium: **WP-XS ✅** (GO 2026-07-23) · no reabre
  N0-04.
- Residual post-tag piel: **WP-REST-SHELL ⬜** · AVISO **R20-S** ·
  **sin PASS no hay 🔶** · sello `release/numero-0` intacto.

## Pre-tag · CHANGELOG (nota Vigilante-S · R8-S · práctica método)

- ▶ **Gobierno · `CHANGELOG.md` en raíz** — preparado/actualizado desde
  WPs ✅ (INITIAL-BASE + N0-01) **sin tag**. El gate del release
  (`release/numero-0`) cruzará **WPs ✅ ↔ CHANGELOG** tras secuencia
  DA-S13 (piel → re-pielado → BRAND-1). No inventar entradas fuera del
  backlog cerrado. Notes del tag = sección **Número 0** del CHANGELOG.

## Vetos del arco

- Worker ejecuta la entrega; **no inventa claims** (CA 3).
- N0-01: escritura solo `docs/**` + reporte (piel fuera).
- N0-02: escritura en checkout librería declarado + reporte.
- N0-03: escritura `theme/**` (+ pin skill si aplica) + reporte.
- N0-04: escritura branding/public/licencia/LICENSE/CONTRIBUTING + reporte.
- BRAND-2: escritura en checkout librería declarado + reporte.
- Paquete: siempre `@alephscript/skills-scriptorium` (alias corto = 404).
- Cero arqueología · cero force · network-sdk solo remote epsylon ·
  PORT NO REWRITE · cero bump gitlinks sin GO.
- MIGAS intactas (IOCANDI a cola de su dueño; ya-licenciados no se tocan).
- C8 post-deploy: lo re-chequea el **Vigilante-S** (no fingir C8 deploy).
- Gates = AVISO → Vigilante-S; **sin PASS no hay 🔶** de WPs nuevos.
