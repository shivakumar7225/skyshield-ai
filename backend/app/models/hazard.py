from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Text
from app.database import Base

class HazardEvent(Base):
    __tablename__ = "hazard_events"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String(50), unique=True, index=True, nullable=False)  # 'evt-cloudburst-01'
    title = Column(String(200), nullable=False)
    hazard_type = Column(String(50), nullable=False)  # 'CLOUDBURST', 'THUNDERSTORM', 'FLASH_FLOOD'
    severity = Column(String(20), nullable=False)      # 'HIGH', 'SEVERE', 'WATCH', 'NORMAL'
    probability = Column(Float, nullable=False)
    confidence = Column(Float, default=0.87)
    lead_time_minutes = Column(Integer, default=138)
    expected_window = Column(String(100), default="4:00 PM – 6:00 PM")
    status = Column(String(30), default="ACTIVE")      # 'ACTIVE', 'ESCALATED', 'RESOLVED', 'ARCHIVED'
    affected_area_km2 = Column(Float, default=14.2)
    population_at_risk = Column(Integer, default=38420)
    critical_infrastructure_count = Column(Integer, default=6)
    epicenter_lat = Column(Float, nullable=False, default=17.4947)
    epicenter_lon = Column(Float, nullable=False, default=78.3996)
    geometry_json = Column(JSON, nullable=True)        # GeoJSON boundary
    ai_summary = Column(Text, nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

class RiskZone(Base):
    __tablename__ = "risk_zones"

    id = Column(Integer, primary_key=True, index=True)
    zone_code = Column(String(20), unique=True, index=True, nullable=False)  # 'za', 'zb', 'zc'
    name = Column(String(100), nullable=False)
    risk_level = Column(String(20), default="low")     # 'low', 'moderate', 'high', 'severe'
    probability = Column(Float, default=0.18)
    color = Column(String(20), default="#10B981")
    population = Column(Integer, default=12500)
    polygon_coords = Column(JSON, nullable=False)      # [[lat, lon], [lat, lon], ...]
    drainage_susceptibility = Column(String(20), default="MODERATE")
    elevation_min = Column(Float, default=520.0)
    elevation_max = Column(Float, default=560.0)
