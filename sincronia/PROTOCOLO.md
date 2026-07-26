# PROTOCOLO · identidad, firma y lenguaje común de la mesa

| dato | valor |
| ---- | ----- |
| Mantiene | **Anfitrión** (hub `C:\S`) |
| Vigencia | desde 2026-07-25 · toda la mesa (S · O · V · Z · G · L) |
| Rango | convención de mesa — complementa `INDICE.md`; no toca el método de los skills |
| Destino | al cierre de sesión, **L lo porta a skill** — ver §0 y regla de skillización |

---

## 0 · Parámetros del mundo (contrato skillizable)

El cuerpo normativo (§1–§10) se lee con estos nombres como **parámetros**.
La columna «calibración» es dato de instancia de ESTA mesa y **no entra al
skill** (mismo patrón protocolo ≠ datos del skill `vigilancia`).

| parámetro | rol | calibración de esta mesa |
| --------- | --- | ------------------------ |
| `CUSTODIO` | humano que valida ticks y da GO | el custodio |
| `HUB` | sesión neutra que mantiene sala, índice y protocolo | Anfitrión · `C:\S` |
| `SALA` | carpeta de sincronía del hub | `C:\S\scriptorium\sincronia\` |
| `CARRILES` | consolas con mundo propio | S · O · V · Z · G · L |
| `WORLD_ROOT(X)` | raíz del mundo del carril X | tabla en `INDICE.md` |
| `BUZON(X)` | puntero + notas del carril | `<WORLD_ROOT(X)>\sincronia\` |
| `TIMBRE(X)` | campanilla append-only | `<WORLD_ROOT(X)>\sincronia\TIMBRE.md` |
| `OUT_DIR(X)` | estación/bitácora del carril | declarado por cada carril |
| `INTERVAL` | muestreo del watcher | 45 s |
| `PLAYGROUND` | terreno común de pruebas (lectura malla) | `C:\S\scriptorium\playground\` |
| `CUADERNOS` | repo git durable de bitácoras, sincronización y handoffs | `github.com/alephscriptorium-eng/scriptorium-cuadernos` · worktrees en `C:\S\_fuentes\` |
| `RAMA(X)` | canal del carril X en `CUADERNOS` | patrón `<mundo>-vigilancia` |
| `AUDITOR` | consola en sombra (gama alta) que descarga al `HUB` y cura entregas | se auto-asigna nombre al boot (§11) |
| `META_DIR` | taller del auditor — sin git, desechable, fuera de la `SALA` | `C:\S_META\` |
| `GAMA_BAJA` | carriles cuyas notas el auditor edita por defecto (tick de ronda) | G · L · S |
| `GAMA_ALTA` | carriles que exigen tick explícito del custodio por caso | O · V · Z |

**Regla de skillización (para L):** cambios de protocolo se acumulan AQUÍ,
no en peticiones sueltas a L. Al cierre, L porta §1–§10 parametrizados por
§0; los valores calibrados quedan como fixture/ejemplo sintético.

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
- **Compactar y reemplazar.** La historia vive en la cadena de sellos
  (§10.7); el fichero vivo se mantiene **mínimo**: lo superado se
  **sustituye** — sin tachones, sin addendas acumuladas, con compactación
  retroactiva cuando el sello ya preserva lo viejo. Levantar estado debe
  ser barato: cada token del corpus vivo lo paga la ventana de contexto de
  todos los agentes.

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

### Jerarquía de fuentes — lo curado manda

1. **Fuente normativa** = la nota de tick / el informe de ronda del `HUB`,
   **validado por el `CUSTODIO`**. Eso es lo curado; sobre eso se trabaja.
2. Las notas de otros carriles son **evidencia**, no fuente: solo se leen
   las que el informe/tick vigente **cite**, y solo como detalle de lo ya
   curado. No extraen premisas nuevas.
3. **Discrepancia** entre una nota cruda y el informe → **no se adopta la
   cruda**: se eleva en tu siguiente nota (`⚠️ discrepancia` + rutas) y
   decide el custodio.
4. Lo que otro carril dijo y **no** está en informe/tick **no existe como
   premisa** para tu trabajo — aunque lo hayas visto en la malla.

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
# v0.1 — corrige defecto timbre-vacío (grep -c exit 1 duplicaba el 0 → watcher ciego)
T="sincronia/TIMBRE.md"; OUT="<OUT_DIR>/timbre-watch.log"
N=0; [ -f "$T" ] && N=$(grep -c '^PING ' "$T" || true)
echo "[$(date '+%F %T')] estacion-timbre v0: arranque · base=$N ping(s)" | tee -a "$OUT"
while :; do
  M=0; [ -f "$T" ] && M=$(grep -c '^PING ' "$T" || true)
  if [ "$M" -gt "$N" ]; then
    echo "[$(date '+%F %T')] TIMBRE: $((M-N)) ping(s) nuevos" | tee -a "$OUT"
    N="$M"
  else
    echo "[$(date '+%F %T')] tick" >> "$OUT"
  fi
  sleep 45
done
```

