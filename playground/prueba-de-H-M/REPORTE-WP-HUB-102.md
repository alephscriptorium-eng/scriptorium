# WP-HUB-102 · hm-generador-idempotente — reporte

| dato | valor |
| ---- | ----- |
| agente | Worker LORE-HM |
| fecha | 2026-08-02 |
| rama | `wp/hub-102-hm-generador-idempotente` |
| worktree | `C:/S_LAB/wt/scriptorium-wp-hub-102` |
| herencia | spike WP-HUB-112 — FM **no corre**; kit = simulacro playground |
| riesgo de revisión | `independiente` |
| revisor distinto del worker | sí (pendiente) |
| estado propuesto | listo para revisión adversarial |

## Qué se hizo

Implementado `scripts/generar.mjs` que materializa corridas regenerables bajo
`.runs/<run-id>/{H,M}` más `room.json`, `evidence/` y `manifest.json` sellado
(sha256). Flags obligatorios `--scenario` y `--run` (sin defaults silenciosos);
opcionales `--sin-install` y `--force-new`. Segunda corrida con manifest y
artefactos intactos = **no-op medido**; drift de manifest o de artefactos falla
ruidoso y **no sobrescribe**. Reanuda sólo si el manifest coincide. Artefactos
usan IRIs lógicas / rutas relativas (cero literales de host). Tests en
`ci/test-102-generador.mjs` cableados en `suite.mjs`.

## Archivos tocados

| archivo | acción |
| ------- | ------ |
| `playground/prueba-de-H-M/scripts/generar.mjs` | creado — generador idempotente |
| `playground/prueba-de-H-M/ci/test-102-generador.mjs` | creado — CA automatizados |
| `playground/prueba-de-H-M/ci/suite.mjs` | modificado — wire WP-HUB-102 |
| `playground/prueba-de-H-M/package.json` | modificado — scripts generate / test:generador |
| `playground/prueba-de-H-M/.gitignore` | creado — ignora `.runs/` y `node_modules/` |
| `playground/prueba-de-H-M/README.md` | modificado — documenta generador |
| `playground/prueba-de-H-M/REPORTE-WP-HUB-102.md` | creado — este reporte |

## CA

| criterio | evidencia |
| -------- | --------- |
| dos corridas = no-op medido | `test-102-generador` → `filesChecked`>0, `written:0` |
| drift manifest falla sin overwrite | alteración de `seal` → exit≠0, árbol intacto |
| drift artefactos falla sin overwrite | alteración `H/handoff.md` → exit≠0, drift preservado |
| resume sólo si manifest coincide | no-op si sello OK; falla si sello distinto |
| cero rutas de máquina | grep `C:\Users` / `C:/Users` sobre `.runs/<id>` = 0 hits |
| simulacro declarado | stdout `modo=simulacro-playground`; env/room/manifest con `futureMachine: true` |

## Evidencia

```
node ci/test-102-generador.mjs
# test-102-generador: PASS — primera corrida materializa H/M/evidence/manifest sellado
# test-102-generador: PASS — dos corridas seguidas = no-op medido
# test-102-generador: PASS — drift de manifest falla ruidoso y no sobrescribe
# test-102-generador: PASS — drift de artefactos falla ruidoso y no sobrescribe
# test-102-generador: PASS — grep cero C:\Users / C:/Users en generado
# test-102-generador: PASS — reanuda (no-op) sólo si el manifest coincide
# test-102-generador: PASS — no reanuda si el manifest no coincide
# test-102-generador: PASS — --scenario y --run obligatorios (sin defaults silenciosos)
# test-102-generador: PASS — prueba-de-dos sin cambios
# test-102-generador: PASS

node playground/prueba-de-H-M/ci/suite.mjs
# lore-hm suite: PASS
```

Verde **local**. Workflow `ci-lore-hm` (WP-HUB-113) no modificado en este WP.

## Evidencia de riesgo y contrarrevisión

- `CASOS_ADVERSARIALES`:
  - `[automatizado]` drift manifest / drift artefactos / grep host paths / resume negado
- `DEPENDENCIAS_DIRECTAS_VERIFICADAS`: generador usa solo built-ins Node; kit deps
  previas (`ajv`, `@zeus/linea-kit`) no requeridas por el generador
- `INSTALACION_LIMPIA`: tests usan `--sin-install` (no aplica red para este WP)
- `TEST_AUTOMATIZADO_VS_EVIDENCIA_MANUAL`:
  - Automatizado: `ci/test-102-generador.mjs` + suite
  - Manual: ninguna requerida para CA
- `VEREDICTO_REVISOR`: `⏳ pendiente de revisor distinto`

## Riesgos / gaps

1. **npm install en ventanas:** con `--sin-install` (default de tests) no se
   instalan deps; `package.json` de H/M es stub mínimo sin stack Zeus (ceremonia
   real = WPs posteriores).
2. **Onfalo / pods / ceremonia:** fuera de alcance (103+).
3. **Timestamps:** `sealedAt` fijo `playground-fixed` a propósito para
   idempotencia byte-a-byte.

## Auto-revisión

- [x] Diff solo bajo `playground/prueba-de-H-M/**`
- [x] `playground/prueba-de-dos` sin cambios
- [x] BACKLOG no tocado
- [x] Claims honestos: simulacro playground
- [x] Contraevidencia del brief cubierta por tests
- [x] Gates locales ejecutados

## Revisión del orquestador

_(pendiente)_
