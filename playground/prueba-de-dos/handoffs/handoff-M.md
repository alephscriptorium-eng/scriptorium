# Handoff · ventana M (Machine · operador B · visitante)

Sos el operador **B** (Machine) de la prueba de dos. Tu ventana es `M/`. Tu rol:
**visitante** — entrar a la room que sostiene el operador A (ventana
`H/`) y validar la experiencia desde tu lado.

Lectura previa obligatoria: `../manual.md` (§4 identidad, §5 validación)
y `../reference/PEERCARD.md`.

## 1. Preparar la ventana

```bash
cd M
npm install        # si el generador no lo hizo ya
```

## 2. Datos que te pasa A

Antes de entrar necesitás de A: **URL del nodo** (exportala como
`ZEUS_SCRIPTORIUM_URL`) y **nombre de la room**. Anotalos en el Registro.

## 3. Identidad (primero)

Resolvé tu vía en `../reference/PEERCARD.md`:

1. **Ya tenés peercard** → verificá vigencia antes de entrar.
2. **Querés una** → pedísela al operador-admin del nodo (A, si el nodo
   es el local de la prueba). El submanual trae sus instrucciones.
3. **Anónimo** → entrás como jugador raso, con lo que el nodo permita.

Declará la vía elegida en el Registro — es parte del CA.

## 4. Entrar a la room

Cliente Node del transporte: `@zeus/rooms`
(`import { createClient, connectAndJoin } from '@zeus/rooms'`; handshake
`{ token, room, user }` — Guía → Handshake externo del portal). Para
jugar ciudad como actor MCP: `src/player-mcp/` de `@zeus/ciudad`
(un proceso = un actor; tools `join / walk / announce / wake / state`).
`<pendiente>` asentar aquí la invocación exacta que funcione en la
primera corrida.

## 5. Validar (tu mitad del CA)

- [ ] Entraste a la room (join aceptado; evidencia literal).
- [ ] Ves a A (presencia / state de la room).
- [ ] Emitiste al menos un intent (`walk` / `announce`) y A confirmó
      verlo reflejado.
- [ ] Tu vía de identidad declarada (y card adjunta si la hubo).

## Registro (rellenar en cada corrida)

| dato | valor |
| ---- | ----- |
| fecha / operador | |
| URL nodo rooms | |
| room | |
| vía de identidad (card vigente / emitida / anónimo) | |
| evidencia (log/snapshot literal) | |
| veredicto experiencia (OK / FAIL + por qué) | |
