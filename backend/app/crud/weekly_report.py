"""CRUD operations for WeeklyReport model"""

from sqlalchemy.orm import Session
from uuid import UUID
from app.models.weekly_report import WeeklyReport
from app.schemas.weekly_report import WeeklyReportCreate, WeeklyReportUpdate


class CRUDWeeklyReport:
    """CRUD operations for WeeklyReport"""
    
    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> list[WeeklyReport]:
        """Get all weekly reports ordered by creation date (newest first)"""
        return (
            db.query(WeeklyReport)
            .order_by(WeeklyReport.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_by_id(self, db: Session, id: UUID) -> WeeklyReport | None:
        """Get a weekly report by ID"""
        return db.query(WeeklyReport).filter(WeeklyReport.id == id).first()
    
    def create(self, db: Session, obj_in: WeeklyReportCreate) -> WeeklyReport:
        """Create a new weekly report"""
        db_obj = WeeklyReport(**obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update(
        self, db: Session, db_obj: WeeklyReport, obj_in: WeeklyReportUpdate
    ) -> WeeklyReport:
        """Update an existing weekly report"""
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def delete(self, db: Session, id: UUID) -> WeeklyReport | None:
        """Delete a weekly report by ID"""
        db_obj = db.query(WeeklyReport).filter(WeeklyReport.id == id).first()
        if db_obj:
            db.delete(db_obj)
            db.commit()
        return db_obj


# Instantiate CRUD object
crud_weekly_report = CRUDWeeklyReport()
