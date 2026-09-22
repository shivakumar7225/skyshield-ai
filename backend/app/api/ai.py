from fastapi import APIRouter
from typing import Dict, Any, List
from app.schemas import AIExplainRequest, AIExplainResponse
from app.ai.gemini_provider import gemini_provider

router = APIRouter(prefix="/api/ai", tags=["AI Explanation Layer"])

@router.post("/explain", response_model=AIExplainResponse)
async def explain_prediction(req: AIExplainRequest):
    """
    Generate plain-language or technical explanation grounded strictly in backend sensor telemetry.
    Zero hallucination of numbers.
    """
    res = await gemini_provider.generate_explanation(
        hazard=req.hazard,
        probability=req.probability,
        lead_time=req.lead_time,
        location=req.location,
        audience=req.audience
    )
    return {
        "explanation": res["explanation"],
        "technical_details": res.get("technical_details"),
        "safety_actions": res.get("safety_actions", []),
        "generated_by": res.get("source", "SkyShield Meteorological AI Engine")
    }

@router.post("/recommendations")
def get_operational_recommendations() -> List[Dict[str, Any]]:
    return [
        {
            "priority": "HIGH",
            "title": "Evacuation of Ground-Floor Basements (Zone A)",
            "rationale": "High flood depression index and rainfall intensity exceeding 110 mm/hr will lead to rapid sub-surface ponding.",
            "leadTime": "Execute within next 45 minutes",
            "assignedAgency": "GHMC Disaster Management + Ward Volunteers"
        },
        {
            "priority": "HIGH",
            "title": "Traffic Diversion at NH-65 Underpass",
            "rationale": "Inundation depth modeled to reach 0.65m; high risk of civilian vehicle stalling and trapping.",
            "leadTime": "Immediate (T-0)",
            "assignedAgency": "Cyberabad Traffic Police"
        },
        {
            "priority": "MEDIUM",
            "title": "Pre-position Submersible Pumps at KPHB Metro",
            "rationale": "Secondary overflow channel threshold expected to be breached by 17:15 IST.",
            "leadTime": "Deploy within 90 minutes",
            "assignedAgency": "GHMC Heavy Drainage Pump Squad 2"
        }
    ]
