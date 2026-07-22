# IB-12 · skills-estacion — reporte

| dato | valor |
| ---- | ----- |
| agente | worker consolidado · IB-12 (orquestador tras stall) |
| fecha | 2026-07-22 |
| rama | `wp/ib-12-skills-estacion` |
| commits | `d9ffc10753309ea3a2f4310ce1b1fce9c5a4578c` |
| eje(s) CA | III (auditoría / layout · calibración) |
| estado propuesto | listo para revisión |

## Qué se hizo

Añadido `skills:sync` (PORT del patrón o-sdk) + espejo `.claude/skills/`
de `@alephscript/skills-scriptorium@0.5.1` (4 skills; sin `_plantilla`).
Calibración de estación en `plan/ESTACION.md` (OUT_DIR + BACKSTAGE_GIT +
watcher whitelist). Watcher one-shot arrancó y limpió PID. No se tocó
`docs/**` (territorio IB-13).

## Archivos tocados

- `scripts/sync-claude-skills.mjs` — creado: sync espejo
- `package.json` — modificado: script `skills:sync`
- `.claude/skills/**` — creado: espejo materializado (4 skills + README)
- `plan/ESTACION.md` — creado: calibración OUT_DIR / BACKSTAGE_GIT / watcher
- `.gitignore` — modificado: OUT_DIR local + excepción espejo skills
- `plan/SPRINTS/INITIAL-BASE/REPORTES/IB-12-skills-estacion.md` — creado

## Evidencia

### 1) npm view C8 (registry canal real)

```text
name = '@alephscript/skills-scriptorium'
version = '0.5.1'
dist.tarball = 'https://npm.scriptorium.escrivivir.co/@alephscript/skills-scriptorium/-/skills-scriptorium-0.5.1.tgz'
```

`.npmrc` scope: `@alephscript:registry=https://npm.scriptorium.escrivivir.co`

### 2) espejo íntegro

```text
SRC=estacion-viva,site-web,swarm-orquestacion,vigilancia
MIR=estacion-viva,site-web,swarm-orquestacion,vigilancia
EQUAL=True
npm run skills:sync → 4 skills -> .claude/skills (@alephscript/skills-scriptorium@0.5.1)
```

### 3) watcher arranca (ONCE=1)

```text
WORLD_ROOT=/c/S/.worktrees/wp-ib-12 OUT_DIR=/c/S/vigilancia ONCE=1
bash .claude/skills/estacion-viva/scripts/watcher-sesion.sh
exit=0
[2026-07-22 19:24:09] sesion=1 skills_mat=5 residuo_filtrado=0 locks=''
pidfile cleaned OK
```

### 4) calibración en plan

`plan/ESTACION.md`: OUT_DIR=`C:\S\vigilancia` · BACKSTAGE_GIT=
`scriptorium-cuadernos` / `scriptorium-vigilancia` · whitelist documentada.

## Auto-revisión (PRACTICAS)

- [x] Diff solo ALCANCE_DIFF (sin docs/** ni workflows Pages)
- [x] Sync PORT con procedencia o-sdk citada
- [x] Sellos con evidencia literal
- [x] Calibración en plan, no en el skill
- [x] Gates ejecutados de verdad
- [x] Commits convencionales
- [x] Sin volcar cuadernos al público

## Hallazgos fuera de alcance

- Nests a-sdk bajo `--recursive` → nota forense (§F3a); no excavado.
- README raíz aún cita `--recursive` (desfase docs; cola ops).

## Dudas / bloqueos

Ninguno para CA de IB-12.

---

## Revisión del orquestador

_(pendiente)_
