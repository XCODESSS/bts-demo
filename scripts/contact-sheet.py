"""Create labelled review sheets for every selected photograph."""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
CELL_WIDTH, CELL_HEIGHT = 220, 245
FONT = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 12)


def create_sheets() -> None:
    products = json.loads((ROOT / 'src/data/products.json').read_text(encoding='utf-8'))
    output = ROOT / 'artifacts/content'
    output.mkdir(parents=True, exist_ok=True)
    for start in range(0, len(products), 20):
        sheet = Image.new('RGB', (CELL_WIDTH * 4, CELL_HEIGHT * 5), 'white')
        draw = ImageDraw.Draw(sheet)
        for index, product in enumerate(products[start:start + 20]):
            x = (index % 4) * CELL_WIDTH
            y = (index // 4) * CELL_HEIGHT
            with Image.open(ROOT / 'public' / product['image']['src'].lstrip('/')) as original:
                photo = original.convert('RGB')
            photo.thumbnail((175, 180), Image.Resampling.LANCZOS)
            sheet.paste(photo, (x + (CELL_WIDTH - photo.width) // 2, y + 8 + (180 - photo.height) // 2))
            draw.text((x + 8, y + 195), f"{product['id']} {product['brand']}"[:31], font=FONT, fill='#263c32')
            draw.text((x + 8, y + 213), product['name'][:33], font=FONT, fill='#263c32')
        path = output / f'sheet-{start // 20 + 1}.jpg'
        sheet.save(path, quality=92)
        print(path)


if __name__ == '__main__':
    create_sheets()
