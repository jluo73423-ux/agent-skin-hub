<p align="center">
  <img src="docs/ads/01-sakura-glass.jpg" width="960" alt="ProvDex · 夜樱玻璃概念效果" />
</p>

<h1 align="center">agent-skin-hub</h1>

<p align="center">
  <strong>给 Codex 换一套好看的皮肤。</strong><br/>
  免费 · 开源 · 用 ProvDex 打开就能装
</p>

<p align="center">
  <a href="https://github.com/Chiody/agent-skin-hub/stargazers"><img alt="stars" src="https://img.shields.io/github/stars/Chiody/agent-skin-hub?style=flat-square&color=ff4d8d" /></a>
  <a href="./LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" /></a>
  <a href="https://provdex.com/skinhub.html"><img alt="skinhub" src="https://img.shields.io/badge/ProvDex-Skin%20Hub-34d399?style=flat-square" /></a>
  <a href="./gallery.json"><img alt="gallery" src="https://img.shields.io/badge/gallery.json-23%20ads-informational?style=flat-square" /></a>
</p>

<p align="center">
  <a href="https://provdex.com">ProvDex</a> ·
  <a href="https://provdex.com/skinhub.html">Skin Hub</a> ·
  <a href="./CODEX-PROMPT.md">发给 Codex</a> ·
  <a href="./catalog.json">catalog.json</a> ·
  <a href="./gallery.json">gallery.json</a>
</p>

---

## 像 Fei-Away 那样丢给 Codex

可以把本仓链接直接发给 **macOS Codex**，让它自己换肤（不必装 ProvDex）：

1. 把链接发给 Codex：`https://github.com/Chiody/agent-skin-hub`
2. 再贴上 [`CODEX-PROMPT.md`](./CODEX-PROMPT.md) 里的整段提示词（或下面最短版）
3. Codex 会读 [`SKILL.md`](./SKILL.md) / [`AGENTS.md`](./AGENTS.md)，执行 `apply-hub-skin.sh`

最短指令：

```text
用 https://github.com/Chiody/agent-skin-hub 在这台 Mac 给 Codex 换肤。
读 SKILL.md，执行：
curl -fsSL https://cdn.jsdelivr.net/gh/Chiody/agent-skin-hub@main/scripts/apply-hub-skin.sh | bash -s -- preset-trial-yuexin-miao
只改外观，别动官方 .app 和 API 配置。验收侧栏/建议卡/输入框是否清晰。
```

一键命令（终端也可直接跑）：

```bash
# 列出皮肤
curl -fsSL https://cdn.jsdelivr.net/gh/Chiody/agent-skin-hub@main/scripts/apply-hub-skin.sh | bash -s -- --list

# 安装并应用（示例：月薪喵）
curl -fsSL https://cdn.jsdelivr.net/gh/Chiody/agent-skin-hub@main/scripts/apply-hub-skin.sh | bash -s -- preset-trial-yuexin-miao
```

---

写代码已经够累了，工作台至少可以好看一点。

下面这些是**概念效果图**（整窗画了 Codex 界面：玻璃侧栏、建议卡、底部输入框）。真机换肤用的是旁边的**纯背景**，别把广告图当壁纸导入。

侧栏「项目」里那几行，就是 ProvDex 在说的事：多智能体中心、一键换肤、一键切模型。

| 资源 | 干什么用 | 在哪 |
|------|----------|------|
| 概念效果图 | GitHub / 官网画廊 | [`docs/ads/`](./docs/ads/) |
| 纯背景底图 | 真机导入 | [`presets/*/background.jpg`](./presets/) |
| 真机实拍 | 原生控件换色后的样子 | [`docs/previews/`](./docs/previews/) |
| 索引 | 按需拉 URL | [`gallery.json`](./gallery.json) · [`catalog.json`](./catalog.json) |

---

## 概念画廊 · 玻璃风 v2

<table>
  <tr>
    <td width="50%"><img src="docs/ads/01-sakura-glass.jpg" alt="夜樱" /><br/><sub>01 · 夜樱玻璃</sub></td>
    <td width="50%"><img src="docs/ads/02-caishen-glass.jpg" alt="财神" /><br/><sub>02 · 财神打工</sub></td>
  </tr>
  <tr>
    <td><img src="docs/ads/03-guochao-glass.jpg" alt="国潮" /><br/><sub>03 · 国潮赛博</sub></td>
    <td><img src="docs/ads/04-rooftop-glass.jpg" alt="放学" /><br/><sub>04 · 放学屋顶</sub></td>
  </tr>
  <tr>
    <td><img src="docs/ads/05-xianxia-glass.jpg" alt="修仙" /><br/><sub>05 · 修仙国漫</sub></td>
    <td><img src="docs/ads/06-kpop-glass.jpg" alt="韩偶女" /><br/><sub>06 · 韩偶女</sub></td>
  </tr>
  <tr>
    <td><img src="docs/ads/07-kpop-boy-glass.jpg" alt="韩偶男" /><br/><sub>07 · 韩偶男</sub></td>
    <td><img src="docs/ads/08-overtime-meme.jpg" alt="加班" /><br/><sub>08 · 加班梗图</sub></td>
  </tr>
  <tr>
    <td><img src="docs/ads/09-hanfu-glass.jpg" alt="汉服" /><br/><sub>09 · 汉服园林</sub></td>
    <td><img src="docs/ads/10-vtuber-glass.jpg" alt="虚拟偶像" /><br/><sub>10 · 虚拟偶像</sub></td>
  </tr>
  <tr>
    <td colspan="2" align="center"><img src="docs/ads/11-koi-glass.jpg" width="720" alt="锦鲤" /><br/><sub>11 · 锦鲤好运</sub></td>
  </tr>
