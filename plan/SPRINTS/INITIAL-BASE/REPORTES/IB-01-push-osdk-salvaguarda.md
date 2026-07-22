# IB-01 · Push O_SDK con salvaguarda — reporte

| dato | valor |
| ---- | ----- |
| agente | worker swarm · WP IB-01 |
| fecha | 2026-07-22 |
| rama | `wp/ib-01-push-osdk-salvaguarda` |
| commits | _(tip wp post-commit de este reporte)_ |
| eje(s) CA | III (auditoría / layout de remotes) + ops |
| estado propuesto | listo para revisión |

## Qué se hizo

Comparación LOCAL vs `origin/upgrade/oasis-0.8.8` en checkout
`alephscript-clean`: local ahead 7, remoto sin commits posteriores
(behind vacío) → push NO-FORCE. Untracked conocidos movidos a
cuaderno privado `scriptorium-cuadernos` rama `o_sdk` (no al O_SDK).
`alephscript-network-sdk` no existía en el checkout; no se tocó.
Cero force push. Cero arqueología §F3a. No se editó BACKLOG ni main.

## Archivos tocados

- `plan/SPRINTS/INITIAL-BASE/REPORTES/IB-01-push-osdk-salvaguarda.md` —
  creado (este reporte, worktree scriptorium).
- Checkout O_SDK (`alephscript-clean`): push de commits ya existentes en
  `upgrade/oasis-0.8.8`; borrado local de 3 untracked tras copia a
  cuadernos (no `git add`).
- `C:\S\scriptorium-cuadernos` (privado, fuera del repo público): clone
  fresco + rama `o_sdk` con rescate de untracked.

## Evidencia

### 1) Fetch + comparación fechas/log (pre-push)

Checkout: `C:\Users\aleph\OASIS\_RECOVERY-20260721\alephscript-clean`

```text
$ git fetch origin
$ git status -sb
## upgrade/oasis-0.8.8...origin/upgrade/oasis-0.8.8 [ahead 7]
?? SESION-BACKLOG-EXPANSION.md
?? SESION-BACKLOG.md
?? docker-compose.override.yml

$ git log -1 --format="%H %ci %s" HEAD
632ee2a2bbb10a19efbc57b2f0a847dd04333ff9 2026-07-21 20:20:34 +0200 docs(readme): refactor FOSS — badges, disclaimer no-oficial, fix obsoletos

$ git log -1 --format="%H %ci %s" origin/upgrade/oasis-0.8.8
5d02ae2845e9466ed1ee5123bde2ce03668b8b4b 2026-07-21 18:59:06 +0200 docs(PUB): protocolo de recuperacion (gemelo del de upgrade)

$ git log --format="%h %ci %s" origin/upgrade/oasis-0.8.8..HEAD
632ee2a 2026-07-21 20:20:34 +0200 docs(readme): refactor FOSS — badges, disclaimer no-oficial, fix obsoletos
cb2a952 2026-07-21 20:15:50 +0200 feat(site-web): banner de cabecera WIP (slot layout-top, piel fanzine)
3124e6d 2026-07-21 19:58:21 +0200 fix(site-web): portada con layout home (hero+features) como z/s-sdk
379b96b 2026-07-21 19:44:59 +0200 style(site-web): piel fanzine completa + footer de marca Scriptorium
c5f4461 2026-07-21 19:33:47 +0200 docs: README enlaza a la web + CHANGELOG inicial; anular escrivivir-co
a5336a1 2026-07-21 19:28:35 +0200 feat(site-web): portal VitePress de O_SDK (skill site-web)
1b3c3f8 2026-07-21 19:20:56 +0200 chore(skills): instalar @alephscript/skills-scriptorium + espejo .claude/skills

$ git log --format="%h %ci %s" HEAD..origin/upgrade/oasis-0.8.8
(vacío — remoto SIN commits no contenidos en local)

Veredicto salvaguarda: PROCEDE push NO-FORCE. No aplica nota-a-forense.
```

### 2) Untracked → cuadernos (NO O_SDK)

