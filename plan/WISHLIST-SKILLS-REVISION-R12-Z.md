# Wishlist skills · revisión independiente, semver e idle

Estado: **encolada para planificación**. No autoriza implementación.

## Autoridad y trazabilidad

- **TICK custodio (2026-07-24):** encolar esta wishlist en el plan de
  scriptorium.
- **GO custodio de planificación:** preparar **R12-Z**.
- **Sin GO de implementación de scriptorium:** no despachar workers, marcar
  WPs 🔶, publicar paquetes, modificar consumidores ni tocar gitlinks por este
  asiento.
- Fuente de intake: propuesta del custodio
  `PROPUESTA-CUSTODIO-WISHLIST-SKILLS-REVISION.md`, adaptada a las
  convenciones de este plan.

## Wishlist encolada

### 1. Contrarrevisión selectiva

Para WPs de riesgo, insertar una revisión adversarial independiente entre el
reporte del worker y la aceptación:

```text
prep → worker → revisión adversarial independiente → aceptación → merge
```

Se activa selectivamente para gates, validadores, parsers, manifests, semver,
publicación, CI/Release, auth/seguridad y contratos cruzados. El revisor:

- es distinto del worker, opera read-only e intenta refutar los CA;
- prueba falsos negativos y casos adversariales;
- comprueba dependencias directas declaradas e instalación limpia;
- distingue tests automatizados de evidencia manual;
- comprueba fronteras del diff;
- emite PASS o devolución numerada antes del merge.

La aceptación sigue perteneciendo al orquestador y el gate post-merge sigue
siendo una verificación separada.

### 2. Campos de BRIEF y reporte

BRIEF:

```text
RIESGO_REVISION: normal | independiente
MOTIVO_RIESGO:
CONTRAEVIDENCIA_REQUERIDA:
REVISOR_DISTINTO_WORKER: sí/no
```

Reporte:

```text
CASOS_ADVERSARIALES:
DEPENDENCIAS_DIRECTAS_VERIFICADAS:
INSTALACION_LIMPIA:
TEST_AUTOMATIZADO_VS_EVIDENCIA_MANUAL:
VEREDICTO_REVISOR:
```

### 3. Pulso idle y sensores

- Recoger residuos técnicos observados durante gates y candidatos de fix
  retroactivo.
- Proponer olas sin escribir el BACKLOG hasta GO de planificación.
- Verificar que toda dependencia cargada sea dependencia directa declarada.
- Exigir sensores que prueben propiedad positiva y falsos negativos.
- Automatizar probes documentados o marcarlos explícitamente como manuales.
- Separar gate local determinista de resolución/consulta C8 online.

### 4. Política semver configurable

Políticas por mundo:

```text
exact
caret-semver
major-band: >=M.m.p <(M+1).0.0
```

Para `major-band`, minor y patch quedan flexibles y se conserva un mínimo
conocido. El gate rechaza tags, Git/URL, aliases y rutas. La resolución C8 se
comprueba aparte del análisis local. En paquetes `0.x`, el BRIEF debe advertir
que un salto minor puede ser incompatible y exigir test de integración.

## Handoff copiable · planificación R12-Z

Copiar solo el bloque siguiente al orquestador responsable:

### §WP

Preparar R12-Z como planificación, sin abrir implementación.

Objetivo: convertir la wishlist de revisión independiente, campos de riesgo,
pulso idle, sensores y política semver configurable en WPs pequeños y
verificables.

Salida requerida:

1. WPs con propiedad exclusiva de archivos y orden de integración.
2. Activación selectiva de contrarrevisión para cambios de alto riesgo.
3. Campos nuevos de BRIEF/reporte y evidencia adversarial requerida.
4. Separación explícita entre gate local determinista y C8 online.
5. Dependencias directas declaradas y probes automatizados o marcados
   manuales.
6. Política `major-band: >=M.m.p <(M+1).0.0`, con advertencia y test integrado
   para `0.x`.
7. Pulso idle que eleve fixes retroactivos al custodio antes de modificar el
   BACKLOG.

Autoridad: hay GO para planificar R12-Z. No hay GO de implementación de
scriptorium por este handoff. No despachar workers, publicar, tocar
consumidores ni modificar gitlinks.

## Prueba de ceguera

Cara comprobable: solo el bloque `§WP`.

Vocabulario prohibido:

```text
SOL|z-sdk|mediación|marco|§interna
```

Comando desde la raíz del repo:

```bash
awk '/^### §WP$/{on=1;next}/^## Prueba de ceguera$/{on=0}on' \
  plan/WISHLIST-SKILLS-REVISION-R12-Z.md |
  rg -n -i 'SOL|z-sdk|mediación|marco|§interna'
```

Resultado requerido: `0` coincidencias.
