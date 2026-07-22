# IB-13 · web-dominios — reporte

| dato | valor |
| ---- | ----- |
| agente | worker swarm · IB-13 |
| fecha | 2026-07-22 |
| rama | `wp/ib-13-web-dominios` |
| commits | `0354884032a6461d712b05cafa41fb8796b34880` (obra) · tip tras este reporte |
| eje(s) CA | III (layout docs) + checklist DNS (gate externo) |
| estado propuesto | listo para revisión · **parcial** (DNS bloquea Pages/redirect) |

## Qué se hizo

Montado el esqueleto VitePress del site-web overall (`aleph-null`) bajo
`docs/`, con CNAME `aleph-null.escrivivir.co`, scripts `docs:dev` /
`docs:build` / `docs:verificar`, dep `vitepress@1.6.4`, workflow
`.github/workflows/docs.yml` (protocolo ghpages del skill site-web
0.5.1) y gitignore de `docs/.vitepress/dist/` + `cache/`.

No se tocó `.claude/skills/` ni calibración de estación (territorio
IB-12). No se editó BACKLOG. No se mergeó a main.

**No se finge** Pages vivo ni redirect verificado: gate DNS externo
bloqueado con evidencia literal abajo. CA in-repo (`docs:build`) verde.

## Archivos tocados

- `docs/.vitepress/config.mjs` — creado: config VitePress + guard `DOCS_BASE` + back-links B11
- `docs/.vitepress/theme/index.js` — creado: tema default + CSS
- `docs/.vitepress/theme/custom.css` — creado: piel zine (copia-release skill)
- `docs/index.md` — creado: portada aleph-null
- `docs/proyecto.md` — creado: página Proyecto / DevOps (URLs en footer)
- `docs/public/CNAME` — creado: `aleph-null.escrivivir.co` (DA-S02)
- `docs/.gitkeep` — borrado: sustituido por contenido real
- `.github/workflows/docs.yml` — creado: build + verificar + deploy Pages (solo main)
- `package.json` — modificado: scripts docs:* + vitepress 1.6.4 (skills:ceguera intacto; skills:sync no presente en tip)
- `package-lock.json` — modificado: lock de vitepress y transitive
- `.gitignore` — modificado: `docs/.vitepress/dist/` + `cache/` (frágil #5)
- `plan/SPRINTS/INITIAL-BASE/REPORTES/IB-13-web-dominios.md` — creado: este reporte

## Evidencia

> Salida literal. Worktree `C:\S\.worktrees\wp-ib-13`.

### 1) docs:build — VERDE (exit 0)

```text
> docs:build
> node ./node_modules/vitepress/bin/vitepress.js build docs

  vitepress v1.6.4

✓ building client + server bundles...
✓ rendering pages...
build complete in 6.81s.

BUILD_EXIT=0
```

### 2) docs:verificar — VERDE (exit 0)

```text
> docs:verificar
> node .../verificar-sitio.mjs --dist docs/.vitepress/dist --base /

[verificar-sitio] dist=docs/.vitepress/dist base=/ html=3
  enlaces internos rotos: 0
  anclas rotas:           0
  externos revisados:     6 (warning: 2)
  ⚠ EXTERNO ERR_TLS_CERT_ALTNAME_INVALID https://aleph-null.escrivivir.co  (en index.html)
  ⚠ EXTERNO 404 https://github.com/alephscriptorium-eng/scriptorium/blob/main/CHANGELOG.md  (en index.html)

[verificar-sitio] OK: enlaces internos y anclas resuelven; verdad de contenido consistente.
VERIFICAR_EXIT=0
```

Dist incluye `CNAME` = `aleph-null.escrivivir.co`.

### 3) Pages en aleph-null — BLOQUEADO (gate DNS externo)

Protocolo exige CNAME DNS → `<org>.github.io`. Estado actual:

```text
Resolve-DnsName aleph-null.escrivivir.co
  Type=CNAME  NameHost=escrivivir.co
  escrivivir.co A → 192.0.78.24 / 192.0.78.25
  SOA NameAdministrator: hostmaster.wordpress.com

curl.exe https://aleph-null.escrivivir.co/
  curl: (60) schannel: SNI or certificate check failed:
  SEC_E_WRONG_PRINCIPAL (0x80090322)

curl.exe -k https://aleph-null.escrivivir.co/
  http=301 redirect=http://escrivivir.co/
```

CNAME en repo OK (`docs/public/CNAME`). DNS **no** apunta a GitHub
Pages; cert no cubre el host. Pages vivo = `<pendiente tick DNS>`.

### 4) Redirect scriptorium → pub — BLOQUEADO (C8 / gate DNS)

```text
Resolve-DnsName scriptorium.escrivivir.co
  Type=A  IPAddress=92.243.24.163

curl.exe -D - https://scriptorium.escrivivir.co/
  HTTP/1.1 404 Not Found
  Via: 1.1 Caddy
  (sin header Location hacia https://pub.escrivivir.co/)

curl.exe https://pub.escrivivir.co/
  http=200
```

Redirect verificado C8 = `<pendiente tick DNS custodio>`.

### 5) Eje III — layout docs / dedup

- Artefacto canónico de dominio site: **una** línea en
  `docs/public/CNAME` (= DA-S02).
- `BACK.pages` en config cita la misma URL (B11; no segunda definición
  DNS).
- Workflow comenta el dominio; no redefine el CNAME.
- Sin segundo pipeline Pages paralelo en el repo.

## Auto-revisión (PRACTICAS del mundo — con honestidad)

- [x] Diff solo dentro de `ALCANCE_DIFF` (docs/** · package.json/lock ·
  .github/workflows/docs.yml · reporte · .gitignore dist): sí
- [x] Cero árboles ajenos sin procedencia: tema/CSS = copia-release skill
  site-web (cabecera de procedencia)
- [x] Sellos con fuente: DA-S02 citado; dominio = CNAME + DECISIONES
- [x] Sin fingir Pages/redirect: BLOQUEADO con evidencia dig/nslookup/curl
- [x] Eje III evidenciado (CNAME único + layout docs)
- [x] Gates ejecutados de verdad: docs:build + docs:verificar exit 0
- [x] Commits convencionales: sí (tras este reporte)
- [x] No tocado IB-12 (`.claude/skills/`, estación)
- [x] skills:sync no estaba en tip; no se eliminó nada ajeno

## Hallazgos fuera de alcance

- Tick DNS custodio: CNAME `aleph-null` →
  `alephscriptorium-eng.github.io` (u org.github.io vigente) + Enforce
  HTTPS en Pages.
- Tick DNS redirect: `scriptorium.escrivivir.co` →
  `https://pub.escrivivir.co/` (hoy A→92.243.24.163 + 404).
- `CHANGELOG.md` ausente en repo (warning externo de verificar; no
  bloquea).

## Dudas / bloqueos

Gate DNS externo: bloquea CA final de Pages + redirect. Obra in-repo
lista para revisión parcial.

---

## Revisión del orquestador

_(la rellena el orquestador: aceptado ✅ / devuelto con lista numerada)_
