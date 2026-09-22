import React from 'react';
import { useDemo } from '../../context/DemoContext';
import OfficerHeader from '../../components/officer/OfficerHeader';
import OfficerSidebar from '../../components/officer/OfficerSidebar';
import SimulationBadge from '../../components/common/SimulationBadge';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import {
  AlertOctagon,
  ArrowLeft,
  Clock,
  MapPin,
  Users,
  GraduationCap,
  Building,
  Route,
  Droplets,
  ArrowRight,
  Activity,
  ShieldAlert
} from 'lucide-react';

export default function OfficerActiveEvent() {
  const { navigateTo, selectedEventId } = useDemo();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#070B14' }}>
      <OfficerHeader />

      <div className="officer-layout">
        <OfficerSidebar activeItem="dashboard" />

        <main className="officer-main" style={{ padding: '28px', maxWidth: '1200px' }}>
          {/* Breadcrumb & Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button
              onClick={() => navigateTo('officer-command')}
              style={{
                color: '#94A3B8',
                fontSize: '13px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} /> Back to Command Center
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-severe">
                CRITICAL EVENT ACTIVE
              </span>
              <SimulationBadge text="EVENT DETAILS" />
            </div>
          </div>

          {/* Event Header Banner */}
          <div
            className="alert-card-severe"
            style={{
              padding: '28px',
              borderRadius: '20px',
              marginBottom: '28px',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#FCA5A5', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Micro-Basin Severe Nowcast
                </div>
                <h1 style={{ fontSize: '32px', color: '#FFFFFF', fontWeight: 900, letterSpacing: '-0.02em' }}>
                  🔴 CLOUDBURST RISK
                </h1>
                <div style={{ fontSize: '14px', color: '#CBD5E1', marginTop: '4px' }}>
                  Zone A • Kukatpally Basin / Pragathi Nagar (Catchment 14.2 km²)
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px 20px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Probability</div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#EF4444' }}>87%</div>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px 20px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Severity</div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#F97316' }}>HIGH</div>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px 20px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Lead Time</div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#38BDF8' }}>2h 18m</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13px', color: '#E2E8F0', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px' }}>
              <div><strong>Affected Area:</strong> 14.2 km²</div>
              <div>•</div>
              <div><strong>Expected Apex Window:</strong> 4:00 PM – 6:00 PM</div>
              <div>•</div>
              <div><strong>Precipitation Rate:</strong> Projected &gt; 85 mm / hr</div>
            </div>
          </div>

          {/* Impact Overview Cards */}
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '18px', color: '#F8FAFC', fontWeight: 800, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Exposed Infrastructure & Population At Risk
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
              {/* Population */}
              <div className="glass-panel" style={{ padding: '18px', borderLeft: '3px solid #38BDF8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '12px', marginBottom: '6px' }}>
                  <Users size={16} color="#38BDF8" />
                  <span>Population</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
                  <AnimatedCounter value={38420} />
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Residents in footprint</div>
              </div>

              {/* Schools */}
              <div className="glass-panel" style={{ padding: '18px', borderLeft: '3px solid #EAB308' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '12px', marginBottom: '6px' }}>
                  <GraduationCap size={16} color="#EAB308" />
                  <span>Schools</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
                  <AnimatedCounter value={3} />
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Kukatpally Govt & 2 Pvt</div>
              </div>

              {/* Hospitals */}
              <div className="glass-panel" style={{ padding: '18px', borderLeft: '3px solid #EF4444' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '12px', marginBottom: '6px' }}>
                  <Building size={16} color="#EF4444" />
                  <span>Hospitals</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
                  <AnimatedCounter value={2} />
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Area Hospital & Clinic</div>
              </div>

              {/* Roads */}
              <div className="glass-panel" style={{ padding: '18px', borderLeft: '3px solid #F97316' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '12px', marginBottom: '6px' }}>
                  <Route size={16} color="#F97316" />
                  <span>Roads</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
                  <AnimatedCounter value={12} />
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>NH-65 & Underpasses</div>
              </div>

              {/* Drainage Channels */}
              <div className="glass-panel" style={{ padding: '18px', borderLeft: '3px solid #06B6D4' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '12px', marginBottom: '6px' }}>
                  <Droplets size={16} color="#06B6D4" />
                  <span>Drainage Channels</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
                  <AnimatedCounter value={4} />
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Kukatpally Nala trunk</div>
              </div>
            </div>
          </div>

          {/* Call to Action: ANALYZE EVENT */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '20px 24px', borderRadius: '14px' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
                Ready to examine meteorological & spatial indicators?
              </div>
              <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                DeepNowcast engine has synthesized INSAT-3DR Rapid Scan and IMD dual-pol radar soundings.
              </p>
            </div>

            <button
              onClick={() => navigateTo('officer-analysis')}
              className="btn-primary"
              style={{ padding: '14px 28px', fontSize: '15px', fontWeight: 700 }}
            >
              ANALYZE EVENT →
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
