# PARTICION — territorios del carril S (IB-20)

Protocolo multi-orquestador **asentado por cita** (PORT, no rewrite).

## Fuente del contrato

Contrato **v1.1** / metodo **v0.6**:

`.claude/skills/swarm-orquestacion/reference/convivencia-multi-orquestador.md`

(espejo de `@alephscript/skills-scriptorium`; fuente unica del cuerpo —
roles y este fichero **enlazan**, no re-declaran §§1–9).

Decision local: **DA-S06** (`plan/DECISIONES.md`) — carril **S**, rondas
`Rn-S`. Sucesion de vigia: **DA-S07** + `plan/ESTACION.md`.

## Particion declarada (obra IB-20 y regla estable)

| territorio | dueno / escritor | modo en IB-20 |
| ---------- | ---------------- | ------------- |
| `plan/` del workspace `scriptorium` | orquestador/worker **carril S** | **escritura** (tabla mundos, esta particion, enlaces PORT, reportes del sprint) |
| `plan/SPRINTS/INITIAL-BASE/REPORTES/` | worker del WP bajo brief S | **escritura** (reporte IB-20) |
| punteros cuadernos (rama por mundo) | declaracion en `plan/MUNDOS.md` | **escritura** solo del puntero; historico vive en `scriptorium-cuadernos` (privado) |
| `codebase/{z,g,s,e,o,a}-sdk` | carril dueno de cada hermano (§1 / §4 convivencia) | **SOLO LECTURA** en IB-20 |
| gitlinks `codebase/*-sdk` | gobierno S con GO de bump | **cero bump** en IB-20 |
| raiz compartida (skills, registry) | consumo OK (§6); escritura encolada | lectura / `npm view` OK; sin bump masivo |

### ALCANCE_DIFF canonico (IB-20)

```text
ESCRITURA:
  plan/**  (workspace scriptorium; no BACKLOG estados del orquestador)
  plan/SPRINTS/INITIAL-BASE/REPORTES/IB-20-*.md

SOLO LECTURA:
  codebase/{z,g,s,e,o,a}-sdk/**
  gitlinks (mode 160000) — no modificar
```

## §§ aplicables (cita, no copia del cuerpo)

Del skill `convivencia-multi-orquestador.md`:

- **§1** Particion de obra — un orquestador por territorio; worker S no
  escribe en hermano.
- **§2** Particion de gobierno — un escritor por prefijo `plan/` (carril S).
- **§3** Vigia unico — gates `Rn-S`; sin PASS no hay despacho (Vigilante-S /
  DA-S07).
- **§4** Territorio hermano exclusivo — checkout/`wp/*` en sdk = dueno.
- **§5** REPORTES bajo el sprint del carril.
- **§6** Consumo de raiz OK; escritura encolada.
- **§8** Higiene pre-despacho antes de despachar.

## Vetos locales (PRACTICAS + mandato)

- No borrar sin veredicto desechable.
- `alephscript-network-sdk`: solo remote epsylon (`oasis-upstream`).
- o-sdk / F3a: cero arqueologia; hallazgo → nota-a-forense / WP dueno.
- PORT, NO REWRITE.
- Worker: no edita BACKLOG; no merge a main.

## Inventario de mundos

Ver `plan/MUNDOS.md` (skill pin/resuelta + estado plan/ + destino
cuadernos).
