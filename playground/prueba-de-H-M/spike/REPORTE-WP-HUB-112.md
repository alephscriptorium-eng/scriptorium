# WP-HUB-112 · hm-spike-viabilidad — reporte

| dato | valor |
| ---- | ----- |
| agente | Orquestador LORE-HM (ola 0 · GO custodio) |
| fecha | 2026-08-02 |
| rama | `wp/hub-112-hm-spike-viabilidad` |
| worktree | `C:/S_LAB/wt/scriptorium-wp-hub-112` |
| commits | `03a051142058ca622533bb7bab98a690d66cd2c8` (push OK) |
| eje(s) CA | evidencia literal · frontera RO · veredicto pieza a pieza |
| riesgo de revisión | `independiente` (puede reordenar/tumbar la lane) |
| revisor distinto del worker | **PASS_CON_ADDENDA** · `CONTRARREVISION-WP-HUB-112.md` |
| estado propuesto | aceptado · **verde solo local** (hub sin CI de pruebas; `113` sigue P0) |
| log de medidas | `playground/prueba-de-H-M/spike/medidas-literales-2026-08-02.txt` |

## Qué se hizo

Se midió, con orden exacta y salida literal (nunca por docs), si H y M pueden
hoy operar **procesos reales** con material Onfalo sobre la Future Machine del
barrio 20. Preflight de identidad PASS en hub y en worktree. Se re-verificaron
los tres hechos heredados (CI `docs.yml` solo; submódulos e-sdk con prefijo `-`
y dirs vacíos; piezas Onfalo en disco). Se intentó ejecutar la cadena mínima
Bartleby → Cristalizador → Pipeline como binarios/procesos. Resultado: las
definiciones de agente **existen** en OASIS; **la cadena B→C→P no es proceso
autónomo invocable fuera de IDE, hoy** (sin CLI en PATH; `.agent.md` no es
entrypoint; DocumentMachine sin `package.json`); e-sdk no materializa
DocumentMachine. **Recorte ZV:** decir «no hay proceso invocable» a secas es
más ancho que la medida — en el mismo árbol vive
`workers/escribiente-whisper/worker.py`, un entrypoint Python real (`argparse`
+ `def main()`), fuera de la cadena B→C→P. Perímetro ampliado: ver addenda de
contrarrevisión y **Addenda ZV** al pie. Escritura solo bajo `playground/`
(este spike); OASIS / a-sdk / e-sdk RO.

## Pregunta del PO

> ¿Pueden H y M operar procesos reales con material de Onfalo en la Future
> Machine, **hoy**?

### Veredicto global (titular corregido por ZV 2026-08-02)

> **La cadena B→C→P no es proceso autónomo invocable fuera de IDE, hoy.**

El titular anterior era «la Future Machine **NO CORRE**», y era **más ancho que
la evidencia**: la propia contrarrevisión de este spike prohíbe esa lectura
(`CONTRARREVISION-WP-HUB-112.md:68-71`) y encontró en el mismo árbol un proceso
Python que sí tiene forma de proceso. El titular acotado dice lo mismo que la
evidencia sostiene, ni una palabra más. Árbol y commit exactos en **Addenda ZV
· ②**.

Material Onfalo: **existe**. Agentes barrio 20: **existen como `.agent.md`
(Copilot/VS Code)**. Cadena como proceso autónomo fuera de IDE hoy: **no
corre**. Runtime en e-sdk: **no existe** (submódulo sin inicializar / árbol
vacío).

---

## Tabla A · **MEDIDO** — corre / no corre / no existe

> Reforma ZV: la columna `veredicto` era texto libre con **9 valores distintos**
> en 13 filas, y el dominante era `existe` (8 filas), que **no pertenece** a la
> tríada que pedía la CA. Ahora `veredicto` sólo admite `corre` / `no corre` /
> `no existe`, y lo que antes se colaba ahí («existe») vive en su columna
> `qué hay`. Toda fila de esta tabla tiene **orden exacta y salida literal**.

