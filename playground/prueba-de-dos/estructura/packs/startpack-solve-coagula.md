# Ancla · `@zeus/startpack-solve-coagula` 0.1.0

Ficha-ancla (WP-G52). **Anclar = declarar el contrato de obtención** — esta
ficha no copia el pack ni enlaza a ningún checkout local del mundo G.

| contrato | valor |
| -------- | ----- |
| nombre npm | `@zeus/startpack-solve-coagula` |
| versión | `0.1.0` |
| rol | `zeus.role: startpack` · `game: solve-coagula` |
| canal 1 · npm | registry `https://npm.scriptorium.escrivivir.co` (scope `@zeus`) |
| canal 2 · GitHub Release | repo `alephscriptorium-eng/Z_SDK-games-library` · tag `startpack-solve-coagula-v0.1.0` (patrón `startpack-*-v*`; notario → tarball + acta → Release espejo) |
| hash local (`npm pack --dry-run` sobre el repo G, commit `daef20b`) | shasum `60c9d123337dbf773b469ad3363b17db7bf96da1` |
| integrity | `sha512-iGWhmBozYTnWDmZE8REsMlKvVH2Mv52m5N935p+mPzRQnUZT8ZQNUOvIyQimmB0HgvvuEcgmZabQFccXbRv5bQ==` |
| tarball declarado | 14 ficheros · 21 377 B unpacked |
| árbol fuente medido | 15 ficheros · 21,4 KB |

## Contenido resumido

Start pack **SOLVE ET COAGULA** (WP-U87): dramaturgia + fixture linea-aleph.
Ronda: `gamemapId: solve-coagula-demo`, `lineId: solve-coagula`, feeds
sintéticos, objetivo `cases: 3`, semillas `seeds/gamemap.json`,
`seeds/story-board.json`, `seeds/casos.md`, volumes slot `DISK_02`, acta en
`acta/ACTA.md`. Depende de `@zeus/startpack-kit@0.1.0`.

## Evidencia (repo G `Z_SDK-games-library`, commit local censado `daef20b`)

- `packages/startpack-solve-coagula/package.json:2-3` — nombre y versión
- `packages/startpack-solve-coagula/package.json:4` — descripción (dramaturgia + fixture linea-aleph, WP-U87)
- `packages/startpack-solve-coagula/package.json:24` — dependencia `@zeus/startpack-kit: 0.1.0`
- `packages/startpack-solve-coagula/package.json:26-29` — `zeus.role: startpack`, `game: solve-coagula`
- `packages/startpack-solve-coagula/package.json:31-33` — `publishConfig.registry: https://npm.scriptorium.escrivivir.co`
- `packages/startpack-solve-coagula/manifest.json:2-5` — `schema: zeus.startpack/v0`, game, id, versión
- `packages/startpack-solve-coagula/manifest.json:14` — objetivo `cases: 3`
- `packages/startpack-solve-coagula/manifest.json:26` — `acta: acta/ACTA.md`
- `.github/workflows/release-startpack.yml:31-32` — dispara con tags `startpack-*-v*`
