# ESTACIÓN · calibración del mundo scriptorium (carril S)

Instancia del consumidor. El método vive en el paquete
`@alephscript/skills-scriptorium` (skills `vigilancia` + `estacion-viva`).
**Esta calibración NO va en el skill** — solo aquí en `plan/`.

## Params

| param | valor |
| ----- | ----- |
| `MUNDO_RAIZ` | `C:\S\scriptorium` (checkout principal) |
| `WORLD_ROOT` | worktree activo del WP, o `MUNDO_RAIZ` en quietud |
| `WORKTREE_BASE` | `C:\S\.worktrees` |
| `OUT_DIR` | `C:\S\vigilancia` — persistente, ruta corta bajo `C:\S\` |
| `BACKSTAGE_GIT` | repo privado `scriptorium-cuadernos`, rama `scriptorium-vigilancia` |
| `INTERVAL` | `45` (default del watcher) |

## OUT_DIR

- Ruta canónica: **`C:\S\vigilancia`**
- Contiene: `watch.log`, `anomalias.log`, `watcher.pid` (sesión)
- Fuera del repo público. Si por error aparece bajo el árbol del mundo,
  queda cubierta por `.gitignore` (`vigilancia-out/`, `.vigilancia/`,
  `VIGILANCIA/`).
- Crear con `mkdir` al primer arranque del watcher (los scripts lo hacen).

## BACKSTAGE_GIT

| dato | valor |
| ---- | ----- |
| repo | `scriptorium-cuadernos` (privado; no es el workspace público) |
| rama | `scriptorium-vigilancia` |
| rol | pulsos / addendas / veredictos del vigía (cara §interna) |

**No volcar** cuadernos ni caras §interna al repo público `scriptorium`.
Citar; no copiar. El custodio media entre vigía y orquestador.

## Watcher

Whitelist de materialización (clase I71): `.claude/skills/**` no es
residuo de info. Usar el watcher de **estación-viva** (o componer con
`vigilancia`).

```text
# One-shot (evidencia / pulso)
WORLD_ROOT=<worktree-o-mundo> OUT_DIR=C:/S/vigilancia ONCE=1 \
  bash .claude/skills/estacion-viva/scripts/watcher-sesion.sh

# Sesión (muere con el padre; PID en OUT_DIR/watcher.pid)
WORLD_ROOT=<worktree-o-mundo> OUT_DIR=C:/S/vigilancia INTERVAL=45 \
  bash .claude/skills/estacion-viva/scripts/watcher-sesion.sh

# Componer con vigilancia (worktrees / locks; sin git status)
WORLD_ROOT=<worktree-o-mundo> OUT_DIR=C:/S/vigilancia INTERVAL=45 \
  bash .claude/skills/vigilancia/scripts/watcher.sh
```

Espejo de skills: `npm run skills:sync` tras `npm install`
(`@alephscript/skills-scriptorium@0.5.1`, registry
`https://npm.scriptorium.escrivivir.co`).

## Relación con VISION

Cuadernos = fuente privada (VISION). Estación = layout operativo del
carril S (DA-S06). Eje CA III: calibración auditable en plan, no en el
paquete.
