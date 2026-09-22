from datetime import datetime
from fastapi import APIRouter
from app.schemas import DemoStateRequest, DemoStateResponse
from app.risk.nowcast_engine import nowcast_model
from app.realtime.connection_manager import connection_manager

router = APIRouter(prefix="/api/demo", tags=["Simulation State Controller"])

@router.get("/state")
def get_demo_state() -> DemoStateResponse:
    return {
        "state": nowcast_model.current_demo_state,
        "updated_at": datetime.utcnow(),
        "message": f"Active simulation state: {nowcast_model.current_demo_state}"
    }

@router.post("/state")
async def set_demo_state(req: DemoStateRequest) -> DemoStateResponse:
    """
    Switch weather state (NORMAL | WATCH | SEVERE) through the backend.
    Broadcasts change across WebSockets to all connected citizen and officer interfaces.
    """
    clean_state = req.state.upper().strip()
    if clean_state not in ["NORMAL", "WATCH", "SEVERE"]:
        clean_state = "SEVERE"

    nowcast_model.set_demo_state(clean_state)
    payload = {
        "state": clean_state,
        "updated_at": datetime.utcnow().isoformat(),
        "message": f"Weather scenario updated to {clean_state}"
    }

    # Broadcast to all connected clients
    await connection_manager.broadcast_all("DEMO_STATE_CHANGED", payload)

    return {
        "state": clean_state,
        "updated_at": datetime.utcnow(),
        "message": f"Simulation scenario switched to {clean_state}"
    }
