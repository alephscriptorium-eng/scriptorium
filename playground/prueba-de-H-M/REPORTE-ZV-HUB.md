# REPORTE ZV · contrarrevisión de los siete frentes

| campo | valor |
| ----- | ----- |
| rama | `wp/lore-hm-accum` |
| tip de partida | `8c38119` |
| commits | `9ac352b` `aa98be7` `b124b74` `4695cd0` `c8113c3` · **vuelta 2:** `a653d3c` |
| alcance | `playground/prueba-de-H-M/**` |
| suite | `node ci/suite.mjs` → **PASS** (100…109) |
| denominador | 117 ficheros versionados · 52 `.mjs` |
| negativos test-107 | 11 → 21 → **30** |

El movimiento es uno solo, repetido en los cuatro primeros frentes:
**no fiarse de lo que el artefacto dice de sí mismo, recomputar.** El patrón
no se inventó aquí: ya estaba hecho y bien en `validateShutdown`
(`REQUIRED_SHUTDOWN_VERBS` como raíz de confianza fuera del pack + `present`
recomputado desde los wires). Se copió, no se sustituyó.

---

## Método de medición

Todo vector se **re-midió antes de tocar nada** y se volvió a medir después.
Los arneses adversariales viven fuera del repo (scratchpad de sesión); las
mutaciones se aplican sobre copias de un `evidence/` real recién generado.

Un detalle que cambia los resultados: a partir de la segunda tanda los
negativos usan un **atacante «reparador»** que rehace matriz, hashes,
cobertura y sello del pack antes de pedir veredicto. Sin él, un guardián
superficial se apunta un tanto que no es suyo y el guardián profundo queda
sin probar. Está incorporado a `ci/test-107` como `repairSuperficial()`.

**Acotación (devolución ZV-HUB).** En la primera entrega ese reparador hacía
**cuatro de cinco**: no rehacía la cadena de `provenance.upstream`. Mis
negativos estaban elegidos de modo que no importara —los rojos que reporté
eran míos—, pero presenté el reparador como la respuesta a la clase entera y
no lo era: un vector que tocase la cadena habría enrojecido por «provenance
rota» antes de llegar al guardián que decía probar, que es exactamente el
tanto ajeno que este párrafo dice evitar. Ya lleva re-ancla topológico, y está
partido en `repairSuperficial()` (con cadena) y `repairShallow()`, para que un
negativo pueda romper la cadena *después* del re-ancla. Además `result` sale
ahora del wire y `report.md` del render: el arnés dependía de que nadie mirase
esos dos campos.

---

## ① El verificador certificaba lo que el productor declara

### Antes — salida literal del arnés

```
[v0-control]              ok=true checks=11 <<< PASA
[v1-cobertura]            ok=true checks=11 <<< PASA (agujero)   (matrix rows=34)
[v2-sello-pack]           ok=true checks=11 <<< PASA (agujero)
[v2b-pack-mutado]         ok=true checks=11 <<< PASA (agujero)
[v4-hashes-basura]        ok=true checks=11 <<< PASA (agujero)
[v3-11-parejas-fabricadas] ok=true <<< PASA (agujero)  (activities=22, parejas=11, reales=0)
[v3b-borrar-6-pasos-reales] ok=true <<< PASA (agujero) (parejas 17 a 11, borradas 6)
```

Los cuatro vectores del auditor reproducen. `v2b` es adicional: mutar el
contenido del pack **sin tocar** el digest declarado también pasaba, porque el
digest que `evidence-pack.mjs` calculaba sobre los seis documentos no lo leía
nadie jamás.

### Después

