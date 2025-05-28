from fastapi import status

from app.models.user import User


def test_register_user(client, db_session):
    # Test user registration
    user_data = {
        "email": "newuser@example.com",
        "password": "testpassword123",
        "role": "user",
    }

    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert "token_type" in data
    assert data["token_type"] == "bearer"

    # Verify user was created in database
    user = (
        db_session.query(User).filter(User.email == user_data["email"]).first()
    )
    assert user is not None
    assert user.email == user_data["email"]
    assert user.role == user_data["role"]


def test_register_duplicate_email(client, db_session):
    # Register first user
    user_data = {
        "email": "duplicate@example.com",
        "password": "testpassword123",
        "role": "user",
    }
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == status.HTTP_200_OK

    # Try to register with same email
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "email already exists" in response.json()["detail"].lower()


def test_login_success(client, db_session):
    # Register a user first
    user_data = {
        "email": "login@example.com",
        "password": "testpassword123",
        "role": "user",
    }
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == status.HTTP_200_OK

    # Test login
    login_data = {
        "username": user_data["email"],
        "password": user_data["password"],
    }
    response = client.post("/api/v1/auth/token", data=login_data)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert "token_type" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client, db_session):
    # Register a user first
    user_data = {
        "email": "wrongpass@example.com",
        "password": "testpassword123",
        "role": "user",
    }
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == status.HTTP_200_OK

    # Test login with wrong password
    login_data = {
        "username": user_data["email"],
        "password": "wrongpassword",
    }
    response = client.post("/api/v1/auth/token", data=login_data)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "incorrect" in response.json()["detail"].lower()


def test_get_current_user(client, db_session):
    # Register and login a user
    user_data = {
        "email": "current@example.com",
        "password": "testpassword123",
        "role": "user",
    }
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == status.HTTP_200_OK
    token = response.json()["access_token"]

    # Get current user info
    response = client.get(
        "/api/v1/auth/users/me", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == user_data["email"]
    assert data["role"] == user_data["role"]
    assert "id" in data
