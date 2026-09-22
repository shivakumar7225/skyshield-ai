from fastapi import APIRouter, Query
from typing import Dict, Any
from app.weather.service import weather_service
from app.ingestion.imdaa import imdaa_provider
from app.ingestion.dem import dem_provider
from app.ingestion.qpe import qpe_provider
from app.risk.nowcast_engine import nowcast_model
from app.maps.geocoding import is_within_india, INDIA_BOUNDS

router = APIRouter(prefix="/api/risk", tags=["Risk Analysis"])

def clamp_to_india(lat: float, lon: float) -> tuple[float, float]:
    """Ensure coordinates strictly stay within the Indian geodetic boundary."""
    clamped_lat = max(INDIA_BOUNDS["min_lat"], min(INDIA_BOUNDS["max_lat"], lat))
    clamped_lon = max(INDIA_BOUNDS["min_lon"], min(INDIA_BOUNDS["max_lon"], lon))
    return clamped_lat, clamped_lon

@router.get("/current")
async def get_current_risk(
    lat: float = Query(17.6297),
    lon: float = Query(78.4814),
    location: str = Query("Medchal, Telangana, India")
) -> Dict[str, Any]:
    """
    Get current severe weather risk metrics, nowcast probabilities, and confidence (India Only).
    """
    valid_lat, valid_lon = clamp_to_india(lat, lon)
    weather = await weather_service.get_current(valid_lat, valid_lon, location_name=location)
    stability = await imdaa_provider.get_stability_indices(valid_lat, valid_lon)
    dem = await dem_provider.get_elevation_and_slope(valid_lat, valid_lon)
    qpe = await qpe_provider.get_precipitation_estimate(valid_lat, valid_lon, weather.get("precipitation", 0.0))

    result = nowcast_model.generate_nowcast(weather, stability, qpe, dem, location_name=location)
    result["jurisdiction"] = "Republic of India (Strictly Bounded)"
    return result

@router.get("/timeline")
def get_risk_timeline(
    location: str = Query("Medchal, Telangana, India")
) -> Dict[str, Any]:
    """
    7-Point Nowcast Timeline Scrubber (-6h, -4h, -2h, NOW, +2h, +4h, +6h).
    """
    return nowcast_model.get_timeline(location_name=location)

@router.get("/map")
def get_risk_map_layers(
    location: str = Query("Medchal, Telangana, India"),
    lat: float = Query(17.6297),
    lon: float = Query(78.4814)
) -> Dict[str, Any]:
    """
    Get Geospatial Radar Grid, Catchment Zones, and Infrastructure boundaries (India Only).
    """
    valid_lat, valid_lon = clamp_to_india(lat, lon)
    is_severe = nowcast_model.current_demo_state == "SEVERE"
    is_warning = nowcast_model.current_demo_state == "WATCH"
    loc = location.split(',')[0].strip() if location else "Local"

    return {
        "center": {"lat": valid_lat, "lng": valid_lon, "zoom": 13},
        "zones": [
            {
                "id": "za",
                "name": f"Zone A: {loc} Lowland Catchment",
                "riskLevel": "severe" if is_severe else "high" if is_warning else "low",
                "probability": 87 if is_severe else 78 if is_warning else 18,
                "color": "#EF4444" if is_severe else "#F97316" if is_warning else "#10B981",
                "population": 38420,
                "drainageSusceptibility": "HIGH"
            },
            {
                "id": "zb",
                "name": f"Zone B: {loc} Inflow Corridor",
                "riskLevel": "high" if is_severe else "moderate" if is_warning else "low",
                "probability": 81 if is_severe else 52 if is_warning else 12,
                "color": "#F97316" if is_severe else "#EAB308" if is_warning else "#10B981",
                "population": 24150,
                "drainageSusceptibility": "MODERATE"
            },
            {
                "id": "zc",
                "name": f"Zone C: {loc} Elevated Ridge",
                "riskLevel": "moderate" if (is_severe or is_warning) else "low",
                "probability": 58 if is_severe else 42 if is_warning else 10,
                "color": "#EAB308" if (is_severe or is_warning) else "#10B981",
                "population": 19800,
                "drainageSusceptibility": "LOW"
            }
        ],
        "criticalRoads": [
            {"id": "cr-1", "name": f"Main Arterial Road ({loc})", "status": "INUNDATED" if is_severe else "WATERLOGGED" if is_warning else "CLEAR"},
            {"id": "cr-2", "name": f"Connecting Highway & Ring Road ({loc})", "status": "SLOW_TRAFFIC" if (is_severe or is_warning) else "NORMAL"}
        ],
        "drainageBasins": [
            {"name": f"{loc} Low-Basin Lake Catchment", "capacityUsed": 92 if is_severe else 68 if is_warning else 25},
            {"name": f"{loc} Natural Nala Overflow Corridor", "capacityUsed": 86 if is_severe else 55 if is_warning else 20}
        ]
    }
