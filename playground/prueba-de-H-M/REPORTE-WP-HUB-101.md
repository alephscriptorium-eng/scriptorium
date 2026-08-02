# WP-HUB-101 · hm-ontologia-y-verbos — reporte

| dato | valor |
| ---- | ----- |
| agente | Worker LORE-HM |
| fecha | 2026-08-02 |
| rama | `wp/hub-101-hm-ontologia-y-verbos` |
| worktree | `C:/S_LAB/wt/scriptorium-wp-hub-101` |
| base | tip hub-113 (`e0e7f76`) |
| estado | ✅ verde local |

## Qué se hizo

Ontología v1 del lenguaje de ceremonia **simulacro playground** (`prueba-de-H-M`).
Spike 112: **FM no corre** — verbos describen envelopes de evidencia, no procesos
FM en vivo.

Artefactos:

- `ontology/hm-v1.context.jsonld` — 29 verbos + 12 alias TUI
- `ontology/hm-v1.ttl` — Turtle paralelo con clases acuñadas
- `reference/VERBOS.md` — catálogo humano (4 familias)
- `reference/vocab-registry.stub.json` — stub L04 consumido por gate
- `ci/test-101-ontologia.mjs` — 6 pruebas CA
- `ci/suite.mjs` — cableado `# WP-HUB-101`

## CA

| criterio | evidencia |
| -------- | --------- |
| Cada verbo con término mapeado o razón de acuñación | 29 verbos en context.jsonld; test `cada verbo tiene activityType y razón si acuñado` PASS |
| Gate falla si acuña existiendo W3C/DCMI | `gateVocabCoining` + stub L04; test positivo y negativo (`hm:FakeJoin` sobre `peer.join`) PASS |
| Vista JSON-LD no entra en huella (DIC-4) | `fingerprintSealed(wire)` idéntica tras mutar view; test PASS |
| Cada alias → exactamente una actividad tipada | 12 alias en `hm:tuiAliases`; test unicidad + resolución PASS |
| Reuso AS2/PROV-O/DCTERMS antes de acuñar | 14 verbos W3C/DCMI; 15 acuñados con `coinReason` documentado |
| FM no corre declarado | TTL + VERBOS.md + description en context.jsonld |
| `npm run test:lore-hm` verde local | salida abajo |

## Evidencia literal · test

```
npm run test:lore-hm
# tests 6 · pass 6 · fail 0
# lore-hm suite: PASS
```

## Evidencia literal · gate negativo (diseño)

```javascript
const badVerb = { verb: "peer.join", activityType: "hm:FakeJoin", coined: true };
gateVocabCoining([badVerb], registry);
// → ["peer.join: acuña hm:FakeJoin pero registro L04 declara as:Join"]
```

## Evidencia literal · DIC-4

```javascript
fingerprintSealed(wire) === fingerprintSealed(wire)  // true tras mutar view.jsonld
```

## Matriz verbos (resumen)

| familia | count | W3C | acuñados |
| ------- | ----- | --- | -------- |
| base H/M | 4 | 4 | 0 |
| pods | 9 | 4 | 5 |
| LORE | 7 | 2 | 5 |
| diagnóstico | 9 | 4 | 5 |
| **total** | **29** | **14** | **15** |

## Alias TUI (12)

`boot`→`peer.join` · `status`→`machine.status` · `loadMOCK`→`vector.mock-index` ·
`run`→`unit.start` · `inspect`→`unit.inspect` · `data`→`artifact.data` ·
`spec`→`artifact.spec` · `gaps`→`pipeline.gaps` · `validate`→`artifact.validate` ·
`trace`→`provenance.trace` · `coverage`→`coverage.measure` · `exit`→`session.exit`

## Gaps / follow-up

| gap | nota |
| --- | ---- |
| L04 producción | stub en `reference/vocab-registry.stub.json`; gate apunta a `WP-SDK-L04` |
| CI remoto | verde local; Actions tras push orquestador |
| WP-HUB-100 paralelo | no se crearon `scenarios/` ni schemas de datos |

## Archivos tocados

```
playground/prueba-de-H-M/ontology/hm-v1.context.jsonld
playground/prueba-de-H-M/ontology/hm-v1.ttl
playground/prueba-de-H-M/reference/VERBOS.md
playground/prueba-de-H-M/reference/vocab-registry.stub.json
playground/prueba-de-H-M/ci/test-101-ontologia.mjs
playground/prueba-de-H-M/ci/suite.mjs
playground/prueba-de-H-M/REPORTE-WP-HUB-101.md
```

## Listo para contrarrevisión adversarial

Sí — CA cubiertos con gate real y tests automatizados. Pendiente solo CI remoto
post-push.

## Addenda orquestador · PASS_CON_ADDENDA

Contrarrevisión: `PASS_CON_ADDENDA`. Tip post-fix `3f0a40c`. Fuente: `C:/S_LAB/wt/_lore-hm-ola1-vigilancia/`.
