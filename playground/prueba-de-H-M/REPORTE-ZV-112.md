# REPORTE-ZV-112 · cierre de WP-HUB-112 bajo condiciones

| dato | valor |
| ---- | ----- |
| worker | swarm Z·V (`worker-V`) |
| fecha | 2026-08-02 |
| rama | `wp/hub-112-hm-spike-viabilidad` |
| worktree | `C:/S_LAB/wt/scriptorium-wp-hub-112` |
| preflight | `identidad-raiz: PASS` · world-real = git-toplevel = `c:/s_lab/wt/scriptorium-wp-hub-112` · `READ_ONLY_ROOTS` = z/v/s/a/e-sdk + skills-library · `DOWNSTREAM_PATTERNS=[]` |
| alcance | `playground/prueba-de-H-M/**` + el conflicto de `plan/BACKLOG-F2.md` |
| veredicto de partida | ENTRA CON CONDICIONES (auditoría adversarial) |
| 2.ª ronda | **NO ENTRA** (contrarrevisión adversarial) → corregido aquí · §7 |

---

## 0 · Rebase — trivial, y el conflicto resuelto conservando **los dos lados**

Base anterior: `e7ceda0`. Base nueva: `c44ee91` (tip `main`). Los dos commits
de la rama se re-aplicaron; **el único fichero en conflicto fue
`plan/BACKLOG-F2.md`**, en los dos commits y en dos sitios cada vez.

Regla del programa aplicada al pie de la letra: **cada lado aporta su fila y no
se elige.** Ninguna línea de `main` se borró y ninguna de la rama se descartó.

| sitio | `main` aportaba | la rama aportaba | resultado |
| ----- | --------------- | ---------------- | --------- |
| bitácora de cabecera (`:11`) | fila ola 0 con run-ids de `113` y `ci-lore-hm.yml` | fila ola 0 con el **veredicto NO CORRE** y la ruta del reporte | **las tres filas**, en orden: la de `main`, la de `03a0511` y la de `71937bb` |
| ficha `WP-HUB-112` (`:410`) | bloque «Aceptado en rama … commit `03a0511`» | bloque «PRIMERA DE LA LANE … ruta de la contrarrevisión» | **los dos bloques**, uno tras otro |

Verificación: `git diff --numstat main..HEAD -- plan/BACKLOG-F2.md` → **`13  0`**,
es decir **+13 / −0**. Cero líneas eliminadas. El resto del diff (`spike/*`) es
alta de ficheros nuevos.

---

## 1 · Lo que resiste, re-medido hoy

Dos cosas de este spike aguantaron la auditoría, y las dos siguen en pie:

**(a) Dice qué parte de la ceremonia no puede demostrar, con sección propia.**
Sigue ahí (`## Qué de la ceremonia 100–107 no se puede demostrar hoy`), ahora
además **etiquetada** como razonada, no medida (§4).

**(b) Su veredicto sigue siendo cierto.** Re-medido hoy, sin tubería:

```
node ".../e-sdk/DocumentMachineSDK/package.json"          → exit=1
node ".../DocumentMachineSDK/.../bartleby.agent.md"       → exit=1
npm --prefix ".../DocumentMachineSDK" run                 → exit=127
test -f ".../DocumentMachineSDK/package.json"             → exit=1
git ls-tree HEAD -- package.json                          → (vacío: ausente en el commit)
command -v bartleby / cristalizador / pipeline            → exit=1 ×3
```

Los componentes siguen **sin `package.json`** —y ahora se sabe que falta **en
el commit**, no sólo en disco— y **ausentes del PATH**. El veredicto no se
toca. Lo que se corrige es cómo se dice y una cicatriz que lo contradecía.

**Retirada en la 2.ª ronda:** esta lista incluía antes
`ls-tree -r … | grep -icE … → 0`. Era un `grep -c` sobre **un flujo vacío**:
el recorrido recursivo del árbol muere por el pack degradado. Retirada y
rehecha subárbol por subárbol — §7·B2. El veredicto **no dependía de esa
pata**.

---

## 2 · Condición ① · la cicatriz de log de la línea 148

