# BACKLOG · sprint INITIAL-BASE

Estados: ⬜ pendiente · 🔶 en curso · ✅ aceptado.

> PORT del backlog-semilla del custodio
> (`scriptorium-cuadernos` · rama `script_sdk-addenda` ·
> `BACKLOG-SEMILLA-INITIAL-BASE.md`). Principio: **PORT, NO REWRITE**.
> Doctrina: A-23 v2 §L1/L2 · §F3a. Método: skills-scriptorium@0.5.1.
> Carril: **S** · gates vigía: rondas `Rn-S`.

## Ola IB-0 · Rescates F0 (ops · pueden ir ∥ con IB-1)

- ✅ **IB-01 · Push O_SDK con salvaguarda** — repo alephscriptorium-eng/
  O_SDK, rama upgrade/oasis-0.8.8 local en OASIS/_RECOVERY-20260721/
  alephscript-clean (7 commits ahead). ANTES de push: comparar log/fechas
  contra remoto; si el remoto tiene fixes posteriores (equipo forense) →
  STOP + nota-a-forense, no pisar. Untracked (SESION-BACKLOG ×2,
  docker-compose.override) → cuaderno, NO al repo.
  **CA:** push limpio o nota-a-forense emitida · cero force · evidencia
  fechas en reporte.
  _Brief:_ `BRIEFS/IB-01.md` · merge `wp/ib-01-push-osdk-salvaguarda`
  · O_SDK tip `632ee2a2bbb10a19efbc57b2f0a847dd04333ff9`
  · reporte `REPORTES/IB-01-push-osdk-salvaguarda.md`
- ✅ **IB-02 · Higiene OASIS mínima** — retirar .git accidental de
  SCRIPTORIUM_V0 (contenedor; anidados independientes verificados) ·
  acta de descarte de GL wp/u70 ahead-2 (obra U-sprint vieja; canon en
  hub). **Cero arqueología** — dudas → nota-a-forense.
  **CA:** SCRIPTORIUM_V0 sin .git · acta u70 · nada más tocado.
  _Brief:_ `BRIEFS/IB-02.md` · merge `wp/ib-02-higiene-oasis-minima`
  · reportes `REPORTES/IB-02-higiene-oasis-minima.md` +
  `REPORTES/IB-02-ACTA-descarte-gl-u70.md`

## Ola IB-1 · Génesis del workspace

- ✅ **IB-10 · Estructura `C:\S` + repo `scriptorium`** — repo
  alephscriptorium-eng/scriptorium (público). Layout: `codebase/`
  (submodules) · `playground/` (semillas) · `docs/` (site-web overall) ·
  `plan/` (montar-plan del skill). Cuadernos = repo privado
  scriptorium-cuadernos existente (rama por mundo — NO entra al público).
  **CA:** clone fresco + submodule update funciona · plan autocontenido
  (agente fresco lo opera solo con el skill — regla 13 verificable) ·
  paths cortos (C:\S\...).
  _Nota génesis:_ esqueleto + plan montados en sesión de génesis; este WP
  verifica CA de facto y cierra huecos — no reescribe alcance.
  _Brief:_ `BRIEFS/IB-10.md` · merge `wp/ib-10-estructura-scriptorium`
  · reporte `REPORTES/IB-10-estructura-scriptorium.md`
  · gitlinks `<pendiente>` → IB-11
- ✅ **IB-11 · Submodules mapa de letras** — codebase/: z-sdk (Z_SDK) ·
  g-sdk (Z_SDK-games-library) · s-sdk (S_SDK) · e-sdk (E_SDK) · o-sdk
  (O_SDK post-IB-01) · a-sdk (aleph-scriptorium). DS-5: apuntar, no
  contener (gitlinks, cero inflar).
  **CA:** 6 gitlinks a tips remotos reales · `git submodule status` limpio.
  _Brief:_ `BRIEFS/IB-11.md` · merge `wp/ib-11-submodules-mapa-letras`
  · o-sdk tip `632ee2a2bbb10a19efbc57b2f0a847dd04333ff9`
  · a-sdk remoto `escrivivir-co/aleph-scriptorium`
  · reporte `REPORTES/IB-11-submodules-mapa-letras.md`
