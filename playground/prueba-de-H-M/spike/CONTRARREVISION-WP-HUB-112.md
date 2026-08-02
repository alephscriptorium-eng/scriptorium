# Contrarrevisión adversarial · WP-HUB-112

| dato | valor |
| ---- | ----- |
| rol | revisor adversarial (distinto del worker) |
| fecha | 2026-08-02 |
| fuente | `REPORTE-WP-HUB-112.md` + `medidas-literales-2026-08-02.txt` |
| ficha CA | `WP-HUB-112` en `plan/BACKLOG-F2.md` |
| gobierno | `GOBIERNO-LORE-HM.md` §4 |
| modo | read-only sobre cantera; escritura **solo** este informe |

## VEREDICTO: PASS_CON_ADDENDA

El veredicto de fondo —**cadena mínima Bartleby → Cristalizador → Pipeline no corre hoy como proceso autónomo con Onfalo**— resiste el reintento adversarial. No se tumba el **NO CORRE** de la pregunta del PO.

Hay **defectos de frase/alcance** (cicatriz §4.2): el reporte afirma en un par de sitios más de lo que las órdenes demuestran. Se acepta en verde **local** si el orquestador incorpora la addenda de abajo (sin reabrir medida de cadena si no quiere; la contrarrevisión ya cerró el perímetro ampliado).

---

## Vectores intentados

### V1 · Falsos «no existe» (CLI / package / checkout fuera del perímetro del worker)

| # | orden / acción | salida literal / resultado |
| - | -------------- | -------------------------- |
| 1.1 | `which` / `command -v` / `where.exe` para `bartleby`, `cristalizador`, `pipeline`, `documentmachine`, `DocumentMachine`, `document-machine`, `bartleby.cli` | ninguno en PATH; `command -v` exit 1; `where` «no se pudo encontrar» |
| 1.2 | `npm list -g --depth=0` filtrado bartleby/cristaliz/pipeline/document-machine/onfalo/agent-lore | `(no npm global matches)` |
| 1.3 | bins en `AppData/Roaming/npm`, chocolatey, `~/.bun/bin` | sin matches |
| 1.4 | `find C:/S` y `C:/S_LAB` maxdepth 4 `*DocumentMachine*` / `*Bartleby*` / `*Cristaliz*` | hits: `codebase/{a,e}-sdk/DocumentMachineSDK` (vacíos), `C:/S_LAB/{a,e}-sdk/DocumentMachineSDK` (vacíos), nota en `s-sdk/WPS_QUEUE/…` |
| 1.5 | `C:/S_LAB/a-sdk/DocumentMachineSDK` · `file_count` · `package.json` · agentes | `file_count=0` · `NO_PKG` · bartleby **MISS** · submodule status prefijo `-` (igual que e-sdk) |
| 1.6 | hub `codebase/e-sdk/DocumentMachineSDK` y `codebase/a-sdk/…` | dirs vacíos `file_count=0` |
| 1.7 | OASIS `DocumentMachineSDK`: `package.json`, `*.exe`/`cli`, entrypoints `*bartleby*/*pipeline*/*cristal*.{py,js,mjs}` | sin `package.json`; sin CLI de cadena; solo `docs/_config.yml` (Jekyll docs) y `workers/escribiente-whisper/*.py` (**fuera de cadena**) |
| 1.8 | `npm --prefix C:/S_LAB/a-sdk run` | scripts de meta-repo (lint/status/submodules); **cero** bartleby/cristalizador/pipeline |

**Resultado V1:** no se encontró proceso invocable de la cadena fuera de lo mirado por el worker. Los checkouts alternativos son cascarones vacíos. **No tumba** el «no corre / no existe» de runtime.

**Hallazgo colateral (frase):** sí existe un proceso Python en OASIS (`workers/escribiente-whisper/worker.py`, parse_ok; deps `faster-whisper`) — **no** es B→C→P ni ingesta Onfalo editorial. La frase del reporte «**no hay proceso invocable**» es demasiado ancha.

---

### V2 · Falsos «existe» Onfalo (hashes / paths)

