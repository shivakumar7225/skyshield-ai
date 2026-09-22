from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class BaseWeatherProvider(ABC):
    @abstractmethod
    async def get_current_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        """Fetch current weather observation for given coordinates."""
        pass

    @abstractmethod
    async def get_forecast(self, lat: float, lon: float, hours: int = 48) -> Dict[str, Any]:
        """Fetch hourly weather forecast for given coordinates."""
        pass

    @abstractmethod
    async def get_alerts(self, lat: float, lon: float) -> Dict[str, Any]:
        """Fetch official government weather bulletins or alerts if supported by provider."""
        pass
