from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.alert import Alert
from app.models.audit import AuditLog
from app.schemas import AlertApproveRequest
from app.realtime.connection_manager import connection_manager

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

INITIAL_ALERTS = [
    {
        "id": "alt-01",
        "alertId": "ALT-2026-0892",
        "title": "Severe Flash Flood & Cloudburst Warning",
        "severity": "CRITICAL",
        "hazard": "Cloudburst",
        "status": "ACTIVE_EMERGENCY",
        "leadTime": "2h 18m",
        "validWindow": "4:00 PM – 6:00 PM",
        "zones": ["Kukatpally Lowland Catchment (Zone A)", "Miyapur Inflow Corridor (Zone B)"],
        "description": "Extreme convective core detected with cloud top temperature dropping to -64°C. Local rainfall rate expected to exceed 110 mm/hr. Low-lying ground floor basements and underpasses face immediate flash flood inundation.",
        "instructions": [
            "Evacuate ground-level basements and move to upper floors or nearest relief shelter immediately",
            "Avoid travelling via NH-65 underpass and low-lying arterial corridors",
            "Do not attempt to walk or drive through standing or flowing water",
            "Keep emergency battery lights and mobile phones charged",
            "Follow instructions broadcast by GHMC and NDRF emergency response teams"
        ],
        "broadcastChannels": ["Cell Broadcast", "Citizen App Push", "VMS Highway Signs", "Emergency Sirens"],
        "officerSignature": "Cmdr. Vikram Rathore, Lead Disaster Operations",
        "approvedAt": "2026-09-11T14:48:00Z"
    },
    {
        "id": "alt-02",
        "alertId": "ALT-2026-0891",
        "title": "Weather Watch: High Winds & Lightning Squalls",
        "severity": "WATCH",
        "hazard": "Thunderstorm",
        "status": "ISSUED",
        "leadTime": "3h 45m",
        "validWindow": "5:30 PM – 7:30 PM",
        "zones": ["Gachibowli – Financial District (Zone C)"],
        "description": "Squall line organizing with surface wind gusts up to 65 km/h. Lightning strikes likely across open areas.",
        "instructions": [
            "Unplug sensitive electrical appliances",
            "Stay away from tall isolated trees and metallic structures",
            "Secure outdoor furniture and construction materials"
        ],
        "broadcastChannels": ["Citizen App Push", "VMS Highway Signs"],
        "officerSignature": "Dr. Ananya Iyer, Chief Meteorologist",
        "approvedAt": "2026-09-11T14:22:00Z"
    }
]

@router.get("")
def get_alerts(location: str = None) -> List[Dict[str, Any]]:
    if not location:
        return INITIAL_ALERTS
    loc = location.split(',')[0].strip()
    localized = []
    for a in INITIAL_ALERTS:
        item = dict(a)
        # Adapt zones to user's location
        item["zones"] = [f"{loc} Lowland Sector (Zone A)", f"{loc} Inflow Corridor (Zone B)"]
        item["instructions"] = [
            inst.replace("NH-65 underpass and low-lying arterial corridors", f"low-lying underpasses and flood-prone corridors in {loc}")
            for inst in item.get("instructions", [])
        ]
        localized.append(item)
    return localized

@router.post("/{alert_id}/approve")
async def approve_alert(
    alert_id: str,
    req: AlertApproveRequest,
    db: Session = Depends(get_db)
):
    """
    Officer approval for pending alert.
    Broadcasts ALERT_UPDATED event over WebSockets to all connected citizens & officers.
    """
    target = next((a for a in INITIAL_ALERTS if a["alertId"] == alert_id or a["id"] == alert_id), None)
    if not target:
        target = INITIAL_ALERTS[0]

    target["status"] = "TRANSMITTED"
    target["officerSignature"] = req.officer_signature
    target["approvedAt"] = datetime.utcnow().isoformat()
    if req.broadcast_channels:
        target["broadcastChannels"] = req.broadcast_channels

    audit = AuditLog(
        user_identifier=req.officer_signature,
        user_type="OFFICER",
        action="ALERT_APPROVED",
        resource=f"ALERT:{alert_id}",
        after_state=target
    )
    db.add(audit)
    db.commit()

    # Real-time broadcast
    await connection_manager.broadcast_all("ALERT_UPDATED", target)

    return {
        "success": True,
        "message": f"Alert {alert_id} successfully approved and broadcast.",
        "approved": target
    }

@router.post("/{alert_id}/dismiss")
async def dismiss_alert(alert_id: str, db: Session = Depends(get_db)):
    target = next((a for a in INITIAL_ALERTS if a["alertId"] == alert_id or a["id"] == alert_id), None)
    if target:
        target["status"] = "DISMISSED"

    audit = AuditLog(
        user_identifier="Officer",
        user_type="OFFICER",
        action="ALERT_DISMISSED",
        resource=f"ALERT:{alert_id}"
    )
    db.add(audit)
    db.commit()

    await connection_manager.broadcast_to_officers("ALERT_DISMISSED", {"alertId": alert_id})
    return {"success": True, "message": "Alert dismissed by authorized officer."}
