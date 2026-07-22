# DECISIONES

## Cerradas

### DA-S01 · Mapa de letras (A-23 v2 · PO turno-2)

z-sdk · g-sdk · s-sdk · e-sdk · o-sdk · a-sdk. Repo workspace
`scriptorium`. Docker Hub `scriptorium-city` (arco futuro).

### DA-S02 · Dominios (A-23 v2 · PO turno-2)

- `scriptorium.escrivivir.co` → redirect a `https://pub.escrivivir.co/`
  (L1; tick DNS custodio).
- Site-web del workspace: **`aleph-null.escrivivir.co`**.

### DA-S03 · e-sdk (A-23 v2 · propuesta vigía endorsada)

Reconducir a «mundo de papel» — NO deprecated. Recibe dossiers 02/03;
código solo con GO del arco para-la-voz.

### DA-S04 · o-sdk (§F3a)

Fresh-start desde remoto. Cortar alephscript-network-sdk del workspace.
Único ligamen: remote epsylon/oasis. Cero arqueología.

### DA-S05 · PRINCIPIO PORT

INITIAL-BASE = PORT del backlog-semilla. No rewrite.

### DA-S06 · Convivencia

Contrato multi-orquestador v1.1 vigente si coexisten otros orquestadores.
Carril de este mundo: **S** (rondas `Rn-S`). Asiento PORT (IB-20):
`plan/PARTICION.md` cita
`.claude/skills/swarm-orquestacion/reference/convivencia-multi-orquestador.md`
(método v0.6); inventario de holones en `plan/MUNDOS.md`.

### DA-S07 · Sucesión de vigía (2026-07-22 · mandato Vigilante-S)

- **Vigía del carril S** = ventana **Vigilante-S** (estación viva
  `C:\S\vigilancia`, watcher activo). Calibración: `plan/ESTACION.md`.
- Gates `Rn-S` (R5-S en adelante): pedido por **AVISO** bajo el sprint
  vigente del carril (`plan/SPRINTS/<sprint>/AVISO-VIGIA-Rn-S.md`);
  veredicto lo emite Vigilante-S **vía custodio**. **Sin PASS no hay 🔶.**
- **Prohibido** generar o invocar subagentes con rol de vigía.
- R4-S y era previa ratificadas (tip auditado
  `4e193bcb8b2d4ea1de9179f45de6a67ce5268a7b`). Cierre limpio de esa era.
- R8-S = cierre INITIAL-BASE; R9-S+ = arcos siguientes (p. ej.
  PORTAL-NUMERO-0).
- Lección método «sucesión de vigía» → cola del sprint (vigilancia
  vNext); PORT, no rewrite del resto.

### DA-S08 · IB-22 vía handoff (2026-07-22 · custodio/PO)

Decisión ya tomada por custodio/PO (condición 3 · INFORME-VIGIA-R6-S):
para el alcance de **IB-22** (archivo del cascarón + reubicación de
joyas / dossiers al mundo de papel), la vía es **(a) handoff**.

- El WP del carril S **prepara** el material y **emite nota formal** al
  carril dueño.
- **No** escribe fuera del workspace `C:\S\scriptorium` (ni
  `codebase/e-sdk`, ni archivo del cascarón en territorio hermano, ni
  otros `codebase/*-sdk`).
- Sin esta declaración el worker S no escribe fuera; con ella, la vía
  queda fijada = handoff (no GO puntual de escritura).
- Cero borrados sin veredicto desechable (sigue vigente).

### DA-S09 · IB-23 vía handoff (2026-07-22 · custodio/PO)

Decisión ya tomada por custodio/PO (condición 2 · INFORME-VIGIA-R7-S):
para el alcance de **IB-23** (limpieza final en mundo legado S_SDK /
territorio hermano: WEBS/, HOLONES/ paths largos, LLM.md→broche), la
vía es **(a) handoff**.

- El WP del carril S **prepara** el inventario/candidatos y **emite
  nota formal** al carril dueño (s-sdk / mundo legado).
- **No** escribe ni borra fuera del workspace `C:\S\scriptorium` (ni en
  `codebase/s-sdk`, ni otros `codebase/*-sdk`).
