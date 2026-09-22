import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_citizen_login():
    resp = client.post("/api/auth/citizen/login", json={
        "name": "Aashrith",
        "mobile": "+91 98765 43210",
        "location": "Kukatpally, Hyderabad"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["user_type"] == "CITIZEN"
    assert data["profile"]["name"] == "Aashrith"

def test_officer_login_success():
    resp = client.post("/api/auth/officer/login", json={
        "officer_id": "officer",
        "password": "commander2026"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["user_type"] == "OFFICER"
    assert data["profile"]["officerId"] == "officer"

def test_officer_login_failure():
    resp = client.post("/api/auth/officer/login", json={
        "officer_id": "officer",
        "password": "wrong_password_999"
    })
    assert resp.status_code == 401
