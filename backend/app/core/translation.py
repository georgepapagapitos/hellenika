import os
import logging
from typing import Optional

import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)
GOOGLE_TRANSLATE_API_URL = "https://translation.googleapis.com/language/translate/v2"


async def translate_text(text: str, target_language: str) -> Optional[str]:
    """
    Translate text to the target language using Google Translate API.

    Args:
        text: The text to translate
        target_language: The target language code (e.g., 'en' for English, 'el' for Greek)

    Returns:
        The translated text or None if translation fails
    """
    try:
        api_key = settings.GOOGLE_TRANSLATE_API_KEY
        if not api_key:
            logger.error("Google Translate API key is missing")
            raise ValueError("Google Translate API key is not configured")

        logger.info(f"Translating text to {target_language}: {text}")
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{GOOGLE_TRANSLATE_API_URL}?key={api_key}",
                json={"q": text, "target": target_language, "format": "text"},
            )
            response.raise_for_status()
            data = response.json()

            if data.get("data", {}).get("translations"):
                translated_text = data["data"]["translations"][0]["translatedText"]
                logger.info(f"Translation successful: {translated_text}")
                return translated_text
            
            logger.error("No translation found in response")
            return None
    except httpx.HTTPError as e:
        logger.error(f"HTTP error during translation: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        raise


async def translate_to_greek(text: str) -> Optional[str]:
    """Translate text to Greek."""
    return await translate_text(text, "el")


async def translate_to_english(text: str) -> Optional[str]:
    """Translate text to English."""
    return await translate_text(text, "en")
