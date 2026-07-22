# N0-03 · Re-pielado portal aleph-null — reporte

| dato | valor |
| ---- | ----- |
| agente | orquestador S (obra en worktree; sin subagente vigía) |
| fecha | 2026-07-22 |
| rama | `wp/n0-03-repielado-portal` |
| worktree | `C:\S\.worktrees\wp-n0-03` |
| tip PRE 🔶 | `ddbea1a` (= origin/main · R12-S PASS) |
| tip despacho 🔶 | `1bd7998` (RAIZ-C-S ciclo vida + brief/BACKLOG) |
| obra | `985eaa9` |
| merge | `72e1330` |
| paquete | `@alephscript/skills-scriptorium@0.6.1` |
| gitlink skills-library | `64883a9` (= tip v0.6.1) |
| estado | ✅ aceptado · AVISO R13-S emitido |

## Qué se hizo

Re-pielado del portal consumiendo el skill publicado en N0-02:

1. Bump `devDependencies.@alephscript/skills-scriptorium` **0.5.1 → 0.6.1**
   + `npm install` + `npm run skills:sync` (espejo `.claude/skills/` @ 0.6.1).
2. Copia-release de plantillas piel fanzine a `docs/.vitepress/theme/`:
   `fanzine.css` + `Layout.vue` + `index.js` + `custom.css` (tokens ≠ piel).
3. Frontmatter mínimo en `docs/index.md` para activar piel (`layout: home`,
   `piel: fanzine`, stamp/callout…). **Body N0-01 idéntico** a `ddbea1a`
   (verificado byte-a-byte tras strip de frontmatter).
4. Gitlink `codebase/skills-library` → `64883a9` (GO + DA-S11; pin v0.6.1).
5. CA local: `docs:build` + `docs:verificar` + `verificar-piel-fanzine`.

**No** se tocó N0-04 / BRAND-2 / tag `release/numero-0`. **No** se finge
C8 post-deploy Pages (notas para R13-S abajo).

## Archivos tocados

- `package.json` / `package-lock.json` — pin 0.6.1
- `.claude/skills/**` — espejo regenerado (`skills:sync`)
- `docs/.vitepress/theme/**` — piel fanzine real
- `docs/index.md` — solo frontmatter (body intacto)
- `codebase/skills-library` — gitlink `64883a9`
- `plan/SPRINTS/PORTAL-NUMERO-0/REPORTES/N0-03-repielado-portal.md` — este

(Gobierno 🔶 ya en main `1bd7998`: brief · BACKLOG · `plan/RAIZ-C-S.md`
línea ciclo vida `S_SDK-skills-library/`.)

## Evidencia CA

### 1) Pin + sync

```text
package.json: "@alephscript/skills-scriptorium": "0.6.1"
package-lock: version 0.6.1
  resolved https://npm.scriptorium.escrivivir.co/@alephscript/skills-scriptorium/-/skills-scriptorium-0.6.1.tgz
npm run skills:sync → 5 skills · README @alephscript/skills-scriptorium@0.6.1
```

### 2) docs:build + docs:verificar — VERDE

```text
vitepress v1.6.4
build complete in 9.13s
build exit=0

[verificar-sitio] dist=docs/.vitepress/dist base=/ html=7
  enlaces internos rotos: 0
  anclas rotas:           0
  externos revisados:     14 (warning: 0)
[verificar-sitio] OK
verificar exit=0
```

### 3) CA estructural piel (verificar-piel-fanzine) — VERDE local

```text
[verificar-piel-fanzine] home=docs/.vitepress/dist/index.html
  clases piel presentes: stamp, washi, callout
  shell VP ausente:      sí
[verificar-piel-fanzine] OK: home con stamp/washi/callout y sin shell VP.
piel exit=0
```

Checks booleanos sobre `dist/index.html`:

| patrón | resultado |
| ------ | --------- |
| `stamp` | PRESENT |
| `washi` | PRESENT |
| `callout` | PRESENT |
| `class="Layout"` | absent |
| `VPNavBar` / `VPNav` / `VPSidebar` | absent |
| frase body N0-01 en HTML | sí (`portal índice del workspace scriptorium`) |

### 4) Contenido N0-01 + CNAME

```text
docs/index.md body == git show ddbea1a:docs/index.md body → true
docs/public/CNAME = aleph-null.escrivivir.co (intact)
```

### 5) Gitlink

```text
git ls-files -s codebase/skills-library
160000 64883a9f1d525d6ad14759efa13cb788ab68542c 0	codebase/skills-library
describe --tags --exact-match → v0.6.1
```

### 6) C8 post-deploy — NO fingido (notas R13-S)

```text
C8 deploy Pages: ⟨pendiente re-chequeo Vigilante-S · R13-S⟩
pedido al vigía (tras merge + publish Pages):
  · 5 rutas 200: / · /constelacion · /metodo · /ciudad · /cola
  · título portada
  · home publicada: clases stamp/washi/callout PRESENTES
  · shell DefaultTheme (Layout / VPNav*) AUSENTE en home
  · copy N0-01 intacto (piel no pisa body)
orquestador: solo evidencia local/build arriba; cero curl inventado
```

## Comandos ejecutados

```text
npm install                         → exit 0 (pin 0.6.1)
npm run skills:sync                 → exit 0
npm run docs:build                  → exit 0
npm run docs:verificar              → exit 0
node …/verificar-piel-fanzine.mjs   → exit 0
git submodule update --init codebase/skills-library
git -C codebase/skills-library checkout 64883a9 → v0.6.1
```

## Bloqueos / dudas

Ninguno. Listo para merge post-aceptación orquestador + AVISO R13-S.
**No** abrir N0-04 ni tag en este acto.
