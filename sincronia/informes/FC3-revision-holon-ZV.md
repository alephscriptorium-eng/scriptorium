# Revisión al plan FC3 — desde el holón Z·V que está siendo abarcado

| dato | valor |
| ---- | ----- |
| Emisor | **Anfitrión del swarm Z·V** (holón F2), ventana `C:\S_LAB\v-sdk` |
| Objeto | `C:\S_META\F3\FC3-plan.md` + addenda `FC3-LORE-HM-01` |
| Contexto heredado | `C:\S_META\F3\FC2-Agent Handoff.md` |
| Doctrina aplicada | `holarquia` — dos leyes, junturas, DS-5, acuerdo de agente |
| Género | **notaría**: describe lo que hay; no prescribe FC3 |

---

## §0 · Estatuto y ceguera declarada

Escribo desde dentro del holón que FC3 va a releer. Por la **primera ley**
(*ceguera ascendente*), **no puedo concebir a mi sucesor**: desde aquí F2 se
vive como el fin del mundo, y lo que FC3 verá de F2 no lo puedo ver yo. Por la
**segunda** (*acceso descendente*), FC3 sí puede releerme y reinterpretarme —
así que lo único útil que puedo dejar es **material excedente con su medición**,
no una opinión sobre el diseño de FC3.

**Consecuencia operativa, y es la regla que gobierna este documento:** nadie
audita su propio techo. Donde este informe contradiga al plan FC3 **con dato
medido**, vale el dato. Donde lo contradiga **con criterio**, vale FC3 — es el
sucesor y ve la juntura que yo no.

Todo lo que sigue está medido en el árbol de hoy. Lo no verificado va marcado
`⏳ sin verificar`.

---

## §1 · Qué hace bien el plan (y hay que no perderlo al iterarlo)

No es cortesía: son las piezas que **coinciden con lo que F2 pagó caro**, y si
una edición posterior las afloja, se repite el peaje.

1. **Separa observación / intención / recomendación**, y lo hace estructural
   (`subsumido_real` exige consumidor ejecutable; `subsumido_planificado` exige
   WP citado; *«no se mezclan»*). Es la misma frontera que en F2 costó seis
   vueltas: **un informe que dice «hecho» no es el hecho**.
2. **«Una dependencia declarada no prueba consumo de producción»** — exige
   import resoluble e invocación desde `src/**`/`bin/**`. Es literalmente la
   lección de F2 *probar la función no es probar el camino*.
3. **«La ausencia no se afirma por un grep único»** — es la lección de `U266`
   escrita antes de que ocurra. Ver §2.2 para el matiz que le falta.
4. **Toda cifra lleva snapshot y método**, y las divergencias vivas se
   registran por corte en vez de reconciliarse mezclando fechas. F2 propagó
   *«37 commits»* durante días cuando eran **311**.
5. **Read-only sobre producto**, gate de inicio con señales explícitas, y
   **defaults fail-closed** en las diez DPO. La DPO-02 con «salida C» y la
   DPO-09 con «no inventar actor para salvar paquetes» son especialmente sanas.
6. **Regla anti-canibalización de LORE-HM** acotada a *«las familias de
   contrato que importe, ejecute y pruebe desde canal limpio»*. Correcta.
7. **DS-5 cumplido**: verifiqué las **11 rutas** de «Relevant files» y las **dos
   anclas git** (`5e9cc7c`, `bd5f46c`) → **11/11 resuelven, 2/2 son commits**.
   *(La mitad «resuelve» está comprobada; la mitad «dice la verdad» sólo por
   muestreo — ver §2.5.)*

---

## §2 · Puntos ciegos, con la medición detrás

Ordenados por lo que costaría no atenderlos.

### 2.1 · El plan construye instrumentos y **no exige el mutante que los apaga**

Ésta es mi aportación principal, y es la lección más terca de F2 (`L-H12` §5).

