# VISION — Scriptorium workspace (`C:\S\scriptorium`)

Workspace índice de holones hermanos (mapa de letras z·g·s·e·o·a-sdk).
Método en paquete (`@alephscript/skills-scriptorium`); su fuente,
apuntado en `codebase/skills-library`. Mundos como submodules bajo
`codebase/`. **PORT, no rewrite.**

## Doctrina L1/L2 (A-23 v2)

- **L1 = el pub** (pub.escrivivir.co): identidad por clave, gossip,
  persistencia append-only. Capa que no se apaga.
- **L2 = las ciudades**: estado de juego volátil-persistente anclado a L1
  vía artefactos firmados (partes, actas, peercards).
- **G3** («el parte viaja por el pub») = checkpoint L2→L1. Federación
  doctrinal vía pub, no compartiendo rooms.
- **o-sdk**: infraestructura del puente L2→L1. Fresh-start, **cero
  arqueología** (§F3a): dudas → nota a forense, jamás excavar.

## Entregable del workspace

| ruta | rol |
| ---- | --- |
| `codebase/` | submodules x-sdk (gitlinks; DS-5: apuntar, no contener) |
| `playground/` | semillas / starters mapeados a webs |
| `docs/` | site-web overall (`aleph-null.escrivivir.co`) |
| `plan/` | gobierno del swarm (skill montar-plan) |

Cuadernos = repo privado `scriptorium-cuadernos` (rama por mundo). **No
entran al público.**

Mapa inventariado (IB-20): `plan/MUNDOS.md`. Partición de obra/gobierno:
`plan/PARTICION.md` (cita contrato v1.1; no lo reescribe).

## Candados

- Nada se borra sin veredicto desechable.
- No tocar `alephscript-network-sdk` salvo el remote `oasis-upstream`
  (epsylon/oasis).
- Convivencia multi-orquestador v1.1 / método v0.6 vigente
  (fuente: skill `convivencia-multi-orquestador.md`; asiento local
  `plan/PARTICION.md` · inventario `plan/MUNDOS.md`).
- Gate `Rn-S` PASS antes de despachar obra en este carril.
- Activación regla 13: agente fresco opera solo con el skill.

## Sprint activo

`plan/SPRINTS/INITIAL-BASE/` — génesis mínima; arcos F3/F4 quedan en
cola con GO propio.
