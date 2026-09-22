/**
 * SKYSHIELD AI — Shelter Service Layer
 * Connects to FastAPI backend /api/shelters with offline fallback.
 */
import { apiClient } from './apiClient';
import { MOCK_SHELTERS } from '../data/mockShelters';

export const shelterService = {
  async getNearbyShelters(location = 'Kukatpally, Hyderabad') {
    try {
      const data = await apiClient.get('/api/shelters/nearby');
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (err) {
      // Fallback
    }
    return MOCK_SHELTERS;
  },

  async getShelterRoute(shelterId, originLat = 17.4947, originLon = 78.3996) {
    try {
      const data = await apiClient.get('/api/shelters/route', {
        shelter_id: shelterId,
        origin_lat: originLat,
        origin_lon: originLon
      });
      if (data && data.steps) {
        return data;
      }
    } catch (err) {
      // Fallback
    }
    return null;
  },

  async getShelterById(shelterId) {
    const list = await this.getNearbyShelters();
    return list.find((s) => s.id === shelterId) || list[0];
  }
};
