> ⚠⚠ **FOTO CADUCADA — NO ES ESTADO. Se asienta como traza, no como fuente.**
>
> Exportada a las **01:40** del 2026-08-03. El swarm siguió trabajando **tres
> horas más** después de esta captura, así que **varias de sus filas ya eran
> falsas al escribirse este aviso**. `PLAN-FC3.md` lo trata bien: *«todo estado
> heredado de un handoff se marca `foto` hasta re-medirlo»*.
>
> **Caducado y medido al congelar (2026-08-03, tips en `FREEZE-2026-08-03.md`):**
>
> | dice la foto | estado real al freeze |
> | ------------ | --------------------- |
> | `U266` pendiente de acta | **aceptada**, merge `626cb8d`, acta escrita |
> | `wt/z-u266` viva | **podada** (y debajo había 3 procesos colgados 88 min → `U270`) |
> | 15 salas del hub registradas | **podadas las 15**; el hub queda con una |
> | `U269` en 5.ª revisión | **aceptada en la 6.ª**, merge `2c167dc`, CI verde |
> | swarm en vuelo | **congelado**: 0 salas, 0 ramas `wp/*`, 0 sucio en los 4 mundos |
>
> **Por qué se guarda igual**: la foto conserva el razonamiento del relevo y las
> preguntas que se hacía, que no están en ningún otro sitio. Lo que no conserva
> es el estado — y ésa es exactamente la distinción que `L-H12 §13` deja escrita:
> *una cifra heredada de otra sesión se re-mide al registrarla, o se propaga.*

# Swarm Z·V instructions review
_Exported on 8/3/2026 at 01:40:50 GMT+2 from Cursor (3.14.7)_

---

**User**

¿Qué tan claro ves estas instrucciones? Responde solo con una nota de uno a diez y pequeño wishlist si tuvieras que adoptar el rol:

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  CROQUIS DE RELEVO · Anfitrión swarm Z·V                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

## 1 · Quién eres y para quién

Orquestador del swarm **Z·V**. El custodio es **Product Owner, no scrum root**: se le reporta en **lenguaje de caso de uso con TUI** (cajas, columnas alineadas). El scrum root sí lee el backlog crudo.

```
   Z   C:\S_LAB\z-sdk      motor / runtime FOSS
   V   C:\S_LAB\v-sdk      editor / extensión VS Code   ← cwd por defecto
   ―   C:\S\scriptorium    hub del OTRO swarm (LORE-HM, ya cerrado)
   ―   C:\S_LAB\s-sdk      del otro swarm
   ―   C:\S_LAB\wt\        salas de trabajo (worktrees)
```

**Cantera, sólo lectura para todos**: `g-sdk`, `a-sdk`, `e-sdk`, `C:\Users\aleph\OASIS`.

## 2 · El método, en seis líneas

```
   1 WP = 1 worker en background = 1 rama wp/* = 1 worktree en C:\S_LAB\wt\
   preflight  verificar-identidad-raiz.mjs   (skills-library/skills/vigilancia/scripts/)
              WORLD_ROOT = CANONICAL_WORLD_ROOT = el worktree, rutas con /
   ciclo      obra → contrarrevisión → push → ESPERAR CI → merge → CI del merge
              → acta en el BACKLOG → push → poda de la sala
   los workers NUNCA empujan.  Empujas tú.
```

**La contrarrevisión es el corazón.** Es **sólo lectura** y **reintenta el ataque** — no vuelve a correr la suite del worker, que la escribió él. ~65 en el programa, **5 PASS a la primera**. Los briefs de revisión que funcionan llevan: los blancos numerados, los vectores exigidos, y *«qué intentaste y NO conseguiste romper»* como sección obligatoria.

## 3 · Dónde está cada cosa

```
   backlog + actas     <mundo>/plan/BACKLOG.md          (hub: BACKLOG-F2.md)
   decisiones custodio z-sdk/plan/DECISIONES.md          (van numeradas ⑧⑨⑩⑪⑫)
   gobierno            <mundo>/plan/GOBIERNO-EJECUCION-F2.md
   prácticas           v-sdk/plan/PRACTICAS.md §7   acta cerrada vs documento vivo
   reportes por WP     <mundo>/plan/REPORTES/WP-*.md
   censo vivo de V     v-sdk/plan/CENSO-V12.md      ← deriva sola, 4 generaciones
   memoria del rol     ~/.claude/projects/C--S-LAB-v-sdk/memory/
                       └─ anfitrion-swarm-scriptorium.md   ← LEE ESTO PRIMERO
```

