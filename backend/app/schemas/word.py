from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict

from app.models.word import ApprovalStatus, Gender, WordType
from app.schemas.user import UserOut


class MeaningBase(BaseModel):
    english_meaning: str
    is_primary: bool = False


class MeaningCreate(MeaningBase):
    pass


class Meaning(MeaningBase):
    id: int
    word_id: int
    model_config = ConfigDict(from_attributes=True)


class WordBase(BaseModel):
    greek_word: str
    word_type: WordType
    gender: Optional[Gender] = None
    notes: str | None = None
    approval_status: Optional[ApprovalStatus] = None


class WordCreate(WordBase):
    meanings: List[MeaningCreate]


class Word(WordBase):
    id: int
    created_at: Optional[datetime]
    created_by: Optional[int]
    submitter: Optional[UserOut]
    meanings: List[Meaning]
    approval_status: ApprovalStatus
    model_config = ConfigDict(from_attributes=True)

    def model_dump(self, **kwargs):
        data = super().model_dump(**kwargs)
        if data.get("created_at"):
            data["created_at"] = data["created_at"].isoformat()
        return data