`medidas-literales-2026-08-02.txt` registra `exit=0` en `:103`, `:113` y `:148`
para tres órdenes que fallaron. La addenda manuscrita `:253-256` corrigió dos y
**dejó `:148` sin corregir**. Ese `exit=0` es el de
`node C:/S_LAB/e-sdk/DocumentMachineSDK/package.json`, cuya salida literal —dos
líneas más arriba— es `Error: Cannot find module`. La evidencia literal
**contradecía al informe** en uno de los dos fallos que lo sostienen.

Por qué `:256` no lo cubre: `e_sdk_bartleby_exit=1` corrige la línea `:150`
(`test -f …/bartleby.agent.md`), que es **otra orden**. La `:148` se quedó
huérfana.

**Causa medida, no excusa:** las órdenes se capturaron a través de tubería
(`… 2>&1 | head`, `| tee`). En bash, `$?` tras una tubería es el estado del
**último eslabón**, no el del comando medido. Un log que mide exit codes a
través de un pipe no mide exit codes.

**Arreglado diciendo qué pasó, no borrando.** Las líneas `:103`, `:113` y
`:148` **siguen exactamente donde estaban**. Se anexó al pie del log un bloque
`######## ADDENDA ZV` que: nombra las tres líneas una por una, explica el
mecanismo, y re-mide sin tubería. Prueba de que es puro anexo:

```
diff <(head -258 medidas-literales-2026-08-02.txt) <copia previa al cambio>
→ (sin diferencias)   ·   258 líneas originales intactas byte a byte
```

---

## 3 · Condición ② · el árbol auditado, anclado

El log identificaba lo auditado con rutas y **10 conteos `bytes=`**, sin un solo
`rev-parse`, rama ni tag. Un veredicto sobre un árbol sin anclar es
**infalsificable por nombre**.

| árbol | commit | rama | limpio |
| ----- | ------ | ---- | ------ |
| OASIS `DocumentMachineSDK` — **el árbol del veredicto** | `0d65d068c8a0f2c7ab36e5ca4130658f4ddc4880` | `integration/beta/scriptorium` | **no se puede saber** — índice corrupto, `status` aborta `rc=128` (§7·B1) |
| OASIS `onfalo-asesor-sdk` — corpus editorial | `d049e01ce4a33bc53fa0d34518ee7f15bc38da93` | `integration/beta/scriptorium` | **sí** — `rc=0`, `stdout` 0 líneas, `stderr` vacío |
| `C:/S_LAB/e-sdk` | `e4b34a870df266c181846110a63438f103e26b80` | `main` | — |
| `C:/S_LAB/a-sdk` | `936196f3682edec1934c9b5a09297ac65fdd107f` | `integration/beta/scriptorium` | — |

**Corregido en la 2.ª ronda.** La columna «limpio» decía «sí (0 sucios)» para
`DocumentMachineSDK`. Ese `0` era el recuento de líneas de
`status --porcelain | wc -l`, y `status` **no dice «0 sucios»: no dice nada**,
aborta con `rc=128`. El de `onfalo-asesor-sdk` era y sigue siendo cierto.

Y los blobs exactos de lo auditado: `bartleby` `4665614…`, `cristalizador`
`7c35c1c…`, `pipeline` `f6629b2…`, dos editoriales `7dcc6fa…` / `38a47e3…`, y
—añadido en la 2.ª ronda, porque era la única fila sin anclar— `worker.py` de
`escribiente-whisper` `353d8bf…` (`ls-tree -r HEAD -- workers` → `rc=0`).

**Refuerzo que la 1.ª ronda dejó fuera:** `e-sdk` no materializa el submódulo
pero **sí registra qué commit espera**. `git -C e-sdk ls-tree HEAD --
DocumentMachineSDK` → `160000 commit 073be841da91422d9bac696f96cfc5a12c002b35`.
Y `.gitmodules` de `e-sdk` y `remote -v` del árbol de OASIS apuntan al **mismo
upstream**, `https://github.com/escrivivir-co/para-la-voz-sdk.git`. Es decir:
`0d65d068` (OASIS) y `073be841` (lo que `e-sdk` fija) son el mismo repositorio
a distinto commit.

El anclaje **refuerza** el veredicto: `git ls-tree HEAD -- package.json`
devuelve vacío, así que `package.json` no falta sólo en el disco — falta en el
árbol versionado.

**Lo que hoy no se puede anclar, dicho con esas palabras:**

```
git -C "C:/Users/aleph/OASIS/aleph-scriptorium" rev-parse HEAD
fatal: bad config line 1 in file .git/config
```

