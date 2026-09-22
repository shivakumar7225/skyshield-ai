import React from 'react';
import { useDemo } from '../../context/DemoContext';
import OfficerHeader from '../../components/officer/OfficerHeader';
import OfficerSidebar from '../../components/officer/OfficerSidebar';
import GeoRiskMap from '../../components/map/GeoRiskMap';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import SimulationBadge from '../../components/common/SimulationBadge';
import {
  AlertTriangle,
  Flame,
  Users,
  Building2,
  BellRing,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function OfficerCommandCenter() {
  const { navigateTo, demoState, activeWeatherData, setSelectedEventId } = useDemo();

  const handleThreatClick = (eventId) => {
    setSelectedEventId(eventId);
    navigateTo('officer-event', { eventId });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#070B14' }}>
      {/* Officer Command Header */}
      <OfficerHeader />

      <div className="officer-layout">
        {/* Sidebar */}
        <OfficerSidebar activeItem="dashboard" />

        {/* Main Content Dashboard */}
        <main className="officer-main" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Summary Metric Counters Bar (Animated) */}
          <div className="responsive-stats-grid">
            {/* Active Threats */}
            <div
              className="glass-panel"
              style={{
                padding: '18px 20px',
                borderLeft: '4px solid #EF4444',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(14, 23, 38, 0.8) 100%)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Active Threats
                </span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} className="animate-pulse-dot" />
              </div>
              <div style={{ fontSize: '30px', fontWeight: 900, color: '#F8FAFC' }}>
                <AnimatedCounter value={demoState === 'NORMAL' ? 0 : 3} />
              </div>
              <div style={{ fontSize: '11px', color: '#FCA5A5', marginTop: '4px' }}>
                {demoState === 'NORMAL' ? 'Nominal radar reflectivity' : '1 Extreme Convective Core'}
              </div>
            </div>

            {/* High Risk Zones */}
            <div
              className="glass-panel"
              style={{
                padding: '18px 20px',
                borderLeft: '4px solid #F97316',
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(14, 23, 38, 0.8) 100%)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  High Risk Zones
                </span>
                <Layers size={14} color="#F97316" />
              </div>
              <div style={{ fontSize: '30px', fontWeight: 900, color: '#F8FAFC' }}>
                <AnimatedCounter value={demoState === 'NORMAL' ? 0 : 5} />
              </div>
              <div style={{ fontSize: '11px', color: '#FDBA74', marginTop: '4px' }}>
                Zone A, B, C & Lowland Basins
              </div>
            </div>

            {/* Population at Risk */}
            <div
              className="glass-panel"
              style={{
                padding: '18px 20px',
                borderLeft: '4px solid #38BDF8',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(14, 23, 38, 0.8) 100%)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Population at Risk
                </span>
                <Users size={14} color="#38BDF8" />
              </div>
              <div style={{ fontSize: '30px', fontWeight: 900, color: '#F8FAFC' }}>
                <AnimatedCounter value={demoState === 'NORMAL' ? 0 : 38420} />
              </div>
              <div style={{ fontSize: '11px', color: '#7DD3FC', marginTop: '4px' }}>
                In targeted micro-catchment
              </div>
            </div>

            {/* Alerts Issued */}
            <div
              className="glass-panel"
              style={{
                padding: '18px 20px',
                borderLeft: '4px solid #10B981',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(14, 23, 38, 0.8) 100%)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Alerts Issued
                </span>
                <BellRing size={14} color="#10B981" />
              </div>
              <div style={{ fontSize: '30px', fontWeight: 900, color: '#F8FAFC' }}>
                <AnimatedCounter value={12} />
              </div>
              <div style={{ fontSize: '11px', color: '#6EE7B7', marginTop: '4px' }}>
                Cell broadcast & Sirens operational
              </div>
            </div>
          </div>

          {/* Main Grid: Left = Live Risk Map (Center of Visuals), Right = Active Threats Panel */}
          <div className="responsive-dashboard-grid">
            
            {/* Visual Center: Large Professional Geospatial Map */}
            <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '16px', color: '#F8FAFC', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    LIVE RISK MAP (NOWCAST GIS)
                  </h2>
                  <span className="badge badge-simulation">
                    HYPER-LOCAL 100m GRID
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94A3B8' }}>
                  <Clock size={13} />
                  <span>Lead Time: 2–6 Hours</span>
                </div>
              </div>

              {/* High-Tech Map Canvas */}
              <div style={{ flex: 1, minHeight: '460px' }}>
                <GeoRiskMap height={480} showControls={true} officerMode={true} />
              </div>
            </div>

            {/* Side Panel: Active Threats List */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', color: '#F8FAFC', fontWeight: 800 }}>
                    ACTIVE THREATS
                  </h3>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                    Sorted by Convective Intensity & Impact Window
                  </div>
                </div>

                <span className="badge badge-severe">
                  3 ACTIVE
                </span>
              </div>

              {/* Threat Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                
                {/* 1. Cloudburst 87% (Primary Event) */}
                <div
                  onClick={() => handleThreatClick('evt-cloudburst-01')}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.16) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    border: '1.5px solid #EF4444',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 16px rgba(239, 68, 68, 0.25)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>🔴</span>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
                        Cloudburst
                      </span>
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#EF4444' }}>
                      87%
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#E2E8F0', marginBottom: '10px' }}>
                    <span>Zone A (Kukatpally Basin)</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#FCA5A5', fontWeight: 700 }}>
                      ⏱️ 2h 18m lead time
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#38BDF8', fontWeight: 600, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' }}>
                    <span>Click to open full event details</span>
                    <ChevronRight size={14} />
                  </div>
                </div>

                {/* 2. Thunderstorm 82% */}
                <div
                  onClick={() => handleThreatClick('evt-thunderstorm-02')}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    border: '1px solid rgba(249, 115, 22, 0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>🟠</span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                        Thunderstorm
                      </span>
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#F97316' }}>
                      82%
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#CBD5E1' }}>
                    <span>Zone B (Miyapur Node)</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#FDBA74' }}>
                      ⏱️ 1h 42m
                    </span>
                  </div>
                </div>

                {/* 3. Flash Flood 74% */}
                <div
                  onClick={() => handleThreatClick('evt-flood-03')}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    border: '1px solid rgba(234, 179, 8, 0.35)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>🟡</span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                        Flash Flood
                      </span>
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#EAB308' }}>
                      74%
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#CBD5E1' }}>
                    <span>Zone C (Lowland Dips)</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#FDE047' }}>
                      ⏱️ 3h 05m
                    </span>
                  </div>
                </div>

              </div>

              {/* Quick Operation Actions */}
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
                <button
                  onClick={() => navigateTo('officer-analysis')}
                  className="btn-primary"
                  style={{ flex: 1, padding: '10px', fontSize: '12px' }}
                >
                  AI Meteorology Analysis →
                </button>
                <button
                  onClick={() => navigateTo('officer-live')}
                  className="btn-secondary"
                  style={{ padding: '10px 14px', fontSize: '12px' }}
                >
                  Live SOS Queue
                </button>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
