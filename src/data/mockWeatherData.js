/**
 * SKYSHIELD AI — Mock Weather & Geospatial Data
 * Simulates nowcasting states (Normal, Warning, Severe) with 2-6 hour lead time.
 */

export const WEATHER_STATES = {
  NORMAL: {
    id: 'NORMAL',
    name: 'Normal Conditions',
    badge: '🟢 LOW RISK',
    level: 'low',
    color: '#10B981',
    description: 'No immediate severe weather threat',
    detailedSummary: 'Atmospheric moisture stability nominal. Convective inhibition remains intact. Radar echo reflectivity < 20 dBZ.',
    leadTime: 'Nominal',
    window: 'Clear for next 6 hours',
    risks: {
      thunderstorm: 18,
      cloudburst: 7,
      flashFlood: 4,
    },
    timeline: [
      { time: 'NOW', risk: 'low', value: 12, label: '🟢 Low', condition: 'Clear Skies' },
      { time: '2H', risk: 'low', value: 15, label: '🟢 Low', condition: 'Scattered Clouds' },
      { time: '4H', risk: 'moderate', value: 24, label: '🟡 Low-Mod', condition: 'Mild Overcast' },
      { time: '6H', risk: 'low', value: 18, label: '🟢 Low', condition: 'Partly Cloudy' },
    ],
    zones: [
      { id: 'zone-a', name: 'Kukatpally - Zone A', risk: 'low', value: 14, status: 'Clear' },
      { id: 'zone-b', name: 'Gachibowli - Zone B', risk: 'low', value: 11, status: 'Clear' },
      { id: 'zone-c', name: 'Secunderabad - Zone C', risk: 'low', value: 9, status: 'Clear' },
      { id: 'zone-d', name: 'Miyapur - Zone D', risk: 'low', value: 16, status: 'Clear' },
    ]
  },
  WARNING: {
    id: 'WARNING',
    name: 'Weather Watch',
    badge: '🟠 WATCH',
    level: 'high',
    color: '#F59E0B',
    description: 'Severe weather development detected within 3-4 hours',
    detailedSummary: 'Pre-convective cloud cluster organizing rapidly over North-West quadrant. Moisture convergence accelerating.',
    leadTime: '3h 30m',
    window: '3:00 PM – 7:00 PM',
    risks: {
      thunderstorm: 72,
      cloudburst: 78,
      flashFlood: 45,
    },
    timeline: [
      { time: 'NOW', risk: 'moderate', value: 45, label: '🟡 Mod', condition: 'Humid Overcast' },
      { time: '2H', risk: 'high', value: 72, label: '🟠 Watch', condition: 'Convective Clouds' },
      { time: '4H', risk: 'high', value: 78, label: '🟠 High', condition: 'Squall Lines Forming' },
      { time: '6H', risk: 'moderate', value: 50, label: '🟡 Mod', condition: 'Scattered Rain' },
    ],
    zones: [
      { id: 'zone-a', name: 'Kukatpally - Zone A', risk: 'high', value: 78, status: 'Watch Active' },
      { id: 'zone-b', name: 'Gachibowli - Zone B', risk: 'moderate', value: 52, status: 'Elevated' },
      { id: 'zone-c', name: 'Secunderabad - Zone C', risk: 'low', value: 28, status: 'Monitoring' },
      { id: 'zone-d', name: 'Miyapur - Zone D', risk: 'high', value: 74, status: 'Watch Active' },
    ]
  },
  SEVERE: {
    id: 'SEVERE',
    name: 'Severe Cloudburst Alert',
    badge: '🔴 HIGH RISK',
    level: 'severe',
    color: '#EF4444',
    description: 'Imminent localized cloudburst and flash flood danger',
    detailedSummary: 'Deep convective supercell with Cloud Top Temperature dropping below -72°C. QPE projection exceeds 85mm/hr in targeted urban micro-basin.',
    leadTime: '2h 18m',
    window: '4:00 PM – 6:00 PM',
    confidence: 87,
    multiSourceAgreement: 91,
    risks: {
      thunderstorm: 82,
      cloudburst: 87,
      flashFlood: 76,
    },
    timeline: [
      { time: 'NOW', risk: 'moderate', value: 55, label: '🟡 Mod', condition: 'Dark Stratocumulus' },
      { time: '2H', risk: 'severe', value: 87, label: '🔴 Severe', condition: 'Cloudburst Apex' },
      { time: '4H', risk: 'severe', value: 82, label: '🔴 Severe', condition: 'Intense Downpour' },
      { time: '6H', risk: 'high', value: 68, label: '🟠 High', condition: 'Flash Runoff Peak' },
    ],
    zones: [
      { id: 'zone-a', name: 'Kukatpally - Zone A', risk: 'severe', value: 87, status: 'Evacuate Lowlands' },
      { id: 'zone-b', name: 'Miyapur - Zone B', risk: 'high', value: 81, status: 'High Alert' },
      { id: 'zone-c', name: 'Gachibowli - Zone C', risk: 'moderate', value: 58, status: 'Advisory' },
      { id: 'zone-d', name: 'Secunderabad - Zone D', risk: 'low', value: 34, status: 'Monitoring' },
    ]
  }
};