El **superproyecto OASIS no se puede anclar hoy**: git rechaza su
configuración. Los submódulos sí responden a `rev-parse`, de modo que el árbol
del veredicto queda anclado y lo que queda sin anclar es el contenedor. Además,
cada consulta al almacén de objetos emite `error: wrong index v1 file size in …
pack-56b2eb90….idx`: resuelve, pero está degradado.

**Y falta un tercer defecto, que esta sección no declaró en la 1.ª ronda:** el
**índice de ese submódulo está corrupto**, y es el que invalidó dos de mis
propias medidas nuevas. Va en §7·B1 y en «Qué NO cubro». Los tres son del
entorno del custodio y OASIS es RO para este worker: se declaran, no se tocan.

---

## 4 · Condición ③ · el titular, y la separación medido/razonado

### El titular

`CONTRARREVISION-WP-HUB-112.md:68-71` **prohíbe explícitamente** la lectura
ancha y nombra el contraejemplo. El titular «la Future Machine **NO CORRE**»
afirmaba más de lo que la evidencia sostiene. Sustituido, en la cabecera del
reporte y en la addenda:

> **La cadena B→C→P no es proceso autónomo invocable fuera de IDE, hoy.**

El matiz de whisper, medido con precisión para no caer en el error contrario:

```
ast.parse(workers/escribiente-whisper/worker.py)   → parse_ok   (argparse + def main)
command -v python                                  → exit=0
python -B -c "import faster_whisper"               → ModuleNotFoundError · exit=1
requirements.txt                                   → faster-whisper>=1.2.1 · av>=11
```

O sea: **tiene forma de proceso** —por eso «no hay proceso invocable» era
falso— pero **hoy tampoco corre**, porque sus dependencias declaradas no están
instaladas; y no es la cadena B→C→P ni ingesta editorial Onfalo. El titular
acotado cubre exactamente eso y ni una palabra más.

### La medida de forma

Recuento propio sobre el reporte antes de la reforma:

| medida | valor |
| ------ | ----- |
| filas de evidencia (resumen 13 + cadena 3 + ceremonia 8) | **24** |
| filas que citan una orden | **10** — de ellas **9** con salida o exit literal |
| filas sin ninguna orden | **14**; las **8** de la tabla de ceremonia son juicio puro |
| valores distintos en la columna `veredicto` | **9** en 13 filas |
| filas cuyo veredicto empieza por `existe` | **8** — fuera de la tríada de la CA |
| filas clasificadas `corre` | **1** |

El delta 10 vs 9 era la fila «Skills FM»: cita `test -f` pero **no mide su
propio «no corre»**.

Reforma aplicada al reporte:

1. **Tabla A · MEDIDO** — `veredicto` restringido a la tríada `corre / no corre
   / no existe`. Lo que se colaba como «existe» pasó a una columna nueva,
   `qué hay`: un `.agent.md` que existe y no arranca es `no corre`, y que
   exista es un dato del objeto, no un veredicto de ejecución.
2. **Tabla B · RAZONADO** — las 8 filas de ceremonia y las 8 de reorden de lane
   quedan etiquetadas como inferencia sin orden detrás.
3. Fila nueva en A para `escribiente-whisper` (con su medida), porque el
   contraejemplo que obliga a recortar el titular tenía que estar **en la
   tabla**, no sólo en la prosa de la contrarrevisión. **2.ª ronda:** anclada
   al commit (`ls-tree -r HEAD -- workers` → `rc=0`, blob `353d8bf…`), que era
   la única fila que se había quedado sin anclaje.
4. Las dos filas cuya medida vive en `C:/S_LAB/s-sdk` (ficha barrio 20, CI
   s-sdk) se conservan con la nota «medida del autor; ZV no la re-midió»:
   s-sdk está fuera del permiso de este worker.
5. **2.ª ronda · la fila «Skills FM» sale de la Tabla A.** La 1.ª ronda la dejó
   dentro «con su asimetría escrita». Eso era el error, y este documento lo
   confesaba entre paréntesis mientras la regla numerada de al lado —y el
   artefacto que lee un tercero, `spike/REPORTE-WP-HUB-112.md`— lo afirmaban
   **sin salvedad y en negrita**. Una fila con veredicto fuera de la tríada y
   con la celda de evidencia diciendo «sin orden que mida "no corre"" rompe las
   dos reglas de la Tabla A a la vez, y una inferencia dentro de la tabla
   MEDIDO no se arregla con una nota al pie: **se mueve**. Está ahora en la
   Tabla B, con su mitad medida (presencia, `test -f` → `exit=0`) intacta.
