from fastapi import APIRouter, Query, Depends
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.database import get_db, haversine_distance
from app.models.shelter import Shelter
from app.maps.routing import routing_service

router = APIRouter(prefix="/api/shelters", tags=["Shelters"])

MOCK_SHELTERS_DATA = [
    {
        "id": "sh-01",
        "name": "Kukatpally Community Relief Center",
        "type": "Municipal Relief Hall",
        "distance": "0.8 km",
        "walkingTime": "11 mins",
        "drivingTime": "4 mins",
        "capacity": "500 People",
        "currentOccupancy": 45,
        "availableBeds": 455,
        "safetyScore": 98,
        "elevationGain": "+12m Higher Ground",
        "elevation": 552,
        "status": "OPEN",
        "address": "Opp. Rythu Bazaar, Road No. 2, Kukatpally",
        "contact": "1070 / 040-21111111",
        "facilities": ["Clean Drinking Water", "Medical First Aid", "Generator Power", "Emergency Food Stock"],
        "coords": {"lat": 17.4985, "lng": 78.4045},
        "verified": True
    },
    {
        "id": "sh-02",
        "name": "Zilla Parishad High School Campus",
        "type": "Designated Evacuation Facility",
        "distance": "1.4 km",
        "walkingTime": "18 mins",
        "drivingTime": "6 mins",
        "capacity": "850 People",
        "currentOccupancy": 120,
        "availableBeds": 730,
        "safetyScore": 95,
        "elevationGain": "+15m Higher Ground",
        "elevation": 555,
        "status": "OPEN",
        "address": "Near KPHB Metro Station, Phase 1",
        "contact": "1070 / 040-22222222",
        "facilities": ["Elevated Multi-Storey Classrooms", "Emergency Cots", "Water Purifier", "Doctor on Standby"],
        "coords": {"lat": 17.4932, "lng": 78.3912},
        "verified": True
    },
    {
        "id": "sh-03",
        "name": "Miyapur Indoor Sports Complex",
        "type": "Mega Relief Shelter",
        "distance": "2.8 km",
        "walkingTime": "35 mins",
        "drivingTime": "9 mins",
        "capacity": "1200 People",
        "currentOccupancy": 10,
        "availableBeds": 1190,
        "safetyScore": 99,
        "elevationGain": "+18m Higher Ground",
        "elevation": 558,
        "status": "STANDBY",
        "address": "Miyapur Allwyn X Roads",
        "contact": "1070 / 040-23333333",
        "facilities": ["High Capacity Hall", "Ambulance Bay", "Solar Microgrid", "Telecom Booster"],
        "coords": {"lat": 17.5012, "lng": 78.3685},
        "verified": True
    }
]

@router.get("/nearby")
def get_nearby_shelters(
    lat: float = Query(17.4947),
    lon: float = Query(78.3996),
    db: Session = Depends(get_db)
) -> List[Dict[str, Any]]:
    """
    Get nearest verified emergency shelters sorted by distance.
    """
    shelters = db.query(Shelter).all()
    if shelters:
        result = []
        for s in shelters:
            dist = round(haversine_distance(lat, lon, s.latitude, s.longitude), 2)
            result.append({
                "id": s.shelter_code,
                "name": s.name,
                "type": s.type,
                "distance": f"{dist} km",
                "walkingTime": f"{int(dist * 14)} mins",
                "drivingTime": f"{max(3, int(dist * 4.5))} mins",
                "capacity": f"{s.capacity} People",
                "currentOccupancy": s.current_occupancy,
                "availableBeds": max(0, s.capacity - s.current_occupancy),
                "safetyScore": 98,
                "elevationGain": f"+{int(s.elevation_m - 540)}m Higher Ground",
                "elevation": int(s.elevation_m),
                "status": s.status,
                "address": s.address,
                "contact": s.contact,
                "facilities": s.facilities or ["Water", "First Aid"],
                "coords": {"lat": s.latitude, "lng": s.longitude},
                "verified": s.verified
            })
        return sorted(result, key=lambda x: float(x["distance"].replace(" km", "")))

    return MOCK_SHELTERS_DATA

@router.get("/route")
def get_shelter_route(
    shelter_id: str = Query("sh-01"),
    origin_lat: float = Query(17.4947),
    origin_lon: float = Query(78.3996)
) -> Dict[str, Any]:
    """
    Calculate emergency route to shelter avoiding low-lying inundated roads.
    """
    target = next((s for s in MOCK_SHELTERS_DATA if s["id"] == shelter_id), MOCK_SHELTERS_DATA[0])
    return routing_service.calculate_shelter_route(
        origin_lat=origin_lat,
        origin_lon=origin_lon,
        dest_lat=target["coords"]["lat"],
        dest_lon=target["coords"]["lng"],
        shelter_name=target["name"]
    )

@router.get("/{shelter_id}")
def get_shelter_by_id(shelter_id: str) -> Dict[str, Any]:
    for s in MOCK_SHELTERS_DATA:
        if s["id"] == shelter_id:
            return s
    return MOCK_SHELTERS_DATA[0]
