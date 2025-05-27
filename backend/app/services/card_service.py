import io
import os
os.environ["DYLD_FALLBACK_LIBRARY_PATH"] = "/opt/homebrew/lib:/usr/local/lib:/usr/lib"
import pandas as pd
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from PIL import Image, ImageDraw, ImageFont
from concurrent.futures import ThreadPoolExecutor
from functools import lru_cache
import textwrap
import cairosvg
import base64

# CARD SETTINGS
CARD_WIDTH = 63 * mm # Standard card size
CARD_HEIGHT = 88 * mm # Standard card size
CARD_MARGIN = 1 * mm
ROUND_RADIUS = 8 
# PAGE SETTINGS
CARDS_PER_ROW = 3
CARDS_PER_COL = 3
PAGE_MARGIN = 10 * mm
PAGE_WIDTH, PAGE_HEIGHT = A4
# TEXT SETTINGS
TEXT_MARGIN = 50 * mm
TEXT_FONT = "/System/Library/Fonts/Supplemental/Futura.ttc"
TEXT_SIZE = 320

### IMAGE GENERATION ###
#Generate a preview image from SVG data
def generate_preview_from_svg(
    svg_bytes: bytes,
    title: str,
    text: str,
    text_align: str,
    text_justify: str,
    text_color: str
) -> str:
    png_bytes = cairosvg.svg2png(bytestring=svg_bytes, dpi=96)
    
    img = create_card(
        card_image=png_bytes,
        title=title,
        text=text,
        text_align=text_align,
        text_justify=text_justify,
        text_color=text_color,
    )
    
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()

# Convert SVG to PNG in memory
@lru_cache(maxsize=32)
def convert_svg_to_png(image_path):
    return cairosvg.svg2png(url=image_path, dpi=96)

# Load the font
@lru_cache(maxsize=32)
def load_font():
    return ImageFont.truetype(TEXT_FONT, TEXT_SIZE)

# Convert hex color to RGB
def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

# Round the corners of the card
def round_rectangle(draw, top_left, bottom_right, radius, fill):
    x1, y1 = top_left
    x2, y2 = bottom_right
    draw.rounded_rectangle([x1, y1, x2, y2], radius=radius, fill=fill)

# Create the card image buffer
@lru_cache(maxsize=32)
def create_card_image_buffer(card_type, title, text, text_align, text_justify, text_color):
    image_path = f'images/svg/{card_type}.svg'
    png_data = convert_svg_to_png(image_path)
    return create_card(png_data, title, text, text_align, text_justify, text_color)

# Generate a single card image in memory
def generate_single_card(card_data: dict) -> io.BytesIO:
    img = create_card_image_buffer(
        card_type=card_data.get("type", ""),
        title=card_data.get("title", ""),
        text=card_data.get("text", ""),
        text_align=card_data.get("text_align", "center"),
        text_justify=card_data.get("text_justify", "center"),
        text_color=card_data.get("text_color", "#000000"),
    )
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf

# Create the card in memory using SVG converted to PNG
def create_card(card_image, title, text, text_align, text_justify, text_color):
    title = str(title) if pd.notnull(title) else ""
    text = str(text) if pd.notnull(text) else ""

    card_image = Image.open(io.BytesIO(card_image)).convert('RGBA')
    mask = Image.new('L', card_image.size, 0)
    draw = ImageDraw.Draw(mask)
    round_rectangle(draw, (0, 0), card_image.size, ROUND_RADIUS, 255)
    card_image.putalpha(mask)

    # Select the text alignment
    font = load_font()
    align_function = {
        'top': top_text,
        'center': center_text,
        'bottom': bottom_text
    }.get(text_align, center_text)
    align_function(card_image, title, text, text_justify, text_color, font)

    return card_image

### TEXT RELATED FUNCTIONS ###
# Get the text lines
def get_text_lines(draw, font, title, text, width=16):
    lines = []
    if title:
        lines.append(title)  # Add title
        lines.append("\n")  # Add empty line after title
    lines.extend(textwrap.wrap(text, width=width))  # Wrap text

    total_text_height, line_heights, max_line_width = 0, [], 0
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        line_height = bbox[3] - bbox[0]
        line_width = bbox[2] - bbox[0]
        line_heights.append(line_height)
        total_text_height += line_height
        max_line_width = max(max_line_width, line_width)
    return lines, line_heights, total_text_height, max_line_width

