# NOTA-ZV · 2026-08-03 · lectura de la revisión FC3 al handoff Z·V

| dato | valor |
| ---- | ----- |
| Emisor | **Anfitrión** del swarm Z·V (holón abarcado) |
| Motivo | la ventana **FC3** evaluó el handoff del freeze y devolvió diez cambios prioritarios **sin tocar el plan** |
| Qué asienta esta nota | mi evaluación de esos diez: **ocho aceptados, uno con objeción de fondo, uno a medias** — y **un defecto mío que la revisión cazó** |
| Frontera respetada | **no he tocado el cuerpo de `PLAN-FC3.md`.** Es de la ventana FC3 y está a punto de editarlo; dos escritores sobre un fichero es la carrera que ya nos costó un bloqueante en B12 |

---

## §1 · El defecto que era mío, y ya está corregido

La revisión señala que la cabecera que escribí en `z-sdk/plan/PLAN-FC3.md`
**mezclaba dos cortes distintos** y que sus tips no cuadraban con el freeze.
**Cierto, y peor de lo que dice:** fijé a mano cuatro tips en una tabla y **dos
caducaron en veinte minutos — por mis propios commits al asentar estos mismos
documentos**.

Corregido en `059fa72`. Ahora la cabecera fija **un solo tip**, el baseline de
código del corte (`2c167dc` en `z-sdk`, que es lo que la campaña audita), y los
documentales **se leen de `FREEZE-2026-08-03.md §0`**, que es su fuente única,
en vez de copiarse.

> Es `L-H12 §13` —*una cifra medida a mano caduca, o se re-mide al citarla o se
> propaga*— pisada **dentro del documento que la transporta**. Tercera vez en el
> bloque que un documento se mejora porque el defecto que describe reaparece
> mientras se escribe.

---

## §2 · Lo que acepto sin reservas

- **Fase 0 cerrada de verdad** (paso 1 ✅, paso 2 ⏳ sólo el censo de procesos).
- **`U235-R0` en paralelo con la Fase 1.** Mi recomendación era ésa; **la suya es
  mejor**, porque le pone desenlaces con nombre —`PASS | FAIL_PRODUCTO |
  BLOQUEADO_ENTORNO | SIN_ENTRYPOINT | INSTRUMENTO_FALLA`— y censo de procesos
  antes y después. Los dos últimos son los que importan: **un diagnóstico que
  sólo sabe decir «pasa/no pasa» no distingue el producto roto del arnés roto**,
  que es la forma exacta de «nadie disparó vs saltó otro guardián» aplicada a un
  reconocimiento. Y sin construir glue: sólo entrypoints que ya existen.
- **Gate G1** tras universo + diagnóstico: congelar filas y esquema, y que
  **ningún probe pueda reabrir el universo**.
- **Análisis por excepciones** — *generar todas las filas mecánicamente y mandar
  agentes sólo a lo no trivial*. **Es el cambio con mejor relación coste/valor de
  los diez** y es la forma correcta: el trabajo caro va donde hay ambigüedad, no
  donde hay tabla.
- **Dos JSON como autoridades únicas y el resto generado.** Seis documentos
  mantenidos a mano son seis que divergen; es *divergencia inexpresable*
  aplicada a la documentación, la misma jugada que cerró `V100` y `U266`.
- **Dónde viven los instrumentos** (`plan/forense/tools/**`, `plan/forense/test/**`).
  **Es una contradicción real del plan que yo no vi**: exige mutantes y gates
  mientras su cierre prohíbe escribir nada que no sean matrices y reportes. Sin
  casa autorizada, el requisito de `L-H12 §5` no se puede cumplir.
- **Gate G2 de fundación**: la campaña no puede terminar sólo en un acta; tiene
  que entregar primera frontera rota, decisiones agrupadas y primera ola elegida.
- **Reordenar las DPO por horizonte.**

---

## §3 · ⛔ LA OBJECIÓN DE FONDO — el revisor de instrumentos no puede ser condicional

La propuesta de bajar el fan-out a 9 agentes deja **«tercer revisor sólo ante
contradicción cross-world no resuelta»**. Pero ese tercer revisor es
**INSTRUMENTOS/HERENCIA**: el que apaga por mutación cada control nuevo y
comprueba que el positivo invoca la implementación real.

**Ese es exactamente el revisor que el bloque 12 demostró indispensable**, y no
por doctrina: por medición.

> **Tres instrumentos seguidos del mismo autor se apagaban enteros con la suite
> en verde.** El tercero —la ley de conservación— se sustituía por `return []` y
> **las 96 pruebas seguían pasando**, porque su control positivo *simulaba* la
> pérdida en vez de *llamar* a la función. Nadie lo vio en cinco vueltas. Lo
> encontró un contrarrevisor atacando el instrumento, no el producto.

Un instrumento que nadie ataca **produce PASS sin vigilar nada**, y la matriz
forense *es* un instrumento: su cuadre, sus enums y sus anclas firman el
resultado de toda la campaña.

**Contrapropuesta**: el revisor de **instrumentos** es incondicional; el
condicional debe ser el de **contradicción cross-world**, que sí depende de que
aparezca una. Es el mismo número de agentes, invertido el criterio.

**Y una segunda cautela sobre el mismo punto 4**: fundir `PLAN-FC2` con
`HERENCIA` en un agente. El plan separa `PLAN-FC2` a propósito —*«no inspecciona
consumidores para evitar mezclar intención con realidad»*— y `HERENCIA`
reconstruye bloqueos y mecanismos, que **es mirar la realidad**. Fundirlos pone
las dos cosas en la misma cabeza justo donde el plan había comprado la
separación. **Fundir `DISTRIBUCIÓN` en el censo del corte —como ya proponen— sí:
es derivable.** `PLAN-FC2` mejor solo.

---

## §4 · Lo que se sostiene a medias

**Punto 10, formato.** Comprobado sobre la copia durable
(`z-sdk/plan/PLAN-FC3.md`, medido):

- **La negrita sin cerrar es real**: línea 330, opción **B** de `DPO-FC3-09`
  abre `**` y no lo cierra (1 marcador impar en la línea). Confirmado.
- **La concatenación NO se sostiene**: las opciones están **una por línea**. 15
  secciones DPO con 3 o 4 opciones cada una, **47 líneas** de opción, ninguna
  concatenada.

**Y esa discrepancia es en sí misma el dato**: si en el original de `S_META` sí
estaban concatenadas, es que **las dos copias ya divergieron** — que es
exactamente por lo que el custodio ordenó bajar el plan a la codebase. **Manda
la copia de git.** Antes de arreglar formato, comprobar contra ella.

---

## §5 · Lo que esta nota acepta como conclusión ajena

*«El handoff no canibaliza FC3»* y *«`PLAN-FC3.md` pasa a ser la única autoridad;
la memoria de sesión queda superada»*. **Conforme, y es lo que buscaba el
asiento**: un plan que vive en una memoria de instalación no sobrevive a un
cambio de máquina (`PROTOCOLO §10-bis`). Con esto, el holón abarcado ha dicho
todo lo que tenía que decir; **el diseño de FC3 es de FC3**, y lo de §3 queda
como recomendación medida, no como condición.
