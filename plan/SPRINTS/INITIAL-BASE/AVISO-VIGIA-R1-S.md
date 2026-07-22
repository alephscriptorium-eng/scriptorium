# AVISO · vigía · gate R1-S · pre-despacho ola IB-0 + IB-10

**Carril:** S  
**Ronda pedida:** `R1-S`  
**Emisor:** orquestador de génesis (skills-scriptorium@0.5.1)  
**Fecha:** 2026-07-22  
**Estado gate:** ⏳ pendiente PASS (no despachar hasta informe dual)

## Pedido

Antes de marcar 🔶 / lanzar workers sobre:

| WP | Brief |
| -- | ----- |
| IB-01 | `BRIEFS/IB-01.md` |
| IB-02 | `BRIEFS/IB-02.md` |
| IB-10 | `BRIEFS/IB-10.md` |

el vigía emite **informe dual PO/scrum** de ronda **R1-S** con veredicto
PASS | FAIL sobre higiene pre-despacho (§8 convivencia) y lectura de
briefs (alcance, vetos, paralelismo IB-0 ∥ IB-10).

## Checklist higiene (§8) — auto-declaración génesis

```text
[x] repo público scriptorium creado; layout codebase/playground/docs/plan
[x] plan/ montado vía montar-plan.sh + sprint INITIAL-BASE portado
[x] sin workers ni worktrees wp/* abiertos en este territorio (génesis)
[ ] Rn-S PASS — lo declara el vigía (este aviso lo solicita)
[ ] index.lock / locks sostenidos — pulso vigía
```

## Vetos a verificar en el gate

- Cero borrados sin veredicto desechable.
- No tocar `alephscript-network-sdk` salvo remote epsylon.
- §F3a o-sdk: cero arqueología en briefs IB-01/IB-02.
- Convivencia v1.1 si hay otros orquestadores activos.

## Entrega esperada del vigía

1. Informe **cara PO** (custodio).
2. Informe **cara scrum** (accionable para orquestador carril S).
3. Etiqueta `R1-S` + PASS|FAIL.
4. Si PASS → orquestador puede 🔶 + despachar lote IB-01 ∥ IB-02 ∥ IB-10.
5. Si FAIL/silencio → no despacho.

## Prueba de ceguera (cara hacia swarm)

Este aviso vive en el plan del mundo (idioma del workspace). No requiere
cara §WP mediada adicional para el orquestador S — el vigía puede emitir
addenda dos caras si eleva anomalías.
