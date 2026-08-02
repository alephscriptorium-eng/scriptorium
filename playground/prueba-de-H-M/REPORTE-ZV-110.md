# WP-HUB-110 · rediseño tras auditoría adversarial — reporte Z·V

| dato | valor |
| ---- | ----- |
| agente | worker Z·V (swarm ajeno; ficha idle reabierta por orden del PO) |
| fecha | 2026-08-02 |
| rama | `wp/hub-110-hm-negativos-y-consumidor-limpio` |
| worktree | `C:/S_LAB/wt/scriptorium-wp-hub-110` |
| base | rebasada sobre `main` (`c44ee91`) |
| veredicto previo | **NO ENTRA** |
| alcance del diff | `playground/prueba-de-H-M/**` |

---

## 1 · El rebase, y qué se tomó de `main`

La rama salía 31 commits por detrás. `git rebase main` reconoció **5 de los 6
commits como ya aplicados aguas arriba** (equivalentes por patch-id): las
correcciones de CI de schemas, ónfalo, mapa y `.gitattributes` ya estaban en
`main` por otra vía. Sólo se rejugó `333ce4d feat(HUB-110)`, con **un único
conflicto**, en `lib/podstore/LocalPodProvider.mjs`.

**Ese conflicto se resolvió íntegramente del lado de `main`.** Comprobado con
`git diff main -- lib/podstore/LocalPodProvider.mjs` vacío tras resolver. Lo
que se descartó de la versión anterior y lo que se conserva de `main`:

| se descarta (versión anterior) | se conserva (`main`) |
| ------------------------------ | -------------------- |
| `issuedAt = "2026-08-02T00:03:00.000Z"` literal — reloj congelado en producción | `issuedAt` desde el reloj real |
| `leaseId` derivado por sha256 de runId+unitId+permissions+expiresAt | `leaseId` aleatorio (`randomBytes(4)`) |
| — | **caducidad de lease**: `expiresAt` obligatorio, ISO válido y futuro |
| — | **contención ACL ⊆ permissions** en `issueLease` y en `setAcl` |
| — | **autorización en `transition()`**: verbo declarado + `authorize()` |
| — | **denegación por lease caducado / ausente / verbo fuera de permissions** |
| — | `setAcl` con actor, lease vivo y evento de auditoría |
| — | `{ actor }` en los seis `transition()` de `lib/ceremonia/steps.mjs` |

`package.json` fusionó limpio: se conserva el `comments.linea-kit` de `main` y
se añaden los dos scripts de 110.

Ningún test de la rama dependía de lo que `main` quitó a propósito: la suite
completa pasa (§7).

### Determinismo por reloj INYECTADO, no congelado

Antes de escribir nada se **midió** qué era realmente no determinista. Dos
corridas consecutivas de la ceremonia, comparando el árbol completo (143
ficheros):

- `issuedAt` aparece **0 veces** en todo el árbol de corrida. El reloj
  congelado de la versión anterior no arreglaba nada, ni siquiera lo que decía
  arreglar.
- Los `timestamp` de los wires **ya eran deterministas**: `run-ceremonia.mjs`
  los deriva del número de paso, no del reloj de pared.
- La **única** fuente de divergencia dentro de `evidence/` era `leaseId`, que
  cascadea a 92 de 143 ficheros por los digests.
- Fuera de `evidence/`, `.podstore/**` variaba además por `ts` y `updatedAt`.

Cambio de producción, mínimo y con **el mismo comportamiento por defecto**:

- `LocalPodProvider` acepta `clock: () => number` y
  `leaseIdFactory: (unitId) => string`. Sin ellos: `Date.now` y
  `randomBytes(4)`, exactamente como antes. Un `now` explícito del llamador
  —los que `main` añadió para sus tests— sigue mandando sobre el reloj.
- `runCeremonia(opts)` los reenvía.
- `scripts/ceremonia.mjs` los expone como `--now <iso>` y `--lease-seed <s>`.

Resultado medido:

```
A vs B (mismo reloj y semilla inyectados): {"same":true,"diff":0,"total":143}
A vs C (reloj y semilla distintos):        {"same":false,"diff":92,"total":143}
```

