# AVISO · Vigilante-S · gate R7-S · post IB-21 ∥ IB-22 · pre IB-23

**Carril:** S  
**Ronda pedida:** `R7-S`  
**Emisor:** orquestador S (pedido de gate)  
**Receptor:** **Vigilante-S** (estación viva `C:\S\vigilancia`, watcher activo) vía **custodio**  
**Fecha:** 2026-07-22  
**Estado gate:** ✅ **PASS** — ver `INFORME-VIGIA-R7-S.md`

## Cableado (contrato · sucesión de vigía)

- El vigía del carril S **es** la ventana Vigilante-S en `C:\S\vigilancia`.
- **No** es un subagente vigía del orquestador. **No** generar ni invocar
  subagentes con rol de vigía.
- Gates `Rn-S`: se piden por **AVISO** en este directorio y los **emite
  Vigilante-S vía custodio**. Sin su **PASS** no hay 🔶 del siguiente lote.

## Pedido

Tras **aceptación y merge del lote IB-21 ∥ IB-22** en `main`, el
orquestador pide informe dual PO/scrum de ronda **R7-S** con veredicto
PASS | FAIL | PASS-con-residual sobre:

1. **Estado post-lote** en `C:\S\scriptorium` + higiene §8 (worktrees /
   ramas `wp/*` / locks / tip = origin/main).
2. **CA de facto IB-21** sin reescribir alcance:
   - pulso secrets PRE-tag documentado (`NPM_USERNAME` / `NPM_PASSWORD`)
   - ceguera = 0 PRE-publish (skill `holarquia`)
   - publish `0.6.0` + C8 `npm view` canal real
   - tip skills-library `6512e27dd11c4d84192d4a66035ede609ba97523` ·
     tag `v0.6.0` · Publish CI `29947333933`
   - reporte `REPORTES/IB-21-skill-holarquia.md`
3. **CA de facto IB-22** (vía handoff DA-S08):
   - nota `plan/HANDOFF-IB-22-cascaron-joyas.md` emitida
   - `plan/REGISTRO-DE-JOYAS.md` + partida de nacimiento preparada
   - **cero writes** en `codebase/e-sdk` / fuera del workspace
   - cero borrados sin veredicto desechable
   - reporte `REPORTES/IB-22-archivo-joyas-handoff.md`
4. Autorización táctica para **IB-23** (o bloqueos). **Sin PASS R7-S
   no hay 🔶 IB-23.**

## Checklist higiene (§8) — pulso Vigilante-S R7-S

```text
[ ] worktrees en territorio explicados (ideal: solo root tras higiene)
[ ] ramas wp/* justificadas o ausentes (wp/ib-21 · wp/ib-22 mergeadas → borrar)
[ ] git status del plan/ del carril explicado
[ ] Rn-S = R7-S PASS | FAIL | PASS-con-residual — lo declara Vigilante-S
[ ] index.lock / HEAD.lock ausentes o explicados (freeze §9 si sostenido)
```

## Vetos / doctrina a cruzar en el gate

- Cero borrados sin veredicto desechable
- No tocar `alephscript-network-sdk` salvo remote epsylon
- §F3a o-sdk: cero arqueología
- PORT NO REWRITE · DS-5 · convivencia v1.1
- **Sin PASS R7-S no hay 🔶 IB-23**
- DNS: aleph-null OK; redirect diferido — no fingir verde / no trabajar
- No abrir IB-23 en este aviso (solo pedido de gate)

## Entrega del Vigilante-S (vía custodio)

1. Informe **cara PO** (custodio) — p.ej. `INFORME-VIGIA-R7-S.md`
2. Informe **cara scrum** (accionable para orquestador carril S)
3. Etiqueta `R7-S` + veredicto
4. Orquestador **solo entonces** puede 🔶 IB-23
5. Vigilante-S **no** despacha workers ni abre IB-23
6. Orquestador **no** lanza subagente vigía

## Contexto tip (PRE-aviso; orquestador rellena POST-push)

| dato | valor |
| ---- | ----- |
| 🔶 IB-21 ∥ IB-22 | `d6a7faf9ed4bf621adb9a26bd088b8d40432c601` |
| accept IB-21 | `c17415c71db85607909f4b9d8d1f1ca2cc9cb62c` |
| merge IB-21 | `8c7a641265dac1122d3bc40f2b2bd760e7684346` |
| accept IB-22 | `dadf53d0080a68be603bd648cd7e7f58e814c56b` |
| merge IB-22 | `fef7574656568e6b558eda699b587dc2c6b980a7` |
| skills-library tip / tag | `6512e27dd11c4d84192d4a66035ede609ba97523` / `v0.6.0` |
| tip main PRE-push aviso | `fef7574656568e6b558eda699b587dc2c6b980a7` — tip tras push de este aviso = HEAD real POST-push |

## Prueba de ceguera (cara hacia swarm)

Este aviso vive en el plan del mundo (idioma del workspace). Informe
dual: ceguera cara scrum = 0 (detalle en el informe del Vigilante-S).
