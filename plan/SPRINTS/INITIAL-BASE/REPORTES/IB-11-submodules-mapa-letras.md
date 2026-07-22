# IB-11 · submodules-mapa-letras — reporte

| dato | valor |
| ---- | ----- |
| agente | worker swarm · IB-11 |
| fecha | 2026-07-22 |
| rama | `wp/ib-11-submodules-mapa-letras` |
| commits | `<pendiente tip commit obra>` |
| eje(s) CA | III (auditoría / layout · DS-5) |
| estado propuesto | listo para revisión |

## Qué se hizo

Sembrados 6 gitlinks bajo `codebase/` (mapa z·g·s·e·o·a) apuntando a
tips remotos reales. DS-5: solo gitlinks + `.gitmodules` — cero volcado
de árboles. o-sdk pin post IB-01
`632ee2a2bbb10a19efbc57b2f0a847dd04333ff9`. a-sdk = remoto
`escrivivir-co/aleph-scriptorium` (default branch
`integration/beta/scriptorium`; no existe bajo `alephscriptorium-eng/`).
Retirado `codebase/.gitkeep` (sustituido por dirs reales). README:
cerrada nota `<pendiente> IB-11` + tabla mapa.

## Archivos tocados

- `.gitmodules` — creado (6 entradas + branch tracking)
- `codebase/{z,g,s,e,o,a}-sdk` — gitlinks mode `160000`
- `codebase/.gitkeep` — eliminado
- `README.md` — mapa de letras + comando submodule update
- `plan/SPRINTS/INITIAL-BASE/REPORTES/IB-11-submodules-mapa-letras.md` —
  este reporte

## Evidencia

> Worktree `C:\S\.worktrees\wp-ib-11` · rama
> `wp/ib-11-submodules-mapa-letras`.

### 1) Seis gitlinks (mode 160000)

```text
160000 e5573f8e5b248aff6e19aee5cd51b0fe7b086c1b 0	codebase/a-sdk
160000 90e53544e8b78722ec8e22230740bfa107fa2cc8 0	codebase/e-sdk
160000 d1783646f4364fce49ae9b421c863bc51bfad4aa 0	codebase/g-sdk
160000 632ee2a2bbb10a19efbc57b2f0a847dd04333ff9 0	codebase/o-sdk
160000 7db1d4941267d857d93ab4005dcc4ecd0e49ecfb 0	codebase/s-sdk
160000 d0d9de1d3af0e75a9f5d7d7b4c2b4d3762beb90c 0	codebase/z-sdk
count=6
```

### 2) `git submodule status` limpio

```text
 e5573f8e5b248aff6e19aee5cd51b0fe7b086c1b codebase/a-sdk (v1.0.0-beta.3-440-ge5573f8)
 90e53544e8b78722ec8e22230740bfa107fa2cc8 codebase/e-sdk (heads/main)
 d1783646f4364fce49ae9b421c863bc51bfad4aa codebase/g-sdk (startpack-ciudad-v0.1.0-14-gd178364)
 632ee2a2bbb10a19efbc57b2f0a847dd04333ff9 codebase/o-sdk (heads/main)
 7db1d4941267d857d93ab4005dcc4ecd0e49ecfb codebase/s-sdk (heads/main)
 d0d9de1d3af0e75a9f5d7d7b4c2b4d3762beb90c codebase/z-sdk (@zeus/embajador-kit@0.1.3)
```

Prefijos `+` / `-` / `U` = ausentes (espacio = sync).

### 3) Tips vs `ls-remote` (PRE-add)

| letra | url | branch | tip |
| ----- | --- | ------ | --- |
| z-sdk | alephscriptorium-eng/Z_SDK | main | `d0d9de1d3af0e75a9f5d7d7b4c2b4d3762beb90c` |
| g-sdk | alephscriptorium-eng/Z_SDK-games-library | main | `d1783646f4364fce49ae9b421c863bc51bfad4aa` |
| s-sdk | alephscriptorium-eng/S_SDK | main | `7db1d4941267d857d93ab4005dcc4ecd0e49ecfb` |
| e-sdk | alephscriptorium-eng/E_SDK | main | `90e53544e8b78722ec8e22230740bfa107fa2cc8` |
| o-sdk | alephscriptorium-eng/O_SDK | main (= upgrade/oasis-0.8.8) | `632ee2a2bbb10a19efbc57b2f0a847dd04333ff9` |
| a-sdk | escrivivir-co/aleph-scriptorium | integration/beta/scriptorium | `e5573f8e5b248aff6e19aee5cd51b0fe7b086c1b` |

### 4) `.gitmodules`

```text
[submodule "codebase/z-sdk"] … Z_SDK.git · branch = main
[submodule "codebase/g-sdk"] … Z_SDK-games-library.git · branch = main
[submodule "codebase/s-sdk"] … S_SDK.git · branch = main
[submodule "codebase/e-sdk"] … E_SDK.git · branch = main
[submodule "codebase/o-sdk"] … O_SDK.git · branch = main
[submodule "codebase/a-sdk"] … aleph-scriptorium.git · branch = integration/beta/scriptorium
```

### 5) DS-5 / eje III

Solo gitlinks + metadatos. Ningún árbol de sdk copiado al índice del
workspace. `codebase/codebase` = False.

## Auto-revisión (PRACTICAS)

- [x] Diff dentro de `ALCANCE_DIFF` (codebase · .gitmodules · README · reporte)
- [x] Cero arqueología o-sdk (§F3a): tip remoto post IB-01, sin excavación
- [x] Vetos: no borrado desechable pendiente; no network-sdk; PORT
- [x] CA: 6 gitlinks + status limpio
- [x] Worker no edita BACKLOG

## Hallazgos fuera de alcance

- `alephscriptorium-eng/aleph-scriptorium` **no existe** (404). Remoto
  real = `escrivivir-co/aleph-scriptorium` (PORT del nombre del backlog).
  Si el custodio quiere mirror bajo la org eng → nota ops / forense;
  no bloquea CA de apuntar a tip remoto real.
- IB-12 (skills + estación) **no** despachado.

## Dudas / bloqueos

Ninguno bloqueante para CA IB-11.
