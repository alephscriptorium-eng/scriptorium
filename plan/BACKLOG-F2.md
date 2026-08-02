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
| ✎ 2026-08-02 | **LORE-HM ola 0**: `WP-HUB-112` ✅ aceptado (verde **local**) · veredicto **NO CORRE** cadena B→C→P · contrarrevisión **PASS_CON_ADDENDA** · reporte+addenda `playground/prueba-de-H-M/spike/REPORTE-WP-HUB-112.md` · siguiente `113` (GO ola 0 vigente). |
| ✎ 2026-08-02 | **LORE-HM ola 0**: `WP-HUB-112` ✅ aceptado (verde **local**, commit `03a0511`) · **NO CORRE** B→C→P · PASS_CON_ADDENDA · `WP-HUB-113` ✅ en rama `wp/hub-113-hm-ci-que-verifica` (run-ids gh verde `30726224409` / rojo `30726279433`) · **no merge main** · ola 1 (`100`·`101`·`L01`) **no** despachada sin GO. |
| ✎ 2026-08-02 | **Hotfix LORE-HM CI**: tip `wp/lore-hm-accum` `2c4abea` estaba **CI rojo medido** (run `30734537647`) — `test-100-schemas` exigía `length===11` con 14 schemas legítimos post-109. Arreglo: guardian por **presencia de los once nombrados** (no cardinalidad). Tras `176439b`, schemas+sellos PASS en CI (`30741057136`); quedó rojo por `test-104` exigiendo OASIS `C:/Users/...` en runner. Follow-ups CI-safe: source-root Onfalo desde fixture; gate mapa sin cantera S (`--gate` excerpt). **NO-GO merge** hasta custodio. Run-id gh **VERDE** tip `ad36a27`: `30741139873`. |
| ✎ 2026-08-02 | **LORE-HM ola 1 ✅**: `100`·`101` aceptados (PASS_CON_ADDENDA; sin merge main). |
| ✎ 2026-08-02 | **LORE-HM ola 1 GO**: `WP-HUB-100` 🔶 · `WP-HUB-101` 🔶 (worktrees `C:/S_LAB/wt/scriptorium-wp-hub-100` / `-101`, base tip `wp/hub-113-hm-ci-que-verifica`) · herencia spike 112 **NO CORRE** FM viva → kit/ceremonia = **simulacro playground**; 112/113 ✅ en ramas, **sin merge main**. |
| ✎ 2026-08-02 | **LORE-HM ola 2 GO**: `WP-HUB-102` 🔶 · `WP-HUB-103` 🔶 (worktrees `C:/S_LAB/wt/scriptorium-wp-hub-102` / `-103`, base tip `wp/hub-100-hm-escenario-y-schemas`=`ddb4d8b`) · herencia 112 simulacro; U245 sin fingir. |
| ✎ 2026-08-02 | **LORE-HM ola 2 ✅**: `102` tip `186fc94` · `103` tip `07f36ac` · PASS_CON_ADDENDA · accum `wp/lore-hm-accum` · **sin merge main**. |
| ✎ 2026-08-02 | **LORE-HM ola 3 GO**: `WP-HUB-104` 🔶 (wt `scriptorium-wp-hub-104`, base `wp/lore-hm-accum`=`c51c74d`); `105` tras 104 · L03 en s-sdk. |
| ✎ 2026-08-02 | **LORE-HM ola 3**: `104` tip `5662eaa` entregado; `105` 🔶 despachado; L03 tip `397a4c5` entregado. |
| ✎ 2026-08-02 | **LORE-HM ola 6 ✅ / LANE CERRADA**: `110`=`333ce4d` · `111`=`2c28e52` · L05=`0eca110` · **sin merge main**. |
| ✎ 2026-08-02 | **LORE-HM ola 5 ✅**: `108`=`4f6cafd` · `109`=`7d79a97` · **sin merge main**. |
| ✎ 2026-08-02 | **LORE-HM ola 4 ✅ / GHM CERRADO**: `106`=`afcfa92` · `107`=`ebafafa` · L04=`231bd3a` · **sin merge main**. |
| ✎ 2026-08-02 | **LORE-HM ola 4 GO**: `106` ✅ tip `afcfa92` · `107` 🔶 · L04 tip `231bd3a`. |
| ✎ 2026-08-02 | **LORE-HM ola 3 ✅**: `104`=`5662eaa` · `105`=`119711b` · L03=`397a4c5` · PASS_CON_ADDENDA · accum pre-GHM · **sin merge main**. |

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

