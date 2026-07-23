# SEM-z · reporte · SKILLS-EN-MUNDOS ola z-sdk · 2026-07-23

| dato | valor |
| ---- | ----- |
| mundo | z-sdk (Z_SDK) |
| remoto | `https://github.com/alephscriptorium-eng/Z_SDK.git` |
| checkout | `C:\S_LAB\z-sdk` |
| worktree | `C:\S_LAB\.worktrees\z\wp-sem-z-skills-0.7.0` |
| rama obra | `wp/sem-z-skills-0.7.0` |
| commit obra | `f295dc9b0604f9786046391070572eb4c99a99ad` |
| tip PRE (origin/main) | `d0d9de1d3af0e75a9f5d7d7b4c2b4d3762beb90c` |
| tip POST (origin/main) | `f295dc9b0604f9786046391070572eb4c99a99ad` |
| paquete | `@alephscript/skills-scriptorium@0.7.0` |

## CA

| check | evidencia | ¿OK? |
| ----- | --------- | ---- |
| devDep 0.7.0 | `package.json` pin exacto (era `0.x`) · lock resolved `…/skills-scriptorium-0.7.0.tgz` · `node_modules` = 0.7.0 | sí |
| espejo bin | `skills:sync` = `alephscript-skills-sync --runtime claude` · sync OK 5 skills @0.7.0 (gitignore `.claude/` — PORT; no commit espejo) | sí |
| asiento plan | `plan/ESTACION.md` — «la estación se activa desde aquí» | sí |
| migración #16 | `scripts/sync-claude-skills.mjs` borrado · acta `plan/REPORTES/ACTA-SEM-z-sync-local-desechable-2026-07-23.md` | sí |

## Partición

WORLD_ROOT=`C:\S_LAB\z-sdk` · WORKTREE_BASE=`C:\S_LAB\.worktrees\z` ·
OUT_DIR=`C:\S_LAB\vigilancia\z` (MAPA-TALLER.md).

## Evidencia

### npm view / lock resolved

```text
$ npm view @alephscript/skills-scriptorium@0.7.0 version
0.7.0

$ node -e "console.log(require('./node_modules/@alephscript/skills-scriptorium/package.json').version)"
0.7.0

$ node -e "const l=require('./package-lock.json'); console.log(l.packages['node_modules/@alephscript/skills-scriptorium'].version)"
0.7.0
```

### skills:sync

```text
$ npm run skills:sync
> alephscript-skills-sync --runtime claude
[skills-sync] OK  estacion-viva
[skills-sync] OK  holarquia
[skills-sync] OK  site-web
[skills-sync] OK  swarm-orquestacion
[skills-sync] OK  vigilancia
[skills-sync] OK  README.md (@alephscript/skills-scriptorium@0.7.0)
[skills-sync] listo: 5 skills -> .claude/skills (runtime=claude)
```

README espejo: procedencia `@alephscript/skills-scriptorium@0.7.0` ·
generador `alephscript-skills-sync --runtime claude`.

### migración #16

```text
SHA256 PRE scripts/sync-claude-skills.mjs:
  27CCC25BBFC107CD11A6682F1768F04918BEBAF2B5C07EFEFD67ADD49E926BEB
POST: path ausente (Test-Path → False)
```

### merge

Rama `wp/sem-z-skills-0.7.0` pusheada · `origin/main` avanzó FF a
`f295dc9` (sin force).

## Bloqueos

Ninguno.
