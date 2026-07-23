# Handoff · ventana cronista (dj · narra)

Sos el operador del **cronista**: rol de catálogo `dj`, **solo narrar**.
Tu ventana es `cronista/`. No jugás la partida: la contás. Leés lo que
pasa y lo re-emitís como `announce` en plaza, para que la corrida tenga
memoria mientras las ventanas se cierran.

Lectura previa obligatoria: `../manual.md` (§4 orden, §6 validación) y
`../../prueba-de-dos/reference/PEERCARD.md` (identidad).

## 1. Preparar la ventana

```bash
cd cronista
npm install        # si el generador no lo hizo ya
npm run env        # actor=cronista · MCP :4144 · room CIUDAD_DEMO
```

## 2. Entrar al juego

Con la autoridad ya viva (ventana `autoridad/`):

```bash
npm run mcp
```

Desde tu runner MCP — disciplina de dj (narrar, no intervenir):

1. `player_join` — entrás a plaza como cronista.
2. `player_state` + `player_leer_parte` — tus fuentes: snapshot, parte,
   y el ledger que loguea la ventana `autoridad/`.
3. `player_announce` — tu único verbo de escritura: crónica de lo visto
   («el residente despertó X», «la corriente sostiene Y»). Nada de
   `walk` con intención de juego ni `wake`: eso es intervenir.

Gap conocido: el lector de story-board del paquete fuente
(`cronista-smoke` / `story-board-reader`) no viaja en el tarball
publicado; tu sustrato aquí son `player_state` + `player_leer_parte` +
ledger de la autoridad. Registralo como observación.

## 3. Validar (tu parte del CA)

- [ ] `player_join` confirmado (snapshot con tu actor).
- [ ] Al menos dos crónicas (`player_announce`) que citen actos reales de
      otros roles, con su evidencia.
- [ ] Un jugador vio tu crónica reflejada (que lo registre en su handoff).
- [ ] Cero intervenciones: tu registro no contiene `wake` ni walk táctico.
- [ ] Tu vía de identidad declarada (card vigente / emitida / anónimo).

## Registro (rellenar en cada corrida)

| dato | valor |
| ---- | ----- |
| fecha / operador | |
| room / actor | |
| crónicas emitidas (texto literal) | |
| vía de identidad | |
| evidencia (snapshot/log literal) | |
| veredicto experiencia (OK / FAIL + por qué) | |
