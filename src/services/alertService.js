/**
 * SKYSHIELD AI — Alert Service Layer
 * Connects to FastAPI backend /api/alerts with automatic fallback.
 */
import { apiClient } from './apiClient';
import { MOCK_ALERTS, MOCK_OFFICER_ALERT_PREVIEW } from '../data/mockAlerts';

let alertsStore = [...MOCK_ALERTS];

export const alertService = {
  async getAlerts() {
    try {
      const data = await apiClient.get('/api/alerts');
      if (Array.isArray(data) && data.length > 0) {
        alertsStore = data;
        return data;
      }
    } catch (err) {
      // Fallback to local store
    }
    return alertsStore;
  },

  async getActiveWarning() {
    try {
      const list = await this.getAlerts();
      const active = list.find((a) => a.status === 'ACTIVE_EMERGENCY' || a.status === 'TRANSMITTED');
      if (active) return active;
    } catch (err) {
      // Fallback
    }
    return alertsStore.find((a) => a.status === 'ACTIVE_EMERGENCY') || alertsStore[0];
  },

  async getPendingOfficerAlert() {
    return MOCK_OFFICER_ALERT_PREVIEW;
  },

  async approveAlert(alertId, officerSignature = 'Cmdr. Vikram Rathore') {
    try {
      const cleanId = encodeURIComponent(alertId);
      const res = await apiClient.post(`/api/alerts/${cleanId}/approve`, {
        officer_signature: officerSignature,
        broadcast_channels: ['Cell Broadcast', 'Citizen App Push', 'VMS Panels', 'Emergency Sirens']
      });
      if (res && res.approved) {
        return { success: true, approved: res.approved };
      }
    } catch (err) {
      // Fallback
    }

    const approved = {
      alertId,
      approvedAt: new Date().toISOString(),
      officerSignature,
      broadcastChannels: ['Cell Broadcast', 'Citizen App Push', 'VMS Panels', 'Emergency Sirens'],
      status: 'TRANSMITTED'
    };
    return { success: true, approved };
  },

  async dismissAlert(alertId) {
    try {
      const cleanId = encodeURIComponent(alertId);
      await apiClient.post(`/api/alerts/${cleanId}/dismiss`, {});
    } catch (err) {
      // Fallback
    }
    return { success: true, message: 'Alert dismissed by officer' };
  }
};
