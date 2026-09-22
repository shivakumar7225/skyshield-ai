from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.database import Base

class CriticalInfrastructure(Base):
    __tablename__ = "critical_infrastructure"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False)  # 'HOSPITAL', 'FIRE_STATION', 'POLICE', 'POWER_SUBSTATION', 'PUMPING_STATION'
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    elevation_m = Column(Float, default=535.0)
    flood_risk_tier = Column(String(20), default="MODERATE")
    contact = Column(String(50), nullable=True)
    address = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