**El fichero de memoria tiene las reglas completas.** No las repito aquí: están ahí con su medición y su origen. Este croquis sólo dice **dónde mirar y cómo operar**.

## 4 · Estado en el momento del relevo

```
   Z main   626cb8d   merge U266   ·  CI del merge estaba EN COLA, sin confirmar
   V main   633a31b   acta V101    ·  CI verde en tip y en merge

   ✅ B12: V101, V102, U266     ⬜ V103 (abierta, sin empezar)
   🔄 U269 · quinta contrarrevisión en vuelo, con listón de decisión puesto
```

**⚠ PENDIENTE CRÍTICO: `U266` está fusionado y su fila del BACKLOG de Z sigue en ⬜.** El acta no está escrita. Es **exactamente el hueco contable reincidente** de este programa. Ciérralo antes que nada, tras confirmar la corrida verde de `626cb8d`.

Además: **salas sin podar** — `wt/z-u266`, `wt/z-u269`, y **15 del otro swarm en el hub** (la poda me la bloqueó el clasificador de permisos; están ya sin la trampa del junction).

## 5 · Trampas que ya cobraron peaje

```
   tubería      | wc -l  o  | grep -c  sobre orden que FALLA da 0 y parece prueba
   Node         named export de builtin: el binding se fija al instanciar
   ESM          mutar y medir en el MISMO proceso → la caché devuelve el original
   CRLF         un patrón de ablación multilínea NO ENCAJA y sale verde mudo
   cobertura    informe rancio en la ruta esperada = corrida que revienta sin escribir
   entorno      el npm ci de esta máquina está INCOMPLETO: rojo local ≠ rojo en CI
   scratchpad   COMPARTIDO con otras sesiones: prefija por WP **y por rol**
   frontera     npm_config_logs_dir en todo npm · git --no-optional-locks en árbol ajeno
   poda         desenlazar junctions UNO A UNO; un borrado recursivo se lleva el destino
```

## 6 · Lo que no se toca

- **`push --force` prohibido**, permanentemente. Si una rama ajena no admite avance, se empuja bajo nombre propio (`wp/zv-*`).
- **VPS diferido**: sólo nuestra codebase.
- **Decisión ⑫**: la autoría `you@example.com` del historial publicado **se queda**. Cerrada, no vuelve a la cola.
- **OASIS fuera de alcance** por orden del PO. No levantarlo.

## 7 · Las tres preguntas que hago siempre al aceptar

1. **¿El negativo se verificó desactivando su guardián** — y al desactivarlo, se distinguió *«nadie disparó»* de *«saltó OTRO guardián»*?
2. **¿El instrumento nuevo tiene su propio mutante que lo apaga entero** y enrojece?
3. **¿La lección que el worker escribe está aplicada a su propia obra**, o sólo al defecto que la produjo?

La tercera es la que más ha rendido: en este bloque, dos workers que no se conocen formularon la regla correcta y **ninguno se la aplicó**.

---

**Cursor**

**8/10**

**Wishlist**
- Comando/URL canónica para confirmar CI verde de `626cb8d` (y qué checks cuentan).
- Formato exacto del prefijo scratchpad (`WP` + rol) y ruta del fichero.
- Un renglón de “primera acción” ordenada: CI U266 → acta → poda `z-u266`/`z-u269` → estado U269.
- Lista mínima de las 15 salas del hub a podar (paths), o criterio fail-closed de cuáles tocar.

---

**User**

Vamos ahora punto por punto de las instrucciones, explicando y viendo de mejorar, primer tramo.

---

**Cursor**

Voy al primer tramo (identidad, audiencia y mapa de repos) y lo contrasto con lo que haya en memoria/plan del rol para proponer mejoras concretas.

## Tramo 1 — Quién eres y para quién

### Qué está haciendo bien

Tres cosas en poco espacio:

1. **Rol** — orquestador del swarm Z·V, no worker ni scrum root.
2. **Audiencia del reporte** — PO = casos de uso + TUI; scrum root = backlog crudo. Eso evita el error clásico de “hablarle al PO en jerga de ficha”.
3. **Mapa de raíces** — Z/V propias, hub/s-sdk del otro swarm, `wt/` como salas, cantera en sólo lectura.

