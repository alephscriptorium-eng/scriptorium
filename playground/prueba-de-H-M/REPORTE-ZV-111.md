# REPORTE-ZV-111 · cierre de WP-HUB-111 bajo condiciones

| dato | valor |
| ---- | ----- |
| worker | swarm Z·V (`worker-V`) |
| fecha | 2026-08-02 |
| rama | `wp/hub-111-hm-escenarios-descubribles` |
| worktree | `C:/S_LAB/wt/scriptorium-wp-hub-111` |
| preflight | `identidad-raiz: PASS` · world-real = git-toplevel = `c:/s_lab/wt/scriptorium-wp-hub-111` · `READ_ONLY_ROOTS` = z/v/s/a/e-sdk + skills-library · `DOWNSTREAM_PATTERNS=[]` |
| alcance | `playground/prueba-de-H-M/**` |
| veredicto de partida | ENTRA CON CONDICIONES (auditoría adversarial) |

---

## 0 · Rebase sobre `main` — lo que se midió «mecánico» no lo era del todo

Base anterior: `4305792` (32 commits detrás). Base nueva: `c44ee91` (tip `main`).

**No fue mecánico.** De los 6 commits de la rama, 4 los **descartó git** por ya
aplicados (`176439b`, `6db843f`, `ad36a27`, `c51050e` están en `main` con el
mismo parche), y los 2 restantes **conflictaron**:

| commit | fichero | resolución |
| ------ | ------- | ---------- |
| `2c28e52` (obra) | `ci/test-100-schemas.mjs` | **se tomó `main` entero**. `main` ya traía el mismo arreglo (guardián por presencia de los once nombrados, no por cardinalidad) **más** un chequeo de clon estructural que 111 no tenía. Quedarse con el lado de la rama habría **revertido** ese chequeo. |
| `2c28e52` (obra) | `package.json` | fusión de los dos lados: descripción de `main` + `+ 111 (escenarios descubribles)`, y `test:escenarios` añadido sin tocar `test:despierta`. |
| `03f6dd6` | `plan/BACKLOG-F2.md` | **`--skip`**. Ya estaba en `main` como `176439b`; su único residuo era una línea de bitácora que `main` supera con datos más nuevos. `plan/` está fuera de mi permiso de escritura en esta ficha, así que no se re-abrió. |

**Verificación de no-reversión** (lo que la auditoría pedía comprobar):

```
git diff --name-status main..HEAD      # 16 ficheros, todos bajo playground/prueba-de-H-M/**
git diff --stat main..HEAD -- playground/prueba-de-H-M/fixtures \
    playground/prueba-de-H-M/scripts playground/prueba-de-H-M/ci/test-108-mapa.mjs \
    playground/prueba-de-H-M/ciudad .gitattributes
# (vacío) — nada de lo que main corrigió queda tocado por esta rama
```

Los ficheros que la rama modifica y no crea (`README.md`, `ci/suite.mjs`,
`package.json`, `scenarios/barrio-lore/scenario.json`,
`schemas/scenario.schema.json`) quedan **estrictamente aditivos** respecto de
`main`: el diff no borra ni una línea que `main` hubiera introducido.

---

## 1 · La condición principal: la CA decía «corre», el test **conformaba**

Medida de partida, confirmada: `ci/test-111-escenarios.mjs` no contenía ni una
llamada a `runCeremonia` ni un `spawn` de generación. Sólo `discoverScenarios`,
Ajv y `runConformidadSuite`. El propio `scenarios/segundo-minimo/scenario.json`
lo admitía en `simulacro.declared`.

### Elección: **(a) ejecutar de verdad**. Argumento

La opción (b) —reescribir la CA a «es descubierto y conforma»— era legítima pero
**no cabía aquí**: la CA canónica vive en `plan/BACKLOG-F2.md:611-614`, y `plan/`
está prohibido en esta ficha. Reescribirla sólo en el reporte del kit habría
dejado dos CA distintas para el mismo WP —la del backlog diciendo «corre» y la
del reporte diciendo «conforma»— y eso es peor que la mentira original: la
vuelve difícil de ver.

Y sobre todo, (a) **era barata y verdadera**. `scripts/generar.mjs` (WP-HUB-102)
ya es genérico sobre escenarios: resuelve `scenarios/<id>/scenario.json`, exige
`simulacro.futureMachine`, materializa `.runs/<run>/…` y sella un `manifest`. No
hacía falta inventar un runtime; hacía falta **llamarlo**.

### Qué corre ahora, literal

