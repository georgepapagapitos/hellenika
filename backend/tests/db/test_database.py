from unittest.mock import MagicMock, patch

import pytest
from sqlalchemy.exc import SQLAlchemyError

from app.db.database import SessionLocal, get_db


def test_get_db_success():
    """Test successful database session creation and cleanup"""
    # Create a mock session
    mock_session = MagicMock()

    # Patch SessionLocal to return our mock session
    with patch("app.db.database.SessionLocal", return_value=mock_session):
        # Get the database session generator
        db_gen = get_db()

        # Get the session
        db = next(db_gen)

        # Verify the session was created
        assert db == mock_session

        # Simulate the finally block
        try:
            next(db_gen)
        except StopIteration:
            pass

        # Verify the session was closed
        mock_session.close.assert_called_once()


def test_get_db_error_handling():
    """Test database session error handling"""
    # Create a mock session that raises an error
    mock_session = MagicMock()
    mock_session.close.side_effect = SQLAlchemyError("Database error")

    # Patch SessionLocal to return our mock session
    with patch("app.db.database.SessionLocal", return_value=mock_session):
        # Get the database session generator
        db_gen = get_db()

        # Get the session
        db = next(db_gen)

        # Verify the session was created
        assert db == mock_session

        # Simulate the finally block and verify it handles the error
        with pytest.raises(SQLAlchemyError):
            next(db_gen)

        # Verify the session was still attempted to be closed
        mock_session.close.assert_called_once()


def test_session_local_configuration():
    """Test SessionLocal configuration"""
    # Verify SessionLocal is configured correctly
    assert SessionLocal.kw["autocommit"] is False
    assert SessionLocal.kw["autoflush"] is False
    assert SessionLocal.kw["bind"] is not None
