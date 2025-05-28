import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.security import create_access_token
from app.db.database import Base, get_db
from app.main import app
from app.models.user import User

# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def test_user(db_session):
    user = User(
        email="test@example.com", hashed_password="dummy_hash", role="user"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def test_admin(db_session):
    admin = User(
        email="admin@example.com", hashed_password="dummy_hash", role="admin"
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    return admin


@pytest.fixture(scope="function")
def client(db_session, test_user):
    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()

    app.dependency_overrides[get_db] = override_get_db

    # Create access token for the test user
    access_token = create_access_token(subject=test_user.email)

    with TestClient(app) as test_client:
        test_client.headers = {
            **test_client.headers,
            "Authorization": f"Bearer {access_token}",
        }
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def admin_client(db_session, test_admin):
    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()

    app.dependency_overrides[get_db] = override_get_db

    # Create access token for the admin user
    access_token = create_access_token(subject=test_admin.email)

    with TestClient(app) as test_client:
        test_client.headers = {
            **test_client.headers,
            "Authorization": f"Bearer {access_token}",
        }
        yield test_client
    app.dependency_overrides.clear()
