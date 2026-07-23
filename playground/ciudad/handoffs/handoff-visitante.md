# Handoff · ventana visitante (player · saborea)

Sos el operador del **visitante**: jugador de paso, rol de catálogo
`player`. Tu ventana es `visitante/`. Tu verbo es **saborea**: entrás,
caminás entre anchors por las calles, anunciás en plaza.

Lectura previa obligatoria: `../manual.md` (§4 orden, §6 validación) y
`../../prueba-de-dos/reference/PEERCARD.md` (identidad).

## 1. Preparar la ventana

```bash
cd visitante
npm install        # si el generador no lo hizo ya
npm run env        # actor=visitante · MCP :4142 · room CIUDAD_DEMO
```

## 2. Entrar al juego

Con la autoridad ya viva (ventana `autoridad/`):

```bash
npm run mcp
```

Desde tu runner MCP:

1. `player_join` — spawn en plaza.
2. `player_state` — mirá quién más está (`actors`) y el mapa.
3. `player_walk` — recorré al menos dos anchors distintos.
4. `player_announce` en plaza — tu saludo debe aparecer en el snapshot
   de otro jugador.
5. `player_leer_parte` — leé el parte del día antes de irte.

## 3. Validar (tu parte del CA)

- [ ] `player_join` confirmado (snapshot con tu actor).
- [ ] Caminata real: cambio de anchor visto en `player_state`.
- [ ] Tu `announce` reflejado en la evidencia de otro jugador.
- [ ] Ves al menos a otro actor en tu snapshot (presencia mutua).
- [ ] Tu vía de identidad declarada (card vigente / emitida / anónimo).

## Registro (rellenar en cada corrida)

| dato | valor |
| ---- | ----- |
| fecha / operador | |
| room / actor | |
| anchors recorridos | |
| vía de identidad | |
| evidencia (snapshot/log literal) | |
| veredicto experiencia (OK / FAIL + por qué) | |
