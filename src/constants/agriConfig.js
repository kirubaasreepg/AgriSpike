// AgriSpike Centralized Configuration
// Single source of truth for geographical locations, team directory, credentials, and API endpoints.

export const FIELD_CONFIG = {
  name: 'AgriSpike Main Field',
  latitude: 11.493908119779464,
  longitude: 77.2704884980992,
  zoomLevel: 17,
};

// Exact coordinates for the 4 sensor nodes:
// Node 1: 11°29'48.0"N 77°16'25.1"E
// Node 2: 11°29'49.2"N 77°16'25.4"E
// Node 3: 11°29'49.4"N 77°16'24.3"E
// Node 4: 11°29'48.0"N 77°16'24.0"E
export const SENSOR_NODES = [
  {
    id: 1,
    name: 'Node 1 — North Field',
    dms: "11°29'48.0\"N 77°16'25.1\"E",
    latitude: 11.49666667,
    longitude: 77.27363889,
    zone: 'North Zone',
  },
  {
    id: 2,
    name: 'Node 2 — East Field',
    dms: "11°29'49.2\"N 77°16'25.4\"E",
    latitude: 11.49700000,
    longitude: 77.27372222,
    zone: 'East Zone',
  },
  {
    id: 3,
    name: 'Node 3 — South Field',
    dms: "11°29'49.4\"N 77°16'24.3\"E",
    latitude: 11.49705556,
    longitude: 77.27341667,
    zone: 'South Zone',
  },
  {
    id: 4,
    name: 'Node 4 — West Field',
    dms: "11°29'48.0\"N 77°16'24.0\"E",
    latitude: 11.49666667,
    longitude: 77.27333333,
    zone: 'West Zone',
  },
];

// Valid credentials allowed for the demo/prototype
export const ALLOWED_USERS = [
  { username: 'sanjay', displayName: 'Sanjay', role: 'Team Lead' },
  { username: 'akshaya', displayName: 'Akshaya', role: 'Frontend Development' },
  { username: 'dhivyasri', displayName: 'Dhivyasri', role: 'Smart Suggestions & Logic' },
  { username: 'swathi', displayName: 'Swathi', role: 'Backend Development' },
  { username: 'kirubaa', displayName: 'Kirubaa', role: 'Firmware Development' },
  { username: 'thaniska', displayName: 'Thaniska', role: 'Hardware Assembly & Testing' },
];

export const DEMO_PASSWORD = '200620';

// Centralized Team Directory - Exact names, roles, and verified phone numbers
export const TEAM_MEMBERS = [
  {
    name: 'SANJAY PRATHMANYU S',
    role: 'Team Lead',
    phone: '8098000944',
    specialty: 'Hardware & System Architecture',
    supportRecipient: true,
  },
  {
    name: 'AKSHAYA AS',
    role: 'Frontend Development',
    phone: '9150424532',
    specialty: 'UI/UX & Interactive Design',
    supportRecipient: false,
  },
  {
    name: 'DHIVYASRI J',
    role: 'Smart Suggestions & Logic',
    phone: '9344167239',
    specialty: 'Agronomic AI & Decision Models',
    supportRecipient: false,
  },
  {
    name: 'THANISKA B',
    role: 'Hardware Assembly & Testing',
    phone: '8825565389',
    specialty: 'Field Sensor Nodes & Relays',
    supportRecipient: true,
  },
  {
    name: 'KIRUBAASREE PG',
    role: 'Firmware Development',
    phone: '7339056710',
    specialty: 'ESP32 & LoRa Mesh Protocol',
    supportRecipient: true,
  },
  {
    name: 'SWATHI S',
    role: 'Backend Development',
    phone: '9344037843',
    specialty: 'Cloud APIs & Data Pipeline',
    supportRecipient: true,
  },
];

export const SUPPORT_CONFIG = {
  phone: '8098000944',
  website: 'TO BE PROVIDED',
  email: 'support@agrispike.in',
};