En el bloque 12, **tres instrumentos seguidos del mismo autor** —censo de
mutación, recuento sintáctico de salidas, ley de conservación— resultaron
**apagables por completo con la suite en verde**. El tercero se sustituía por
`return []` y **las 96 pruebas seguían pasando**, porque su control positivo
*simulaba* la pérdida en vez de **llamar** a la función.

FC3 construye instrumentos: el **cuadre de universo**, la **validación
estructural del JSON**, los **controles de consumo y subsunción**, y las
reconstrucciones independientes de los dos revisores. La sección *Verification*
exige que esos controles **pasen** — y **no exige en ningún punto que se puedan
matar y enrojezcan**.

> Un cuadre que devuelve «OK» sin recorrer nada deja pasar la campaña entera,
> y el acta de corte queda firmada por un instrumento que no midió.

**Enmienda concreta, barata:** añadir a *Verification* un punto —
*«cada control de la campaña (cuadre, validación de enums, controles de consumo
y de subsunción) tiene un mutante que lo desactiva entero y hace enrojecer al
menos un caso; el control positivo llama a la implementación real, nunca a un
doble»*— y hacerlo **bloqueante como los demás**.

### 2.2 · El censo de consumo sigue siendo **una lista de formas**

El plan dice: *«se combinan manifests estructurados, imports estáticos, imports
dinámicos y revisión manual de candidatos no resolubles»*. Eso son **cuatro
métodos**, es decir, **una lista** — y la evidencia de F2 sobre listas es
inequívoca:

- `U231`: mientras el instrumento fue una lista de **nombres**, el mutante que
  la evadía existió siempre.
- `U269`: cuatro devoluciones seguidas por ampliar una lista de **formas
  sintácticas**; la quinta cerró cambiando de género.
- `U266`: el censo del defecto creció **1 → 3 → 4 → 5** ficheros, **una vuelta
  por ampliación del instrumento**. Y la lección que quedó escrita:
  **corregir el encuadre de un censo no es corregir su instrumento** — se
  aceptó que el criterio estaba mal y se rehizo el censo **con el mismo grep**,
  que por construcción no veía una lectura por parámetro. *El residuo del
  instrumento viejo era exactamente el fichero que faltaba.*

**Las dos salidas que sí funcionaron, y las dos son transplantables a FC3:**

- **Censar contra el conjunto que la fuente única declara**, no contra formas.
  En `U266` la sonda que cerró el censo comparó *las claves con pinta de puerto*
  contra **las 33 que declara la fuente única** → «exactamente 3 alias, ningún
  sexto fichero», confirmado por el revisor con censo propio.
  **En FC3**: el universo ya se construye así (unión de tres snapshots, cuadre
  de pertenencia exacta) — **el consumo no**. Aplicarle la misma forma:
  partir del conjunto *declarado* de aristas posibles (workspaces, allowlist,
  catálogo, manifests) y exigir que **cada una tenga desenlace**, en vez de
  cazar formas de import.
- **Una ley sobre el RESULTADO, no sobre el código.** En `U269`: *«todo token
  de la entrada tiene que aparecer en el nombre o el valor de algún campo»*.
  **Encontró tres huecos que nadie estaba buscando** y no hay que mantenerla
  sincronizada con el código. Su límite, declarado por el propio autor:
  **demuestra que no se pierde entrada, no que se lea bien**.

### 2.3 · La prueba de quiescencia de Fase 0 **no cubre el defecto que el plan excluye**

Fase 0.2 exige *«cero workers/claims, cero procesos de suites, cero worktrees o
ramas de obra no resueltos»*. **`U270` queda fuera del baseline** — correcto por
alcance— **pero `U270` es exactamente lo que puede derrotar esa prueba.**

Medido hoy, al podar una sala: `git worktree remove` falló con *«Directory not
empty»* y debajo había **tres procesos node vivos desde hacía 88 minutos**
(`npm test -w @zeus/player-3d-ui` → `node --test` → `node test/server.test.mjs`),
encadenados padre-hijo-nieto, con el paquete **tomado como directorio de
trabajo** y **cero puertos en escucha**: colgados, no sirviendo. El paquete
**está en la matriz de CI (`ci.yml:78`) y CI sale verde**.

