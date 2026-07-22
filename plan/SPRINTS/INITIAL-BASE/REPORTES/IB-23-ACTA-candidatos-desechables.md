# ACTA · candidatos desechables · IB-23 (handoff · no ejecutado)

| dato | valor |
| ---- | ----- |
| WP | IB-23 |
| Vía | DA-S09 (a) handoff |
| Ejecución de borrados | **NO** — carril S no borra en hermano |
| Quién puede borrar | carril dueño s-sdk, **POR ELEMENTO**, con acta propia |

> Esta acta documenta el **inventario y el veredicto propuesto** que el
> dueño debe revalidar. No autoriza al worker S a borrar. Cada borrado
> real exige veredicto desechable vinculante del dueño antes de
> ejecutarlo.

## Elemento 1 · árbol `WEBS/`

| campo | valor |
| ----- | ----- |
| Objeto | `codebase/s-sdk/WEBS/` (11 paths tracked) |
| Tip s-sdk | `7db1d4941267d857d93ab4005dcc4ecd0e49ecfb` |
| Veredicto propuesto (para dueño) | **CANDIDATO DESECHABLE** (subsumido por site-web workspace) |
| Motivo | Site-web overall canónico = `docs/` → `aleph-null.escrivivir.co` (DA-S02 · IB-13). `WEBS/README.md` se declara instancia de capa hacia portal s-sdk; no es el canal vivo del workspace. |
| Destino | archivo opcional en cuadernos `s_sdk` si el dueño quiere conservar copy; si no, borrado con acta dueño |
| Ejecutado por S | **no** |

Inventario tracked:

```text
WEBS/README.md
WEBS/BASE-1-ARGUMENTO.md
WEBS/BASE-2-SISTEMA.md
WEBS/BASE-3-MECANISMO.md
WEBS/CALIBRACION.md
WEBS/CANTERA/00-contexto.md
WEBS/CANTERA/01-inventario-superficies.md
WEBS/ENTREGA-CAPA-1/00-NOTA.md
WEBS/ENTREGA-CAPA-1/01-PAQUETE.md
WEBS/ENTREGA-I31/00-NOTA.md
WEBS/ENTREGA-I31/01-PAQUETE.md
```

## Elemento 2 · `HOLONES/01-mythos/games-library` (gitlink)

| campo | valor |
| ----- | ----- |
| Objeto | gitlink 160000 → `d1783646f4364fce49ae9b421c863bc51bfad4aa` |
| Veredicto propuesto | **CANDIDATO DESECHABLE** (path largo / anidado) |
| Motivo | Duplica el tip canónico `codebase/g-sdk` del workspace; HOLONES anidados = paths largos vetados por diseño IB-23 |
| Ejecutado por S | **no** |
| Nota | Retirar el gitlink anidado ≠ bump del gitlink workspace |

## Elemento 3 · `HOLONES/01-mythos/zeus-sdk` (gitlink)

| campo | valor |
| ----- | ----- |
| Objeto | gitlink 160000 → `d0d9de1d3af0e75a9f5d7d7b4c2b4d3762beb90c` |
| Veredicto propuesto | **CANDIDATO DESECHABLE** (path largo / anidado) |
| Motivo | Duplica el tip canónico `codebase/z-sdk` del workspace |
| Ejecutado por S | **no** |

## Elemento 4 · `HOLONES/03-emmanuel/README.md`

| campo | valor |
| ----- | ----- |
| Objeto | README de ruta reservada |
| Veredicto propuesto | **CANDIDATO DESECHABLE** (path largo; sin obra) |
| Motivo | Solo asiento/reserva; holones viven como submodules `codebase/*-sdk` |
| Ejecutado por S | **no** |

## Elemento 5 · `HOLONES/05-aleph-scriptorium/README.md`

| campo | valor |
| ----- | ----- |
| Objeto | README reserva DE-I8 (sin submodule add) |
| Veredicto propuesto | **CANDIDATO DESECHABLE** |
| Motivo | Ruta reservada; destino previsto era remoto por decidir — canónico = `codebase/a-sdk` |
| Ejecutado por S | **no** |

## Elemento 6 · `HOLONES/06-aleph-scriptorium/README.md`

| campo | valor |
| ----- | ----- |
| Objeto | README reserva |
| Veredicto propuesto | **CANDIDATO DESECHABLE** |
| Motivo | Idem elemento 5 (duplicado de reserva) |
| Ejecutado por S | **no** |

## Elemento 7 · `LLM.md` (en s-sdk)

| campo | valor |
| ----- | ----- |
| Objeto | `codebase/s-sdk/LLM.md` |
| Veredicto propuesto | **CANDIDATO DESECHABLE solo tras broche** |
| Motivo | Acuerdo portado a broche `C:\S\LLM.md` + puntero `plan/BROCHE-C-S.md` |
| Condición previa al borrado | dueño confirma broche + puntero; entonces acta propia |
| Ejecutado por S | **no** (S solo materializó broche FS + puntero) |

## Resumen

| # | elemento | borrado por S |
| - | -------- | ------------- |
| 1–7 | todos | **no** |

Regla vinculante para el dueño: **nada borrado sin veredicto
desechable por elemento (acta)**. Tras borrados que afecten webs,
C8 = curl/navegar canal real (no fingir).
