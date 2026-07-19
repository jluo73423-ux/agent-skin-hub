#!/usr/bin/env python3
"""Create installable packs for gallery concepts that lack presetId."""
from __future__ import annotations

import json
import colorsys
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ADS = ROOT / "docs" / "ads"
PRESETS = ROOT / "presets"

# concept id -> pack meta
MISSING = [
    {
        "concept": "04-rooftop-glass.jpg",
        "presetId": "preset-trial-rooftop",
        "name": "试装 · 放学屋顶",
        "tagline": "放学后的晚风，先把今天的代码收好。",
        "quote": "GOLDEN HOUR CODE",
        "projectLabel": "◉  选择项目",
        "appearance": "dark",
        "focusX": 0.78,
        "safeArea": "left",
    },
    {
        "concept": "05-xianxia-glass.jpg",
        "presetId": "preset-trial-xianxia",
        "name": "试装 · 修仙国漫",
        "tagline": "渡劫之前，先把这一关 debug 过。",
        "quote": "CULTIVATE & SHIP",
        "projectLabel": "◉  选择项目",
        "appearance": "dark",
        "focusX": 0.76,
        "safeArea": "left",
    },
    {
        "concept": "06-kpop-glass.jpg",
        "presetId": "preset-trial-kpop",
        "name": "试装 · 韩偶女",
        "tagline": "聚光灯下也要把灵感写进下一行。",
        "quote": "STAGE READY",
        "projectLabel": "◉  选择项目",
        "appearance": "light",
        "focusX": 0.74,
        "safeArea": "left",
    },
    {
        "concept": "07-kpop-boy-glass.jpg",
        "presetId": "preset-trial-kpop-boy",
        "name": "试装 · 韩偶男",
        "tagline": "镜头外的安静里，继续打磨作品。",
        "quote": "CENTER STAGE",
        "projectLabel": "◉  选择项目",
        "appearance": "dark",
        "focusX": 0.74,
        "safeArea": "left",
    },
    {
        "concept": "08-overtime-meme.jpg",
        "presetId": "preset-trial-overtime",
        "name": "试装 · 加班梗图",
        "tagline": "又是肝到凌晨的一晚，提交前先喝口水。",
        "quote": "SHIP BEFORE DAWN",
        "projectLabel": "◉  选择项目",
        "appearance": "dark",
        "focusX": 0.7,
        "safeArea": "left",
    },
    {
        "concept": "09-hanfu-glass.jpg",
        "presetId": "preset-trial-hanfu",
        "name": "试装 · 汉服园林",
        "tagline": "亭台水榭之间，把思路慢慢铺开。",
        "quote": "GARDEN FLOW",
        "projectLabel": "◉  选择项目",
        "appearance": "light",
        "focusX": 0.72,
        "safeArea": "left",
    },
    {
        "concept": "10-vtuber-glass.jpg",
        "presetId": "preset-trial-vtuber",
        "name": "试装 · 虚拟偶像",
        "tagline": "开播前先把今天的任务列表清空。",
        "quote": "GO LIVE",
        "projectLabel": "◉  选择项目",
        "appearance": "dark",
        "focusX": 0.76,
        "safeArea": "left",
    },
    {
        "concept": "11-koi-glass.jpg",
        "presetId": "preset-trial-koi",
        "name": "试装 · 锦鲤好运",
        "tagline": "今天也要顺顺利利合上最后一个 PR。",
        "quote": "LUCKY COMMIT",
        "projectLabel": "◉  选择项目",
        "appearance": "light",
        "focusX": 0.7,
        "safeArea": "left",
    },
    {
        "concept": "12-synthwave.jpg",
        "presetId": "preset-trial-synthwave",
        "name": "试装 · Synthwave 80s",
        "tagline": "霓虹公路上，把灵感开到下一站。",
        "quote": "RETRO WAVE",
        "projectLabel": "◉  Select project",
        "appearance": "dark",
        "focusX": 0.68,
        "safeArea": "left",
    },
    {
        "concept": "13-nordic-minimal.jpg",
        "presetId": "preset-trial-nordic",
        "name": "试装 · 北欧极简",
        "tagline": "留白够了，代码就更清楚。",
        "quote": "LESS NOISE",
        "projectLabel": "◉  Select project",
        "appearance": "light",
        "focusX": 0.65,
        "safeArea": "left",
    },
    {
        "concept": "15-ocean-coast.jpg",
        "presetId": "preset-trial-ocean",
        "name": "试装 · 海边编程",
        "tagline": "潮声里写完这一段，再去散步。",
        "quote": "SEA BREEZE",
        "projectLabel": "◉  Select project",
        "appearance": "light",
        "focusX": 0.7,
        "safeArea": "left",
    },
    {
        "concept": "16-coffee-cozy.jpg",
        "presetId": "preset-trial-coffee",
        "name": "试装 · 咖啡窝",
        "tagline": "再续一杯，把难搞的函数写顺。",
        "quote": "BREW & BUILD",
        "projectLabel": "◉  Select project",
        "appearance": "light",
        "focusX": 0.68,
        "safeArea": "left",
    },
    {
        "concept": "17-matrix-terminal.jpg",
        "presetId": "preset-trial-matrix",
        "name": "试装 · 黑客终端",
        "tagline": "绿字滚动时，专注比炫技更重要。",
        "quote": "ROOT ACCESS",
        "projectLabel": "◉  Select project",
        "appearance": "dark",
        "focusX": 0.66,
        "safeArea": "left",
    },
    {
        "concept": "19-steampunk.jpg",
        "presetId": "preset-trial-steampunk",
        "name": "试装 · 蒸汽朋克",
        "tagline": "齿轮咬合的节奏里，精密地交付。",
        "quote": "ENGINEER LEGACY",
        "projectLabel": "◉  Select project",
        "appearance": "dark",
        "focusX": 0.7,
        "safeArea": "left",
    },
    {
        "concept": "20-desert-sunset.jpg",
        "presetId": "preset-trial-desert",
        "name": "试装 · 沙漠落日",
        "tagline": "沙海尽头的光，照亮今晚的进度条。",
        "quote": "DUNE LIGHT",
        "projectLabel": "◉  Select project",
        "appearance": "dark",
        "focusX": 0.68,
        "safeArea": "left",
    },
    {
        "concept": "22-space-nasa.jpg",
        "presetId": "preset-trial-space",
        "name": "试装 · 太空站",
        "tagline": "轨道上的值班员，正在对齐下一趟发射。",
        "quote": "MISSION CONTROL",
        "projectLabel": "◉  Select project",
        "appearance": "dark",
        "focusX": 0.7,
        "safeArea": "left",
    },
    {
        "concept": "23-saas-teal.jpg",
        "presetId": "preset-trial-saas-teal",
        "name": "试装 · Teal SaaS",
        "tagline": "干净的青绿界面，让复杂产品也好读。",
        "quote": "CLEAN SHIP",
        "projectLabel": "◉  Select project",
        "appearance": "light",
        "focusX": 0.66,
        "safeArea": "left",
    },
]


