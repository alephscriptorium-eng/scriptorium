# Handoff · ventana autoridad (authority · sostiene)

Sos el operador de la **autoridad**: una room, una autoridad. Tu ventana es
`autoridad/`. Tu rol: sostener el nodo rooms y el engine del juego para que
los demás roles puedan vivir la ciudad.

Lectura previa obligatoria: `../manual.md` (§4 orden de arranque, §6
validación) y `../../prueba-de-dos/reference/PEERCARD.md`.

## 1. Preparar la ventana

```bash
cd autoridad
npm install        # si el generador no lo hizo ya
npm run env        # revisar room y overrides (.env)
```

## 2. Nodo rooms

- **Si hay nodo externo:** descomentá `ZEUS_SCRIPTORIUM_URL` en `.env` y
  anotá la URL en el Registro. Saltá a §3.
- **Si no hay:** `npm run nodo`. Puerto por defecto **3017**: el nodo
  escucha en `http://localhost:3017/runtime`, con Admin UI en `/admin/`.

## 3. Autoridad del juego

Con el nodo vivo:

```bash
npm run autoridad
```

Carga `@zeus/startpack-ciudad` del propio stack (scene `ciudad-v0`),
conecta al nodo y sostiene la room (`CIUDAD_DEMO` por defecto; se cambia
en `.env` con `ZEUS_CIUDAD_ROOM`, y todos los roles deben usar la misma).

## 4. Durante la partida

- El log de la autoridad es el ledger en vivo (`📜 join/walk/announce/
  wake/acta`): tu evidencia primaria.
- No juegues desde esta ventana: la autoridad sostiene, no interviene.

## 5. Validar (tu parte del CA)

- [ ] Nodo rooms vivo y alcanzable (URL anotada).
- [ ] Autoridad arriba, `game: ciudad`, startpack cargado (línea de log).
- [ ] Viste el `join` de cada jugador en el ledger (evidencia literal).
- [ ] Room única confirmada: todos los actores en el mismo snapshot.

## Registro (rellenar en cada corrida)

| dato | valor |
| ---- | ----- |
| fecha / operador | |
| URL nodo rooms | |
| room | |
| startpack (nombre@versión, scene) | |
| roles que viste entrar (ledger literal) | |
| veredicto experiencia (OK / FAIL + por qué) | |
