import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Shield, Lock, UserCheck, AlertTriangle, KeyRound } from 'lucide-react';
import SimulationBadge from '../../components/common/SimulationBadge';

export default function OfficerLogin() {
  const { navigateTo } = useDemo();
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e?.preventDefault();
    if (!officerId.trim() || !password.trim()) {
      setError('Please provide Officer ID and authorization key.');
      return;
    }
    navigateTo('officer-command', { officerTab: 'dashboard' });
  };

  const handleDemoLogin = () => {
    setOfficerId('OFF-7492');
    setPassword('••••••••••••');
    navigateTo('officer-command', { officerTab: 'dashboard' });
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 46px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        background: 'radial-gradient(ellipse at 50% 30%, #0F223D 0%, #070B14 100%)'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '36px 30px',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #1E1B4B, #312E81)',
              border: '2px solid #818CF8',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818CF8',
              boxShadow: '0 0 24px rgba(99, 102, 241, 0.35)'
            }}
          >
            <Shield size={32} />
          </div>

          <h1 style={{ fontSize: '24px', color: '#F8FAFC', fontWeight: 800, marginBottom: '6px' }}>
            Officer Command Portal
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '13px' }}>
            Authorized Disaster-Management & Emergency Operations Center
          </p>

          <div style={{ marginTop: '10px' }}>
            <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              ⚠️ Authorized personnel only
            </span>
          </div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '10px', borderRadius: '8px', fontSize: '12px' }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
              Officer ID / Badge #
            </label>
            <div style={{ position: 'relative' }}>
              <UserCheck size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#64748B' }} />
              <input
                type="text"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                placeholder="e.g. OFF-7492"
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 38px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
              Secure Password
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#64748B' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 38px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '13px', fontSize: '14px', fontWeight: 700 }}
          >
            LOGIN TO COMMAND CENTER
          </button>
        </form>

        <div style={{ margin: '22px 0 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
          <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase' }}>Authorized Quick Sign In</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
        </div>

        {/* Quick Officer Login Button */}
        <button
          onClick={handleDemoLogin}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
            border: '1px solid #818CF8',
            color: '#C7D2FE',
            fontWeight: 700,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <span>🛡️</span> Quick Officer Sign In (One-Click)
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={() => navigateTo('landing')}
            style={{ color: '#94A3B8', fontSize: '12px' }}
          >
            ← Back to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}
