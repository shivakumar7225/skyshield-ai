import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { ArrowRight, Phone, User, ShieldCheck, AlertCircle } from 'lucide-react';
import SimulationBadge from '../../components/common/SimulationBadge';

export default function CitizenLogin() {
  const { navigateTo, setCitizenUser, citizenUser } = useDemo();
  const [fullName, setFullName] = useState(citizenUser?.name || 'Aashrith');
  const [mobileNumber, setMobileNumber] = useState(citizenUser?.mobile || '+91 9876543210');
  const [error, setError] = useState('');

  const handleContinue = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const cleanMobile = mobileNumber.replace(/\s+/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Save and navigate to Location Setup
    setCitizenUser((prev) => ({
      ...prev,
      name: fullName.trim(),
      mobile: mobileNumber.trim()
    }));

    navigateTo('citizen-location');
  };

  return (
    <div className="citizen-mobile-viewport" style={{ justifyContent: 'center', padding: '24px 20px', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #0284C7, #38BDF8)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          marginBottom: '16px',
          boxShadow: '0 8px 24px rgba(2, 132, 199, 0.4)'
        }}>
          🛡️
        </div>

        <h1 style={{ fontSize: '26px', color: '#F8FAFC', marginBottom: '8px' }}>
          Welcome, Citizen
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '14px', maxWidth: '320px', margin: '0 auto' }}>
          SkyShield AI delivers hyper-local nowcasting directly to your neighborhood.
        </p>

        <div style={{ marginTop: '12px' }}>
          <SimulationBadge text="SECURE CITIZEN ACCESS" />
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '28px 22px' }}>
        <form onSubmit={handleContinue}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #EF4444',
              color: '#FCA5A5',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '18px'
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', color: '#CBD5E1', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748B' }} />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aashrith"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '15px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', color: '#CBD5E1', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Mobile Number <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748B' }} />
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="+91 98765 43210"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '15px'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: 700 }}
          >
            CONTINUE →
          </button>

          <p style={{ textAlign: 'center', color: '#64748B', fontSize: '12px', marginTop: '16px' }}>
            Instant direct verification active.
          </p>
        </form>
      </div>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button
          onClick={() => navigateTo('landing')}
          style={{ color: '#94A3B8', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          ← Return to Landing Page
        </button>
      </div>
    </div>
  );
}
