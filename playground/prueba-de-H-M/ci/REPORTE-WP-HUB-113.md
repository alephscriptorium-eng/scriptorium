# WP-HUB-113 · hm-ci-que-verifica — reporte

| dato | valor |
| ---- | ----- |
| agente | Orquestador LORE-HM (ola 0) |
| fecha | 2026-08-02 |
| rama | `wp/hub-113-hm-ci-que-verifica` |
| worktree | `C:/S_LAB/wt/scriptorium-wp-hub-113` |
| estado | 🔶 → se cierra con run-id `gh` medido |

## Qué se hizo

Montado flujo **CI LORE-HM** en el hub (antes solo `docs.yml`):

- `.github/workflows/ci-lore-hm.yml` — dispara en `main` / `wp/**` / PR / dispatch
- Preflight `identidad-raiz` **en CI** (WORLD=CANONICAL=`github.workspace`, RO=`[]`, downstream=`[]`)
- `skills:ceguera` en CI
- Suite `playground/prueba-de-H-M/ci/suite.mjs` (`npm run test:lore-hm`)
- Guarda anti-regreso: cero `continue-on-error` funcionales en `.github/workflows/`
- Vector rojo: marcador `ci/ROJO-PLANTADO` enrojece la suite (demostrado local + en Actions)

**s-sdk:** no tocado en este commit (hub = WORLD_ROOT primario + playground).
Si hace falta espejo en S, queda como follow-up explícito.

## CA

| criterio | evidencia |
| -------- | --------- |
| Rojo plantado enrojece | ver `VECTOR-ROJO.md` + run-id fallido |
| Cero continue-on-error blandos + guarda | paso «Guarda · ningún paso blando» + script |
| Preflight + ceguera en CI | pasos del workflow |
| Veredicto con `gh` + run-id | tabla abajo (medido) |

## Run-ids (`gh`)

| evento | run-id | conclusion |
| ------ | ------ | ---------- |
| _(rellenar tras push)_ | — | — |

## Merge

**No** merge a main desde este encargo sin gate verde medido y aceptación.
Verde de 112 sigue siendo **local** hasta que este CI cubra la lane.