| pieza | veredicto (tríada) | qué hay | evidencia (orden → salida) |
| ----- | ------------------ | ------- | -------------------------- |
| Editorial Onfalo `2024-05-01_primero-de-mayo.md` | **no corre** (es dato, no proceso) | fichero legible RO | `test -f …` → `exit=0 bytes=26228` · sha256 `a186993d…c9796a` |
| Editorial Onfalo `2026-05-01_auge-de-la-educacion-emocional.md` | **no corre** (es dato, no proceso) | fichero legible RO | `test -f …` → `exit=0 bytes=12388` · sha256 `86f3cb6d…2186f0` |
| Análisis históricos `.analisis.md` | **no corre** | artefacto de sesión pasada | ambos `exit=0` (11025 / 13293 bytes) — huella, no runtime |
| `e-sdk/DocumentMachineSDK` (checkout) | **no existe** | dir vacío | `git submodule status` prefijo `-` · `find … -mindepth 1 \| wc -l` → `count=0` · `test -f …/bartleby.agent.md` → `exit=1` |
| `e-sdk/AgentLoreSDK` · `VectorMachineSDK` · `VectorMachineUI` | **no existe** | dirs vacíos | mismos prefijos `-` · `count=0` cada uno |
| Definición `@Bartleby` (OASIS) | **no corre** | `.agent.md` Copilot, 6652 B | `which bartleby` → exit 1 · `node …bartleby.agent.md` → `SyntaxError` **exit=1** · `npm --prefix DocumentMachineSDK run` → ENOENT **exit=127** |
| Definición `@Cristalizador` (OASIS) | **no corre** | `.agent.md` Copilot, 8586 B | `which cristalizador` → exit 1 · frontmatter `tools: [vscode,…]`, no CLI |
| Definición `@Pipeline` (OASIS) | **no corre** | `.agent.md` Copilot, 3612 B | `which pipeline` → exit 1 · orquesta handoffs a otros `.agent.md` |
| `DocumentMachineSDK/package.json` (OASIS) | **no existe** | — | `test -f …/package.json` → `exit=1` · `find … -name package.json` → vacío · **ZV:** `git ls-tree HEAD -- package.json` → vacío (ausente **en el commit**, no sólo en disco) |
| `workers/escribiente-whisper/worker.py` (OASIS) — *añadido por ZV* | **no corre** (hoy) | entrypoint Python real: `argparse`, `def main()` | `ast.parse` → `parse_ok` · `command -v python` → `exit=0` · `python -B -c "import faster_whisper"` → `ModuleNotFoundError` **exit=1** (deps declaradas sin instalar) |
| Skills FM (`engine-plan`, `futures-engine`, `documental-analysis`) | presencia **medida**; el `no corre` es **inferido** (ver Tabla B) | ficheros md | `test -f` → `exit=0` · **sin orden que mida «no corre»**: no se buscó runner |
| AgentLoreSDK npm scripts (OASIS) | **corre** (y **no** es la cadena) | `docs:web`, `audit:anchors`, `ynsy-engine:*` | `npm run` los lista — cero `bartleby`/`cristalizador`/`pipeline` |
| Ficha barrio 20 cantera S | **no corre** (es documento) | `20-DocumentMachineSDK.md`; Runtime declarado «Markdown + Jekyll / SDK editorial»; puertos: ninguno | `test -f … && head -n 25` → `exit=0` (medida del autor; **ZV no la re-midió**: `C:/S_LAB/s-sdk` fuera de su permiso) |
| CI hub / s-sdk (contexto) | **no corre** como gate de pruebas | solo `docs.yml` | `ls .github/workflows` → `docs.yml` en ambos (medida del autor; ZV no re-midió s-sdk) |

### Cadena mínima Bartleby → Cristalizador → Pipeline (medido)

| eslabón | como definición | como proceso hoy | con Onfalo hoy |
| ------- | --------------- | ---------------- | -------------- |
| Bartleby | existe (OASIS) | **no corre** | no ingestable por proceso (solo lectura humana/IDE) |
| Cristalizador | existe (OASIS) | **no corre** | n/a (upstream proceso ausente) |
| Pipeline | existe (OASIS) | **no corre** | n/a |

Medida ZV que cierra la tabla de la cadena: en el commit anclado, buscar
cualquier entrypoint ejecutable de los tres eslabones da **cero**:

```
git -C DocumentMachineSDK ls-tree -r --name-only HEAD
  | grep -icE "(bartleby|cristalizador|pipeline).*\.(py|js|mjs|cjs|ts|exe|sh)$"
→ 0
```

## Tabla B · **RAZONADO** — juicio de diseño, sin orden que lo mida

> Reforma ZV: las ocho filas de «qué de la ceremonia no se puede demostrar» y
> las ocho de reorden de lane **no tienen ninguna orden detrás**: son
> inferencia a partir de la Tabla A. Estaban mezcladas con lo medido. Aquí
> quedan separadas, y así deben leerse.

