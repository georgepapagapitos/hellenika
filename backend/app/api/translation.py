import logging
from typing import Optional

from app.core.translation import translate_to_english, translate_to_greek
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()
logger = logging.getLogger(__name__)


class TranslationRequest(BaseModel):
    text: str


class TranslationResponse(BaseModel):
    translated_text: Optional[str]


@router.post("/to-greek", response_model=TranslationResponse)
async def translate_to_greek_endpoint(request: TranslationRequest):
    """Translate text to Greek."""
    try:
        logger.info(f"Translating to Greek: {request.text}")
        translated_text = await translate_to_greek(request.text)
        if translated_text is None:
            logger.error("Translation to Greek failed - no result returned")
            raise HTTPException(
                status_code=500, detail="Translation failed - no result returned"
            )
        logger.info(f"Translation to Greek successful: {translated_text}")
        return TranslationResponse(translated_text=translated_text)
    except Exception as e:
        logger.error(f"Error translating to Greek: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")


@router.post("/to-english", response_model=TranslationResponse)
async def translate_to_english_endpoint(request: TranslationRequest):
    """Translate text to English."""
    try:
        logger.info(f"Translating to English: {request.text}")
        translated_text = await translate_to_english(request.text)
        if translated_text is None:
            logger.error("Translation to English failed - no result returned")
            raise HTTPException(
                status_code=500, detail="Translation failed - no result returned"
            )
        logger.info(f"Translation to English successful: {translated_text}")
        return TranslationResponse(translated_text=translated_text)
    except Exception as e:
        logger.error(f"Error translating to English: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")
