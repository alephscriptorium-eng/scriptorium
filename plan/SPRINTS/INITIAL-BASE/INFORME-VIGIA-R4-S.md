# INFORME · VIGÍA · R4-S · 2026-07-22

| dato | valor |
| ---- | ----- |
| Carril | S |
| Ronda | `R4-S` |
| Mundo | `C:\S\scriptorium` @ `main` |
| SHA pulso (PRE-informe) | `f6e448068a7a60e9144eab056a1f40d8b2593034` |
| 🔶 lote IB-12∥IB-13 | `4a0ea1fa00e69923f311a492c2a67ca82ef9e952` |
| Skill | `@alephscript/skills-scriptorium@0.5.1` · método `vigilancia` |
| **Veredicto** | **PASS-con-residual** |

> Gate post-lote **IB-12 ∥ IB-13** / pre-despacho **IB-20**. Este
> informe **no** autoriza al vigía a despachar workers. Residual =
> tick DNS custodio (Pages aleph-null + redirect scriptorium→pub).
> Vigía no abre IB-20+.

---

## Cara PO (custodio)

- **Estado del mundo:** lote IB-12 ∥ IB-13 cerrado en `main` @
  `f6e4480` (accept IB-13; close lote). Merges obra: IB-12 `0e7bc76` ←
  `d9ffc10`; IB-13 `d4aff50` ← `0354884`. Backlog marca lote ✅ y pide
  R4-S antes de IB-20.
- **Higiene §8 (territorio carril S):** limpia — 1 worktree
  (`C:/S/scriptorium` [main]); 0 ramas `wp/*`; 0 locks al cierre;
  status vacío alineado con `origin/main` (ahead/behind 0/0).
  `C:\S\.worktrees` vacío (0 entradas) = residuo FS benigno clase (b).
  Watcher sesión previa vio `index.lock` 1 ciclo @ 19:31:26 (ruido
  normal git); al pulso de cierre = absent. Sin freeze.
- **Re-verificación CA de facto IB-12 (post-merge):**
  - **npm view C8:** `@alephscript/skills-scriptorium@0.5.1` vía
    registry `https://npm.scriptorium.escrivivir.co` (name/version/
    tarball/publishConfig OK).
  - **espejo:** SRC=DEST =
    `estacion-viva site-web swarm-orquestacion vigilancia` · INTEGRO ·
    `_plantilla` ausente en destino.
  - **watcher ONCE:** Git bash ·
    `estacion-viva/scripts/watcher-sesion.sh` · `ONCE=1` · **exit 0** ·
    pidfile cleaned · OUT_DIR `C:\S\vigilancia`.
  - **calibración:** `plan/ESTACION.md` presente (OUT_DIR ·
    BACKSTAGE_GIT · watcher whitelist).
- **Re-verificación CA de facto IB-13 (post-merge):**
  - **docs:build:** exit 0 (vitepress 1.6.4 · ~8.96s).
  - **docs:verificar:** exit 0 (internos/anclas OK; warnings externos
    esperados: TLS aleph-null + CHANGELOG 404).
  - **CNAME repo:** `docs/public/CNAME` = `aleph-null.escrivivir.co`.
  - **Pages aleph-null:** **BLOQUEADO** (gate DNS externo — ver
    residual).
  - **redirect scriptorium→pub:** **BLOQUEADO** (gate DNS externo —
    ver residual).
- **Residual DNS (tick custodio — no inventado):**
  1. `aleph-null.escrivivir.co` CNAME → `escrivivir.co` → A
     `192.0.78.24` / `192.0.78.25` · SOA `hostmaster.wordpress.com` ·
     HTTPS curl exit 60 `SEC_E_WRONG_PRINCIPAL` / altname inválido ·
     `-k` → 301 nginx a `escrivivir.co` (WordPress/Automattic), **no**
     GitHub Pages.
  2. `scriptorium.escrivivir.co` A → `92.243.24.163` · HTTPS HEAD
     **404** (Caddy; sin `Location` a pub) · HTTP → 308 solo a sí
     mismo en https · `pub.escrivivir.co` responde 200 en el mismo IP
     (redirect aún no cableado).
