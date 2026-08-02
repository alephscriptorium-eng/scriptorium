# Contrarrevisión adversarial · WP-HUB-113

| dato | valor |
| ---- | ----- |
| rol | revisor adversarial (distinto del worker / orquestador) |
| fecha | 2026-08-02 |
| fuente | `REPORTE-WP-HUB-113.md` · `VECTOR-ROJO.md` · `.github/workflows/ci-lore-hm.yml` · run-ids gh |
| ficha CA | `WP-HUB-113` en `plan/BACKLOG-F2.md` |
| gobierno | `GOBIERNO-LORE-HM.md` §4 |
| tip worker | `C:/S_LAB/wt/scriptorium-wp-hub-113` · rama `wp/hub-113-hm-ci-que-verifica` @ `7f39047` |
| modo | reintento de vectores; **no** re-ejecución de la suite como prueba de promesa |

## VEREDICTO: PASS_CON_ADDENDA

Los criterios **medibles** de la CA (rojo plantado → fallo de workflow, cero `continue-on-error` funcional + guarda, preflight + `skills:ceguera` como pasos reales en Actions, run-ids citados con `gh`) **se sostienen**.

No se celebra el ✅: el BRIEF abre con **dos** mundos sin gate; `s-sdk` sigue solo con `docs.yml`. «Bloquea» es fallo duro del job, **no** protección de merge. Hay bypass trivial del disparo (`paths` / `if`) sin meta-guarda. El orquestador **reinterpretó** alcance («hub y/o») más ancho que la evidencia.

---

## Vectores

### V1 · ¿El rojo plantado falló el job que debe tumbar el flujo?

