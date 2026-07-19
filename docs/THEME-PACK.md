# Theme Pack 成套标准（必守）

每一个对外展示的主题，必须凑齐下面五件，缺一不可上架画廊。

| # | 资产 | 路径约定 | 说明 |
|---|------|----------|------|
| 1 | **整窗预览图** | `docs/ads/<nn>-*.jpg` | Codex 玻璃态整窗：侧栏磨砂染色 + 四张建议卡 + 底部输入框，字可读。**不是**官网营销页，**不是**半截底图 |
| 2 | **安装底图** | `presets/<id>/background.jpg` | 纯 16:9 氛围底图，给换肤引擎用；禁止直接拿预览图当底图 |
| 3 | **预览图提示词** | `presets/<id>/concept-prompt.md` | 生成/复现整窗预览的锁定提示词（对齐 `docs/ads/cn-batch/PROMPT-LOCK.md`） |
| 4 | **底图提示词** | `presets/<id>/wallpaper-prompt.md` | 生成底图的场景/焦点/禁 UI 提示词 |
| 5 | **配色** | `presets/<id>/theme.json` → `colors` | 侧栏/强调色/文字色等，与预览观感一致 |

另有元数据：`presets/<id>/pack.json`（`shell`、`galleryReady`、路径索引、一键安装命令）。

## 预览图硬性构图（codex-glass-v2）

见 [`docs/ads/cn-batch/PROMPT-LOCK.md`](./ads/cn-batch/PROMPT-LOCK.md) 与 [`gen-prompt-base.txt`](./ads/cn-batch/gen-prompt-base.txt)：

- 壳品牌 = **Codex**（不是 ProvDex 官网）
- ProvDex 文案只出现在侧栏「项目」列表
- 侧栏 / 建议卡 / 输入框 = 半透明磨砂玻璃，跟主题染色
- 16:9，字清晰可读
- **禁止上架**：营销落地页、只有输入框、侧栏被裁死、半张底图、死白不透明大砖

## 新主题生成流程（每次照做）

1. 写 `wallpaper-prompt.md` → 出 `background.jpg`（16:9，人物偏右，左侧留给 UI）
2. 写 `theme.json`（含完整 `colors` + `appearance`）
3. 按 PROMPT-LOCK 写 `concept-prompt.md` → 出整窗预览 → 存 `docs/ads/`
4. 写 `pack.json`：`shell: "codex-glass-v2"`, `galleryReady: true`
5. `node scripts/validate-preset.mjs presets/<id>`
6. 更新 `scripts/build-gallery.mjs` CONCEPTS 映射 → `node scripts/build-catalog.mjs && node scripts/build-gallery.mjs`
7. 推送后 purge jsDelivr；ProvDex / 官网只展示 `galleryReady === true` 的预览图

## 用户侧展示规则

- **ProvDex / 官网 / README 画廊**：只展示预览图；点图看大图；提供一行安装命令复制给 Codex
- **底图**：不进画廊缩略图；仅安装时下载
- **未达标主题**：可留在 `catalog.json` 供命令行安装，但 **不得** 进入公开画廊

## 校验

```bash
node scripts/validate-preset.mjs presets/preset-xxx
node scripts/audit-gallery-quality.mjs   # 公开画廊必须全部 galleryReady
```
