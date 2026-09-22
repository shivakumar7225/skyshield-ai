from fastapi import APIRouter, Query
from typing import Dict, Any, Optional
from datetime import datetime
from app.weather.service import weather_service
from app.ingestion.mosdac import mosdac_provider
from app.ingestion.imdaa import imdaa_provider
from app.ingestion.dem import dem_provider
from app.ingestion.qpe import qpe_provider
from app.schemas import WeatherCurrentResponse

router = APIRouter(prefix="/api/weather", tags=["Weather"])

@router.get("/current")
async def get_current_weather(
    lat: float = Query(17.4947, description="Latitude"),
    lon: float = Query(78.3996, description="Longitude"),
    location: str = Query("Kukatpally, Hyderabad", description="Location Display Name")
) -> Dict[str, Any]:
    """
    Retrieve real-time weather observation for coordinates.
    Direct integration with Open-Meteo NWP / OpenWeather.
    """
    return await weather_service.get_current(lat, lon, location_name=location)

@router.get("/forecast")
async def get_weather_forecast(
    lat: float = Query(17.4947, description="Latitude"),
    lon: float = Query(78.3996, description="Longitude"),
    hours: int = Query(48, ge=6, le=72, description="Forecast horizon in hours")
) -> Dict[str, Any]:
    """
    Retrieve hourly nowcast & forecast up to 48 hours.
    """
    return await weather_service.get_forecast(lat, lon, hours=hours)

@router.get("/features")
async def get_weather_features(
    lat: float = Query(17.4947),
    lon: float = Query(78.3996)
) -> Dict[str, Any]:
    """
    Retrieve full multi-sensor meteorological feature vector:
    - NWP observations
    - MOSDAC INSAT-3D CTT & IWV status
    - IMDAA atmospheric instability status
    - DEM terrain elevation and slope gradient
    - QPE radar precipitation estimation
    """
    weather = await weather_service.get_current(lat, lon)
    dem = await dem_provider.get_elevation_and_slope(lat, lon)
    qpe = await qpe_provider.get_precipitation_estimate(lat, lon, weather.get("precipitation", 0.0))
    imdaa = await imdaa_provider.get_stability_indices(lat, lon)
    mosdac_meta = mosdac_provider.get_metadata()

    return {
        "latitude": lat,
        "longitude": lon,
        "timestamp": datetime.utcnow().isoformat(),
        "temperature_c": weather.get("temperature"),
        "humidity_pct": weather.get("humidity"),
        "surface_pressure_hpa": weather.get("pressure"),
        "wind_speed_kmh": weather.get("wind_speed"),
        "wind_direction_deg": weather.get("wind_direction"),
        "precipitation_mm": weather.get("precipitation"),
        "elevation_m": dem.get("elevation_meters"),
        "slope_deg": dem.get("slope_degrees"),
        "drainage_susceptibility": dem.get("drainage_susceptibility"),
        "qpe_rainfall_rate_mm_hr": qpe.get("rainfall_rate_mm_hr"),
        "radar_reflectivity_dbz": qpe.get("radar_reflectivity_dbz"),
        "source_status": {
            "Open-Meteo": "LIVE_OPERATIONAL",
            "DEM-Terrain": dem.get("source"),
            "QPE-Radar": qpe.get("source"),
            "IMDAA": imdaa.get("status"),
            "MOSDAC-INSAT": mosdac_meta.get("status")
        }
    }

@router.get("/alerts")
async def get_weather_alerts(
    lat: float = Query(17.4947),
    lon: float = Query(78.3996)
) -> Dict[str, Any]:
    return await weather_service.open_meteo.get_alerts(lat, lon)
