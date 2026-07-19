#!/usr/bin/env node
/** Fail if public gallery.json includes non galleryReady concepts. */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const gallery = JSON.parse(readFileSync(join(root, "gallery.json"), "utf8"));
const bad = [];
for (const c of gallery.concepts || []) {
  if (c.galleryReady !== true) {
    bad.push(`${c.id} galleryReady=${c.galleryReady}`);
    continue;
  }
  if (!c.concept?.path?.startsWith("docs/ads/")) {
    bad.push(`${c.id} concept not under docs/ads`);
  }
  if (c.wallpaper?.path && c.concept?.path === c.wallpaper?.path) {
    bad.push(`${c.id} concept==wallpaper`);
  }
  if (c.presetId) {
    const packPath = join(root, "presets", c.presetId, "pack.json");
    if (!existsSync(packPath)) bad.push(`${c.id} missing pack.json`);
    else {
      const pack = JSON.parse(readFileSync(packPath, "utf8"));
      if (pack.galleryReady !== true) bad.push(`${c.id} pack.galleryReady!=true`);
      if (pack.shell !== "codex-glass-v2") bad.push(`${c.id} shell!=codex-glass-v2`);
    }
  }
}
if (bad.length) {
  console.error("FAIL gallery quality:\n" + bad.map((x) => " - " + x).join("\n"));
  process.exit(1);
}
console.log(`PASS ${gallery.concepts.length} public concepts are galleryReady codex-glass-v2`);
