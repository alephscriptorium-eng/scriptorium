# WP-HUB-113 · hm-ci-que-verifica — reporte

| dato | valor |
| ---- | ----- |
| agente | Orquestador LORE-HM (ola 0) |
| fecha | 2026-08-02 |
| rama | `wp/hub-113-hm-ci-que-verifica` |
| worktree | `C:/S_LAB/wt/scriptorium-wp-hub-113` |
| estado | ✅ gates medidos con `gh` (run-ids abajo) |

## Qué se hizo

Montado flujo **CI LORE-HM** en el hub (antes solo `docs.yml`):

- `.github/workflows/ci-lore-hm.yml` — dispara en `main` / `wp/**` / PR / dispatch
- Preflight `identidad-raiz` **en CI** (WORLD=CANONICAL=`github.workspace`, RO=`[]`, downstream=`[]`)
- `skills:ceguera` en CI
- Suite `playground/prueba-de-H-M/ci/suite.mjs` (`npm run test:lore-hm`)
- Guarda anti-regreso: cero `continue-on-error` funcionales en `.github/workflows/`
- Vector rojo: marcador `ci/ROJO-PLANTADO` enrojeció Actions; luego retirado

**s-sdk:** no tocado (hub = WORLD_ROOT primario + playground). Espejo en S =
follow-up si el custodio lo exige; la ficha permitía hub y/o s-sdk.

## CA

| criterio | evidencia |
| -------- | --------- |
| Rojo plantado enrojece | run-id **30726279433** failure · `VECTOR-ROJO.md` |
| Cero continue-on-error blandos + guarda | paso «Guarda · ningún paso blando» + script |
| Preflight + ceguera en CI | pasos del workflow (verde **30726224409**) |
| Veredicto con `gh` + run-id | tabla abajo |

## Run-ids (`gh`)

| evento | run-id | conclusion | sha |
| ------ | ------ | ---------- | --- |
| arnés | [30726224409](https://github.com/alephscriptorium-eng/scriptorium/actions/runs/30726224409) | success | `98cf881` |
| rojo plantado | [30726279433](https://github.com/alephscriptorium-eng/scriptorium/actions/runs/30726279433) | failure | `9763638` |
| restaura | _(tras este commit)_ | — | — |

```
gh run list --workflow=ci-lore-hm.yml --branch=wp/hub-113-hm-ci-que-verifica --limit 5
```

## Merge

**No** merge a main desde este encargo sin aceptación del custodio / contrarrevisión
si el riesgo lo pide. Push de rama hecho; CI tras push cumplido (§4).
