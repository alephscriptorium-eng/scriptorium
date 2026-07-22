# BRIEF · WP-XS · banner-scriptorium (residual R14/R15) · GO custodio 2026-07-23

```text
(rol) plan/roles/WORKER.md  (obra autorizada por GO custodio · no reabre N0-04)

WP: WP-XS · sustituir blob de ceros banner-scriptorium + derivado web + cabecera
Rama: main (micro-obra bajo GO custodio; ∥ gobierno LIB-070)
Checkout obra: C:\S\scriptorium (carril S · branding + docs/public + theme)
Fuente cantera: script_sdk-addenda @ 39caef49ba9726ed501017144df68157327229a1
  path cantera/branding/banner-scriptorium.webp (19KB · WebP real)
Reporte: plan/SPRINTS/PORTAL-NUMERO-0/REPORTES/WP-XS-banner-scriptorium.md

ESTADO: obra bajo GO custodio (gate propio mínimo = bundle AVISO R16-S)
```

## Decisión PO (asentada)

**Cabecera del portal = banner scriptorium** (fuente real disponible en
cantera @ `39caef4`). Trade-off documentado:

| opción | pro | contra |
| ------ | --- | ------ |
| fundación (status quo R14) | ya cableada; fallback seguro | no es la marca «scriptorium» del residual |
| **scriptorium (elegida)** | alinea cabecera con asset real re-depositado; cierra residual | cambia hero visual post-tag numero-0 (aceptable: residual declarado; no reabre N0-04) |

## ALCANCE_DIFF

ESCRITURA:
  · `branding/banner-scriptorium.webp` ← copia byte-idéntica cantera
  · retirar `branding/banner-scriptorium.png` (blob de ceros)
  · `docs/public/banner-scriptorium-web.png` derivado <150KB
  · `docs/.vitepress/theme/Layout.vue` → cabecera scriptorium
  · `branding/PROCEDENCIA.md` actualizada
  · este brief + reporte

PROHIBIDO:
  · reabrir N0-04 / retocar tag `release/numero-0`
  · inventar asset (solo fuente cantera @ tip pineado)
  · tocar librería / publish 0.7.0
  · aparcados

## CA

1. Fuente webp sha256 = cantera @ `39caef4`.
2. Derivado web <150KB (comando size).
3. Cabecera home apunta a `/banner-scriptorium-web.png`.
4. No reabre N0-04.
