import React, { createContext, useContext, useState, useEffect } from 'react';
import { WEATHER_STATES } from '../data/mockWeatherData';
import { DEFAULT_CITIZEN } from '../data/mockCitizenData';
import { MOCK_OFFICER_PROFILE, MOCK_SOS_QUEUE, MOCK_ACTIVE_EVENTS } from '../data/mockOfficerData';
import { MOCK_ALERTS } from '../data/mockAlerts';
import { MOCK_SHELTERS } from '../data/mockShelters';
import { apiClient } from '../services/apiClient';
import { sosService } from '../services/sosService';
import { alertService } from '../services/alertService';

const DemoContext = createContext();

export function DemoProvider({ children }) {
  // Demo weather states: 'NORMAL' | 'WARNING' | 'SEVERE'
  const [demoState, setDemoState] = useState('SEVERE');
  
  // Active navigation view
  const [currentView, setCurrentView] = useState('landing');
  
  // Citizen state
  const [citizenUser, setCitizenUser] = useState(DEFAULT_CITIZEN);
  const [selectedLocation, setSelectedLocation] = useState('Medchal, Telangana, India');
  const [selectedCoords, setSelectedCoords] = useState({ lat: 17.6297, lng: 78.4814 });
  const [activeTab, setActiveTab] = useState('home'); // Citizen bottom tabs: 'home' | 'map' | 'alerts' | 'sos'
  
  // Officer state
  const [officerUser, setOfficerUser] = useState(MOCK_OFFICER_PROFILE);
  const [selectedEventId, setSelectedEventId] = useState('evt-cloudburst-01');
  const [officerSidebarActive, setOfficerSidebarActive] = useState('dashboard');
  
  // Live alerts & SOS queues
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [sosList, setSosList] = useState(MOCK_SOS_QUEUE);
  const [selectedShelter, setSelectedShelter] = useState(MOCK_SHELTERS[0]);
  
  // Officer Alert Approval state
  const [alertApprovalState, setAlertApprovalState] = useState('PENDING'); // 'PENDING' | 'APPROVED' | 'DISMISSED'
  const [lastSosSentId, setLastSosSentId] = useState('#1048');

  // Active weather data mapped to demo state
  const activeWeatherData = WEATHER_STATES[demoState] || WEATHER_STATES.SEVERE;

  // 1. Synchronize initial state from backend on mount
  useEffect(() => {
    async function initBackendState() {
      try {
        const stateRes = await apiClient.get('/api/demo/state');
        if (stateRes && stateRes.state) {
          setDemoState(stateRes.state);
        }
        const alertsRes = await alertService.getAlerts();
        if (alertsRes && alertsRes.length > 0) {
          setAlerts(alertsRes);
        }
        const sosRes = await sosService.getSOSRequests();
        if (sosRes && sosRes.length > 0) {
          setSosList(sosRes);
        }
      } catch (err) {
        // Running in standalone frontend mode
      }
    }
    initBackendState();
  }, []);

  // 2. Real-Time WebSocket Connection for Live Updates
  useEffect(() => {
    let ws = null;
    let reconnectTimeout = null;

    function connectWebSocket() {
      try {
        const wsUrl = 'ws://localhost:8000/ws/officer';
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('[SkyShield WS] Connected to real-time event bus.');
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.event === 'DEMO_STATE_CHANGED' && msg.data?.state) {
              setDemoState(msg.data.state);
            } else if (msg.event === 'NEW_ALERT' || msg.event === 'ALERT_UPDATED') {
              setAlerts((prev) => {
                const updated = msg.data;
                const idx = prev.findIndex((a) => (a.alertId === updated.alertId || a.id === updated.id));
                if (idx >= 0) {
                  const copy = [...prev];
                  copy[idx] = { ...copy[idx], ...updated };
                  return copy;
                }
                return [updated, ...prev];
              });
            } else if (msg.event === 'SOS_CREATED') {
              const newReq = msg.data;
              setSosList((prev) => {
                if (prev.some((s) => s.id === newReq.id)) return prev;
                return [newReq, ...prev];
              });
            } else if (msg.event === 'SOS_ASSIGNED') {
              const { sosId, team } = msg.data;
              setSosList((prev) =>
                prev.map((item) =>
                  item.id === sosId
                    ? { ...item, assignedTo: team, status: 'Assigned', badge: '🟡 Assigned' }
                    : item
                )
              );
            }
          } catch (e) {
            console.warn('[SkyShield WS] Message parse error:', e);
          }
        };

        ws.onclose = () => {
          reconnectTimeout = setTimeout(connectWebSocket, 4000);
        };

        ws.onerror = () => {
          ws?.close();
        };
      } catch (e) {
        // Fallback
      }
    }

    connectWebSocket();

    return () => {
      clearTimeout(reconnectTimeout);
      if (ws) ws.close();
    };
  }, []);

  // Function to switch demo state cleanly (notifies backend + WebSocket)
  const switchDemoState = async (newState) => {
    setDemoState(newState);
    try {
      await apiClient.post('/api/demo/state', { state: newState });
    } catch (err) {
      // Offline fallback
    }
  };

  // Quick navigation helper
  const navigateTo = (view, extraParams = {}) => {
    if (extraParams.tab) setActiveTab(extraParams.tab);
    if (extraParams.shelter) setSelectedShelter(extraParams.shelter);
    if (extraParams.eventId) setSelectedEventId(extraParams.eventId);
    if (extraParams.officerTab) setOfficerSidebarActive(extraParams.officerTab);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add SOS
  const addSOS = async (category, note) => {
    const newId = `#1048`;
    setLastSosSentId(newId);

    // Call real backend API
    try {
      const res = await sosService.createSOS({
        citizenName: citizenUser.name,
        mobile: citizenUser.mobile,
        category,
        location: selectedLocation
      });
      if (res && res.request) {
        setSosList((prev) => [res.request, ...prev]);
        return res.requestId || newId;
      }
    } catch (err) {
      // Fallback
    }

    const newReq = {
      id: newId,
      category,
      badge: '🔴 Urgent',
      severity: 'severe',
      location: selectedLocation,
      coords: { lat: 17.4947, lng: 78.3996 },
      reportedBy: `${citizenUser.name} (Citizen App)`,
      mobile: citizenUser.mobile,
      timeAgo: 'Just now',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
      notes: note || `Citizen reported ${category} in ${selectedLocation}`,
      assignedTo: null,
      status: 'Pending'
    };
    setSosList([newReq, ...sosList]);
    return newId;
  };

  // Assign responder team
  const assignTeam = async (sosId, teamName) => {
    setSosList((prev) =>
      prev.map((item) =>
        item.id === sosId
          ? { ...item, assignedTo: teamName, status: 'Assigned', badge: '🟡 Assigned' }
          : item
      )
    );

    try {
      await sosService.assignSOS(sosId, teamName);
    } catch (err) {
      // Fallback
    }
  };

  return (
    <DemoContext.Provider
      value={{
        demoState,
        switchDemoState,
        activeWeatherData,
        currentView,
        navigateTo,
        citizenUser,
        setCitizenUser,
        selectedLocation,
        setSelectedLocation,
        selectedCoords,
        setSelectedCoords,
        activeTab,
        setActiveTab,
        officerUser,
        selectedEventId,
        setSelectedEventId,
        officerSidebarActive,
        setOfficerSidebarActive,
        alerts,
        sosList,
        selectedShelter,
        setSelectedShelter,
        alertApprovalState,
        setAlertApprovalState,
        lastSosSentId,
        addSOS,
        assignTeam
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
