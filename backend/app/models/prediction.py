from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Boolean, Text
from app.database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    hazard = Column(String(50), nullable=False)  # 'cloudburst', 'thunderstorm', 'flash_flood'
    probability = Column(Float, nullable=False)  # 0.0 to 1.0
    severity = Column(String(20), nullable=False)  # 'LOW', 'MODERATE', 'HIGH', 'SEVERE'
    lead_time_minutes = Column(Integer, nullable=False)
    confidence = Column(Float, nullable=False)  # 0.0 to 1.0
    data_quality_score = Column(Float, default=0.92)
    multi_source_agreement = Column(Float, default=0.90)
    model_version = Column(String(50), default="v1.0-operational")
    data_sources = Column(JSON, default=list)  # e.g. ["Open-Meteo", "IMD-Radar-Mock", "DEM-SRTM"]
    mode = Column(String(20), default="LIVE")   # 'LIVE' or 'DEMO'
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    geometry_json = Column(JSON, nullable=True)  # GeoJSON polygon or circle of affected zone
    generated_at = Column(DateTime, default=datetime.utcnow)
    valid_until = Column(DateTime, nullable=False)

class ModelVersion(Base):
    __tablename__ = "model_versions"

    id = Column(Integer, primary_key=True, index=True)
    version = Column(String(50), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    architecture = Column(String(100), default="Multi-Task Spatial-Temporal Transformer")
    training_dataset = Column(String(200), nullable=True)
    training_period = Column(String(100), nullable=True)
    validation_period = Column(String(100), nullable=True)
    metrics = Column(JSON, default=dict)  # Precision, Recall, F1, CSI, Brier score
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class DataSource(Base):
    __tablename__ = "data_sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)  # 'Open-Meteo', 'MOSDAC', 'IMDAA', 'DEM', 'QPE'
    category = Column(String(50), nullable=False)  # 'NWP_MODEL', 'SATELLITE', 'RADAR', 'TERRAIN'
    status = Column(String(30), default="AVAILABLE")  # 'AVAILABLE', 'DEGRADED', 'UNAVAILABLE', 'REQUIRES_AUTH'
    last_sync = Column(DateTime, default=datetime.utcnow)
    latency_ms = Column(Integer, default=120)
    coverage = Column(String(100), default="Global / India Regional")
    notes = Column(Text, nullable=True)
