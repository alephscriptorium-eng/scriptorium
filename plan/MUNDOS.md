# MUNDOS — inventario de holones (carril S · IB-20)

Fuente de lectura: tips gitlink en `MUNDO_RAIZ` (`C:\S\scriptorium`) via
`git rev-parse HEAD:codebase/<letra>-sdk`. **SOLO LECTURA** de
`codebase/*-sdk` en este WP: cero edits, cero bump de gitlinks.

Cuadernos = repo privado `scriptorium-cuadernos` (fuera del publico).
Punteros abajo = destino rama-por-mundo; **no** se vuelca historico crudo
aqui. BACKSTAGE del vigia: rama `scriptorium-vigilancia` (ver
`plan/ESTACION.md`).

## Tabla de mundos

| mundo | tip gitlink (HEAD:codebase/...) | plan/ | skill pin (package.json) | skill resuelta (lock) | cuadernos (rama destino) |
| ----- | ------------------------------- | ----- | ------------------------ | --------------------- | ------------------------ |
| z-sdk | `d0d9de1d3af0e75a9f5d7d7b4c2b4d3762beb90c` | **presente** (233 ficheros; VISION/BACKLOG/DECISIONES/PRACTICAS/REPORTES/roles) | `@alephscript/skills-scriptorium`: `0.x` | lock **0.3.4** (registry canal) | `z_sdk` (declarada; crear bajo GO si falta) |
| g-sdk | `d1783646f4364fce49ae9b421c863bc51bfad4aa` | **parcial** (5 ficheros: README/PRACTICAS/REPORTES; sin VISION/BACKLOG/DECISIONES) | **ausente** | n/a | `g_sdk` (declarada; crear bajo GO si falta) |
| s-sdk | `7db1d4941267d857d93ab4005dcc4ecd0e49ecfb` | **presente** (486 ficheros; gobierno + SPRINTS + REPORTES) | `@alephscript/skills-scriptorium`: `0.x` | lock **0.4.0** (registry canal) | `s_sdk` (canonica; legado remoto `script_sdk-*` — no volcar) |
| e-sdk | `90e53544e8b78722ec8e22230740bfa107fa2cc8` | **presente** (8 ficheros; VISION/BACKLOG/DECISIONES/PRACTICAS/REPORTES/roles) | **ausente** (sin package.json) | n/a | `e_sdk` (declarada; crear bajo GO si falta) |
| o-sdk | `632ee2a2bbb10a19efbc57b2f0a847dd04333ff9` | **ausente** (sin plan/ en tip; F3a: no excavar) | `@alephscript/skills-scriptorium`: `0.x` | lock **0.3.4** (registry canal) | `o_sdk` (existe; tip `cd4175a`) |
| a-sdk | `e5573f8e5b248aff6e19aee5cd51b0fe7b086c1b` | **presente** (12 ficheros; VISION/BACKLOG/DECISIONES/PRACTICAS/REPORTES/roles) | **ausente** | n/a | `a_sdk` (declarada; nests F3a → forense, no excavacion) |

## Método (categoría · sin letra · no es un mundo)

| dato | valor |
| ---- | ----- |
| submodule | `codebase/skills-library` |
| tip gitlink | `fb980984e5faa979247afa43054e52cfd4e07c3e` |
| versión | `@alephscript/skills-scriptorium@0.7.0` (publish pin) |
| rol | fuente del método en paquete; bumps = GO (como todo gitlink) · DA-S11 |
| remoto | `alephscriptorium-eng/S_SDK-skills-library` |

## Workspace (carril S · no es un sdk)

| dato | valor |
| ---- | ----- |
| pin | `@alephscript/skills-scriptorium@0.6.1` (package.json · bump OLA 0 → 0.7.0) |
| resuelta | lock **0.6.1** · npm view canal `https://npm.scriptorium.escrivivir.co` → **0.7.0** (= latest) |
| plan/ | presente (gobierno del carril) |
| cuadernos vigia | `scriptorium-vigilancia` @ `03f09a9` (BACKSTAGE_GIT) |

## skills@latest (documentar · sin bump mundos)

| sujeto | pin | resuelta / latest canal | accion |
| ------ | --- | ----------------------- | ------ |
| workspace scriptorium | `0.6.1` | latest canal **0.7.0** | OLA 0 (= este GO) |
| z-sdk | `0.x` | lock 0.3.4 · latest 0.7.0 | **sin bump** (ola 1+ · tras PASS R18-S) |
| s-sdk | `0.x` | lock 0.4.0 · latest 0.7.0 | **sin bump** (ola 1+) |
| o-sdk | `0.x` | lock 0.3.4 · latest 0.7.0 | **EXCLUIDO** (F3) |
| g-sdk / e-sdk / a-sdk | ausente | n/a | ola 1+ · tras PASS R18-S |

## Cero historico perdido

- Inventario arriba = evidencia de lectura; **ningun** plan/ de sdk fue
  borrado ni modificado en IB-20.
- Destino de archivo/historico de gobierno hermano = ramas en
  `scriptorium-cuadernos` (columna cuadernos). Volcado crudo al repo
  publico = **veto**.
- o-sdk sin plan/ en tip: estado **ausente** documentado; no se inventa
  ni se excava (F3a / DA-S04).

## Relacion

- Particion de territorios: `plan/PARTICION.md`
- Convivencia: skill `convivencia-multi-orquestador.md` (contrato v1.1 /
  metodo v0.6) — citar, no reescribir
- Estacion / BACKSTAGE: `plan/ESTACION.md`
