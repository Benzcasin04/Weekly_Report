from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database
    SUPABASE_URL: str
    SUPABASE_PASSWORD: str
    SUPABASE_USER: str = "postgres"
    SUPABASE_PORT: int = 5432
    SUPABASE_DB: str = "postgres"
    
    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "WeekLog API"
    DEBUG: bool = True
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # ← add this line to safely ignore extra env vars


settings = Settings()