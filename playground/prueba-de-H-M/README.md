# prueba-de-H-M

Kit playground LORE-HM. **Simulacro explícito** (spike WP-HUB-112: Future
Machine viva **NO CORRE** hoy). No toca `prueba-de-dos`.

| zona | contenido |
| ---- | --------- |
| `scenarios/barrio-lore/` | escenario canónico |
| `units/` | catálogo de diez unidades |
| `schemas/` | 11 schemas HM (no schemas de línea propios) |
| `scripts/generar.mjs` | corridas idempotentes → `.runs/<id>/{H,M}` (WP-HUB-102) |
| `scripts/importar-onfalo.mjs` | import-once build-time Onfalo → `fixtures/onfalo/` (WP-HUB-104) |
| `fixtures/onfalo/` | snapshot sellado (2 editoriales); corrida normal sin OASIS |
| `lib/cadena/` | handlers mock deterministas + orquestación (WP-HUB-105) |
| `.runs/` | salidas regenerables (gitignored) |
| `ontology/` | WP-HUB-101 |
| `reference/` | WP-HUB-101 |
| `ci/` | suite + gates |

```bash
npm run generate -- --scenario barrio-lore --run demo-1 --sin-install

# Build-time (requiere SOURCE-ROOT + attest redistribuible):
npm run import:onfalo -- --source-root <path> --attest fixtures/onfalo-attest.redistributable.json

# Corrida normal (solo snapshot sellado):
npm run import:onfalo -- --consume-sealed
```

**Líneas:** reusan schemas publicados de `@zeus/linea-kit` (v0.3.0). Tipos
públicos Zeus `U245` aún no aterrizados — se consume **sin tipos**; declarado.