```
[v1-cobertura]            RECHAZA reporte inválido: matrix no coincide con wires: verbo.inventado: 34 vs 0
[v2-sello-pack]           RECHAZA sello del pack roto: digest declarado=sha256:ffff… recomputado=…
[v2b-pack-mutado]         RECHAZA sello del pack roto
[v4-hashes-basura]        RECHAZA hash roto: report.hashes declara un hash sin wire que lo respalde
[v3-11-parejas-fabricadas]  RECHAZA pareja bilateral inesperada: paso/verbo no declarado por la ceremonia
[v3b-borrar-6-pasos-reales] RECHAZA pareja bilateral inesperada: faltan 6 parejas declaradas
```

Y con el atacante reparador, para probar el guardián **profundo**:

```
[A-17-parejas-fabricadas]  RECHAZA pareja bilateral inesperada   (34 activities, 17 parejas, 0 reales)
[B-6-reales-por-6-falsas]  RECHAZA pareja bilateral inesperada   (cardinalidad restaurada a 17/34)
[C-verbo-real-suplantado]  RECHAZA pareja bilateral inesperada   (graph.bifurcate a graph.inventado)
[D2-cobertura-declarada-falsa] RECHAZA cobertura autocertificada: declara 90/90, recomputado 100/100
[E2-upstream-inventado-ambas]  RECHAZA provenance rota: upstream sha256:999… sin actividad que lo respalde
```

### Qué se cambió

- **Cobertura** — `computeCoverage()` en `lib/ceremonia/evidence.mjs` es una
  sola fórmula: el productor la usa para escribir `report.coverage` y el
  verificador la **reejecuta sobre `activities/`**. El conjunto esperado sale
  de `CEREMONY_STEPS` + `CEREMONY_SECONDARY_VERBS`, no de una lista inline.
- **Sello del pack** — `computePackDigest()` en `evidence-pack.mjs`, una sola
  función para productor y verificador. Si hubiera dos copias de la fórmula el
  sello volvería a ser autocertificado.
- **Parejas** — `EXPECTED_PAIR_KEYS` deriva de `CEREMONY_STEPS`. La relación es
  **biyectiva**: ninguna pareja que la ceremonia no declare, ninguna declarada
  que falte. El verbo del `id` y el de **ambas** mitades han de coincidir.
- **Hashes** — biyección en vez de subconjunto. Faltaba el recíproco.
- **Orden** — la evidencia se valida **antes** que el reporte. `activities/` es
  el hecho; `report.json` es la afirmación.

### El guardián del arreglo

`ci/test-107:124` exigía `checks.length < 8` mientras el verificador empujaba
11: se podían borrar tres —incluida la cadena causal— y quedaba verde. Ahora
los **12 checks se fijan por nombre**, con detección de ausentes *y* de
sobrantes. Negativos en `test-107`: **11 a 21**.

Cifras duras eliminadas del verificador: `paired < 11`, `dirs.length < 22`,
`matrix.length < 11`, `checks.length < 8`. La de `activities` **no se
sustituyó por otra**: la biyección la subsume y además dice quién falta.

---

## ② `CAUSAL_STRIPPED_FIELDS` no podía fallar nunca

**Medido antes:** 2 ocurrencias (su declaración y un comentario en prosa en
`envelope.mjs:46`), **cero imports**. La cita del auditor («declara cinco,
quita cuatro») estaba caducada: medí que quitaba **las cinco**. Pero el
diagnóstico se sostiene entero, porque el problema no era el número sino que
`causalCore` era una **allowlist positiva**: sólo coincidía con la constante
por intención del autor, y un campo nuevo del envelope quedaba fuera del
núcleo **en silencio**.

**Después:** `causalCore()` deriva por *denylist*. Un campo nuevo entra en el
núcleo por defecto. Test de propiedad, campo a campo:

> mutar un campo cambia el `causalDigest` **si y solo si** no está declarado
> como marca del observador.

```
test-106-ceremonia: PASS — CAUSAL_STRIPPED_FIELDS gobierna causalCore
                           (11 campos + 7 de context probados uno a uno)
```

El test **enrojeció al primer intento** y encontró un defecto real que yo
mismo acababa de introducir: la normalización de `provenance` descartaba en
silencio cualquier clave extra — una allowlist encubierta dentro de la
denylist. Corregido.

