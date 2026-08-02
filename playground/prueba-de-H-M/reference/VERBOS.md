# VERBOS · prueba-de-H-M v1

> **Spike 112:** Future Machine **no corre** en v1. Los verbos describen el
> lenguaje de ceremonia del **simulacro playground** (`prueba-de-H-M`), no
> procesos FM en vivo. La vista JSON-LD es aditiva; la huella (DIC-4) se
> calcula sobre bytes sellados del wire, nunca sobre la vista RDF.

Backbone obligatorio: **ActivityStreams 2.0** (`as:`), **PROV-O** (`prov:`),
**DCTERMS** (`dcterms:`) antes de acuñar `hm:` o `lore:`.

Fuente canónica machine-readable: `ontology/hm-v1.context.jsonld` +
`ontology/hm-v1.ttl`. Registro L04 (stub): `reference/vocab-registry.stub.json`.

## Familia A · base H/M

| verbo | activityType | acuñado | notas |
| ----- | ------------ | ------- | ----- |
| `peer.join` | `as:Join` | no | Presencia bilateral en room simulada |
| `peer.announce` | `as:Announce` | no | Anuncio de intención o snapshot |
| `state.inspect` | `as:View` | no | Inspección de estado observable |
| `session.exit` | `as:Leave` | no | Salida limpia de sesión |

## Familia B · pods

| verbo | activityType | acuñado | razón si acuñado |
| ----- | ------------ | ------- | ---------------- |
| `pod.lease` | `hm:PodLease` | sí | Sin término AS2/PROV-O para lease bilateral de pod simulado |
| `pod.revoke` | `hm:PodRevoke` | sí | Sin término W3C para revocación de lease en playground |
| `unit.inflate` | `hm:UnitInflate` | sí | Ceremonia bilateral M solicita / H valida |
| `unit.start` | `hm:UnitStart` | sí | AS2 Rec no define Start |
| `unit.pause` | `hm:UnitPause` | sí | AS2 Rec no define Pause |
| `unit.resume` | `hm:UnitResume` | sí | AS2 Rec no define Resume |
| `unit.stop` | `hm:UnitStop` | sí | AS2 Rec no define Stop; Leave/Delete ≠ tipestate |
| `unit.debug` | `hm:UnitDebug` | sí | AS2 no define debug de unidad |
| `machine.deploy` | `hm:MachineDeploy` | sí | Despliegue de manifest en simulacro; FM no corre |

## Familia C · LORE

| verbo | activityType | acuñado | razón si acuñado |
| ----- | ------------ | ------- | ---------------- |
| `source.ingest` | `prov:Usage` | no | Ingesta Onfalo sellada |
| `document.analyze` | `lore:DocumentAnalyze` | sí | AS2 Rec no define Analyze; Read es más débil |
| `vector.mock-index` | `lore:VectorMockIndex` | sí | Índice mock determinista (`mock=true`) |
| `line.materialize` | `lore:LineMaterialize` | sí | Materialización vía `@zeus/linea-kit` |
| `graph.bifurcate` | `lore:GraphBifurcate` | sí | Bifurcación grafo → universos |
| `universe.instantiate` | `lore:UniverseInstantiate` | sí | Instanciación runner de universo |
| `corto.emit` | `lore:CortoEmit` | sí | `hm:CortoDeEjecucion`; no corto literario |

## Familia D · diagnóstico

Conjunto coherente para inspección, validación y cierre de ceremonia:

| verbo | activityType | acuñado | razón si acuñado |
| ----- | ------------ | ------- | ---------------- |
| `machine.status` | `as:View` | no | Alias TUI `status` |
| `unit.inspect` | `hm:UnitInspect` | sí | Inspección profunda de unidad/pod |
| `artifact.data` | `dcterms:Dataset` | no | Alias TUI `data` |
| `artifact.spec` | `dcterms:BibliographicResource` | no | Alias TUI `spec` |
| `pipeline.gaps` | `hm:PipelineGapAnalysis` | sí | Análisis de huecos de pipeline |
| `artifact.validate` | `hm:ArtifactValidation` | sí | Validación de cadena de artefactos |
| `provenance.trace` | `prov:Activity` | no | Alias TUI `trace` |
| `coverage.measure` | `hm:CoverageMeasure` | sí | Cobertura sobre matriz de verbos |
| `corto.query` | `lore:CortoQuery` | sí | Consulta sobre chunks `hm:CortoDeEjecucion` |

## Alias TUI históricos

Cada alias **traduce** a exactamente **una** actividad tipada; no constituyen
ontología paralela.

| alias TUI | resuelve a | activityType |
| --------- | ---------- | ------------ |
| `boot` | `peer.join` | `as:Join` |
| `status` | `machine.status` | `as:View` |
| `loadMOCK` | `vector.mock-index` | `lore:VectorMockIndex` |
| `run` | `unit.start` | `hm:UnitStart` |
| `inspect` | `unit.inspect` | `hm:UnitInspect` |
| `data` | `artifact.data` | `dcterms:Dataset` |
| `spec` | `artifact.spec` | `dcterms:BibliographicResource` |
| `gaps` | `pipeline.gaps` | `hm:PipelineGapAnalysis` |
| `validate` | `artifact.validate` | `hm:ArtifactValidation` |
| `trace` | `provenance.trace` | `prov:Activity` |
| `coverage` | `coverage.measure` | `hm:CoverageMeasure` |
| `exit` | `session.exit` | `as:Leave` |

## Huella DIC-4

```
huella = sha256(bytes_sellados_del_wire)
```

La vista `*.view.jsonld` **no entra** en la huella. Mutar solo la vista debe
dejar `huellaLedger` idéntica. Ver `ci/test-101-ontologia.mjs`.

## Gate de vocabulario (L04 stub)

`ci/test-101-ontologia.mjs` consume `reference/vocab-registry.stub.json` (hasta
que `WP-SDK-L04` publique el registro durable). El gate **falla** si un verbo
acuña `hm:`/`lore:` cuando el registro declara equivalente W3C/DCMI.
