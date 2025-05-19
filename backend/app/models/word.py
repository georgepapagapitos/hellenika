from datetime import datetime
from enum import Enum

from app.db.database import Base
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class WordType(str, Enum):
    NOUN = "noun"
    VERB = "verb"
    ADJECTIVE = "adjective"
    ADVERB = "adverb"
    PRONOUN = "pronoun"
    PREPOSITION = "preposition"
    CONJUNCTION = "conjunction"
    ARTICLE = "article"


class Gender(str, Enum):
    MASCULINE = "masculine"
    FEMININE = "feminine"
    NEUTER = "neuter"


class ApprovalStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class Word(Base):
    __tablename__ = "words"

    id = Column(Integer, primary_key=True, index=True)
    greek_word = Column(String, index=True)
    word_type = Column(String)
    gender = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    approval_status = Column(String, default=ApprovalStatus.PENDING)
    meanings = relationship(
        "Meaning", back_populates="word", cascade="all, delete-orphan"
    )
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    submitter = relationship("User", backref="submitted_words")
