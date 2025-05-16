from enum import Enum
from sqlalchemy import String
from sqlalchemy.orm import relationship
from app.db.database import Base
from sqlalchemy import Column, Integer


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