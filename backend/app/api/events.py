from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.risk.nowcast_engine import nowcast_model

router = APIRouter(prefix="/api/events", tags=["Hazard Events"])

MOCK_EVENTS = [
    {
        "id": "evt-cloudburst-01",
        "title": "Cloudburst Nowcast Cell Alpha",
        "hazard": "Cloudburst & Micro-Basin Flash Flood",
        "severity": "HIGH",
        "status": "ACTIVE",
        "probability": 87,
        "leadTime": "2h 18m",
        "expectedWindow": "4:00 PM – 6:00 PM",
        "zone": "Kukatpally & Miyapur Catchment (Zone A & B)",
        "affectedArea": "14.2 km²",
        "population": 38420,
        "infrastructure": "2 Hospitals, 4 Schools, 1 Substation",
        "confidence": 87,
        "multiSourceAgreement": 91,
        "model_version": "v1.0-operational",
        "radarReflectivity": "54 dBZ (Extreme)",
        "cttDropRate": "-8.2°C / 30 min",
        "detectedAt": "14:12 IST",
        "lastUpdated": "14:48 IST"
    },
    {
        "id": "evt-thunderstorm-02",
        "title": "Gachibowli High-Wind Squall Cluster",
        "hazard": "Severe Thunderstorm & Lightning",
        "severity": "WATCH",
        "status": "MONITORING",
        "probability": 68,
        "leadTime": "3h 45m",
        "expectedWindow": "5:30 PM – 7:30 PM",
        "zone": "Gachibowli – Financial District",
        "affectedArea": "8.5 km²",
        "population": 19800,
        "infrastructure": "IT Corridors, 1 Substation",
        "confidence": 82,
        "multiSourceAgreement": 85,
        "model_version": "v1.0-operational",
        "radarReflectivity": "42 dBZ (Moderate)",
        "cttDropRate": "-4.1°C / 30 min",
        "detectedAt": "14:20 IST",
        "lastUpdated": "14:45 IST"
    }
]

@router.get("")
def get_active_events() -> List[Dict[str, Any]]:
    if nowcast_model.current_demo_state == "NORMAL":
        return []
    return MOCK_EVENTS

@router.get("/{event_id}")
def get_event_details(event_id: str) -> Dict[str, Any]:
    for evt in MOCK_EVENTS:
        if evt["id"] == event_id:
            return evt
    return MOCK_EVENTS[0]
