# IB-13 · web-dominios — reporte

| dato | valor |
| ---- | ----- |
| agente | worker consolidado · IB-13 (orquestador tras stall) |
| fecha | 2026-07-22 |
| rama | `wp/ib-13-web-dominios` |
| commits | `<pendiente tip tras commit>` |
| eje(s) CA | III (layout docs) + checklist DNS (gate externo) |
| estado propuesto | listo para revisión · **parcial** (DNS bloquea Pages/redirect) |

## Qué se hizo

Esqueleto VitePress en `docs/` (aleph-null), CNAME, scripts `docs:*`,
workflow Pages, `docs:build` + `docs:verificar` verdes. No se tocó
`.claude/skills/` ni calibración estación (territorio IB-12).

**No se finge** Pages vivo ni redirect: tick DNS custodio pendiente /
incorrecto (evidencia abajo).

## Archivos tocados

- `docs/**` — creado: site-web overall (index, proyecto, theme, CNAME)
- `package.json` / `package-lock.json` — vitepress 1.6.4 + scripts docs
- `.github/workflows/docs.yml` — pipeline Pages
- `.gitignore` — dist/cache VitePress
- `plan/SPRINTS/INITIAL-BASE/REPORTES/IB-13-web-dominios.md` — este reporte

## Evidencia

### 1) docs:build + docs:verificar — VERDE

```text
vitepress v1.6.4
✓ building client + server bundles...
✓ rendering pages...
build complete in 10.39s.
build exit=0

[verificar-sitio] dist=docs/.vitepress/dist base=/ html=3
  enlaces internos rotos: 0
  anclas rotas:           0
  externos revisados:     6 (warning: 2)
  ⚠ EXTERNO ERR_TLS_CERT_ALTNAME_INVALID https://aleph-null.escrivivir.co
  ⚠ EXTERNO 404 .../CHANGELOG.md
[verificar-sitio] OK
verificar exit=0
```

### 2) Pages aleph-null — BLOQUEADO (gate DNS externo)

```text
aleph-null.escrivivir.co CNAME → escrivivir.co
escrivivir.co A → 192.0.78.24 / 192.0.78.25
SOA NameAdministrator: hostmaster.wordpress.com
HTTPS: ERR_TLS_CERT_ALTNAME_INVALID (cert no cubre aleph-null)
CNAME en repo: docs/public/CNAME = aleph-null.escrivivir.co
```

No apunta a GitHub Pages; no se declara Pages vivo.

### 3) Redirect scriptorium → pub — BLOQUEADO

```text
scriptorium.escrivivir.co A → 92.243.24.163
HTTPS HEAD → 404 Not Found (Caddy; sin Location a pub.escrivivir.co)
HTTP → 308 → https://scriptorium.escrivivir.co/ (no redirect a pub)
```

## Auto-revisión (PRACTICAS)

- [x] Diff sin `.claude/skills/` ni plan/ESTACION
- [x] CNAME = aleph-null.escrivivir.co (DA-S02)
- [x] docs:build ejecutado de verdad
- [x] DNS documentado sin fingir
- [x] Commits convencionales

## Hallazgos fuera de alcance

- Tick DNS custodio (CNAME Pages + redirect) — residual externo.
- CHANGELOG.md ausente en repo (warning externo; no bloquea build).

## Dudas / bloqueos

Gate DNS externo: bloquea CA Pages + redirect. Obra in-repo lista.

---

## Revisión del orquestador

_(pendiente)_
