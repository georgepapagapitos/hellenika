from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from app.db.database import Base


class Meaning(Base):
    __tablename__ = "meanings"

    id = Column(Integer, primary_key=True, index=True)
    english_meaning = Column(String)
    is_primary = Column(Boolean, default=False)
    word_id = Column(Integer, ForeignKey("words.id"))
    word = relationship("Word", back_populates="meanings") 