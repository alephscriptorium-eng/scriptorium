# MUNDOS — mapa de holones del workspace (carril S)

Inventario IB-20 (2026-07-22). **Solo lectura** de `codebase/*-sdk`.
Cero edits en submodules · cero bump de gitlinks en este WP.
Fuente de partición: `plan/PARTICION.md`. Protocolo: skill
`swarm-orquestacion/reference/convivencia-multi-orquestador.md`
(contrato v1.1 / método v0.6) — citar, no reescribir.

Registry canal real (workspace): `https://npm.scriptorium.escrivivir.co`
· `npm view @alephscript/skills-scriptorium version` → **`0.5.1`**
(evidencia IB-20). Pin del workspace (`package.json` devDependency):
**`0.5.1`**.

## Tabla de mundos

| mundo | path | tip gitlink (`git ls-tree HEAD`) | plan/ | skill pin (package.json) | skill resuelta local | cuadernos (rama destino) |
| ----- | ---- | --------------------------------- | ----- | ------------------------ | -------------------- | ------------------------ |
| z-sdk | `codebase/z-sdk` | `d0d9de1d3af0e75a9f5d7d7b4c2b4d3762beb90c` | **presente** (233 ficheros) | rango `0.x` | no instalada (`node_modules` ausente) | `scriptorium-cuadernos` · `z_sdk` (declarada; crear al primer volcado) |
| g-sdk | `codebase/g-sdk` | `d1783646f4364fce49ae9b421c863bc51bfad4aa` | **presente** (5 ficheros) | **ausente** | ausente | `scriptorium-cuadernos` · `g_sdk` (declarada) |
| s-sdk | `codebase/s-sdk` | `7db1d4941267d857d93ab4005dcc4ecd0e49ecfb` | **presente** (486 ficheros) | rango `0.x` | no instalada | `scriptorium-cuadernos` · histórico en `script_sdk-addenda` / `script_sdk-vigilancia`; destino canónico de mundo `s_sdk` si hace falta |
| e-sdk | `codebase/e-sdk` | `90e53544e8b78722ec8e22230740bfa107fa2cc8` | **presente** (plan + roles/REPORTES) | **ausente** (sin `package.json`) | ausente | `scriptorium-cuadernos` · `e_sdk` (declarada; DA-S03) |
| o-sdk | `codebase/o-sdk` | `632ee2a2bbb10a19efbc57b2f0a847dd04333ff9` | **ausente** | rango `0.x` | no instalada | `scriptorium-cuadernos` · `o_sdk` (**existe**; IB-01) |
| a-sdk | `codebase/a-sdk` | `e5573f8e5b248aff6e19aee5cd51b0fe7b086c1b` | **presente** (12 ficheros) | **ausente** | ausente | `scriptorium-cuadernos` · `a_sdk` (declarada; nests §F3a = forense) |

## skills@latest (documentar; sin bump)

| ámbito | evidencia | acción IB-20 |
| ------ | --------- | ------------ |
| registry | `npm view … version` → `0.5.1` | documentado |
| workspace | pin `0.5.1` | intacto |
| z/s/o-sdk | dep `0.x` en package.json | **no** bump masivo (PORT; GO propio) |
| g/e/a-sdk | sin dep skill | hallazgo → cola / WP de su carril; no forzar aquí |

## Histórico → cuadernos (cero pérdida)

- **No se borró** ningún `plan/` de sdk en este WP (solo lectura).
- Destino canónico de histórico / untracked / caras §interna:
  repo privado `scriptorium-cuadernos`, **rama por mundo** (tabla).
- Backstage vigía del carril S: rama `scriptorium-vigilancia`
  (tip ack R5-S `03f09a96f2c319bc57b366f3479e1462e246b882`) — canal
  Vigilante-S (`plan/ESTACION.md`), no histórico de sdk.
- Volcado crudo al repo público: **prohibido**.

## Hallazgos (no excavados aquí)

1. **o-sdk sin `plan/`** en tip pin — esperado post-fresh-start §F3a;
   gobierno vive en workspace + cuadernos `o_sdk`. Cero excavación.
2. **e-sdk sin `package.json`** — `plan/` presente; skill ausente.
   WP futuro de su carril si se pinna skill.
3. **g-sdk / a-sdk sin dep skill** — documentado; bump = GO propio.
4. **nests a-sdk** — §F3a forense; cero arqueología en IB-20.

## Relación

- Partición de obra/gobierno: `plan/PARTICION.md`
- Estación / BACKSTAGE_GIT: `plan/ESTACION.md`
- Doctrina L1/L2 y candados: `plan/VISION.md`
