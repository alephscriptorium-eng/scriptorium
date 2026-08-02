# WP-HUB-107 · hm-verificador-externo — reporte

| dato | valor |
| ---- | ----- |
| agente | Worker LORE-HM |
| fecha | 2026-08-02 |
| rama | `wp/hub-107-hm-verificador-externo` |
| worktree | `C:/S_LAB/wt/scriptorium-wp-hub-107` |
| base | tip WP-HUB-106 `afcfa92` |
| herencia | spike 112 — simulacro playground; FM no corre |
| eje(s) CA | frontera evidencia · cero autocertificación · negativos con nombre |
| riesgo de revisión | `independiente` |
| revisor distinto del worker | `sí` |
| estado propuesto | listo para revisión adversarial · **cierra GHM** |

## Qué se hizo

Verificador externo `scripts/verificar-evidencia.mjs`: un tercero valida la
corrida entregándole **sólo** la raíz de evidencia (cero dirs vivos H/M).
La ceremonia 106 sella `evidence/pack/` (acl, tipestate, vector-mock, cortos,
shutdown, provenance + manifest de piezas). Valida wire, expansión JSON-LD,
hashes, ACL, tipestate, provenance, cobertura, reporte y shutdown. Negativos
con frontera propia: hash roto, ACL expirada, transición ilegal, corto sin
traza Onfalo, VectorMock sin declarar. Tests en `ci/test-107-verificador.mjs`
cableados en `suite.mjs`. Sin BACKLOG ni merge main.

## Archivos tocados

| archivo | acción |
| ------- | ------ |
| `scripts/verificar-evidencia.mjs` | creado — CLI tercero |
| `lib/verificador/verificar.mjs` | creado — validación por frontera |
| `lib/verificador/errors.mjs` | creado — nombres propios de fallo |
| `lib/ceremonia/evidence-pack.mjs` | creado — sello pack autocontenido |
| `lib/ceremonia/run-ceremonia.mjs` | modificado — sella pack al cierre |
| `lib/ceremonia/index.mjs` | modificado — reexports pack |
| `lib/podstore/LocalPodProvider.mjs` | modificado — tipestate log + exportEvidenceSnapshot |
| `ci/test-107-verificador.mjs` | creado — CA + negativos |
| `ci/suite.mjs` | modificado — wire `# WP-HUB-107` |
| `package.json` | modificado — scripts verificar / test:verificador |
| `REPORTE-WP-HUB-107.md` | creado — este reporte |

## CA

| criterio | evidencia |
| -------- | --------- |
| valida wire, JSON-LD, hashes, ACL, tipestate, provenance, cobertura, reporte, shutdown | 10 checks PASS en fixture aislada |
| cero autocertificación (solo evidence root) | copia sin H/M + falla `pieza ausente` |
| hash roto / ACL expirada / transición ilegal / corto sin traza Onfalo / VectorMock sin declarar | cada uno con su nombre de frontera |

## Evidencia

```
node ci/test-107-verificador.mjs
# test-107-verificador: PASS — fixture aislada sin dirs vivos H/M
# test-107-verificador: PASS — verificador PASS (10 checks)
# test-107-verificador: PASS — CLI scripts/verificar-evidencia.mjs
# test-107-verificador: PASS — negativo «pieza ausente»
# test-107-verificador: PASS — negativo «hash roto»
# test-107-verificador: PASS — negativo «ACL expirada»
# test-107-verificador: PASS — negativo «transición ilegal»
# test-107-verificador: PASS — negativo «corto sin traza Onfalo»
# test-107-verificador: PASS — negativo «VectorMock sin declarar»
# test-107-verificador: PASS
```

Verde **local**. **GHM cerrado** en tip de esta rama (100–107).

## Evidencia de riesgo y contrarrevisión

- `CASOS_ADVERSARIALES`:
  - `[automatizado]` cinco negativos con nombre propio
  - `[automatizado]` pieza ausente (cero autocertificación)
  - `[automatizado]` fixture aislada sin H/M
- `DEPENDENCIAS_DIRECTAS_VERIFICADAS`: reusa kit 100–106 (`ajv`, tipestate, acl, digest); built-ins Node
- `INSTALACION_LIMPIA`: no deps nuevas
- `TEST_AUTOMATIZADO_VS_EVIDENCIA_MANUAL`:
  - Automatizado: `test-107-verificador.mjs` + `suite.mjs`
  - Manual: alcance solo `playground/prueba-de-H-M/**`; BACKLOG no tocado
- `VEREDICTO_REVISOR`: `⏳ pendiente de revisor distinto`

## Auto-revisión

- [x] Diff solo bajo `playground/prueba-de-H-M/**`
- [x] No tocado `prueba-de-dos` / BACKLOG / merge main
- [x] Simulacro playground; sin agentes OASIS / FM viva
- [x] Gates locales ejecutados

## Hallazgos fuera de alcance

Ninguno bloqueante — GHM tip listo para contrarrevisión.

## Dudas / bloqueos

Ninguno.

---

## Revisión del orquestador

_(la rellena el orquestador)_
