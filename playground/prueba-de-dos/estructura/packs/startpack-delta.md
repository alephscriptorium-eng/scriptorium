# Ancla · `@zeus/startpack-delta` 0.1.0

Ficha-ancla (WP-G52). **Anclar = declarar el contrato de obtención** — esta
ficha no copia el pack ni enlaza a ningún checkout local del mundo G.

| contrato | valor |
| -------- | ----- |
| nombre npm | `@zeus/startpack-delta` |
| versión | `0.1.0` |
| rol | `zeus.role: startpack` · `game: delta` |
| canal 1 · npm | registry `https://npm.scriptorium.escrivivir.co` (scope `@zeus`) |
| canal 2 · GitHub Release | repo `alephscriptorium-eng/Z_SDK-games-library` · tag `startpack-delta-v0.1.0` (patrón `startpack-*-v*`; notario → tarball + acta → Release espejo) |
| hash local (`npm pack --dry-run` sobre el repo G, commit `daef20b`) | shasum `0526c5dffa6fcff877c5d72c4c1b0cdb67b551ab` |
| integrity | `sha512-f3yV3CDFOy/Uiz01Dl+fPPOmU203ws7JcF2muI7ChYrKaS6Ki2YH2l3HowHvOQjtjd3/ycc7DjuHO4FF9Aqk2g==` |
| tarball declarado | 21 ficheros · 19 404 B unpacked |
| árbol fuente medido | 22 ficheros · 20,1 KB |

## Contenido resumido

Start pack de ronda del juego **delta** (WP-U62): semillas (`seeds/presets.json`,
`seeds/gamemap.json`), volumes sintéticos y acta. Ronda: `gamemapId:
gamemap-demo`, feeds sintéticos, `startPack: [aleph-tronco-puro,
aleph-firehose-browse]`, objetivo `labeled: 10 / excavated: 2`, volumes slots
`DISK_02` + `DISK_03`, acta en `acta/ACTA.md`. Depende de
`@zeus/startpack-kit@0.1.0`. Env útil documentado por el propio pack:
`ZEUS_STARTPACK_ROOT` (árbol descomprimido) o resolución npm.

## Evidencia (repo G `Z_SDK-games-library`, commit local censado `daef20b`)

- `packages/startpack-delta/package.json:2-3` — nombre y versión
- `packages/startpack-delta/package.json:24` — dependencia `@zeus/startpack-kit: 0.1.0`
- `packages/startpack-delta/package.json:26-29` — `zeus.role: startpack`, `game: delta`
- `packages/startpack-delta/package.json:31-33` — `publishConfig.registry: https://npm.scriptorium.escrivivir.co`
- `packages/startpack-delta/manifest.json:2-5` — `schema: zeus.startpack/v0`, game, id, versión
- `packages/startpack-delta/manifest.json:11` — `startPack: [aleph-tronco-puro, aleph-firehose-browse]`
- `packages/startpack-delta/manifest.json:26` — `acta: acta/ACTA.md`
- `packages/startpack-delta/README.md:27` — `ZEUS_STARTPACK_ROOT` (árbol descomprimido) o resolución npm
- `.github/workflows/release-startpack.yml:31-32` — dispara con tags `startpack-*-v*`
