const LINES = [
  "★ ProvDex",
  "多智能体管理中心",
  "一键更换皮肤",
  "一键切换模型",
  "Claude · Codex · Desktop",
  "→ provdex.com",
  "外观 Skin Hub 免费",
  "中转 / API 本地写入",
];

const list = await (await fetch("http://127.0.0.1:9341/json/list")).json();
const page = list.find((p) => p.type === "page" && String(p.url || "").startsWith("app://"));
if (!page) throw new Error("no page");
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

await send("Runtime.enable");

const dump = await send("Runtime.evaluate", {
  returnByValue: true,
  expression: `(() => {
    const aside = document.querySelector("aside.app-shell-left-panel");
    return [...aside.querySelectorAll("button, a")].map(el => ({
      text: (el.innerText||"").replace(/\\s+/g," ").trim().slice(0,100),
    })).filter(r => r.text && !/^(新建任务|拉取请求|已安排|插件)$/.test(r.text)).slice(0, 30);
  })()`,
});
console.log("DUMP", JSON.stringify(dump.result?.value, null, 2));

const r = await send("Runtime.evaluate", {
  returnByValue: true,
  expression: `(() => {
    const LINES = ${JSON.stringify(LINES)};
    const KEY = "__provdexSidebarAds";
    if (window[KEY]?.obs) try { window[KEY].obs.disconnect(); } catch {}
    const NAV = /新建任务|拉取请求|已安排|插件|搜索|设置|账户|帮助/;
    const apply = () => {
      const aside = document.querySelector("aside.app-shell-left-panel");
      if (!aside) return { ok:false };
      const leaves = [...aside.querySelectorAll("span")].filter(el => {
        if (el.children.length) return false;
        const t = (el.textContent||"").trim();
        if (!t || t.length > 60 || t.length <= 1) return false;
        if (NAV.test(t)) return false;
        if (/^(置顶|项目|Pinned|Projects|今天|昨天|更早|无任务)$/.test(t)) return false;
        if (/^https?:/.test(t)) return false;
        return true;
      });
      const seen = new Set();
      const targets = [];
      for (const el of leaves) {
        const row = el.closest("button, a, [role='button']") || el.parentElement;
        if (!row || seen.has(row)) continue;
        const primary = row.querySelector("span.min-w-0.truncate, span.truncate") || el;
        seen.add(row);
        targets.push(primary);
      }
      const out = [];
      for (let i = 0; i < targets.length && i < LINES.length; i++) {
        targets[i].textContent = LINES[i];
        out.push(LINES[i]);
      }
      return { ok:true, targets: targets.length, applied: out };
    };
    const first = apply();
    const obs = new MutationObserver(() => {
      if (window[KEY].raf) return;
      window[KEY].raf = requestAnimationFrame(() => { window[KEY].raf = 0; apply(); });
    });
    const aside = document.querySelector("aside.app-shell-left-panel");
    if (aside) obs.observe(aside, { childList:true, subtree:true, characterData:true });
    window[KEY] = { obs, apply };
    return first;
  })()`,
});
console.log("APPLY", JSON.stringify(r.result?.value, null, 2));

await send("Runtime.evaluate", {
  expression: `(() => {
    const ID = "provdex-contrast-boost";
    document.getElementById(ID)?.remove();
    const s = document.createElement("style");
    s.id = ID;
    s.textContent = \`
      html.codex-dream-skin[data-dream-shell="light"] .group\\\\/home-suggestions button {
        background: rgba(255,252,248,0.96) !important;
        color: #1C1210 !important;
        border: 1px solid rgba(185,28,28,0.35) !important;
      }
      html.codex-dream-skin[data-dream-shell="light"] .group\\\\/home-suggestions button,
      html.codex-dream-skin[data-dream-shell="light"] .group\\\\/home-suggestions button * {
        color: #1C1210 !important;
        opacity: 1 !important;
        -webkit-text-fill-color: #1C1210 !important;
      }
      html.codex-dream-skin[data-dream-shell="light"] .group\\\\/home-suggestions button svg {
        color: #B91C1C !important;
      }
      html.codex-dream-skin[data-dream-shell="light"] [data-feature="game-source"] {
        color: #1C1210 !important;
        -webkit-text-fill-color: #1C1210 !important;
      }
      html.codex-dream-skin[data-dream-shell="light"] [data-feature="game-source"]::after {
        color: rgba(28,18,16,0.85) !important;
      }
      html.codex-dream-skin[data-dream-shell="light"] aside.app-shell-left-panel {
        background: rgba(255,248,240,0.90) !important;
      }
      html.codex-dream-skin[data-dream-shell="light"] aside.app-shell-left-panel span,
      html.codex-dream-skin[data-dream-shell="light"] aside.app-shell-left-panel button,
      html.codex-dream-skin[data-dream-shell="light"] aside.app-shell-left-panel a {
        color: #1C1210 !important;
        -webkit-text-fill-color: #1C1210 !important;
        opacity: 1 !important;
      }
    \`;
    document.documentElement.appendChild(s);
    return true;
  })()`,
});

await new Promise((r) => setTimeout(r, 500));
await send("Page.enable");
const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 92, fromSurface: false });
const fs = await import("node:fs");
const out = "/Volumes/T92T/AIcodedesk/agithub/agent-skin-hub/docs/previews/preset-trial-caishen.jpg";
fs.writeFileSync(out, Buffer.from(shot.data, "base64"));
console.log("wrote", out, fs.statSync(out).size);
ws.close();
