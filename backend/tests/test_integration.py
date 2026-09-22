import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_16_step_disaster_management_lifecycle():
    # 1. Citizen login
    login_resp = client.post("/api/auth/citizen/login", json={
        "name": "Aashrith",
        "mobile": "+91 98765 43210",
        "location": "Kukatpally, Hyderabad"
    })
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    assert token is not None

    # 2. Location selected & verified
    loc_resp = client.get("/api/locations/search?q=Kukatpally")
    assert loc_resp.status_code == 200
    locations = loc_resp.json()
    assert len(locations) > 0
    selected_lat = locations[0]["latitude"]
    selected_lon = locations[0]["longitude"]

    # 3. Weather fetched from real provider
    weather_resp = client.get(f"/api/weather/current?lat={selected_lat}&lon={selected_lon}&location=Kukatpally")
    assert weather_resp.status_code == 200
    weather = weather_resp.json()
    assert "temperature" in weather
    assert "precipitation" in weather

    # 4. Risk calculated
    risk_resp = client.get(f"/api/risk/current?lat={selected_lat}&lon={selected_lon}")
    assert risk_resp.status_code == 200
    risk = risk_resp.json()
    assert "risks" in risk
    assert risk["confidence"] > 0

    # 5. Hazard event retrieved / detected
    events_resp = client.get("/api/events")
    assert events_resp.status_code == 200
    events = events_resp.json()
    assert len(events) > 0
    event_id = events[0]["id"]

    # 6. Impact calculated (population at risk, hospitals, schools)
    impact_resp = client.get(f"/api/impact/{event_id}")
    assert impact_resp.status_code == 200
    impact = impact_resp.json()
    assert impact["population_at_risk"] > 0
    assert len(impact["critical_sites"]) > 0

    # 7. Alert generated in queue
    alerts_resp = client.get("/api/alerts")
    assert alerts_resp.status_code == 200
    alerts = alerts_resp.json()
    assert len(alerts) > 0
    target_alert = alerts[0]["alertId"]

    # 8. Citizen receives / queries active alerts
    citizen_alert_resp = client.get("/api/alerts")
    assert citizen_alert_resp.status_code == 200

    # 9. Officer logs in and reviews pending alert
    officer_login = client.post("/api/auth/officer/login", json={
        "officer_id": "officer",
        "password": "commander2026"
    })
    assert officer_login.status_code == 200
    officer_token = officer_login.json()["access_token"]

    # 10. Officer approves alert
    approve_resp = client.post(
        f"/api/alerts/{target_alert}/approve",
        json={"officer_signature": "Cmdr. Vikram Rathore", "broadcast_channels": ["Cell Broadcast", "Citizen App Push"]},
        headers={"Authorization": f"Bearer {officer_token}"}
    )
    assert approve_resp.status_code == 200
    assert approve_resp.json()["approved"]["status"] == "TRANSMITTED"

    # 11. Citizen warning view receives approved state & checks nearest shelter
    shelter_resp = client.get(f"/api/shelters/nearby?lat={selected_lat}&lon={selected_lon}")
    assert shelter_resp.status_code == 200
    shelters = shelter_resp.json()
    assert len(shelters) > 0
    best_shelter = shelters[0]

    # Calculate real evacuation route
    route_resp = client.get(f"/api/shelters/route?shelter_id={best_shelter['id']}&origin_lat={selected_lat}&origin_lon={selected_lon}")
    assert route_resp.status_code == 200
    route = route_resp.json()
    assert route["distance_km"] > 0

    # 12. Citizen submits SOS
    sos_resp = client.post("/api/sos", json={
        "category": "Flooding",
        "location": "Kukatpally Road No. 3",
        "latitude": selected_lat,
        "longitude": selected_lon,
        "citizen_name": "Aashrith",
        "mobile": "+91 98765 43210",
        "notes": "Water entering living room, elderly parents need assistance."
    })
    assert sos_resp.status_code == 200
    sos_id = sos_resp.json()["requestId"]

    # 13. Officer receives SOS in live queue
    sos_list_resp = client.get("/api/sos")
    assert sos_list_resp.status_code == 200
    sos_items = sos_list_resp.json()
    assert any(s["id"] == sos_id for s in sos_items)

    import urllib.parse
    encoded_sos_id = urllib.parse.quote(sos_id)

    # 14. Officer assigns response team
    assign_resp = client.post(
        f"/api/sos/{encoded_sos_id}/assign",
        json={"team_name": "NDRF Unit 4 - Kukatpally"},
        headers={"Authorization": f"Bearer {officer_token}"}
    )
    assert assign_resp.status_code == 200
    assert assign_resp.json()["updated"]["assignedTo"] == "NDRF Unit 4 - Kukatpally"

    # 15. Team status updates
    team_update_resp = client.post("/api/response/teams/t1/status?status=DEPLOYED")
    assert team_update_resp.status_code == 200

    # 16. Event and SOS resolved
    resolve_resp = client.post(
        f"/api/sos/{encoded_sos_id}/resolve",
        headers={"Authorization": f"Bearer {officer_token}"}
    )
    assert resolve_resp.status_code == 200

    # System Health OK
    health_resp = client.get("/api/health")
    assert health_resp.status_code == 200
    assert health_resp.json()["status"] == "HEALTHY"
