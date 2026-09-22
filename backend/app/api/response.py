from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter(prefix="/api/response", tags=["Response Teams"])

MOCK_TEAMS = [
    {
        "id": "t1",
        "name": "NDRF Unit 4 - Kukatpally",
        "type": "National Disaster Response Force",
        "status": "Deployed",
        "statusBadge": "Deployed",
        "personnel": 12,
        "equipment": "2 Inflatable Boats, 4 Dewatering Pumps",
        "currentTask": "Rescue assignment at Kukatpally Road No. 3 (SOS #1047)",
        "contact": "+91 94400 11223"
    },
    {
        "id": "t2",
        "name": "GHMC Heavy Drainage Pump Squad 2",
        "type": "Municipal Drainage Operations",
        "status": "Deployed",
        "statusBadge": "Deployed",
        "personnel": 8,
        "equipment": "3 High-Capacity Submersible Diesel Pumps (5000 GPM)",
        "currentTask": "De-watering NH-65 Underpass corridor",
        "contact": "+91 94400 44556"
    },
    {
        "id": "t3",
        "name": "Telangana Fire & Rescue Station 9",
        "type": "Fire & Emergency Rescue",
        "status": "Available",
        "statusBadge": "Standby",
        "personnel": 16,
        "equipment": "Emergency Rescue Tender, Hydraulic Cutters, Life Buoys",
        "currentTask": "Standby at Kukatpally Station",
        "contact": "101 / 040-23444444"
    },
    {
        "id": "t4",
        "name": "TSSPDCL Electrical Safety Crew",
        "type": "Power Grid Rapid Response",
        "status": "Deployed",
        "statusBadge": "Deployed",
        "personnel": 6,
        "equipment": "Insulated Cherry Picker, Transformer Isolator Kit",
        "currentTask": "Substation isolation at Telecom Nagar (SOS #1045)",
        "contact": "+91 94400 77889"
    }
]

@router.get("/teams")
def get_response_teams() -> List[Dict[str, Any]]:
    return MOCK_TEAMS

@router.post("/teams/{team_id}/status")
def update_team_status(team_id: str, status: str) -> Dict[str, Any]:
    for t in MOCK_TEAMS:
        if t["id"] == team_id:
            t["status"] = status
            return {"success": True, "team": t}
    return {"success": False, "message": "Team not found"}
