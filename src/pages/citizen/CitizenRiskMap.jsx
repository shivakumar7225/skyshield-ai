import React from 'react';
import { useDemo } from '../../context/DemoContext';
import GeoRiskMap from '../../components/map/GeoRiskMap';
import SimulationBadge from '../../components/common/SimulationBadge';
import { Layers, MapPin, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CitizenRiskMap() {
  const { navigateTo, selectedLocation, activeTab, setActiveTab, demoState } = useDemo();

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
        <div>
          <h1 style={{ fontSize: '18px', color: '#F8FAFC', fontWeight: 700 }}>
            Hyper-Local Risk Map
          </h1>
          <div style={{ fontSize: '11px', color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>📍</span> {selectedLocation}
          </div>
        </div>

        <SimulationBadge text="GIS NOWCAST" />
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Interactive Simulated Map */}
        <GeoRiskMap height={440} showControls={true} />

        {/* Selected Zone Brief */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#38BDF8', textTransform: 'uppercase' }}>
              Your Location Sector
            </span>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
              Zone A • {selectedLocation}
            </span>
          </div>

          <div style={{ fontSize: '14px', color: '#F8FAFC', fontWeight: 600, marginBottom: '6px' }}>
            Topography: Regional Catchment Basin (520–560m)
          </div>
          <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.4, marginBottom: '12px' }}>
            Rainfall runoff concentrated along natural drainage corridors in {selectedLocation}. High sensitivity to flash flooding.
          </p>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => navigateTo('citizen-shelter')}
              className="btn-primary"
              style={{ flex: 1, padding: '10px', fontSize: '12px' }}
            >
              Safe Shelters (1.2km) →
            </button>
            <button
              onClick={() => navigateTo('citizen-warning')}
              className="btn-secondary"
              style={{ flex: 1, padding: '10px', fontSize: '12px' }}
            >
              View Warning Details
            </button>
          </div>
        </div>
      </div>

      {/* FIXED BOTTOM NAVIGATION (EXACTLY FOUR ITEMS) */}
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
