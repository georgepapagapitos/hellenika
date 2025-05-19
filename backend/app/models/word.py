from datetime import datetime
from enum import Enum

from app.db.database import Base
from sqlalchemy import Column, DateTime, Integer, String
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


class Word(Base):
    __tablename__ = "words"

    id = Column(Integer, primary_key=True, index=True)
    greek_word = Column(String, index=True)
    word_type = Column(String)
    gender = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    meanings = relationship(
        "Meaning", back_populates="word", cascade="all, delete-orphan"
    )
