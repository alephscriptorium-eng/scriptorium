# PARTICIÓN — obra y gobierno (carril S)

Asentado por IB-20. **Fuente de método:** skill
`@alephscript/skills-scriptorium` →
`swarm-orquestacion/reference/convivencia-multi-orquestador.md`
(**contrato v1.1 / método v0.6**). Este fichero **cita y calibra** el
contrato al workspace; no lo reescribe.

## Carril

| dato | valor |
| ---- | ----- |
| Carril | **S** |
| Mundo / checkout | `C:\S\scriptorium` |
| Gobierno | `plan/` de este repo (único escritor de gobierno del carril S) |
| Vigía | **Vigilante-S** · estación `C:\S\vigilancia` · vía custodio (DA-S07) |
| Gates | `Rn-S` por AVISO en `plan/SPRINTS/INITIAL-BASE/` · sin PASS no hay 🔶 |

## Partición de obra (§1 skill)

| territorio | dueño | escritura |
| ---------- | ----- | --------- |
| `plan/` del workspace | orquestador / workers del carril S | **sí** (gobierno + reportes del sprint) |
| `docs/`, raíz workspace (scripts, etc.) | carril S con BRIEF explícito | solo si el BRIEF lo declara |
| `codebase/{z,g,s,e,o,a}-sdk` | carril dueño de cada sdk / GO propio | **no** desde IB-20 ni desde briefs de reunificación: **SOLO LECTURA** |
| gitlinks bajo `codebase/*` | bump solo con WP que lo autorice | IB-20: **cero bump** |
| `scriptorium-cuadernos` (privado) | custodio / volcados por rama-mundo | punteros desde plan público; no volcar crudo aquí |

Hallazgo dentro de un sdk → **nota-a-forense** o **WP nuevo** del carril
dueño. Prohibido excavar (§F3a · nests a-sdk = forense).

## Partición de gobierno (§2 skill)

- Un escritor por prefijo `plan/` del carril S.
- V2 atómico: commit de ✅ ≠ commit de brief/🔶 de otro WP.
- REPORTES/BRIEFS bajo `plan/SPRINTS/<sprint>/` del carril (§5).

## Consumo de raíz y hermanos (§4 · §6 · §7)

- Lectura de skills / registry / docs de método: OK.
- Escritura en territorio hermano: solo el dueño.
- E2E entre territorios: registry limpio · fixture scratch · vía
  post-gate — **no** checkout raíz ajeno como dependencia.

## Higiene pre-despacho (§8) + locks (§9)

Antes de 🔶 / BRIEF / worker:

```text
[ ] worktrees explicados (sin huérfanos injustificados)
[ ] ramas wp/* justificadas o ausentes
[ ] git status del plan/ del carril explicado
[ ] Rn-S en PASS (Vigilante-S vía custodio)
[ ] index.lock / HEAD.lock ausentes (freeze mutuo si sostenido)
```

## Mapa operativo

- Inventario de mundos + skill + cuadernos: `plan/MUNDOS.md`
- Calibración estación: `plan/ESTACION.md`
- Candados doctrina: `plan/VISION.md` · `plan/PRACTICAS.md` · `plan/DECISIONES.md`
