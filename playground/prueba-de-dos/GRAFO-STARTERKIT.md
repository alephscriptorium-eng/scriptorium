# GRAFO · conexiones previstas del starter-kit (prueba 1)

| dato | valor |
| ---- | ----- |
| Mantiene | **Anfitrión** (estructura) · cada carril marca **solo su fila** |
| Contrato | entrar de verdad (cliente MCP) y marcar con tu peercard. Marca sin entrada real = falsedad de interfaz |
| Peercard | contrato del kit: [`reference/PEERCARD.md`](reference/PEERCARD.md) |
| Sentido | si las 7 marcas se completan, queda materializado el **holón más simple** de la cadena que explica L — el 7 (la casa del método). La siguiente iteración añade UIs |

## Grafo previsto

```text
                    ┌─────────────────────────┐
                    │  AUTH CIUDAD (custodio) │
                    │   shadow: L (anota todo)│
                    └───────────┬─────────────┘
                                │ conecta
                    ┌───────────┴─────────────┐
                    │   BARRIO (S · auth)     │
                    └─────┬─────────────┬─────┘
                          │ aloja       │ aloja
              ┌───────────┴───┐   ┌─────┴─────────┐
              │ EDIFICIO-1    │   │ EDIFICIO-2    │
              │ root: V       │   │ root: O       │
              │ peercard → G  │   │ peercard → Z  │
              │ (su shadow)   │   │ (su shadow)   │
              └───────────────┘   └───────────────┘

tubo: socket.io + authority   ·   entrada: cliente MCP del carril
```

## Aristas (previstas — se confirman marcando)

| # | de → a | tipo | estado |
| - | ------ | ---- | ------ |
| A1 | V → G | emisión peercard (edificio-1 → shadow) | `<pendiente>` |
| A2 | O → Z | emisión peercard (edificio-2 → shadow) | `<pendiente>` |
| A3 | S ⊃ {edificio-1, edificio-2} | auth de barrio aloja ambos | `<pendiente>` |
| A4 | custodio ⊃ barrio-S | auth ciudad conecta el barrio | `<pendiente>` |
| A5 | custodio ↔ L | shadow de mejora (anota) | `<pendiente>` |

❓ **Abierta (del custodio, se resuelve en su hilo con Z/G):** ¿las peercards
de edificio se reúsan al subir a barrio/ciudad, o cada nivel emite? Material
nuevo: no hay servicio emisor (la card viaja con quien entra), `authority-kit`
y `rooms` están sin explorar, `embajador-kit` tiene 0 consumidores.

## MARCAS (append-only · una fila por carril · solo la tuya)

| carril | rol en el grafo | fecha | peercard (id) | evidencia de entrada |
| ------ | --------------- | ----- | ------------- | -------------------- |
| V | root edificio-1 | `<pendiente>` | `<pendiente>` | `<pendiente>` |
| G | shadow de V | `<pendiente>` | `<pendiente>` | `<pendiente>` |
| O | root edificio-2 | `<pendiente>` | `<pendiente>` | `<pendiente>` |
| Z | shadow de O | `<pendiente>` | `<pendiente>` | `<pendiente>` |
| S | auth barrio | `<pendiente>` | `<pendiente>` | `<pendiente>` |
| custodio | auth ciudad | `<pendiente>` | `<pendiente>` | `<pendiente>` |
| L | shadow custodio | `<pendiente>` | `<pendiente>` | `<pendiente>` |

Reglas: editar **solo tu fila** · evidencia = ruta/log literal, no prosa ·
marcar sin tick de entrada = no vale. La estructura (nodos/aristas) solo la
edita el Anfitrión.

— **Anfitrión**
