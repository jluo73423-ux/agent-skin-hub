# 发给 Codex 的部署提示词

把本仓库链接（或整仓 ZIP）连同下面提示词一起发给 **macOS Codex / ChatGPT Desktop**，让它自己完成换肤，不必安装 ProvDex。

仓库：https://github.com/Chiody/agent-skin-hub

---

## 中文（复制整段）

```text
请读取并使用开源仓 https://github.com/Chiody/agent-skin-hub （agent-skin-hub）在这台 Mac 上为 Codex Desktop 换肤并验收。

要求：
- 只改外观（CDP 注入），不要改官方 ChatGPT/Codex .app / app.asar，不要动 API Key / 中转 / Base URL。
- 概念图 docs/ads/ 不能当壁纸；只用 presets/*/background.jpg。
- 不要只给教程：请直接执行命令并汇报结果。

步骤：
1) 用 curl 读 catalog.json（优先 jsDelivr）：
   https://cdn.jsdelivr.net/gh/Chiody/agent-skin-hub@main/catalog.json
   列出可用皮肤 id/名称；若我已指定皮肤则用我的；否则推荐 preset-trial-yuexin-miao 或 preset-trial-rose-soft。
2) 执行一键安装：
   curl -fsSL https://cdn.jsdelivr.net/gh/Chiody/agent-skin-hub@main/scripts/apply-hub-skin.sh | bash -s -- <preset-id>
3) 确认侧栏、建议卡、输入框文字清晰可读。
4) 告诉我用了哪个 preset-id、是否成功；失败则读 ~/Library/Application Support/CodexDreamSkinStudio/ 日志继续修。
5) 若我要恢复官方外观：
   ~/.codex/codex-dream-skin-studio/scripts/restore-dream-skin-macos.sh

仓库说明见 SKILL.md / AGENTS.md / README.md。
```

---

## English (copy all)

```text
Use the open repo https://github.com/Chiody/agent-skin-hub to skin Codex Desktop on this Mac and verify.

Rules: appearance only (CDP). Do not modify the official ChatGPT/Codex .app / app.asar, API keys, or relay URLs. Do not import docs/ads concept shots as wallpapers — only presets/*/background.jpg. Execute commands; do not only give a tutorial.

1) Read https://cdn.jsdelivr.net/gh/Chiody/agent-skin-hub@main/catalog.json and pick a preset (default: preset-trial-yuexin-miao).
2) Run:
   curl -fsSL https://cdn.jsdelivr.net/gh/Chiody/agent-skin-hub@main/scripts/apply-hub-skin.sh | bash -s -- <preset-id>
3) Verify readability of sidebar / suggestion cards / composer.
4) Report preset id and result; on failure inspect ~/Library/Application Support/CodexDreamSkinStudio/ logs and keep fixing.
5) Restore:
   ~/.codex/codex-dream-skin-studio/scripts/restore-dream-skin-macos.sh

See SKILL.md / AGENTS.md / README.md.
```