**Gate `GHM`** = `WP-HUB-100`…`107` aceptados (**CERRADO** 2026-08-02 en ramas; sin merge main). Abre `108`–`111`.
**Dependencias externas**: tipos de Zeus `U245`–`U249` (ventana abierta desde
`GD`) · lengua y notaría `WP-SDK-L01`–`L05` en `s-sdk` · provider real de
Document Machine = **obra de E**, aquí sólo su puerto y la contingencia.

### WP-HUB-112 · hm-spike-viabilidad · ✅
> ✅ **RE-ACEPTADO POR EL SWARM Z·V 2026-08-02 — EN `main`**, merge `3c43613`, **CI LORE-HM verde en `2c37f42` (tip exacto) y en el commit de merge**. Rama empujada como `wp/zv-hub-112-spike-viabilidad`: la original quedó en su tip pre-rebase y avanzarla exigía `push --force`, **prohibido**. Relevo de carril, `GOBIERNO-LORE-HM.md §7`.
>
> **Cuatro vueltas Z·V.** Veredicto inicial de la contrarrevisión adversarial: **NO ENTRA** — y con una ironía que define la ficha: **su addenda dedicaba 25 líneas a diagnosticar que «un log que mide exit codes a través de un pipe no mide exit codes», y sus DOS medidas nuevas cayeron en eso mismo.**
>
> **NINGÚN HECHO DEL INFORME RESULTÓ FALSO** — el veredicto de lane, los cuatro anclajes, los cinco blobs, el `exit=127`, la conservación de los dos lados del conflicto y la confesión aguantaron todo. **Lo que fallaba era la frase que describe la obra**, y en dos casos **la evidencia que la refutaba ya estaba impresa por el propio trabajo**.
>
> **B1** · «limpio: sí (0 sucios)» era `wc -l` sobre el stdout vacío de una orden con **`rc=128`**: el **índice del submódulo está corrupto** (`bad signature 0x00000000`), y la tubería se comía el código. **Agravante: ese `0` era la coartada de una violación de frontera confesada.** *Un informe que exige evidencia literal no puede exculparse con una orden que falló.* Hoy: firma a cero medida con `od`, **control positivo** (los índices hermanos empiezan `44 49 52 43` = `DIRC`) y **control negativo** del `find` (`rc=1` + `No such file or directory`) — *ése era el instrumento que faltaba: antes un `0` podía ser «no hay» o «la orden murió»*. Y dice qué mide: **comprobación de sistema de ficheros, NO de git**.
>
> **B2** · «cero entrypoints» era `grep -c` sobre un flujo vacío (`ls-tree -r` con **`rc=1`**, pack degradado). Rehecho **subárbol por subárbol**: **2/15 completos · 7/15 sin dejarse recorrer · 5/15 parciales · 1 aborta** por objeto suelto corrupto; unión legible **49 rutas**. Y la frase que faltaba, en los dos documentos: **«no puedo afirmar que esos 7 estén vacíos, sólo que no se dejan leer»**. **El titular sobrevive sin esa pata.**
>
> **B3** · la Tabla A se autocertificaba («toda fila tiene orden exacta y salida literal») contra **su propia fila**, que llevaba veredicto libre y celda «sin orden que mida esto». Hoy: **13 filas, tríada estricta** (9 `no corre` · 3 `no existe` · 1 `corre`), la infractora en Tabla B **con su mitad medida intacta y cierta**.
>
> **EL TITULAR, ACOTADO**: de «la Future Machine NO corre» a **«la cadena B→C→P no es proceso autónomo invocable fuera de IDE, hoy»** — la lectura ancha la prohibía su propia contrarrevisión, que halló un proceso Python que sí corre. Whisper entra en la tabla con su medida y **apoya el titular**: tiene forma de proceso y hoy tampoco arranca.
>
> **LA CICATRIZ DE `:148`**: registraba `exit=0` para **los dos fallos en que descansa el veredicto**; la addenda corrigía otra línea. Cerrado **sin borrar nada** — las 258 originales byte a byte (sha256 idéntico), 394→763 puro anexo, verificado **por commit** (`258 0`, `136 0`, `369 0`: ningún paso intermedio borró y repuso).
>
> **Y una acusación contra su propio log, correcta AL BYTE**: la transcripción de una orden **no era verbatim** — salida real **18** líneas, el log muestra **10** — y las diez son byte a byte las que produce `| head -n 10`. *«La tubería elidida es la que fabricó el falso.»*
>
> **TRES ESCRITURAS DE FRONTERA, las tres declaradas en los dos documentos**: un `__pycache__` dentro de OASIS (detectado a los 11 s, limpieza **verificada con `find`**: cero `.pyc`, y los tres ficheros con su mtime de abril intacto) · el **log de depuración que `npm` escribe en cada invocación** — declaró que era inevitable y **NO lo es**: se redirige con `npm_config_logs_dir` (`npm/lib/npm.js:411`), **y las dos vías obvias son peores** — `--logs-max=0` **borraría los 11 logs del custodio** porque la limpieza corre igual, y `--no-audit --no-fund` no evita nada · y una **tercera** (`onfalo-asesor-sdk/.git`, lock efímero) hallada por el verificador y asumida con su límite: *el mtime prueba que hubo entrada y salida, no qué orden la hizo*. **De las tres sale la regla, ya escrita: `--no-optional-locks` en todo árbol ajeno, `npm_config_logs_dir` en toda invocación de `npm`.**
>
> **Y se corrigió el pecado que él mismo denunciaba**: su prueba del log estaba anclada a `HEAD`, que dejó de ser cierto **en cuanto commiteó** — *infalsificable por nombre*, en la sección que lo denuncia. Anclada a `eefe856`.
>
> **La distinción que cierra la Tabla A, formulada por él**: no es «medido vs. no medido», es **imposibilidad de clase vs. hipótesis sin comprobar** — un `.md` de corpus no es la clase de cosa que pueda correr; un skill de motor **podría tener runner y no se buscó**.
>
> ⚠ **PARA EL CUSTODIO, hallazgo que desborda la ficha y lo verificó el Anfitrión**: **14 de 24 índices** bajo `OASIS/.git/modules` tienen la firma a ceros. **Once están ENTEROS a cero** (0.0 % de bytes no nulos) y los otros tres por bloques de **8192 / 16384 / 655360** — **múltiplos exactos de 4096**: firma de **escritura diferida de NTFS que nunca llegó al disco**. **No es un suceso único**: los mtimes van de enero a julio, y hay dos escritos **en el mismo segundo** con distinta suerte. **No hay pérdida**: el índice es caché y se reconstruye desde `HEAD`. Lo que cuesta hoy: en esos 14 árboles `status`, `ls-files`, `check-ignore` y `ls-tree -r` **no responden**, y toda afirmación de limpieza sobre ellos es **inverificable**. No se tocó nada: OASIS es cantera RO.
>
> — acta anterior del swarm LORE-HM, conservada:
> Aceptado en rama `wp/hub-112-hm-spike-viabilidad` (commit `03a0511`) · verde
> **local** · contrarrevisión **PASS_CON_ADDENDA** · veredicto **NO CORRE**
> cadena B→C→P · reporte+addenda en esa rama bajo `playground/prueba-de-H-M/spike/`.
> **No merge a main** sin gate (`113`).
>
> **PRIMERA DE LA LANE.** Spike **aceptado** 2026-08-02 · veredicto **NO CORRE**
> (cadena B→C→P / procesos FM reales autónomos) · **verde local** ·
> contrarrevisión **PASS_CON_ADDENDA**
> (`playground/prueba-de-H-M/spike/CONTRARREVISION-WP-HUB-112.md`) ·
> addenda en `REPORTE-WP-HUB-112.md`. GO ola 0 sigue para `113`.
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
- **Estado:** ✅ aceptado · verde **local** · rama
  `wp/hub-112-hm-spike-viabilidad` · worktree
  `C:/S_LAB/wt/scriptorium-wp-hub-112` · impacto: `105`/`106`/`100` cambian a
  simulacro playground; ninguna de `100`–`111` cae · **no merge a main** sin
  gate/CI (`113`).

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

