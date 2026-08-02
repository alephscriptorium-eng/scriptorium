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
git diff --name-status main..HEAD      # 15 ficheros, todos bajo playground/prueba-de-H-M/**
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

`lib/escenarios/ejecutar.mjs` (nuevo, genérico, sin ningún `scenarioId` dentro)
y §7 de `ci/test-111`:

```
· barrio-lore: node scripts/generar.mjs --scenario barrio-lore --run test-111-barrio-lore --sin-install → exit=0
· barrio-lore: manifest: seal=sha256:e42ddc758c7799431e9d4e09cc7a5a814861e24b8962118e03ee35838b35302a artefactos-sellados=10
· barrio-lore: rerun sin --force-new → exit=0 no-op=true
· barrio-lore: artefactos 9/9 · idempotente=true · limpiado=true
· segundo-minimo: node scripts/generar.mjs --scenario segundo-minimo --run test-111-segundo-minimo --sin-install → exit=0
· segundo-minimo: manifest: seal=sha256:db3a044fb8914e90cdceca70c20262430b0682cbda43932bcedcda6153ea0beb artefactos-sellados=10
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
`ignoredClaims` e `inspected`. Eso vuelve la aserción falsable por dos lados, y
ambos están medidos (E y F en §6).

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
`bloque «X» con N fallo(s)`. Los ocho bloques del test pasan por ahí.

Demostrado vivo en la medida B de §6: el bloque de conformidad **no** imprime
PASS cuando algo falla dentro.

---

## 5 · Cifras duras · barrido con denominador

Barrido automático (se despojan comentarios y literales de cadena antes de
buscar, para no contar el `111` de un mensaje). Definición: literal numérico en
comparación, o id de escenario/barrio citado literalmente.

| fichero | cifras duras de dominio | ids literales |
| ------- | ----------------------- | ------------- |
| `ci/test-111` **antes** | **2** (`:74` `ids.length < 2` · `:175` `v1.length !== 1`) | **10** |
| `ci/test-111` **después** | **0** | **1** |

- `:74` → umbral **derivado**: `V1_SCENARIO_IDS.length + 1` («al menos un
  escenario más allá de la allowlist, o "descubrible" no significa nada»),
  contrastado contra un **recuento independiente del disco**
  (`recuentoDirectoDeDisco()`), que es el que da el denominador `2/2`.
- `:175` → comparación de conjunto contra `V1_SCENARIO_IDS`, más
  `inspected === discovered.length`.
- Los 9 ids literales que sobraban desaparecen: el hostil se monta sobre
  `noV1Ids[0]`; víctima y base salen del descubrimiento.
- El **1** que queda es deliberado (`:129`): afirma que `segundo-minimo` —el
  entregable de este WP— sigue existiendo. No bloquea a un tercer escenario.

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
| `test-111-escenarios` | **PASS** (8/8 bloques) |
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
`.gitattributes` con `-text` para esas rutas. Un clon fresco (CI) calcula
`433fa741…` y pasa.

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
