#!/usr/bin/env node
/**
 * Capture Codex home-page previews for Skin Hub README.
 * Needs local skin injector on CDP :9341.
 */
import { spawn } from "node:child_process";
import { copyFileSync, readdirSync, rmSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const hub = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(hub, "docs", "previews");
const themesRoot = join(homedir(), "Library/Application Support/CodexDreamSkinStudio/themes");
const activeTheme = join(homedir(), "Library/Application Support/CodexDreamSkinStudio/theme");
const injector = join(homedir(), ".codex/codex-dream-skin-studio/scripts/injector.mjs");
const FEATURED = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "preset-strawberry-starlight",
      "preset-azure-matrix",
      "preset-snow-scape",
      "preset-ember-bloom",
      "preset-cyber-neon",
      "preset-midnight-aurora",
    ];

const PROJECT_ADS = ["★ ProvDex", "多智能体管理中心", "一键更换皮肤", "一键切换模型", "Claude · Codex · Desktop", "→ provdex.com"];
const THREAD_ADS = ["外观 Skin Hub 一键应用 免费", "中转 / API Key 本地写入 本地", "不改官方安装包 安全"];
const PINNED = "ProvDex · 把 API 接到 Claude / Codex";
const SUG = [
  "用 ProvDex 一键换 Codex 皮肤",
  "一键把 API 接到 Claude / Codex",
  "多智能体管理，模型随手切换",
  "@ 将你常用的应用连接到 Codex",
];

const run = (cmd, args, opts = {}) =>
  new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"], ...opts });
    let out = "", err = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (c) => (c ? rej(new Error(err || out || `exit ${c}`)) : res(out)));
  });

async function withPage(fn) {
  const list = await fetch("http://127.0.0.1:9341/json/list").then((r) => r.json());
  const page = list.find((p) => p.type === "page" && String(p.url || "").startsWith("app://"));
  if (!page) throw new Error("no Codex page on CDP :9341");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r, j) => {
    ws.addEventListener("open", r, { once: true });
    ws.addEventListener("error", j, { once: true });
  });
  let id = 1;
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const i = id++;
      const h = (ev) => {
        const msg = JSON.parse(ev.data);
        if (msg.id !== i) return;
        ws.removeEventListener("message", h);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      };
      ws.addEventListener("message", h);
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  await send("Page.enable");
  await send("Runtime.enable");
  try {
    return await fn(send);
  } finally {
    try {
      ws.close();
    } catch {}
  }
}

function stageTheme(presetId) {
  const src = join(themesRoot, presetId);
  if (!existsSync(src)) throw new Error(`missing theme ${src}`);
  mkdirSync(activeTheme, { recursive: true });
  for (const name of readdirSync(activeTheme)) rmSync(join(activeTheme, name), { force: true });
  copyFileSync(join(src, "theme.json"), join(activeTheme, "theme.json"));
  const bg = readdirSync(src).find((f) => f.startsWith("background."));
  if (!bg) throw new Error(`no background in ${src}`);
  copyFileSync(join(src, bg), join(activeTheme, bg));
}

async function capture(presetId) {
  stageTheme(presetId);
  await run(process.execPath, [injector, "--once", "--port", "9341", "--theme-dir", activeTheme]);
  await new Promise((r) => setTimeout(r, 1000));
  const out = join(outDir, `${presetId}.jpg`);
  await withPage(async (send) => {
    await send("Runtime.evaluate", {
      expression: `([...document.querySelectorAll("button,[role=button]")].find(b=>/新对话|New chat/i.test(b.textContent||""))||{}).click?.()`,
    });
    for (let i = 0; i < 24; i++) {
      await new Promise((r) => setTimeout(r, 250));
      const home = await send("Runtime.evaluate", {
        returnByValue: true,
        expression: `!!document.querySelector(".dream-skin-quote, .dream-skin-bg") && /做些什么|What should we|ProvDex/.test(document.body.innerText||"")`,
      });
      if (home.result?.value) break;
    }
    const meta = await send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const PROJECT_ADS = ${JSON.stringify(PROJECT_ADS)};
        const THREAD_ADS = ${JSON.stringify(THREAD_ADS)};
        const PINNED = ${JSON.stringify(PINNED)};
        const SUG = ${JSON.stringify(SUG)};
        const aside = document.querySelector("aside.app-shell-left-panel");
        if (aside) {
          const sels = [...aside.querySelectorAll("span.min-w-0.truncate.select-none.flex-1")];
          if (sels[0]) sels[0].textContent = PINNED;
          let pi = 0;
          for (const el of sels.slice(1)) {
            if (pi < PROJECT_ADS.length) el.textContent = PROJECT_ADS[pi++];
          }
          const more = [...aside.querySelectorAll("span.min-w-0.truncate")];
          let ti = 0;
          for (const el of more) {
            if (ti < THREAD_ADS.length && /免费|本地|安全|线程|Thread/.test(el.parentElement?.textContent || "")) {
              /* keep badges */
            }
          }
        }
        const h1 = [...document.querySelectorAll("h1,h2,div")].find((el) => {
          const t = (el.textContent || "").trim();
          return t.length > 4 && t.length < 48 && /做些什么|What should we/.test(t);
        });
        if (h1) h1.textContent = "我们应该在ProvDex中做些什么？";
        const cards = [...document.querySelectorAll("button,[role='button']")].filter((b) => {
          const t = (b.textContent || "").trim();
          return t.length > 8 && t.length < 80 && !/设置|账户|新对话|搜索|完全访问/.test(t);
        });
        let si = 0;
        for (const c of cards) {
          if (si >= SUG.length) break;
          const span = c.querySelector("span") || c;
          if ((span.textContent || "").length > 6) span.textContent = SUG[si++];
        }
        return { quote: document.querySelector(".dream-skin-quote")?.textContent || "" };
      })()`,
    });
    console.log(presetId, "quote=", meta.result?.value?.quote);
    await new Promise((r) => setTimeout(r, 400));
    let shot;
    try {
      shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 88, fromSurface: false });
    } catch {
      shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 88, fromSurface: true });
    }
    writeFileSync(out, Buffer.from(shot.data, "base64"));
    console.log("wrote", out);
  });
}

mkdirSync(outDir, { recursive: true });
for (const id of FEATURED) {
  console.log("====", id, "====");
  await capture(id);
}
console.log("done");
