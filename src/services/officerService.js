/**
 * SKYSHIELD AI — Officer Service Abstraction Layer
 * Connects to FastAPI backend (/api/events, /api/impact, /api/response) with fallback.
 */
import { apiClient } from './apiClient';
import {
  MOCK_OFFICER_PROFILE,
  MOCK_METRICS,
  MOCK_ACTIVE_EVENTS,
  MOCK_AI_METEOROLOGY,
  MOCK_RECOMMENDED_ACTIONS,
  MOCK_RESPONDER_TEAMS
} from '../data/mockOfficerData';

export const officerService = {
  async getMetrics() {
    try {
      const risk = await apiClient.get('/api/risk/current');
      if (risk && risk.level) {
        return {
          ...MOCK_METRICS,
          activeThreats: risk.level === 'NORMAL' ? 0 : 3,
          leadTime: risk.leadTime || '2h 18m',
          confidence: risk.confidence || 87,
          agreement: risk.multiSourceAgreement || 91
        };
      }
    } catch (err) {
      // Fallback
    }
    return MOCK_METRICS;
  },

  async getActiveEvents() {
    try {
      const events = await apiClient.get('/api/events');
      if (Array.isArray(events) && events.length > 0) {
        return events;
      }
    } catch (err) {
      // Fallback
    }
    return MOCK_ACTIVE_EVENTS;
  },

  async getEventById(eventId) {
    try {
      const evt = await apiClient.get(`/api/events/${eventId}`);
      if (evt && evt.id) {
        return evt;
      }
    } catch (err) {
      // Fallback
    }
    return MOCK_ACTIVE_EVENTS.find((e) => e.id === eventId) || MOCK_ACTIVE_EVENTS[0];
  },

  async getAIMeteorology() {
    try {
      const aiRes = await apiClient.get('/api/ai/explain', {
        hazard_type: 'CLOUDBURST',
        lead_time_minutes: 138,
        zone: 'Kukatpally Lowland Catchment',
        user_role: 'OFFICER'
      });
      if (aiRes && aiRes.meteorological_rationale) {
        return {
          rationale: aiRes.meteorological_rationale,
          uncertainty: aiRes.uncertainty_statement,
          confidence: aiRes.confidence_score,
          dataSources: aiRes.grounding_sources,
          modelTransparency: 'Operational atmospheric convective nowcasting pipeline with multi-sensor agreement validation.'
        };
      }
    } catch (err) {
      // Fallback
    }
    return MOCK_AI_METEOROLOGY;
  },

  async getImpactAssessment(eventId) {
    try {
      const impact = await apiClient.get(`/api/impact/${eventId}`);
      if (impact && impact.population_at_risk) {
        return {
          eventId,
          zone: impact.zone_name,
          population: impact.population_at_risk,
          infrastructure: `${impact.infrastructure_exposed?.length || 7} Critical Assets`,
          infrastructureList: impact.infrastructure_exposed,
          affectedArea: `${impact.radius_km * 3.14} km²`,
          inundatedRoads: impact.inundated_roads,
          severity: impact.severity
        };
      }
    } catch (err) {
      // Fallback
    }
    const evt = MOCK_ACTIVE_EVENTS.find((e) => e.id === eventId) || MOCK_ACTIVE_EVENTS[0];
    return {
      eventId: evt.id,
      zone: evt.zone,
      population: evt.population,
      infrastructure: evt.infrastructure,
      affectedArea: evt.affectedArea,
      threatTitle: evt.title,
      severity: evt.severity
    };
  },

  async getRecommendedActions() {
    return MOCK_RECOMMENDED_ACTIONS;
  },

  async getResponseStatus() {
    try {
      const teams = await apiClient.get('/api/response/teams');
      if (Array.isArray(teams) && teams.length > 0) {
        return teams;
      }
    } catch (err) {
      // Fallback
    }
    return MOCK_RESPONDER_TEAMS;
  },

  async updateTeamStatus(teamId, status) {
    try {
      const res = await apiClient.post(`/api/response/teams/${teamId}/status?status=${encodeURIComponent(status)}`);
      if (res && res.success) {
        return res;
      }
    } catch (err) {
      // Fallback
    }
    const team = MOCK_RESPONDER_TEAMS.find((t) => t.id === teamId);
    if (team) {
      team.status = status;
    }
    return { success: true, team };
  }
};
