from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

# --- AUTH SCHEMAS ---
class CitizenLoginRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    mobile: str = Field(..., min_length=5, max_length=20)
    location: Optional[str] = "Kukatpally, Hyderabad"

class OfficerLoginRequest(BaseModel):
    officer_id: str = Field(..., min_length=2, max_length=50)
    password: str = Field(..., min_length=1)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_type: str
    profile: Dict[str, Any]

# --- LOCATION SCHEMAS ---
class LocationItem(BaseModel):
    id: Optional[int] = None
    name: str
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = "India"
    pincode: Optional[str] = None
    latitude: float
    longitude: float
    elevation_m: Optional[float] = 540.0
    high_risk_zone: bool = False

# --- WEATHER SCHEMAS ---
class WeatherCurrentResponse(BaseModel):
    location: str
    latitude: float
    longitude: float
    temperature: float
    humidity: float
    pressure: Optional[float] = None
    wind_speed: Optional[float] = None
    wind_direction: Optional[float] = None
    cloud_cover: Optional[float] = None
    precipitation: float = 0.0
    weather_code: Optional[int] = None
    condition: str
    source: str
    provider_update_time: Optional[datetime] = None
    data_quality: str = "NOMINAL"
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class WeatherTimelineItem(BaseModel):
    time_key: str  # '-6h', '-4h', '-2h', 'NOW', '+2h', '+4h', '+6h'
    type: str      # 'PAST', 'LIVE', 'FUTURE'
    type_label: str
    time_label: str
    timestamp: str
    title: str
    badge_color: str
    status_desc: str
    lead_time: str
    risks: Dict[str, int]

class WeatherFeaturesResponse(BaseModel):
    latitude: float
    longitude: float
    timestamp: datetime
    iwv: Optional[float] = None
    iwv_change: Optional[float] = None
    cape: Optional[float] = None
    cin: Optional[float] = None
    ctt: Optional[float] = None
    ctt_drop_rate: Optional[float] = None
    wind_convergence: Optional[float] = None
    wind_shear: Optional[float] = None
    qpe: Optional[float] = None
    rainfall_change: Optional[float] = None
    elevation: Optional[float] = None
    slope: Optional[float] = None
    sources: List[str] = []
    source_status: Dict[str, str] = {}

# --- RISK SCHEMAS ---
class RiskCurrentResponse(BaseModel):
    location: str
    state_key: str
    status_badge: str
    level: str
    color: str
    description: str
    summary: str
    lead_time: str
    window: str
    risks: Dict[str, int]
    confidence: int
    multi_source_agreement: int
    data_quality_score: float = 0.92
    last_updated: str
    mode: str = "LIVE"
    data_sources: List[str] = []

# --- ALERT SCHEMAS ---
class AlertResponse(BaseModel):
    id: int
    alert_id: str
    event_id: Optional[str] = None
    title: str
    hazard_type: str
    severity: str
    status: str
    lead_time: str
    effective_window: str
    affected_zones: List[str]
    description: str
    instructions: List[str]
    broadcast_channels: List[str]
    officer_signature: Optional[str] = None
    issued_at: Optional[datetime] = None
    created_at: datetime

class AlertApproveRequest(BaseModel):
    officer_signature: str = "Cmdr. Vikram Rathore"
    broadcast_channels: Optional[List[str]] = None

# --- SOS SCHEMAS ---
class SOSCreateRequest(BaseModel):
    category: str
    location: str = "Kukatpally, Hyderabad"
    latitude: Optional[float] = 17.4947
    longitude: Optional[float] = 78.3996
    notes: Optional[str] = None
    citizen_name: Optional[str] = "Aashrith"
    mobile: Optional[str] = "+91 98765 43210"

class SOSAssignRequest(BaseModel):
    team_name: str
    team_id: Optional[int] = None
    officer_notes: Optional[str] = None

class SOSResponse(BaseModel):
    id: str
    category: str
    badge: str
    severity: str
    location: str
    coords: Dict[str, float]
    reported_by: str
    mobile: str
    time_ago: str
    timestamp: str
    notes: str
    assigned_to: Optional[str] = None
    status: str

# --- SHELTER SCHEMAS ---
class ShelterResponse(BaseModel):
    id: str
    name: str
    type: str
    distance: str
    walking_time: str
    driving_time: str
    capacity: str
    current_occupancy: int
    available_beds: int
    safety_score: int
    elevation_gain: str
    elevation: int
    status: str
    address: str
    contact: str
    facilities: List[str]
    coords: Dict[str, float]
    verified: bool = True

class RouteStep(BaseModel):
    instruction: str
    distance: str
    duration: str

class ShelterRouteResponse(BaseModel):
    shelter_id: str
    origin: Dict[str, float]
    destination: Dict[str, float]
    distance_km: float
    duration_minutes: int
    mode: str = "driving"
    steps: List[RouteStep]
    hazard_warnings: List[str] = []

# --- AI SCHEMAS ---
class AIExplainRequest(BaseModel):
    event_id: Optional[str] = None
    hazard: str = "cloudburst"
    probability: float = 0.87
    lead_time: str = "2h 18m"
    location: str = "Kukatpally, Hyderabad"
    audience: str = "citizen"  # 'citizen' or 'officer'

class AIExplainResponse(BaseModel):
    explanation: str
    technical_details: Optional[str] = None
    safety_actions: List[str] = []
    generated_by: str = "SkyShield Meteorological AI Engine"
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# --- DEMO SCHEMAS ---
class DemoStateRequest(BaseModel):
    state: str  # 'NORMAL' | 'WARNING' | 'SEVERE'

class DemoStateResponse(BaseModel):
    state: str
    updated_at: datetime
    message: str
