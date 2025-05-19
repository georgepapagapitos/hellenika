from datetime import datetime
from typing import List, Optional

from app.models.word import ApprovalStatus, Gender, WordType
from app.schemas.user import UserOut
from app.utils.greek_utils import add_article
from pydantic import BaseModel, ConfigDict, computed_field


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

    @computed_field
    @property
    def greek_word_with_article(self) -> str:
        """Returns the Greek word with its appropriate article if it's a noun."""
        if self.word_type == WordType.NOUN and self.gender:
            # For now, we'll use nominative case and definite article by default
            # We can add parameters to control this in the future if needed
            return add_article(
                self.greek_word,
                self.gender,
                is_plural=False,  # We might want to add a field for this in the future
                case="nominative",
                is_definite=True,
            )
        return self.greek_word

    def model_dump(self, **kwargs):
        data = super().model_dump(**kwargs)
        if data.get("created_at"):
            data["created_at"] = data["created_at"].isoformat()
        return data
