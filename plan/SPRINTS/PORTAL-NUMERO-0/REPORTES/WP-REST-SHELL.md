# REPORTE · WP-REST-SHELL · restaurar shell familia aleph-null

| dato | valor |
| ---- | ----- |
| WP | WP-REST-SHELL |
| Rama | `wp/rest-shell-familia-aleph-null` |
| Gate | R20-S **PASS** (autorización 🔶) |
| DA | DA-S18 |
| Fecha | 2026-07-23 |
| Tip PRE (base) | `30367e885f654b5bcf66af918aedba9602c5e91c` (MAPA-REPO) |

## Hecho

1. **PORT visual exacto** desde `codebase/z-sdk/docs`:
   - `docs/.vitepress/theme/custom.css` = tokens zine familia (PORT z-sdk)
   - `docs/.vitepress/theme/index.js` = `extends: DefaultTheme` + slot
2. **Banner en shell** (patrón o-sdk): `Banner.vue` en slot `layout-top`
   · asset `/banner-scriptorium-web.png` conservado.
3. **Eliminado** `Layout.vue` fanzine + `fanzine.css`.
4. **Conservado:** cuerpo N0-01 (`docs/index.md` markdown) · CNAME ·
   favicon · `/licencia` · banner asset · nav/footer/`socialLinks`
   (config ya familia).
5. Frontmatter portada/licencia: `piel: familia-vp` (declaración
   instancia; hero VP para shell — sin reescribir cuerpo N0-01).
6. `docs:build` + `docs:verificar` **verdes**.
7. CHANGELOG Unreleased · nota post-tag corrección.
8. Sello `release/numero-0` **no tocado** (deref
   `40598f0e307921d613dacf1c324415eb4a1b5d32`).

## CA

| CA | resultado |
| -- | --------- |
| Look = PORT z-sdk/docs | sí (theme/css) |
| VPNav + GitHub socialLinks + footer | sí (config intacto) |
| Cero Layout.vue fanzine | sí |
| N0-01 · CNAME · favicon · /licencia · banner | sí |
| Banner integrado shell (o-sdk) | sí |
| docs:build / docs:verificar | verdes |
| Partición solo docs/theme portal | sí |
| Tag release/numero-0 intacto | sí |

## Builds

```text
docs:build     → OK (~10s)
docs:verificar → OK (html=8 · enlaces rotos=0 · anclas=0)
```

## Post-merge

AVISO de aceptación (C8 vigía lado a lado vs z-sdk) — ronda propia.