No se puede recorrer la cadena con agentes reales como procesos: no hay
entrypoint, no hay `package.json` en DocumentMachine, e-sdk no aporta árbol, y
OASIS es RO (prohibido materializar corrida escribiendo allí).

---

## Qué de la ceremonia `100`–`107` no se puede demostrar hoy

*(Tabla B · **razonado**: ninguna de estas ocho filas tiene orden detrás; son
juicio de diseño derivado de la Tabla A. Etiqueta puesta por ZV.)*

| tramo | ¿demostrable hoy? | qué haría falta |
| ----- | ----------------- | --------------- |
| `100` escenario/schemas (kit playground) | **sí como artefacto** (no depende de FM viva) | nada bloqueante del spike; schemas/mocks |
| `101` ontología/verbos | **sí como artefacto** | registro L04 cuando exista; mientras, acuñaciones con razón |
| `102` generador de corridas | **sí como simulacro** | handlers locales; no FM OASIS |
| `103` pods/leases | **sí como files-first local** | ya previsto LocalPodProvider |
| `104` import-once Onfalo | **sí (piezas existen)** | script build-time + manifiesto; **sin** montar OASIS en runtime |
| `105` cadena lore «determinista» | **solo mock** — **no** agentes OASIS reales | handlers playground con `mock=true`; **no** invocar `.agent.md` |
| `106` ceremonia bilateral 11 pasos | **solo simulacro H/M** | evidencia de cadena causal en handoffs locales; **no** «procesos reales FM» |
| `107` verificador externo | **sí sobre evidencia del simulacro** | raíz de evidencia del playground |

**No demostrable hoy (bloque PO):** «H y M operan procesos reales de la Future
Machine con Onfalo». Eso exige superficie de proceso en el holón E (submódulos
inicializados **o** puerto/CLI publicado) y un modo de ejecución fuera de
sesión IDE Copilot, sin escritura a OASIS.

---

## Reorden de lane (respuesta «no corre»)

*(Tabla B · **razonado**: las ocho filas siguientes son decisión de lane, no
medida. Etiqueta puesta por ZV.)*

Las once fichas de obra `100`–`111` **no caen enteras**. Cambia la **forma**
de las que implicaban FM viva:

| ficha | decisión |
| ----- | -------- |
| **105** | **Cambia de forma (obligatorio).** Cadena = handlers deterministas del playground; prohibido presentar `.agent.md` OASIS como runtime. CA ya dice mock; el spike lo eleva a supuesto de diseño, no a contingencia. |
| **106** | **Cambia de forma.** Ceremonia demuestra observación bilateral H/M sobre **simulacro**, no arranque de procesos FM reales. El BRIEF/CA deben decirlo en aceptación. |
| **100** | **Cambia matiz.** Catálogo de unidades: condición `bootstrap` = mock playground; no «deployed» contra e-sdk vacío. |
| **104** | **Se mantiene / se adelanta en valor.** Piezas Onfalo existen; import-once es el único eslabón de material real medido hoy. |
| **101–103, 107** | Se mantienen con dependencia del simulacro, no de FM viva. |
| **108–111** | Se mantienen tras `GHM`, pero **109** hereda el matiz: «despierta» = evidencia de corrida simulada, no runtime DocumentMachine. |
| **Ninguna cae** | No se tumba ID. Lo que cae es la **hipótesis PO de procesos reales hoy**; se aplaza a dependencia explícita de obra E (fuera de esta lane) o a un WP futuro de «modo vivo» cuando exista proceso. |
| **113** | **Sigue P0 ola 0.** Sin CI que verifique, el veredicto de este spike no es comprobable por tercero. |

### Ola propuesta post-112

| orden | ficha | nota |
| ----- | ----- | ---- |
| hecho | `112` | este reporte · verde local |
| siguiente | `113` | CI que bloquee · **pedir GO** |
| luego | `100` · `101` · `L01` | con supuesto «simulacro playground» escrito en CA/BRIEF al aceptar |
| paralelo útil | preparar `104` tras `100` | material Onfalo ya medido |

**¿GO 113?** Recomendado **sí**, tras aceptación de este spike. No despachar
`100`/`113` sin GO del custodio (este encargo solo autorizó `112`).

---

## Evidencia (ancla)

Log completo: `medidas-literales-2026-08-02.txt` (mismo directorio).

Salidas clave re-medidas sin pipe:

