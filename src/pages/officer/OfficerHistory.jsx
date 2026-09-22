import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import OfficerHeader from '../../components/officer/OfficerHeader';
import OfficerSidebar from '../../components/officer/OfficerSidebar';
import { MOCK_THREAT_HISTORY } from '../../data/mockOfficerData';
import {
  History,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Activity,
  Users,
  Award,
  Zap,
  CloudRain,
  Waves,
  ArrowRight,
  Filter
} from 'lucide-react';
import SimulationBadge from '../../components/common/SimulationBadge';

export default function OfficerHistory() {
  const { navigateTo } = useDemo();
  const [filterType, setFilterType] = useState('ALL');
  const [expandedId, setExpandedId] = useState('hist-001');

  const filteredHistory = filterType === 'ALL'
    ? MOCK_THREAT_HISTORY
    : MOCK_THREAT_HISTORY.filter(item => item.type === filterType);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#070B14' }}>
      <OfficerHeader />

      <div className="officer-layout">
        <OfficerSidebar activeItem="history" />

        <main className="officer-main" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Top Banner & Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: '#818CF8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  DISASTER AUDIT & MITIGATION LOGS
                </span>
                <SimulationBadge text="OFFICIAL RECORD" subtle />
              </div>
              <h1 style={{ fontSize: '24px', color: '#F8FAFC', fontWeight: 800 }}>
                Incident History & Response Actions
              </h1>
              <p style={{ fontSize: '13px', color: '#94A3B8' }}>
                Comprehensive log of previously detected severe weather threats, operational response workflows, and casualty mitigation outcomes.
              </p>
            </div>

            {/* Overall Mitigation Stats */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="glass-panel" style={{ padding: '10px 16px', textAlign: 'center', borderLeft: '3px solid #10B981' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#10B981' }}>0</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>Casualties</div>
              </div>
              <div className="glass-panel" style={{ padding: '10px 16px', textAlign: 'center', borderLeft: '3px solid #38BDF8' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#38BDF8' }}>94.4%</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>Avg AI Accuracy</div>
              </div>
              <div className="glass-panel" style={{ padding: '10px 16px', textAlign: 'center', borderLeft: '3px solid #8B5CF6' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#A78BFA' }}>6,470</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>Evacuated Safely</div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.7)', padding: '6px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, padding: '0 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={13} /> Filter Incident:
            </span>
            {['ALL', 'CLOUDBURST', 'THUNDERSTORM', 'FLASH_FLOOD'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: filterType === type ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                  color: filterType === type ? '#A5B4FC' : '#94A3B8',
                  border: filterType === type ? '1px solid rgba(129, 140, 248, 0.5)' : '1px solid transparent',
                  cursor: 'pointer'
                }}
              >
                {type === 'ALL' ? 'All Threats' : type === 'CLOUDBURST' ? '⛈️ Cloudbursts' : type === 'THUNDERSTORM' ? '⚡ Thunderstorms' : '🌊 Flash Floods'}
              </button>
            ))}
          </div>

          {/* Historical Threats Accordion List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredHistory.map((item) => {
              const isExpanded = expandedId === item.id;
              const severityColor = item.severity === 'SEVERE' ? '#EF4444' : '#F97316';

              return (
                <div
                  key={item.id}
                  className="glass-panel"
                  style={{
                    borderRadius: '14px',
                    border: isExpanded ? `1.5px solid ${severityColor}` : '1px solid rgba(255,255,255,0.08)',
                    overflow: 'hidden',
                    transition: 'all 0.2s'
                  }}
                >
                  {/* Accordion Header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    style={{
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      background: isExpanded ? 'rgba(15, 23, 42, 0.9)' : 'rgba(15, 23, 42, 0.4)',
                      borderBottom: isExpanded ? '1px solid rgba(255,255,255,0.08)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: `${severityColor}20`,
                          border: `1px solid ${severityColor}50`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px'
                        }}
                      >
                        {item.type === 'CLOUDBURST' ? '⛈️' : item.type === 'THUNDERSTORM' ? '⚡' : '🌊'}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '16px', fontWeight: 800, color: '#F8FAFC' }}>
                            {item.title}
                          </span>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '999px',
                              background: `${severityColor}25`,
                              color: severityColor,
                              border: `1px solid ${severityColor}60`
                            }}
                          >
                            {item.severity}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#94A3B8' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={13} /> {item.date} • {item.time}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={13} /> {item.zone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {/* Lead Time Badge */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase' }}>AI Lead Time</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>
                          {item.aiMetrics.leadTimeProvided}
                        </div>
                      </div>

                      <div style={{ color: '#94A3B8' }}>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detailed Audit Log */}
                  {isExpanded && (
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      
                      {/* 1. What Happened Summary Box */}
                      <div style={{ background: 'rgba(8, 13, 26, 0.7)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                          1. Incident Overview & Meteorological Impact
                        </div>
                        <p style={{ fontSize: '13px', color: '#E2E8F0', lineHeight: 1.5, marginBottom: '12px' }}>
                          {item.whatHappened}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '10px', color: '#64748B' }}>Peak Rainfall</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>{item.peakRainfall}</div>
                          </div>
                          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '10px', color: '#64748B' }}>Catchment Area</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>{item.affectedArea}</div>
                          </div>
                          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '10px', color: '#64748B' }}>Population Exposed</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>{item.populationExposed.toLocaleString()}</div>
                          </div>
                          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '10px', color: '#64748B' }}>Prediction Accuracy</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#10B981' }}>{item.aiMetrics.predictionAccuracy}</div>
                          </div>
                        </div>
                      </div>

                      {/* 2. What Was Done: Step-by-Step Response Actions */}
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#818CF8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                          2. Operational Actions Executed & Response Chronology
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {item.actionsTaken.map((act) => (
                            <div
                              key={act.step}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                background: 'rgba(15, 23, 42, 0.6)',
                                padding: '12px 14px',
                                borderRadius: '8px',
                                borderLeft: '3px solid #818CF8',
                                border: '1px solid rgba(255,255,255,0.05)'
                              }}
                            >
                              <div
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  background: 'rgba(99, 102, 241, 0.25)',
                                  color: '#A5B4FC',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  flexShrink: 0
                                }}
                              >
                                {act.step}
                              </div>

                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>
                                    {act.action}
                                  </span>
                                  <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                                    {act.time}
                                  </span>
                                </div>
                                <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.4 }}>
                                  {act.detail}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3. Outcomes & Damage Mitigation Box */}
                      <div
                        style={{
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
                          borderRadius: '10px',
                          padding: '16px',
                          border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                          3. Mitigation Results & Post-Incident Audit
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                          <div>
                            <div style={{ fontSize: '10px', color: '#94A3B8' }}>Fatalities / Injuries</div>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: '#10B981' }}>{item.outcomes.casualties}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '10px', color: '#94A3B8' }}>Water Rescues</div>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: '#F8FAFC' }}>{item.outcomes.rescuesCompleted} Completed</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '10px', color: '#94A3B8' }}>Shelter Evacuees</div>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: '#F8FAFC' }}>{item.outcomes.evacuatedCitizens.toLocaleString()}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '10px', color: '#94A3B8' }}>Avg SOS Triage</div>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: '#38BDF8' }}>{item.outcomes.sosResolutionAvg}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '10px', color: '#94A3B8' }}>Averted Losses</div>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: '#A78BFA' }}>{item.outcomes.economicLossAverted}</div>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </main>
      </div>
    </div>
  );
}
