from fastapi import APIRouter
from typing import Dict, Any
from app.risk.impact_engine import impact_engine

router = APIRouter(prefix="/api/impact", tags=["Impact Assessment"])

@router.get("/{event_id}")
def get_impact_assessment(event_id: str) -> Dict[str, Any]:
    """
    Get detailed spatial impact assessment (population at risk, critical hospitals, schools, flood roads).
    """
    return impact_engine.compute_impact(
        event_id=event_id,
        epicenter_lat=17.4947,
        epicenter_lon=78.3996,
        hazard_type="CLOUDBURST",
        radius_km=4.5
    )