Con esto **desaparece el borrado de campos antes de comparar**: `TIME_FIELDS`
ya no existe. Se comparan los árboles completos byte a byte, cero exclusiones.
Y el test lleva **control de falsabilidad**: si la corrida con otro reloj y otra
semilla saliera igual, o si su divergencia no alcanzara a `evidence/`, el test
falla — porque entonces la comparación no demostraría nada.

---

## 2 · El bloqueante: los dos canales, separados por construcción

Antes: `failNegativo()` lanzaba `NegativoError`; el arnés aceptaba *cualquier*
`NegativoError` con la frontera esperada como PASS; y los ~10 `failNegativo`
internos que significaban «no conseguí provocar nada» —incluido el del pod que
materializaba sin lease— entraban por esa misma puerta.

Ahora los canales son **mecanismos de control de flujo distintos**:

| canal | mecanismo | resultado |
| ----- | --------- | --------- |
| el sistema se negó | **`return new Refusal({...})`** | único camino a PASS |
| el provocador no provocó | **`throw ProvocadorError`** | FAIL, siempre |
| el sistema **no** se negó | `throw` vía `sistemaNoSeNego()` | FAIL, con esas palabras |

`Refusal` no es un `Error` y no se lanza nunca; `ProvocadorError` sí lo es y
sólo se lanza. Un `throw` no puede llegar donde el arnés espera un `return`.
El test fija esa propiedad (`assertCanalesSeparados`), así que si alguien
convirtiera `Refusal` en un `Error`, el suite se pone rojo antes de que la
confusión vuelva.

Lo que **no** hay que atribuirle a `Refusal`: el constructor sólo exige que
alguien haya pasado la propiedad `systemError`. Pasan `null`, `false`, `0`, `""`
y un `new Error("me lo invento yo")`. Ningún provocador lo explota, pero la
garantía no la da el constructor: la da que cada provocador saca su error de un
`try/catch` alrededor de la llamada real y contrasta su firma antes de
construir la `Refusal`. Corregido también en el JSDoc de `frontiers.mjs`, que
afirmaba de más.

---

## 3 · Los siete provocadores, reescritos para atacar al sistema

Ninguno lanza su propia frontera; ninguno reetiqueta un `catch`. Cuando el
error del sistema no encaja con la firma esperada, el negativo **falla** en vez
de convertirlo en la frontera.

| # | negativo | ataque | frontera que da el SISTEMA |
| - | -------- | ------ | -------------------------- |
| 1 | corpus ausente | `runCadena` sobre un clon del kit sin snapshot Onfalo | *(ninguna: se declara `null`)* |
| 2 | hash roto | altera el **cuerpo** de un wire dejando su `digest` declarado intacto; el verificador recomputa | `hash roto` |
| 3 | schema inválido | campo no declarado en `report.json`; lo rechaza **el ajv del kit** | `reporte inválido: schema:` |
| 4 | pod sin lease | `transition` + `recordEvent` + disco, sin emitir lease | *(ninguna nombrada; tres piernas)* |
| 5 | VectorMock no declarado | `pack/vector-mock.json` con `mock=false` | `VectorMock sin declarar` |
| 6 | upstream ausente | `runCeremonia({ skipStep: 4 })` | `upstream ausente` (`missing-upstream`) |
| 7 | runner caído | `runCeremonia({ killAtStep: 9 })` sobre `universe.instantiate` | `kill inyectado` + runRoot borrado |

Lo que se corrigió, uno a uno:

- **`provokeVectorMockNoDeclarado`** construía `{...vm, mock:false}` y luego
  preguntaba `if (mock === true && declared === true)` —inalcanzable por
  construcción— para acabar lanzando sin consultar a nadie. Ahora muta el
  documento del pack y llama a `verificarEvidencia`.
- **`provokeHashRoto`** recomputaba el hash él mismo: verde tanto si el sistema
  verificaba como si no, porque `loadSealedPieces` **no compara sha256 en
  absoluto**. Ahora ataca el verificador real. `provokeHashRotoEvidence`, que
  estaba exportado y no se invocaba desde ningún sitio, desaparece: su papel lo
  hace el provocador de la fila.
