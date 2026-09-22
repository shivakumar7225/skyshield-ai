import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import OfficerHeader from '../../components/officer/OfficerHeader';
import OfficerSidebar from '../../components/officer/OfficerSidebar';
import SimulationBadge from '../../components/common/SimulationBadge';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import { alertService } from '../../services/alertService';
import {
  Users,
  GraduationCap,
  Building,
  Flame,
  Route,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Send,
  Edit2,
  XCircle,
  Radio
} from 'lucide-react';

export default function OfficerImpactAlert() {
  const { navigateTo, alertApprovalState, setAlertApprovalState, officerUser } = useDemo();
  const [isApproved, setIsApproved] = useState(alertApprovalState === 'APPROVED');
  const [isDismissed, setIsDismissed] = useState(false);
  const [alertText, setAlertText] = useState(
    'Severe weather is expected in the highlighted area within approximately 2 hours. Residents should remain alert and follow official safety instructions.'
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleApprove = async () => {
    setIsApproved(true);
    setAlertApprovalState('APPROVED');
    try {
      await alertService.approveAlert('ALT-2026-0892', officerUser?.name || 'Cmdr. Vikram Rathore');
    } catch (err) {
      console.warn('Backend alert approval error:', err);
    }
  };

  const handleDismiss = async () => {
    setIsDismissed(true);
    setAlertApprovalState('DISMISSED');
    try {
      await alertService.dismissAlert('ALT-2026-0892');
    } catch (err) {
      console.warn('Backend alert dismissal error:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#070B14' }}>
      <OfficerHeader />

      <div className="officer-layout">
        <OfficerSidebar activeItem="alerts" />

        <main className="officer-main" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Top Breadcrumb & Status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => navigateTo('officer-analysis')}
                style={{ color: '#94A3B8', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <ArrowLeft size={16} /> AI & Spatial Analysis
              </button>
              <span style={{ color: '#475569' }}>/</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>
                Impact Assessment, Response & Public Warning
              </span>
            </div>

            <SimulationBadge text="AUTHORIZED BROADCAST DISPATCH" />
          </div>

          {/* COMBINED 2-COLUMN VIEW: Left = Impact Assessment, Right = Response & Public Alert */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: '22px' }}>
            
            {/* LEFT SECTION: IMPACT ASSESSMENT */}
            <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '17px', color: '#F8FAFC', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  IMPACT ASSESSMENT
                </h2>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                  Critical infrastructure exposure matrix for Zone A (14.2 km²)
                </div>
              </div>

              {/* 6 Key Impact Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* Population */}
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '12px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                    <Users size={14} color="#38BDF8" /> Population
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', marginTop: '4px' }}>
                    <AnimatedCounter value={38420} />
                  </div>
                  <div style={{ fontSize: '10px', color: '#7DD3FC' }}>Residents in flood zone</div>
                </div>

                {/* Schools */}
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                    <GraduationCap size={14} color="#EAB308" /> Schools
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', marginTop: '4px' }}>
                    3
                  </div>
                  <div style={{ fontSize: '10px', color: '#CBD5E1' }}>Designated as safe shelters</div>
                </div>

                {/* Hospitals */}
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                    <Building size={14} color="#EF4444" /> Hospitals
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', marginTop: '4px' }}>
                    2
                  </div>
                  <div style={{ fontSize: '10px', color: '#FCA5A5' }}>Power backups on standby</div>
                </div>

                {/* Fire Stations */}
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                    <Flame size={14} color="#F97316" /> Fire Stations
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', marginTop: '4px' }}>
                    1
                  </div>
                  <div style={{ fontSize: '10px', color: '#CBD5E1' }}>Kukatpally Station 4</div>
                </div>

                {/* Roads */}
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                    <Route size={14} color="#F97316" /> Roads
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', marginTop: '4px' }}>
                    12
                  </div>
                  <div style={{ fontSize: '10px', color: '#FDBA74' }}>4 low-dip underpasses</div>
                </div>

                {/* Drainage Channels */}
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                    <Droplets size={14} color="#06B6D4" /> Drainage Channels
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', marginTop: '4px' }}>
                    4
                  </div>
                  <div style={{ fontSize: '10px', color: '#67E8F9' }}>Spillover probability 89%</div>
                </div>
              </div>

              {/* Vulnerability Summary */}
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px', borderRadius: '10px', fontSize: '12px', color: '#FECACA' }}>
                ⚠️ <strong>Basin Inundation Model:</strong> Over 1,800 ground-floor residential structures in Pragathi Nagar basin are susceptible to &gt;40cm standing water within 2 hours of cloudburst onset.
              </div>
            </div>

            {/* RIGHT SECTION: AI-ASSISTED RESPONSE + PUBLIC ALERT PREVIEW */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* AI-ASSISTED RESPONSE CARD */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="#A78BFA" />
                    <h3 style={{ fontSize: '15px', color: '#F8FAFC', fontWeight: 800 }}>
                      AI-ASSISTED RESPONSE
                    </h3>
                  </div>
                  <span style={{ fontSize: '11px', color: '#A78BFA', fontWeight: 700, background: 'rgba(139, 92, 246, 0.15)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                    AI-assisted recommendation
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '13px', color: '#E2E8F0' }}>
                    <span style={{ color: '#38BDF8', fontWeight: 700 }}>1.</span> Alert vulnerable population in Zone A
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '13px', color: '#E2E8F0' }}>
                    <span style={{ color: '#38BDF8', fontWeight: 700 }}>2.</span> Monitor drainage channels
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '13px', color: '#E2E8F0' }}>
                    <span style={{ color: '#38BDF8', fontWeight: 700 }}>3.</span> Prepare shelters
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '13px', color: '#E2E8F0' }}>
                    <span style={{ color: '#38BDF8', fontWeight: 700 }}>4.</span> Position rescue teams
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '13px', color: '#E2E8F0' }}>
                    <span style={{ color: '#38BDF8', fontWeight: 700 }}>5.</span> Monitor critical roads
                  </div>
                </div>
              </div>

              {/* PUBLIC ALERT PREVIEW */}
              <div
                className="glass-panel"
                style={{
                  padding: '20px',
                  border: isApproved ? '2px solid #10B981' : '1.5px solid #EF4444',
                  background: isApproved
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)'
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.14) 0%, rgba(15, 23, 42, 0.95) 100%)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
                    PUBLIC ALERT PREVIEW
                  </div>
                  {isApproved ? (
                    <span className="badge badge-low">
                      ✓ BROADCAST SENT
                    </span>
                  ) : isDismissed ? (
                    <span className="badge badge-mod">
                      DISMISSED
                    </span>
                  ) : (
                    <span className="badge badge-severe">
                      AWAITING OFFICER APPROVAL
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
                  🔴 HIGH-SEVERITY CLOUDBURST WARNING
                </div>

                {isEditing ? (
                  <textarea
                    value={alertText}
                    onChange={(e) => setAlertText(e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      background: '#0F172A',
                      color: '#FFFFFF',
                      border: '1px solid #38BDF8',
                      fontSize: '13px',
                      marginBottom: '10px'
                    }}
                  />
                ) : (
                  <p style={{ fontSize: '13px', color: '#E2E8F0', lineHeight: 1.4, marginBottom: '12px' }}>
                    "{alertText}"
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#CBD5E1', marginBottom: '16px', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '8px' }}>
                  <span><strong>Target:</strong> 38,420 residents</span>
                  <span><strong>Channels:</strong> Cell Broadcast, App Push, Sirens</span>
                </div>

                {/* Successful Alert State Banner */}
                {isApproved && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', padding: '12px', borderRadius: '8px', marginBottom: '14px', color: '#D1FAE5', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} color="#10B981" />
                    <div>
                      <strong>Transmitted successfully:</strong> High-severity alert dispatched to 38,420 citizens in Zone A via Cell Broadcast & Citizen Portal.
                    </div>
                  </div>
                )}

                {/* Approval Action Buttons: EDIT, APPROVE & SEND, DISMISS */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  {isEditing ? (
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary"
                      style={{ padding: '10px 16px', fontSize: '12px' }}
                    >
                      Done Editing
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-secondary"
                      style={{ padding: '10px 16px', fontSize: '12px' }}
                    >
                      <Edit2 size={13} /> EDIT
                    </button>
                  )}

                  <button
                    onClick={handleApprove}
                    className="btn-success"
                    style={{ flex: 1, padding: '10px', fontSize: '13px', fontWeight: 700 }}
                  >
                    ✓ APPROVE & SEND
                  </button>

                  <button
                    onClick={handleDismiss}
                    className="btn-secondary"
                    style={{ padding: '10px 16px', fontSize: '12px', color: '#F87171' }}
                  >
                    DISMISS
                  </button>
                </div>
              </div>

              {/* Next step to Live Monitoring */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => navigateTo('officer-live')}
                  className="btn-primary"
                  style={{ padding: '12px 20px', fontSize: '13px' }}
                >
                  Go to Live Response Center & SOS Queue →
                </button>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
