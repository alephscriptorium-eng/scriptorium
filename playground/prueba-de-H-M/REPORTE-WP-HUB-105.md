# WP-HUB-105 · hm-cadena-lore-determinista — reporte

| dato | valor |
| ---- | ----- |
| agente | Worker LORE-HM |
| fecha | 2026-08-02 |
| rama | `wp/hub-105-hm-cadena-lore-determinista` |
| worktree | `C:/S_LAB/wt/scriptorium-wp-hub-105` |
| base | tip WP-HUB-104 `5662eaa` |
| herencia | spike 112 — SOLO handlers playground mock; NO agentes OASIS |
| eje(s) CA | frontera simulación · trazabilidad Onfalo · linea-kit reuse |
| riesgo de revisión | `independiente` |
| revisor distinto del worker | `sí` |
| estado propuesto | listo para revisión adversarial |

## Qué se hizo

Implementada la cadena lore determinista bajo `lib/cadena/`: Bartleby (5
secciones + meta), Cristalizador (machine manifest, no suplanta Pipeline),
VectorMock (embeddings+vecinos, `algorithm`+`seed` declarados, `mock=true`
siempre), Pipeline materializa `barrio-lore-onfalo` y `barrio-lore-futuros`
validadas con `@zeus/linea-kit` `manifest-tronco` (U245 sin tipos — declarado),
grafo que enlaza ambas `linea://` con URNs VectorMock, dos universos con
bifurcación real (divergencia de contenido), y `hm:CortoDeEjecucion` como chunk
del log del runner con `corto.query` que traza al raw Onfalo del snapshot 104.
Tests en `ci/test-105-cadena.mjs` cableados en `suite.mjs`. Sin BACKLOG ni
merge main.

## Archivos tocados

| archivo | acción |
| ------- | ------ |
| `lib/cadena/constants.mjs` | creado — ids secciones, seeds, lineIds |
| `lib/cadena/hash.mjs` | creado — sha256 / digest estable |
| `lib/cadena/bartleby.mjs` | creado — handler 5 secciones + meta |
| `lib/cadena/cristalizador.mjs` | creado — machine manifest |
| `lib/cadena/vector-mock.mjs` | creado — embeddings+vecinos mock |
| `lib/cadena/pipeline-lines.mjs` | creado — 2 líneas linea-kit |
| `lib/cadena/grafista.mjs` | creado — grafo + bifurcate |
| `lib/cadena/demiurgo.mjs` | creado — 2 universos divergentes |
| `lib/cadena/dramaturgo.mjs` | creado — cortos + query + traza |
| `lib/cadena/run-cadena.mjs` | creado — orquestación desde snapshot 104 |
| `lib/cadena/index.mjs` | creado — reexports |
| `ci/test-105-cadena.mjs` | creado — CA automatizadas |
| `ci/suite.mjs` | modificado — wire `# WP-HUB-105` |
| `package.json` | modificado — script `test:cadena` |
| `README.md` | modificado — zona `lib/cadena/` |
| `REPORTE-WP-HUB-105.md` | creado — este reporte |

## CA

| criterio | evidencia |
| -------- | --------- |
| linea-kit valida 2 líneas | `manifest-tronco` OK onfalo + futuros |
| mock=true siempre; enrojece si desaparece | PASS en test-105 |
| cero LLM / cero red | guard http/https/fetch + grep imports |
| 2 universos divergen | digest/fingerprint/tesis/log distintos |
| corto.query traza a raw Onfalo | `urn:onfalo:<id>` ∈ snapshot 104 + archivo `.md` |
| U245 sin fingir tipos | `package.json` comments declara U245 |

## Evidencia

```
node ci/test-105-cadena.mjs
# test-105-cadena: PASS — cero LLM / cero cliente vector real en lib/cadena
# test-105-cadena: PASS — Bartleby: 5 secciones + meta por pieza
# test-105-cadena: PASS — Cristalizador: machine manifest (no suplanta Pipeline)
# test-105-cadena: PASS — VectorMock: mock=true algorithm=hash-bag-v1 seed=hm-vector-mock-105-v1
# test-105-cadena: PASS — test enrojece si mock=true desaparece (detectado)
# test-105-cadena: PASS — linea-kit validate manifest-tronco OK · barrio-lore-onfalo
# test-105-cadena: PASS — linea-kit validate manifest-tronco OK · barrio-lore-futuros
# test-105-cadena: PASS — U245 declarado (sin fingir @types)
# test-105-cadena: PASS — grafo enlaza linea:// ×2 + URNs VectorMock
# test-105-cadena: PASS — 2 universos divergen (contenido/tesis/log)
# test-105-cadena: PASS — cortos trazan a raw Onfalo del snapshot 104
# test-105-cadena: PASS — corto.query filtra universo/unidad/verbo/rango + traza Onfalo
# test-105-cadena: PASS

node ci/suite.mjs
# lore-hm suite: PASS
```

Verde **local**.

## Evidencia de riesgo y contrarrevisión

- `CASOS_ADVERSARIALES`:
  - `[automatizado]` mock ausente detectado
  - `[automatizado]` red bloqueada (http/https/fetch)
  - `[automatizado]` universos idénticos romperían instantiate
  - `[automatizado]` corto sin traza Onfalo falla `assertOnfaloTrace`
- `DEPENDENCIAS_DIRECTAS_VERIFICADAS`: `@zeus/linea-kit@0.3.0`, `ajv` (ya en kit 100); built-ins Node
- `INSTALACION_LIMPIA`: no aplica deps nuevas semánticas — misma lock previa + script aditivo
- `TEST_AUTOMATIZADO_VS_EVIDENCIA_MANUAL`:
  - Automatizado: `test-105-cadena.mjs` + `suite.mjs`
  - Manual: alcance solo `playground/prueba-de-H-M/**`; BACKLOG no tocado
- `VEREDICTO_REVISOR`: `⏳ pendiente de revisor distinto`

## Auto-revisión

- [x] Diff solo bajo `playground/prueba-de-H-M/**`
- [x] No tocado `prueba-de-dos` / BACKLOG / merge main
- [x] U245 declarado, sin fingir `@types`
- [x] Handlers mock playground; sin agentes OASIS
- [x] Gates locales ejecutados

## Hallazgos fuera de alcance

- Ceremonia bilateral 11 pasos con wire Activity (WP-HUB-106)
- Verificador externo sin directorios vivos H/M (WP-HUB-107)

## Dudas / bloqueos

Ninguno.

---

## Revisión del orquestador

_(la rellena el orquestador)_