6. **2.ª ronda · dos filas que no citaban orden ahora la citan.** Los
   `.analisis.md` (`test -f` → `exit=0`, 11025 / 13293 bytes) y los tres
   submódulos vacíos de `e-sdk` (`submodule status` con sus tres hashes de
   prefijo `-`, y `find -mindepth 1 | wc -l` → `count=0` en cada uno).
7. **2.ª ronda · las dos frases de encabezado de la Tabla A dicen la regla con
   su salvedad**, y **los dos documentos dicen lo mismo**: la Tabla A queda en
   **13 filas**, todas con tríada y orden exacta; la única salvedad viva son
   las dos filas de medida del autor no re-medida por ZV, declarada en cada
   celda.

---

## 5 · Confesión de método

Al comprobar si el worker Python parsea usé `python -m py_compile`, que
**escribió** `workers/escribiente-whisper/__pycache__/worker.cpython-314.pyc`
dentro de OASIS — **fuera de mi worktree**, contra mi propia prohibición. Lo
detecté 11 s después, borré el `.pyc` y el `__pycache__` que había creado, y
repetí la medida con `ast.parse` en memoria, que no escribe. Va escrito también
en la addenda del reporte y en la del log: un informe que exige evidencia
literal no puede ocultar su propio desliz.

**La coartada era una orden vacía · corregido en la 2.ª ronda.** Este párrafo
se exculpaba con «`git status` de ese árbol sigue en 0 ficheros sucios».
**Esa orden falla**: índice corrupto, `rc=128`, cero líneas de `stdout`. El
hecho que afirmaba es cierto, pero **la prueba que ofrecía estaba vacía** — y
es exactamente lo que este turno existía para no volver a hacer. Rehecha con
el instrumento que sí funciona, y **dicha como lo que es**:

```
find …/DocumentMachineSDK -name '__pycache__' -type d | wc -l   → 0
find …/DocumentMachineSDK -name '*.pyc' -type f | wc -l          → 0
find …/DocumentMachineSDK -type f -not -path '*/.git/*' | wc -l  → 585
find …/workers/escribiente-whisper -maxdepth 1 -printf '…%TH:%TM:%TS %y %p\n'
  2026-08-02 17:24:52  d  …/escribiente-whisper
  2026-04-29 19:52:40  f  …/precheck.py · requirements.txt · worker.py
```

Es **comprobación de sistema de ficheros, no de git**. Dice que hoy no hay
ningún `.pyc` ni `__pycache__` bajo ese árbol y que los tres ficheros conservan
su mtime de abril; el único mtime de hoy es el del directorio padre, tal como
confesé. **No dice** —y no puede decirlo mientras el índice esté corrupto— si
ese árbol tiene o no cambios sucios respecto a `HEAD`.

**Y estos ceros los demuestro, no los afirmo**, que es justamente lo que no
hice la vez anterior: los dos `find` dan `rc=0` con `stderr` vacío, y el
control negativo `find C:/S_LAB/e-sdk/NoExiste -mindepth 1` da `rc=1` con
`find: … No such file or directory`. El instrumento distingue «vacío» de
«falló»; `git status` en ese árbol no llegaba ni a intentarlo.

### Segunda confesión, de la 2.ª ronda: `npm` escribe aunque sólo lo consultes

Barrido de frontera al cerrar. Bajo OASIS y bajo los seis `READ_ONLY_ROOTS`:
**cero ficheros creados o modificados** en mi ventana de trabajo. Pero `npm`
escribe un log de depuración **por invocación** en su propio caché, y lo poda a
`logs-max`:

```
C:\Users\aleph\AppData\Local\npm-cache\_logs\2026-08-02T16_03_49_447Z-debug-0.log
   verbose argv "--prefix" "…/OASIS/aleph-scriptorium/AgentLoreSDK" "run"
   verbose cwd  C:\S_LAB\v-sdk        ← invocación mía
git -C C:/Users/aleph/AppData/Local/npm-cache rev-parse --show-toplevel
   → fatal: not a git repository
```

