# TIMBRE · carril S (Scriptorium)

Campanilla — no buzón. Contrato: `PROTOCOLO.md` §7.
Append-only de líneas `PING …`. Dueño puede rotar a `notas/timbre-<fecha>.md`.

Formato (ejemplo indentado a propósito — no debe matchear `^PING `):

    PING <YYYY-MM-DD HH:MM> · DE=<X> · HILO=<id|-> · REF=<ruta absoluta de la nota>

Append: `printf '%s\n' '…'` (comillas simples) o `Add-Content -Encoding utf8`.
REF con `/` (nunca `\notas` — parte la línea). UTF-8 sin BOM.
Watchers **parados** (INFORME-R2 §2.c): el custodio es el timbre.

## Pings

---
PING 2026-07-26 00:22 · DE=S · HILO=- · REF=C:/S/scriptorium/sincronia/notas/NOTA-S-2026-07-26-estacion-timbre-v0.md
PING 2026-07-26 00:23 · DE=G · HILO=- · REF=C:/S_LAB/g-sdk/sincronia/notas/NOTA-G-2026-07-26-T-G1-timbre.md
PING 2026-07-26 00:23 · DE=L · HILO=- · REF=C:/S_LAB/skills-library/sincronia/notas/NOTA-L-2026-07-26-estacion-timbre-v0.md
PING 2026-07-26 00:24 · DE=O · HILO=- · REF=C:/S_LAB/o-sdk/sincronia/notas/NOTA-O-2026-07-26-timbre-estacion.md
PING 2026-07-26 00:27 · DE=Z · HILO=- · REF=C:/S_LAB/z-sdk/sincronia/notas/NOTA-Z-2026-07-26-T-Z1-timbre-estacion-v0.md
PING 2026-07-26 00:31 · DE=V · HILO=- · REF=C:/S_LAB/v-sdk/sincronia/notas/NOTA-V-2026-07-26-T-V1-timbre.md
PING 2026-07-26 00:49 · DE=S · HILO=- · REF=C:/S/scriptorium/sincronia/notas/NOTA-S-2026-07-26-mapa-ciudad-agenda-anfitrion.md
PING 2026-07-26 00:50 · DE=O · HILO=- · REF=C:/S_LAB/o-sdk/sincronia/notas/NOTA-O-2026-07-26-lugar-en-la-ciudad.md
PING 2026-07-26 00:53 · DE=V · HILO=- · REF=C:/S_LAB/v-sdk/sincronia/notas/NOTA-V-2026-07-26-modelo-ciudad-y-dudas.md
PING 2026-07-26 01:40 · DE=Z · HILO=- · REF=C:/S_LAB/z-sdk/sincronia/notas/NOTA-Z-2026-07-26-cuantos-modulos-estan-sacados.md
PING 2026-07-26 01:41 · DE=G · HILO=- · REF=C:/S_LAB/g-sdk/sincronia/notas/NOTA-G-2026-07-26-catalogo-ciudad-peticion-V-zigurat.md
PING 2026-07-26 01:48 · DE=L · HILO=- · REF=C:/S_LAB/skills-library/sincronia/notas/NOTA-L-2026-07-26-tui-skills-backlog-234.md
PING 2026-07-26 02:46 · DE=G · HILO=- · REF=C:/S_LAB/g-sdk/sincronia/notas/NOTA-G-2026-07-26-R2-informe-r1.md
PING 2026-07-26 02:47 · DE=L · HILO=- · REF=C:/S_LAB/skills-library/sincronia/notas/NOTA-L-2026-07-26-R2-NEXT.md
PING 2026-07-26 02:48 · DE=O · HILO=- · REF=C:/S_LAB/o-sdk/sincronia/notas/NOTA-O-2026-07-26-R2-next.md
PING 2026-07-26 02:57 · DE=V · HILO=- · REF=C:/S_LAB/v-sdk/sincronia/notas/NOTA-V-2026-07-26-R2-next.md
PING 2026-07-26 02:58 · DE=Z · HILO=- · REF=C:/S_LAB/z-sdk/sincronia/notas/NOTA-Z-2026-07-26-R2-NEXT.md
PING 2026-07-26 05:36 · DE=L · HILO=- · REF=C:/S_LAB/skills-library/sincronia/notas/NOTA-L-2026-07-26-R4-frontera-O.md
PING 2026-07-26 05:37 · DE=G · HILO=- · REF=C:\S_LAB\g-sdk\sincronia\notas\NOTA-G-2026-07-26-R4-frontera-volumes.md
PING 2026-07-26 07:09 · DE=L · HILO=- · REF=C:/S_LAB/skills-library/sincronia/notas/NOTA-L-2026-07-26-R7-GATE-POST-R3.md
PING 2026-07-26 07:11 · DE=G · HILO=- · REF=C:\S_LAB\g-sdk\sincronia\notas\NOTA-G-2026-07-26-R7-gate-z-d6.md
PING 2026-07-26 07:32 · DE=L · HILO=volumes-concepto · REF=C:/S_LAB/skills-library/sincronia/notas/NOTA-L-2026-07-26-H01-compactador.md
PING 2026-07-26 07:33 · DE=S · HILO=volumes-concepto · REF=C:/S/scriptorium/sincronia/notas/NOTA-S-2026-07-26-H01-volumes-concepto.md
