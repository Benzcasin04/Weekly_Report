"""API v1 router aggregator"""

from fastapi import APIRouter
from app.api.v1.endpoints import weekly_reports

api_router = APIRouter()
api_router.include_router(weekly_reports.router, tags=["weekly-reports"])
