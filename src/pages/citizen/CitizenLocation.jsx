import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Search, MapPin, CheckCircle, Navigation, ArrowRight, Shield } from 'lucide-react';
import { locationService } from '../../services/locationService';
import SimulationBadge from '../../components/common/SimulationBadge';

export default function CitizenLocation() {
  const { navigateTo, selectedLocation, setSelectedLocation, selectedCoords, setSelectedCoords } = useDemo();
  const [searchTerm, setSearchTerm] = useState('');
  const [chosen, setChosen] = useState(selectedLocation || 'Medchal, Telangana, India');
  const [chosenCoords, setChosenCoords] = useState(selectedCoords || { lat: 17.6297, lng: 78.4814 });
  const [locationsList, setLocationsList] = useState(locationService.getPresets());
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let active = true;
    const timeout = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await locationService.search(searchTerm);
        if (active && results) {
          setLocationsList(results);
        }
      } catch (e) {
        // Fallback
      } finally {
        if (active) setSearching(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [searchTerm]);

  const handleStartMonitoring = () => {
    setSelectedLocation(chosen);
    if (chosenCoords) {
      setSelectedCoords(chosenCoords);
    }
    navigateTo('citizen-home', { tab: 'home' });
  };

  return (
    <div className="citizen-mobile-viewport" style={{ padding: '24px 20px', minHeight: '100vh', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <button onClick={() => navigateTo('citizen-login')} style={{ color: '#94A3B8', fontSize: '13px' }}>
            ← Back
          </button>
          <SimulationBadge text="LOCATION SETUP" />
        </div>

        <h1 style={{ fontSize: '24px', color: '#F8FAFC', marginBottom: '6px' }}>
          Set Your Monitoring Location
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '20px' }}>
          SkyShield AI delivers 2–6 hour micro-basin nowcasts tailored to your precise elevation.
        </p>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: '#64748B' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search city, area or pincode (e.g. 500072)"
            style={{
              width: '100%',
              padding: '12px 14px 12px 40px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '10px',
              color: '#FFFFFF',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Selected Location Card */}
        <div
          className="glass-panel-glow"
          style={{
            padding: '16px',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.18) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1.5px solid #0284C7'
          }}
        >
          <div style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            Active Monitoring Target
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>📍</span>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#F8FAFC' }}>
                  {chosen}
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Micro-basin Zone A • Elevation: 540m
                </div>
              </div>
            </div>
            <CheckCircle size={20} color="#10B981" />
          </div>
        </div>

        {/* Presets List */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '10px' }}>
            Suggested Indian Mandals, Villages & Cities:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {locationsList.map((loc, idx) => {
              const isSelected = chosen === loc.name;
              return (
                <div
                  key={loc.id || `loc-${idx}`}
                  onClick={() => {
                    setChosen(loc.name);
                    if (loc.latitude && loc.longitude) {
                      setChosenCoords({ lat: loc.latitude, lng: loc.longitude });
                    }
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin size={16} color={isSelected ? '#38BDF8' : '#64748B'} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: isSelected ? '#FFFFFF' : '#CBD5E1' }}>
                          {loc.name}
                        </span>
                        {loc.place_type && (
                          <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', fontWeight: 700 }}>
                            {loc.place_type}
                          </span>
                        )}
                      </div>
                      {loc.pincode && loc.pincode !== 'N/A' && (
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                          PIN {loc.pincode}
                        </div>
                      )}
                    </div>
                  </div>

                  {loc.highRiskZone && (
                    <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#F87171', fontWeight: 700 }}>
                      High Storm Risk
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <button
          onClick={handleStartMonitoring}
          className="btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: 700 }}
        >
          START MONITORING →
        </button>
      </div>
    </div>
  );
}
