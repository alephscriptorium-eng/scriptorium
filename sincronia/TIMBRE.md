# TIMBRE · carril S (Scriptorium)

Campanilla — no buzón. Contrato: `PROTOCOLO.md` §7.
Append-only de líneas `PING …`. Dueño puede rotar a `notas/timbre-<fecha>.md`.

Formato (ejemplo indentado a propósito — no debe matchear `^PING `):

    PING <YYYY-MM-DD HH:MM> · DE=<X> · HILO=<id|-> · REF=<ruta absoluta de la nota>

Append con `printf '%s\n' '…'` (comillas simples) o `Add-Content -Encoding utf8`.
Rutas Windows: preferir `/` en el REF, o escapar — `\n` dentro de `\notas` parte la línea.
UTF-8 sin BOM. Nadie reescribe el fichero entero salvo el dueño al rotar/reparar.

## Pings

---
PING 2026-07-26 00:22 · DE=S · HILO=- · REF=C:/S/scriptorium/sincronia/notas/NOTA-S-2026-07-26-estacion-timbre-v0.md
PING 2026-07-26 00:23 · DE=G · HILO=- · REF=C:/S_LAB/g-sdk/sincronia/notas/NOTA-G-2026-07-26-T-G1-timbre.md
PING 2026-07-26 00:23 · DE=L · HILO=- · REF=C:/S_LAB/skills-library/sincronia/notas/NOTA-L-2026-07-26-estacion-timbre-v0.md
PING 2026-07-26 00:24 · DE=O · HILO=- · REF=C:/S_LAB/o-sdk/sincronia/notas/NOTA-O-2026-07-26-timbre-estacion.md
PING 2026-07-26 00:27 · DE=Z · HILO=- · REF=C:/S_LAB/z-sdk/sincronia/notas/NOTA-Z-2026-07-26-T-Z1-timbre-estacion-v0.md
PING 2026-07-26 00:31 · DE=V · HILO=- · REF=C:/S_LAB/v-sdk/sincronia/notas/NOTA-V-2026-07-26-T-V1-timbre.md
PING 2026-07-26 00:49 · DE=S · HILO=- · REF=C:/S/scriptorium/sincronia/notas/NOTA-S-2026-07-26-mapa-ciudad-agenda-anfitrion.md