---

## ③ La cadena causal comparaba los campos que eligieron no mirar

**Medición empírica** sobre las 34 mitades de una corrida real, antes de
decidir nada:

```
parejas: 17
top-level que DIFIEREN H vs M: actor, context, digest, id
context que DIFIEREN: side
wires con instrument: 34 / 34
```

`instrument` y `timestamp` son **idénticos en las 34 mitades**. Se excluían del
núcleo causal sin necesidad, y por eso pasaba el vector del auditor.

**Salida elegida: la primera.** `instrument` y `context` entran en el núcleo.
`CAUSAL_STRIPPED_FIELDS` pasa a ser `["actor","digest"]` y
`CAUSAL_STRIPPED_CONTEXT_FIELDS` `["side"]`. La frase de la CA se sustituye por
`CAUSAL_SHARED_STATEMENT`, que dice exactamente qué comparten:

> id (sin sufijo `:H`/`:M`), verb, object, target, result, provenance,
> instrument, timestamp y context salvo `side`. Difieren sólo en actor,
> context.side, el sufijo del id y su propio digest.

El vector concreto (`instrument:demiurgo` / `unitId:vector-mock` / `1999` en la
mitad M) pasa de `ok=true` a `cadena causal diverge`, y está fijado en
`test-106` y en `test-107`.

**Sobre los dos observadores — declarado, no disimulado:** sigue habiendo **un
solo bucle** escribiendo las dos filas. `compareCausalChains` tenía **cero
llamadas reales**; ahora se invoca en el camino real de `runCeremonia` sobre
los `chain.ndjson` releídos de disco, empareja **por identidad de actividad y
no por posición** (comparar `chainH[i]` con `chainM[i]` sólo funcionaba porque
un único bucle las escribe en el mismo orden) y exige que `side` y
`wireDigest` difieran.

Lo que el verificador aporta es **detección de manipulación posterior, no
independencia**. En la primera entrega escribí que «la independencia real la
aporta el verificador recomputando cada mitad»: se pasa. Las dos mitades
salen del **mismo `outcome` en la misma iteración**, así que la igualdad de
sus núcleos causales es **tautológica en el camino real** — no puede fallar
salvo que alguien toque los ficheros después. Recomputar detecta ese toque;
no convierte un escritor en dos observadores. Eso es lo que hay.

---

## ⑤ La política del pod no la llamaba nadie

**Medido antes** — `authorize()`: 1 definición + 5 llamadas, **todas en
`ci/test-103`**. Cero en el camino de ejecución. Los nueve vectores:

```
[V1-lease-1999]        lease emitido con expiresAt=1999-01-01 → pod.state=inflated
[V2-lease-nofecha]     lease emitido con expiresAt=no-soy-una-fecha → inflated
[V3-lease-omitido]     lease emitido con expiresAt=undefined → inflated
[V4-transition-sin-acl] ACL vacía y aun así ready→running
[V4b-transition-acl-niega] authorize dice allowed=false (acl-no-actor) — transition igualmente
[V5-permissions]       permissions=["nada-que-ver"] y aun así running
[V6-setAcl]            sin actor/lease/firma → allowed=true; eventos 1→1 (NINGUNO)
[V7-comodin]           verbs:["*"] → allowed=true para un verbo inexistente
[V8-identidad]         {role:'M',trusted:true} autoafirmada aceptada
[V9-lease-caducado]    lease caduco en 1999, ACL sin expiresAt → allowed=true
```

**Después** — los nueve cierran:

