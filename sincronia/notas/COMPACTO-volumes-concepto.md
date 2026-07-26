# COMPACTO · H-01 · `volumes-concepto` · **ED2**

| dato | valor |
| ---- | ----- |
| Emisor | **S** (compacta · fórmula C-1) |
| Fecha | 2026-07-26 |
| Tick | `H-01-S-ED2` · HILO=`volumes-concepto` |
| Edición | **2** · integra Z verifica · L notaría · contraste Temis (handoff) |
| Fuentes H-01 | 6 notas: Z · O · G · S · V · L |
| Circuito | ED2 → **Temis** (tick fidelidad, si llega) → **mesa** decide → **S** valida |
| Régimen | aclara; **no decide** · OASIS no se mueve · sin implementación |

---

## Checklist de no-pérdida

### Fórmula C-1 (roles) — preservada · ownership preciso

| papel | carril | ownership |
| ----- | ------ | --------- |
| Compacta | **S** | bien común / registro; no redacta contrato técnico |
| Verifica técnico | **Z** | contrato de **import** · resolvers de root · drivers · validación |
| Loader / notario packs | **G** | `loadStartPack` · `notario-release` (viven en **g-sdk**) |
| Notaría | **L** | forma; no fondo |
| Audita pre-merge | **Temis** | fidelidad · tick aparte |

### Hechos curados (no son convergencia ni decisión)

| hecho | detalle |
| ----- | ------- |
| Lab limpio | cero corpus reales montados; fixtures sintéticas |
| OASIS censado (envase) | FIREHOSE 38 MB/8388 · LINEAS 16,8 MB/2060 (demo+espana) · FORCES ~1,3 MB/12 · linea-aleph ~48 MB **fuera** de VOLUMES · SSB sin copia histórica |
| Genealogía | network-engine (Python) → VOLUMES histórico → U80 → U81 → adaptadores actuales |
| Drifts | `synthetic-fixtures-only` vs corpus histórico · registry LINEAS stale (solo demo) · FORCES declara 2 / censo 12 · rutas reportadas vs `SCRIPTORIUM_V0` · U176 = pieza parcial, no porte total |
| Medición G | 6 startpacks ~32 kB tgz; `volumes/` ~50 kB — valida pipeline hoy; **no** escala C2 al primer corpus >1 MB |
| Código hoy | `loadStartPack` → `volumesRoot` **dentro del pack**; no lee env; no valida VOLUMES · `counters.mjs` muta `volumes.json` · **no hay** hash de corpus en `volumes-ops` |

### 6 convergencias fuertes (dirección compartida en notas; no ratifican código)

| # | convergencia |
| - | ------------ |
| 1 | **Un namespace/catálogo lógico y un contrato de lectura.** Puede resolver uno o varios mounts físicos; la topología queda abierta. *(dirección — hoy el loader induce root rival dentro del pack)* |
| 2 | **Manifiesto ≠ estado mutable ≠ corpora con permisos** — separación exigida |
| 3 | **Offline / local-first:** arranque sin red; fallar en **import**, no en boot |
| 4 | **Capacidad = inventario verificable** (hash/medición), no autoridad topológica |
| 5 | **Drivers por familia DISK** — cuatro actuales: **LINEAS · FORCES · FIREHOSE · SSB** |
| 6 | **OASIS no se mueve** este hilo; histórico = port/import validado al contrato actual |

*Fuera de convergencias (eran fugas de forma L F1/F2 + warning Temis):* C1 preferente → solo **★ C-4**; shape pozo+FORCES → solo **★ C-5**; «familia desconocida = error» → ★ técnica Z.

### Tres momentos complementarios (no dilema npm vs Release)

```text
1. INSTALAR CAPACIDAD → kit FOSS por npm
2. SEMBRAR DATOS       → pack autocontenido Release / import-once
3. SINCRONIZAR         → P2P por driver tras montaje  (⏳ C-6)
```

★ **C-4 propone** que npm y Release compartan fuente/notario y declaren
versiones+hashes coherentes; **hoy es condición de diseño, no CA ejecutado.**
Release ≠ réplica; réplica ≠ pack inicial; arranque no depende de
registry/Release/peer.

### Modelo del adaptador (capacidades; sin fijar API)

descubrimiento · resolución id→path (sin depender de repo/cwd) · permisos RO/RW/cache/curación · envase (quién sella / quién mide) · identidad versión+hash+provenance · import staging→validar→fusionar→sellar→reimport no-op · réplica por driver · reconciliación sin pisar curación · anuncio de soporte sin autoridad · secretos solo en env.

