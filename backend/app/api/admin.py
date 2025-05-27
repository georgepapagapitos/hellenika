from datetime import UTC, datetime, timedelta
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.auth_deps import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.models.word import Word
from app.schemas.admin import DashboardStats, RecentContent, RecentUser

router = APIRouter(tags=["admin"])


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    # Get total users
    total_users = db.query(User).count()

    # Get active users (users who have logged in within the last 30 days)
    now = datetime.now(UTC)
    thirty_days_ago = now - timedelta(days=30)
    active_users = (
        db.query(User)
        .filter(User.last_login >= thirty_days_ago.replace(tzinfo=None))
        .count()
    )

    # Get total content (words)
    total_content = db.query(Word).count()

    # Calculate user growth
    first_day_current_month = now.replace(
        day=1, hour=0, minute=0, second=0, microsecond=0
    )
    first_day_prev_month = (
        first_day_current_month - timedelta(days=1)
    ).replace(day=1)

    # Count users created in current month
    current_month_users = (
        db.query(User)
        .filter(
            User.created_at >= first_day_current_month.replace(tzinfo=None)
        )
        .count()
    )

    # Count users created in previous month
    prev_month_users = (
        db.query(User)
        .filter(
            User.created_at >= first_day_prev_month.replace(tzinfo=None),
            User.created_at < first_day_current_month.replace(tzinfo=None),
        )
        .count()
    )

    # Calculate growth percentage
    user_growth = (
        ((current_month_users - prev_month_users) / prev_month_users * 100)
        if prev_month_users > 0
        else 100 if current_month_users > 0 else 0
    )

    # Calculate content growth (mock data for now)
    content_growth = 25  # This should be calculated based on historical data

    return DashboardStats(
        total_users=total_users,
        active_users=active_users,
        total_content=total_content,
        user_growth=round(user_growth, 1),  # Round to 1 decimal place
        content_growth=content_growth,
    )


@router.get("/users", response_model=List[RecentUser])
async def get_recent_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    # Get the 10 most recent users
    recent_users = (
        db.query(User).order_by(User.created_at.desc()).limit(10).all()
    )

    now = datetime.now(UTC)
    return [
        RecentUser(
            id=user.id,
            name=user.email.split("@")[
                0
            ],  # Using email username as name for now
            email=user.email,
            joined=user.created_at.strftime("%Y-%m-%d"),
            status=(
                "active"
                if user.last_login
                and (now - user.last_login.replace(tzinfo=UTC)).days < 30
                else "inactive"
            ),
        )
        for user in recent_users
    ]


@router.get("/content", response_model=List[RecentContent])
async def get_recent_content(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    # Get the 10 most recent words
    recent_words = (
        db.query(Word).order_by(Word.created_at.desc()).limit(10).all()
    )

    return [
        RecentContent(
            id=word.id,
            title=word.greek_word,
            type="Word",
            created=word.created_at.strftime("%Y-%m-%d"),
            status="published",  # All words are considered published for now
        )
        for word in recent_words
    ]
