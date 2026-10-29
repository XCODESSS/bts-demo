"""Prepare only selected, permitted reference photographs; never alter source assets."""
from __future__ import annotations

import json
import os
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

PROJECT = Path(__file__).resolve().parents[1]
SOURCE = Path(os.environ.get("PERFUME_SOURCE_DIR", "D:/perfume-search"))
LOGO = Path("C:/Users/SHREYARTH/OneDrive/ドキュメント/WhatsApp Image 2026-10-26 at 4.10.44 PM.jpeg")


def trim_photo(photo: Image.Image) -> Image.Image:
    """Remove generous near-white outer margins without changing bottle geometry."""
    rgb = photo.convert("RGB")
    difference = ImageChops.difference(rgb, Image.new("RGB", rgb.size, rgb.getpixel((0, 0))))
    foreground = difference.convert("L").point(lambda level: 255 if level > 25 else 0)
    bounds = foreground.getbbox()
    if not bounds:
        return rgb
    left, top, right, bottom = bounds
    margin = max(12, round(max(right - left, bottom - top) * 0.05))
    return rgb.crop((max(0, left - margin), max(0, top - margin), min(rgb.width, right + margin), min(rgb.height, bottom + margin)))


def transparent_backdrop(photo: Image.Image) -> Image.Image:
    """Remove only the connected near-white backdrop; preserve enclosed label whites."""
    rgba = photo.convert("RGBA")
    red, green, blue = photo.convert("RGB").split()
    minimum = ImageChops.darker(ImageChops.darker(red, green), blue)
    maximum = ImageChops.lighter(ImageChops.lighter(red, green), blue)
    bright = minimum.point(lambda level: 255 if level > 234 else 0)
    neutral = ImageChops.subtract(maximum, minimum).point(lambda level: 255 if level < 16 else 0)
    eligible = ImageChops.multiply(bright, neutral).convert("RGB")
    if eligible.getpixel((0, 0)) != (255, 255, 255):
        return rgba
    ImageDraw.floodfill(eligible, (0, 0), (255, 0, 0), thresh=0)
    marked_red, marked_green, _ = eligible.split()
    alpha = ImageChops.invert(ImageChops.subtract(marked_red, marked_green))
    rgba.putalpha(alpha)
    return rgba


def prepare_photographs() -> None:
    records = json.loads((PROJECT / "content/provenance.json").read_text(encoding="utf-8"))["products"]
    output = PROJECT / "public/perfumes"
    output.mkdir(parents=True, exist_ok=True)
    for record in records:
        source = (SOURCE / "site" / record["sourceImage"]).resolve()
        if not source.is_relative_to((SOURCE / "site/assets/perfumes").resolve()):
            raise ValueError(f"Unsafe source image: {source}")
        with Image.open(source) as original:
            photo = trim_photo(original)
            photo.thumbnail((1000, 1000), Image.Resampling.LANCZOS)
            transparent_backdrop(photo).save(output / f"{record['id']}.webp", quality=88, method=6)


def prepare_logo() -> None:
    with Image.open(LOGO) as screenshot:
        logo = screenshot.convert("RGBA").crop((127, 462, 611, 946))
    mask = Image.new("L", logo.size, 0)
    ImageDraw.Draw(mask).ellipse((0, 0, logo.width - 1, logo.height - 1), fill=255)
    logo.putalpha(mask)
    output = PROJECT / "public/brand"
    output.mkdir(parents=True, exist_ok=True)
    logo.save(output / "logo.png")
    logo.resize((64, 64), Image.Resampling.LANCZOS).save(output / "icon.png")


def prepare_hero() -> None:
    """Only make the connected near-white backdrop transparent, retaining label whites."""
    source = PROJECT / "public/perfumes/P0574.webp"
    if not source.exists():
        return
    with Image.open(source) as photo:
        bottle = photo.convert("RGBA")
    output = PROJECT / "public/hero"
    output.mkdir(parents=True, exist_ok=True)
    bottle.save(output / "torino21.png")


if __name__ == "__main__":
    prepare_photographs()
    prepare_logo()
    prepare_hero()
    print("Selected photos, logo and hero prepared. Source files unchanged.")