- **`provokeSchemaInvalido`** compilaba ajv por su cuenta: probaba
  ajv-la-librería, no la vía del kit. Ahora va por la vía del kit **y exige que
  el guardián esté armado**: el verificador carga ajv dentro de un `try/catch`
  que, si falla, deja `activitySchemaValidate = null` y **salta el chequeo en
  silencio**. Si ajv no resuelve, el negativo falla en vez de pasar en vacío.
- **El reetiquetado universal** ya no existe. `corpus ausente` era un `ENOENT`
  crudo relabelado; hoy se comprueba que el error es `ENOENT` **y que su `path`
  es exactamente el manifest que se borró**, y se declara
  `systemFrontier: null` porque el kit **no tiene guardián con nombre propio**
  para ese caso. Se dice, no se inventa.
- Cada negativo que trabaja sobre el pack **verifica primero que el pack base
  pasa limpio**. Sin eso, un negativo puede salir verde por una rotura que ya
  venía de casa. Ese chequeo reetiquetaba su propio fallo como «el pack base ya
  venía roto (undefined)»: seguía siendo FAIL, pero **mentía sobre la causa**
  cuando quien reventaba era el verificador por otra razón. Ahora reporta clase,
  frontera y mensaje del error tal cual.
- `provokeRunnerCaido` comprueba que el paso 9 sigue siendo
  `universe.instantiate`: si la numeración cambia, se rompe ruidosamente en vez
  de seguir diciendo «runner caído».

---

## 4 · Las desactivaciones: nueve guardianes, nueve rojos

> **Un negativo no está verificado hasta que desactivas su guardián y
> compruebas que enrojece.**

Cada experimento parchea el guardián en el árbol, corre el test y restaura el
fichero (`restaurado: intacto=True` en los nueve). Salida literal:

```
== G1-corpus :: DESACTIVADO lib/cadena/run-cadena.mjs
exit=1
test-110-negativos: negativos verificados 6/7 (catálogo 7)
test-110-negativos: FAIL — negativo «corpus ausente» — provocador «corpus ausente» no probó nada:
  el sistema falló, pero no por el corpus que quité: code=undefined path=undefined
  msg=linea-kit rechazó linea:barrio-lore-onfalo (manifest-tronco): [{"instancePath":"/nodos",...}]

== G2-hash :: DESACTIVADO lib/verificador/verificar.mjs   (if (digest !== expected))
exit=1
test-110-negativos: negativos verificados 6/7 (catálogo 7)
test-110-negativos: FAIL — negativo «hash roto» — el verificador se negó por OTRA frontera:
  esperaba «hash roto», dio «cadena causal diverge»

== G3-schema :: DESACTIVADO lib/verificador/verificar.mjs   (if (!validate(report)))
exit=1
test-110-negativos: negativos verificados 6/7 (catálogo 7)
test-110-negativos: FAIL — negativo «schema inválido» — EL SISTEMA NO SE NEGÓ —
  verificarEvidencia con un campo no declarado en report.json → devolvió {"ok":true,...}

== G4-lease :: DESACTIVADO lib/podstore/LocalPodProvider.mjs (recordEvent: if (!pod.materialized))
exit=1
test-110-negativos: negativos verificados 6/7 (catálogo 7)
test-110-negativos: FAIL — negativo «pod sin lease» — EL SISTEMA NO SE NEGÓ —
  recordEvent sobre un pod sin lease → el sistema siguió adelante y devolvió undefined

== G4b-authorize :: DESACTIVADO lib/podstore/LocalPodProvider.mjs (transition: if (!decision.allowed))
exit=1
test-110-negativos: negativos verificados 6/7 (catálogo 7)
test-110-negativos: FAIL — negativo «pod sin lease» — transition falló, pero no por la política:
  tipestate: transición ilegal declared → ready

== G5-vectormock :: DESACTIVADO lib/verificador/verificar.mjs   (validateVectorMock)
exit=1
test-110-negativos: negativos verificados 6/7 (catálogo 7)
test-110-negativos: FAIL — negativo «VectorMock no declarado» — el verificador se negó por OTRA
  frontera: esperaba «VectorMock sin declarar», dio «sello del pack roto»

== G6-upstream :: DESACTIVADO lib/ceremonia/run-ceremonia.mjs   (if (!completed.has(up)))
exit=1
test-110-negativos: negativos verificados 6/7 (catálogo 7)
test-110-negativos: FAIL — negativo «upstream ausente» — la ceremonia falló por otra cosa:
  CeremonyError code=unexpected «upstream ausente: machine»
test-110-negativos: FAIL — actas de negativos sin recoger: neg-110-upstream.json

== G7-wipe :: DESACTIVADO lib/ceremonia/run-ceremonia.mjs   (wipePartialState(runRoot, provider))
exit=1
test-110-negativos: negativos verificados 5/7 (catálogo 7)
test-110-negativos: FAIL — negativo «upstream ausente» — EL SISTEMA NO SE NEGÓ —
  estado parcial residual en .runs/neg-110-upstream: .podstore,evidence,H,M,manifest.json,room.json
test-110-negativos: FAIL — negativo «runner caído» — EL SISTEMA NO SE NEGÓ —
  runner caído dejó estado parcial en .runs/neg-110-runner: .podstore,evidence,H,M,...

== G8-offline-block :: DESACTIVADO lib/offline/preload.mjs (installOfflineGuard({ block:false }))
exit=1
test-110-consumidor-limpio: PASS — guardia offline instalada en 7 procesos descendientes
test-110-consumidor-limpio: FAIL — la guardia NO bloquea:
  la sonda salió a example.com:443 sin que nadie la parara
```

