#!/usr/bin/env bash
# Guarda anti-regreso: cero continue-on-error funcionales en workflows.
# Solo cuentan claves YAML (línea tras sangría); comentarios no disparan.
# LÍMITE: este paso no se protege a sí mismo si alguien lo marca blando.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
WF="$ROOT/.github/workflows"

if [[ ! -d "$WF" ]]; then
  echo "::error::no existe .github/workflows"
  exit 1
fi

if grep -rnE '^[[:space:]]*continue-on-error' "$WF"; then
  echo "::error::ha vuelto un paso con continue-on-error — WP-HUB-113 lo prohíbe sin razón escrita y guarda"
  exit 1
fi

echo "cero continue-on-error funcional en .github/workflows/"
exit 0
