#!/usr/bin/env python3
"""Cover-crop to 2560x1440 without stretching. Bias crop with focusX/focusY."""
import sys
from pathlib import Path
from PIL import Image

def main():
  if len(sys.argv) < 3:
    print("Usage: export-wallpaper-16x9.py <src> <dest> [focusX=0.74] [focusY=0.42]")
    return 2
  src, dest = Path(sys.argv[1]), Path(sys.argv[2])
  fx = float(sys.argv[3]) if len(sys.argv) > 3 else 0.74
  fy = float(sys.argv[4]) if len(sys.argv) > 4 else 0.42
  tw, th = 2560, 1440
  im = Image.open(src).convert("RGB")
  w, h = im.size
  scale = max(tw / w, th / h)
  nw, nh = int(round(w * scale)), int(round(h * scale))
  im = im.resize((nw, nh), Image.Resampling.LANCZOS)
  cx, cy = fx * nw, fy * nh
  left = max(0, min(int(round(cx - tw / 2)), nw - tw))
  top = max(0, min(int(round(cy - th / 2)), nh - th))
  out = im.crop((left, top, left + tw, top + th))
  dest.parent.mkdir(parents=True, exist_ok=True)
  out.save(dest, "JPEG", quality=95, optimize=True)
  print(f"{w}x{h} ratio={w/h:.3f} -> {tw}x{th} no-stretch focus=({fx},{fy})")
  return 0

if __name__ == "__main__":
  raise SystemExit(main())
