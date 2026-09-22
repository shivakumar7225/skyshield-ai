import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import {
  AlertOctagon,
  Shield,
  MapPin,
  Clock,
  HelpCircle,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  Sparkles
} from 'lucide-react';
import SimulationBadge from '../../components/common/SimulationBadge';
import { alertService } from '../../services/alertService';
import { apiClient } from '../../services/apiClient';

export default function CitizenWarning() {
  const { navigateTo, selectedLocation, activeTab, setActiveTab } = useDemo();
  const [showExplanation, setShowExplanation] = useState(false);
  const [warningData, setWarningData] = useState(null);
  const [aiExplanation, setAiExplanation] = useState(null);

  useEffect(() => {
    async function loadWarning() {
      try {
        const active = await alertService.getActiveWarning();
        if (active) setWarningData(active);
      } catch (e) {}
    }
    loadWarning();
  }, []);

  useEffect(() => {
    if (showExplanation && !aiExplanation) {
      async function loadAi() {
        try {
          const res = await apiClient.post('/api/ai/explain', {
            hazard: 'cloudburst',
            probability: 0.87,
            lead_time: '2h 18m',
            location: selectedLocation,
            audience: 'citizen'
          });
          if (res && res.explanation) {
            setAiExplanation(res.explanation);
          }
        } catch (e) {}
      }
      loadAi();
    }
  }, [showExplanation, selectedLocation, aiExplanation]);

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
          background: 'rgba(24, 10, 16, 0.95)',
          position: 'sticky',
          top: '46px',
          zIndex: 800,
          backdropFilter: 'blur(12px)'
        }}
      >
        <button onClick={() => navigateTo('citizen-home')} style={{ color: '#F87171', fontSize: '13px', fontWeight: 600 }}>
          ← Back
        </button>
        <SimulationBadge text="OFFICIAL WEATHER WARNING" />
      </div>

      <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Warning Banner Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '2px solid #EF4444',
            borderRadius: '18px',
            padding: '22px 18px',
            boxShadow: '0 0 30px rgba(239, 68, 68, 0.35)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.06em', color: '#FCA5A5', textTransform: 'uppercase' }}>
              🔴 SEVERE WEATHER WARNING
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                background: 'rgba(239, 68, 68, 0.3)',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: '4px'
              }}
            >
              Confidence: 87%
            </span>
          </div>

          <h2 style={{ fontSize: '24px', color: '#FFFFFF', fontWeight: 800, marginBottom: '6px' }}>
            ⛈️ CLOUDBURST RISK
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#E2E8F0', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#F87171' }}>📍 Location:</span>
              <span style={{ fontWeight: 600 }}>Your area ({selectedLocation})</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#F87171' }}>⏱️ Lead Time:</span>
              <span style={{ fontWeight: 700, color: '#FCA5A5' }}>Expected in 2 hours 18 minutes</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#F87171' }}>🕒 Expected Window:</span>
              <span style={{ fontWeight: 600 }}>4:00 PM – 6:00 PM</span>
            </div>
          </div>
        </div>

        {/* Action Card: WHAT YOU SHOULD DO */}
        <div className="glass-panel" style={{ padding: '20px 18px', borderLeft: '4px solid #EF4444' }}>
          <h3 style={{ fontSize: '15px', color: '#FFFFFF', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            WHAT YOU SHOULD DO
          </h3>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#CBD5E1' }}>
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Stay indoors if possible</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#CBD5E1' }}>
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Avoid low-lying areas and ground-level basements</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#CBD5E1' }}>
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Do not cross flowing water or submerged roadways</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#CBD5E1' }}>
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Keep your phone and emergency flashlights charged</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#CBD5E1' }}>
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Follow official instructions and monitor SkyShield updates</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => navigateTo('citizen-shelter')}
            className="btn-success"
            style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: 700 }}
          >
            🏠 NEAREST SHELTER
          </button>

          <button
            onClick={() => {
              setActiveTab('map');
              navigateTo('citizen-map');
            }}
            className="btn-secondary"
            style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: 600 }}
          >
            VIEW RISK MAP
          </button>

          <button
            onClick={() => setShowExplanation(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px',
              fontSize: '13px',
              color: '#38BDF8',
              fontWeight: 600
            }}
          >
            <HelpCircle size={15} />
            WHY THIS WARNING?
          </button>
        </div>
      </div>

      {/* CITIZEN AI EXPLANATION MODAL (Drawer) */}
      {showExplanation && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              background: '#0E1726',
              borderTop: '2px solid #38BDF8',
              borderTopLeftRadius: '22px',
              borderTopRightRadius: '22px',
              padding: '24px 20px',
              boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.8)',
              maxHeight: '85vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#F8FAFC' }}>
                Why are you receiving this warning?
              </div>
              <button
                onClick={() => setShowExplanation(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ color: '#E2E8F0', fontSize: '13px', marginBottom: '16px', lineHeight: 1.5, background: 'rgba(56, 189, 248, 0.08)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #38BDF8' }}>
              {aiExplanation || "SkyShield AI continuously tracks atmospheric indicators from Doppler radar, satellite sounders, and ground sensors to detect extreme localized storms before they strike."}
            </p>

            {/* AI Confidence & Agreement Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <div className="glass-panel" style={{ padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
                  AI Confidence
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#38BDF8' }}>
                  87%
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
                  Multi-Source Agreement
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#10B981' }}>
                  91%
                </div>
              </div>
            </div>

            {/* Citizen-Friendly Explainable AI Indicators */}
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', textTransform: 'uppercase', marginBottom: '10px' }}>
              Detected Atmospheric Indicators:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '13px', color: '#F8FAFC' }}>Moisture increase</span>
                <span className="badge badge-high">HIGH</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '13px', color: '#F8FAFC' }}>Cloud development</span>
                <span className="badge badge-high">HIGH</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '13px', color: '#F8FAFC' }}>Rainfall intensity</span>
                <span className="badge badge-severe">HIGH</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '13px', color: '#F8FAFC' }}>Atmospheric instability</span>
                <span className="badge badge-high">HIGH</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '13px', color: '#F8FAFC' }}>Terrain susceptibility</span>
                <span className="badge badge-mod">ELEVATED</span>
              </div>
            </div>

            <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 700, textTransform: 'uppercase' }}>
                Actionable Lead Time Window
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
                2–3 hours advance warning
              </div>
            </div>

            <button
              onClick={() => setShowExplanation(false)}
              className="btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              GOT IT
            </button>
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