`lib/escenarios/ejecutar.mjs` (nuevo, genérico, sin ningún `scenarioId` dentro
—vuelta 2: había uno en un comentario, retirado, y ahora hay un **guardián que
lo impide**, §M1—) y §7 de `ci/test-111`.

Salida **re-ejecutada hoy** (vuelta 2), no copiada de una corrida anterior:

```
· barrio-lore: node scripts/generar.mjs --scenario barrio-lore --run test-111-barrio-lore --sin-install → exit=0
· barrio-lore: manifest: seal=sha256:e42ddc758c7799431e9d4e09cc7a5a814861e24b8962118e03ee35838b35302a artefactos-sellados=10
· barrio-lore: rerun sin --force-new → exit=0 no-op=true
· barrio-lore: artefactos 9/9 · idempotente=true · limpiado=true
· segundo-minimo: node scripts/generar.mjs --scenario segundo-minimo --run test-111-segundo-minimo --sin-install → exit=0
· segundo-minimo: manifest: seal=sha256:a8ea8294e735d4c73d3743d6ebf1acd74d952676c69e18573c277155129415b7 artefactos-sellados=10
· segundo-minimo: rerun sin --force-new → exit=0 no-op=true
· segundo-minimo: artefactos 9/9 · idempotente=true · limpiado=true
test-111-escenarios: PASS — ejecución real — 2/2 escenarios ejecutados con generador real · 2/2 con sello sha256
```

Cada corrida verifica: `exit=0` del proceso hijo · 9/9 artefactos en disco ·
`manifest.seal` sha256 y `manifest.scenarioId`/`barrioId` coincidentes · segunda
pasada **no-op medido** · cleanup según el `cleanup.removeRuns` que el propio
escenario declara. El borrado es defensivo: se niega si el objetivo no está
estrictamente dentro de `<kit>/.runs/`.

### Qué **no** corre, dicho donde antes se confundía

`lib/ceremonia/run-ceremonia.mjs` —la ceremonia v1 de 11 pasos— **no** corre
para escenarios no-v1, y no por descuido: está anclada a `barrio-lore` por
`lib/ceremonia/constants.mjs` (`CEREMONY_ID`, `SCENARIO_ID`, `CEREMONY_STEPS`).
Hacerla genérica exigiría **tocar el arnés de ceremonia**, que es exactamente lo
que la CA prohíbe. Queda escrito en tres sitios: la cabecera de
`lib/escenarios/ejecutar.mjs`, el `simulacro.declared` del escenario —donde
estaba la frase que delataba el hueco— y la tabla CA de `REPORTE-WP-HUB-111.md`.

Herencia spike 112 intacta: Future Machine viva **NO CORRE**; esto es simulacro
playground.

---

## 2 · Conformidad: de 12 chequeos de presencia a 15, con 4 de **referencia**

Medida de partida, confirmada: `lib/escenarios/conformidad.mjs` sólo comprobaba
presencia y no-vacío. `units: ["no-existe"]` pasaba. Un verbo inventado pasaba.

Ahora el fichero declara su propio denominador (`CONFORMIDAD_CHECKS`, 15
entradas) y cada chequeo lleva **clase**:

| clase | n | qué mide |
| ----- | - | -------- |
| `presencia` | 11 | el campo está y no está vacío |
| `referencia` | 4 | `fixture.path` existe en disco · `units` ⊂ `units/catalog/*.json` (10 unidades) · verbos de `ceremony.steps` ⊂ `ontology/hm-v1.context.jsonld` (29 verbos) · `cleanup.shutdownVerbs` ⊂ la misma ontología |

Los referentes cargan **fail-closed**: si `units/catalog` o la ontología no se
pueden leer, el escenario **falla**; no se aprueba por catálogo vacío, que es
como el mismo defecto vuelve a colarse por la puerta de atrás.

Medida final: `2/2 escenarios · 15 chequeos c/u (4 de referencia)`, con desglose
`pasados/total` por escenario.

---

## 3 · `classifyV1` ahora sí lee `d.data`

Medida de partida, confirmada: `v1-allowlist.mjs:28-36` sólo leía
`d.scenarioId`. Las aserciones de `:169,175` eran verdes **por construcción**:
no existía código de manejo de banderas que pudiera fallar. La defensa real era
el schema (`additionalProperties:false`), no la función.

`classifyV1` sigue **decidiendo por id** —deliberado, y dicho en el comentario—
pero ahora **lee** los datos para dejar acta de lo que descarta: devuelve
`ignoredClaims`, `inspected` y `clavesLeidas`.

