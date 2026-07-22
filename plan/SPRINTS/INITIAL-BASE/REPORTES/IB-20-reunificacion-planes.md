# IB-20 · reunificacion-planes ? reporte

| dato | valor |
| ---- | ----- |
| agente | worker swarm · IB-20 |
| fecha | 2026-07-22 |
| rama | `wp/ib-20-reunificacion-planes` |
| commits | `1ad68ac0fc45c0507348475e65edb82a1efd1081` (plan) · `65f97ce96b4fc091e9a399ba0a2e8973f20e00fb` (reporte) · `e187c3b6744a67ffada2a099ad8bcc31e10c4176` (hashes) |
| eje(s) CA | III (auditoría / layout · reunificación) |
| estado propuesto | listo para revisión |

## Qué se hizo

Inventario **solo lectura** de los 6 gitlinks `codebase/{z,g,s,e,o,a}-sdk`
(tip vía `git rev-parse HEAD:codebase/?` en `MUNDO_RAIZ`). Asentados
`plan/MUNDOS.md` (tabla skill pin/resuelta + estado `plan/` + destino
cuadernos rama-por-mundo) y `plan/PARTICION.md` (cita contrato
convivencia v1.1 / método v0.6; partición escritura `plan/` workspace vs
sdk SOLO LECTURA; cero bump gitlinks). Enlaces PORT mínimos en
`VISION.md` · `DECISIONES.md` (DA-S06) · `PRACTICAS.md`. Documentado
`npm view` latest **0.5.1** y pins/locks por sdk **sin bump masivo**.
Cero edits en submodules; cero cambio de gitlinks. Residual DNS no
trabajado.

## Archivos tocados

- `plan/MUNDOS.md` ? creado: tabla 6 mundos + workspace + skills@latest
- `plan/PARTICION.md` ? creado: protocolo multi-orquestador + ALCANCE_DIFF
- `plan/VISION.md` ? enlace PORT a PARTICION/MUNDOS
- `plan/DECISIONES.md` ? DA-S06: puntero PORT IB-20
- `plan/PRACTICAS.md` ? puntero PARTICION/MUNDOS
- `plan/SPRINTS/INITIAL-BASE/REPORTES/IB-20-reunificacion-planes.md` ? este reporte

## Evidencia

> Worktree `C:\S\.worktrees\wp-ib-20` · rama `wp/ib-20-reunificacion-planes`.
> Lectura de sdks desde checkout `C:\S\scriptorium` (mismos gitlinks).

### 1) Tips gitlink (MUNDO_RAIZ)

```text
$ git -C C:\S\scriptorium rev-parse HEAD:codebase/z-sdk
d0d9de1d3af0e75a9f5d7d7b4c2b4d3762beb90c
$ git -C C:\S\scriptorium rev-parse HEAD:codebase/g-sdk
d1783646f4364fce49ae9b421c863bc51bfad4aa
$ git -C C:\S\scriptorium rev-parse HEAD:codebase/s-sdk
7db1d4941267d857d93ab4005dcc4ecd0e49ecfb
$ git -C C:\S\scriptorium rev-parse HEAD:codebase/e-sdk
90e53544e8b78722ec8e22230740bfa107fa2cc8
$ git -C C:\S\scriptorium rev-parse HEAD:codebase/o-sdk
632ee2a2bbb10a19efbc57b2f0a847dd04333ff9
$ git -C C:\S\scriptorium rev-parse HEAD:codebase/a-sdk
e5573f8e5b248aff6e19aee5cd51b0fe7b086c1b
```

### 2) Estado plan/ + skill pin/resuelta

| mundo | plan/ | pin | resuelta (lock) |
| ----- | ----- | --- | --------------- |
| z-sdk | presente (233 files) | `0.x` | 0.3.4 |
| g-sdk | parcial (5 files) | ausente | n/a |
| s-sdk | presente (486 files) | `0.x` | 0.4.0 |
| e-sdk | presente (8 files) | ausente (sin package.json) | n/a |
| o-sdk | ausente | `0.x` | 0.3.4 |
| a-sdk | presente (12 files) | ausente | n/a |
| workspace | presente | `0.5.1` | 0.5.1 |