| pieza | test -f | bytes | sha256 |
| ----- | ------- | ----- | ------ |
| `…/editoriales/2024-05-01_primero-de-mayo.md` | OPEN_OK | 26228 | `a186993d4420792d94a261ed68a801793af033a5fe32f0b00be224c780c9796a` |
| `…/editoriales/2026-05-01_auge-de-la-educacion-emocional.md` | OPEN_OK | 12388 | `86f3cb6deb8d01cef4546a81fc650fff0913291aeb7ad3dfa504d9a7c02186f0` |

Coincide byte-a-byte con la addenda del log del worker. Rutas abren.  
`C:/S_LAB/a-sdk/onfalo-asesor-sdk/…/editoriales/…` → **MISS** (submódulo `-`, dir vacío): el «existe» del reporte ancla bien en OASIS, no en a-sdk.

**Resultado V2:** no hay falso positivo. Paths y hashes OK.

---

### V3 · Alcance > evidencia («NO CORRE» global)

Re-medida sin pipe:

```
node …/bartleby.agent.md  →  node_exit=1  (SyntaxError en frontmatter)
npm --prefix …/DocumentMachineSDK run  →  npm_dm_exit=127  (ENOENT package.json)
```

Coincide con la addenda del worker (el cuerpo del log tenía `node_exit=0` / `npm_exit=0` por captura con pipe — **cicatriz de log**, corregida en addenda; el reporte resume bien exit 1 / 127).

**Qué sí demuestran las órdenes:** no hay CLI; `.agent.md` no es entrypoint Node; DocumentMachine sin `package.json`; e-sdk/a-sdk sin árbol; definiciones Copilot existen con `tools: [vscode,…]` / `user-invocable: true`.

**Qué el global «NO CORRE» no debe afirmar sin recorte:**

1. Que DocumentMachine **no tiene ningún** proceso invocable en disco → **falso** (whisper worker).
2. Que H/M no puedan operar **en sesión IDE Copilot** → el spike lo excluye bien en hallazgos; el titular global debe seguir anclado a «proceso autónomo / fuera de IDE», no a «nada en FM».

La pregunta del PO («procesos reales … hoy») queda respondida con **NO CORRE** **si** el alcance es la cadena B→C→P como runtime no-IDE. Eso está en el cuerpo del reporte; falta higiene en la frase corta de «Qué se hizo».

**Resultado V3:** no tumba el veredicto de lane; exige addenda de frase.

---

### V4 · Impacto lane (reorden 100 / 105 / 106)

| ficha | ¿medida directa? | ¿justificado? |
| ----- | ---------------- | ------------- |
| **105** cambia forma → mock playground | sí: ausencia medida de proceso de cadena | **sí** — CA exige reorden si «no corre»; no es inventar caída de ID |
| **106** ceremonia = simulacro | consecuencia de 105 + misma ausencia | **sí** como matiz de aceptación, no como medida nueva de «11 pasos» |
| **100** matiz bootstrap=mock | inferencia de diseño desde e-sdk vacío | **aceptable**; no afirma que 100 «no se pueda» como artefacto |
| **Ninguna cae** | coherente con evidencia | **sí** |
| **113** sigue P0 | alineado a gobierno §4.4 / handoff | **sí** |

**Resultado V4:** el reorden es **consecuencia de CA + medida**, no sobre-inferencia salvaje. No FAIL.

---

### V5 · e-sdk submodules (y a-sdk paralelo)

```
$ git -C C:/S_LAB/e-sdk submodule status
-1498d67e631cbe395bb4577e2c8d57e0451d551a AgentLoreSDK
-073be841da91422d9bac696f96cfc5a12c002b35 DocumentMachineSDK
-820e63d1c5592d7c9930630be1b30e1cf6efa90f VectorMachineSDK
-b31e4088c12c82634a2bb71a945a585d501a8c43 VectorMachineUI
```

Dirs: `count=0` los cuatro.  
`git cat-file -t 073be841…` → `fatal: could not get object info` / `Needed a single revision`.  
`.gitmodules` apunta a `https://github.com/escrivivir-co/…` (red).

