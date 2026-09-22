import React from 'react';
import { Info } from 'lucide-react';

export default function SimulationBadge({ text = 'OFFICIAL • LIVE SYSTEM', subtle = false }) {
  if (subtle) {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '11px',
        color: '#94A3B8',
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        padding: '2px 8px',
        borderRadius: '4px',
        fontFamily: 'var(--font-mono)'
      }}>
        <Info size={11} />
        {text}
      </div>
    );
  }

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '11px',
      fontWeight: 600,
      color: '#38BDF8',
      background: 'rgba(56, 189, 248, 0.12)',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      padding: '3px 10px',
      borderRadius: '6px',
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.04em'
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#38BDF8' }} className="animate-pulse-dot" />
      {text}
    </div>
  );
}
