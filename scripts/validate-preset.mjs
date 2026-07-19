#!/usr/bin/env node
/**
 * Validate one preset directory for agent-skin-hub.
 * Usage: node scripts/validate-preset.mjs <preset-dir>
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const hubRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = resolve(process.argv[2] || "");
if (!process.argv[2]) {
  console.error("Usage: node scripts/validate-preset.mjs <preset-dir>");
  process.exit(2);
}

const errors = [];
const warnings = [];
const id = basename(dir);
if (!/^preset-[a-z0-9-]+$/.test(id)) {
  errors.push(`dir name must match preset-<slug>: ${id}`);
}

const themePath = join(dir, "theme.json");
if (!existsSync(themePath)) errors.push("missing theme.json");
else {
  let theme;
  try {
    theme = JSON.parse(readFileSync(themePath, "utf8"));
  } catch (e) {
    errors.push(`theme.json parse error: ${e.message}`);
  }
  if (theme) {
    if (theme.schemaVersion !== 1) errors.push("schemaVersion must be 1");
    if (!theme.id || theme.id !== id) errors.push(`theme.id must equal folder name (${id})`);
    if (!theme.name) errors.push("missing name");
    if (!theme.image) errors.push("missing image");
    else {
      const img = join(dir, theme.image);
      if (!existsSync(img)) errors.push(`image missing: ${theme.image}`);
      else {
        const st = statSync(img);
        if (st.size > 8 * 1024 * 1024) warnings.push(`image > 8MB (${st.size})`);
        if (st.size < 10_000) warnings.push(`image suspiciously small (${st.size})`);
      }
    }
    if (!theme.colors || typeof theme.colors !== "object") {
      warnings.push("missing colors object (hub prefers full palette)");
    }
  }
}

if (!existsSync(join(dir, "SOURCE.md"))) {
  warnings.push("missing SOURCE.md (source URL + rights)");
}

const packPath = join(dir, "pack.json");
if (existsSync(packPath)) {
  try {
    const pack = JSON.parse(readFileSync(packPath, "utf8"));
    if (pack.galleryReady === true) {
      if (pack.shell !== "codex-glass-v2") {
        errors.push("galleryReady pack must set shell=codex-glass-v2");
      }
      for (const rel of [
        pack.concept?.path,
        pack.concept?.promptPath,
        pack.wallpaper?.path,
        pack.wallpaper?.promptPath,
      ]) {
        if (!rel) {
          errors.push("galleryReady pack missing concept/wallpaper path fields");
          break;
        }
        if (!existsSync(join(hubRoot, rel))) {
          errors.push(`galleryReady missing file: ${rel}`);
        }
      }
      if (!String(pack.concept?.path || "").startsWith("docs/ads/")) {
        errors.push("galleryReady concept.path must be under docs/ads/");
      }
    }
  } catch (e) {
    errors.push(`pack.json parse error: ${e.message}`);
  }
} else {
  warnings.push("missing pack.json (see docs/THEME-PACK.md)");
}

for (const name of readdirSync(dir)) {
  if (/\.(sh|ps1|exe|dll|bat|command|mjs|js|py|asar)$/i.test(name)) {
    errors.push(`disallowed file in preset pack: ${name}`);
  }
}

const report = { id, dir, ok: errors.length === 0, errors, warnings };
console.log(JSON.stringify(report, null, 2));
process.exit(errors.length ? 1 : 0);
