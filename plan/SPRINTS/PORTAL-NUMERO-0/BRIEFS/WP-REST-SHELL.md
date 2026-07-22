# BRIEF · WP-REST-SHELL · restaurar shell familia en aleph-null · ⬜ PRE-🔶

```text
(rol) plan/roles/WORKER.md

WP: WP-REST-SHELL · restaurar shell familia codebase en portal aleph-null
Rama: wp/rest-shell-familia-aleph-null
Worktree: C:\S\.worktrees\wp-rest-shell (si ∥)
Checkout obra: C:\S\scriptorium (carril S · docs/theme del portal índice)
Reporte: plan/SPRINTS/PORTAL-NUMERO-0/REPORTES/WP-REST-SHELL.md

ESTADO: ⬜ encolado · AVISO R20-S emitido · **sin PASS no hay 🔶**
DA: DA-S18 (piel portal = familia codebase)
PORT visual EXACTO (= CA de look): codebase/z-sdk/docs
```

> Residual **post-tag** · **NO** reabre arco PORTAL-NUMERO-0 · **NO**
> toca sello `release/numero-0`. Puede ir ∥ con olas de mundos
> (territorios distintos · R19-S = otro carril de gate; no reabrir).

═══════════════════════════════════════════════════════════════════
CHECKOUT / PARTICIÓN
═══════════════════════════════════════════════════════════════════

| territorio | path FS | rol |
| ---------- | ------- | --- |
| Obra portal | **`C:\S\scriptorium`** · `docs/**` + `docs/.vitepress/**` | único escritor |
| PORT look | `codebase/z-sdk/docs` (lectura) | CA visual exacto |
| Banner patrón | `codebase/o-sdk/docs` (lectura · Banner en shell) | integrar banner |
| Mundos hermanos | `C:\S_LAB\<letra>-sdk` / gitlinks | **NO tocar** |
| Librería | `C:\S_LAB\skills-library` | **NO** obra aquí (LIB-080 aparte) |

═══════════════════════════════════════════════════════════════════
ALCANCE_DIFF
═══════════════════════════════════════════════════════════════════

ESCRITURA (portal workspace):
  · `docs/.vitepress/theme/**` — shell familia VP (index + custom.css
    tokens zine); **cero** `Layout.vue` fanzine
  · `docs/.vitepress/config.*` — nav + `socialLinks` GitHub + footer
    `themeConfig` (patrón z-sdk)
  · banner cabecera **integrado al shell** (patrón o-sdk · no overlay
    fanzine)
  · reporte bajo `REPORTES/WP-REST-SHELL.md`

CONSERVAR ÍNTEGRO (PORT contenido / marca):
  · contenido **N0-01** (bodies / páginas)
  · **CNAME** (DA-S02)
  · **favicon**
  · **`/licencia`**
  · **banner** (asset; integrado al shell)

PROHIBIDO:
  · 🔶 sin PASS **R20-S**
  · tocar / mover / reescribir tag `release/numero-0`
  · reabrir N0-01…N0-04 como arco
  · Layout.vue fanzine / stamp-washi como destino
  · tocar mundos hermanos · bumpear gitlinks atlas
  · mezclar DA-S17 / parser · adelantar LIB-080
  · criterios de look **extra** al PORT z-sdk/docs

═══════════════════════════════════════════════════════════════════
CA
═══════════════════════════════════════════════════════════════════

1. **Look = PORT exacto** `codebase/z-sdk/docs` (CA de look; sin
   criterios inventados).
2. Home e internas: **VPNav** + enlace **GitHub** (`socialLinks`) +
   **footer** themeConfig.
3. Cero `Layout.vue` fanzine en theme del portal.
4. Contenido N0-01 · CNAME · favicon · `/licencia` · banner conservados.
5. Banner integrado al shell (patrón o-sdk).
6. `docs:build` y `docs:verificar` verdes.
7. C8 del vigía lado a lado contra z-sdk (post-deploy · no fingir).
8. Partición: solo docs/theme portal workspace.
9. Sin 🔶 sin PASS R20-S.

## Encadenamiento

- Gate carril **antes** del 🔶: este brief + `AVISO-VIGIA-R20-S.md`.
- ∥ permitido con olas mundos (R19-S); no reabrir olas.
- LIB-080 (método `piel:`) = COLA librería · no bloquea este WP ni
  viceversa (territorios distintos); formalizar `piel: familia-vp` en
  aleph-null = mini-tick **post-0.8.0**.