Mis tres `npm` de hoy escribieron ahí. Ese directorio **no es un repositorio,
no es mi worktree y no es ninguno de los `READ_ONLY_ROOTS`** — es el caché de
la herramienta—, así que no es la clase de violación de la primera confesión,
que fue escribir dentro de un árbol auditado. Pero **es una escritura fuera de
mi worktree causada por una medida mía**, y la regla de este turno no admitía
ninguna.

**Se produce si no se redirige `logs-dir`; yo no lo hice.** Escribí primero
«no se puede medir `npm` sin producirla», y era **falso**: basta
`npm_config_logs_dir=<dir propio>` delante de la misma orden —`npm.js:411`,
`get #logsDir () { return this.config.get('logs-dir') || join(this.cache,
'_logs') }`— y el caché del custodio no se mueve un byte. Es la corrección de
la contrarrevisión, y es la regla que sale de aquí.

Las dos vías obvias **no** valen, y una es peor que el problema:
**`--logs-max=0` es destructiva** — `lib/utils/log-file.js:72` evita crear el
fichero pero `#cleanLogs()` corre igual («*even if we aren't writing a
logfile*») con `toDelete = logFiles.length - logsMax`, o sea que **borraría los
11 logs del custodio**: cambia una escritura aditiva por una destructiva sobre
caché ajeno. Y `--no-audit --no-fund` tampoco evita el log.

Coda que sigue de mi propio «lo poda a `logs-max`»: **el ejemplar que cito
arriba ya no existe**, podado por invocaciones de otro carril. La evidencia de
esta confesión **se evapora sola**; queda la confesión.

### Tercera escritura de frontera, la más pequeña y la que no vi

Mi propio barrido `find -newermt` sobre OASIS devolvió **dos** entradas
posteriores a las 17:00. Declaré una —la mía, confesada— y **no declaré la
segunda**:

```
2026-08-02 17:24:25  d  …/onfalo-asesor-sdk/.git
```

No quedó nada persistente: el `index` de ese repo sigue con fecha
`2026-05-01`. Fue por tanto **un lock o un temporal efímero**, de los que git
crea y borra dentro del `.git` al consultar — casi con seguridad un `git
status` **tomado sin `--no-optional-locks`**.

Dicho con la precisión que la evidencia permite y ni una palabra más: **el
mtime prueba que hubo una entrada y una salida en ese directorio, no qué orden
la hizo.** Cae en mi ventana y es de mi misma familia, así que la declaro como
mía sin adjudicarme más de lo que se puede leer ahí.

**Regla que sale de aquí, y que vale más que las tres confesiones juntas:**
`git --no-optional-locks` en **toda** consulta a árboles ajenos, y
`npm_config_logs_dir` en toda invocación de `npm`. Las medidas de esta 2.ª
ronda ya usan lo primero; la de `npm` no usó lo segundo.

---

## 6 · Qué NO cubro

- **No re-medí nada bajo `C:/S_LAB/s-sdk`** (ficha barrio 20, CI del hub/s-sdk):
  fuera del permiso de este worker. Esas dos filas quedan con la medida
  original y la atribución explícita.
- **El árbol del veredicto tiene el índice corrupto, y eso me ciega para tres
  órdenes.** `.git/modules/DocumentMachineSDK/index`: 74174 bytes, cabecera a
  cero donde debería ir la firma `DIRC`. **`git status`, `git ls-files` y
  `git check-ignore` abortan con `rc=128`** (`error: bad signature 0x00000000`
  / `fatal: index file corrupt`) **en el árbol sobre el que va el veredicto**.
  La 1.ª ronda declaró el `.git/config` roto y el pack degradado **pero no
  esto**, y ésa es la omisión que dejó pasar mis dos medidas falsas. **No
  puedo afirmar si ese árbol está limpio o sucio.**
- **El pack degradado me ciega para el recorrido recursivo.** `ls-tree -r HEAD`
  → `rc=1`, cero líneas. Sólo **2 de 15** subárboles se recorren completos;
  **7 de 15 devuelven cero entradas** —`.githooks`, `.vscode`, `COPILOT`,
  `DRAFTS2`, `banner`, `engine-logs`, `guiones`—, 5 dan salida parcial y `tmp`
  aborta con `rc=128` por un objeto suelto corrupto. **No puedo afirmar que
  esos 7 subárboles estén vacíos, sólo que no se dejan leer.**