### Lo que estos experimentos revelan, y que no se disimula

**Cinco de los nueve rojos no son «no saltó nadie», son «saltó otro».** Es una
diferencia real y se declara:

- **G2 (hash roto)**: al desactivar la recomputación de digest, quien caza la
  mutación es el guardián de **cadena causal**. El negativo enrojece porque la
  frontera cambia, no porque el pack pase limpio. El provocador está anclado a
  la recomputación (exige `expected=` en el mensaje) precisamente para que ese
  cambio de guardián no pase inadvertido.
- **G5 (VectorMock)**: sin `validateVectorMock`, salta el **sello del pack**.
- **G4b**: sin la política, salta el tipestate.
- **G1**: sin la lectura del manifest, salta `linea-kit` aguas abajo.
- **G6 (upstream ausente)**: clasificado antes como aislamiento limpio, y era
  falso — **con la prueba impresa doce líneas más arriba en este mismo
  documento**. El mensaje `«upstream ausente: machine»` con `code=unexpected`
  no sale de la puerta de upstream de `run-ceremonia.mjs`: sale de
  `lib/ceremonia/steps.mjs:228`, que es otra defensa. Con la puerta fuera el
  sistema **sí** se niega; sólo cambia quién. Corregido aquí y en §8.

Aislamiento limpio —el sistema **no se niega en absoluto** con el guardián
fuera— sólo lo hay en **G3, G4, G7 y G8**: cuatro de nueve.

### G9 · el censo de procesos, y por qué no valía contar

Aparte de las nueve desactivaciones hay un décimo experimento, de otra clase:
no desactiva un guardián, **reinyecta una regresión** para comprobar que el
chequeo nuevo la caza.

El censo de procesos prometía «los PID reales creados —los del test **y los de
sus hijos**—». No los contaba. Las tres ceremonias lanzan cada una un
`generar.mjs`; los tres nietos existieron, dejaron parte offline en el mismo
directorio que el padre leía, y **ninguno entraba en el censo**. El dato que lo
refutaba (`partes.length = 7`) estaba en la misma función que imprimía el 6, sin
cruzarse.

**Causa raíz, medida:**

```
run-ceremonia.mjs:14  →  import { spawnSync } from "node:child_process"

named import   -> interceptado: false
namespace prop -> interceptado: true
```

**Node fija el binding de un named export de un builtin al instanciar el
módulo: escribir sobre la propiedad del namespace no lo alcanza.** De las seis
formas de crear un proceso, sólo llegaban tres: `execSync` y `execFileSync`
estaban capturadas en `orig` y **nunca se asignaban**, y el named import era
invisible por construcción.

