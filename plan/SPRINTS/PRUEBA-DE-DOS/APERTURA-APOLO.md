# APERTURA · ventana Apolo (carril librería)

Hoja de apertura preparada por el orquestador-S (2026-07-23). El
custodio abre la ventana; Apolo arranca leyendo esto y su propio plan.

## Identidad

| campo | valor |
| ----- | ----- |
| ventana | **Apolo** |
| carril | librería de skills (`@alephscript/skills-scriptorium`) |
| checkout de obra | `C:\S_LAB\skills-library` (declarado en `plan/MAPA-TALLER.md` · DA-S15) |
| territorio de escritura | SOLO su checkout — **NO escribe en `C:\S\scriptorium`** |

## Lectura previa

1. README / plan del propio checkout `C:\S_LAB\skills-library` — ahí
   vive su gobierno de obra.
2. El gobierno S (`C:\S\scriptorium\plan/`) **solo se cita**, no se
   edita desde esa ventana.

## Menú de trabajo (con procedencia)

| # | trabajo | procedencia | estado de decisión |
| - | ------- | ----------- | ------------------ |
| a | **GO al parser**: flexibilizar el parser de `proyectar-backlog.mjs` del paquete + fallar ruidoso ante IDs mixtos | DA-S17 (`plan/DECISIONES.md`) + cola de `plan/BACKLOG.md` | GO dado; encolado, obra en la librería |
| b | **Spike `operador-rooms`**: valorar skill para el operador-admin de un nodo rooms — emisión de peercard vía `issuePeerCard`/`onPeerCard` de `@zeus/authority-kit`, ACL, salud del nodo | PD-02 de este sprint · fuente `playground/prueba-de-dos/reference/PEERCARD.md` | **GO custodio 2026-07-23 (DA-S20)** — obra en la librería |
| c | **Intake del skill `prueba-de-dos`**: valorar su paso de boilerplate del workspace (`playground/prueba-de-dos/`) a skill del paquete en la librería | PD-01 de este sprint | **GO custodio 2026-07-23 (DA-S20)** — obra en la librería |
| d | **Modo de lenguaje dual al skill `vigilancia`**: incorporar el contrato de salida dual — TODA salida/informe se emite por duplicado: (1) cara en llano, sin jerga de backlog, explicando qué hace cada ola/encolada; (2) cara scrum estricta para orquestadores, en bloque de código markdown copiable (contenedor con botón de copia en IDEs). Patrón de referencia existente: `estacion-viva/reference/SALIDA-DUAL.md` del paquete | mandato custodio 2026-07-23 | encolado — obra en la librería |
| e | **Valoración merge/deslinde `vigilancia` ↔ `estacion-viva`**: solape real = watcher (ambos skills traen uno); deslinde conceptual = `vigilancia` es skill de ROL (rondas/gates, worktrees/locks, territorio==mapa) y `estacion-viva` es skill de VENTANA/estación (boot, bitácora, juego, salida dual). Apolo prepara valoración con opciones: merge total / extraer pieza watcher común / solo documentar frontera | pregunta custodio 2026-07-23 | **CERRADA 2026-07-23 (DA-S20): NO merge** — skills separados; frontera documentable dentro de (d) |

## Reglas de cierre

- Bumps de gitlink del atlas (`codebase/*`) = **GO custodio** (DA-S11).
- Su gate lo pide por **AVISO en su propio plan** (el del checkout), no
  en el gobierno S.
