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

> **Superseded en el tramo final por DA-S13** (N0-04 = BRAND-1 entra
> antes del tag). El OK de sellado y el orden N0-02 → N0-03 siguen
> vigentes; cambia solo el colofón previo al tag.

Gobierno de raíz (residual R10-S) en el mismo GO: `plan/MAPA-RAIZ.md`
(alias histórico `RAIZ-C-S.md`) + `C:\S\README.md` copia-release +
barrido residuo #3/bootstrap con acta.
Arco **SKILLS-EN-MUNDOS** (z·g·s·e·a; o-sdk excluido F3-01) = solo COLA
hasta cierre del arco portal.

### DA-S13 · Secuencia portal + colofón BRAND-1 (2026-07-22 · custodio / GO BRANDING v3)

Actualiza el tramo final de DA-S12. Tag `release/numero-0` **RETENIDO**
hasta BRAND-1 (recomendación vigía: sellar con colofón).

**Orden del portal (literal):**

1. **N0-02** (piel · issue #15 · librería) — gate R11-S
2. **N0-03** (re-pielado portal · `theme/**`) — gate propio post-publish
3. **N0-04 = WP-BRAND-1** (marca aleph-null · cantera →
   `scriptorium/branding/` · favicon · `/licencia` · LICENSE puntero) —
   gate propio al turno · brief `BRIEFS/N0-04.md` · **sin 🔶 hoy**
4. **ENTONCES** tag `release/numero-0` (notes = sección Número 0 del
   CHANGELOG). **Hoy no.**

Carril hermano (no bloquea el tag por sí, pero se encola):
**WP-BRAND-2** · librería · minor `0.7.0` · bundle `#16+#17` · brief
histórico `BRIEFS/BRAND-2.md` (**superseded** 2026-07-23 →
`LIBRERIA-0.7.0/BRIEFS/LIB-070.md` · checkout
`C:\S_LAB\S_SDK-skills-library`) · sin 🔶 sin gate propio.

PRE-TICK cantera: `script_sdk-addenda` @
`0567a2481db5cc85c8eaac613754f35061587988` · `cantera/branding/`.
Paquete: `@alephscript/skills-scriptorium`. MIGAS intactas.

### DA-S14 · Doctrina de licencias por capas (borrador · 2026-07-22)

Borrador asentado por GO BRANDING v3 (PO decide vía canónica; ratificación
custodio implícita al GO salvo objeción).

**Capas (de fuera hacia dentro del zine):**

| Capa | Artefacto | Rol |
| ---- | --------- | --- |
| Canónica workspace | `LICENSE.md` raíz | **Puntero tipo GL**: GPL-3.0-or-later + capa Animus Iocandi + SPDX + link a composite Z_SDK |
| Composite (texto completo) | Z_SDK `LICENSE.md` / cantera `licencia-AIGPL-composite.md` | referencia; no se sustituye por lore |
| Lore / pieza zine | `licencia-AIPL-v1-lore.md` → solo `/licencia` | narrativa AIPL; **nunca** LICENSE canónica |
| Transición | AIGPL v4 | PENDING (or-later mantiene puente) |

**Prohibición:** copiar el LICENSE.md del Desktop (AIPL lore) como
licencia del workspace. Catch C8 del vigía = ley del carril.

Vía elegida (PO): **patrón puntero tipo GL** (más trazable que copiar el
composite completo a cada raíz). Mundos hermanos pueden seguir el mismo
puntero.

### DA-S15 · S_LAB = raíz de obra de los mundos (2026-07-22 · custodio)

Eleva a doctrina lo que PARTICION ya insinuaba y la addenda Vigilante-S
fundó en FS: **`C:\S_LAB`** = taller de la constelación (obra por
carril); **`C:\S\scriptorium\codebase/*`** = gitlinks del atlas, SOLO
LECTURA (bump solo con GO · DA-S11). Canónico: `plan/MAPA-TALLER.md`
(alias histórico `S-LAB.md`). Copia-release FS: `C:\S_LAB\README.md`.

Checkout de librería: **actualizado 2026-07-23** (🔶 LIB-070 · rename
custodio post-R16-S). El checkout en `C:\S\S_SDK-skills-library` fue
**borrado** por custodio (veredicto desechable); **no hay move**.
Checkout de obra del arco 0.7.0 = **clone materializado** path exacto
`C:\S_LAB\skills-library` (path viejo `S_SDK-skills-library` ya no
aplica · brief `LIBRERIA-0.7.0/BRIEFS/LIB-070.md`). Atlas `C:\S` =
solo-mapa + estación + fuentes.

### DA-S16 · Arco librería 0.7.0 + encadenamiento SKILLS-EN-MUNDOS (2026-07-23 · custodio)

Arco **nuevo** post-cierre PORTAL-NUMERO-0. Sprint
`plan/SPRINTS/LIBRERIA-0.7.0/`. Alcance release **0.7.0**: BRAND-2
(pack marca parametrizado + DE-8 + CA medible + advertencia
licencia-lore) · issue **#16** (sync bin multi-runtime) · issue **#17**
(`cantera/` + layout backstage + worktree por rol) · lecciones vNext
documentadas (sucesión vigía · checkout declarado ×3 · worktree por rol
· raíz por constelación). Gate **R16-S** por AVISO · **sin PASS no hay
🔶 ni publish**. Paquete: `@alephscript/skills-scriptorium`.

**SKILLS-EN-MUNDOS** (z·g·s·e·a; o-sdk EXCLUIDO F3): activación
**encadenada tras publish 0.7.0** — hoy solo COLA con dependencia
explícita. Obra por-mundo en `C:\S_LAB\<letra>-sdk`.

Aparcados (cero acción): carril Z · F3 · F4 · redirect · para-la-voz ·
pasada-2 OASIS · limpieza mundo legado · IOCANDI.

### DA-S17 · GO al parser (proyección · 2026-07-23 · custodio)

Cierra la elección aparcada en R17-S (cara PO · «DC-15» en el informe
del Vigilante-S: *GO al parser, no renombrar historia*). En el mundo del
paquete `@alephscript/skills-scriptorium` el intake del parser estricto
vive como **DC-25** (Punto 4); **DC-15** del paquete sigue siendo
LOCAL-ONLY (opt-in GitHub) — no se reabre.

**Elección:** **GO al parser** — flexibilizar el parser de
`proyectar-backlog.mjs` (aceptar formatos mixtos de bullet / ID) y
**fallar ruidoso** ante IDs que no se puedan proyectar (cero omisión
silenciosa). **No** normalizar backlogs del carril S (ni historia) a
`WP-<alnum>` como sustituto del arreglo.

Solo **registro/encolado** en gobierno S · COLA del plan (junto a
lecciones vNext / skill). **No** implementa el parser en este asiento;
obra = WP futuro en `skills-library` / paquete.

### DA-S18 · Piel del portal = familia codebase (2026-07-23 · custodio)

Corrige la dirección de **N0-03** en la INSTANCIA (portal aleph-null):
el look canónico de los portales del índice **no** es el layout fanzine
standalone; es la **familia codebase**.

**Look canónico (portales del índice / workspace):**
`codebase/{z,g,s,o}-sdk` y `skills-library` — shell VitePress
(`themeConfig` · nav + `socialLinks` GitHub + footer) con tokens zine
en `custom.css`. Referencia visual EXACTA (PORT):
`codebase/z-sdk/docs`.

**Layout fanzine standalone** (`Layout.vue` + stamp/washi) = **NO** es
destino del portal del workspace. Queda **opt-in del método** para
zines puros estilo pub / Vestíbulo.

**Post-tag:** la corrección de piel es WP residual del carril S
(`WP-REST-SHELL` · gate **R20-S**). **NO** reabre el arco
PORTAL-NUMERO-0 · **NO** toca el sello `release/numero-0`
(deref `40598f0e307921d613dacf1c324415eb4a1b5d32` · tag obj
`69bbc098b91d8e09c15873d5ffbffa6b9c5589be`).

Método (issue **#18** / LIB-080 · encolado): dos pieles canónicas en
`site-web` — `familia-vp` (**DEFAULT**) · `fanzine` (**OPT-IN**). Hoy
solo gobierno; sin mezclar DA-S17/parser ni bump de gitlinks atlas.

### DA-S19 · Política de espejo de skills declarada por mundo (2026-07-23 · custodio)

Post R19-S **PASS-con-observaciones**: la familia quedó heterogénea.
**PORT — no unificar a la fuerza.** Ambas vías son legales:

| mundo | política espejo `.claude/skills/` | calificación |
| ----- | --------------------------------- | ------------ |
| **z** | gitignore (regenera con `skills:sync`) | **canon** (guide: materializa al instalar) |
| **g** | trackeado (commit auditable) | **desviación auditable** |
| **s** | trackeado (commit auditable) | **desviación auditable** |
| **e** | trackeado (commit auditable) | **desviación auditable** |
| **a** | trackeado (commit auditable) | **desviación auditable** |

Cada mundo asienta la línea en SU `plan/ESTACION.md`. El atlas inventaría
en `plan/MUNDOS.md` · no impone unificación. Bump gitlinks
`codebase/{z,g,s,e,a}-sdk` = GO custodio (este asiento · DA-S11).
**o-sdk / skills-library** fuera de este GO. DA-S17 / WP-REST-SHELL (R20)
no mezclados.

## Abiertas

_(las resuelve el custodio)_

- DA-S14 queda como borrador operativo del GO; objeción custodio =
  enmenda explícita.
