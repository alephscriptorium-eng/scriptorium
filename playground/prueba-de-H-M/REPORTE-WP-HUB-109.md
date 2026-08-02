# WP-HUB-109 · hm-lore-voz-despierta — reporte

| dato | valor |
| ---- | ----- |
| agente | Worker LORE-HM |
| fecha | 2026-08-02 |
| rama | `wp/hub-109-hm-lore-voz-despierta` |
| worktree | `C:/S_LAB/wt/scriptorium-wp-hub-109` |
| base | tip accum `ebafafa` (100–107) |
| dep 108 | **ausente** — hook proyección noop; actas sobre evidencia 106/107 |
| eje(s) CA | estado por evidencia · actas unidad/verbo/huella · elenco H/M+lease |
| riesgo de revisión | `independiente` |
| revisor distinto del worker | `sí` |
| estado propuesto | listo para revisión adversarial |

## Qué se hizo

Implementado el despertar del distrito `lore-voz` derivado de evidencia de
ceremonia (106/107): `lib/despertar/` proyecta `ciudad/censo-runtime/` con
estado `despierto`/`dormido`, actas por unidad (unidad·verbo·huella) y elenco
de `novelist-editor` (distrito `runtime-mcp`) con ≥2 personajes H/M y lease
cada uno (`notPipeline=true`). Hook de mapa 108 en
`ciudad/proyeccion/mapa-holones-distritos.json` (y alt fixtures); si falta,
noop sin inventar barrios — ids desde `fixtures/censo-excerpt-*`. CA de
reversión: sin evidencia el estado vuelve a `dormido` solo; edición a mano
no prevalece. Tests `ci/test-109-despierta.mjs`. Sin BACKLOG ni merge main.

## Archivos tocados

| archivo | acción |
| ------- | ------ |
| `lib/despertar/*` | creado — proyección, actas, elenco, hook 108 |
| `scripts/despertar.mjs` | creado — CLI `--evidence` / `--revert` |
| `ci/test-109-despierta.mjs` | creado — CA automatizadas |
| `ci/suite.mjs` | modificado — wire `# WP-HUB-109` |
| `schemas/{acta-unidad,censo-runtime,elenco-identidad}.schema.json` | creado |
| `fixtures/censo-excerpt-novelist-editor.md` | creado — id canónico |
| `fixtures/novelist-elenco.json` | creado — elenco ≥2 H/M |
| `ciudad/README.md` | creado — paths 108/109 |
| `package.json` / `README.md` / `.gitignore` | modificado |
| `REPORTE-WP-HUB-109.md` | creado — este reporte |

## CA

| criterio | evidencia |
| -------- | --------- |
| estado por evidencia, no a mano | revert evidence → dormido; edición forzada ignorada |
| cada acta: unidad, verbo, huella | 9 actas schema-valid |
| H/M ≥2 personajes + lease c/u | elenco novelist H=2 M=2, `notPipeline` |
| ids de censo (sin inventar) | excerpts lore-voz + novelist-editor |
| hook 108 | noop documentado si proyección ausente |

## Evidencia

```
node ci/test-109-despierta.mjs
# test-109-despierta: PASS — hook 108 noop (proyección ausente — candidates documentados)
# test-109-despierta: PASS — distrito lore-voz despierto por evidencia
# test-109-despierta: PASS — censo runtime · 5 barrios lore-voz despierto
# test-109-despierta: PASS — censo-runtime schema
# test-109-despierta: PASS — actas por unidad · 9 (unidad+verbo+huella)
# test-109-despierta: PASS — elenco novelist · H=2 M=2 con lease c/u (no pipeline)
# test-109-despierta: PASS — revirtiendo evidencia → distrito vuelve a dormido solo
# test-109-despierta: PASS — estado runtime regenerado sin edición a mano (actas limpias)
# test-109-despierta: PASS — edición a mano ignorada — proyección sin evidencia restaura dormido
# test-109-despierta: PASS — re-aplicar evidencia → despierto de nuevo
# test-109-despierta: PASS
```

Verde **local**.

## Evidencia de riesgo y contrarrevisión

- `CASOS_ADVERSARIALES`:
  - `[automatizado]` revert evidencia → dormido; edición a mano ignorada
- `DEPENDENCIAS_DIRECTAS_VERIFICADAS`: reusa ceremonia/verificador kit + ajv; built-ins crypto/fs
- `INSTALACION_LIMPIA`: `npm install` en kit (ajv + linea-kit)
- `TEST_AUTOMATIZADO_VS_EVIDENCIA_MANUAL`:
  - Automatizado: `ci/test-109-despierta.mjs` PASS
  - Manual: ⏳ sin verificar
- `VEREDICTO_REVISOR`: `⏳ pendiente de revisor distinto`

## Auto-revisión (PRACTICAS del mundo — con honestidad)

- [x] Diff solo dentro de `playground/prueba-de-H-M/`
- [x] Cero árboles copiados de otros mundos
- [x] Ids contrastados contra excerpts CENSO
- [x] Sin fluff; 108 marcado hook/noop
- [x] Ejes CA evidenciados en test
- [x] Gates ejecutados de verdad (`test-109-despierta: PASS`)
- [x] Commits convencionales
- [x] Sin BACKLOG / sin merge
- [x] Riesgo independiente → contrarrevisión pendiente

## Hallazgos fuera de alcance

- WP-HUB-108 aún sin proyección materializada en este árbol; hook listo.
- Suite completa 100–107+109 no re-ejecutada en este cierre (solo 109).

## Dudas / bloqueos

Ninguno.

---

## Revisión del orquestador

_(la rellena el orquestador)_
