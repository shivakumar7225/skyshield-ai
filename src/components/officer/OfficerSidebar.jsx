import React from 'react';
import { useDemo } from '../../context/DemoContext';
import {
  LayoutDashboard,
  Map,
  BellRing,
  BrainCircuit,
  Building2,
  Users,
  AlertOctagon,
  History,
  ShieldCheck,
  Radio
} from 'lucide-react';

export default function OfficerSidebar({ activeItem = 'dashboard' }) {
  const { navigateTo, officerSidebarActive, setOfficerSidebarActive, sosList } = useDemo();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: 'officer-command' },
    { id: 'alerts', label: 'Alerts', icon: BellRing, view: 'officer-impact' },
    { id: 'ai-analysis', label: 'AI Analysis', icon: BrainCircuit, view: 'officer-analysis' },
    { id: 'impact', label: 'Impact Assessment', icon: Building2, view: 'officer-impact' },
    { id: 'sos', label: 'SOS Dispatch', icon: AlertOctagon, view: 'officer-live', badge: sosList.filter(s => s.status === 'Pending').length },
    { id: 'history', label: 'Threat History', icon: History, view: 'officer-history' }
  ];

  const handleNav = (item) => {
    setOfficerSidebarActive(item.id);
    navigateTo(item.view, { officerTab: item.id });
  };

  return (
    <aside className="officer-sidebar" style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 8px 12px' }}>
          Operations Console
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeItem === item.id || officerSidebarActive === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: isSelected ? 'rgba(99, 102, 241, 0.16)' : 'transparent',
                  color: isSelected ? '#A5B4FC' : '#94A3B8',
                  border: isSelected ? '1px solid rgba(129, 140, 248, 0.4)' : '1px solid transparent',
                  fontWeight: isSelected ? 600 : 500,
                  fontSize: '13px',
                  transition: 'all 0.15s',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={16} color={isSelected ? '#818CF8' : '#64748B'} />
                  <span>{item.label}</span>
                </div>

                {item.badge > 0 && (
                  <span
                    style={{
                      background: '#EF4444',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '10px'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Telemetry Health Box */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '10px',
          padding: '12px',
          fontSize: '11px',
          color: '#94A3B8'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontWeight: 700, color: '#CBD5E1' }}>Model Telemetry</span>
          <span style={{ color: '#10B981', fontWeight: 700 }}>99.8% Online</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '10px' }}>
          <div>Radar Link: DWR Hyderabad (Active)</div>
          <div>Satellite: INSAT-3DR Sounder (Live)</div>
          <div>Inference: DeepNowcast v3.2</div>
        </div>
      </div>
    </aside>
  );
}
