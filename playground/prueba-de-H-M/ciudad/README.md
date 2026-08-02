# ciudad/ · proyección runtime (LORE-HM)

Coordinación de paths con WP-HUB-108 / WP-HUB-109.

| ruta | dueño | rol |
| ---- | ----- | --- |
| `ciudad/proyeccion/mapa-holones-distritos.json` | **108** | mapa jugable derivado de cantera (runtime no abre cantera) |
| `ciudad/censo-runtime/` | **109** | censo runtime + actas + elenco **derivados** de evidencia |
| `fixtures/censo-excerpt-*.md` | kit | excerpts offline de ids censados |
| `fixtures/mapa-holones-distritos.json` | **108** (alt) | mismo mapa si se prefiere bajo fixtures |

Si la proyección 108 aún no existe, el hook de 109 es noop y opera con
excerpts. No se inventan barrios.
