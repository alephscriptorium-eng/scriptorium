# AVISO · Vigilante-S · gate R21-S · pre 🔶 LIB-080 (release 0.8.0)

**Carril:** S  
**Ronda pedida:** `R21-S`  
**Emisor:** orquestador S (GO VIGILANTE-S + CUSTODIO · post-cierre mundos · 2026-07-23 · sin subagente vigía)  
**Receptor:** **Vigilante-S** (estación viva `C:\S\vigilancia`) vía **custodio**  
**Fecha:** 2026-07-23  
**Estado gate:** ⬜ pendiente veredicto

> Gate **propio** de activación **LIB-080** (bundle issues **#18+#19** ·
> release **0.8.0**). Cadena cumplida: cierre arco mundos @ tip base
> `e436d5a` + asiento `plan/MAPA-REPO.md`. **Sin PASS R21-S no hay 🔶
> LIB-080.** No se despacha worker de obra. No publish. No tag.

## Cableado (contrato · sucesión de vigía · DA-S07)

- El vigía del carril S **es** la ventana Vigilante-S en `C:\S\vigilancia`.
- **No** es un subagente vigía del orquestador. **No** generar ni invocar
  subagentes con rol de vigía.
- Gates `Rn-S`: se piden por **AVISO** y el veredicto lo emite
  **Vigilante-S vía custodio**. **Sin PASS R21-S no hay 🔶 LIB-080.**

## Pedido

Informe dual PO/scrum de ronda **R21-S** con veredicto PASS | FAIL |
PASS-con-residual sobre:

1. **Higiene §8** en `C:\S\scriptorium` (worktrees / `wp/*` / locks /
   tip = origin/main / gitlinks 7/7 · **sin bump** atlas salvo GO).
2. **BRIEF LIB-080** actualizado: alcance = issue **#18** + issue
   **#19** · plantilla release **0.8.0** · estado ⬜ PRE-🔶 ·
   `BRIEFS/LIB-080.md`.
3. **Checkout declarado** `C:\S_LAB\skills-library` existe · tip base
   `fb980984e5faa979247afa43054e52cfd4e07c3e` (0.7.0) · path exacto.
4. **#18** en brief: `piel:` · `familia-vp` DEFAULT · `fanzine` opt-in ·
   CA «piel declarada renderiza» · CA contraste · fix composición VP.
5. **#19** en brief: montar-plan genera MAPA-RAIZ/REPO(/TALLER) con
   regla al pie · vigilancia prescribe pulso territorio==mapa.
6. **Release 0.8.0** plantilla: secrets PRE-tag · ceguera 0 ·
   triangulación (tag · npm · CI · gitHead).
7. **Caso fundante mapas:** `plan/MAPA-REPO.md` asentado en índice
   (trilogía con RAIZ-C-S · S-LAB) — referencia, no obra de librería.
8. **Partición:** obra futura solo en `C:\S_LAB\skills-library` ·
   portal/docs = WP-REST-SHELL (otro gate) · no mezclar.
9. Autorización táctica para **🔶 LIB-080**. **Sin PASS R21-S no hay
   🔶 ni worker de obra ni publish.**

## Checklist higiene (§8) — pulso Vigilante-S R21-S

```text
[ ] worktrees en territorio explicados
[ ] ramas wp/* justificadas o ausentes post-cierre
[ ] git status del plan/ del carril explicado
[ ] Rn-S = R21-S PASS | FAIL | PASS-con-residual — lo declara Vigilante-S
[ ] index.lock / HEAD.lock ausentes o explicados
[ ] gitlinks 160000 ×7 (skills-library = fb98098 · sin bump sin GO)
[ ] raíz C:\S == plan/RAIZ-C-S.md (atlas puro)
[ ] C:\S_LAB\skills-library existe · tip = fb98098 · path = brief
[ ] plan/MAPA-REPO.md presente (caso fundante #19)
[ ] BRIEF LIB-080 #18+#19 · ⬜ PRE-🔶 · cero obra librería aún
[ ] WP-REST-SHELL no confundido con este gate (∥ OK · territorios)
```

## Vetos / doctrina a cruzar en el gate

- **Sin PASS R21-S → sin 🔶 LIB-080**
- No subagente vigía
- No publish / no tag / no force
- No obra en portal `docs/**` bajo este WP
- No bump gitlinks atlas sin GO (DA-S11 · citar GO literal en bumps)
- Ceguera ≠ 0 = FAIL
- Paquete: `@alephscript/skills-scriptorium` (nombre completo)
- network-sdk solo epsylon · o-sdk §F3a · PORT NO REWRITE
- Tag `release/numero-0` intacto (otro territorio)

## Entrega del Vigilante-S (vía custodio)

1. Informe **cara PO** — p.ej. `INFORME-VIGIA-R21-S.md`
2. Informe **cara scrum** (accionable para orquestador carril S)
3. Etiqueta `R21-S` + veredicto
4. Orquestador **solo entonces** puede marcar 🔶 LIB-080
5. Vigilante-S **no** despacha workers
6. Orquestador **no** lanza subagente vigía

## Contexto tip (orquestador · evidencia activación)

| dato | valor |
| ---- | ----- |
| tip cierre mundos (base GO) | `e436d5ad64d6ab50875c66a7e959e27070042dc4` |
| tip MAPA-REPO asentado (POST-push) | `30367e885f654b5bcf66af918aedba9602c5e91c` |
| tip lib / gitlink (0.7.0) | `fb980984e5faa979247afa43054e52cfd4e07c3e` |
| issues | #18 · #19 |
| semver candidato | `0.8.0` |
| checkout obra | `C:\S_LAB\skills-library` |
| paquete | `@alephscript/skills-scriptorium` |

## Bloqueo explícito

```text
PASS R21-S = único desbloqueo de 🔶 LIB-080
FAIL / sin informe = 🔶 prohibido · brief queda ⬜ PRE-🔶
```
