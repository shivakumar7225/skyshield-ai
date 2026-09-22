import time
from typing import Dict, Any, Optional
from datetime import datetime
from app.weather.open_meteo import OpenMeteoProvider
from app.weather.open_weather import OpenWeatherProvider
from app.config import settings

class WeatherService:
    def __init__(self):
        self.open_meteo = OpenMeteoProvider()
        self.open_weather = OpenWeatherProvider()
        self._cache: Dict[str, Dict[str, Any]] = {}
        self.cache_ttl = 300  # 5 minutes

    def _cache_key(self, prefix: str, lat: float, lon: float) -> str:
        return f"{prefix}:{round(lat, 3)}:{round(lon, 3)}"

    async def get_current(self, lat: float, lon: float, location_name: str = "") -> Dict[str, Any]:
        key = self._cache_key("curr", lat, lon)
        now = time.time()
        
        if key in self._cache:
            entry = self._cache[key]
            if now - entry["cached_at"] < self.cache_ttl:
                data = entry["data"].copy()
                data["from_cache"] = True
                if location_name:
                    data["location"] = location_name
                return data

        # Select provider
        if self.open_weather.is_configured:
            try:
                res = await self.open_weather.get_current_weather(lat, lon)
                if res.get("status") != "UNAVAILABLE":
                    res["location"] = location_name or f"Lat {round(lat, 3)}, Lon {round(lon, 3)}"
                    res["from_cache"] = False
                    self._cache[key] = {"cached_at": now, "data": res}
                    return res
            except Exception:
                pass  # Fallback to Open-Meteo

        # Default to Open-Meteo
        res = await self.open_meteo.get_current_weather(lat, lon)
        res["location"] = location_name or f"Lat {round(lat, 3)}, Lon {round(lon, 3)}"
        res["from_cache"] = False
        self._cache[key] = {"cached_at": now, "data": res}
        return res

    async def get_forecast(self, lat: float, lon: float, hours: int = 48) -> Dict[str, Any]:
        key = self._cache_key(f"fc_{hours}", lat, lon)
        now = time.time()
        
        if key in self._cache:
            entry = self._cache[key]
            if now - entry["cached_at"] < self.cache_ttl:
                return entry["data"]

        res = await self.open_meteo.get_forecast(lat, lon, hours=hours)
        self._cache[key] = {"cached_at": now, "data": res}
        return res

weather_service = WeatherService()