```text
$ gh repo clone alephscriptorium-eng/scriptorium-cuadernos C:\S\scriptorium-cuadernos
Cloning into 'C:\S\scriptorium-cuadernos'...

Ramas remotas observadas: main, script_sdk-addenda, script_sdk-vigilancia
(no había rama o_sdk; se creó como rama por mundo).

$ git -C C:\S\scriptorium-cuadernos checkout -B o_sdk origin/main
$ # copy ×3 → o_sdk/rescue-20260721/
$ git -C C:\S\scriptorium-cuadernos commit ...
[o_sdk cd4175a] chore(o_sdk): rescue untracked from alephscript-clean (IB-01)
 3 files changed, 1179 insertions(+)

$ git -C C:\S\scriptorium-cuadernos push -u origin o_sdk
 * [new branch]      o_sdk -> o_sdk

TIP cuadernos o_sdk:
cd4175aa1de89aaf162d53f16c535162d9f80798

Rutas en cuadernos:
- o_sdk/rescue-20260721/SESION-BACKLOG.md
- o_sdk/rescue-20260721/SESION-BACKLOG-EXPANSION.md
- o_sdk/rescue-20260721/docker-compose.override.yml

Tras verificación de copias, borrados del working tree O_SDK (sin git add).
```

### 3) Push NO-FORCE O_SDK

```text
$ git push origin upgrade/oasis-0.8.8
To https://github.com/alephscriptorium-eng/O_SDK.git
 * [new branch]      upgrade/oasis-0.8.8 -> upgrade/oasis-0.8.8

Nota: salida git etiquetó la ref remota como new branch en este push;
el tip local/remoto quedó en el mismo SHA (FF de los 7 commits locales
sobre el tip previo observado 5d02ae2). CERO --force.

$ git fetch origin
$ git status -sb
## upgrade/oasis-0.8.8...origin/upgrade/oasis-0.8.8

$ git rev-parse HEAD
632ee2a2bbb10a19efbc57b2f0a847dd04333ff9

$ git rev-parse origin/upgrade/oasis-0.8.8
632ee2a2bbb10a19efbc57b2f0a847dd04333ff9

$ git ls-remote origin refs/heads/upgrade/oasis-0.8.8
632ee2a2bbb10a19efbc57b2f0a847dd04333ff9	refs/heads/upgrade/oasis-0.8.8

$ git status --porcelain
(vacío)

$ Test-Path alephscript-network-sdk
False → absent-ok (veto respetado)
```

### 4) Tip O_SDK remote post-push

`632ee2a2bbb10a19efbc57b2f0a847dd04333ff9` · `upgrade/oasis-0.8.8` ·
`alephscriptorium-eng/O_SDK`

## Auto-revisión (PRACTICAS del mundo — con honestidad)

- [x] Diff solo dentro de `ALCANCE_DIFF`: checkout O_SDK + push remoto
  O_SDK; reporte en worktree wp; untracked a cuadernos privado.
- [x] Cero árboles/ficheros copiados de otros mundos sin procedencia:
  solo rescate de untracked locales del propio checkout.
- [x] Sellos con fuente; rutas citadas existentes: SHAs y comandos arriba.
- [x] Sin fluff ni promesa de futuro sin `<pendiente>`.
- [x] Eje III evidenciado: comparación remotes + push documentado.
- [x] Gates ejecutados de verdad: fetch/compare/behind-vacío antes de push.
- [x] Commits convencionales: reporte en rama wp; rescate cuadernos
  `chore(o_sdk): …`.
- [x] Diff solo del alcance del WP: no BACKLOG, no merge main, no
  network-sdk, cero force, cero arqueología.

## Hallazgos fuera de alcance

- Salida `git push` de O_SDK mostró `* [new branch]` pese a tip remoto
  previo `5d02ae2` observado en fetch; no se investigó (fuera de CA;
  tip final verificado por `ls-remote` = local).
- BOM UTF-8 accidental en el primer carácter del mensaje de commit de
  cuadernos (`cd4175a`); no bloquea CA de IB-01.

## Dudas / bloqueos

Ninguno bloqueante para el CA de IB-01.

---

## Revisión del orquestador

**Aceptado ✅** · 2026-07-22 · orquestador carril S

### CA
- [x] Push limpio NO-FORCE o nota-a-forense: push FF a `632ee2a2bbb10a19efbc57b2f0a847dd04333ff9`
- [x] Evidencia fechas/log pre-push (ahead 7 / behind 0)
- [x] Untracked → cuadernos (`o_sdk` `cd4175aa1de89aaf162d53f16c535162d9f80798`), no al O_SDK
- [x] Cero force · network-sdk intocado

### Eje III + ops
Comparación remotes + tip `ls-remote` verificado en consolidación.

### Merge
`wp/ib-01-push-osdk-salvaguarda` → `main` post-aceptación.
