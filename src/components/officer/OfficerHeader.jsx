import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Shield, Bell, Clock, User, LogOut, Radio } from 'lucide-react';
import SimulationBadge from '../common/SimulationBadge';

export default function OfficerHeader() {
  const { officerUser, navigateTo, sosList } = useDemo();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const pendingSosCount = sosList.filter((s) => s.status === 'Pending').length;

  return (
    <header
      style={{
        height: '60px',
        background: '#090E1A',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 500,
        position: 'sticky',
        top: '46px'
      }}
    >
      {/* Brand & Section Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #1E1B4B, #4F46E5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#A5B4FC',
              fontWeight: 800
            }}
          >
            🛡️
          </div>
          <div>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
              SKYSHIELD <span style={{ color: '#818CF8' }}>COMMAND</span>
            </span>
          </div>
        </div>

        <div style={{ height: '20px', width: '1px', background: 'rgba(255, 255, 255, 0.12)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#CBD5E1' }}>
            Integrated Disaster Operations Center
          </span>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} className="animate-pulse-dot" />
        </div>
      </div>

      {/* Center/Right Status & Time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <SimulationBadge text="OPERATIONAL CENTER ACTIVE" />

        {/* Live Clock */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: '#38BDF8'
          }}
        >
          <Clock size={13} />
          <span>{timeStr || '13:26:00 IST'}</span>
        </div>

        {/* Notifications Icon with Pending SOS count */}
        <button
          onClick={() => navigateTo('officer-live')}
          title="Active Emergency SOS Feed"
          style={{
            position: 'relative',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#CBD5E1'
          }}
        >
          <Bell size={16} />
          {pendingSosCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#EF4444',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '10px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {pendingSosCount}
            </span>
          )}
        </button>

        {/* Officer Profile Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '5px 12px 5px 6px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #4338CA, #6366F1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700
            }}
          >
            VR
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC' }}>
              {officerUser?.name || 'Cmdr. Vikram Rathore'}
            </div>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>
              OFF-7492 • GHMC ICCC
            </div>
          </div>

          <button
            onClick={() => navigateTo('officer-login')}
            title="Log Out Officer Session"
            style={{ marginLeft: '4px', color: '#64748B', display: 'flex', alignItems: 'center' }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
