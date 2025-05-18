import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from fastapi import APIRouter, HTTPException, UploadFile, File, Body, Query
from fastapi.responses import JSONResponse, StreamingResponse
from io import BytesIO
import pandas as pd
from app.services.card_service import generate_pdf 

router = APIRouter()

### TESTING
test_cards: list[dict] = []

@router.post("/test-card")
async def post_test_card(card: dict = Body(...)):
    test_cards.append(card)
    return {"stored": card}

@router.get("/test-cards")
async def get_test_cards():
    return test_cards

###

@router.post("/generate_pdf")
async def generate_pdf_endpoint(
    csv_file_path: str,
    text_align: str = Query("center"),
    text_justify: str = Query("center"),
    text_color: str = Query("#000000")
):
    try:
        df = pd.read_csv(csv_file_path)
        df['title'] = df['title'].fillna("")

        text_color_rgb = tuple(int(text_color[i:i+2], 16) for i in (1, 3, 5))

        pdf_buffer = generate_pdf(df, text_align, text_justify, text_color_rgb)

        # Return the PDF file as a response
        return StreamingResponse(pdf_buffer, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=cards.pdf"})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))