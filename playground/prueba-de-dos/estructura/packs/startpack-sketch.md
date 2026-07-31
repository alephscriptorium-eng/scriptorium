# Ancla · `@zeus/startpack-sketch` 0.1.0

Ficha-ancla (WP-G52). **Anclar = declarar el contrato de obtención** — esta
ficha no copia el pack ni enlaza a ningún checkout local del mundo G.

| contrato | valor |
| -------- | ----- |
| nombre npm | `@zeus/startpack-sketch` |
| versión | `0.1.0` |
| rol | `zeus.role: startpack` · `game: sketch` |
| canal 1 · npm | registry `https://npm.scriptorium.escrivivir.co` (scope `@zeus`) |
| canal 2 · GitHub Release | repo `alephscriptorium-eng/Z_SDK-games-library` · tag `startpack-sketch-v0.1.0` (patrón `startpack-*-v*`; notario → tarball + acta → Release espejo) |
| hash local (`npm pack --dry-run` sobre el repo G, commit `daef20b`) | shasum `effc0d000ad21cfa2e06066d7fb9f39ea3424162` |
| integrity | `sha512-KerUP2DP1Y664DmLOWCs2Yay/gVOrR4Y/uoVV2th9/rAV+gs86KRzbZQTCBNW3O1cUG+ZZXFHt5j14T2ymnW3Q==` |
| tarball declarado | 34 ficheros · 23 067 B unpacked |
| árbol fuente medido | 35 ficheros · 23,4 KB |

## Contenido resumido

Start pack **mínimo parametrizable** (WP-U70): escena + labelset + línea +
casos. Ronda: `gamemapId: sketch-demo`, `lineId: juguete`, feeds sintéticos,
objetivo `cases: 1`, semillas `seeds/gamemap.json`, `seeds/scene.json`,
`seeds/casos.md`, volumes slots `DISK_02` + `DISK_03`, acta en `acta/ACTA.md`.
Depende de `@zeus/startpack-kit@0.1.0`.

## Evidencia (repo G `Z_SDK-games-library`, commit local censado `daef20b`)

- `packages/startpack-sketch/package.json:2-3` — nombre y versión
- `packages/startpack-sketch/package.json:4` — descripción (mínimo parametrizable, WP-U70)
- `packages/startpack-sketch/package.json:24` — dependencia `@zeus/startpack-kit: 0.1.0`
- `packages/startpack-sketch/package.json:26-29` — `zeus.role: startpack`, `game: sketch`
- `packages/startpack-sketch/package.json:31-33` — `publishConfig.registry: https://npm.scriptorium.escrivivir.co`
- `packages/startpack-sketch/manifest.json:2-5` — `schema: zeus.startpack/v0`, game, id, versión
- `packages/startpack-sketch/manifest.json:19-20` — `scene: seeds/scene.json`, `casos: seeds/casos.md`
- `packages/startpack-sketch/manifest.json:29` — `acta: acta/ACTA.md`
- `.github/workflows/release-startpack.yml:31-32` — dispara con tags `startpack-*-v*`
