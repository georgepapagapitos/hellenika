from fastapi import status

from app.models.word import ApprovalStatus
from app.models.word import Word as DBWord


def test_create_word(client):
    # Create test word data
    word_data = {
        "greek_word": "γεια",
        "word_type": "noun",
        "gender": "neuter",
        "notes": "A greeting",
        "meanings": [{"english_meaning": "hello", "is_primary": True}],
    }

    # Make the request
    response = client.post("/api/v1/words/", json=word_data)

    # Check response
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["greek_word"] == word_data["greek_word"]
    assert data["word_type"] == word_data["word_type"]
    assert data["approval_status"] == ApprovalStatus.PENDING.value


def test_read_words(client, db_session):
    # Create test words
    test_words = [
        DBWord(
            greek_word="γεια",
            word_type="noun",
            gender="neuter",
            notes="A greeting",
            approval_status=ApprovalStatus.APPROVED,
        ),
        DBWord(
            greek_word="καλημέρα",
            word_type="noun",
            gender="feminine",
            notes="Good morning",
            approval_status=ApprovalStatus.APPROVED,
        ),
    ]
    db_session.add_all(test_words)
    db_session.commit()

    # Test basic listing
    response = client.get("/api/v1/words/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data["items"]) == 2
    assert data["total"] == 2

    # Test search
    response = client.get("/api/v1/words/?search=γεια")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["greek_word"] == "γεια"


def test_read_word_not_found(client):
    response = client.get("/api/v1/words/999")
    assert response.status_code == status.HTTP_404_NOT_FOUND