- ✅ **IB-12 · Skills + estación de vigilancia** — devDep
  @alephscript/skills-scriptorium@0.x (resuelve 0.5.1+) + skills:sync
  espejo `.claude/skills/` · calibración estación: OUT_DIR persistente +
  BACKSTAGE_GIT (rama scriptorium-vigilancia en cuadernos) + watcher con
  whitelist materialización.
  **CA:** npm view C8 · espejo íntegro · watcher arranca · calibración
  en plan (no en el skill).
  _Brief:_ `BRIEFS/IB-12.md` · merge `wp/ib-12-skills-estacion`
  · obra `d9ffc10753309ea3a2f4310ce1b1fce9c5a4578c`
  · reporte `REPORTES/IB-12-skills-estacion.md`
- ✅ **IB-13 · Web + dominios** — docs/ site-web overall esqueleto ·
  dominio **aleph-null.escrivivir.co** (CNAME + DNS = tick custodio) ·
  redirect scriptorium.escrivivir.co → pub.escrivivir.co (tick DNS
  custodio; hoy 404).
  **CA:** docs:build verde · Pages vivo en aleph-null (tras tick DNS) ·
  redirect verificado C8.
  _Brief:_ `BRIEFS/IB-13.md` · merge `wp/ib-13-web-dominios`
  · obra `0354884032a6461d712b05cafa41fb8796b34880`
  · reporte `REPORTES/IB-13-web-dominios.md`
  · **residual DNS:** Pages + redirect BLOQUEADOS (tick custodio);
    CA in-repo docs:build ✅; re-verificar en R4-S.

## Ola IB-2 · Port de planes y doctrina

- ✅ **IB-20 · Reunificación de planes** — recopilar plan/ de los 6 sdk
  → asentar protocolo multi-orquestador (contrato v1.1/método v0.6) en
  el plan del workspace · verificar skills@latest en cada sdk ·
  histórico → cuadernos (rama por mundo).
  **CA:** tabla de mundos con versión skill + estado plan · cero
  histórico perdido (cuadernos) · partición de territorios declarada.
  _Brief:_ `BRIEFS/IB-20.md` · merge `wp/ib-20-reunificacion-planes`
  · obra tip `53573e22ca11dfe943a49d63716f93be5a05cabf`
  · reporte `REPORTES/IB-20-reunificacion-planes.md`
  · artefactos `plan/MUNDOS.md` · `plan/PARTICION.md`.
  **Aceptado** post R5-S; partición declarada; gitlinks invariantes.
  Residual DNS: aleph-null Pages VIVO; redirect DIFERIDO (no verde).
- ⬜ **IB-21 · Skill `holarquia`** (destilación DEVOPS — veredicto del
  destilador): A) dos leyes + junturas + plantilla holón · B) DS-5 ·
  C) acuerdo LLM.md (memoria→codebase · regla de oro «no inventes
  observaciones» · notaría describir-no-prescribir). Publicar en
  skills-library (minor DC-22).
  **CA:** ceguera delta 5 = 0 · agente fresco aplica las dos leyes solo
  con el skill · npm view nueva versión.
- ⬜ **IB-22 · Archivo del cascarón + reubicación de joyas** — genealogía
  07-holones → archivo «partida de nacimiento» (cuaderno o docs
  histórico) · dossiers 16-07 → e-sdk (mundo de papel, decisión A-23) ·
  REGISTRO DE JOYAS como backlog-cola del workspace: para-la-voz/@voz
  (¡web viva en escrivivir-co!) · futures-engine · patrón 4-slots ·
  cartógrafo Hilbert · conversor liturgias · NETWORK-ENGINE AOS.
  **CA:** DEVOPS/ cerrada sin pérdida (todo apuntado o archivado) ·
  joyas en cola con puntero verificado · e-sdk recibe dossiers.