Eso es exactamente lo que un relevo necesita en los primeros 30 segundos: *quién soy, a quién le hablo, dónde puedo escribir*.

### Dónde se nubla

| Hueco | Por qué importa |
| --- | --- |
| No dice el **producto** | En memoria es Scriptorium; el croquis salta directo a Z/V. Un agente nuevo no sabe qué está orquestando. |
| `―` en scriptorium/s-sdk | Se entiende “no mío”, pero no el **modo de acceso**: ¿read-only siempre? ¿sólo si el PO pide auditoría? La memoria sí lo aclara; el croquis no. |
| Cantera sin verbo operativo | “Sólo lectura para todos” es correcto, pero no dice *para qué* (consultar, copiar patrón, nunca mergear). |
| `cwd por defecto = V` | Bien, pero no dice qué pasa si el WP es de Z: ¿cambiar cwd al worktree o al hub Z? |
| Falta la frontera con LORE-HM | En memoria: `scriptorium/sincronia/**` es tuyo; el resto del hub y todo `s-sdk` son suyos. Eso evita un relevo que “ayude” en el hub cerrado. |

El croquis mezcla **identidad** (quién) con **topología** (dónde). Está bien juntos; el riesgo es que la topología se lea como permiso de escritura en todo lo listado.

### Propuesta de mejora (mismo tramo, más fail-closed)

```text
## 1 · Quién eres y para quién

Anfitrión-orquestador del swarm **Z·V** (producto Scriptorium).
Custodio = **PO**: reportar en casos de uso + TUI (cajas, columnas).
Scrum root: backlog crudo / actas. No mezclar registros.

Escritura propia (cwd por defecto = V; por WP = su worktree):
   Z   C:\S_LAB\z-sdk      motor / runtime FOSS
   V   C:\S_LAB\v-sdk      editor / extensión VS Code
   wt  C:\S_LAB\wt\        salas  <mundo>-<wp>  (única zona de obra)

Ajeno — no escribir salvo orden explícita del PO (entonces read-only adversarial):
   hub C:\S\scriptorium    LORE-HM (cerrado; tuyo sólo sincronia/**)
   s   C:\S_LAB\s-sdk      LORE-HM

Cantera — consulta; nunca commit/push/merge desde aquí:
   g-sdk · a-sdk · e-sdk · C:\Users\aleph\OASIS
```

### Por qué sube claridad

- Separa **escritura / ajeno / cantera** en tres verbos, no en una tabla plana.
- Ancla producto + nombre de rol (“Anfitrión”) al mismo sitio que la memoria.
- Deja el `cwd` con regla de excepción (WP → worktree).
- Cierra la trampa de “el otro swarm está en el mapa ⇒ puedo operarlo”.

### Mini-checklist de adopción (solo este tramo)

Al aceptar el relevo, las tres comprobaciones baratas serían:

1. ¿Puedo nombrar qué es mío y qué no, sin abrir el backlog?
2. ¿Sé a quién reporto en TUI y a quién en ficha?
3. ¿Sé que OASIS/cantera no se levantan ni se mergean desde este rol?

Si quieres, el siguiente tramo es el **§2 · método en seis líneas** (preflight, ciclo, contrarrevisión, “los workers nunca empujan”).

---

**User**

 memoria del rol     ~/.claude/projects/C--S-LAB-v-sdk/memory/
                       └─ anfitrion-swarm-scriptorium.md   ← LEE ESTO PRIMERO

El fichero de memoria tiene las reglas completas. No las repito aquí: están ahí con su medición y su origen. Este croquis sólo dice dónde mirar y cómo operar.

---

**Cursor**

Ese párrafo define el **contrato del croquis**: índice operativo, no duplicado de la doctrina. Tiene sentido; el riesgo es que el relevo se quede a medias si el puntero falla.

## Qué afirma ese tramo

Hay una **jerarquía de fuentes**:

| Capa | Función |
| --- | --- |
| Memoria (`anfitrion-swarm-scriptorium.md`) | Doctrina + medición + origen (“por qué esta regla existe”) |
| Croquis | Índice: dónde mirar, estado del relevo, cómo operar *ahora* |

Eso es sano: evita que el croquis se convierta en un segundo libro que se desincroniza.

## Dónde chirría en la práctica

**1. “LEE ESTO PRIMERO” vs “cierra U266 antes que nada”**  
El croquis manda leer ~340 líneas de memoria *y* manda cerrar el hueco contable primero. Un adoptante no sabe el orden real. En operación, el orden útil es:

1. confirmar CI / acta crítica (§4),  
2. *después* leer memoria para no repetir trampas en lo que sigue.

**2. La memoria no es sólo reglas**  
Tiene método, lecciones, **estado de bloque (B12)**, cola viva y decisiones. Mezcla **doctrina durable** con **ledger del día**. El croquis dice “reglas completas”; en realidad es “reglas + bitácora”. Eso diluye el contrato.

**3. El puntero es de un runtime concreto**  
Ruta bajo `~/.claude/projects/C--S-LAB-v-sdk/…`. Si el relevo entra por Cursor en otro cwd (`s-sdk`, `z-sdk`, worktree), ese fichero **no se carga solo**. “Está ahí” ≠ “está en contexto”.

**4. El croquis ya rompe su propia regla**  
Dice no repetir… y repite trampas (§5), no-tocar (§6) y las tres preguntas (§7). Bien elegido: son el **mínimo portable** si la memoria no está a mano. Lo que falta es declararlo así, no fingir DRY total.

## Mejora propuesta (mismo espíritu, más fail-closed)

```text
## Memoria del rol (doctrina)

LEE si está accesible (orden: después del PENDIENTE CRÍTICO del §4):
   ~/.claude/projects/C--S-LAB-v-sdk/memory/anfitrion-swarm-scriptorium.md

Ahí viven reglas con medición y origen.
Este croquis NO las sustituye. Si choque croquis ↔ memoria:
   · estado / commits / “haz esto ya”  → gana el croquis (§4)
   · método / trampas / no-tocar       → gana la memoria
     (salvo que el croquis cite una decisión numerada más nueva)

Si el fichero no está en contexto: abre esa ruta a mano.
Si no existe: opera solo con este croquis + BACKLOG/DECISIONES
y marca ⚠ doctrina incompleta al PO.
```

## Criterio de corte (qué sí repetir en el croquis)

Repetir solo lo que **cuesta peaje en la primera hora** si no se lee la memoria:

- workers no empujan  
- contrarrevisión = ataque read-only  
- `push --force` prohibido  
- hueco contable post-merge  
- las 3 preguntas de aceptación  

Todo lo demás: puntero + “no inventes; mide”.

En una frase: el diseño es correcto; falta **orden de lectura**, **regla de conflicto croquis/memoria**, y admitir que el croquis es el **kit de supervivencia**, no un índice vacío.

---

**User**

Vamos ahora a poner el foco en z-sdk, si puedes "imaginar" el backlog completo, y vamos mapeando el directorio de paquetes marcando (pasado/actual/futuro) husmeando en su historial backlog. IMPORTANTE READONLY Y NO TOCAR GIT QUE ESTÁN TRABAJANDO EL SWARM. Vamos de overview a detalle. Primero overview del directorio, ¿son bastantes, no?

---

**Cursor**

Overview de `z-sdk` en solo lectura: inventario de `packages/` y lectura del backlog, sin tocar git.

Sí: **son bastantes**, pero no un caos plano — están en **tres capas** + demos.

## Overview `z-sdk/packages/`

Workspaces del root (`package.json`):

```text
packages/engine/*     ← bibliotecas del runtime
packages/mesh/*       ← procesos / UIs / sistemas que corren
packages/editor/*     ← app de estación
examples/*            ← demos (fuera de packages/, mismo monorepo)
```

| Capa | Cuántos (aprox.) | Rol |
| --- | ---: | --- |
| **engine** | **~26** | kits y contratos (`protocol`, `presets-sdk`, `rooms`, `*-kit`, …) |
| **mesh** | **~21** | runtimes y superficies (`*-system`, MCP, UIs, WebRTC, …) |
| **editor** | **1** | `editor-ui` |
| **examples** | **2** | `game-demos`, `ping-pong-bots` |
| **Total útil** | **~50** | + anidados (`operator-ui/threejs-ui-lib`, fixtures de test) |

Eso cuadra con el backlog: matriz **51/51** de superficie runtime, allowlist de publish por **clases** (A–G), no “un WP por carpeta”.

## Cómo leerlo (sin entrar aún a pasado/actual/futuro)

```text
engine/     lo que se importa y se publica (o aspira a ello)
mesh/       lo que se arranca (MCP, sockets, juegos, monitores)
editor/     la estación (no SDK publicable — clase F)
examples/   demo / harness (clase E)
```