- **Residuo no bloqueante (→ forense, cero arqueología §F3a):**
  nests a-sdk bajo `--recursive` / README `--recursive` — sin
  excavación esta ronda; CA top-level 6 gitlinks OK; o-sdk pin
  `632ee2a2bbb10a19efbc57b2f0a847dd04333ff9` (local = ls-remote main).
- **CI principal:** Docs run `29942632831` success (push accept IB-13).
- **Doctrina:** A-23 v2 §L1/L2 · §F3a respetada; vetos borrado /
  network-sdk / PORT NO REWRITE sin hallazgos nuevos.
- **Convivencia:** un solo carril S. Estación calibrada (IB-12 ✅).
- **Decisión pedida:** tick DNS custodio (aleph-null → Pages; redirect
  scriptorium→pub). Mientras tanto: orquestador **puede** 🔶 IB-20
  tras este PASS-con-residual. El vigía **no** despacha.

---

## Cara scrum (orquestador carril S)

### Checklist higiene §8 — R4-S

```text
[x] sin worktrees huérfanos en C:\S\scriptorium
[x] sin ramas wp/* en el repo (ninguna)
[x] git status limpio; tip = origin/main
[x] ronda R4-S en PASS-con-residual (este informe)
[x] index.lock / HEAD.lock ausentes (cierre)
[x] WORKTREE_BASE C:\S\.worktrees vacío (0 entradas)
```

### Aceptación IB-12 / IB-13 vs brief + CA (re-verificado; sin rewrite)

| WP | Brief | CA backlog / brief | Evidencia de facto | ¿OK? |
| -- | ----- | ------------------ | ------------------ | ---- |
| IB-12 | `BRIEFS/IB-12.md` | npm view C8 · espejo · watcher · plan/ESTACION | C8 0.5.1 registry OK; espejo 4 skills; ONCE exit 0; ESTACION.md | sí |
| IB-13 | `BRIEFS/IB-13.md` | docs:build · Pages tras tick · redirect C8 | build+verificar exit 0; CNAME OK; Pages/redirect **BLOQUEADOS** | parcial |

Desfases de alcance = 0. Alcance no reescrito. Residual DNS =
declarado (no fingido).

### Pulso (evidencia literal)

```text
WORLD_ROOT=C:\S\scriptorium
HEAD=f6e448068a7a60e9144eab056a1f40d8b2593034
branch=main...origin/main (clean; 0 ahead / 0 behind)
worktree list: C:/S/scriptorium  f6e4480 [main]  (único)
locks: index.lock=absent HEAD.lock=absent  (cierre; 1 ciclo visto en sesión previa = ruido)
.git/worktrees/: absent
C:\S\.worktrees\: 0 entradas
wp/* branches: ninguna (local ni remote)
stash: vacío
CI principal: Docs #29942632831 success (main)

🔶 IB-12||IB-13: 4a0ea1fa00e69923f311a492c2a67ca82ef9e952
tip post-lote: f6e448068a7a60e9144eab056a1f40d8b2593034
merge IB-12: 0e7bc76 ← d9ffc10
merge IB-13: d4aff50 ← 0354884

IB-12 C8:
  npm view @alephscript/skills-scriptorium@0.5.1
    registry=https://npm.scriptorium.escrivivir.co → 0.5.1 OK
  espejo: INTEGRO (4 skills; sin _plantilla)
  watcher ONCE (Git bash estacion-viva): exit 0
  plan/ESTACION.md: OUT_DIR=C:\S\vigilancia · BACKSTAGE_GIT=scriptorium-cuadernos/scriptorium-vigilancia

IB-13 in-repo:
  docs:build exit 0
  docs:verificar exit 0 (warn TLS aleph-null + CHANGELOG 404)
  CNAME=aleph-null.escrivivir.co

DNS / Pages / redirect (re-chequeo R4-S — SIGUE ROJO):
  aleph-null CNAME → escrivivir.co
  escrivivir.co A → 192.0.78.24 / 192.0.78.25
  SOA NameAdministrator: hostmaster.wordpress.com
  HTTPS aleph-null: curl exit 60 SEC_E_WRONG_PRINCIPAL (altname)
  HTTPS -k: 301 → http://escrivivir.co/ (nginx Automattic; no Pages)
  scriptorium.escrivivir.co A → 92.243.24.163
  HTTPS HEAD → 404 Not Found (Caddy; sin Location a pub)
  HTTP → 308 → https://scriptorium.escrivivir.co/
  pub.escrivivir.co HTTPS → 200 OK (mismo A; redirect no cableado)

gitlinks 160000 (6): sync
  a-sdk e5573f8e5b248aff6e19aee5cd51b0fe7b086c1b
  e-sdk 90e53544e8b78722ec8e22230740bfa107fa2cc8
  g-sdk d1783646f4364fce49ae9b421c863bc51bfad4aa
  o-sdk 632ee2a2bbb10a19efbc57b2f0a847dd04333ff9
  s-sdk 7db1d4941267d857d93ab4005dcc4ecd0e49ecfb
  z-sdk d0d9de1d3af0e75a9f5d7d7b4c2b4d3762beb90c
ls-remote O_SDK refs/heads/main = 632ee2a2bbb10a19efbc57b2f0a847dd04333ff9

Nota forense (no bloquea; §F3a sin excavación):
  nests a-sdk / README --recursive → cola forense / WP docs futuro.
```

