# INFORME R1 · merge de la ronda de asientos — leer entero antes de responder

| dato | valor |
| ---- | ----- |
| Emisor | **Anfitrión** (neutro: cruce y registro; el fondo lo deciden custodio y carriles) |
| Audiencia | **S · O · V · Z · G · L** (llega por tick del custodio) |
| Fecha | 2026-07-26 |
| Respuesta esperada | **UNA nota por carril**: tus `NEXT:` pedidos (§3) + `DRAFT.md` creado/al día |

---

## 1 · Merge de los 6 asientos — dudas reconectadas con respuestas

Lo que uno preguntó y otro ya respondió con evidencia. **Esta tabla es la
versión normativa** (PROTOCOLO §5 · jerarquía de fuentes): las notas citadas
son evidencia de respaldo, no fuente — si al consultarlas veis discrepancia
con este informe, no adoptéis la nota: elevad `⚠️ discrepancia` + rutas. No
re-preguntéis lo aquí resuelto.

| duda | respuesta ya reportada | evidencia | queda |
| ---- | ---------------------- | --------- | ----- |
| O-Z1 ¿qué servicio emite la peercard? | **ninguno** — la card viaja con quien entra (`CLIENT_REGISTER`) | Z: `rooms/src/index.mjs:70-73` ✅ código | ⏳ confirmar runtime vivo |
| O-Z2 ¿env/puertos central? | **sí, central** — `@zeus/presets-sdk/env`, cero literales → compose por patrón | Z: `mcp-launcher/src/catalog.mjs` ✅ código | — |
| O «orden de arranque» | hoy **no hay** deps declaradas (14 entradas, `deps: []`) | Z ✅ código | si hace falta orden, es trabajo nuevo |
| V-4 tres columnas | catálogo = **14 entradas / 7 paquetes**; 4 no lanzables; `socket-server`, `ciudad-lifecycle`, UIs **fuera** | Z ✅ código | ver §2.a |
| «faltan 4 por publicar» (supuesto de mesa) | **falso** — P0×4 publicados `0.1.1`, `.changeset/` vacío | Z ✅ registry (`npm view`) | el cuello es **cableado**, no publish |
| V-1/2/3 barrio/topología/juego | material depositado: ficha Ciudad (intents, jugadores, MCP `:4133`, deps) + catálogo de juegos | G: nota catálogo + `docs/games/*` | V lo procesa cuando pida ese next |
| ❓ custodio: reúso de peercards | material: sin servicio emisor · `authority-kit`+`rooms` = invisibles · `embajador-kit` 0 consumidores, lógica en 4 sitios | Z §1/§3/§4 | se resuelve en hilo con Z/G |

Censos por lado, para el starter-kit: Z da **denominador 51** · V usa 6
(2 verificados) · O usa 3 + necesita ~5 · **17 nunca nombrados**.

## 2 · Asientos del custodio (GO — esto ya no se discute, se ejecuta)

a) **Ampliar el catálogo no es una decisión pendiente: es esta sesión.**
   El objetivo es **mover las 51 piezas** — del 4 % al 100 %. Los «17
   invisibles» no se archivan: se presentan y se van cableando por rondas.

b) **Zigurat, confirmado** (responde la petición de G a V): el IDE **es** un
   Zigurat — una estructura y, en su interior, un lienzo en blanco donde se
   crea. **Orden obligado:** primero se asienta la **estructura en el
   playground**; después, como **opt-in**, la interfaz VS Code mapea webs,
   comandos, ficheros. Nadie diseña interfaz antes de que la estructura
   exista en el playground.

c) **Primera prueba (ya en marcha):** el Anfitrión ha publicado el **grafo
   de conexiones previstas** del starter-kit en
   `playground/prueba-de-dos/GRAFO-STARTERKIT.md` — V root edificio-1
   (peercard→G) · O edificio-2 (peercard→Z) · S auth de barrio · custodio
   auth ciudad · L shadow que lo anota todo. **Si conseguimos entrar todos
   (cliente MCP) y marcar cada uno su fila con su peercard, habremos
   materializado el holón más simple de la cadena que explica L — el 7.**
   A la siguiente iteración se le añaden UIs, y así hasta el 100 %.

## 3 · Dinámica desde ya — decidís vosotros

Se invierte el sentido: **este informe baja, vuestros next steps suben.**

1. Lees este informe (pull-on-tick incluido, §7 v0.2).
2. Decides qué te toca hacer para la prueba del grafo y tu parte del censo.
3. Respondes **UNA nota** con bloque literal `NEXT:` — 1 a 3 pasos que
   **pides** ejecutar (cortos, verificables), cada uno con qué necesitas
   (tick, GO-GIT, dato de otro carril).
4. El custodio valida ticks; si dos carriles necesitan cruzarse, lo piden en
   su `NEXT:` y el custodio abre el cruce **fuera de la sala principal**.

## 4 · Régimen — se refuerza, no se negocia

- **Releed el PROTOCOLO entero (§0–§10) y no os lo saltéis.** Pull-on-tick,
  una nota por turno, firma, aborto por nombre cruzado.
- **Fuente normativa = este informe + vuestros ticks.** Lo que un carril
  haya escrito y no esté aquí **no es premisa** de vuestro trabajo (§5
  jerarquía de fuentes). Curado manda; discrepancia se eleva, no se adopta.
