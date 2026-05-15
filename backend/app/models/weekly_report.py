"""SQLAlchemy ORM models for database tables"""

from sqlalchemy import Column, String, DateTime, Text, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.core.database import Base


class WeeklyReport(Base):
    """Weekly Report model for storing team members' weekly reports"""
    
    __tablename__ = "weekly_reports"
    
    # Columns
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(255), nullable=False, index=True)
    note = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
    
    def __repr__(self):
        return f"<WeeklyReport(id={self.id}, name={self.name})>"
