# AVISO · vigía · gate R4-S · post-lote IB-12 ∥ IB-13 · pre IB-20

**Carril:** S  
**Ronda pedida:** `R4-S`  
**Emisor:** vigía (post-aceptación lote IB-12 ∥ IB-13)  
**Fecha:** 2026-07-22  
**Estado gate:** ⚠️ **PASS-con-residual** — ver `INFORME-VIGIA-R4-S.md`

## Pedido

Tras cierre del lote IB-12 ∥ IB-13 en `main` @ `f6e4480` (🔶
`4a0ea1f`), el vigía emite **informe dual PO/scrum** de ronda **R4-S**
con veredicto PASS | FAIL | PASS-con-residual sobre:

1. Higiene §8 real en `C:\S\scriptorium` + worktrees
2. CA de facto IB-12 e IB-13 (sin reescribir alcance)
3. Re-chequeo DNS / Pages / redirect con evidencia literal (curl/dns)

## Checklist higiene (§8) — pulso vigía R4-S

```text
[x] sin worktrees huérfanos en territorio (git worktree list = 1 root)
[x] sin ramas wp/* (locales ni remotas)
[x] git status limpio; tip = origin/main
[x] Rn-S PASS-con-residual — lo declara el vigía (INFORME-VIGIA-R4-S.md)
[x] index.lock / HEAD.lock ausentes (al cierre del pulso)
[x] C:\S\.worktrees vacío (0 entradas; dir residual benigno)
```

## Vetos / doctrina a cruzar en el gate

- Cero borrados sin veredicto desechable → OK (lote no borró fuera de alcance)
- No tocar `alephscript-network-sdk` salvo remote epsylon → OK (intocado)
- §F3a o-sdk: cero arqueología → OK; tip pin `632ee2a2…` sin excavación
- PORT NO REWRITE · DS-5 → OK (6 gitlinks intactos)
- Residuo nests a-sdk (`--recursive`) → nota forense; no bloquea
- DNS = gate externo custodio (tick pendiente) — **no fingir verde**

## Entrega del vigía

1. Informe **cara PO** (custodio) — en `INFORME-VIGIA-R4-S.md`
2. Informe **cara scrum** (accionable para orquestador carril S) — idem
3. Etiqueta `R4-S` + **PASS-con-residual**
4. Orquestador **puede** 🔶 IB-20 **tras** este veredicto; residual DNS
   no bloquea IB-20 (reunificación de planes) — sí condiciona CA de
   dominios de IB-13 (tick custodio aparte)
5. El vigía **no** despacha workers ni abre IB-20+
6. Push de este aviso + informe; hashes POST-push en el informe

## Prueba de ceguera (cara hacia swarm)

Este aviso vive en el plan del mundo (idioma del workspace). Informe
dual: ceguera cara scrum = 0 (detalle en el informe).