- Los **borrados** quedan al carril dueño: **veredicto desechable POR
  ELEMENTO** (con acta) antes de cada borrado — regla del CA del
  backlog; el handoff no la ejecuta.
- CA «webs S siguen verdes» = **C8 real post-cambio** a cargo del dueño
  tras materializar borrados; el carril S declara baseline y no finge
  C8 post-borrado.
- Broche documental `LLM.md` en raíz `C:\S` (fuera de git) + **puntero
  trazado** en repo/cuadernos.
- **Cero bump de gitlink** del mundo legado en IB-23 (GO propio).
- Sin esta declaración el worker S no borra ni escribe fuera; con ella,
  la vía queda fijada = handoff (no GO puntual de escritura/borrado).

### DA-S10 · GO arco contenido portal número 0 (2026-07-22 · custodio)

GO del custodio para encolar WP **nuevo** del carril S: contenido del
portal aleph-null «número 0» (sprint `PORTAL-NUMERO-0` · WP **N0-01**).

- **NO reabre IB-13** (esqueleto web cerrado; este arco = contenido).
- Fuentes: entrega Vigilante-S + complemento Fable; fusión = base V-S
  manda · **C-1 CORE** siempre; C-6 fuera.
- Piel NO se toca (issue #15 librería; re-pielado = WP futuro).
- Gate R9-S por AVISO → Vigilante-S; **sin PASS no hay 🔶**.
- Sugerencia post-cierre: tag `release/numero-0` (vigía-sesión; no
  ejecutar en el encolado).
- Pre-tag (R8-S / Vigilante-S): `CHANGELOG.md` en raíz derivado de WPs
  ✅ de facto **antes** del tag; gate release cruzará WPs ✅ ↔ CHANGELOG.

### DA-S11 · Librería de skills al índice (2026-07-22 · custodio)

`S_SDK-skills-library` entra al índice como submodule
`codebase/skills-library` — categoría **método** (sin letra; no es un
mundo).

- Remoto: `alephscriptorium-eng/S_SDK-skills-library`
- Paquete: `@alephscript/skills-scriptorium` (nombre completo)
- Gitlink pineado al publish **0.6.0**:
  `6512e27dd11c4d84192d4a66035ede609ba97523`
- Inventario: fila en `plan/MUNDOS.md` · fuente citada en
  `plan/VISION.md`
- **Bumps futuros del gitlink = GO**, como todo gitlink del índice
- No declara checkout futuro de issue #15 (piel); eso = su brief

### DA-S12 · Secuencia PO post-R10-S · tag retenido + piel primero (2026-07-22 · custodio)

Tras R10-S **PASS-con-residual** (OK de sellado del tag concedido), el PO
reteniene el **cuándo** del tag `release/numero-0` hasta piel correcta
(defecto issue #15 visible con contenido real). El OK de sellado **sigue
válido**; cambia el cuándo, no el qué.

**Orden del portal (literal):**

1. **FAST-TRACK N0-02** (issue #15) — carril librería
   `S_SDK-skills-library`: piel fanzine como asset de `site-web` + CA
   estructural C8 anti-regresión · release `0.6.1`/`0.7.0` · checkout
   de obra **DECLARADO** en brief (`C:\S\S_SDK-skills-library`) · gate
   **R11-S** por AVISO · **sin PASS no hay 🔶**.
2. **N0-03 · re-pielado del portal** — carril S · alcance
   `docs/.vitepress/theme/**` · consume versión nueva · brief stub OK;
   🔶 solo tras #15 publicado + gate propio.
3. **ENTONCES** sellar `release/numero-0` (notes = sección Número 0 del
   CHANGELOG). **Hoy no.**

Gobierno de raíz (residual R10-S) en el mismo GO: `plan/RAIZ-C-S.md` +
`C:\S\README.md` copia-release + barrido residuo #3/bootstrap con acta.
Arco **SKILLS-EN-MUNDOS** (z·g·s·e·a; o-sdk excluido F3-01) = solo COLA
hasta cierre del arco portal.

## Abiertas

_(las resuelve el custodio)_
