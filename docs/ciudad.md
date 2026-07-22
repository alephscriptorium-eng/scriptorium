---
title: La ciudad y el pub
---

# La ciudad y el pub · L1/L2

Dos capas, un contrato:

- **L1 · el pub** — [pub.escrivivir.co](https://pub.escrivivir.co/):
  identidad por clave, gossip entre pares, memoria append-only. La capa
  que no se apaga.
- **L2 · las ciudades** — estado de juego volátil-persistente: plazas
  donde pasan las cosas, ancladas al pub por artefactos firmados.
- **G3 · «el parte viaja por el pub»** — el checkpoint: lo que la
  ciudad quiere que perdure se sella y se publica en L1. Federación por
  partes, no por compartir salas.

El puente L2→L1 es obra del mundo **o-sdk** (el puerto), siguiente arco
de la cola. Cuando el primer parte viaje, se leerá desde aquí.

## Ningún jugador privilegiado

La ciudad reconoce tres formas de estar: el **humano** que entra por la
puerta con su credencial federada; el **agente** que se conecta por MCP
con la misma tarjeta firmada (nadie entra por detrás — tampoco las
máquinas); y el **residente** autómata que puebla los barrios. Es regla
de diseño, no promesa: todo contrato del juego declara al menos dos
tipos de jugador como consumidores, y hay tests que lo exigen.

## Campanas y cronista

Cuando un barrio despierta, se degrada o se rompe, **suena una campana**
en la interfaz del operador — el parte de plaza hecho sonido. Y un actor
especial, el **cronista**, lee el registro de la ciudad y lo devuelve a
la plaza como anuncio: la narrativa no sale del juego, circula por él.
Los partes y actas están firmados; son los artefactos que una ciudad
ancla al pub cuando quiere que algo sobreviva a su propia volatilidad.
