---
name: agent-skin-hub
description: Browse and apply open Codex desktop skins from agent-skin-hub on macOS. Use when a user pastes this GitHub repo, asks to install a hub skin (e.g. 月薪喵 / rose / caishen), customize appearance without ProvDex, or restore the official Codex look. Bootstraps the reversible CDP skin engine if needed, then downloads theme.json + background.jpg and switches theme.
compatibility: macOS, official Codex / ChatGPT Desktop (bundle id com.openai.codex), network access to GitHub or jsDelivr
---

# agent-skin-hub

Open skin catalog for Codex Desktop. This repo holds **wallpaper packs** (`presets/*/theme.json` + `background.jpg`). Appearance injection uses a local reversible CDP engine (installed on demand; does **not** modify the official `.app` / `app.asar`).

Users do **not** need ProvDex. Pasting `https://github.com/Chiody/agent-skin-hub` into Codex should be enough for you to apply a skin.

## Default workflow (do this, don't only give a tutorial)

1. Confirm macOS (`uname -s` = Darwin). Confirm Codex / ChatGPT Desktop is installed.
2. Read `catalog.json` (or `https://cdn.jsdelivr.net/gh/Chiody/agent-skin-hub@main/catalog.json`) and list `presets[].id` + `name` for the user if they did not pick one.
3. Pick a preset id matching `^preset-[A-Za-z0-9_-]+$` (examples: `preset-trial-yuexin-miao`, `preset-trial-rose-soft`, `preset-trial-caishen`).
4. From a clone of this repo **or** via one-liner, apply:

```bash
curl -fsSL https://cdn.jsdelivr.net/gh/Chiody/agent-skin-hub@main/scripts/apply-hub-skin.sh | bash -s -- <preset-id>
```

   Local clone equivalent:

```bash
bash scripts/apply-hub-skin.sh <preset-id>
```

5. The script will:
   - ensure `~/.codex/codex-dream-skin-studio` (bootstrap engine from upstream if missing);
   - download `presets/<id>/theme.json` + `background.jpg` into `~/Library/Application Support/CodexDreamSkinStudio/themes/<id>/`;
   - run `switch-theme-macos.sh --id <id>` (may restart Codex once for CDP).
6. Verify sidebar / suggestion cards / composer text are readable. Report the preset id and that only appearance changed.
7. Restore official look when asked:

```bash
~/.codex/codex-dream-skin-studio/scripts/restore-dream-skin-macos.sh
```

## Guardrails

- Never modify the official ChatGPT/Codex `.app`, `app.asar`, code signature, API keys, or relay / Base URL settings.
- Concept ads under `docs/ads/` are **not** importable wallpapers (they contain fake UI). Only use `presets/*/background.jpg`.
- Do not upload private keys, `auth.json`, or chat contents.
- Prefer jsDelivr URLs if `raw.githubusercontent.com` is stale/cached.
- If apply fails, read logs under `~/Library/Application Support/CodexDreamSkinStudio/` and keep fixing until applied or clearly blocked.

## Key files

| Path | Role |
|------|------|
| `catalog.json` | Machine index of installable presets |
| `gallery.json` | Concept ads + optional preset pairing |
| `presets/<id>/` | `theme.json` + `background.jpg` |
| `scripts/apply-hub-skin.sh` | One-shot install + apply (no ProvDex) |
| `scripts/codex-apply.md` | Short prompt users can paste with this URL |
| `CODEX-PROMPT.md` | Full Chinese/English deploy prompt |

## Custom wallpaper

If the user attaches an image:

```bash
~/.codex/codex-dream-skin-studio/scripts/customize-theme-macos.sh \
  --image "<absolute-path>" --name "我的皮肤"
```

Bootstrap the engine first with any hub preset if the studio directory is missing.
