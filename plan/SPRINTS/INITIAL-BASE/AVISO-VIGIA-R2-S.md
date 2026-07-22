# AVISO · vigía · gate R2-S · pre-despacho IB-11

**Carril:** S  
**Ronda pedida:** `R2-S`  
**Emisor:** orquestador carril S (post-lote IB-01 ∥ IB-02 ∥ IB-10)  
**Fecha:** 2026-07-22  
**Estado gate:** ✅ **PASS** — ver `INFORME-VIGIA-R2-S.md`

## Pedido

Antes de marcar 🔶 / lanzar worker sobre:

| WP | Brief |
| -- | ----- |
| IB-11 | (brief aún no despachado; backlog INITIAL-BASE) |

el vigía emite **informe dual PO/scrum** de ronda **R2-S** con veredicto
PASS | FAIL sobre:

1. Higiene pre-despacho (§8 convivencia) en `C:\S\scriptorium` + worktrees
2. Aceptación de facto IB-01 / IB-02 / IB-10 contra briefs + CA
   (sin reescribir alcance)

## Checklist higiene (§8) — pulso vigía R2-S

```text
[x] sin worktrees huérfanos en territorio (git worktree list = 1 root)
[x] sin ramas wp/* (locales ni remotas listadas)
[x] git status plan/ limpio; tip = origin/main
[x] Rn-S PASS — lo declara el vigía (INFORME-VIGIA-R2-S.md)
[x] index.lock / HEAD.lock ausentes
[x] C:\S\.worktrees vacío (0 entradas; dir residual benigno)
```

## Vetos / doctrina a cruzar en el gate

- Cero borrados sin veredicto desechable → OK en IB-02 (rename + actas)
- No tocar `alephscript-network-sdk` salvo remote epsylon → OK (ausente/intocado)
- §F3a o-sdk: cero arqueología en IB-01/IB-02 → OK en reportes
- PORT NO REWRITE · regla 13 en IB-10 → OK; gitlinks = `<pendiente>` → IB-11
- Tip O_SDK post IB-01 para IB-11: `632ee2a2bbb10a19efbc57b2f0a847dd04333ff9`

## Entrega del vigía

1. Informe **cara PO** (custodio) — en `INFORME-VIGIA-R2-S.md`
2. Informe **cara scrum** (accionable para orquestador carril S) — idem
3. Etiqueta `R2-S` + **PASS**
4. Orquestador **puede** 🔶 + despachar IB-11 **tras** este PASS
5. El vigía **no** despacha workers ni abre IB-11
6. IB-12 (estación completa) fuera de alcance de este gate

## Prueba de ceguera (cara hacia swarm)

Este aviso vive en el plan del mundo (idioma del workspace). Informe
dual: ceguera cara scrum = 0 (detalle en el informe).
