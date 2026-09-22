/**
 * SKYSHIELD AI — Centralized Backend API Client
 * Connects React frontend to FastAPI backend with JWT headers & graceful fallback.
 */

const API_BASE = import.meta.env?.VITE_API_BASE_URL || '';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE;
    this.token = localStorage.getItem('skyshield_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('skyshield_token', token);
    } else {
      localStorage.removeItem('skyshield_token');
    }
  }

  async request(endpoint, options = {}) {
    // If baseUrl is empty, endpoint starts with /api
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || errData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      // If relative fetch failed, try direct localhost:8000
      if (!this.baseUrl && !url.startsWith('http')) {
        try {
          const directUrl = `http://localhost:8000${endpoint}`;
          const directResp = await fetch(directUrl, { ...options, headers });
          if (directResp.ok) {
            return await directResp.json();
          }
        } catch (e) {
          // Both failed
        }
      }
      console.warn(`[SkyShield ApiClient] ${options.method || 'GET'} ${endpoint} error:`, err.message);
      throw err;
    }
  }

  get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const fullEndpoint = query ? `${endpoint}?${query}` : endpoint;
    return this.request(fullEndpoint, { method: 'GET' });
  }

  post(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  patch(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  }
}

export const apiClient = new ApiClient();
