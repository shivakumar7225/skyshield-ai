import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import {
  User,
  Shield,
  Activity,
  AlertTriangle,
  Flame,
  CloudRain,
  Waves,
  Zap,
  Clock,
  ArrowRight,
  Info,
  MapPin,
  ChevronRight,
  Compass,
  Building2,
  BellRing,
  BookOpen,
  Sparkles
} from 'lucide-react';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import { weatherService } from '../../services/weatherService';

export default function CitizenHome() {
  const {
    citizenUser,
    selectedLocation,
    activeWeatherData,
    demoState,
    navigateTo,
    activeTab,
    setActiveTab
  } = useDemo();

  // Interactive 7-point Timeline: -6h, -4h, -2h, NOW, +2h, +4h, +6h
  const [selectedTimeKey, setSelectedTimeKey] = useState('NOW');
  const [liveRisk, setLiveRisk] = useState(null);
  const [liveTimeline, setLiveTimeline] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchLiveWeather() {
      try {
        const [riskRes, timelineRes] = await Promise.all([
          weatherService.getCurrentRisk(selectedLocation, demoState),
          weatherService.getForecast(selectedLocation, demoState)
        ]);
        if (mounted) {
          if (riskRes) setLiveRisk(riskRes);
          if (timelineRes) setLiveTimeline(timelineRes);
        }
      } catch (err) {
        console.warn('Backend live risk fetch error:', err);
      }
    }
    fetchLiveWeather();
    return () => { mounted = false; };
  }, [selectedLocation, demoState]);

  const isSevere = demoState === 'SEVERE';
  const isWarning = demoState === 'WARNING';
  const primaryLocName = selectedLocation ? selectedLocation.split(',')[0].trim() : 'your area';

  // Time-specific weather nowcast simulation dataset
  const timePredictionData = {
    '-6h': {
      type: 'PAST',
      typeLabel: '⏪ PAST OBSERVATION (-6h)',
      timeLabel: '6 Hours Ago',
      timestamp: '09:30 IST',
      title: 'STABLE ATMOSPHERIC LAYER',
      badgeClass: 'badge-low',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeColor: '#10B981',
      cardClass: 'alert-card-normal',
      statusDesc: 'Atmospheric moisture was nominal. Convective inhibition was high with normal radar reflectivity < 15 dBZ.',
      leadTime: 'Historical Archive',
      risks: { thunderstorm: 12, cloudburst: 4, flashFlood: 2 },
      actionBtnText: null,
      actionView: null
    },
    '-4h': {
      type: 'PAST',
      typeLabel: '⏪ PAST OBSERVATION (-4h)',
      timeLabel: '4 Hours Ago',
      timestamp: '11:30 IST',
      title: 'MOISTURE INFLOW INITIATION',
      badgeClass: 'badge-low',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeColor: '#10B981',
      cardClass: 'alert-card-normal',
      statusDesc: 'Early moisture convergence detected from regional catchment. Radar echo increased to 28 dBZ over North-West quadrant.',
      leadTime: 'Historical Archive',
      risks: { thunderstorm: 28, cloudburst: 14, flashFlood: 6 },
      actionBtnText: null,
      actionView: null
    },
    '-2h': {
      type: 'PAST',
      typeLabel: '⏪ PAST OBSERVATION (-2h)',
      timeLabel: '2 Hours Ago',
      timestamp: '13:30 IST',
      title: 'RAPID CONVECTIVE CHARGE',
      badgeClass: isSevere ? 'badge-high' : 'badge-mod',
      badgeBg: 'rgba(249, 115, 22, 0.2)',
      badgeColor: '#F97316',
      cardClass: isSevere ? 'alert-card-warning' : 'alert-card-normal',
      statusDesc: `Cloud top temperature dropped rapidly to -58°C. Squall line began organizing 35km upwind of ${primaryLocName}.`,
      leadTime: 'Pre-Onset Detection',
      risks: {
        thunderstorm: isSevere ? 65 : 38,
        cloudburst: isSevere ? 58 : 22,
        flashFlood: isSevere ? 42 : 15
      },
      actionBtnText: null,
      actionView: null
    },
    'NOW': {
      type: 'LIVE',
      typeLabel: '🔴 LIVE REAL-TIME',
      timeLabel: 'Current Live Status',
      timestamp: 'Live Now',
      title: isSevere
        ? 'SEVERE CLOUDBURST ALERT'
        : isWarning
        ? 'WEATHER WATCH: RAINSTORM'
        : 'CONDITIONS NORMAL • SAFE',
      badgeClass: isSevere ? 'badge-severe' : isWarning ? 'badge-high' : 'badge-low',
      badgeBg: isSevere ? 'rgba(239, 68, 68, 0.2)' : isWarning ? 'rgba(249, 115, 22, 0.2)' : 'rgba(16, 185, 129, 0.15)',
      badgeColor: isSevere ? '#EF4444' : isWarning ? '#F97316' : '#10B981',
      cardClass: isSevere ? 'alert-card-severe' : isWarning ? 'alert-card-warning' : 'alert-card-normal',
      statusDesc: isSevere
        ? `Extreme convective cloud cell approaching ${primaryLocName}. Move to higher ground or nearest shelter immediately.`
        : isWarning
        ? `Moderate-to-heavy showers with lightning expected in ${primaryLocName} within 3–4 hours.`
        : `No severe weather or flash flood threats detected for ${primaryLocName}.`,
      leadTime: isSevere ? 'Lead time: ~2h 18m' : isWarning ? 'Window: Next 3–4 Hours' : 'Forecast: Clear / Safe',
      risks: activeWeatherData.risks,
      actionBtnText: isSevere ? 'View Safe Shelters & Evacuation Route' : isWarning ? 'Check Nearby Shelters' : null,
      actionView: isSevere ? 'citizen-warning' : isWarning ? 'citizen-shelter' : null
    },
    '+2h': {
      type: 'FUTURE',
      typeLabel: '🔮 AI NOWCAST PREDICTION (+2h)',
      timeLabel: 'In 2 Hours',
      timestamp: '17:30 IST',
      title: isSevere ? 'PEAK CLOUDBURST IMPACT' : isWarning ? 'ACTIVE RAINSTORM & GUSTS' : 'FAIR WEATHER',
      badgeClass: isSevere ? 'badge-severe' : isWarning ? 'badge-high' : 'badge-low',
      badgeBg: isSevere ? 'rgba(239, 68, 68, 0.25)' : isWarning ? 'rgba(249, 115, 22, 0.2)' : 'rgba(16, 185, 129, 0.15)',
      badgeColor: isSevere ? '#EF4444' : isWarning ? '#F97316' : '#10B981',
      cardClass: isSevere ? 'alert-card-severe' : isWarning ? 'alert-card-warning' : 'alert-card-normal',
      statusDesc: isSevere
        ? `Predicted apex downpour: 110–140 mm/hr. Severe waterlogging expected across arterial roads and low-lying underpasses in ${primaryLocName}.`
        : isWarning
        ? `Steady rainfall with localized surface ponding in ${primaryLocName}. Transit speed reduced by 30%.`
        : `Partly cloudy conditions with comfortable humidity levels across ${primaryLocName}.`,
      leadTime: 'Nowcast Horizon +2h',
      risks: {
        thunderstorm: isSevere ? 88 : isWarning ? 75 : 16,
        cloudburst: isSevere ? 92 : isWarning ? 72 : 8,
        flashFlood: isSevere ? 84 : isWarning ? 50 : 5
      },
      actionBtnText: isSevere ? 'View Evacuation Shelter Routes' : null,
      actionView: 'citizen-shelter'
    },
    '+4h': {
      type: 'FUTURE',
      typeLabel: '🔮 AI NOWCAST PREDICTION (+4h)',
      timeLabel: 'In 4 Hours',
      timestamp: '19:30 IST',
      title: isSevere ? 'RUNOFF & WATER RECEDING' : isWarning ? 'SHOWERS TAPERING OFF' : 'CLEAR EVENING',
      badgeClass: isSevere ? 'badge-high' : 'badge-low',
      badgeBg: isSevere ? 'rgba(249, 115, 22, 0.2)' : 'rgba(16, 185, 129, 0.15)',
      badgeColor: isSevere ? '#F97316' : '#10B981',
      cardClass: isSevere ? 'alert-card-warning' : 'alert-card-normal',
      statusDesc: isSevere
        ? `Convective storm front tracking past ${primaryLocName}. Flood runoff peaking in municipal drainage channels.`
        : isWarning
        ? `Light drizzle remaining in ${primaryLocName}; storm front dissipating.`
        : `Clear skies with calm night winds over ${primaryLocName}.`,
      leadTime: 'Nowcast Horizon +4h',
      risks: {
        thunderstorm: isSevere ? 62 : isWarning ? 35 : 10,
        cloudburst: isSevere ? 68 : isWarning ? 28 : 4,
        flashFlood: isSevere ? 72 : isWarning ? 32 : 3
      },
      actionBtnText: null,
      actionView: null
    },
    '+6h': {
      type: 'FUTURE',
      typeLabel: '🔮 AI NOWCAST PREDICTION (+6h)',
      timeLabel: 'In 6 Hours',
      timestamp: '21:30 IST',
      title: 'CONDITIONS NORMALIZING',
      badgeClass: 'badge-low',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeColor: '#10B981',
      cardClass: 'alert-card-normal',
      statusDesc: 'Atmospheric stability restored. Dewatering and municipal cleanup teams active in low basins.',
      leadTime: 'Nowcast Horizon +6h',
      risks: {
        thunderstorm: isSevere ? 24 : 14,
        cloudburst: isSevere ? 18 : 8,
        flashFlood: isSevere ? 35 : 6
      },
      actionBtnText: null,
      actionView: null
    }
  };

  const baseTimeData = timePredictionData[selectedTimeKey] || timePredictionData['NOW'];
  const backendPoint = liveTimeline ? liveTimeline[selectedTimeKey] : null;

  // Fail-safe sanitizer ensuring no stray legacy location text appears
  const sanitizeLocationText = (text) => {
    if (!text) return '';
    return text.replace(/\bKukatpally\b/gi, primaryLocName);
  };

  const rawDesc = backendPoint?.status_desc || baseTimeData.statusDesc;
  const activeStatusDesc = sanitizeLocationText(rawDesc);

  const activeTimeData = backendPoint ? {
    ...baseTimeData,
    risks: backendPoint.risks || baseTimeData.risks,
    title: backendPoint.title || baseTimeData.title,
    statusDesc: activeStatusDesc,
    leadTime: backendPoint.lead_time || baseTimeData.leadTime
  } : {
    ...baseTimeData,
    statusDesc: activeStatusDesc
  };

  return (
    <div className="citizen-mobile-viewport">
      {/* Top Header: Clean location bar & profile icon */}
      <header
        style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(11, 18, 32, 0.95)',
          position: 'sticky',
          top: '0',
          zIndex: 800,
          backdropFilter: 'blur(12px)'
        }}
      >
        {/* Location selector */}
        <button
          onClick={() => navigateTo('citizen-location')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'left',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
          title="Change Location"
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: '#38BDF8'
            }}
          >
            📍
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Current Location
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>{selectedLocation || 'Select Location'}</span>
              <span style={{ fontSize: '11px', color: '#38BDF8' }}>▾</span>
            </div>
          </div>
        </button>

        {/* Profile Avatar Button */}
        <button
          onClick={() => navigateTo('citizen-profile')}
          title="Open Profile"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1.5px solid rgba(56, 189, 248, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38BDF8',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <User size={18} />
        </button>
      </header>

      {/* Main Scrollable Content Area */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* 1. INTERACTIVE TIME PREDICTION SCRUBBER (-6h, -4h, -2h, NOW, +2h, +4h, +6h) */}
        <div className="glass-panel" style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Weather Prediction Timeline
            </span>
            <span style={{ fontSize: '10px', color: '#38BDF8', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {activeTimeData.typeLabel}
            </span>
          </div>

          {/* 7-Point Interactive Scrubber Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {[
              { key: '-6h', label: '-6h', sub: 'Past' },
              { key: '-4h', label: '-4h', sub: 'Past' },
              { key: '-2h', label: '-2h', sub: 'Past' },
              { key: 'NOW', label: 'NOW', sub: 'Live' },
              { key: '+2h', label: '+2h', sub: 'Pred' },
              { key: '+4h', label: '+4h', sub: 'Pred' },
              { key: '+6h', label: '+6h', sub: 'Pred' },
            ].map((btn) => {
              const isSelected = selectedTimeKey === btn.key;
              const isLive = btn.key === 'NOW';
              return (
                <button
                  key={btn.key}
                  onClick={() => setSelectedTimeKey(btn.key)}
                  style={{
                    padding: '7px 2px',
                    borderRadius: '7px',
                    textAlign: 'center',
                    background: isSelected
                      ? isLive
                        ? 'linear-gradient(135deg, #0284C7, #38BDF8)'
                        : 'rgba(56, 189, 248, 0.25)'
                      : 'rgba(15, 23, 42, 0.6)',
                    border: isSelected
                      ? '1px solid #38BDF8'
                      : '1px solid rgba(255,255,255,0.06)',
                    color: isSelected ? '#FFFFFF' : '#94A3B8',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: isSelected ? 800 : 700 }}>
                    {btn.label}
                  </div>
                  <div style={{ fontSize: '9px', opacity: 0.75, marginTop: '1px' }}>
                    {btn.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. PRIMARY HERO WEATHER STATUS CARD (Reflects Selected Time Offset) */}
        <div
          className={activeTimeData.cardClass}
          style={{
            borderRadius: '16px',
            padding: '18px 16px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Header Status Tag */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '999px',
                background: activeTimeData.badgeBg,
                color: activeTimeData.badgeColor,
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.04em'
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: activeTimeData.badgeColor
                }}
                className={activeTimeData.type === 'LIVE' && isSevere ? 'animate-pulse-dot' : ''}
              />
              {activeTimeData.title}
            </span>

            <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
              {activeTimeData.timestamp}
            </span>
          </div>

          {/* Core Condition Description */}
          <p style={{ color: '#F1F5F9', fontSize: '13px', lineHeight: 1.5, marginBottom: activeTimeData.actionBtnText ? '12px' : '4px', fontWeight: 500 }}>
            {activeTimeData.statusDesc}
          </p>

          {/* Action button if warning/severe */}
          {activeTimeData.actionBtnText && (
            <button
              onClick={() => navigateTo(activeTimeData.actionView)}
              className={isSevere ? 'btn-danger' : 'btn-primary'}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: 700,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>{activeTimeData.actionBtnText}</span>
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        {/* 3. THREE KEY RISK METRICS FOR SELECTED TIMEFRAME */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Threat Indices ({activeTimeData.timeLabel})
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {/* Lightning */}
            <div
              className="glass-panel"
              style={{
                padding: '12px 8px',
                textAlign: 'center',
                borderTop: `3px solid ${activeTimeData.risks.thunderstorm > 60 ? '#F97316' : '#10B981'}`
              }}
            >
              <div style={{ fontSize: '18px', marginBottom: '2px' }}>⚡</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>Lightning</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                <AnimatedCounter value={activeTimeData.risks.thunderstorm} suffix="%" />
              </div>
            </div>

            {/* Cloudburst */}
            <div
              className="glass-panel"
              style={{
                padding: '12px 8px',
                textAlign: 'center',
                borderTop: `3px solid ${activeTimeData.risks.cloudburst > 60 ? '#EF4444' : '#10B981'}`
              }}
            >
              <div style={{ fontSize: '18px', marginBottom: '2px' }}>⛈️</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>Cloudburst</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                <AnimatedCounter value={activeTimeData.risks.cloudburst} suffix="%" />
              </div>
            </div>

            {/* Flash Flood */}
            <div
              className="glass-panel"
              style={{
                padding: '12px 8px',
                textAlign: 'center',
                borderTop: `3px solid ${activeTimeData.risks.flashFlood > 60 ? '#EF4444' : '#10B981'}`
              }}
            >
              <div style={{ fontSize: '18px', marginBottom: '2px' }}>🌊</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>Inundation</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                <AnimatedCounter value={activeTimeData.risks.flashFlood} suffix="%" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. QUICK ACTION OPTIONS (PLACED ABOVE SOS AS REQUESTED) */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Quick Actions & Resources
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {/* Map Option */}
            <button
              onClick={() => {
                setActiveTab('map');
                navigateTo('citizen-map');
              }}
              className="glass-panel"
              style={{
                padding: '14px 12px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '1px solid rgba(56, 189, 248, 0.25)'
              }}
            >
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8' }}>
                🗺️
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>
                Risk Radar Map
              </div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                View 100m grid & danger hotspots
              </div>
            </button>

            {/* Shelters Option */}
            <button
              onClick={() => navigateTo('citizen-shelter')}
              className="glass-panel"
              style={{
                padding: '14px 12px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '1px solid rgba(16, 185, 129, 0.25)'
              }}
            >
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                🏫
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>
                Safe Shelters
              </div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                Find nearest relief locations & routes
              </div>
            </button>

            {/* Alerts Option */}
            <button
              onClick={() => {
                setActiveTab('alerts');
                navigateTo('citizen-alerts');
              }}
              className="glass-panel"
              style={{
                padding: '14px 12px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '1px solid rgba(249, 115, 22, 0.25)'
              }}
            >
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(249, 115, 22, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F97316' }}>
                🔔
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>
                Active Warnings
              </div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                Read official IMD & GHMC bulletins
              </div>
            </button>

            {/* Safety Guidelines */}
            <button
              onClick={() => navigateTo('citizen-warning')}
              className="glass-panel"
              style={{
                padding: '14px 12px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '1px solid rgba(139, 92, 246, 0.25)'
              }}
            >
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA' }}>
                📖
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>
                Safety Guidelines
              </div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                Evacuation steps & AI explanation
              </div>
            </button>
          </div>
        </div>

        {/* 5. EMERGENCY SOS TRIGGER (PLACED DOWN/BOTTOM AS REQUESTED) */}
        <div style={{ marginTop: '4px', paddingTop: '4px' }}>
          <button
            onClick={() => navigateTo('citizen-sos')}
            className="sos-button-hero"
            style={{ width: '100%' }}
          >
            <span>🚨</span>
            <span>EMERGENCY SOS</span>
          </button>
          <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '11px', color: '#94A3B8' }}>
            Tap in emergency to dispatch rescue teams to your coordinates.
          </div>
        </div>

      </div>

      {/* FIXED BOTTOM NAVIGATION (EXACTLY FOUR CLEAN ITEMS: 1. Home, 2. Map, 3. Alerts, 4. SOS) */}
      <nav className="citizen-bottom-nav">
        <button
          onClick={() => {
            setActiveTab('home');
            navigateTo('citizen-home');
          }}
          className={`citizen-nav-item ${activeTab === 'home' ? 'active' : ''}`}
        >
          <span style={{ fontSize: '18px' }}>🏠</span>
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('map');
            navigateTo('citizen-map');
          }}
          className={`citizen-nav-item ${activeTab === 'map' ? 'active' : ''}`}
        >
          <span style={{ fontSize: '18px' }}>🗺️</span>
          <span>Map</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('alerts');
            navigateTo('citizen-alerts');
          }}
          className={`citizen-nav-item ${activeTab === 'alerts' ? 'active' : ''}`}
        >
          <span style={{ fontSize: '18px' }}>🔔</span>
          <span>Alerts</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('sos');
            navigateTo('citizen-sos');
          }}
          className={`citizen-nav-item sos-item ${activeTab === 'sos' ? 'active' : ''}`}
        >
          <span style={{ fontSize: '18px' }}>🆘</span>
          <span>SOS</span>
        </button>
      </nav>
    </div>
  );
}

