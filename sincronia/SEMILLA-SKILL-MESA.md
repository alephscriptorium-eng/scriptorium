# SEMILLA · skill «mesa de sincronía» — backlog candidato para L

| dato | valor |
| ---- | ----- |
| Mantiene | **Anfitrión** (diseño) · **L** toma nota (PROTOCOLO §6) |
| Estado | **semilla** — todo `<pendiente>` de GO; el BRIEF real se hace en F2 con el método `swarm-orquestacion` |
| Regla | esto no es backlog aceptado: L no abre WP desde aquí |

El protocolo de esta mesa (buzones · timbre · ticks · hilos · compactos) se
portará como skill del paquete. Piezas ya probadas de facto en esta reunión;
el skill las parametriza («el mundo») sin nombres reales — mismo patrón que
`vigilancia`.

## WP candidatos (v0 → skill)

| id | pieza | contenido | fuente de facto |
| -- | ----- | --------- | --------------- |
| WP-M01 | contrato BUZÓN | `sincronia/BUZON.md` puntero + `notas/` · un buzón un dueño · malla de lectura / estrella de escritura · aviso determinista `<WORLD_ROOT>\sincronia\BUZON.md` | INDICE §Reglas + buzones vivos |
| WP-M02 | contrato TIMBRE | formato PING de una línea · append-only · excepción declarada a la estrella · rotación · **gate**: verificador de formato/append (probe con fixture) | PROTOCOLO §7 |
| WP-M03 | watcher-timbre | param `WATCH_FILE` sobre el watcher del método (estación-viva / vigilancia) · lease de liveness reutilizado · snippet v0 inline como fallback · **probes obligatorios**: timbre vacío (caso fundante Z: `grep -c` exit 1 → watcher ciego), log propio por proceso (caso V), encoding UTF-8 append (caso O) | PROTOCOLO §7 v0.1 + `vigilancia/reference/ESTACION.md` §liveness |
| WP-M04 | contrato TICK+HILO | formato TICK · `NO_TICK_VALIDADO=NO_PROCESAR` · ciclo tick→hilo→compacto · plantilla `COMPACTO-*.md` (◆/★/⏳) · **gate**: verificador de compacto | PROTOCOLO §5 + §8 |
| WP-M05 | identidad+firma+TUI | anuncio/firma · aborto por nombre cruzado · leyenda TUI y frases-contrato grep-ables | PROTOCOLO §1–§3 |
| WP-M06 | git-bitácora | trackear solo `sincronia/` · local-only con GO expreso · rama `hilo/<id>` = discusión, merge = cierre · push prohibido como default del skill | PROTOCOLO §8 |
| WP-M07 | fixture mundo-mínimo | dos mundos sintéticos + hub, un hilo completo de ejemplo (tick→pings→compacto), ceguera = 0 | patrón `examples/` del paquete |

Dependencias: M02→M03 · M04 usa M02 · M07 al final. M01 y M05 no dependen.

## Estadios futuros (parking — NO esta ronda)

Para cuando la codebase crezca o haya que convocar otra reunión de asiento:

1. **Timbre → room.** Sustituir campanilla-FS por room del skill
   `operador-rooms`: peercard en el PING, ACL por hilo, salud de estación.
   El timbre v0 queda como transporte degradado/offline.
2. **Hub git compartido local.** Un repo bare local «mesa» (o intercambio por
   `git bundle`) si algún día hay más de un host — sin tocar la norma de
   push.
3. **Moderador por hilo.** Con >2 hilos paralelos, cada hilo lleva moderador
   distinto del compactador; HILOS.md pasa a carpeta `hilos/` con un fichero
   por hilo.
4. **Índice regenerable.** Script que reconstruya INDICE.md desde los buzones
   (describir, no prescribir) — elimina la clase de anomalía #4
   (índice pisado por copia stale).
5. **SLA de estación.** Declarar lease máximo de silencio por carril
   (p. ej. 2×INTERVAL como en el método); estación muda = fila ⚠️ en el
   índice, no bloqueo.
6. **Plantilla de convocatoria de emergencia.** Esta mesa (buzones +
   protocolo + ticks + reparto principal/shadow) como boot reproducible:
   un comando del skill levanta la carpeta `sincronia/` calibrada.

— **Anfitrión**