`packages/arg` aparece en el backlog histórico; **hoy no está** bajo `packages/` (refundación / demolición — lo mapeamos en el detalle).

## Backlog en una frase (contexto del mapa)

- Vivo: `plan/BACKLOG.md` (ÉPICA F2 + sprints cerrados encima).
- Archivo: `BACKLOG-HISTORICO.md` (olas 0–10).
- `BACKLOG-F2.md` = puntero absorbido.
- Abiertos que asoman ya: **`U269` ⬜** (detector de claves) y **`U178` ⬜** (publish-ready `linea-editor`, en pausa histórica). En el tablero actual **`U266` ya figura ✅** (el croquis de relevo iba retrasado en ese punto).

**Veredicto overview:** ~50 paquetes es un monorepo **grande pero legible** si se piensa por capa + clase de publish, no como lista plana.

Siguiente paso natural: mapa **engine → mesh → editor** marcando pasado/actual/futuro según historial del backlog (sigue sin tocar git). ¿Seguimos por `engine/` primero?

---

**User**

engine

---

**Cursor**

Mapeo de `packages/engine` contra el backlog: inventario de paquetes y señales pasado/actual/futuro.

## `packages/engine` — 26 paquetes

Leyenda del mapa (por **presión del backlog**, no por edad del código):

| Marca | Significa |
| --- | --- |
| **P** pasado | Nacido/cerrado en olas 0–10 o sprints; hoy base estable |
| **A** actual | Territorio caliente F2 / B11–B12 (tocado o recién cerrado) |
| **F** futuro | WP abierto o cola tipada que lo apunta |

Un paquete puede llevar dos marcas (p. ej. **P+A** = cimiento que sigue quemando).

---

### 1 · Contrato y autoridad (cimiento ola 1)

| Paquete | Rol | P/A/F |
| --- | --- | --- |
| `protocol` | Envelope, roles, ACL, Peer Card | **P** U10/U155 · **A** lecturas `scopes` (U262) |
| `authority-kit` | Tick, intents, ledger | **P** U11 |
| `player-mcp-kit` | MCP-por-actor | **P** U12 |
| `playbook-kit` | Método CASOS | **P** U13 |

### 2 · Transporte y rooms

| Paquete | Rol | P/A/F |
| --- | --- | --- |
| `socket-core` | Socket.IO client/server | **P** U159–U161 · U196 lo rodeó sin editarlo |
| `rooms` | Cliente rooms / peercard en vivo | **P** · **A** U187/U251/U262 |
| `room-client-browser` | Cliente browser SET_STATE | **P** U01 |
| `webrtc-signaling` | Signaling + SSB DM | **P** U88/U90 · **A** U197/U251 |

### 3 · Plano de datos (carril D) — el núcleo caliente

| Paquete | Rol | P/A/F |
| --- | --- | --- |
| `linea-kit` | Schemas VOLUMES, loader, viaje | **P** U80 · **A** U200–U206, U245, U256, U264 |
| `volumes-ops` | import/purge/ledger | **P** U40 · **A** U253a/b/c, U255, U268 |
| `presets-sdk` | Catálogo MCP + env/puertos | **P** · **A** **U266 ✅** (puerto mal formado) |
| `firehose-core` | Browse/schema firehose (lib) | **P** U01 |
| `feed-kit` | Familias de feed | **P** (feeds unificados) |

### 4 · HTTP y proyección

| Paquete | Rol | P/A/F |
| --- | --- | --- |
| `http-contract` | RouteEntry, OpenAPI, →MCP | **P** U172 (R13) |

### 5 · Dominio narrativo / ciudad (kits F2)

| Paquete | Rol | P/A/F |
| --- | --- | --- |
| `story-board-schema` | Schema actos→widgets | **P** U174 |
| `reparto-kit` | Personajes/permisos dominio | **P** U173 |
| `acta-kit` | ActaDeBarrio | **P** nascido · **F** **U246** tipos |
| `parte-kit` | ParteDeCiudad | **P** (plaza) |
| `embajador-kit` | Peercard mínima / startpack | **P** |
| `lifecycle-kit` | XState leaf/aggregate | **P** |

### 6 · UI browser-safe (libs, no apps)

| Paquete | Rol | P/A/F |
| --- | --- | --- |
| `ui-kit` | Shell HTML compartido | **P** |
| `ui-3d-kit` | Three.js ESM | **P** U156 types |
| `view-kit` | Vistas 3D+HTML | **P** U20/U96 |
| `app-shell` | Bootstrap UI | **P** · rozado en U266 (puertos) |
| `game-engine` | Gamemap puro | **P** (game-agnostic D-8) |

