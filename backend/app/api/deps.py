"""Dependency injection for API routes"""

from sqlalchemy.orm import Session
from app.core.database import get_db as _get_db


def get_db() -> Session:
    """Get database session for dependency injection"""
    return _get_db()
