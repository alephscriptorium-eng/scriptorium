# BACKLOG — índice del workspace

Estados: ⬜ pendiente · 🔶 en curso · ✅ aceptado.

Sprint activo: **PRUEBA-DE-DOS** (re-plan custodio 2026-07-23 · dual
PO/scrum). LIBRERIA-0.7.0 **cerrado** · R24-S · consumo 0.8.0.
PORTAL-NUMERO-0 **cerrado** · R15-S · tag `release/numero-0`.
INITIAL-BASE **cerrado** · R8-S.

Proyección a issues: **local-only** por defecto (DC-15). Sin petición
explícita del usuario, no se proyecta.

## Sprints

| sprint | estado | ruta |
| ------ | ------ | ---- |
| INITIAL-BASE | ✅ cerrado · 9 WPs · R8-S | `plan/SPRINTS/INITIAL-BASE/` |
| PORTAL-NUMERO-0 | ✅ cerrado · N0-01…04 ✅ · tag `release/numero-0` · R15-S · WP-XS banner ✅ | `plan/SPRINTS/PORTAL-NUMERO-0/` |
| LIBRERIA-0.7.0 | ✅ cerrado · LIB-070…LIB-080 · consumo 0.8.0 · R24-S | `plan/SPRINTS/LIBRERIA-0.7.0/` |
| PRUEBA-DE-DOS | 🔶 en curso · PD-01/PD-02 ✅ (R25-S PASS) · PD-03 🔶 | `plan/SPRINTS/PRUEBA-DE-DOS/` |

## Cola (fuera de despacho — GO / encadenamiento)

- **LIB-070 / 0.7.0** — ✅ publicado · checkout
  `C:\S_LAB\skills-library` · R17-S **PASS** · GO B desencadenado.
- **SKILLS-EN-MUNDOS** — GO B · **OLA 0 + olas 1+ hechas** (z·g·s·e·a)
  · R19-S PASS-con-obs · o-sdk EXCLUIDO (F3) · **gitlinks z·g·s·e·a
  bumpeados** (GO custodio · DA-S19 + DA-S11) · poda worktrees SEM ✅.
- **LIB-080 / 0.8.0** — ✅ publicado · tip lib `cc59e4e` · R23-S
  **PASS** · ola consumo workspace+z·g·s·e·a ✅ · **AVISO R24-S**
  cierre arco.
- **Gitlink** `codebase/skills-library` → `cc59e4e` (0.8.0) ·
  bumpeado (GO R23-S PASS · DA-S11).
- **Política espejo** · DA-S19: z = canon gitignore · g/s/e/a =
  trackeado (desviación auditable) · PORT · no unificar.
- Aparcados (cero acción): F3 · F4 · redirect · para-la-voz ·
  pasada-2 OASIS · limpieza mundo legado · IOCANDI.
- **Carril Z desaparcado** (2026-07-23 · custodio) — dos frentes:
  ts-compat (`@zeus/*` consumibles desde TypeScript) + extracción
  mcp-core-sdk (paquete nuevo propio que corta la dep cruzada). Handoff
  en `plan/SPRINTS/PRUEBA-DE-DOS/HANDOFF-CARRIL-Z-arranque.md` · gates
  `Rn-Z` en su carril.
- ✅ **Carril Z · tercer frente: dramaturgo + Zigurat opt-in** —
  **COMPLETADO** (2026-07-26 · nota de vuelta del carril con tip
  `ab7343c`: U172–U177 ✅ · épica U73 cerrada-por-diseño · gates
  R16–R20 · DA-S21 `2eb4784`). Origen: (GO
  custodio 2026-07-24 · ventana vigilante-S · Camino A
  "absorber-concepto y archivar" ratificado, veredicto sprint-game-city).
  Dos mandatos: absorción del dominio narrativo legado (5 trozos
  propuestos: proyector de mutaciones a tools MCP · kit de reparto ·
  story-board con personajes · autoría gateada · migración de corpus) +
  desbloqueo del horizonte WP-U73 (acople IDE opt-in, invariantes
  L1/L2). Handoff en
  `plan/SPRINTS/PRUEBA-DE-DOS/HANDOFF-CARRIL-Z-dramaturgo-zigurat.md` ·
  el custodio lo lleva al carril · numeración y plan en
  `C:\S_LAB\z-sdk\plan` · gates `Rn-Z`. Asiento DA-S2x a discreción del
  orquestador de base. Fronteras: archivo del repo legado + DAS-1 → a-sdk
  · extensión VS Code → a-sdk · sidecar/pub → o-sdk.
- Skill `vigilancia` — **modo de lenguaje dual** encolado a Apolo
  (apertura del sprint PRUEBA-DE-DOS) + valoración merge/deslinde con
  `estacion-viva` **cerrada: NO merge (DA-S20)**.
- Lecciones vNext (dentro del alcance 0.7.0): sucesión vigía · checkout
  declarado ×3 · worktree por rol · raíz por constelación.
- ⬜ **GO al parser** (DA-S17 · 2026-07-23) —
  `@alephscript/skills-scriptorium` / `skills-library`: flexibilizar
  parser de proyección + fallar ruidoso ante IDs mixtos. **No**
  normalizar IDs S a `WP-<alnum>`. Solo encolado (cierra triaje DC-25
  del paquete; no reabre LOCAL-ONLY DC-15). **Sin implementación en
  este tip.**
- ⬜ **Mini-tick portal** `piel: familia-vp` (post-0.8.0 · GO propio;
  no forzado en el GO de consumo).
- ⬜ **Skill `operador-rooms`** (spike PD-02 · PRUEBA-DE-DOS): skill
  para el operador-admin del nodo rooms (emisión de peercard, ACL,
  salud del nodo). **GO custodio (DA-S20 · obra en librería, ventana
  Apolo)**; fuente inicial
  `playground/prueba-de-dos/reference/PEERCARD.md`.
- ⬜ **Wishlist skills · revisión/semver/idle** — **TICK custodio +
  GO de planificación R12-Z (2026-07-24)**; intake y handoff en
  `plan/WISHLIST-SKILLS-REVISION-R12-Z.md`. **Sin GO de implementación
  de scriptorium** por este asiento.

Ver también `plan/REGISTRO-DE-JOYAS.md`.
- ⬜ **Carril V fundado: Zigurat → .vsix** (GO custodio 2026-07-26 ·
  DV-00 · vigilante-S funda con plan mascado). Backlog WP-V01..V11 en
  6 olas + DECISIONES DV-01..10 con propuesta + estación calibrada en
  `C:\S_LAB\v-sdk\plan\` (semilla pre-repo). Handoff en
  `plan/SPRINTS/PRUEBA-DE-DOS/HANDOFF-CARRIL-V-arranque-zigurat.md` ·
  el custodio lo lleva a la ventana nueva del Lab V · gates `Rn-V`.
- ⬜ **TICK · validación .vsix Zigurat por vigía-S** — se dispara con
  el aviso de R5-V PASS del carril V («lista para probar»: v1
  instalable + guía ≤10 pasos). El custodio reactiva la ventana
  vigilante-S para la validación final contra el contrato IDE v1
  (cláusula viva de motivos_deny incluida). Hasta entonces: en espera.