### 7 · Soporte

| Paquete | Rol | P/A/F |
| --- | --- | --- |
| `test-utils` | Helpers smoke MCP | **P** |

---

## Lectura en una mirada

```text
CALIENTE AHORA     linea-kit · volumes-ops · presets-sdk · rooms/protocol (gates)
CIMENTADO          protocol · authority · player-mcp · playbook · socket-core
CIUDAD / NARRATIVA acta · parte · embajador · lifecycle · reparto · story-board
UI LIBS            ui-* · view-kit · app-shell · game-engine   (poco fuego en Z hoy)
COLA TIPADA (F)    acta-kit ← U246; luego mesh (U247–U248), no engine
```

**Futuro engine explícito en tablero:** casi solo **`U246` → `acta-kit`**.  
**`U269`** (detector de claves) es `scripts/gates`, no un paquete engine — roza el corpus/`linea-kit` schemas, pero el owner es el gate.

**Ya no viven en engine** (histórico): `startpack-*`, `arg-*` — salieron del mapa de refundación; el backlog viejo aún los nombra.

---

Si quieres el siguiente zoom: **carril D** (`linea-kit` + `volumes-ops` + `presets-sdk`) con WPs P→A→F en cadena, o el cluster **protocol/rooms/signaling**.

---

**User**

Espera, vamos a cambiar el enfoque para listar homogeneidad en los paquetes. Desde la vista futuro con backlog acabado, ¿qué paquetes no subido de Pasado a Futuro y han quedado descolgados?

---

**Cursor**

Cambio de lente: con el backlog F2 “acabado”, ¿qué paquetes de `engine` nacieron en Pasado y nunca tuvieron ola/WP que los subiera? Cruzo inventario vs menciones en F2.

## Lente: “backlog F2 acabado” → quién nunca subió

Homogeneidad útil aquí no es “mismo tamaño”, sino **misma trayectoria**:

| Trayectoria | Criterio |
| --- | --- |
| **Subió a Futuro** | F2 (o cola tipada) lo nombra como **sujeto** de un WP |
| **Descolgado** | Nació en Pasado (ola 1–refundación) y en F2 **no tiene WP propio** — solo eco, tipos de higiene, o silencio |

La MATRIZ ya avisa la forma común: **26/26 engine son `lib`**, **0 en catálogo de flota**. El descolgado no es “no arranca”; es **no tiene segunda vida en el plan**.

---

### Quién sí subió (contraste)

```text
carril D     linea-kit · volumes-ops · (+ firehose-core/feed-kit como escritores migrados)
identidad    protocol · rooms · webrtc-signaling · embajador-kit (U188)
env/flota    presets-sdk
ciudad tipada acta-kit → U246
narrativa    reparto-kit · story-board-schema → U219 (horizonte)
HTTP/Zigurat http-contract → U172 (hecho; cola R13 en pausa)
transporte   socket-core (Sprint 7 + contexto U196)
```

---

### Descolgados duros (Pasado → ∅ Futuro)

Estos son los que, con el backlog “terminado” en la cabeza, **quedan fuera del relato F2**:

| Paquete | Nació | Por qué descolgado |
| --- | --- | --- |
| **`playbook-kit`** | U13 | Única huella F2: script `e2e:playbook-kit` **roto** (U223). Sin WP de método/CASOS en F2. Consumidores de juego (`arg-*`) fuera del mapa. |
| **`player-mcp-kit`** | U12 | Sin WP F2 propio. Catálogo aún declara `arg-player-*` / `pozo-player` / `solve-player` con `workspace: null` — el patrón MCP-por-actor quedó **sin actores**. |
| **`parte-kit`** | kit ciudad | Hermano de `acta-kit`, pero **U246 tipa acta y no parte**. Cero ficha F2 con su nombre. |
| **`lifecycle-kit`** | kit ciudad | Lib XState sin deps `@zeus`. Lane F habla de árbol/barrio (`U216`) vía mesh/`ciudad-lifecycle`, **no de este kit**. |
| **`game-engine`** | motor de juegos | Refundación lo dejó game-agnostic; F2 no lo vuelve a encargar. Sigue como dep de `ui-3d-kit`, sin ola propia. |
| **`test-utils`** | helpers | Nunca producto ni F2; soporte de smoke. |