# Write the text on the top of the card
def top_text(card_image, title, text, text_justify, text_color, font):
    draw = ImageDraw.Draw(card_image)
    lines, line_heights, total_text_height, _ = get_text_lines(draw, font, title, text)

    line_spacing = 15
    y_offset = TEXT_MARGIN  # Start from the top margin
    apply_justification(lines, draw, font, text_color, line_heights, line_spacing, y_offset, text_justify)

# Write the text on the center of the card
def center_text(card_image, title, text, text_justify, text_color, font):
    draw = ImageDraw.Draw(card_image)
    lines, line_heights, total_text_height, _ = get_text_lines(draw, font, title, text)

    line_spacing = 15
    y_offset = (CARD_HEIGHT*16 - total_text_height - line_spacing * (len(lines) - 1)) / 2  # Vertical center
    apply_justification(lines, draw, font, text_color, line_heights, line_spacing, y_offset, text_justify)

# Write the text at the bottom of the card
def bottom_text(card_image, title, text, text_justify, text_color, font):
    draw = ImageDraw.Draw(card_image)
    lines, line_heights, total_text_height, _ = get_text_lines(draw, font, title, text)

    line_spacing = 15
    y_offset = CARD_HEIGHT*16 - total_text_height - line_spacing * (len(lines) - 1) + TEXT_MARGIN # Start from the bottom margin
    apply_justification(lines, draw, font, text_color, line_heights, line_spacing, y_offset, text_justify)

# Apply text justification
def apply_justification(lines, draw, font, color, line_heights, line_spacing, y_offset, text_justify):
    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font)
        text_width = bbox[2] - bbox[0]

        # Horizontal text alignment
        if text_justify == 'left':
            x_position = TEXT_MARGIN*2
        elif text_justify == 'center':
            x_position = (CARD_WIDTH*16 + TEXT_MARGIN*2 - text_width) / 2
        elif text_justify == 'right':
            x_position = CARD_WIDTH*16 - text_width + TEXT_MARGIN

        draw.text((x_position, y_offset), line, font=font, fill=color)
        y_offset += line_heights[i] + line_spacing  # Next line

### PDF GENERATION ###
# Create a card from SVG bytes
def create_card_from_bytes(svg_bytes: bytes, title: str, text: str,text_align: str, text_justify: str, text_color: tuple[int,int,int]):
    # Convert SVG to PNG
    png = cairosvg.svg2png(bytestring=svg_bytes, dpi=96)
    return create_card(png, title, text, text_align, text_justify, text_color)

# Generate the PDF
def generate_pdf(cards_df: pd.DataFrame,
                 svg_bytes: bytes,
                 text_align="center",
                 text_justify="center",
                 text_color=(0,0,0)) -> io.BytesIO:
    pdf_buf = io.BytesIO()
    c = canvas.Canvas(pdf_buf, pagesize=A4)

    # For each card, will create a unique image
    unique = cards_df.drop_duplicates(subset=["title","text"])
    with ThreadPoolExecutor() as executor:
        futures = {
            idx: executor.submit(
                create_card_from_bytes,
                svg_bytes,
                row["title"], row["text"],
                text_align, text_justify, text_color
            )
            for idx, row in unique.iterrows()
        }

    card_count = 0
    for idx, row in cards_df.iterrows():
        for _ in range(int(row["quantity"])):
            # Position
            x = PAGE_MARGIN + (card_count % CARDS_PER_ROW) * (CARD_WIDTH + CARD_MARGIN)
            y = PAGE_HEIGHT - PAGE_MARGIN - ((card_count//CARDS_PER_ROW)%CARDS_PER_COL + 1)*(CARD_HEIGHT+CARD_MARGIN)
            if card_count>0 and card_count%(CARDS_PER_ROW*CARDS_PER_COL)==0:
                c.showPage()
                x = PAGE_MARGIN
                y = PAGE_HEIGHT - PAGE_MARGIN - CARD_HEIGHT

            img = futures[idx].result()
            c.drawImage(ImageReader(img), x, y, width=CARD_WIDTH, height=CARD_HEIGHT)
            card_count += 1

    c.save()
    pdf_buf.seek(0)
    return pdf_buf