# BACKLOG F2 · hub Scriptorium · mundo acabado

| dato | valor |
| ---- | ----- |
| Mundo | `C:\S\scriptorium` · hub, playground, portal y gobierno multi-mundo |
| Fuente | INFORME-R4 · consenso H-01 · sprint CIUDAD |
| Estado | ▶ **en ejecución por olas** (GO ola 0 · 2026-07-31) · ratificación progresiva por GO de ola · INÉDITO |
| Método | `swarm-orquestacion` · un WP/brief/rama/worktree |
| Edición | **F2-unificada** (Anfitrión): fases del camino crítico + costura a los 6 planes · **392 WPs totales** en el Scriptorium (V 71 · O 75 · Z 67 · G 54 · L 73 · HUB 52) |
| ✎ 2026-08-02 | **HUB 52 → 64**: lane **LORE-HM** (`WP-HUB-100`–`111`), promoción de la cola A del intake por orden del product owner. Las cifras de los demás mundos son **las de la edición F2-unificada, no las de hoy** — no se re-miden aquí para no sembrar un número nuevo sin medirlo (V y Z ya divergen). |
| ✎ 2026-08-02 | **LORE-HM ola 0**: `WP-HUB-112` ✅ (`wp/hub-112-hm-spike-viabilidad`, verde **local**, PASS_CON_ADDENDA) · `WP-HUB-113` ✅ CI LORE-HM (`ci-lore-hm.yml`) · run-ids gh verde `30726224409` / rojo plantado `30726279433` · rama `wp/hub-113-hm-ci-que-verifica` · **PASS_CON_ADDENDA** (CA hub medible; no «bloquea merge»; s-sdk verde local / follow-up) · `ci/CONTRARREVISION-WP-HUB-113.md` · **no merge main**. |

## Visión

Scriptorium terminado es un workspace FOSS restaurable: coordina mundos sin
poseerlos, ofrece playground real para el holón-7, mantiene un catálogo 51/51
trazable, prueba el camino LAN→WAN y consume el método publicado sin copiarlo.
Cada cambio tiene dueño, dependencia y evidencia; el hub no implementa la
obra de O/V/Z/G/L ni usa `s-sdk` como cajón de gobierno.

## Contrato de despacho

- `ALCANCE_DIFF` siempre dentro de este repo. Obra ajena = dependencia/tick.
- Contrato compartido: segundo consumidor (Eje IV); confianza: hostil-omite.
- Cero credenciales/corpus vivo en git o contexto Docker.
- P0 bloquea una experiencia integrada verificable; P2 no se ejecuta sin GO.

## Lanes

| lane | propósito |
| ---- | --------- |
| GOBIERNO | ownership, decisiones, 51/51, aprobación F2 |
| PLAYGROUND | env, root lógico, mounts y casos reproducibles |
| AUTH-GRAFO | barrio, siete marcas, anónimo/card opt-in |
| METODO-MESA | consumo/calibración del skill de mesa y auditoría |
| SINCRONIA | hilos, compactos, índice y cadena de informes |
| VIGILANCIA | identidad, bitácora, CUADERNOS y estaciones |
| PORTAL | casa pública, guías y mapas verificables |
| INTEGRACION | O/V/Z/G/L, ui-docker y LAN→WAN |
| E2E | consumidor limpio, offline y fallos ruidosos |
| **LORE-HM** | **`prueba-de-H-M`: mapa 7 holones × ciudad + ontología de un caso real ejercida por H y M** |
| HORIZONTE | P2P continuo, emergencias y crecimiento |

---

## Lane · GOBIERNO

### WP-HUB-001 · partición-de-ownership-F2
- **BRIEF:** mapa repo→lane→WP→dueño; ningún plan escribe obra ajena.
- **CA:** cada WP tiene `ALCANCE_DIFF`; dependencias externas citan tick/WP;
  gate falla ante path de otro WORLD_ROOT. **Ejes III+V.**
- **Pri:** P0 · BLOQUEA despacho F2

### WP-HUB-002 · registro-dependencias-multiworld
- **BRIEF:** registro regenerable de dependencias G10, Z-D1, L skill mesa,
  O storage y V Zigurat, sin duplicar sus backlogs.
- **CA:** cada dependencia tiene owner/estado/evidencia; cero pseudo-WP del hub
  para implementar otro mundo.
- **Pri:** P0

### WP-HUB-003 · censo-51-matriz-viva
- **BRIEF:** catálogo 51/51: pieza, capacidad, canal, consumidor, estado y CA.
- **CA:** derivado de manifests; 51 denominador trazable; desconocido = ⏳,
  nunca «hecho» por presencia en repo.
- **Pri:** P0 · core

### WP-HUB-004 · ledger-decisiones-y-sellos
- **BRIEF:** decisión→informe→sello CUADERNOS→restauración, sin blockchain
  nominal ni memoria de chat como fuente.
- **CA:** restauración desde último sello reproduce informe vigente y abiertos.
- **Pri:** P1

### WP-HUB-005 · ratificacion-backlogs-F2
- **BRIEF:** custodio aprueba/descarta WPs de seis mundos y hub; generar vista
  de seleccionados sin mutar backlogs ajenos.
