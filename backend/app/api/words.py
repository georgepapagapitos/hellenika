from typing import Dict, List

from app.db.database import get_db
from app.models.models import Meaning as DBMeaning
from app.models.models import Word as DBWord
from app.schemas.schemas import Meaning, MeaningCreate, Word, WordCreate
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/", response_model=Word)
def create_word(word: WordCreate, db: Session = Depends(get_db)):
    # Convert enum values to lowercase for database compatibility
    word_type_value = (
        word.word_type.value
        if hasattr(word.word_type, "value")
        else str(word.word_type).lower()
    )
    gender_value = (
        word.gender.value
        if word.gender and hasattr(word.gender, "value")
        else str(word.gender).lower() if word.gender else None
    )

    # Create the word
    db_word = DBWord(
        greek_word=word.greek_word,
        word_type=word_type_value,
        gender=gender_value,
        notes=word.notes,
    )
    db.add(db_word)
    db.flush()  # Get the word ID without committing

    # Create meanings
    for meaning in word.meanings:
        db_meaning = DBMeaning(
            english_meaning=meaning.english_meaning,
            is_primary=meaning.is_primary,
            word_id=db_word.id,
        )
        db.add(db_meaning)

    db.commit()
    db.refresh(db_word)
    return db_word


@router.get("/", response_model=List[Word])
def read_words(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    words = db.query(DBWord).order_by(DBWord.greek_word).offset(skip).limit(limit).all()
    return words


@router.get("/{word_id}", response_model=Word)
def read_word(word_id: int, db: Session = Depends(get_db)):
    db_word = db.query(DBWord).filter(DBWord.id == word_id).first()
    if db_word is None:
        raise HTTPException(status_code=404, detail="Word not found")
    return db_word


@router.post("/{word_id}/meanings/", response_model=Meaning)
def add_meaning(word_id: int, meaning: MeaningCreate, db: Session = Depends(get_db)):
    db_word = db.query(DBWord).filter(DBWord.id == word_id).first()
    if db_word is None:
        raise HTTPException(status_code=404, detail="Word not found")

    db_meaning = DBMeaning(
        english_meaning=meaning.english_meaning,
        is_primary=meaning.is_primary,
        word_id=word_id,
    )
    db.add(db_meaning)
    db.commit()
    db.refresh(db_meaning)
    return db_meaning


@router.put("/{word_id}", response_model=Word)
def update_word(word_id: int, word: WordCreate, db: Session = Depends(get_db)):
    db_word = db.query(DBWord).filter(DBWord.id == word_id).first()
    if db_word is None:
        raise HTTPException(status_code=404, detail="Word not found")

    # Convert enum values to lowercase for database compatibility
    word_type_value = (
        word.word_type.value
        if hasattr(word.word_type, "value")
        else str(word.word_type).lower()
    )
    gender_value = (
        word.gender.value
        if word.gender and hasattr(word.gender, "value")
        else str(word.gender).lower() if word.gender else None
    )

    # Update word properties
    db_word.greek_word = word.greek_word
    db_word.word_type = word_type_value
    db_word.gender = gender_value
    db_word.notes = word.notes

    # Delete existing meanings
    db.query(DBMeaning).filter(DBMeaning.word_id == word_id).delete()

    # Create new meanings
    for meaning in word.meanings:
        db_meaning = DBMeaning(
            english_meaning=meaning.english_meaning,
            is_primary=meaning.is_primary,
            word_id=word_id,
        )
        db.add(db_meaning)

    db.commit()
    db.refresh(db_word)
    return db_word


@router.delete("/{word_id}", response_model=Dict[str, bool])
def delete_word(word_id: int, db: Session = Depends(get_db)):
    # First, check if the word exists
    db_word = db.query(DBWord).filter(DBWord.id == word_id).first()
    if db_word is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Word not found"
        )
    
    # Delete all meanings associated with the word
    db.query(DBMeaning).filter(DBMeaning.word_id == word_id).delete()
    
    # Delete the word
    db.delete(db_word)
    db.commit()
    
    return {"success": True}
