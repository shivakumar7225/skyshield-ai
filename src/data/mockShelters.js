/**
 * SKYSHIELD AI — Mock Shelter & Route Data with High-Precision Coordinates
 */

export const MOCK_SHELTERS = [
  {
    id: 'sh-1',
    name: 'Government High School Kukatpally',
    distance: '1.2 km away',
    distanceNum: 1.2,
    status: 'Open',
    statusColor: '#10B981',
    address: 'Near Y-Junction, KPHB Phase 1, Hyderabad',
    elevation: '548m MSL (+18m High Ground)',
    elevationGain: '+18m High Ground',
    availableBeds: 272,
    capacity: 350,
    currentOccupancy: 78,
    walkingTime: '14 mins',
    drivingTime: '4 mins',
    etaWalking: '14 mins',
    etaVehicle: '4 mins',
    lat: 17.5025,
    lng: 78.4068,
    offsetLat: 0.0078,
    offsetLng: 0.0072,
    floodObstacle: {
      lat: 17.4982,
      lng: 78.4025,
      radius: 120,
      label: 'Submerged Railway Underpass (Water depth 1.4m)'
    },
    features: ['Backup Generator', 'First Aid Station', 'Purified Water', 'Child Safety Zone'],
    facilities: ['Backup Power', 'First Aid Camp', 'Purified Drinking Water', 'Dry Food Rations', 'Women & Child Safe Ward'],
    contactOfficer: 'Inspector R. Naidu (+91 94401 23891)',
    route: [
      { step: 1, instruction: 'Head East on Main Colony Road away from water accumulation', dist: '300m', safe: true },
      { step: 2, instruction: 'Ascend onto elevated Vivekananda Nagar Flyover (Bypasses flood dip)', dist: '500m', safe: true, highlight: 'Bypasses flood prone railway dip' },
      { step: 3, instruction: 'Continue along high-ground corridor past KPHB Junction', dist: '300m', safe: true },
      { step: 4, instruction: 'Arrive at Government High School Safe Relief Camp on right', dist: '100m', safe: true }
    ],
    routeWaypoints: [
      [0, 0],
      [0.0025, 0.0022],
      [0.0055, 0.0040],
      [0.0068, 0.0058],
      [0.0078, 0.0072]
    ]
  },
  {
    id: 'sh-2',
    name: 'Community Hall & Welfare Center',
    distance: '2.1 km away',
    distanceNum: 2.1,
    status: 'Open',
    statusColor: '#10B981',
    address: 'Pragathi Nagar Sector 4, Hyderabad',
    elevation: '556m MSL (+26m Hilltop Ridge)',
    elevationGain: '+26m Hilltop Ridge',
    availableBeds: 376,
    capacity: 500,
    currentOccupancy: 124,
    walkingTime: '26 mins',
    drivingTime: '8 mins',
    etaWalking: '26 mins',
    etaVehicle: '8 mins',
    lat: 17.5110,
    lng: 78.3910,
    offsetLat: 0.0163,
    offsetLng: -0.0086,
    floodObstacle: {
      lat: 17.5020,
      lng: 78.3950,
      radius: 150,
      label: 'Low-Lying Lake Overflow Corridor'
    },
    features: ['Disaster Relief Stockpile', 'Satellite Connectivity', 'Wheelchair Accessible', 'Emergency Food'],
    facilities: ['Satellite Comm Link', 'Emergency Clinic', 'Hot Meal Distribution', 'Wheelchair Access'],
    contactOfficer: 'Dr. Sunita Sharma (+91 98852 44710)',
    route: [
      { step: 1, instruction: 'Head North towards Pragathi Nagar Main Road', dist: '600m', safe: true },
      { step: 2, instruction: 'Turn right at Arch onto Sector 4 elevated ridge', dist: '1.1 km', safe: true, highlight: 'Ridge is 26m above surrounding plains' },
      { step: 3, instruction: 'Arrive at Community Welfare Centre entrance gate', dist: '400m', safe: true }
    ],
    routeWaypoints: [
      [0, 0],
      [0.0050, -0.0020],
      [0.0110, -0.0050],
      [0.0145, -0.0070],
      [0.0163, -0.0086]
    ]
  },
  {
    id: 'sh-3',
    name: 'Miyapur Indoor Sports Complex',
    distance: '3.4 km away',
    distanceNum: 3.4,
    status: 'Open',
    statusColor: '#10B981',
    address: 'Opp. Allwyn Colony Metro, Miyapur',
    elevation: '552m MSL (+22m Elevated Highway)',
    elevationGain: '+22m Elevated Highway',
    availableBeds: 805,
    capacity: 850,
    currentOccupancy: 45,
    walkingTime: '42 mins',
    drivingTime: '11 mins',
    etaWalking: '42 mins',
    etaVehicle: '11 mins',
    lat: 17.4990,
    lng: 78.3740,
    offsetLat: 0.0043,
    offsetLng: -0.0256,
    floodObstacle: {
      lat: 17.4960,
      lng: 78.3860,
      radius: 140,
      label: 'Inundated Storm Drain Confluence'
    },
    features: ['Large Floor Space', 'Ambulance Staging Post', 'Bedding & Sanitation'],
    facilities: ['Mass Capacity Hall', 'Ambulance Fleet Base', 'Heavy Generator', 'Sanitation Blocks'],
    contactOfficer: 'Command Post Alpha (+91 94412 88001)',
    route: [
      { step: 1, instruction: 'Take Metro elevated corridor feeder road towards Allwyn Colony', dist: '1.8 km', safe: true },
      { step: 2, instruction: 'Turn left along elevated highway service road', dist: '1.6 km', safe: true, highlight: 'Main highway clear of standing water' }
    ],
    routeWaypoints: [
      [0, 0],
      [0.0010, -0.0080],
      [0.0025, -0.0160],
      [0.0035, -0.0210],
      [0.0043, -0.0256]
    ]
  }
];