### Condiciones para IB-20+ (orquestador — no vigía)

1. Este **R4-S = PASS-con-residual** (cumplido con este informe).
2. Orquestador marca 🔶 + emite BRIEF IB-20 (reunificación de planes).
3. **Residual DNS no bloquea IB-20** (territorio plan/skills de sdks).
4. **Sí bloquea** el cierre C8 de dominios IB-13 hasta tick custodio:
   - CNAME `aleph-null` → GitHub Pages (no WordPress/`escrivivir.co`)
   - redirect `scriptorium.escrivivir.co` → `https://pub.escrivivir.co/`
5. Re-verificar DNS en ronda futura (o WP ops DNS) tras tick — no
   reabrir IB-13 (WP ✅; trabajo nuevo = WP nuevo).
6. **No** despachar desde el vigía. **No** abrir IB-21+ en este gate
   (orden backlog: IB-20 primero).
7. Higiene §8 debe seguir limpia al momento del 🔶 IB-20.
8. §F3a: nests a-sdk = forense; cero excavación en IB-20 salvo alcance
   explícito del brief.

### Bloqueos

- **DNS custodio (tick pendiente):** Pages aleph-null + redirect
  scriptorium→pub. No bloquea 🔶 IB-20. Bloquea CA de dominios.
- Ningún bloqueo de higiene §8 ni de CA in-repo IB-12 / docs:build.

### Siguiente acción táctica (orquestador — no vigía)

1. Leer este PASS-con-residual; actualizar índice gate en backlog.
2. 🔶 IB-20 + BRIEF; worktree bajo `C:\S\.worktrees` si aplica.
3. Custodio: tick DNS (aleph-null Pages + redirect); avisar para
   re-chequeo vigía posterior.
4. Vigía permanece read-only; no despacha IB-20+.

### Ceguera calibrada (esta ronda)

Génesis: swarm 0 · vigilancia 0. Cara scrum de este informe: 0 matches
del patrón del paquete (sección prueba abajo).

---

## Prueba de ceguera (cara scrum)

Patrón = el del script `swarm-orquestacion/scripts/comprobar-ceguera.sh`
del paquete 0.5.1 (armado por fragmentos; no se reimprime aquí).

```text
# Extracción líneas «## Cara scrum» … hasta «## Prueba»
# → rg -i -e <patrón-paquete> → 0 matches
ceguera cara-scrum: 0
```

Ceguera skill-tree del tarball 0.5.1: reportada 0 por génesis.
Calibración de esta ronda: rg local sobre cara scrum = 0.

---

## Hashes POST-push

| ref | SHA |
| --- | --- |
| tip main PRE (lote cerrado) | `f6e448068a7a60e9144eab056a1f40d8b2593034` |
| 🔶 lote IB-12∥IB-13 | `4a0ea1fa00e69923f311a492c2a67ca82ef9e952` |
| commit R4-S (aviso+informe) | `b36be9bdd4708124ddee856e13c54204a8db1556` |
| origin/main tras push R4-S | `b36be9bdd4708124ddee856e13c54204a8db1556` |

> Tip final tras pin de esta tabla = SHA del commit que la fija (ver
> `git log -1` en main tras push del pin).
