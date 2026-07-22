# AVISO · Vigilante-S · gate R5-S · post-R4-S · pre IB-20

**Carril:** S  
**Ronda pedida:** `R5-S`  
**Emisor:** orquestador S (pedido de gate)  
**Receptor:** **Vigilante-S** (estación viva `C:\S\vigilancia`, watcher activo) vía **custodio**  
**Fecha:** 2026-07-22  
**Estado gate:** ⏳ pendiente de veredicto Vigilante-S

## Cableado (contrato · sucesión de vigía)

- El vigía del carril S **es** la ventana Vigilante-S en `C:\S\vigilancia`.
- **No** es un subagente vigía del orquestador. **No** generar ni invocar
  subagentes con rol de vigía.
- Gates `Rn-S` (R5-S en adelante): se piden por **AVISO** en este directorio
  y los **emite Vigilante-S vía custodio**. Sin su **PASS** no hay 🔶.

## Pedido

Tras era R4-S ratificada (tip auditado `4e193bcb8b2d4ea1de9179f45de6a67ce5268a7b`)
y parada técnica con 🔶 IB-20 prematuro reconciliado a **espera R5-S**, el
orquestador pide informe dual PO/scrum de ronda **R5-S** con veredicto
PASS | FAIL | PASS-con-residual sobre:

1. **Estado post-R4-S** en `C:\S\scriptorium` + worktrees / higiene §8
   (incl. worktree aparcado `C:\S\.worktrees\wp-ib-20` · rama
   `wp/ib-20-reunificacion-planes` · sin obra — no borrar sin veredicto
   desechable).
2. **Nota de alcance IB-20** (territorio = **6 SDKs** bajo `codebase/`):
   el brief de despacho deberá llevar **partición de territorios
   declarada** explícita. R5-S debe opinar alcance / bloqueos / higiene
   previa a cualquier 🔶 IB-20.
3. Residual DNS = tick custodio (Pages aleph-null + redirect
   scriptorium→pub) — **no fingir verde**; no es obra de este gate salvo
   re-chequeo de evidencia si Vigilante-S lo incluye.

## Checklist higiene (§8) — pulso Vigilante-S R5-S

```text
[ ] worktrees en territorio explicados (root + wp-ib-20 aparcado justificado)
[ ] ramas wp/* justificadas o ausentes
[ ] git status del plan/ del carril explicado
[ ] Rn-S = R5-S PASS | FAIL | PASS-con-residual — lo declara Vigilante-S
[ ] index.lock / HEAD.lock ausentes o explicados (freeze §9 si sostenido)
```

## Vetos / doctrina a cruzar en el gate

- Cero borrados sin veredicto desechable (worktree IB-20 aparcado ≠ basura)
- No tocar `alephscript-network-sdk` salvo remote epsylon
- §F3a o-sdk: cero arqueología
- PORT NO REWRITE · DS-5
- **Sin PASS R5-S no hay 🔶 IB-20** (ni despacho de worker)
- DNS residual = custodio; orquestador no lo trabaja

## Entrega del Vigilante-S (vía custodio)

1. Informe **cara PO** (custodio) — p.ej. `INFORME-VIGIA-R5-S.md`
2. Informe **cara scrum** (accionable para orquestador carril S)
3. Etiqueta `R5-S` + veredicto
4. Orquestador **solo entonces** puede 🔶 IB-20 (brief con partición
   declarada · territorio 6 SDKs). Hasta PASS: IB-20 en espera.
5. Vigilante-S **no** despacha workers ni abre IB-20+
6. Orquestador **no** lanza subagente vigía

## Prueba de ceguera (cara hacia swarm)

Este aviso vive en el plan del mundo (idioma del workspace). Informe
dual: ceguera cara scrum = 0 (detalle en el informe del Vigilante-S).
