# HANDOFF · CARRIL-V · arranque: Zigurat → `.vsix` lista para probar

| dato | valor |
| ---- | ----- |
| Emisor | carril **S** · ventana vigilante-S (Dionisos) |
| Fecha | 2026-07-26 |
| Vía | **(a) handoff** · GO custodio 2026-07-26 (fundación del carril V con plan mascado; DV-00) |
| Escritura fuera de `C:\S\scriptorium` | solo la SEMILLA pre-repo en `C:\S_LAB\v-sdk\plan\` + carpetas de estación (autorizada por el mismo GO) |
| Borrados ejecutados por S | **cero** |

## Destinatario

**Vigilante del carril V** (ventana nueva en `C:\S_LAB\v-sdk`, vía
custodio). Recibe: mandato + plan ya refinado + decisiones abiertas
con propuesta. La numeración de rondas (`Rn-V`) y el despacho de
workers son del carril; este handoff no los ejecuta.

## Mandato

Fundar el carril V y llevar la extensión Zigurat a **`.vsix` v1
contract-compliant, instalable y con guía de prueba** — «lista para
probar». Al emitir R5-V PASS: **aviso al carril S**, cuyo plan tiene
asentado el tick de validación final por el vigía-S (reactivación
del custodio).

## Lo que ya está hecho (no repetir)

- Carpetas de estación: `C:\S_LAB\vigilancia\v` ·
  `C:\S_LAB\.worktrees\v` — creadas.
- **Plan mascado en lenguaje backlog**: `C:\S_LAB\v-sdk\plan\`
  (`BACKLOG.md` con WP-V01..V11 en 6 olas con CA y deps ·
  `DECISIONES.md` con DV-01..DV-10 §abiertas CON propuesta por
  defecto · `ESTACION.md` calibrada · `BRIEFS/` y `REPORTES/`
  vacíos listos). El borrador original
  (`fundar_v-sdk_zigurat_f84c7f99.plan.md`) queda como semilla de
  referencia — arquitectura válida, superado por el backlog.
- Estas carpetas son PRE-REPO: el primer commit del carril (WP-V01)
  las adopta.

## Reglas que el carril hereda (no negociables)

1. Método skills `>=0.11.0` (v0.7): claim pre-emulación · poda de
   worktrees SIN junctions vivos · eje hostil-omite en
   contrarrevisión · evidencia enmascarada · preflight de identidad
   (nada de commits «Your Name»).
2. Un WP = una rama = un worktree · contrarrevisión independiente en
   contrato/config/empaquetado · gate por ola · solo el orquestador
   escribe BACKLOG · las DV-nn §abiertas las cierra el CUSTODIO.
3. Fronteras: `z-sdk` SOLO LECTURA (se consume por contrato:
   `CONTRATO-IDE-OPT-IN-v1.md` es la fuente de verdad, con su
   cláusula viva de `motivos_deny`) · espejo OASIS SOLO LECTURA ·
   cero obra en `codebase/v-sdk` del atlas · no reabrir U73/U172-177
   · o-sdk fuera.
4. Honestidad `⏳`: lo no desplegado se muestra pendiente, nunca se
   finge.

## Recursos (SOLO LECTURA, con tips actuales)

| recurso | ruta |
| ------- | ---- |
| Contrato IDE v1 (fuente de verdad) | `C:\S_LAB\z-sdk\plan\REPORTES\CONTRATO-IDE-OPT-IN-v1.md` |
| Runtime Z para smokes (DV-07: local basta) | `C:\S_LAB\z-sdk` (tip `a4d5374` · launcher 3050 · linea-editor con flag reparto) |
| Cantera Zigurat (mapa, no código) | `C:\S_LAB\s-sdk\plan\SPRINTS\sprint-game-city\cantera\CIUDAD\00-ZIGURAT\` |
| Código semilla | `escrivivir-co/vscode-alephscript-extension` @ `integration/beta/scriptorium` (espejo local OASIS solo referencia) |
| Cirugía de acoples (censo exacto) | filas de WP-V05/V06 del BACKLOG (ficheros:líneas ya localizados) |
| Método | `@alephscript/skills-scriptorium@0.11.0` en `npm.scriptorium.escrivivir.co` |

## Cierre del handoff

Nota de vuelta del carril V al aceptar (cita a este fichero + SHA de
su primer tip). El tick de validación del vigía-S espera en la Cola
de S el aviso de R5-V PASS.
