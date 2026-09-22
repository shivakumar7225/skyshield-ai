import React from 'react';
import { useDemo } from '../../context/DemoContext';
import OfficerHeader from '../../components/officer/OfficerHeader';
import OfficerSidebar from '../../components/officer/OfficerSidebar';
import GeoRiskMap from '../../components/map/GeoRiskMap';
import SimulationBadge from '../../components/common/SimulationBadge';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import {
  BrainCircuit,
  Layers,
  ArrowRight,
  ArrowLeft,
  Mountain,
  Gauge,
  CheckCircle2,
  TrendingDown,
  Info
} from 'lucide-react';

export default function OfficerAnalysis() {
  const { navigateTo } = useDemo();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#070B14' }}>
      <OfficerHeader />

      <div className="officer-layout">
        <OfficerSidebar activeItem="ai-analysis" />

        <main className="officer-main" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Header & Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => navigateTo('officer-event')}
                style={{ color: '#94A3B8', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <ArrowLeft size={16} /> Event Overview
              </button>
              <span style={{ color: '#475569' }}>/</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>
                AI & Spatial Analysis
              </span>
            </div>

            <SimulationBadge text="MULTI-SOURCE NOWCAST MODEL" />
          </div>

          {/* COMBINED SCREEN: Left Panel (AI Confidence & Indicators) + Right Panel (Spatial DEM & Risk Map) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.4fr', gap: '22px' }}>
            
            {/* LEFT PANEL: AI CONFIDENCE & METEOROLOGICAL INDICATORS */}
            <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Gauges Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* AI Confidence */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
                    border: '1.5px solid rgba(56, 189, 248, 0.4)',
                    borderRadius: '14px',
                    padding: '16px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    AI CONFIDENCE
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: 900, color: '#38BDF8', margin: '4px 0' }}>
                    <AnimatedCounter value={87} suffix="%" />
                  </div>
                  <div style={{ fontSize: '11px', color: '#7DD3FC' }}>
                    Transformer Nowcast v3
                  </div>
                </div>

                {/* Multi-Source Agreement */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
                    border: '1.5px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '14px',
                    padding: '16px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    MULTI-SOURCE AGREEMENT
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: 900, color: '#10B981', margin: '4px 0' }}>
                    <AnimatedCounter value={91} suffix="%" />
                  </div>
                  <div style={{ fontSize: '11px', color: '#6EE7B7' }}>
                    Radar + INSAT-3DR + IoT
                  </div>
                </div>
              </div>

              {/* Meteorological Indicators Table (Per Specification) */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Meteorological Physical Indicators</span>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>Real-time Dual-Pol Sounding</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {/* IWV */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>IWV</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '6px' }}>(Integrated Water Vapor: 64.2mm)</span>
                    </div>
                    <span className="badge badge-high">HIGH</span>
                  </div>

                  {/* CAPE */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>CAPE</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '6px' }}>(Convective Energy: 3,280 J/kg)</span>
                    </div>
                    <span className="badge badge-severe">HIGH</span>
                  </div>

                  {/* CIN */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>CIN</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '6px' }}>(Convective Inhibition: 18 J/kg)</span>
                    </div>
                    <span className="badge badge-low" style={{ color: '#38BDF8', borderColor: 'rgba(56,189,248,0.4)', background: 'rgba(56,189,248,0.1)' }}>LOW (Broken)</span>
                  </div>

                  {/* Wind Convergence */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>Wind Convergence</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '6px' }}>(14.8 × 10⁻⁵ s⁻¹)</span>
                    </div>
                    <span className="badge badge-high">HIGH</span>
                  </div>

                  {/* Vertical Wind Shear */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>Vertical Wind Shear</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '6px' }}>(0-6km: 18.4 m/s)</span>
                    </div>
                    <span className="badge badge-mod">MODERATE</span>
                  </div>

                  {/* CTT Drop Rate */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>CTT Drop Rate</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '6px' }}>(-9.2°C/15m to -74°C)</span>
                    </div>
                    <span className="badge badge-severe">HIGH</span>
                  </div>

                  {/* QPE */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>QPE</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '6px' }}>(Dual-Pol Precip: 88.5 mm/hr)</span>
                    </div>
                    <span className="badge badge-severe">HIGH</span>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT PANEL: SPATIAL RISK MAP + TERRAIN DEM DATA */}
            <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '16px', color: '#F8FAFC', fontWeight: 800 }}>
                    SPATIAL RISK MAP & DIGITAL ELEVATION MODEL (DEM)
                  </h3>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                    Predicted cloudburst zone • High rainfall zone • Flood susceptible zone
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5', fontWeight: 700 }}>
                    Zone A Epicenter
                  </span>
                </div>
              </div>

              {/* Map Canvas with DEM contours */}
              <div style={{ height: '310px', borderRadius: '12px', overflow: 'hidden' }}>
                <GeoRiskMap height={310} showControls={false} officerMode={true} />
              </div>

              {/* Terrain Data Cards (Exact Spec) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Elevation</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>510–580m</div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Basin Depression</div>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Slope</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#F97316', marginTop: '2px' }}>HIGH</div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Rapid Runoff Peak</div>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Drainage</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#EF4444', marginTop: '2px' }}>VULNERABLE</div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Kukatpally Nala</div>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Flash Flood Risk</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#EF4444', marginTop: '2px' }}>76%</div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Instant Inundation</div>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Explanation Banner & Navigation Button */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              padding: '18px 24px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Info size={20} color="#38BDF8" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>
                  Bottom Meteorological Synthesis:
                </div>
                <p style={{ fontSize: '13px', color: '#CBD5E1', marginTop: '2px' }}>
                  "Multiple atmospheric and surface indicators indicate an elevated probability of localized severe weather."
                </p>
              </div>
            </div>

            <button
              onClick={() => navigateTo('officer-impact')}
              className="btn-primary"
              style={{ padding: '14px 24px', fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap' }}
            >
              VIEW IMPACT & RESPONSE →
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
