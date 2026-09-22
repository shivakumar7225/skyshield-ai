/**
 * SKYSHIELD AI — Mock Alerts Data
 */

export const MOCK_ALERTS = [
  {
    id: 'alt-101',
    type: 'CLOUDBURST_WARNING',
    severity: 'severe',
    badge: '🔴 ACTIVE WARNING',
    title: 'Cloudburst & Flash Flood Risk',
    hazard: '⛈️ CLOUDBURST RISK',
    confidence: 87,
    multiSourceAgreement: 91,
    leadTime: 'Expected in 2 hours 18 minutes',
    expectedWindow: '4:00 PM – 6:00 PM',
    location: 'Kukatpally & Pragathi Nagar (Zone A)',
    affectedRadiusKm: '14.2 km²',
    affectedPopulation: 38420,
    timestamp: 'Just now (13:10 IST)',
    status: 'ACTIVE_EMERGENCY',
    headline: 'High-density cloudburst cell detected. Instantaneous downpour projected to exceed local stormwater drainage threshold.',
    instructions: [
      'Stay indoors and move to higher building floors if in low-lying pockets',
      'Avoid basements, underground parking, and depressed roadway underpasses',
      'Do not attempt to walk or drive through moving water (>15cm depth)',
      'Keep mobile devices and emergency flashlights fully charged',
      'Follow real-time instructions from SkyShield AI and local response units'
    ],
    whyExplanation: {
      title: 'Why are you receiving this warning?',
      confidence: '87%',
      multiSourceAgreement: '91%',
      indicators: [
        { name: 'Moisture Increase (IWV)', level: 'HIGH', note: 'Satellite microwave sounder shows 64 mm column vapor' },
        { name: 'Cloud Development (CTT)', level: 'HIGH', note: 'IR sensor reveals rapid cloud top cooling to -74°C' },
        { name: 'Rainfall Intensity (QPE)', level: 'HIGH', note: 'Dual-pol radar estimates >85 mm/hr peak instantaneous rate' },
        { name: 'Atmospheric Instability (CAPE)', level: 'HIGH', note: 'Thermodynamic soundings indicate CAPE > 3200 J/kg' },
        { name: 'Terrain Susceptibility', level: 'ELEVATED', note: 'Zone A sits in a natural drainage depression prone to backwater surge' }
      ],
      leadTimeWindow: '2–3 hours lead time'
    }
  },
  {
    id: 'alt-102',
    type: 'THUNDERSTORM_WATCH',
    severity: 'high',
    badge: '🟠 WATCH',
    title: 'Severe Thunderstorm Watch',
    hazard: '⚡ SQUALL & LIGHTNING',
    confidence: 82,
    leadTime: 'Expected in 1 hour 42 minutes',
    location: 'Miyapur – Bachupally Corridor',
    timestamp: 'Yesterday, 17:45 IST',
    status: 'ARCHIVED',
    instructions: [
      'Disconnect sensitive appliances',
      'Avoid standing beneath large trees or metallic utility poles'
    ]
  },
  {
    id: 'alt-103',
    type: 'HEAVY_RAIN_ADVISORY',
    severity: 'moderate',
    badge: '🟡 ADVISORY',
    title: 'Heavy Rain Advisory',
    hazard: '🌧️ CONTINUOUS PRECIPITATION',
    confidence: 68,
    leadTime: 'Expected in 4 hours',
    location: 'Greater Hyderabad Municipal Region',
    timestamp: '08 September 2026',
    status: 'ARCHIVED',
    instructions: [
      'Allow extra commute time for office transit',
      'Check low-lying transit routes before departure'
    ]
  }
];

export const MOCK_OFFICER_ALERT_PREVIEW = {
  id: 'alert-draft-901',
  level: 'HIGH_SEVERITY',
  tag: '🔴 HIGH-SEVERITY CLOUDBURST WARNING',
  hazard: 'Cloudburst & Flash Flood Nowcast',
  headline: 'Severe weather is expected in the highlighted area within approximately 2 hours. Residents should remain alert and follow official safety instructions.',
  targetZone: 'Zone A (Kukatpally, Pragathi Nagar, Allwyn Colony)',
  targetCount: '38,420 residents',
  channels: ['Cell Broadcast (CB)', 'SkyShield Citizen App', 'Emergency Siren 04 & 07', 'VMS Display Boards'],
  leadTime: '2h 18m',
  expiration: '6 hours from issue',
  disclaimer: 'OFFICIAL WEATHER BULLETIN — Integrated Disaster Management Authority'
};
