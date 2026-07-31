# Ancla · `@zeus/startpack-pozo` 0.1.0

Ficha-ancla (WP-G52). **Anclar = declarar el contrato de obtención** — esta
ficha no copia el pack ni enlaza a ningún checkout local del mundo G.

| contrato | valor |
| -------- | ----- |
| nombre npm | `@zeus/startpack-pozo` |
| versión | `0.1.0` |
| rol | `zeus.role: startpack` · `game: pozo` |
| canal 1 · npm | registry `https://npm.scriptorium.escrivivir.co` (scope `@zeus`) |
| canal 2 · GitHub Release | repo `alephscriptorium-eng/Z_SDK-games-library` · tag `startpack-pozo-v0.1.0` (patrón `startpack-*-v*`; notario → tarball + acta → Release espejo) |
| hash local (`npm pack --dry-run` sobre el repo G, commit `daef20b`) | shasum `3ff044d9c8f7887a0377769bea5a24e52ebedc3b` |
| integrity | `sha512-DpT7BL0DvQF3d8+yWAyrLhLaAvyq5xpWYZXSWTLJhnz8tLjiZ0sXw7v6omxftOXeoN8WIM3cMCvu/Zt6+P2UzA==` |
| tarball declarado | 15 ficheros · 6 526 B unpacked |
| árbol fuente medido | 16 ficheros · 7,2 KB |

## Contenido resumido

Start pack de ronda del juego **pozo** (WP-U62): semillas
(`seeds/gamemap.json`, `feedSeed: 1`), volumes sintéticos y acta. Ronda:
`gamemapId: pozo-demo`, feeds sintéticos, objetivo `emptied: 1`, volumes slot
`DISK_03`, acta en `acta/ACTA.md`. Depende de `@zeus/startpack-kit@0.1.0`.

## Evidencia (repo G `Z_SDK-games-library`, commit local censado `daef20b`)

- `packages/startpack-pozo/package.json:2-3` — nombre y versión
- `packages/startpack-pozo/package.json:24` — dependencia `@zeus/startpack-kit: 0.1.0`
- `packages/startpack-pozo/package.json:26-29` — `zeus.role: startpack`, `game: pozo`
- `packages/startpack-pozo/package.json:31-33` — `publishConfig.registry: https://npm.scriptorium.escrivivir.co`
- `packages/startpack-pozo/manifest.json:2-5` — `schema: zeus.startpack/v0`, game, id, versión
- `packages/startpack-pozo/manifest.json:13` — objetivo `emptied: 1`
- `packages/startpack-pozo/manifest.json:24` — `acta: acta/ACTA.md`
- `.github/workflows/release-startpack.yml:31-32` — dispara con tags `startpack-*-v*`
