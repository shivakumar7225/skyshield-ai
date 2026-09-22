import React from 'react';
import { useDemo } from '../context/DemoContext';

export default function LandingPage() {
  const { navigateTo } = useDemo();

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: 'radial-gradient(circle at 50% 45%, #0B192F 0%, #060D1A 45%, #030710 100%)',
        overflow: 'hidden',
        color: '#F8FAFC',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      {/* TOP HEADER */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 32px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Logo Shield Icon */}
          <div
            style={{
              width: '32px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.6))'
            }}
          >
            <svg viewBox="0 0 32 36" fill="none" style={{ width: '100%', height: '100%' }}>
              <path
                d="M16 2L3 6.5V17C3 24.5 8.5 31.2 16 34C23.5 31.2 29 24.5 29 17V6.5L16 2Z"
                fill="#0B213D"
                stroke="#38BDF8"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <path
                d="M16 10L12 18H16L15 24L21 16H17L19 10H16Z"
                fill="#38BDF8"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: '19px',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            SkyShield <span style={{ color: '#00D8FF' }}>AI</span>
          </span>
        </div>
      </header>

      {/* ROTATING RADAR SCANNER & CONCENTRIC CIRCLES BACKGROUND */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 1,
          overflow: 'hidden'
        }}
      >
        {/* CSS Keyframe for rotating radar sweep */}
        <style>{`
          @keyframes radarBeamSweep {
            from {
              transform: translate(-50%, -50%) rotate(0deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(360deg);
            }
          }
          @keyframes pulseShieldGlow {
            0%, 100% {
              filter: drop-shadow(0 0 16px rgba(56, 189, 248, 0.75)) drop-shadow(0 0 36px rgba(2, 132, 199, 0.4));
            }
            50% {
              filter: drop-shadow(0 0 24px rgba(56, 189, 248, 0.95)) drop-shadow(0 0 50px rgba(0, 216, 255, 0.55));
            }
          }
        `}</style>

        {/* Concentric Radar Circles centered at 50% 45% */}
        <svg
          style={{
            position: 'absolute',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '1200px',
            height: '1200px',
            pointerEvents: 'none'
          }}
          viewBox="0 0 1200 1200"
        >
          {/* Circular Rings */}
          <circle cx="600" cy="600" r="110" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" />
          <circle cx="600" cy="600" r="220" fill="none" stroke="rgba(56, 189, 248, 0.11)" strokeWidth="1" />
          <circle cx="600" cy="600" r="340" fill="none" stroke="rgba(56, 189, 248, 0.10)" strokeWidth="1" />
          <circle cx="600" cy="600" r="470" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="1" />
          <circle cx="600" cy="600" r="580" fill="none" stroke="rgba(56, 189, 248, 0.06)" strokeWidth="1" />

          {/* Crosshairs */}
          <line x1="600" y1="20" x2="600" y2="1180" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="1" />
          <line x1="20" y1="600" x2="1180" y2="600" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="1" />
        </svg>

        {/* Rotating Radar Sweep Cone */}
        <div
          style={{
            position: 'absolute',
            top: '45%',
            left: '50%',
            width: '1100px',
            height: '1100px',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, rgba(6, 182, 212, 0.22) 0deg, rgba(6, 182, 212, 0.06) 24deg, transparent 48deg, transparent 360deg)',
            animation: 'radarBeamSweep 7s linear infinite',
            pointerEvents: 'none'
          }}
        />

        {/* Subtle radial ambient blue glow */}
        <div
          style={{
            position: 'absolute',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '460px',
            height: '460px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(2, 132, 199, 0.06) 45%, transparent 70%)',
            filter: 'blur(30px)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* CENTER HERO CONTENT */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '40px 20px',
          maxWidth: '750px',
          margin: '0 auto'
        }}
      >
        {/* Glowing Shield Emblem with Cloud & Bolt */}
        <div
          style={{
            width: '110px',
            height: '125px',
            marginBottom: '20px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulseShieldGlow 4s ease-in-out infinite'
          }}
        >
          <svg viewBox="0 0 100 115" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="shieldBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#00D2FF" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>

              <linearGradient id="shieldBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0F284E" />
                <stop offset="100%" stopColor="#07152B" />
              </linearGradient>

              <linearGradient id="cloudInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>

              <linearGradient id="boltInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#7DD3FC" />
              </linearGradient>
            </defs>

            {/* Shield Body */}
            <path
              d="M 50,4 Q 88,10 94,26 Q 95,68 50,110 Q 5,68 6,26 Q 12,10 50,4 Z"
              fill="url(#shieldBgGrad)"
              stroke="url(#shieldBorderGrad)"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />

            {/* Cloud Icon */}
            <path
              d="M 38,52 C 32,52 28,47 28,42 C 28,37 31,33 36,32 C 37,23 45,18 54,18 C 62,18 69,23 71,30 C 75,31 78,35 78,40 C 78,46 73,51 67,51 L 38,52 Z"
              fill="url(#cloudInnerGrad)"
            />

            {/* Lightning Bolt */}
            <polygon
              points="52,42 44,58 52,58 46,76 62,54 53,54"
              fill="url(#boltInnerGrad)"
              filter="drop-shadow(0 0 4px #38BDF8)"
            />
          </svg>
        </div>

        {/* Title: SkyShield AI */}
        <h1
          style={{
            fontSize: 'clamp(38px, 5.5vw, 56px)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: '0 0 10px 0',
            lineHeight: 1.15,
            color: '#FFFFFF'
          }}
        >
          SkyShield <span style={{ color: '#00D8FF' }}>AI</span>
        </h1>

        {/* Subtitle: Predict the sky. Protect the ground. */}
        <p
          style={{
            fontSize: 'clamp(15px, 2.2vw, 19px)',
            fontWeight: 400,
            color: '#94A3B8',
            letterSpacing: '0.02em',
            margin: '0 0 38px 0'
          }}
        >
          Predict the sky. Protect the ground.
        </p>

        {/* Dual Pill Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            width: '100%'
          }}
        >
          {/* Citizen Login Button (Solid Cyan) */}
          <button
            onClick={() => navigateTo('citizen-login')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 30px',
              minWidth: '180px',
              borderRadius: '12px',
              background: '#00D2FF',
              color: '#061325',
              fontSize: '16px',
              fontWeight: 700,
              boxShadow: '0 4px 20px rgba(0, 210, 255, 0.45), 0 0 12px rgba(56, 189, 248, 0.35)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 26px rgba(0, 210, 255, 0.65), 0 0 18px rgba(56, 189, 248, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 210, 255, 0.45), 0 0 12px rgba(56, 189, 248, 0.35)';
            }}
          >
            <span>Citizen Login</span>
            <span style={{ fontSize: '18px' }}>→</span>
          </button>

          {/* Officer Login Button (Glass Dark Outline) */}
          <button
            onClick={() => navigateTo('officer-login')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 30px',
              minWidth: '180px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(56, 189, 248, 0.45)',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 600,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              backdropFilter: 'blur(8px)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.8)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)';
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.45)';
            }}
          >
            <span>Officer Login</span>
            <span style={{ fontSize: '18px' }}>→</span>
          </button>
        </div>
      </main>
    </div>
  );
}