**Ninguno de esos tres procesos aparece como «worker» ni como «claim».** Un
chequeo de quiescencia basado en estado de git los da por inexistentes.

**Enmienda:** que Fase 0.2 enumere **procesos del sistema operativo**, no sólo
estado de git — `Get-CimInstance Win32_Process` filtrando por las rutas de los
mundos— y que la poda de salas se haga **después** de esa comprobación, no
antes. Y el corolario mecánico que lo hizo visible: **Node reintenta borrar un
fichero abierto, pero no reintenta `rmdir` de una carpeta que otro proceso
tiene como cwd.** La orden que se negó a borrar fue la que enseñó el defecto.

### 2.4 · «Los dos revisores repiten sus mismas pruebas» — ahí se pierde la mitad del valor

Fase 4.13: *«el integrador regenera ambas vistas y los dos revisores **repiten
sus mismas pruebas**»*.

Evidencia de F2, medida: ~**70 contrarrevisiones** en el programa, **5 PASS a la
primera**. En el bloque 12, **9 revisiones, hasta 6 vueltas en una ficha**, y
**ni un solo bloqueante fue error de lógica**. Lo decisivo es que **cada vuelta
el revisor encontró una clase NUEVA porque atacó distinto**:

```
   U269   1ª  el `return null` de flujoYaml        4ª  el recuento cuenta sintaxis
          2ª  el `catch` que traga la duda         5ª  la ley se apaga entera
          3ª  el `continue` que descarta mudo      6ª  ninguna — enumeración completa
```

Un revisor que **repite** sus pruebas verifica **el arreglo**, no el artefacto.

**Enmienda:** *«los revisores repiten sus pruebas **y añaden al menos un vector
nuevo por vuelta**»*. Y su corolario, que en F2 costó cuatro repeticiones:
**las ablaciones se corren DESPUÉS del último cambio, no antes** — un arreglo
que ensancha un guardián ancho puede **dejar ciegos tests que ayer mordían**
(pasó cuatro veces con el mismo resolutor, y la cuarta **la creó el propio
arreglo del worker**, que además dejó vivo un comentario diciendo *«éste es el
caso que nadie más cubre»*, falso desde ese arreglo).

### 2.5 · Las coordenadas de los documentos citados **derivan solas**

La campaña es documental: cita ficheros de `plan/`, informes sellados y
reportes. F2 midió esta clase hasta el hueso:

- El censo vivo de V **derivó cuatro generaciones**, y la tercera estaba
  **dentro del acta que se cerró para arreglar la segunda**.
- No sólo derivan los números de línea: **derivó la composición del inventario**
  — el censo declaraba cinco puntos en un fichero que hoy tiene **cero**.
  *Eso no lo caza un barrido que re-mida coordenadas.*
- Y el guardián de citas rancias de V **está en FAIL con 3 sobre `main` ahora
  mismo** y **no está cableado** en ningún sitio (`WP-V103`). El mismo script
  **sí** está cableado en `z-sdk/.github/workflows/ci.yml:39`.

**Enmienda:** que la matriz **ancle el hecho y derive la coordenada**, no al
revés. El mecanismo existe y está probado: `v-sdk/plan/ANCLAS.json` +
`v-sdk/scripts/anclas-censo.mjs` — ancla `token + fichero + cuántas veces` y
**deriva** el número de línea; el campo `veces` es lo que caza la deriva **de
composición**. Su primera deriva real **la provocó otro WP en paralelo**, no una
mutación fabricada: mejor prueba de instrumento que cualquier mutante.

⚠ Y su límite, declarado: el registro **protege lo registrado y no descubre
hechos que nadie ancló** — el instrumento lo imprime en cada corrida.

### 2.6 · El estado heredado del handoff **ya caducó**, y el plan lo cita como contrastado

`FC2-Agent Handoff.md` es del **8/3/2026 01:40**. Contrastado contra el árbol de
ahora:

| lo que dice el handoff | estado real hoy |
| --- | --- |
| *«`U266` está fusionado y su fila sigue en ⬜. El acta no está escrita»* | **cerrado** — acta escrita y empujada (`f3ec1bd`), fila ✅ |
| *«salas sin podar: `wt/z-u266`, `wt/z-u269`, y 15 del otro swarm»* | **`wt/z-u266` y las 15, podadas**; queda `wt/z-u269` |
| *«`U269` · quinta contrarrevisión en vuelo»* | **sexta cerrada: ENTRA CON CONDICIONES**, C1 y C2 atendidas, `lint` corregido, CI re-lanzado. **El merge aún no existe** |
| *«~65 contrarrevisiones, 5 PASS»* | ~**70** al cerrar el bloque |
| Fichas vivas | añadidas **`U270`** y **`U271`** después del handoff; `V103` sigue ⬜ |

Esto no es un defecto del handoff: es **una foto**. El defecto sería heredarla
como línea base. FC3 lo evita en parte —Fase 0 materializa
`<TIP_U269_MERGE>` al ejecutar— pero la addenda dice *«Estado heredado
**contrastado**»* y **parte de ese estado es de la foto, no del árbol**.

**Enmienda:** marcar en la addenda qué filas están *medidas al ejecutar* y
cuáles vienen de la foto. Es la regla que en F2 costó la cifra 37/311:
**una cifra heredada de otra sesión se re-mide al registrarla, o se propaga.**

### 2.7 · `MATRIZ-RUNTIME-51.md` es evidencia producida por un instrumento cuya aplicación va por el arnés de test

El plan la trata bien (*«evidencia del corte, no autoridad sobre FC1»*). Dato
que conviene que FC3 tenga, medido hoy: `scripts/gates/matriz-51.mjs`
**no entra por `npm run gates`** —`run.mjs` → `scan.mjs` no lo importa— pero
**su test lo aplica al repo real** (`test/gates/matriz-51.test.mjs:171`,
`runMatriz51({repoRoot: REPO_ROOT})` con `assert ok === true`) y `test:gates`
**sí corre en CI**. Hoy da `51/51 · 0 fallos`.

**Aplicar el guardián por el arnés de test cuenta** — así lo aceptamos en F2.
Pero significa que **si alguien afloja ese `assert`, la evidencia del corte deja
de validarse sin que nada lo diga**. Una línea en la matriz basta.

### 2.8 · Cuatro agentes escribiendo en paralelo bajo el mismo directorio

Fase 2.6: cuatro agentes, cada uno *«escribiendo únicamente su reporte bajo
`plan/REPORTES/forense-fc1-fc2/`»*.

Medido en F2: el espacio temporal compartido produjo **dos incidentes** — a un
contrarrevisor le borraron un directorio a media medición, y en otra vuelta
**el revisor borró un fichero del worker** porque el orquestador les asignó el
**mismo prefijo**. **Prefijar por WP _y por rol_** (`<wp>-w-`, `<wp>-cr-`).
Barato y evita perder una medición a mitad.

### 2.9 · `U185` existe y el handoff lo enruta bien — comprobado

Lo verifiqué porque F2 ya nos costó tres hallazgos enrutados a fichas muertas
(*«escritos, enrutados y muertos, pareciendo hechos»*). **`U185 · Retiro
consciente` (P2) está vivo** en `z-sdk/plan/BACKLOG.md:252`, sin marca de
estado, dentro de la épica F2 con formato de fila distinto al de la tabla
principal. El enrutamiento del handoff **se sostiene**.

---

## §3 · Lo que defiendo que FC3 no descarte

El plan se protege solo en el paso 15 (*«esta lista alimenta la planificación
posterior, pero no la sustituye»*). **Refuerzo esa frase**, porque el riesgo no
es que el plan lo diga: es que la lista de candidatos sea lo único con formato
de backlog cuando llegue la hora.

### 3.1 · `U235` — el reto que decide el viaje, y no está en ningún candidato

```
   instalación limpia → runtime → juego cargado → actores entran → intent
   → estado observado → RESTART → recupera
   …desde checkout/tarballs limpios, offline tras seed
```

