"""Tests for weekly reports endpoints"""

import pytest
from fastapi.testclient import TestClient
from app.schemas.weekly_report import WeeklyReportCreate


def test_health_check(client):
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_list_reports_empty(client):
    """Test listing reports when empty"""
    response = client.get("/api/v1/weekly-reports/")
    assert response.status_code == 200
    assert response.json() == []


def test_create_report(client):
    """Test creating a new report"""
    payload = {
        "name": "John Doe",
        "note": "Completed project setup and initial testing"
    }
    response = client.post("/api/v1/weekly-reports/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "John Doe"
    assert data["note"] == "Completed project setup and initial testing"
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data
    
    return data["id"]


def test_list_reports(client):
    """Test listing reports after creation"""
    # Create a report
    payload = {
        "name": "Jane Smith",
        "note": "Finished sprint planning and code reviews"
    }
    create_response = client.post("/api/v1/weekly-reports/", json=payload)
    assert create_response.status_code == 201
    
    # List reports
    response = client.get("/api/v1/weekly-reports/")
    assert response.status_code == 200
    reports = response.json()
    assert len(reports) == 1
    assert reports[0]["name"] == "Jane Smith"


def test_get_report(client):
    """Test getting a specific report"""
    # Create a report
    payload = {
        "name": "Alice Johnson",
        "note": "Database optimization completed"
    }
    create_response = client.post("/api/v1/weekly-reports/", json=payload)
    report_id = create_response.json()["id"]
    
    # Get the report
    response = client.get(f"/api/v1/weekly-reports/{report_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == report_id
    assert data["name"] == "Alice Johnson"


def test_get_report_not_found(client):
    """Test getting a non-existent report"""
    response = client.get("/api/v1/weekly-reports/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


def test_update_report(client):
    """Test updating a report"""
    # Create a report
    payload = {
        "name": "Bob Wilson",
        "note": "Initial note"
    }
    create_response = client.post("/api/v1/weekly-reports/", json=payload)
    report_id = create_response.json()["id"]
    
    # Update the report
    update_payload = {
        "name": "Bob Wilson",
        "note": "Updated note with more details"
    }
    response = client.put(f"/api/v1/weekly-reports/{report_id}", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["note"] == "Updated note with more details"


def test_delete_report(client):
    """Test deleting a report"""
    # Create a report
    payload = {
        "name": "Carol Davis",
        "note": "Report to delete"
    }
    create_response = client.post("/api/v1/weekly-reports/", json=payload)
    report_id = create_response.json()["id"]
    
    # Delete the report
    response = client.delete(f"/api/v1/weekly-reports/{report_id}")
    assert response.status_code == 204
    
    # Verify it's deleted
    get_response = client.get(f"/api/v1/weekly-reports/{report_id}")
    assert get_response.status_code == 404
