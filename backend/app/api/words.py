from datetime import datetime
from typing import Dict, List, Optional

from app.api.auth_deps import get_current_admin_user, get_current_user
from app.db.database import get_db
from app.models.meaning import Meaning as DBMeaning
from app.models.user import User
from app.models.word import ApprovalStatus
from app.models.word import Word as DBWord
from app.schemas.word import Word, WordCreate
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload


class PaginatedResponse(BaseModel):
    items: List[Word]
    total: int
    page: int
    size: int
    pages: int


router = APIRouter()


@router.post("/", response_model=Word)
def create_word(
    word: WordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Convert enum values to lowercase for database compatibility
    word_type_value = (
        word.word_type.value
        if hasattr(word.word_type, "value")
        else str(word.word_type).lower()
    )

    # Use detected gender if available, otherwise use provided gender
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
        approval_status=ApprovalStatus.PENDING,
        created_by=current_user.id,
        created_at=datetime.utcnow(),
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


@router.get("/", response_model=PaginatedResponse)
def read_words(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    search: Optional[str] = None,
    word_type: Optional[str] = None,
    gender: Optional[str] = None,
    include_pending: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(DBWord).options(joinedload(DBWord.submitter))

    # Apply search filter
    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(
            or_(
                DBWord.greek_word.ilike(search_term),
                DBWord.notes.ilike(search_term),
                DBWord.meanings.any(DBMeaning.english_meaning.ilike(search_term)),
            )
        )

    # Apply word type filter
    if word_type:
        query = query.filter(DBWord.word_type == word_type.lower())

    # Apply gender filter
    if gender:
        query = query.filter(DBWord.gender == gender.lower())

    # Filter by approval status
    if not include_pending or current_user.role != "admin":
        query = query.filter(DBWord.approval_status == ApprovalStatus.APPROVED)

    # Get total count
    total = query.count()

    # Calculate pagination
    skip = (page - 1) * size
    pages = (total + size - 1) // size  # Ceiling division

    # Apply ordering and pagination
    words = query.order_by(DBWord.greek_word).offset(skip).limit(size).all()

    return PaginatedResponse(
        items=words, total=total, page=page, size=size, pages=pages
    )


@router.get("/pending", response_model=List[Word])
def get_pending_words(db: Session = Depends(get_db)):
    return (
        db.query(DBWord)
        .options(joinedload(DBWord.submitter))
        .filter(DBWord.approval_status == ApprovalStatus.PENDING)
        .all()
    )


@router.post("/{word_id}/approve", response_model=Word)
def approve_word(
    word_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    db_word = db.query(DBWord).filter(DBWord.id == word_id).first()
    if db_word is None:
        raise HTTPException(status_code=404, detail="Word not found")

    db_word.approval_status = ApprovalStatus.APPROVED
    db.commit()
    db.refresh(db_word)
    return db_word


@router.post("/{word_id}/reject", response_model=Word)
def reject_word(
    word_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    db_word = db.query(DBWord).filter(DBWord.id == word_id).first()
    if db_word is None:
        raise HTTPException(status_code=404, detail="Word not found")

    db_word.approval_status = ApprovalStatus.REJECTED
    db.commit()
    db.refresh(db_word)
    return db_word


@router.get("/{word_id}", response_model=Word)
def read_word(
    word_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_word = (
        db.query(DBWord)
        .options(joinedload(DBWord.submitter))
        .filter(DBWord.id == word_id)
        .first()
    )
    if db_word is None:
        raise HTTPException(status_code=404, detail="Word not found")

    # Only allow viewing pending words if user is admin
    if (
        db_word.approval_status == ApprovalStatus.PENDING
        and current_user.role != "admin"
    ):
        raise HTTPException(
            status_code=403, detail="Not authorized to view pending words"
        )

    return db_word


@router.put("/{word_id}", response_model=Word)
def update_word(
    word_id: int,
    word: WordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_word = db.query(DBWord).filter(DBWord.id == word_id).first()
    if db_word is None:
        raise HTTPException(status_code=404, detail="Word not found")

    # Only allow updating if user is admin or if the word is pending
    if (
        current_user.role != "admin"
        and db_word.approval_status != ApprovalStatus.PENDING
    ):
        raise HTTPException(
            status_code=403, detail="Not authorized to update approved words"
        )

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

    # If user is not admin, set status back to pending
    if current_user.role != "admin":
        db_word.approval_status = ApprovalStatus.PENDING

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
def delete_word(
    word_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    # First, check if the word exists
    db_word = db.query(DBWord).filter(DBWord.id == word_id).first()
    if db_word is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Word not found"
        )

    # Delete all meanings associated with the word
    db.query(DBMeaning).filter(DBMeaning.word_id == word_id).delete()

    # Delete the word
    db.delete(db_word)
    db.commit()

    return {"success": True}