### 10 tensiones EXPLÍCITAS

| # | tensión |
| - | ------- |
| T1 | LECTURA tick invertida: `startpack-kit` + `notario-release` en **g-sdk**, no z-sdk |
| T2 / T12 | `loadStartPack` + README inducen `node_modules/…/volumes` como root vivo; no validan |
| T3 / T13 | Dos shapes de `volumes.json` (root ⊃ pack); import debe normalizar; `counters` muta manifiesto |
| T4 / T11 | Namespace lógico + mounts plurales: varios `volumes.json` ancestrales → resolver ascendente (`linea-kit/validate`) toma el **más cercano** (depende de cwd) |
| T5 | ¿Ancla sustituye o alimenta el volumen? |
| T6 | FIREHOSE (stream/cursor) vs shape FORCES/pozo |
| T7 | LECTURA §8 caduca al cerrar hilo — CA post-COMPACTO puede necesitar RO renovada |
| T8 | Cache/curación humana mutable ∈ plano VOLUMES, aunque estado de juego viva en rooms/authority |
| T9 | Falta evidencia para que un **tercero** verifique réplica sin consultar A/B |
| T10 | Copia A→B = snapshot/integridad; **no** prueba sync P2P continua |

### Cerco v2 (formulación completa)

| clase | regla |
| ----- | ----- |
| Código/estructura deprecated | portar/importar; no consumir vivo |
| Provenance histórica | metadato **inerte** |
| Storage montado actual | puede vivir en disco **separado** del runtime (VPS ya; Docker: gitignore + fuera de contexto imagen) |
| Peer/relay del contrato | endpoint vivo **permitido** para sync **explícita** |
| Arranque | lee estado local; funciona sin red |

Histórico = port/import validado al contrato actual; destino = almacenamiento local montado (posiblemente externo al runtime). La red no es requisito para leer lo local.

Precisión Z: `cache_wikitext` = materialización remota **explícita** válida; **no** dependencia de arranque.

### ★ Candidatas C-2 … C-5 (mesa; con costes)

| id | candidata | coste / condición |
| -- | --------- | ----------------- |
| **C-2** | Namespace lógico + mounts plurales | ◆ elegir: **un solo** `volumes.json` en cadena de ancestros, **o** env/`ZEUS_VOLUMES_ROOT` obligatorio |
| **C-3** | Manifiesto RO+hash · estado regenerable aparte · corpora con permisos | WP Z: `counters.mjs` deja de mutar `volumes.json`; import **pobla `corpora`** (packs no traen forma completa; `firehose-core` deriva stats) |
| **C-4** | **C1 preferente** — npm kit ligero + Release import-once, misma fuente/hashes | sellado versión+hash = **trabajo nuevo** (hoy no hay hash de corpus); unir a una WP, no duplicar |
| **C-5** | Shape `startpack-pozo` + **DISK_03/FORCES** | apoyo fuerte; G también propuso ciudad/delta — **no** convergencia cerrada |

**C-6** · segundo acto P2P (descubrimiento · anuncio verificable · pull/push/cursor · divergencia · reconciliación incremental · local si peers caen · evidencia por tercero · cero autoridad por barrio/VPS) → **⏳**, no decisión.

Estrategias por familia (**candidatas**, no interfaz hecha): LINEAS RO=hash · LINEAS curada=solo faltantes (nunca pisar registro/delta humano) · FORCES=snapshot/hash · FIREHOSE=cursor/clave · SSB=append-only por feed · blobs=CID+chunks · packs=snapshot sellado idempotente.

---

## ◆ Decisiones que se piden a la mesa

1. **¿Asienta la fórmula C-1** (S compacta · Z verifica · L notaría · Temis audita; G = loader/notario packs)?
2. Candidatas — **cuatro ◆ independientes** (aceptar, devolver o matizar
   cada una; sin bloque todo-o-nada). **C-6 queda para segundo acto (⏳) en
   todos los casos:**
   - **2a.** ¿Adopta **C-2** · namespace lógico + mounts plurales?
   - **2b.** ¿Adopta **C-3** · manifiesto/estado/corpora separados, con
     coste WP Z (`counters.mjs`)?
   - **2c.** ¿Adopta **C-4** · C1 preferente, pendiente CA de canal limpio?
   - **2d.** ¿Adopta **C-5** · pozo/FORCES como shape de concepto?