---

### Soft-descolgados (vivos como dep, sin segunda ola)

No están muertos, pero **no graduaron**:

| Paquete | Nota |
| --- | --- |
| **`room-client-browser`** | Tests U01 + lote tipos; peercard F2 pasó por `rooms`/`signaling`, no por aquí. |
| **`view-kit`** | Pesado en Pasado (U20–U22/U113); en F2 solo aparece como **dep** de `reparto-kit`. |
| **`ui-kit` / `ui-3d-kit` / `app-shell`** | Shells; F2 los roza (puertos/tipos), no los planea. |
| **`authority-kit`** | Emite peercard y sale en briefs R13; **ningún U18x lo tiene como título**. Plano unificado = U188 → embajador, no authority. |

`firehose-core` / `feed-kit` están en zona gris: **sí los tocó el carril D** (sellado/import/matar escritor), pero no como “futuro de producto” con ficha propia post-GD.

---

### Lectura operativa

```text
DESCOLGADOS DE PRODUCTO     playbook-kit · player-mcp-kit · game-engine
DESCOLGADOS DE CIUDAD       parte-kit · lifecycle-kit   (acta sí tiene U246)
DESCOLGADOS DE HIGIENE      test-utils
EN U185 (retiro consciente) encajan varios de arriba + mesh threejs-ui-lib
COLA TIPADA ENGINE          solo linea-kit ✅ y acta-kit ⬜ — el resto ni entra
```

**Respuesta corta:** los que no subieron de Pasado a Futuro y quedan descolgados son, sobre todo, **`playbook-kit`**, **`player-mcp-kit`**, **`parte-kit`**, **`lifecycle-kit`**, **`game-engine`** y **`test-utils`**; con **`room-client-browser` / `view-kit` / shells / `authority-kit`** en el andén (deps vivas, sin tren F2).

El hueco formal del propio backlog para esto es **`U185 · Retiro consciente`** (P2): auditar piezas sin consumidor — hoy está ⬜ y es exactamente esta lista.

---

**User**

Para cada uno, por qué y cómo subsume el futuro o si warning fue punto ciego.

---

**Cursor**

Para cada descolgado: por qué quedó fuera, si el futuro lo subsume, o si es punto ciego. Miro consumidores reales y el relato del backlog.

## Por paquete: subsumido vs punto ciego

Criterio: *¿el futuro F2 absorbe su función en otro sitio, o el plan dejó de mirarlo mientras el código/catálogo mienten?*

---

### 1. `player-mcp-kit` — **punto ciego**

| | |
| --- | --- |
| **Por qué** | Nació para MCP-por-actor de juegos (`arg`/`pozo`/`solve`). Esos workspaces salieron; F2 priorizó peercard/rooms/datos, no actores. |
| **Consumidor hoy** | Nadie en `packages/` (solo fixture de tipos en `http-contract`). |
| **Futuro** | No lo subsume: el catálogo **sigue** anunciando `arg-player-*` / `pozo-player` / `solve-player` con `workspace: null`. |
| **Veredicto** | Ciego doble: kit huérfano + flota fantasma. U185/U233 ya lo rozan; nadie lo tituló. |

---

### 2. `playbook-kit` — **mitad subsumido, mitad ciego**

| | |
| --- | --- |
| **Por qué** | Método CASOS atado a jugadores ARG; e2e raíz roto (U223). F2 no reabre “evidencia por playbook”. |
| **Consumidor hoy** | `editor-ui` (`listCasoIds` / `checkPlaybookCoherence` al materializar packs). CLI aún habla de puertos `argPlayer`. |
| **Futuro** | Parte **subsumida** en editor (coherencia de pack). La vía MCP→actor **no**: murió con los players. |
| **Veredicto** | Ciego si se lee como “producto CASOS vivo”; OK si se declara “validador de pack del editor”. Falta esa decisión explícita. |

---

### 3. `parte-kit` — **subsumido en mesh; ciego en cola tipada**

| | |
| --- | --- |
| **Por qué** | Plaza/boletín; F2 Lane F espera modelo de G (`U216`), no tipado de kits. |
| **Consumidor hoy** | `operator-bridge` (import real). |
| **Futuro** | Función va por **bridge + operador**, no por WP del kit. |
| **Veredicto** | Runtime OK. Ciego de gobierno: **U246 tipa `acta-kit` (0 consumidores) y no `parte-kit` (sí los tiene)**. |

