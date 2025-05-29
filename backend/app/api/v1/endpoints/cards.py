import sys, os, base64
import traceback
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from fastapi import APIRouter, HTTPException, UploadFile, File, Body, Query, Form
from fastapi.responses import JSONResponse, StreamingResponse
from io import BytesIO
import pandas as pd
from app.services.card_service import generate_pdf, generate_single_card, generate_preview_from_svg

router = APIRouter()

@router.post("/preview")
async def preview_card(
    type:        str         = Form(...),
    title:       str         = Form(""),
    text:        str         = Form(""),
    text_align:  str         = Form("center"),
    text_justify:str         = Form("center"),
    text_color:  str         = Form("#000000"),
    svg_file:    UploadFile  = File(...)
    ):
    try:
        svg_bytes = await svg_file.read()
        png_b64 = generate_preview_from_svg(
            svg_bytes,
            title,
            text,
            text_align,
            text_justify,
            text_color
        )

        return JSONResponse({
            "image": f"data:image/png;base64,{png_b64}",
            "title": title,
            "text":  text,
            "type":  type,
        })
    except Exception as e:
        raise HTTPException(500, f"Error generating preview: {e}")

@router.post("/generate-pdf")
async def generate_pdf_endpoint(
    csv: UploadFile = File(...),
    background: UploadFile = File(...),
    text_align: str = Query("center"),
    text_justify: str = Query("center"),
    text_color: str = Query("#000000")
):
    try:
        df = pd.read_csv(csv.file)
        df['title'] = df['title'].fillna("")
        df['text']  = df['text'].fillna("")
        df['quantity'] = pd.to_numeric(df['quantity'], errors="coerce")
        df['quantity'] = df['quantity'].fillna(1)
        df['quantity'] = df['quantity'].astype(int)

        
        text_color_rgb = tuple(int(text_color[i:i+2], 16) for i in (1, 3, 5))
        svg_bytes = await background.read() if background else b""
        pdf_buffer = generate_pdf(df, svg_bytes, text_align, text_justify, text_color_rgb)

        return StreamingResponse(pdf_buffer, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=cards.pdf"})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))