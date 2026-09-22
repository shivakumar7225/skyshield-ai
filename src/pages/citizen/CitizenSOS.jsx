import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { SOS_CATEGORIES } from '../../data/mockCitizenData';
import SimulationBadge from '../../components/common/SimulationBadge';
import { AlertOctagon, CheckCircle2, ShieldAlert, ArrowLeft, Send, PhoneCall } from 'lucide-react';

export default function CitizenSOS() {
  const { navigateTo, addSOS, activeTab, setActiveTab, selectedLocation, lastSosSentId } = useDemo();
  const [selectedCategory, setSelectedCategory] = useState('Flooding');
  const [additionalNote, setAdditionalNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmedId, setConfirmedId] = useState('#1048');

  const handleSendSOS = async () => {
    const id = await addSOS(selectedCategory, additionalNote);
    setConfirmedId(id || '#1048');
    setIsSubmitted(true);
  };

  return (
    <div className="citizen-mobile-viewport">
      {/* Top Header */}
      <div
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
          background: 'rgba(20, 10, 16, 0.95)',
          position: 'sticky',
          top: '46px',
          zIndex: 800,
          backdropFilter: 'blur(12px)'
        }}
      >
        <button
          onClick={() => {
            setActiveTab('home');
            navigateTo('citizen-home');
          }}
          style={{ color: '#F87171', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <ArrowLeft size={16} /> Home
        </button>

        <h1 style={{ fontSize: '16px', color: '#FFFFFF', fontWeight: 800 }}>
          Emergency SOS
        </h1>

        <SimulationBadge text="EMERGENCY DISPATCH" />
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* If SOS was Sent -> Show Confirmation State */}
        {isSubmitted ? (
          <div
            className="glass-panel"
            style={{
              padding: '28px 20px',
              textAlign: 'center',
              border: '2px solid #10B981',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.25)',
              borderRadius: '20px'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid #10B981',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10B981',
                fontSize: '32px',
                marginBottom: '16px'
              }}
            >
              ✓
            </div>

            <h2 style={{ fontSize: '24px', color: '#10B981', fontWeight: 800, marginBottom: '6px' }}>
              ✓ SOS SENT
            </h2>

            <div
              style={{
                display: 'inline-block',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '14px',
                fontFamily: 'var(--font-mono)',
                color: '#38BDF8',
                fontWeight: 700,
                marginBottom: '14px'
              }}
            >
              Request ID: {confirmedId}
            </div>

            <p style={{ color: '#E2E8F0', fontSize: '14px', lineHeight: 1.5, marginBottom: '16px' }}>
              Your emergency request has been sent to the authorized response dashboard.
            </p>

            <div style={{ background: 'rgba(56, 189, 248, 0.08)', borderRadius: '10px', padding: '12px', textAlign: 'left', marginBottom: '20px', fontSize: '12px', color: '#CBD5E1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>Reported Hazard:</strong> {selectedCategory}</div>
              <div><strong>Location:</strong> {selectedLocation}</div>
              <div><strong>Dispatch Status:</strong> <span style={{ color: '#F59E0B', fontWeight: 700 }}>Awaiting Officer Team Assignment</span></div>
            </div>

            <div
              style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                padding: '10px',
                borderRadius: '8px',
                color: '#7DD3FC',
                fontSize: '12px',
                marginBottom: '20px'
              }}
            >
              Direct emergency coordinates linked with GHMC Disaster Control Station.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => navigateTo('officer-live')}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '13px' }}
              >
                Inspect on Officer Command Screen →
              </button>

              <button
                onClick={() => setIsSubmitted(false)}
                className="btn-secondary"
                style={{ width: '100%', padding: '10px', fontSize: '12px' }}
              >
                Send Another Report
              </button>
            </div>
          </div>
        ) : (
          /* Normal SOS Trigger View */
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '42px', marginBottom: '8px' }} className="animate-pulse-dot">
                🚨
              </div>

              <h2 style={{ fontSize: '22px', color: '#FFFFFF', fontWeight: 800, marginBottom: '6px' }}>
                Are you in immediate danger?
              </h2>

              <p style={{ fontSize: '13px', color: '#94A3B8' }}>
                Press the emergency button below to transmit your location coordinates and threat type to field NDRF/GHMC responders.
              </p>
            </div>

            {/* Large SEND SOS Button */}
            <button
              onClick={handleSendSOS}
              className="sos-button-hero"
              style={{ padding: '22px 18px', fontSize: '20px', letterSpacing: '0.04em' }}
            >
              <AlertOctagon size={28} />
              SEND SOS NOW
            </button>

            {/* What is happening category selector */}
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#CBD5E1', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.04em' }}>
                What is happening?
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
                {SOS_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.label;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.label)}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        background: isSelected ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected ? '1.5px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      <div style={{ fontSize: '20px' }}>{cat.icon}</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#FFFFFF' : '#CBD5E1' }}>
                        {cat.label}
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748B', lineHeight: 1.2 }}>
                        {cat.description}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Optional brief details */}
              <div>
                <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                  Additional details (optional)
                </label>
                <input
                  type="text"
                  value={additionalNote}
                  onChange={(e) => setAdditionalNote(e.target.value)}
                  placeholder="e.g. Water entering ground floor, 2 seniors inside"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>

            <div
              style={{
                fontSize: '11px',
                color: '#64748B',
                textAlign: 'center',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px'
              }}
            >
              Direct emergency telemetry linked with GHMC Disaster Response Center.
            </div>
          </>
        )}

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