> **Rectificación de vuelta 2.** Aquí decía que la aserción quedaba «falsable
> por dos lados, y ambos medidos». **Eran dos aserciones nuevas y sólo una
> enrojecía.** `ignoredClaims` sí: bajo la mutación F cae. `inspected` **no**:
> se incrementaba por elemento del array, sin depender de haber leído `d.data`,
> así que bajo F imprimía PASS — verde por construcción, justo lo que esta ficha
> venía a quitar. **El recuento real de vuelta 1 era 1, no 2.** Corregido en
> vuelta 2: `inspected` sólo sube si el recorrido de claves devolvió algo, y el
> test cruza además `clavesLeidas` contra un total que calcula él mismo. Ahora
> son dos de verdad, y la medida I de §6 lo enseña: bajo la misma mutación caen
> `inspected 0/2`, `clavesLeidas 0/27` y `ignoredClaims`.

Defensa en profundidad, declarada y no supuesta:

1. **schema** (`additionalProperties:false`) — impide que las claves lleguen a
   existir en un `scenario.json` real. Medida D.
2. **`classifyV1`** — decide por id y contabiliza lo ignorado. Medidas E y F.
3. **test §6** — comprueba además que 0/2 escenarios **en disco** llevan ninguna
   de las 7 claves de `PROMOTION_CLAIM_KEYS`.

---

## 4 · El `ok()` incondicional

`:128` imprimía PASS aunque el bucle de campos obligatorios hubiera fallado
dentro. Sustituido por el helper `bloque(nombre, fn)`: toma el contador global
antes y después y **sólo canta PASS si su propio delta es cero**; si no, imprime
`bloque «X» con N fallo(s)`. Los **nueve** bloques del test pasan por ahí
(`grep -c '^bloque(' ci/test-111-escenarios.mjs` → `9`; el test emite 9 líneas
`PASS —`). *Vuelta 3: aquí y en §7 decía «ocho», y ya eran nueve en la vuelta 1.
Infra-declarado, pero es exactamente el género que estas vueltas vienen a
cerrar: una cifra escrita que no reproduce.*

Demostrado vivo en la medida B de §6: el bloque de conformidad **no** imprime
PASS cuando algo falla dentro.

---

## 5 · Cifras duras · barrido con denominador

> **Método corregido en vuelta 2.** La versión anterior decía «se despojan
> comentarios y literales de cadena antes de buscar» **para las dos pasadas**, y
> eso no era lo que el script hacía: si de verdad despojaras los literales, los
> ids saldrían **0 siempre**, porque un id cableado vive precisamente dentro de
> una cadena. El método real —y el correcto— es de **dos pasadas con
> tratamientos distintos**, y aquí queda escrito como es. Un denominador que no
> se deduce de su método declarado no es un denominador.

Método, tal cual lo ejecuta el script:

- **Pasada A · cifras** — se quitan comentarios y literales de cadena/plantilla,
  y se busca un numeral **en comparación**. Se despoja porque el `111` de un
  mensaje no es una cifra de dominio.
- **Pasada B · ids** — se busca sobre la línea **cruda**, sin despojar, porque
  el cableado vive dentro del literal. Aquí despojar mediría cero.
- En ambas se saltan las líneas de comentario: un id nombrado en una explicación
  no cablea comportamiento.

| versión de `ci/test-111` | cifras duras | ids literales |
| ------------------------ | ------------ | ------------- |
| **antes** (`1e46559`, obra original) | **2** (`:74` `ids.length < 2` · `:175` `v1.length !== 1`) | **10** |
| **vuelta 1** (`7df599b`) | **0** | **1** |
| **vuelta 2** (hoy) | **1** (`:170` `apariciones !== 1`) | **1** (`:146`) |

- `:74` → umbral **derivado**: `V1_SCENARIO_IDS.length + 1` («al menos un
  escenario más allá de la allowlist, o "descubrible" no significa nada»),
  contrastado contra un **recuento independiente del disco**
  (`recuentoDirectoDeDisco()`), que es el que da el denominador `2/2`.
- `:175` → comparación de conjunto contra `V1_SCENARIO_IDS`, más el cruce de
  `clavesLeidas` (ver §M2).
- Los 9 ids literales que sobraban desaparecen: el hostil se monta sobre
  `noV1Ids[0]`; víctima y base salen del descubrimiento.
- El id que queda (`:146`) es deliberado: afirma que `segundo-minimo` —el
  entregable de este WP— sigue existiendo. No bloquea a un tercer escenario.
