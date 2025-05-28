from fastapi import status

from app.models.word import ApprovalStatus


def test_approve_word(admin_client, client):
    # Create a word as regular user
    word_data = {
        "greek_word": "γεια",
        "word_type": "noun",
        "gender": "neuter",
        "notes": "A greeting",
        "meanings": [{"english_meaning": "hello", "is_primary": True}],
    }

    # Create word as regular user
    response = client.post("/api/v1/words/", json=word_data)
    assert response.status_code == status.HTTP_200_OK
    word_id = response.json()["id"]

    # Try to approve as regular user (should fail)
    response = client.post(f"/api/v1/words/{word_id}/approve")
    assert response.status_code == status.HTTP_403_FORBIDDEN

    # Approve as admin
    response = admin_client.post(f"/api/v1/words/{word_id}/approve")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["approval_status"] == ApprovalStatus.APPROVED.value


def test_reject_word(admin_client, client):
    # Create a word as regular user
    word_data = {
        "greek_word": "γεια",
        "word_type": "noun",
        "gender": "neuter",
        "notes": "A greeting",
        "meanings": [{"english_meaning": "hello", "is_primary": True}],
    }

    # Create word as regular user
    response = client.post("/api/v1/words/", json=word_data)
    assert response.status_code == status.HTTP_200_OK
    word_id = response.json()["id"]

    # Try to reject as regular user (should fail)
    response = client.post(f"/api/v1/words/{word_id}/reject")
    assert response.status_code == status.HTTP_403_FORBIDDEN

    # Reject as admin
    response = admin_client.post(f"/api/v1/words/{word_id}/reject")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["approval_status"] == ApprovalStatus.REJECTED.value
