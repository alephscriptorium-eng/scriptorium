# WP-HUB-113 · hm-ci-que-verifica — reporte

| dato | valor |
| ---- | ----- |
| agente | Orquestador LORE-HM (ola 0) |
| fecha | 2026-08-02 |
| rama | `wp/hub-113-hm-ci-que-verifica` |
| worktree | `C:/S_LAB/wt/scriptorium-wp-hub-113` |
| estado | ✅ hub · PASS_CON_ADDENDA (contrarrevisión) |

## Qué se hizo

Montado flujo **CI LORE-HM** en el hub (antes solo `docs.yml`):

- `.github/workflows/ci-lore-hm.yml` — dispara en `main` / `wp/**` / PR / dispatch
- Preflight `identidad-raiz` **en CI** (WORLD=CANONICAL=`github.workspace`, RO=`[]`, downstream=`[]`)
- `skills:ceguera` en CI
- Suite `playground/prueba-de-H-M/ci/suite.mjs` (`npm run test:lore-hm`)
- Guarda anti-regreso: cero `continue-on-error` funcionales en `.github/workflows/`
- Vector rojo: marcador `ci/ROJO-PLANTADO` enrojeció Actions; luego retirado

**s-sdk:** no tocado. Sin cobertura de espejo CI en este WP — sigue régimen
**verde local** / follow-up (o acta custodio). No se afirma cierre dual-mundo.

## CA

| criterio | evidencia |
| -------- | --------- |
| Rojo plantado tumba el job | run-id **30726279433** failure · `VECTOR-ROJO.md` |
| Cero continue-on-error blandos + guarda | paso «Guarda · ningún paso blando» + script |
| Preflight + ceguera en CI | pasos del workflow (verde **30726224409**) |
| Veredicto con `gh` + run-id | tabla abajo |

El CA **medible del hub** se sostiene: rojo tumba el job; preflight + ceguera
corren en CI; sin `continue-on-error` funcional.

## Run-ids (`gh`)

| evento | run-id | conclusion | sha |
| ------ | ------ | ---------- | --- |
| arnés | [30726224409](https://github.com/alephscriptorium-eng/scriptorium/actions/runs/30726224409) | success | `98cf881` |
| rojo plantado | [30726279433](https://github.com/alephscriptorium-eng/scriptorium/actions/runs/30726279433) | failure | `9763638` |
| restaura | [30726323270](https://github.com/alephscriptorium-eng/scriptorium/actions/runs/30726323270) | success | `c21e2d6` |

```
gh run list --workflow=ci-lore-hm.yml --branch=wp/hub-113-hm-ci-que-verifica --limit 5
```

## Addenda · PASS_CON_ADDENDA

Fuente: `playground/prueba-de-H-M/ci/CONTRARREVISION-WP-HUB-113.md` · veredicto
**PASS_CON_ADDENDA**.

1. **Alcance del ✅:** el job `lore-hm gates` **enrojece** el workflow (medido).
   **No** se afirma «bloquea merge» en `main`: branch protection / rulesets
   ausentes (`Branch not protected`).
2. **s-sdk:** fuera de cobertura de este cierre. Sigue verde local hasta espejo
   CI o acta custodio; GOBIERNO §4.4 dual-mundo **no** cerrado por 113 solo.
3. **Preflight en runner:** WORLD=CANONICAL=workspace es smoke de que el
   detector **corre**, no LOCK de identidad de estación.
4. **Bypass residual:** `paths` / `if: false` en YAML podrían apagar el
   disparo sin meta-guarda; valorar required check cuando haya GO custodio.

## Merge

**No** merge a main desde este encargo. Push de rama; CI hub medido (§4).
Ola 1 **no** despachada desde aquí — espera GO custodio.