- La cifra nueva de vuelta 2 (`:170`) es del guardián de §M1: exige que el id v1
  aparezca **exactamente una vez** en `v1-allowlist.mjs`, la del array
  `V1_SCENARIO_IDS`. **No la derivo y no la escondo**: no es cardinalidad de
  dominio sino un invariante estructural de ese fichero, y moverla a una
  constante con nombre sólo la sacaría del barrido sin quitarla del código. Se
  declara y se cuenta.

Toda cifra que el test imprime sale con denominador: `2/2` descubiertos, `0/1`
no-v1 mencionados en el arnés, `15/15` chequeos, `3/3` banderas, `9/9`
artefactos, `2/2` ejecutados.

---

## 6 · Pruebas de ceguera — siete mutaciones, siete rojos

Ninguna quedó en el árbol: todas revertidas, `git status` verificado limpio.

| # | mutación | resultado medido |
| - | -------- | ---------------- |
| **A** | tercer escenario `tercero-prueba/` tocando **sólo** `scenarios/` | `3/3 descubiertos` · `3/3 conformes` · `3/3 ejecutados con generador real · 3/3 con sello` · arnés intacto. **La CA que resistía resiste más fuerte: el tercero no sólo se descubre, se ejecuta.** |
| **B** | `units: ["no-existe"]` | `FAIL — units.en-catalogo — 1/1 fuera de units/catalog: no-existe` · `14/15` · bloque **sin** PASS |
| **C** | verbo `verbo.inventado` | `FAIL — verbos.en-ontologia — 1/2 fuera de ontology/hm-v1` · `14/15` |
| **D** | `v1:true` + `promoteToV1:true` en el JSON en disco | `FAIL — schema … must NOT have additional properties` + `FAIL — escenario(s) en disco con clave de auto-promoción` |
| **E** | `classifyV1` **obedece** las banderas | 3 rojos: `auto-declaración promovió segundo-minimo` · `classifyV1 hostil alteró v1: ["segundo-minimo","barrio-lore"]` · `no dejó acta` |
| **F** | `classifyV1` **deja de leer** `d.data` | `FAIL — classifyV1 no dejó acta de las banderas: ¿volvió a no leer d.data?` |
| **G** | el generador falla (escenario inexistente) | `FAIL — barrio-lore no corrió limpio: generar.mjs salió 1 …` + 9 artefactos ausentes + `rerun no fue no-op medido` · bloque «ejecución real» con 2 fallo(s) |

E+F son el par que importa: **si las banderas promovieran, enrojece; si el
código dejara de mirarlas, también.** Antes no enrojecía ninguno de los dos.

---

## 7 · Estado de los gates

| test | veredicto |
| ---- | --------- |
| `test-100` … `test-107` | PASS (8/8) |
| `test-108-mapa` | **FAIL (4)** — heredado de `main`, ver abajo |
| `test-109-despierta` | PASS |
| `test-111-escenarios` | **PASS** (9/9 bloques) |
| `ci/suite.mjs` | FAIL, y **corta en 108** antes de llegar a 109/111 |

### `test-108-mapa`: heredado, medido, y no es mío

```
[generar-mapa] FAIL — hash diverge: mapa.json
fixtures/mapa/mapa.json en disco    : 13574 bytes · 496 CRLF · sha256 d60929065bcdbb9e…
fixtures/mapa/mapa.json en el commit: 13078 bytes · LF       · sha256 433fa741e586ab6b…
fixtures/mapa/source.manifest.json:21 sella           sha256 433fa741e586ab6b…
```

El sello espera el blob **del commit**, y el blob del commit es correcto: lo que
está mal es **la copia de trabajo de este worktree**, materializada el
2026-08-02 07:37 con `core.autocrlf=true` **antes** de que `main` sellara
`.gitattributes` con `-text` para esas rutas.

> **Salvedad, aquí y no en un apéndice** (vuelta 3). De lo anterior **se sigue**
> que un clon fresco calcularía `433fa741…` y pasaría, pero **yo no lo demostré**:
> lo dejé escrito en indicativo sin haberlo corrido. Quien lo demostró fue la
> contrarrevisión, extrayendo árboles limpios con `git archive` sin tocar el
> repo. Mi §7 es **correcto y ajeno**: la deducción es mía, la prueba no.
> Escribirlo 190 líneas más abajo, en «Qué NO cubro», no valía: **la salvedad va
> donde está la afirmación**.

No lo toco, por tres razones: (1) `git diff main..HEAD` sobre `fixtures/` está
vacío — esta rama no lo alteró; (2) el defecto es de **copia de trabajo**, no de
contenido versionado, y arreglarlo aquí crearía un diff falso contra `main` en
un fichero que `main` acaba de sellar; (3) pertenece a la higiene de worktrees
del carril, no a WP-HUB-111. Queda como hallazgo con la medida encima.

