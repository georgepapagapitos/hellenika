from fastapi import status

from app.models.user import User
from app.models.word import ApprovalStatus, Word


def test_get_dashboard_stats(admin_client, client, db_session):
    # Create some test users
    users = [User(email=f"user{i}@example.com", role="user") for i in range(3)]
    db_session.add_all(users)
    db_session.commit()

    # Create some test words
    words = [
        Word(
            greek_word=f"word{i}",
            word_type="noun",
            approval_status=ApprovalStatus.APPROVED,
        )
        for i in range(5)
    ]
    db_session.add_all(words)
    db_session.commit()

    # Test as admin
    response = admin_client.get("/api/v1/admin/stats")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "total_users" in data
    assert "active_users" in data
    assert "total_content" in data
    assert "user_growth" in data
    assert data["total_users"] >= 3  # At least our test users
    assert data["total_content"] >= 5  # At least our test words

    # Test as regular user (should fail)
    response = client.get("/api/v1/admin/stats")
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_get_recent_users(admin_client, client, db_session):
    # Create some test users
    users = [User(email=f"user{i}@example.com", role="user") for i in range(3)]
    db_session.add_all(users)
    db_session.commit()

    # Test as admin
    response = admin_client.get("/api/v1/admin/users")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert all(
        "id" in user and "email" in user and "joined" in user for user in data
    )

    # Test as regular user (should fail)
    response = client.get("/api/v1/admin/users")
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_get_recent_content(admin_client, client, db_session):
    # Create some test words
    words = [
        Word(
            greek_word=f"word{i}",
            word_type="noun",
            approval_status=ApprovalStatus.APPROVED,
        )
        for i in range(5)
    ]
    db_session.add_all(words)
    db_session.commit()

    # Test as admin
    response = admin_client.get("/api/v1/admin/content")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert all(
        "id" in content and "title" in content and "type" in content
        for content in data
    )

    # Test as regular user (should fail)
    response = client.get("/api/v1/admin/content")
    assert response.status_code == status.HTTP_403_FORBIDDEN
