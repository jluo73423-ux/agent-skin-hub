#!/usr/bin/env node
/**
 * Build gallery.json — PUBLIC concepts must be galleryReady Codex-glass previews only.
 * See docs/THEME-PACK.md
 */
import { existsSync, readdirSync, writeFileSync, statSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const RAW = "https://cdn.jsdelivr.net/gh/Chiody/agent-skin-hub@main";
const now = new Date().toISOString();

/**
 * Candidate concept → preset map.
 * Only entries whose pack.json has galleryReady:true are published.
 */
const CONCEPTS = [
  { id: "01-sakura-glass", file: "01-sakura-glass.jpg", name: "夜樱玻璃", group: "cn-v2", presetId: "preset-trial-rose-soft" },
  { id: "02-caishen-glass", file: "02-caishen-glass.jpg", name: "财神打工", group: "cn-v2", presetId: "preset-trial-caishen" },
  { id: "03-guochao-glass", file: "03-guochao-glass.jpg", name: "国潮赛博", group: "cn-v2", presetId: "preset-trial-neon-rain" },
  { id: "04-rooftop-glass", file: "04-rooftop-glass.jpg", name: "放学屋顶", group: "cn-v2", presetId: "preset-trial-rooftop" },
  { id: "05-xianxia-glass", file: "05-xianxia-glass.jpg", name: "修仙国漫", group: "cn-v2", presetId: "preset-trial-xianxia" },
  { id: "06-kpop-glass", file: "06-kpop-glass.jpg", name: "韩偶女", group: "cn-v2", presetId: "preset-trial-kpop" },
  { id: "07-kpop-boy-glass", file: "07-kpop-boy-glass.jpg", name: "韩偶男", group: "cn-v2", presetId: "preset-trial-kpop-boy" },
  { id: "08-overtime-meme", file: "08-overtime-meme.jpg", name: "加班梗图", group: "cn-v2", presetId: "preset-trial-overtime" },
  { id: "09-hanfu-glass", file: "09-hanfu-glass.jpg", name: "汉服园林", group: "cn-v2", presetId: "preset-trial-hanfu" },
  { id: "10-vtuber-glass", file: "10-vtuber-glass.jpg", name: "虚拟偶像", group: "cn-v2", presetId: "preset-trial-vtuber" },
  { id: "11-koi-glass", file: "11-koi-glass.jpg", name: "锦鲤好运", group: "cn-v2", presetId: "preset-trial-koi" },
  { id: "24-yuexin-miao-glass", file: "24-yuexin-miao-glass.jpg", name: "月薪喵", group: "cn-v2", presetId: "preset-trial-yuexin-miao" },
  { id: "25-classic-blue-2007", file: "25-classic-blue-2007.jpg", name: "经典蓝 2007", group: "cn-v2", presetId: "preset-classic-blue-2007" },
  // intl: kept in map for regen; pack.json galleryReady=false → not published
  { id: "12-synthwave", file: "12-synthwave.jpg", name: "Synthwave 80s", group: "intl", presetId: "preset-trial-synthwave" },
  { id: "13-nordic-minimal", file: "13-nordic-minimal.jpg", name: "北欧极简", group: "intl", presetId: "preset-trial-nordic" },
  { id: "14-cyber-rain", file: "14-cyber-rain.jpg", name: "赛博雨夜", group: "intl", presetId: "preset-trial-neon-rain" },
  { id: "15-ocean-coast", file: "15-ocean-coast.jpg", name: "海边编程", group: "intl", presetId: "preset-trial-ocean" },
  { id: "16-coffee-cozy", file: "16-coffee-cozy.jpg", name: "咖啡窝", group: "intl", presetId: "preset-trial-coffee" },
  { id: "17-matrix-terminal", file: "17-matrix-terminal.jpg", name: "黑客终端", group: "intl", presetId: "preset-trial-matrix" },
  { id: "18-sakura-night", file: "18-sakura-night.jpg", name: "樱花夜", group: "intl", presetId: "preset-sakura-dawn" },
  { id: "19-steampunk", file: "19-steampunk.jpg", name: "蒸汽朋克", group: "intl", presetId: "preset-trial-steampunk" },
  { id: "20-desert-sunset", file: "20-desert-sunset.jpg", name: "沙漠落日", group: "intl", presetId: "preset-trial-desert" },
  { id: "21-snow-cabin", file: "21-snow-cabin.jpg", name: "雪屋静写", group: "intl", presetId: "preset-snow-scape" },
  { id: "22-space-nasa", file: "22-space-nasa.jpg", name: "太空站", group: "intl", presetId: "preset-trial-space" },
  { id: "23-saas-teal", file: "23-saas-teal.jpg", name: "Teal SaaS", group: "intl", presetId: "preset-trial-saas-teal" },
];

function abs(rel) {
  return rel ? `${RAW}/${rel.replace(/^\//, "")}` : null;
}

function fileMeta(rel) {
  const p = join(root, rel);
  if (!existsSync(p)) return null;
  return { path: rel, url: abs(rel), bytes: statSync(p).size };
}

function readPack(presetId) {
  const p = join(root, "presets", presetId, "pack.json");
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

const concepts = [];
const skipped = [];
for (const c of CONCEPTS) {
  const pack = c.presetId ? readPack(c.presetId) : null;
  const galleryReady = pack?.galleryReady === true;
  if (!galleryReady) {
    skipped.push(`${c.id} (${c.presetId || "no-preset"})`);
    continue;
  }

  // 同一 preset 只能挂它 pack.json 声明的那一张预览（避免 14-cyber-rain 蹭国潮的 galleryReady）
  const conceptRel = pack?.concept?.path || `docs/ads/${c.file}`;
  if (pack?.concept?.path && pack.concept.path !== `docs/ads/${c.file}`) {
    skipped.push(`${c.id} (not pack.concept.path)`);
    continue;
  }
  if (!conceptRel.startsWith("docs/ads/")) {
    console.warn(`skip bad concept path: ${conceptRel}`);
    continue;
  }
  const concept = fileMeta(conceptRel);
  if (!concept) {
    console.warn(`skip missing ad: ${conceptRel}`);
    continue;
  }

  const wallpaper = fileMeta(pack?.wallpaper?.path || `presets/${c.presetId}/background.jpg`);
  const livePreview = fileMeta(`docs/previews/${c.presetId}.jpg`);
  const downloadBase = wallpaper ? abs(`presets/${c.presetId}`) : null;
  const installCmd =
    pack?.installCmd ||
    `curl -fsSL ${RAW}/scripts/apply-hub-skin.sh | bash -s -- ${c.presetId}`;

  concepts.push({
    id: c.id,
    name: c.name,
    group: c.group,
    kind: "concept-ad",
    shell: pack?.shell || "codex-glass-v2",
    galleryReady: true,
    note: "整窗 Codex 玻璃态预览；勿当作换肤 background 导入",
    concept,
    wallpaper,
    livePreview,
    conceptPrompt: fileMeta(pack?.concept?.promptPath || `presets/${c.presetId}/concept-prompt.md`),
    wallpaperPrompt: fileMeta(
      pack?.wallpaper?.promptPath || `presets/${c.presetId}/wallpaper-prompt.md`
    ),
    presetId: c.presetId,
    downloadBase,
    installCmd,
  });
}

const presetsDir = join(root, "presets");
const installables = [];
for (const name of readdirSync(presetsDir).sort()) {
  const dir = join(presetsDir, name);
  if (!statSync(dir).isDirectory()) continue;
  const wallpaper = fileMeta(`presets/${name}/background.jpg`);
  if (!wallpaper) continue;
  const pack = readPack(name);
  installables.push({
    id: name,
    wallpaper,
    livePreview: fileMeta(`docs/previews/${name}.jpg`),
    downloadBase: abs(`presets/${name}`),
    galleryReady: pack?.galleryReady === true,
    installCmd:
      pack?.installCmd ||
      `curl -fsSL ${RAW}/scripts/apply-hub-skin.sh | bash -s -- ${name}`,
  });
}

const gallery = {
  schemaVersion: 3,
  name: "agent-skin-hub-gallery",
  updatedAt: now,
  homepage: "https://github.com/Chiody/agent-skin-hub",
  rawBase: RAW,
  catalogUrl: `${RAW}/catalog.json`,
  themePackDoc: `${RAW}/docs/THEME-PACK.md`,
  usage: {
    concept: "公开画廊：仅 Codex 玻璃态整窗预览（galleryReady）",
    wallpaper: "安装用纯背景底图（不进画廊缩略图）",
    livePreview: "真机 Codex 实拍（可选）",
  },
  concepts,
  installables,
  skippedFromGallery: skipped,
};

writeFileSync(join(root, "gallery.json"), JSON.stringify(gallery, null, 2) + "\n");
console.log(
  `Wrote gallery.json: ${concepts.length} public concepts, ${installables.length} installables, skipped ${skipped.length}`
);
if (skipped.length) console.log("skipped (not galleryReady):\n - " + skipped.join("\n - "));
