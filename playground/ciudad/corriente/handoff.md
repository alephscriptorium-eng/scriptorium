# Handoff · ventana corriente (player · canaliza)

Sos el operador de la **corriente**: el camino rabbit, rol de catálogo
`player` y default del `join` (todo peer MCP sin más señas entra como
corriente). Tu ventana es `corriente/`. Tu verbo es **canaliza**: mantener
el flujo — moverte, contar presencia, no dejar morir la ciudad.

Lectura previa obligatoria: `../manual.md` (§4 orden, §6 validación) y
`../../prueba-de-dos/reference/PEERCARD.md` (identidad).

## 1. Preparar la ventana

```bash
cd corriente
npm install        # si el generador no lo hizo ya
npm run env        # actor=corriente · MCP :4143 · room CIUDAD_DEMO
```

## 2. Entrar al juego

Con la autoridad ya viva (ventana `autoridad/`):

```bash
npm run mcp
```

Desde tu runner MCP:

1. `player_join` — spawn en plaza (naciste corriente: es tu camino).
2. `player_state` — mirá `objetivo: { vivos, umbral, cumplido }`: el bien
   común es tu tablero.
3. `player_walk` sostenido — patrullá barrios; tu presencia frena el
   decay (la clase `flujo` cuenta presencia pero no recarga energía:
   solo `announce` recarga).
4. `player_announce` en plaza cuando pases por ella.

## 3. Validar (tu parte del CA)

- [ ] `player_join` confirmado (snapshot con tu actor).
- [ ] Al menos tres `player_walk` aplicados (recorrido en evidencia).
- [ ] `objetivo` observado antes y después de tu recorrido (¿aportaste?).
- [ ] Otro jugador te vio en su snapshot (presencia mutua).
- [ ] Tu vía de identidad declarada (card vigente / emitida / anónimo).

## Registro (rellenar en cada corrida)

| dato | valor |
| ---- | ----- |
| fecha / operador | |
| room / actor | |
| recorrido (anchors) | |
| objetivo antes → después | |
| vía de identidad | |
| evidencia (snapshot/log literal) | |
| veredicto experiencia (OK / FAIL + por qué) | |
