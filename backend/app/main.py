from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.realtime.connection_manager import connection_manager

# Import API Routers
from app.api.auth import router as auth_router
from app.api.locations import router as locations_router
from app.api.weather import router as weather_router
from app.api.risk import router as risk_router
from app.api.events import router as events_router
from app.api.impact import router as impact_router
from app.api.shelters import router as shelters_router
from app.api.alerts import router as alerts_router
from app.api.sos import router as sos_router
from app.api.response import router as response_router
from app.api.ai import router as ai_router
from app.api.demo import router as demo_router
from app.api.health import router as health_router
from app.api.config import router as config_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed basic demo records if table is empty
    try:
        from app.seed import seed_database
        seed_database()
    except Exception as e:
        print(f"[SkyShield Init] Auto-seed status: {e}")
        
    yield
    print("[SkyShield Shutdown] Clean shutdown complete.")

app = FastAPI(
    title="SkyShield AI — Early Warning & Disaster Response Engine",
    description="Backend API for Smart India Hackathon Problem Statement 26077 (Ministry of Earth Sciences)",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits all local dev origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register REST Routers
app.include_router(auth_router)
app.include_router(locations_router)
app.include_router(weather_router)
app.include_router(risk_router)
app.include_router(events_router)
app.include_router(impact_router)
app.include_router(shelters_router)
app.include_router(alerts_router)
app.include_router(sos_router)
app.include_router(response_router)
app.include_router(ai_router)
app.include_router(demo_router)
app.include_router(health_router)
app.include_router(config_router)

# WebSocket Channels
@app.websocket("/ws/officer")
async def websocket_officer_endpoint(websocket: WebSocket):
    await connection_manager.connect_officer(websocket)
    try:
        while True:
            # Keep-alive heartbeat & bidirectional commands
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        connection_manager.disconnect_officer(websocket)

@app.websocket("/ws/citizen/{citizen_id}")
async def websocket_citizen_endpoint(websocket: WebSocket, citizen_id: str):
    await connection_manager.connect_citizen(citizen_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        connection_manager.disconnect_citizen(citizen_id, websocket)

@app.get("/")
def root():
    return {
        "system": "SkyShield AI — AI-Driven Hyper-Local Weather Nowcasting Engine",
        "agency": "Ministry of Earth Sciences (MoES)",
        "status": "OPERATIONAL",
        "docs": "/docs",
        "version": "1.0.0"
    }
