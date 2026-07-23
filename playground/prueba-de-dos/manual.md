# Manual · prueba de dos

Dos ventanas-operador — **Human** (operador A) y **Machine** (operador B) — entran
a la misma room de un nodo rooms con el stack `@zeus` y **validan la
experiencia**. Redefinición 2026-07-23: el cableado previo (H
inicializada a mano) constó por bueno, pero la prueba ya no es cablear;
es vivirla de punta a punta y dejarlo registrado.

## 1. Requisitos

- Node `>=22` (engine del workspace).
- Alcance al registry `https://npm.scriptorium.escrivivir.co`
  (scopes `@zeus` **y** `@alephscript` — dep transitiva de
  `socket-server`; los fija el `.npmrc` del kit y de cada carpeta
  generada).
- Dos ventanas de operador (humano o agente), una por carpeta.
- Un nodo rooms alcanzable — o levantarlo en local (handoff-H).

## 2. Recrear la carpeta

Desde `playground/prueba-de-dos/`:

```bash
npm run generate A_B
```

El generador crea:

| carpeta | ventana | operador | contenido |
| ------- | ------- | -------- | --------- |
| `H/` | **Human** | A | `package.json` con el stack, `.npmrc`, `handoff.md` |
| `M/` | **Machine** | B | `package.json` con el stack, `.npmrc`, `handoff.md` |

y corre `npm install` en cada una (omitir con `-- --sin-install`).
No pisa ficheros existentes con contenido: es seguro re-ejecutarlo.

Stack de cada ventana (el que validó la inicialización de H):
`@zeus/authority-kit` · `@zeus/ciudad` · `@zeus/presets-sdk` ·
`@zeus/protocol` · `@zeus/rooms` · `@zeus/socket-server` ·
`@zeus/startpack-ciudad` · `@zeus/startpack-kit`.

## 3. Repartir las ventanas

Cada operador abre **su** carpeta y sigue **su** `handoff.md`:

- `H/handoff.md` — ventana Human, operador A: anfitrión. Asegura el
  nodo rooms (externo o local) y la autoridad de la room.
- `M/handoff.md` — ventana Machine, operador B: visitante. Resuelve su
  identidad y entra a la room.

El `handoff.md` de cada carpeta es además el **cuaderno del operador**:
ahí queda el registro de la corrida (sección «Registro»).

## 4. Identidad (antes de entrar)

Leer `reference/PEERCARD.md`. Tres vías, las tres legales:

1. **Ya tiene peercard** — usarla; comprobar vigencia.
2. **Quiere una** — pedirla al operador-admin del nodo rooms
   (el submanual trae las instrucciones de emisión para el admin).
3. **Anónimo** — entrar sin card, con las capacidades limitadas que el
   nodo permita.

## 5. Validación de la experiencia (CA de la prueba)

La prueba se da por buena solo si **todo** esto consta en los dos
handoffs, con evidencia literal (logs, snapshots):

- [ ] Ambos peers dentro de la misma room del nodo.
- [ ] Cada operador **ve al otro** (presencia / state de la room).
- [ ] Al menos un intercambio real vía autoridad (p. ej. `join` +
      `walk`/`announce` de ciudad reflejado en el snapshot del otro).
- [ ] La vía de identidad de cada peer quedó declarada (card vigente,
      card emitida, o anonimato) — ver `reference/PEERCARD.md`.
- [ ] Registro rellenado en `H/handoff.md` y `M/handoff.md`.

Lo no comprobado se marca `<pendiente>` — nunca se da por hecho.

## 6. Qué entra a git

| qué | ¿git? |
| --- | ----- |
| El kit (SKILL, manual, handoffs plantilla, generador, reference) | Sí — boilerplate del índice |
| `H/` y `M/` generadas (node_modules, locks, handoffs vivos) | No — regenerables (`.gitignore` local) |

El resultado de una corrida se reporta al `plan/` del carril
(sprint `PRUEBA-DE-DOS`), no commiteando `H/`/`M/`.