### WP-HUB-100 · hm-escenario-y-schemas ✅
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
- **Estado:** ✅ ola 1 · tip `ddb4d8b` · rama `wp/hub-100-hm-escenario-y-schemas` · PASS_CON_ADDENDA · **sin merge main** · verde local; CI tras push

### WP-HUB-101 · hm-ontologia-y-verbos ✅
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
- **Estado:** ✅ ola 1 · tip `35125f3` · rama `wp/hub-101-hm-ontologia-y-verbos` · PASS_CON_ADDENDA (AS2 falso corregido) · **sin merge main**

### WP-HUB-102 · hm-generador-idempotente ✅
- **BRIEF:** `scripts/generar.mjs` produce corridas regenerables en
  `.runs/<run-id>/H` y `.runs/<run-id>/M` (`--scenario`, `--run`,
  `--sin-install`, `--force-new`): env **sin defaults silenciosos**, handoffs
  vivos, room, manifest sellado y raíz de evidencia.
- **CA:** dos corridas seguidas = **no-op medido** · drift de manifest **o** de
  artefactos falla ruidoso y **no sobrescribe** (probado alterando los dos por
  separado) · reanuda **sólo** si el manifest coincide · cero rutas de máquina
  (`C:\Users\…`) en nada de lo generado, verificado con grep.
