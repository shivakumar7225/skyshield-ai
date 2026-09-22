import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_current_weather():
    resp = client.get("/api/weather/current?lat=17.4947&lon=78.3996&location=Kukatpally")
    assert resp.status_code == 200
    data = resp.json()
    assert "temperature" in data
    assert "humidity" in data
    assert "source" in data

def test_get_weather_features():
    resp = client.get("/api/weather/features?lat=17.4947&lon=78.3996")
    assert resp.status_code == 200
    data = resp.json()
    assert "elevation_m" in data
    assert "source_status" in data

def test_get_current_risk():
    resp = client.get("/api/risk/current?lat=17.4947&lon=78.3996")
    assert resp.status_code == 200
    data = resp.json()
    assert "risks" in data
    assert "thunderstorm" in data["risks"]
    assert "cloudburst" in data["risks"]
    assert "flash_flood" in data["risks"]
    assert "confidence" in data

def test_get_risk_timeline():
    resp = client.get("/api/risk/timeline")
    assert resp.status_code == 200
    data = resp.json()
    assert "-6h" in data
    assert "NOW" in data
    assert "+6h" in data
