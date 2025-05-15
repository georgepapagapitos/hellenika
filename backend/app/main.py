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
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(words.router, prefix=f"{settings.API_V1_STR}/words", tags=["words"])
app.include_router(
    translation.router,
    prefix=f"{settings.API_V1_STR}/translation",
    tags=["translation"],
)