- **Pri:** P0 · dep: 100
- **Estado:** ✅ ola 2 · tip `186fc94` · rama `wp/hub-102-hm-generador-idempotente` · PASS_CON_ADDENDA · verde **local** · **sin merge main**

### WP-HUB-103 · hm-podstore-y-leases ✅
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
- **Estado:** ✅ ola 2 · tip `07f36ac` · rama `wp/hub-103-hm-podstore-y-leases` · PASS_CON_ADDENDA · verde **local** · **sin merge main**

### WP-HUB-104 · hm-onfalo-import-once ✅
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
- **Estado:** ✅ ola 3 · tip `5662eaa` · rama `wp/hub-104-hm-onfalo-import-once` · PASS_CON_ADDENDA · verde **local** · **sin merge main**

### WP-HUB-105 · hm-cadena-lore-determinista ✅
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
- **Estado:** ✅ ola 3 · tip `119711b` · rama `wp/hub-105-hm-cadena-lore-determinista` · PASS_CON_ADDENDA · verde **local** · **sin merge main**

### WP-HUB-106 · hm-ceremonia-bilateral ✅
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
- **Estado:** ✅ ola 4 · tip `afcfa92` · rama `wp/hub-106-hm-ceremonia-bilateral` · PASS_CON_ADDENDA · verde **local** · **sin merge main**

### WP-HUB-107 · hm-verificador-externo ✅
- **BRIEF:** `scripts/verificar-evidencia.mjs`: un tercero valida la corrida
  **sin consultar los directorios vivos de H ni de M**.
- **CA:** valida wire, expansión JSON-LD, hashes, ACL, transiciones,
  provenance, cobertura, reporte y shutdown · **cero autocertificación**: se le
  entrega sólo la raíz de evidencia y falla si le falta cualquier pieza · los
  negativos —hash roto, ACL expirada, transición ilegal, corto sin traza hasta
  el raw, VectorMock sin declarar— **fallan cada uno en su frontera y con su
  nombre**, no con un error genérico.
- **Pri:** P0 · dep: 106 · **cierra `GHM`**
- **Estado:** ✅ ola 4 · tip `ebafafa` · rama `wp/hub-107-hm-verificador-externo` · PASS_CON_ADDENDA · verde **local** · **cierra GHM** · **sin merge main**

### WP-HUB-108 · hm-mapa-holones-distritos ✅
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
- **Estado:** ✅ ola 5 · tip `4f6cafd` · rama `wp/hub-108-hm-mapa-holones-distritos` · PASS_CON_ADDENDA · verde **local** · **sin merge main**

### WP-HUB-109 · hm-lore-voz-despierta ✅
- **BRIEF:** tras la ceremonia, el distrito `lore-voz` queda **despierto** en
  el censo con actas por unidad. `novelist-editor` (distrito `runtime-mcp`)
  aporta elenco de personajes por identidad, **no** pipeline.
- **CA:** el estado del barrio cambia **por evidencia de corrida y no por
  edición a mano** — probado revirtiendo la evidencia y exigiendo que el
  estado vuelva solo · cada acta cita unidad, verbo y huella · identidad H/M
  con ≥2 personajes y su lease cada uno.
- **Pri:** P1 · dep: 108
- **Estado:** ✅ ola 5 · tip `7d79a97` · rama `wp/hub-109-hm-lore-voz-despierta` · PASS_CON_ADDENDA · verde **local** · **sin merge main**

