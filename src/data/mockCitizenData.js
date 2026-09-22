/**
 * SKYSHIELD AI — Mock Citizen Data
 */

export const DEFAULT_CITIZEN = {
  name: 'Aashrith',
  mobile: '+91 9876543210',
  primaryLocation: 'Medchal, Telangana, India',
  pincode: '501401',
  language: 'English',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  savedLocations: [
    { id: 'loc-1', label: 'Home', address: 'Main Road, Medchal, Telangana', pincode: '501401' },
    { id: 'loc-2', label: 'College', address: 'Kompally Village, Medchal-Malkajgiri', pincode: '500100' }
  ]
};

export const PRESET_LOCATIONS = [
  { id: 'loc-medchal', name: 'Medchal, Telangana, India', city: 'Medchal', mandal: 'Medchal', state: 'Telangana', place_type: 'Mandal / Town', pincode: '501401', latitude: 17.6297, longitude: 78.4814, highRiskZone: false },
  { id: 'loc-kompally', name: 'Kompally Village, Medchal-Malkajgiri, Telangana, India', city: 'Kompally', mandal: 'Quthbullapur', state: 'Telangana', place_type: 'Village', pincode: '500100', latitude: 17.5375, longitude: 78.4856, highRiskZone: false },
  { id: 'loc-dabilpur', name: 'Dabilpur Village, Medchal-Malkajgiri, Telangana, India', city: 'Dabilpur', mandal: 'Medchal', state: 'Telangana', place_type: 'Village', pincode: '501401', latitude: 17.6521, longitude: 78.4988, highRiskZone: false },
  { id: 'loc-kukatpally', name: 'Kukatpally, Medchal-Malkajgiri, Telangana, India', city: 'Kukatpally', mandal: 'Kukatpally', state: 'Telangana', place_type: 'Mandal', pincode: '500072', latitude: 17.4947, longitude: 78.3996, highRiskZone: true },
  { id: 'loc-ghatkesar', name: 'Ghatkesar Mandal, Medchal-Malkajgiri, Telangana, India', city: 'Ghatkesar', mandal: 'Ghatkesar', state: 'Telangana', place_type: 'Mandal', pincode: '501301', latitude: 17.4511, longitude: 78.6843, highRiskZone: false },
  { id: 'loc-miyapur', name: 'Miyapur, Medchal-Malkajgiri, Telangana, India', city: 'Miyapur', mandal: 'Serilingampally', state: 'Telangana', place_type: 'Mandal', pincode: '500049', latitude: 17.4968, longitude: 78.3614, highRiskZone: true },
  { id: 'loc-gachibowli', name: 'Gachibowli, Rangareddy, Telangana, India', city: 'Gachibowli', mandal: 'Serilingampally', state: 'Telangana', place_type: 'Mandal', pincode: '500032', latitude: 17.4401, longitude: 78.3489, highRiskZone: false },
  { id: 'loc-mumbai', name: 'Mumbai, Maharashtra, India', city: 'Mumbai', mandal: 'Colaba', state: 'Maharashtra', place_type: 'Metropolitan City', pincode: '400001', latitude: 19.0760, longitude: 72.8777, highRiskZone: true },
  { id: 'loc-delhi', name: 'New Delhi, Delhi, India', city: 'New Delhi', mandal: 'Connaught Place', state: 'Delhi', place_type: 'Capital City', pincode: '110001', latitude: 28.6139, longitude: 77.2090, highRiskZone: false }
];

export const SOS_CATEGORIES = [
  { id: 'cat-flood', label: 'Flooding', icon: '🌊', description: 'Water entering house or street rapidly rising' },
  { id: 'cat-trap', label: 'Trapped', icon: '🆘', description: 'Unable to exit building or vehicle' },
  { id: 'cat-med', label: 'Medical Emergency', icon: '🚑', description: 'Urgent medical assistance or ambulance required' },
  { id: 'cat-road', label: 'Road Blocked', icon: '🚧', description: 'Fallen trees, powerlines or submerged underpass' },
  { id: 'cat-other', label: 'Other', icon: '⚠️', description: 'Other dangerous weather-related hazards' }
];
