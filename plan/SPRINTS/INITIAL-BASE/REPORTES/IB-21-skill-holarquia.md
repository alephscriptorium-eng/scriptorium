# IB-21 · skill-holarquia — reporte

| dato | valor |
| ---- | ----- |
| agente | orquestador-consolidación · IB-21 |
| fecha | 2026-07-22 |
| rama reporte | `wp/ib-21-skill-holarquia` (scriptorium) |
| rama obra | `wp/ib-21-skill-holarquia` → merge main skills-library |
| tip skills-library | `6512e27dd11c4d84192d4a66035ede609ba97523` |
| tag | `v0.6.0` → commit `6512e27…` |
| eje(s) CA | publish / cara pública (ceguera + 14) |
| estado propuesto | listo para revisión |

## Qué se hizo

Destilación marco-agnóstica del método de holones (fuente SOLO LECTURA
`codebase/s-sdk/DEVOPS/METODOLOGIA/` + acuerdo tipo LLM.md) al skill
`skills/holarquia/` en `alephscriptorium-eng/S_SDK-skills-library`.
Bump minor DC-22 `0.5.1` → `0.6.0`. Pulso secrets PRE-tag. Ceguera = 0
**antes** de tag/publish. Tag `v0.6.0` → Publish CI VERDE. C8
`npm view` → `0.6.0` en registry canal real.

## Archivos tocados (librería)

- `skills/holarquia/**` — SKILL + reference + example + ceguera
- `package.json` / `CHANGELOG.md` / `README.md` / docs pins + meta catálogo

## Evidencia

### 1) Pulso secrets PRE-tag

```text
$ gh secret list -R alephscriptorium-eng/S_SDK-skills-library
NPM_PASSWORD	2026-07-20T11:50:25Z
NPM_USERNAME	2026-07-20T11:48:31Z

# publish.yml exige: NPM_USERNAME · NPM_PASSWORD  → presentes PRE-tag
```

### 2) Ceguera delta = 0 ANTES de publicar

```text
$ bash skills/holarquia/scripts/comprobar-ceguera.sh
ceguera: 0
raiz: .../skills/holarquia

# (re-chequeo inmediato PRE-tag tras merge a main, tip 6512e27)
ceguera: 0

# delta marco-leaks (zeus|SCRIPT_SDK|S_SDK) en diff del skill: 0
# Nota: ceguera de este skill veta marcas de marco; el vocabulario de
# método (holón/juntura/holarquía) es propio del skill. Otros skills
# del paquete siguen con su patrón completo → ceguera: 0
```

### 3) Publish + C8 npm view (post-publish)

```text
Publish CI: 29947333933 success (tag v0.6.0 → 6512e27)
Docs CI:    29947329592 success

$ npm view @alephscript/skills-scriptorium@0.6.0 name version dist.tarball publishConfig.registry --registry https://npm.scriptorium.escrivivir.co
name = '@alephscript/skills-scriptorium'
version = '0.6.0'
dist.tarball = 'https://npm.scriptorium.escrivivir.co/@alephscript/skills-scriptorium/-/skills-scriptorium-0.6.0.tgz'
publishConfig.registry = 'https://npm.scriptorium.escrivivir.co'

$ npm view @alephscript/skills-scriptorium version --registry https://npm.scriptorium.escrivivir.co
0.6.0
```

Re-chequeo vigía C8 = fuera de este WP (Vigilante-S / R7-S).

### 4) Contenido del skill (CA agente fresco)

`SKILL.md` autocontenido: dos leyes · junturas · plantilla
(`reference/plantilla-holon.md`) · DS-5 · acuerdo agente
(memoria→codebase · no inventar observaciones · notaría).

## Auto-revisión

- [x] Secrets pulse PRE-tag
- [x] Ceguera 0 PRE-publish
- [x] npm view 0.6.0 C8
- [x] No IB-23
- [x] Cero force · PORT destilación
