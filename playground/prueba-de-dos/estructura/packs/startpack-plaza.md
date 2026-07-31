# Ancla · `@zeus/startpack-plaza` 0.1.0

Ficha-ancla (WP-G52). **Anclar = declarar el contrato de obtención** — esta
ficha no copia el pack ni enlaza a ningún checkout local del mundo G.

| contrato | valor |
| -------- | ----- |
| nombre npm | `@zeus/startpack-plaza` |
| versión | `0.1.0` |
| rol | `zeus.role: startpack` · `game: plaza` |
| canal 1 · npm | registry `https://npm.scriptorium.escrivivir.co` (scope `@zeus`) |
| canal 2 · GitHub Release | repo `alephscriptorium-eng/Z_SDK-games-library` · tag `startpack-plaza-v0.1.0` (patrón `startpack-*-v*`; notario → tarball + acta → Release espejo) |
| hash local (`npm pack --dry-run` sobre el repo G, commit `daef20b`) | shasum `2e3a1f473482dc2e4aeef830d039d9398dac7d25` |
| integrity | `sha512-ZkMdKuTuhK3aI2Y/AyrwhrVApdGK+cTTTQFUeYYrj4kCBOOM4IheiHHSSwrlUcHvwmKgqmlX7oCJqrN09JoEYg==` |
| tarball declarado | 29 ficheros · 19 369 B unpacked |
| árbol fuente medido | 30 ficheros · 19,8 KB |

## Contenido resumido

Start pack **narrativo mínimo** (WP-U111): story-board solve-inline + línea +
casos. Ronda: `gamemapId: plaza-demo`, `lineId: juguete`, feeds sintéticos,
objetivo `cases: 1 / acts: 1`, semillas `seeds/gamemap.json`,
`seeds/story-board.json`, `seeds/casos.md`, volumes slot `DISK_02`, acta en
`acta/ACTA.md`. Depende de `@zeus/startpack-kit@0.1.0`.

## Evidencia (repo G `Z_SDK-games-library`, commit local censado `daef20b`)

- `packages/startpack-plaza/package.json:2-3` — nombre y versión
- `packages/startpack-plaza/package.json:4` — descripción (narrativo mínimo, WP-U111)
- `packages/startpack-plaza/package.json:24` — dependencia `@zeus/startpack-kit: 0.1.0`
- `packages/startpack-plaza/package.json:26-29` — `zeus.role: startpack`, `game: plaza`
- `packages/startpack-plaza/package.json:31-33` — `publishConfig.registry: https://npm.scriptorium.escrivivir.co`
- `packages/startpack-plaza/manifest.json:2-5` — `schema: zeus.startpack/v0`, game, id, versión
- `packages/startpack-plaza/manifest.json:20-21` — `storyBoard: seeds/story-board.json`, `casos: seeds/casos.md`
- `packages/startpack-plaza/manifest.json:29` — `acta: acta/ACTA.md`
- `.github/workflows/release-startpack.yml:31-32` — dispara con tags `startpack-*-v*`
