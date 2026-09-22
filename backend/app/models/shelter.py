from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON
from app.database import Base

class Shelter(Base):
    __tablename__ = "shelters"

    id = Column(Integer, primary_key=True, index=True)
    shelter_code = Column(String(50), unique=True, index=True, nullable=False)  # 'sh-01'
    name = Column(String(150), nullable=False)
    type = Column(String(50), default="Community Shelter")
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    capacity = Column(Integer, default=500)
    current_occupancy = Column(Integer, default=45)
    status = Column(String(20), default="OPEN")  # 'OPEN', 'FULL', 'STANDBY'
    address = Column(String(255), nullable=False)
    contact = Column(String(50), default="1070 / 040-21111111")
    elevation_m = Column(Float, default=552.0)
    facilities = Column(JSON, default=list)  # ["First Aid", "Drinking Water", "Generator Backup"]
    verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
