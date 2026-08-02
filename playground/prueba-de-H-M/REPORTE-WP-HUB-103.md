# WP-HUB-103 · hm-podstore-y-leases — reporte

| dato | valor |
| ---- | ----- |
| agente | Worker LORE-HM |
| fecha | 2026-08-02 |
| rama | `wp/hub-103-hm-podstore-y-leases` |
| worktree | `C:/S_LAB/wt/scriptorium-wp-hub-103` |
| herencia | tip WP-HUB-100 `ddb4d8b`; spike 112 FM NO CORRE → simulacro |
| eje(s) CA | ACL/permisos · tipestate · frontera simulación vs Solid |
| riesgo de revisión | `independiente` |
| revisor distinto del worker | `sí` |
| estado propuesto | listo para revisión adversarial |

## Qué se hizo

Implementado `LocalPodProvider` files-first bajo `lib/podstore/` con IRI lógica
`urn:scriptorium:hm:<run-id>:pod:<unit-id>`, tipestate exhaustivo
`declared → leased → inflated → ready → running → paused|stopped|failed`,
inflación bilateral (`unit.inflate` de M → `pod.lease` de H → materialize),
contenido mínimo de pod, evaluación ACL en el pod (no en H), rechazo de
`adminOverride`, y marca explícita de simulación (`isSolidPod: false`).
Tests CA en `ci/test-103-podstore.mjs` cableados en `suite.mjs` (`# WP-HUB-103`).
No se editó `scripts/generar.mjs` ni BACKLOG.

## Archivos tocados

| archivo | acción |
| ------- | ------ |
| `lib/podstore/constants.mjs` | creado — estados, IRI, STATIC_UNIT_IDS, PROVIDER_META |
| `lib/podstore/tipestate.mjs` | creado — TRANSITION_TABLE + switch exhaustivo |
| `lib/podstore/acl.mjs` | creado — evaluatePodAcl (positiva/omitida/inválida/expirada) |
| `lib/podstore/LocalPodProvider.mjs` | creado — provider + inflación bilateral + FS |
| `lib/podstore/index.mjs` | creado — reexports |
| `ci/test-103-podstore.mjs` | creado — CA automatizadas |
| `ci/suite.mjs` | modificado — wire `# WP-HUB-103` |
| `package.json` | modificado — script `test:podstore` aditivo |
| `REPORTE-WP-HUB-103.md` | creado — este reporte |

## CA

| criterio | evidencia |
| -------- | --------- |
| Pod decide ACL (no H) | `evaluatePodAcl` + `authorize` en tests |
| ACL +/omitida/inválida/expirada | solo positiva concede |
| No admin override | `adminOverride: true` → `admin-override-rejected` |
| Tipestate exhaustivo | `assertTipestateExhaustive`; estado desconocido rompe |
| Marca simulación | `PROVIDER_META.isSolidPod === false` |
| 10 estáticos + runners | catalog + `universe-runner-<id>` |
| Contenido mínimo pod | descriptor/state/events/artifacts/inbox/outbox |
| IRI sin ruta máquina | `publicManifest`/`describe` sin `storeRoot` |

## Evidencia

```
node ci/test-103-podstore.mjs
# test-103-podstore: marca simulación (nunca Solid real)
# test-103-podstore: assertTipestateExhaustive
# test-103-podstore: tipestate exhaustivo + schema alineado
# test-103-podstore: inflación bilateral + tipestate + contenido mínimo + IRI
# test-103-podstore: ACL positiva/omitida/inválida/expirada + no admin override
# test-103-podstore: 10 estáticos + 2 universe-runner dinámicos
# test-103-podstore: transición ilegal rechazada
# test-103-podstore: PASS

node ci/suite.mjs
# test-100-schemas: PASS
# test-103-podstore: PASS
# lore-hm suite: PASS
```

Verde **local**.

## Evidencia de riesgo y contrarrevisión

- `CASOS_ADVERSARIALES`:
  - `[automatizado]` ACL omitida/inválida/expirada deniegan; positiva concede
  - `[automatizado]` `adminOverride: true` rechazado
  - `[automatizado]` tipestate: estado desconocido / transición ilegal rompen
  - `[automatizado]` proveedor declara `isSolidPod: false` / simulation
- `DEPENDENCIAS_DIRECTAS_VERIFICADAS`: solo built-ins Node (`fs`, `path`, `crypto`, `os`)
- `INSTALACION_LIMPIA`: no aplica — sin deps nuevas en kit para 103
- `TEST_AUTOMATIZADO_VS_EVIDENCIA_MANUAL`:
  - Automatizado: `test-103-podstore.mjs` + `suite.mjs`
  - Manual: inspección de que `scripts/generar.mjs` no fue tocado
- `VEREDICTO_REVISOR`: `⏳ pendiente de revisor distinto`

## Auto-revisión

- [x] Diff solo bajo `playground/prueba-de-H-M/**`
- [x] No editado `scripts/generar.mjs`
- [x] BACKLOG no tocado
- [x] Sin merge a main
- [x] Riesgo independiente + contraevidencia en tests
- [x] Gates locales ejecutados

## Hallazgos fuera de alcance

- Integración con generador WP-102 (manifest de run en ceremonia completa)
- Wire JSON-LD Activity completo (WP-106)

## Dudas / bloqueos

Ninguno.

## Riesgos / gaps

1. Paths físicos viven en `manifest.private.json` bajo storeRoot de test — API
   pública no los expone; un consumidor que lea el private bypassa el contrato.
2. Firma de lease es HMAC simulacro (`hm-playground-sim`), no criptografía de
   peercard real.
3. Contrarrevisión adversarial pendiente (RIESGO_REVISION: independiente).

---

## Revisión del orquestador

_(pendiente)_
