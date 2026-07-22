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
| z-sdk | `f295dc9b0604f9786046391070572eb4c99a99ad` | **presente** (ESTACION declara política) | `0.7.0` | **canon** · gitignore | `z_sdk` |
| g-sdk | `e139b850ca932dab79ba0ea4abaf1372bd6db8f4` | **presente** (mínimo + ESTACION) | `0.7.0` | **desviación auditable** · trackeado | `g_sdk` |
| s-sdk | `d2378b695f54c578af022422db0a54ed32635a29` | **presente** | `0.7.0` | **desviación auditable** · trackeado | `s_sdk` |
| e-sdk | `13da04c19b30344eda72f981c014d7c7218c5ad6` | **presente** | `0.7.0` | **desviación auditable** · trackeado | `e_sdk` |
| o-sdk | `632ee2a2bbb10a19efbc57b2f0a847dd04333ff9` | **ausente** (F3a: no excavar) | `0.x` / lock 0.3.4 | n/a (EXCLUIDO F3) | `o_sdk` (existe; tip `cd4175a`) |
| a-sdk | `792e093c122b09fd5fc559d6f4773d780b280b24` | **presente** (ESTACION declara política) | `0.7.0` | **desviación auditable** · trackeado | `a_sdk` |

Rama pin a-sdk (`.gitmodules`): `integration/beta/scriptorium`.
Tips z·g·s·e = `origin/main` post olas 1+. Tip a = post asiento DA-S19
(política espejo; tip ola era `3afdf96…`).

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
| tip gitlink | `fb980984e5faa979247afa43054e52cfd4e07c3e` |
| versión | `@alephscript/skills-scriptorium@0.7.0` (publish pin) |
| rol | fuente del método en paquete; bumps = GO (como todo gitlink) · DA-S11 |
| remoto | `alephscriptorium-eng/S_SDK-skills-library` |

## Workspace (carril S · no es un sdk)

| dato | valor |
| ---- | ----- |
| pin | `@alephscript/skills-scriptorium@0.7.0` (package.json) |
| resuelta | lock **0.7.0** · npm view canal `https://npm.scriptorium.escrivivir.co` → **0.7.0** (= latest) |
| plan/ | presente (gobierno del carril) |
| cuadernos vigia | `scriptorium-vigilancia` @ `03f09a9` (BACKSTAGE_GIT) |

## skills@latest (post GO bump gitlinks z·g·s·e·a)

| sujeto | pin | tip gitlink atlas | accion |
| ------ | --- | ----------------- | ------ |
| workspace scriptorium | `0.7.0` | n/a | OLA 0 hecha |
| z-sdk | `0.7.0` | `f295dc9b0604f9786046391070572eb4c99a99ad` | ola 1+ · gitlink bumpeado (GO) |
| g-sdk | `0.7.0` | `e139b850ca932dab79ba0ea4abaf1372bd6db8f4` | ola 1+ · gitlink bumpeado (GO) |
| s-sdk | `0.7.0` | `d2378b695f54c578af022422db0a54ed32635a29` | ola 1+ · gitlink bumpeado (GO) |
| e-sdk | `0.7.0` | `13da04c19b30344eda72f981c014d7c7218c5ad6` | ola 1+ · gitlink bumpeado (GO) |
| a-sdk | `0.7.0` | `792e093c122b09fd5fc559d6f4773d780b280b24` | ola 1+ + asiento espejo · gitlink bumpeado (GO) |
| o-sdk | `0.x` | `632ee2a2bbb10a19efbc57b2f0a847dd04333ff9` | **EXCLUIDO** (F3) · tip intacto |
| skills-library | `0.7.0` | `fb980984e5faa979247afa43054e52cfd4e07c3e` | pin 0.7.0 · **no** tocado en este GO |

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
