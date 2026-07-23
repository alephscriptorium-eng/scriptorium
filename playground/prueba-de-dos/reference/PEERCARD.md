# PEERCARD — submanual de identidad (spike)

Antes de entrar a la room, cada operador resuelve su identidad por una
de **tres vías**. Las tres son legales; lo obligatorio es **declararla**
en el Registro del handoff.

Fuentes: README de `@zeus/authority-kit` (WP-U93 / D-20), README de
`@zeus/ciudad` (§Gap horse / federación · §MCP jugador), skill
`estacion-viva` (`reference/GAME-MCP.md`).

## Qué es una peercard

Credencial no-crypto de ciclo de vida corto que la **autoridad** emite a
un peer. Campos mínimos que exige el método (estación-viva):

| campo | rol |
| ----- | --- |
| `id` | identidad del peer |
| `sig` | firma / sello del asiento |
| `issuedAt` | marca temporal de emisión |
| `features` | capacidades anunciadas |

La emisión de `authority-kit` añade `role` y caducidad
(`expiresAt` / `ttlMs`, default **1 h**). Ciclo de vida:
`peerCardPhase` / `peerCardRemainingMs` (re-exportados desde
`@zeus/protocol`). El carril WebRTC (`@zeus/webrtc-signaling`) **exige**
card antes de offer/answer/ICE. La firma de asiento (`ssbId`) la adjunta
el caller vía protocol, no el kit.

## Vía 1 · Ya tenés card

1. Localizala (path típico de estación: `$OUT_DIR/peercard.json`).
2. Verificá vigencia con `peerCardPhase` / `peerCardRemainingMs`
   (`@zeus/protocol`); caducada = pedila de nuevo (vía 2).
3. Presentala al entrar (en ciudad: el player-mcp la reenvía en
   `CLIENT_REGISTER`; la puerta `enterWithPuerta` exige card firmada).

## Vía 2 · Querés una — instrucciones para el operador-admin del nodo

Quien emite es la **autoridad** del nodo rooms (su operador-admin).
Opciones de emisión, del README de `@zeus/authority-kit`:

**a) Automática al join** — la autoridad emite al aceptar un intent de
join y la entrega por callback:

```js
await startAuthority({
  // …
  peerCardEndpoint: process.env.ZEUS_SCRIPTORIUM_URL, // o lo toma de @zeus/rooms
  onPeerCard: (card, intent) => { /* entregar la card al actor */ }
});
```

**b) Explícita** — misma fábrica, a demanda:

```js
const { issuePeerCard } = await startAuthority({ /* … */ });
const card = issuePeerCard({ role: 'player', sessionId: 'alice', ttlMs: 3_600_000 });
```

**Guardarraíles del admin:**

- `issuePeerCard` **no escala** scopes ni rol hacia más poder por su
  cuenta; niveles de federación = fase posterior.
- Con ACL direccional (`acl: { policy, ownership }`), lo destructivo
  exige `cap:destructive:…` en los scopes de la card — no emitas
  scopes destructivos a un visitante de prueba.
- TTL corto para pruebas (default 1 h ya sirve).

**Spike encolado (plan del carril, PD-02):** valorar un skill propio
`operador-rooms` para el operador-admin del nodo (emisión, ACL, salud
del nodo). Hoy este submanual es la pieza mínima; el skill es decisión
del custodio.

## Vía 3 · Anónimo

Entrar sin card, como jugador raso del transporte: handshake
`{ token, room, user }` de `@zeus/rooms` (Guía → Handshake externo).
En ciudad correspondería a jugador `visitante` / `corriente`
(rol catálogo `player`). Límites:

- Sin card **no hay carril WebRTC** (signaling la exige).
- Con ACL activa: default **deny** en mutate/destructive — solo lo
  idempotente que el nodo permita.
- `<pendiente>` confirmar en la primera corrida qué permite exactamente
  el nodo de la prueba a un anónimo.

## Decisión rápida

```text
¿Tenés card vigente?  → sí: usala (vía 1)
                      → no: ¿necesitás intents con poder o WebRTC?
                           → sí: pedila al admin (vía 2)
                           → no: entrá anónimo (vía 3) y declaralo
```
