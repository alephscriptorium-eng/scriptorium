# WP-HUB-111 · hm-escenarios-descubribles — reporte

| dato | valor |
| ---- | ----- |
| agente | Worker LORE-HM |
| fecha | 2026-08-02 |
| rama | `wp/hub-111-hm-escenarios-descubribles` |
| worktree | `C:/S_LAB/wt/scriptorium-wp-hub-111` |
| base | **`c44ee91`** (tip `main`, tras el rebase ZV). La base original era el tip accum `4305792`; quedó rancia al rebasar y se corrige aquí. |
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
`package.json` (108+109).

> **Corrección ZV vuelta 2.** Aquí decía además que «se aflojó el conteo exacto
> 11→≥11 en `test-100-schemas`». **Eso ya no es cierto, y en el árbol entregado
> nunca lo fue.** El rebase resolvió ese conflicto **tomando `main` entero**
> (que ya traía el mismo arreglo, más un chequeo de clon estructural), así que
> el blob es idéntico al de `main` — `8f4c82d22b0578fc1657dee2850a8c6c7893ecdc`,
> `git diff --numstat main..HEAD` sobre ese fichero: **cero líneas** — y lo que
> hace es lo **contrario** de aflojar: exige **presencia de los once nombrados**
> (`ci/test-100-schemas.mjs:454`). La frase vieja se conservaba en dos sitios de
> este reporte (aquí y en la tabla de archivos); las dos quedan corregidas.

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
| ~~`ci/test-100-schemas.mjs`~~ | **NO tocado** (corregido ZV vuelta 2). El rebase tomó el lado de `main`; blob `8f4c82d2…` idéntico a `main`, diff de **0 líneas**. Antes esta fila decía «modificado — conteo schemas ≥ base-11». |
| `package.json` | modificado — resolve conflicto 108/109 + script test:escenarios |
| `README.md` | modificado — filas segundo-minimo + lib/escenarios |
| `lib/escenarios/ejecutar.mjs` | creado (ZV) — ejecución real del escenario |
| `REPORTE-WP-HUB-111.md` | creado — este reporte |
| `REPORTE-ZV-111.md` | creado (ZV) — cierre bajo condiciones |

## CA

> **Corregida por ZV (2026-08-02).** La fila 1 decía «corre» cuando lo que
> `ci/test-111` hacía era **conformar**: no había ni una llamada a `runCeremonia`
> ni spawn de generación. Ahora corre de verdad — y la fila dice exactamente
> qué corre y qué no. Detalle y medidas en `REPORTE-ZV-111.md`.

| criterio | evidencia |
| -------- | --------- |
| segundo escenario **corre** sin tocar arnés | `node scripts/generar.mjs --scenario segundo-minimo --run test-111-segundo-minimo --sin-install` → `exit=0`, 9/9 artefactos, `seal=sha256:a8ea8294e735d4c73d3743d6ebf1acd74d952676c69e18573c277155129415b7`, rerun `no-op=true`; arnés sin cablear **ningún** id descubierto |
| … y **qué no** corre | `lib/ceremonia/run-ceremonia.mjs` (ceremonia v1 de 11 pasos) está anclada al escenario v1 por `lib/ceremonia/constants.mjs`; correrla para un no-v1 exigiría tocar el arnés, que es lo que la CA prohíbe |
| declara barrio, fixture, units, verbos, CA, cleanup | conformidad 15/15 chequeos ×2 escenarios, de los cuales **4 son de referencia** (`units` ⊂ `units/catalog`, verbos ⊂ ontología, `cleanup.shutdownVerbs` ⊂ ontología, fixture en disco) |
| discovery no promueve a v1 lo que no lo es | `v1=[barrio-lore]` 1/2; hostil con `v1`+`promoteToV1`+`tier` → 3/3 banderas **vistas y descartadas** (`classifyV1` ahora lee `d.data`); en disco 0/2 escenarios con esas claves (schema `additionalProperties:false`) |

## Evidencia

> **Corrección ZV vuelta 2.** Este bloque pegaba `# lore-hm suite: PASS`. **La
> suite está en ROJO** en el tip entregado, y lo estaba ya cuando se escribió:
> `ci/suite.mjs` corta en `test-108-mapa`. No es un fallo de esta ficha —está
> heredado de `main` y diagnosticado en `REPORTE-ZV-111.md` §7 (copia de trabajo
> CRLF frente a blob LF; un clon fresco pasa)—, pero **el entregable no puede
> decir PASS de algo que sale 1**.

```
identidad-raiz: PASS

node ci/test-111-escenarios.mjs
# test-111-escenarios: PASS

node ci/test-100-schemas.mjs
# test-100-schemas: PASS

node scripts/generar.mjs --scenario segundo-minimo --run test-111-segundo-minimo --sin-install
# exit=0 · seal=sha256:a8ea8294e735d4c73d3743d6ebf1acd74d952676c69e18573c277155129415b7
# (idéntico en tres corridas consecutivas)

node ci/suite.mjs
# test-108-mapa: FAIL (4)
# lore-hm suite: FAIL — test-108-mapa.mjs falló
# EXIT=1
```

Los diez tests del kit, uno a uno: **10 PASS / 1 FAIL** (`test-108-mapa`).
Detalle y causa medida en `REPORTE-ZV-111.md` §7.

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

> **Rehecha por ZV vuelta 2.** La firma anterior se puso sobre una tabla de
> archivos que atribuía un fichero no tocado y sobre un «suite PASS» falso: una
> auto-revisión firmada sobre datos malos no vale como auto-revisión. Se rehace
> entera, casilla por casilla, contra el árbol de hoy.

- [x] Diff solo bajo `playground/prueba-de-H-M/**` — verificado: `git diff --name-only main..HEAD` no sale de ahí
- [x] `playground/prueba-de-dos` sin cambios
- [x] `plan/` no tocado · sin merge main (el rebase hizo `--skip` del commit que lo tocaba)
- [x] Tabla de archivos = diff real (`ci/test-100-schemas.mjs` retirado: 0 líneas de diff)
- [x] Sellos/claims honestos: `segundo-minimo` ≠ v1 · sello **re-ejecutado**, no copiado (`a8ea8294…`)
- [ ] **Gates locales en verde: NO.** `test-111` PASS y 10/11 tests PASS, pero `ci/suite.mjs` sale **1** por `test-108-mapa`, heredado de `main` (ver §7 de `REPORTE-ZV-111.md`). Se deja sin marcar a propósito.
- [x] Commits convencionales

## Hallazgos fuera de alcance

- ~~Suite accum no cablea aún `test-108-mapa`~~ — **falso tras el rebase**
  (corregido ZV vuelta 2): `ci/suite.mjs` **sí** lo lanza, y es exactamente lo
  que hace fallar la suite. La causa medida —copia de trabajo CRLF frente al
  blob LF que sella `source.manifest.json`— está en `REPORTE-ZV-111.md` §7. Es
  higiene de worktree heredada de `main`, no de esta ficha, y no se toca desde
  aquí.
- WP-HUB-110 (dep nominal) no estaba en tip accum al despacho.

## Dudas / bloqueos

Ninguno.

---

## Revisión del orquestador

_(la rellena el orquestador)_
