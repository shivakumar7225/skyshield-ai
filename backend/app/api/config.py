import os
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.config import settings

router = APIRouter(prefix="/api/config", tags=["System Configuration"])

class MapKeysUpdateRequest(BaseModel):
    google_maps_api_key: Optional[str] = None
    openweather_api_key: Optional[str] = None

@router.get("/maps")
def get_map_config() -> Dict[str, Any]:
    """
    Get current configured state of GIS & Weather Map API Keys.
    """
    google_key = settings.GOOGLE_MAPS_API_KEY or os.environ.get("GOOGLE_MAPS_API_KEY", "")
    ow_key = settings.OPENWEATHER_API_KEY or os.environ.get("OPENWEATHER_API_KEY", "")

    return {
        "google_maps": {
            "is_configured": bool(google_key and len(google_key) > 5),
            "key": google_key,
            "masked_key": f"{google_key[:4]}...{google_key[-4:]}" if len(google_key) > 8 else ("Configured" if google_key else "Not Set"),
            "provider": "Google Maps (India Restricted & Global)",
            "supported_views": ["Satellite", "Hybrid", "Streets"]
        },
        "openweather": {
            "is_configured": bool(ow_key and len(ow_key) > 5),
            "key": ow_key,
            "masked_key": f"{ow_key[:4]}...{ow_key[-4:]}" if len(ow_key) > 8 else ("Configured" if ow_key else "Not Set"),
            "provider": "OpenWeatherMap Doppler Precipitation Radar",
            "supported_views": ["Precipitation Radar", "Wind", "Clouds"]
        },
        "rainviewer": {
            "is_configured": True,
            "provider": "RainViewer Live Doppler Radar Network (India Coverage)",
            "status": "Active (Free / No Key Required)"
        },
        "geodetic_grid": {
            "datum": "WGS 84",
            "precision": "Sub-Second Geodetic Latitude & Longitude",
            "country_bound": "Republic of India (6.0° N - 37.5° N, 68.0° E - 97.5° E)"
        }
    }

@router.post("/maps")
def update_map_keys(req: MapKeysUpdateRequest) -> Dict[str, Any]:
    """
    Update Google Maps & OpenWeather API keys at runtime and persist to backend environment.
    """
    updated = {}
    if req.google_maps_api_key is not None:
        clean_key = req.google_maps_api_key.strip()
        settings.GOOGLE_MAPS_API_KEY = clean_key
        os.environ["GOOGLE_MAPS_API_KEY"] = clean_key
        # Also update geocoding service singleton
        from app.maps.geocoding import geocoding_service
        geocoding_service.google_key = clean_key
        updated["google_maps_api_key"] = bool(clean_key)

    if req.openweather_api_key is not None:
        clean_ow = req.openweather_api_key.strip()
        settings.OPENWEATHER_API_KEY = clean_ow
        os.environ["OPENWEATHER_API_KEY"] = clean_ow
        updated["openweather_api_key"] = bool(clean_ow)

    return {
        "success": True,
        "message": "Map API keys updated successfully at runtime.",
        "updated": updated,
        "config": get_map_config()
    }