- **No arreglé el `.git/config` de OASIS ni el pack degradado ni el índice.**
  Se declaran con su salida literal. OASIS es RO.
- **No ejecuté `escribiente-whisper`.** Se midió su *forma* (parseo, entrypoint,
  PATH, deps) sin invocarlo: ejecutarlo habría hecho trabajo real sobre datos
  del custodio. Por tanto «no corre hoy» para whisper está apoyado en deps
  ausentes, no en un intento de arranque.
- **No inicialicé submódulos** de e-sdk/a-sdk: exige red y GO del custodio.
- **No hay CI.** Sin `git push` por prohibición explícita: el spike sigue
  **verde solo local**, como decía. Esa parte del reporte era ya honesta y no
  se tocó.
- **No toqué el veredicto de lane** (reorden 105/106/100 a simulacro): la
  auditoría no lo puso en cuestión y sigue siendo consecuencia de la Tabla A.
- **No sé qué escribió en `onfalo-asesor-sdk/…/BARTLEBY/corpus`.** Ver §7·O.

---

## 7 · 2.ª ronda · los tres bloqueantes, y por qué eran el mismo

La contrarrevisión atacó las nueve afirmaciones de la 1.ª ronda y **ninguna
resultó falsa**. Lo que sí encontró es peor y más simple: **la cura de la 1.ª
ronda no alcanzó a sus dos medidas nuevas**. Dediqué 25 líneas a diagnosticar
que «un log que mide exit codes a través de un pipe no mide exit codes», y acto
seguido escribí dos cifras que eran el recuento de líneas de órdenes que
fallan. La causa raíz común —el índice corrupto— no estaba declarada en ninguna
parte.

### B1 · «limpio: sí (0 sucios)» era el recuento de una orden que falla

```
$ git --no-optional-locks -C ".../DocumentMachineSDK" status --porcelain > st.out 2> st.err ; echo rc=$?
rc=128
$ wc -l < st.out
0
$ cat st.err
error: bad signature 0x00000000
fatal: index file corrupt
```

Igual `ls-files` y `check-ignore -v workers`: `rc=128`, mismo error. El fichero
de índice existe —74174 bytes, `Apr 30 19:41`— pero sus 16 primeros bytes son
`00`, donde debería ir `DIRC`. Control positivo: `onfalo-asesor-sdk` →
**`rc=0`**, `stdout` 0 líneas, `stderr` vacío. **Ahí el `0` sí significa «0
sucios»; en `DocumentMachineSDK` significa «la orden abortó».** Retirada la
afirmación del árbol del veredicto en los tres sitios (tabla de anclaje de los
dos reportes y §5); conservada la de `onfalo-asesor-sdk`.

### B2 · «cero entrypoints en el commit» era un `grep -c` sobre un flujo vacío

```
$ for i in 1 2 3; do git … ls-tree -r --name-only HEAD > lt.out 2> lt.err; echo "rc=$? lineas=$(wc -l < lt.out)"; done
rc=1 lineas=0   ·   rc=1 lineas=0   ·   rc=1 lineas=0
$ cat lt.err
error: wrong index v1 file size in …pack-56b2eb90….idx     (×5)
error: Could not read 971aee0998805ac89c08b323a0a4ee7391130ff7
$ printf 'mod/agents/pipeline.js\n' | grep -icE "<mismo patrón>"
1
```

El patrón funcionaba. El flujo estaba vacío. Rehecho subárbol por subárbol
(`ls-tree` **sin `-r`** sí responde: `rc=0`, 25 entradas de raíz = 15 árboles +
10 blobs):

| resultado | subárboles | cuáles |
| --------- | ---------- | ------ |
| completo (`rc=0`) | **2** de 15 | `DRAFT2` (5), `workers` (3) |
| **cero entradas** | **7** de 15 | `.githooks`, `.vscode`, `COPILOT`, `DRAFTS2`, `banner`, `engine-logs`, `guiones` |
| parcial (`rc=1`) | **5** de 15 | `.github` (6), `corpus` (1), `docs` (10), `mod` (11), `sala` (2) |
| aborta (`rc=128`) | **1** de 15 | `tmp` — objeto suelto `c23985a…` corrupto |

