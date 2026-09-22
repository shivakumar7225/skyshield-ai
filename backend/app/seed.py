from sqlalchemy.orm import Session
from app.database import engine, SessionLocal, Base
from app.models.user import Officer, Citizen, User
from app.models.location import Location
from app.models.shelter import Shelter
from app.models.sos import ResponseTeam
from app.models.infrastructure import CriticalInfrastructure
from app.models.hazard import HazardEvent, RiskZone
from app.models.prediction import ModelVersion, DataSource
from app.auth.security import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Seed Demo Officer
        existing_officer = db.query(Officer).filter(Officer.officer_id == "officer").first()
        if not existing_officer:
            officer = Officer(
                officer_id="officer",
                name="Cmdr. Vikram Rathore",
                department="GHMC Disaster Response Force",
                role="DISASTER_MANAGER",
                password_hash=get_password_hash("commander2026")
            )
            db.add(officer)
            print("[Seed] Created default officer: officer / commander2026")

        # 2. Seed Demo Citizen
        existing_citizen = db.query(Citizen).filter(Citizen.mobile == "+91 98765 43210").first()
        if not existing_citizen:
            citizen = Citizen(
                name="Aashrith",
                mobile="+91 98765 43210",
                language="English"
            )
            db.add(citizen)
            print("[Seed] Created default citizen: Aashrith (+91 98765 43210)")

        # 3. Seed Shelters
        if db.query(Shelter).count() == 0:
            s1 = Shelter(
                shelter_code="sh-01",
                name="Kukatpally Community Relief Center",
                type="Municipal Relief Hall",
                latitude=17.4985,
                longitude=78.4045,
                capacity=500,
                current_occupancy=45,
                status="OPEN",
                address="Opp. Rythu Bazaar, Road No. 2, Kukatpally",
                contact="1070 / 040-21111111",
                elevation_m=552.0,
                facilities=["Clean Drinking Water", "Medical First Aid", "Generator Power", "Emergency Food Stock"],
                verified=True
            )
            s2 = Shelter(
                shelter_code="sh-02",
                name="Zilla Parishad High School Campus",
                type="Designated Evacuation Facility",
                latitude=17.4932,
                longitude=78.3912,
                capacity=850,
                current_occupancy=120,
                status="OPEN",
                address="Near KPHB Metro Station, Phase 1",
                contact="1070 / 040-22222222",
                elevation_m=555.0,
                facilities=["Elevated Multi-Storey Classrooms", "Emergency Cots", "Water Purifier", "Doctor on Standby"],
                verified=True
            )
            s3 = Shelter(
                shelter_code="sh-03",
                name="Miyapur Indoor Sports Complex",
                type="Mega Relief Shelter",
                latitude=17.5012,
                longitude=78.3685,
                capacity=1200,
                current_occupancy=10,
                status="STANDBY",
                address="Miyapur Allwyn X Roads",
                contact="1070 / 040-23333333",
                elevation_m=558.0,
                facilities=["High Capacity Hall", "Ambulance Bay", "Solar Microgrid", "Telecom Booster"],
                verified=True
            )
            db.add_all([s1, s2, s3])
            print("[Seed] Seeded 3 verified emergency shelters")

        # 4. Seed Response Teams
        if db.query(ResponseTeam).count() == 0:
            t1 = ResponseTeam(
                team_code="rt-01",
                name="NDRF Unit 4 - Kukatpally",
                team_type="National Disaster Response Force",
                status="DEPLOYED",
                current_lat=17.4947,
                current_lon=78.3996,
                personnel_count=12,
                equipment="2 Inflatable Boats, 4 Dewatering Pumps"
            )
            t2 = ResponseTeam(
                team_code="rt-02",
                name="GHMC Heavy Drainage Pump Squad 2",
                team_type="Municipal Drainage Operations",
                status="DEPLOYED",
                current_lat=17.4968,
                current_lon=78.3614,
                personnel_count=8,
                equipment="3 High-Capacity Submersible Diesel Pumps (5000 GPM)"
            )
            t3 = ResponseTeam(
                team_code="rt-03",
                name="Telangana Fire & Rescue Station 9",
                team_type="Fire & Emergency Rescue",
                status="AVAILABLE",
                current_lat=17.4401,
                current_lon=78.3489,
                personnel_count=16,
                equipment="Emergency Rescue Tender, Hydraulic Cutters, Life Buoys"
            )
            db.add_all([t1, t2, t3])
            print("[Seed] Seeded 3 responder teams")

        # 5. Seed Critical Infrastructure
        if db.query(CriticalInfrastructure).count() == 0:
            infra1 = CriticalInfrastructure(
                name="Prathima Hospital",
                category="HOSPITAL",
                latitude=17.4950,
                longitude=78.4020,
                elevation_m=542.0,
                flood_risk_tier="HIGH",
                contact="040-43454345"
            )
            infra2 = CriticalInfrastructure(
                name="Omni Hospitals",
                category="HOSPITAL",
                latitude=17.4920,
                longitude=78.3970,
                elevation_m=544.0,
                flood_risk_tier="HIGH",
                contact="040-39994999"
            )
            infra3 = CriticalInfrastructure(
                name="TSSPDCL 33/11kV Substation",
                category="POWER_SUBSTATION",
                latitude=17.4930,
                longitude=78.3990,
                elevation_m=537.0,
                flood_risk_tier="HIGH",
                contact="1912"
            )
            db.add_all([infra1, infra2, infra3])
            print("[Seed] Seeded critical infrastructure")

        db.commit()
        print("[Seed] Database seeding completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"[Seed Error] {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