---

## 8 · Qué NO cubro

- **La CA del backlog sigue diciendo «corre» sin decir qué corre.** La ejecución
  ya existe y la fila del reporte la acota, pero el texto de
  `plan/BACKLOG-F2.md:611-614` no se tocó: `plan/` está fuera de mi permiso en
  esta ficha. Si el orquestador quiere la precisión también allí, es una línea.
- **La ceremonia v1 sobre un escenario no-v1.** Sigue sin poder correrse, y hoy
  eso es correcto (§1). Genericizar `lib/ceremonia/` es otro WP.
- **`test-108-mapa` en verde local.** Diagnosticado, no arreglado (§7).
- **`ci/suite.mjs` en verde de punta a punta.** Corta en 108 por lo anterior;
  `test-111` está cableado en la suite (lista `required` + spawn) y verificado
  por invocación directa.
- **CI remoto.** Sin `git push` por prohibición explícita: no hay run-id.
- **Contrato de unidades y orden de verbos.** Los 4 chequeos de referencia
  resuelven **existencia**, no compatibilidad de `stateSchema` ni secuencia
  legal de ceremonia.

---

# Vuelta 2 · cierre de la contrarrevisión adversarial

La contrarrevisión reintentó los siete frentes y **el código no cedió en
ninguno** (ejecución real con siete formas de romperla, incluida la dura —que
`generar.mjs` salga 0 sin escribir nada—; fail-closed frente a cinco
degradaciones de referentes sin un solo skip; los cuatro chequeos de referencia
en rojo, incluidos los dos que yo nunca ejercité; el denominador 15 verificado
**por los dos lados**; y un clon fresco extraído con `git archive` que pasa,
confirmando el §7). Nada de eso se toca aquí.

**Lo que falló fue la evidencia escrita.** Cinco defectos, todos de documento
salvo dos de una línea de código. Van cerrados y medidos.

## B3 · Un sello que no reproducía — el peor de los tres

`REPORTE-ZV-111.md:78` (en un bloque presentado como **literal**) y
`REPORTE-WP-HUB-111.md` (fila 1 de la tabla CA, la que yo mismo reescribí)
citaban `seal=sha256:db3a044f…`. **No reproduce.**

Re-ejecutado hoy, con el **mismo `runId` que cita el reporte**:

```
$ node scripts/generar.mjs --scenario segundo-minimo --run test-111-segundo-minimo --sin-install
corrida 1 → exit=0 seal=sha256:a8ea8294e735d4c73d3743d6ebf1acd74d952676c69e18573c277155129415b7
corrida 2 → exit=0 seal=sha256:a8ea8294e735d4c73d3743d6ebf1acd74d952676c69e18573c277155129415b7
corrida 3 → exit=0 seal=sha256:a8ea8294e735d4c73d3743d6ebf1acd74d952676c69e18573c277155129415b7

$ node scripts/generar.mjs --scenario barrio-lore --run test-111-barrio-lore --sin-install
exit=0 seal=sha256:e42ddc758c7799431e9d4e09cc7a5a814861e24b8962118e03ee35838b35302a   ← el del reporte, intacto
```

**La causa, reproducida por mí y no aceptada de oídas.**
`scripts/generar.mjs:273-283` mete `scenario.simulacro.declared` dentro de
`sealPayload`, y `f11af08` —mi propio commit de vuelta 1— reescribió exactamente
esa cadena para `segundo-minimo`. Restaurando el `scenario.json` de `f11af08~1`
y corriendo con el mismo `runId`:

```
$ git show f11af08~1:…/segundo-minimo/scenario.json > …/segundo-minimo/scenario.json
$ node scripts/generar.mjs --scenario segundo-minimo --run test-111-segundo-minimo --sin-install
con el árbol PRE-f11af08 → seal=sha256:db3a044fb8914e90cdceca70c20262430b0682cbda43932bcedcda6153ea0beb
$ git checkout -- …/segundo-minimo/scenario.json      # restaurado, git status limpio
```

Es decir: **pegué el sello de una corrida anterior al arreglo que el propio
reporte describe.** `barrio-lore` reproducía porque su `scenario.json` no
cambió; sólo el escenario que mi corrección tocó quedó desfasado. Corregido
**re-ejecutando y pegando lo que salió**, en los dos documentos.

Hallazgo que me llevo de aquí, porque es método y no anécdota: **el sello
depende del `runId`** (entra en `sealPayload`). Corriendo el mismo escenario con
`--run zv2-segundo-minimo` sale `5a4fd4b0…`. Un sello citado sin su `runId` no
es reproducible; los dos documentos citan ahora la orden entera.

