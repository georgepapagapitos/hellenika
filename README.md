# Hellenika

A Greek language learning application with a FastAPI backend and React frontend.

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Core functionality (config, security)
│   │   ├── db/            # Database setup
│   │   ├── models/        # SQLAlchemy models
│   │   └── main.py        # FastAPI application
│   ├── venv/              # Python virtual environment
│   ├── .env               # Environment variables (not in git)
│   └── requirements.txt   # Python dependencies
└── frontend/              # React frontend
```

## Backend Setup

### Prerequisites

- Python 3.12+
- PostgreSQL
- Virtual environment (recommended)

### Installation

1. Create and activate a virtual environment:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables:

```bash
cp .env.example .ev
```

4. Run the development server:

```bash
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000

## API Documentation

Once the server is running, you can access:

- Interactive API documentation: http://localhost:8000/docs
- Alternative API documentation: http://localhost:8000/redoc

### API Endpoints

All endpoints are prefixed with `/api`:

#### Words

- `GET /api/words/` - List all words
- `POST /api/words/` - Create a new word
- `GET /api/words/{word_id}` - Get a specific word
- `PUT /api/words/{word_id}` - Update a word
- `POST /api/words/{word_id}/meanings/` - Add a meaning to a word

Example request to create a word:

```json
POST /api/words/
{
  "greek_word": "γεια",
  "word_type": "noun",
  "gender": "feminine",
  "notes": "Informal greeting",
  "meanings": [
    {
      "english_meaning": "hello",
      "is_primary": true
    }
  ]
}
```

## Key Features

- Greek word management with meanings
- Word categorization (nouns, verbs, adjectives, etc.)
- Gender support for nouns
- Primary and secondary meanings
- Google Translate API integration for automatic translations
- RESTful API design
- Environment-based configuration
- Secure password hashing and JWT authentication

## Development

### Google Translate API Setup

This application integrates with Google Cloud Translation API:

1. Create a Google Cloud project: https://console.cloud.google.com/
2. Enable the Cloud Translation API for your project
3. Create an API key with access to the Translation API
4. Add the API key to your backend `.env` file:

```
GOOGLE_TRANSLATE_API_KEY=your_api_key_here
```

Note: The Google Translate API is a paid service. You will be charged for usage according to Google Cloud's pricing.

### Translation Endpoints

The application provides translation endpoints through the backend API:

- `POST /api/translation/to-greek` - Translate text to Greek
- `POST /api/translation/to-english` - Translate text to English

Example request to translate to Greek:

```json
POST /api/translation/to-greek
{
  "text": "hello"
}
```

Example response:

```json
{
  "translated_text": "γεια"
}
```

### Code Organization

- `app/api/`: API endpoints and route handlers
- `app/core/`: Core functionality including configuration and security
- `app/db/`: Database connection and session management
- `app/models/`: SQLAlchemy models for database tables

### Environment Variables

The application uses environment variables for configuration. Make sure to:

1. Never commit the `.env` file to version control
2. Keep a `.env.example` file in the repository as a template
3. Update the environment variables according to your deployment environment

### Database

The application uses PostgreSQL with SQLAlchemy ORM. Make sure to:

1. Have PostgreSQL installed and running
2. Create a database named `hellenika` (or update the configuration)
3. Update the database credentials in your `.env` file

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- CORS protection
- Environment variables for sensitive data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
