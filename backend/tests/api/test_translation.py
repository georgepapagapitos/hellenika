from unittest.mock import patch

from fastapi import status


@patch("app.core.translation.translate_text")
def test_translate_to_greek(mock_translate, client):
    # Mock the translation response
    mock_translate.return_value = "Γεια σας, πώς είστε;"

    # Test translation to Greek
    response = client.post(
        "/api/v1/translation/to-greek", json={"text": "Hello, how are you?"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "translated_text" in data
    assert isinstance(data["translated_text"], str)
    assert len(data["translated_text"]) > 0


@patch("app.core.translation.translate_text")
def test_translate_to_english(mock_translate, client):
    # Mock the translation response
    mock_translate.return_value = "Hello, how are you?"

    # Test translation to English
    response = client.post(
        "/api/v1/translation/to-english", json={"text": "Γεια σας, πώς είστε;"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "translated_text" in data
    assert isinstance(data["translated_text"], str)
    assert len(data["translated_text"]) > 0


def test_translate_empty_text(client):
    # Test translation with empty text
    response = client.post("/api/v1/translation/to-greek", json={"text": ""})
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    data = response.json()
    assert "detail" in data
    assert "empty" in data["detail"].lower()


@patch("app.core.translation.translate_text")
def test_translate_special_characters(mock_translate, client):
    # Mock the translation response
    mock_translate.return_value = "Γεια! Πώς είσαι; Είναι μια όμορφη μέρα."

    # Test translation with special characters
    response = client.post(
        "/api/v1/translation/to-greek",
        json={"text": "Hello! How are you? It's a beautiful day."},
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "translated_text" in data
    assert isinstance(data["translated_text"], str)
    assert len(data["translated_text"]) > 0
