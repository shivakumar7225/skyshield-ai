/**
 * SKYSHIELD AI — Mock Officer Command Data
 */

export const MOCK_OFFICER_PROFILE = {
  officerId: 'OFF-7492',
  name: 'Cmdr. Vikram Rathore',
  role: 'Chief Disaster Response Director',
  station: 'GHMC Integrated Command & Control Center (ICCC), Hyderabad',
  clearance: 'Level-4 Operational Authority',
  badge: 'NDMA Certified'
};

export const MOCK_METRICS = {
  activeThreats: 3,
  highRiskZones: 5,
  populationAtRisk: 38420,
  alertsIssued: 12,
  avgLeadTime: '2h 18m',
  modelAccuracyScore: '94.2%'
};

export const MOCK_ACTIVE_EVENTS = [
  {
    id: 'evt-cloudburst-01',
    type: 'CLOUDBURST',
    title: 'Cloudburst Nowcast Cell Alpha',
    probability: 87,
    severity: 'HIGH',
    leadTime: '2h 18m',
    expectedApex: '16:15 IST',
    affectedArea: '14.2 km²',
    zone: 'Zone A (Kukatpally / Pragathi Nagar)',
    population: 38420,
    infrastructure: {
      schools: 3,
      hospitals: 2,
      roads: 12,
      drainageChannels: 4,
      fireStations: 1
    },
    riskTrend: [42, 55, 68, 87],
    trendLabels: ['-90m', '-60m', '-30m', 'Now']
  },
  {
    id: 'evt-thunderstorm-02',
    type: 'THUNDERSTORM',
    title: 'Severe Thunderstorm Front Beta',
    probability: 82,
    severity: 'HIGH',
    leadTime: '1h 42m',
    expectedApex: '15:30 IST',
    affectedArea: '22.8 km²',
    zone: 'Zone B (Miyapur Urban Node)',
    population: 24150,
    infrastructure: {
      schools: 2,
      hospitals: 1,
      roads: 8,
      drainageChannels: 2,
      fireStations: 1
    },
    riskTrend: [30, 48, 65, 82],
    trendLabels: ['-90m', '-60m', '-30m', 'Now']
  },
  {
    id: 'evt-flood-03',
    type: 'FLASH_FLOOD',
    title: 'Urban Flash Flood Basin Gamma',
    probability: 74,
    severity: 'ELEVATED',
    leadTime: '3h 05m',
    expectedApex: '17:00 IST',
    affectedArea: '9.6 km²',
    zone: 'Zone C & Low Basin Underpasses',
    population: 18900,
    infrastructure: {
      schools: 1,
      hospitals: 1,
      roads: 6,
      drainageChannels: 3,
      fireStations: 1
    },
    riskTrend: [22, 38, 54, 74],
    trendLabels: ['-90m', '-60m', '-30m', 'Now']
  }
];

export const MOCK_AI_METEOROLOGY = {
  confidence: 87,
  multiSourceAgreement: 91,
  predictionWindow: '2–6 hours',
  ensembleSources: [
    { name: 'INSAT-3DR Rapid Scan Sounder', status: 'ACTIVE', weight: '32%' },
    { name: 'IMD Hyderabad Dual-Pol Radar (DWR)', status: 'ACTIVE', weight: '35%' },
    { name: 'Dense IoT Rain Gauge Mesh (GHMC)', status: 'ACTIVE', weight: '18%' },
    { name: 'DeepNowcast-V3 Transformer Model', status: 'ACTIVE', weight: '15%' }
  ],
  indicators: [
    { code: 'IWV', name: 'Integrated Water Vapor', value: '64.2 mm', status: 'HIGH', threshold: '> 52 mm', trend: '+14% / hr' },
    { code: 'CAPE', name: 'Convective Avail. Potential Energy', value: '3,280 J/kg', status: 'HIGH', threshold: '> 2500 J/kg', trend: 'Extreme' },
    { code: 'CIN', name: 'Convective Inhibition', value: '18 J/kg', status: 'LOW', threshold: '< 30 J/kg', trend: 'Cap Broken' },
    { code: 'Wind Conv.', name: 'Surface Wind Convergence', value: '14.8 × 10⁻⁵ s⁻¹', status: 'HIGH', threshold: '> 8.0 × 10⁻⁵', trend: 'Sharp Inflow' },
    { code: 'Vert. Shear', name: 'Vertical Wind Shear (0-6km)', value: '18.4 m/s', status: 'MODERATE', threshold: '15–25 m/s', trend: 'Organized Cell' },
    { code: 'CTT Drop', name: 'Cloud Top Temp Cooling Rate', value: '-9.2°C / 15m (Min -74°C)', status: 'HIGH', threshold: '< -60°C', trend: 'Deep Updraft' },
    { code: 'QPE', name: 'Quantitative Precip. Estimation', value: '88.5 mm / hr', status: 'HIGH', threshold: '> 65 mm/hr', trend: 'Torrents' }
  ],
  terrainAnalysis: {
    elevation: '510–580m',
    slope: 'HIGH',
    drainage: 'VULNERABLE',
    flashFloodRisk: '76%',
    soilSaturation: '84% (Pre-wetted antecedent moisture)',
    catchmentRunoffCoeff: '0.88 (Heavy impervious urban surface)'
  },
  bottomExplanation: 'Multiple atmospheric and surface indicators indicate an elevated probability of localized severe weather. Convective cap breakthrough verified by radar reflectivity exceeding 54 dBZ with steep terrain-induced runoff concentration in Zone A.'
};

