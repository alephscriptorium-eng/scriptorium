# INFORME · VIGILANTE-S · R14-S · 2026-07-22

| dato | valor |
| ---- | ----- |
| Carril | S |
| Ronda | `R14-S` (aceptación N0-04 · C8 de marca · pre-sellado) |
| Mundo | `C:\S\scriptorium` @ `main` |
| SHA pulso (PRE-informe) | `4d68de4` (= `origin/main`) |
| obra / merge N0-04 | `18168a2` / `de52ba6` |
| Skill | `@alephscript/skills-scriptorium@0.6.1` · método `vigilancia` |
| Emisor | **Vigilante-S** (DA-S07 · estación viva · watcher activo) |
| **Veredicto** | **PASS-con-residual** · **OK DE SELLADO del tag CONCEDIDO** |

> Residual = fuente `banner-scriptorium.png` corrupta (blob de ceros,
> declarado por el worker, no fingido). NO bloquea el sellado: la
> cabecera renderiza con el banner de fundación (fallback verificado
> en canal real).

---

## Cara PO (custodio)

- **El colofón está puesto y verificado en el canal real:**
  - **Licencia**: `LICENSE.md` = **composite puntero patrón GL**
    (GPL-3.0-or-later + capa Animus Iocandi, DA-S14) — la canónica,
    NO la pieza lore. La lore vive donde debe: como pieza del zine en
    `/licencia` (página navegable, 200, enlazada desde la home).
  - **Favicon**: `/favicon.ico` **200** (915b, icono real derivado del
    logo) **y declarado** con dos `<link rel="icon">` explícitos —
    patrón del pub cumplido; ya no es convención muda.
  - **Marca**: banner de cabecera vivo en la home publicada · footer
    con marca+licencia · CONTRIBUTING (raíz) + PR template (.github)
    desde plantillas.
  - **Pesos**: derivados web TODOS <150KB por comando (136K · 128K ·
    80K · favicons 4K).
  - **CHANGELOG**: N0-02/N0-03/N0-04 asentados (pre-tag cumplido).
- **Residual (declarado, verificado, no bloquea):**
  `branding/banner-scriptorium.png` = **blob de ceros** (od: todo
  `00`; 864K), heredado de la cantera (el fichero del Desktop ya venía
  corrupto). El worker lo DECLARÓ y cableó la cabecera con
  `banner-fundacion-web.png` (elección razonable para el número 0 —
  el zine abre con el banner de fundación). Cola: (a) tick custodio =
  re-depositar el banner real en cantera; (b) WP menor (numero-0.1 o
  gobierno) = sustituir fuente + derivar web + decidir si la cabecera
  cambia — decisión de producto tuya, sin prisa.
- **Recordatorio del checkout de librería (tu pregunta):** sigue en
  `C:\S` — declarado, limpio y con destino legislado (S_LAB); intenté
  la reubicación hoy y está **bloqueada por handle vivo** (proceso con
  cwd dentro, probablemente la ventana del orquestador). Se reubica en
  quietud con el WP 0.7.0, como estaba previsto. No es riesgo.
- **OK DE SELLADO**: concedido. Tras el tag, queda el cierre del arco.

---

## Cara scrum (orquestador carril S)

### Checklist higiene §8 — R14-S

```text
[x] worktrees: solo root (wp-n0-04 retirado tras merge)
[x] ramas wp/*: ausentes · locks ausentes · stash vacío
[x] git status limpio; tip = origin/main (0/0)
[x] gitlinks 7/7 (6 mundos invariantes + librería 64883a9)
```

### Aceptación N0-04 (re-verificado de facto)

| check | evidencia | ¿OK? |
| ----- | --------- | ---- |
| LICENSE = composite (no lore) | puntero GPL-3.0-or-later + capa · DA-S14 | sí |
| /licencia navegable + enlazada | 200 · link en home | sí |
| Favicon 200 + declarado | ico 915b + 2 `<link rel="icon">` en HTML | sí |
| Banner cabecera vivo | `<img src="/banner-fundacion-web.png">` en home publicada | sí |
| Derivados <150KB | 136/128/80/4/4 KB (du literal) | sí |
| CONTRIBUTING + PR template | raíz + .github desde plantillas | sí |
| CHANGELOG pre-tag | N0-02/03/04 presentes | sí |
| Residual banner-scriptorium | blob ceros DECLARADO · fallback cableado | residual |

### Pulso (evidencia literal)

```text
HEAD=4d68de4 (= origin/main; 0/0) · ancestry desde f276690 OK (cero force)
LICENSE.md: «GPL-3.0-or-later + capa Animus Iocandi» (puntero; DA-S14)
favicon.ico → 200 (915b) · <link rel="icon"> ×2 declarados
/licencia → 200 · home enlaza licencia
banner-scriptorium.png: od → 00×… (blob de ceros; 864K) — residual
derivados: vibecoding 136K · fundacion 128K · logo 80K (<150KB ✓)
estación: watcher vivo · ticks limpios
```

### Autorización de sellado (orquestador — no vigía)

1. **SELLAR `release/numero-0`** sobre el tip que contiene el colofón:
   tag anotado · release notes = CHANGELOG (secciones Número 0, sin
   texto inventado) · reportar tag + SHA POST-push. El vigía
   re-triangula (tag deref = tip = release publicada).
2. Encolar el residual como cola visible: «banner-scriptorium fuente
   corrupta → re-depósito custodio + WP menor de sustitución» (no
   reabre N0-04).
3. Tras el tag: **AVISO R15-S de CIERRE del arco PORTAL-NUMERO-0**
   (verificación batch del arco, gates externos, retro — patrón R8-S).
4. En el cierre o el 0.7.0: reubicar el checkout de librería a S_LAB
   (hoy bloqueado por handle) y asentar `plan/S-LAB.md` (nota de
   gobierno ya entregada al custodio).

### Bloqueos

Ninguno para el sellado.

### Ceguera calibrada (esta ronda)

Cara scrum de este informe: 0 matches del patrón del paquete (prueba
abajo).

---

## Prueba de ceguera (cara scrum)

Patrón = el del script `vigilancia/scripts/comprobar-ceguera.sh` del
paquete (espejo 0.6.1; armado por fragmentos; no se reimprime aquí).

```text
# Extracción líneas «## Cara scrum» … hasta «## Prueba»
# → grep -inE <patrón-paquete> → 0 matches
ceguera cara-scrum: 0
```
