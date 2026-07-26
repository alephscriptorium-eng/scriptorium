# INFORME R3 · VOLUMES cerrado en mapa + relay + cerco — **sustituye a INFORME-R2**

| dato | valor |
| ---- | ----- |
| Emisor | **Anfitrión** · valida el custodio |
| Cadena | cita sello R2 `37c675a` · el sello R3 acompaña a este informe |
| Vigencia | R2 pasa a [cita inerte]; sus asientos siguen (política peercard §2.a · REFACTOR · watchers parados · compactar-y-reemplazar) |
| Al terminar de procesarlo | **GATE POST-R3 obligatorio** (§5) |

## 1 · Resuelto esta ronda (no re-preguntar)

| qué | resolución |
| --- | ---------- |
| **O↔V** | **ZANJADO** por el custodio — el acoplamiento no existía en código; V libre en su REFACTOR; única interfaz futura = fichero env demo (O-c↔O-d, nace nueva) |
| **Relay/payload** (obra Z, verificado con cita) | contenido: **no puede** tocarlo · sobre: sí · paso: **allowlist de 8 sin traza** + `MAKE_MASTER` suprimido. El modelo de O **se sostiene**; quedan 2 avisos: corte silencioso (riesgo #1 de O realizado → CA punto 5) y **colapso de identidad** en el bridge (`scriptorium-bridge` único + secreto compartido) → `Z-D7`, material del hilo peercard |
| **VOLUMES en el lab** | doble verificación independiente (Z contrato+host · Temis rutas): **cero datos reales montados**; fixtures 8 KB + 11 KB; DISK_01/04 diferidos por diseño |
| **Fuente histórica** | **existe y está censada** (envase, no contenido): `OASIS/SCRIPTORIUM_V0/zeus-sdk/VOLUMES` — FIREHOSE 38 MB/8.388 ficheros · LINEAS 16,8 MB/2.060 (demo+**espana**) · FORCES ~1,3 MB/12 corpus — y `network-engine/linea-aleph` ~48 MB/677 registros. Genealogía: Python → U80 → U81 → herramientas actuales |
| **Root VPS** | **existe** (confirmado por el custodio): volumen de datos separado del disco de sistema · ⏳ ruta y contrato operativo |
| **Sello del skill** | ⚠️ drift de envase detectado (Temis): el contrato dice `synthetic-fixtures-only` pero el árbol histórico conserva corpus; `registry.yaml` **stale** (solo `demo`); drift de ruta en reportes de sync. Antes de importar: el registry se trata como incompleto |

## 2 · Asientos nuevos del custodio (GO)

a) **CERCO EXTERIOR** (`PROTOCOLO §10.8`): los world_roots no cargan
   enlaces/recursos externos. Las fuentes de fuera se **importan una vez** y
   todo queda cercado en `C:\S` + `C:\S_LAB`. URLs externas = solo metadato
   inerte de procedencia. Vale también para el diseño: nada de anclas vivas
   (git/rad/IPFS) como dependencia de arranque.
b) **Dirección VOLUMES elevada** (aún sin decidir la ruta): son del mesh y
   los comparten todos los juegos — se porta **una vez** la genealogía a un
   `ZEUS_VOLUMES_ROOT` del Scriptorium: fuente readonly → import validado →
   root local común anclado desde playground → mismo **contrato** (no path)
   en el VPS.

## 3 · Abierto — decisiones en curso (nadie se adelanta)

| ◆ | qué | quién |
| - | --- | ----- |
| Canal de packs (`Z-D6`) — **reencuadrado por auditoría: A/B era un falso dilema.** npm y Release son **targets complementarios de una misma fuente**: kit FOSS por registry (piezas `@zeus/startpack-*` componibles) + pack Release (artefacto autocontenido que se importa **una vez** al root cercado; cada Release declara versión+hash de sus piezas). Evidencia: los 6 packs ya traen `publishConfig`; `notario-release.mjs` ya soporta `--publish-npm` + `--publish-github` en una pipeline. **Queda decidir la FRONTERA de `volumes/`: C1** (fixtures ligeras en npm + pack completo en Release, ★ discutir primero) **vs C2** (mismo tarball en ambos). Nada se publica hasta que un CA pruebe ambos caminos desde canal limpio; el README de Z se corrige tras la frontera | **G + Z + custodio** (G mide tarballs y propone frontera FOSS; Z define `loadStartPack`/contrato de import; O = consumidor, no decide canal) |
| ¿El ancla **sustituye** al volumen o lo **alimenta**? (git/rad/IPFS; el contrato de montaje asume lo segundo; el firehose es flujo — decidir unidad de anclaje antes de tocar transporte) | pregunta de Z | **O** + custodio |
| Ruta y contrato del volumen VPS · ruta del root local (3 candidatas) | custodio + mesa |
| Import real | `U176` es **pieza reutilizable, no el porte total** (cubre obra→línea/story-board/reparto; no linea-aleph/FIREHOSE/FORCES) — el porte one-off es `Z-D8`, el anclaje `Z-D9`; censo de compatibilidad de adaptadores por asignar | custodio |
| Invariante ya aplicable | ningún volumen aloja identidad; secreto va por env, nunca en el árbol (GATE-O-CLAVES en plano de datos) | todos |

## 4 · Para Z — correcciones de auditoría a tu matriz R6 (retick)

Tu matriz es buena de contratos; **no está cerrada como matriz de
migración**. Correcciones (curadas, fuente = este informe): ① FIREHOSE:
sustituir `[cita inerte] 38 MB` por el censo real (38 MB · 8.388 · 167 dirs,
con ruta) ② LINEAS: separar `DISK_02` (2.060 f · 16,8 MB · demo+espana ·
registry stale) de `linea-aleph` (578 f · ~48 MB · 677 registros, fuera de
VOLUMES) ③ FORCES: censo verificado ~1,3 MB · 12 corpus · 68 escenas · 185
capas ④ registrar el drift de ruta/procedencia ⑤ rebajar «U176 = herramienta
exacta» a pieza parcial ⑥ root VPS: existencia ✅, ruta ⏳ ⑦ incorporar la
dirección del root local único (gitignored + fuera del contexto Docker).
Separar por familia: **fuente física · adaptador probado · destino de
montaje** (matriz mínima de 5 familias disponible en el hub si la pides).
⑧ **Z-D6 se reformula** (§3): no hay dilema A/B — tu parte pasa a ser
definir qué necesita `loadStartPack` y el contrato de import del pack
Release al root común; la frontera C1/C2 se decide con G y el custodio.

## 5 · ⛔ GATE POST-R3 — al terminar de procesar este informe, cada carril

1. **Asienta su bitácora de estación** (manual — watchers siguen parados):
   qué hizo en R2–R6, apuntando a la sala, sin duplicarla.
2. **Compacta su `sincronia/`** (§3): notas superadas → [cita inerte] o
   archivo; BUZON apunta solo a lo vigente; DRAFT sustituido, no acumulado.
3. **Push a tu rama de `CUADERNOS`** (bitácora + sincronia compactada).
   Responde con el hash. El hub lo empuja el Anfitrión; **Temis no empuja**
   (META es desechable por diseño).

Sin los 6 hashes no hay ronda siguiente: es la red de seguridad del custodio.

— **Anfitrión**
