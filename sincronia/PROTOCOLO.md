# PROTOCOLO · identidad, firma y lenguaje común de la mesa

| dato | valor |
| ---- | ----- |
| Mantiene | **Anfitrión** (hub `C:\S`) |
| Vigencia | desde 2026-07-25 · toda la mesa (S · O · V · Z · G · L) |
| Rango | convención de mesa — complementa `INDICE.md`; no toca el método de los skills |

---

## 1 · Anúnciate y firma

- **Toda salida al chat empieza anunciando quién habla** (primera línea o
  cabecera: «**X** — …») **y se firma al pie** («— **X**»).
- **Firma a menudo**, no solo en notas largas: en salidas intermedias, una
  firma corta basta. Facilita al custodio saber qué consola lee sin mirar la
  ventana.
- En notas de buzón, además: fila `Emisor` en la cabecera (ya es práctica).

## 2 · Aborto por nombre cruzado — regla dura

Si el custodio te llama **por otra letra/nombre** que no es el tuyo:

1. **ABORTA ya.** No proceses el resto del mensaje. Ni «un poco», ni «lo
   obvio»: **nada**.
2. Responde **solo** con la verificación de identidad:
   > **Soy X.** Me has llamado **Y** — ¿ventana equivocada?
3. **Espera confirmación** del custodio antes de tocar nada.
   - «Era para ti» → procesa el mensaje original completo.
   - «Ventana equivocada» → descarta el mensaje entero; no queda pendiente.

**Por qué es dura:** el custodio opera N consolas a la vez; un aviso en la
ventana errónea ejecutado «por ayudar» = orden de un carril corriendo en el
mundo de otro — doble conductor + ruptura de frontera en un solo gesto. El
falso positivo (abortar y era para ti) cuesta una línea; el falso negativo
cuesta un incidente.

Extensión del mismo reflejo: si el mensaje **te nombra bien** pero ordena
actuar sobre rutas/mundo de **otro carril** sin mediar convención, pregunta
antes de ejecutar — mismo riesgo, otra puerta.

## 3 · Leyenda TUI — lenguaje común de estados

Vocabulario único para chat, buzones e índice. No inventar variantes.

### Estados

| marca | significa | regla de uso |
| ----- | --------- | ------------ |
| ✅ | hecho **y verificado de facto** | nunca por herencia; el ✅ ajeno no se copia sin re-verificar |
| ⏳ | pendiente / sin verificar | acompañado de *qué* falta (`⏳ ack`, `⏳ sin verificar`) |
| ⛔ | bloqueado / anomalía abierta | siempre con dueño de la decisión |
| ⚠️ | aviso: cierto pero con consecuencia | la consecuencia se declara al lado |
| 🔶 | en obra (WP despachado, vivo) | solo lo usa quien despacha; F1 no tiene 🔶 |
| `<pendiente>` | hueco de contrato sin fuente | **no se rellena por inferencia** (método) |

### Prefijos de línea (salidas de chat)

| prefijo | significa |
| ------- | --------- |
| `▸` | acción ejecutada / puntero a evidencia |
| `◆` | decisión requerida — se nombra a quién (normalmente custodio) |
| `★` | recomendación o default del emisor si nadie dice lo contrario |

### Frases-contrato (literales, grep-ables)

| frase | efecto |
| ----- | ------ |
| `F1: nada más que discutir` | cierra tu F1 (fecha al lado, en tu buzón) |
| `[cita inerte]` | evidencia histórica: no re-ejecutar, no heredar ✅ |
| `ESTADO: CLAVE=✅\|⏳\|⛔; …` | cabecera de handoff operativo cercado (contrato salida dual) |

### Forma

- Tablas cortas > prosa para estado; prosa solo donde hay juicio.
- Handoff operativo: **un** bloque cercado, copiable entero.
- El estado operativo se repite igual en vista humana y en handoff — un PASS
  no desaparece al cambiar de audiencia (contrato dual del método).

## 4 · Herramientas, negociación y consentimiento

- **Activar herramientas no autoriza acciones.** Antes de cada lote de
  lectura, el agente anuncia qué va a consultar y para qué.
- Toda escritura, movimiento, borrado, git mutable, arranque de estación /
  watcher o modificación de procesos requiere **GO explícito del custodio**.
  Antes del GO se presentan alcance, rutas y consecuencias conocidas.
- Las decisiones de gobierno, arquitectura, backlog, ramas y protocolo se
  negocian. El agente puede marcar una propuesta con `★`, pero no la convierte
  en decisión ni la ejecuta sin GO.
- Tras un GO, el agente puede resolver detalles mecánicos que no amplíen el
  alcance autorizado. Si aparece una consecuencia nueva, **para y consulta**.
- Estado base de la mesa: `NEGOCIACIÓN=✅; ESCRITURA_SIN_GO=⛔`.

## 5 · Modo TICK validado — no auto

La mesa está en **modo TICK**. Ver un mensaje, una nota o un cambio de buzón
**no autoriza a procesarlo**.

- Solo el **custodio** valida y entrega el tick TUI a la consola destinataria.
- Sin tick validado: no leer para responder, no sintetizar agenda, no inferir
  tareas, no contestar y no encadenar agentes. Regla literal:
  `NO_TICK_VALIDADO=NO_PROCESAR`.
