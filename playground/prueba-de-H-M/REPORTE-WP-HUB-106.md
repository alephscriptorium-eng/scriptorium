# WP-HUB-106 · hm-ceremonia-bilateral — reporte

| dato | valor |
| ---- | ----- |
| agente | Worker LORE-HM |
| fecha | 2026-08-02 |
| rama | `wp/hub-106-hm-ceremonia-bilateral` |
| worktree | `C:/S_LAB/wt/scriptorium-wp-hub-106` |
| base | tip accum `3e9f2a1` (100–105+101) |
| herencia | spike 112 — simulacro playground completo; FM no corre |
| eje(s) CA | frontera simulación · cadena causal bilateral · evidence desde eventos |
| riesgo de revisión | `independiente` |
| revisor distinto del worker | `sí` |
| estado propuesto | listo para revisión adversarial |

## Qué se hizo

Implementada la ceremonia `barrio-lore-v1` en **11 pasos bloqueantes** bajo
`lib/ceremonia/`: preflight/identidad → room/autoridad → inflate+lease
Bartleby/Cristalizador → machine.deploy resto → ingest Onfalo+análisis →
VectorMock → dos líneas → grafo → dos universos/runners → cortos+query →
trace/coverage/shutdown. Por actividad: envelope tipado → `wire.json` sellado
+ `view.jsonld` + evento en pod. Handoffs H/M con misma cadena causal fila a
fila; cada mitad firma sólo la suya; fallo inyectado en cualquiera de los 11
deja cero estado parcial. `evidence/report.json` + `report.md` generados desde
eventos. Tests en `ci/test-106-ceremonia.mjs` cableados en `suite.mjs`. Sin
BACKLOG ni merge main.

## Archivos tocados

| archivo | acción |
| ------- | ------ |
| `lib/ceremonia/constants.mjs` | creado — 11 pasos, actores, secretos firma |
| `lib/ceremonia/envelope.mjs` | creado — envelope + seal wire + view.jsonld |
| `lib/ceremonia/sign.mjs` | creado — firma por mitad (HMAC sim) |
| `lib/ceremonia/evidence.mjs` | creado — report.json/md desde eventos |
| `lib/ceremonia/steps.mjs` | creado — handlers 1–11 (reusa cadena/podstore) |
| `lib/ceremonia/run-ceremonia.mjs` | creado — orquestación + wipe parcial |
| `lib/ceremonia/index.mjs` | creado — reexports |
| `scripts/ceremonia.mjs` | creado — CLI |
| `ci/test-106-ceremonia.mjs` | creado — CA automatizadas |
| `ci/suite.mjs` | modificado — wire `# WP-HUB-106` |
| `package.json` | modificado — scripts `ceremonia` / `test:ceremonia` |
| `lib/podstore/LocalPodProvider.mjs` | modificado — `recordEvent` + `wipe` |
| `scenarios/barrio-lore/scenario.json` | modificado — 11 pasos alineados BRIEF |
| `REPORTE-WP-HUB-106.md` | creado — este reporte |

## CA

| criterio | evidencia |
| -------- | --------- |
| H y M misma cadena causal fila a fila | `compareCausalChains` PASS · 17 filas |
| 11 pasos primarios | PASS en handoff H |
| ningún paso sin upstream | `skipStep=5` → missing-upstream + wipe |
| fallo → cero estado parcial (×11) | `killAtStep` 1..11 · runRoot ausente |
| evidence desde eventos | report.json schema + report.md derivados |
| cada mitad firma sólo la suya | firmas `:H`/`:M` + reject cross-sign |

## Evidencia

```
node ci/test-106-ceremonia.mjs
# test-106-ceremonia: PASS — corrida feliz verdict=pass
# test-106-ceremonia: PASS — H y M misma cadena causal fila a fila (17 filas)
# test-106-ceremonia: PASS — 11 pasos primarios en handoff H
# test-106-ceremonia: PASS — wire.json sellado + view.jsonld ×34
# test-106-ceremonia: PASS — cada mitad firma sólo la suya
# test-106-ceremonia: PASS — evidence/report.json + report.md desde eventos
# test-106-ceremonia: PASS — ningún paso continúa sin upstream
# test-106-ceremonia: PASS — fallo→cero estado parcial (kill en cada uno de los 11)
# test-106-ceremonia: PASS — eventos ceremony.activity en 9 pods
# test-106-ceremonia: PASS — scenario barrio-lore-v1 · 11 pasos alineados
# test-106-ceremonia: PASS
```

Verde **local**.

## Evidencia de riesgo y contrarrevisión

- `CASOS_ADVERSARIALES`:
  - `[automatizado]` kill en cada uno de los 11 → cero parcial
  - `[automatizado]` skipStep → bloqueo upstream
  - `[automatizado]` H no firma actividad de M
- `DEPENDENCIAS_DIRECTAS_VERIFICADAS`: reusa kit 100–105 (`ajv`, `@zeus/linea-kit`, podstore, cadena); built-ins Node
- `INSTALACION_LIMPIA`: no deps nuevas semánticas
- `TEST_AUTOMATIZADO_VS_EVIDENCIA_MANUAL`:
  - Automatizado: `test-106-ceremonia.mjs` + `suite.mjs`
  - Manual: alcance solo `playground/prueba-de-H-M/**`; BACKLOG no tocado
- `VEREDICTO_REVISOR`: `⏳ pendiente de revisor distinto`

## Auto-revisión

- [x] Diff solo bajo `playground/prueba-de-H-M/**`
- [x] No tocado `prueba-de-dos` / BACKLOG / merge main
- [x] Simulacro playground; sin agentes OASIS / FM viva
- [x] Gates locales ejecutados

## Hallazgos fuera de alcance

- Verificador externo sin directorios vivos H/M (WP-HUB-107) — cierra GHM

## Dudas / bloqueos

Ninguno.

---

## Revisión del orquestador

_(la rellena el orquestador)_
