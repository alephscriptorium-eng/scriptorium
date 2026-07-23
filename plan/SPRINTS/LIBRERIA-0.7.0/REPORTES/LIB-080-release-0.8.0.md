# LIB-080 · release 0.8.0 — reporte

| dato | valor |
| ---- | ----- |
| agente | orquestador S · LIB-080 (punta a punta post R21-S + R22-S) |
| fecha | 2026-07-23 |
| rama reporte | `wp/lib-080-release-0.8.0` (scriptorium) |
| rama obra | `wp/lib-080-piel-mapas-0.8.0` → merge `main` skills-library |
| checkout obra | **`C:\S_LAB\skills-library`** (declarado) |
| tip skills-library | `cc59e4e6ed1aa4fa3848dccaedd2bc02c6d3c6da` |
| tag | `v0.8.0` → commit `cc59e4e…` |
| paquete | `@alephscript/skills-scriptorium@0.8.0` |
| eje(s) CA | #18 · #19 · publish triangulado |
| estado propuesto | listo para aceptación / AVISO R23-S |

## Qué se hizo

Release minor **0.8.0**: bundle issues **#18** (piel declarada
`familia-vp` DEFAULT · `fanzine` OPT-IN · CA «piel DECLARADA renderiza»
· CA contraste · fix composición VP) + **#19** (mapas
MAPA-RAIZ/REPO/TALLER en `montar-plan` + pulso territorio==mapa en
vigilancia). Publish triangulado. **No** ola consumo 0.7.0→0.8.0 en
workspace/mundos. Gitlink índice **no** bumpeado (mandato sin GO bump;
pendiente documentado). Issues **#18** y **#19** cerrados con ref al
release.

## Fleco R22 (gobierno)

CHANGELOG scriptorium ya llevaba la nota
«Post-tag · corrección de piel (DA-S18 · 2026-07-23)» + WP-REST-SHELL ✅
— **sin línea nueva** (ya asentada PRE-obra).

## Checkout declarado

| dato | valor |
| ---- | ----- |
| Path exacto | `C:\S_LAB\skills-library` |
| Pin PRE-obra | `fb980984e5faa979247afa43054e52cfd4e07c3e` (0.7.0) |
| Tip POST-publish | `cc59e4e6ed1aa4fa3848dccaedd2bc02c6d3c6da` |

## Archivos tocados (librería)

- `skills/site-web/**` — familia-vp · regla 13 · verificar-piel ·
  verificar-contraste · Layout opt-in · fanzine composición
- `skills/swarm-orquestacion/**` — montar-plan + plantillas MAPA-*
- `skills/vigilancia/**` — ESTACION pulso territorio==mapa + script
- `package.json` / lock / CHANGELOG / README / docs pins 0.8.0

## Evidencia

### 1) Pulso secrets PRE-tag

```text
$ gh secret list -R alephscriptorium-eng/S_SDK-skills-library
NPM_PASSWORD	2026-07-20T11:50:25Z
NPM_USERNAME	2026-07-20T11:48:31Z
```

### 2) Ceguera delta = 0 ANTES de publicar

```text
$ rg -n -e 'zeus|SCRIPT_SDK|S_SDK' skills/site-web
CEGUERA_OK matches=0
(+ comprobar-ceguera vigilancia / swarm-orquestacion = 0)
```

### 3) CA alcance

- #18: `familia-vp.css` DEFAULT · fanzine OPT-IN · `verificar-piel.mjs`
  · `verificar-contraste-piel.mjs` · remap composición VP
- #19: montar-plan genera tres MAPA-* con REGLA al pie ·
  `verificar-territorio-mapa.sh` + ritual en ESTACION.md

### 4) Publish + C8 npm view (post-publish)

```text
Publish CI: 29968471387 success (tag v0.8.0 → cc59e4e)
gitHead npm = tip librería = CI headSha = cc59e4e6ed1aa4fa3848dccaedd2bc02c6d3c6da

$ npm view @alephscript/skills-scriptorium@0.8.0 name version dist.tarball publishConfig.registry gitHead --registry https://npm.scriptorium.escrivivir.co
name = '@alephscript/skills-scriptorium'
version = '0.8.0'
dist.tarball = 'https://npm.scriptorium.escrivivir.co/@alephscript/skills-scriptorium/-/skills-scriptorium-0.8.0.tgz'
publishConfig.registry = 'https://npm.scriptorium.escrivivir.co'
gitHead = 'cc59e4e6ed1aa4fa3848dccaedd2bc02c6d3c6da'

$ npm view @alephscript/skills-scriptorium version --registry https://npm.scriptorium.escrivivir.co
0.8.0
```

Issues cerrados:
- https://github.com/alephscriptorium-eng/S_SDK-skills-library/issues/18
- https://github.com/alephscriptorium-eng/S_SDK-skills-library/issues/19

## Auto-revisión

- [x] Secrets pulse PRE-tag
- [x] Ceguera 0 PRE-publish
- [x] #18 · #19 en tip
- [x] npm view 0.8.0 C8 triangulado
- [x] Checkout = `C:\S_LAB\skills-library` declarado
- [x] Sin ola consumo workspace/mundos
- [x] Gitlink índice **pendiente** (sin GO bump · pin aún `fb98098`)
- [x] Cero force · PORT NO REWRITE · WP-REST-SHELL no reabierto
