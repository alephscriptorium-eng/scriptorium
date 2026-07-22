# N0-04 · WP-BRAND-1 · colofón marca aleph-null — reporte

| dato | valor |
| ---- | ----- |
| agente | orquestador S (obra en worktree; **sin** subagente vigía) |
| fecha | 2026-07-22 |
| rama | `wp/n0-04-brand-1` |
| worktree | `C:\S\.worktrees\wp-n0-04` |
| tip PRE 🔶 | `f276690` (= origin/main · R13-S PASS) |
| 🔶 / obra | `18168a2` (gobierno+obra en mismo commit de rama) |
| merge | `de52ba6` |
| cantera | `scriptorium-cuadernos` `script_sdk-addenda` @ `0567a2481db5cc85c8eaac613754f35061587988` |
| paquete | `@alephscript/skills-scriptorium` (citado; sin bump) |
| estado | ✅ mergeado · AVISO R14-S emitido · tag RETENIDO |

## Qué se hizo

Colofón BRAND-1 conforme brief + GO branding v3 + DA-S14:

1. Copia cantera `cantera/branding/` → `branding/` (hashes tabla brief OK).
2. Derivados `docs/public/*-web.png` **<150KB** (comando) +
   `favicon.ico` / `favicon.png` desde `logo-scriptorium-skins.png`.
3. `<link rel="icon">` explícitos en `docs/.vitepress/config.mjs`.
4. Banner cabecera (`banner-fundacion-web.png`) + footer marca+licencia
   en `Layout.vue` (mínimo cableado; no reabre N0-03).
5. `/licencia` explica capas + pieza lore AIPL (≠ LICENSE canónica).
6. `LICENSE.md` raíz = **puntero GL** (nunca lore).
7. `CONTRIBUTING.md` + `.github/PULL_REQUEST_TEMPLATE.md` desde plantillas.
8. `CHANGELOG.md` += N0-02 / N0-03 / N0-04 (pre-tag).

**No** tag `release/numero-0`. **No** BRAND-2. **No** fingir C8 Pages.

## Archivos tocados

- `branding/**` — cantera + PROCEDENCIA
- `docs/public/**` — `*-web.png`, favicon.ico/png (CNAME intacto)
- `docs/licencia.md` — capas + lore
- `docs/.vitepress/config.mjs` — head icons · nav · footer
- `docs/.vitepress/theme/Layout.vue` · `custom.css` — banner/footer marca
- `LICENSE.md` · `CONTRIBUTING.md` · `.github/PULL_REQUEST_TEMPLATE.md`
- `CHANGELOG.md` · brief · BACKLOG · este reporte

## Evidencia CA

### 1) Cantera = tip (SHA-256)

```text
banner-vibecoding.png     OK 5C78625A…F0F6F9
banner-scriptorium.png    OK FF4FEC5C…446F55
banner-fundacion.png      OK DE2E9AE6…B45BD8
logo-scriptorium-skins.png OK E5AB4570…480311
licencia-AIPL-v1-lore.md  OK 6E4AFB21…41D1E9
licencia-AIGPL-composite.md OK A49A2BB7…10131B
plantilla-CONTRIBUTING.md OK 40BE3487…A9E80F3
plantilla-PULL_REQUEST…   OK 81020C5E…AEB2D7
```

### 2) Derivados `*-web.png` <150KB (comando)

```text
banner-fundacion-web.png:       127354 bytes (<150KB=True)
banner-vibecoding-web.png:      138071 bytes (<150KB=True)
logo-scriptorium-skins-web.png:  78355 bytes (<150KB=True)
favicon.ico:                       915 bytes
favicon.png:                      3019 bytes
```

### 3) Favicon + links en head

```text
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="/favicon.png">
```

(en `docs/.vitepress/dist/index.html` post-build)

### 4) LICENSE.md ≠ lore

```text
identical? False
LICENSE has pointer? True
LICENSE has AIPL lore title? False
lore has AIPL title? True
lore sha256 prefix = 6e4afb2162e46b61 (= brief)
```

### 5) docs:build + docs:verificar — VERDE local

```text
vitepress v1.6.4 · build complete · exit=0
[verificar-sitio] html=8 · internos rotos=0 · anclas=0 · exit=0
⚠ EXTERNO 404 LICENSE.md en GitHub — esperado pre-push; se resuelve al publicar.
```

### 6) Rutas locales dist (5+ para C8 R14-S)

| ruta | dist |
| ---- | ---- |
| `/` | index.html |
| `/licencia` | licencia.html |
| `/favicon.ico` | sí |
| `/favicon.png` | sí |
| `/banner-fundacion-web.png` | sí |
| `/banner-vibecoding-web.png` | sí |

Banner cabecera + footer marca+licencia presentes en HTML home.
`/licencia` explica capas GPL + AI + or-later/v4 + lore como pieza.

### 7) cloud-router `site/brand.json`

**Ausente** en checkouts del worker (`C:\S`, `_fuentes`, codebase).
Documentado; **no fabricado**.

## Hallazgos / bloqueos

1. **`banner-scriptorium.png` en tip `0567a24` es blob de ceros**
   (883193 bytes null; SHA-256 del brief **cumple**; Desktop idéntico).
   No se inventa sustituto ni `banner-scriptorium-web.png`. Cabecera usa
   `banner-fundacion-web.png`; segunda pieza cableada =
   `banner-vibecoding-web.png` en `/licencia`.
2. C8 post-deploy Pages = **R14-S** (orquestador no finge 200).
3. Tag `release/numero-0` **NO sellado** hasta PASS R14-S.

## Vetos respetados

Cero arqueología · cero force · PORT NO REWRITE · sin BRAND-2 ·
sin subagente vigía · network-sdk solo remote epsylon ·
paquete `@alephscript/skills-scriptorium`.