- **CA:** tabla decisión por WP; descartado no aparece como pendiente; conteos
  reconciliados por prioridad.
- **Pri:** P0 · gobierno

### WP-HUB-006 · linter-backlog-multi-serie
- **BRIEF:** validar lanes, IDs configurables, BRIEF, CA, P, deps, ownership y
  ciclos antes de proyectar issues.
- **CA:** fixtures S/G/L y HUB; 0 WPs o dependencia circular falla ruidoso.
- **Pri:** P1 · coord L

---

## Lane · PLAYGROUND

### WP-HUB-010 · layout-root-datos-playground
- **BRIEF:** decidir/anclar namespace lógico de VOLUMES y mounts físicos sin
  hardcodear path de máquina.
- **CA:** contrato funciona con dos paths físicos; no depende de cwd;
  `volumes.json` ambiguo falla.
- **Pri:** P0 · dep Z contrato/O mounts

### WP-HUB-011 · env-demo-fuente-unica
- **BRIEF:** fichero env real de demo generado desde contrato Z, consumido por
  casos y futuro editor V.
- **CA:** ausencia de env obligatorio falla claro; cero defaults silenciosos a
  fixtures; secretos excluidos.
- **Pri:** P0 · BLOQUEA demo integrada

### WP-HUB-012 · no-root-vivo-en-node-modules
- **BRIEF:** ningún caso monta `node_modules/.../volumes` como root de ronda.
- **CA:** probe producto = 0; import a mount externo; omitir import falla.
- **Pri:** P0 · dep G10

### WP-HUB-013 · import-shape-pozo-forces
- **BRIEF:** fixture C-5 para probar semilla/import/manifiesto/estado/corpus.
- **CA:** import, offline, reimport no-op, corrupción falla, cero secretos.
- **Pri:** P1 · dep G31/Z validación

### WP-HUB-014 · CA-local-first
- **BRIEF:** ejecutar CA post-H-01 con root A y snapshot B; documentar qué no
  demuestra sobre P2P continuo.
- **CA:** A/B integridad igual; red cortada; B no consulta A; T9 evidencia
  externa queda resuelta o ⏳ explícita.
- **Pri:** P1 · tick propio

### WP-HUB-015 · catalogo-mounts-experimento
- **BRIEF:** comparar root físico único, catálogo de mounts y adaptador plural
  sin elegir por intuición.
- **CA:** misma API de lectura en 3 fixtures; resolver no depende de cwd.
- **Pri:** P1 · coord Z/O

### WP-HUB-016 · docker-desktop-storage-safety
- **BRIEF:** mounts de datos separados de runtime e imagen; gitignore y
  dockerignore/contexts seguros.
- **CA:** inspección de imagen/contexto = 0 corpus/secretos; recrear contenedor
  conserva datos.
- **Pri:** P0 · coord O

---

## Lane · AUTH-GRAFO

### WP-HUB-020 · auth-barrio-estructura
- **BRIEF:** nodo barrio de encuentro en `prueba-de-dos`; no padre obligatorio.
- **CA:** transporte anónimo base; capacidades card opt-in; card inválida no
  degrada; cero secretos. **Hostil-omite.**
- **Pri:** P0 · BLOQUEA holón-7

### WP-HUB-021 · A3-evidencia
- **BRIEF:** prueba reproducible de la fila S/auth barrio.
- **CA:** comando+salida literal; marca solo tras entrada real.
- **Pri:** P0 · dep HUB-020

### WP-HUB-022 · grafo-siete-marcas
- **BRIEF:** orquestar siete entradas con ownership y deps Z-D1.
- **CA:** 7/7 evidencias, ninguna heredada; cada actor escribe solo su fila.
- **Pri:** P0 · core

### WP-HUB-023 · contrato-anonimo-optin
- **BRIEF:** política transversal de conexión anónima y capacidad opt-in.
- **CA:** controles positivo, omitido, inválido y expirado; cable permanece
  abierto cuando se deniega acción.
- **Pri:** P0 · coord Z/G/V/O

### WP-HUB-024 · scopes-federacion-sin-mando
- **BRIEF:** ámbitos solapados/horizontales; barrio/ciudad facilitan alcance,
  no autoridad.
- **CA:** dos peers directos sobreviven a caída de tercero; relay no reescribe
  payload; descarte deja traza.
- **Pri:** P1

### WP-HUB-025 · hilo-peercard-reuso
- **BRIEF:** abrir/compactar hilo Z+G sobre emisión por contexto de autoridad.
- **CA:** ◆/★/⏳; no promover scopes por topología; compacto validado.
- **Pri:** P1 · tick

---

## Lane · METODO-MESA

### WP-HUB-030 · consumir-skill-mesa
- **BRIEF:** instalar release L y calibrar esta sala sin copiar el método.
- **CA:** agente fresco levanta fixture y sala hub; segundo consumidor; ceguera.
- **Pri:** P0 · dep L-A01/L-A12