```
[V1] DENIEGA: expiresAt ya caducado          [V2] DENIEGA: no es fecha ISO
[V3] DENIEGA: expiresAt requerido (ISO-8601) [V4] DENIEGA: denegada (acl-omitted)
[V4b] DENIEGA: denegada para intruso (acl-no-actor)
[V5] DENIEGA: la ACL concede 'unit.start' fuera de permissions [unit.inspect]
[V6] DENIEGA: actor requerido    [V6b] DENIEGA: intruso sin autoridad
[V6c] H (emisor) sí puede; eventos 1 a 2; acl.set con previousDigest y nextDigest
[V6d] intento denegado deja 1 evento acl.set.denied
[V7] acl-invalid (isValidAclEntry rechaza el comodín)
[V8] DENIEGA: identidad M inválida           [V9] allowed=false (lease-expired)
```

`transition(unitId, to, { actor })` pasa por `authorize()` con el verbo de
`TRANSITION_VERB`. Los **seis** call sites de `steps.mjs` declaran quién actúa:
M arranca (`unit.start`), H apaga (`unit.stop`) — coherente con las ACL que la
propia ceremonia ya emitía. La ceremonia sigue en verde con la política
gobernando de verdad.

`lib/podstore/*` deja de estar byte-idéntico: 4 de 5 ficheros modificados.

**FRONTERA DECLARADA (contrato, no código):** sin autoridad de credenciales en
el simulacro, quien llama sigue aportando la identidad de M. Se retiró la rama
`{role:'M', trusted:true}` —autoafirmación pura— y queda el contraste contra
`maestroIri`, pero el único gate real es que **sólo H puede emitir lease**.
Cerrarlo de verdad exige peercard firmada y verificable, que el playground no
tiene. Está escrito en el JSDoc de `_validateMaestroIdentity`, no escondido.

---

## ⑥ Tres guardianes ciegos

**Rutas de máquina.** Dos listas distintas (`ABSOLUTE_PATH_PATTERNS` en
`importar-onfalo.mjs`, `assertNoMachinePaths` en `generar.mjs`) y **ninguna
cubría `C:/S_LAB/`**. Ahora hay una sola definición en `lib/rutas-maquina.mjs`,
con cualquier unidad Windows, UNC, homes POSIX, `/root`, `/Volumes`, `/mnt`,
`~/`, `$HOME` y `%USERPROFILE%`. El patrón de unidad exige que la letra **no
venga precedida de otra letra**, para no confundir `https://` con `S:/`.
Medido 28/28 casos, cero falsos positivos sobre `/homework`, `/rooted`,
`a ~ b`, `urn:`, `linea://`, `sha256:` y timestamps.

**Corrección de una corrección mía.** En la primera entrega escribí «18 de
116». Es **falso**, y el error fue mío al corregir al auditor — que es peor que
el error original, porque llega con más autoridad. Medí con un `grep` de
`C:[\/]S_LAB[\/]`, es decir sólo las rutas a *ese* directorio, y presenté el
resultado como el recuento general de rutas de máquina. Re-medido con
`findMachinePath` —mi propio detector—, fichero a fichero de `git ls-tree`:

| commit | rutas de máquina / ficheros |
| ------ | --------------------------- |
| `8c38119` (base de partida) | **22 / 114** |
| `b124b74` … `c8113c3` | **23 / 116** |
| `af030de` (entrega anterior) | **24 / 117** |

En HEAD son **24**: 15 `.md` + 9 `.mjs`. El denominador 116 sí era correcto en
su momento; el numerador no lo fue nunca. La cifra del auditor original (20 de
111) estaba más cerca de la verdad que mi «corrección».

**Schemas linea-kit.** `grepZeroOwnLineSchemas` comparaba **nombres de
fichero**: copiar `manifest-tronco.json` como `mi-tronco.schema.json` pasaba
limpio. Ahora compara contenido normalizado y `$id`. Comprobado en vivo:

```
test-100-schemas: FAIL — schemas/mi-tronco-propio.schema.json es copia
                         byte-a-byte de linea-kit/manifest-tronco.json
```

