import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { MOCK_SHELTERS } from '../../data/mockShelters';
import { shelterService } from '../../services/shelterService';
import ShelterRouteMiniMap from '../../components/map/ShelterRouteMiniMap';
import SimulationBadge from '../../components/common/SimulationBadge';
import {
  ShieldCheck,
  MapPin,
  Navigation,
  ArrowRight,
  CheckCircle,
  Users,
  PhoneCall,
  ExternalLink,
  Layers,
  Footprints,
  Car,
  AlertTriangle,
  Compass
} from 'lucide-react';

export default function CitizenShelter() {
  const { navigateTo, selectedLocation, selectedCoords, activeTab, setActiveTab } = useDemo();
  const [sheltersList, setSheltersList] = useState(MOCK_SHELTERS);
  const [activeShelter, setActiveShelter] = useState(MOCK_SHELTERS[0]);
  const [viewTab, setViewTab] = useState('MAP'); // 'MAP' | 'LIST'
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [activeStep, setActiveStep] = useState(null);

  useEffect(() => {
    async function loadShelters() {
      try {
        const list = await shelterService.getNearbyShelters(selectedLocation);
        if (list && list.length > 0) {
          setSheltersList(list);
          setActiveShelter(list[0]);
        }
      } catch (e) {}
    }
    loadShelters();
  }, [selectedLocation]);

  const handleOpenRouteModal = (shelter) => {
    setActiveShelter(shelter);
    setShowRouteModal(true);
  };

  const originLat = selectedCoords?.lat || 17.4947;
  const originLng = selectedCoords?.lng || 78.3996;
  const destLat = activeShelter?.lat || originLat + 0.0078;
  const destLng = activeShelter?.lng || originLng + 0.0072;

  const handleLaunchGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=walking`;
    window.open(url, '_blank');
  };

  return (
    <div className="citizen-mobile-viewport">
      {/* Header */}
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
        <button onClick={() => navigateTo('citizen-warning')} style={{ color: '#94A3B8', fontSize: '13px' }}>
          ← Back
        </button>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC' }}>
          Safe Shelters & Directions
        </div>
        <SimulationBadge text="SATELLITE GPS" />
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Location Reference Banner */}
        <div
          style={{
            fontSize: '12px',
            color: '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>📍 From your pinpoint:</span>
            <span style={{ color: '#38BDF8', fontWeight: 600 }}>{selectedLocation}</span>
          </div>
          <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>🟢 3 SHELTERS OPEN</span>
        </div>

        {/* View Mode Toggle: Satellite Route vs Shelter List */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <button
            onClick={() => setViewTab('MAP')}
            style={{
              padding: '8px',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              background: viewTab === 'MAP' ? '#0284C7' : 'transparent',
              color: viewTab === 'MAP' ? '#FFFFFF' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🛰️ Satellite Route & Directions</span>
          </button>
          <button
            onClick={() => setViewTab('LIST')}
            style={{
              padding: '8px',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              background: viewTab === 'LIST' ? '#0284C7' : 'transparent',
              color: viewTab === 'LIST' ? '#FFFFFF' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>📋 All Shelters ({sheltersList.length})</span>
          </button>
        </div>

        {/* Shelter Selector Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {sheltersList.map((sh) => {
            const isSelected = activeShelter.id === sh.id;
            return (
              <button
                key={sh.id}
                onClick={() => setActiveShelter(sh)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: isSelected ? '1.5px solid #10B981' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                  color: isSelected ? '#A7F3D0' : '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>🛡️</span>
                <span>{sh.name.split(' ')[0]} {sh.name.split(' ')[1] || ''}</span>
                <span style={{ fontSize: '10px', opacity: 0.8 }}>({sh.distance})</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: SATELLITE ROUTE MAP & TURN-BY-TURN DIRECTIONS */}
        {viewTab === 'MAP' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* 1. Live Satellite Route Map */}
            <ShelterRouteMiniMap
              shelter={activeShelter}
              height={320}
              onStepClick={(step, idx) => setActiveStep(idx)}
            />

            {/* 2. Active Shelter Info Card */}
            <div
              className="glass-panel"
              style={{
                padding: '16px',
                border: '1.5px solid rgba(16, 185, 129, 0.4)',
                background: 'rgba(6, 78, 59, 0.12)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>
                    Active Destination
                  </div>
                  <h3 style={{ fontSize: '16px', color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>
                    {activeShelter.name}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                    {activeShelter.address}
                  </div>
                </div>
                <span className="badge badge-low">
                  🟢 {activeShelter.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', margin: '12px 0' }}>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>DISTANCE</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#38BDF8' }}>{activeShelter.distance}</div>
                </div>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>WALK TIME</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FCD34D' }}>{activeShelter.walkingTime}</div>
                </div>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>ELEVATION</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#10B981' }}>{activeShelter.elevationGain}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  onClick={handleLaunchGoogleMaps}
                  className="btn-success"
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>🛰️ Open Turn-by-Turn in Google Maps</span>
                  <ExternalLink size={13} />
                </button>
                <a
                  href="tel:+919440123891"
                  className="btn-secondary"
                  style={{
                    padding: '10px 14px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                    color: '#F8FAFC'
                  }}
                >
                  <PhoneCall size={13} />
                  <span>Call Officer</span>
                </a>
              </div>
            </div>

            {/* 3. Turn-by-Turn Directions List */}
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Navigation size={14} color="#38BDF8" />
                  <span>Turn-by-Turn Evacuation Route</span>
                </div>
                <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                  🛡️ Flood Avoidance Active
                </span>
              </div>

              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: '#FCA5A5',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <AlertTriangle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Hazard Warning:</strong> Ground underpass on direct route is inundated (&gt; 1.2m water). This route safely navigates via the elevated flyover ridge.
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeShelter.route?.map((stepItem, idx) => {
                  const isHighlighted = activeStep === idx || !!stepItem.highlight;
                  return (
                    <div
                      key={stepItem.step}
                      onClick={() => setActiveStep(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '12px',
                        borderRadius: '10px',
                        background: isHighlighted ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        border: isHighlighted ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: stepItem.highlight ? '#F59E0B' : '#10B981',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 700,
                          flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                        }}
                      >
                        {stepItem.step}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 600 }}>
                          {stepItem.instruction}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>📏 {stepItem.dist}</span>
                          {stepItem.highlight && (
                            <span style={{ color: '#FCD34D', fontWeight: 600 }}>
                              ⚠️ {stepItem.highlight}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ALL SHELTERS CARDS LIST */}
        {viewTab === 'LIST' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sheltersList.map((shelter) => {
              const isSelected = activeShelter.id === shelter.id;
              return (
                <div
                  key={shelter.id}
                  className="glass-panel"
                  style={{
                    padding: '16px',
                    border: isSelected ? '1.5px solid #10B981' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(21, 34, 56, 0.7)',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', color: '#FFFFFF', fontWeight: 700, marginBottom: '2px' }}>
                        {shelter.name}
                      </h3>
                      <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                        {shelter.address}
                      </div>
                    </div>
                    <span className="badge badge-low">
                      🟢 {shelter.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#CBD5E1', marginBottom: '12px' }}>
                    <span>📍 {shelter.distance}</span>
                    <span>🚶 {shelter.walkingTime}</span>
                    <span>🚗 {shelter.drivingTime}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ padding: '8px 10px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase' }}>Available Capacity</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#10B981' }}>
                        {shelter.availableBeds} beds left
                      </div>
                    </div>
                    <div style={{ padding: '8px 10px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase' }}>Elevation Safety</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#38BDF8' }}>
                        {shelter.elevationGain}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                    {shelter.facilities?.map((feat, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '10px',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          color: '#94A3B8'
                        }}
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setActiveShelter(shelter);
                        setViewTab('MAP');
                      }}
                      className="btn-success"
                      style={{ flex: 1, padding: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <span>🛰️ SATELLITE ROUTE & DIRECTIONS →</span>
                    </button>
                    <button
                      onClick={() => handleOpenRouteModal(shelter)}
                      className="btn-secondary"
                      style={{ padding: '10px 14px', fontSize: '12px' }}
                    >
                      Steps
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Simulated Route Waypoint Modal */}
      {showRouteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              background: '#0E1726',
              borderTop: '2px solid #10B981',
              borderTopLeftRadius: '22px',
              borderTopRightRadius: '22px',
              padding: '24px 20px',
              maxHeight: '85vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, textTransform: 'uppercase' }}>
                  🛰️ Satellite Evacuation Route
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
                  {activeShelter.name}
                </div>
              </div>
              <button
                onClick={() => setShowRouteModal(false)}
                style={{
                  color: '#94A3B8',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.08)',
                  fontSize: '12px'
                }}
              >
                Close
              </button>
            </div>

            {/* Satellite Mini Map inside Modal */}
            <div style={{ marginBottom: '16px' }}>
              <ShelterRouteMiniMap shelter={activeShelter} height={220} />
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', color: '#D1FAE5', marginBottom: '16px' }}>
              🛡️ <strong>Flood Avoidance Navigation:</strong> This route routes around the inundated railway underpass via the elevated Vivekananda bridge (+18m MSL).
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {activeShelter.route.map((item) => (
                <div
                  key={item.step}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.03)'
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: item.highlight ? '#F59E0B' : '#10B981',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      flexShrink: 0
                    }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#F8FAFC', fontWeight: 500 }}>
                      {item.instruction}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                      {item.dist} {item.highlight && `• ⚠️ ${item.highlight}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleLaunchGoogleMaps}
                className="btn-success"
                style={{ flex: 1, padding: '12px', fontSize: '13px' }}
              >
                🛰️ Open Turn-by-Turn GPS
              </button>
              <button
                onClick={() => setShowRouteModal(false)}
                className="btn-secondary"
                style={{ padding: '12px 16px' }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

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
