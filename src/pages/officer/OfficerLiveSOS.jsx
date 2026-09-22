import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import OfficerHeader from '../../components/officer/OfficerHeader';
import OfficerSidebar from '../../components/officer/OfficerSidebar';
import SimulationBadge from '../../components/common/SimulationBadge';
import { MOCK_RESPONDER_TEAMS } from '../../data/mockOfficerData';
import {
  AlertOctagon,
  TrendingUp,
  Clock,
  ArrowLeft,
  CheckCircle,
  Truck,
  Shield,
  Phone,
  UserCheck,
  X,
  Radio,
  MapPin
} from 'lucide-react';

export default function OfficerLiveSOS() {
  const { navigateTo, sosList, assignTeam } = useDemo();
  const [selectedSOS, setSelectedSOS] = useState(null);
  const [assigningSOS, setAssigningSOS] = useState(null);
  const [assignedSuccess, setAssignedSuccess] = useState('');

  const handleAssignConfirm = (teamName) => {
    if (assigningSOS) {
      assignTeam(assigningSOS.id, teamName);
      setAssignedSuccess(`Request ${assigningSOS.id} assigned to ${teamName}`);
      setAssigningSOS(null);
      setTimeout(() => setAssignedSuccess(''), 4000);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#070B14' }}>
      <OfficerHeader />

      <div className="officer-layout">
        <OfficerSidebar activeItem="sos" />

        <main className="officer-main" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => navigateTo('officer-command')}
                style={{ color: '#94A3B8', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <ArrowLeft size={16} /> Command Dashboard
              </button>
              <span style={{ color: '#475569' }}>/</span>
              <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#F8FAFC' }}>
                Live Response Center
              </h1>
            </div>

            <SimulationBadge text="LIVE INCIDENT DISPATCH" />
          </div>

          {/* EVENT STATUS CARD (As specified in requirement 6) */}
          <div
            className="alert-card-severe"
            style={{
              padding: '20px 24px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF' }}>
                  🔴 CLOUDBURST EVENT — ACTIVE
                </span>
                <span className="badge badge-severe" style={{ fontSize: '10px' }}>
                  LIVE NOWCAST
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#FECACA' }}>
                Convective cell over Kukatpally Basin • Heavy runoff concentrating in lower storm sewers
              </div>
            </div>

            {/* Risk Trend & Lead Time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              {/* Risk Trend */}
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
                  Risk Trend (Last 90m)
                </div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>42%</span>
                  <span>→</span>
                  <span style={{ color: '#EAB308' }}>55%</span>
                  <span>→</span>
                  <span style={{ color: '#F97316' }}>68%</span>
                  <span>→</span>
                  <span style={{ color: '#EF4444' }}>87%</span>
                </div>
              </div>

              {/* Lead Time */}
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
                  Lead Time Remaining
                </div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={15} /> 2h 05m
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Success Message */}
          {assignedSuccess && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#D1FAE5', padding: '12px 18px', borderRadius: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} color="#10B981" />
              {assignedSuccess}
            </div>
          )}

          {/* 2-Column Operational Grid: Left = Active SOS Requests, Right = Response Units Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '22px' }}>
            
            {/* ACTIVE SOS REQUESTS */}
            <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '16px', color: '#F8FAFC', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    ACTIVE SOS REQUESTS
                  </h2>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                    Real-time citizen emergency reports with GPS geofence
                  </div>
                </div>

                <span className="badge badge-severe">
                  {sosList.length} IN QUEUE
                </span>
              </div>

              {/* SOS Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sosList.map((sos) => (
                  <div
                    key={sos.id}
                    style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: sos.status === 'Pending' ? '1.5px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      boxShadow: sos.status === 'Pending' ? '0 0 16px rgba(239, 68, 68, 0.15)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ fontSize: '24px' }}>
                        {sos.category === 'Flooding' ? '🌊' : sos.category === 'Road Blocked' ? '🚧' : '🚑'}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                            {sos.id}
                          </span>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#FCA5A5' }}>
                            {sos.category}
                          </span>
                          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                            • {sos.timeAgo}
                          </span>
                        </div>

                        <div style={{ fontSize: '12px', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <MapPin size={13} color="#38BDF8" />
                          <span>{sos.location}</span>
                        </div>

                        {sos.assignedTo ? (
                          <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                            ✓ Assigned to: {sos.assignedTo}
                          </div>
                        ) : (
                          <div style={{ fontSize: '11px', color: '#EF4444', fontWeight: 700 }}>
                            ⚠️ Pending responder assignment
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: VIEW & ASSIGN */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setSelectedSOS(sos)}
                        className="btn-secondary"
                        style={{ padding: '8px 12px', fontSize: '12px' }}
                      >
                        VIEW
                      </button>

                      <button
                        onClick={() => setAssigningSOS(sos)}
                        className="btn-primary"
                        style={{ padding: '8px 14px', fontSize: '12px', background: sos.assignedTo ? '#334155' : undefined }}
                      >
                        {sos.assignedTo ? 'REASSIGN' : 'ASSIGN'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RESPONSE STATUS (Per Specification) */}
            <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '16px', color: '#F8FAFC', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  RESPONSE STATUS
                </h2>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                  Field units deployed across Zone A & B
                </div>
              </div>

              {/* Units List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* 1. Rescue Team 01 — DEPLOYED */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>🚒</span>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                        Rescue Team 01
                      </span>
                    </div>
                    <span className="badge badge-severe" style={{ fontSize: '11px' }}>
                      DEPLOYED
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                    Unit: NDRF Quick Response Force • Pragathi Nagar
                  </div>
                  <div style={{ fontSize: '11px', color: '#CBD5E1' }}>
                    12 personnel • 2 Inflatable Zodiac boats
                  </div>
                </div>

                {/* 2. Medical Team 02 — AVAILABLE */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>🚑</span>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                        Medical Team 02
                      </span>
                    </div>
                    <span className="badge badge-low" style={{ fontSize: '11px' }}>
                      AVAILABLE
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                    Unit: 108 Advanced Life Support • Kukatpally Staging
                  </div>
                  <div style={{ fontSize: '11px', color: '#CBD5E1' }}>
                    4 paramedics • Trauma supplies & portable oxygen
                  </div>
                </div>

                {/* 3. Police Team 03 — MONITORING */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>👮</span>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                        Police Team 03
                      </span>
                    </div>
                    <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)', fontSize: '11px' }}>
                      MONITORING
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                    Unit: Cyberabad Traffic Division • NH-65 Underpass
                  </div>
                  <div style={{ fontSize: '11px', color: '#CBD5E1' }}>
                    18 officers • Lowland barricades & diversion signage
                  </div>
                </div>

              </div>

            </div>

          </div>

        </main>
      </div>

      {/* VIEW SOS DETAILS MODAL */}
      {selectedSOS && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '24px',
              border: '1px solid #EF4444'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
                SOS Incident {selectedSOS.id}
              </div>
              <button onClick={() => setSelectedSOS(null)} style={{ color: '#94A3B8' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#CBD5E1', marginBottom: '20px' }}>
              <div><strong>Reported Hazard:</strong> {selectedSOS.category}</div>
              <div><strong>Citizen Name:</strong> {selectedSOS.reportedBy}</div>
              <div><strong>Contact Number:</strong> {selectedSOS.mobile}</div>
              <div><strong>Location Coordinates:</strong> {selectedSOS.location} (Lat: {selectedSOS.coords.lat}, Lng: {selectedSOS.coords.lng})</div>
              <div><strong>Timestamp:</strong> {selectedSOS.timestamp} ({selectedSOS.timeAgo})</div>
              <div><strong>Field Description:</strong> {selectedSOS.notes}</div>
              <div><strong>Current Assignment:</strong> {selectedSOS.assignedTo || 'Unassigned'}</div>
            </div>

            <button
              onClick={() => setSelectedSOS(null)}
              className="btn-secondary"
              style={{ width: '100%', padding: '10px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ASSIGN UNIT MODAL */}
      {assigningSOS && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '24px',
              border: '1px solid #38BDF8'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>
                Dispatch Unit to {assigningSOS.id} ({assigningSOS.category})
              </div>
              <button onClick={() => setAssigningSOS(null)} style={{ color: '#94A3B8' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '14px' }}>
              Select an available response team to dispatch to {assigningSOS.location}:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
              {MOCK_RESPONDER_TEAMS.map((team) => (
                <div
                  key={team.id}
                  onClick={() => handleAssignConfirm(team.name)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>{team.icon}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                        {team.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                        {team.unit}
                      </div>
                    </div>
                  </div>

                  <span className="badge badge-low" style={{ fontSize: '10px' }}>
                    Dispatch →
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setAssigningSOS(null)}
              className="btn-secondary"
              style={{ width: '100%', padding: '10px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