export const MOCK_RECOMMENDED_ACTIONS = [
  { id: 1, text: 'Alert vulnerable population in Zone A via Cell Broadcast & App push', priority: 'Immediate', state: 'PENDING_DISPATCH' },
  { id: 2, text: 'Monitor drainage channels and open automated sluice floodgates at IDL Lake', priority: 'High', state: 'DISPATCHED' },
  { id: 3, text: 'Prepare shelters: mobilize Govt School Kukatpally & Community Hall Sector 4', priority: 'Immediate', state: 'CONFIRMED' },
  { id: 4, text: 'Position rescue teams (NDRF Unit 01 & SDRF Boats) at Pragathi Nagar Junction', priority: 'High', state: 'EN_ROUTE' },
  { id: 5, text: 'Monitor and barricade critical roads: NH-65 underpass and Nizampet low dip', priority: 'High', state: 'MONITORING' }
];

export const MOCK_SOS_QUEUE = [
  {
    id: '#1048',
    category: 'Flooding',
    badge: '🔴 Urgent',
    severity: 'severe',
    location: 'Pragathi Nagar Main Road, Zone A',
    coords: { lat: 17.498, lng: 78.395 },
    reportedBy: 'Aashrith (Citizen App)',
    mobile: '+91 98765 43210',
    timeAgo: '2 min ago',
    timestamp: '13:13 IST',
    notes: 'Ground floor apartment inundation, water level rising above 2 feet near transformer.',
    assignedTo: null,
    status: 'Pending'
  },
  {
    id: '#1047',
    category: 'Road Blocked',
    badge: '🟠 High',
    severity: 'high',
    location: 'Miyapur Underpass, Zone B',
    coords: { lat: 17.491, lng: 78.365 },
    reportedBy: 'Ramesh K. (Citizen App)',
    mobile: '+91 94412 11094',
    timeAgo: '8 min ago',
    timestamp: '13:07 IST',
    notes: 'Two city buses stalled due to 45cm water accumulation. Traffic halted.',
    assignedTo: null,
    status: 'Pending'
  },
  {
    id: '#1046',
    category: 'Medical Emergency',
    badge: '🟡 In Progress',
    severity: 'moderate',
    location: 'KPHB 5th Phase, Zone A',
    coords: { lat: 17.489, lng: 78.402 },
    reportedBy: 'P. Sunita (Citizen App)',
    mobile: '+91 99887 76655',
    timeAgo: '24 min ago',
    timestamp: '12:51 IST',
    notes: 'Elderly patient requires oxygen support transit before heavy storm onset.',
    assignedTo: 'Medical Team 02',
    status: 'Assigned'
  }
];

export const MOCK_RESPONDER_TEAMS = [
  {
    id: 'team-01',
    name: 'Rescue Team 01',
    unit: 'NDRF Quick Response Force',
    status: 'DEPLOYED',
    color: '#EF4444',
    icon: '🚒',
    assignedZone: 'Zone A (Pragathi Nagar)',
    personnel: 12,
    equipment: '2 Inflatable Zodiac Boats, Water Pumps'
  },
  {
    id: 'team-02',
    name: 'Medical Team 02',
    unit: '108 Advanced Life Support',
    status: 'AVAILABLE',
    color: '#10B981',
    icon: '🚑',
    assignedZone: 'Kukatpally Area Hospital Staging',
    personnel: 4,
    equipment: 'Trauma kits, Portable defibrillators'
  },
  {
    id: 'team-03',
    name: 'Police Team 03',
    unit: 'Cyberabad Traffic Police Division',
    status: 'MONITORING',
    color: '#3B82F6',
    icon: '👮',
    assignedZone: 'NH-65 & Nizampet Road Junctions',
    personnel: 18,
    equipment: 'Mobile Barricades, High-Intensity Warning Flashers'
  }
];

