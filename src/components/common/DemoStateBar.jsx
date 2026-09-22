import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Shield, User, Sliders, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export default function DemoStateBar() {
  const { demoState, switchDemoState, currentView, navigateTo } = useDemo();

  return (
    <header className="demo-controller-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => navigateTo('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          title="Return to SkyShield AI Home"
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #0284C7, #38BDF8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '14px'
          }}>
            🛡️
          </div>
          <span style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '15px', color: '#F8FAFC' }}>
            SKYSHIELD <span style={{ color: '#38BDF8' }}>AI</span>
          </span>
        </button>

        <span className="badge badge-simulation" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} className="animate-pulse-dot" />
          OPERATIONAL NOWCAST SYSTEM
        </span>
      </div>

      {/* Demo Weather State Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.7)', padding: '4px 8px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Weather State:
        </span>

        <button
          onClick={() => switchDemoState('NORMAL')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: '6px',
            background: demoState === 'NORMAL' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
            color: demoState === 'NORMAL' ? '#10B981' : '#64748B',
            border: demoState === 'NORMAL' ? '1px solid #10B981' : '1px solid transparent',
            transition: 'all 0.2s'
          }}
        >
          <CheckCircle size={13} />
          NORMAL (🟢 18%)
        </button>

        <button
          onClick={() => switchDemoState('WARNING')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: '6px',
            background: demoState === 'WARNING' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
            color: demoState === 'WARNING' ? '#F59E0B' : '#64748B',
            border: demoState === 'WARNING' ? '1px solid #F59E0B' : '1px solid transparent',
            transition: 'all 0.2s'
          }}
        >
          <AlertTriangle size={13} />
          WATCH (🟠 78%)
        </button>

        <button
          onClick={() => switchDemoState('SEVERE')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            fontSize: '12px',
            fontWeight: 700,
            borderRadius: '6px',
            background: demoState === 'SEVERE' ? 'rgba(239, 68, 68, 0.3)' : 'transparent',
            color: demoState === 'SEVERE' ? '#EF4444' : '#64748B',
            border: demoState === 'SEVERE' ? '1px solid #EF4444' : '1px solid transparent',
            boxShadow: demoState === 'SEVERE' ? '0 0 10px rgba(239, 68, 68, 0.3)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#EF4444' }} className="animate-pulse-dot" />
          SEVERE (🔴 87%)
        </button>
      </div>

      {/* Role Navigation Quick Jumps */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => navigateTo('citizen-home', { tab: 'home' })}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '12px', borderColor: currentView.startsWith('citizen') ? '#38BDF8' : 'rgba(255,255,255,0.1)' }}
        >
          <User size={13} color="#38BDF8" />
          Citizen App
        </button>

        <button
          onClick={() => navigateTo('officer-command', { officerTab: 'dashboard' })}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '12px', borderColor: currentView.startsWith('officer') ? '#8B5CF6' : 'rgba(255,255,255,0.1)' }}
        >
          <Shield size={13} color="#8B5CF6" />
          Officer Command
        </button>
      </div>
    </header>
  );
}
