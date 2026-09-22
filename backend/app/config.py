import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "SkyShield AI"
    APP_ENV: str = "DEVELOPMENT"
    DEMO_MODE: bool = True
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "sqlite:///./skyshield.db"
    REDIS_URL: str = ""
    
    # Auth
    JWT_SECRET: str = "skyshield_secure_production_secret_key_change_in_production_928374"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
    
    # External APIs
    OPEN_METEO_ENABLED: bool = True
    OPENWEATHER_API_KEY: str = ""
    GOOGLE_MAPS_API_KEY: str = ""
    
    # MOSDAC / INSAT
    MOSDAC_API_KEY: str = ""
    MOSDAC_USERNAME: str = ""
    MOSDAC_PASSWORD: str = ""
    MOSDAC_BASE_URL: str = "https://mosdac.gov.in/api"
    
    # IMDAA / QPE / DEM
    IMDAA_DATA_DIR: str = "./data/imdaa"
    IMDAA_API_ENDPOINT: str = ""
    QPE_DATA_DIR: str = "./data/qpe"
    DEM_DATA_DIR: str = "./data/dem"
    
    # AI
    GEMINI_API_KEY: str = ""
    
    # Intervals
    WEATHER_UPDATE_INTERVAL_SECONDS: int = 300
    PREDICTION_UPDATE_INTERVAL_SECONDS: int = 120

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