Es la misma trampa que ya costó cara en otro mundo de este programa: un
monkey-patch de `fs` que no alcanzaba a `import { writeFileSync }` y una sonda
que «funcionaba» por accidente. **Mundos distintos, mismo mecanismo: un
monkey-patch sobre un builtin sólo alcanza a quien lo consume por el namespace.
Si el código bajo prueba usa named imports, la instrumentación es ciega y no
tiene forma de saberlo — hay que cruzarla con una medida independiente.**

Arreglado: `run-ceremonia.mjs` pasa a namespace import, `execSync` y
`execFileSync` se envuelven, y —lo importante— el censo **se cruza** contra los
partes offline. Antes el único guardia era `if (todos.length === 0)`: un censo
incompleto pasaba en silencio.

```
antes:  PASS — 6 procesos de SO creados …            (partes = 7, nietos = 0)
ahora:  PASS — censo cruzado: 7/7 procesos que dejaron parte están censados
               (censo 10 = 7 del test + 3 nietos)
        PASS — 10 procesos de SO creados, 0 vivos al cierre, 7 con código de salida recogido
```

Y el cruce es falsable. Devolviendo `run-ceremonia.mjs` al named import:

```
== G9-named-import :: REVERTIDO a `import { spawnSync }` en lib/ceremonia/run-ceremonia.mjs
exit=1
test-110-consumidor-limpio: PASS — guardia offline instalada en 7 procesos descendientes
test-110-consumidor-limpio: FAIL — censo incompleto: 3 de 7 procesos dejaron parte offline
  y NO están en el censo (pids 37956,41644,6648) — existieron y nadie los contó
test-110-consumidor-limpio: FAIL (1)
== restaurado: intacto=True
```

Esa es exactamente la condición que antes pasaba en verde.

---

## 5 · El consumidor limpio, rehecho

| defecto auditado | qué se hizo |
| ---------------- | ----------- |
| offline «instrumentado» con un monkeypatch **en-proceso**, ciego a `npm ci` y `generar.mjs` | la guardia viaja a **cada proceso Node descendiente** vía `NODE_OPTIONS=--import lib/offline/preload.mjs`; cada proceso deja su parte en un directorio que el padre lee. Medido: **7 procesos** con parte |
| la guardia **no bloqueaba, sólo anotaba** | ahora **lanza** `OfflineViolation`. Verificado en banda: una **sonda** intenta salir a `example.com:443` en cada corrida y el test exige que la bloqueen y la registren; y exige que `127.0.0.1` siga pasando |
| `Socket.prototype.connect`, `tls.connect` y `http2` sin parchear | parcheados, más `net.connect`, `net.createConnection`, `http/https.request`, `dns.*`, `dns.promises.*` y `fetch` |
| `isLoopbackHost(null) === true`; `0.0.0.0` y `::` contaban como loopback | **fail-closed**: lo desconocido y los comodines son violación. Loopback = `localhost`, `::1`, `127.0.0.0/8` |
| **los puertos no se comprobaban nunca** (cero referencias en el test) | `net.Server.prototype.listen` instrumentado en los 7 procesos; el test exige **cero escuchas** |
| «sin procesos huérfanos» **infalsificable** (`residualProcesses` = unidades cuya transición lanzó; no había procesos de SO) | se instrumenta `child_process.*` —incluidas `execSync` y `execFileSync`, que se capturaban y nunca se envolvían—, se recogen los **PID reales** creados por el test y por sus hijos, se exige que ninguno siga vivo (`process.kill(pid,0)` → `ESRCH`) y con código de salida recogido, **y se CRUZA contra los partes offline**: un PID que dejó parte y no está censado es FAIL. Medido: **censo 10 = 7 del test + 3 nietos, cruce 7/7, 0 vivos**. Ver G9 |
| el censo corría **antes** de `skills:ceguera`, que se registraba después y no lo miraba nadie | el censo va el **último**, así que ese proceso también entra |
| la sonda se autoadjudicaba `status: 0` descartando el real de `spawnSync` | se registra el `status` real |
| aserción que se saltaba en silencio (`if (existsSync(tipPath))`) | el fichero es **obligatorio**; si falta, FAIL. Y `finals` vacío también es FAIL |
| determinismo oculto dos veces (`TIME_FIELDS` borraba `issuedAt`, `expiresAt` y **`leaseId`** *y además* reloj congelado) | `TIME_FIELDS` **eliminado**. Comparación byte a byte del árbol completo, cero exclusiones, con reloj y semilla inyectados por CLI. Más control de falsabilidad (§1) |
| `npm ci` **en el árbol real del hub**, después de declarar la corrida offline | eliminado. `skills:ceguera` corre en **fase aparte y declarada**, y **no instala nada**: si faltan deps del hub, el test **falla** diciendo que hay que instalarlas fuera |

