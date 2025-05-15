from typing import Optional

from app.core.translation import translate_to_english, translate_to_greek
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class TranslationRequest(BaseModel):
    text: str


class TranslationResponse(BaseModel):
    translated_text: Optional[str]


@router.post("/to-greek", response_model=TranslationResponse)
async def translate_to_greek_endpoint(request: TranslationRequest):
    """Translate text to Greek."""
    translated_text = await translate_to_greek(request.text)
    if translated_text is None:
        raise HTTPException(status_code=500, detail="Translation failed")
    return TranslationResponse(translated_text=translated_text)


@router.post("/to-english", response_model=TranslationResponse)
async def translate_to_english_endpoint(request: TranslationRequest):
    """Translate text to English."""
    translated_text = await translate_to_english(request.text)
    if translated_text is None:
        raise HTTPException(status_code=500, detail="Translation failed")
    return TranslationResponse(translated_text=translated_text)
