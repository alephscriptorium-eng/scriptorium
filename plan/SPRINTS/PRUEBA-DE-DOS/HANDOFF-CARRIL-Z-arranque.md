# HANDOFF · arranque del carril Z (ventana nueva)

Hoja de apertura preparada por el orquestador-S (2026-07-23, sprint
PRUEBA-DE-DOS). El custodio abre la ventana; el carril Z arranca
leyendo esto y su propio plan.

## Identidad

| campo | valor |
| ----- | ----- |
| ventana | carril Z (mundo zeus) |
| territorio de obra | el que defina **su propio plan** (el del mundo Z) |
| gitlink del atlas | `codebase/z-sdk` — **SOLO LECTURA** desde S; bump = GO custodio (DA-S11) |

## Mandato del custodio (2026-07-23) — dos frentes

### (a) ts-compat — paquetes `@zeus/*` consumibles desde TypeScript

Semilla: cuaderno privado del vigía «ADDENDA · Vigilante-S · semilla
carril Z · compat TypeScript · 2026-07-22» (se cita por título; no se
copia al repo). Resumen en palabras del orquestador:

- **Problema**: un consumidor TypeScript que instala `@zeus/*` desde el
  registry no obtiene tipado utilizable — los subpaths exportados de
  los paquetes no declaran condición de tipos y faltan declaraciones
  `.d.ts` en varios kits; piezas clave (p. ej. peer-card-seat) llegan
  como `any`.
- **Dirección esbozada** (a validar por este carril): (1) declarar la
  condición de tipos en los subpaths de los cinco paquetes, empezando
  por peer-card-seat; (2) generar `.d.ts` para los kits restantes;
  (3) ampliar el smoke de consumidor externo para compilar TS desde el
  registry. Acta final: el consumidor TS compila con tipado real
  (no `any`) y el smoke queda en CI.

La ventana **parte de esa semilla** (la porta, no la reinventa) e
investiga y planifica en SU plan.

### (b) extracción mcp-core-sdk — cortar la dependencia cruzada

Origen del mandato: hallazgo npmrc dual-scope del sprint
PRUEBA-DE-DOS (ver `NOTA-CARRIL-Z-npmrc-scopes.md`, mismo directorio).
`@zeus/socket-server` arrastra `@alephscript/mcp-core-sdk` del registry
privado y obliga a los consumidores a declarar dos scopes.

Mandato: crear un **paquete nuevo propio** del mundo Z con lo que
`@zeus/*` (hoy: `socket-server`) usa de `@alephscript/mcp-core-sdk`,
y cortar esa dependencia cruzada.

## Primera acción sugerida

Investigar ambos frentes y devolver un **plan propio con estimación**.
Los gates van en su propio carril (`Rn-Z`), pedidos por AVISO en su
plan — no en el gobierno S.
