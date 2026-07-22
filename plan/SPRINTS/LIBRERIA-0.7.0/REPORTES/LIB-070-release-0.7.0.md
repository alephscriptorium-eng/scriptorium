# LIB-070 · release 0.7.0 — reporte

| dato | valor |
| ---- | ----- |
| agente | orquestador S · LIB-070 (punta a punta post R16-S) |
| fecha | 2026-07-23 |
| rama reporte | `wp/lib-070-release-0.7.0` (scriptorium) |
| rama obra | `wp/lib-070-release-0.7.0` → merge `main` skills-library |
| checkout obra | **`C:\S_LAB\skills-library`** (clone materializado) |
| tip skills-library | `fb980984e5faa979247afa43054e52cfd4e07c3e` |
| tag | `v0.7.0` → commit `fb98098…` |
| paquete | `@alephscript/skills-scriptorium@0.7.0` |
| eje(s) CA | BRAND-2 · #16 · #17 · lecciones vNext · publish |
| estado propuesto | listo para aceptación / AVISO R17-S |

## Qué se hizo

Release minor **0.7.0**: pack marca parametrizado (BRAND-*), bin
`alephscript-skills-sync` multi-runtime (#16), convención `cantera/` +
layout backstage (#17), lecciones vNext en el método. Publish
triangulado tipo IB-21 / N0-02. **No** se tocaron mundos z·g·s·e·a.
**No** se despachó GO B (SKILLS-EN-MUNDOS). Gitlink índice **no**
bumpeado (sin GO · pendiente documentado).

## Checkout declarado / materializado

| dato | valor |
| ---- | ----- |
| Path exacto | `C:\S_LAB\skills-library` |
| Modo | clone materializado (rename custodio post-R16-S) |
| Path viejo | `C:\S_LAB\S_SDK-skills-library` — **ya no aplica** |
| Pin PRE-obra | `64883a9` (= tip atlas al clonar) |
| Tip POST-publish | `fb98098` |

## Archivos tocados (librería)

- `skills/site-web/**` — pack-marca, Layout/config/fanzine, pesos, fixture
- `skills/vigilancia/**` — BACKSTAGE-GIT · ESTACION · SKILL
- `skills/swarm-orquestacion/**` — lecciones-vnext · SKILL
- `bin/alephscript-skills-sync.mjs` — adapters claude/cursor/openai
- `examples/consumidor-sync/` — consumidor sin script local
- `package.json` / lock / CHANGELOG / README / docs pins 0.7.0

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
$ rg -n -e 'zeus|SCRIPT_SDK|S_SDK' skills/site-web
CEGUERA_OK matches=0

$ git log 64883a9..HEAD -p -- skills/site-web skills/swarm-orquestacion skills/vigilancia bin
ceguera git-log delta: 0
```

### 3) CA alcance

- Pack marca: `reference/pack-marca.md` + Layout/config/fanzine hooks
- Pesos: `scripts/verificar-pesos-web.mjs` (umbral 150KB)
- Favicon head en plantilla + fixture
- ADVERTENCIA licencia ≠ lore documentada
- Bin sync: 3 adapters · `examples/consumidor-sync/` sin script local
- #17: `vigilancia/reference/BACKSTAGE-GIT.md`
- Lecciones vNext: `swarm-orquestacion/reference/lecciones-vnext.md`

### 4) Publish + C8 npm view (post-publish)

```text
Publish CI: 29962749048 success (tag v0.7.0 → fb98098)
gitHead npm = tip librería = CI headSha = fb980984e5faa979247afa43054e52cfd4e07c3e

$ npm view @alephscript/skills-scriptorium@0.7.0 name version dist.tarball publishConfig.registry gitHead --registry https://npm.scriptorium.escrivivir.co
name = '@alephscript/skills-scriptorium'
version = '0.7.0'
dist.tarball = 'https://npm.scriptorium.escrivivir.co/@alephscript/skills-scriptorium/-/skills-scriptorium-0.7.0.tgz'
publishConfig.registry = 'https://npm.scriptorium.escrivivir.co'
gitHead = 'fb980984e5faa979247afa43054e52cfd4e07c3e'

$ npm view @alephscript/skills-scriptorium version --registry https://npm.scriptorium.escrivivir.co
0.7.0
```

Re-chequeo vigía C8 = fuera de este WP (Vigilante-S / R17-S).

## Auto-revisión

- [x] Secrets pulse PRE-tag
- [x] Ceguera 0 PRE-publish
- [x] BRAND-2 · #16 · #17 · lecciones vNext
- [x] npm view 0.7.0 C8 triangulado
- [x] Checkout = `C:\S_LAB\skills-library` declarado
- [x] Mundos z·g·s·e·a **no tocados**
- [x] GO B **no despachado**
- [x] Gitlink índice **pendiente** (sin GO bump · DA-S11)
- [x] Cero force · PORT NO REWRITE
