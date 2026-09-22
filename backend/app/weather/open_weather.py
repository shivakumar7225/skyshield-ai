import httpx
from datetime import datetime
from typing import Dict, Any
from app.weather.base import BaseWeatherProvider
from app.config import settings

class OpenWeatherProvider(BaseWeatherProvider):
    def __init__(self):
        self.api_key = settings.OPENWEATHER_API_KEY
        self.base_url = "https://api.openweathermap.org/data/2.5"
        self.timeout = 10.0

    @property
    def is_configured(self) -> bool:
        return bool(self.api_key and self.api_key.strip())

    async def get_current_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        if not self.is_configured:
            return {
                "provider": "OpenWeather",
                "status": "UNAVAILABLE",
                "error": "OPENWEATHER_API_KEY is not configured",
                "is_configured": False
            }

        url = f"{self.base_url}/weather"
        params = {
            "lat": lat,
            "lon": lon,
            "appid": self.api_key,
            "units": "metric"
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()

        main = data.get("main", {})
        wind = data.get("wind", {})
        weather_list = data.get("weather", [{}])
        cond = weather_list[0] if weather_list else {}

        return {
            "provider": "OpenWeather",
            "source": "OpenWeather API (Live)",
            "latitude": lat,
            "longitude": lon,
            "temperature": main.get("temp", 0.0),
            "humidity": main.get("humidity", 0.0),
            "pressure": main.get("pressure", 1013.0),
            "wind_speed": wind.get("speed", 0.0),
            "wind_direction": wind.get("deg", 0.0),
            "cloud_cover": data.get("clouds", {}).get("all", 0.0),
            "precipitation": data.get("rain", {}).get("1h", 0.0),
            "condition": cond.get("main", "Unknown"),
            "condition_description": cond.get("description", ""),
            "provider_update_time": datetime.fromtimestamp(data.get("dt", 0)).isoformat(),
            "fetched_at": datetime.utcnow().isoformat(),
            "data_quality": "NOMINAL"
        }

    async def get_forecast(self, lat: float, lon: float, hours: int = 48) -> Dict[str, Any]:
        if not self.is_configured:
            return {
                "provider": "OpenWeather",
                "status": "UNAVAILABLE",
                "error": "OPENWEATHER_API_KEY is not configured",
                "forecast": []
            }

        url = f"{self.base_url}/forecast"
        params = {
            "lat": lat,
            "lon": lon,
            "appid": self.api_key,
            "units": "metric"
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()

        items = data.get("list", [])
        return {
            "provider": "OpenWeather",
            "hours": len(items),
            "forecast": items
        }

    async def get_alerts(self, lat: float, lon: float) -> Dict[str, Any]:
        return {
            "provider": "OpenWeather",
            "alerts": [],
            "status": "Available in OneCall API (if configured)"
        }
