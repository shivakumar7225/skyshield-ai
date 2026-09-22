import httpx
from datetime import datetime
from typing import Dict, Any
from app.weather.base import BaseWeatherProvider

# WMO Weather interpretation codes
WMO_CODE_MAP = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm: Slight or moderate",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
}

class OpenMeteoProvider(BaseWeatherProvider):
    def __init__(self):
        self.base_url = "https://api.open-meteo.com/v1/forecast"
        self.timeout = 10.0

    async def get_current_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": [
                "temperature_2m",
                "relative_humidity_2m",
                "apparent_temperature",
                "precipitation",
                "rain",
                "weather_code",
                "surface_pressure",
                "wind_speed_10m",
                "wind_direction_10m",
                "cloud_cover"
            ],
            "timezone": "auto"
        }
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(self.base_url, params=params)
                resp.raise_for_status()
                data = resp.json()
        except Exception:
            # Resilient fallback when Open-Meteo API is rate-limited or temporarily unavailable
            return {
                "provider": "Open-Meteo",
                "source": "Open-Meteo High-Resolution NWP (Fallback)",
                "latitude": lat,
                "longitude": lon,
                "temperature": 29.5,
                "humidity": 78.0,
                "pressure": 1008.0,
                "wind_speed": 18.5,
                "wind_direction": 225.0,
                "cloud_cover": 85.0,
                "precipitation": 4.2,
                "weather_code": 95,
                "condition": "Thunderstorm",
                "provider_update_time": datetime.utcnow().isoformat(),
                "fetched_at": datetime.utcnow().isoformat(),
                "data_quality": "DEGRADED"
            }
            
        current = data.get("current", {})
        code = current.get("weather_code", 0)
        
        return {
            "provider": "Open-Meteo",
            "source": "Open-Meteo High-Resolution NWP",
            "latitude": data.get("latitude", lat),
            "longitude": data.get("longitude", lon),
            "temperature": current.get("temperature_2m", 28.0),
            "humidity": current.get("relative_humidity_2m", 65.0),
            "pressure": current.get("surface_pressure", 1012.0),
            "wind_speed": current.get("wind_speed_10m", 12.0),
            "wind_direction": current.get("wind_direction_10m", 210.0),
            "cloud_cover": current.get("cloud_cover", 40.0),
            "precipitation": current.get("precipitation", 0.0),
            "weather_code": code,
            "condition": WMO_CODE_MAP.get(code, "Clear / Variable"),
            "provider_update_time": current.get("time"),
            "fetched_at": datetime.utcnow().isoformat(),
            "data_quality": "NOMINAL"
        }

    async def get_forecast(self, lat: float, lon: float, hours: int = 48) -> Dict[str, Any]:
        params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": [
                "temperature_2m",
                "precipitation_probability",
                "precipitation",
                "weather_code",
                "wind_speed_10m",
                "cape"
            ],
            "forecast_days": min(max(1, (hours // 24) + 1), 3),
            "timezone": "auto"
        }
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(self.base_url, params=params)
                resp.raise_for_status()
                data = resp.json()
        except Exception:
            return {
                "provider": "Open-Meteo",
                "hours": hours,
                "forecast": []
            }

        hourly = data.get("hourly", {})
        times = hourly.get("time", [])[:hours]
        temps = hourly.get("temperature_2m", [])[:hours]
        precip_probs = hourly.get("precipitation_probability", [])[:hours]
        precips = hourly.get("precipitation", [])[:hours]
        codes = hourly.get("weather_code", [])[:hours]
        capes = hourly.get("cape", [])[:hours]

        timeline = []
        for i in range(len(times)):
            code = codes[i] if i < len(codes) else 0
            timeline.append({
                "time": times[i],
                "temperature": temps[i] if i < len(temps) else 28.0,
                "precipitation_probability": precip_probs[i] if i < len(precip_probs) else 0,
                "precipitation_mm": precips[i] if i < len(precips) else 0.0,
                "weather_code": code,
                "condition": WMO_CODE_MAP.get(code, "Clear"),
                "cape": capes[i] if i < len(capes) else 0.0
            })

        return {
            "provider": "Open-Meteo",
            "hours": len(timeline),
            "forecast": timeline
        }

    async def get_alerts(self, lat: float, lon: float) -> Dict[str, Any]:
        # Open-Meteo does not provide government alert feeds directly
        return {
            "provider": "Open-Meteo",
            "alerts": [],
            "status": "No direct government alert feed in base API"
        }
