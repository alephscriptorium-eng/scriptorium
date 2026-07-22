# REPORTE · WP-XS · banner-scriptorium · 2026-07-23

| dato | valor |
| ---- | ----- |
| WP | WP-XS banner-scriptorium |
| Fuente cantera | `39caef49ba9726ed501017144df68157327229a1` · `cantera/branding/banner-scriptorium.webp` |
| Decisión PO cabecera | **scriptorium** (no fundación) |
| Reabre N0-04 | **no** |

## Evidencia

### 1) Fuente real (sustituye blob ceros)

```text
branding/banner-scriptorium.webp
  bytes = 18940
  sha256 = d84e5c82278020313907dfc5ffaae447d9ac5291ee2d95cf3bd4d9621558020b
  head   = 52494646… (RIFF/WEBP)
branding/banner-scriptorium.png (blob ceros 883193) — RETIRADO
```

### 2) Derivado web <150KB

```text
docs/public/banner-scriptorium-web.png
  bytes  = 31104 (<150KB=True)
  sha256 = 7e4b71903ca6813e726fb14f07324a2f12af2a98b5d4f61efc6116807bae3159
```

### 3) Cabecera

`docs/.vitepress/theme/Layout.vue`:
`bannerSrc` → `/banner-scriptorium-web.png` · alt scriptorium.

## Vetos

Cero arqueología · no reabre N0-04 · no publish 0.7.0 · no subagente vigía.
