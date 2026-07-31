# Ancla · `@zeus/startpack-kit` 0.1.0

Ficha-ancla (WP-G52). **Anclar = declarar el contrato de obtención** — esta
ficha no copia el pack ni enlaza a ningún checkout local del mundo G.

| contrato | valor |
| -------- | ----- |
| nombre npm | `@zeus/startpack-kit` |
| versión | `0.1.0` |
| rol | `zeus.role: kit` (loader compartido; no es startpack de juego) |
| canal 1 · npm | registry `https://npm.scriptorium.escrivivir.co` (scope `@zeus`) |
| canal 2 · lote | workflow `publish-mesh-ciudad.yml` del repo `alephscriptorium-eng/Z_SDK-games-library` — orden duro: **startpack-kit** → startpack-ciudad → ciudad (no figura en las opciones de `release-startpack.yml`) |
| hash local (`npm pack --dry-run` sobre el repo G, commit `daef20b`) | shasum `4ca99ca53a44731cb03ab58e95d7927dd677fccd` |
| integrity | `sha512-Eu3uqgTPCHAfrFGjvRSKRv/TAj5vwJJ9ZniOJl7vby2Yn1SN6VNoWDysfAJd1pjkDWL18eb6r+ez6f7WuoXEZw==` |
| tarball declarado | 3 ficheros · 5 438 B unpacked |
| árbol fuente medido | 4 ficheros · 9,0 KB |

## Contenido resumido

Loader compartido `loadStartPack` para todos los `@zeus/startpack-*` de la
games-library (WP-U110): una sola implementación que resuelve
`{ gamemap, scene, arbol, zones, volumesRoot, actaPath, env }`. API:
`loadStartPack`, `createStartPackLoader`, `readJsonIfExists`,
`readTextIfExists`. Sin `manifest.json` propio (no describe ronda: es
herramienta). Es dependencia de los 6 startpacks de juego.

## Evidencia (repo G `Z_SDK-games-library`, commit local censado `daef20b`)

- `packages/startpack-kit/package.json:2-3` — nombre y versión
- `packages/startpack-kit/package.json:4` — descripción (loader compartido, WP-U110)
- `packages/startpack-kit/package.json:18-20` — `zeus.role: kit`
- `packages/startpack-kit/package.json:22-24` — `publishConfig.registry: https://npm.scriptorium.escrivivir.co`
- `packages/startpack-kit/README.md:3-4` — una sola implementación de `loadStartPack` para todos los packs
- `.github/workflows/publish-mesh-ciudad.yml:2` — orden duro del lote (kit primero)
- `.github/workflows/publish-mesh-ciudad.yml:45-46` — paso «Publish @zeus/startpack-kit»
- `.github/workflows/release-startpack.yml:6` — remite el lote mesh ciudad (kit + startpack + game) a `publish-mesh-ciudad.yml`
