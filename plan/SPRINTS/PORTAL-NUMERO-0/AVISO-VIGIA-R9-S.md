# AVISO · Vigilante-S · gate R9-S · pre N0-01 (contenido portal número 0)

**Carril:** S  
**Ronda pedida:** `R9-S`  
**Emisor:** orquestador S (pedido de gate · post R8-S cierre INITIAL-BASE)  
**Receptor:** **Vigilante-S** (estación viva `C:\S\vigilancia`, watcher activo) vía **custodio**  
**Fecha:** 2026-07-22  
**Estado gate:** ⏳ **PENDIENTE** — espera informe Vigilante-S (PASS | FAIL | PASS-con-residual)

> R8-S cerró el sprint INITIAL-BASE (no gate de despacho). Este aviso
> abre la **primera ronda de gate del arco PORTAL-NUMERO-0**. Naming:
> `R9-S` = siguiente ronda del carril S tras R8-S.

## Cableado (contrato · sucesión de vigía · DA-S07)

- El vigía del carril S **es** la ventana Vigilante-S en `C:\S\vigilancia`.
- **No** es un subagente vigía del orquestador. **No** generar ni invocar
  subagentes con rol de vigía.
- Gates `Rn-S`: se piden por **AVISO** y el veredicto lo emite
  **Vigilante-S vía custodio**. **Sin PASS no hay 🔶.**

## Pedido

Tras **encolar N0-01** (gobierno: backlog + brief PRE-🔶 + este aviso) en
`main`, el orquestador pide informe dual PO/scrum de ronda **R9-S** con
veredicto PASS | FAIL | PASS-con-residual sobre:

1. **Higiene §8** en `C:\S\scriptorium` (worktrees / ramas `wp/*` /
   locks / tip = origin/main / gitlinks invariantes).
2. **Gobierno del arco** sin reabrir INITIAL-BASE:
   - sprint `PORTAL-NUMERO-0` · WP **N0-01** ⬜ (sin 🔶)
   - brief `BRIEFS/N0-01.md` con partición + fusión documentada
   - **NO** reabre IB-13
3. **Fusión de fuentes** (lectura de gobierno, no obra docs aún):
   - Base Vigilante-S manda (`ENTREGA-VIGILANTE-S-contenido-aleph-null-2026-07-22.md` @ `b12d26f`)
   - Complemento Fable (`ENTREGA-COMPLEMENTO-FABLE-aleph-null-2026-07-22.md` @ `5f0a11b`)
   - **C-1 CORE** declarado en brief; C-6 fuera del WP
4. **Partición / vetos** del brief: escritura solo `docs/**` + reporte;
   piel NO; paquete `@alephscript/skills-scriptorium`; cero arqueología /
   force / PORT NO REWRITE; network-sdk solo remote epsylon.
5. Autorización táctica para **🔶 N0-01** (o bloqueos). **Sin PASS R9-S
   no hay 🔶 N0-01 ni worker de obra.**

## Checklist higiene (§8) — pulso Vigilante-S R9-S

```text
[ ] worktrees en territorio explicados (ideal: solo root)
[ ] ramas wp/* justificadas o ausentes
[ ] git status del plan/ del carril explicado
[ ] Rn-S = R9-S PASS | FAIL | PASS-con-residual — lo declara Vigilante-S
[ ] index.lock / HEAD.lock ausentes o explicados (freeze §9 si sostenido)
[ ] gitlinks 160000 ×6 invariantes (pins R5→R8)
```

## Vetos / doctrina a cruzar en el gate

- NO reabre IB-13 · NO IB-24+ en INITIAL-BASE
- Piel intacta (theme/ no tocado en gobierno)
- C8 post-deploy de las 5 rutas = re-chequeo **futuro** del Vigilante-S
  tras obra (este gate no finge deploy de contenido aún inexistente)
- **Sin PASS R9-S no hay 🔶 N0-01**
- No despachar worker en este aviso (solo pedido de gate)

## Sugerencia vigía-sesión (documentada · no ejecutar)

Tras PASS + obra N0-01 + OK vigía de cierre del arco: sellar resultado
como tag **`release/numero-0`** del portal (acta del cero; el zine tiene
números). Tag = **post-cierre** — no en este gate ni en el despacho.

### Condición pre-tag · CHANGELOG (nota Vigilante-S · R8-S)

`numero-0` es el **primer release** del repo. **ANTES del tag**:
derivar `CHANGELOG.md` en la raíz de `scriptorium` a partir del backlog
cerrado de facto (WPs ✅ de INITIAL-BASE + N0-01 al cerrar). El gate del
release cruzará **WPs ✅ ↔ CHANGELOG**. Mejor una línea de mandato ahora
que un FAIL después. No inventar entradas en este encolado; no tag sin
changelog. Ítem gobierno: `BACKLOG.md` §Pre-tag · CHANGELOG.

## Entrega del Vigilante-S (vía custodio)

1. Informe **cara PO** (custodio) — p.ej. `INFORME-VIGIA-R9-S.md`
2. Informe **cara scrum** (accionable para orquestador carril S)
3. Etiqueta `R9-S` + veredicto
4. Orquestador **solo entonces** puede 🔶 N0-01
5. Vigilante-S **no** despacha workers ni marca 🔶
6. Orquestador **no** lanza subagente vigía

## Contexto tip (orquestador · POST-push = HEAD real)

| dato | valor |
| ---- | ----- |
| tip main PRE-gobierno (fetch) | `4c8fb9032b71a47bf6170f4ab411cb23d8c71348` |
| tip R8-S cierre (INFORME) | `4c8fb9032b71a47bf6170f4ab411cb23d8c71348` |
| tip pulso R8-S (tabla INFORME) | `45234c1` (ancestro; main ya tiene informe) |
| tip main POST-push este aviso | `5838adb2a53b27e9543d9f7bc74b169c65bc79af` |

## Prueba de ceguera (cara hacia swarm)

Este aviso vive en el plan del mundo (idioma del workspace). Informe
dual: ceguera cara scrum = 0 (detalle en el informe del Vigilante-S).