export const MOCK_GIS_DATA = {
  center: { lat: 17.4947, lng: 78.3996, name: 'Kukatpally, Hyderabad' },
  zones: [
    {
      id: 'za',
      name: 'Zone A (Kukatpally - Pragathi Nagar)',
      riskLevel: 'severe',
      color: '#EF4444',
      population: 38420,
      elevationRange: '510–540m (Basin Depressed)',
      drainageStatus: 'Severely Bottlenecked',
      coords: [
        { x: 38, y: 35 },
        { x: 55, y: 32 },
        { x: 58, y: 48 },
        { x: 42, y: 52 },
      ]
    },
    {
      id: 'zb',
      name: 'Zone B (Miyapur Urban Node)',
      riskLevel: 'high',
      color: '#F97316',
      population: 24150,
      elevationRange: '535–560m',
      drainageStatus: 'At Capacity',
      coords: [
        { x: 20, y: 30 },
        { x: 36, y: 34 },
        { x: 38, y: 50 },
        { x: 22, y: 46 }
      ]
    },
    {
      id: 'zc',
      name: 'Zone C (Hitec City / Madhapur Ridge)',
      riskLevel: 'moderate',
      color: '#EAB308',
      population: 46200,
      elevationRange: '565–600m (High Ridge)',
      drainageStatus: 'Moderate Runoff',
      coords: [
        { x: 35, y: 55 },
        { x: 58, y: 52 },
        { x: 62, y: 72 },
        { x: 40, y: 75 }
      ]
    },
    {
      id: 'zd',
      name: 'Zone D (Secunderabad North Plain)',
      riskLevel: 'low',
      color: '#10B981',
      population: 52100,
      elevationRange: '540–565m',
      drainageStatus: 'Nominal Flow',
      coords: [
        { x: 60, y: 25 },
        { x: 80, y: 28 },
        { x: 78, y: 50 },
        { x: 62, y: 45 }
      ]
    }
  ],
  criticalRoads: [
    { id: 'r1', name: 'NH-65 Kukatpally Corridor', status: 'At Risk (Waterlogging in 1h 45m)', vulnerability: 'Critical' },
    { id: 'r2', name: 'JNTU – Hitec City Link Road', status: 'High Traffic Congestion Alert', vulnerability: 'High' },
    { id: 'r3', name: 'Nizampet Main Road Underpass', status: 'Closure Recommended (Depression Point)', vulnerability: 'Critical' },
    { id: 'r4', name: 'Moosapet Y-Junction', status: 'Moderate Slowdown', vulnerability: 'Moderate' },
  ],
  drainageBasins: [
    { id: 'd1', name: 'Kukatpally Nala Trunk 1', capacityUsage: 89, floodRisk: 'Extreme Spillover' },
    { id: 'd2', name: 'IDL Lake Inflow Channel', capacityUsage: 82, floodRisk: 'High Inundation' },
    { id: 'd3', name: 'Gangaram Cheruvu Overflow', capacityUsage: 71, floodRisk: 'Moderate Risk' },
    { id: 'd4', name: 'Durgam Cheruvu Sluice Gate', capacityUsage: 54, floodRisk: 'Controlled' },
  ]
};
