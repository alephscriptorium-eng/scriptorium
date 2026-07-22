# MAPA-REPO — misión-por-path del repo `scriptorium`

| dato | valor |
| ---- | ----- |
| Territorio | repo público `scriptorium` (`C:\S\scriptorium`) + contexto atlas `C:\S` |
| Canónico | este fichero (`plan/MAPA-REPO.md`) |
| Fecha asiento | 2026-07-23 · GO gobierno post-cierre mundos · tip base `e436d5a` |
| Fuente | tabla custodio · auditoría Vigilante-S (ADDENDA mapa-repo 2026-07-23) |

Trilogía de mapas: `plan/RAIZ-C-S.md` (atlas `C:\S`) · **este**
(repo índice) · `plan/S-LAB.md` (taller `C:\S_LAB`).

## `C:\S` (atlas · contexto; canónico = `RAIZ-C-S`)

| path | misión | ¿en git? |
| ---- | ------ | -------- |
| `scriptorium/` | Mundo índice / `MUNDO_RAIZ` | **Sí** (este repo) |
| `vigilancia/` | `OUT_DIR` del Vigilante-S | **No** (estación; fuera) |
| `_fuentes/` | Checkouts de lectura (cuadernos, etc.) | **No** |
| `.worktrees/` | Worktrees de obra del carril | **No** |
| `LLM.md` | Broche acuerdo agentes (copia FS); en plan vive el **PUNTERO** `plan/BROCHE-C-S.md`, no el canónico | **No** |
| `README.md` | Copia-release del mapa de raíz | **No** |

## `scriptorium/` (nivel 1–2)

| path | misión | ¿en git? |
| ---- | ------ | -------- |
| `README.md` | Puerta del workspace y mapa de letras | **Sí** |
| `CHANGELOG.md` | Gobierno de releases del índice | **Sí** |
| `LICENSE.md` | Licencia del workspace | **Sí** |
| `CONTRIBUTING.md` | Cómo contribuir al índice | **Sí** |
| `package.json` | Deps/scripts del portal + skills | **Sí** |
| `package-lock.json` | Pin exacto del método/npm | **Sí** |
| `.npmrc` | Solo registry `@alephscript`; **CERO** credenciales (verificado vigía ×6 repos) | **Sí** |
| `.gitignore` | Qué no entra al público | **Sí** |
| `.gitmodules` | Declara gitlinks de `codebase/` | **Sí** |
| `node_modules/` | Install local | **No** (ignore) |
| `branding/` | Pack marca (banners, logos, plantillas licencia/contrib) | **Sí** |
| `codebase/` | Contenedor de holones (solo gitlinks) | **Sí** (dir + links) |
| `codebase/z-sdk` | Zeus SDK (gitlink) | **Sí** (160000) |
| `codebase/g-sdk` | Games library (gitlink) | **Sí** (160000) |
| `codebase/s-sdk` | SCRIPT_SDK (gitlink) | **Sí** (160000) |
| `codebase/e-sdk` | E_SDK (gitlink) | **Sí** (160000) |
| `codebase/o-sdk` | Oasis SDK (gitlink) | **Sí** (160000) |
| `codebase/a-sdk` | Aleph/atril (gitlink) | **Sí** (160000) |
| `codebase/skills-library` | Paquete skills (gitlink) | **Sí** (160000) |
| `docs/` | Portal aleph-null (site-web) | **Sí** |
| `docs/*.md` | Páginas del número 0 | **Sí** |
| `docs/public/` | CNAME + assets estáticos | **Sí** |
| `docs/.vitepress/` | Config/theme VitePress | **Sí** (no `dist/`/`cache/`) |
| `plan/` | Gobierno del swarm S | **Sí** |
| `plan/VISION.md` … `PRACTICAS.md` | Doctrina viva del mundo | **Sí** |
| `plan/DECISIONES.md` / `BACKLOG.md` | GO custodio + cola del índice | **Sí** |
| `plan/ESTACION.md` / `RAIZ-C-S.md` / `S-LAB.md` / `MAPA-REPO.md` | Calibración estación, atlas, taller, mapa-repo | **Sí** |
| `plan/BROCHE-C-S.md` | **Puntero** al broche `C:\S\LLM.md` (no es el canónico del acuerdo) | **Sí** |
| `plan/roles/` | Prompts orquestador/worker | **Sí** |
| `plan/SPRINTS/` | Sprints (IB, portal, librería…) | **Sí** |
| `plan/REPORTES/` | Actas/reportes del carril | **Sí** |
| `playground/` | Semillas/starters del índice | **Sí** (dir; vacío OK) |
| `scripts/` | vacío post-#16; el script local **NO** debe volver | **No** (dir local residual · no trackear) |
| `.claude/skills/` | Espejo materializado del paquete | **Sí aquí** (`!.claude/skills/**`; política IB-12) |
| `.claude/*.md` | Residuo de sesión IDE | **No** (ignore) |
| `.github/workflows/` | CI Pages del portal | **Sí** |
| `.github/PULL_REQUEST_TEMPLATE.md` | Plantilla de PR | **Sí** |
| `.cursor/` | Residuo IDE | **No** (md ignorados; no versionar sesión) |

**Tensión consciente:** el paquete (#16) recomienda gitignore del espejo;
**este** repo aún lo **commitea** a propósito — correcto según su
`.gitignore`/IB-12, distinto del PORT SEM en mundos (obs-1 R19 ·
declarar, no resolver).

## REGLA DEL MAPA-REPO

**Fichero trackeado sin fila, o trackeado contra fila No = FAIL de
ronda; ampliar el mapa = commit de gobierno.**

1. Toda entrada del árbol público (nivel 1–2 + gitlinks) tiene fila.
2. El vigía contrastará **repo == mapa** (tercera aplicación del
   patrón raíz==mapa / territorio==mapa).
3. Ampliación o corrección de filas = commit de gobierno (este
   fichero), no obra de WP de producto.

## Relación

- Atlas raíz: `plan/RAIZ-C-S.md`
- Taller: `plan/S-LAB.md`
- Broche (puntero): `plan/BROCHE-C-S.md`
- Inventario mundos: `plan/MUNDOS.md`
- Addenda auditoría: `_fuentes/cuadernos-vigia-S/ADDENDA-VIGILANTE-S-auditoria-mapa-repo-2026-07-23.md`
