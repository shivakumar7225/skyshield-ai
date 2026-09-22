from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from app.database import Base

class SystemHealth(Base):
    __tablename__ = "system_health"

    id = Column(Integer, primary_key=True, index=True)
    component_name = Column(String(100), unique=True, nullable=False)  # 'database', 'open_meteo', 'mosdac', 'imdaa', 'gemini_ai'
    status = Column(String(30), default="OK")  # 'OK', 'DEGRADED', 'UNAVAILABLE', 'REQUIRES_KEY'
    latency_ms = Column(Float, default=10.0)
    message = Column(String(255), default="Operational")
    last_check_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    recipient_type = Column(String(30), default="CITIZEN")  # 'CITIZEN', 'OFFICER'
    recipient_id = Column(String(100), nullable=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    channel = Column(String(50), default="IN_APP")  # 'IN_APP', 'BROWSER_PUSH', 'SMS_SIMULATED', 'EMAIL'
    status = Column(String(30), default="SENT")     # 'SENT', 'DELIVERED', 'FAILED'
    created_at = Column(DateTime, default=datetime.utcnow)
