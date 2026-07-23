# AVISO · Vigilante-S · R22-S · aceptación WP-REST-SHELL (C8 vs z-sdk)

**Carril:** S  
**Ronda pedida:** `R22-S`  
**Emisor:** orquestador S (GO post-cierre mundos · merge REST-SHELL · 2026-07-23 · sin subagente vigía)  
**Receptor:** **Vigilante-S** (estación viva `C:\S\vigilancia`) vía **custodio**  
**Fecha:** 2026-07-23  
**Estado gate:** ⬜ pendiente veredicto (aceptación post-obra)

> Aceptación de **WP-REST-SHELL** tras merge. Pedido del INFORME R20-S:
> C8 del vigía **lado a lado contra z-sdk** (referencia viva del PORT).
> **No** es R21-S (gate LIB-080 · otro territorio). No reabre arco
> PORTAL-NUMERO-0. No retoca sello `release/numero-0`.

## Cableado (contrato · sucesión de vigía · DA-S07)

- El vigía del carril S **es** la ventana Vigilante-S en `C:\S\vigilancia`.
- **No** es un subagente vigía del orquestador. **No** generar ni invocar
  subagentes con rol de vigía.
- Gates `Rn-S`: se piden por **AVISO** y el veredicto lo emite
  **Vigilante-S vía custodio**.

## Pedido

Informe dual PO/scrum de ronda **R22-S** con veredicto PASS | FAIL |
PASS-con-residual sobre:

1. **Higiene §8** tip = origin/main · gitlinks 7/7 · locks ausentes.
2. **Obra mergeada:** shell familia en `docs/.vitepress/theme/**` ·
   cero `Layout.vue` / `fanzine.css` · `Banner.vue` en slot
   `layout-top` (patrón o-sdk).
3. **PORT look:** contraste **lado a lado** portal vs
   `codebase/z-sdk/docs` (CA de look; sin criterios extra).
4. **Conservados:** contenido N0-01 · CNAME · favicon · `/licencia` ·
   banner asset.
5. **Builds locales reportados verdes** (`docs:build` ·
   `docs:verificar`) — re-chequear si el vigía lo exige.
6. **C8 Pages** post-deploy (cuando Pages refleje tip): home + internas
   con VPNav + GitHub + footer · look familia · **sin fingir** URLs.
7. **Sello** `release/numero-0` intacto (deref
   `40598f0e307921d613dacf1c324415eb4a1b5d32`).
8. Partición respetada · LIB-080 no mezclado (R21-S aparte).

## Checklist higiene (§8) — pulso Vigilante-S R22-S

```text
[ ] tip = origin/main · status explicado
[ ] Layout.vue / fanzine.css AUSENTES en docs/.vitepress/theme
[ ] Banner.vue + custom.css (PORT z-sdk) + index.js shell presentes
[ ] CNAME · favicon · /licencia · banner-scriptorium-web.png presentes
[ ] tag release/numero-0 → 40598f0 (intacto)
[ ] C8 lado a lado vs z-sdk (local y/o Pages reales — no inventar)
[ ] Rn-S = R22-S PASS | FAIL | PASS-con-residual
[ ] R21-S (LIB-080) no confundido con esta aceptación
```

## Vetos

- No subagente vigía
- No retag / no force · sello `release/numero-0` intacto
- No inventar hashes ni C8 Pages
- PORT NO REWRITE (contenido N0-01)
- Paquete: `@alephscript/skills-scriptorium`

## Entrega del Vigilante-S (vía custodio)

1. Informe **cara PO** — p.ej. `INFORME-VIGIA-R22-S.md`
2. Informe **cara scrum**
3. Etiqueta `R22-S` + veredicto de **aceptación** WP-REST-SHELL
4. Orquestador no lanza subagente vigía

## Contexto tip (orquestador · evidencia obra)

| dato | valor |
| ---- | ----- |
| tip MAPA-REPO | `30367e885f654b5bcf66af918aedba9602c5e91c` |
| tip LIB-080 AVISO R21-S | `39a1e373ca87c3b68bcdf93309d684945b0a03ed` |
| tip obra REST-SHELL (rama) | `170138bef9e63ba283809711a77d16430e28d754` |
| tip merge REST-SHELL (main) | `bd560b718abc4b870e9ffbae57a779c46f42ecbf` |
| tip AVISO R22-S (primer asiento) | `54000f6ac945b133bdcfbbe65db229b2e6357c0f` |
| tag release/numero-0 deref | `40598f0e307921d613dacf1c324415eb4a1b5d32` |
| PORT look | `codebase/z-sdk/docs` |
| reporte | `plan/SPRINTS/PORTAL-NUMERO-0/REPORTES/WP-REST-SHELL.md` |