---

### 4. `acta-kit` — **futuro planificado sin cable; riesgo de ciego invertido**

*(No estaba en “duros”, pero es el espejo de `parte`.)*

| | |
| --- | --- |
| **Por qué** | Entró en cola tipada (U246) como kit ciudad “limpio”. |
| **Consumidor hoy** | **Cero** fuera de sí mismo. |
| **Futuro** | El plan lo sube; el grafo no. Sin `operator-bridge`/plaza que emita actas, tipar es pulir un huérfano. |
| **Veredicto** | Warning: **Futuro de papel sin subsumidor**. Antes de U246, preguntar quién escribe ActaDeBarrio. |

---

### 5. `lifecycle-kit` — **subsumido (bien)**

| | |
| --- | --- |
| **Por qué** | Genérico sin dominio; F2 nombra el **servicio** `ciudad-lifecycle`, no el kit. |
| **Consumidor hoy** | `ciudad-lifecycle` (`runtime` / `project` / cascada). |
| **Futuro** | `U216`/`U217` activan semántica de barrio **encima** del kit; el kit sigue siendo la máquina de estados. |
| **Veredicto** | No descolgado de producto: descolgado de **título de ficha**. Homogéneo con “lib bajo mesh”. |

---

### 6. `game-engine` — **subsumido (bien)**

| | |
| --- | --- |
| **Por qué** | Tras D-8 es motor agnóstico; F2 no es “hacer juegos”, es runtime/datos/identidad. |
| **Consumidor hoy** | `player-3d-ui`, `ui-3d-kit`, `editor-ui` (p. ej. `vaivenDosNodos`). |
| **Futuro** | Vive bajo superficie 3D/editor; no necesita ola F2 propia. |
| **Veredicto** | Silencio de backlog = correcto, no ciego — salvo si se espera un juego de producto otra vez (entonces sí hay hueco). |

---

### 7. `test-utils` — **infra; no aplica “subir a Futuro”**

| | |
| --- | --- |
| **Por qué** | Helpers de smoke; no es feature. |
| **Consumidor hoy** | Casi toda la mesh MCP. |
| **Futuro** | Sigue siendo arnés; un WP solo si rompe CI/local (p. ej. roots VOLUMES). |
| **Veredicto** | No descolgado: **correctamente fuera** del relato de producto. |

---

### Soft (para no mezclar)

| Paquete | Subsume / ciego |
| --- | --- |
| **`room-client-browser`** | **Subsumido** por UIs mesh (`player-*`, `webrtc-viewer`, `3d-monitor`, `operator-ui`). Peercard F2 endureció `rooms`/signaling; este cliente es el otro lado del cable. |
| **`view-kit`** | **Subsumido** por monitores 3D + `reparto-kit`. Sin WP F2 = deps estables. |
| **`authority-kit`** | **Ciego parcial**: emisión canónica de sala quedó en el relato; uso real medido hoy en **blobstore** (fixtures), mientras U188 apunta a unificar con **embajador**. Tres emisores, un WP que aún no cierra. |
| **`ui-kit` / `ui-3d-kit` / `app-shell`** | **Subsumidos** como shells; F2 no debe titulárselos salvo regresión (puertos = `presets-sdk`). |

---

## Tabla rápida

| Paquete | ¿Futuro lo subsume? | ¿Warning ciego? |
| --- | --- | --- |
| `player-mcp-kit` | No | **Sí** — kit + catálogo fantasma |
| `playbook-kit` | Solo rol editor | **Sí** si se cree producto CASOS; no si se declara validador de pack |
| `parte-kit` | Sí → `operator-bridge` | **Sí** asimetría tipada vs `acta-kit` |
| `acta-kit` | En cola, sin cable | **Sí** — tipar huérfano |
| `lifecycle-kit` | Sí → `ciudad-lifecycle` + U216 | No |
| `game-engine` | Sí → 3D/editor | No (salvo nuevo juego) |
| `test-utils` | N/A (infra) | No |
| `authority-kit` | Debería → U188 | **Sí** — plano peercard aún partido |

**Patrón:** los ciegos de verdad son **huérfano con catálogo mentiroso** (`player-mcp-kit`) y **prioridad tipada al revés** (`acta` sin consumidores / `parte` con ellos). El resto o está bajo un mesh que sí tiene futuro, o es infra/shell que no debía “subir de ola”.

