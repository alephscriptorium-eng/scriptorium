# ESTACIÓN · calibración del mundo scriptorium (carril S)

Instancia del consumidor. El método vive en el paquete
`@alephscript/skills-scriptorium` (skills `vigilancia` + `estacion-viva`).
**Esta calibración NO va en el skill** — solo aquí en `plan/`.

## Vigía del carril S (sucesión · DA-S07)

| dato | valor |
| ---- | ----- |
| rol | **Vigilante-S** — único vigía del carril S |
| estación | `C:\S\vigilancia` (ventana viva; watcher activo) |
| mediación | custodio (cara §interna ↔ orquestador) |
| gates `Rn-S` | pedido por AVISO en `plan/SPRINTS/INITIAL-BASE/`; emite Vigilante-S vía custodio |
| veto | **no** subagentes vigía del orquestador |

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
(`@alephscript/skills-scriptorium@0.8.0`, registry
`https://npm.scriptorium.escrivivir.co`).

## Pulso territorio == mapa (#19 · consumo 0.8.0)

El Vigilante-S adopta en el ritual de rondas `Rn-S` el check del
paquete (skill `vigilancia` @0.8.0), cuando existan `plan/MAPA-*.md`:

```text
# Desde MUNDO_RAIZ (espejo sync) — path del paquete 0.8.0
bash .claude/skills/vigilancia/scripts/verificar-territorio-mapa.sh --root "$WORLD_ROOT"

# Equivalente vía node_modules (misma pieza del paquete)
bash node_modules/@alephscript/skills-scriptorium/skills/vigilancia/scripts/verificar-territorio-mapa.sh --root "$WORLD_ROOT"
```

Sin `plan/MAPA-*.md` el script hace SKIP (mundo pre-#19). Hoy el
workspace tiene `plan/MAPA-REPO.md`; ampliar trilogía = commit de
gobierno. Fuente método: skill vigilancia `reference/ESTACION.md`
(ritual pulso paso 6). Evidencia consumo: script OK sobre
`MAPA-REPO` (Git Bash).

## Relación con VISION

Cuadernos = fuente privada (VISION). Estación = layout operativo del
carril S (DA-S06). Eje CA III: calibración auditable en plan, no en el
paquete.
