#!/bin/bash
# Apply one agent-skin-hub preset on macOS without ProvDex.
# Usage:
#   curl -fsSL https://cdn.jsdelivr.net/gh/Chiody/agent-skin-hub@main/scripts/apply-hub-skin.sh | bash -s -- preset-trial-yuexin-miao
#   bash apply-hub-skin.sh preset-trial-caishen
#   bash apply-hub-skin.sh --list
set -euo pipefail

PRESET_ID="${1:-}"
HUB_RAW="${HUB_RAW:-https://cdn.jsdelivr.net/gh/Chiody/agent-skin-hub@main}"
ENGINE_REPO="${ENGINE_REPO:-https://github.com/Fei-Away/Codex-Dream-Skin.git}"
STUDIO="${HOME}/.codex/codex-dream-skin-studio"
THEMES="${HOME}/Library/Application Support/CodexDreamSkinStudio/themes"

fail() { printf 'error: %s\n' "$*" >&2; exit 1; }

list_presets() {
  curl -fsSL "$HUB_RAW/catalog.json" | python3 -c '
import json, sys
c = json.load(sys.stdin)
for p in c.get("presets", []):
    pid = str(p.get("id", ""))
    name = str(p.get("name", ""))
    print(f"{pid:40}  {name}")
'
}

if [ "$PRESET_ID" = "--list" ] || [ "$PRESET_ID" = "-l" ]; then
  list_presets
  exit 0
fi

[ -n "$PRESET_ID" ] || fail "usage: apply-hub-skin.sh <preset-id> | --list"
[[ "$PRESET_ID" =~ ^preset-[A-Za-z0-9_-]+$ ]] || fail "invalid preset id: $PRESET_ID"
[ "$(uname -s)" = "Darwin" ] || fail "macOS only for now"

ensure_studio() {
  if [ -x "$STUDIO/scripts/switch-theme-macos.sh" ]; then
    return 0
  fi
  printf '→ installing agent-skin-hub engine…\n'
  TMP="$(mktemp -d /tmp/agent-skin-hub-engine.XXXXXX)"
  cleanup() { rm -rf "$TMP"; }
  trap cleanup EXIT
  if command -v git >/dev/null 2>&1; then
    git clone --depth 1 "$ENGINE_REPO" "$TMP/repo" >/dev/null 2>&1 \
      || fail "git clone failed: $ENGINE_REPO"
    ENGINE="$TMP/repo/macos"
  else
    fail "git is required to bootstrap agent-skin-hub engine (or install ProvDex once)"
  fi
  [ -x "$ENGINE/scripts/install-dream-skin-macos.sh" ] \
    || fail "engine install script missing"
  bash "$ENGINE/scripts/install-dream-skin-macos.sh" --no-launch
  trap - EXIT
  cleanup
  [ -x "$STUDIO/scripts/switch-theme-macos.sh" ] || fail "studio install incomplete"
}

download_preset() {
  local dest="$THEMES/$PRESET_ID"
  local base="$HUB_RAW/presets/$PRESET_ID"
  mkdir -p "$dest"
  printf '→ downloading %s…\n' "$PRESET_ID"
  curl -fsSL "$base/theme.json" -o "$dest/theme.json"
  curl -fsSL "$base/background.jpg" -o "$dest/background.jpg"
  [ -s "$dest/theme.json" ] || fail "theme.json empty"
  [ -s "$dest/background.jpg" ] || fail "background.jpg empty"
}

ensure_studio
download_preset
printf '→ applying %s…\n' "$PRESET_ID"
bash "$STUDIO/scripts/switch-theme-macos.sh" --id "$PRESET_ID"
printf '✓ done: %s\n' "$PRESET_ID"
printf '  restore: %s/scripts/restore-dream-skin-macos.sh\n' "$STUDIO"
