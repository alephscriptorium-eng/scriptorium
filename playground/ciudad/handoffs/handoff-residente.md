# Handoff · ventana residente (operator · filtra)

Sos el operador del **residente**: jugador ligado a un edificio, rol de
catálogo `operator`. Tu ventana es `residente/`. El residente nace con
`wake` (su edificio pasa a `vivo`) y se retira con `sleep`; su verbo es
**filtra**.

Lectura previa obligatoria: `../manual.md` (§4 orden, §6 validación) y
`../../prueba-de-dos/reference/PEERCARD.md` (identidad).

## 1. Preparar la ventana

```bash
cd residente
npm install        # si el generador no lo hizo ya
npm run env        # actor=residente · MCP :4141 · room CIUDAD_DEMO
```

## 2. Entrar al juego

Con la autoridad ya viva (ventana `autoridad/`):

```bash
npm run mcp
```

Levanta tu MCP de jugador (un proceso = un actor). Desde tu runner MCP:

1. `player_join` — spawn en plaza.
2. `player_state` — mirá `barriosLatentes`: elegí tu edificio.
3. `player_walk` hasta el anchor del barrio elegido.
4. `player_wake` — tu acto fundante: el barrio pasa a `vivo` y vos quedás
   ligado a ese edificio. Gasta energía; `player_announce` en plaza
   recarga.

Gap conocido: el `join` publicado no lleva `playerType`, así que el
snapshot te clasifica `corriente` hasta que tus actos (`wake` sobre tu
edificio) te distingan. Registralo como observación.

## 3. Validar (tu parte del CA)

- [ ] `player_join` confirmado (snapshot con tu actor).
- [ ] `player_wake` aplicado: tu barrio en `barriosVivos` (evidencia).
- [ ] Otro jugador vio tu wake/announce reflejado (que lo registre en su
      handoff).
- [ ] Tu vía de identidad declarada (card vigente / emitida / anónimo).

## Registro (rellenar en cada corrida)

| dato | valor |
| ---- | ----- |
| fecha / operador | |
| room / actor | |
| edificio despertado | |
| vía de identidad | |
| evidencia (snapshot/log literal) | |
| veredicto experiencia (OK / FAIL + por qué) | |
