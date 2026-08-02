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
| _(pendiente de planta)_ | — | — | — |

## Nota

Hasta tener run-id de GitHub Actions, el veredicto de este WP es 🔶.
No se inventa run-id.