**Y en producción nadie validaba.** Medido: **0 imports estáticos** de
`@zeus/linea-kit` en los 52 `.mjs`; las 4 ocurrencias eran mensajes de error y
un comentario. `materializeLines` etiquetaba `lineaKitSchema:"manifest-tronco"`
sin validar nunca. Nuevo `lib/cadena/linea-kit.mjs` —resolutor único, antes
duplicado en `test-100` y `test-105`— y **producción valida o no materializa**.

**El gate que pasaba sin fuente.** Medido:

| invocación | antes | después |
| ---------- | ----- | ------- |
| `--gate` (cantera viva) | exit 0 | exit 0 |
| `--gate` (cantera ausente) | **exit 0, «gate OK»** | **exit 3** |
| `--gate-sin-cantera` (ausente) | — | exit 0, «gate DEGRADADO» |

El modo degradado sigue existiendo para runners sin la cantera montada, pero
hay que **pedirlo por su nombre** y se anuncia como degradado. Un verde que
significa lo mismo pase lo que pase no informa de nada.

---

## ⑦ Cifras duras a propiedades

Barrido sobre los 116 ficheros versionados (52 `.mjs`).

| | antes | después |
| - | ----- | ------- |
| cifras duras de **dominio** | **24** | **4** |

Las 4 restantes son mínimos estructurales de parseo —`cells.length < 4/5` al
leer tablas markdown, `token.length > 2` al tokenizar, 2 personajes por lado
en el elenco—, no hechos de dominio disfrazados de número. Se dejan a
propósito.

Convertidas: 11 pasos / 22 wires / 34 filas / `paired>=11` / `checks<8` a
`CEREMONY_STEPS` y `EXPECTED_ACTIVITY_PAIRS` · 5 secciones Bartleby a
`SECTION_IDS.length` (estaba escrito **4 veces**, una en producción y tres en
el test, sin relación con la constante que las define) · 2 piezas Onfalo a
`EXPECTED_PIECES.length` · 10 unidades a `STATIC_UNIT_IDS.length` **más cruce
por nombre** contra `units/catalog/` (diez ficheros cualesquiera cuadraban con
«10») · 7 holones a `HOLONES_META.length` · 6 distritos a las claves de
`DISTRITO_HOLON` · 24 barrios a `CONTEO.BARRIOS`, pin único declarado (no
derivable: el censo **es** la fuente) en vez de escrito cuatro veces ·
`verbs.length >= 29` de la ontología a **propiedad**: todo verbo que la
ceremonia emite debe estar declarado. La cifra permitía quitar los verbos
usados y añadir 29 inventados sin enrojecer.

---

## ④ La ceremonia no sabía registrar su propio fracaso

**Medido antes:**

```
result:"fail"   -> 0 ocurrencias
failures.push(  -> 0 ocurrencias

throw genuino inyectado en materializeLines:
  lanza: CeremonyError | code=unexpected | step= undefined
  existe runRoot?      false
  existe report.json?  false
  .runs contiene:      (nada)
```

No es que el veredicto fuera erróneo: **no había veredicto**. El borrado de
estado parcial —correcto y que resiste— se llevaba la corrida entera. Y el
error perdía el paso (`step= undefined`).

**El wipe no se toca.** Lo que se añade es el acta, en
`.runs/_actas/<runId>.json`, **hermano** del `runRoot` y por tanto
superviviente, escrita **antes** del wipe por si el borrado falla a medias.
Lleva dónde (step, verb, unitId, pasos completados), por qué (code, frontier,
message) y qué se borró (`wipedRunRoot` más la nota de contrato).

**Medido después:**

```
throw en materializeLines → step=7 verb=line.materialize unitId=pipeline
                            completados=6 · runRoot borrado? true
skipStep=1                → step=2 code=missing-upstream
kill en los 11 pasos      → 11/11 con acta correcta (paso, verbo, completados)
```

**FRONTERA DECLARADA:** `result:"fail"` en envelopes sigue siendo 0 y **debe**
serlo. Un paso que falla no llega a sellar wire, y la evidencia de la corrida
se borra por contrato. No existe «evidencia parcial de fracaso»: existe acta.
Son cosas distintas y el acta lo dice con esas palabras.

