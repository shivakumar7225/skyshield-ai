import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useDemo } from '../../context/DemoContext';
import {
  ShieldCheck,
  MapPin,
  Navigation,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Crosshair,
  ExternalLink,
  Layers,
  Compass,
  Footprints,
  Car
} from 'lucide-react';

const getGoogleTileUrl = (type) => {
  const lyrs = type === 'SATELLITE' ? 'y' : 'm'; // 'y' = Hybrid Satellite + Roads/Labels, 'm' = Roadmap
  return `https://mt1.google.com/vt/lyrs=${lyrs}&x={x}&y={y}&z={z}`;
};

export default function ShelterRouteMiniMap({
  shelter,
  height = 280,
  showControls = true,
  expanded = false,
  onStepClick = null
}) {
  const { selectedCoords, selectedLocation } = useDemo();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const baseLayerRef = useRef(null);
  const routeLayerGroupRef = useRef(null);

  const [tileMode, setTileMode] = useState('SATELLITE'); // 'SATELLITE' | 'STREET'
  const [activeStepIndex, setActiveStepIndex] = useState(null);

  // Compute Origin (Citizen location) & Destination (Shelter location)
  const originLat = selectedCoords?.lat || 17.4947;
  const originLng = selectedCoords?.lng || 78.3996;

  const destLat = shelter?.lat || (shelter?.offsetLat ? originLat + shelter.offsetLat : originLat + 0.0078);
  const destLng = shelter?.lng || (shelter?.offsetLng ? originLng + shelter.offsetLng : originLng + 0.0072);

  // Initialize and Render Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {}
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [(originLat + destLat) / 2, (originLng + destLng) / 2],
      zoom: 15,
      minZoom: 10,
      maxZoom: 20,
      zoomControl: false,
      attributionControl: false
    });

    const tileLayer = L.tileLayer(getGoogleTileUrl(tileMode), {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);
    baseLayerRef.current = tileLayer;

    const routeGroup = L.layerGroup().addTo(map);
    routeLayerGroupRef.current = routeGroup;

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {}
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update base tile when tileMode changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseLayerRef.current) {
      map.removeLayer(baseLayerRef.current);
    }
    const tileLayer = L.tileLayer(getGoogleTileUrl(tileMode), {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);
    baseLayerRef.current = tileLayer;
  }, [tileMode]);

  // Render Route, Markers, and Waypoints
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = routeLayerGroupRef.current;
    if (!map || !group || !shelter) return;

    group.clearLayers();

    // 1. Calculate realistic waypoints along roads avoiding flood zones
    let waypoints = [];
    if (shelter.routeWaypoints && shelter.routeWaypoints.length > 0) {
      waypoints = shelter.routeWaypoints.map(([dLat, dLng]) => [originLat + dLat, originLng + dLng]);
    } else {
      // Dynamic fallback high-ground detour path
      const midLat = (originLat + destLat) / 2 + 0.002;
      const midLng = (originLng + destLng) / 2 - 0.0015;
      waypoints = [
        [originLat, originLng],
        [originLat + (destLat - originLat) * 0.3, originLng + 0.001],
        [midLat, midLng],
        [destLat - 0.001, destLng - 0.001],
        [destLat, destLng]
      ];
    }

    // 2. Waterlogged Hazard Obstacle (Bypassed flood zone)
    const obstLat = shelter.floodObstacle?.lat || (originLat + destLat) / 2 - 0.0015;
    const obstLng = shelter.floodObstacle?.lng || (originLng + destLng) / 2 + 0.002;
    const obstRadius = shelter.floodObstacle?.radius || 120;

    const floodZone = L.circle([obstLat, obstLng], {
      radius: obstRadius,
      color: '#EF4444',
      fillColor: '#EF4444',
      fillOpacity: 0.35,
      weight: 2,
      dashArray: '4, 4'
    });
    floodZone.bindTooltip(
      `<div style="font-size: 11px; font-weight: 700; color: #EF4444;">⚠️ INUNDATED (Bypassed)</div><div style="font-size: 10px; color: #1E293B;">${shelter.floodObstacle?.label || 'Water depth >1.2m'}</div>`,
      { sticky: true }
    );
    group.addLayer(floodZone);

    // 3. Glowing Elevation-Aware Safe Route Line
    // Background glow
    const routeGlow = L.polyline(waypoints, {
      color: '#34D399',
      weight: 8,
      opacity: 0.3,
      lineCap: 'round',
      lineJoin: 'round'
    });
    group.addLayer(routeGlow);

    // Foreground High-Visibility Route
    const routeLine = L.polyline(waypoints, {
      color: '#10B981',
      weight: 4.5,
      opacity: 0.95,
      dashArray: '6, 6',
      lineCap: 'round',
      lineJoin: 'round'
    });
    group.addLayer(routeLine);

    // 4. Starting Location Marker (Citizen / User)
    const userIcon = L.divIcon({
      className: 'user-pin',
      html: `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background: rgba(56, 189, 248, 0.45); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="background: #0284C7; border: 2.5px solid #FFFFFF; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px #38BDF8;">
            <div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    const userMarker = L.marker([originLat, originLng], { icon: userIcon });
    userMarker.bindTooltip(
      `<div style="font-weight: 800; color: #0284C7;">📍 YOUR LOCATION</div><div>${selectedLocation}</div>`,
      { permanent: false, direction: 'top' }
    );
    group.addLayer(userMarker);

    // 5. Destination Marker (Safe Shelter)
    const shelterIcon = L.divIcon({
      className: 'shelter-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="background: #059669; border: 2px solid #FFFFFF; border-radius: 8px; padding: 4px 8px; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.7); color: white; font-size: 11px; font-weight: 800; white-space: nowrap;">
            <span>🛡️</span>
            <span>${shelter.name ? shelter.name.slice(0, 18) : 'Safe Shelter'}</span>
          </div>
          <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #059669;"></div>
        </div>
      `,
      iconSize: [140, 36],
      iconAnchor: [70, 36]
    });
    const destMarker = L.marker([destLat, destLng], { icon: shelterIcon });
    destMarker.bindTooltip(
      `<div style="font-weight: 800; color: #10B981;">🏫 ${shelter.name}</div><div>${shelter.elevation || 'High Ground Safe Zone'} • Capacity: ${shelter.capacity}</div>`,
      { permanent: false, direction: 'top' }
    );
    group.addLayer(destMarker);

    // 6. Step Waypoint Pins along the path
    if (shelter.route && shelter.route.length > 0) {
      shelter.route.forEach((stepItem, idx) => {
        const wpCoord = waypoints[Math.min(idx + 1, waypoints.length - 1)];
        if (!wpCoord) return;

        const isHighlight = !!stepItem.highlight;
        const stepIcon = L.divIcon({
          className: 'step-waypoint',
          html: `
            <div style="
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background: ${isHighlight ? '#F59E0B' : '#10B981'};
              border: 2px solid white;
              color: white;
              font-size: 10px;
              font-weight: 800;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 6px rgba(0,0,0,0.5);
              cursor: pointer;
            ">
              ${stepItem.step}
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        const stepMarker = L.marker(wpCoord, { icon: stepIcon });
        stepMarker.bindTooltip(
          `<div style="font-weight: 700; color: ${isHighlight ? '#D97706' : '#10B981'};">Step ${stepItem.step} (${stepItem.dist})</div><div style="font-size: 11px; color: #1E293B;">${stepItem.instruction}</div>`,
          { direction: 'top' }
        );
        stepMarker.on('click', () => {
          setActiveStepIndex(idx);
          if (onStepClick) onStepClick(stepItem, idx);
        });
        group.addLayer(stepMarker);
      });
    }

    // Auto fit map bounds to comfortably show whole route
    const bounds = L.latLngBounds([
      [originLat, originLng],
      [destLat, destLng],
      ...waypoints,
      [obstLat, obstLng]
    ]);
    map.fitBounds(bounds, { padding: [35, 35] });
  }, [shelter, selectedCoords, selectedLocation]);

  // External Navigation to Google Maps
  const handleOpenGoogleMapsNav = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=walking`;
    window.open(url, '_blank');
  };

  const handleRecenterRoute = () => {
    if (!mapInstanceRef.current) return;
    const bounds = L.latLngBounds([[originLat, originLng], [destLat, destLng]]);
    mapInstanceRef.current.fitBounds(bounds, { padding: [35, 35] });
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        borderRadius: '14px',
        overflow: 'hidden',
        border: '1.5px solid rgba(16, 185, 129, 0.35)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
        background: '#070C16'
      }}
    >
      {/* 1. Leaflet Map Canvas */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          background: '#070C16'
        }}
      />

      {/* 2. Top Bar: Satellite Mode Toggle & Route Status */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          zIndex: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'none',
          gap: '8px'
        }}
      >
        {/* Layer Mode Switch */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(11, 18, 32, 0.92)',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            backdropFilter: 'blur(10px)',
            pointerEvents: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}
        >
          <button
            onClick={() => setTileMode('SATELLITE')}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              fontWeight: 700,
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              background: tileMode === 'SATELLITE' ? '#0284C7' : 'transparent',
              color: tileMode === 'SATELLITE' ? '#FFFFFF' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>🛰️</span>
            <span>Satellite</span>
          </button>
          <button
            onClick={() => setTileMode('STREET')}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              fontWeight: 700,
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              background: tileMode === 'STREET' ? '#0284C7' : 'transparent',
              color: tileMode === 'STREET' ? '#FFFFFF' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>🗺️</span>
            <span>Street</span>
          </button>
        </div>

        {/* Live Safety Badge */}
        <div
          style={{
            background: 'rgba(6, 78, 59, 0.9)',
            border: '1px solid #10B981',
            borderRadius: '8px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#A7F3D0',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            pointerEvents: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
          }}
        >
          <ShieldCheck size={13} color="#34D399" />
          <span>High-Ground Route • {shelter?.elevationGain || '+18m High Ground'}</span>
        </div>
      </div>

      {/* 3. Floating Right Control Buttons */}
      {showControls && (
        <div
          style={{
            position: 'absolute',
            right: '10px',
            top: '50px',
            zIndex: 400,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            title="Zoom In"
            style={{
              width: '32px',
              height: '32px',
              background: 'rgba(15, 23, 42, 0.92)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '7px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ZoomIn size={15} />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            title="Zoom Out"
            style={{
              width: '32px',
              height: '32px',
              background: 'rgba(15, 23, 42, 0.92)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '7px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ZoomOut size={15} />
          </button>
          <button
            onClick={handleRecenterRoute}
            title="Fit Route to Screen"
            style={{
              width: '32px',
              height: '32px',
              background: 'rgba(2, 132, 199, 0.92)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '7px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Crosshair size={15} />
          </button>
        </div>
      )}

      {/* 4. Bottom Quick Nav HUD */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          right: '8px',
          zIndex: 400,
          background: 'rgba(11, 18, 32, 0.94)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRadius: '9px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#CBD5E1' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38BDF8', fontWeight: 700 }}>
            <Footprints size={13} /> {shelter?.walkingTime || '14 mins'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94A3B8' }}>
            <Car size={13} /> {shelter?.drivingTime || '4 mins'}
          </span>
          <span style={{ color: '#10B981', fontWeight: 600 }}>
            📏 {shelter?.distance || '1.2 km'}
          </span>
        </div>

        <button
          onClick={handleOpenGoogleMapsNav}
          style={{
            background: '#059669',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '10px',
            fontWeight: 700,
            padding: '5px 10px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>🛰️ Open Turn-by-Turn</span>
          <ExternalLink size={11} />
        </button>
      </div>
    </div>
  );
}
