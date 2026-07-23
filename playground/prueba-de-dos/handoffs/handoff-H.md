# Handoff · ventana H (operador A · anfitrión)

Sos el operador **A** de la prueba de dos. Tu ventana es `H/`. Tu rol:
**anfitrión** — asegurar que hay nodo rooms y autoridad de room vivos, y
validar la experiencia desde tu lado. El operador B (ventana `M/`) entra
como visitante.

Lectura previa obligatoria: `../manual.md` (§4 identidad, §5 validación)
y `../reference/PEERCARD.md`.

## 1. Preparar la ventana

```bash
cd H
npm install        # si el generador no lo hizo ya
```

## 2. Nodo rooms

- **Si hay nodo externo:** anotá su URL en el Registro y exportá
  `ZEUS_SCRIPTORIUM_URL=<url>` (así resuelve `@zeus/rooms`, sin URLs
  hardcodeadas).
- **Si no hay:** levantá uno local con `@zeus/socket-server`
  (`node node_modules/@zeus/socket-server/src/index.mjs`). Puerto y
  detalles: README/`presets-sdk` del stack. `<pendiente>` documentar
  aquí el puerto por defecto tras la primera corrida.

## 3. Autoridad de la room (juego: ciudad)

La room necesita **una** autoridad (patrón «una room, una autoridad» de
`@zeus/ciudad`). Vías, del README del paquete:

```bash
# smoke local del dominio (sin room):
npm exec --prefix node_modules/@zeus/ciudad -- npm run smoke

# autoridad real (requiere nodo + startpack):
# forma monorepo: `npm run authority -w @zeus/ciudad`
# desde esta ventana instalada: <pendiente> fijar la invocación exacta
# en la primera corrida y asentarla aquí.
```

Overrides útiles: `ZEUS_CIUDAD_ROOM` (nombre de room),
`ZEUS_STARTPACK_CIUDAD`, `ZEUS_PORT_SCRIPTORIUM`.

## 4. Identidad

Elegí tu vía en `../reference/PEERCARD.md` (tener / pedir / anónimo) y
declarala en el Registro. Como anfitrión, además: si B te pide emisión
de card, seguí la sección «Para el operador-admin» del submanual.

## 5. Validar (tu mitad del CA)

- [ ] Nodo rooms vivo y alcanzable (URL anotada).
- [ ] Autoridad de la room arriba, `game: ciudad`.
- [ ] Ves el `join` de B en el state/ledger de la room (evidencia literal).
- [ ] Respondiste al menos a un intent de B (o emitiste uno propio que
      B confirmó ver).
- [ ] Tu vía de identidad declarada.

## Registro (rellenar en cada corrida)

| dato | valor |
| ---- | ----- |
| fecha / operador | |
| URL nodo rooms | |
| room | |
| vía de identidad (card vigente / emitida / anónimo) | |
| evidencia (log/snapshot literal) | |
| veredicto experiencia (OK / FAIL + por qué) | |
