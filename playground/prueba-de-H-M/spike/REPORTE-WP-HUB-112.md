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
definiciones de agente **existen** en OASIS; **la cadena B→C→P no tiene
proceso autónomo invocable hoy** (sin CLI en PATH; `.agent.md` no es
entrypoint; DocumentMachine sin `package.json`); e-sdk no materializa
DocumentMachine. Colateral fuera de cadena (whisper) y perímetro ampliado:
ver addenda de contrarrevisión al pie. Escritura solo bajo `playground/`
(este spike); OASIS / a-sdk / e-sdk RO.

## Pregunta del PO

> ¿Pueden H y M operar procesos reales con material de Onfalo en la Future
> Machine, **hoy**?

### Veredicto global: **NO CORRE**

Material Onfalo: **existe**. Agentes barrio 20: **existen como `.agent.md`
(Copilot/VS Code)**. Cadena como proceso autónomo hoy: **no corre**. Runtime
en e-sdk: **no existe** (submódulo sin inicializar / árbol vacío).

---

## Tabla resumen · corre / no corre / no existe

| pieza | veredicto | evidencia (orden → salida) |
| ----- | --------- | -------------------------- |
| Editorial Onfalo `2024-05-01_primero-de-mayo.md` | **existe** (legible RO) | `test -f …` → `exit=0 bytes=26228` · sha256 `a186993d…c9796a` |
| Editorial Onfalo `2026-05-01_auge-de-la-educacion-emocional.md` | **existe** (legible RO) | `test -f …` → `exit=0 bytes=12388` · sha256 `86f3cb6d…2186f0` |
| Análisis históricos `.analisis.md` (artefacto previo) | **existe** (no es proceso) | ambos `exit=0` (11025 / 13293 bytes) — huella de sesión pasada, no runtime |
| `e-sdk/DocumentMachineSDK` (checkout) | **no existe** (vacío) | `git submodule status` prefijo `-` · `find … -mindepth 1 \| wc -l` → `count=0` · `test -f …/bartleby.agent.md` → `exit=1` |
| `e-sdk/AgentLoreSDK` · `VectorMachineSDK` · `VectorMachineUI` | **no existe** (vacío) | mismos prefijos `-` · `count=0` cada uno |
| Definición `@Bartleby` (OASIS) | **existe** / proceso **no corre** | fichero `…/.github/agents/bartleby.agent.md` `bytes=6652` · `which bartleby` → exit 1 · `node …bartleby.agent.md` → `SyntaxError` exit 1 · `npm --prefix DocumentMachineSDK run` → ENOENT `package.json` exit 127 |
| Definición `@Cristalizador` (OASIS) | **existe** / proceso **no corre** | `…/cristalizador.agent.md` `bytes=8586` · `which cristalizador` → exit 1 · frontmatter: agente Copilot (`tools: [vscode,…]`), no CLI |
| Definición `@Pipeline` (OASIS) | **existe** / proceso **no corre** | `…/mod/agents/pipeline.agent.md` `bytes=3612` · `which pipeline` → exit 1 · orquesta handoffs a otros agentes md |
| `DocumentMachineSDK/package.json` (OASIS) | **no existe** | `test -f …/package.json` → `exit=1` · `find … -name package.json` → vacío |
| Skills FM (`engine-plan`, `futures-engine`, `documental-analysis`) | **existen** (md) / **no corren** como proceso | `test -f` exit 0; sin runner asociado medido |
| AgentLoreSDK npm scripts (OASIS) | **corre** solo docs/audit · **no** es la cadena | `npm run` lista `docs:web`, `audit:anchors`, `ynsy-engine:*` — cero bartleby/cristalizador/pipeline |
| Ficha barrio 20 cantera S | **existe** | `20-DocumentMachineSDK.md` exit 0; Runtime declarado: «Markdown + Jekyll / SDK editorial»; puertos: ninguno |
| CI hub / s-sdk (contexto) | **no corre** como gate de pruebas | solo `docs.yml` en ambos |

### Cadena mínima Bartleby → Cristalizador → Pipeline

| eslabón | como definición | como proceso hoy | con Onfalo hoy |
| ------- | --------------- | ---------------- | -------------- |
| Bartleby | existe (OASIS) | **no corre** | no ingestable por proceso (solo lectura humana/IDE) |
| Cristalizador | existe (OASIS) | **no corre** | n/a (upstream proceso ausente) |
| Pipeline | existe (OASIS) | **no corre** | n/a |

No se puede recorrer la cadena con agentes reales como procesos: no hay
entrypoint, no hay `package.json` en DocumentMachine, e-sdk no aporta árbol, y
OASIS es RO (prohibido materializar corrida escribiendo allí).

---

## Qué de la ceremonia `100`–`107` no se puede demostrar hoy

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
