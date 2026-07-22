# BROCHE · raíz `C:\S` · LLM.md (IB-23)

| dato | valor |
| ---- | ----- |
| WP | IB-23 · DA-S09 |
| Fecha | 2026-07-22 |
| Artefacto FS (fuera de git) | `C:\S\LLM.md` |
| Origen (lectura) | `codebase/s-sdk/LLM.md` @ gitlink `7db1d4941267d857d93ab4005dcc4ecd0e49ecfb` |
| Handoff | `plan/HANDOFF-IB-23-limpieza-final-s-sdk.md` |

## Propósito

El backlog INITIAL-BASE pide portar el acuerdo `LLM.md` a broche en la
raíz compartida `C:\S` (fuera del repo público). Este fichero es el
**puntero trazado en git**: el broche no vive solo en FS.

## Contenido del broche

Copia del acuerdo de trabajo para agentes (memoria→codebase · lengua ·
voz · no inventar observaciones). En el broche de raíz, la cita al
método apunta al workspace vivo:

- Gobierno carril S: `C:\S\scriptorium\plan\`
- Método holones (legado, lectura): `C:\S\scriptorium\codebase\s-sdk\DEVOPS\METODOLOGIA\HOLONES.md`
- Skill: `@alephscript/skills-scriptorium` (nombre completo; el alias
  corto no existe en el registry)

## Verificación

```text
Test-Path C:\S\LLM.md  → True (tras materializar IB-23)
Test-Path C:\S\scriptorium\plan\BROCHE-C-S.md → True (este fichero)
```

## Relación con borrado en s-sdk

El borrado de `codebase/s-sdk/LLM.md` **no** lo hace IB-23. Queda al
carril dueño con acta (ver `REPORTES/IB-23-ACTA-candidatos-desechables.md`
elemento 7).