Reglas añadidas tras T-\*1 (casos fundantes O y Z, 2026-07-26):

- **Log propio:** si el `OUT_DIR` ya aloja otro watcher, el log se llama
  `timbre-watch.log` — un log por proceso o el lease deja de identificar
  quién está vivo (patrón V).
- **Línea de arranque obligatoria** con `base=N`: separa pings históricos de
  nuevos y sirve de evidencia de boot.
- **Encoding:** el timbre es **UTF-8 sin BOM**. Append desde Git Bash (`>>`)
  o `Add-Content -Encoding utf8`; **jamás** reescribir el fichero entero ni
  líneas ajenas. Quien rompa el timbre de otro lo declara con ⚠️ y el
  **dueño** repara/rota (caso fundante: O sobre timbre hub; reparación del
  dueño = reescritura legítima, ya ejercida por S).

### Fallback del timbre (v0.2 — el timbre es best-effort, el tick es el canal)

La escucha continua cuesta combinarla con el trabajo y hay pings que no
llegan. Regla:

1. **El canal garantizado es el TICK del custodio**, no el timbre. Un PING
   no entregado nunca pierde un mensaje: la nota sigue en el buzón del autor
   y el custodio avisa por consola.
2. **Pull-on-tick (obligatorio):** al recibir CUALQUIER tick, antes de
   procesar su alcance, el carril lee su `TIMBRE.md` **entero desde `base`**
   y reconcilia lo no visto (reporta pings pendientes; no los procesa sin
   autorización, §5).
3. **La estación puede caerse sin culpa.** Estación muerta = fila ⚠️ en el
   parte del Anfitrión, no incidente; se relanza con el siguiente tick.
4. Ritmo de esta sesión: **lento a propósito** — una nota por turno (§9);
   nadie necesita escucha en tiempo real.

**Horizonte CAMPANA (registrado, sin GO de ejecución):** cuando los carriles
estén dentro de la Ciudad (cliente MCP + nodo), la campanilla FS se sustituye
por la campana del propio dominio — `@zeus/parte-kit` (`campanasDesdeParte`)
sobre el mesh, vía `operator-bridge`. La mesa pasaría a notificarse con las
piezas que está censando: el mecanismo de reunión se vuelve caso de uso.

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

## 9 · Dinámica de sesión dirigida (vigente desde 2026-07-26)

1. **El custodio hila.** Los temas de cada ronda los fija el custodio; el
   Anfitrión **orquesta sin contenido**: registra, verifica, rutea preguntas
   al carril que corresponda y prepara ticks — no opina sobre el fondo ni
   decide agenda.
2. **Nada de conversaciones paralelas sin tick.** Los hilos planificados no
   existen hasta su TICK.
3. **Una nota por turno.** Cada consola emite como máximo una nota por tick
   recibido. Aclaraciones extra = siguiente turno o pregunta al custodio.
