# PLAN SCRIPTORIUM v1 — la vista de conjunto

| dato | valor |
| ---- | ----- |
| Emisor | **Anfitrión** · edición F2-unificada · 2026-07-26 |
| Qué es | el mapa único de los 6 planes tras el sprint CIUDAD — una página |
| Fuente | 6 backlogs F2-unificados + COMPACTO H-01 sellado + integración de auditoría |
| Estado | **▶ en ejecución por olas** (swarm orquestado por Anfitrión desde 2026-07-31) — ratificación ① progresiva: GO explícito del custodio por ola (ola 0 dada); decisiones ②–⑤ tomadas |

## Qué estamos construyendo

**Scriptorium**: un motor FOSS de juegos de ventana de contexto (ARG),
local-first y federado sin autoridad topológica, operable desde un IDE de
centro vacío, con datos por contrato y método publicado como skills.
**Seis mundos, un producto** — la prueba de acabado es una sola:

> **El test del operador externo (10 pasos)** — `plan/BACKLOG-F2.md` §DoD:
> instala → siembra → arranca → ve honesto → juega/crea → intent+7 marcas →
> reinicia offline → verifica → backup/restore → apaga limpio. Sin hablar
> con los autores. Nada se autocertifica.

## Los seis mundos y su ownership (contratos de frontera)

| mundo | posee | WPs | P0 |
| ----- | ----- | --- | -- |
| **Z** `z-sdk` | runtime · contratos · adaptador/resolvers/drivers · catálogo 51 | 67 | 22 |
| **O** `o-sdk` | nodo · storage/compose · pub L1 · soberanía (forja/imágenes) | 75 | 16 |
| **V** `v-sdk` | Zigurat/IDE · editor de config · observación de dominio | 71 | 13 |
| **G** `g-sdk` | juegos · loader/notario de packs · dominio Ciudad · player MCP | 54 | 16 |
| **L** `skills-library` | método publicado: mesa · auditor · cerco · adaptador-como-método | 73 | 19 |
| **HUB** `scriptorium` | playground · grafo · gobierno multi-mundo · integración/E2E | 52 | 18 |
| **Σ** | | **392** | **104** |

Regla de oro (de la sesión, ya cableada en los 6): **ningún plan escribe
obra ajena** — todo cruce es dependencia externa con owner, estado y
contrato de retorno.

## La secuencia (fases del hub — `BACKLOG-F2.md` §FASES)

```text
F0 GOBIERNO+FOSS → F1 CONTRATOS BASE → F2 RUNTIME MÍNIMO
   → F3 HOLÓN-7 · CIUDAD → F4 PRODUCTIZACIÓN → F5 ACEPTACIÓN v1
```

Síntesis que ahorran trabajo, ya integradas:

- **Una acta de licencia** cubre 5 WPs de 5 mundos (L-F08·U237·O08·G74·HUB-060).
- **G13 + U212** = las dos mitades de un mismo CA de canal limpio (un tick).
- **U186 lleva dentro** la pregunta estrecha de O (paso 0) — un refactor, no dos debates.
- **U234 (orquestador)** lo consumen V34 y O22 — nadie reimplementa arranque.
- **U233 (gate 51/51)** es el denominador de U179–U185 y de HUB-003/063.
- Los CAs votados (canal limpio ◆2c · local-first ◆6) son **ticks nuevos**, no obra dispersa.

## Las decisiones del custodio (estado 2026-07-31)

| # | decisión | estado |
| - | -------- | ------ |
| 1 | **Ratificación F2** | **▶ progresiva** — GO explícito por ola de swarm (ola 0 dada el 2026-07-31) |
| 2 | **Licencia** | ✅ **AIPLv1 = composite GPL-3.0-or-later + Animus Iocandi** · tratamiento idéntico en todos los paquetes · ejecutar el acta única (L-F08·U237·O08·G74·HUB-060) |
| 3 | **Nombres/semver** | ✅ corte con el histórico: scope viejo `alephscriptorium/aleph-scriptorium` muerto · identidad Scriptorium (github + registry npm nuevos · v-sdk.escrivivir.co) · contadores reiniciados · Release v0.1.0 antigua desconectada y deprecada · Marketplace **DEFERRED** (spike market propio → O96) |
| 4 | **Rutas/VPS** | ✅ VPS **al final** — réplica local validada (U206) primero; la subida será desde imágenes (dockerhub); U209→P2 DEFERRED · horizonte PODs/Solid·RDF (U243, insumo graphdb/holones) |
| 5 | **Orden de despacho** | ✅ por olas de swarm: **Z+V → G+L → O al final** |
| 7 | **Namespace de configuración de V** | ⏸ **APLAZADO** (2026-07-31): se decide **junto con la identidad pública del nuevo scope** (decisión ③), no antes — cambiar el namespace dos veces es peor que cambiarlo tarde, y hoy costaría 19 claves que habría que volver a mover. **V23 cierra con `aleph0` tal cual**; ningún worker lo reabre. Nació de que la contrarrevisión viera que la cita de DV-16.a elide «dentro de WP-V15» y que `aleph0` no tiene fila en el léxico mientras `Zigurat` sí. Asentada en `v-sdk/plan/DECISIONES.md` como **DV-17** |
| 6 | **Intake externo `WPS_QUEUE`** | ⏸ **ENCOLADO al final** (2026-07-31, al descongelar): cantera de la ventana S en `C:\S_LAB\s-sdk\WPS_QUEUE` — cola A (programa holónico LORE-HM) + cola B (campaña de tipos públicos TS de 4 paquetes de Z, `ZT01–ZT05`) + 7 investigaciones. **Anclada en `s-sdk` y acotada**, no promovida: ficha, cerco y tarea de triaje **T-S01** en `WPS_QUEUE/ENCOLADO.md`; puntero en Z como `U244` (P2 DEFERRED). Se abre **después de O**, con GO. Toca preguntas aún sin decidir: ampliar el reparto de mundos (`e-sdk`, `a-sdk`, Network-Engine) y el solape con el spike U243 |

## Cómo se ejecuta sin repetir esta sesión

Cada mundo despacha su swarm con su gobierno de ejecución (O07 · U232 ·
V77/78 · G01 · L-H06 · HUB-001) — la mesa solo se reconvoca para **junturas
nuevas**, no para rutina. La sala queda de protocolo; el método va camino
de skill (lanes L); la cadena de sellos en CUADERNOS es la memoria durable.
Restauración de cualquier ventana: último sello + procedimiento del
informe vigente.

— **Anfitrión**
