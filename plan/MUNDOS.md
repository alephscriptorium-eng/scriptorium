# MUNDOS — inventario de holones (carril S · IB-20)

Fuente de lectura: tips gitlink en `MUNDO_RAIZ` (`C:\S\scriptorium`) via
`git rev-parse HEAD:codebase/<letra>-sdk`. Bumps de gitlink = **GO**
(DA-S11). Cuadernos = repo privado `scriptorium-cuadernos` (fuera del
publico). Punteros abajo = destino rama-por-mundo; **no** se vuelca
historico crudo aqui. BACKSTAGE del vigia: rama `scriptorium-vigilancia`
(ver `plan/ESTACION.md`).

## Tabla de mundos

| mundo | tip gitlink (HEAD:codebase/...) | plan/ | skill pin | espejo (DA-S19) | cuadernos (rama destino) |
| ----- | ------------------------------- | ----- | --------- | --------------- | ------------------------ |
| z-sdk | `aa368b62d911b8dedc82a8af1a0a9d9315a35712` | **presente** (ESTACION declara política) | `0.8.0` | **canon** · gitignore | `z_sdk` |
| g-sdk | `29e6f03797d77c2b9a82e908cbeceb98d20e9f13` | **presente** (mínimo + ESTACION) | `0.8.0` | **desviación auditable** · trackeado | `g_sdk` |
| s-sdk | `955a8293fa5ccddaed6559597cd22c769f0359d5` | **presente** | `0.8.0` | **desviación auditable** · trackeado | `s_sdk` |
| e-sdk | `ef7b307602da87d8be5b8140eeb204afec16eca4` | **presente** | `0.8.0` | **desviación auditable** · trackeado | `e_sdk` |
| o-sdk | `632ee2a2bbb10a19efbc57b2f0a847dd04333ff9` | **ausente** (F3a: no excavar) | `0.x` / lock 0.3.4 | n/a (EXCLUIDO F3) | `o_sdk` (existe; tip `cd4175a`) |
| a-sdk | `35fd75463fe3ad58c4e9d51a81fda35da02c4ba8` | **presente** (ESTACION declara política) | `0.8.0` | **desviación auditable** · trackeado | `a_sdk` |

Rama pin a-sdk (`.gitmodules`): `integration/beta/scriptorium`.
Tips z·g·s·e·a = `origin` post consumo **0.8.0** (GO R23-S PASS ·
2026-07-23). o-sdk EXCLUIDO (F3) · tip intacto.

## Política de espejo (DA-S19 · por mundo · PORT)

| mundo | política | por qué legal |
| ----- | -------- | ------------- |
| z | gitignora `.claude/` · regenera con `skills:sync` | **canon** del guide |
| g / s / e / a | committean `.claude/skills/` | **desviación auditable** de scriptorium |

**No unificar a la fuerza.** Cada mundo declara en SU `plan/ESTACION.md`.

## Método (categoría · sin letra · no es un mundo)

| dato | valor |
| ---- | ----- |
| submodule | `codebase/skills-library` |
| tip gitlink | `cc59e4e6ed1aa4fa3848dccaedd2bc02c6d3c6da` |
| versión | `@alephscript/skills-scriptorium@0.8.0` (publish pin) |
| rol | fuente del método en paquete; bumps = GO (como todo gitlink) · DA-S11 |
| remoto | `alephscriptorium-eng/S_SDK-skills-library` |

## Workspace (carril S · no es un sdk)

| dato | valor |
| ---- | ----- |
| pin | `@alephscript/skills-scriptorium@0.8.0` (package.json) |
| resuelta | lock **0.8.0** · npm view canal `https://npm.scriptorium.escrivivir.co` → **0.8.0** (= latest) |
| plan/ | presente (gobierno del carril) |
| pulso mapa | Vigilante-S adopta `verificar-territorio-mapa.sh` (ESTACION) |
| cuadernos vigia | `scriptorium-vigilancia` @ `03f09a9` (BACKSTAGE_GIT) |

## skills@latest (post GO consumo 0.8.0 + gitlinks)

| sujeto | pin | tip gitlink atlas | accion |
| ------ | --- | ----------------- | ------ |
| workspace scriptorium | `0.8.0` | n/a | consumo 0.8.0 + pulso mapa |
| z-sdk | `0.8.0` | `aa368b62d911b8dedc82a8af1a0a9d9315a35712` | consumo · gitlink bumpeado (GO) |
| g-sdk | `0.8.0` | `29e6f03797d77c2b9a82e908cbeceb98d20e9f13` | consumo · gitlink bumpeado (GO) |
| s-sdk | `0.8.0` | `955a8293fa5ccddaed6559597cd22c769f0359d5` | consumo · gitlink bumpeado (GO) |
| e-sdk | `0.8.0` | `ef7b307602da87d8be5b8140eeb204afec16eca4` | consumo · gitlink bumpeado (GO) |
| a-sdk | `0.8.0` | `35fd75463fe3ad58c4e9d51a81fda35da02c4ba8` | consumo · gitlink bumpeado (GO) |
| o-sdk | `0.x` | `632ee2a2bbb10a19efbc57b2f0a847dd04333ff9` | **EXCLUIDO** (F3) · tip intacto |
| skills-library | `0.8.0` | `cc59e4e6ed1aa4fa3848dccaedd2bc02c6d3c6da` | pin 0.8.0 · bump GO DA-S11 |

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
- Política espejo: `plan/DECISIONES.md` · DA-S19