---

## Vuelta 2 · los cuatro bloqueantes de la devolución

Los cuatro reproducen. Re-medidos con arnés propio antes de tocar nada.

### B1 · La biyección comparaba la clave, no la corrida

El regex de `activityPairKey` no miraba el prefijo `runId`, y los wires no
estaban atados ni a `report.runId` ni a `pack.runId`.

```
ANTES  34 actividades fabricadas · claves EXACTAS · prefijo de otra corrida
       object:"urn:fabricado:nada-ocurrio" · solapamiento con la real: 0
       -> ok=true  checks=12

DESPUÉS -> RECHAZA pareja bilateral inesperada:
           urn:scriptorium:hm:CORRIDA-QUE-NUNCA-EXISTIO:… prefijo de otra corrida
```

**Corolario, también medido:** vaciar `provenance.upstream` en las 34 mitades
pasaba. El check llamado «cadena causal» no exigía que hubiera cadena. Ahora
el enganche de cada paso se recomputa contra el `upstream` que declara
`CEREMONY_STEPS`:

```
ANTES   upstream:[] en los 34 -> ok=true  checks=12
DESPUÉS -> RECHAZA cadena causal diverge: 2|peer.announce|pri:
           upstream=[] ≠ enganche declarado [sha256:6186e44b…]
```

Nota sobre mi propia línea de prueba: el reviewer tiene razón en que el
negativo «0 reales» enrojecía por los verbos `zzz.*`, no por el guardián. Los
negativos de clave usan ahora el `runId` **real**, de modo que siguen probando
el guardián de clave y no el de prefijo.

### B2 · El verificador nunca leía `wire.result`

```
ANTES   34 wires result:"fail"  ->  report.verdict:"pass"  ->  ok=true
DESPUÉS -> RECHAZA reporte inválido: verdict=pass con 34 wires que no son pass
```

Y la matriz se contrastaba **por recuento de verbos**, así que `actor`,
`object` y `result` de cada fila eran libres. Ahora se compara fila a fila por
la tupla `(verb, actor, object, result)`. El reviewer señala el detalle que más
duele y es cierto: **mi `repairSuperficial` escribía `result:"pass"` sin mirar
el wire** — el arnés dependía de que nadie mirase ese campo. Ahora lo toma del
wire, con lo que el reparador queda obligado a reparar también `result`.

### B3 · El sello del mapa no tenía raíz de confianza

`assertSeal` recorría sólo `manifest.pieces` —autodeclarado— y recomputaba el
sello de esa misma lista.

| vector | antes | después |
| ------ | ----- | ------- |
| excerpt sustituido + resellado | exit 0 | **exit 1** |
| excerpts fuera de `pieces` + mutados | exit 0 | **exit 1** |
| `pieces: []` (sello de la cadena vacía) | exit 0 | **exit 1** |
| `mapa.json` reasignado + todo resellado | — | **exit 1** |
| control intacto | exit 0 | exit 0 |

Dos capas: `SEALED_MAPA_PIECES` como raíz contrastada contra el manifest —el
patrón que ya estaba escrito 40 líneas más allá en el verificador— y, porque
**un sello prueba integridad y no veracidad**, la proyección se **recomputa**
desde los excerpts sellados. `mapa.json` es derivado de ellos, así que se puede
rederivar sin cantera.

### B4 · Mi corrección de la cita era incorrecta

Ver el bloque de rutas de máquina en ⑥. En resumen: escribí «18 de 116»
midiendo sólo `C:/S_LAB/` con un grep, no con mi propio detector. Lo correcto
es **24 / 117** en HEAD (22/114 en la base). El reviewer tiene razón, y su
número coincide con el mío al re-medir.

### Menores cerrados

