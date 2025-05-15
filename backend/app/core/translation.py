import os
from typing import Optional

import httpx
from app.core.config import settings

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
            print("Google Translate API key is missing")
            return None

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{GOOGLE_TRANSLATE_API_URL}?key={api_key}",
                json={"q": text, "target": target_language, "format": "text"},
            )
            response.raise_for_status()
            data = response.json()

            if data.get("data", {}).get("translations"):
                return data["data"]["translations"][0]["translatedText"]
            return None
    except Exception as e:
        print(f"Translation error: {str(e)}")
        return None


async def translate_to_greek(text: str) -> Optional[str]:
    """Translate text to Greek."""
    return await translate_text(text, "el")


async def translate_to_english(text: str) -> Optional[str]:
    """Translate text to English."""
    return await translate_text(text, "en")
