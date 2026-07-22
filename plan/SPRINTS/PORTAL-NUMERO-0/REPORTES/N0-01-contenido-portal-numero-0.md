# N0-01 · Contenido portal aleph-null (número 0) — reporte

| dato | valor |
| ---- | ----- |
| agente | orquestador tras stall (obra en worktree; sin subagente vigía) |
| fecha | 2026-07-22 |
| rama | `wp/n0-01-contenido-portal-numero-0` |
| worktree | `C:\S\.worktrees\wp-n0-01` |
| base tip 🔶 | `31b6408` (main post R9-S PASS `3c1c97f`) |
| fuentes | `scriptorium-vigilancia` @ `b12d26f` · `script_sdk-addenda` @ `5f0a11b` |
| eje(s) CA | III (layout docs / verdad de contenido) + filtros site-web |
| paquete | `@alephscript/skills-scriptorium` |
| estado propuesto | listo para revisión |

## Qué se hizo

Contenido número 0 del portal sobre esqueleto IB-13, fusión **TAL CUAL**
del brief (base Vigilante-S manda + insertos C-1…C-5; C-6 omitido):

- Portada renovada (`docs/index.md`) + **C-1 CORE** tras golpe 5 (ancla ACTA-F5b)
- Páginas nuevas: `/constelacion`, `/metodo`, `/ciudad`, `/cola`
- `/ciudad`: base L1/L2/G3 + **C-2** (tres jugadores) + **C-3** (campanas/cronista)
- `/cola`: **C-4** voz editorial en encabezado + inventario base
- `/proyecto`: párrafo actas IB-13 (base) + **C-5** cierre editorial; B11 intacto
- Nav/sidebar: 6 entradas (Portada · Constelación · Método · Ciudad · Cola · Proyecto)

**No se tocó** `docs/.vitepress/theme/**` (piel · issue #15) ni
`docs/public/CNAME`. **No se finge C8 deploy** (baseline PRE; re-chequeo
Vigilante-S en R10-S). **No se reabre IB-13.** C-6 ausente (semillas nº1).

## Archivos tocados

- `docs/index.md` — renovada + C-1
- `docs/constelacion.md` — nueva
- `docs/metodo.md` — nueva
- `docs/ciudad.md` — nueva (+ C-2 · C-3)
- `docs/cola.md` — nueva (+ C-4)
- `docs/proyecto.md` — enriquecida (+ C-5; B11 conservado)
- `docs/.vitepress/config.mjs` — nav/sidebar 6 entradas (footer BACK intacto)
- `plan/SPRINTS/PORTAL-NUMERO-0/REPORTES/N0-01-contenido-portal-numero-0.md` — este reporte

## Evidencia CA

### 1) docs:build + docs:verificar — VERDE

```text
vitepress v1.6.4
build complete in 8.90s
build exit=0

[verificar-sitio] dist=docs/.vitepress/dist base=/ html=7
  enlaces internos rotos: 0
  anclas rotas:           0
  externos revisados:     14 (warning: 1)
  ⚠ EXTERNO 404 .../CHANGELOG.md  (footer B11; pre-tag gobierno)
[verificar-sitio] OK
verificar exit=0
```

### 2) Nav/sidebar 6 entradas + footer B11

```text
nav/sidebar: Portada · Constelación · Método · Ciudad · Cola · Proyecto
BACK/footer: repo · registry · actions · pages · changelog · issues (sin duplicar URLs en copy)
```

### 3) Cero claims fuera de fusión

Copy = entrega V-S @ `b12d26f` + insertos complemento @ `5f0a11b` según
tabla del brief. Sin frases nuevas sin ancla.

### 4) C8 post-deploy — NO fingido (baseline PRE)

```text
C8 deploy: ⟨pendiente re-chequeo Vigilante-S · R10-S⟩
rutas pedidas: / · /constelacion · /metodo · /ciudad · /cola
worker: solo build local verde; no curl de Pages como 200 inventado
```

### 5) Piel intocable

```text
docs/.vitepress/theme/** — sin diff
docs/public/CNAME = aleph-null.escrivivir.co (DA-S02)
```

### 6) Alcance

Solo `docs/**` (+ este reporte). Sin BACKLOG, sin merge, sin gitlink bump.

### 7) Paquete nombre completo

`@alephscript/skills-scriptorium` en portada (golpe 4) y `/metodo`.

### 8) C-1 CORE en portada

Bloque evidencia F5b con enlace a ACTA-F5b tras golpe 5 en `docs/index.md`.

### Fusión (conformidad)

| bloque | destino | aplicado |
| ------ | ------- | -------- |
| Base V-S | docs/** + nav | sí |
| C-1 CORE | index tras golpe 5 | sí |
| C-2 | ciudad.md | sí |
| C-3 | ciudad.md | sí |
| C-4 | cola.md encabezado | sí |
| C-5 | proyecto.md cierre | sí |
| C-6 | — | omitido (sin `/historia` ni `/jugar`) |

## Auto-revisión (PRACTICAS)

- [x] Diff solo docs/** + reporte
- [x] Fusión brief sin retocar veredictos
- [x] docs:build / docs:verificar ejecutados de verdad
- [x] C8 deploy no fingido
- [x] Piel/CNAME/IB-13 intactos
- [x] Paquete nombre completo

## Hallazgos fuera de alcance

- `CHANGELOG.md` ausente en raíz → warning externo footer (gobierno pre-tag).
- C8 Pages de las 5 rutas → R10-S / Vigilante-S.

## Dudas / bloqueos

Ninguno para aceptación de contenido local.
