from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey, Text
from app.database import Base

class WeatherObservation(Base):
    __tablename__ = "weather_observations"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    pressure = Column(Float, nullable=True)
    wind_speed = Column(Float, nullable=True)
    wind_direction = Column(Float, nullable=True)
    cloud_cover = Column(Float, nullable=True)
    precipitation = Column(Float, default=0.0)
    weather_code = Column(Integer, nullable=True)
    condition_text = Column(String(100), nullable=True)
    source = Column(String(50), nullable=False)  # 'Open-Meteo', 'OpenWeather', 'MOSDAC', 'IMDAA'
    provider_update_time = Column(DateTime, nullable=True)
    fetched_at = Column(DateTime, default=datetime.utcnow)

class WeatherFeature(Base):
    __tablename__ = "weather_features"

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    iwv = Column(Float, nullable=True)  # Integrated Water Vapour (kg/m²)
    iwv_change = Column(Float, nullable=True)
    cape = Column(Float, nullable=True)  # Convective Available Potential Energy (J/kg)
    cin = Column(Float, nullable=True)   # Convective Inhibition (J/kg)
    ctt = Column(Float, nullable=True)   # Cloud Top Temperature (°C)
    ctt_drop_rate = Column(Float, nullable=True)  # °C / hr
    wind_convergence = Column(Float, nullable=True)
    wind_shear = Column(Float, nullable=True)
    qpe = Column(Float, nullable=True)   # Quantitative Precipitation Estimation (mm/hr)
    rainfall_change = Column(Float, nullable=True)
    elevation = Column(Float, nullable=True)
    slope = Column(Float, nullable=True)
    quality_flag = Column(String(20), default="NOMINAL")  # NOMINAL, DEGRADED, ESTIMATED
    sources = Column(JSON, default=list)
