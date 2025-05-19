from typing import Optional, Tuple

from app.models.word import Gender

# Greek articles and their corresponding genders
# Format: article: (gender, is_definite, is_plural, case)
GREEK_ARTICLES = {
    # Definite articles
    "ο": (Gender.MASCULINE, True, False, "nominative"),  # masculine singular nominative
    "η": (Gender.FEMININE, True, False, "nominative"),  # feminine singular nominative
    "το": (Gender.NEUTER, True, False, "nominative"),  # neuter singular nominative
    "οι": (Gender.MASCULINE, True, True, "nominative"),  # masculine plural nominative
    "οι": (Gender.FEMININE, True, True, "nominative"),  # feminine plural nominative
    "τα": (Gender.NEUTER, True, True, "nominative"),  # neuter plural nominative
    # Accusative case
    "τον": (
        Gender.MASCULINE,
        True,
        False,
        "accusative",
    ),  # masculine singular accusative
    "την": (Gender.FEMININE, True, False, "accusative"),  # feminine singular accusative
    "το": (Gender.NEUTER, True, False, "accusative"),  # neuter singular accusative
    "τους": (Gender.MASCULINE, True, True, "accusative"),  # masculine plural accusative
    "τις": (Gender.FEMININE, True, True, "accusative"),  # feminine plural accusative
    "τα": (Gender.NEUTER, True, True, "accusative"),  # neuter plural accusative
    # Indefinite articles
    "ένας": (
        Gender.MASCULINE,
        False,
        False,
        "nominative",
    ),  # masculine singular nominative
    "μία": (
        Gender.FEMININE,
        False,
        False,
        "nominative",
    ),  # feminine singular nominative
    "ένα": (Gender.NEUTER, False, False, "nominative"),  # neuter singular nominative
    "έναν": (
        Gender.MASCULINE,
        False,
        False,
        "accusative",
    ),  # masculine singular accusative
    "μία": (
        Gender.FEMININE,
        False,
        False,
        "accusative",
    ),  # feminine singular accusative
    "ένα": (Gender.NEUTER, False, False, "accusative"),  # neuter singular accusative
}


def detect_article_and_gender(word: str) -> Tuple[Optional[str], Optional[Gender], str]:
    """
    Detect if a word starts with a Greek article and determine its gender.
    Returns the article (if found), gender, and the word without the article.

    Args:
        word: The Greek word to analyze

    Returns:
        Tuple containing:
        - The article if found, None otherwise
        - The gender if determined, None otherwise
        - The word without the article
    """
    # Split the word into parts
    parts = word.strip().split()
    if not parts:
        return None, None, word

    first_word = parts[0].lower()

    # Check if the first word is an article
    if first_word in GREEK_ARTICLES:
        article = first_word
        gender, _, _, _ = GREEK_ARTICLES[first_word]
        # Return the rest of the word without the article
        remaining_words = " ".join(parts[1:])
        return article, gender, remaining_words

    return None, None, word


def add_article(
    word: str,
    gender: Gender,
    is_plural: bool = False,
    case: str = "nominative",
    is_definite: bool = True,
) -> str:
    """
    Add the appropriate Greek article to a word based on its gender, number, case, and definiteness.

    Args:
        word: The Greek word
        gender: The gender of the word
        is_plural: Whether the word is plural
        case: The grammatical case ("nominative" or "accusative")
        is_definite: Whether to use the definite article (True) or indefinite article (False)

    Returns:
        The word with the appropriate article
    """
    # Find the appropriate article
    for article, (
        art_gender,
        art_definite,
        art_plural,
        art_case,
    ) in GREEK_ARTICLES.items():
        if (
            art_gender == gender
            and art_definite == is_definite
            and art_plural == is_plural
            and art_case == case
        ):
            return f"{article} {word}"

    # If no matching article is found, return the word without an article
    return word