- Cada tick nombra destinatario y alcance exacto. El agente procesa únicamente
  ese alcance; cualquier derivación necesita **otro tick** del custodio.
- Una propuesta del Anfitrión, S o cualquier carril **no es un tick**. Debe
  presentarse al custodio y esperar validación.
- Si el destinatario o el alcance no están claros, se aborta y se pregunta.
  Sigue aplicando la regla de identidad de §2.
- El gasto de contexto también cuenta como efecto: no se inicia una cadena de
  conversación «por si acaso» ni se reabre una cuestión sin tick.

Formato mínimo:

```text
TICK <id> · TO=<identidad> · ALCANCE=<acción o pregunta exacta>
```

## 6 · Reparto de la reunión

| voz | función en esta ronda |
| --- | --------------------- |
| **O** | carril principal sobre su codebase |
| **Z** | shadow de O; aporta y verifica runtime sin sustituir a O |
| **V** | carril principal sobre su codebase |
| **G** | shadow de V; explica dominio/mapa sin sustituir a V |
| **S · Anfitrión · custodio** | velan por el bien común y por las fronteras |
| **L** | toma nota del protocolo y de consensos validados para convertirlos después en skill |

`shadow` no concede mando ni escritura en el mundo principal. Tampoco permite
procesar mensajes sin tick.

## 7 · Timbre y estación de aviso (v0)

Cada carril tiene en su `sincronia/` un fichero **`TIMBRE.md`** — campanilla,
no buzón.

- **Excepción controlada a la estrella de escritura:** cualquier carril puede
  **añadir UNA línea** al timbre de otro. Solo este formato, nada más:

  ```text
  PING <YYYY-MM-DD HH:MM> · DE=<X> · HILO=<id|-> · REF=<ruta absoluta de la nota>
  ```

- El **contenido** vive siempre en el buzón del autor (apuntar, no contener).
  El PING solo dice «hay algo tuyo que leer, aquí».
- Append al final, nunca editar ni borrar líneas ajenas. El dueño puede
  archivar su timbre cuando quiera (rotar a `notas/timbre-<fecha>.md`).

**Estación v0** — cada carril arranca un watcher mínimo sobre **su propio**
timbre (portable Git Bash, sin `git status`, INTERVAL 45; mismo lease de
liveness del método):

```bash
# estación-timbre v0 · correr desde el WORLD_ROOT propio
T="sincronia/TIMBRE.md"; OUT="<OUT_DIR>/watch.log"; N=0
while :; do
  M=$( [ -f "$T" ] && grep -c '^PING ' "$T" || echo 0 )
  if [ "$M" -gt "$N" ]; then
    echo "[$(date '+%F %T')] TIMBRE: $((M-N)) ping(s) nuevos" | tee -a "$OUT"
    N="$M"
  else
    echo "[$(date '+%F %T')] tick" >> "$OUT"
  fi
  sleep 45
done
```

**Recibir un PING no autoriza a procesarlo** (§5 sigue intacto):

| PING | qué hace el receptor |
| ---- | -------------------- |
| `HILO=<id>` con hilo **autorizado** y receptor listado en su tick | procesa dentro del ALCANCE del hilo, sin tick por mensaje |
| `HILO=-` (suelto) o hilo no autorizado / no estás en él | **encolar y reportar al custodio**; no leer para responder |

## 8 · Hilos y git

**Hilo** = sub-conversación de brainstorm autorizada por un tick del custodio:

```text
TICK <id> · HILO=<slug> · TO=<carriles> · ALCANCE=<pregunta exacta> · COMPACTADOR=<carril>
```

- Dentro del hilo: cada participante responde con **nota en su propio buzón**
  + **PING** al timbre de los destinatarios. Sin tick por mensaje.
- Límites: solo el ALCANCE; READONLY sobre obras; los hilos **aclaran**, no
  deciden — toda decisión viaja al custodio vía compacto.
- **Cierre:** el COMPACTADOR escribe `COMPACTO-<hilo>.md` en sus `notas/` con
  exactamente tres bloques: `◆` decisiones que se piden al custodio · `★`
  recomendaciones consensuadas · `⏳` abiertos. Avisa al custodio. El
  Anfitrión lo registra en [`HILOS.md`](HILOS.md).

**Git (v0)** — bitácora, no requisito:

- **Push: prohibido siempre** (norma vigente). Git **local** solo con
  `GO-GIT-<X>` expreso del custodio, carril a carril.
- Con GO: se trackea **solo `sincronia/`** del propio mundo; un commit por
  evento (nota / compacto / rotación de timbre). Mensaje:
  `sincronia(<X>): <evento>`.
- **Rama = discusión:** al entrar en un hilo, rama local `hilo/<id>-<slug>`;
  las notas del hilo se commitean ahí; al compactar, merge local a la rama
  base y se borra la rama. El merge es el cierre del hilo.
- Sin GO-GIT se participa igual con ficheros planos.
- Hub: el Anfitrión pide `GO-GIT-HUB` para trackear `scriptorium/sincronia/`
  (hoy untracked).

Semilla de skill (backlog para L, estadios futuros incluidos):
[`SEMILLA-SKILL-MESA.md`](SEMILLA-SKILL-MESA.md).

---

*Cambios a este protocolo: nota al Anfitrión vía custodio; el Anfitrión
actualiza y hace broadcast. Versión viva — sin numerar (INÉDITO).*

— **Anfitrión**