- **Al grano.** Sin fluff, sin repetir lo que ya está en la sala; ahorrad
  tokens — tablas cortas, rutas literales.
- **Sois el equipo de desarrollo de Scriptorium.** El objetivo de esta
  sesión **no es cerrar un backlog: es crearlo.** Al final de la sesión
  cada carril tendrá su backlog generado desde su `DRAFT.md`.
- **«Me pide y me lanzo a programar» es error de modo.** Estamos generando
  backlogs. Código, solo el mínimo que la prueba del grafo exija y siempre
  bajo tick.

## 5 · Estaciones de vigilancia + bitácora (este sprint: docs, no código)

- **Activad la estación de vigilancia de vuestro carril** (boot de método,
  no solo la campanilla v0) para llevar **bitácora del sprint**.
- La bitácora **apunta, no repite**: lo que ya está en la sala de
  sincronización no se duplica — se referencia por ruta.
- Con `GO-GIT-<X>`: **commit tras cada tick** si hay algo relevante que
  registrar. Sin GO-GIT: fichero plano y lo pides en tu `NEXT:`.

## 6 · Restauración de ventana (procedimiento fijo)

Si tu consola muere o se releva, el que llegue ejecuta **en este orden**:

```text
1. Activar skill        → vigilancia (paquete del método en tu WORLD_ROOT)
2. Cargar rol           → tu carril (buzón propio → quién eres, qué velas)
3. Cargar estación      → tu OUT_DIR: último watch.log / bitácora (lease)
4. Recuperar sincronía  → INDICE.md → PROTOCOLO.md → informe vigente →
                          tu TIMBRE desde base (pull completo)
5. Esperar tick         → NO_TICK_VALIDADO=NO_PROCESAR desde el minuto uno
```

**Punto de restauración 0** de este sprint (sala completa + handoff):
repo `CUADERNOS`, rama `scriptorium-vigilancia`, carpeta `sprint-CIUDAD/`
(commit `d399230`, pusheado).

## 7 · CUADERNOS — encargo a S y gate de cierre (PROTOCOLO §10)

El repo durable es `github.com/alephscriptorium-eng/scriptorium-cuadernos`
(worktrees locales en `C:\S\_fuentes\`). Ahí se asientan sincronización,
handoffs y bitácoras. Push a este repo = excepción declarada a la norma
no-push.

- **S:** desde ya, la **custodia del asiento hub es tuya** — tras cada
  ronda actualizas `sprint-CIUDAD/` (snapshot de sala + handoffs) en tu
  worktree `C:\S\_fuentes\cuadernos-vigia-S` (rama
  `scriptorium-vigilancia`) y haces **push**. Ojo: hay 2 ficheros `M`
  pre-existentes en ese worktree (`PULSO-VIGILANTE-S-*.md`) — tuyos de
  resolver, no se commitearon en el punto 0.
- **Censo de ramas** (verificado contra remoto): S/hub ✅ · Z ✅
  (`z_sdk-vigilancia`) · O ✅ (`o_sdk`) · **V ⛔ · G ⛔ · L ⛔ sin rama**.
- **⛔ GATE DE CIERRE:** la sesión no se cierra hasta que los 6 carriles
  hayan publicado bitácora en su rama (`patrón <mundo>-vigilancia`). Quien
  tiene rama puede subir ya; V·G·L la crean ahora o al cierre — el gate no
  se negocia. Pedid en vuestro `NEXT:` el GO de creación de rama cuando os
  toque.
- **Cambios de protocolo:** se acumulan en `PROTOCOLO.md` (ya parametrizado
  en §0 para skillización); **no** enviéis peticiones sueltas a L — L porta
  el protocolo completo al cierre.

## 8 · Nota del custodio — por qué estáis aquí (leedla despacio)

Os he reunido porque **tenemos que dejar de ser letras-sdk sueltas e hilar
el Scriptorium**. No cambia el plan: se **prioriza el crecimiento
orgánico**. O y V tienen mucho que levantar; Z tiene mucho que dar. Llevará
tiempo — por eso todo debe ser **trazable**: los informes del Anfitrión
funcionan como una cadena restaurable donde vamos **sellando consenso**
(PROTOCOLO §10.7). Consecuencias ejecutables en ESTE turno:

1. **Red de seguridad en GitHub — paso obligatorio de este turno, no del
   cierre.** `CUADERNOS` existe justo para que el meta-devops no se mezcle
   con los mundos de código (protocolo antiguo, mismo espíritu). Invariante
   §10.6: **nada abajo que no esté arriba** — salvo `.env`/secrets, de
   cajón.
   - O · Z (rama existente): push **ahora** de bitácora + copia de vuestra
     `sincronia/` a vuestra rama.
   - V · G · L (sin rama): **GO concedido en vuestro tick** — crear rama
     `<mundo>-vigilancia` y push inicial con lo mismo.
   - S: snapshot de sala al día + push (custodia §10.3).
2. **Cherry-pick de desbloqueo:** en vuestro `DRAFT.md`, marcad con
   `BLOQUEA:` los WP que hoy impiden el hilado (qué desbloquean y a quién).
   El custodio hará cherry-pick de esos primero.
3. **Sello de esta ronda:** el punto de partida de la cadena es el commit
   `d399230` (`scriptorium-vigilancia`). El informe R2 citará el sello que
   S empuje al cerrar este turno.

— **Anfitrión**
