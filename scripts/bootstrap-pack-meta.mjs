#!/usr/bin/env node
/**
 * Write pack.json + concept/wallpaper prompt stubs for gallery themes.
 * Only cn-v2 Codex-glass packs are galleryReady; intl marketing stays WIP.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CDN = "https://cdn.jsdelivr.net/gh/Chiody/agent-skin-hub@main";
const LOCK = readFileSync(
  join(root, "docs/ads/cn-batch/gen-prompt-base.txt"),
  "utf8"
).trim();

const MAP = [
  ["01-sakura-glass.jpg", "preset-trial-rose-soft", true, "夜樱玻璃", "暮色樱花树下的东亚女生，柔粉氛围，人物偏右"],
  ["02-caishen-glass.jpg", "preset-trial-caishen", true, "财神打工", "国潮财神墨镜打工梗，红金喜庆，人物偏右"],
  ["03-guochao-glass.jpg", "preset-trial-neon-rain", true, "国潮赛博", "国潮霓虹雨夜，红白赛博点缀，人物偏右"],
  ["04-rooftop-glass.jpg", "preset-trial-rooftop", true, "放学屋顶", "放学后屋顶看夕阳的少女，暖橙天空，人物偏右"],
  ["05-xianxia-glass.jpg", "preset-trial-xianxia", true, "修仙国漫", "国漫修仙气场，仙气与夜色，人物偏右"],
  ["06-kpop-glass.jpg", "preset-trial-kpop", true, "韩偶女", "舞台感韩系女爱豆造型，粉紫灯光，人物偏右"],
  ["07-kpop-boy-glass.jpg", "preset-trial-kpop-boy", true, "韩偶男", "舞台感韩系男爱豆造型，冷色灯光，人物偏右"],
  ["08-overtime-meme.jpg", "preset-trial-overtime", true, "加班梗图", "程序员加班自嘲梗图氛围，深夜显示器光，人物偏右"],
  ["09-hanfu-glass.jpg", "preset-trial-hanfu", true, "汉服园林", "汉服与园林夜色，雅致青绿，人物偏右"],
  ["10-vtuber-glass.jpg", "preset-trial-vtuber", true, "虚拟偶像", "虚拟偶像直播间霓虹，赛博可爱，人物偏右"],
  ["11-koi-glass.jpg", "preset-trial-koi", true, "锦鲤好运", "锦鲤与好运红金，喜庆留白，主体偏右"],
  ["24-yuexin-miao-glass.jpg", "preset-trial-yuexin-miao", true, "月薪喵", "贴纸风白猫捂鼻散味梗，米黄耳朵蓝眼睛粗描边，主体偏右"],
  ["12-synthwave.jpg", "preset-trial-synthwave", false, "Synthwave 80s", "80s synthwave 霓虹公路与日落，人物或跑车偏右"],
  ["13-nordic-minimal.jpg", "preset-trial-nordic", false, "北欧极简", "北欧极简木与白，柔光，主体偏右留白左侧"],
  // 14-cyber-rain shares preset-trial-neon-rain with 国潮 — do not overwrite pack; archive only
  ["15-ocean-coast.jpg", "preset-trial-ocean", false, "海边编程", "海岸阳光与笔记本，人物偏右"],
  ["16-coffee-cozy.jpg", "preset-trial-coffee", false, "咖啡窝", "咖啡馆暖光与咖啡，人物偏右"],
  ["17-matrix-terminal.jpg", "preset-trial-matrix", false, "黑客终端", "绿色矩阵终端洞穴感，人物或代码瀑布偏右"],
  ["18-sakura-night.jpg", "preset-sakura-dawn", false, "樱花夜", "夜樱与灯笼，人物偏右"],
  ["19-steampunk.jpg", "preset-trial-steampunk", false, "蒸汽朋克", "黄铜齿轮蒸汽城，场景偏右"],
  ["20-desert-sunset.jpg", "preset-trial-desert", false, "沙漠落日", "沙漠落日沙丘，场景偏右"],
  ["21-snow-cabin.jpg", "preset-snow-scape", false, "雪屋静写", "雪屋与静谧冬景，场景偏右"],
  ["22-space-nasa.jpg", "preset-trial-space", false, "太空站", "轨道太空站舷窗地球，场景偏右"],
  ["23-saas-teal.jpg", "preset-trial-saas-teal", false, "Teal SaaS", "青绿干净产品氛围，抽象几何偏右"],
];

const archiveDir = join(root, "docs/ads/archive-intl-marketing");
mkdirSync(archiveDir, { recursive: true });

let n = 0;
for (const [file, presetId, galleryReady, title, wallpaperScene] of MAP) {
  const presetDir = join(root, "presets", presetId);
  if (!existsSync(join(presetDir, "theme.json"))) {
    console.warn("skip missing preset", presetId);
    continue;
  }
  const theme = JSON.parse(readFileSync(join(presetDir, "theme.json"), "utf8"));
  const conceptRel = `docs/ads/${file}`;
  const conceptPrompt = `${LOCK}

THEME: ${title} (${presetId})
Palette hint: accent ${theme.colors?.accent || "?"}, appearance ${theme.appearance || "dark"}.
Background art direction (visible through glass): ${wallpaperScene}.
Keep Chinese UI labels sharp and readable.
`;
  const wallpaperPrompt = `# Wallpaper prompt — ${title}

16:9 pure atmosphere wallpaper for Codex Dream Skin (NO UI chrome, NO sidebar, NO buttons, NO text overlays).

Scene: ${wallpaperScene}.
Composition: subject/focus on the RIGHT (~60%); soft empty/blur LEFT for glass UI overlays.
Style: match the gallery concept mood; original characters only; no celebrity / copyrighted IP faces.
Output: 2560×1440 JPEG, no stretch.

Appearance target: ${theme.appearance || "dark"}
Accent hint: ${theme.colors?.accent || ""}
`;

  writeFileSync(join(presetDir, "concept-prompt.md"), conceptPrompt.trim() + "\n", "utf8");
  writeFileSync(join(presetDir, "wallpaper-prompt.md"), wallpaperPrompt.trim() + "\n", "utf8");

  const pack = {
    schemaVersion: 1,
    id: presetId,
    name: theme.name || title,
    shell: "codex-glass-v2",
    galleryReady: Boolean(galleryReady),
    concept: {
      path: conceptRel,
      promptPath: `presets/${presetId}/concept-prompt.md`,
    },
    wallpaper: {
      path: `presets/${presetId}/background.jpg`,
      promptPath: `presets/${presetId}/wallpaper-prompt.md`,
    },
    colorsPath: `presets/${presetId}/theme.json`,
    installCmd: `curl -fsSL ${CDN}/scripts/apply-hub-skin.sh | bash -s -- ${presetId}`,
    note: galleryReady
      ? "Public gallery OK (Codex glass v2 preview)."
      : "Installable via command, but preview is legacy marketing art — regenerate with concept-prompt.md before galleryReady=true.",
  };
  writeFileSync(join(presetDir, "pack.json"), JSON.stringify(pack, null, 2) + "\n", "utf8");

  if (!galleryReady && existsSync(join(root, "docs/ads", file))) {
    const dest = join(archiveDir, file);
    if (!existsSync(dest)) copyFileSync(join(root, "docs/ads", file), dest);
  }
  n += 1;
  console.log(`${galleryReady ? "READY" : "WIP  "} ${presetId} <- ${file}`);
}

// archive marketing twin that shares neon-rain preset
const cyberRain = join(root, "docs/ads/14-cyber-rain.jpg");
if (existsSync(cyberRain)) {
  const dest = join(archiveDir, "14-cyber-rain.jpg");
  if (!existsSync(dest)) copyFileSync(cyberRain, dest);
  console.log("ARCH  14-cyber-rain.jpg (shared preset, marketing twin)");
}

writeFileSync(
  join(archiveDir, "README.md"),
  `# Archived intl marketing landings

These were ProvDex website-style mockups, not Codex glass shells.
Do not show in ProvDex / skinhub gallery.

Regenerate with presets/<id>/concept-prompt.md, then set pack.json galleryReady=true.
`,
  "utf8"
);
console.log(`Wrote pack meta for ${n} presets`);
