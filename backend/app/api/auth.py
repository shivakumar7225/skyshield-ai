from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import Citizen, Officer, User
from app.models.location import Location
from app.models.audit import AuditLog
from app.schemas import CitizenLoginRequest, OfficerLoginRequest, TokenResponse
from app.auth.security import create_access_token, verify_password, get_current_user_payload

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/citizen/login", response_model=TokenResponse)
async def citizen_login(req: CitizenLoginRequest, db: Session = Depends(get_db)):
    """
    Citizen lightweight session login (Name + Mobile).
    Zero OTP required per prototype specifications.
    Generates secure session token and persists citizen profile.
    """
    clean_name = req.name.strip()
    clean_mobile = req.mobile.strip()

    citizen = db.query(Citizen).filter(Citizen.mobile == clean_mobile).first()
    if not citizen:
        # Create new citizen record
        citizen = Citizen(
            name=clean_name,
            mobile=clean_mobile,
            language="English"
        )
        db.add(citizen)
        db.commit()
        db.refresh(citizen)
    else:
        citizen.name = clean_name
        citizen.last_seen_at = datetime.utcnow()
        db.commit()

    token = create_access_token({
        "sub": str(citizen.id),
        "name": citizen.name,
        "mobile": citizen.mobile,
        "user_type": "CITIZEN"
    })

    # Audit log
    audit = AuditLog(
        user_identifier=citizen.mobile,
        user_type="CITIZEN",
        action="CITIZEN_LOGIN",
        resource="CITIZEN_PORTAL"
    )
    db.add(audit)
    db.commit()

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_type": "CITIZEN",
        "profile": {
            "id": citizen.id,
            "name": citizen.name,
            "mobile": citizen.mobile,
            "language": citizen.language,
            "primaryLocation": req.location or "Kukatpally, Hyderabad"
        }
    }

@router.post("/officer/login", response_model=TokenResponse)
async def officer_login(req: OfficerLoginRequest, db: Session = Depends(get_db)):
    """
    Officer Command Center login using officer_id and password hash verification.
    """
    officer = db.query(Officer).filter(Officer.officer_id == req.officer_id.strip()).first()
    if not officer or not verify_password(req.password, officer.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Officer ID or authorization key"
        )

    if not officer.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Officer account deactivated"
        )

    officer.last_login_at = datetime.utcnow()
    db.commit()

    token = create_access_token({
        "sub": str(officer.id),
        "officer_id": officer.officer_id,
        "name": officer.name,
        "role": officer.role,
        "department": officer.department,
        "user_type": "OFFICER"
    })

    audit = AuditLog(
        user_identifier=officer.officer_id,
        user_type="OFFICER",
        action="OFFICER_LOGIN",
        resource="COMMAND_CENTER"
    )
    db.add(audit)
    db.commit()

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_type": "OFFICER",
        "profile": {
            "id": officer.id,
            "officerId": officer.officer_id,
            "name": officer.name,
            "department": officer.department,
            "role": officer.role
        }
    }

@router.post("/logout")
async def logout(payload: dict = Depends(get_current_user_payload), db: Session = Depends(get_db)):
    audit = AuditLog(
        user_identifier=payload.get("sub", "unknown"),
        user_type=payload.get("user_type", "UNKNOWN"),
        action="LOGOUT"
    )
    db.add(audit)
    db.commit()
    return {"success": True, "message": "Logged out successfully"}

@router.get("/me")
async def get_current_user(payload: dict = Depends(get_current_user_payload)):
    return {"user": payload}
