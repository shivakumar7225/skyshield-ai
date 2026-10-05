/**
 * VARSHDRISHTI / SKYSHIELD AI — Location Search Service
 * Exclusively Indian location search, mandal/village resolution, and geocoding.
 */
import { apiClient } from './apiClient';
import { PRESET_LOCATIONS } from '../data/mockCitizenData';

export const isInsideIndia = (lat, lng) => {
  return lat >= 6.0 && lat <= 37.5 && lng >= 68.0 && lng <= 97.5;
};

export const locationService = {
  /**
   * Acquire live GPS position from the browser/device
   */
  async getCurrentPosition() {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by your browser.');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = Math.round(position.coords.accuracy || 15);
          resolve({ lat, lng, accuracy });
        },
        (error) => {
          let msg = 'Unable to retrieve your location.';
          if (error.code === 1) {
            msg = 'Location permission denied. Please allow location access in your browser settings.';
          } else if (error.code === 2) {
            msg = 'GPS signal unavailable or location acquisition timed out.';
          } else if (error.code === 3) {
            msg = 'Location request timed out. Please try again.';
          }
          reject(new Error(msg));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  },

  /**
   * Reverse geocode WGS84 coordinates to Indian village / mandal / city
   */
  async reverseGeocode(lat, lng) {
    if (!isInsideIndia(lat, lng)) {
      return {
        name: `Outside Republic of India (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`,
        latitude: lat,
        longitude: lng,
        place_type: 'Foreign Coordinates',
        isInsideIndia: false
      };
    }

    try {
      const data = await apiClient.get('/api/locations/reverse', { lat, lon: lng });
      if (data && data.name) {
        return {
          id: `gps-${lat.toFixed(4)}-${lng.toFixed(4)}`,
          name: data.name,
          city: data.city || data.mandal,
          mandal: data.mandal,
          district: data.district,
          state: data.state,
          pincode: data.pincode || 'N/A',
          latitude: lat,
          longitude: lng,
          elevation_m: data.elevation_m || 540,
          place_type: data.place_type || 'Live GPS Mandal',
          isInsideIndia: true,
          source: data.source || 'Live GPS'
        };
      }
    } catch (err) {
      // Fallback
    }

    return {
      id: `gps-${lat.toFixed(4)}-${lng.toFixed(4)}`,
      name: `Live GPS Location (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E), India`,
      latitude: lat,
      longitude: lng,
      pincode: 'N/A',
      elevation_m: 540,
      place_type: 'Live GPS Pinpoint',
      isInsideIndia: true,
      source: 'Device WGS84 Sensor'
    };
  },

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

