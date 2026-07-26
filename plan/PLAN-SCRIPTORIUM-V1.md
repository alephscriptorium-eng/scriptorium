# PLAN SCRIPTORIUM v1 — la vista de conjunto

| dato | valor |
| ---- | ----- |
| Emisor | **Anfitrión** · edición F2-unificada · 2026-07-26 |
| Qué es | el mapa único de los 6 planes tras el sprint CIUDAD — una página |
| Fuente | 6 backlogs F2-unificados + COMPACTO H-01 sellado + integración de auditoría |
| Estado | **⬜ todo propuesto** — la ratificación del custodio (aprueba/descarta por WP) es el único paso entre esto y el primer despacho |

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
| **Z** `z-sdk` | runtime · contratos · adaptador/resolvers/drivers · catálogo 51 | 66 | 22 |
| **O** `o-sdk` | nodo · storage/compose · pub L1 · soberanía (forja/imágenes) | 74 | 16 |
| **V** `v-sdk` | Zigurat/IDE · editor de config · observación de dominio | 71 | 13 |
| **G** `g-sdk` | juegos · loader/notario de packs · dominio Ciudad · player MCP | 54 | 16 |
| **L** `skills-library` | método publicado: mesa · auditor · cerco · adaptador-como-método | 73 | 19 |
| **HUB** `scriptorium` | playground · grafo · gobierno multi-mundo · integración/E2E | 52 | 18 |
| **Σ** | | **390** | **104** |

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

## Las decisiones que solo el custodio puede tomar (antes del despacho)

| # | decisión | desbloquea |
| - | -------- | ---------- |
| 1 | **Ratificación F2**: aprueba/descarta por WP (o por lane) en los 6 planes | todo despacho (HUB-005) |
| 2 | **Licencia**: SPDX real por mundo (una acta, 5 WPs) | F0 · releases honestos |
| 3 | **Nombres/semver primeras versiones** (O08 · V86 · primeras releases) | F4 |
| 4 | **Ruta del root local** + **ruta/contrato del volumen VPS** | U209 · HUB-010 · O91 |
| 5 | **Orden de despacho**: por fases (★ recomendado) o cherry-pick por mundo | el arranque |

## Cómo se ejecuta sin repetir esta sesión

Cada mundo despacha su swarm con su gobierno de ejecución (O07 · U232 ·
V77/78 · G01 · L-H06 · HUB-001) — la mesa solo se reconvoca para **junturas
nuevas**, no para rutina. La sala queda de protocolo; el método va camino
de skill (lanes L); la cadena de sellos en CUADERNOS es la memoria durable.
Restauración de cualquier ventana: último sello + procedimiento del
informe vigente.

— **Anfitrión**