La ceremonia del consumidor ya no se ejecuta importando el `lib/` del kit real:
corre como **proceso hijo dentro del checkout temporal**, con su propio
`scripts/ceremonia.mjs` y su propio `lib/`. Es la única forma de que sea una
corrida de consumidor y de que la guardia offline la cubra.

Salida de la corrida:

```
PASS — npm ci en checkout temporal (fase seed, red permitida y declarada)
PASS — generación sin sibling paths
PASS — rerun byte a byte sobre el árbol COMPLETO: 143/143 ficheros idénticos, cero campos excluidos
PASS — control de falsabilidad: otro reloj+semilla → otros bytes, también en evidence/ (92/143)
PASS — guardia offline instalada en 7 procesos descendientes (el padre no la instala)
PASS — cero salidas no-loopback en la fase offline (bloqueante, no anotador)
PASS — la guardia muerde: externo bloqueado:OfflineViolation y registrado
       (net.connect→example.com); loopback intacto
PASS — cero puertos abiertos (listen() instrumentado en 7 procesos)
PASS — shutdown: 12 unidades en estado final
PASS — cero locks/pids huérfanos en el árbol de la corrida
PASS — npm run skills:ceguera desde la raíz del hub
PASS — censo cruzado: 7/7 procesos que dejaron parte están censados (censo 10 = 7 del test + 3 nietos)
PASS — 10 procesos de SO creados, 0 vivos al cierre, 7 con código de salida recogido
```

---

## 6 · Cifras duras: igualdad de conjuntos, con denominador

`ci/test-110-negativos.mjs` usaba `MATRIX.length !== expected.length` —
cardinalidad. Un `MATRIX` con una frontera duplicada y otra ausente pasaba.

Ahora se contrasta por **igualdad de conjuntos** contra el catálogo
`NEG_FRONTIER`, más un chequeo explícito de duplicados, y se imprime el
denominador:

```
test-110-negativos: PASS — matriz = catálogo por igualdad de conjuntos (7/7)
test-110-negativos: negativos verificados 7/7 del catálogo (filas en MATRIX: 7)
```

La cifra impresa **también** era cardinalidad: se contaban filas verificadas
contra `MATRIX.length`, así que una matriz saboteada seguía imprimiendo `7/7`
verde y quien salvaba la corrida era el chequeo de conjuntos, no el número.
Ahora el denominador es el **catálogo**, el numerador es un conjunto de
fronteras (no un contador), y se exige explícitamente que ninguna frontera del
catálogo se quede sin negativo verificado. En las nueve desactivaciones esa
línea nueva salta:
`FAIL — fronteras del catálogo sin negativo verificado: <frontera>`.

---

## 7 · Suite completa, verde local

```
test-100-schemas: PASS      test-105-cadena: PASS       test-109-despierta: PASS
test-101-ontologia: PASS    test-106-ceremonia: PASS    test-110-negativos: PASS
test-102-generador: PASS    test-107-verificador: PASS  test-110-consumidor-limpio: PASS
test-103-podstore: PASS     test-108-mapa: PASS
test-104-onfalo: PASS       lore-hm suite: PASS
```

`test-103` y `test-106` son los que ejercitan el podstore y la ceremonia que se
tocaron: pasan sin cambios en sus tests, porque el comportamiento por defecto
no se ha movido.

### Hallazgo de entorno, ajeno a este WP

`test-108-mapa` fallaba con `hash diverge: mapa.json` **antes de tocar nada**.
Causa: `core.autocrlf=true` en este worktree y dos ficheros materializados con
CRLF pese al `-text` de `.gitattributes` (`fixtures/mapa/mapa.json` y
`fixtures/mapa/excerpts/GRAFO-handoffs-counts.json`); el blob es LF y el
manifest sella LF. Se restauraron desde el blob en el árbol de trabajo — **no
se commitea ningún fixture**, el contenido ya coincide con el índice
(`git diff` vacío). Si `git status` vuelve a marcarlos, es el mismo round-trip
de autocrlf, no un cambio de contenido.