**Init offline sin escribir:** no aplicable de forma segura — el objeto del gitlink **no está** en el objeto store del padre; materializar exigiría `submodule update --init` (red + escritura en e-sdk). **Requiere GO / obra E**; no se ejecutó.

a-sdk: mismos prefijos `-` en DocumentMachineSDK / AgentLoreSDK / onfalo-asesor-sdk; dirs vacíos.

**Resultado V5:** confirma al worker. Init ≠ RO local.

---

## Defectos de frase / alcance (gobierno §4.2)

1. **«no hay proceso invocable»** (párrafo «Qué se hizo») — demasiado absoluto. Recortar a la **cadena B→C→P** (y skills FM como proceso). Mencionar o excluir explícitamente `workers/escribiente-whisper`.
2. **Perímetro negativo incompleto en el reporte** — no citó npm global, a-sdk, hub `codebase/`. La contrarrevisión lo cerró (todo vacío / sin bin); la addenda debe **declarar** ese perímetro o citar este informe.
3. **Log cuerpo vs addenda** — exits de `node`/`npm` con pipe mal capturados en el cuerpo; addenda del worker ya corrige. Dejar constancia: la evidencia canónica es la addenda + re-medida adversarial.
4. **`npm --prefix AgentLoreSDK run`** — path relativo; reproducible solo con cwd `C:/Users/aleph/OASIS/aleph-scriptorium`. Anclar ruta absoluta en addenda.
5. Menor: cabecera «agente = Orquestador» — cosmética; no bloquea.

Ninguno de estos cambia el veredicto de fondo si se recorta la frase.

---

## Addenda lista para aceptación (orquestador)

Texto para anexar al reporte / acta de aceptación **verde local**:

> **Addenda contrarrevisión 2026-08-02.** El veredicto global **NO CORRE** queda acotado así: la cadena mínima **Bartleby → Cristalizador → Pipeline** no es proceso autónomo invocable hoy (sin CLI en PATH/npm global; sin `package.json` en DocumentMachine OASIS; `.agent.md` no ejecuta bajo Node; e-sdk y a-sdk con submódulos `-` y dirs vacíos; hub `codebase/**/DocumentMachineSDK` vacío). Material Onfalo de las dos editoriales: **existe** (sha256 re-medidos idénticos al log). Colateral fuera de cadena: existe `DocumentMachineSDK/workers/escribiente-whisper/` (Python); **no** cuenta como eslabón B→C→P ni como operación H/M+Onfalo. Init de submódulos e-sdk/a-sdk exige red + GO (objetos ausentes en el padre). Reorden 105/106/100 como **cambio de forma a simulacro** queda justificado por esta medida. Verde: **solo local** (sin CI de pruebas; `WP-HUB-113` sigue P0).

---

## Si fuera FAIL — devoluciones (no aplican salvo rechazo de addenda)

1. Reescribir frases absolutas «no hay proceso invocable» con alcance cadena.
2. Añadir tabla de perímetro negativo: PATH, npm -g, `C:/S_LAB/a-sdk`, `C:/S/scriptorium/codebase`, bun/choco.
3. Anclar `npm --prefix` de AgentLore a ruta absoluta OASIS.
4. Una línea sobre `escribiente-whisper` como fuera de alcance del CA.

---

## Para el orquestador

| ítem | valor |
| ---- | ----- |
| Informe | `C:\S_LAB\wt\scriptorium-wp-hub-112\playground\prueba-de-H-M\spike\CONTRARREVISION-WP-HUB-112.md` |
| Veredicto | **PASS_CON_ADDENDA** |
| ¿Aceptar 🔶→✅ verde local? | **Sí**, tras pegar/asumir la addenda de arriba |
| ¿GO 113 ya? | **Sí — recomendado** tras aceptar 112 con addenda. No despachar 100 en paralelo sin GO aparte; ola 0 siguiente = 113 |
| ¿Merge a main? | Solo con aceptación + verde local declarado; CI de pruebas aún inexistente (§4.4) |

— Revisor adversarial LORE-HM · WP-HUB-112
