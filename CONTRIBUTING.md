<!-- Procedencia: cantera/branding/plantilla-CONTRIBUTING.md
     tip cuadernos 0567a2481db5cc85c8eaac613754f35061587988 · N0-04 / WP-BRAND-1
     Fecha: 2026-07-22 · mundo=aleph-null -->

# Guía de Contribución

> **Versión**: 1.0.0  
> **Última actualización**: 2025-12-22

Gracias por tu interés en contribuir a **Aleph Scriptorium**. Esta guía explica el proceso estándar para participar en el desarrollo.

---

## 📋 Tabla de Contenidos

1. [Código de Conducta](#código-de-conducta)
2. [Cómo Contribuir](#cómo-contribuir)
3. [Tipos de Contribuciones](#tipos-de-contribuciones)
4. [Proceso de Pull Request](#proceso-de-pull-request)
5. [Convención de Commits](#convención-de-commits)
6. [Estructura del Proyecto](#estructura-del-proyecto)
7. [Estilo y Documentación](#estilo-y-documentación)

---

## Código de Conducta

Este proyecto sigue el [Contributor Covenant](https://www.contributor-covenant.org/). Esperamos que todas las interacciones sean respetuosas y constructivas.

**Principios básicos**:
- Respetar la diversidad de perspectivas
- Aceptar críticas constructivas
- Enfocarse en lo mejor para la comunidad
- Mostrar empatía hacia otros contribuidores

---

## Cómo Contribuir

### 1. Fork del Repositorio

```bash
# Clonar tu fork
git clone https://github.com/TU-USUARIO/aleph-scriptorium.git
cd aleph-scriptorium

# Añadir upstream
git remote add upstream https://github.com/escrivivir-co/aleph-scriptorium.git
```

### 2. Crear Rama de Trabajo

```bash
# Actualizar main
git checkout main
git pull upstream main

# Crear rama descriptiva
git checkout -b feature/mi-nueva-funcionalidad
# o
git checkout -b fix/correccion-bug
# o
git checkout -b docs/mejora-documentacion
```

### 3. Desarrollo Local

```bash
# Abrir en VS Code
code .

# Para el sitio web (Jekyll)
cd docs && bundle exec jekyll serve
```

### 4. Commit y Push

```bash
git add .
git commit -m "feat(scope): descripción del cambio"
git push origin feature/mi-nueva-funcionalidad
```

### 5. Abrir Pull Request

1. Ve a tu fork en GitHub
2. Click en "Compare & pull request"
3. Llena la plantilla con la información requerida
4. Espera revisión del equipo

---

## Tipos de Contribuciones

### 🐛 Bug Reports

Si encuentras un bug:

1. Verifica que no exista un issue similar
2. Abre un nuevo issue con la plantilla de bug
3. Incluye pasos para reproducir
4. Describe el comportamiento esperado vs. actual

### ✨ Feature Requests

Para proponer nuevas funcionalidades:

1. Abre un issue con la plantilla de feature
2. Explica el problema que resuelve
3. Describe la solución propuesta
4. Considera alternativas

### 📝 Documentación

Las mejoras de documentación son muy bienvenidas:

- Correcciones de typos
- Mejoras de claridad
- Nuevos ejemplos
- Traducciones

### 🧪 Tests y Validación

- Probar agentes en diferentes escenarios
- Validar plugins
- Reportar inconsistencias

---

## Proceso de Pull Request

### Checklist Antes de Enviar

- [ ] El código sigue el estilo del proyecto
- [ ] Se actualizó la documentación relevante
- [ ] Los commits siguen la convención
- [ ] No hay conflictos con `main`
- [ ] Los tests pasan (si aplica)

### Revisión

1. **Asignación**: Un maintainer revisará tu PR
2. **Feedback**: Puede haber comentarios o solicitudes de cambios
3. **Iteración**: Aplica los cambios solicitados
4. **Merge**: Una vez aprobado, se fusionará

### Tiempos

- **Primera respuesta**: 2-5 días hábiles
- **Revisión completa**: 1-2 semanas
- **Merge**: Tras aprobación

---

## Convención de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<scope>): <descripción corta>

[cuerpo opcional]

[footer: refs #ISSUE-ID]
```

### Tipos

| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Documentación |
| `refactor` | Refactorización |
| `style` | Formato (sin cambio funcional) |
| `chore` | Mantenimiento |
| `archive` | Extracción de material |

### Scopes

**Scriptorium** (`script/`):
- `script/agents` — Agentes
- `script/prompts` — Prompts
- `script/instructions` — Instrucciones
- `script/plugins` — Plugins

**Fundación** (`fund/`):
- `fund/archivo` — Material ARCHIVO
- `fund/caps` — Capítulos
- `fund/plan` — Planificación

### Ejemplos

```bash
# Nueva funcionalidad
feat(script/agents): añadir agente Orangeflag para auditoría de registro

# Corrección
fix(fund/caps): corregir enlace roto en capítulo 1

# Documentación
docs(script/prompts): mejorar ejemplos de uso en extraer-archivar
```

---

## Estructura del Proyecto

```
aleph-scriptorium/
├── .github/                    # Infraestructura Scriptorium
│   ├── agents/                 # Definiciones de agentes
│   ├── prompts/                # Prompts reutilizables
│   ├── instructions/           # Instrucciones de contexto
│   ├── plugins/                # Plugins instalados
│   ├── DEVOPS.md              # Protocolo de desarrollo
│   ├── PLUGINS.md             # Protocolo de plugins
│   └── BACKLOG-SCRIPTORIUM.md # Backlog de tareas
├── ARCHIVO/                    # Contenido doctrinal
│   ├── marco/                 # Marco conceptual
│   ├── diagnostico/           # Diagnóstico
│   ├── justificacion/         # Justificación
│   ├── NOTICIAS/              # Planas periodísticas
│   ├── DISCO/                 # Material de trabajo
│   └── PLUGINS/               # Datos de plugins
├── PROYECTOS/
│   └── FUNDACION/             # Proyecto del texto
├── docs/                       # Sitio web (Jekyll)
└── README.md
```

---

## Estilo y Documentación

### Markdown

- Usar headings jerárquicos (`#`, `##`, `###`)
- Listas con `-` (no `*`)
- Código inline con backticks
- Bloques de código con triple backtick + lenguaje

### Agentes

Los archivos `.agent.md` deben incluir:

1. Frontmatter YAML con metadatos
2. Descripción del rol
3. Handoffs disponibles
4. Ejemplos de uso

### Prompts

Los archivos `.prompt.md` deben incluir:

1. Descripción del propósito
2. Parámetros esperados
3. Ejemplo de invocación

---

## Contacto

- **Issues**: Para bugs y features
- **Discussions**: Para preguntas y debates
- **Email**: No disponible (usar GitHub)

---

## Licencia

Al contribuir, aceptas que tus contribuciones se licencien bajo **AIPL v1.0** (framework) y los términos del proyecto para contenido.

Gracias por contribuir a Aleph Scriptorium 🙏