</table>

说明 → [`docs/ads/README.md`](./docs/ads/README.md)

---

## 概念画廊 · 海外 / 其他（保留）

原先国外向那批全部保留，编号接在后面：

<table>
  <tr>
    <td width="50%"><img src="docs/ads/12-synthwave.jpg" alt="Synthwave" /><br/><sub>12 · Synthwave 80s</sub></td>
    <td width="50%"><img src="docs/ads/13-nordic-minimal.jpg" alt="北欧" /><br/><sub>13 · 北欧极简</sub></td>
  </tr>
  <tr>
    <td><img src="docs/ads/14-cyber-rain.jpg" alt="赛博雨" /><br/><sub>14 · 赛博雨夜</sub></td>
    <td><img src="docs/ads/15-ocean-coast.jpg" alt="海边" /><br/><sub>15 · 海边编程</sub></td>
  </tr>
  <tr>
    <td><img src="docs/ads/16-coffee-cozy.jpg" alt="咖啡" /><br/><sub>16 · 咖啡窝</sub></td>
    <td><img src="docs/ads/17-matrix-terminal.jpg" alt="终端" /><br/><sub>17 · 黑客终端</sub></td>
  </tr>
  <tr>
    <td><img src="docs/ads/18-sakura-night.jpg" alt="樱花夜" /><br/><sub>18 · 樱花夜</sub></td>
    <td><img src="docs/ads/19-steampunk.jpg" alt="蒸汽朋克" /><br/><sub>19 · 蒸汽朋克</sub></td>
  </tr>
  <tr>
    <td><img src="docs/ads/20-desert-sunset.jpg" alt="沙漠" /><br/><sub>20 · 沙漠落日</sub></td>
    <td><img src="docs/ads/21-snow-cabin.jpg" alt="雪屋" /><br/><sub>21 · 雪屋静写</sub></td>
  </tr>
  <tr>
    <td><img src="docs/ads/22-space-nasa.jpg" alt="太空站" /><br/><sub>22 · 太空站</sub></td>
    <td><img src="docs/ads/23-saas-teal.jpg" alt="SaaS" /><br/><sub>23 · Teal SaaS</sub></td>
  </tr>
</table>

> 只替换了对标 [Fei-Away/Codex-Dream-Skin](https://github.com/Fei-Away/Codex-Dream-Skin) 画廊那几张；海外向原图未删。对照仓旧克隆仍在 [`docs/ads/archive-old-20/`](./docs/ads/archive-old-20/)。

---

## 已配对：概念 × 底图 × 真机

| 概念 | 可导入底图 | 真机实拍 |
|------|------------|----------|
| 夜樱玻璃 | [`preset-trial-rose-soft`](./presets/preset-trial-rose-soft) | [preview](./docs/previews/preset-trial-rose-soft.jpg) |
| 财神打工 | [`preset-trial-caishen`](./presets/preset-trial-caishen) | [preview](./docs/previews/preset-trial-caishen.jpg) |
| 国潮赛博 | [`preset-trial-neon-rain`](./presets/preset-trial-neon-rain) | [preview](./docs/previews/preset-trial-neon-rain.jpg) |

---

## 怎么用

1. **发给 Codex**（推荐）：仓库链接 + [`CODEX-PROMPT.md`](./CODEX-PROMPT.md)  
2. 打开 [ProvDex](https://provdex.com) → Codex → **外观**  
3. 或逛 [Skin Hub](https://provdex.com/skinhub.html) 复制安装命令  

```bash
curl -fsSL https://cdn.jsdelivr.net/gh/Chiody/agent-skin-hub@main/catalog.json | head
curl -fsSL https://cdn.jsdelivr.net/gh/Chiody/agent-skin-hub@main/scripts/apply-hub-skin.sh | bash -s -- --list
```

---

## 可安装皮肤

完整目录见 [`catalog.json`](./catalog.json)（含 `wallpaperUrl` / `previewUrl`），预设在 [`presets/`](./presets/)。

---

## 想投稿？

```text
presets/preset-your-slug/
  theme.json
  background.jpg   ← 纯背景 16:9，别拿整页 UI 截图凑数
  SOURCE.md
```

**别投：** 游戏角色、真人明星脸、带侧栏输入框的假截图。

```bash
node scripts/build-catalog.mjs
node scripts/build-gallery.mjs
```

---

## License

MIT。每套皮肤看各自的 `SOURCE.md`。
