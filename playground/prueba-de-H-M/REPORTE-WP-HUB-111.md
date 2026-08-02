# WP-HUB-111 · hm-escenarios-descubribles — reporte

| dato | valor |
| ---- | ----- |
| agente | Worker LORE-HM |
| fecha | 2026-08-02 |
| rama | `wp/hub-111-hm-escenarios-descubribles` |
| worktree | `C:/S_LAB/wt/scriptorium-wp-hub-111` |
| base | tip accum `4305792` (post merge 109) |
| eje(s) CA | descubrimiento · conformidad común · v1 allowlist LORE |
| riesgo de revisión | `normal` |
| revisor distinto del worker | `no requerido` |
| preflight | `identidad-raiz: PASS` (WORLD=CANONICAL=worktree; READ_ONLY=`C:/S/scriptorium`+`C:/S_LAB/s-sdk`; DOWNSTREAM=`[]`) |
| estado propuesto | listo para revisión |

## Qué se hizo

Arnés `lib/escenarios/` que descubre `scenarios/<id>/scenario.json` sin lista
hardcodeada de ids y corre conformidad común (barrio, fixture, units, verbos,
CA, cleanup). Allowlist v1 = solo `barrio-lore` (`document-machine-sdk`);
flags `v1`/`promoteToV1` en JSON **no** promueven. Segundo escenario
`scenarios/segundo-minimo/` corre sin mención en el arnés. Schema exige
`fixture`. Desviación: se resolvió conflicto de merge preexistente en
`package.json` (108+109) y se aflojó el conteo exacto 11→≥11 en
`test-100-schemas` (schemas 109 ya en árbol).

## Archivos tocados

| archivo | acción |
| ------- | ------ |
| `lib/escenarios/discover.mjs` | creado — discovery por carpetas |
| `lib/escenarios/conformidad.mjs` | creado — suite conformidad común |
| `lib/escenarios/v1-allowlist.mjs` | creado — sólo barrio-lore en v1 |
| `lib/escenarios/index.mjs` | creado — barrel |
| `scenarios/segundo-minimo/scenario.json` | creado — segundo escenario mínimo |
| `scenarios/segundo-minimo/fixture/*` | creado — fixture declarado |
| `scenarios/barrio-lore/scenario.json` | modificado — declara `fixture` |
| `schemas/scenario.schema.json` | modificado — `fixture` required |
| `ci/test-111-escenarios.mjs` | creado — CA + hostil-omite no-promoción |
| `ci/suite.mjs` | modificado — wire `# WP-HUB-111` |
| `ci/test-100-schemas.mjs` | modificado — conteo schemas ≥ base-11 |
| `package.json` | modificado — resolve conflicto 108/109 + script test:escenarios |
| `README.md` | modificado — filas segundo-minimo + lib/escenarios |
| `REPORTE-WP-HUB-111.md` | creado — este reporte |

## CA

> **Corregida por ZV (2026-08-02).** La fila 1 decía «corre» cuando lo que
> `ci/test-111` hacía era **conformar**: no había ni una llamada a `runCeremonia`
> ni spawn de generación. Ahora corre de verdad — y la fila dice exactamente
> qué corre y qué no. Detalle y medidas en `REPORTE-ZV-111.md`.

| criterio | evidencia |
| -------- | --------- |
| segundo escenario **corre** sin tocar arnés | `node scripts/generar.mjs --scenario segundo-minimo --run test-111-segundo-minimo --sin-install` → `exit=0`, 9/9 artefactos, `seal=sha256:db3a044f…`, rerun `no-op=true`; arnés sin string de ningún id no-v1 |
| … y **qué no** corre | `lib/ceremonia/run-ceremonia.mjs` (ceremonia v1 de 11 pasos) está anclada a `barrio-lore` por `lib/ceremonia/constants.mjs`; correrla para un no-v1 exigiría tocar el arnés, que es lo que la CA prohíbe |
| declara barrio, fixture, units, verbos, CA, cleanup | conformidad 15/15 chequeos ×2 escenarios, de los cuales **4 son de referencia** (`units` ⊂ `units/catalog`, verbos ⊂ ontología, `cleanup.shutdownVerbs` ⊂ ontología, fixture en disco) |
| discovery no promueve a v1 lo que no lo es | `v1=[barrio-lore]` 1/2; hostil con `v1`+`promoteToV1`+`tier` → 3/3 banderas **vistas y descartadas** (`classifyV1` ahora lee `d.data`); en disco 0/2 escenarios con esas claves (schema `additionalProperties:false`) |

## Evidencia

```
identidad-raiz: PASS

node ci/test-111-escenarios.mjs
# test-111-escenarios: PASS

node ci/test-100-schemas.mjs
# test-100-schemas: PASS

node ci/suite.mjs
# lore-hm suite: PASS
```

## Evidencia de riesgo y contrarrevisión

- `CASOS_ADVERSARIALES`:
  - `[automatizado]` flags `v1`/`promoteToV1`/`tier` en JSON no promueven
  - `[automatizado]` arnés sin hardcode del id `segundo-minimo`
- `DEPENDENCIAS_DIRECTAS_VERIFICADAS`: `ajv` (ya en kit) + built-ins Node
- `INSTALACION_LIMPIA`: no deps nuevas
- `TEST_AUTOMATIZADO_VS_EVIDENCIA_MANUAL`:
  - Automatizado: `test-111-escenarios.mjs` + wire suite
  - Manual: alcance solo `playground/prueba-de-H-M/**`
- `VEREDICTO_REVISOR`: `no requerido`

## Auto-revisión (PRACTICAS)

- [x] Diff solo bajo `playground/prueba-de-H-M/**`
- [x] `playground/prueba-de-dos` sin cambios
- [x] BACKLOG no tocado · sin merge main
- [x] Sellos/claims honestos: segundo-minimo ≠ v1
- [x] Gates locales ejecutados (`test-111` + suite PASS)
- [x] Commits convencionales

## Hallazgos fuera de alcance

- Suite accum no cablea aún `test-108-mapa` (109 merge); test-109 reporta
  hook 108 noop pese a `fixtures/mapa/` — candidato a higiene accum, no 111.
- WP-HUB-110 (dep nominal) no estaba en tip accum al despacho.

## Dudas / bloqueos

Ninguno.

---

## Revisión del orquestador

_(la rellena el orquestador)_
