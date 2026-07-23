# INFORME · VIGILANTE-S · R11-S · 2026-07-22

| dato | valor |
| ---- | ----- |
| Carril | S |
| Ronda | `R11-S` (gate pre N0-02 · verificación gobierno raíz) |
| Mundo | `C:\S\scriptorium` @ `main` |
| SHA pulso (PRE-informe) | `0fa1152` (= `origin/main`) |
| Gobierno raíz + DA-S12 | `a683782` |
| Skill | `@alephscript/skills-scriptorium@0.5.1` · método `vigilancia` |
| Emisor | **Vigilante-S** (DA-S07 · estación viva · watcher activo) |
| **Veredicto** | **PASS** |

> Autoriza 🔶 N0-02 (fast-track issue #15 en el carril de la librería).
> Tag sigue RETENIDO (DA-S12). N0-03 sigue stub sin 🔶.

---

## Cara PO (custodio)

- **Gobierno de la raíz: EJECUTADO Y VERIFICADO.** `plan/MAPA-RAIZ.md`
  canónico con la REGLA DE LA RAÍZ; `C:\S\README.md` copia-release con
  cabecera de procedencia; residuo #3 y bootstrap del génesis
  **ausentes**; la raíz FS es **exactamente** el mapa declarado
  (scriptorium · vigilancia · _fuentes · .worktrees · LLM.md ·
  README.md — ni una entrada más). El residual de R10-S queda cerrado.
- **DA-S12 asentada fielmente:** tag NO ejecutado; N0-02 ⬜ PRE-🔶 con
  gate pedido; N0-03 stub sin 🔶. La secuencia del PO está en gobierno,
  no solo en chat.
- **Brief N0-02: la lección hecha práctica.** Tabla de CHECKOUT
  DECLARADO día cero (obra en `C:\S\S_SDK-skills-library`, distinguida
  del gitlink de solo-lectura del índice), ALCANCE_DIFF que protege el
  portal (`theme/` = N0-03) y el tag, y el patrón de publish de IB-21
  citado como plantilla. Los tres casos fundantes ya no se repetirán
  por diseño.
- **Higiene §8:** limpia — 1 worktree; 0 `wp/*`; locks ausentes; stash
  vacío; tip = origin; gitlinks 7/7.
- **Decisión pedida:** ninguna para este gate. (El GO de branding del
  auditor se trata aparte: tiene un pre-tick tuyo — ver nota del vigía
  al custodio.)

---

## Cara scrum (orquestador carril S)

### Checklist higiene §8 — R11-S

```text
[x] worktrees: solo root (C:/S/scriptorium @ 0fa1152)
[x] ramas wp/*: ausentes · locks ausentes · stash vacío
[x] git status limpio; tip = origin/main (0/0)
[x] gitlinks 7/7 (6 mundos + skills-library, invariantes)
[x] raíz C:\S == mapa MAPA-RAIZ.md (verificación literal, ni una más)
```

### Gobierno verificado (puntos del aviso)

| check | evidencia | ¿OK? |
| ----- | --------- | ---- |
| MAPA-RAIZ.md + REGLA | presente en plan/ con regla literal | sí |
| README.md raíz copia-release | cabecera de procedencia verificada | sí |
| Residuo #3 + bootstrap ausentes | ls raíz: 6 entradas = mapa | sí |
| Tag NO ejecutado | sin tags en repo; backlog «Tag hoy NO» | sí |
| N0-02 PRE-🔶 con checkout declarado | tabla territorio en brief | sí |
| N0-03 stub sin 🔶 | backlog literal | sí |
| Partición N0-02 | obra solo librería + reporte; portal/tag prohibidos | sí |

### Pulso (evidencia literal)

```text
HEAD=0fa1152 (= origin/main; 0/0) · ancestry desde 5a7f372 OK (cero force)
raíz C:\S: .worktrees LLM.md README.md _fuentes scriptorium vigilancia
  == mapa MAPA-RAIZ.md ✓
favicon (dato para WPs de marca): pub declara <link> + /ico.png ·
  la web hermana del carril responde /favicon.ico 200 sin <link> ·
  aleph-null /favicon.ico → 404
estación: watcher vivo · ticks limpios
```

### Condiciones para 🔶 N0-02 (orquestador — no vigía)

1. Este **R11-S = PASS** cumple el gate. Despacho conforme al brief tal
   cual (checkout de obra se materializa SOLO tras 🔶).
2. Publish con la plantilla triangulada de IB-21: secrets ya sembrados
   (re-chequeo `gh secret list` si hay duda) · tras publicar, C8
   `npm view` de la versión nueva · el vigía re-triangula (npm gitHead
   = tip librería = CI success = deref del tag de versión).
3. **CA estructural anti-regresión obligatorio en el skill**: home de
   ejemplo/consumidor con clases de la piel presentes y shell por
   defecto ausente — el test que faltaba y que motivó el issue.
4. Ceguera del paquete = 0 antes de publicar.
5. Tras publish: **AVISO R12-S** (gate pre N0-03: re-pielado del
   portal). El tag sigue retenido hasta post-N0-03 (DA-S12).
6. No abrir N0-03 ni tocar `theme/` del portal en este WP.

### Bloqueos

Ninguno.

### Ceguera calibrada (esta ronda)

Cara scrum de este informe: 0 matches del patrón del paquete (prueba
abajo).

---

## Prueba de ceguera (cara scrum)

Patrón = el del script `vigilancia/scripts/comprobar-ceguera.sh` del
paquete 0.5.1 (armado por fragmentos; no se reimprime aquí).

```text
# Extracción líneas «## Cara scrum» … hasta «## Prueba»
# → grep -inE <patrón-paquete> → 0 matches
ceguera cara-scrum: 0
```