Unión de lo legible: **49 rutas**, volcadas a fichero. Sobre ellas el patrón de
la cadena da `0`, y los **únicos dos ficheros ejecutables visibles del árbol
entero** son `workers/escribiente-whisper/{precheck,worker}.py` — que no es la
cadena. **Lo que esto NO sostiene:** que el commit no tenga entrypoints. **7 de
15 subárboles no se dejan recorrer, `.githooks` entre ellos** — justo donde
viviría un ejecutable.

**El titular sobrevive sin esa pata:** le bastan los tres `command -v →
exit=1`, el `package.json` ausente en la raíz del commit y el frontmatter
`tools: [vscode,…]`.

### B3 · La Tabla A se autocertificaba con dos frases que su propia fila desmentía

Ver §4, puntos 5-7. Lo grave no era la fila: era la **asimetría entre
documentos**. Este reporte confesaba la excepción entre paréntesis y la negaba
dos líneas después en la regla numerada; y el artefacto que lee un tercero
—`spike/REPORTE-WP-HUB-112.md`— la afirmaba **en negrita y sin salvedad**.
Ahora la fila está en la Tabla B y **los dos documentos dicen lo mismo**.

### El log, otra vez, sin borrar nada

La 2.ª ronda añade al log `medidas-literales-2026-08-02.txt` los bloques
`ADDENDA ZV · II` (`II.A`–`II.J`), `II.K` y `II.L`: **394 → 763 líneas**. Las
líneas `:320-321` y `:330-331`, que son las dos medidas falsas, **siguen
exactamente donde estaban**; los bloques nuevos dicen qué son y las rehacen.
Prueba de que es puro anexo, esta vez contra `git`, no contra una copia mía:

```
git show eefe856:…/medidas-literales-2026-08-02.txt   → 394 líneas
sha256 de esas 394                                    → a1a83d88…0832e
sha256 de head -394 del worktree (normalizado LF)     → a1a83d88…0832e   (idéntico)
git diff --numstat eefe856 -- …/medidas-literales-2026-08-02.txt   → 369  0
```

**+369 / −0.** Cero eliminaciones.

*(Escrito primero como `git show HEAD:…`. Era cierto al escribirlo —`HEAD` era
`eefe856`— y dejó de serlo en cuanto commiteé: hoy `HEAD` devuelve 763 y un
tercero que lo reprodujera vería un número que no cuadra. Es **el pecado exacto
de mi propia sección ②**: un veredicto anclado a un nombre móvil es
infalsificable por nombre. Anclado al commit, que es lo que exijo a los demás.)*

### Menores cerrados

| # | qué | cómo queda |
| - | --- | ---------- |
| 1 | «Qué NO cubro» no declaraba el índice corrupto | declarado en §6, con la medida y con qué órdenes invalida |
| 2 | `medidas:137` transcribe la orden sin el `\| head` | demostrado: salida real **18** líneas, el log muestra **10**; la orden escrita da `exit=1`, con `\| head -n 10` da `exit=0`. **Las líneas «orden:» del log original no son verbatim** |
| 3 | `exit=127` sin derivación | `command -v npm` → `exit=0` · `ENOENT` errno = **`-4058`** · `node -e "process.exit(-4058)"` → **127** · `process.exit(254)` → **254** (no es clamp genérico). Significa «npm corrió y no encontró `package.json`» |
| 4 | la fila de whisper era la única sin anclaje | `ls-tree -r HEAD -- workers` → `rc=0`; `worker.py` blob `353d8bf9f0e5ff6d046d2e06348b0f1af36c83cd` |
| 5 | nunca registré el gitlink de `e-sdk` | `073be841da91422d9bac696f96cfc5a12c002b35`; mismo upstream `para-la-voz-sdk.git` en `.gitmodules` y en `remote -v` |
| 6 | mtime anómalo en `corpus` | **§7·O**, abajo |

### O · Observación de terceros, para el custodio — no imputable a ZV

`onfalo-asesor-sdk/PROYECTOS/BARTLEBY/corpus` tiene mtime de directorio
**`2026-08-02 11:07:21`** y **ningún hijo con mtime de hoy**: `find … -newermt
'2026-08-02 00:00:00'` devuelve sólo el propio directorio. No encaja en ninguna
ventana de este trabajo — el spike original corrió ~02:49 y el turno ZV
~17:24-17:32. `git status` de ese repo da `rc=0` con 0 líneas, o sea que nada
versionado cambió. Se anota como observación; **yo no lo produje y no lo
toco**.
