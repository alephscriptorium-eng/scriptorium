# WP-HUB-100 · hm-escenario-y-schemas — reporte

| dato | valor |
| ---- | ----- |
| agente | Worker LORE-HM |
| fecha | 2026-08-02 |
| rama | `wp/hub-100-hm-escenario-y-schemas` |
| worktree | `C:/S_LAB/wt/scriptorium-wp-hub-100` |
| herencia | spike WP-HUB-112 — FM **no corre**; kit = simulacro playground |
| estado propuesto | listo para revisión adversarial |

## Qué se hizo

Montado kit autocontenido bajo `playground/prueba-de-H-M/` con 11 schemas dominio
HM, escenario `barrio-lore` (barrio `document-machine-sdk`, distrito `lore-voz`),
catálogo de diez unidades y prueba CI `test-100-schemas.mjs` cableada en
`suite.mjs` (marcador `# WP-HUB-100`). Líneas referencian schemas publicados de
`@zeus/linea-kit@0.3.0` vía ids (`manifest-tronco`, etc.) y validación runtime
importada del paquete — sin copiar archivos `schemas/*.json` de linea-kit.
Future Machine declarada **simulacro** en escenario y machine schema.

## Archivos tocados

| archivo | acción |
| ------- | ------ |
| `playground/prueba-de-H-M/package.json` | creado — deps kit (`@zeus/linea-kit` file:, `ajv`) |
| `playground/prueba-de-H-M/README.md` | creado — nota simulacro + linea-kit sin tipos |
| `playground/prueba-de-H-M/schemas/*.schema.json` | creado — 11 schemas dominio |
| `playground/prueba-de-H-M/scenarios/barrio-lore/scenario.json` | creado — escenario canónico v1 |
| `playground/prueba-de-H-M/units/catalog/*.json` | creado — 10 unidades |
| `playground/prueba-de-H-M/ci/test-100-schemas.mjs` | creado — CA schemas + CENSO + linea-kit |
| `playground/prueba-de-H-M/ci/suite.mjs` | modificado — wire WP-HUB-100 |
| `playground/prueba-de-H-M/package-lock.json` | creado — lock npm kit |

## CA

| criterio | evidencia |
| -------- | --------- |
| 11 schemas validan +/- | `npm run test:lore-hm` → `test-100-schemas: PASS` (22 casos dominio) |
| Cero schemas línea propios | test lista `schemas/` — solo `*.schema.json` dominio; sin `manifest-tronco.json` etc. |
| linea-kit reuse | `validate('manifest-tronco', payload)` importado de z-sdk / kit `node_modules` |
| IDs CENSO | `document-machine-sdk` + `lore-voz` en `CENSO-ESTADOS.md` RO |
| `prueba-de-dos` limpio | `git diff vacío en playground/prueba-de-dos` en test |
| CI extendido | `ci/test-100-schemas.mjs` + `suite.mjs` marcador `# WP-HUB-100` |
| Simulacro declarado | `scenario.json` → `simulacro.futureMachine: true`, `runtime: playground-mock` |

## Evidencia

```
npm run test:lore-hm
# test-100-schemas: PASS
# lore-hm suite: PASS
```

Verde **local**. Tras push, hub puede citar workflow `ci-lore-hm.yml` (WP-HUB-113);
este WP no modificó el workflow.

## Riesgos / gaps

1. **CI remota:** `package.json` del kit usa `file:../../../../z-sdk/...` para
   linea-kit — el runner GitHub no tiene z-sdk. Follow-up: `@zeus:registry` en
   `.npmrc` raíz + dep `0.3.0` (fuera ALCANCE_DIFF de este WP).
2. **Tipos TS:** U245 no aterrizó — consumo sin `@types` (documentado en README).
3. **Ontología / generador / fixtures Onfalo:** fuera de alcance WP-100 (WPs 101+).

## Auto-revisión

- [x] Diff solo bajo `playground/prueba-de-H-M/**`
- [x] `playground/prueba-de-dos` sin cambios
- [x] BACKLOG no tocado
- [x] Claims honestos: simulacro, no `deployed` contra e-sdk vacío
- [x] Gates locales ejecutados

## Revisión del orquestador

_(pendiente)_

## Addenda orquestador · PASS_CON_ADDENDA

Contrarrevisión: `PASS_CON_ADDENDA`. Tip post-fix `44685a0`. Fuente: `C:/S_LAB/wt/_lore-hm-ola1-vigilancia/`.
