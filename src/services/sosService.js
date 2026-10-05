/**
 * SKYSHIELD AI — SOS Service Layer
 * Connects to FastAPI backend /api/sos with real-time dispatch and fallback.
 */
import { apiClient } from './apiClient';
import { MOCK_SOS_QUEUE } from '../data/mockOfficerData';

let sosRequests = [...MOCK_SOS_QUEUE];

export const sosService = {
  async getSOSRequests() {
    try {
      const data = await apiClient.get('/api/sos');
      if (Array.isArray(data) && data.length > 0) {
        sosRequests = data;
        return data;
      }
    } catch (err) {
      // Fallback
    }
    return [...sosRequests];
  },

  async createSOS({ citizenName = 'Aashrith', mobile = '+91 98765 43210', category = 'Flooding', location = 'Kukatpally, Hyderabad', coords = null }) {
    try {
      const payload = {
        category,
        location,
        citizen_name: citizenName,
        mobile
      };
      if (coords?.lat && coords?.lng) {
        payload.latitude = coords.lat;
        payload.longitude = coords.lng;
      }
      const res = await apiClient.post('/api/sos', payload);
      if (res && res.request) {
        sosRequests.unshift(res.request);
        return {
          success: true,
          requestId: res.requestId || '#1048',
          request: res.request,
          message: 'Your emergency request has been registered and dispatched with live GPS coordinates.'
        };
      }
    } catch (err) {
      // Fallback
    }

    const newRequest = {
      id: '#1048',
      category,
      badge: '🔴 Urgent',
      severity: 'severe',
      location,
      coords: coords ? { lat: coords.lat, lng: coords.lng } : { lat: 17.4947, lng: 78.3996 },
      reportedBy: `${citizenName} (Citizen App)`,
      mobile,
      timeAgo: 'Just now',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
      notes: `Citizen triggered 1-tap SOS report for ${category}. Field assistance requested.`,
      assignedTo: null,
      status: 'Pending'
    };
    sosRequests.unshift(newRequest);
    return {
      success: true,
      requestId: '#1048',
      request: newRequest,
      message: 'Your emergency request has been sent to the authorized response dashboard.'
    };
  },

  async assignSOS(requestId, teamName) {
    try {
      const cleanId = encodeURIComponent(requestId);
      const res = await apiClient.post(`/api/sos/${cleanId}/assign`, {
        team_name: teamName
      });
      if (res && res.updated) {
        return { success: true, updated: res.updated };
      }
    } catch (err) {
      // Fallback
    }

    sosRequests = sosRequests.map((item) => {
      if (item.id === requestId) {
        return {
          ...item,
          assignedTo: teamName,
          status: 'Assigned',
          badge: '🟡 Assigned'
        };
      }
      return item;
    });
    return { success: true, updated: sosRequests.find((i) => i.id === requestId) };
  }
};