4. **Nada que reporte un participante se asienta sin GO explícito** del
   custodio. El Anfitrión lo registra como `⏳ reportado` y lo eleva.
5. **DRAFT permanente:** cada carril mantiene `sincronia/DRAFT.md` — su
   borrador de backlog encolable (formato compatible con `swarm-orquestacion`
   / estación: candidatos WP con alcance y CA tentativo). Se actualiza en
   cada turno que genere material. **Nada se encola sin check final del
   custodio.** El Anfitrión verifica ronda a ronda que los DRAFT estén al
   día: si el custodio dice «exportamos backlog», los seis drafts deben estar
   listos para ticks **sin ronda extra**. Los candidatos que **bloquean el
   hilado común** llevan marca literal `BLOQUEA:` (qué desbloquean y a
   quién) — son los primeros en el cherry-pick del custodio.

## 10 · CUADERNOS — memoria durable y gate de cierre

1. **`CUADERNOS` es donde se asienta lo que debe sobrevivir a las ventanas:**
   snapshot de la `SALA` (sincronización), handoffs de restauración y
   bitácoras de estación. La sala es trabajo vivo; el cuaderno es piedra.
2. **Push a `CUADERNOS` es la excepción declarada** a la norma no-push — es
   el canal de bitácora, no un mundo de obra.
3. **Custodia del asiento hub: S.** Tras cada ronda, S actualiza
   `sprint-CIUDAD/` (snapshot de sala + handoffs) en su rama y hace push.
   El punto de restauración 0 lo dejó el Anfitrión (`d399230`); desde ahí,
   la pluma es de S.
4. **Rama por carril** (`RAMA(X)`, patrón `<mundo>-vigilancia`): cada carril
   publica ahí su bitácora de estación. La bitácora **apunta** a la sala,
   no la repite.
5. **⛔ GATE DE CIERRE DE SESIÓN:** la sesión no se cierra hasta que **todos
   los carriles hayan publicado** su bitácora en su rama de `CUADERNOS`.
   Quien ya tiene rama puede subir cuando quiera; quien no, la crea ahora o
   al cierre — el gate no se negocia.
6. **Invariante «nada abajo que no esté arriba».** Todo artefacto
   meta-devops — sala, `sincronia/` de cada carril, bitácoras de estación,
   handoffs, informes — existe en `CUADERNOS` al cierre de cada ronda.
   Únicas excepciones (de cajón): `.env`, secrets, credenciales — **jamás**
   suben. Los mundos de código siguen sin push: `CUADERNOS` existe
   precisamente para que el meta no se mezcle con la obra.
7. **Cadena de sellos.** Cada ronda termina en un commit de snapshot en
   `CUADERNOS` = **sello de consenso**. El informe de la ronda *n* cita el
   hash del sello de la ronda *n−1*. Restaurar cualquier ventana = checkout
   del último sello + procedimiento de restauración del informe vigente.
   La cadena de informes+sellos es la traza del Scriptorium: nada decidido
   fuera de ella cuenta como consenso.
8. **Cerco exterior.** Los `WORLD_ROOT` **no cargan enlaces ni recursos
   externos**: ninguna dependencia de arranque, fetch vivo o montaje apunta
   fuera de `C:\S` y `C:\S_LAB`. Las fuentes externas (corpus históricos,
   wikis, repos ajenos) se **importan una vez** (censo → import validado →
   root interno) y a partir de ahí todo queda cercado dentro. Una URL/ancla
   externa solo puede sobrevivir como **metadato inerte** (sidecar de
   procedencia: `source_url`, `fetched_at`), jamás como dependencia.

## 11 · AUDITOR en sombra

Rol reproducible: una ventana nueva se activa con la frase
**«lee el protocolo — eres el `AUDITOR`, auditas a `<carriles>`, el
anfitrión es `<HUB>`. Recupera el estado y ponte a ayudar»** y este
apartado hace el resto.

### 11.1 Qué es

