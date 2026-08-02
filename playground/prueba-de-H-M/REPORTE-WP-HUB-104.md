# WP-HUB-104 · hm-onfalo-import-once — reporte

| dato | valor |
| ---- | ----- |
| agente | Worker/orquestador LORE-HM |
| fecha | 2026-08-02 |
| rama | `wp/hub-104-hm-onfalo-import-once` |
| worktree | `C:/S_LAB/wt/scriptorium-wp-hub-104` |
| base | `wp/lore-hm-accum` `c51c74d` |
| herencia | spike 112 — FM no corre; snapshot = fixture playground |
| estado propuesto | listo para contrarrevisión |

## Qué se hizo

`scripts/importar-onfalo.mjs` importa build-time las dos editoriales Onfalo
con `--source-root` explícito, chequeo de redistribución y secretos **antes**
de copiar, y escribe `fixtures/onfalo/` + `source.manifest.json` sellado.
`--consume-sealed` (default sin source-root) lee sólo el snapshot.

## CA

| criterio | evidencia |
| -------- | --------- |
| 2 piezas + hashes | `test-104-onfalo: PASS` (sha256 canónicos) |
| cero secretos / rutas abs | PASS en snapshot/manifest |
| no redistribuible → FAIL | PASS (sin corpus sustituto) |
| sin OASIS montado | PASS (source-root ocultado; consume-sealed) |

## Evidencia

```
node ci/test-104-onfalo.mjs → PASS
```

Verde **local**. Sin merge main.
