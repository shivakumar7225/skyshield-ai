from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey, Text
from app.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(String(50), unique=True, index=True, nullable=False)  # 'ALT-2026-0892'
    event_id = Column(String(50), nullable=True)
    title = Column(String(200), nullable=False)
    hazard_type = Column(String(50), nullable=False)
    severity = Column(String(20), nullable=False)  # 'WATCH', 'WARNING', 'EMERGENCY', 'ALL_CLEAR'
    status = Column(String(30), default="REVIEW_REQUIRED")  # PREDICTED, VALIDATING, REVIEW_REQUIRED, APPROVED, ISSUED, ACTIVE, RESOLVED, DISMISSED
    lead_time = Column(String(50), default="2h 18m")
    effective_window = Column(String(100), default="4:00 PM – 6:00 PM")
    affected_zones = Column(JSON, default=list)  # ["Kukatpally", "Miyapur"]
    description = Column(Text, nullable=False)
    instructions = Column(JSON, default=list)    # ["Move to higher ground", "Avoid basements"]
    broadcast_channels = Column(JSON, default=list)  # ["Cell Broadcast", "Citizen App Push", "Sirens"]
    officer_signature = Column(String(100), nullable=True)
    issued_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AlertRecipient(Base):
    __tablename__ = "alert_recipients"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(Integer, ForeignKey("alerts.id"), nullable=False)
    citizen_id = Column(Integer, ForeignKey("citizens.id"), nullable=False)
    delivery_channel = Column(String(30), default="IN_APP")
    status = Column(String(20), default="DELIVERED")  # PENDING, DELIVERED, READ
    sent_at = Column(DateTime, default=datetime.utcnow)
    read_at = Column(DateTime, nullable=True)
