# Sprint · PRUEBA-DE-DOS

Re-plan del custodio (2026-07-23, sesión dual PO/scrum). Territorio:
`playground/prueba-de-dos/` (entra a git como **boilerplate / starter
kit**). Estados: ⬜ pendiente · 🔶 en curso/entregado · ✅ aceptado.

## Redefinición (mandato custodio)

La inicialización manual de `H/` con el stack `@zeus` constó por buena
(cableado). **Pero no se trata de juntar cuatro cables**: la prueba se
redefine como **validar la experiencia** — dos ventanas-operador
(H = A · M = B) en la misma room, con identidad resuelta y registro en
los dos `handoff.md`. La prueba pasa a ser: **inicializar el skill** en
`prueba-de-dos` y recrear todo desde él.

## WPs

| WP | qué | estado |
| -- | --- | ------ |
| PD-01 | Skill/boilerplate `prueba-de-dos`: SKILL.md + `manual.md` + dos handoffs plantilla + `npm run generate A_B` (crea `H/` (A) y `M/` (B) npm-inicializadas con su stack) + entra a git | ✅ aceptado · R25-S PASS |
| PD-02 | **Spike peercard**: submanual `reference/PEERCARD.md` (tres vías: card vigente / emisión por operador-admin del nodo rooms / anónimo) + instrucciones de emisión para el admin | ✅ aceptado (spike) · R25-S PASS · GO skill operador-rooms cerrado aparte (DA-S20) |
| PD-03 | **Corrida de la experiencia**: dos operadores reales siguen sus handoffs, room compartida, CA §5 del manual con evidencia literal; asentar en los handoffs las invocaciones exactas hoy `<pendiente>` | ⬜ |

## Evidencia PD-01 (smoke de esta sesión)

- `npm run generate A_B -- --sin-install` → completó `M/` y los
  `handoff.md` vacíos sin pisar `H/` existente (idempotente).
- `npm run generate A_B` → `npm install` VERDE en H (up to date, 292
  paquetes auditados) y M (291 añadidos, 292 auditados).
- **Hallazgo corregido en el kit:** `@zeus/socket-server` arrastra
  `@alephscript/mcp-core-sdk` del registry privado → el `.npmrc` del
  kit necesita **ambos** scopes (`@zeus` + `@alephscript`). H solo
  instalaba por el pin del lockfile.

## Gate

Aceptación PD-01/PD-02 + fila nueva de MAPA-REPO: pedida por
`AVISO-VIGIA-R25-S.md` (Vigilante-S vía custodio · DA-S07). PD-03 no se
despacha sin ese PASS.

R25-S emitido **PASS** (`INFORME-VIGIA-R25-S.md`).

## Ventanas y notas

- **Apolo** (carril librería, `C:\S_LAB\skills-library`) →
  `APERTURA-APOLO.md`.
- **Dionisios** (vigía del carril S, sucesión DA-S07) →
  `APERTURA-DIONISIOS.md`.
- Nota al carril Z (dueño de `@zeus/socket-server`, aparcado) →
  `NOTA-CARRIL-Z-npmrc-scopes.md`.
- **Handoff de arranque del carril Z** (desaparcado 2026-07-23 por el
  custodio: ts-compat + extracción mcp-core-sdk) →
  `HANDOFF-CARRIL-Z-arranque.md`.
- Apolo: entradas nuevas **d** (modo de lenguaje dual al skill
  `vigilancia`) y **e** (valoración merge/deslinde `vigilancia` ↔
  `estacion-viva`) en `APERTURA-APOLO.md`.