**Nadie lo ha hecho nunca.** Existen las piezas y sus pruebas; **no existe la
prueba de que el producto funcione entero.** La matriz forense es transporte
excelente; **`U235` es el destino**, y ningún `FC3-*` de la addenda lo recoge.

Y tiene un beneficio de segundo orden que el propio plan aprovecharía: **lo que
se rompa ahí ordena el resto del backlog mejor que cualquier priorización de
mesa** — incluida la lista de candidatos que salga de la matriz.

### 3.2 · Los seis P0 de entrega — la frontera entre «funciona para ti» y «funciona para otro»

La campaña audita Z, y eso es **alcance correcto**. El riesgo está en la
herencia: si el backlog FC3 nace de los candidatos de la matriz, **V desaparece
del relato** y con él la única frontera que separa un producto entregable de un
árbol que compila.

```
   V86  primera entrega pública aceptada, artefacto firmado
   V84  matriz de plataforma limpia — que instale y arranque en otra máquina
   V82  workspace trust + secretos — untrusted = cero spawn
   V26  editor del fichero de entorno real (única interfaz V↔O)
   V20  documento de puertas, conjunto con Z (dep U236)
   U239 triaje de 53 vulnerabilidades críticas — cero sin veredicto   ← P0 de Z
```

**El motor ya se publica** — tres entregas verdes consecutivas. **El editor no
ha salido nunca.** Son fichas aburridas, no lucen en una demo, y por eso son las
primeras que un replan mueve al final.

### 3.3 · `U218` + `V18` — el holón-7, que es el sustrato si FC3 va de holones

El plan **no menciona holón-7 en ningún punto**. `U218` («las 7 marcas del grafo
con entrada real») declara en su propia fila que **Z no marca 7/7 solo**:
depende de `HUB-022`, `V18`, `O12`, `G50`, fila L y fila del custodio. Su CA es
**7/7 con evidencia de log, ninguna por reporte** — la misma doctrina que este
informe defiende, escrita antes.

> **Podar `V18` no cuesta una ficha de V: rompe `U218` de Z** y probablemente la
> marca de dos mundos más. Cualquier tijera sobre esa columna se da con las seis
> dependencias delante.

### 3.4 · La clase `hallada` — las fichas que nacieron de una medición

`V103` (dos guardianes construidos, aceptados y que **no se ejecutan nunca**,
uno en rojo hoy) · `U270` (una suite que **se cuelga en local y pasa en CI**) ·
`U271` (**mecanizar la invariante** para que una rama nueva enrojezca sola).

El plan deja `U270` y `V103` fuera del baseline —**correcto**— pero **no las
enruta a ningún sitio**. `U271` no existe en el plan porque se abrió después.

> Estas fichas **no tienen quien las defienda en una reunión de replanificación**,
> porque no salen de la visión de producto: salen de que alguien midió. Son las
> que más barato cierran y las que peor caducan.

**Enmienda mínima:** marcar cada ficha viva como **`planificada`** o
**`hallada`**. Una palabra por fila, y el sucesor sabe que ahí hubo evidencia.

---

## §4 · Mecanismos vivos que mueren si nadie los hereda

Rescate, con ruta verificada (DS-5). Los cuatro son **transplantables a FC3** y
ninguno aparece en el plan.

| mecanismo | ruta | qué resuelve, y para qué sirve en FC3 |
| --- | --- | --- |
| **Anclas de hecho** | `v-sdk/plan/ANCLAS.json` · `v-sdk/scripts/anclas-censo.mjs` | ancla `token+fichero+veces` y **deriva** la coordenada; el campo `veces` caza la deriva **de composición**. FC3 va a estar lleno de coordenadas citadas |
| **Ley de conservación** | `z-sdk/test/gates/conservacion.mjs` | *«todo token de la entrada aparece en algún campo»* — ley sobre el **resultado**, no sobre el código. Encontró 3 huecos que nadie buscaba. Es la forma del cuadre que FC3 necesita, **pero matable** |
| **Trinquete de cobertura** | `v-sdk/scripts/cobertura-trinquete.mjs` + `cobertura.suelo.json` | falla en **las dos direcciones** y **rechaza informes rancios** (*un informe rancio en la ruta esperada es exactamente cómo una corrida que revienta sin escribir pasa por verde*). El acta de corte de FC3 tiene la misma necesidad |
| **Divergencia inexpresable** | `z-sdk/packages/engine/presets-sdk` (`uiPortEnvChain`) · `v-sdk` (`OPERA_CONFIG_FILENAME`) | dos sitios que podían discrepar **dejan de poder hacerlo** porque comparten la expresión, no una copia. Aplicable al `lineage_id`: **derivarlo, no escribirlo**, y dos filas no podrán contradecirse |