### WP-HUB-031 · calibracion-protocolo-instancia
- **BRIEF:** mover parámetros/roster/rutas a instancia fuera del tarball.
- **CA:** actualizar método no pisa calibración; 0 nombres de mesa en skill.
- **Pri:** P1

### WP-HUB-032 · compactar-y-reemplazar
- **BRIEF:** automatizar archivo/punteros con control de no-pérdida.
- **CA:** ED sintética conserva hechos/candidatas/abiertos; rollback por sello.
- **Pri:** P1

### WP-HUB-033 · indice-hilos-regenerables
- **BRIEF:** reconstruir índice/HILOS desde buzones/ticks sin pisar roster.
- **CA:** hilo fantasma=0; H-01 reproducido; escritura atómica.
- **Pri:** P1

### WP-HUB-034 · auditor-meta-integracion
- **BRIEF:** activar auditor §11 con frontera nota vs DRAFT y entrega META.
- **CA:** auditor cura nota autorizada, no backlog; forma/fondo trazadas;
  Anfitrión puede aceptar/devolver.
- **Pri:** P1 · dep L-A12/L-A13

### WP-HUB-035 · identidad-y-aborto-tick
- **BRIEF:** firma, nombre cruzado y `NO_TICK_VALIDADO=NO_PROCESAR`.
- **CA:** tick a identidad errónea aborta sin leer alcance ni producir efectos.
- **Pri:** P1

---

## Lane · SINCRONIA

### WP-HUB-040 · informe-vigente-unico
- **BRIEF:** un informe normativo; anteriores a archivo/cita inerte.
- **CA:** índice apunta uno; restauración no relee histórico.
- **Pri:** P1

### WP-HUB-041 · timbre-ping-seguro
- **BRIEF:** formato append UTF-8, rutas seguras y pull-on-tick.
- **CA:** path con barras no parte línea; PING no autoriza procesamiento.
- **Pri:** P2

### WP-HUB-042 · compactos-verificador-forma
- **BRIEF:** gate ◆/★/⏳, propuesta≠decisión y no-pérdida.
- **CA:** fugas F1/F2 sintéticas fallan; ED2 H-01 pasa.
- **Pri:** P1 · coord L

### WP-HUB-043 · cadena-sellos-ronda
- **BRIEF:** informe cita sello anterior y S publica snapshot de sala.
- **CA:** cadena verificable; nada de obra/secrets en CUADERNOS.
- **Pri:** P0

---

## Lane · VIGILANCIA

### WP-HUB-050 · bitacora-manual-apunta
- **BRIEF:** bitácora de sesión apunta a sala sin duplicarla.
- **CA:** restore usa índice+informe; tamaño acotado; cero decisiones huérfanas.
- **Pri:** P1

### WP-HUB-051 · boot-estacion-identidad
- **BRIEF:** estación solo con GO y preflight canónico.
- **CA:** PASS arranca; LOCK deja cero efectos; watchers siguen parados hasta GO.
- **Pri:** P1

### WP-HUB-052 · CUADERNOS-sellos-higiene
- **BRIEF:** snapshot sala+referencias plan F2+bitácora, no obra inflada.
- **CA:** push rama; secrets=0; hash registrado.
- **Pri:** P0

### WP-HUB-053 · claims-y-doble-conductor
- **BRIEF:** claims de carril y resolución de anomalía doble conductor.
- **CA:** segundo conductor sin claim se detecta antes de efecto.
- **Pri:** P1

---

## Lane · PORTAL

### WP-HUB-060 · licencia-package-coherente
- **BRIEF:** `package.json` hoy UNLICENSED debe alinearse con LICENSE canónica
  GPL-3.0-or-later + Animus Iocandi.
- **CA:** custodio valida; package/LICENSE/docs/tarball coherentes.
- **Pri:** P0 · FOSS

### WP-HUB-061 · portal-scriptorium
- **BRIEF:** casa pública del producto, no marketing: mundos, playground,
  estado verificable y entrada a demos.
- **CA:** docs build+links; claims derivados; cero CDN.
- **Pri:** P1

### WP-HUB-062 · guia-ciudad-playground
- **BRIEF:** guía operativa de casos, roles y datos sin rutas de máquina.
- **CA:** un usuario fresco ejecuta prueba mínima; huecos honestos.
- **Pri:** P1

### WP-HUB-063 · mapa-51-capacidades
- **BRIEF:** vista de piezas→capacidades→consumidores→estado.
- **CA:** deriva HUB-003; no confunde publicado con usado.
- **Pri:** P1

### WP-HUB-064 · cerco-v2-operadores
- **BRIEF:** código histórico, provenance, storage externo, peers vivos y boot offline.
- **CA:** ejemplos positivo/negativo; cero «todo dentro del repo».
- **Pri:** P1

### WP-HUB-065 · picture-LAN-WAN
- **BRIEF:** arquitectura literal LAN→WAN con fronteras O/V/Z/G/S/L.
- **CA:** cada flecha tiene contrato/owner; ninguna compatibilidad ficticia.
- **Pri:** P1

---

## Lane · INTEGRACION

### WP-HUB-070 · interfaz-env-O-V
- **BRIEF:** contrato nuevo env demo: O propone, Z valida, V edita opt-in.
- **CA:** lectura/escritura atómica; validación; sin settings competidores.
- **Pri:** P0 · coord O/V/Z

