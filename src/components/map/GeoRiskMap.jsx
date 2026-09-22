import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useDemo } from '../../context/DemoContext';
import { apiClient } from '../../services/apiClient';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Compass,
  MapPin,
  Shield,
  AlertTriangle,
  Eye
} from 'lucide-react';

// Strict geographic boundaries of the Republic of India
const INDIA_BOUNDS = [
  [6.0, 68.0],   // Southwest corner (Kanyakumari / Arabian Sea)
  [37.5, 97.5]   // Northeast corner (Kashmir / Arunachal Pradesh)
];

// Helper to construct Google Maps tile URLs with API key support
const getGoogleTileUrl = (type, apiKey) => {
  const lyrs = type === 'SATELLITE' ? 'y' : 'm'; // 'y' = Hybrid (Satellite + Labels), 'm' = Roadmap
  const cleanKey = apiKey ? apiKey.trim() : '';
  if (cleanKey && cleanKey.length > 5) {
    return `https://mt1.google.com/vt/lyrs=${lyrs}&x={x}&y={y}&z={z}&key=${cleanKey}`;
  }
  return `https://mt1.google.com/vt/lyrs=${lyrs}&x={x}&y={y}&z={z}`;
};

export default function GeoRiskMap({
  height = 480,
  showControls = true,
  officerMode = false
}) {
  const {
    demoState,
    selectedLocation,
    selectedCoords,
    setSelectedCoords,
    setSelectedLocation,
    sosList = [],
    selectedShelter
  } = useDemo();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const baseTileLayerRef = useRef(null);
  const overlaysGroupRef = useRef(null);

  // Active View Mode: 'SATELLITE' | 'GRAVICAL'
  const [viewMode, setViewMode] = useState('SATELLITE');
  const [showShelters, setShowShelters] = useState(true);
  const [showSOS, setShowSOS] = useState(true);
  const [showRiskZones, setShowRiskZones] = useState(true);

  // Google Maps API Key from localStorage or env
  const [googleMapsKey, setGoogleMapsKey] = useState(
    () => localStorage.getItem('skyshield_google_maps_key') || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  );

  // Live Latitude & Longitude HUD stats
  const [cursorCoords, setCursorCoords] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: selectedCoords?.lat || 17.6297,
    lng: selectedCoords?.lng || 78.4814
  });
  const [currentZoom, setCurrentZoom] = useState(13);

  const isSevere = demoState === 'SEVERE';
  const isWarning = demoState === 'WARNING';
  const locShort = selectedLocation ? selectedLocation.split(',')[0].trim() : 'Mandal';

  // Format decimal degrees to clean Lat/Lon notation
  const formatCoord = (lat, lng) => {
    if (lat === undefined || lng === undefined) return '';
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
  };

  // Convert decimal to Degrees, Minutes, Seconds (DMS)
  const toDMS = (coord, isLat) => {
    if (coord === undefined || coord === null || isNaN(coord)) return '';
    const dir = isLat ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    const abs = Math.abs(coord);
    const d = Math.floor(abs);
    const m = Math.floor((abs - d) * 60);
    const s = ((abs - d - m / 60) * 3600).toFixed(1);
    return `${d}° ${m}' ${s}" ${dir}`;
  };

  // Synchronize keys with backend /api/config/maps on mount
  useEffect(() => {
    async function syncConfigKeys() {
      try {
        const config = await apiClient.get('/api/config/maps');
        if (config?.google_maps?.key && !googleMapsKey) {
          setGoogleMapsKey(config.google_maps.key);
          localStorage.setItem('skyshield_google_maps_key', config.google_maps.key);
        }
      } catch (e) {}
    }
    syncConfigKeys();
  }, []);

  // 1. Initialize Leaflet Map bounded strictly to India (with strict container cleanup)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up any stale leaflet container instance on mount/remount
    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {}
      mapInstanceRef.current = null;
    }

    const initialLat = selectedCoords?.lat || 17.6297;
    const initialLng = selectedCoords?.lng || 78.4814;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      minZoom: 4.5,             // Prevents zooming out beyond India
      maxZoom: 20,              // Allows deep village, road and rooftop level zoom
      maxBounds: INDIA_BOUNDS,  // Strictly restricts pan to India
      maxBoundsViscosity: 1.0,  // Rigid boundary bounce
      zoomControl: false,       // Custom UI controls
      attributionControl: false
    });

    // Base Tile Layer (Google Satellite / Hybrid)
    const baseTile = L.tileLayer(getGoogleTileUrl('SATELLITE', googleMapsKey), {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);
    baseTileLayerRef.current = baseTile;

    // Layer group for all markers and polygon layers
    const overlaysGroup = L.layerGroup().addTo(map);
    overlaysGroupRef.current = overlaysGroup;

    // Event handlers for real-time Coordinates HUD
    map.on('mousemove', (e) => {
      setCursorCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    map.on('move', () => {
      const center = map.getCenter();
      setMapCenter({ lat: center.lat, lng: center.lng });
      setCurrentZoom(map.getZoom());
    });

    // Click on map to inspect coordinates strictly within India
    map.on('click', (e) => {
      const lat = parseFloat(e.latlng.lat.toFixed(5));
      const lng = parseFloat(e.latlng.lng.toFixed(5));
      const isInsideIndia = (lat >= 6.0 && lat <= 37.5 && lng >= 68.0 && lng <= 97.5);

      if (!isInsideIndia) {
        const popupWarning = `
          <div style="font-family: system-ui; padding: 6px; min-width: 220px; color: #0F172A;">
            <div style="font-size: 10px; font-weight: 800; color: #EF4444; text-transform: uppercase; margin-bottom: 2px;">
              🇮🇳 RESTRICTED TO INDIA ONLY
            </div>
            <div style="font-size: 12px; font-weight: 700; color: #1E293B; margin-bottom: 4px;">
              Location outside Indian Territory
            </div>
            <div style="font-size: 11px; color: #64748B; line-height: 1.3;">
              VarshDrishti risk assessments & nowcasting are strictly dedicated to the Republic of India (WGS84 6°N–37.5°N, 68°E–97.5°E).
            </div>
          </div>
        `;
        L.popup({ offset: [0, -10] })
          .setLatLng(e.latlng)
          .setContent(popupWarning)
          .openOn(map);
        return;
      }

      const popupContent = `
        <div style="font-family: system-ui; padding: 4px; min-width: 200px; color: #0F172A;">
          <div style="font-size: 10px; font-weight: 800; color: #0284C7; text-transform: uppercase; margin-bottom: 2px;">
            🇮🇳 INDIAN GEODETIC PINPOINT (WGS84)
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #0F172A;">
            ${Math.abs(lat).toFixed(4)}° N, ${Math.abs(lng).toFixed(4)}° E
          </div>
          <div style="font-size: 11px; color: #64748B; margin: 2px 0;">
            DMS: ${toDMS(lat, true)}, ${toDMS(lng, false)}
          </div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 8px;">
            Republic of India • Elevation: ~540m MSL
          </div>
          <button id="btn-select-mandal" style="
            width: 100%;
            background: #0284C7;
            color: white;
            border: none;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
          ">
            📍 Set Active Nowcast Location
          </button>
        </div>
      `;

      L.popup({ offset: [0, -10] })
        .setLatLng(e.latlng)
        .setContent(popupContent)
        .openOn(map);

      setTimeout(() => {
        const btn = document.getElementById('btn-select-mandal');
        if (btn) {
          btn.onclick = () => {
            setSelectedCoords({ lat, lng });
            setSelectedLocation(`Mandal Sector (${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E)`);
            map.closePopup();
          };
        }
      }, 50);
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {}
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current && mapContainerRef.current._leaflet_id) {
        delete mapContainerRef.current._leaflet_id;
      }
    };
  }, []);

  // 2. Smoothly pan/fly map when selectedCoords change
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedCoords) return;
    const { lat, lng } = selectedCoords;
    if (lat && lng) {
      mapInstanceRef.current.flyTo([lat, lng], 13, {
        duration: 1.2
      });
    }
  }, [selectedCoords]);

  // 3. Switch Base Tile Layer according to viewMode (Satellite vs Graphical)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }

    const tileUrl = viewMode === 'SATELLITE'
      ? getGoogleTileUrl('SATELLITE', googleMapsKey)
      : getGoogleTileUrl('GRAVICAL', googleMapsKey);

    const newTile = L.tileLayer(tileUrl, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3', 'a', 'b', 'c', 'd']
    }).addTo(map);

    baseTileLayerRef.current = newTile;
  }, [viewMode, googleMapsKey]);

  // 4. Dynamic Overlays (Risk Polygons, Radar Rings, Shelters, SOS) localized to selectedCoords & locShort
  useEffect(() => {
    const group = overlaysGroupRef.current;
    if (!group) return;
    group.clearLayers();

    const centerLat = selectedCoords?.lat || 17.6297;
    const centerLng = selectedCoords?.lng || 78.4814;

    // A. Center Point Marker (Current User / Selected Mandal Center)
    const centerPulseIcon = L.divIcon({
      className: 'center-pulse-marker',
      html: `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(56, 189, 248, 0.4); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="background: #0284C7; border: 2.5px solid white; border-radius: 50%; width: 16px; height: 16px; box-shadow: 0 0 12px #38BDF8;"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const centerMarker = L.marker([centerLat, centerLng], { icon: centerPulseIcon });
    centerMarker.bindTooltip(
      `<div style="font-weight: 800; color: #0284C7;">📍 Selected Location</div><div>${selectedLocation}</div>`,
      { permanent: false, direction: 'top' }
    );
    group.addLayer(centerMarker);

    // B. Risk Polygons (Zone A - High Risk Red, Zone B - Moderate Orange)
    if (showRiskZones) {
      const zoneAPolygon = L.polygon(
        [
          [centerLat + 0.012, centerLng - 0.012],
          [centerLat + 0.018, centerLng + 0.006],
          [centerLat + 0.005, centerLng + 0.019],
          [centerLat - 0.014, centerLng + 0.012],
          [centerLat - 0.011, centerLng - 0.008]
        ],
        {
          color: isSevere ? '#EF4444' : isWarning ? '#F59E0B' : '#3B82F6',
          fillColor: isSevere ? '#EF4444' : isWarning ? '#F59E0B' : '#3B82F6',
          fillOpacity: 0.35,
          weight: 2.5,
          dashArray: isSevere ? '6, 6' : undefined
        }
      );
      zoneAPolygon.bindTooltip(
        `<div style="font-weight: 800; color: #EF4444;">🔴 Zone A: Catchment Inundation Risk (${isSevere ? '87% SEVERE' : '45% WATCH'})</div><div>Low-lying basin corridor near ${locShort}</div>`,
        { sticky: true }
      );
      group.addLayer(zoneAPolygon);

      const zoneBPolygon = L.polygon(
        [
          [centerLat + 0.008, centerLng - 0.025],
          [centerLat + 0.025, centerLng - 0.038],
          [centerLat + 0.032, centerLng - 0.022],
          [centerLat + 0.018, centerLng - 0.009]
        ],
        {
          color: '#F97316',
          fillColor: '#F97316',
          fillOpacity: 0.25,
          weight: 2
        }
      );
      zoneBPolygon.bindTooltip(
        `<div style="font-weight: 800; color: #F97316;">🟠 Zone B: Surface Inflow Corridor (81%)</div>`,
        { sticky: true }
      );
      group.addLayer(zoneBPolygon);

      // Inundated Hazard Point
      const hazardIcon = L.divIcon({
        className: 'hazard-icon',
        html: `
          <div style="background: rgba(239, 68, 68, 0.95); border: 2px solid white; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; font-weight: 900; box-shadow: 0 0 14px rgba(239, 68, 68, 0.9);">
            ⚠️
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const hazardMarker = L.marker([centerLat - 0.008, centerLng + 0.003], { icon: hazardIcon });
      hazardMarker.bindTooltip(
        `<div style="font-weight: 800; color: #EF4444;">⛔ FLOODED: Low-Lying Underpass Corridor</div><div>Water depth 1.4m • Blocked near ${locShort}</div>`,
        { permanent: true, direction: 'right' }
      );
      group.addLayer(hazardMarker);
    }

    // C. Doppler Radar Reflectivity Rings
    if (officerMode) {
      [1500, 3200, 5000].forEach((radius) => {
        const ring = L.circle([centerLat, centerLng], {
          radius,
          color: 'rgba(56, 189, 248, 0.35)',
          weight: 1,
          dashArray: '3, 6',
          fill: false
        });
        group.addLayer(ring);
      });
    }

    // D. Safe Shelters localized to active Mandal
    if (showShelters) {
      const shelters = [
        {
          id: 'sh-01',
          name: `${locShort} Community Relief Centre`,
          lat: centerLat + 0.012,
          lng: centerLng + 0.014,
          capacity: '320 / 500'
        },
        {
          id: 'sh-02',
          name: `${locShort} Government School Relief Camp`,
          lat: centerLat - 0.014,
          lng: centerLng + 0.022,
          capacity: '180 / 350'
        },
        {
          id: 'sh-03',
          name: `${locShort} Cyclone & Sports Shelter`,
          lat: centerLat + 0.018,
          lng: centerLng - 0.012,
          capacity: '440 / 800'
        }
      ];

      shelters.forEach((sh) => {
        const shelterIcon = L.divIcon({
          className: 'shelter-icon',
          html: `
            <div style="background: #10B981; border: 2px solid white; border-radius: 8px; padding: 4px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.6); width: 26px; height: 26px;">
              <span style="font-size: 14px;">🛡️</span>
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const sm = L.marker([sh.lat, sh.lng], { icon: shelterIcon });
        sm.bindTooltip(
          `<div style="font-weight: 800; color: #10B981;">🏫 ${sh.name}</div><div>Capacity: ${sh.capacity} • Safe Elevated Terrain</div>`,
          { direction: 'top' }
        );
        group.addLayer(sm);
      });
    }

    // E. Citizen Emergency SOS Pins
    if (showSOS && sosList && sosList.length > 0) {
      sosList.slice(0, 4).forEach((sos, idx) => {
        const sosLat = centerLat + (idx === 0 ? -0.006 : idx === 1 ? 0.014 : -0.012);
        const sosLng = centerLng + (idx === 0 ? 0.008 : idx === 1 ? -0.015 : -0.018);

        const sosIcon = L.divIcon({
          className: 'sos-pin-icon',
          html: `
            <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(239, 68, 68, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="background: #EF4444; border: 2px solid white; border-radius: 50%; width: 18px; height: 18px; color: white; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; box-shadow: 0 0 10px #EF4444;">
                !
              </div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const sosMarker = L.marker([sosLat, sosLng], { icon: sosIcon });
        sosMarker.bindTooltip(
          `<div style="font-weight: 800; color: #EF4444;">🚨 Emergency SOS ${sos.id}</div><div>${sos.category || 'Trapped in Water'} • ${sos.status || 'Pending'}</div>`,
          { direction: 'right' }
        );
        group.addLayer(sosMarker);
      });
    }
  }, [selectedCoords, selectedLocation, demoState, showRiskZones, showShelters, showSOS, viewMode, sosList]);

  // Zoom helpers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  // Reset to All India Subcontinent View
  const handleResetIndia = () => {
    mapInstanceRef.current?.fitBounds(INDIA_BOUNDS, {
      padding: [20, 20]
    });
  };

  // Focus Back to Selected Mandal / Coordinates
  const handleFocusMandal = () => {
    if (selectedCoords?.lat && selectedCoords?.lng) {
      mapInstanceRef.current?.flyTo([selectedCoords.lat, selectedCoords.lng], 13);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        height: `${height}px`,
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1.5px solid rgba(56, 189, 248, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* 1. Leaflet Map Canvas Div */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          background: '#070B14'
        }}
      />

      {/* 2. Top Controls Bar: View Modes & India Badge */}
      {showControls && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            zIndex: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            pointerEvents: 'none'
          }}
        >
          {/* View Modes: Satellite & Graphical */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(7, 11, 20, 0.92)',
              padding: '4px',
              borderRadius: '10px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              backdropFilter: 'blur(12px)',
              pointerEvents: 'auto',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              gap: '4px'
            }}
          >
            {/* Satellite View */}
            <button
              onClick={() => setViewMode('SATELLITE')}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: viewMode === 'SATELLITE' ? '#0284C7' : 'transparent',
                color: viewMode === 'SATELLITE' ? '#FFFFFF' : '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s ease'
              }}
            >
              🛰️ Satellite (HD)
            </button>

            {/* Graphical View */}
            <button
              onClick={() => setViewMode('GRAVICAL')}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: viewMode === 'GRAVICAL' ? '#0284C7' : 'transparent',
                color: viewMode === 'GRAVICAL' ? '#FFFFFF' : '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s ease'
              }}
            >
              🗺️ Graphical
            </button>
          </div>

          {/* Right Action: Country Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', pointerEvents: 'auto' }}>
            <div
              style={{
                background: 'rgba(7, 11, 20, 0.88)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '8px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#38BDF8',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>🇮🇳</span>
              <span>INDIA ONLY</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Floating Right Action Controls (Zoom & Focus) */}
      <div
        style={{
          position: 'absolute',
          right: '12px',
          top: '64px',
          zIndex: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        <button
          onClick={handleZoomIn}
          title="Zoom In (Village / Street scale)"
          style={{
            width: '34px',
            height: '34px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
        >
          <ZoomIn size={16} />
        </button>

        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          style={{
            width: '34px',
            height: '34px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
        >
          <ZoomOut size={16} />
        </button>

        <button
          onClick={handleFocusMandal}
          title={`Focus ${locShort}`}
          style={{
            width: '34px',
            height: '34px',
            background: 'rgba(2, 132, 199, 0.9)',
            border: '1px solid rgba(56, 189, 248, 0.5)',
            borderRadius: '8px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)'
          }}
        >
          <Crosshair size={16} />
        </button>

        <button
          onClick={handleResetIndia}
          title="Overview Entire India"
          style={{
            width: '34px',
            height: '34px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            color: '#F8FAFC',
            fontSize: '14px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          🇮🇳
        </button>
      </div>

      {/* 4. Bottom Coordinates HUD Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          right: '10px',
          zIndex: 400,
          background: 'rgba(7, 11, 20, 0.94)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}
      >
        {/* Left: Active Coords in Decimal & DMS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11px', fontFamily: 'monospace', flexWrap: 'wrap' }}>
          <div>
            <span style={{ color: '#94A3B8' }}>PINPOINT: </span>
            <span style={{ color: '#38BDF8', fontWeight: 700 }}>
              {cursorCoords ? formatCoord(cursorCoords.lat, cursorCoords.lng) : formatCoord(mapCenter.lat, mapCenter.lng)}
            </span>
          </div>

          <div>
            <span style={{ color: '#94A3B8' }}>DMS: </span>
            <span style={{ color: '#F8FAFC', fontWeight: 600 }}>
              {cursorCoords ? `${toDMS(cursorCoords.lat, true)}, ${toDMS(cursorCoords.lng, false)}` : `${toDMS(mapCenter.lat, true)}, ${toDMS(mapCenter.lng, false)}`}
            </span>
          </div>

          <div>
            <span style={{ color: '#94A3B8' }}>SCALE: </span>
            <span style={{ color: '#10B981', fontWeight: 600 }}>
              Z{currentZoom} ({currentZoom >= 15 ? 'Street' : currentZoom >= 12 ? 'Mandal' : currentZoom >= 9 ? 'District' : 'State'})
            </span>
          </div>
        </div>

        {/* Right: Layer Toggles (Shelters & SOS) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setShowShelters((p) => !p)}
            style={{
              background: showShelters ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              border: `1px solid ${showShelters ? '#10B981' : 'rgba(255,255,255,0.1)'}`,
              color: showShelters ? '#10B981' : '#94A3B8',
              fontSize: '10px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🛡️ Shelters
          </button>

          <button
            onClick={() => setShowSOS((p) => !p)}
            style={{
              background: showSOS ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
              border: `1px solid ${showSOS ? '#EF4444' : 'rgba(255,255,255,0.1)'}`,
              color: showSOS ? '#EF4444' : '#94A3B8',
              fontSize: '10px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🚨 SOS
          </button>
        </div>
      </div>
    </div>
  );
}
