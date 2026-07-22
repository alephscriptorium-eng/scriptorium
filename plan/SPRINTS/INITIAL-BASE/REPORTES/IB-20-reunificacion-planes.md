# IB-20 · reunificacion-planes ? reporte

| dato | valor |
| ---- | ----- |
| agente | orquestador-consolidación (worker stallado; mandato cierre punta-a-punta) |
| fecha | 2026-07-22 |
| rama | `wp/ib-20-reunificacion-planes` |
| commits | $obra1 (+ report pin commit if any) |
| eje(s) CA | III (auditoría / layout · reunificación) |
| estado propuesto | listo para revisión |

## Qué se hizo

Se asentó en el `plan/` del workspace la reunificación de planes pedida
por IB-20: tabla de mundos (`MUNDOS.md`), partición de territorios
(`PARTICION.md` citando contrato v1.1 / método v0.6), punteros a
cuadernos por mundo, y enlaces PORT mínimos en VISION / DECISIONES /
PRACTICAS. Inventario de los 6 sdk **solo lectura**. Cero edits en
`codebase/*-sdk` · cero bump de gitlinks. Residual DNS no tocado.
BACKLOG no editado en esta rama (gobierno ? = orquestador en main).

## Archivos tocados

- `plan/MUNDOS.md` ? creado: tabla 6 mundos + skill + cuadernos + hallazgos
- `plan/PARTICION.md` ? creado: partición obra/gobierno (cita skill)
- `plan/VISION.md` ? modificado: puntero PORT a MUNDOS/PARTICION
- `plan/DECISIONES.md` ? modificado: puntero PORT bajo DA-S06
- `plan/PRACTICAS.md` ? modificado: puntero PORT convivencia
- `plan/SPRINTS/INITIAL-BASE/REPORTES/IB-20-reunificacion-planes.md` ? este reporte

## Evidencia

> No inventes observaciones. Salida literal o `? sin verificar`.

### Gitlinks PRE-obra (`git ls-tree HEAD codebase/` en main @ `6a78870`)

```
160000 commit e5573f8e5b248aff6e19aee5cd51b0fe7b086c1b	codebase/a-sdk
160000 commit 90e53544e8b78722ec8e22230740bfa107fa2cc8	codebase/e-sdk
160000 commit d1783646f4364fce49ae9b421c863bc51bfad4aa	codebase/g-sdk
160000 commit 632ee2a2bbb10a19efbc57b2f0a847dd04333ff9	codebase/o-sdk
160000 commit 7db1d4941267d857d93ab4005dcc4ecd0e49ecfb	codebase/s-sdk
160000 commit d0d9de1d3af0e75a9f5d7d7b4c2b4d3762beb90c	codebase/z-sdk
```

### skills@latest

```
npm view @alephscript/skills-scriptorium version --registry https://npm.scriptorium.escrivivir.co
? 0.5.1
workspace package.json devDependency ? 0.5.1
z/s/o-sdk package.json ? "@alephscript/skills-scriptorium": "0.x" (sin node_modules)
g/a-sdk ? skill AUSENTE · e-sdk ? sin package.json
```

### plan/ por sdk (conteo ficheros; solo lectura)

```
z-sdk plan=presente files=233
g-sdk plan=presente files=5
s-sdk plan=presente files=486
e-sdk plan=presente files=8
o-sdk plan=ausente files=0
a-sdk plan=presente files=12
```

### Cuadernos (ramas observadas en `scriptorium-cuadernos`)

```
main · o_sdk · origin/script_sdk-addenda · origin/script_sdk-vigilancia
· origin/scriptorium-vigilancia (@ 03f09a96f2c319bc57b366f3479e1462e246b882)
```

Destinos declarados adicionales: `z_sdk` · `g_sdk` · `e_sdk` · `a_sdk`
· `s_sdk` (ver `plan/MUNDOS.md`) ? crear al primer volcado; no se volcó
histórico crudo al público.

### Diff alcance

```
(esperado) solo bajo plan/ del worktree; sin cambios en codebase/*
```

## Auto-revisión (PRACTICAS del mundo ? con honestidad)

- [x] Diff solo dentro de `ALCANCE_DIFF`: plan/ workspace + reporte
- [x] Cero árboles/ficheros copiados de otros mundos sin procedencia
- [x] Sellos con fuente; rutas citadas existentes (MUNDOS/PARTICION)
- [x] Sin fluff ni promesa de futuro sin destino declarado / `<pendiente>`
- [x] Eje III evidenciado: layout de gobierno + inventario auditable
- [x] Gates ejecutados de verdad: inventario + npm view + ls-tree
- [x] Commits convencionales: sí (obra en rama wp)
- [x] Diff solo del alcance del WP: sí
- [x] Cero edits `codebase/*-sdk` · cero bump gitlinks
- [x] BACKLOG no editado en rama wp
- [x] DNS residual no tocado / no fingido verde

## Hallazgos fuera de alcance

1. o-sdk sin `plan/` en tip ? §F3a; gobierno en workspace + cuadernos `o_sdk`
2. e-sdk sin package.json ? WP futuro si se pinna skill
3. g-sdk / a-sdk sin dep skill ? GO propio para pin
4. nests a-sdk ? cola forense (§F3a); no excavado
5. Bump `0.x` ? `0.5.1` en sdks ? **no** en IB-20 (PORT)

## Dudas / bloqueos

Ninguno para CA de IB-20. DNS redirect DIFERIDO = fuera de alcance
(custodio). Sin PASS R6-S no hay ?? IB-21?IB-22 (orquestador).

---

## Revisión del orquestador

_(la rellena el orquestador: aceptado ? / devuelto con lista numerada)_