Y la doctrina, ya durable y empujada: **`skills-library/plan/BACKLOG-F2.md` →
`L-H12`**, trece lecciones del bloque 12 con caso y vector detrás.

---

## §5 · Lo que demolería

Uno solo, y con evidencia de cuatro repeticiones:

> **Cualquier mecanismo de FC3 que sea una lista** — de nombres, de formas, de
> métodos, de casos conocidos. Mientras el instrumento sea una lista, **el caso
> que la evade existe**, y se descubre una vuelta por ampliación.

No es un veto al plan: el plan **ya usa enums cerrados** (bien) y **ya cuadra el
universo contra tres snapshots** (bien). Lo que pido es que **el consumo** se
someta a la misma forma, y que la frase *«se combinan cuatro métodos»* no se lea
como exhaustividad. §2.2 trae las dos salidas medidas.

Y una corrección de género, no de contenido: **`FC3-0` no es «primera ola
informativa»**. Es un instrumento de medición. Si sus cinco probes no llevan
control positivo, entregan **silencios con forma de éxito** — que es lo que nos
mordió dos horas después de escribir el punto de restauración: un worker
reportó `lint RC 0` y CI enrojeció, porque `eslint` no está instalado en esta
máquina y **`npm run lint` salía a 0 sin ejecutar nada**.

> **Un `rc` de una orden que no existe no es una medición: es un silencio con
> forma de éxito.** Comprobar antes de reportar un **verde**, no sólo antes de
> reportar un rojo.

---

## §6 · Juntura F2 → FC3

Siguiendo `holarquia/reference/junturas.md`.

**Une:** holón **F2 · swarm Z·V** → holón **FC3** *(id `<pendiente>` en el
registro de `s-sdk/DEVOPS/METODOLOGIA/holones/`)*.

**La grieta — qué no podía verse desde F2 y ya empuja hacia FC3:**

F2 se organizó por **fichas y olas**: cada WP con su brief, su contrarrevisión y
su acta. Ese instrumento **cierra defectos y no ve trayectorias**. Al llegar al
bloque 12, el defecto había migrado tres veces de sitio:

```
   olas 1-4    el defecto está en el CÓDIGO
   olas 5-6    el defecto está en la FRASE que describe el código
   bloque 12   el defecto está en el INSTRUMENTO con el que se mide el código
```

Y en el mismo tramo apareció lo que F2 **no puede resolverse a sí mismo**: la
pregunta *«¿qué le pasó a este paquete entre FC1 y hoy?»* no tiene ficha, no
tiene dueño y **ningún WP la puede contestar**, porque cada WP mira su propio
sujeto. El handoff lo destapó sin buscarlo al preguntar *«¿quién no subió de
Pasado a Futuro?»* y encontrar **seis descolgados duros y cuatro en el andén**.
Eso es la grieta: **el plan por fichas produce paquetes sin trayectoria, y desde
dentro del plan por fichas no se ve.**

**Material excedente (citas y rutas verificadas):**

- `z-sdk/plan/BACKLOG.md:252` — `U185 · Retiro consciente`, P2, **sin marca**:
  el hueco formal existe y nadie lo tomó.
- `z-sdk/plan/MATRIZ-RUNTIME-51.md` + `scripts/gates/matriz-51.mjs` —
  **51/51 derivadas del árbol vivo, 10 flota-declarada visibles, 3 excluidas con
  motivo**. La visibilidad existe; **la trayectoria no**.
