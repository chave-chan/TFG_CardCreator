import pandas as pd
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from PIL import Image, ImageDraw, ImageFont
import os

Image.MAX_IMAGE_PIXELS = None # Disable image size limit

CARD_WIDTH = 63 * mm  
CARD_HEIGHT = 88 * mm  
MARGIN = 5 * mm  
ROUND_RADIUS = 8 
CARDS_PER_ROW = 3
CARDS_PER_COL = 3
PAGE_WIDTH, PAGE_HEIGHT = A4
TEXT_FONT = "/System/Library/Fonts/Supplemental/Futura.ttc"
TEXT_COLOR = (0, 0, 0)  
    
# Round card corners 
def round_rectangle(draw, top_left, bottom_right, radius, fill):
    x1, y1 = top_left
    x2, y2 = bottom_right
    draw.rounded_rectangle([x1, y1, x2, y2], radius=radius, fill=fill)

import textwrap

def create_card(card_type, title, text, custom):
    title = str(title) if pd.notnull(title) else ""
    text = str(text) if pd.notnull(text) else ""
    
    if custom.lower() == 'yes':
        image_path = f'images/png/custom.png'
    else:
        image_path = f'images/png/{card_type}.png'

    card_image = Image.open(image_path).resize((int(CARD_WIDTH), int(CARD_HEIGHT)))
    
    # Round the corners of the card
    mask = Image.new('L', (int(CARD_WIDTH), int(CARD_HEIGHT)), 0)
    draw = ImageDraw.Draw(mask)
    round_rectangle(draw, (0, 0), (CARD_WIDTH, CARD_HEIGHT), ROUND_RADIUS, 255)
    card_image.putalpha(mask)
    
    # Write the text on the center of the card
    draw = ImageDraw.Draw(card_image)
    font = ImageFont.truetype(TEXT_FONT, 18)
    
    lines = []
    if title:
        lines.append(title)  # Add the title
        lines.append("\n") # Add an empty line after the title
    
    # Ajust the width of the text to the card
    lines.extend(textwrap.wrap(text, width=16)) # Wrap the text to fit in the card

    total_text_height = 0
    line_heights = []
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        line_height = bbox[3] - bbox[1]
        line_heights.append(line_height)
        total_text_height += line_height    

    line_spacing = 2  # Space between lines
    y_offset = (CARD_HEIGHT - total_text_height - line_spacing * (len(lines) - 1)) / 2  # Center the text vertically

    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font)
        text_width = bbox[2] - bbox[0]
        text_position = ((CARD_WIDTH - text_width) / 2, y_offset)  # Center the text horizontally
        draw.text(text_position, line, font=font, fill=TEXT_COLOR)
        y_offset += line_heights[i] + line_spacing  # Move the position to the next line
    
    return card_image

# Generate PDF
def generate_pdf(cards_df, output_filename):
    c = canvas.Canvas(output_filename, pagesize=A4)  # Create a new PDF with landscape orientation
    card_count = 0
    
    for _, row in cards_df.iterrows():
        for _ in range(row['quantity']):
            x = MARGIN + (card_count % CARDS_PER_ROW) * (CARD_WIDTH + MARGIN)
            y = PAGE_HEIGHT - MARGIN - ((card_count // CARDS_PER_ROW) % CARDS_PER_COL + 1) * (CARD_HEIGHT + MARGIN)
            
            if card_count > 0 and card_count % (CARDS_PER_ROW * CARDS_PER_COL) == 0:
                c.showPage()  # New page if there is no space for the next card
                x = MARGIN
                y = PAGE_HEIGHT - (MARGIN*2) - CARD_HEIGHT
            
            card_image = create_card(row['type'], row['title'], row['text'], row['custom'])
            card_image_path = f'temp_card_{card_count}.png'
            card_image.save(card_image_path)

            c.drawImage(card_image_path, x, y, width=CARD_WIDTH, height=CARD_HEIGHT)
            os.remove(card_image_path)  # Delete the temporary image file
            
            card_count += 1
    
    c.save()

if __name__ == '__main__':
    CSV_PATH = 'data/cards_test.csv'
    PDF_PATH = 'data/cards.pdf'

    df = pd.read_csv(CSV_PATH)
    generate_pdf(df, PDF_PATH)
