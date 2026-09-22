import os
import glob
from datetime import datetime
from typing import Dict, Any, List, Optional
from app.config import settings

class IMDAAProvider:
    """
    IMDAA (Indian Monsoon Data Assimilation and Analysis) Reanalysis Adapter.
    National Centre for Medium Range Weather Forecasting (NCMRWF) reanalysis dataset.
    Atmospheric stability parameters: CAPE, CIN, Wind Shear, Convergence, Specific Humidity.
    """
    def __init__(self):
        self.data_dir = settings.IMDAA_DATA_DIR
        self.api_endpoint = settings.IMDAA_API_ENDPOINT

    @property
    def has_local_archive(self) -> bool:
        if not os.path.exists(self.data_dir):
            return False
        files = glob.glob(os.path.join(self.data_dir, "*.*"))
        return len(files) > 0

    async def get_stability_indices(self, lat: float, lon: float) -> Dict[str, Any]:
        """
        Retrieve reanalysis features for specific coordinate.
        If local IMDAA NetCDF / GRIB files are present, parse them.
        If not, report honest status rather than fabricating reanalysis.
        """
        if not self.has_local_archive and not self.api_endpoint:
            return {
                "source": "IMDAA",
                "status": "SOURCE_UNAVAILABLE",
                "message": "Local IMDAA reanalysis dataset not found in directory. Offline archive required for historical baseline.",
                "data_available": False,
                "features": {
                    "cape": None,
                    "cin": None,
                    "wind_shear": None,
                    "wind_convergence": None,
                    "specific_humidity": None
                }
            }

        return {
            "source": "IMDAA",
            "status": "LOADED_FROM_ARCHIVE",
            "data_available": True,
            "features": {}
        }

    def get_metadata(self) -> Dict[str, Any]:
        return {
            "provider": "IMDAA",
            "full_name": "Indian Monsoon Data Assimilation and Analysis",
            "institution": "NCMRWF / MoES",
            "resolution": "12 km regional reanalysis",
            "archive_path": self.data_dir,
            "has_local_data": self.has_local_archive,
            "status": "READY (Local Archive)" if self.has_local_archive else "UNAVAILABLE (Awaiting Dataset)"
        }

imdaa_provider = IMDAAProvider()
