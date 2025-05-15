import uvicorn
from app.api import translation, words
from app.core.config import settings
from app.db.database import engine
from app.models.models import Base
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://192.168.0.20:3000",
    "http://192.168.0.20:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Include routers
app.include_router(words.router, prefix=f"{settings.API_V1_STR}/words", tags=["words"])
app.include_router(
    translation.router,
    prefix=f"{settings.API_V1_STR}/translation",
    tags=["translation"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