## B1 · Declaraba la suite en verde estando en rojo

`REPORTE-WP-HUB-111.md` pegaba `# lore-hm suite: PASS` y firmaba
`[x] Gates locales ejecutados (test-111 + suite PASS)`. Medido en el tip
entregado:

```
$ node ci/suite.mjs ; echo EXIT=$?
test-108-mapa: FAIL (4)
lore-hm suite: FAIL — test-108-mapa.mjs falló
EXIT=1
```

Lo peor no es el rojo —está diagnosticado en §7 y es heredado de `main`— sino
que **dos documentos del mismo commit se contradecían, y el que mentía era el
que lleva la tabla de CA**. Corregido: el bloque de evidencia pega la salida
real y remite a §7; la casilla de gates queda **sin marcar**, con el motivo
escrito al lado.

## B2 · Atribución de un fichero no tocado y de un aflojamiento inexistente

El reporte del WP listaba `ci/test-100-schemas.mjs` como modificado y declaraba
la desviación «se aflojó el conteo exacto 11→≥11». Medido:

```
blob HEAD : 8f4c82d22b0578fc1657dee2850a8c6c7893ecdc
blob main : 8f4c82d22b0578fc1657dee2850a8c6c7893ecdc
git diff --numstat main..HEAD -- ci/test-100-schemas.mjs → (0 líneas)
ci/test-100-schemas.mjs:454 → fail(`falta schema dominio obligatorio: …`)
```

Idéntico a `main`, y el árbol hace lo **contrario** de aflojar: exige presencia
de los once nombrados. `REPORTE-ZV-111.md` §0 ya lo contaba bien —«se tomó
`main` entero»—; era el reporte del WP el que conservaba la frase vieja en dos
sitios. Los dos corregidos.

**Y la auto-revisión de PRÁCTICAS estaba firmada sobre esa tabla.** Una
auto-revisión firmada sobre datos malos no vale como auto-revisión: **rehecha
entera**, casilla por casilla, contra el árbol de hoy — incluida la que ahora va
sin marcar.

## M1 · La guardia estaba puesta en un solo lado

`arnesMenciona()` sólo se aplicaba a `noV1Ids`, así que **cablear el id v1
dentro de `lib/escenarios/` no lo habría visto nadie**. (Y yo escribí «sin
ningún `scenarioId` dentro» teniendo uno en un comentario de
`ejecutar.mjs:13` — inocuo, el código es genérico y la mutación A lo prueba,
pero la frase era falsa.)

Cerrado el lado que faltaba: el barrido va contra **todos** los ids
descubiertos, con **una sola excepción declarada** —`v1-allowlist.mjs`, que es
el hogar contractual de la allowlist— y se exige además que el id v1 aparezca
**exactamente una vez** en ese fichero, la del array `V1_SCENARIO_IDS`. El
comentario de `ejecutar.mjs` ya no nombra el id.

> **Rectificación de vuelta 3: «la excepción no es una puerta» era falso como
> absoluto.** La afirmación principal se sostiene —H enrojece, un id no-v1
> dentro de la allowlist enrojece, una segunda aparición enrojece—, pero el
> adjetivo no. La contrarrevisión midió tres evasiones, **dos de ellas
> baratas**. Van dos cerradas y una declarada; el alcance honesto está al pie.

```
PASS — arnés sin hardcode — 0/2 escenarios cableados en 5 fichero(s) de
       lib/escenarios/** (recursivo; excepción declarada: 1 id v1 dentro de
       v1-allowlist.mjs)
```

## M2 · Una aserción nueva seguía verde por construcción

`inspected !== discovered.length` no podía enrojecer: `inspected` subía por
elemento del array, sin depender de leer `d.data`. Bajo la mutación F imprimía
PASS. **El recuento real de reemplazos de vuelta 1 era 1, no 2** — así queda
escrito en §3.

Corregido en el sitio donde estaba el defecto, no en el texto: la lectura de
datos pasa por `inspeccionarDatos()`, que devuelve **qué encontró y cuántas
claves recorrió**; `inspected` sólo sube si recorrió alguna, y el test cruza
`clavesLeidas` contra un total que **calcula él mismo** desde `discovered`.

## Pruebas de ceguera de esta vuelta — tres mutaciones, tres rojos

