from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, JSON, Text
from app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_identifier = Column(String(100), nullable=False)
    user_type = Column(String(30), default="OFFICER")
    action = Column(String(100), nullable=False)  # 'LOGIN', 'ALERT_APPROVED', 'ALERT_DISMISSED', 'SOS_ASSIGNED'
    resource = Column(String(100), nullable=True)
    before_state = Column(JSON, nullable=True)
    after_state = Column(JSON, nullable=True)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
