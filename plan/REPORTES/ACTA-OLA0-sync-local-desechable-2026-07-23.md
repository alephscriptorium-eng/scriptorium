# ACTA · OLA 0 · borrado `scripts/sync-claude-skills.mjs` · 2026-07-23

| dato | valor |
| ---- | ----- |
| Mandato | GO ORQUESTADOR S · R17-S PASS · GO B OLA 0 + GITLINK · 2026-07-23 |
| Carril | S · workspace `C:\S\scriptorium` |
| Tip PRE (fetch) | `e81834658e23e88fb3d3a29ae1fb756fb625cf65` (= `origin/main`) |
| Gate | R17-S **PASS** · GO B desencadenado · OLA 0 = workspace |
| Paquete | `@alephscript/skills-scriptorium@0.7.0` |
| Issue | #16 (migración consumidores → bin del paquete) |

## Veredicto desechable

`scripts/sync-claude-skills.mjs` nació en IB-12 como PORT del mecanismo
de espejo (o-sdk WP-I71 → scriptorium). Con el publish **0.7.0** ese
mecanismo vive en el paquete (`bin/alephscript-skills-sync.mjs` /
`alephscript-skills-sync`). El script local **nació para extinguirse**
(issue #16): duplicar la lógica en el consumidor = deriva asegurada.

| campo | valor |
| ----- | ----- |
| Path | `C:\S\scriptorium\scripts\sync-claude-skills.mjs` |
| Origen | IB-12 · PORT de `codebase/o-sdk/scripts/sync-claude-skills.mjs` |
| SHA256 PRE | `1577EB1A2298CE4667FC1A968883416FAFDCD992C843C74E3494A26660C0C576` |
| Tamaño PRE | 3527 bytes · 81 líneas |
| Sustituto canónico | `alephscript-skills-sync --runtime claude` (bin `@0.7.0`) |
| Enganche | `package.json` → `"skills:sync": "alephscript-skills-sync --runtime claude"` |
| Veredicto | **BORRAR** (desechable · nació para extinguirse) |
| Ejecutado | **sí** (este GO · OLA 0) |
| POST | path ausente |

## Evidencia de aceptación (OLA 0)

```text
npm view @alephscript/skills-scriptorium@0.7.0
  name=@alephscript/skills-scriptorium version=0.7.0
  gitHead=fb980984e5faa979247afa43054e52cfd4e07c3e
npm run skills:sync → 5 skills · README generador=alephscript-skills-sync
  procedencia @alephscript/skills-scriptorium@0.7.0
scripts/sync-claude-skills.mjs → ausente
```

## No borrados (explícito)

| path | motivo |
| ---- | ------ |
| `node_modules/@alephscript/skills-scriptorium/bin/…` | bin canónico del paquete |
| `.claude/skills/**` | espejo regenerado por el bin |
| `codebase/o-sdk/scripts/sync-claude-skills.mjs` | mundo o-sdk EXCLUIDO (F3); no tocar |

## Relación

- Issue #16 · release `v0.7.0` / `@alephscript/skills-scriptorium@0.7.0`
- Doctrina: cero borrados sin veredicto desechable + acta (`plan/MAPA-RAIZ.md`)
- Gate siguiente: **AVISO R18-S** (aceptación OLA 0 · antes de olas 1+)