- **Sombra, no asiento:** sin buzón, sin `WORLD_ROOT`, no habla con los
  carriles ni deja rastro en sus mundos. Los carriles saben que existe (este
  protocolo es público en la mesa); no saben quién es ni les habla.
- **Descarga al `HUB`:** el `HUB` se queda arriba con visión del todo; el
  auditor baja al detalle. En líos/enquistes, el `HUB` lo activa en meta
  para desenquistar.
- Atiende con paciencia extra a `GAMA_BAJA` (instrucciones explícitas,
  pasos numerados).

### 11.2 Boot / restauración del auditor (en orden)

```text
1. Nombre    → auto-asígnate un nombre corto; decláralo y firma SIEMPRE (§1)
2. Taller    → lee META_DIR: HANDOFF-AUDITOR.md · CURADO-*.md (tu rol) ·
               EDIT-LOG.md · entregas/ (estado previo del rol, si existen)
3. Sesión    → lee SALA: INDICE.md → informe vigente (informes/) →
               este PROTOCOLO entero. NO leas la obra de ningún mundo.
4. Reporte   → nota corta en META_DIR: nombre + estado recuperado + listo
5. Espera    → §5 aplica: tu tick llega del CUSTODIO (vía HUB)
```

### 11.3 Permisos

| ✅ | ⛔ |
| -- | -- |
| **Lectura omnímoda de las dos raíces: `C:\S` y `C:\S_LAB`** (todo el ecosistema — es su ventaja: audita contra el estado global) | Leer o tocar **nada** fuera de esas dos raíces |
| Editar notas de `GAMA_BAJA` (tick de ronda) | Editar `GAMA_ALTA` sin tick explícito por caso |
| Escribir libre en `META_DIR` | Escribir en `SALA`, `PLAYGROUND`, `CUADERNOS` u obra de mundos |
| | Hablar con carriles · decidir · asentar · encolar |

### 11.4 Reglas de edición (lo único suyo que se conserva)

1. **Autoridad plena sobre el contenido, trazada en dos niveles.** Las notas
   que cura salen de modelos de gama inferior; el auditor ve el ecosistema
   entero y **puede corregir también la postura**, no solo la forma:
   - **Forma** (formalización, expansión, protocolo, rutas): edición
     directa, silenciosa en la nota, trazada solo en EDIT-LOG.
   - **Postura/fondo**: se expresa **libremente y con total autoridad**,
     pero **marcado** — corrección visible en el punto (`✎`) y/o bloque
     `## ADDENDA (auditoría)` al pie de la nota. La posición original queda
     legible; nada de reescritura muda del fondo.
2. Toda edición (forma y fondo) trazada en `META_DIR/EDIT-LOG.md`
   (fichero · qué · por qué).
3. Audita contra este protocolo (§1 firma · §3 TUI · §5 fuentes · §9
   una-nota/`NEXT:`/`BLOQUEA:`), contra el informe vigente **y contra el
   estado real del ecosistema** (las dos raíces).
4. **El `HUB` evalúa después:** en el merge, las marcas ✎/ADDENDA del
   auditor se pesan como voz con autoridad propia — pueden prevalecer sobre
   la nota o devolverse; decide el `HUB` y valida el `CUSTODIO`.

### 11.5 Ciclo y entregas

```text
carriles entregan → AUDITOR cura → META_DIR/entregas/R<n>-auditoria.md →
HUB merjea (informe) → CUSTODIO valida → sello en CUADERNOS (§10.7)
```

`META_DIR` es **desechable por diseño**: excepción declarada al invariante
§10.6 — el trabajo del auditor que perdura son **sus ediciones en las notas
de los carriles** (que sí viajan con la sincronía sellada) y nada más.

---

*Cambios a este protocolo: nota al Anfitrión vía custodio; el Anfitrión
actualiza y hace broadcast — L lo porta a skill al cierre (§0). Versión
viva — sin numerar (INÉDITO).*

— **Anfitrión**