---

## 8 · Qué NO se cubre

Dicho antes de que lo encuentre nadie.

1. **`corpus ausente` no tiene guardián con nombre propio en el kit.**
   `loadSealedPieces` lee el manifest sin comprobar nada; lo que sale es un
   `ENOENT` de `fs`. Se verifica la negativa y su origen exacto, y se declara
   `systemFrontier: null`. **No se ha añadido el guardián**: escribir el
   guardián y su test en el mismo commit es autocertificación. Queda como
   deuda nombrada.
2. **`loadSealedPieces` no compara sha256 en absoluto.** El negativo de hash
   ataca el verificador, que sí recomputa; el camino de carga del corpus sigue
   sin verificar sellos y este WP no lo arregla.
3. **`pod sin lease` no tiene frontera nombrada por el sistema.** Se comprueban
   tres piernas (política, materialización, disco) contra tres errores reales,
   pero ninguno lleva nombre propio de frontera.
4. **Cinco de los nueve guardianes no quedan aislados** (§4): al desactivarlos
   salta otro guardián. El rojo es real, pero es «cambió la frontera», no
   «nadie se negó». G6 estaba mal clasificado en la primera entrega y lo
   desmontó la revisión con la salida que este mismo reporte ya imprimía.
5. **La guardia offline es en-proceso, replicada en cada hijo Node, y sólo
   alcanza a quien consume el builtin por el NAMESPACE.** El límite que declaré
   antes —«un binario nativo, o un hijo que no sea Node»— era más ancho que el
   real. Escapan **sin bloquear ni registrar**, con Node puro:
   `import { lookup } from "node:dns"` y cualquier otro named import de un
   builtin (binding fijado al instanciar: medido, no supuesto), y
   `new dns.Resolver().resolve4()`, que trae sus propios métodos. Se añadieron
   `dns.resolveAny/Cname/Mx/Txt/Srv/Ns` y las variantes de `dns/promises`, que
   sí faltaban por namespace; los dos huecos estructurales **siguen abiertos**.
   Y sigue sin haber comprobación a nivel de SO: ni sockets del sistema, ni
   firewall, ni `netstat`.
6. **El proceso padre del test NO está bajo la guardia.** Los partes son de sus
   descendientes. Lo que el padre haga por red no lo mide nadie; hoy no hace
   nada, pero eso es una propiedad del código, no del arnés.
7. **El censo de procesos sólo ve lo que pasa por el namespace de
   `child_process`.** Ve los nietos porque se cambió el llamador del kit
   (`run-ceremonia.mjs`), no porque la instrumentación sepa alcanzarlos: si
   mañana otro fichero usa `import { spawn }`, sus procesos vuelven a ser
   invisibles. Lo único que lo detectaría es el cruce contra los partes
   offline, y sólo si ese proceso es Node y deja parte.
8. **`npm ci` de la fase seed NO corre bajo la guardia**, por definición: es la
   semilla y usa red. La CA dice «offline **tras** seed» y eso es lo que se
   verifica.
9. **La liveness de procesos se comprueba con `process.kill(pid, 0)`**, que en
   Windows puede devolver `EPERM` en vez de `ESRCH`. Esos casos se cuentan como
   *indeterminados* y se reportan; no se dan por muertos. Los PID además se
   reciclan: la comprobación es buena, no es una prueba.
10. **`--now` y `--lease-seed` sólo cubren el podstore.** Si mañana alguien
   añade otra fuente de tiempo o de azar en la ceremonia, la corrida dejará de
   ser reproducible; el rerun se pondrá rojo, pero la inyección no lo absorberá
   sola.
11. **Cero medición de red real.** «Cero salidas no-loopback» significa que
   ninguna API de Node intentó salir, no que la máquina no tuviera tráfico.
12. **`REPORTE-WP-HUB-110.md` queda como retractación**, no como reporte: sus
    afirmaciones son las que la auditoría desmontó.
