"""Pydantic schemas for request/response validation"""

from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID


class WeeklyReportBase(BaseModel):
    """Base schema for weekly reports"""
    name: str = Field(..., min_length=1, max_length=255, description="Name of the person submitting the report")
    note: str = Field(..., min_length=1, description="Weekly report content")


class WeeklyReportCreate(WeeklyReportBase):
    """Schema for creating a new weekly report"""
    pass


class WeeklyReportUpdate(BaseModel):
    """Schema for updating a weekly report"""
    name: str | None = Field(None, max_length=255, description="Name of the person")
    note: str | None = Field(None, description="Weekly report content")


class WeeklyReportResponse(WeeklyReportBase):
    """Schema for returning weekly report data"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
