# AVISO · Vigilante-S · gate R14-S · post N0-04 (colofón marca · C8)

**Carril:** S  
**Ronda pedida:** `R14-S`  
**Emisor:** orquestador S (post merge N0-04 · WP-BRAND-1 colofón)  
**Receptor:** **Vigilante-S** (estación viva `C:\S\vigilancia`) vía **custodio**  
**Fecha:** 2026-07-22  
**Estado gate:** ⏳ pendiente veredicto Vigilante-S

> N0-04 = mergeado · tip PRE `f276690` · obra `18168a2` · merge
> `de52ba6`. Cantera `0567a24`. `LICENSE.md` = puntero GL (**≠** lore).
> CHANGELOG += N0-02/N0-03/N0-04. **Tag `release/numero-0` RETENIDO**
> hasta **PASS R14-S**. Orquestador **no finge** C8 Pages.

## Cableado (contrato · sucesión de vigía · DA-S07)

- El vigía del carril S **es** la ventana Vigilante-S en `C:\S\vigilancia`.
- **No** es un subagente vigía del orquestador. **No** generar ni invocar
  subagentes con rol de vigía.
- Gates `Rn-S`: se piden por **AVISO** y el veredicto lo emite
  **Vigilante-S vía custodio**. **Sin PASS R14-S no hay tag.**

## Pedido

Tras merge N0-04 (colofón marca), el orquestador pide informe dual
PO/scrum de ronda **R14-S** con veredicto PASS | FAIL | PASS-con-residual
sobre:

1. **Higiene §8** en `C:\S\scriptorium` (worktrees / `wp/*` / locks /
   tip = origin/main / gitlinks).
2. **Aceptación N0-04 / C8 de marca:**
   - **5 rutas 200** en canal real (Pages), **Y** presentes en HTML:
     home · `/licencia` · favicon · ≥2 banners-web cableados
     (URLs exactas a documentar)
   - pesos `*-web.png` **<150KB** (comando; no a ojo)
   - `docs:build` (+ verificar si aplica) verde en tip
   - `/licencia` explica capas (GPL + AI + or-later/v4 + lore pieza)
   - `LICENSE.md` **≠** lore (`licencia-AIPL-v1-lore`)
   - `<link rel="icon">` explícitos (no 404 favicon)
3. CHANGELOG lista N0-02 / N0-03 / N0-04.
4. Autorización para **tag `release/numero-0`** (notes = sección Número 0
   del CHANGELOG) **o** bloqueos. **Sin PASS R14-S no hay tag.**

## Checklist higiene (§8) — pulso Vigilante-S R14-S

```text
[ ] worktrees en territorio explicados (ideal: solo root)
[ ] ramas wp/* mergeadas o justificadas · locks ausentes · stash vacío
[ ] tip = origin/main (0/0)
[ ] gitlinks 7/7 invariantes (skills-library = 64883a9 salvo GO)
[ ] raíz FS == RAIZ-C-S
[ ] Rn-S = R14-S PASS | FAIL | PASS-con-residual — lo declara Vigilante-S
```

## Evidencia local orquestador (no sustituye C8 deploy)

```text
docs:build exit=0 · docs:verificar exit=0 (html=8)
*-web.png: fundacion 127354 · vibecoding 138071 · logo 78355 (<150KB)
favicon.ico/png + <link rel="icon"> en head
LICENSE.md puntero ≠ lore (sha lore prefix 6e4afb21…)
/licencia + banner cabecera + footer marca+licencia en dist
cantera hashes tabla brief OK @ 0567a24
hallazgo: banner-scriptorium.png tip = blob ceros (no inventado)
reporte: plan/SPRINTS/PORTAL-NUMERO-0/REPORTES/N0-04-brand-1.md
```

## Entregables pedidos al vigía

1. Informe **cara PO** — p.ej. `INFORME-VIGIA-R14-S.md`
2. Cara scrum + higiene §8
3. Etiqueta `R14-S` + veredicto
4. Orquestador **solo entonces** puede sellar `release/numero-0`

## Vetos

- Cero arqueología · cero force · PORT NO REWRITE · network-sdk solo
  remote epsylon · no subagente vigía · **no** tag hoy · **no** BRAND-2
  salvo GO aparte.