### WP-HUB-110 · hm-negativos-y-consumidor-limpio ✅
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
- **Estado:** ✅ **ACEPTADO POR EL SWARM Z·V 2026-08-02 — EN `main`**, merge `0dbc3d0`, **CI LORE-HM verde en `7bad891` (tip exacto) y en el commit de merge**. Rama empujada como `wp/zv-hub-110-negativos-y-consumidor-limpio`: la original quedó en su tip pre-rebase y avanzarla exigía `push --force`, **prohibido**. Relevo de carril, `GOBIERNO-LORE-HM.md §7`.
  - **CINCO vueltas Z·V**, 2 contrarrevisiones adversariales + 3 verificaciones independientes. Veredicto inicial: **NO ENTRA — necesita REDISEÑO**. **Cero errores de lógica en las cinco**: todo fueron frases más anchas que la evidencia, y en tres ocasiones **la evidencia que las refutaba ya estaba impresa por el propio trabajo**.
  - **EL BLOQUEANTE ERA DE MANUAL: el canal de fallo del provocador ERA su canal de éxito.** `failNegativo()` lanzaba `NegativoError` con la frontera, y el arnés aceptaba **cualquier** `NegativoError` con frontera coincidente como PASS — así que los ~10 `failNegativo` internos, que significan **«el negativo NO probó nada»**, se reportaban como éxito. Demostrado: hicieron que el pod **materializara SIN LEASE** —rotura real de seguridad— y el test imprimió `PASS — negativo «pod sin lease»`. **Hoy son dos mecanismos distintos de control de flujo**: el rechazo del sistema se **DEVUELVE** (`Refusal`, que no es `Error`), el fallo del provocador se **LANZA**; *un `throw` no puede llegar donde el arnés espera un `return`*. **Reintentado el ataque exacto por el revisor**: `EL SISTEMA NO SE NEGÓ`, `exit=1`.
  - **El determinismo salió del reloj INYECTADO, no congelado.** La versión anterior **congelaba el reloj EN PRODUCCIÓN** (`issuedAt` literal), incompatible con `main`, que había ido a propósito en dirección contraria. Y al medir antes de tocar: **`issuedAt` aparecía 0 veces en todo el árbol de corrida** — *el reloj congelado ni siquiera hacía lo que decía*. Hoy `clock`/`leaseIdFactory` inyectables con defaults de producción intactos: **143/143 ficheros idénticos con CERO campos excluidos** (`TIME_FIELDS` borrado, que además ocultaba `leaseId`, **que no es un campo de tiempo**), y **control de falsabilidad verificado por las DOS mitades**.
  - **NUEVE desactivaciones, nueve rojas — y la salvedad honesta**: sólo **G3, G4, G7, G8** quedan **aislados limpios**; en los otros cinco *saltó OTRO guardián*, que es rojo y **parece verificación sin serlo**. El worker lo corrigió al alza cuando el revisor probó que G6 estaba mal clasificado — y corrigió también al orquestador: **eran nueve, no ocho**.
  - **TRES LECCIONES QUE VALEN MÁS ALLÁ DE LA FICHA**:
    1. **Node fija el binding de un named export de un builtin al instanciar el módulo**; parchear la propiedad del namespace **no llega**. Medía `named import -> interceptado:false` · `namespace prop -> true`. **Misma trampa que ya había pisado el motor en otro mundo** (el probe CA-5a de U205 con `fs`). Corolario escrito en la cabecera del instrumento, en general y no como anécdota: **la instrumentación no puede saber que está ciega; hay que cruzarla con una medida independiente.** Los parches de **prototipo** (`net.Socket.prototype.connect`) sí aguantan todo.
    2. **Mientras el instrumento sea una lista de nombres, el mutante que evade la lista existirá.** Pedidas 14 envolturas o 16 huecos declarados, eligió la tercera vía: *«no las 14: **la lista a mano**. Añadir 14 líneas habría dejado el mecanismo que las perdió intacto para la número 18.»* Superficie **enumerada en runtime**, y de camino descubrió que **`new dns.Resolver()` nunca fue estructural** — sus métodos viven en un prototipo: *«declaré irreparable algo que eran tres líneas»*. **64 bloquean y registran · 0 escapan** (verificado por barrido independiente que no usó su lista, incluido **UDP**), y el límite pasa de «dos huecos» a **uno**, el named import, que sí es estructural.
    3. **Un guardián con falsos positivos se desactiva solo.** Lo cazó en el filtro por fecha del barrido — **código muerto** (PowerShell emite `/Date(ms)/`, `new Date()` da `Invalid Date`, `NaN < x` es `false`) que **el informe citaba como cota**: medido, **14 de 244 procesos vivos de la máquina tenían el padre muerto y los 14 eran más viejos que el umbral** — la población entera de candidatos era justo la que debía excluir. **Y lo dejó vivo a diez líneas**, en el borrado sin reintentos. Su propia lectura: *«una defensa que no se ejecuta, una cifra que no se remide y una salida que no se recaptura son el mismo error con tres caras»*, y *«el criterio de esta casa —desactivar el guardián y ver que enrojece— lo apliqué a nueve guardianes de producción y no a los míos»*.
  - **EL LÍMITE, ESCRITO COMO SE ESCRIBE UN LÍMITE**: la CA «shutdown sin procesos huérfanos» **SE PUDO IMPRIMIR EN VERDE CON HUÉRFANOS VIVOS** — demostrado, no teórico: `exit=0`, suite verde, **tres procesos de SO vivos en el instante en que el arnés imprimía «0 vivos al cierre»**. *El cruce demuestra `partes ⊆ censo`; nunca lo contrario, y nunca el universo: el `7/7` se calcula sobre un denominador que el propio ciego elige.* Por eso se añadió el **barrido del SO**, que mira lo que hay en vez de lo que el arnés recuerda. **Sigue fuera y está dicho**: el **nieto de un invisible** (medido por el revisor, escapa) · sólo Windows — fuera imprime `NO CUBIERTO (límite de plataforma)` **y no calla** · y **dos de las seis vías visibles por namespace son incontables por construcción** (`execSync`/`execFileSync` no devuelven pid).
  - **El censo pasó de infalsificable a falsable.** Antes `residualProcesses` era la lista de unidades cuya transición lanzó — **nada podía quedar huérfano porque nada se lanzaba**. Hoy PIDs reales con cruce, **y con su mutación G9**: devolviendo el named import, `FAIL — censo incompleto: 3 de 7 procesos dejaron parte y NO están en el censo — existieron y nadie los contó`. Y eligió **arreglar en vez de rebajar la promesa**: *«retirar «y los de sus hijos» habría dejado el censo honesto y ciego — y la ceguera no era una limitación del entorno, era un llamador del kit que yo podía cambiar. Es exactamente cómo se acumula deuda que nadie vuelve a mirar.»*
  - **Un mecanismo medido que refuerza el arreglo final, mejor que el argumento que se le dio**: **Node reintenta el borrado de un FICHERO retenido, pero NO reintenta el `rmdir` de un directorio que otro proceso tiene como `cwd`** (medido: lock transitorio ajeno → borra tras 1049 ms con `maxRetries:5`; `cwd` del huérfano → `EBUSY` **tras 0 ms con `maxRetries:20`**). Los reintentos **sólo pueden quitar el falso positivo; no pueden tapar al huérfano**. Y la frase quedó acotada **en el propio mensaje de fallo**, no sólo en el informe: el `EBUSY` es *compatible* con un huérfano vivo, **no equivalente**.
  - **La guardia offline pasó de anotar a BLOQUEAR**, fail-closed (`null`, `0.0.0.0`, `::` son violación), y **viaja a los procesos hijo** vía `NODE_OPTIONS=--import`. Una sonda en banda demuestra que muerde **en cada corrida** — y esa sonda **cazó un falso positivo del propio worker**: `net.connect(opts)` llama a `Socket.prototype.connect` con un array normalizado, y estaba bloqueando loopback. Retirados el `npm ci` **en el árbol real del hub** y la aserción tipestate que se saltaba en silencio. Cardinalidad → **igualdad de conjuntos**.
  - **`REPORTE-WP-HUB-110.md` fue reescrito COMO RETRACTACIÓN** («este documento ya no es un reporte»), desmontando ocho afirmaciones una por una: *dejar en el árbol un reporte cuyas afirmaciones la auditoría desmontó no era una opción*. Verificado por el revisor: **no queda nada del original en pie, ni una frase suavizada**.
  - **El rebase**: 5 de 6 commits ya aplicados; el conflicto de `LocalPodProvider.mjs` resuelto **100 % al lado de `main`**, conservando sus cuatro defensas (caducidad de lease, ACL⊆permissions, autorización en `transition()`, denegación por lease caducado) y los seis `{actor}` de `steps.mjs` **byte-idéntico**. Segundo rebase sobre `3c43613` (con 111 y 112 dentro): **13 borrados, todos suyos por diseño, cero de 111 o 112**, y los cinco conflictos resueltos **conservando los dos lados**.
  - **Cuatro escrituras de frontera en el programa de hoy**, tres confesadas por sus autores y una levantada por el sistema (un verificador borró con comodín bajo el `%TEMP%` compartido, dentro de la basura del propio test, **destruyendo de paso un directorio que él mismo acababa de citar como corroboración**). Regla que sale: `--no-optional-locks` en todo árbol ajeno · `npm_config_logs_dir` en toda invocación de `npm` · **y si hay que corroborar contra el disco, la ruta se lee ANTES de limpiar, no después**.

