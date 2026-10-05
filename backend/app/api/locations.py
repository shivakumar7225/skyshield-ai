from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.maps.geocoding import geocoding_service

router = APIRouter(prefix="/api/locations", tags=["Locations"])

@router.get("/search")
async def search_locations(q: str = Query(..., min_length=1)) -> List[Dict[str, Any]]:
    """
    Search exclusively Indian locations (every city, district, mandal, and village).
    Integrates Google Maps API (India) with seamless fallback to Nominatim India & Open-Meteo India.
    Strictly filters out and erases any location outside the Republic of India.
    """
    return await geocoding_service.search(q)

@router.get("/reverse")
async def reverse_geocode_location(
    lat: float = Query(..., ge=6.0, le=37.5, description="Latitude inside Republic of India"),
    lon: float = Query(..., ge=68.0, le=97.5, description="Longitude inside Republic of India")
) -> Dict[str, Any]:
    """
    Reverse geocode real-time GPS coordinates to Indian administrative sector / village / mandal.
    """
    return await geocoding_service.reverse(lat, lon)

@router.get("/presets")
def get_presets() -> List[Dict[str, Any]]:
    return [
        {"id": "loc-1", "name": "Medchal, Telangana, India", "city": "Medchal", "district": "Medchal-Malkajgiri", "mandal": "Medchal", "state": "Telangana", "place_type": "Mandal / Town", "pincode": "501401", "latitude": 17.6297, "longitude": 78.4814, "elevation_m": 560.0, "high_risk_zone": False},
        {"id": "loc-2", "name": "Kompally Village, Medchal-Malkajgiri, Telangana, India", "city": "Kompally", "district": "Medchal-Malkajgiri", "mandal": "Quthbullapur", "state": "Telangana", "place_type": "Village", "pincode": "500100", "latitude": 17.5375, "longitude": 78.4856, "elevation_m": 550.0, "high_risk_zone": False},
        {"id": "loc-3", "name": "Kukatpally, Medchal-Malkajgiri, Telangana, India", "city": "Kukatpally", "district": "Medchal-Malkajgiri", "mandal": "Kukatpally", "state": "Telangana", "place_type": "Mandal", "pincode": "500072", "latitude": 17.4947, "longitude": 78.3996, "elevation_m": 540.0, "high_risk_zone": True},
        {"id": "loc-4", "name": "Ghatkesar Mandal, Medchal-Malkajgiri, Telangana, India", "city": "Ghatkesar", "district": "Medchal-Malkajgiri", "mandal": "Ghatkesar", "state": "Telangana", "place_type": "Mandal", "pincode": "501301", "latitude": 17.4511, "longitude": 78.6843, "elevation_m": 535.0, "high_risk_zone": False},
        {"id": "loc-5", "name": "Miyapur, Medchal-Malkajgiri, Telangana, India", "city": "Miyapur", "district": "Medchal-Malkajgiri", "mandal": "Serilingampally", "state": "Telangana", "place_type": "Mandal", "pincode": "500049", "latitude": 17.4968, "longitude": 78.3614, "elevation_m": 545.0, "high_risk_zone": True},
        {"id": "loc-6", "name": "Gachibowli, Rangareddy, Telangana, India", "city": "Gachibowli", "district": "Rangareddy", "mandal": "Serilingampally", "state": "Telangana", "place_type": "Mandal", "pincode": "500032", "latitude": 17.4401, "longitude": 78.3489, "elevation_m": 555.0, "high_risk_zone": False},
        {"id": "loc-7", "name": "New Delhi, Delhi, India", "city": "New Delhi", "district": "New Delhi", "mandal": "Connaught Place", "state": "Delhi", "place_type": "Capital City", "pincode": "110001", "latitude": 28.6139, "longitude": 77.2090, "elevation_m": 216.0, "high_risk_zone": False},
        {"id": "loc-8", "name": "Mumbai, Maharashtra, India", "city": "Mumbai", "district": "Mumbai City", "mandal": "Colaba", "state": "Maharashtra", "place_type": "Metropolitan City", "pincode": "400001", "latitude": 19.0760, "longitude": 72.8777, "elevation_m": 14.0, "high_risk_zone": True}
    ]
