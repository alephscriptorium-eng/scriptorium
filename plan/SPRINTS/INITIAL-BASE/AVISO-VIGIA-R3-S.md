# AVISO · vigía · gate R3-S · pre-despacho IB-12 ∥ IB-13

**Carril:** S  
**Ronda pedida:** `R3-S`  
**Emisor:** orquestador carril S (post-aceptación IB-11)  
**Fecha:** 2026-07-22  
**Estado gate:** ✅ **PASS** — ver `INFORME-VIGIA-R3-S.md`

## Pedido

Antes de marcar 🔶 / lanzar workers sobre:

| WP | Brief |
| -- | ----- |
| IB-12 | skills + estación de vigilancia (aún no despachado) |
| IB-13 | web + dominios (aún no despachado; ∥ con IB-12) |

el vigía emite **informe dual PO/scrum** de ronda **R3-S** con veredicto
PASS | FAIL sobre:

1. Higiene §8 real en `C:\S\scriptorium` + worktrees
2. Aceptación de facto IB-11 contra brief + CA backlog (sin reescribir alcance)

## Checklist higiene (§8) — pulso vigía R3-S

```text
[x] sin worktrees huérfanos en territorio (git worktree list = 1 root)
[x] sin ramas wp/* (locales ni remotas)
[x] git status limpio; tip = origin/main
[x] Rn-S PASS — lo declara el vigía (INFORME-VIGIA-R3-S.md)
[x] index.lock / HEAD.lock ausentes
[x] C:\S\.worktrees vacío (0 entradas; dir residual benigno)
```

## Vetos / doctrina a cruzar en el gate

- Cero borrados sin veredicto desechable → OK (IB-11 no borró salvo `.gitkeep` sustituido)
- No tocar `alephscript-network-sdk` salvo remote epsylon → OK (ausente/intocado)
- §F3a o-sdk: cero arqueología → OK; tip pin post IB-01 sin excavación
- PORT NO REWRITE · DS-5 apuntar-no-contener → OK (6 gitlinks + `.gitmodules`)
- Tip o-sdk: `632ee2a2bbb10a19efbc57b2f0a847dd04333ff9` (local = `ls-remote` main)
- Residuo nests a-sdk (`--recursive`) → nota a forense; no bloquea CA top-level

## Entrega del vigía

1. Informe **cara PO** (custodio) — en `INFORME-VIGIA-R3-S.md`
2. Informe **cara scrum** (accionable para orquestador carril S) — idem
3. Etiqueta `R3-S` + **PASS**
4. Orquestador **puede** 🔶 + despachar **IB-12 ∥ IB-13** **tras** este PASS
5. El vigía **no** despacha workers ni abre IB-12 / IB-13
6. Estación completa = alcance de IB-12 (no del vigía en este gate)

## Prueba de ceguera (cara hacia swarm)

Este aviso vive en el plan del mundo (idioma del workspace). Informe
dual: ceguera cara scrum = 0 (detalle en el informe).
