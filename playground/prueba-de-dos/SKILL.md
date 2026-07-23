---
name: prueba-de-dos
description: >-
  Starter kit reproducible de la «prueba de dos»: dos ventanas-operador
  (H = A · M = B) entran a una room del nodo rooms con el stack @zeus y
  validan la experiencia — no el cableado. Incluye manual, dos handoff.md,
  generador `npm run generate A_B` (carpetas H y M npm-inicializadas con su
  stack) y submanual de identidad (peercard: tenerla, pedirla, o anónimo).
---

# Skill · prueba-de-dos

Boilerplate del playground del índice para **recrear** la carpeta
`playground/prueba-de-dos` desde cero y correr la prueba con dos
operadores. El criterio no es «juntar cuatro cables y ya»: es **validar
la experiencia** de dos peers conviviendo en la misma room.

## Cuándo aplicar

1. Recrear la prueba en un checkout limpio (este kit es la fuente).
2. Onboardear a un operador nuevo en una de las dos ventanas (H o M).
3. Resolver la identidad de un peer antes de entrar al nodo rooms
   (`reference/PEERCARD.md`).

## Contenido del kit

| pieza | rol |
| ----- | --- |
| `manual.md` | Manual de la prueba: recrear, correr, validar |
| `handoffs/handoff-H.md` | Plantilla handoff del operador A (ventana H) |
| `handoffs/handoff-M.md` | Plantilla handoff del operador B (ventana M) |
| `scripts/generar.mjs` | Generador: crea `H/` (A) y `M/` (B) con su stack |
| `reference/PEERCARD.md` | Submanual identidad: peercard u anonimato (spike) |
| `package.json` · `.npmrc` | `npm run generate A_B` + registry `@zeus` |

## Uso

```bash
npm run generate A_B    # crea H/ (A) y M/ (B), npm-inicializadas con su stack
npm run generate A_B -- --sin-install   # solo ficheros, sin npm install
```

`H/` y `M/` son **regenerables** y no entran a git (ver `.gitignore`);
el kit —manual, handoffs, generador, submanual— sí.

## Regla de la prueba

Prueba superada = **experiencia validada por ambos operadores** (cada uno
deja su registro en su `handoff.md`), no procesos que arrancan. Los
criterios viven en `manual.md` §Validación.
