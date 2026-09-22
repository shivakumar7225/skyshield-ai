import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { AlertCircle, Clock, ShieldAlert, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import SimulationBadge from '../../components/common/SimulationBadge';

export default function CitizenAlerts() {
  const { navigateTo, alerts, demoState, activeTab, setActiveTab, selectedLocation } = useDemo();
  const primaryLocName = selectedLocation ? selectedLocation.split(',')[0].trim() : 'your area';

  const isSevere = demoState === 'SEVERE';
  const isWarning = demoState === 'WARNING';

  return (
    <div className="citizen-mobile-viewport">
      {/* Top Header */}
      <div
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(11, 18, 32, 0.95)',
          position: 'sticky',
          top: '46px',
          zIndex: 800,
          backdropFilter: 'blur(12px)'
        }}
      >
        <h1 style={{ fontSize: '18px', color: '#F8FAFC', fontWeight: 700 }}>
          Alerts
        </h1>
        <SimulationBadge text="LIVE FEED" />
      </div>

      <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* ACTIVE WARNING SECTION */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#F87171', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
            Current Threat Broadcasts
          </div>

          {isSevere ? (
            <div
              className="alert-card-severe"
              style={{
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 0 24px rgba(239, 68, 68, 0.3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge badge-severe">
                  🔴 ACTIVE WARNING
                </span>
                <span style={{ fontSize: '11px', color: '#FCA5A5', fontWeight: 700 }}>
                  High confidence
                </span>
              </div>

              <h2 style={{ fontSize: '20px', color: '#FFFFFF', fontWeight: 800, marginBottom: '6px' }}>
                Cloudburst Risk
              </h2>

              <p style={{ fontSize: '13px', color: '#FECACA', marginBottom: '14px', lineHeight: 1.4 }}>
                Extreme localized precipitation cell approaching {primaryLocName} basin. Immediate low-lying drainage inundation expected.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#FCA5A5', marginBottom: '16px' }}>
                <Clock size={14} />
                <span style={{ fontWeight: 700 }}>Expected in 2h 18m</span>
              </div>

              <button
                onClick={() => navigateTo('citizen-warning')}
                className="btn-danger"
                style={{ width: '100%', padding: '12px', fontSize: '14px' }}
              >
                VIEW WARNING →
              </button>
            </div>
          ) : isWarning ? (
            <div
              className="alert-card-warning"
              style={{
                borderRadius: '16px',
                padding: '18px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge badge-high">
                  🟠 ACTIVE WATCH
                </span>
                <span style={{ fontSize: '11px', color: '#FDE68A', fontWeight: 700 }}>
                  Confidence: 78%
                </span>
              </div>

              <h2 style={{ fontSize: '18px', color: '#FFFFFF', fontWeight: 800, marginBottom: '6px' }}>
                Severe Thunderstorm & Squall Watch
              </h2>

              <p style={{ fontSize: '13px', color: '#FEF3C7', marginBottom: '14px', lineHeight: 1.4 }}>
                Squall line organizing rapidly. Gusty winds and intense precipitation expected in 3h 30m.
              </p>

              <button
                onClick={() => navigateTo('citizen-warning')}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '13px' }}
              >
                VIEW WATCH DETAILS →
              </button>
            </div>
          ) : (
            <div
              className="glass-panel"
              style={{
                borderRadius: '14px',
                padding: '18px',
                textAlign: 'center',
                border: '1px dashed rgba(16, 185, 129, 0.4)'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>🟢</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#10B981', marginBottom: '4px' }}>
                No active severe weather alerts
              </div>
              <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                All atmospheric indicators are currently nominal for this region. Official bulletins will appear here immediately upon release.
              </p>
            </div>
          )}
        </div>

        {/* PREVIOUS ALERTS SECTION */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Previous Bulletins & Archived Watches
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Alert 1 */}
            <div
              className="glass-panel"
              style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.85 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>🟠</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#F8FAFC' }}>
                    Thunderstorm Watch
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                    Yesterday • Miyapur corridor
                  </div>
                </div>
              </div>
              <span className="badge badge-high" style={{ fontSize: '10px' }}>
                Resolved
              </span>
            </div>

            {/* Alert 2 */}
            <div
              className="glass-panel"
              style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.85 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>🟡</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#F8FAFC' }}>
                    Heavy Rain Advisory
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                    08 September • Greater Hyderabad Municipal Area
                  </div>
                </div>
              </div>
              <span className="badge badge-mod" style={{ fontSize: '10px' }}>
                Archived
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* FIXED BOTTOM NAVIGATION */}
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
