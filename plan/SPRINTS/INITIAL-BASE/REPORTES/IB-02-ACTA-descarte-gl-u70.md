# ACTA DE DESCARTE · GL `wp/u70-editor-gamemaps` (ahead 2)

| dato | valor |
| ---- | ----- |
| WP | IB-02 · Higiene OASIS mínima |
| fecha | 2026-07-22 |
| repo | `C:\Users\aleph\OASIS\SCRIPTORIUM_V0\Z_SDK-games-library` |
| rama local | `wp/u70-editor-gamemaps` |
| tip local | `f5bb3b5a7a21a2e3223e4a23777fef34f5743674` |
| tip origin | `b4a8fb6b8dce2df4f2122d829e14877f53a7e1ef` |
| ahead | 2 (local); behind 0 |

## Declaración

Se **descarta** la obra local ahead de `wp/u70-editor-gamemaps` (U-sprint vieja).
**No se hace push** de esos 2 commits. Canon de la línea U70 / startpack-sketch
queda en hub (`origin`), no en esta rama local adelantada.

**No** se borra el repo GL. **No** force-delete de remote. La rama local
puede permanecer; este acta declara que esa obra ahead **no** se publica
ni se trata como canónica.

## Evidencia (literal)

```text
$ git branch -vv | Select-String u70
  wp/u70-editor-gamemaps  f5bb3b5 [origin/wp/u70-editor-gamemaps: ahead 2]
    merge(main): sync U86 antes de cerrar WP-U70

$ git rev-list --left-right --count origin/wp/u70-editor-gamemaps...wp/u70-editor-gamemaps
0	2

$ git log --oneline origin/wp/u70-editor-gamemaps..wp/u70-editor-gamemaps
f5bb3b5 merge(main): sync U86 antes de cerrar WP-U70
a28b9ad feat(kits): CARPETA DRAMATURGO — plantilla experiencia (WP-U86)

$ git rev-parse wp/u70-editor-gamemaps
f5bb3b5a7a21a2e3223e4a23777fef34f5743674

$ git rev-parse origin/wp/u70-editor-gamemaps
b4a8fb6b8dce2df4f2122d829e14877f53a7e1ef

$ git merge-base --is-ancestor wp/u70-editor-gamemaps main
# exit 0 → u70 tip es ancestro de main (obra absorbida en línea main/hub)

$ git switch --detach wp/u70-editor-gamemaps
## HEAD (no branch)
 M kits/carpeta-dramaturgo/plantilla/agentchain/.gitkeep
 M kits/carpeta-dramaturgo/plantilla/readerapp/readerchain/.gitkeep
# dirty tree preexistente en working copy; NO tocado por IB-02
```

## Nota-a-forense

Dirty working tree (dos `.gitkeep` modificados) observado al inspeccionar;
fuera de `ALCANCE_DIFF` de IB-02 → no excavado, no limpio, no commiteado.