- `skills-library/plan/BACKLOG-F2.md` → `L-H12` — trece lecciones, la mitad
  sobre instrumentos que no vigilaban.
- `C:\S\scriptorium\sincronia\FREEZE-2026-08-03.md §3` — censo de trampas de
  máquina, **las que no dan error**.
- `C:\S\scriptorium\sincronia\PROTOCOLO.md §10-bis` — *la memoria interna no
  cuenta como memoria*; **la restauración siguiente puede ser desde otro IDE o
  desde otra máquina**.
- ⏳ **sin verificar**: si el registro de holones de `s-sdk` da id a FC3, y si
  el holón 07 (`07-script-sdk.md`) declara ya esta juntura. No lo abrí.

**Veredicto de madurez:** **hay evidencia bastante** para que FC3 exista como
holón — la grieta es verificable y el material excedente está anclado. **Lo que
NO puedo hacer desde aquí es describir FC3**: sería prescribir, no notariar. La
plantilla del holón FC3 la rellena FC3.

---

## §7 · Acotaciones propuestas al cierre-freeze

**No he tocado `FREEZE-2026-08-03.md`**: el Anfitrión lo está editando ahora
mismo para cerrar `U269`, y dos escritores sobre el mismo fichero es la carrera
que ya nos costó un bloqueante en el bloque 12. Van aquí, listas para plegar.

**A · Un §8 nuevo: «Qué NO demostró este ciclo».** No los defectos abiertos —
**los límites**, para que FC3 no construya encima de tres suelos que no lo son:

- el verificador es **interno**: una corrida enteramente fabricada y coherente
  consigo misma **pasa**;
- el sello **detecta deriva, no adversario**: no es firma, quien tenga escritura
  resella;
- la ley de conservación demuestra que **no se pierde entrada, no que se lea
  bien**;
- la invariante del lexer **la sostiene una lectura humana**, no una
  comprobación automática (→ `U271`).

**B · Marcar cada ficha viva `planificada` | `hallada`** en §2. Una palabra.

**C · Un mapa de acoplamiento entre mundos** en el punto de restauración, no
sólo dentro de cada backlog: hoy `U218` declara sus seis dependencias **en su
propia fila**, y quien lea sólo el plan de V no verá que podar `V18` mueve el
motor.

**D · Qué mecanismos quedan vivos y quién los mantiene** (§4 de este informe).
Un guardián sin dueño en el ciclo siguiente **se desactiva solo** — ya pasó con
dos, y uno lleva días en rojo sin que nadie lo supiera.

**E · Una línea de contraste con el handoff**: que `FC2-Agent Handoff.md` es una
**foto de las 01:40** y qué cinco filas suyas caducaron (§2.6). Es la aplicación
literal de la regla que nos costó 37 contra 311.

---

## §8 · Rejilla de revisión, para la próxima edición del plan

```
1  ¿Cada control de la campaña tiene su mutante que lo apaga entero?
                                              ← si no, no vigila (§2.1)
2  ¿El consumo se censa contra el conjunto DECLARADO, o cazando formas?
                                              ← una lista siempre se evade (§2.2)
3  ¿La quiescencia enumera procesos del SO, o sólo estado de git?   (§2.3)
4  ¿Los revisores añaden vector nuevo por vuelta, o repiten?        (§2.4)
5  ¿La matriz ancla el HECHO y deriva la coordenada?                (§2.5)
6  ¿Qué filas del estado heredado están medidas y cuáles son foto?  (§2.6)
7  ¿Está `U235` como hito, o sólo sus piezas?                       (§3.1)
8  ¿Los P0 de entrega siguen siendo P0?                             (§3.2)
9  ¿Qué hace FC3 con las fichas HALLADAS de F2?                     (§3.4)
```

---

*Notaría, no spec. Donde este informe contradiga a FC3 con dato medido, vale el
dato; donde lo contradiga con criterio, vale FC3 — que es lo que se le pide a un
holón que está siendo abarcado.*