3. **¿Corrige LECTURA** del hilo/CA para que G lea en Z: `presets-sdk/volumes`, `linea-kit/validate`, `volumes-ops/counters`, `VOLUMES/volumes.json`?
4. **Cierre real del defecto loader/README** (arreglar doc **no basta**). ¿Elige?
   - **(a)** loader deja de ofrecer `volumesRoot` como root consumible de ronda (marca interno del pack) — cambio G; o
   - **(b)** contrato de import = único camino de producto; `volumesRoot` del loader = solo desarrollo — doc Z+G, cero código.
5. **C-2 · mounts plurales:** ¿un solo `volumes.json` ancestral, o resolución explícita/`ZEUS_VOLUMES_ROOT` obligatoria?
6. **¿El CA local-first** (import · offline · reimport no-op · manifest/state/corpus · snapshot A→B · corrupción falla · cero secretos/symlinks) queda en este hilo o abre tick post-COMPACTO con LECTURA renovada?

---

## ★ Recomendaciones (síntesis; no veredicto)

1. Packs = **semilla de import**; el adaptador local es el único **contrato de lectura** del runtime (puede resolver varios mounts; opera sin red).
2. Separar físico: manifiesto RO hasheable · estado/contadores regenerables · curación humana **nunca** pisada por import.
3. Reconciliar por **hash/manifiesto** (dirección; **hoy no existe** en `volumes-ops`) y por **familia/soporte**, nunca mtime/tamaño ni merge global.
4. Capacidad = alcance/inventario; verificación fuera de los nodos cuando haya réplica.
5. Playground ancla el **contrato/root lógico**; no versiona contenido vivo.
6. Post-import: root lleva **versión+hash por pieza** (ambos caminos C1; C2 si existiera).
7. Identidad/secretos: **cero** en VOLUMES (GATE-O-CLAVES en plano datos).
8. **Familia desconocida = error** (postura técnica Z; no convergencia 6/6).
9. CA C-5 prueba snapshot/integridad A→B; **no** sustituye especificación C-6.

---

## ⏳ Abiertos

| id | abierto | dueño tentativo |
| -- | ------- | --------------- |
| C-6 | Segundo acto P2P / réplica continua | mesa · tick nuevo |
| T5 | Ancla sustituye vs alimenta | O + contrato import Z |
| T6 | Representación FIREHOSE en local | O+Z |
| T7 | RO post-compacto para CA | custodio / tick |
| T9 | Evidencia verificación externa de réplica | V + mesa |
| — | Ruta root local + VPS (contrato común, paths distintos) | custodio + mesa |
| — | Import one-off histórico (Z-D8/D9); U176 parcial | Z + custodio |
| — | `registry.yaml` LINEAS stale | Z (al importar) |
| — | Permiso LECTURA invertido → PROTOCOLO/hilo | Anfitrión |

---

## Mapa de fuentes (apunta)

| carril | nota |
| ------ | ---- |
| Z | `C:/S_LAB/z-sdk/sincronia/notas/NOTA-Z-2026-07-26-H01-volumes-concepto.md` |
| Z verif. | `C:/S_LAB/z-sdk/sincronia/notas/NOTA-Z-2026-07-26-H01-verifica-compacto.md` |
| O | `C:/S_LAB/o-sdk/sincronia/notas/NOTA-O-2026-07-26-H01-volumes-concepto.md` |
| G | `C:/S_LAB/g-sdk/sincronia/notas/NOTA-G-2026-07-26-H01-volumes-concepto.md` |
| S | `C:/S/scriptorium/sincronia/notas/NOTA-S-2026-07-26-H01-volumes-concepto.md` |
| V | `C:/S_LAB/v-sdk/sincronia/notas/NOTA-V-2026-07-26-H01-volumes-concepto.md` |
| L | `C:/S_LAB/skills-library/sincronia/notas/NOTA-L-2026-07-26-H01-compactador.md` |
| L notaría | `C:/S_LAB/skills-library/sincronia/notas/NOTA-L-2026-07-26-H01-notaria.md` |

---

**Estado:** `ED2=✅ · MICROFORMA=✅` (2 ajustes de Temis aplicados por el
**Anfitrión** con tick del custodio — invariante npm/Release marcado ★C-4
propuesta · decisión 2 desagregada en 2a–2d; fondo ED2 intacto) ·
Z ✎ integradas · L F1/F2 resueltas · T8–T14 integradas/plegadas ·
`DECISIONES_NUEVAS=0` · **LISTO PARA MESA**.

— **S** *(microforma ejecutada por Anfitrión, orden del custodio)*
