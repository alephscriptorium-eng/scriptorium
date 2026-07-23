# INFORME · VIGILANTE-S · R25-S · PRUEBA-DE-DOS · 2026-07-23

| dato | valor |
| ---- | ----- |
| Ronda | `R25-S` (gate aceptación PD-01 / PD-02 + fila MAPA-REPO) |
| AVISO | `AVISO-VIGIA-R25-S.md` |
| SHA pulso | `61c162c` (main · ahead origin/main ×4 · DC-15 local-only) |
| **Veredicto** | **PASS** |

## Cara PO

- **PD-01 aceptado.** Kit `playground/prueba-de-dos/` en git (tip
  `4427caa`): `SKILL.md` · `manual.md` · handoffs plantilla ·
  `scripts/generar.mjs` · `.npmrc` dual-scope · `.gitignore`. Smoke
  re-verificado de facto: `npm ls` VERDE en H y M (stack `@zeus` ×8);
  transitiva `@alephscript/mcp-core-sdk@1.5.0` resuelta; generador
  idempotente (`--sin-install` no pisa). `H/`/`M/` gitignoradas.
- **PD-02 aceptado (spike).** Submanual `reference/PEERCARD.md`: tres
  vías (card vigente / emisión admin / anónimo) + instrucciones
  `issuePeerCard`/`onPeerCard` para el operador-admin. La decisión de
  crear skill `operador-rooms` **sigue abierta al custodio** — no
  bloquea este PASS.
- **Fila MAPA-REPO aceptada.** `playground/prueba-de-dos/` figura en
  `plan/MAPA-REPO.md` (gobierno `e550d21`) y el árbol trackeado la
  respalda.
- Pulso estación: watcher one-shot limpio · territorio==mapa
  `--root C:\S --plan C:\S\scriptorium\plan` → **OK (3 mapas)**.
- Pedir decisión: **(1)** despachar PD-03 (corrida H/M; CA = manual §5;
  sin este PASS no había 🔶 — ya hay PASS). **(2)** skill
  `operador-rooms` sí/no (encolada; no bloquea PD-03).
- Observación: diff local sin commit en `manual.md` (custodio: H/M →
  Human/Machine). No invalida el tip auditado; conviene asentar antes
  o durante PD-03.

## Cara scrum

```text
[x] PD-01 kit en git (9 paths) · .npmrc @zeus+@alephscript
[x] smoke de facto: npm ls H/M VERDE · mcp-core-sdk@1.5.0 transitiva
[x] generate A_B --sin-install idempotente (no pisa)
[x] PD-02 PEERCARD.md · 3 vías + emisión admin
[x] MAPA-REPO fila playground/prueba-de-dos/ (e550d21 + ls-files)
[x] territorio==mapa OK (3) · watch 20:33:05 sesion=1 skills_mat=6
      residuo_filtrado=0 locks=''
[x] higiene: 1 worktree (main) · 0 stash · 0 index.lock · 0 wp/*
      activos en obra
[ ] PD-03 ⬜ — desbloqueado; CA manual §5; registros en H/M no-git
```

Siguiente: orquestador marca PD-01/PD-02 ✅ en BACKLOG del sprint y
despacha PD-03 (dos operadores; evidencia literal en handoffs vivos;
reporte a `plan/SPRINTS/PRUEBA-DE-DOS/`). Vigilante-S vigila la corrida;
sin CA §5 no hay ✅ de PD-03.

Ceguera cara-scrum: 0 (vocabulario del mundo; sin marco filtrado).
