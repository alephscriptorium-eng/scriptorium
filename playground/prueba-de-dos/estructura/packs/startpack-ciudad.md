# Ancla · `@zeus/startpack-ciudad` 0.1.0

Ficha-ancla (WP-G52). **Anclar = declarar el contrato de obtención** — esta
ficha no copia el pack ni enlaza a ningún checkout local del mundo G.

| contrato | valor |
| -------- | ----- |
| nombre npm | `@zeus/startpack-ciudad` |
| versión | `0.1.0` |
| rol | `zeus.role: startpack` · `game: ciudad` |
| canal 1 · npm | registry `https://npm.scriptorium.escrivivir.co` (scope `@zeus`; el `.npmrc` de este playground ya lo fija) |
| canal 2 · GitHub Release | repo `alephscriptorium-eng/Z_SDK-games-library` · tag `startpack-ciudad-v0.1.0` (patrón `startpack-*-v*`; notario → tarball + acta → Release espejo) |
| canal lote | workflow `publish-mesh-ciudad.yml` — orden duro: startpack-kit → startpack-ciudad → ciudad |
| hash local (`npm pack --dry-run` sobre el repo G, commit `daef20b`) | shasum `3ee4a6b74b54aecc5c8ec37365583028945fed68` |
| integrity | `sha512-iFNjQCIeQNSTofAW+7WwOVQNX/aYCCgDjxZiHLDYyLTWGEhGmz8VTQNMNySK/SVjikCiRn/qWQeC7Hd33TZTWQ==` |
| tarball declarado | 9 ficheros · 42 793 B unpacked |
| árbol fuente medido | 14 ficheros · 74,3 KB |

## Contenido resumido

Topología de la Ciudad como gamemap plano: plaza + zigurat (gobernanza),
6 distritos, 24 barrios con `estado` jugable, calles como walk-links y
catálogo `arbol` (edificios / maquinarias). Exporta `scene.mjs` para el
game-engine. Ronda: `gamemapId: ciudad-demo`, feeds sintéticos, objetivo
`barriosDespiertos: 1`, volumes slot `DISK_04`, acta en `acta/ACTA.md`.
Depende de `@zeus/startpack-kit@0.1.0` (loader).

## Evidencia (repo G `Z_SDK-games-library`, commit local censado `daef20b`)

- `packages/startpack-ciudad/package.json:2-3` — nombre y versión
- `packages/startpack-ciudad/package.json:4` — descripción (city topology: plaza/zigurat/districts/barrios + arbol)
- `packages/startpack-ciudad/package.json:28` — dependencia `@zeus/startpack-kit: 0.1.0`
- `packages/startpack-ciudad/package.json:30-33` — `zeus.role: startpack`, `game: ciudad`
- `packages/startpack-ciudad/package.json:35-38` — `publishConfig.registry: https://npm.scriptorium.escrivivir.co`
- `packages/startpack-ciudad/manifest.json:2-5` — `schema: zeus.startpack/v0`, game, id, versión
- `packages/startpack-ciudad/manifest.json:24` — `acta: acta/ACTA.md`
- `packages/startpack-ciudad/README.md:3-6` — plaza + zigurat, 6 distritos, 24 barrios, catálogo `arbol`
- `.github/workflows/release-startpack.yml:3` — notario → tarball + acta → GitHub Release espejo
- `.github/workflows/release-startpack.yml:31-32` — dispara con tags `startpack-*-v*`
- `.github/workflows/release-startpack.yml:68` — host del registry `npm.scriptorium.escrivivir.co`
- `.github/workflows/publish-mesh-ciudad.yml:2` — lote kit → startpack-ciudad → ciudad
