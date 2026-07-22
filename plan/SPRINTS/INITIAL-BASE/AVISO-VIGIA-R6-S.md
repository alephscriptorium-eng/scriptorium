# AVISO · Vigilante-S · gate R6-S · post IB-20 · pre IB-21 ∥ IB-22

**Carril:** S  
**Ronda pedida:** `R6-S`  
**Emisor:** orquestador S (pedido de gate)  
**Receptor:** **Vigilante-S** (estación viva `C:\S\vigilancia`, watcher activo) vía **custodio**  
**Fecha:** 2026-07-22  
**Estado gate:** ⏳ pendiente de veredicto Vigilante-S

## Cableado (contrato · sucesión de vigía)

- El vigía del carril S **es** la ventana Vigilante-S en `C:\S\vigilancia`.
- **No** es un subagente vigía del orquestador. **No** generar ni invocar
  subagentes con rol de vigía.
- Gates `Rn-S`: se piden por **AVISO** en este directorio y los **emite
  Vigilante-S vía custodio**. Sin su **PASS** no hay 🔶 del siguiente lote.

## Pedido

Tras **aceptación y merge de IB-20** (reunificación de planes) en
`main`, el orquestador pide informe dual PO/scrum de ronda **R6-S** con
veredicto PASS | FAIL | PASS-con-residual sobre:

1. **Estado post-IB-20** en `C:\S\scriptorium` + higiene §8 (worktrees /
   ramas `wp/*` / locks / tip = origin/main).
2. **CA de facto IB-20** sin reescribir alcance: `plan/MUNDOS.md` ·
   `plan/PARTICION.md` · reporte `REPORTES/IB-20-reunificacion-planes.md`
   · partición (sdk SOLO LECTURA · cero bump gitlinks) · punteros
   cuadernos.
3. Residual DNS (no obra de este gate salvo re-chequeo si Vigilante-S lo
   incluye): aleph-null Pages VIVO (R5-S); redirect scriptorium→pub
   **DIFERIDO** sine die — **no fingir verde**.
4. Autorización táctica para lote **IB-21 ∥ IB-22** (o bloqueos).

## Checklist higiene (§8) — pulso Vigilante-S R6-S

```text
[ ] worktrees en territorio explicados (ideal: solo root tras higiene)
[ ] ramas wp/* justificadas o ausentes (wp/ib-20 mergeada → borrar)
[ ] git status del plan/ del carril explicado
[ ] Rn-S = R6-S PASS | FAIL | PASS-con-residual — lo declara Vigilante-S
[ ] index.lock / HEAD.lock ausentes o explicados (freeze §9 si sostenido)
```

## Vetos / doctrina a cruzar en el gate

- Cero borrados sin veredicto desechable
- No tocar `alephscript-network-sdk` salvo remote epsylon
- §F3a o-sdk: cero arqueología
- PORT NO REWRITE · DS-5 · convivencia v1.1
- **Sin PASS R6-S no hay 🔶 IB-21 ∥ IB-22**
- DNS residual = custodio; orquestador no lo trabaja
- No abrir IB-23 en este gate

## Entrega del Vigilante-S (vía custodio)

1. Informe **cara PO** (custodio) — p.ej. `INFORME-VIGIA-R6-S.md`
2. Informe **cara scrum** (accionable para orquestador carril S)
3. Etiqueta `R6-S` + veredicto
4. Orquestador **solo entonces** puede 🔶 IB-21 ∥ IB-22
5. Vigilante-S **no** despacha workers ni abre IB-21+
6. Orquestador **no** lanza subagente vigía

## Contexto tip (PRE-aviso; orquestador rellena POST-push)

| dato | valor |
| ---- | ----- |
| 🔶 IB-20 | `6a788709e890f0888892980fa591a80f16547894` |
| accept IB-20 | `5be24e46ef00baa062eb719b376e3375ee14094d` |
| merge IB-20 | `844ea0d5d290024a024f4f9114288196a7b21bd8` |
| tip main PRE-push aviso | (merge tip pusheado) `844ea0d5d290024a024f4f9114288196a7b21bd8` — tip tras push de este aviso se reporta al padre |

## Prueba de ceguera (cara hacia swarm)

Este aviso vive en el plan del mundo (idioma del workspace). Informe
dual: ceguera cara scrum = 0 (detalle en el informe del Vigilante-S).
