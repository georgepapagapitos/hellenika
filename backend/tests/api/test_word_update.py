from fastapi import status

from app.models.word import ApprovalStatus, WordType


def test_update_word_as_admin(admin_client, client, db_session):
    # Create a word as regular user
    word_data = {
        "greek_word": "γεια",
        "word_type": WordType.NOUN,
        "gender": "neuter",
        "notes": "A greeting",
        "meanings": [{"english_meaning": "hello", "is_primary": True}],
    }
    response = client.post("/api/v1/words/", json=word_data)
    assert response.status_code == status.HTTP_200_OK
    word_id = response.json()["id"]

    # Update word as admin
    updated_data = {
        "greek_word": "γεια σας",
        "word_type": WordType.ADVERB,
        "gender": None,
        "notes": "A formal greeting",
        "meanings": [
            {"english_meaning": "hello to you", "is_primary": True},
            {"english_meaning": "good day", "is_primary": False},
        ],
    }
    response = admin_client.put(f"/api/v1/words/{word_id}", json=updated_data)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["greek_word"] == updated_data["greek_word"]
    assert data["word_type"] == updated_data["word_type"]
    assert data["notes"] == updated_data["notes"]
    assert len(data["meanings"]) == 2
    assert data["approval_status"] == ApprovalStatus.APPROVED.value


def test_update_word_as_regular_user(client, db_session):
    # Create a word
    word_data = {
        "greek_word": "γεια",
        "word_type": WordType.NOUN,
        "gender": "neuter",
        "notes": "A greeting",
        "meanings": [{"english_meaning": "hello", "is_primary": True}],
    }
    response = client.post("/api/v1/words/", json=word_data)
    assert response.status_code == status.HTTP_200_OK
    word_id = response.json()["id"]

    # Update word
    updated_data = {
        "greek_word": "γεια σας",
        "word_type": WordType.ADVERB,
        "gender": None,
        "notes": "A formal greeting",
        "meanings": [
            {"english_meaning": "hello to you", "is_primary": True},
            {"english_meaning": "good day", "is_primary": False},
        ],
    }
    response = client.put(f"/api/v1/words/{word_id}", json=updated_data)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["greek_word"] == updated_data["greek_word"]
    assert data["word_type"] == updated_data["word_type"]
    assert data["notes"] == updated_data["notes"]
    assert len(data["meanings"]) == 2
    assert data["approval_status"] == ApprovalStatus.PENDING.value


def test_update_nonexistent_word(client):
    response = client.put(
        "/api/v1/words/999",
        json={
            "greek_word": "test",
            "word_type": WordType.NOUN,
            "meanings": [{"english_meaning": "test", "is_primary": True}],
        },
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_update_approved_word_as_regular_user(
    client, admin_client, db_session
):
    # Create and approve a word
    word_data = {
        "greek_word": "γεια",
        "word_type": WordType.NOUN,
        "gender": "neuter",
        "notes": "A greeting",
        "meanings": [{"english_meaning": "hello", "is_primary": True}],
    }
    response = client.post("/api/v1/words/", json=word_data)
    assert response.status_code == status.HTTP_200_OK
    word_id = response.json()["id"]

    # Approve the word
    response = admin_client.post(f"/api/v1/words/{word_id}/approve")
    assert response.status_code == status.HTTP_200_OK

    # Try to update as regular user (should fail)
    updated_data = {
        "greek_word": "γεια σας",
        "word_type": WordType.ADVERB,
        "gender": None,
        "notes": "A formal greeting",
        "meanings": [{"english_meaning": "hello to you", "is_primary": True}],
    }
    response = client.put(f"/api/v1/words/{word_id}", json=updated_data)
    assert response.status_code == status.HTTP_403_FORBIDDEN
