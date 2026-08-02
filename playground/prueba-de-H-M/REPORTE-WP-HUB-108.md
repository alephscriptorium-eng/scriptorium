# WP-HUB-108 · hm-mapa-holones-distritos — reporte

| dato | valor |
| ---- | ----- |
| agente | Worker LORE-HM |
| fecha | 2026-08-02 |
| rama | `wp/hub-108-hm-mapa-holones-distritos` |
| worktree | `C:/S_LAB/wt/scriptorium-wp-hub-108` |
| base | tip WP-HUB-107 `ebafafa` (accum post-GHM) |
| eje(s) CA | proyección 7×6×24 · cero slugs inventados · gate divergencia · 05/06/07 sin fingir runtime |
| riesgo de revisión | `normal` |
| revisor distinto del worker | `no requerido` |
| estado propuesto | listo para revisión |

## Qué se hizo

Proyección machine-readable **7 holones × 6 distritos × 24 barrios** sellada en
`fixtures/mapa/` (import-once). Derivada de cantera RO
(`CENSO-ESTADOS.md`, `01-BARRIOS/`, `GRAFO/handoffs-barrios.tsv`) y
`DEVOPS/METODOLOGIA/HOLONES.md` + listing `HOLONES/`. Runtime consume solo el
kit sellado (`--consume-sealed`); `--gate` falla si cantera y proyección divergen.
Holones 05=cantera, 06=constelación, 07=método: cero barrios + razón escrita.
Sin tocar `prueba-de-dos`, BACKLOG ni merge main.

## Archivos tocados

| archivo | acción |
| ------- | ------ |
| `scripts/generar-mapa.mjs` | creado — import-once + gate + consume-sealed |
| `fixtures/mapa/mapa.json` | creado — proyección sellada |
| `fixtures/mapa/source.manifest.json` | creado — piezas + seal |
| `fixtures/mapa/ASIGNACION.md` | creado — tabla distrito→holón |
| `fixtures/mapa/excerpts/*` | creado — CENSO, HOLONES, GRAFO sellados |
| `ci/test-108-mapa.mjs` | creado — CA + negativo divergencia |
| `ci/suite.mjs` | modificado — wire `# WP-HUB-108` |
| `package.json` | modificado — scripts generar-mapa / test:mapa |
| `README.md` | modificado — fila fixtures/mapa |
| `REPORTE-WP-HUB-108.md` | creado — este reporte |

## CA

| criterio | evidencia |
| -------- | --------- |
| 24 barrios con distrito+holón | `mapa.json` + test-108 |
| 7 holones ≥1 barrio O razón escrita | 01–04 con barrios; 05–07 con `razonSinBarrio` |
| cero slugs inventados (exit code) | contrastado vs excerpt/censo; inventado → FAIL |
| gate falla si cantera y proyección divergen | negativo en test-108 (exit≠0) |
| 05/06 cantera/constelación; 07 método | `runtimeKind` + cero barrios |

## Evidencia

```
node ci/test-108-mapa.mjs
# test-108-mapa: PASS — validateProjection 7×6×24
# test-108-mapa: PASS — conteos 7 holones × 6 distritos × 24 barrios
# test-108-mapa: PASS — 24 barrios con distrito+holón; cero slugs inventados
# test-108-mapa: PASS — holones 05=cantera 06=constelación 07=método (sin fingir runtime)
# test-108-mapa: PASS — consume-sealed exit 0
# test-108-mapa: PASS — gate cantera≡proyección exit 0
# test-108-mapa: PASS — gate falla si cantera/proyección divergen (exit≠0)
# test-108-mapa: PASS — validateProjection rechaza slug inventado
# test-108-mapa: PASS
```

## Evidencia de riesgo y contrarrevisión

- `CASOS_ADVERSARIALES`:
  - `[automatizado]` gate ante excerpt/censo divergente → exit≠0
  - `[automatizado]` validateProjection rechaza slug inventado
- `DEPENDENCIAS_DIRECTAS_VERIFICADAS`: solo built-ins Node
- `INSTALACION_LIMPIA`: no deps nuevas
- `TEST_AUTOMATIZADO_VS_EVIDENCIA_MANUAL`:
  - Automatizado: `test-108-mapa.mjs` + wire en `suite.mjs`
  - Manual: alcance solo `playground/prueba-de-H-M/**`
- `VEREDICTO_REVISOR`: `no requerido`

## Auto-revisión

- [x] Diff solo bajo `playground/prueba-de-H-M/**`
- [x] No tocado `prueba-de-dos` / BACKLOG / merge main
- [x] Runtime no abre cantera (consume-sealed)
- [x] Gates locales ejecutados

## Hallazgos fuera de alcance

Ninguno bloqueante.

## Dudas / bloqueos

Ninguno.

---

## Revisión del orquestador

_(la rellena el orquestador)_
