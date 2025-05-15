from typing import List, Optional

from app.models.models import Gender, WordType
from pydantic import BaseModel


class MeaningBase(BaseModel):
    english_meaning: str
    is_primary: bool = False


class MeaningCreate(MeaningBase):
    pass


class Meaning(MeaningBase):
    id: int
    word_id: int

    class Config:
        from_attributes = True


class WordBase(BaseModel):
    greek_word: str
    word_type: WordType
    gender: Optional[Gender] = None
    notes: str | None = None


class WordCreate(WordBase):
    meanings: List[MeaningCreate]


class Word(WordBase):
    id: int
    meanings: List[Meaning]

    class Config:
        from_attributes = True