### 3) npm view (canal real) ? sin bump

```text
$ npm view @alephscript/skills-scriptorium version --registry https://npm.scriptorium.escrivivir.co
0.5.1
```

Workspace ya en 0.5.1. Sdks con lock 0.3.4 / 0.4.0: documentados; **no**
bump en IB-20 (PORT / GO propio).

### 4) Gitlinks pre/post obra (idénticos)

```text
# worktree ls-tree HEAD codebase/ (post-obra = mismos tips)
160000 e5573f8e5b248aff6e19aee5cd51b0fe7b086c1b	codebase/a-sdk
160000 90e53544e8b78722ec8e22230740bfa107fa2cc8	codebase/e-sdk
160000 d1783646f4364fce49ae9b421c863bc51bfad4aa	codebase/g-sdk
160000 632ee2a2bbb10a19efbc57b2f0a847dd04333ff9	codebase/o-sdk
160000 7db1d4941267d857d93ab4005dcc4ecd0e49ecfb	codebase/s-sdk
160000 d0d9de1d3af0e75a9f5d7d7b4c2b4d3762beb90c	codebase/z-sdk
```

### 5) Cuadernos (punteros; no volcado)

```text
repo: scriptorium-cuadernos (privado)
BACKSTAGE_GIT: scriptorium-vigilancia @ 03f09a9
rama mundo o-sdk: o_sdk @ cd4175a (existe)
destinos declarados en plan/MUNDOS.md: z_sdk g_sdk s_sdk e_sdk o_sdk a_sdk
legado remoto: script_sdk-addenda / script_sdk-vigilancia (no volcado)
```

### 6) Eje III (dedup / layout)

- Un asiento de partición (`PARTICION.md`) + una tabla (`MUNDOS.md`);
  VISION/DECISIONES/PRACTICAS solo **enlazan** (PORT).
- Contrato convivencia: **cita** al skill; cuerpo no reescrito.
- Cero duplicación de árbol `plan/` de sdks al workspace público.

## Auto-revisión (PRACTICAS del mundo ? con honestidad)

- [x] Diff solo dentro de `ALCANCE_DIFF`: `plan/**` + este reporte
- [x] Cero árboles/ficheros copiados de otros mundos sin procedencia
- [x] Sellos con fuente; rutas citadas existentes (skill convivencia, tips)
- [x] Sin fluff ni promesa de futuro sin `<pendiente>` / «crear bajo GO»
- [x] Eje III evidenciado (dedup asiento + cita skill)
- [x] Gates: inventario + npm view + ls-tree gitlinks ejecutados de verdad
- [x] Commits convencionales en rama wp
- [x] Diff solo del alcance del WP (no BACKLOG, no merge, no DNS, no sdk)

## Hallazgos fuera de alcance

- g-sdk / a-sdk / e-sdk sin pin skills-scriptorium ? candidato WP por
  carril dueño (no instalar aquí).
- z/s/o-sdk locks detrás de latest 0.5.1 ? bump requiere GO (PORT).
- o-sdk `plan/` ausente en tip ? nota-a-forense / dueño o-sdk; §F3a no
  excavación.
- a-sdk nests (§F3a) = forense; no abierto IB-21+.
- Residual DNS: aleph-null Pages VIVO / redirect DIFERIDO ? no obra.

## Dudas / bloqueos

Ninguno bloqueante para CA IB-20. Destinos `z_sdk`/`g_sdk`/`s_sdk`/
`e_sdk`/`a_sdk` en cuadernos están **declarados**; creación de ramas
vacías queda bajo GO del custodio (no volcado en este WP).

---

## Revisión del orquestador

_(la rellena el orquestador: aceptado ? / devuelto con lista numerada)_
