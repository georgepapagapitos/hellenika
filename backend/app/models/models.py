from enum import Enum

from app.db.database import Base
from sqlalchemy import Boolean, Column
from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey, Integer, String
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
    meanings = relationship(
        "Meaning", back_populates="word", cascade="all, delete-orphan"
    )


class Meaning(Base):
    __tablename__ = "meanings"

    id = Column(Integer, primary_key=True, index=True)
    english_meaning = Column(String)
    is_primary = Column(Boolean, default=False)
    word_id = Column(Integer, ForeignKey("words.id"))
    word = relationship("Word", back_populates="meanings")
