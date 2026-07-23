# NOTA · al carril Z (dueño de `@zeus/socket-server`) — npmrc dual scope

Nota formal tipo handoff (patrón DA-S08/S09: preparar la nota al carril
dueño sin escribir fuera del workspace). **Carril Z aparcado — cero
acción esperada ahora.** Esta nota solo deja la piedra señalizada.

| campo | valor |
| ----- | ----- |
| fecha del hallazgo | 2026-07-23 (sprint PRUEBA-DE-DOS, smoke PD-01) |
| pieza afectada | `@zeus/socket-server` |
| registry | `https://npm.scriptorium.escrivivir.co` |

## Síntoma

`npm install` limpio con un `.npmrc` solo-`@zeus` falla con **E404**
sobre `@alephscript/mcp-core-sdk`.

## Causa

`@zeus/socket-server` arrastra la dependencia transitiva
`@alephscript/mcp-core-sdk`, alojada en el registry privado, sin que el
scope `@alephscript` esté documentado para los consumidores.

## Ya mitigado (lado consumidor)

El `.npmrc` del kit `playground/prueba-de-dos/` declara **dual scope**
(`@zeus` + `@alephscript`); commiteado en este sprint.

## Opciones de arreglo de raíz (se proponen, no se imponen)

- Publicar o aliasar `mcp-core-sdk` bajo el scope `@zeus`.
- Documentar el requisito de dual scope en la guía / portal del paquete.

La elección queda para el dueño del carril Z cuando se desaparque.

## Actualización 2026-07-23 (custodio)

El «cero acción esperada» de arriba queda **superseded**: el custodio
encarga la vía de extracción — paquete nuevo propio del carril Z que
corta la dependencia con `@alephscript/mcp-core-sdk`. Ver
`HANDOFF-CARRIL-Z-arranque.md` (mismo directorio).
