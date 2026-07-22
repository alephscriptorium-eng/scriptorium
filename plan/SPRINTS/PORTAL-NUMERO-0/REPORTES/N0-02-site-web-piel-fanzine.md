# N0-02 · site-web-piel-fanzine — reporte

| dato | valor |
| ---- | ----- |
| agente | orquestador S · N0-02 (punta a punta post R11-S) |
| fecha | 2026-07-22 |
| rama reporte | `wp/n0-02-site-web-piel-fanzine` (scriptorium) |
| rama obra | `wp/n0-02-site-web-piel-fanzine` → merge `main` skills-library |
| tip skills-library | `64883a9f1d525d6ad14759efa13cb788ab68542c` |
| tag | `v0.6.1` → commit `64883a9…` |
| paquete | `@alephscript/skills-scriptorium@0.6.1` |
| eje(s) CA | III (verdad de piel) + C8 estructural + publish |
| estado propuesto | listo para aceptación |

## Qué se hizo

FAST-TRACK issue #15: elevó la piel fanzine canónica a **asset del skill**
`site-web` (`fanzine.css` + `Layout.vue` + `theme-index.js`), documentó
regla 13 **variables ≠ piel**, añadió CA estructural
`verificar-piel-fanzine.mjs`, actualizó fixture `mundo-limpio`, bump
patch **0.6.1** (bugfix; deja **0.7.0** a BRAND-2). Publish
triangulado tipo IB-21. **No** se tocó `docs/.vitepress/theme/**` del
portal (N0-03). **No** tag `release/numero-0`. **No** bump gitlink
índice (sin GO).

## Archivos tocados (librería)

- `skills/site-web/**` — SKILL, plantillas, scripts, ejemplo, protocolo
- `package.json` / `package-lock.json` / `CHANGELOG.md` / `README.md`
- `docs/**` pins 0.6.1 + `verdad-checks.json`

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
$ skills/site-web/scripts/ceguera.sh 'zeus|SCRIPT_SDK|S_SDK'
ceguera: buscar patron en …/skills/site-web
CEGUERA_OK matches=0

$ git log -1 -p -- skills/site-web | rg -i 'zeus|SCRIPT_SDK|S_SDK'
ceguera git-log: 0
```

### 3) CA estructural (fixture mundo-limpio)

```text
$ npm run docs:build   # scratch desde examples/mundo-limpio
$ node …/verificar-piel-fanzine.mjs --dist docs/.vitepress/dist
[verificar-piel-fanzine] OK: home con stamp/washi/callout y sin shell VP.
```

### 4) Publish + C8 npm view (post-publish)

```text
Publish CI: 29957370542 success (tag v0.6.1 → 64883a9)
gitHead npm = tip librería = CI headSha = 64883a9f1d525d6ad14759efa13cb788ab68542c

$ npm view @alephscript/skills-scriptorium@0.6.1 name version dist.tarball publishConfig.registry gitHead --registry https://npm.scriptorium.escrivivir.co
name = '@alephscript/skills-scriptorium'
version = '0.6.1'
dist.tarball = 'https://npm.scriptorium.escrivivir.co/@alephscript/skills-scriptorium/-/skills-scriptorium-0.6.1.tgz'
publishConfig.registry = 'https://npm.scriptorium.escrivivir.co'
gitHead = '64883a9f1d525d6ad14759efa13cb788ab68542c'

$ npm view @alephscript/skills-scriptorium version --registry https://npm.scriptorium.escrivivir.co
0.6.1
```

Re-chequeo vigía C8 = fuera de este WP (Vigilante-S / R12-S).

## Auto-revisión

- [x] Secrets pulse PRE-tag
- [x] Ceguera 0 PRE-publish
- [x] CA estructural piel OK
- [x] npm view 0.6.1 C8
- [x] Portal theme/** no tocado
- [x] Tag release/numero-0 no sellado
- [x] Gitlink índice no bumpeado
- [x] N0-03 / N0-04 / BRAND-2 no abiertos
- [x] Cero force · PORT copia-release fanzine
