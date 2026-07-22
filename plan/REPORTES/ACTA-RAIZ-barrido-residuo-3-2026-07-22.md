# ACTA · barrido raíz · residuo #3 + bootstrap génesis · 2026-07-22

| dato | valor |
| ---- | ----- |
| Mandato | GO ORQUESTADOR S · R10-S PASS-CON-RESIDUAL · gobierno a–d |
| Carril | S · workspace `C:\S\scriptorium` |
| Tip PRE (fetch) | `5a7f37293348f96e386d6cfc5d7324c5542bd3cd` (= `origin/main`) |
| Gate | R10-S PASS-con-residual · OK sellado vigente · **tag RETENIDO** (PO) |
| Veredicto vigía | ADDENDA gobierno-raiz-CS · residuo #3 + bootstrap = **desechables** |

## Veredicto desechable (vigía ya emitido · ejecutable)

Confirmado: paths bajo `C:\S\` listados abajo = residuos de obra /
bootstrap; **no** están en el mapa canónico `plan/RAIZ-C-S.md` ni son
checkout declarado.

Checkout declarado de cuadernos = `C:\S\_fuentes\` — **no tocado**.
Canónico librería = `C:\S\scriptorium\codebase\skills-library` — **no
tocado**. Checkout de obra futuro issue #15 = `C:\S\S_SDK-skills-library`
(declarado en brief N0-02; **aún no materializado**).

### Elemento C · `C:\S\README-scriptorium-vigilancia.md`

| campo | valor |
| ----- | ----- |
| Origen | residuo cableado backstage (orquestador · rama vigilancia) |
| Evidencia PRE | mtime ~19:42 · contenido ≈ cuadernos `e603412` (diff BOM UTF-8) |
| SHA256 PRE | `4383A97737FD93D60DAA92181C4C1166E7FF1ABCD8F62C0224EE51811091FB2C` |
| Canónico vivo | `_fuentes/scriptorium-cuadernos` @ `e603412e07d977bb51bcfd4d2c63918db7f57729` |
| Veredicto | **BORRAR** |
| Ejecutado | **sí** (este GO) |
| POST | path ausente |

### Elemento D · bootstrap génesis raíz

| path | origen | veredicto | ejecutado |
| ---- | ------ | --------- | --------- |
| `C:\S\package.json` | `npm i` génesis pre-repo (pin 0.5.1) | **BORRAR** | sí |
| `C:\S\package-lock.json` | idem | **BORRAR** | sí |
| `C:\S\node_modules/` | idem · reproducible | **BORRAR** | sí |

Consumo real del método = `C:\S\scriptorium/package.json` (devDep +
`skills:sync`). Bootstrap raíz **obsoleto** y sin declarar en mapa.

## No borrados (explícito)

| path | motivo |
| ---- | ------ |
| `C:\S\_fuentes\` | checkout declarado |
| `C:\S\scriptorium\` | mundo índice |
| `C:\S\vigilancia\` | OUT_DIR estación |
| `C:\S\.worktrees\` | WORKTREE_BASE |
| `C:\S\LLM.md` | broche IB-23 |
| `C:\S\README.md` | copia-release RAIZ-C-S (creado este GO) |

## Inventario raíz POST-barrido

```text
.worktrees/
_fuentes/
scriptorium/
vigilancia/
LLM.md
README.md
```

Criterio R10-S residual: raíz == mapa `plan/RAIZ-C-S.md`, ni una entrada más.