| run-id | evento | conclusion workflow | job `lore-hm gates` | paso que falló |
| ------ | ------ | ------------------- | ------------------- | -------------- |
| [30726224409](https://github.com/alephscriptorium-eng/scriptorium/actions/runs/30726224409) | arnés (`98cf881`) | **success** | success | — |
| [30726279433](https://github.com/alephscriptorium-eng/scriptorium/actions/runs/30726279433) | rojo (`9763638`) | **failure** | **failure** | `Suite playground LORE-HM` exit 1 |
| [30726323270](https://github.com/alephscriptorium-eng/scriptorium/actions/runs/30726323270) | restaura (`c21e2d6`) | **success** | success | — |
| [30726356028](https://github.com/alephscriptorium-eng/scriptorium/actions/runs/30726356028) | tip docs (`7f39047`) | success | success | (sigue disparando gates) |

Log del rojo (extracto medido):

```text
lore-hm suite: ROJO PLANTADO (WP-HUB-113 vector)
##[error]Process completed with exit code 1.
```

- Un solo job en el workflow; **no** hay job hermano en `success` que enmascare el vector.
- El marcador `ROJO-PLANTADO` **no** está en tip (retirado en restauración) — coherente con `VECTOR-ROJO.md`.
- Pasos Post/Complete en success tras fallo de suite son ruido de Actions, no bypass.

**Resultado V1:** PASS medible. El rojo enrojeció el flujo citado.

---

### V2 · `continue-on-error` / pasos blandos

- Grep de clave YAML `^[[:space:]]*continue-on-error` en `.github/workflows/` del tip: **cero** hits funcionales en `ci-lore-hm.yml` (solo mención en comentario / nombre de paso).
- Guarda `playground/prueba-de-H-M/ci/guarda-continue-on-error.sh` corre **antes** de preflight/suite en el job verde (log: `cero continue-on-error funcional…`).
- Límite **declarado** en YAML y script: si el propio paso de la guarda lleva `continue-on-error: true`, la regresión no tumba el job. Honesto; no lo niega el reporte.

**Resultado V2:** PASS con límite residual (no FAIL).

---

### V3 · Preflight identidad-raíz y `skills:ceguera` ¿en CI de verdad?

Medido en log de `30726224409` (no supuesto):

| paso | salida literal |
| ---- | -------------- |
| Preflight identidad-raíz | `identidad-raiz: PASS` · `WORLD_ROOT`/`CANONICAL` = `/home/runner/work/scriptorium/scriptorium` · `READ_ONLY_ROOTS: []` |
| skills:ceguera | `ceguera: 0` vía `npm run skills:ceguera` → script canónico del paquete |

No son solo docs locales: son steps del job en Actions.

**Matiz adversarial:** con `WORLD_ROOT == CANONICAL_WORLD_ROOT == github.workspace` y RO/downstream vacíos, el preflight en CI es **casi tautológico** (cualquier checkout limpio pasa). Cumple la letra «corren en CI»; **no** reproduce la clase de LOCK de estación local mal apuntada. Addenda de honestidad, no devolución.

**Resultado V3:** PASS literal · addenda de potencia del preflight en runner.

---

### V4 · ¿Se apaga el gate con cambio trivial?

| bypass | estado hoy | juicio |
| ------ | ---------- | ------ |
| `paths` / `paths-ignore` en `on.push` | **ausente** en `ci-lore-hm.yml` | Un PR de una línea silencia el disparo para cambios fuera del filtro. **Sin meta-guarda** (la guarda solo mira `continue-on-error`). |
| `if: false` en job | ausente | Apaga el job sin tocar la guarda. |
| Solo docs | tip docs `30726356028` **sí** corrió gates completos | Hoy no hay silence por docs; bien. Frágil ante el bypass de la fila 1. |
| Branch protection / rulesets en `main` | `Branch not protected` · `rulesets: []` | El workflow en rojo **no** impide merge por API GitHub. «Bloquea» ≠ required check. |
| Vaciar suite / borrar marcador de existencia | suite solo comprueba ficheros + scripts | Sigue siendo un gate débil de arnés, no de lane 100+. |

**Resultado V4:** el vector de apagado por YAML trivial **existe**. No tumba el rojo medido ya hecho; exige addenda (proceso + follow-up de required check / anti-`paths`).

---

### V5 · `s-sdk` sin espejo

| mundo | workflows en tip relevante |
| ----- | -------------------------- |
| hub (`scriptorium`) | `ci-lore-hm.yml` + `docs.yml` |
| `C:\S_LAB\s-sdk` | **solo** `docs.yml` (comprobado en disco) |

- BRIEF: «hoy `C:\S\scriptorium` **y** `C:\S_LAB\s-sdk` tienen un único flujo `docs.yml`… Montar CI…».
- GOBIERNO §4.4: misma pareja; 113 es P0 **porque** ambos estaban ciegos.
- CA bullets: rojo / blandos / preflight+ceguera en CI / run-id — **no** enumeran «ambos mundos» como ítem.
- Reporte: «ficha permitía hub y/o s-sdk» — **frase no sustentada** por el BRIEF (diagnóstico dual; no licencia explícita de dejar S ciego).

**Resultado V5:** no FAIL de los bullets CA del hub; **PASS_CON_ADDENDA** exigiendo follow-up espejo CI en `s-sdk` (o decisión custodio escrita que cierre §4.4 a «solo hub»). Sin eso, §4.4 **no** está cerrado.

---

### V6 · Alcance > evidencia en el ✅ del orquestador

1. **«CI … que bloquea» / ✅** — evidencia = job failure medido. **No** hay required status / branch protection. Sobre-afirma si se lee como «impide merge».
2. **«ficha permitía hub y/o»** — reinterpretación; ver V5.
3. **«Suite playground»** — `suite.mjs` es arnés mínimo (existencia de ficheros + scripts + workflow + anti-`ROJO-PLANTADO`). Aceptable para montar el flujo antes de 100; no es suite de lane. El ✅ no debe venderse como cobertura de playground de producto.
4. Run-ids y VECTOR-ROJO: **alineados** con `gh run view` (no inventados).

**Resultado V6:** cicatriz §4.2 — addenda de frase; no tumba CA medible del hub.

---

## Addenda exigida (orquestador / custodio — no BACKLOG desde aquí)

1. **Frase:** recortar «bloquea» a «enrojece el workflow / job `lore-hm gates` (medido)» · declarar que **merge a main no está gated** por GitHub (protection ausente).
2. **Follow-up `s-sdk`:** espejo de gate (o acta custodio «113 = solo hub; S queda en verde local hasta WP-…»). Sin eso, no cerrar el texto de GOBIERNO §4.4.
3. **Bypass YAML:** documentar riesgo `paths`/`if:false`; valorar required check `lore-hm gates` cuando haya GO de custodio.
4. **Preflight CI:** declarar que WORLD=CANONICAL=workspace es smoke de que el detector **corre**, no LOCK de identidad de estación.

---

## Para el padre / orquestador

| pregunta | respuesta |
| -------- | --------- |
| VEREDICTO | **PASS_CON_ADDENDA** |
| informe | `C:/S_LAB/wt/scriptorium-wp-hub-113/playground/prueba-de-H-M/ci/CONTRARREVISION-WP-HUB-113.md` |
| ¿el ✅ se sostiene? | **Sí, con addenda** — CA medible del hub OK; no el cierre dual-mundo ni «bloquea merge» mecánico |
| ¿ola 1 puede pedir GO ya? | **GO condicionado:** fichas hub (100/101) pueden exigirse con CI hub medido; **L01 en s-sdk** sigue en régimen «verde local» (§4.4) hasta espejo o acta. No declarar ola 0 «CI resuelto en ambos mundos». |
| devoluciones a worker | **ninguna bloqueante** (no FAIL) |

---

## Qué no se hizo (frontera)

- No se editó `sincronia/**` ni `prueba-de-dos`.
- No se marcó BACKLOG.
- No se mergeó a `main`.
- No se re-plantó rojo en tip (solo lectura de runs históricos).