def rgb_to_hex(r: int, g: int, b: int) -> str:
    return f"#{r:02X}{g:02X}{b:02X}"


def sample_palette(im: Image.Image, appearance: str) -> dict:
    small = im.resize((64, 36), Image.Resampling.BOX)
    pixels = list(small.getdata())
    # average mid-right for accent (character side)
    acc_pixels = []
    bg_pixels = []
    for y in range(36):
        for x in range(64):
            p = pixels[y * 64 + x]
            if x >= 36:
                acc_pixels.append(p)
            if x <= 20:
                bg_pixels.append(p)
    def avg(ps):
        n = max(1, len(ps))
        return tuple(sum(c[i] for c in ps) // n for i in range(3))
    ar, ag, ab = avg(acc_pixels or pixels)
    br, bg, bb = avg(bg_pixels or pixels)
    # push accent saturation
    h, s, v = colorsys.rgb_to_hsv(ar / 255, ag / 255, ab / 255)
    s = min(0.85, max(0.35, s * 1.25))
    v = min(0.9, max(0.35, v))
    ar, ag, ab = [int(x * 255) for x in colorsys.hsv_to_rgb(h, s, v)]
    if appearance == "light":
        panel = (255, 252, 248)
        text = (28, 24, 22)
        muted = (90, 80, 72)
        background = rgb_to_hex(min(255, br + 40), min(255, bg + 40), min(255, bb + 40))
    else:
        panel = (24, 26, 32)
        text = (236, 240, 245)
        muted = (140, 150, 160)
        background = rgb_to_hex(max(8, br // 3), max(8, bg // 3), max(10, bb // 3))
    accent = rgb_to_hex(ar, ag, ab)
    return {
        "background": background,
        "panel": rgb_to_hex(*panel) if appearance == "light" else "rgba(18,22,30,0.55)",
        "panelAlt": "rgba(255,255,255,0.08)" if appearance == "dark" else rgb_to_hex(
            max(0, panel[0] - 12), max(0, panel[1] - 12), max(0, panel[2] - 12)
        ),
        "accent": accent,
        "accentAlt": rgb_to_hex(min(255, ar + 30), min(255, ag + 20), min(255, ab + 10)),
        "secondary": rgb_to_hex((ar + br) // 2, (ag + bg) // 2, (ab + bb) // 2),
        "highlight": accent,
        "text": rgb_to_hex(*text),
        "muted": rgb_to_hex(*muted),
        "line": f"rgba({ar},{ag},{ab},0.28)",
    }


def extract_wallpaper(src: Path, dest: Path, focus_x: float = 0.72) -> Image.Image:
    """Build a 16:9 wallpaper: character/scene on the right, soft left for Codex UI."""
    im = Image.open(src).convert("RGB")
    w, h = im.size
    # Drop mockup chrome: left sidebar + bottom feature cards + a bit of top bar
    plate = im.crop((int(w * 0.42), int(h * 0.02), int(w * 0.995), int(h * 0.62)))
    pw, ph = plate.size
    tw, th = 2560, 1440
    # Scale plate to fill ~58% width on the right
    target_plate_w = int(tw * 0.62)
    scale = max(target_plate_w / pw, th / ph)
    nw, nh = int(round(pw * scale)), int(round(ph * scale))
    plate = plate.resize((nw, nh), Image.Resampling.LANCZOS)
    # canvas from blurred leftish average of plate
    seed = plate.resize((48, 27), Image.Resampling.BOX).filter(ImageFilter.GaussianBlur(2))
    canvas = seed.resize((tw, th), Image.Resampling.BILINEAR)
    canvas = canvas.filter(ImageFilter.GaussianBlur(28))
    canvas = ImageEnhance.Brightness(canvas).enhance(0.92)
    # paste plate aligned to right, vertically centered with focus
    x = tw - nw + int((1.0 - focus_x) * (nw - target_plate_w) * 0.15)
    x = min(tw - nw, max(int(tw * 0.32), x))
    y = max(0, (th - nh) // 2)
    if nh > th:
        # cover-crop vertically around mid
        top = max(0, (nh - th) // 2 - int((0.5 - 0.45) * nh))
        plate = plate.crop((0, top, nw, top + th))
        nh = th
        y = 0
    canvas.paste(plate, (x, y))
    canvas = ImageEnhance.Contrast(canvas).enhance(1.04)
    dest.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(dest, "JPEG", quality=92, optimize=True)
    return canvas


def write_theme(meta: dict, colors: dict, dest_dir: Path) -> None:
    theme = {
        "schemaVersion": 1,
        "id": meta["presetId"],
        "name": meta["name"],
        "brandSubtitle": " · AGENT SKIN HUB",
        "tagline": meta["tagline"],
        "projectPrefix": "选择项目 · ",
        "projectLabel": meta["projectLabel"],
        "statusText": "AGENT SKIN HUB ONLINE",
        "quote": meta["quote"],
        "image": "background.jpg",
        "appearance": meta["appearance"],
        "art": {
            "focusX": meta["focusX"],
            "focusY": 0.48,
            "safeArea": meta["safeArea"],
            "taskMode": "ambient",
        },
        "colors": colors,
    }
    (dest_dir / "theme.json").write_text(
        json.dumps(theme, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (dest_dir / "SOURCE.md").write_text(
        f"""# {meta['name']}

- Concept ad: `docs/ads/{meta['concept']}`
- Wallpaper: derived from concept (sidebar/cards cropped) for Codex Dream Skin install
- Rights: agent-skin-hub promotional art; for personal Codex theming via ProvDex / apply-hub-skin
""",
        encoding="utf-8",
    )


def main() -> int:
    created = []
    for meta in MISSING:
        src = ADS / meta["concept"]
        if not src.exists():
            print("MISSING_SRC", src)
            continue
        dest_dir = PRESETS / meta["presetId"]
        dest_dir.mkdir(parents=True, exist_ok=True)
        wallpaper = dest_dir / "background.jpg"
        im = extract_wallpaper(src, wallpaper, focus_x=meta["focusX"])
        colors = sample_palette(im, meta["appearance"])
        write_theme(meta, colors, dest_dir)
        size = wallpaper.stat().st_size
        print(f"OK {meta['presetId']}  bg={size}  <- {meta['concept']}")
        created.append(meta["presetId"])
    print(f"created {len(created)} packs")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