### WP-HUB-071 · molde-ui-docker
- **BRIEF:** caso integrado Docker Desktop sobre storage separado y piezas Z/G.
- **CA:** compose config; offline tras siembra; no conceptos de dominio hardcoded.
- **Pri:** P1 · owner O

### WP-HUB-072 · zigurat-estructura-antes-UI
- **BRIEF:** materializar estructura G en playground antes del mapa V.
- **CA:** contrato navegable; lienzo vacío preservado; UI no inventa dominio.
- **Pri:** P1 · coord G/V

### WP-HUB-073 · adaptador-volumenes-cruce
- **BRIEF:** coordinar contrato Z, mounts O y packs G sin implementar aquí.
- **CA:** decisiones/deps aterrizan en WPs propietarios; hub solo prueba integración.
- **Pri:** P1

### WP-HUB-074 · segunda-puerta-7-a-51
- **BRIEF:** plan de ampliación catálogo/puertas hasta 51/51.
- **CA:** cada pieza tiene puerta y consumidor o hueco; cero clientes ad hoc invisibles.
- **Pri:** P1

---

## Lane · E2E

### WP-HUB-080 · prueba-de-dos-registry-clean
- **BRIEF:** starter-kit desde canales limpios, sin sibling paths.
- **CA:** temp limpio; dos peers; mensaje reconciliado; evidencia literal.
- **Pri:** P0

### WP-HUB-081 · ciudad-roles-e2e
- **BRIEF:** autoridad/jugadores/cronista y miradores sin jugar.
- **CA:** roles reales, intent+state, salida reproducible.
- **Pri:** P1

### WP-HUB-082 · offline-after-seed
- **BRIEF:** red se usa para instalar/sembrar/sync explícita, no para boot.
- **CA:** desconectar y arrancar; falta local falla antes del boot.
- **Pri:** P1

### WP-HUB-083 · failure-matrix
- **BRIEF:** card omitida/inválida, root ausente, hash roto, relay caído,
  registry offline y corpus desconocido.
- **CA:** cada ausencia falla en frontera correcta sin estado parcial.
- **Pri:** P1 · hostil-omite

### WP-HUB-084 · external-observer-evidence
- **BRIEF:** evidencia verificable por tercero para snapshot/réplica sin consultar A/B.
- **CA:** tercero valida manifests/hashes/sellos; no autocertificación.
- **Pri:** P1 · T9

---

## Lane · LORE-HM

