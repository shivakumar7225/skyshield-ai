import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { User, Phone, MapPin, Globe, Bookmark, ArrowLeft, LogOut, Edit3, Check } from 'lucide-react';
import SimulationBadge from '../../components/common/SimulationBadge';

export default function CitizenProfile() {
  const { navigateTo, citizenUser, setCitizenUser, selectedLocation } = useDemo();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(citizenUser?.name || 'Aashrith');
  const [mobile, setMobile] = useState(citizenUser?.mobile || '+91 9876543210');
  const [language, setLanguage] = useState(citizenUser?.language || 'English');

  const handleSave = () => {
    setCitizenUser((prev) => ({
      ...prev,
      name,
      mobile,
      language
    }));
    setIsEditing(false);
  };

  const handleLogout = () => {
    navigateTo('landing');
  };

  return (
    <div className="citizen-mobile-viewport" style={{ paddingBottom: '30px' }}>
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(11, 18, 32, 0.95)',
          position: 'sticky',
          top: '46px',
          zIndex: 800,
          backdropFilter: 'blur(12px)'
        }}
      >
        <button
          onClick={() => navigateTo('citizen-home')}
          style={{ color: '#94A3B8', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 style={{ fontSize: '17px', color: '#F8FAFC', fontWeight: 700 }}>
          My Profile
        </h1>

        <SimulationBadge text="CITIZEN ID" />
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Avatar & Main Identity Card */}
        <div className="glass-panel" style={{ padding: '24px 18px', textAlign: 'center' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284C7, #38BDF8)',
              margin: '0 auto 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              border: '3px solid rgba(56, 189, 248, 0.5)',
              boxShadow: '0 4px 16px rgba(56, 189, 248, 0.25)'
            }}
          >
            👤
          </div>

          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '280px', margin: '0 auto' }}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                style={{
                  padding: '8px 12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid #38BDF8',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  fontSize: '16px',
                  fontWeight: 700
                }}
              />
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Mobile"
                style={{
                  padding: '8px 12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#CBD5E1',
                  textAlign: 'center',
                  fontSize: '13px'
                }}
              />
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '20px', color: '#F8FAFC', fontWeight: 800, marginBottom: '4px' }}>
                {citizenUser?.name || 'Aashrith'}
              </h2>
              <div style={{ fontSize: '13px', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                {citizenUser?.mobile || '+91 9876543210'}
              </div>
            </>
          )}

          <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'center' }}>
            <span className="badge badge-low">
              Verified Citizen Profile
            </span>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="glass-panel" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Primary Location */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={18} color="#38BDF8" />
              <div>
                <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Primary Location</div>
                <div style={{ fontSize: '14px', color: '#F8FAFC', fontWeight: 600 }}>{selectedLocation}</div>
              </div>
            </div>
            <button
              onClick={() => navigateTo('citizen-location')}
              style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 600 }}
            >
              Edit
            </button>
          </div>

          <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.06)' }} />

          {/* Language */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={18} color="#8B5CF6" />
              <div>
                <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Alert Language</div>
                <div style={{ fontSize: '14px', color: '#F8FAFC', fontWeight: 600 }}>{language}</div>
              </div>
            </div>
            {isEditing ? (
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  background: '#0F172A',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '12px'
                }}
              >
                <option value="English">English</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
              </select>
            ) : null}
          </div>

          <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.06)' }} />

          {/* Saved Locations */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Bookmark size={16} color="#EAB308" />
              <div style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 600, textTransform: 'uppercase' }}>
                Saved Locations
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '24px' }}>
              <div style={{ fontSize: '13px', color: '#E2E8F0' }}>
                <strong>Home:</strong> Pragathi Nagar, Kukatpally (500072)
              </div>
              <div style={{ fontSize: '13px', color: '#E2E8F0' }}>
                <strong>College:</strong> JNTUH University Campus, Kukatpally (500085)
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: EDIT PROFILE / LOG OUT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="btn-success"
              style={{ width: '100%', padding: '12px', fontSize: '14px' }}
            >
              <Check size={16} /> SAVE CHANGES
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary"
              style={{ width: '100%', padding: '12px', fontSize: '14px' }}
            >
              <Edit3 size={16} /> EDIT PROFILE
            </button>
          )}

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              background: 'rgba(239, 68, 68, 0.08)',
              color: '#F87171',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <LogOut size={16} /> LOG OUT
          </button>
        </div>

      </div>
    </div>
  );
}
