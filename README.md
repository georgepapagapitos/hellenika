# Hellenika

A Greek language learning application with a FastAPI backend and React frontend.

## Overview

Hellenika is a full-stack application for managing Greek words and translations. It provides a RESTful API for word management and a user-friendly frontend for interacting with the data.

## Key Features

- Greek word management with meanings
- Word categorization (nouns, verbs, adjectives, etc.)
- Gender support for nouns
- Primary and secondary meanings
- Google Translate API integration for automatic translations
- RESTful API design
- Environment-based configuration
- Secure password hashing and JWT authentication

## Quick Start

To start both the backend and frontend servers simultaneously, use the provided `start.sh` script:

```bash
./start.sh
```

This script will start the backend server at http://localhost:8000 and the frontend server at http://localhost:3000.

## Backend

For detailed setup and usage instructions, see the [Backend README](backend/README.md).

## Frontend

For detailed setup and usage instructions, see the [Frontend README](frontend/README.md).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
