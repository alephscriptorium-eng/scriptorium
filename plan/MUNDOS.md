# MUNDOS — inventario de holones (carril S · IB-20)

Fuente de lectura: tips gitlink en `MUNDO_RAIZ` (`C:\S\scriptorium`) vía
`git rev-parse HEAD:codebase/<letra>-sdk`. **SOLO LECTURA** de
`codebase/*-sdk` en este WP: cero edits, cero bump de gitlinks.

Cuadernos = repo privado `scriptorium-cuadernos` (fuera del público).
Punteros abajo = destino rama-por-mundo; **no** se vuelca histórico crudo
aquí. BACKSTAGE del vigía: rama `scriptorium-vigilancia` (ver
`plan/ESTACION.md`).

## Tabla de mundos

| mundo | tip gitlink (HEAD:codebase/…) | plan/ | skill pin (`package.json`) | skill resuelta (lock / npm) | cuadernos (rama destino) |
| ----- | ----------------------------- | ----- | -------------------------- | --------------------------- | ------------------------ |
| z-sdk | `d0d9de1d3af0e75a9f5d7d7b4c2b4d3762beb90c` | **presente** (233 ficheros; VISION·BACKLOG·DECISIONES·PRACTICAS·REPORTES·roles) | `@alephscript/skills-scriptorium`: `0.x` | lock → **0.3.4** (registry canal) | `z_sdk` _(declarada; crear bajo GO si falta)_ |
| g-sdk | `d1783646f4364fce49ae9b421c863bc51bfad4aa` | **parcial** (5 ficheros: README·PRACTICAS·REPORTES; sin VISION/BACKLOG/DECISIONES) | **ausente** (no dep skills-scriptorium) | n/a | `g_sdk` _(declarada; crear bajo GO si falta)_ |
| s-sdk | `7db1d4941267d857d93ab4005dcc4ecd0e49ecfb` | **presente** (486 ficheros; gobierno + SPRINTS + REPORTES) | `@alephscript/skills-scriptorium`: `0.x` | lock → **0.4.0** (registry canal) | `s_sdk` _(canónica declarada; legado remoto `script_sdk-*` — no volcar)_ |
| e-sdk | `90e53544e8b78722ec8e22230740bfa107fa2cc8` | **presente** (8 ficheros; VISION·BACKLOG·DECISIONES·PRACTICAS·REPORTES·roles) | **ausente** (sin `package.json`) | n/a | `e_sdk` _(declarada; crear bajo GO si falta)_ |
| o-sdk | `632ee2a2bbb10a19efbc57b2f0a847dd04333ff9` | **ausente** (sin `plan/` en tip; §F3a: no excavar) | `@alephscript/skills-scriptorium`: `0.x` | lock → **0.3.4** (registry canal) | `o_sdk` _(existe; tip `cd4175a`)_ |
| a-sdk | `e5573f8e5b248aff6e19aee5cd51b0fe7b086c1b` | **presente** (12 ficheros; VISION·BACKLOG·DECISIONES·PRACTICAS·REPORTES·roles) | **ausente** (no dep skills-scriptorium) | n/a | `a_sdk` _(declarada; nests §F3a → forense, no excavación)_ |

## Workspace (carril S · no es un sdk)

| dato | valor |
| ---- | ----- |
| pin | `@alephscript/skills-scriptorium@0.5.1` (`package.json`) |
| resuelta | lock → **0.5.1** · `npm view` canal `https://npm.scriptorium.escrivivir.co` → **0.5.1** (= latest) |
| plan/ | presente (gobierno del carril) |
| cuadernos vigía | `scriptorium-vigilancia` @ `03f09a9` (BACKSTAGE_GIT) |

## skills@latest (documentar · sin bump)

| sujeto | pin | resuelta / latest canal | acción IB-20 |
| ------ | --- | ----------------------- | ------------ |
| workspace scriptorium | `0.5.1` | `0.5.1` = latest | ninguna (ya al día) |
| z-sdk | `0.x` | lock 0.3.4 · latest canal 0.5.1 | **sin bump** (PORT; GO propio) |
| s-sdk | `0.x` | lock 0.4.0 · latest canal 0.5.1 | **sin bump** |
| o-sdk | `0.x` | lock 0.3.4 · latest canal 0.5.1 | **sin bump** · tip pin IB-01 |
| g-sdk / e-sdk / a-sdk | ausente | n/a | no instalar en este WP |

## Cero histórico perdido

- Inventario arriba = evidencia de lectura; **ningún** `plan/` de sdk fue
  borrado ni modificado en IB-20.
- Destino de archivo/histórico de gobierno hermano = ramas en
  `scriptorium-cuadernos` (columna «cuadernos»). Volcado crudo al repo
  público = **veto**.
- o-sdk sin `plan/` en tip: estado **ausente** documentado; no se inventa
  ni se excavá (§F3a / DA-S04).

## Relación

- Partición de territorios: `plan/PARTICION.md`
- Convivencia: skill `convivencia-multi-orquestador.md` (contrato v1.1 /
  método v0.6) — citar, no reescribir
- Estación / BACKSTAGE: `plan/ESTACION.md`
