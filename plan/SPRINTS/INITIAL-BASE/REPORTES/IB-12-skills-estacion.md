# IB-12 · skills-estacion — reporte

| dato | valor |
| ---- | ----- |
| agente | worker swarm · IB-12 |
| fecha | 2026-07-22 |
| rama | `wp/ib-12-skills-estacion` |
| commits | `d9ffc10753309ea3a2f4310ce1b1fce9c5a4578c` · _(este reporte)_ |
| eje(s) CA | III (auditoría / layout · calibración) |
| estado propuesto | listo para revisión |

## Qué se hizo

PORT de `codebase/o-sdk/scripts/sync-claude-skills.mjs` a
`scripts/sync-claude-skills.mjs` + npm script `skills:sync`. Espejo
`.claude/skills/` desde `@alephscript/skills-scriptorium@0.5.1` (4 skills;
excluido `_plantilla`). Calibración de estación en `plan/ESTACION.md`
(OUT_DIR + BACKSTAGE_GIT + watcher whitelist I71). Evidencia de watcher
sesión (PID + log + stop limpio) y one-shot `ONCE=1`. No se tocó
`docs/**` ni workflows Pages (territorio IB-13).

## Archivos tocados

- `scripts/sync-claude-skills.mjs` — creado (PORT o-sdk; ROOT=workspace)
- `package.json` — script `skills:sync`
- `.claude/skills/**` — espejo materializado (4 skills + README procedencia)
- `plan/ESTACION.md` — calibración OUT_DIR / BACKSTAGE_GIT / watcher
- `.gitignore` — OUT_DIR local + `!.claude/skills/**`
- `plan/SPRINTS/INITIAL-BASE/REPORTES/IB-12-skills-estacion.md` — este reporte

## Evidencia

> Worktree `C:\S\.worktrees\wp-ib-12` · rama `wp/ib-12-skills-estacion`.

### 1) npm view C8 — registry canal real

```text
$ npm view @alephscript/skills-scriptorium@0.5.1 name version dist.tarball publishConfig.registry --registry https://npm.scriptorium.escrivivir.co
name = '@alephscript/skills-scriptorium'
version = '0.5.1'
dist.tarball = 'https://npm.scriptorium.escrivivir.co/@alephscript/skills-scriptorium/-/skills-scriptorium-0.5.1.tgz'
publishConfig.registry = 'https://npm.scriptorium.escrivivir.co'

$ cat .npmrc
@alephscript:registry=https://npm.scriptorium.escrivivir.co

$ package-lock.json resolved=
https://npm.scriptorium.escrivivir.co/@alephscript/skills-scriptorium/-/skills-scriptorium-0.5.1.tgz
```

### 2) espejo íntegro

```text
$ npm run skills:sync
[sync-claude-skills] OK  estacion-viva
[sync-claude-skills] OK  site-web
[sync-claude-skills] OK  swarm-orquestacion
[sync-claude-skills] OK  vigilancia
[sync-claude-skills] OK  README.md (@alephscript/skills-scriptorium@0.5.1)
[sync-claude-skills] listo: 4 skills -> C:\S\.worktrees\wp-ib-12\.claude\skills

SRC (node_modules/.../skills minus _plantilla):
estacion-viva site-web swarm-orquestacion vigilancia
DEST (.claude/skills dirs):
estacion-viva site-web swarm-orquestacion vigilancia
espejo: INTEGRO
Test-Path .claude/skills/_plantilla → False
```

### 3) watcher arranca (PID / log / stop limpio)

```text
# sesión breve (INTERVAL=2) luego kill
WORLD_ROOT=/c/S/.worktrees/wp-ib-12 OUT_DIR=/c/S/vigilancia INTERVAL=2 \
  bash .claude/skills/estacion-viva/scripts/watcher-sesion.sh &
started_pid=9728
pidfile=9728
alive_before=yes
--- log tail ---
[2026-07-22 19:26:05] sesion=1 skills_mat=5 residuo_filtrado=0 locks=''
[2026-07-22 19:26:07] sesion=1 skills_mat=5 residuo_filtrado=0 locks=''
[2026-07-22 19:26:10] sesion=1 skills_mat=5 residuo_filtrado=0 locks=''
alive_after=no
pidfile_after=cleaned
stop: clean

# one-shot
WORLD_ROOT=/c/S/.worktrees/wp-ib-12 OUT_DIR=/c/S/vigilancia ONCE=1 \
  bash .claude/skills/estacion-viva/scripts/watcher-sesion.sh
exit=0
[2026-07-22 19:25:20] sesion=1 skills_mat=5 residuo_filtrado=0 locks=''
```

Nota: `skills_mat=5` = 4 SKILL.md de skills activables + 1 en fixture
`estacion-viva/examples/.../demo-skill` (conteo informativo del watcher).

### 4) calibración en plan

`plan/ESTACION.md`:

| param | valor declarado |
| ----- | --------------- |
| OUT_DIR | `C:\S\vigilancia` (persistente, corto bajo `C:\S\`) |
| BACKSTAGE_GIT | repo privado `scriptorium-cuadernos`, rama `scriptorium-vigilancia` |
| watcher | `estacion-viva` watcher-sesion + whitelist `.claude/skills/**` |

Sin volcar cuadernos al repo público.

## Auto-revisión (PRACTICAS)

- [x] Diff dentro de `ALCANCE_DIFF` (sin `docs/**` ni Pages workflows)
- [x] PORT sync o-sdk; cero rewrite
- [x] Sellos con evidencia literal C8 / espejo / watcher / plan
- [x] Calibración en `plan/`, no en el skill package
- [x] Vetos: no borrar sin veredicto; no network-sdk; §F3a sin excavación
- [x] Eje III: layout espejo + calibración auditable
- [x] Worker no edita BACKLOG; no merge a main

## Hallazgos fuera de alcance

- §F3a: residuo nests a-sdk bajo `--recursive` = nota forense; cero excavación.
- README raíz aún puede citar `--recursive` (desfase docs; cola ops / no IB-12).

## Dudas / bloqueos

Ninguno bloqueante para CA IB-12.

---

## Revisión del orquestador

_(pendiente)_
