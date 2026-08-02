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
command -v bartleby / cristalizador / pipeline            → exit=1 ×3
ls-tree HEAD | grep -icE "(bartleby|cristalizador|pipeline).*\.(py|js|mjs|cjs|ts|exe|sh)$"  → 0
```

Los componentes siguen **sin `package.json`** —y ahora se sabe que falta **en
el commit**, no sólo en disco— y **ausentes del PATH**. El veredicto no se
toca. Lo que se corrige es cómo se dice y una cicatriz que lo contradecía.

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
| OASIS `DocumentMachineSDK` — **el árbol del veredicto** | `0d65d068c8a0f2c7ab36e5ca4130658f4ddc4880` | `integration/beta/scriptorium` | sí (0 sucios) |
| OASIS `onfalo-asesor-sdk` — corpus editorial | `d049e01ce4a33bc53fa0d34518ee7f15bc38da93` | `integration/beta/scriptorium` | sí |
| `C:/S_LAB/e-sdk` | `e4b34a870df266c181846110a63438f103e26b80` | `main` | — |
| `C:/S_LAB/a-sdk` | `936196f3682edec1934c9b5a09297ac65fdd107f` | `integration/beta/scriptorium` | — |

Y los blobs exactos de lo auditado: `bartleby` `4665614…`, `cristalizador`
`7c35c1c…`, `pipeline` `f6629b2…`, dos editoriales `7dcc6fa…` / `38a47e3…`.

El anclaje **refuerza** el veredicto: `git ls-tree HEAD -- package.json`
devuelve vacío, así que `package.json` no falta sólo en el disco — falta en el
árbol versionado.

**Lo que hoy no se puede anclar, dicho con esas palabras:**

```
git -C "C:/Users/aleph/OASIS/aleph-scriptorium" rev-parse HEAD
fatal: bad config line 1 in file .git/config
```

El **superproyecto OASIS no se puede anclar hoy**: git rechaza su
configuración. Los submódulos sí responden, de modo que el árbol del veredicto
queda anclado y lo que queda sin anclar es el contenedor. Además, cada consulta
al almacén de objetos emite `error: wrong index v1 file size in …
pack-56b2eb90….idx`: resuelve, pero está degradado. Las dos cosas son del
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

*(El delta 10 vs 9: la fila «Skills FM» cita `test -f` pero no mide su propio
«no corre». Se queda en la tabla medida con esa asimetría escrita, en vez de
promoverla a evidencia que no es.)*

Reforma aplicada al reporte:

1. **Tabla A · MEDIDO** — `veredicto` restringido a la tríada `corre / no corre
   / no existe`. Lo que se colaba como «existe» pasó a una columna nueva,
   `qué hay`: un `.agent.md` que existe y no arranca es `no corre`, y que
   exista es un dato del objeto, no un veredicto de ejecución.
2. **Tabla B · RAZONADO** — las 8 filas de ceremonia y las 8 de reorden de lane
   quedan etiquetadas como inferencia sin orden detrás.
3. Fila nueva en A para `escribiente-whisper` (con su medida), porque el
   contraejemplo que obliga a recortar el titular tenía que estar **en la
   tabla**, no sólo en la prosa de la contrarrevisión.
4. Las dos filas cuya medida vive en `C:/S_LAB/s-sdk` (ficha barrio 20, CI
   s-sdk) se conservan con la nota «medida del autor; ZV no la re-midió»:
   s-sdk está fuera del permiso de este worker.

---

## 5 · Confesión de método

Al comprobar si el worker Python parsea usé `python -m py_compile`, que
**escribió** `workers/escribiente-whisper/__pycache__/worker.cpython-314.pyc`
dentro de OASIS — **fuera de mi worktree**, contra mi propia prohibición. Lo
detecté 11 s después, borré el `.pyc` y el `__pycache__` que había creado, y
repetí la medida con `ast.parse` en memoria, que no escribe. Queda el mtime del
directorio padre; ni un byte de contenido añadido ni quitado; `git status` de
ese árbol sigue en 0 ficheros sucios. Va escrito también en la addenda del
reporte y en la del log: un informe que exige evidencia literal no puede
ocultar su propio desliz.

---

## 6 · Qué NO cubro

- **No re-medí nada bajo `C:/S_LAB/s-sdk`** (ficha barrio 20, CI del hub/s-sdk):
  fuera del permiso de este worker. Esas dos filas quedan con la medida
  original y la atribución explícita.
- **No arreglé el `.git/config` de OASIS ni el pack degradado.** Se declaran
  con su salida literal. OASIS es RO.
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
