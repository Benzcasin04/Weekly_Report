"""Business logic services for weekly reports"""

from sqlalchemy.orm import Session
from uuid import UUID
from app.crud.weekly_report import crud_weekly_report
from app.schemas.weekly_report import WeeklyReportCreate, WeeklyReportUpdate
from app.models.weekly_report import WeeklyReport
from app.core.exceptions import NotFoundException


class WeeklyReportService:
    """Service layer for WeeklyReport business logic"""
    
    @staticmethod
    def get_all_reports(db: Session, skip: int = 0, limit: int = 100):
        """Get all reports with pagination"""
        return crud_weekly_report.get_all(db, skip=skip, limit=limit)
    
    @staticmethod
    def get_report(db: Session, report_id: UUID) -> WeeklyReport:
        """Get report by ID or raise exception"""
        report = crud_weekly_report.get_by_id(db, report_id)
        if not report:
            raise NotFoundException(f"Weekly report with id {report_id} not found")
        return report
    
    @staticmethod
    def create_report(db: Session, report_in: WeeklyReportCreate) -> WeeklyReport:
        """Create a new report"""
        return crud_weekly_report.create(db, report_in)
    
    @staticmethod
    def update_report(
        db: Session, report_id: UUID, report_in: WeeklyReportUpdate
    ) -> WeeklyReport:
        """Update report or raise exception"""
        report = WeeklyReportService.get_report(db, report_id)
        return crud_weekly_report.update(db, report, report_in)
    
    @staticmethod
    def delete_report(db: Session, report_id: UUID) -> None:
        """Delete report or raise exception"""
        report = WeeklyReportService.get_report(db, report_id)
        crud_weekly_report.delete(db, report_id)


# Instantiate service
weekly_report_service = WeeklyReportService()
