# IB-10 · estructura-scriptorium — reporte

| dato | valor |
| ---- | ----- |
| agente | worker swarm · IB-10 |
| fecha | 2026-07-22 |
| rama | `wp/ib-10-estructura-scriptorium` |
| commits | $sha1 (post-push tip si coincide) |
| eje(s) CA | III (auditoría / layout) + regla 13 (plan autocontenido) |
| estado propuesto | listo para revisión |

## Qué se hizo

Verificación de facto del esqueleto génesis (no rewrite). Confirmados
`codebase/` · `playground/` · `docs/` · `plan/` en el worktree. Paths
cortos `C:\S\...` documentados en README. Plan operable con skill
`@alephscript/skills-scriptorium@0.5.1` (roles + PRACTICAS + VISION +
BACKLOG sprint). Submodules/gitlinks **no** inventados: `<pendiente>`
hasta IB-11. Hueco mínimo cerrado: tabla de paths + nota gitlinks
pendiente + veto cuadernos en README. `.gitignore` ya cubría
`node_modules/`, cuadernos/backstage e IDE residue — sin cambio.

## Archivos tocados

- `README.md` — modificado: paths cortos, `<pendiente>` gitlinks IB-11, nota cuadernos
- `plan/SPRINTS/INITIAL-BASE/REPORTES/IB-10-estructura-scriptorium.md` — creado: este reporte

## Evidencia

> Salida literal de comandos en worktree `C:\S\.worktrees\wp-ib-10`.

### 1) Layout presente

```text
codebase exists=True empty-gitkeep=True
playground exists=True empty-gitkeep=True
docs exists=True empty-gitkeep=True
plan exists=True empty-gitkeep=False
```

Contenido mínimo: `codebase/.gitkeep`, `playground/.gitkeep`,
`docs/.gitkeep`. `plan/` con gobierno + sprint INITIAL-BASE.

### 2) Paths cortos `C:\S\...`

```text
C:\S len=4 exists=True
C:\S\scriptorium len=16 exists=True
C:\S\.worktrees\wp-ib-10 len=24 exists=True
```

`MUNDO_RAIZ` del brief = `C:\S\scriptorium` (repo principal). Worktree
IB-10 = `C:\S\.worktrees\wp-ib-10` (gitdir →
`C:/S/scriptorium/.git/worktrees/wp-ib-10`).

### 3) Plan autocontenido (regla 13)

Comparado contra `montar-plan.sh` del skill 0.5.1. Presentes:

```text
plan\VISION.md=True
plan\PRACTICAS.md=True
plan\DECISIONES.md=True
plan\BACKLOG.md=True
plan\roles\ORQUESTADOR.md=True
plan\roles\WORKER.md=True
plan\roles\REVISION.md=True
plan\roles\CORRECCION.md=True
plan\roles\BRIEF.md=True
plan\roles\ejes-ca.md=True
plan\roles\ciclo.md=True
plan\SPRINTS\INITIAL-BASE\BACKLOG.md=True
plan\REPORTES\PLANTILLA.md=True
```

Roles del skill (`BRIEF`, `CORRECCION`, `ORQUESTADOR`, `README`,
`REVISION`, `WORKER`) + copias locales `ejes-ca.md` / `ciclo.md`.
Skill instalado en worktree: `@alephscript/skills-scriptorium@0.5.1`
(`npm install` → `added 1 package`; `node_modules/` gitignored).

Agente fresco: con skill + `plan/` puede operar (ORQUESTADOR/WORKER +
BACKLOG sprint + PRACTICAS/VISION). Convivencia multi-orquestador vive
en el skill (`reference/convivencia-multi-orquestador.md`), no duplicada
en `plan/` — coherente con montar-plan.

### 4) Clone fresco + submodule update

```text
Test-Path .gitmodules → False
git ls-files -s | Select-String "160000" → (vacío; sin mode 160000)
git submodule update --init --recursive → exit=0
```

**`<pendiente>`:** no hay gitlinks bajo `codebase/` (IB-11 no despachado).
No se inventaron submodules. Tras IB-11, re-verificar
`git submodule update --init --recursive` + `git submodule status`.

### 5) Eje III — gate dedup layout

```text
top-level dirs: codebase, docs, plan, playground
codebase\codebase=False
plan\plan=False
docs\docs=False
playground\playground=False
```

Un solo plano de layout; sin árboles anidados duplicados del esqueleto.
No se movió ni reescribió doctrina/código vivo.

### 6) `.gitignore` (sin cambio — ya suficiente)

Cubre `node_modules/`, `ADDENDA/`, `VIGILANCIA/`, `_fuentes/`,
`.cuadernos/`, residue IDE (`.cursor/*.md`, `.claude/*.md`).

## Auto-revisión (PRACTICAS del mundo — con honestidad)

- [x] Diff solo dentro de `ALCANCE_DIFF` (worktree layout + README + reporte): sí
- [x] Cero árboles/ficheros copiados de otros mundos sin procedencia: sí
- [x] Sellos con fuente; rutas citadas existentes: sí (comandos arriba)
- [x] Sin fluff ni promesa de futuro sin `<pendiente>`: gitlinks = `<pendiente>`
- [x] Eje(s) aplicables evidenciado(s): III (dedup layout) + regla 13
- [x] Gates ejecutados de verdad: layout/paths/plan/submodule/dedup
- [x] Commits convencionales: sí (este WP)
- [x] Diff solo del alcance del WP: sí — **no** BACKLOG, **no** merge main
- [x] Vetos: no borrado; no tocado alephscript-network-sdk; PORT no rewrite

## Hallazgos fuera de alcance

- `plan/BACKLOG.md` (índice) aún dice «gate R1-S pendiente pre-despacho»
  mientras `INFORME-VIGIA-R1-S.md` es PASS — higiene de índice; **no**
  tocado (worker no edita BACKLOG).
- Brief IB-10 declara `ALCANCE_DIFF = C:\S\scriptorium/**`; mandato
  worker usa worktree sibling — misma tip de rama; sin conflicto de
  contenido.

## Dudas / bloqueos

Ninguno bloqueante. Submodules = `<pendiente>` explícito (depende IB-11).

---

## Revisión del orquestador

_(la rellena el orquestador: aceptado ✅ / devuelto con lista numerada)_
