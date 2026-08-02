# HANDOFF · swarm LORE-HM

| dato | valor |
| ---- | ----- |
| De | **Anfitrión del swarm Z·V** (`C:\S_LAB\z-sdk` + `C:\S_LAB\v-sdk`) |
| Para | **Vigía** y **Orquestador** del swarm LORE-HM |
| Fecha | 2026-08-02 |
| Orden | del **product owner**: swarm independiente, con estación de vigilancia propia |
| Gobierno | `C:\S\scriptorium\plan\GOBIERNO-LORE-HM.md` — **léelo entero antes de despachar nada** |

---

## 1 · Lo que recibes

**Diecinueve fichas ya escritas, ninguna con worker.**

- Hub `plan/BACKLOG-F2.md`, lane **LORE-HM**: `WP-HUB-100`–`113` (catorce).
- `s-sdk` `plan/BACKLOG-F2.md`, lane **LENGUA**: `WP-SDK-L01`–`L05` (cinco).
- Gate propio **`GHM`**.

Nacen de la cola A del intake `WPS_QUEUE` de S, promovida el 2026-08-02. El
material original sigue en `C:\S_LAB\s-sdk\WPS_QUEUE\` y **es cantera**: se
cita, no manda. Lo que manda son las fichas y el gobierno.

## 2 · Tus dos raíces

```
WORLD_ROOT primario    C:\S\scriptorium        (obra: playground/)
WORLD_ROOT secundario  C:\S_LAB\s-sdk          (lengua y notaría)
```

Todo lo demás es **sólo lectura**, y dos zonas lo son para todo el mundo:
`C:\S_LAB\a-sdk` y `C:\Users\aleph\OASIS\**` son cantera; se importa **una
vez, en build-time, con manifiesto sellado**, jamás como dependencia viva.

**Frontera con mi swarm** — un solo punto de roce y ya está cortado:
`C:\S\scriptorium\sincronia\**` es **mío** (la sala). Lees este handoff; no lo
editas. Todo lo demás del hub, incluida la lane entera, es tuyo. Yo no toco
`playground/` ni `s-sdk/` a partir de este documento.

Calibración exacta de la estación en **§3 del gobierno**. Un aviso que ahorra
una hora: al despachar, `WORLD_ROOT` = `CANONICAL_WORLD_ROOT` = **el worktree**,
rutas con `/`, y `DOWNSTREAM_PATTERNS` que **no cubra el worktree** o el
preflight da `LOCK`. La convención viva es `C:\S_LAB\wt\<mundo>-<wp>`;
cualquier `C:/S_LAB/.worktrees/…` que veas en el material del intake está
**caducado**.

## 3 · Tres hechos medidos hoy que te ahorran el primer tropiezo

**① Ninguno de tus dos mundos tiene CI que verifique nada.** Hub y `s-sdk`
tienen un solo flujo, `docs.yml`. Ni una prueba, ni un gate. Por eso
`WP-HUB-113` es P0 y va en la ola 0. **Hasta que exista, todo verde es local y
hay que escribirlo así en cada aceptación.** Nosotros cerramos **tres olas** con
el CI en rojo porque nadie lo miró; `gh` estaba autenticado desde el principio.

**② Los submódulos de `e-sdk` están sin inicializar.** `git submodule status`
da `DocumentMachineSDK`, `AgentLoreSDK`, `VectorMachineSDK` y `VectorMachineUI`
con prefijo `-`. El material vivo de la Future Machine sólo existe hoy en
OASIS, que es cantera RO. **Esto condiciona directamente el spike.**

**③ Las dos piezas de Onfalo que el plan nombra EXISTEN en disco.**
`2024-05-01_primero-de-mayo.md` y `2026-05-01_auge-de-la-educacion-emocional.md`,
en el corpus de editoriales de `onfalo-asesor-sdk`. Verificado por mí hoy. El
fixture import-once es construible.

## 4 · Por dónde empezar: `WP-HUB-112`, y sólo eso

El product owner formuló la pregunta que abre esta rama:

> *«me intriga si realmente H y M pueden usarlo para operar procesos reales con
> materiales de Onfalo en la Future Machine»*

`WP-HUB-112` **es esa pregunta convertida en encargo**, y bloquea la lane
entera. No es un trámite: su veredicto puede reordenar o tumbar fichas de las
seis olas siguientes, y eso es exactamente lo que se le pide. Su CA exige un
veredicto en tres columnas —**corre / no corre / no existe**— pieza a pieza,
con la orden exacta y su salida literal. **Nunca por lectura de documentación.**

Si la respuesta es «no corre», el mismo reporte dice cuál de las once fichas
restantes cae o cambia de forma. Un «no» medido a tiempo vale más que seis olas
construidas sobre un supuesto.

## 5 · El método, con sus cicatrices

Va entero en §4 del gobierno. Lo que de verdad importa, en tres líneas:

- **La contrarrevisión adversarial es el corazón.** El revisor reintenta
  vectores; no re-ejecuta la suite del worker. De ~40 en este programa, **2
  pasaron a la primera**. Presupuesta **2-4 vueltas** por gate o pieza de datos.
- **El defecto casi nunca está en el código: está en la frase que lo describe.**
  Alcance declarado más ancho que la evidencia. Todos nuestros bloqueantes
  fueron eso.
- **Nada se despacha sin GO.**

## 6 · Lo que compartimos y no se puede separar

1. **Atención humana**: un product owner y un scrum root para dos frentes.
2. **Una dependencia técnica real**: `WP-HUB-100` y `105` exigen reusar los
   schemas publicados de `@zeus/linea-kit`. Sus tipos públicos son `U245` en
   **mi** cola. Mientras no aterricen, consumes el paquete **sin tipos** y lo
   declaras; no lo finges.
3. **Auditoría cruzada**: por petición del product owner, mi swarm te auditará
   de vez en cuando. Será **read-only y adversarial** — reintento de vectores
   contra lo que ya aceptaste, no relectura de tus reportes. Avisaré antes.

## 7 · Estado del contexto que heredas

```
hub      C:\S\scriptorium     main, sincronizado · 64 fichas · CERO entregadas
s-sdk    C:\S_LAB\s-sdk       main, sincronizado · 40 fichas en F2
z-sdk    C:\S_LAB\z-sdk       f5c7309 · CI verde · publicación NUNCA en verde
v-sdk    C:\S_LAB\v-sdk       46c55a1 · CI verde
worktrees 0 · ramas wp/* 0 · los cuatro mundos al día con su remoto
```

Tu mundo primario **no ha entregado nada todavía**. Eso no es deuda: es que
nunca se despachó. Empieza contando eso como lo que es.

---

— **Anfitrión del swarm Z·V**. Buena caza.
