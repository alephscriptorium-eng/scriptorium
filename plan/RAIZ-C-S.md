# RAIZ-C-S — mapa canónico de `C:\S`

| dato | valor |
| ---- | ----- |
| Territorio | `C:\S` (raíz compartida del carril S) |
| Canónico | este fichero (`plan/RAIZ-C-S.md` en repo `scriptorium`) |
| Copia-release FS | `C:\S\README.md` (fuera de git; cabecera de procedencia) |
| Fecha asiento | 2026-07-23 · gobierno post-R15-S · arco librería 0.7.0 |

## Mapa de la raíz (entradas declaradas)

| path | rol | declarado por |
| ---- | --- | ------------- |
| `scriptorium/` | mundo índice · `MUNDO_RAIZ` · repo público | IB-10 · VISION |
| `vigilancia/` | `OUT_DIR` estación Vigilante-S (fuera de git público) | DA-S07 · ESTACION |
| `_fuentes/` | checkouts de lectura/fuente (p.ej. cuadernos) | IB-01 / gobierno |
| `.worktrees/` | `WORKTREE_BASE` de obra del carril S | ESTACION · PRACTICAS |
| `LLM.md` | broche acuerdo agentes (fuera de git) | IB-23 · `plan/BROCHE-C-S.md` |
| `README.md` | copia-release de **este** mapa (fuera de git) | este asiento |

> **Retoque R15-S:** el checkout de obra de la librería **ya no** vive
> en `C:\S` (borrado por custodio · veredicto desechable R12/R14 ·
> corrección de registro en `INFORME-VIGIA-R15-S.md`). Obra de librería
> = **checkout NUEVO** en `C:\S_LAB\S_SDK-skills-library` (brief 0.7.0).
> `C:\S` = **atlas puro**.

Cualquier otra entrada en `C:\S\` **no** está en el mapa = residuo o
obra sin declarar.

## REGLA DE LA RAÍZ

1. **Nada nuevo sin declaración.** Crear path bajo `C:\S\` exige asiento
   en este mapa (o enmienda GO) **antes** o en el mismo acto de gobierno.
2. **Toda obra declara checkouts en su brief.** Si el WP escribe en repo
   externo / hermano / librería, el brief nombra la ruta FS del checkout
   de obra (lección · checkout declarado · 3 casos).
3. **Canónico en git; README raíz = copia-release.** El mapa vive aquí;
   `C:\S\README.md` se regenera desde este fichero (patrón broche /
   copia-release con cabecera de procedencia). No al revés.
4. **Cero borrados sin veredicto desechable + acta.** Residuos de obra
   se barrean con acta en `plan/REPORTES/`; no se asume limpieza silenciosa.
5. **Re-chequeo vigía:** tras gobierno de raíz, la raíz FS debe igualar
   este mapa — **ni una entrada más**.

## Relación

- Estación / OUT_DIR: `plan/ESTACION.md`
- Broche LLM: `plan/BROCHE-C-S.md`
- Inventario mundos: `plan/MUNDOS.md`
- Partición: `plan/PARTICION.md`
- Taller de obra (S_LAB): `plan/S-LAB.md` · DA-S15
- Acta barrido residuo #3 + bootstrap génesis:
  `plan/REPORTES/ACTA-RAIZ-barrido-residuo-3-2026-07-22.md`
