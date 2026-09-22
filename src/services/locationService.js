/**
 * VARSHDRISHTI / SKYSHIELD AI — Location Search Service
 * Exclusively Indian location search, mandal/village resolution, and geocoding.
 */
import { apiClient } from './apiClient';
import { PRESET_LOCATIONS } from '../data/mockCitizenData';

const isInsideIndia = (lat, lng) => {
  return lat >= 6.0 && lat <= 37.5 && lng >= 68.0 && lng <= 97.5;
};

export const locationService = {
  async search(query) {
    if (!query || query.trim().length < 2) {
      return this.getPresets();
    }

    try {
      const data = await apiClient.get('/api/locations/search', { q: query.trim() });
      if (Array.isArray(data) && data.length > 0) {
        return data
          .filter((item) => isInsideIndia(item.latitude, item.longitude))
          .map((item, idx) => ({
            id: `loc-${idx}`,
            name: item.name,
            pincode: item.pincode || 'N/A',
            latitude: item.latitude,
            longitude: item.longitude,
            elevation_m: item.elevation_m || 540,
            highRiskZone: item.high_risk_zone || false,
            place_type: item.place_type || (item.name.toLowerCase().includes('village') ? 'Village' : item.name.toLowerCase().includes('mandal') ? 'Mandal' : 'Town / City')
          }));
      }
    } catch (err) {
      // Fallback to Indian presets
    }

    return PRESET_LOCATIONS.filter((loc) =>
      isInsideIndia(loc.latitude, loc.longitude) && (
        loc.name.toLowerCase().includes(query.toLowerCase()) ||
        loc.pincode.includes(query)
      )
    );
  },

  getPresets() {
    return PRESET_LOCATIONS.filter((loc) => isInsideIndia(loc.latitude, loc.longitude));
  }
};