export const MOCK_THREAT_HISTORY = [
  {
    id: 'hist-001',
    title: 'Kukatpally Extreme Cloudburst & Flash Flood',
    type: 'CLOUDBURST',
    date: '24 Aug 2025',
    time: '16:20 – 18:45 IST',
    severity: 'SEVERE',
    peakRainfall: '142 mm/hr',
    affectedArea: '16.4 km²',
    zone: 'Zone A & Nizampet Low Basin',
    populationExposed: 45200,
    aiMetrics: {
      leadTimeProvided: '2h 45m',
      predictionAccuracy: '94.8%',
      firstDetectionTime: '13:35 IST',
      peakDetectionTime: '16:20 IST'
    },
    whatHappened: 'Intense convective supercell triggered sudden torrential downpour exceeding 142 mm/hr over Kukatpally micro-catchment, resulting in severe water accumulation of up to 1.8 meters at lowland underpasses.',
    actionsTaken: [
      {
        step: 1,
        time: '13:40 IST (T+5m)',
        action: 'Pre-emptive Cell Broadcast',
        detail: 'Triggered localized emergency broadcast to 45,200 mobile devices in Zone A before rain onset.'
      },
      {
        step: 2,
        time: '14:15 IST (T+40m)',
        action: 'Rescue Force Pre-positioning',
        detail: 'Pre-deployed NDRF Battalion 04 with 4 inflatable Zodiac boats and 12 dewatering pumps at Pragathi Nagar.'
      },
      {
        step: 3,
        time: '14:45 IST (T+70m)',
        action: 'Automated Sluice Gate Activation',
        detail: 'Remotely triggered flood discharge gates at IDL Lake & Kukatpally Nala, diverting 4.2M gallons of runoff.'
      },
      {
        step: 4,
        time: '15:10 IST (T+95m)',
        action: 'Shelter Evacuation & Triage',
        detail: 'Opened 8 emergency shelters; safely relocated 3,420 citizens from vulnerable ground floor dwellings.'
      },
      {
        step: 5,
        time: '16:20 IST (Peak)',
        action: 'Traffic Diversion & Underpass Barricading',
        detail: 'Cyberabad Police closed NH-65 underpass 45 mins prior to submergence, averting 60+ vehicle entrapments.'
      }
    ],
    outcomes: {
      casualties: '0 (Zero)',
      rescuesCompleted: 48,
      evacuatedCitizens: 3420,
      sosResolutionAvg: '6.4 mins',
      economicLossAverted: '₹14.2 Crore'
    }
  },
  {
    id: 'hist-002',
    title: 'Gachibowli Severe Convective Storm & Microburst',
    type: 'THUNDERSTORM',
    date: '12 Jul 2025',
    time: '14:10 – 16:30 IST',
    severity: 'HIGH',
    peakRainfall: '88 mm/hr',
    affectedArea: '24.1 km²',
    zone: 'Zone B & IT Corridor',
    populationExposed: 68000,
    aiMetrics: {
      leadTimeProvided: '3h 10m',
      predictionAccuracy: '92.4%',
      firstDetectionTime: '11:00 IST',
      peakDetectionTime: '14:10 IST'
    },
    whatHappened: 'Rapidly descending microburst accompanied by 4,200 lightning strikes within 60 mins and 92 km/h wind gusts across Gachibowli and Hitec City high-rise corridors.',
    actionsTaken: [
      {
        step: 1,
        time: '11:15 IST',
        action: 'Construction & Metro Advisory',
        detail: 'Mandated immediate halt to high-altitude tower crane operations and anchored exterior scaffolding.'
      },
      {
        step: 2,
        time: '12:00 IST',
        action: 'Grid Automated Sectioning',
        detail: 'TSSPDCL automated power grid isolated 6 vulnerable high-voltage feeders to eliminate electrical transformer blowouts.'
      },
      {
        step: 3,
        time: '13:30 IST',
        action: 'Public Advisory & Shelter Staging',
        detail: 'Directed IT employees to shelter in place and delayed peak outbound traffic until storm dissipation.'
      }
    ],
    outcomes: {
      casualties: '0 (Zero)',
      rescuesCompleted: 14,
      evacuatedCitizens: 1200,
      sosResolutionAvg: '7.8 mins',
      economicLossAverted: '₹8.6 Crore'
    }
  },
  {
    id: 'hist-003',
    title: 'Miyapur Urban Basin Flash Inundation',
    type: 'FLASH_FLOOD',
    date: '18 May 2025',
    time: '17:00 – 20:15 IST',
    severity: 'HIGH',
    peakRainfall: '105 mm/hr',
    affectedArea: '11.8 km²',
    zone: 'Zone D & Miyapur Node',
    populationExposed: 28900,
    aiMetrics: {
      leadTimeProvided: '2h 20m',
      predictionAccuracy: '96.1%',
      firstDetectionTime: '14:40 IST',
      peakDetectionTime: '17:00 IST'
    },
    whatHappened: 'Severe drainage trunk backflow caused by rapid runoff accumulation from uphill Madhapur ridge, causing deep flash inundation across Miyapur transit terminal.',
    actionsTaken: [
      {
        step: 1,
        time: '14:55 IST',
        action: 'High-Capacity Dewatering Deployment',
        detail: 'Positioned four 12,000 LPM heavy dewatering pumps along primary storm drain bottlenecks.'
      },
      {
        step: 2,
        time: '15:30 IST',
        action: 'Transit Corridor Lockdown',
        detail: 'Rerouted 84 RTC city buses via elevated Outer Ring Road bypass before water levels rose.'
      },
      {
        step: 3,
        time: '16:45 IST',
        action: 'Community Evacuation',
        detail: 'Evacuated 890 families from low-lying colony adjacent to Gangaram Lake overflow canal.'
      }
    ],
    outcomes: {
      casualties: '0 (Zero)',
      rescuesCompleted: 31,
      evacuatedCitizens: 1850,
      sosResolutionAvg: '5.9 mins',
      economicLossAverted: '₹11.5 Crore'
    }
  }
];

