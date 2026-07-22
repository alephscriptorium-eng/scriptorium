# S_LAB — taller de la constelación (raíz de obra por carril)

| dato | valor |
| ---- | ----- |
| Territorio | `C:\S_LAB` |
| Canónico | este fichero (`plan/S-LAB.md` en repo `scriptorium`) |
| Copia-release FS | `C:\S_LAB\README.md` (fuera de git; cabecera de procedencia) |
| Fecha asiento | 2026-07-23 · gobierno post-R15-S · arco librería 0.7.0 |
| Fuente | addenda Vigilante-S · fundación S-LAB · mapa provisional |

**Decisión del custodio (2026-07-22):** toda obra de los mundos x-sdk
vive aquí, en checkouts frescos por mundo — nunca dentro de los
submodules del atlas (`C:\S\scriptorium\codebase\*`, SOLO LECTURA).
El atlas apunta (gitlinks, bump con GO); el LAB construye.

## Mapa

| entrada | rol | remoto | HEAD al fundar / pin |
| ------- | --- | ------ | -------------------- |
| `z-sdk/` | mundo zeus (carril Z) | alephscriptorium-eng/Z_SDK | `d0d9de1` |
| `g-sdk/` | juego ciudad / games library | alephscriptorium-eng/Z_SDK-games-library | `d178364` |
| `s-sdk/` | techy-devops (mundo legado) | alephscriptorium-eng/S_SDK | `7db1d49` |
| `e-sdk/` | mundo de papel (editorial) | alephscriptorium-eng/E_SDK | `90e5354` |
| `o-sdk/` | puerto L2→L1 (§F3a: cero arqueología) | alephscriptorium-eng/O_SDK | `632ee2a` |
| `a-sdk/` | el scriptorium (atril) | escrivivir-co/aleph-scriptorium | `e5573f8` |
| `.worktrees/<letra>/` | worktrees de obra del carril de esa letra | — | — |
| `vigilancia/<letra>/` | OUT_DIR de la estación del vigía de esa letra | — | — |
| `skills-library/` | checkout de obra de la librería del método · **clone materializado** (rename custodio post-R16-S; viejo `S_SDK-skills-library` ya no aplica) | alephscriptorium-eng/S_SDK-skills-library | tip atlas `64883a9` · path exacto `C:\S_LAB\skills-library` |

## Regla del LAB

1. **Una raíz, muchos carriles, cero mezcla**: cada carril trabaja SOLO
   en su `<letra>-sdk/`, sus `.worktrees/<letra>/` y su
   `vigilancia/<letra>/`. Un worktree por rol.
2. **Nada nuevo en esta raíz sin declararlo en este mapa** (regla
   heredada de la raíz `C:\S`). Checkout extra (p. ej. la librería del
   método para WPs de librería) → se declara aquí y en su brief.
3. Los gitlinks del atlas (`C:\S\scriptorium\codebase\*`) son SOLO
   LECTURA y se bumpean únicamente por gobierno S con GO (DA-S11).
4. Vetos transversales: cero force · cero borrados sin veredicto
   desechable · o-sdk §F3a · network-sdk solo remote epsylon ·
   PORT, NO REWRITE.
5. Plantilla de carril nuevo: WORLD_ROOT = `C:\S_LAB\<letra>-sdk` ·
   OUT_DIR = `C:\S_LAB\vigilancia\<letra>` · WORKTREE_BASE =
   `C:\S_LAB\.worktrees\<letra>` · backstage = cuadernos rama
   `<letra>_sdk-vigilancia` (worktree propio) · rondas `Rn-<letra>`.

## Checkout librería · brief 0.7.0 (materializado)

| dato | valor |
| ---- | ----- |
| Path exacto | **`C:\S_LAB\skills-library`** |
| Modo | **clone materializado** — rename custodio post-R16-S; path viejo `S_SDK-skills-library` **ya no aplica**; el checkout en `C:\S` fue borrado (no move) |
| Bloqueo handle | **extinguido** (no aplica) |
| Declarado por | brief `SPRINTS/LIBRERIA-0.7.0/BRIEFS/LIB-070.md` · 🔶 LIB-070 · GO 2026-07-23 |
| Doctrina | `C:\S` = atlas; `C:\S_LAB` = taller de obra |

## Relación

- Atlas raíz: `plan/RAIZ-C-S.md`
- Partición: `plan/PARTICION.md`
- Addenda fuente: `_fuentes/cuadernos-vigia-S/ADDENDA-VIGILANTE-S-fundacion-S-LAB-2026-07-22.md`
- DA: `plan/DECISIONES.md` · DA-S15