```
node …/bartleby.agent.md  →  exit=1  SyntaxError: Invalid left-hand side…
npm --prefix DocumentMachineSDK run  →  exit=127  ENOENT package.json
which bartleby  →  exit=1
test -f e-sdk/…/bartleby.agent.md  →  exit=1
git -C e-sdk submodule status  →  cuatro líneas con prefijo -
```

Calibración worktree (PASS):

```
WORLD_ROOT=C:/S_LAB/wt/scriptorium-wp-hub-112
CANONICAL_WORLD_ROOT=C:/S_LAB/wt/scriptorium-wp-hub-112
READ_ONLY_ROOTS=["C:/S_LAB/z-sdk","C:/S_LAB/v-sdk","C:/S_LAB/g-sdk","C:/S_LAB/o-sdk","C:/S_LAB/skills-library","C:/S_LAB/a-sdk","C:/S_LAB/e-sdk","C:/S/scriptorium"]
DOWNSTREAM_PATTERNS=[]
→ identidad-raiz: PASS
```

## Evidencia de riesgo y contrarrevisión

- `CASOS_ADVERSARIALES`:
  - `[manual]` ¿Existe CLI oculto? `which` bartleby/cristalizador/pipeline → no.
  - `[manual]` ¿npm en DocumentMachine? ENOENT package.json.
  - `[manual]` ¿e-sdk trae agentes? dirs count=0; test -f bartleby → exit 1.
  - `[manual]` ¿AgentLore sustituye la cadena? scripts solo docs/audit — no.
  - `[manual]` ¿Los `.analisis.md` demuestran proceso hoy? No: son artefactos
    estáticos; no hay comando que los regenere sin IDE + escritura.
- `DEPENDENCIAS_DIRECTAS_VERIFICADAS`: ninguna runtime del spike; solo lectura
  de rutas OASIS/e-sdk/S.
- `INSTALACION_LIMPIA`: no aplica (spike de medida RO).
- `TEST_AUTOMATIZADO_VS_EVIDENCIA_MANUAL`:
  - Automatizado: no hay suite del spike (hub sin CI de pruebas).
  - Manual: log de medidas + re-check exit codes.
- `VEREDICTO_REVISOR`: **PASS_CON_ADDENDA** (revisor distinto; ver
  `CONTRARREVISION-WP-HUB-112.md`).

## Auto-revisión

- [x] Diff solo dentro de `playground/` (+ BACKLOG orquestador aparte)
- [x] Cero copia de árboles ajenos
- [x] Rutas citadas existentes y medidas
- [x] Sin promesa de FM viva; `<pendiente>` = proceso E / modo vivo
- [x] Verde declarado **local**
- [ ] Commits convencionales: pendiente (orquestador al cerrar)
- [x] Contrarrevisión adversarial por agente distinto: PASS_CON_ADDENDA

## Hallazgos fuera de alcance

- Inicializar submódulos e-sdk = obra E / decisión de custodio (RO duro aquí).
- Invocar agentes vía sesión Copilot/IDE ≠ «proceso real» para este CA.
- `prueba-de-dos` no tocada.

## Dudas / bloqueos

- Bloqueo de lane para supuestos de FM viva: **resuelto por este veredicto**
  (reordenar a simulacro).
- Bloqueo operativo: **GO 113** y contrarrevisión adversarial de este reporte
  antes de merge a main.
- No se despachan `113`, `100` ni LENGUA sin GO.

---

## Revisión del orquestador

**Aceptado** con addenda (abajo): veredicto de cadena **NO CORRE** intacto;
frase de alcance recortada; perímetro negativo declarado por
contrarrevisión. Verde: **solo local**. Merge a main: **no** sin gate/CI
(`WP-HUB-113`).

---

## Addenda contrarrevisión 2026-08-02

El veredicto global **NO CORRE** queda acotado así: la cadena mínima
**Bartleby → Cristalizador → Pipeline** no es proceso autónomo invocable hoy
(sin CLI en PATH/npm global; sin `package.json` en DocumentMachine OASIS;
`.agent.md` no ejecuta bajo Node; e-sdk y a-sdk con submódulos `-` y dirs
vacíos; hub `codebase/**/DocumentMachineSDK` vacío). Material Onfalo de las
dos editoriales: **existe** (sha256 re-medidos idénticos al log). Colateral
fuera de cadena: existe `DocumentMachineSDK/workers/escribiente-whisper/`
(Python); **no** cuenta como eslabón B→C→P ni como operación H/M+Onfalo.
Init de submódulos e-sdk/a-sdk exige red + GO (objetos ausentes en el padre).
Reorden 105/106/100 como **cambio de forma a simulacro** queda justificado
por esta medida. Verde: **solo local** (sin CI de pruebas; `WP-HUB-113`
sigue P0).

