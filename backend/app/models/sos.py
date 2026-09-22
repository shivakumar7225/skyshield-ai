from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class SOSRequest(Base):
    __tablename__ = "sos_requests"

    id = Column(Integer, primary_key=True, index=True)
    request_code = Column(String(50), unique=True, index=True, nullable=False)  # '#1048'
    citizen_id = Column(Integer, ForeignKey("citizens.id"), nullable=True)
    reported_by = Column(String(100), default="Aashrith (Citizen App)")
    mobile = Column(String(20), default="+91 98765 43210")
    category = Column(String(50), nullable=False)  # 'Flooding', 'Trapped', 'Medical', 'Power Outage'
    severity = Column(String(20), default="severe")
    location_name = Column(String(200), default="Kukatpally, Hyderabad")
    latitude = Column(Float, nullable=False, default=17.4947)
    longitude = Column(Float, nullable=False, default=78.3996)
    notes = Column(Text, nullable=True)
    assigned_to = Column(String(100), nullable=True)
    assigned_team_id = Column(Integer, ForeignKey("response_teams.id"), nullable=True)
    status = Column(String(30), default="Pending")  # 'Pending', 'Assigned', 'Dispatched', 'Resolved'
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    citizen = relationship("Citizen", back_populates="sos_requests")
    team = relationship("ResponseTeam")

class ResponseTeam(Base):
    __tablename__ = "response_teams"

    id = Column(Integer, primary_key=True, index=True)
    team_code = Column(String(50), unique=True, index=True, nullable=False)  # 'rt-01'
    name = Column(String(100), nullable=False)
    team_type = Column(String(50), default="NDRF Rapid Response")
    status = Column(String(30), default="AVAILABLE")  # 'AVAILABLE', 'DEPLOYED', 'BUSY', 'OFFLINE'
    current_lat = Column(Float, default=17.4920)
    current_lon = Column(Float, default=78.3960)
    contact = Column(String(50), default="+91 94400 11223")
    personnel_count = Column(Integer, default=12)
    equipment = Column(String(200), default="Inflatable Boats, Water Pumps, Emergency First Aid")
    created_at = Column(DateTime, default=datetime.utcnow)

class ResponseAssignment(Base):
    __tablename__ = "response_assignments"

    id = Column(Integer, primary_key=True, index=True)
    sos_id = Column(Integer, ForeignKey("sos_requests.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("response_teams.id"), nullable=False)
    assigned_by_officer = Column(String(100), default="Cmdr. Vikram Rathore")
    notes = Column(Text, nullable=True)
    status = Column(String(30), default="DISPATCHED")  # DISPATCHED, ON_SCENE, COMPLETED
    assigned_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
