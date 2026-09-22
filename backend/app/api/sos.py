from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.sos import SOSRequest
from app.models.audit import AuditLog
from app.schemas import SOSCreateRequest, SOSAssignRequest
from app.realtime.connection_manager import connection_manager

router = APIRouter(prefix="/api/sos", tags=["SOS Emergency"])

MOCK_SOS_QUEUE = [
    {
        "id": "#1047",
        "category": "Flooding",
        "badge": "🔴 Urgent",
        "severity": "severe",
        "location": "Kukatpally, Road No. 3",
        "coords": {"lat": 17.4947, "lng": 78.3996},
        "reportedBy": "P. Ramesh (Citizen App)",
        "mobile": "+91 98480 12345",
        "timeAgo": "4 mins ago",
        "timestamp": "14:44 IST",
        "notes": "Basement water level rising rapidly. 4 elderly family members trapped inside ground floor apartment.",
        "assignedTo": "NDRF Unit 4 - Kukatpally",
        "status": "Assigned"
    },
    {
        "id": "#1046",
        "category": "Medical",
        "badge": "🔴 Urgent",
        "severity": "severe",
        "location": "Miyapur Metro Station Underpass",
        "coords": {"lat": 17.4968, "lng": 78.3614},
        "reportedBy": "Dr. K. Srinivas",
        "mobile": "+91 99887 76655",
        "timeAgo": "11 mins ago",
        "timestamp": "14:37 IST",
        "notes": "Ambulance stuck in 2.5 ft waterlogged underpass. Cardiac emergency patient onboard needing immediate transit.",
        "assignedTo": "GHMC Heavy Drainage Pump Squad 2",
        "status": "Assigned"
    },
    {
        "id": "#1045",
        "category": "Power Outage",
        "badge": "🟡 Moderate",
        "severity": "moderate",
        "location": "Gachibowli, Telecom Nagar",
        "coords": {"lat": 17.4401, "lng": 78.3489},
        "reportedBy": "Residents Welfare Association",
        "mobile": "+91 91234 56789",
        "timeAgo": "26 mins ago",
        "timestamp": "14:22 IST",
        "notes": "Transformer submerged in low-lying residential block. Sparks observed near water line.",
        "assignedTo": "TSSPDCL Quick Response Crew",
        "status": "Assigned"
    }
]

@router.get("")
def get_sos_requests() -> List[Dict[str, Any]]:
    return MOCK_SOS_QUEUE

@router.post("")
async def create_sos(req: SOSCreateRequest, db: Session = Depends(get_db)):
    """
    Citizen triggers 1-tap SOS report.
    Persists to database, pushes immediate alert to /ws/officer.
    """
    # Generate unique sequential ID starting at #1048
    base_num = 1048
    while db.query(SOSRequest).filter(SOSRequest.request_code == f"#{base_num}").first():
        base_num += 1
    new_id = f"#{base_num}"
    new_sos = {
        "id": new_id,
        "category": req.category,
        "badge": "🔴 Urgent",
        "severity": "severe",
        "location": req.location,
        "coords": {"lat": req.latitude or 17.4947, "lng": req.longitude or 78.3996},
        "reportedBy": f"{req.citizen_name} (Citizen App)",
        "mobile": req.mobile or "+91 98765 43210",
        "timeAgo": "Just now",
        "timestamp": datetime.utcnow().strftime("%H:%M UTC"),
        "notes": req.notes or f"Citizen triggered 1-tap SOS report for {req.category} in {req.location}.",
        "assignedTo": None,
        "status": "Pending"
    }

    # Prepend to memory queue
    MOCK_SOS_QUEUE.insert(0, new_sos)

    # Persist database record
    db_sos = SOSRequest(
        request_code=new_id,
        category=req.category,
        reported_by=new_sos["reportedBy"],
        mobile=new_sos["mobile"],
        location_name=req.location,
        latitude=new_sos["coords"]["lat"],
        longitude=new_sos["coords"]["lng"],
        notes=new_sos["notes"],
        status="Pending"
    )
    db.add(db_sos)

    audit = AuditLog(
        user_identifier=req.mobile or "Citizen",
        user_type="CITIZEN",
        action="SOS_CREATED",
        resource=new_id,
        after_state=new_sos
    )
    db.add(audit)
    db.commit()

    # Real-time WebSocket push to all officers
    await connection_manager.broadcast_to_officers("SOS_CREATED", new_sos)

    return {
        "success": True,
        "requestId": new_id,
        "request": new_sos,
        "message": "Emergency dispatch telemetry registered. Teams deployed."
    }

def _find_sos(sos_id: str):
    clean = sos_id.replace("#", "").strip()
    return next((s for s in MOCK_SOS_QUEUE if s["id"].replace("#", "").strip() == clean), None)

@router.post("/{sos_id:path}/assign")
async def assign_sos_team(sos_id: str, req: SOSAssignRequest, db: Session = Depends(get_db)):
    """
    Officer assigns responder team to SOS incident.
    Broadcasts SOS_ASSIGNED to officers and citizen.
    """
    target = _find_sos(sos_id)
    if target:
        target["assignedTo"] = req.team_name
        target["status"] = "Assigned"
        target["badge"] = "🟡 Assigned"

    audit = AuditLog(
        user_identifier="Officer",
        user_type="OFFICER",
        action="SOS_ASSIGNED",
        resource=sos_id,
        after_state={"assignedTo": req.team_name}
    )
    db.add(audit)
    db.commit()

    await connection_manager.broadcast_all("SOS_ASSIGNED", {"sosId": sos_id, "team": req.team_name})
    return {"success": True, "updated": target}

@router.post("/{sos_id:path}/resolve")
async def resolve_sos(sos_id: str, db: Session = Depends(get_db)):
    target = _find_sos(sos_id)
    if target:
        target["status"] = "Resolved"
        target["badge"] = "🟢 Resolved"

    audit = AuditLog(
        user_identifier="Officer",
        user_type="OFFICER",
        action="SOS_RESOLVED",
        resource=sos_id
    )
    db.add(audit)
    db.commit()

    await connection_manager.broadcast_all("SOS_RESOLVED", {"sosId": sos_id})
    return {"success": True, "message": f"SOS {sos_id} marked as resolved."}