**Perímetro negativo ampliado** (cerrado por contrarrevisión, no solo por el
worker): PATH/`command -v`/`where` · `npm list -g` · bins npm/choco/bun ·
`C:/S_LAB/a-sdk` · hub `codebase/{a,e}-sdk/DocumentMachineSDK` · OASIS
DocumentMachine (sin CLI de cadena). Informe:
`playground/prueba-de-H-M/spike/CONTRARREVISION-WP-HUB-112.md` · veredicto
**PASS_CON_ADDENDA**.

---

## Addenda ZV 2026-08-02 · tres condiciones de la auditoría adversarial

Cierre por el swarm Z·V. **El veredicto de este spike sigue en pie, re-medido
hoy**: la cadena no tiene entrypoint y sus componentes no están en el PATH. Lo
que se corrige es cómo lo dice, y una cicatriz de log que lo contradecía.

### ① La cicatriz de log que nunca se corrigió — línea 148

`medidas-literales-2026-08-02.txt` registra `exit=0` en `:103`, `:113` y `:148`
para tres órdenes que **fallaron**. La addenda manuscrita del log (`:253-256`)
corrigió dos —`node_bartleby_exit=1`, `npm_dm_exit=127`— y **dejó `:148` sin
corregir**: ese `exit=0` corresponde a
`node C:/S_LAB/e-sdk/DocumentMachineSDK/package.json`, cuya salida literal en la
línea de arriba es `Error: Cannot find module`. Es decir: **la evidencia
literal contradecía al informe** en uno de los dos fallos que lo sostienen, y
así se quedó.

Causa, no excusa: las órdenes se capturaron con tubería (`… 2>&1 | head`,
`| tee`), y `$?` devuelve el estado del **último eslabón de la tubería**, no el
del comando medido. Un log que mide exit codes a través de un pipe no mide
exit codes.

Re-medida hoy, **sin tubería, un comando por línea**:

```
node "C:/S_LAB/e-sdk/DocumentMachineSDK/package.json"                    → exit=1
node ".../DocumentMachineSDK/.github/agents/bartleby.agent.md"           → exit=1
npm --prefix ".../DocumentMachineSDK" run                                → exit=127
test -f ".../DocumentMachineSDK/package.json"                            → exit=1
command -v bartleby / cristalizador / pipeline                           → exit=1 ×3
```

Los tres `exit=0` del cuerpo del log **no se borran**: quedan donde están, con
la addenda `######## ADDENDA ZV` al pie del propio log explicando qué son.
Borrarlos sería reescribir la medida; dejarlos sin nota sería mantener la
contradicción.

### ② El árbol auditado no estaba anclado a ningún commit — ahora sí

El log original identifica lo auditado con **rutas y conteos de bytes** (10
líneas `bytes=`), sin un solo `rev-parse`, rama o tag. Un veredicto sobre un
árbol sin anclar es **infalsificable por nombre**: dentro de un mes nadie puede
decir si el árbol que se midió es el que tiene delante.

Anclado hoy:

| árbol | commit | rama | limpio |
| ----- | ------ | ---- | ------ |
| OASIS `DocumentMachineSDK` (**el árbol del veredicto**) | `0d65d068c8a0f2c7ab36e5ca4130658f4ddc4880` | `integration/beta/scriptorium` | sí (0 ficheros sucios) |
| OASIS `onfalo-asesor-sdk` (corpus editorial) | `d049e01ce4a33bc53fa0d34518ee7f15bc38da93` | `integration/beta/scriptorium` | sí |
| `C:/S_LAB/e-sdk` | `e4b34a870df266c181846110a63438f103e26b80` | `main` | — |
| `C:/S_LAB/a-sdk` | `936196f3682edec1934c9b5a09297ac65fdd107f` | `integration/beta/scriptorium` | — |

Blobs exactos de lo auditado, en ese commit:

```
HEAD:.github/agents/bartleby.agent.md      → 46656140851ee52cdb25a20140aa4f65792a3d76
HEAD:.github/agents/cristalizador.agent.md → 7c35c1c803c753282376a8d43cd22cb212968012
HEAD:mod/agents/pipeline.agent.md          → f6629b203db8dcc367cfb9a3afa89d03dd79e48c
HEAD -- package.json                       → (vacío: ausente en el commit)
```