- ⬜ **IB-23 · Limpieza final S_SDK** — WEBS/ borrar (subsumida por
  site-web) · LLM.md → broche en C:\S raíz · HOLONES/ paths largos
  mueren (los submodules nuevos son la vía) · S_SDK queda como s-sdk:
  pieza techy-devops del workspace.
  **CA:** nada borrado sin veredicto desechable · webs S siguen verdes.

## COLA del workspace (NO es INITIAL-BASE — arcos futuros con GO propio)

F3 o-sdk/L1-L2 completo (sidecar · PR epsylon · G3 «el parte viaja por
el pub») · F4 playground + Docker Hub scriptorium-city (solarnet ·
lurker · founder) · tipos-del-FOSS (peer-card-seat primero) · pasada-2
auditoría OASIS (inventario) · arco para-la-voz (despierta e-sdk).

- ⬜ **Lección · sucesión de vigía** (skill `vigilancia` vNext) — PORT al
  método: vigía del carril = estación viva Vigilante-* (OUT_DIR), no
  subagente del orquestador; gates `Rn-*` por AVISO + veredicto vía
  custodio; sin PASS no hay 🔶. Caso fundante carril S · 2026-07-22
  (DA-S07) · ratificado en R5-S (`INFORME-VIGIA-R5-S.md` PASS-con-residual
  · backstage `scriptorium-vigilancia` tip `03f09a9`). Encolada; PORT
  a skill vNext con GO propio — no reescribe el resto del backlog.

## Orden y paralelismo

IB-0 ∥ IB-10 → IB-11 → (IB-12 ∥ IB-13) → IB-20 → (IB-21 ∥ IB-22) →
IB-23. Gates del vigía por ola (rondas Rn-S). Regla de oro: PORT, NO
REWRITE — todo lo que huela a reescritura se devuelve a cola con GO
propio.

## Gate / estado lote (ola IB-0 + IB-10 → IB-11 · lote IB-12 ∥ IB-13 · IB-20)

- Briefs: `BRIEFS/IB-01.md` … `BRIEFS/IB-13.md`, `BRIEFS/IB-20.md`
- Aviso vigía: `AVISO-VIGIA-R1-S.md` · informe `INFORME-VIGIA-R1-S.md` (PASS)
- **Lote IB-01 ∥ IB-02 ∥ IB-10: ✅ cerrado** 2026-07-22 (merges post-aceptación).
- Gate vigía **R2-S:** informe `INFORME-VIGIA-R2-S.md` · **PASS**.
- **IB-11: ✅ aceptado** 2026-07-22 (merge post-aceptación; 6 gitlinks).
- Gate vigía **R3-S:** informe `INFORME-VIGIA-R3-S.md` · **PASS**.
- **Lote IB-12 ∥ IB-13: ✅ cerrado** 2026-07-22 (merges post-aceptación).
  Residual DNS: aleph-null Pages **VIVO** (R5-S; CA Pages IB-13 de
  facto); redirect scriptorium→pub **DIFERIDO** sine die (custodio) —
  cerrado a planificación sin verde; **no** bloquea IB-20.
- Gate vigía **R4-S:** informe `INFORME-VIGIA-R4-S.md` · **PASS-con-residual**
  (era ratificada; tip auditado `4e193bc…`).
- **Sucesión vigía (DA-S07):** Vigilante-S en `C:\S\vigilancia` · AVISO
  `AVISO-VIGIA-R5-S.md` · gate **R5-S = PASS-con-residual**
  (`INFORME-VIGIA-R5-S.md` · tip pulso previo `797662e` · main post-informe
  `68d078d`). Backstage `scriptorium-vigilancia` @ `03f09a9`.
- **IB-20: ✅ aceptado** 2026-07-22 (merge post-aceptación). AVISO
  `AVISO-VIGIA-R6-S.md` · gate **R6-S** pendiente. No 🔶 IB-21∥IB-22
  sin PASS R6-S.
