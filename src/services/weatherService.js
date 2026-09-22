/**
 * SKYSHIELD AI — Weather & Risk Service Layer
 * Connects to FastAPI backend (/api/weather, /api/risk, /api/events) with automatic offline fallback.
 */
import { apiClient } from './apiClient';
import { WEATHER_STATES, MOCK_GIS_DATA } from '../data/mockWeatherData';

export const weatherService = {
  /**
   * Get current hyper-local weather risk for given location and active simulation state
   */
  async getCurrentRisk(location = 'Medchal, Telangana, India', stateKey = 'SEVERE') {
    try {
      const data = await apiClient.get('/api/risk/current', { location });
      if (data && data.risks) {
        return data;
      }
    } catch (err) {
      // Offline fallback
    }

    const state = WEATHER_STATES[stateKey] || WEATHER_STATES.SEVERE;
    const locShort = location ? location.split(',')[0].trim() : 'your area';
    return {
      location,
      stateKey: state.id,
      statusBadge: state.badge,
      level: state.level,
      color: state.color,
      description: state.description.replace(/Kukatpally/gi, locShort),
      summary: state.detailedSummary.replace(/Kukatpally/gi, locShort),
      leadTime: state.leadTime,
      window: state.window,
      risks: state.risks,
      confidence: state.confidence || 87,
      multiSourceAgreement: state.multiSourceAgreement || 91,
      data_sources: ['Open-Meteo NWP', 'DEM-SRTM', 'QPE-Radar'],
      mode: 'DEMO',
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  },

  /**
   * Get GIS risk map layers, boundaries and zones
   */
  async getRiskMap(location = 'Medchal, Telangana, India', coords = null, stateKey = 'SEVERE') {
    try {
      const params = { location };
      if (coords?.lat) params.lat = coords.lat;
      if (coords?.lng) params.lon = coords.lng;
      const data = await apiClient.get('/api/risk/map', params);
      if (data && data.zones) {
        return data;
      }
    } catch (err) {
      // Fallback
    }

    const state = WEATHER_STATES[stateKey] || WEATHER_STATES.SEVERE;
    const locShort = location ? location.split(',')[0].trim() : 'Local';
    return {
      center: coords ? { lat: coords.lat, lng: coords.lng, name: location } : MOCK_GIS_DATA.center,
      zones: MOCK_GIS_DATA.zones.map((z) => {
        let updated = { ...z, name: z.name.replace(/Kukatpally/gi, locShort) };
        if (stateKey === 'NORMAL') {
          return { ...updated, riskLevel: 'low', color: '#10B981' };
        }
        if (stateKey === 'WARNING' && z.id === 'za') {
          return { ...updated, riskLevel: 'high', color: '#F97316' };
        }
        return updated;
      }),
      criticalRoads: MOCK_GIS_DATA.criticalRoads.map((r) => ({
        ...r,
        name: r.name.replace(/Kukatpally/gi, locShort)
      })),
      drainageBasins: MOCK_GIS_DATA.drainageBasins.map((d) => ({
        ...d,
        name: d.name.replace(/Kukatpally/gi, locShort)
      }))
    };
  },

  /**
   * Get 6-hour nowcast timeline
   */
  async getForecast(location = 'Medchal, Telangana, India', stateKey = 'SEVERE') {
    try {
      const timeline = await apiClient.get('/api/risk/timeline', { location });
      if (timeline && timeline.NOW) {
        return timeline;
      }
    } catch (err) {
      // Fallback
    }
    const state = WEATHER_STATES[stateKey] || WEATHER_STATES.SEVERE;
    return state.timeline;
  },

  /**
   * Get specific severe event details
   */
  async getEventDetails(eventId = 'evt-cloudburst-01') {
    try {
      const evt = await apiClient.get(`/api/events/${eventId}`);
      if (evt && evt.id) {
        return evt;
      }
    } catch (err) {
      // Fallback
    }

    return {
      id: eventId,
      title: 'Cloudburst Nowcast Cell Alpha',
      probability: 87,
      severity: 'HIGH',
      leadTime: '2h 18m',
      expectedWindow: '4:00 PM – 6:00 PM',
      affectedArea: '14.2 km²',
      population: 38420,
      confidence: 87,
      multiSourceAgreement: 91
    };
  }
};
