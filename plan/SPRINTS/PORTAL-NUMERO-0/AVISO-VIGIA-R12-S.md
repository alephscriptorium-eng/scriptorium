# AVISO · Vigilante-S · gate R12-S · pre N0-03 (re-pielado portal)

**Carril:** S  
**Ronda pedida:** `R12-S`  
**Emisor:** orquestador S (post cierre N0-02 · publish 0.6.1)  
**Receptor:** **Vigilante-S** (estación viva `C:\S\vigilancia`) vía **custodio**  
**Fecha:** 2026-07-22  
**Estado gate:** ✅ **PASS** — ver `INFORME-VIGIA-R12-S.md`

> N0-02 = ✅ · `@alephscript/skills-scriptorium@0.6.1` en canal real
> (Publish CI `29957370542` · tip librería `64883a9`). Tag
> `release/numero-0` sigue **RETENIDO** (DA-S13). Secuencia:
> **N0-03 → N0-04=BRAND-1 → tag**. **Sin PASS R12-S no hay 🔶 N0-03.**

## Cableado (contrato · sucesión de vigía · DA-S07)

- El vigía del carril S **es** la ventana Vigilante-S en `C:\S\vigilancia`.
- **No** es un subagente vigía del orquestador. **No** generar ni invocar
  subagentes con rol de vigía.
- Gates `Rn-S`: se piden por **AVISO** y el veredicto lo emite
  **Vigilante-S vía custodio**. **Sin PASS no hay 🔶.**

## Pedido

Tras publish N0-02 (piel fanzine en skill + C8 npm view), el orquestador
pide informe dual PO/scrum de ronda **R12-S** con veredicto PASS | FAIL |
PASS-con-residual sobre:

1. **Higiene §8** en `C:\S\scriptorium` (worktrees / `wp/*` / locks /
   tip = origin/main / gitlinks 7/7).
2. **Publish N0-02 verificado:**
   - `npm view @alephscript/skills-scriptorium@0.6.1` en registry canal
     real · gitHead = tip librería = CI success
   - issue #15 cerrado o trazable al release
3. **Partición N0-03:** brief stub listo; alcance
   `docs/.vitepress/theme/**` (+ pin skill si aplica); portal consume
   `@0.6.1`; **sin** adelantar N0-04 / BRAND-2 / tag.
4. Autorización táctica para **🔶 N0-03** (o bloqueos). **Sin PASS
   R12-S no hay 🔶 N0-03 ni re-pielado del portal.**

## Checklist higiene (§8) — pulso Vigilante-S R12-S

```text
[ ] worktrees en territorio explicados (ideal: solo root)
[ ] ramas wp/* mergeadas o justificadas · locks ausentes · stash vacío
[ ] tip = origin/main (0/0)
[ ] gitlinks 7/7 invariantes (sin bump no autorizado)
[ ] Rn-S = R12-S PASS | FAIL | PASS-con-residual — lo declara Vigilante-S
```

## Entregables pedidos al vigía

1. Informe **cara PO** — p.ej. `INFORME-VIGIA-R12-S.md`
2. Cara scrum + higiene §8
3. Etiqueta `R12-S` + veredicto
4. Orquestador **solo entonces** puede 🔶 N0-03

## Vetos

- Cero arqueología · cero force · PORT NO REWRITE · network-sdk solo
  remote epsylon · no subagente vigía · no tag `release/numero-0` hoy.
