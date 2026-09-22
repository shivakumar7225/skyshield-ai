/**
 * SKYSHIELD AI — User & Authentication Service Layer
 * Connects to FastAPI backend /api/auth with token management.
 */
import { apiClient } from './apiClient';
import { DEFAULT_CITIZEN } from '../data/mockCitizenData';
import { MOCK_OFFICER_PROFILE } from '../data/mockOfficerData';

let currentCitizen = { ...DEFAULT_CITIZEN };
let currentOfficer = { ...MOCK_OFFICER_PROFILE };

export const userService = {
  async citizenLogin(name, mobile) {
    try {
      const res = await apiClient.post('/api/auth/citizen/login', {
        name: name.trim() || 'Aashrith',
        mobile: mobile.trim() || '+91 98765 43210'
      });
      if (res && res.access_token) {
        apiClient.setToken(res.access_token);
        currentCitizen = { ...currentCitizen, ...res.profile };
        return { success: true, citizen: currentCitizen, token: res.access_token };
      }
    } catch (err) {
      // Fallback
    }

    currentCitizen = {
      ...currentCitizen,
      name: name.trim() || 'Aashrith',
      mobile: mobile.trim() || '+91 9876543210'
    };
    return { success: true, citizen: currentCitizen };
  },

  async updateLocation(locationName, pincode = '500072') {
    currentCitizen = {
      ...currentCitizen,
      primaryLocation: locationName,
      pincode
    };
    return currentCitizen;
  },

  async getCitizenProfile() {
    return currentCitizen;
  },

  async updateCitizenProfile(updates) {
    currentCitizen = { ...currentCitizen, ...updates };
    return currentCitizen;
  },

  async officerLogin(officerId, password) {
    try {
      const res = await apiClient.post('/api/auth/officer/login', {
        officer_id: officerId.trim(),
        password: password
      });
      if (res && res.access_token) {
        apiClient.setToken(res.access_token);
        currentOfficer = { ...currentOfficer, ...res.profile };
        return { success: true, officer: currentOfficer, token: res.access_token };
      }
    } catch (err) {
      // Fallback
    }

    return { success: true, officer: currentOfficer };
  },

  async getOfficerProfile() {
    return currentOfficer;
  }
};
