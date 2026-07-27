"""Generates the Open Graph share cover (assets/images/og-cover.png).

This is the image WhatsApp / Telegram / Facebook / LinkedIn show when someone
shares the site link. 1200x630 is the standard OG size — every platform crops
from the centre, so the content is kept centred with generous margins.

Re-run after changing the wording:  python make_og_cover.py
"""

from pathlib import Path

import arabic_reshaper
from bidi.algorithm import get_display
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).parent
ASSETS = HERE / "assets" / "images"
OUT = ASSETS / "og-cover.png"

W, H = 1200, 630

# Brand palette — mirrors style.css so the card matches the site.
BG = (5, 10, 21)
PRIMARY = (79, 115, 246)
ACCENT = (38, 192, 208)
TEXT = (242, 245, 255)
MUTED = (150, 165, 200)

FONT_BOLD = "C:/Windows/Fonts/arialbd.ttf"
FONT_REG = "C:/Windows/Fonts/arial.ttf"

TITLE_EN = "UP-Smart"
TAGLINE_AR = "رفيقك الأكاديمي في جامعة فلسطين"
SUB_AR = "جدولك · واجباتك · امتحاناتك · تنبيه قبل كل موعد"
DOMAIN = "up-smart-app.web.app"


def ar(text: str) -> str:
    """Shapes + reorders Arabic so PIL draws connected, right-to-left text."""
    return get_display(arabic_reshaper.reshape(text))


def glow(img: Image.Image, xy, radius, color, alpha):
    """Soft aurora blob, like the site's background glows."""
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x, y = xy
    d.ellipse([x - radius, y - radius, x + radius, y + radius],
              fill=(*color, alpha))
    layer = layer.filter(ImageFilter.GaussianBlur(radius // 2))
    img.alpha_composite(layer)


def rounded(img: Image.Image, radius: int) -> Image.Image:
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, *img.size], radius, fill=255)
    out = img.copy()
    out.putalpha(mask)
    return out


def centred(draw, y, text, font, fill):
    w = draw.textbbox((0, 0), text, font=font)[2]
    draw.text(((W - w) / 2, y), text, font=font, fill=fill)


def main() -> None:
    img = Image.new("RGBA", (W, H), (*BG, 255))
    glow(img, (250, 120), 300, PRIMARY, 90)
    glow(img, (980, 540), 300, ACCENT, 70)

    # App icon, centred near the top.
    icon_path = ASSETS / "app_icon.png"
    if icon_path.exists():
        icon = Image.open(icon_path).convert("RGBA").resize((132, 132),
                                                            Image.LANCZOS)
        img.alpha_composite(rounded(icon, 30), ((W - 132) // 2, 78))

    d = ImageDraw.Draw(img)
    centred(d, 232, TITLE_EN, ImageFont.truetype(FONT_BOLD, 76), TEXT)

    # Accent rule between the wordmark and the Arabic lines.
    d.rounded_rectangle([(W - 90) / 2, 332, (W + 90) / 2, 337], 3, fill=ACCENT)

    centred(d, 368, ar(TAGLINE_AR), ImageFont.truetype(FONT_BOLD, 46), TEXT)
    centred(d, 442, ar(SUB_AR), ImageFont.truetype(FONT_REG, 28), MUTED)
    centred(d, 540, DOMAIN, ImageFont.truetype(FONT_REG, 24), PRIMARY)

    img.convert("RGB").save(OUT, "PNG", optimize=True)
    print(f"OK  {OUT}  ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