### WP-HUB-111 · hm-escenarios-descubribles ✅
- **BRIEF:** el arnés descubre `scenarios/*/scenario.json` y corre sobre ellos
  una suite de conformidad común. **Sólo Barrio LORE entra en v1.**
- **CA:** un segundo escenario mínimo corre **sin tocar el arnés** · todo
  escenario declara barrio canónico, fixture, unidades, verbos, CA y cleanup ·
  el descubrimiento **no** promueve a v1 lo que no lo es, y un test lo fija.
- **Pri:** P2 · dep: 110
- **Estado:** ✅ **ACEPTADO POR EL SWARM Z·V 2026-08-02** — **EN `main`**, merge `30ba0d7`, **CI LORE-HM verde en `d922ec0` (tip exacto) Y en el commit de merge**. Rama empujada como `wp/zv-hub-111-escenarios-descubribles`: la original quedó en su tip pre-rebase y avanzarla exigía `push --force`, **prohibido**. Relevo de carril, `GOBIERNO-LORE-HM.md §7`.
  - **Tres vueltas Z·V** (rebase+condiciones → contrarrevisión adversarial → comprobación quirúrgica), **cero errores de lógica en las tres**: sólo frases más anchas que la evidencia.
  - **La CA decía «corre» y lo que había era «conforma»** — `ci/test-111-escenarios.mjs` no contenía ninguna llamada a `runCeremonia` ni spawn: sólo validaba JSON, y el propio `scenario.json` lo admitía. **El worker eligió EJECUTAR de verdad en vez de rebajar la frase**, con argumento: reescribir la CA sólo en el reporte del kit *«dejaría dos CA distintas para el mismo WP, peor que la mentira original porque la vuelve difícil de ver»*. Y no hubo que inventar runtime: `scripts/generar.mjs` **ya era genérico — había que llamarlo**. Hoy `lib/escenarios/ejecutar.mjs` hace spawn real: `exit=0`, **9/9 artefactos enumerados uno a uno**, sello `sha256`, rerun `no-op=true` **distinguible de «no hizo nada porque falló»**.
  - **Conformidad 12 → 15 chequeos, 4 de referencia y fail-closed**: `units` ⊆ catálogo, verbos ⊆ ontología, `shutdownVerbs` ⊆ ontología, fixture en disco. El vector de la auditoría (`units: ["no-existe"]`) **pasaba antes y hoy falla, medido**. Cinco degradaciones de referente (borrado, vacío, no parseable, ontología ausente, `hm:verbs: []`) → **nunca un skip, nunca un pase**.
  - **LO MEJOR DEL WP, y es del revisor**: el denominador **está verificado por los DOS lados** — declarar un chequeo sin implementarlo revienta (`15 veredictos para 16 declarados`) y emitir uno no declarado también. *«No es un 15 recitado.»*
  - **Los tres bloqueantes fueron de EVIDENCIA ESCRITA, no de obra**: (1) un **sello que no reproducía** — pegado de una corrida **anterior al arreglo que el propio reporte describe**; (2) el entregable declaraba la suite en **verde estando en rojo**, mientras el otro documento del mismo commit lo contaba bien; (3) se atribuía `ci/test-100-schemas.mjs`, cuyo blob es **idéntico a `main`**, y una desviación «11→≥11» que el árbol contradice. **Rehizo la auto-revisión entera**: *«una auto-revisión firmada sobre datos malos no vale como auto-revisión»*.
  - **DOS REGLAS QUE VALEN PARA TODO EL PROGRAMA**, y no se pedían: **(a)** *un sello no es reproducible sin su `runId` ni sin el commit de su `scenario.json`* — el `runId` entra en `sealPayload` **y además va dentro del contenido de los 10 artefactos cuyos hashes también se firman; **(b)** *un apéndice no es una corrección, es un descargo* — la salvedad va **donde está la afirmación**, no 190 líneas después; la regla de actas y documentos vivos rige también **dentro** de un documento.
  - **Dos menores cerrados en CÓDIGO, no en texto**: la guardia anti-cableado estaba puesta **en un solo lado** (vigilaba los ids no-v1 y no los v1) y una aserción nueva era **verde por construcción**. Hoy: barrido recursivo sobre el id desnudo, y cruce de `clavesLeidas` **contra un total que el test calcula él mismo** (27 = 14+13, no escrito a mano). Tres mutaciones nuevas, tres rojos — y una cierra un hueco que el revisor anotó sin exigir: **el negativo enrojecía por el motivo equivocado y pasaba igual**; hoy debe **nombrar su huérfano**.
  - **Deuda declarada con vector ejecutable** (no enterrada): el guardián **no caza el cableado por concatenación** (`"barrio" + "-lore"`); cerrarlo exige AST y *«ahí la escalada no termina»*. Retirado el adjetivo: **es un guardián contra el cableado por descuido, no contra el deliberado** — *«ponerle «infalible» a un `includes()` es la clase de frase que estas vueltas vienen a quitar»*. Y `fixture.existe` sigue siendo un `existsSync` pelado (`path: "."` cierra **15/15 en `ok=true`**): **anotado con su vector**, porque endurecerlo es **contrato del escenario, no corrección de evidencia**.
  - **El rojo local de `test-108-mapa` NO es de esta rama y está diagnosticado**: `core.autocrlf=true` con dos fixtures materializadas en CRLF pese a `-text`; git las declara limpias porque **el stat cacheado cuadra y nunca re-lee el contenido**. **Probado con `git archive`: un clon fresco pasa** — y el CI verde en `d922ec0` y en `30ba0d7` lo confirma en producción. Dos workers que no se conocían dieron la misma causa.

