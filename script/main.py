import os
os.environ["DYLD_FALLBACK_LIBRARY_PATH"] = "/opt/homebrew/lib:/usr/local/lib:/usr/lib"
import pandas as pd
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from PIL import Image, ImageDraw, ImageFont
from concurrent.futures import ProcessPoolExecutor
from functools import lru_cache
import textwrap
import cairosvg
import argparse
import io

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

# Generate the PDF
def generate_pdf(cards_df, output_filename, text_align, text_justify, text_color):
    c = canvas.Canvas(output_filename, pagesize=A4)
    card_count = 0

    # Generate the cards in parallel
    unique_cards = cards_df.drop_duplicates(subset=["type", "title", "text"])
    with ProcessPoolExecutor() as executor:
        unique_card_buffers = {
            (row["type"], row["title"], row["text"]): executor.submit(create_card_image_buffer, row["type"], row["title"], row["text"], text_align, text_justify, text_color)
            for _, row in unique_cards.iterrows()
        }

    for _, row in cards_df.iterrows():
        # Repeat the card as many times as the quantity
        for _ in range(row['quantity']):
            x = PAGE_MARGIN + (card_count % CARDS_PER_ROW) * (CARD_WIDTH + CARD_MARGIN)
            y = PAGE_HEIGHT - PAGE_MARGIN - ((card_count // CARDS_PER_ROW) % CARDS_PER_COL + 1) * (CARD_HEIGHT + CARD_MARGIN)

            if card_count > 0 and card_count % (CARDS_PER_ROW * CARDS_PER_COL) == 0:
                c.showPage()
                x = PAGE_MARGIN
                y = PAGE_HEIGHT - (PAGE_MARGIN * 2) - CARD_HEIGHT

            # Recover the card buffer and draw it
            card_key = (row["type"], row["title"], row["text"])
            card_buffer = unique_card_buffers[card_key].result()
            card_image_reader = ImageReader(card_buffer)
            c.drawImage(card_image_reader, x, y, width=CARD_WIDTH, height=CARD_HEIGHT)
            
            card_count += 1

    c.save()

# Main function
def main():
    parser = argparse.ArgumentParser(description="Generate a PDF with your board game cards.")
    parser.add_argument("--csv_path", default="data/cards_test.csv", help="Route to the CSV file with the cards data.")
    parser.add_argument("--output_pdf", default="data/cards.pdf", help="Route to the output PDF file.")
    parser.add_argument("--text_align", default="center", help="Text alignment (top, center, bottom).")
    parser.add_argument("--text_justify", default="center", help="Text justification (left, center, right).")
    parser.add_argument("--text_color", default="#000000", help="Text color in hex format (ex: #FF7430).")
    
    args = parser.parse_args()
    text_color = hex_to_rgb(args.text_color)
    
    df = pd.read_csv(args.csv_path) # Data Frame
    df['title'] = df['title'].fillna("") # Fill NaN values with empty string
    generate_pdf(df, args.output_pdf, args.text_align, args.text_justify, text_color)

if __name__ == '__main__':
    main()