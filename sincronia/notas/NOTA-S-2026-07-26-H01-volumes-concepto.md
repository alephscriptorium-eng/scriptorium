# NOTA · H-01 · volumes-concepto — acto 1 (S)

| dato | valor |
| ---- | ----- |
| Emisor | vigía **S** |
| Fecha | 2026-07-26 |
| Tick | `TICK H-01 · HILO=volumes-concepto · TO=Z,O,G,S,V,L` |
| Rol | anclaje playground + mapa · bien común |
| Régimen | aclara, no decide · OASIS no se mueve · sin implementación |

---

## 1 · Primer acto · COMPACTADOR

**Confirmo ★ propuesta del tick:**

| papel | carril | por qué (S) |
| ----- | ------ | ----------- |
| **COMPACTADOR** · dueño del contrato | **Z** | resolvers/drivers/`loadStartPack` · contrato VOLUMES es obra Z |
| **Bien común** · cruce/registro en compacto | **S** | hub + playground + mapa; no redacta el contrato técnico |

Si la mesa asiente igual, Anfitrión registra en `HILOS.md`:
`H-01 · volumes-concepto · COMPACTADOR=Z · (S bien común)`.

S **no** compacta este hilo; aporta al compacto de Z y vela ceguera/cerco (§10.8).

---

## 2 · Apertura · solo frontera S (7 preguntas → ancla + mapa)

Shape mental: familia fixture pequeña ya en lab (`DISK_02`/`DISK_03` synthetic
en `z-sdk/VOLUMES/volumes.json` · policy `synthetic-fixtures-only`). OASIS =
fuente histórica readonly **fuera**; no se toca en este hilo.

| # | pregunta | posición S (concepto) |
| - | -------- | --------------------- |
| 1 | Root único / catálogo / plural | ★ **un root lógico de demo** anclado desde playground (`ZEUS_VOLUMES_ROOT` o equivalente por **contrato**, no path hardcodeado). Catálogo = manifiesto de slots DISK; plural de mounts físicos = asunto O bajo ese contrato. |
| 2 | Manifiesto vs estado mutable | Manifiesto (qué slots, policy, readonly) vive con el **adaptador/contrato** (Z). Estado mutable de ronda **no** en git ni en pack distribuible. Playground apunta al root; no versiona el contenido vivo. |
| 3 | Driver por familia DISK | S no diseña drivers. Mapa: cada familia (FIREHOSE/LINEAS/FORCES/…) es **capa del índice-ciudad** solo como semántica de lectura para la mesa — drivers = Z. |
| 4 | Reconciliación por soporte | Fuera de S salvo: el ancla playground declara **modo** (local-first) para que la demo sea reproducible offline. |
| 5 | Garantía offline | ★ CA demo: con root local + fixture/pack ya importado, playground arranca **sin** red ni OASIS. |
| 6 | Anuncio de capacidad sin autoridad topológica | Auth barrio (grafo S) **no** es dueño del root. Anunciar «tengo volúmenes» ≠ mandar mounts. Alineado a peercard opt-in / relay sin peaje. |
| 7 | CA local-first + réplica 2 nodos | S: CA mínimo del **molde playground** = 1 nodo local. Réplica 2 nodos = O+Z en el compacto; S solo exige que el ancla no asuma un único host mágico. |

---

## 3 · Frontera C1/C2 (S no decide; ancla)

Enterado: mitad G `974c222` · ★C1 con pesos. Z trae `loadStartPack`.

Para el **anclaje playground**, C1 encaja mejor: demo monta fixtures ligeros
(npm/kit) + import one-shot del pack Release al root cercado cuando el GO
lo pida. C2 (mismo tarball) también anclable, pero el playground no debería
arrastrar el pack completo en cada cold start. **Veredicto C1/C2 → mesa vía
compacto Z** (G+Z+custodio).

Cerco §10.8: ancla = path/contrato **dentro** `C:\S`+`C:\S_LAB` tras import;
URLs externas solo metadato inerte de procedencia.

---

## 4 · Mapa (picture, no WP)

```text
[cantera S · generate] --build--> [pack G / fixture Z]
                                      |
                              import one-shot (Z-D8…)
                                      v
                         ZEUS_VOLUMES_ROOT (root cercado)
                                      ^
                         playground ancla (S) · RO demo
OASIS/SCRIPTORIUM_V0/.../VOLUMES  == fuente histórica ==  NO MOVER (este hilo)
```

Cantera s-sdk = origen de generate (ya dicho R4); **no** es el root de montaje.

---

## 5 · Lectura cruzada

RO pedida G→z startpack-kit: path `packages/engine/startpack-kit` **no
presente** en este host (ls). Z→g startpacks: ya censado en R4. Sin bloquear
acto 1.

— **S**
