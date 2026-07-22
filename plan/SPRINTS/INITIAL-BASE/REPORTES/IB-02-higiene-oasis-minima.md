# IB-02 · higiene-oasis-minima — reporte

| dato | valor |
| ---- | ----- |
| agente | worker swarm · IB-02 |
| fecha | 2026-07-22 |
| rama | `wp/ib-02-higiene-oasis-minima` |
| commits | _(SHA tip post-push en cierre)_ |
| eje(s) CA | II (demolición mínima con destino canónico) / III (layout higiene) |
| estado propuesto | listo para revisión |

## Qué se hizo

1. Verificado `.git` accidental en contenedor `SCRIPTORIUM_V0` (remote ausente;
   un solo branch `main` local; commits placeholder). **No** se re-auditó el
   bosque de anidados.
2. Veredicto desechable (acta abajo): remoto vacío ⇒ no hay upstream canónico
   del contenedor; destino de la retirada = rename local documentado.
3. Renombrado `SCRIPTORIUM_V0\.git` → `SCRIPTORIUM_V0\.git.ACCIDENTAL-REMOVED-IB-02`.
   Post-estado: `fatal: not a git repository`. Anidados y `network-sdk` no
   tocados (`alephscript-network-sdk` ausente en ese path).
4. Acta de descarte de obra local GL `wp/u70-editor-gamemaps` ahead-2
   (canon en hub; sin push de esa obra; repo GL intacto). Fichero hermano:
   `IB-02-ACTA-descarte-gl-u70.md`.

Desviaciones: ninguna respecto al BRIEF.

## Archivos tocados

| ruta | acción |
| ---- | ------ |
| `C:\Users\aleph\OASIS\SCRIPTORIUM_V0\.git` → `.git.ACCIDENTAL-REMOVED-IB-02` | renombrado (fuera del repo scriptorium; higiene OASIS) |
| `plan/SPRINTS/INITIAL-BASE/REPORTES/IB-02-higiene-oasis-minima.md` | creado (este reporte) |
| `plan/SPRINTS/INITIAL-BASE/REPORTES/IB-02-ACTA-descarte-gl-u70.md` | creado (acta GL u70) |

## ACTA · veredicto desechable · `.git` contenedor SCRIPTORIUM_V0

**Objeto:** `C:\Users\aleph\OASIS\SCRIPTORIUM_V0\.git` (directorio git del
**contenedor**, no de anidados).

**Veredicto: DESECHABLE.** Motivos comprobados:

- `git remote` vacío → `REMOTE_AUSENTE=yes` (ningún origin/upstream).
- Un único ref local `main`; log con mensajes placeholder (`--`) y un commit
  de registro local; no hay publicación remota del contenedor.
- Los hijos (p.ej. `Z_SDK-games-library`) son repos independientes ya
  verificados por auditoría previa — **fuera de alcance re-auditar**.

**Destino canónico de la retirada:** rename in-situ a
`.git.ACCIDENTAL-REMOVED-IB-02` (recuperable si forense lo pide; contenedor
deja de ser repo git).

**Vetos respetados:** no borrar sin veredicto; no tocar network-sdk; no
tocar anidados; cero arqueología §F3a.

### Evidencia pre-retirada (literal)

```text
HAS_GIT=yes
REMOTE_AUSENTE=yes
git remote -v
# (vacío)

git status -sb
## main
?? Z_SDK-games-library/
?? cloud-router/
?? emmanuel-sdk/
?? medidor-lawfare/
?? medidor-poder-politico/
?? network-engine/
?? scriptorium-network-games/
?? transmedia-system/
?? zeus-sdk/

git log --oneline --all | Select-Object -First 5
27462fd --
81ebe04 --
d5a948e --
04b41a9 Registrar medidor-poder-politico en scripts de orquestación.
5cd52e2 --

.git es DIR (d--h--), no gitfile; toplevel = C:/Users/aleph/OASIS/SCRIPTORIUM_V0
```

### Evidencia post-retirada (literal)

```text
Test-Path .git                              → False
Test-Path .git.ACCIDENTAL-REMOVED-IB-02     → True
git rev-parse --is-inside-work-tree
fatal: not a git repository (or any of the parent directories): .git

Get-ChildItem -Force -Name | Select-String '\.git'
.git.ACCIDENTAL-REMOVED-IB-02
.gitignore
```

## ACTA · descarte GL `wp/u70-editor-gamemaps` (ahead 2)

Ver detalle completo: `IB-02-ACTA-descarte-gl-u70.md`.

**Declaración:** se descarta la obra local ahead-2 de
`wp/u70-editor-gamemaps` (U-sprint vieja). **No push** de esa obra. Canon
en hub. Repo GL **no** borrado. Remote **no** force-deleted.

```text
wp/u70-editor-gamemaps  f5bb3b5 [origin/wp/u70-editor-gamemaps: ahead 2]
rev-list left-right origin...local → 0	2
ahead:
  f5bb3b5 merge(main): sync U86 antes de cerrar WP-U70
  a28b9ad feat(kits): CARPETA DRAMATURGO — plantilla experiencia (WP-U86)
tip local:  f5bb3b5a7a21a2e3223e4a23777fef34f5743674
tip origin: b4a8fb6b8dce2df4f2122d829e14877f53a7e1ef
u70 tip ancestro de main → sí (exit 0)
```

## Evidencia (comandos / ejes)

Eje II: destino único del objeto demolecido = rename
`.git.ACCIDENTAL-REMOVED-IB-02`; anidados intactos (no absorbidos ni
reescritos). Eje III: higiene de layout del contenedor (deja de fingir ser
un monorepo git); sin reordenar árbol ni dedup de símbolos de código.

Gates: evidencia literal arriba; no hay test suite del WP.

## Auto-revisión (PRACTICAS)

- [x] Diff solo dentro de `ALCANCE_DIFF`: reporte+acta en plan REPORTES; rename
      solo `.git` contenedor SCRIPTORIUM_V0; acta descarte GL u70.
- [x] Cero árboles/ficheros copiados de otros mundos sin procedencia.
- [x] Sellos con fuente; rutas citadas existentes.
- [x] Sin fluff; dirty `.gitkeep` GL → nota-a-forense, no excavado.
- [x] Ejes II/III evidenciados.
- [x] Gates = evidencia git literal (no inventada).
- [x] Commits convencionales (este reporte).
- [x] Diff solo del alcance del WP; NO BACKLOG; NO merge main; NO network-sdk.

## Hallazgos fuera de alcance

- Working tree sucio en GL (dos `.gitkeep` under `kits/carpeta-dramaturgo/...`)
  al inspeccionar u70 — candidato a higiene ajena; no tocado.
- Directorio renombrado `.git.ACCIDENTAL-REMOVED-IB-02` queda en disco OASIS
  hasta decisión de forense/custodio de borrado físico ulterior.

## Dudas / bloqueos

Ninguno bloqueante. IB-02 cerrado en el alcance pedido.

---

## Revisión del orquestador

_(la rellena el orquestador: aceptado ✅ / devuelto con lista numerada)_