| # | mutación | resultado medido |
| - | -------- | ---------------- |
| **H** | cablear el id **v1** en otro fichero del arnés (el lado que faltaba) | `FAIL — el arnés menciona «barrio-lore» en ejecutar.mjs` · bloque «arnés sin hardcode» con 1 fallo |
| **I** | `classifyV1` deja de leer `d.data` (la mutación F de vuelta 1) | `FAIL — classifyV1 inspeccionó 0/2 escenarios` · `FAIL — classifyV1 recorrió 0/27 claves de datos` · `FAIL — no dejó acta de las banderas` → **tres**, donde antes caía una |
| **J** | referentes ilegibles mientras corre el negativo | `FAIL — units.en-catalogo enrojeció por otro motivo, no por el huérfano «no-existe»` (+ el gemelo de verbos) |

**J** cierra un hueco que la contrarrevisión anotó y que yo no había visto: el
negativo de referencia enrojecía **por el motivo equivocado** —referentes
ilegibles usan el mismo id de chequeo que un huérfano— y pasaba igual, sin
aseverar por qué. Ahora el negativo exige que el detalle **nombre su huérfano**
(`no-existe`, `verbo.inventado`); si enrojece por carga de referentes, falla.

## Menores anotados, con el argumento

- **`fixture.existe` es un `existsSync` pelado.** `fixture.path: "."` daría
  `ok=true`. No miento —el chequeo promete «existe en disco» y eso es lo que
  mide— pero **prometer «fixture» y medir «una ruta que existe» no es lo
  mismo**. Lo dejo anotado en vez de arreglado porque endurecerlo (exigir
  directorio, no vacío, dentro del árbol del escenario o de `fixtures/`) es una
  decisión de contrato del escenario, no una corrección de evidencia, y esta
  vuelta es de evidencia. Queda como el hueco conocido de los cuatro chequeos
  de referencia.
- **Base rancia (`4305792`)** — corregida a `c44ee91` en la cabecera del reporte
  del WP; era un dato de despacho que el rebase invalidó.
- **«La suite no cablea aún `test-108-mapa`»** — corregido: **sí** lo cablea, y
  es lo que la hace fallar. El hallazgo decía lo contrario de lo que pasa.

## Qué NO cubro (además de lo de §8)

- **No arreglé `fixture.existe`** (arriba, con argumento).
- **La cifra dura del guardián nuevo** (`apariciones !== 1`) se declara y se
  cuenta, no se deriva: §5 la enumera en vez de esconderla moviéndola a una
  constante.
- **`test-108-mapa` sigue rojo en este worktree** y la suite sigue cortando ahí.
  La contrarrevisión probó con `git archive` que un clon fresco pasa; yo no
  pude, y lo digo: mi §7 quedó **correcto pero no demostrado por mí**.

---

# Vuelta 3 · residuo de texto y el alcance real del guardián

## El hallazgo del `runId`, completado por la contrarrevisión

En §B3 escribí que el sello depende del `runId` porque entra en `sealPayload`.
**Es más fuerte que eso**: el `runId` va además **dentro del contenido de los
diez artefactos** (`room.json`, los dos `handoff.md`, `env.json`, `side.json`,
`package.json` de cada lado…), y los hashes de esos diez artefactos **también**
entran en el payload. Y falta la otra mitad, que yo no dije:

> **Un sello no es reproducible sin su `runId` ni sin el commit del
> `scenario.json`.** Las dos coordenadas, siempre, juntas.

Esto no es de esta ficha: vale para todo el programa. Cualquier acta que pegue
un `seal=` sin esas dos coordenadas está pegando un número que nadie puede
volver a obtener.

## El guardián del arnés · alcance medido, y qué queda abierto

**Qué es**, dicho sin adorno: **un guardián contra el cableado por descuido, no
contra el deliberado.** Es sustring sobre fuente, no análisis sintáctico.

Tres vectores medidos por la contrarrevisión. **Dos eran baratos y van
cerrados**; el tercero se declara.

| vector | vuelta 2 | vuelta 3 | por qué |
| ------ | -------- | -------- | ------- |
| 2.ª aparición con **comillas simples** | PASA | **ROJO** | el contador era `split("\"id\"")`, sólo comillas dobles. Ahora se despojan comentarios y se cuenta el id **desnudo**: da igual cómo se cite |
| **subdirectorio** `lib/escenarios/sub/…` | PASA | **ROJO** | `readdirSync` no era recursivo. Ahora `ficherosDelArnes()` baja el árbol entero |
| **concatenación** `"barrio" + "-lore"` | PASA | **PASA** | **deuda declarada**, abajo |

Los dos rojos, literales:

```
K · const B = 'barrio-lore' dentro de v1-allowlist.mjs
FAIL — «barrio-lore» aparece 2 vez/veces en el código de v1-allowlist.mjs;
       sólo vale la de V1_SCENARIO_IDS

L · lib/escenarios/sub/cableado.mjs con los dos ids
FAIL — el arnés menciona «barrio-lore» en sub/cableado.mjs — debe bastar scenarios/
FAIL — el arnés menciona «segundo-minimo» en sub/cableado.mjs — debe bastar scenarios/
```

Y el bloque ahora dice su propio alcance: `0/2 escenarios cableados en 5
fichero(s) de lib/escenarios/** (recursivo; …)`.

### Deuda declarada · concatenación

**Vector exacto**, para que quede ejecutable por quien venga:

```js
// en lib/escenarios/v1-allowlist.mjs — el guardián NO lo ve, medido hoy
export function isV1Scenario(scenarioId) {
  if (scenarioId === "barrio" + "-lore") return true;   // → bloque en PASS
  return V1_SCENARIO_IDS.includes(scenarioId);
}
```

**No lo cierro, y el argumento:** cerrarlo exige dejar de mirar el fichero como
texto y mirarlo como **AST** —resolver literales, plegar constantes, seguir
variables intermedias—, y en cuanto entras ahí la escalada no termina
(`String.fromCharCode`, plantillas, un `JSON.parse`). Es otra herramienta, no un
retoque de ésta. El guardián cubre el caso que de verdad ocurre —alguien cablea
un id sin pensar— y **deja escrito que un cableado deliberado se le escapa**.
Ponerle el adjetivo «infalible» a un `includes()` es la clase de frase que estas
vueltas vienen a quitar.

Nota de asimetría, a propósito y ahora escrita: en el barrido general de los
demás ficheros del arnés **no** se despojan comentarios —la afirmación de este
WP es que el arnés no nombra escenarios ni de pasada, y así fue como saltó el
comentario de `ejecutar.mjs`—; en el recuento del fichero de allowlist **sí**,
porque su comentario de cabecera explica legítimamente qué es la allowlist.

## Dos cifras que no reproducían

| dónde | decía | es | de cuándo venía |
| ----- | ----- | -- | --------------- |
| `§4` y `§7` | «8 bloques» / `8/8` | **9** (`grep -c '^bloque('` → 9; el test emite 9 líneas `PASS —`) | ya eran 9 en la vuelta 1 (`7df599b`) |
| `§0` | «15 ficheros» | **16** (`git diff --name-only main..HEAD \| wc -l`) | eran 15 en `f11af08`, antes de que este mismo reporte se commiteara |

Ninguna de las dos escondía nada —una infra-declaraba, la otra era un dato de
despacho caducado— y precisamente por eso las anoto en vez de corregirlas en
silencio: **son el mismo género que la base rancia y el sello desfasado**, y
sobrevivieron a la vuelta cuya tesis es que las cifras escritas deben
reproducir. Un reporte no queda a salvo de su propia regla.

## Una salvedad mal colocada

«§7 quedó correcto pero no demostrado por mí» estaba escrito… **190 líneas
después de la afirmación**, en «Qué NO cubro» de la vuelta 2. Quien leía §7 veía
«Un clon fresco (CI) calcula `433fa741…` y pasa» en indicativo y sin marca.

Movida a §7, junto a la frase. La regla de la casa sobre actas y documentos
vivos —la salvedad va donde está la afirmación— **también rige dentro de un
mismo documento**; un apéndice no es una corrección, es un descargo.

## `fixture.existe` · el vector, ahora con su medida

La contrarrevisión midió lo que yo anoté a medias: con `fixture.path: "."` no
sólo pasa ese chequeo — **cierran 15/15 en `ok=true`**. Sigo sin arreglarlo, con
el mismo argumento aceptado: endurecerlo es **contrato del escenario**, no
corrección de evidencia. Pero la deuda queda con el vector encima, que es lo
honesto:

```
scenario.json con "fixture": { "path": ".", "note": "…" }
→ conformidad 15/15 ok=true · el escenario pasa entero
```

## Qué NO cubro (vuelta 3)

- **Concatenación en el guardián** — deuda declarada arriba, con vector.
- **`fixture.existe`** — deuda declarada arriba, con vector y cifra.
- **El guardián sigue siendo textual**: no ve `import`s indirectos, ni un id
  construido en tiempo de ejecución, ni ficheros del arnés que no sean `.mjs`.
- **CI**: la rama la empujó el orquestador como `wp/zv-hub-111-…`; yo no he
  hecho `push` y no tengo run-id que pegar.