Ese último es un **refuerzo** del veredicto: `package.json` no falta sólo en el
disco (`test -f` → 1), falta **en el árbol versionado**.

**Lo que hoy NO se puede anclar, dicho con esas palabras:** el superproyecto
OASIS `aleph-scriptorium` **no se puede anclar hoy** — `git` rechaza su
configuración:

```
git -C "C:/Users/aleph/OASIS/aleph-scriptorium" rev-parse HEAD
fatal: bad config line 1 in file .git/config
```

Los submódulos sí responden (son los de la tabla), así que el anclaje del árbol
del veredicto está completo; lo que queda sin anclar es el **contenedor**. El
almacén de objetos además emite `error: wrong index v1 file size in
.git/modules/DocumentMachineSDK/objects/pack/pack-56b2eb90….idx` en cada
consulta: resuelve, pero está degradado. Ambas cosas son del entorno del
custodio; ZV no las toca (OASIS es RO).

### ③ El titular era más ancho que la propia contrarrevisión

`CONTRARREVISION-WP-HUB-112.md:68-71` **prohíbe explícitamente** la lectura
ancha, y encontró en el mismo árbol un proceso Python (`escribiente-whisper`).
El titular «la Future Machine **NO CORRE**» afirmaba más de lo medido.

Titular corregido, arriba y aquí:

> **La cadena B→C→P no es proceso autónomo invocable fuera de IDE, hoy.**

Medidas que lo sostienen y lo acotan:

```
ls-tree HEAD | grep -icE "(bartleby|cristalizador|pipeline)\.(py|js|mjs|cjs|ts|exe|sh)$"  → 0
command -v bartleby|cristalizador|pipeline                                                → exit=1 ×3
test -f DocumentMachineSDK/package.json                                                   → exit=1
ast.parse(workers/escribiente-whisper/worker.py)                                          → parse_ok
command -v python                                                                          → exit=0
python -B -c "import faster_whisper"                                    → ModuleNotFoundError exit=1
```

Lectura honesta de las dos últimas: whisper **tiene forma de proceso**
(`argparse` + `def main()`, Python en PATH) — por eso «no hay proceso
invocable» era falso— pero **hoy tampoco corre**, porque sus dependencias
declaradas (`faster-whisper>=1.2.1`, `av>=11`) no están instaladas. Y de todos
modos **no es la cadena B→C→P** ni ingesta editorial Onfalo. El titular acotado
cubre exactamente eso.

### ④ Medida de forma: veredictos y separación medido/razonado

Recuento propio sobre el reporte antes de esta addenda:

| medida | valor |
| ------ | ----- |
| filas de evidencia (resumen 13 + cadena 3 + ceremonia 8) | **24** |
| filas que citan una orden | **10** (de ellas **9** con salida o exit literal; la fila «Skills FM» cita `test -f` pero no mide su propio «no corre») |
| filas **sin ninguna orden** | **14**, de las cuales las **8** de la tabla de ceremonia son juicio de diseño puro |
| valores distintos en la columna `veredicto` | **9** en 13 filas |
| filas cuyo veredicto empieza por `existe` | **8** — valor que **no pertenece** a la tríada `corre / no corre / no existe` de la CA |
| filas clasificadas `corre` | **1** |

Reforma aplicada: la columna `veredicto` de la Tabla A sólo admite la tríada, y
lo que se colaba como «existe» pasó a la columna `qué hay`. Lo medido queda en
**Tabla A**, lo inferido en **Tabla B**, con etiqueta en las dos tablas de ocho
filas. La fila «Skills FM» se queda en A con su asimetría escrita: presencia
medida, «no corre» inferido.

### ⑤ Confesión de método

Al comprobar si el worker Python parsea usé `python -m py_compile`, que
**escribió** `workers/escribiente-whisper/__pycache__/worker.cpython-314.pyc`
dentro de OASIS — es decir, **fuera de mi worktree**, contra mi propia
prohibición. Lo detecté 11 s después, borré el `.pyc` y el `__pycache__` que
había creado, y repetí la medida con `ast.parse` en memoria (`parse_ok`), que
no escribe. Queda: el directorio padre cambió de mtime; ni un byte de contenido
añadido ni quitado; `git status` de ese árbol sigue en 0 ficheros sucios. Se
anota porque un informe que exige evidencia literal no puede ocultar su propio
desliz.
