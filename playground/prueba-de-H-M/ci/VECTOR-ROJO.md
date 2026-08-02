# Vector rojo plantado · WP-HUB-113

| dato | valor |
| ---- | ----- |
| marcador | `playground/prueba-de-H-M/ci/ROJO-PLANTADO` |
| efecto | `npm run test:lore-hm` → exit 1 · job CI en rojo |
| guarda | el marcador **no** debe existir en la rama aceptada |

## Procedimiento (medido)

1. Commit verde con el arnés CI (sin marcador).
2. Commit que **añade** `ROJO-PLANTADO` → push → leer `gh run list` / `gh run view` · anotar **run-id** fallido.
3. Commit que **quita** el marcador → push → anotar run-id verde.
4. Esta tabla se rellena con ids medidos (no supuestos).

## Evidencia

| evento | run-id | conclusion | sha |
| ------ | ------ | ---------- | --- |
| arnés verde | [30726224409](https://github.com/alephscriptorium-eng/scriptorium/actions/runs/30726224409) | success | `98cf881` |
| rojo plantado | [30726279433](https://github.com/alephscriptorium-eng/scriptorium/actions/runs/30726279433) | **failure** | `9763638` |
| restaura verde | [30726323270](https://github.com/alephscriptorium-eng/scriptorium/actions/runs/30726323270) | success | `c21e2d6` |

## Nota

Orden medida con `gh run list --workflow=ci-lore-hm.yml --branch=wp/hub-113-hm-ci-que-verifica`.
El marcador se elimina en el commit de restauración; el vector queda documentado aquí.