---

## Lane · HORIZONTE

### WP-HUB-114 · ci-ancla-viva · ✅
- **BRIEF:** el CI del hub leía el **registro de vocabulario canónico de L04** desde una **rama de trabajo** (`ci-lore-hm.yml` → `ref: wp/sdk-l05-sellado-de-network-engine`), y esa rama sale en `git branch --merged main` de `s-sdk`: **es podable**. Hallado por el Anfitrión del swarm Z·V el 2026-08-02 al auditar el reparto, no por una ficha.
- **Por qué importa, y falla en las DOS direcciones:** si alguien **poda la rama** —y el protocolo de este programa manda podar la rama fusionada; se podaron tres iguales esa misma tarde— **el CI del hub se cae**, y se cae *fail-closed*, o sea que **parecerá una rotura del producto y no una referencia muerta en un fichero de configuración**. Y al revés, que es peor: si el vocabulario cambia en `s-sdk/main`, **el CI sigue verde leyendo la foto congelada de la rama** — un verde que ya no dice lo que dice.
- **Estado medido al abrir:** el blob del registro **coincidía** en las dos referencias (`484647c…`), o sea que **no mentía todavía**; pero la rama iba **11 commits por detrás de `main`** y lo único que la mantenía viva era que nadie la había podado.
- **CA:** el `ref` apunta a una referencia **viva por contrato** · el CI sigue verde con el cambio · la poda de cualquier rama `wp/*` de `s-sdk` **no puede** tumbar el CI del hub.
- **Pri:** P1
- **Estado:** ✅ **ACEPTADO 2026-08-02** — `ref: wp/sdk-l05-sellado-de-network-engine` → **`ref: main`**. Verificado antes de tocar: `s-sdk/main` contiene el mismo blob del registro (`484647c…`) e incluye esa rama entera (merge `699856c`), así que **el cambio no altera qué vocabulario se valida, sólo deja de depender de una rama podable**. **Es el patrón del programa una vez más**: un guardián que prometía validar contra «el registro canónico» y leía **una instantánea atada a un tip**.

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