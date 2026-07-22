# AVISO · Vigilante-S · gate R13-S · post N0-03 (aceptación + C8 estructural)

**Carril:** S  
**Ronda pedida:** `R13-S`  
**Emisor:** orquestador S (post merge N0-03 · re-pielado 0.6.1)  
**Receptor:** **Vigilante-S** (estación viva `C:\S\vigilancia`) vía **custodio**  
**Fecha:** 2026-07-22  
**Estado gate:** ⏳ pendiente veredicto Vigilante-S

> N0-03 = ✅ mergeado · tip PRE `ddbea1a` · 🔶 `1bd7998` · obra
> `985eaa9` · merge `72e1330`. Portal consume
> `@alephscript/skills-scriptorium@0.6.1` · gitlink
> `codebase/skills-library` = `64883a9` (v0.6.1). CA estructural
> **local** verde (stamp/washi/callout · shell VP ausente). C8
> post-deploy Pages = **re-chequeo vigía** (orquestador no finge 200).
> Secuencia DA-S13: **N0-04=BRAND-1 → tag**. **Sin PASS R13-S no hay
> 🔶 N0-04.** Tag `release/numero-0` sigue **RETENIDO**.

## Cableado (contrato · sucesión de vigía · DA-S07)

- El vigía del carril S **es** la ventana Vigilante-S en `C:\S\vigilancia`.
- **No** es un subagente vigía del orquestador. **No** generar ni invocar
  subagentes con rol de vigía.
- Gates `Rn-S`: se piden por **AVISO** y el veredicto lo emite
  **Vigilante-S vía custodio**. **Sin PASS no hay 🔶.**

## Pedido

Tras merge N0-03 (re-pielado portal con piel fanzine real), el
orquestador pide informe dual PO/scrum de ronda **R13-S** con veredicto
PASS | FAIL | PASS-con-residual sobre:

1. **Higiene §8** en `C:\S\scriptorium` (worktrees / `wp/*` / locks /
   tip = origin/main / gitlinks 7/7 · skills-library = `64883a9`).
2. **Aceptación N0-03:**
   - pin `@alephscript/skills-scriptorium@0.6.1` + espejo sync
   - theme: `fanzine.css` + `Layout.vue` (no solo variables)
   - body N0-01 intacto (PORT)
   - RAIZ-C-S: línea ciclo vida `S_SDK-skills-library/` presente
3. **C8 estructural post-deploy (issue #15 en prod):**
   - 5 rutas 200: `/` · `/constelacion` · `/metodo` · `/ciudad` · `/cola`
   - título portada
   - home publicada: clases `stamp` / `washi` / `callout` **presentes**
   - shell DefaultTheme (`Layout` / `VPNav*`) **AUSENTE** en home
   - copy N0-01 no pisado por la piel
4. Autorización táctica para **🔶 N0-04** (BRAND-1 colofón) o bloqueos.
   **Sin PASS R13-S no hay 🔶 N0-04 ni tag.**

## Checklist higiene (§8) — pulso Vigilante-S R13-S

```text
[ ] worktrees en territorio explicados (ideal: solo root)
[ ] ramas wp/* mergeadas o justificadas · locks ausentes · stash vacío
[ ] tip = origin/main (0/0)
[ ] gitlinks 7/7 · skills-library = 64883a9 (bump autorizado GO N0-03)
[ ] raíz FS == RAIZ-C-S (incl. S_SDK-skills-library ciclo vida)
[ ] Rn-S = R13-S PASS | FAIL | PASS-con-residual — lo declara Vigilante-S
```

## Evidencia local orquestador (no sustituye C8 deploy)

```text
docs:build exit=0 · docs:verificar exit=0
verificar-piel-fanzine: stamp/washi/callout PRESENT · shell VP ausente
body index.md == ddbea1a (strip frontmatter)
CNAME = aleph-null.escrivivir.co
reporte: plan/SPRINTS/PORTAL-NUMERO-0/REPORTES/N0-03-repielado-portal.md
```

## Entregables pedidos al vigía

1. Informe **cara PO** — p.ej. `INFORME-VIGIA-R13-S.md`
2. Cara scrum + higiene §8
3. Etiqueta `R13-S` + veredicto
4. Orquestador **solo entonces** puede 🔶 N0-04 (colofón) → tag

## Vetos

- Cero arqueología · cero force · PORT NO REWRITE · network-sdk solo
  remote epsylon · no subagente vigía · **no** 🔶 N0-04 hoy · **no**
  tag `release/numero-0` hoy · **no** BRAND-2.