> **Origen.** Rama nacida del intake externo `WPS_QUEUE` **cola A**
> (`C:\S_LAB\s-sdk\WPS_QUEUE\`), promovida por el Anfitrión el **2026-08-02**
> por orden del product owner: *«vamos a cambiar una carpeta pendiente de
> encolar por una rama sólida de WPs para el backlog»*. Material fuente leído
> entero antes de escribir: `plan.md` (6 fases de integración holónica) ·
> `DRAFT/PLAN.md` (kit y ceremonia v1) · `DRAFT/researches/solid-city.md` ·
> `DRAFT/plans/pd2_verbos_json-ld_9d69d81d.plan.md` ·
> `DRAFT/plans/mesa_prueba_playground_0c3520d6.plan.md` ·
> `DRAFT/researches/barrio-bartley.md` · cantera `CIUDAD` de S.

**Qué es.** `prueba-de-H-M` **expande `prueba-de-dos`** en las dos direcciones
que la prueba actual no cubre:

- **(a) el mapa jugable de los 7 holones** sobre los **6 distritos y 24
  barrios** de la ciudad (cantera de S, espejo lógico de `a-sdk`) — hoy el
  starterkit demuestra entrada bilateral pero no ilumina ciudad;
- **(b) el boilerplate de playground que modela la ontología de un caso
  real** —barrio 20 `document-machine-sdk`, distrito `lore-voz`— para que H y
  M la **ejerzan de punta a punta**, no la declaren.

**Roles heredados sin cambio**: H = Human/A/anfitrión (autoridad, identidad,
emisión y revocación de leases, observación); M = Machine/B (maestro de
títeres del stack Cristalizador → Future Machine). La corrida **no pasa porque
arranquen procesos: pasa porque los dos lados observan y registran la misma
cadena causal.**

**Lo que NO es** (decidido en el material, citado, no inferido): no crea holón
08 ni `L_SDK` · **no amplía el reparto de mundos** — `e-sdk` ya es el holón 03
con su propio plan (`C:\S_LAB\e-sdk\plan\`), `a-sdk` entra **RO import-once**
(holón 05, cantera) y Network-Engine (holón 04) se **sella como fuente
histórica**, no se adopta como runtime · no toca `prueba-de-dos` ni sus siete
marcas · no monta servidor SOLID/CSS real, WebID real, VectorMachine real ni
LLM en tests de v1 · el playground es **consumidor y banco de conformidad**,
nunca dueño del dominio.

**Gate `GHM`** = `WP-HUB-100`…`107` aceptados. Abre `108`–`111`.
**Dependencias externas**: tipos de Zeus `U245`–`U249` (ventana abierta desde
`GD`) · lengua y notaría `WP-SDK-L01`–`L05` en `s-sdk` · provider real de
Document Machine = **obra de E**, aquí sólo su puerto y la contingencia.

### WP-HUB-112 · hm-spike-viabilidad · ✅
> Aceptado en rama `wp/hub-112-hm-spike-viabilidad` (commit `03a0511`) · verde
> **local** · contrarrevisión **PASS_CON_ADDENDA** · veredicto **NO CORRE**
> cadena B→C→P · reporte+addenda en esa rama bajo `playground/prueba-de-H-M/spike/`.
> **No merge a main** sin gate (`113`).
- **BRIEF:** antes de construir el kit, contestar **con medida** la pregunta
  que abrió esta rama: **¿pueden H y M operar procesos reales con material de
  Onfalo en la Future Machine, hoy?** Spike acotado, **read-only sobre OASIS**:
  tomar las dos piezas reales del corpus de editoriales —
  `2024-05-01_primero-de-mayo.md` y
  `2026-05-01_auge-de-la-educacion-emocional.md`, **verificadas en disco por el
  Anfitrión el 2026-08-02**— y recorrer la cadena mínima Bartleby →
  Cristalizador → Pipeline con los agentes reales del barrio 20, midiendo qué
  se ejecuta de verdad. **Dato duro que el spike hereda**: los submódulos de
  `e-sdk` (`DocumentMachineSDK`, `AgentLoreSDK`, `VectorMachineSDK`,
  `VectorMachineUI`) están **sin inicializar** — `git submodule status` los da
  con prefijo `-`; el material vivo sólo existe en OASIS, que es cantera RO.
- **CA:** veredicto pieza a pieza en tres columnas — **corre / no corre / no
  existe** — con la orden exacta y su salida literal, nunca por lectura de
  documentación · dice **qué parte de la ceremonia de `100`–`107` no se puede
  demostrar hoy** y qué haría falta · cero escritura fuera de `playground/`;
  OASIS, `a-sdk` y `e-sdk` sólo lectura · **si la respuesta es «no corre», la
  lane se reordena en el mismo reporte** y nombra cuál de las once fichas cae
  o cambia de forma.
- **Pri:** **P0 · BLOQUEA la lane entera**

### WP-HUB-113 · hm-ci-que-verifica · ✅
> Aceptado con evidencia `gh` · **PASS_CON_ADDENDA** · rama
> `wp/hub-113-hm-ci-que-verifica` · worktree `C:/S_LAB/wt/scriptorium-wp-hub-113`
> · workflow `.github/workflows/ci-lore-hm.yml` · reporte
> `playground/prueba-de-H-M/ci/REPORTE-WP-HUB-113.md` · contrarrevisión
> `playground/prueba-de-H-M/ci/CONTRARREVISION-WP-HUB-113.md` · run-id verde
> **30726224409** · run-id rojo plantado **30726279433** · CA hub medible OK
> (rojo tumba job; preflight+ceguera en CI; sin continue-on-error) · **no**
> afirma bloquea merge (sin branch protection) · s-sdk sin espejo (verde local
> / follow-up). **No merge a main**.
- **BRIEF:** hoy `C:\S\scriptorium` y `C:\S_LAB\s-sdk` tienen **un único flujo,
  `docs.yml`**: ni una prueba, ni un gate, nada que bloquee. Montar CI que
  ejecute la suite del playground y los gates de la lane **y que bloquee**.
- **CA:** un rojo plantado a propósito **enrojece el flujo** (vector guardado) ·
  cero pasos blandos —`continue-on-error` sin razón escrita— y una guarda que
  impida su regreso · el preflight de identidad-raíz y `skills:ceguera` corren
  **en CI, no sólo en local** · el veredicto se lee con `gh` y se cita el
  `run-id`: **medido, no supuesto**.
- **Pri:** **P0** · es la lección más cara del programa: Z y V cerraron **tres
  olas** con su CI en rojo porque nadie lo miró.

### WP-HUB-100 · hm-escenario-y-schemas
- **BRIEF:** kit autocontenido `playground/prueba-de-H-M`;
  `scenarios/barrio-lore/scenario.json` (barrio canónico `document-machine-sdk`,
  distrito `lore-voz`, roles H/M fijos, unidades, ceremonia, artefactos
  esperados, cleanup y CA) y `schemas/` para `scenario`, `unit`, `machine`,
  `activity`, `pod`, `pod-lease`, `artifact-chain`, `graph`, `universe`,
  `corto` y `evidence-report`. Catálogo de **diez unidades** (`loreador`,
  `bartleby`, `archivero`, `vector-mock`, `grafista`, `demiurgo`,
  `dramaturgo`, `pipeline`, `portal`, `cristalizador`) con tipo
  `agent|machine`, I/O, dependencias, verbos, schema de estado y condición
  `bootstrap|deployed|dynamic`.
- **CA:** los once schemas validan **y rechazan su negativo** (los dos sentidos
  se prueban) · las líneas **reusan los schemas publicados de
  `@zeus/linea-kit`** — grep con exit code que demuestra **cero** schema de
  línea propio · cero ids inventados: cada barrio/distrito citado existe en
  `CENSO-ESTADOS.md` de la cantera · `prueba-de-dos` con **diff vacío**.
- **Pri:** P0 · BLOQUEA la lane

### WP-HUB-101 · hm-ontologia-y-verbos
- **BRIEF:** `ontology/hm-v1.context.jsonld`, `ontology/hm-v1.ttl` y
  `reference/VERBOS.md`. Catálogo en cuatro familias — base H/M (`peer.join`,
  `peer.announce`, `state.inspect`, `session.exit`) · pods (`pod.lease`,
  `pod.revoke`, `unit.inflate`, `unit.start|pause|resume|stop|debug`,
  `machine.deploy`) · LORE (`source.ingest`, `document.analyze`,
  `vector.mock-index`, `line.materialize`, `graph.bifurcate`,
  `universe.instantiate`, `corto.emit`) · diagnóstico. Los alias TUI históricos
  (`boot`, `status`, `loadMOCK`, `run`, `inspect`, `data`, `spec`, `gaps`,
  `validate`, `trace`, `coverage`, `exit`) **traducen** a actividad tipada y no
  constituyen una ontología paralela. Reuso obligatorio de AS2, PROV-O y
  DCTERMS **antes** de acuñar `hm:` o `lore:`.
- **CA:** cada verbo con término mapeado **o razón escrita** de por qué se
  acuña · gate que **falla** si se acuña existiendo término W3C/DCMI
  equivalente, alimentado por el registro de `WP-SDK-L04` (consumido, no
  copiado) · **la vista JSON-LD no entra en la huella** (DIC-4: sha256 de
  bytes sellados) — probado mutando la vista y exigiendo huella idéntica ·
  cada alias resuelve a exactamente una actividad tipada.
- **Pri:** P0

### WP-HUB-102 · hm-generador-idempotente
- **BRIEF:** `scripts/generar.mjs` produce corridas regenerables en
  `.runs/<run-id>/H` y `.runs/<run-id>/M` (`--scenario`, `--run`,
  `--sin-install`, `--force-new`): env **sin defaults silenciosos**, handoffs
  vivos, room, manifest sellado y raíz de evidencia.
- **CA:** dos corridas seguidas = **no-op medido** · drift de manifest **o** de
  artefactos falla ruidoso y **no sobrescribe** (probado alterando los dos por
  separado) · reanuda **sólo** si el manifest coincide · cero rutas de máquina
  (`C:\Users\…`) en nada de lo generado, verificado con grep.
- **Pri:** P0 · dep: 100

### WP-HUB-103 · hm-podstore-y-leases
- **BRIEF:** `LocalPodProvider` files-first con IRI lógica
  `urn:scriptorium:hm:<run-id>:pod:<unit-id>` y ubicación física resuelta por
  el manifest, **nunca publicada como ruta de máquina**. Contenido mínimo por
  pod: `descriptor.jsonld`, `state.json`, `events.ndjson`,
  `artifacts/manifest.json`, `inbox/`, `outbox/`. Tipestate
  `declared → leased → inflated → ready → running → paused|stopped|failed`.
  **Inflación bilateral**: M emite `unit.inflate`, H valida identidad y emite
  `pod.lease`, y sólo entonces la unidad se materializa.
- **CA:** **el pod decide, no H** — H emite y transporta capacidades, la
  política la evalúa el pod; probado con ACL positiva, omitida, inválida y
  expirada, y las cuatro deniegan salvo la positiva · **no hay override de
  administrador**, y un test lo intenta · transiciones con chequeo exhaustivo:
  añadir un estado sin su caso **rompe** compilación o test · marca explícita
  de simulación — el proveedor local **nunca** se presenta como Pod Solid
  real · un pod por cada una de las diez unidades estáticas y por cada
  `universe-runner-<id>` dinámico.
- **Pri:** P0 · dep: 100

### WP-HUB-104 · hm-onfalo-import-once
- **BRIEF:** `scripts/importar-onfalo.mjs`, import-once **build-time**, con
  `--source-root` explícito, que selecciona exactamente dos piezas del corpus
  de editoriales de `onfalo-asesor-sdk`. Comprobación de licencia y secretos
  **antes** de copiar. `source.manifest.json` con repo lógico, rutas
  relativas, tamaño, media type y sha256.
- **CA:** dos piezas exactas, hashes reproducibles, **cero secretos y cero
  rutas absolutas** · si no se puede redistribuir, **falla** — prohibido el
  corpus sustituto silencioso, y un test lo comprueba · la corrida normal
  consume **sólo** el snapshot sellado y funciona **sin OASIS montado**,
  probado renombrando la fuente.
- **Pri:** P1 · dep: 100

### WP-HUB-105 · hm-cadena-lore-determinista
- **BRIEF:** handlers deterministas — Bartleby produce sus cinco secciones y
  metadatos; Cristalizador inspecciona capacidades y **genera el machine
  manifest** (prepara infraestructura, no suplanta a Pipeline); VectorMock
  genera embeddings y vecinos con **algoritmo y seed declarados**. Dos líneas
  con `@zeus/linea-kit` (`barrio-lore-onfalo`: raw → análisis → referencias
  vectoriales · `barrio-lore-futuros`: grafo → universos → cortos), grafo que
  enlaza ambas `linea://` con las URNs de VectorMock, y **dos universos
  deterministas** que demuestran una bifurcación real. `hm:CortoDeEjecucion` =
  chunk inmutable y consultable del log de un runner (`universeId`,
  `graphDigest`, referencias, intervalo, eventos y huella) — **no** el corto
  literario histórico.
- **CA:** los validadores publicados de `linea-kit` pasan sobre las dos líneas ·
  `mock=true` **siempre declarado**, con un test que enrojece si desaparece ·
  **cero LLM y cero VectorMachine real** en tests, medido sin red · dos
  universos con bifurcación real, no dos copias (probado por divergencia de
  contenido) · `corto.query` filtra por universo, unidad, verbo y rango, y
  **cada resultado se traza hasta el raw de Onfalo**.
- **Pri:** P1 · dep: 100, 104

### WP-HUB-106 · hm-ceremonia-bilateral
- **BRIEF:** `barrio-lore-v1` en once pasos **bloqueantes**: preflight e
  identidad H/M → room y autoridad → leases e inflación conjunta de
  Bartleby/Cristalizador → machine manifest y despliegue del resto →
  ingest Onfalo y análisis → VectorMock → dos líneas validadas → grafo
  enlazado → dos universos y runners con pods → emisión y consulta de cortos →
  trace, coverage y shutdown limpio. Por actividad: envelope con `id`, `actor`,
  `verb`, `object`, `target`, `context`, `instrument`, timestamps, `result`,
  `provenance` y `digest` → `wire.json` sellado + `view.jsonld` + evento en el
  pod de la unidad.
- **CA:** **H y M registran la misma cadena causal**, comparada fila a fila
  entre los dos handoffs — no basta con que arranquen los procesos · ningún
  paso continúa si falta su upstream · un fallo deja **cero estado parcial**,
  probado matando la corrida en cada uno de los once · `evidence/report.json`
  y `report.md` generados **desde eventos, no a mano**, con matriz
  verbo/actor/object/PASS, pods, cadena de artefactos, hashes, cobertura,
  cortos consultados, fallos y procesos residuales · cada mitad firma **sólo
  la suya**.
- **Pri:** P0 · dep: 101, 102, 103, 105

### WP-HUB-107 · hm-verificador-externo
- **BRIEF:** `scripts/verificar-evidencia.mjs`: un tercero valida la corrida
  **sin consultar los directorios vivos de H ni de M**.
- **CA:** valida wire, expansión JSON-LD, hashes, ACL, transiciones,
  provenance, cobertura, reporte y shutdown · **cero autocertificación**: se le
  entrega sólo la raíz de evidencia y falla si le falta cualquier pieza · los
  negativos —hash roto, ACL expirada, transición ilegal, corto sin traza hasta
  el raw, VectorMock sin declarar— **fallan cada uno en su frontera y con su
  nombre**, no con un error genérico.
- **Pri:** P0 · dep: 106 · **cierra `GHM`**

### WP-HUB-108 · hm-mapa-holones-distritos
- **BRIEF:** la pieza de Ciudad: el mapa jugable **7 holones × 6 distritos ×
  24 barrios**, dato machine-readable **derivado** de la cantera de S
  (`CENSO-ESTADOS.md`, `01-BARRIOS/`, `GRAFO/`) y de `HOLONES.md`, consumido
  por el juego como **proyección** — el runtime **no abre la cantera**.
- **CA:** los 24 barrios tienen distrito y holón asignados; los 7 holones
  tienen ≥1 barrio **o razón escrita** de por qué no · cero slugs inventados:
  cada id contrastado contra el censo con exit code · la proyección se deriva
  y un gate **falla si cantera y proyección divergen** · los holones 05 y 06
  aparecen como cantera y constelación **sin fingir runtime**, y 07 como el
  método, no como un barrio.
- **Pri:** P1 · dep: `GHM`

### WP-HUB-109 · hm-lore-voz-despierta
- **BRIEF:** tras la ceremonia, el distrito `lore-voz` queda **despierto** en
  el censo con actas por unidad. `novelist-editor` (distrito `runtime-mcp`)
  aporta elenco de personajes por identidad, **no** pipeline.
- **CA:** el estado del barrio cambia **por evidencia de corrida y no por
  edición a mano** — probado revirtiendo la evidencia y exigiendo que el
  estado vuelva solo · cada acta cita unidad, verbo y huella · identidad H/M
  con ≥2 personajes y su lease cada uno.
- **Pri:** P1 · dep: 108

### WP-HUB-110 · hm-negativos-y-consumidor-limpio
- **BRIEF:** matriz de negativos (corpus ausente, hash roto, schema inválido,
  pod sin lease, VectorMock no declarado, upstream ausente, runner caído) y
  cierre con consumidor limpio: `npm ci` en checkout temporal, generación sin
  sibling paths, runtime **offline tras seed**, rerun determinista y shutdown
  sin procesos, puertos ni locks huérfanos.
- **CA:** cada negativo falla en su frontera y deja cero estado parcial · el
  offline se **instrumenta**, no se declara (cero salidas no-loopback durante
  la corrida) · rerun byte a byte determinista salvo campos de tiempo
  declarados · `npm run skills:ceguera` pasa desde la raíz del hub.
- **Pri:** P0 · dep: 107

### WP-HUB-111 · hm-escenarios-descubribles
- **BRIEF:** el arnés descubre `scenarios/*/scenario.json` y corre sobre ellos
  una suite de conformidad común. **Sólo Barrio LORE entra en v1.**
- **CA:** un segundo escenario mínimo corre **sin tocar el arnés** · todo
  escenario declara barrio canónico, fixture, unidades, verbos, CA y cleanup ·
  el descubrimiento **no** promueve a v1 lo que no lo es, y un test lo fija.
- **Pri:** P2 · dep: 110

---

## Lane · HORIZONTE

### WP-HUB-090 · C6-P2P-segundo-acto
- **BRIEF:** contrato futuro de descubrimiento, anuncio, pull/push/cursor,
  divergencia y reconciliación por driver.
- **CA:** BRIEF/fixture listos; cero implementación sin tick.
- **Pri:** P2

### WP-HUB-091 · emergencia-reproducible
- **BRIEF:** convocatoria y restauración de mesa mediante skill publicado.
- **CA:** agente fresco recupera desde sello y espera tick.
- **Pri:** P2

### WP-HUB-092 · primer-amigo-friccion
- **BRIEF:** acta de experiencia de una persona externa entrando al sistema.
- **CA:** consentimiento; cero datos personales en repo; hallazgos a backlog.
- **Pri:** P2

---

## FASES · camino crítico de Scriptorium v1 (los 6 planes, una secuencia)

*El hub no posee estos WPs: los **ordena**. Cada fase cierra con su gate;
ninguna fase abre sin la anterior en verde. IDs = ediciones F2-unificadas.*

```text
FASE 0 · GOBIERNO Y FOSS (todo lo demás se despacha sobre esto)
  HUB-001·005·052 · O07·O08·O09 · V81·V77·V78 · U232·U237 · G03·G74·G01 · L-F08·L-F01
  ★ LICENCIA = UNA SOLA ACTA del custodio que cubre L-F08 + U237 + O08 + G74 + HUB-060

FASE 1 · CONTRATOS BASE (datos y puertas)
  G10·G16 · U199·U200·U201·U233 · O20·O30·O70 · V28·V26(schema) · HUB-010·011·012

FASE 2 · RUNTIME MÍNIMO (el cable y las piezas)
  U186(con paso 0)·U187·U192·U202–U206·U227·U228·U234
  G20·G21·G31·G40 · O10·O11·O22·O31 · V20·V21·V29·V30

FASE 3 · HOLÓN-7 Y CIUDAD (la prueba de la mesa)
  HUB-020·021·022 · G50·G52 · O12 · V18 · U218 · L-G01 · fila del custodio

FASE 4 · PRODUCTIZACIÓN (que lo use un desconocido)
  G12·G13·G82·G83·G84 · O55·O62·O66·O76·O77 · V66·V83·V84·V86 · U214·U238·U239

FASE 5 · ACEPTACIÓN SCRIPTORIUM v1
  HUB-080–084 · O94·O95 · U235 · G84 · V86(DoD) → TEST DEL OPERADOR (abajo)
```

### DoD de Scriptorium v1 — el test del operador externo (10 pasos)

Un operador **ajeno al equipo**, desde canales limpios: ① instala método y
piezas FOSS con licencias coherentes · ② siembra un pack Release en storage
separado · ③ arranca O+Z con un comando, sin secretos embebidos · ④ abre V
en VS Code limpio y ve configuración/estado honestos · ⑤ carga un juego G
(o crea uno con el kit) y entra anónimo o con card opt-in · ⑥ ejecuta un
intent, observa state/ledger y completa las 7 marcas · ⑦ reinicia offline
sin perder lo que el contrato declara durable · ⑧ verifica artefactos,
provenance y salud · ⑨ hace backup/restore/rollback sin la máquina autora ·
⑩ apaga sin procesos, mounts ni credenciales huérfanos.

**Diez pasos, seis mundos, un producto.** Cada paso mapea a WPs concretos
de las fases 4–5; ninguno se autocertifica.

## Conteo

| prioridad | n |
| --------- | -: |
| P0 | 18 |
| P1 | 30 |
| P2 | 4 |
| **Total** | **52** (hub) · **392** (Scriptorium completo) |

## Dependencias maestras

```text
HUB-001 → HUB-005
G10 → HUB-012
Z-D1 → HUB-022
L-A01/A12 → HUB-030/HUB-034
O storage + Z contrato + G packs → HUB-010/HUB-073
HUB-010·011·012 → HUB-071·080·082
HUB-020·021 + entradas externas → HUB-022
HUB-003 + puertas propietarias → HUB-074
```

Nada se despacha hasta ratificación del custodio.

— **S** · proyección F2 del hub