`report.md` se compara con su render (antes: contenido libre con dos cadenas
mágicas) · `ceremonyId`/`scenarioId` contra la raíz · `artifactChain`
recomputado contra el `object` del wire de cierre —el cruce estaba en la
evidencia y no se usaba— · `validateTipestate` exige que las unidades de la
ceremonia estén y cierren (reducir `transitions` a una y vaciar `finals` daba
verde) · `validateAcl` exige capacidad vigente de **ambos** actores por unidad
(bastaba *una* positiva) · schemas por huella **estructural**, que atrapa el
reetiquetado `$id`+`title` · rutas de máquina +7 patrones · el guardián de los
12 checks detecta duplicados y cardinalidad · `acta.frontier` deja de ser
`null` · `CONTEO` en los counts del manifest y dos logs · código muerto tras
`fail()`.

---

## Qué NO cubro

1. **Identidad de M.** Cerrada la autoafirmación `trusted:true`; el residuo
   —quien llama aporta la identidad— es **contrato, no código**, y está
   declarado en el JSDoc. Requiere peercard firmada y verificable.
2. **Un solo escritor de las dos mitades.** No lo he partido en dos
   observadores reales. Está declarado en ③ y en el JSDoc de
   `compareCausalChains`. Partirlo es rediseño de la ceremonia, no una
   contrarrevisión.
3. **`verbo-fuera-de-permissions` en `authorize()`** es defensa en profundidad
   hoy **inalcanzable**: `issueLease` y `setAcl` ya rechazan en emisión toda
   ACL que exceda las permissions. La dejo y lo digo, en vez de fingir que la
   he probado.
4. **Las 18 rutas de máquina existentes** en el repo (reportes `.md`, fixtures,
   3 ficheros de CI, `generar-mapa.mjs`). El guardián ya las detecta, pero
   guarda **contenido que entra** (piezas Onfalo, árboles generados); no hace
   barrido del repo. Limpiarlas toca reportes de otros WP y fixtures sellados
   cuyos hashes están fijados: fuera de un arreglo de guardianes.
5. **`DEFAULT_CANTERA` / `DEFAULT_HOLONES_*`** siguen siendo rutas absolutas a
   `C:/S_LAB/s-sdk`. Son configuración de entorno, no contenido filtrado, y
   `s-sdk` es READ_ONLY con otro worker vivo: no lo toco.
6. **`ci/CONTRARREVISION-WP-HUB-113.md` y `REPORTE-WP-HUB-113.md`** no los he
   revisado ni actualizado; el encargo era código y guardianes.
7. **Cobertura de `lib/despertar/`** (WP-109): no había vectores en el encargo
   y no la he auditado por mi cuenta.
8. **Vuelta 2 — sigue abierto:** el sexto vector es más ancho de lo que cierro.
   `report.md` y `provenance.ceremonyId/scenarioId` ya se contrastan, pero
   siguen fuera del sello del pack los campos de `pack/manifest.json` que no
   son de los seis documentos y los campos de `report.json` que no entran en
   ninguna comprobación. Se contrastan por otras vías o no se contrastan; no
   están sellados. Lo dejo dicho en vez de afirmar que la clase está cerrada.
9. **Vuelta 2 — el guardián de los 12 checks vigila etiquetas, no ejecución.**
   Detecta renombrar, impostores, duplicados y cardinalidad, pero comentar la
   llamada dejando el `push` seguiría devolviendo 12 nombres. Quien lo salva es
   la suite —los negativos enrojecerían—, no el guardián. Verificar ejecución
   real exige instrumentar el verificador, y eso es rediseño.

## Reproducir

```bash
cd playground/prueba-de-H-M
node ci/suite.mjs                  # 100…109 -> PASS
node ci/test-107-verificador.mjs   # 21 negativos, 12 checks por nombre
node ci/test-106-ceremonia.mjs     # propiedad CAUSAL_STRIPPED_FIELDS + actas
node ci/test-103-podstore.mjs      # 7 grupos de política del pod
```
