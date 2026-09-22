from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from app.database import Base

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    display_name = Column(String(255), index=True, nullable=False)
    city = Column(String(100), index=True, nullable=True)
    state = Column(String(100), nullable=True)
    country = Column(String(100), default="India")
    postal_code = Column(String(20), nullable=True)
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    elevation_m = Column(Float, nullable=True, default=540.0)
    timezone = Column(String(50), default="Asia/Kolkata")
    created_at = Column(DateTime, default=datetime.utcnow)
