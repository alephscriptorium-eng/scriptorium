# WP-HUB-110 · hm-negativos-y-consumidor-limpio — reporte

| dato | valor |
| ---- | ----- |
| agente | Worker LORE-HM |
| fecha | 2026-08-02 |
| rama | `wp/hub-110-hm-negativos-y-consumidor-limpio` |
| worktree | `C:/S_LAB/wt/scriptorium-wp-hub-110` |
| base | tip accum `2c4abea` |
| eje(s) CA | frontera negativa · cero parcial · offline instrumentado · rerun · ceguera |
| riesgo de revisión | `independiente` |
| revisor distinto del worker | `sí` |
| estado propuesto | listo para revisión adversarial |

## Qué se hizo

Matriz de 7 negativos con frontera propia (`lib/negativos/`) y wipe sin
estado parcial: corpus ausente, hash roto, schema inválido, pod sin lease,
VectorMock no declarado, upstream ausente, runner caído. Consumidor limpio
(`ci/test-110-consumidor-limpio.mjs`): `npm ci` en checkout temporal,
generación sin sibling paths, runtime bajo guardia offline (parche
net/http/https/dns/fetch — cero salidas no-loopback), rerun byte-a-byte del
evidence tree con mismo `runId` (leases deterministas en podstore; campos
tiempo declarados strippeados), shutdown sin residuales/locks, y
`npm run skills:ceguera` desde la raíz del hub. Sin BACKLOG ni merge main.

## Archivos tocados

| archivo | acción |
| ------- | ------ |
| `lib/negativos/*` | creado — fronteras + provocadores MATRIX |
| `lib/offline/*` | creado — instrumentación offline |
| `ci/test-110-negativos.mjs` | creado — CA matriz 7 fronteras |
| `ci/test-110-consumidor-limpio.mjs` | creado — CA consumidor limpio |
| `ci/suite.mjs` | modificado — wire `# WP-HUB-110` |
| `lib/podstore/LocalPodProvider.mjs` | modificado — leaseId/issuedAt deterministas |
| `package.json` | modificado — scripts test:negativos / test:consumidor-limpio |
| `REPORTE-WP-HUB-110.md` | creado — este reporte |

## CA

| criterio | evidencia |
| -------- | --------- |
| cada negativo falla en su frontera | 7× `NegativoError.frontier` propio |
| cero estado parcial | `.runs/neg-*` ausentes tras MATRIX |
| offline instrumentado | `withOfflineGuard` · 0 salidas no-loopback |
| rerun byte-a-byte | mismo runId · evidence tree idéntico salvo TIME_FIELDS |
| `skills:ceguera` raíz hub | `npm run skills:ceguera` PASS |

## Evidencia

```
node ci/test-110-negativos.mjs
# test-110-negativos: PASS — negativo «corpus ausente»
# test-110-negativos: PASS — negativo «hash roto»
# test-110-negativos: PASS — negativo «schema inválido»
# test-110-negativos: PASS — negativo «pod sin lease»
# test-110-negativos: PASS — negativo «VectorMock no declarado»
# test-110-negativos: PASS — negativo «upstream ausente»
# test-110-negativos: PASS — negativo «runner caído»
# test-110-negativos: PASS — cero estado parcial .runs/neg-*
# test-110-negativos: PASS

node ci/test-110-consumidor-limpio.mjs
# test-110-consumidor-limpio: PASS — npm ci en checkout temporal
# test-110-consumidor-limpio: PASS — generación sin sibling paths
# test-110-consumidor-limpio: PASS — runtime offline tras seed (cero salidas no-loopback)
# test-110-consumidor-limpio: PASS — rerun byte-a-byte (TIME_FIELDS=…)
# test-110-consumidor-limpio: PASS — shutdown residualProcesses=[]
# test-110-consumidor-limpio: PASS — shutdown tipestate finals stopped|failed
# test-110-consumidor-limpio: PASS — shutdown sin locks/pids (runners=2)
# test-110-consumidor-limpio: PASS — npm run skills:ceguera desde raíz hub PASS
# test-110-consumidor-limpio: PASS
```

Verde **local**. **Sin merge main**.

## Evidencia de riesgo y contrarrevisión

- `CASOS_ADVERSARIALES`:
  - `[automatizado]` 7 negativos con nombre propio + wipe
  - `[automatizado]` offline guard mide (no declara) salidas no-loopback
  - `[automatizado]` sibling-path scan post-generar
- `DEPENDENCIAS_DIRECTAS_VERIFICADAS`: reusa kit 100–109 (`ajv`, `@zeus/linea-kit`); built-ins Node para offline
- `INSTALACION_LIMPIA`: `npm ci` en checkout temporal del kit PASS
- `TEST_AUTOMATIZADO_VS_EVIDENCIA_MANUAL`:
  - Automatizado: `test-110-*.mjs` + `suite.mjs`
  - Manual: alcance solo `playground/prueba-de-H-M/**`; BACKLOG no tocado
- `VEREDICTO_REVISOR`: `⏳ pendiente de revisor distinto`

## Auto-revisión

- [x] Diff solo bajo `playground/prueba-de-H-M/**`
- [x] No tocado `prueba-de-dos` / BACKLOG / merge main
- [x] Simulacro playground; sin agentes OASIS / FM viva
- [x] Gates locales ejecutados

## Hallazgos fuera de alcance

Ninguno bloqueante.

## Dudas / bloqueos

Ninguno.

---

## Revisión del orquestador

_(la rellena el orquestador)_
