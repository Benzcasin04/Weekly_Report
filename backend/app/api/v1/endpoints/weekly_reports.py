"""API endpoints for weekly reports"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from uuid import UUID
from app.core.database import get_db
from app.schemas.weekly_report import (
    WeeklyReportResponse,
    WeeklyReportCreate,
    WeeklyReportUpdate,
)
from app.services.weekly_report_service import weekly_report_service
from app.core.exceptions import NotFoundException

router = APIRouter(prefix="/weekly-reports", tags=["weekly-reports"])


@router.get("/", response_model=list[WeeklyReportResponse])
def list_reports(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Number of records to return"),
    db: Session = Depends(get_db),
):
    """Get all weekly reports with pagination"""
    return weekly_report_service.get_all_reports(db, skip=skip, limit=limit)


@router.post("/", response_model=WeeklyReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(
    report_in: WeeklyReportCreate,
    db: Session = Depends(get_db),
):
    """Create a new weekly report"""
    return weekly_report_service.create_report(db, report_in)


@router.get("/{report_id}", response_model=WeeklyReportResponse)
def get_report(
    report_id: UUID,
    db: Session = Depends(get_db),
):
    """Get a specific weekly report by ID"""
    try:
        return weekly_report_service.get_report(db, report_id)
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.put("/{report_id}", response_model=WeeklyReportResponse)
def update_report(
    report_id: UUID,
    report_in: WeeklyReportUpdate,
    db: Session = Depends(get_db),
):
    """Update a specific weekly report"""
    try:
        return weekly_report_service.update_report(db, report_id, report_in)
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report(
    report_id: UUID,
    db: Session = Depends(get_db),
):
    """Delete a specific weekly report"""
    try:
        weekly_report_service.delete_report(db, report_id)
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)
