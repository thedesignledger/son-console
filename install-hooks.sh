#!/bin/sh
# CTP/IP son-console: Install Guardian Gates into Git hooks
# Usage: ./install-hooks.sh [target-repo-path]

set -e

TARGET="${1:-.}"
HOOKS_DIR="$TARGET/.git/hooks"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ ! -d "$TARGET/.git" ]; then
  echo "Error: $TARGET is not a git repository"
  exit 1
fi

echo ""
echo "  ╔══════════════════════════════════════════════════════════╗"
echo "  ║  CTP/IP Guardian Gate Installation — son-console v9.0.0 ║"
echo "  ╚══════════════════════════════════════════════════════════╝"
echo ""

# Copy hooks
for hook in pre-commit commit-msg pre-push pre-merge-commit; do
  if [ -f "$SCRIPT_DIR/hooks/$hook" ]; then
    cp "$SCRIPT_DIR/hooks/$hook" "$HOOKS_DIR/$hook"
    chmod +x "$HOOKS_DIR/$hook"
    echo "  ✓ Installed: $hook"
  fi
done

# Copy bin
mkdir -p "$TARGET/bin"
if [ -f "$SCRIPT_DIR/bin/gamma-check.mjs" ]; then
  cp "$SCRIPT_DIR/bin/gamma-check.mjs" "$TARGET/bin/gamma-check.mjs"
  echo "  ✓ Installed: bin/gamma-check.mjs"
fi

# Create .son directory for operator registry
mkdir -p "$TARGET/.son"
if [ ! -f "$TARGET/.son/operators" ]; then
  git config --get user.email >> "$TARGET/.son/operators" 2>/dev/null || true
  echo "  ✓ Created: .son/operators (anchor registry)"
fi

echo ""
echo "  Guardian Gates active. All four hooks enforced."
echo ""
echo "  pre-commit        Coherence (Γ ≥ 0.70) + Evidence + Anchors"
echo "  commit-msg        Intent (IntentSig) + Anti-Circularity"
echo "  pre-push          Entropy + Temporal + DAG Γ re-validation"
echo "  pre-merge-commit  Causal Handshake (SYN, DATA, SEAL, FIN)"
echo ""
echo "  ┌─ LICENSE ────────────────────────────────────────────────┐"
echo "  │                                                          │"
echo "  │  CC BY-NC 4.0 — Non-commercial use with attribution.    │"
echo "  │  Commercial deployment requires LUX Runtime license.     │"
echo "  │  License LUX: contact@designledger.co                    │"
echo "  │                                                          │"
echo "  │  ANTI-WEAPONIZATION: This protocol must not be used      │"
echo "  │  for surveillance, coercion, social credit, weapons,     │"
echo "  │  or any system that extracts coherence from operators.   │"
echo "  │  See LICENSE for full terms. Violations are irrevocable. │"
echo "  │                                                          │"
echo "  └─────────────────────────────────────────────────────────┘"
echo ""
echo "  To uninstall: rm .git/hooks/{pre-commit,commit-msg,pre-push,pre-merge-commit}"
echo ""
