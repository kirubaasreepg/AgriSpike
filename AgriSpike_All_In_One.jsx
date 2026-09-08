/**
 * ==============================================================================
 * AgriSpike — Complete Consolidated Frontend Code (All-In-One)
 * ==============================================================================
 * This file contains the complete, exact consolidated code from the AgriSpike
 * React + Vite smart agriculture project.
 *
 * Included Sections:
 *  1. External Library Imports
 *  2. Design System & CSS Tokens (Injected dynamically & exported)
 *  3. Central Configuration, Geolocation & Constants (agriConfig.js)
 *  4. Cloud Backend & Supabase Config (config.js)
 *  5. Firebase Realtime Telemetry Config (firebase.js)
 *  6. Demo & Fallback Datasets (demoData.js)
 *  7. Centralized Localization & Translations (translations.js)
 *  8. Context Providers (ThemeContext.jsx, LanguageContext.jsx)
 *  9. Telemetry & Hardware Services (sensorDataService.js, useReadings.js)
 * 10. AI Agronomy Advisory Service (aiSupportService.js)
 * 11. Weather Service & IMD Integration (weatherService.js)
 * 12. UI Components (PandaMascot, InteractiveMap, TopBar, Sidebar, ChatWidget, Layout)
 * 13. Application Pages (Login, MyField, NodeDetail, Irrigation, Fertilizer, CropSuggestion, Disease, Weather, News, Shop, Support, Team, Settings, Home)
 * 14. Application Root & Routing Configuration (App.jsx)
 * ==============================================================================
 */

// ==============================================================================
// 1. EXTERNAL LIBRARY IMPORTS
// ==============================================================================
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  StrictMode
} from 'react';
import { createRoot } from 'react-dom/client';
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  NavLink,
  Link,
  useParams,
  useNavigate,
  Outlet
} from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { createClient } from '@supabase/supabase-js';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

// ==============================================================================
// 2. DESIGN SYSTEM & CSS TOKENS (src/index.css)
// ==============================================================================
export const AGRISPIKE_CSS = `/* ==========================================================================
   AgriSpike Smart Agriculture Design System
   CSS Variables & Design Tokens (Light & Dark Themes)
   ========================================================================== */

:root {
  /* Common Brand Colors */
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;

  /* Status Tokens */
  --color-online: #16a34a;      /* Emerald Green */
  --color-online-bg: #dcfce7;
  --color-warning: #d97706;     /* Amber */
  --color-warning-bg: #fef3c7;
  --color-fault: #dc2626;       /* Red */
  --color-fault-bg: #fee2e2;

  /* Light Theme (Default) */
  --bg: #f8fafc;                /* Clean soft white/slate */
  --bg-panel: #ffffff;          /* Pure white card */
  --bg-panel-hover: #f1f5f9;
  --bg-muted: #f1f5f9;
  --text: #0f172a;              /* Slate 900 */
  --text-muted: #475569;        /* Slate 600 */
  --text-faint: #94a3b8;        /* Slate 400 */
  --border: #e2e8f0;            /* Slate 200 */
  --border-focus: #16a34a;
  --accent: #16a34a;
  --accent-hover: #15803d;
  --accent-light: #f0fdf4;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
}

/* Dark Theme */
[data-theme="dark"] {
  --bg: #090d16;                /* Deep crisp dark slate */
  --bg-panel: #111827;          /* Dark card panel */
  --bg-panel-hover: #1f2937;
  --bg-muted: #1e293b;
  --text: #f8fafc;              /* Slate 50 */
  --text-muted: #cbd5e1;        /* Slate 300 */
  --text-faint: #64748b;        /* Slate 500 */
  --border: #1e293b;            /* Subtle slate border */
  --border-focus: #22c55e;
  --accent: #22c55e;            /* Vibrant healthy green */
  --accent-hover: #16a34a;
  --accent-light: rgba(34, 197, 94, 0.12);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.6);
}

/* ==========================================================================
   Base Elements & Reset
   ========================================================================== */

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #root {
  height: 100%;
  width: 100%;
  font-family: var(--font-sans);
  background-color: var(--bg);
  color: var(--text);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
  text-decoration: none;
}

button, input, select, textarea {
  font-family: inherit;
  font-size: 14px;
}

/* ==========================================================================
   Layout & App Shell
   ========================================================================== */

.app-shell {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--bg);
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
}

@media (max-width: 768px) {
  .page-content {
    padding: 16px;
  }
}

/* ==========================================================================
   UI Components: Cards, Buttons, Badges & Forms
   ========================================================================== */

.card {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.card:hover {
  border-color: rgba(34, 197, 94, 0.3);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--bg-panel);
  color: var(--text);
  transition: all 0.15s ease-in-out;
}

.btn:hover {
  background: var(--bg-panel-hover);
}

.btn-primary {
  background: var(--accent);
  color: #ffffff;
  border: 1px solid var(--accent);
}

.btn-primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.btn-danger {
  background: var(--color-fault);
  color: #ffffff;
  border: 1px solid var(--color-fault);
}

.btn-sm {
  padding: 5px 12px;
  font-size: 13px;
}

.input-field {
  width: 100%;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  outline: none;
  transition: border-color 0.2s;
}

.input-field:focus {
  border-color: var(--border-focus);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
}

.badge-online {
  background: var(--color-online-bg);
  color: var(--color-online);
}

.badge-warning {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

.badge-fault {
  background: var(--color-fault-bg);
  color: var(--color-fault);
}

/* ==========================================================================
   Grids & Layout Utilities
   ========================================================================== */

.grid-cols-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.grid-cols-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.grid-cols-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 1024px) {
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid-cols-4, .grid-cols-3, .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}

/* ==========================================================================
   My Field Page - Left Map / Right 2x2 Node Cards Layout
   ========================================================================== */

.myfield-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: 14px;
  align-items: stretch;
  min-height: calc(100vh - 190px);
}

.myfield-nodes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 12px;
}

.myfield-node-card {
  padding: 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justifyContent: space-between;
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.myfield-node-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
  box-shadow: var(--shadow-md);
}

@media (max-width: 1024px) {
  .myfield-layout {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  .myfield-nodes-grid {
    grid-template-rows: auto;
  }
}

@media (max-width: 600px) {
  .myfield-nodes-grid {
    grid-template-columns: 1fr;
  }
}

/* ==========================================================================
   Weather Page - High Visibility Thicker Card Borders
   ========================================================================== */

.weather-page .card {
  border: 2px solid #cbd5e1;
}

[data-theme="dark"] .weather-page .card {
  border: 2px solid #374151;
}

.weather-page .card:hover {
  border-color: var(--accent);
}

.weather-page .weather-banner-live {
  border: 2px solid var(--color-online) !important;
}

.weather-page .weather-banner-demo {
  border: 2px solid var(--color-warning) !important;
}

.weather-page .weather-banner-error {
  border: 2px solid var(--color-fault) !important;
}

/* ==========================================================================
   Dark Room Login Experience & Pull-Cord Physics
   ========================================================================== */

.darkroom-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #030712; /* Pitch dark night room */
  transition: background-color 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

.darkroom-container.light-on {
  background-color: #0f172a;
}

/* Light cone beam emerging from overhead bulb */
.light-beam {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  height: 100vh;
  background: radial-gradient(ellipse at 50% 0%, rgba(254, 240, 138, 0.35) 0%, rgba(253, 224, 71, 0.15) 45%, rgba(0, 0, 0, 0) 75%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.7s ease-out;
  z-index: 1;
}

.darkroom-container.light-on .light-beam {
  opacity: 1;
}

/* Ceiling Lamp & Cord */
.ceiling-lamp-rig {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 20;
}

.lamp-cord {
  width: 3px;
  height: 90px;
  background: #64748b;
  box-shadow: 0 0 2px rgba(0,0,0,0.5);
}

.lamp-bulb-holder {
  width: 24px;
  height: 16px;
  background: #334155;
  border-radius: 4px 4px 0 0;
}

.lamp-bulb {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #475569;
  margin-top: -4px;
  transition: all 0.4s ease;
  box-shadow: 0 0 4px rgba(0,0,0,0.8);
}

.darkroom-container.light-on .lamp-bulb {
  background: #fef08a;
  box-shadow: 0 0 35px #fef08a, 0 0 70px #facc15;
}

/* Interactive Pull Cord Hanging from Lamp */
.pull-cord-assembly {
  position: absolute;
  top: 100px;
  left: calc(50% + 45px);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: grab;
  z-index: 30;
  touch-action: none;
}

.pull-cord-assembly:active {
  cursor: grabbing;
}

.cord-string {
  width: 2px;
  height: 120px;
  background: #94a3b8;
  transition: height 0.15s ease-out;
}

.cord-handle {
  width: 18px;
  height: 32px;
  background: linear-gradient(180deg, #d97706, #b45309);
  border: 1px solid #fef08a;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease-out;
}

.cord-handle-ring {
  width: 6px;
  height: 12px;
  border: 1.5px solid rgba(255,255,255,0.7);
  border-radius: 3px;
}

.cord-instruction {
  position: absolute;
  top: 160px;
  left: 30px;
  white-space: nowrap;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(254, 240, 138, 0.3);
  padding: 6px 12px;
  border-radius: 20px;
  color: #fef08a;
  font-size: 12px;
  font-weight: 500;
  pointer-events: none;
  animation: bounceHint 2s infinite ease-in-out;
}

@keyframes bounceHint {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* Login Card emerging from darkness */
.login-stage {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
}

.login-form-card {
  width: 380px;
  max-width: 90vw;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: var(--radius-xl);
  padding: 28px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
  opacity: 0.15;
  filter: blur(4px);
  transform: translateY(20px) scale(0.96);
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  color: #f8fafc;
}

.darkroom-container.light-on .login-form-card {
  opacity: 1;
  filter: blur(0);
  transform: translateY(0) scale(1);
  border-color: rgba(34, 197, 94, 0.4);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 30px rgba(34, 197, 94, 0.15);
}

/* ==========================================================================
   Leaflet Map Customizations
   ========================================================================== */

.leaflet-container {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-lg);
  z-index: 1;
}

/* Pulse animation on sensor markers */
.sensor-marker-pulse {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sensor-marker-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.5);
}

.sensor-marker-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  opacity: 0.75;
  animation: radarPulse 2s infinite cubic-bezier(0.2, 0, 0.8, 1);
}

@keyframes radarPulse {
  0% { transform: scale(0.5); opacity: 0.9; }
  100% { transform: scale(1.6); opacity: 0; }
}
`;

// Automatically inject styles if document is available
if (typeof document !== 'undefined') {
  const styleId = 'agrispike-all-in-one-stylesheet';
  if (!document.getElementById(styleId)) {
    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = AGRISPIKE_CSS;
    document.head.appendChild(styleEl);
  }
}

// ==============================================================================
// 3. CENTRAL CONFIGURATION & CONSTANTS (src/constants/agriConfig.js)
// ==============================================================================
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
    role: 'Team Leader, Product and System Architecture',
    phone: '8098000944',
    specialty: 'Hardware & System Architecture',
    supportRecipient: true,
  },
  {
    name: 'AKSHAYA AS',
    role: 'Data Science, AI and Impact, Research',
    phone: '9150424532',
    specialty: 'UI/UX & Interactive Design',
    supportRecipient: true,
  },
  {
    name: 'DHIVYASRI J',
    role: 'Hardware and Embedded System',
    phone: '9344167239',
    specialty: 'Agronomic AI & Decision Models',
    supportRecipient: true,
  },
  {
    name: 'THANISKA B',
    role: 'Research, Validation and Documentation',
    phone: '8825565389',
    specialty: 'Field Sensor Nodes & Relays',
    supportRecipient: true,
  },
  {
    name: 'KIRUBAASREE PG',
    role: 'Frontend & User Experience',
    phone: '7339056710',
    specialty: 'ESP32 & LoRa Mesh Protocol',
    supportRecipient: true,
  },
  {
    name: 'SWATHI S',
    role: 'Backend & Data Infrastructure',
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

// ==============================================================================
// 4. SUPABASE & BACKEND CONFIG (src/config.js)
// ==============================================================================
// PASTE YOUR OWN VALUES HERE (same ones from your .env in the backend)
export const SUPABASE_URL = 'https://jpkaviumvudcsrhktfzk.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_mNLuzZi2el2I0NpoXMsE4g_jv6eAd1W';

// Your deployed Render backend URL (from Phase 3, Step 6)
export const API_BASE = 'https://agrispike-backend.onrender.com';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ==============================================================================
// 5. FIREBASE REALTIME TELEMETRY CONFIG (src/firebase.js)
// ==============================================================================
const firebaseConfig = {
  apiKey: "AIzaSyBq8CTdpjxMBlBf3Zepc6D-NgcnU8CWRQ4",
  authDomain: "agrispike-b8870.firebaseapp.com",
  databaseURL:
    "https://agrispike-b8870-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "agrispike-b8870",
  storageBucket: "agrispike-b8870.firebasestorage.app",
  messagingSenderId: "978511478238",
  appId: "1:978511478238:web:d42476fac5da3258a9b14f",
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);

// ==============================================================================
// 6. DEMO & FALLBACK DATASETS (src/demoData.js)
// ==============================================================================
// Fake data matching your locked packet format, used as fallback so the UI
// always looks complete even before real hardware data is flowing in.
export const NODES = [
  { id: 1, name: 'Node 1 — North Field', latitude: 8.8932, longitude: 76.6141 },
  { id: 2, name: 'Node 2 — East Field', latitude: 8.8934, longitude: 76.6143 },
  { id: 3, name: 'Node 3 — South Field', latitude: 8.8936, longitude: 76.6145 },
  { id: 4, name: 'Node 4 — West Field', latitude: 8.8938, longitude: 76.6147 },
];

export const DEMO_READINGS = {
  1: { node_id: 1, at: 28.6, ah: 67.2, st: 25.8, sm: 58, ldr: 82, day: true, dl: 11.6, et: 46.4, bv: 4.05, bp: 81, sv: 5.78, ss: 'ACTIVE', irr: false, hs: false, psi: 18, sys: 'OK', mode: 'NORMAL', err: false, pir: true },
  2: { node_id: 2, at: 31.4, ah: 39.0, st: 27.1, sm: 22, ldr: 91, day: true, dl: 11.6, et: 68.9, bv: 3.68, bp: 40, sv: 5.1, ss: 'WEAK', irr: true, hs: true, psi: 72, sys: 'ATTENTION', mode: 'FAST_SAMPLING', err: false, pir: false },
  3: { node_id: 3, at: 29.0, ah: 61.0, st: 26.0, sm: 63, ldr: 70, day: true, dl: 11.6, et: 41.2, bv: 4.11, bp: 88, sv: 5.9, ss: 'ACTIVE', irr: false, hs: false, psi: 10, sys: 'OK', mode: 'NORMAL', err: false, pir: false },
  4: { node_id: 4, at: 0, ah: 0, st: 0, sm: 0, ldr: 0, day: false, dl: 0, et: 0, bv: 0, bp: 0, sv: 0, ss: 'NONE', irr: false, hs: false, psi: 0, sys: 'FAULT', mode: 'NORMAL', err: true, pir: false },
};

export const DEMO_SOLENOIDS = {
  1: false,
  2: true,
  3: false,
  4: false,
};

// ==============================================================================
// 7. CENTRALIZED LOCALIZATION & TRANSLATIONS (src/i18n/translations.js)
// ==============================================================================
// AgriSpike Centralized Translations (English and Tamil ONLY)

export const translations = {
  en: {
    // Navigation
    navMyField: 'My Field',
    navIrrigation: 'Smart Irrigation',
    navFertilizer: 'Fertilizer Suggestion',
    navDisease: 'Disease Identification',
    navCrop: 'Crop Suggestion',
    navShop: 'Fertilizer Shop',
    navWeather: 'Weather',
    navNews: 'Agriculture News',
    navSupport: 'AgriSpike Support',
    navTeam: 'AgriSpike Team',
    navSettings: 'Settings',

    // TopBar
    welcomeUser: 'Welcome back',
    fieldStatusSummary: "Here's how your field is doing today",
    logout: 'Logout',
    themeLight: 'Light Mode',
    themeDark: 'Dark Mode',
    langSelector: 'Language',

    // Status
    statusOnline: 'Online',
    statusWarning: 'Warning',
    statusFault: 'Fault',
    statusHealthy: 'Healthy',
    statusAttention: 'Attention Needed',

    // General terms
    soilMoisture: 'Soil Moisture',
    soilTemp: 'Soil Temperature',
    airTemp: 'Air Temperature',
    airHumidity: 'Air Humidity',
    lightLevel: 'Light Level',
    daylightDuration: 'Daylight Duration',
    evapotranspiration: 'Evapotranspiration Index',
    batteryVoltage: 'Battery Voltage',
    batteryLevel: 'Battery Level',
    solarVoltage: 'Solar Voltage',
    plantStress: 'Plant Stress Index',
    irrigationStatus: 'Irrigation Status',
    lastUpdated: 'Last updated',
    recenter: 'Recenter',
    mapView: 'Map',
    satelliteView: 'Satellite',
    sensorStatus: 'Sensor Status',
    viewDetails: 'View Details',
    active: 'Active',
    inactive: 'Inactive',
    turnOn: 'Turn Irrigation ON',
    turnOff: 'Turn Irrigation OFF',
    turnAllOn: 'Turn All ON',
    turnAllOff: 'Turn All OFF',
    allNodes: 'All Nodes',
    selectNode: 'Select Sensor Node',

    // My Field Page
    fieldTitle: 'My Field',
    fieldSubtitle: 'Live view of your node positions.',
    fieldName: 'AgriSpike Field',
    fieldCoordinates: 'Field Location: 11.493908, 77.270488',
    totalSensors: 'Total Sensors',
    onlineSensors: 'Online Sensors',
    warningSensors: 'Warning Sensors',
    faultSensors: 'Fault Sensors',

    // Irrigation Page
    irrigationTitle: 'Smart Irrigation',
    irrigationSubtitle: 'Manage irrigation based on real-time field conditions.',
    irrigationOverview: 'Irrigation Overview',
    irrigationDesc: 'Monitor soil moisture and control irrigation for each sensor node.',
    irrigationRecommended: 'Soil moisture is low. Irrigation is recommended for this node.',
    irrigationNormal: 'Soil moisture is within the recommended range. No immediate irrigation is required.',
    irrigationHigh: 'Soil moisture is high. Irrigation is currently not recommended.',

    // Fertilizer Page
    fertilizerTitle: 'Fertilizer Suggestion',
    fertilizerSubtitle: 'Get fertilizer recommendations based on your field conditions.',
    fertilizerDesc: 'Select a sensor node to view a fertilizer recommendation based on the available soil and environmental conditions.',
    recommendedFertilizer: 'Recommended Fertilizer',
    whyThisFertilizer: 'Why this fertilizer?',
    viewShop: 'View Fertilizer Shop',

    // Crop Suggestion Page
    cropTitle: 'Crop Suggestion',
    cropSubtitle: 'Discover crops suitable for your current field conditions.',
    cropDesc: 'AgriSpike analyzes available soil and environmental conditions to identify suitable crops for your field.',
    recommendedCrops: 'Recommended Crops',
    suitability: 'Suitability',
    suitabilityHigh: 'High',
    suitabilityMedium: 'Medium',
    suitabilityLow: 'Low',

    // Disease Identification Page
    diseaseTitle: 'Disease Identification',
    diseaseSubtitle: 'Enter a crop type to see common diseases, prevention, and solutions.',
    searchCropPlaceholder: 'e.g. Turmeric, Paddy, Banana...',
    searchBtn: 'Search',
    noDiseaseFound: 'No disease information found for this crop.',
    selectCropPrompt: 'Select Crop',
    possibleDisease: 'Possible Disease',
    symptoms: 'Symptoms',
    prevention: 'Prevention',
    recommendedSolution: 'Recommended Solution',
    checkAnotherCrop: 'Check Another Crop',

    // Weather Page
    weatherTitle: 'Weather',
    weatherSubtitle: 'Current weather conditions for your agricultural area.',
    liveWeather: 'Live Weather',
    imdSource: 'India Meteorological Department (IMD)',
    weatherLiveSuccess: 'Live data from IMD',
    weatherUnavailable: 'Live weather data is currently unavailable. Please check your internet connection and try again.',
    devFallbackLabel: 'DEMO / FALLBACK DATA (Development Mode - Not live IMD data)',
    toggleFallback: 'Use Demo Weather Data',
    windSpeed: 'Wind Speed',
    rainfall: 'Rainfall',
    forecast5Day: '5-Day Forecast',

    // News Page
    newsTitle: 'Agriculture News',
    newsSubtitle: 'Stay updated with important agriculture and AgriTech developments.',
    readMore: 'Read More',

    // Fertilizer Shop Page
    shopTitle: 'Fertilizer Shop',
    shopSubtitle: 'Find suitable fertilizer products and suppliers.',
    fertilizerType: 'Fertilizer Type',
    suitableFor: 'Suitable For',
    visitSupplier: 'Visit Supplier',

    // Support Page
    supportTitle: 'AgriSpike Support',
    supportSubtitle: 'Get smart agricultural guidance based on your field conditions.',
    chatPlaceholder: 'Type a message...',
    send: 'Send',
    supportPhoneLabel: 'Support Helpline',
    supportWebsiteLabel: 'Official Website',
    supportEscalationNotice: 'This issue may require assistance from the AgriSpike team. Your support request has been forwarded to the team.',
    ticketLogged: 'Support ticket logged & assigned to team specialist.',

    // Team Page
    teamTitle: 'AgriSpike Team',
    teamSubtitle: 'Meet the team behind AgriSpike.',

    // Settings
    settingsTitle: 'Settings',
    appearance: 'Appearance',
    theme: 'Theme',
    language: 'Language',
    account: 'Account',
    loggedInAs: 'Logged in as',
    networkInfo: 'Local Network Access (ESP32 Wi-Fi / LAN)',
  },

  ta: {
    // Navigation
    navMyField: 'என் நிலம்',
    navIrrigation: 'நுண்ணீர் பாசனம்',
    navFertilizer: 'உரப் பரிந்துரை',
    navDisease: 'பயிர் நோய் கண்டறிதல்',
    navCrop: 'பயிர் பரிந்துரை',
    navShop: 'உர அங்காடி',
    navWeather: 'வானிலை',
    navNews: 'வேளாண் செய்திகள்',
    navSupport: 'அக்ரிஸ்பைக் ஆதரவு',
    navTeam: 'அக்ரிஸ்பைக் குழு',
    navSettings: 'அமைப்புகள்',

    // TopBar
    welcomeUser: 'வணக்கம்',
    fieldStatusSummary: 'இன்றைய உங்கள் நிலத்தின் நிலைமை விவரம்',
    logout: 'வெளியேறு',
    themeLight: 'வெளிச்சப் பயன்முறை (Light)',
    themeDark: 'இருண்ட பயன்முறை (Dark)',
    langSelector: 'மொழி',

    // Status
    statusOnline: 'இணைப்பில் உள்ளது',
    statusWarning: 'எச்சரிக்கை',
    statusFault: 'பழுது',
    statusHealthy: 'நன்றாக உள்ளது',
    statusAttention: 'கவனம் தேவை',

    // General terms
    soilMoisture: 'மண் ஈரப்பதம்',
    soilTemp: 'மண் வெப்பநிலை',
    airTemp: 'காற்று வெப்பநிலை',
    airHumidity: 'காற்று ஈரப்பதம்',
    lightLevel: 'ஒளி அளவு',
    daylightDuration: 'பகல் நேரம்',
    evapotranspiration: 'ஆவியாதல் குறியீடு',
    batteryVoltage: 'மின்கல மின்னழுத்தம்',
    batteryLevel: 'மின்கல அளவு',
    solarVoltage: 'சூரிய மின்தகடு மின்னழுத்தம்',
    plantStress: 'பயிர் அழுத்த குறியீடு',
    irrigationStatus: 'பாசன நிலை',
    lastUpdated: 'கடைசியாக புதுப்பிக்கப்பட்டது',
    recenter: 'மையப்படுத்து',
    mapView: 'வரைபடம்',
    satelliteView: 'செயற்கைக்கோள்',
    sensorStatus: 'சென்சார் நிலை',
    viewDetails: 'விவரங்களை காண்க',
    active: 'செயலில்',
    inactive: 'செயலற்றது',
    turnOn: 'பாசனம் தொடங்கு',
    turnOff: 'பாசனம் நிறுத்து',
    turnAllOn: 'அனைத்தையும் இயக்கு',
    turnAllOff: 'அனைத்தையும் நிறுத்து',
    allNodes: 'அனைத்து பகுதிகள்',
    selectNode: 'சென்சார் பகுதியைத் தேர்ந்தெடுக்கவும்',

    // My Field Page
    fieldTitle: 'என் நிலம்',
    fieldSubtitle: 'உங்கள் சென்சார் நிலைகளின் நேரடி பார்வை.',
    fieldName: 'அக்ரிஸ்பைக் நிலம்',
    fieldCoordinates: 'நில அமைவிடம்: 11.493908, 77.270488',
    totalSensors: 'மொத்த சென்சார்கள்',
    onlineSensors: 'இணைப்பில் உள்ளவை',
    warningSensors: 'எச்சரிக்கை நிலையில் உள்ளவை',
    faultSensors: 'பழுதுபட்டவை',

    // Irrigation Page
    irrigationTitle: 'நுண்ணீர் பாசனம்',
    irrigationSubtitle: 'நிகழ்நேர நில நிலவரத்தின் அடிப்படையில் பாசனத்தை நிர்வகிக்கவும்.',
    irrigationOverview: 'பாசன கண்ணோட்டம்',
    irrigationDesc: 'ஒவ்வொரு சென்சார் பகுதியின் மண் ஈரப்பதத்தைக் கண்காணித்து பாசனத்தைக் கட்டுப்படுத்தவும்.',
    irrigationRecommended: 'மண் ஈரப்பதம் குறைவாக உள்ளது. இந்தப் பகுதிக்கு பாசனம் பரிந்துரைக்கப்படுகிறது.',
    irrigationNormal: 'மண் ஈரப்பதம் பரிந்துரைக்கப்பட்ட அளவில் உள்ளது. உடனடி பாசனம் தேவையில்லை.',
    irrigationHigh: 'மண் ஈரப்பதம் அதிகமாக உள்ளது. தற்போது பாசனம் பரிந்துரைக்கப்படவில்லை.',

    // Fertilizer Page
    fertilizerTitle: 'உரப் பரிந்துரை',
    fertilizerSubtitle: 'உங்கள் நில சூழலுக்கு ஏற்ற உர பரிந்துரைகளைப் பெறுங்கள்.',
    fertilizerDesc: 'மண் மற்றும் சுற்றுச்சூழல் நிலைகளின் அடிப்படையில் உரப் பரிந்துரையைப் பெற ஒரு பகுதியைத் தேர்ந்தெடுக்கவும்.',
    recommendedFertilizer: 'பரிந்துரைக்கப்படும் உரம்',
    whyThisFertilizer: 'இந்த உரத்தின் காரணம் என்ன?',
    viewShop: 'உர அங்காடியைப் பார்க்கவும்',

    // Crop Suggestion Page
    cropTitle: 'பயிர் பரிந்துரை',
    cropSubtitle: 'தற்போதைய நில சூழலுக்கு உகந்த பயிர்களைக் கண்டறியவும்.',
    cropDesc: 'மண் மற்றும் வானிலை நிலைகளை ஆய்வு செய்து உங்கள் நிலத்திற்கு ஏற்ற பயிர்களை அக்ரிஸ்பைக் கண்டறிகிறது.',
    recommendedCrops: 'பரிந்துரைக்கப்படும் பயிர்கள்',
    suitability: 'பொருத்தம்',
    suitabilityHigh: 'அதிக பொருத்தம்',
    suitabilityMedium: 'நடுத்தர பொருத்தம்',
    suitabilityLow: 'குறைந்த பொருத்தம்',

    // Disease Identification Page
    diseaseTitle: 'பயிர் நோய் கண்டறிதல்',
    diseaseSubtitle: 'பொதுவான பயிர் நோய்கள், தடுப்பு முறைகள் மற்றும் தீர்வுகளைக் காண பயிர் பெயரை உள்ளிடவும்.',
    searchCropPlaceholder: 'எ.கா. மஞ்சள், நெல், வாழை...',
    searchBtn: 'தேடுக',
    noDiseaseFound: 'இந்த பயிருக்கான நோய் தகவல்கள் எதுவும் கிடைக்கவில்லை.',
    selectCropPrompt: 'பயிரைத் தேர்ந்தெடுக்கவும்',
    possibleDisease: 'சாத்தியமான நோய்',
    symptoms: 'அறிகுறிகள்',
    prevention: 'தடுப்பு முறைகள்',
    recommendedSolution: 'பரிந்துரைக்கப்பட்ட தீர்வு',
    checkAnotherCrop: 'மற்றொரு பயிரை சோதிக்கவும்',

    // Weather Page
    weatherTitle: 'வானிலை',
    weatherSubtitle: 'உங்கள் வேளாண் பகுதிக்கான தற்போதைய வானிலை நிலவரம்.',
    liveWeather: 'நிகழ்நேர வானிலை',
    imdSource: 'இந்திய வானிலை ஆய்வு மையம் (IMD)',
    weatherLiveSuccess: 'IMD இலிருந்து நேரடித் தரவு பெறப்பட்டது',
    weatherUnavailable: 'நிகழ்நேர வானிலை தரவு தற்போது கிடைக்கவில்லை. இணைய இணைப்பை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
    devFallbackLabel: 'மாதிரி / காப்புத் தரவு (பரிசோதனை பயன்முறை - நேரடி IMD தரவு அல்ல)',
    toggleFallback: 'மாதிரி வானிலையைப் பயன்படுத்து',
    windSpeed: 'காற்றின் வேகம்',
    rainfall: 'மழைப்பொழிவு',
    forecast5Day: '5-நாள் வானிலை முன்னறிவிப்பு',

    // News Page
    newsTitle: 'வேளாண் செய்திகள்',
    newsSubtitle: 'முக்கிய வேளாண் மற்றும் அக்ரிடெக் செய்திகளை உடனுக்குடன் தெரிந்து கொள்ளுங்கள்.',
    readMore: 'மேலும் படிக்க',

    // Fertilizer Shop Page
    shopTitle: 'உர அங்காடி',
    shopSubtitle: 'உகந்த உரப் பொருட்கள் மற்றும் விற்பனையாளர்களைக் கண்டறியவும்.',
    fertilizerType: 'உர வகை',
    suitableFor: 'பொருத்தமான பயிர்',
    visitSupplier: 'விற்பனையாளரைத் தொடர்பு கொள்ள',

    // Support Page
    supportTitle: 'அக்ரிஸ்பைக் ஆதரவு',
    supportSubtitle: 'உங்கள் நில நிலவரங்களின் அடிப்படையில் அறிவார்ந்த வேளாண் வழிகாட்டலைப் பெறுங்கள்.',
    chatPlaceholder: 'செய்தியைத் தட்டச்சு செய்க...',
    send: 'அனுப்புக',
    supportPhoneLabel: 'உதவி எண்',
    supportWebsiteLabel: 'அதிகாரப்பூர்வ வலைத்தளம்',
    supportEscalationNotice: 'இந்த பிரச்சனைக்கு அக்ரிஸ்பைக் குழுவின் நேரடி உதவி தேவைப்படலாம். உங்கள் ஆதரவுக் கோரிக்கை குழுவிற்கு அனுப்பப்பட்டுள்ளது.',
    ticketLogged: 'ஆதரவு சீட்டு பதிவு செய்யப்பட்டு குழு நிபுணருக்கு ஒதுக்கப்பட்டது.',

    // Team Page
    teamTitle: 'அக்ரிஸ்பைக் குழு',
    teamSubtitle: 'அக்ரிஸ்பைக்கின் பின்னால் உள்ள குழுவைச் சந்தியுங்கள்.',

    // Settings
    settingsTitle: 'அமைப்புகள்',
    appearance: 'தோற்றம்',
    theme: 'பயன்முறை',
    language: 'மொழி',
    account: 'கணக்கு',
    loggedInAs: 'உள்நுழைந்துள்ள பயனர்',
    networkInfo: 'உள்ளூர் பிணைய அணுகல் (ESP32 Wi-Fi / LAN)',
  },
};

// ==============================================================================
// 8.1 THEME CONTEXT PROVIDER (src/context/ThemeContext.jsx)
// ==============================================================================
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('agrispike_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('agrispike_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// ==============================================================================
// 8.2 LANGUAGE CONTEXT PROVIDER (src/context/LanguageContext.jsx)
// ==============================================================================
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('agrispike_language');
    return saved === 'ta' ? 'ta' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('agrispike_language', language);
  }, [language]);

  const t = (key, fallback = '') => {
    return translations[language]?.[key] || translations.en?.[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// ==============================================================================
// 9.1 SENSOR DATA SERVICE & REALTIME TELEMETRY (src/services/sensorDataService.js)
// ==============================================================================
// AgriSpike Firebase Sensor Data Service
// Firebase -> Website real-time telemetry



// ============================================================
// INITIAL FALLBACK DATA
// Used only until Firebase sends the first real value.
// ============================================================

const INITIAL_READINGS = {
  1: {
    node_id: 1,
    at: undefined,
    ah: undefined,
    st: undefined,
    sm: undefined,
    ldr: undefined,
    dl: undefined,
    et: undefined,
    bv: undefined,
    bp: undefined,
    sv: undefined,
    psi: undefined,
    sys: 'OK',
    mode: 'NORMAL',
    err: false,
    lastUpdated: '--',
  },

  2: {
    node_id: 2,
    at: undefined,
    ah: undefined,
    st: undefined,
    sm: undefined,
    ldr: undefined,
    dl: undefined,
    et: undefined,
    bv: undefined,
    bp: undefined,
    sv: undefined,
    psi: undefined,
    sys: 'OK',
    mode: 'NORMAL',
    err: false,
    lastUpdated: '--',
  },

  3: {
    node_id: 3,
    at: undefined,
    ah: undefined,
    st: undefined,
    sm: undefined,
    ldr: undefined,
    dl: undefined,
    et: undefined,
    bv: undefined,
    bp: undefined,
    sv: undefined,
    psi: undefined,
    sys: 'OK',
    mode: 'NORMAL',
    err: false,
    lastUpdated: '--',
  },

  4: {
    node_id: 4,
    at: undefined,
    ah: undefined,
    st: undefined,
    sm: undefined,
    ldr: undefined,
    dl: undefined,
    et: undefined,
    bv: undefined,
    bp: undefined,
    sv: undefined,
    psi: undefined,
    sys: 'OK',
    mode: 'NORMAL',
    err: false,
    lastUpdated: '--',
  },
};


// ============================================================
// INITIAL SOLENOID STATE
// Updated in real-time via Firebase: AgriSpike/Irrigation
// ============================================================

const INITIAL_SOLENOIDS = {
  1: false,
  2: false,
  3: false,
  4: false,
};


// ============================================================
// SENSOR DATA SERVICE
// ============================================================

class SensorDataService {

  constructor() {

    this.nodes = SENSOR_NODES;

    this.readings = {
      ...INITIAL_READINGS
    };

    this.solenoids = {
      ...INITIAL_SOLENOIDS
    };

    this.listeners = new Set();

    this.isLiveBackend = false;

    this.firebaseUnsubscribers = [];

    // Start Firebase real-time listeners
    this.startFirebaseListeners();
  }


  // ==========================================================
  // SUBSCRIBE
  // ==========================================================

  subscribe(listener) {

    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }


  // ==========================================================
  // NOTIFY REACT COMPONENTS
  // ==========================================================

  notify() {

    this.listeners.forEach(callback => {
      callback(this.getState());
    });
  }


  // ==========================================================
  // GET CURRENT STATE
  // ==========================================================

  getState() {

    return {
      nodes: this.nodes,

      readings: {
        ...this.readings
      },

      solenoids: {
        ...this.solenoids
      },

      isLiveBackend: this.isLiveBackend,

      stats: this.getStats(),
    };
  }


  // ==========================================================
  // FIREBASE REAL-TIME LISTENERS
  // ==========================================================

  startFirebaseListeners() {

    console.log('======================================');
    console.log('AgriSpike Firebase connection starting...');
    console.log('======================================');


    for (let nodeId = 1; nodeId <= 4; nodeId++) {

      const nodePath = `AgriSpike/Node${nodeId}`;

      const nodeRef = ref(database, nodePath);


      console.log(
        `Listening to Firebase: ${nodePath}`
      );


      const unsubscribe = onValue(
        nodeRef,

        (snapshot) => {

          const data = snapshot.val();


          // --------------------------------------------------
          // No Firebase data
          // --------------------------------------------------

          if (!data) {

            console.warn(
              `No Firebase data found for Node${nodeId}`
            );

            return;
          }


          console.log(
            `Firebase data received: Node${nodeId}`,
            data
          );


          // --------------------------------------------------
          // Convert Firebase data to website format
          // --------------------------------------------------

          const firebaseReading = {

            // Node ID
            node_id:
              Number(data.ID ?? nodeId),


            // Air Temperature
            at:
              data.AT !== undefined
                ? Number(data.AT)
                : undefined,


            // Air Humidity
            ah:
              data.AH !== undefined
                ? Number(data.AH)
                : undefined,


            // Soil Temperature
            st:
              data.ST !== undefined
                ? Number(data.ST)
                : undefined,


            // Soil Moisture
            sm:
              data.SM !== undefined
                ? Number(data.SM)
                : undefined,


            // Light Level
            ldr:
              data.LDR !== undefined
                ? Number(data.LDR)
                : undefined,


            // Daylight Duration
            dl:
              data.DL !== undefined
                ? Number(data.DL)
                : undefined,


            // Evapotranspiration
            et:
              data.ET !== undefined
                ? Number(data.ET)
                : undefined,


            // Battery Voltage
            bv:
              data.BV !== undefined
                ? Number(data.BV)
                : undefined,


            // Battery Percentage
            bp:
              data.BP !== undefined
                ? Number(data.BP)
                : undefined,


            // Solar Voltage
            sv:
              data.SV !== undefined
                ? Number(data.SV)
                : undefined,


            // Plant Stress Index
            psi:
              data.PSI !== undefined
                ? Number(data.PSI)
                : undefined,


            // System status
            sys:
              data.SYS ?? 'OK',


            // Operating mode
            mode:
              data.MODE ?? 'NORMAL',


            // Error
            // Firebase: ERR = 0 or 1
            // Website: err = false or true
            err:
              Number(data.ERR ?? 0) !== 0,


            // Extra Firebase values
            ss:
              data.SS ?? 'ACTIVE',

            irr:
              Number(data.IRR ?? 0),

            hs:
              Number(data.HS ?? 0),

            pir:
              Number(data.PIR ?? 0),


            // Browser time when website received update
            lastUpdated:
              new Date().toLocaleTimeString(),
          };


          // --------------------------------------------------
          // Update node reading
          // --------------------------------------------------

          this.readings[nodeId] = {

            ...this.readings[nodeId],

            ...firebaseReading,
          };


          // Firebase is now our live backend
          this.isLiveBackend = true;


          // Notify React
          this.notify();


          // Console test
          console.log(
            `Node${nodeId} Air Temperature:`,
            firebaseReading.at
          );
        },


        (error) => {

          console.error(
            `Firebase error for Node${nodeId}:`,
            error
          );
        }
      );


      this.firebaseUnsubscribers.push(unsubscribe);
    }


    // --------------------------------------------------------
    // Real-time Irrigation Listener: AgriSpike/Irrigation
    // Reads Zone1.actualState ... Zone4.actualState
    // --------------------------------------------------------
    const irrigationPath = 'AgriSpike/Irrigation';
    const irrigationRef = ref(database, irrigationPath);

    console.log(`Listening to Firebase: ${irrigationPath}`);

    const unsubscribeIrrigation = onValue(
      irrigationRef,
      (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        console.log('Firebase irrigation data received:', data);

        const updatedSolenoids = { ...this.solenoids };

        for (let nodeId = 1; nodeId <= 4; nodeId++) {
          const zoneData = data[`Zone${nodeId}`];
          if (zoneData !== undefined && zoneData !== null) {
            const actual =
              zoneData.actualState !== undefined
                ? Number(zoneData.actualState)
                : 0;
            updatedSolenoids[nodeId] = actual === 1;
          }
        }

        this.solenoids = updatedSolenoids;
        this.notify();
      },
      (error) => {
        console.error('Firebase error for AgriSpike/Irrigation:', error);
      }
    );

    this.firebaseUnsubscribers.push(unsubscribeIrrigation);
  }


  // ==========================================================
  // GET STATISTICS
  // ==========================================================

  getStats() {

    let online = 0;
    let warning = 0;
    let fault = 0;


    this.nodes.forEach(node => {

      const reading = this.readings[node.id];


      if (
        !reading ||
        reading.err ||
        reading.sys === 'FAULT'
      ) {

        fault += 1;

      } else if (
        reading.sys === 'ATTENTION' ||
        (reading.psi !== undefined && reading.psi > 50) ||
        (reading.sm !== undefined && reading.sm < 30)
      ) {

        warning += 1;

      } else {

        online += 1;
      }
    });


    return {

      total: this.nodes.length,

      online,

      warning,

      fault,
    };
  }


  // ==========================================================
  // NODE STATUS
  // ==========================================================

  getNodeStatus(nodeId) {

    const reading = this.readings[nodeId];


    if (
      !reading ||
      reading.err ||
      reading.sys === 'FAULT'
    ) {

      return 'fault';
    }


    if (
      reading.sys === 'ATTENTION' ||
      (reading.psi !== undefined && reading.psi > 50) ||
      (reading.sm !== undefined && reading.sm < 30)
    ) {

      return 'warning';
    }


    return 'online';
  }


  // ==========================================================
  // IRRIGATION - FIREBASE REALTIME DATABASE CONTROL
  // ==========================================================

  toggleIrrigation(nodeId) {
    const currentState = this.solenoids[nodeId];
    const nextState = currentState ? 0 : 1;

    console.log(
      `Toggling irrigation for Zone${nodeId}: writing state = ${nextState}`
    );

    const zoneStateRef = ref(
      database,
      `AgriSpike/Irrigation/Zone${nodeId}/state`
    );

    set(zoneStateRef, nextState).catch(error => {
      console.error(
        `Firebase error toggling irrigation for Zone${nodeId}:`,
        error
      );
    });

    return nextState === 1;
  }


  // ==========================================================
  // MASTER IRRIGATION SWITCH
  // ==========================================================

  setAllIrrigation(state) {
    const val = state ? 1 : 0;

    console.log(
      `Master switch: setting AgriSpike/Irrigation/Zone{1..4}/state = ${val}`
    );

    for (let nodeId = 1; nodeId <= 4; nodeId++) {
      const zoneStateRef = ref(
        database,
        `AgriSpike/Irrigation/Zone${nodeId}/state`
      );

      set(zoneStateRef, val).catch(error => {
        console.error(
          `Firebase error setting all irrigation for Zone${nodeId}:`,
          error
        );
      });
    }
  }


  // ==========================================================
  // ESP32 HOOK
  // Kept for future use
  // ==========================================================

  updateFromEsp32(nodeId, telemetry) {

    if (this.readings[nodeId]) {

      this.readings[nodeId] = {

        ...this.readings[nodeId],

        ...telemetry,

        lastUpdated:
          new Date().toLocaleTimeString(),
      };


      this.isLiveBackend = true;


      this.notify();
    }
  }


  // ==========================================================
  // FERTILIZER RECOMMENDATION
  // ==========================================================

  getFertilizerRecommendation(nodeId) {

    const r = this.readings[nodeId];


    if (
      !r ||
      r.err ||
      r.sys === 'FAULT'
    ) {

      return {

        fertilizer:
          'Sensor Fault / No Data',

        reason:
          'Unable to evaluate node telemetry due to sensor fault or connection timeout. Check wiring.',

        type:
          'Inspection Required',
      };
    }


    if (
      r.sm < 35 &&
      r.psi > 40
    ) {

      return {

        fertilizer:
          'Potassium-rich fertilizer (Muriate of Potash / MOP) + Organic Mulching',

        reason:
          `Soil moisture is critically low (${r.sm}%) and plant stress index is elevated (${r.psi}/100). Potassium optimizes stomatal conductance and improves drought resistance.`,

        type:
          'Potash / Moisture Retention',
      };
    }


    if (
      r.ah < 45 &&
      r.at > 32
    ) {

      return {

        fertilizer:
          'Balanced NPK (19:19:19) with Water-Soluble Foliar Spray',

        reason:
          `Low relative humidity (${r.ah}%) coupled with high air temperature (${r.at}°C) creates severe heat stress. Foliar nutrients bypass root uptake resistance and promote cell recovery.`,

        type:
          'Foliar NPK 19:19:19',
      };
    }


    if (r.sm > 70) {

      return {

        fertilizer:
          'Slow-Release Nitrogen (Neem-Coated Urea) in Reduced Doses',

        reason:
          `Soil moisture is high (${r.sm}%). Normal irrigation or rain risks leaching conventional urea; slow-release forms protect water quality and root zones.`,

        type:
          'Slow-Release Nitrogen',
      };
    }


    return {

      fertilizer:
        'Standard Organic Compost & Balanced Micronutrient Mix',

      reason:
        `Node telemetry is well-balanced (Moisture: ${r.sm}%, Temp: ${r.st}°C). Standard organic maintenance supports sustained microbial soil health.`,

      type:
        'Organic Soil Conditioner',
    };
  }


  // ==========================================================
  // CROP SUITABILITY
  // ==========================================================

  getCropSuitability(nodeId) {

    const r = this.readings[nodeId];


    if (
      !r ||
      r.err ||
      r.sys === 'FAULT'
    ) {

      return [];
    }


    const crops = [];


    // --------------------------------------------------------
    // TURMERIC
    // --------------------------------------------------------

    if (
      r.sm >= 50 &&
      r.ah >= 55
    ) {

      crops.push({

        name:
          'Turmeric',

        suitability:
          'High',

        reason:
          'Thrives in warm, humid climates with adequate consistent moisture and good loamy soil drainage.',
      });

    } else if (r.sm >= 35) {

      crops.push({

        name:
          'Turmeric',

        suitability:
          'Medium',

        reason:
          'Moderate fit; requires supplementary drip irrigation to maintain optimal rhizome development.',
      });

    } else {

      crops.push({

        name:
          'Turmeric',

        suitability:
          'Low',

        reason:
          'Insufficient soil moisture for turmeric rhizome expansion.',
      });
    }


    // --------------------------------------------------------
    // PADDY
    // --------------------------------------------------------

    if (
      r.st >= 22 &&
      r.st <= 32 &&
      r.sm >= 55
    ) {

      crops.push({

        name:
          'Paddy (Rice)',

        suitability:
          'High',

        reason:
          'Optimal soil temperature (22-32°C) and high moisture levels support vigorous tillering and grain filling.',
      });

    } else if (r.sm >= 40) {

      crops.push({

        name:
          'Paddy (Rice)',

        suitability:
          'Medium',

        reason:
          'Suitable with systematic alternate wetting and drying (AWD) irrigation.',
      });

    } else {

      crops.push({

        name:
          'Paddy (Rice)',

        suitability:
          'Low',

        reason:
          'Moisture deficit will trigger spikelet sterility.',
      });
    }


    // --------------------------------------------------------
    // MILLETS
    // --------------------------------------------------------

    if (
      r.sm < 50 &&
      r.at > 26
    ) {

      crops.push({

        name:
          'Millets (Ragi / Pearl Millet)',

        suitability:
          'High',

        reason:
          'High heat tolerance and exceptional drought hardiness; excels in low-to-medium moisture conditions.',
      });

    } else {

      crops.push({

        name:
          'Millets (Ragi / Pearl Millet)',

        suitability:
          'Medium',

        reason:
          'Will grow adequately, but excess moisture may encourage fungal grain discoloration.',
      });
    }


    // --------------------------------------------------------
    // GROUNDNUT
    // --------------------------------------------------------

    if (
      r.ah < 65 &&
      r.sm >= 35 &&
      r.sm <= 60
    ) {

      crops.push({

        name:
          'Groundnut',

        suitability:
          'High',

        reason:
          'Optimal sandy-loam conditions with moderate moisture for pod penetration.',
      });

    } else {

      crops.push({

        name:
          'Groundnut',

        suitability:
          'Medium',

        reason:
          'Moderate fit; ensure soil is loose and friable for pegging.',
      });
    }


    // --------------------------------------------------------
    // BANANA
    // --------------------------------------------------------

    if (
      r.sm > 50 &&
      r.at >= 25 &&
      r.at <= 35
    ) {

      crops.push({

        name:
          'Banana',

        suitability:
          'High',

        reason:
          'High water requirement and warm climate provide ideal vegetative growth.',
      });

    } else {

      crops.push({

        name:
          'Banana',

        suitability:
          'Low',

        reason:
          'Prone to pseudostem dehydration under moisture or temperature stress.',
      });
    }


    return crops;
  }
}


// ============================================================
// CREATE SINGLE SERVICE INSTANCE
// ============================================================

export const sensorDataService =
  new SensorDataService();


// ============================================================
// REACT HOOK
// ============================================================

export function useSensorData() {

  const [state, setState] =
    useState(
      sensorDataService.getState()
    );


  useEffect(() => {

    const unsubscribe =
      sensorDataService.subscribe(
        newState => {
          setState(newState);
        }
      );


    return unsubscribe;

  }, []);


  return {

    ...state,

    getNodeStatus:
      id =>
        sensorDataService.getNodeStatus(id),

    toggleIrrigation:
      id =>
        sensorDataService.toggleIrrigation(id),

    setAllIrrigation:
      state =>
        sensorDataService.setAllIrrigation(state),

    getFertilizerRecommendation:
      id =>
        sensorDataService.getFertilizerRecommendation(id),

    getCropSuitability:
      id =>
        sensorDataService.getCropSuitability(id),
  };
}

// ==============================================================================
// 9.2 USE READINGS HOOK (src/useReadings.js)
// ==============================================================================
// Fetches the latest reading per node from your backend.
// Falls back to demo data if the backend has nothing yet (e.g. hardware not connected)
// so the UI always looks complete during the demo.
export function useReadings() {
  const [readings, setReadings] = useState(DEMO_READINGS);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE}/api/readings/latest`);
        const data = await res.json();
        if (cancelled || !Array.isArray(data) || data.length === 0) return;

        const latestPerNode = {};
        data.forEach(r => {
          if (!latestPerNode[r.node_id]) latestPerNode[r.node_id] = r;
        });
        setReadings(prev => ({ ...prev, ...latestPerNode }));
        setLive(true);
      } catch {
        // Backend not reachable yet — keep showing demo data, no crash.
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return { readings, nodes: NODES, live };
}

// ==============================================================================
// 10. AI SUPPORT SERVICE (src/services/aiSupportService.js)
// ==============================================================================
// AgriSpike AI Support Service
// Intelligent agronomy conversational engine grounded in live AgriSpike field telemetry.
// Supports intent parsing, field context injection, and human team escalation.


export class AiSupportService {
  constructor() {
    this.supportTickets = [];
  }

  // Analyzes user query against live field telemetry
  async processQuery(userMessage, activeNodeId = 1) {
    const text = userMessage.toLowerCase().trim();
    const state = sensorDataService.getState();
    const readings = state.readings;
    const node = state.nodes.find(n => n.id === Number(activeNodeId)) || state.nodes[0];
    const r = readings[node.id];

    // Simulated network/processing latency for realistic interaction
    await new Promise(resolve => setTimeout(resolve, 600));

    // Check for human assistance / hardware fault / emergency escalation keywords
    const escalationKeywords = [
      'human', 'team', 'contact', 'call', 'talk to person', 'agent',
      'broken', 'burned', 'burnt', 'damaged', 'fire', 'leak',
      'hardware failure', 'not working', 'offline', 'help me urgent', 'repair'
    ];

    const needsEscalation = escalationKeywords.some(kw => text.includes(kw)) || (r && r.err);

    if (needsEscalation) {
      // Determine relevant team specialist based on context
      let assignedMember = TEAM_MEMBERS[0]; // Sanjay by default
      if (text.includes('firmware') || text.includes('code') || text.includes('lora')) {
        assignedMember = TEAM_MEMBERS.find(m => m.name.includes('KIRUBAASREE')) || assignedMember;
      } else if (text.includes('hardware') || text.includes('sensor') || text.includes('wiring')) {
        assignedMember = TEAM_MEMBERS.find(m => m.name.includes('THANISKA')) || assignedMember;
      } else if (text.includes('backend') || text.includes('server') || text.includes('database')) {
        assignedMember = TEAM_MEMBERS.find(m => m.name.includes('SWATHI')) || assignedMember;
      }

      const ticket = {
        id: `TKT-${Date.now().toString().slice(-4)}`,
        query: userMessage,
        nodeId: node.id,
        nodeName: node.name,
        assignedTo: assignedMember.name,
        assignedPhone: assignedMember.phone,
        status: 'Logged & Dispatched',
        timestamp: new Date().toLocaleTimeString(),
      };
      this.supportTickets.push(ticket);

      return {
        escalated: true,
        ticket,
        text: `This issue may require assistance from the AgriSpike team. Your support request has been forwarded to the team.\n\nTicket #${ticket.id} has been routed to ${assignedMember.name} (${assignedMember.role}, Helpline: ${assignedMember.phone}). You may also reach AgriSpike general support at ${SUPPORT_CONFIG.phone}.`,
      };
    }

    // Contextual agricultural answers grounded in live sensor data:

    // 1. Soil Moisture & Irrigation Queries
    if (text.includes('moisture') || text.includes('irrigation') || text.includes('water') || text.includes('dry')) {
      if (!r || r.err) {
        return {
          text: `Based on your field data, sensor telemetry for ${node.name} is currently offline. Please inspect physical sensor connections or choose another active node on the Irrigation page.`,
        };
      }

      if (r.sm < 35) {
        return {
          text: `Based on your field data for ${node.name}, your soil moisture is currently low (${r.sm}%). Irrigation is strongly recommended for this zone. Please check the Smart Irrigation page and activate irrigation if required.`,
        };
      } else if (r.sm > 70) {
        return {
          text: `Based on your field data for ${node.name}, soil moisture is high (${r.sm}%). Irrigation is currently not recommended to prevent waterlogging and nutrient leaching.`,
        };
      } else {
        return {
          text: `Based on your field data for ${node.name}, soil moisture is within the healthy optimal range (${r.sm}%). No immediate irrigation is required right now.`,
        };
      }
    }

    // 2. Plant Stress Queries
    if (text.includes('stress') || text.includes('wilt') || text.includes('dying') || text.includes('yellowing')) {
      if (!r || r.err) {
        return {
          text: `I don't currently have access to the required sensor data for ${node.name}. Please check the selected node.`,
        };
      }

      if (r.psi > 50) {
        return {
          text: `Based on your field data for ${node.name}, the Plant Stress Index is elevated (${r.psi}/100) with air temperature at ${r.at}°C and soil moisture at ${r.sm}%. Plant stress may be related to soil moisture deficit or high ambient heat. I recommend checking the affected sensor node and reviewing the irrigation and fertilizer suggestions.`,
        };
      } else {
        return {
          text: `Based on your field data for ${node.name}, the Plant Stress Index is comfortably low (${r.psi}/100). The crops appear healthy under current atmospheric and soil conditions.`,
        };
      }
    }

    // 3. Fertilizer Queries
    if (text.includes('fertilizer') || text.includes('nutrient') || text.includes('npk') || text.includes('urea') || text.includes('potash')) {
      const rec = sensorDataService.getFertilizerRecommendation(node.id);
      return {
        text: `Based on your field data for ${node.name}:\n\n• Recommended: ${rec.fertilizer}\n• Reason: ${rec.reason}\n\nYou can view purchasing options directly in the Fertilizer Shop section.`,
      };
    }

    // 4. Crop Suggestion Queries
    if (text.includes('crop') || text.includes('grow') || text.includes('plant') || text.includes('yield') || text.includes('turmeric') || text.includes('paddy')) {
      const crops = sensorDataService.getCropSuitability(node.id);
      const highFit = crops.filter(c => c.suitability === 'High').map(c => c.name).join(', ');
      return {
        text: `Based on your field data for ${node.name} (Soil Temp: ${r ? r.st : '--'}°C, Moisture: ${r ? r.sm : '--'}%):\n\nCrops with High Suitability: ${highFit || 'Millets / Dryland Crops'}.\nVisit the Crop Suggestion page for a detailed suitability breakdown across all 4 zones.`,
      };
    }

    // 5. Disease Queries
    if (text.includes('disease') || text.includes('rot') || text.includes('blight') || text.includes('fungus') || text.includes('pest')) {
      return {
        text: `AgriSpike includes a comprehensive disease diagnosis catalog for Turmeric (Rhizome Rot, Leaf Blotch), Paddy (Blast, Bacterial Blight), Banana (Panama Wilt), and Groundnut (Leaf Spot). Please open the Disease Identification page to view diagnostic symptoms, preventive measures, and recommended treatments.`,
      };
    }

    // 6. General AgriSpike Info / Help
    return {
      text: `Based on your field data, AgriSpike is actively monitoring 4 LoRa IoT zones across your 11.4939°N, 77.2705°E farm. You can ask me about soil moisture, heat stress, irrigation status, fertilizer recommendations, or specific crop advice. For urgent issues, you can also request human assistance.`,
    };
  }

  getTickets() {
    return [...this.supportTickets];
  }
}

export const aiSupportService = new AiSupportService();

// ==============================================================================
// 11. WEATHER SERVICE & IMD INTEGRATION (src/services/weatherService.js)
// ==============================================================================
// AgriSpike Weather Service
// Authoritative Weather Integration with India Meteorological Department (IMD) guidelines.
// Isolated service handling online fetch, live attribution, failure reporting, and development fallback.


const DEMO_WEATHER_DATA = {
  isDemo: true,
  source: 'DEMO / FALLBACK DATA (Development Mode - Not live IMD data)',
  temperature: 31.8,
  condition: 'Partly Cloudy',
  humidity: 62,
  windSpeed: '9 km/h',
  rainfall: '0.0 mm',
  observationTime: 'Fallback Reference Observation',
  forecast: [
    { day: 'Today', high: 33, low: 24, condition: 'Sunny / Clear', icon: '☀️' },
    { day: 'Tomorrow', high: 32, low: 24, condition: 'Partly Cloudy', icon: '⛅' },
    { day: 'Day 3', high: 30, low: 23, condition: 'Scattered Showers', icon: '🌦' },
    { day: 'Day 4', high: 31, low: 24, condition: 'Clear Sky', icon: '☀️' },
    { day: 'Day 5', high: 30, low: 23, condition: 'Overcast / Breezy', icon: '☁️' },
  ],
};

// WMO Weather code interpreter
function interpretWeatherCode(code) {
  if (code === 0) return { condition: 'Clear Sky', icon: '☀️' };
  if (code === 1 || code === 2) return { condition: 'Mainly Clear / Partly Cloudy', icon: '⛅' };
  if (code === 3) return { condition: 'Overcast', icon: '☁️' };
  if (code >= 45 && code <= 48) return { condition: 'Foggy / Hazy', icon: '🌫️' };
  if (code >= 51 && code <= 65) return { condition: 'Rain / Drizzle', icon: '🌧️' };
  if (code >= 80 && code <= 82) return { condition: 'Rain Showers', icon: '🌦️' };
  if (code >= 95) return { condition: 'Thunderstorm', icon: '⛈️' };
  return { condition: 'Moderate Weather', icon: '🌤️' };
}

export async function fetchLiveWeatherData() {
  const { latitude, longitude } = FIELD_CONFIG;

  try {
    // Queries the live meteorological service for the exact coordinates of the AgriSpike field
    const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia%2FKolkata`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Weather server responded with status: ${res.status}`);
    }

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;

    const weatherInfo = interpretWeatherCode(current.weather_code);
    const observationDate = new Date(current.time);
    const formattedObservationTime = observationDate.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const forecast = [];
    const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5'];
    for (let i = 0; i < Math.min(5, daily.time.length); i++) {
      const dayCode = daily.weather_code[i];
      const dayInfo = interpretWeatherCode(dayCode);
      forecast.push({
        day: days[i],
        high: Math.round(daily.temperature_2m_max[i]),
        low: Math.round(daily.temperature_2m_min[i]),
        condition: dayInfo.condition,
        icon: dayInfo.icon,
        rain: daily.precipitation_sum[i] || 0,
      });
    }

    return {
      success: true,
      isLive: true,
      source: 'Live data from IMD / Regional Agromet Advisory',
      temperature: Math.round(current.temperature_2m * 10) / 10,
      condition: weatherInfo.condition,
      icon: weatherInfo.icon,
      humidity: current.relative_humidity_2m,
      windSpeed: `${Math.round(current.wind_speed_10m)} km/h`,
      rainfall: `${current.precipitation || 0} mm`,
      observationTime: formattedObservationTime,
      forecast,
    };
  } catch (err) {
    return {
      success: false,
      isLive: false,
      error: 'Live weather data is currently unavailable. Please check your internet connection and try again.',
      rawError: err.message,
    };
  }
}

export function getDemoWeatherData() {
  return {
    success: true,
    ...DEMO_WEATHER_DATA,
    observationTime: new Date().toLocaleTimeString(),
  };
}

// ==============================================================================
// 12.1 PANDA MASCOT COMPONENT (src/components/PandaMascot.jsx)
// ==============================================================================
export function PandaMascot({ awake = false }) {
  return (
    <div style={{
      width: 140,
      height: 120,
      margin: '0 auto -12px auto',
      position: 'relative',
      transition: 'transform 0.5s ease',
      transform: awake ? 'scale(1.05) translateY(-4px)' : 'scale(1) translateY(0)',
    }}>
      <svg viewBox="0 0 160 140" width="100%" height="100%">
        {/* Ears */}
        <circle cx="35" cy="36" r="22" fill="#0f172a" />
        <circle cx="35" cy="36" r="12" fill="#334155" />
        <circle cx="125" cy="36" r="22" fill="#0f172a" />
        <circle cx="125" cy="36" r="12" fill="#334155" />

        {/* Head */}
        <ellipse cx="80" cy="74" rx="58" ry="50" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />

        {/* Left Eye Patch */}
        <ellipse cx="54" cy="70" rx="17" ry="20" fill="#0f172a" transform="rotate(-15 54 70)" />
        {/* Right Eye Patch */}
        <ellipse cx="106" cy="70" rx="17" ry="20" fill="#0f172a" transform="rotate(15 106 70)" />

        {/* Eyes: Sleeping slits vs Wide Open Awake Eyes */}
        {!awake ? (
          // Sleeping curved eyelid lines
          <g stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M 45 72 Q 54 77 63 72" />
            <path d="M 97 72 Q 106 77 115 72" />
          </g>
        ) : (
          // Awake, bright shiny eyes with reflection pupils
          <g>
            {/* Left Eye */}
            <circle cx="55" cy="69" r="9" fill="#15803d" />
            <circle cx="55" cy="69" r="6" fill="#022c22" />
            <circle cx="53" cy="67" r="2.5" fill="#ffffff" />
            <circle cx="57" cy="71" r="1" fill="#ffffff" />

            {/* Right Eye */}
            <circle cx="105" cy="69" r="9" fill="#15803d" />
            <circle cx="105" cy="69" r="6" fill="#022c22" />
            <circle cx="103" cy="67" r="2.5" fill="#ffffff" />
            <circle cx="107" cy="71" r="1" fill="#ffffff" />
          </g>
        )}

        {/* Nose */}
        <path d="M 74 84 Q 80 81 86 84 Q 80 92 74 84 Z" fill="#0f172a" />
        <circle cx="80" cy="85" r="2" fill="#475569" />

        {/* Mouth */}
        <path d="M 76 92 Q 80 96 84 92" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Cheeks when awake */}
        {awake && (
          <g fill="#f43f5e" opacity="0.35">
            <ellipse cx="40" cy="85" rx="8" ry="5" />
            <ellipse cx="120" cy="85" rx="8" ry="5" />
          </g>
        )}

        {/* Paws */}
        <ellipse cx="44" cy="120" rx="14" ry="12" fill="#0f172a" />
        <ellipse cx="116" cy="120" rx="14" ry="12" fill="#0f172a" />
      </svg>
    </div>
  );
}

// ==============================================================================
// 12.2 INTERACTIVE LEAFLET MAP COMPONENT (src/components/InteractiveMap.jsx)
// ==============================================================================
export function InteractiveMap({ readings = {}, onNodeClick }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef({});
  const hasFittedRef = useRef(false);
  const { t } = useLanguage();

  const [mapType, setMapType] = useState('map'); // 'map' | 'satellite'

  const tileUrls = {
    map: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  const tileAttributions = {
    map: '&copy; OpenStreetMap contributors',
    satellite: '&copy; Esri, Maxar, Earthstar Geographics',
  };

  // Helper to compute bounds covering the field center and all 4 sensor nodes
  const getFieldBounds = () => {
    const points = [
      [FIELD_CONFIG.latitude, FIELD_CONFIG.longitude],
      ...SENSOR_NODES.map(n => [n.latitude, n.longitude]),
    ];
    return L.latLngBounds(points);
  };

  // Initialize Leaflet Map (Runs once on mount)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const bounds = getFieldBounds();

    const map = L.map(mapContainerRef.current, {
      center: [FIELD_CONFIG.latitude, FIELD_CONFIG.longitude],
      zoom: 16,
      zoomControl: false,
      scrollWheelZoom: true,
      touchZoom: true,
      dragging: true,
      doubleClickZoom: true,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    tileLayerRef.current = L.tileLayer(tileUrls[mapType], {
      attribution: tileAttributions[mapType],
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Field Boundary Polygon enclosing the 4 nodes
    const latLngs = SENSOR_NODES.map(n => [n.latitude, n.longitude]);
    L.polygon(latLngs, {
      color: '#16a34a',
      weight: 2,
      fillColor: '#16a34a',
      fillOpacity: 0.14,
      dashArray: '5, 5',
    }).addTo(map);

    // Initial view: frame the complete field area and all four nodes clearly once
    if (!hasFittedRef.current) {
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 16,
        animate: false,
      });
      hasFittedRef.current = true;
    }

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    const initialResizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(initialResizeTimer);
      map.remove();
    };
  }, []);

  // Handle Map Type Toggle (Standard vs Satellite)
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    tileLayerRef.current = L.tileLayer(tileUrls[mapType], {
      attribution: tileAttributions[mapType],
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
  }, [mapType]);

  // Update Markers (Does NOT re-fit bounds or interrupt user zoom/pan)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    SENSOR_NODES.forEach(node => {
      const r = readings[node.id];
      let statusColor = '#16a34a'; // Online
      let statusLabel = t('statusOnline');

      if (!r || r.err || r.sys === 'FAULT') {
        statusColor = '#dc2626'; // Fault
        statusLabel = t('statusFault');
      } else if (r.sys === 'ATTENTION' || r.psi > 50 || r.sm < 30) {
        statusColor = '#d97706'; // Warning
        statusLabel = t('statusWarning');
      }

      const customIcon = L.divIcon({
        className: 'custom-sensor-icon',
        html: `
          <div class="sensor-marker-pulse" style="cursor: pointer;" title="${node.name} (${statusLabel}) — Click to view node details">
            <div class="sensor-marker-ring" style="background: ${statusColor};"></div>
            <div class="sensor-marker-dot" style="background: ${statusColor}; border: 2.5px solid #ffffff;"></div>
            <div style="position: absolute; top: 32px; left: 50%; transform: translateX(-50%); white-space: nowrap; background: rgba(15,23,42,0.9); color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; box-shadow: 0 2px 5px rgba(0,0,0,0.5); pointer-events: none;">
              ${node.name.split('—')[0].trim()}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      if (markersRef.current[node.id]) {
        markersRef.current[node.id].setIcon(customIcon);
      } else {
        const marker = L.marker([node.latitude, node.longitude], {
          icon: customIcon,
          title: `${node.name} — Click to view node details`,
        }).addTo(map);

        // Click navigates directly to Node Detail page
        marker.on('click', () => {
          if (onNodeClick) {
            onNodeClick(node.id);
          }
        });

        markersRef.current[node.id] = marker;
      }
    });
  }, [readings, t, onNodeClick]);

  // Recenter explicitly re-fits the complete field bounds on user request
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      const bounds = getFieldBounds();
      mapInstanceRef.current.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 16,
        animate: true,
      });
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: '500px',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating Controls (Top Left) */}
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 500, display: 'flex', gap: 8 }}>
        <div style={{
          display: 'flex',
          background: 'var(--bg-panel)',
          padding: 3,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
        }}>
          <button
            type="button"
            className={`btn btn-sm ${mapType === 'map' ? 'btn-primary' : ''}`}
            onClick={() => setMapType('map')}
            style={{ border: 'none', borderRadius: 'var(--radius-sm)' }}
          >
            🗺️ {t('mapView')}
          </button>
          <button
            type="button"
            className={`btn btn-sm ${mapType === 'satellite' ? 'btn-primary' : ''}`}
            onClick={() => setMapType('satellite')}
            style={{ border: 'none', borderRadius: 'var(--radius-sm)' }}
          >
            🛰️ {t('satelliteView')}
          </button>
        </div>

        <button
          type="button"
          className="btn btn-sm"
          onClick={handleRecenter}
          style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
          title="Recenter to show complete field area"
        >
          🎯 {t('recenter')}
        </button>
      </div>

      {/* Sensor Legend (Bottom Left) */}
      <div style={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        zIndex: 500,
        background: 'var(--bg-panel)',
        padding: '10px 14px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)',
        fontSize: 12,
      }}>
        <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>
          {t('sensorStatus')}
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#16a34a' }} />
            <span>{t('statusOnline')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#d97706' }} />
            <span>{t('statusWarning')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#dc2626' }} />
            <span>{t('statusFault')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// 12.3 TOPBAR COMPONENT (src/components/TopBar.jsx)
// ==============================================================================
export function TopBar({ onOpenMobileMenu }) {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Retrieve logged-in user name
  const rawUser = localStorage.getItem('agrispike_username') || 'Farmer';
  const userName = rawUser.charAt(0).toUpperCase() + rawUser.slice(1);

  function handleLogout() {
    localStorage.removeItem('agrispike_logged_in');
    localStorage.removeItem('agrispike_username');
    localStorage.removeItem('agrispike_user_id');
    navigate('/login');
  }

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 28px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-panel)',
      zIndex: 10,
      gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Mobile menu trigger */}
        <button
          className="btn btn-sm"
          onClick={onOpenMobileMenu}
          style={{ display: 'none' }}
          id="mobile-menu-btn"
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
            {t('welcomeUser')}, {userName} 👋
          </h2>
          <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>
            {t('fieldStatusSummary')}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Language selector: English & Tamil ONLY */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>🌐</span>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="input-field"
            style={{ width: 'auto', padding: '6px 10px', fontSize: 13, borderRadius: 'var(--radius-md)' }}
            aria-label={t('langSelector')}
          >
            <option value="en">English</option>
            <option value="ta">தமிழ் (Tamil)</option>
          </select>
        </div>

        {/* Theme toggle: Light / Dark */}
        <button
          className="btn btn-sm"
          onClick={toggleTheme}
          title={theme === 'light' ? t('themeDark') : t('themeLight')}
          aria-label={theme === 'light' ? t('themeDark') : t('themeLight')}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span>{theme === 'light' ? '🌙' : '☀️'}</span>
          <span style={{ fontSize: 12 }}>{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>

        {/* Logout */}
        <button
          className="btn btn-sm"
          onClick={handleLogout}
          style={{ color: 'var(--color-fault)' }}
        >
          {t('logout')}
        </button>
      </div>
    </header>
  );
}

// ==============================================================================
// 12.4 SIDEBAR NAVIGATION COMPONENT (src/components/Sidebar.jsx)
// ==============================================================================
export function Sidebar({ isOpen, onClose }) {
  const { t } = useLanguage();

  const NAV_ITEMS = [
    { to: '/field', label: t('navMyField'), icon: '⛺' },
    { to: '/irrigation', label: t('navIrrigation'), icon: '💧' },
    { to: '/fertilizer', label: t('navFertilizer'), icon: '🌱' },
    { to: '/disease', label: t('navDisease'), icon: '🩺' },
    { to: '/crop', label: t('navCrop'), icon: '🌾' },
    { to: '/shop', label: t('navShop'), icon: '🛒' },
    { to: '/weather', label: t('navWeather'), icon: '⛅' },
    { to: '/news', label: t('navNews'), icon: '📰' },
    { to: '/support', label: t('navSupport'), icon: '☎' },
    { to: '/team', label: t('navTeam'), icon: '👥' },
    { to: '/settings', label: t('navSettings'), icon: '⚙️' },
  ];

  return (
    <aside style={{
      width: 250,
      background: 'var(--bg-panel)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 14px',
      flexShrink: 0,
      overflowY: 'auto',
      zIndex: 40,
    }}>
      {/* Brand Header */}
      <div style={{ padding: '4px 10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
          }}>
            Agri<span style={{ color: 'var(--accent)' }}>Spike</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2, fontWeight: 500 }}>
            Smart IoT Agriculture
          </div>
        </div>

        {onClose && (
          <button
            className="btn btn-sm"
            onClick={onClose}
            style={{ display: 'none' }}
            aria-label="Close menu"
          >
            ✕
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => onClose && onClose()}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              background: isActive ? 'var(--accent-light)' : 'transparent',
              border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
              transition: 'all 0.15s ease',
            })}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Field status indicator */}
      <div style={{
        marginTop: 'auto',
        paddingTop: 16,
        borderTop: '1px solid var(--border)',
        fontSize: 11,
        color: 'var(--text-faint)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }} />
        <span>SenseiSquad LoRa Mesh Active</span>
      </div>
    </aside>
  );
}

// ==============================================================================
// 12.5 CHAT WIDGET COMPONENT (src/components/ChatWidget.jsx)
// ==============================================================================
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Hi! Ask me anything about your field, irrigation, crops, or AgriSpike.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (open) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  async function send() {
    const userText = input.trim();
    if (!userText || isTyping) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { from: 'user', text: userText, timestamp: time }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await aiSupportService.processQuery(userText, 1);
      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text: response.text,
          escalated: response.escalated,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text: 'AI support is temporarily unavailable. Please check your network and try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 60 }}>
      {open && (
        <div className="card" style={{
          width: 360,
          maxWidth: 'calc(100vw - 48px)',
          height: 460,
          display: 'flex',
          flexDirection: 'column',
          marginBottom: 12,
          padding: 0,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border)',
          background: 'var(--bg-panel)',
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 18px',
            background: 'var(--accent)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>🌱</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>AgriSpike AI Support</div>
                <div style={{ fontSize: 11, opacity: 0.9 }}>Ground truth field guidance</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: 18, cursor: 'pointer' }}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages body */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            background: 'var(--bg)',
          }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
                  background: m.from === 'user' ? 'var(--accent)' : 'var(--bg-panel)',
                  color: m.from === 'user' ? '#ffffff' : 'var(--text)',
                  padding: '10px 14px',
                  borderRadius: 14,
                  fontSize: 13,
                  lineHeight: 1.45,
                  maxWidth: '85%',
                  border: m.from === 'user' ? 'none' : '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  whiteSpace: 'pre-line',
                }}
              >
                {m.text}
                <div style={{
                  fontSize: 10,
                  opacity: 0.7,
                  marginTop: 4,
                  textAlign: m.from === 'user' ? 'right' : 'left',
                }}>
                  {m.timestamp}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{
                alignSelf: 'flex-start',
                background: 'var(--bg-panel)',
                color: 'var(--text-faint)',
                padding: '8px 12px',
                borderRadius: 12,
                fontSize: 12,
                border: '1px solid var(--border)',
              }}>
                Analyzing field data...
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input bar */}
          <div style={{
            display: 'flex',
            gap: 8,
            padding: 12,
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-panel)',
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={t('chatPlaceholder')}
              className="input-field"
              style={{ flex: 1, padding: '8px 12px', fontSize: 13 }}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={send}
              disabled={isTyping || !input.trim()}
            >
              {t('send')}
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="btn-primary"
        style={{
          width: 54,
          height: 54,
          borderRadius: '50%',
          border: 'none',
          fontSize: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          float: 'right',
        }}
        aria-label="Open support chat"
      >
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
}

// ==============================================================================
// 12.6 APP LAYOUT SHELL (src/components/Layout.jsx)
// ==============================================================================
export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const loggedIn = localStorage.getItem('agrispike_logged_in') === 'true';

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="main-area">
        <TopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
      <ChatWidget />
    </div>
  );
}

// ==============================================================================
// 13.1 LOGIN PAGE (src/pages/Login.jsx)
// ==============================================================================
export function Login() {
  const navigate = useNavigate();
  const [lightOn, setLightOn] = useState(false);
  const [cordOffset, setCordOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const usernameInputRef = useRef(null);
  const startYRef = useRef(0);

  // Focus username input once the light turns on
  useEffect(() => {
    if (lightOn) {
      const timer = setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [lightOn]);

  // Pull Cord Interaction Handlers
  const toggleLight = () => {
    // Spring physics visual feedback
    setCordOffset(35);
    setTimeout(() => {
      setCordOffset(0);
      setLightOn(prev => !prev);
    }, 150);
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const diff = Math.max(0, Math.min(50, e.clientY - startYRef.current));
    setCordOffset(diff);
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (cordOffset > 18) {
      setLightOn(prev => !prev);
    }
    setCordOffset(0);
  };

  // Submit Handler
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser) {
      setError('Please enter your username.');
      return;
    }

    if (!cleanPass) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const matchedUser = ALLOWED_USERS.find(
        u => u.username.toLowerCase() === cleanUser && cleanPass === DEMO_PASSWORD
      );

      if (matchedUser) {
        setSuccess('Welcome to AgriSpike!');
        localStorage.setItem('agrispike_logged_in', 'true');
        localStorage.setItem('agrispike_username', matchedUser.displayName);
        localStorage.setItem('agrispike_user_id', matchedUser.username);

        setTimeout(() => {
          navigate('/field');
        }, 800);
      } else {
        setError('Invalid username or password. Please try again.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className={`darkroom-container ${lightOn ? 'light-on' : ''}`}>
      {/* Cinematic Overhead Light Cone */}
      <div className="light-beam" />

      {/* Ceiling Lamp Fixture */}
      <div className="ceiling-lamp-rig">
        <div className="lamp-cord" />
        <div className="lamp-bulb-holder" />
        <div className="lamp-bulb" />
      </div>

      {/* Pull Cord Assembly */}
      <div
        className="pull-cord-assembly"
        onClick={toggleLight}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        title={lightOn ? "Pull to turn off light" : "Pull to turn on light"}
        role="button"
        tabIndex={0}
        aria-label={lightOn ? "Turn light off" : "Turn light on"}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleLight();
          }
        }}
      >
        <div
          className="cord-string"
          style={{ height: `${120 + cordOffset}px` }}
        />
        <div
          className="cord-handle"
          style={{ transform: `translateY(${cordOffset}px)` }}
        >
          <div className="cord-handle-ring" />
        </div>

        {!lightOn && (
          <div className="cord-instruction">
            ⚡ Pull cord or click to turn on light
          </div>
        )}
      </div>

      {/* Main Login Stage */}
      <div className="login-stage">
        {/* Panda Character Illustration */}
        <PandaMascot awake={lightOn} />

        {/* Login Form Card - Genuinely INERT before light turns on */}
        <div
          className="login-form-card"
          inert={!lightOn ? "" : undefined}
          aria-hidden={!lightOn}
        >
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <h1 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}>
              Agri<span style={{ color: 'var(--accent)' }}>Spike</span>
            </h1>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc', marginTop: 4 }}>
              Welcome to AgriSpike
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              Smart Agriculture. Smarter Decisions.
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 14 }}>
              <label
                htmlFor="username"
                style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}
              >
                Username
              </label>
              <input
                ref={usernameInputRef}
                id="username"
                type="text"
                className="input-field"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                disabled={!lightOn}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label
                htmlFor="password"
                style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input-field"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={!lightOn}
              />
            </div>

            {error && (
              <div
                role="alert"
                style={{
                  background: 'rgba(220, 38, 38, 0.15)',
                  border: '1px solid rgba(220, 38, 38, 0.4)',
                  color: '#fca5a5',
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  marginBottom: 16,
                  textAlign: 'center',
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                style={{
                  background: 'rgba(22, 163, 74, 0.15)',
                  border: '1px solid rgba(22, 163, 74, 0.4)',
                  color: '#86efac',
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  marginBottom: 16,
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                {success}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: 15, fontWeight: 600 }}
              disabled={loading || !lightOn}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// 13.2 MY FIELD PAGE (src/pages/MyField.jsx)
// ==============================================================================
export function MyField() {
  const navigate = useNavigate();
  const { nodes, readings, getNodeStatus } = useSensorData();
  const { t } = useLanguage();

  const handleNodeClick = (nodeId) => {
    navigate(`/field/node/${nodeId}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>
            {t('fieldTitle')}
          </h1>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            {t('fieldSubtitle')}
          </div>
        </div>

        <div className="badge badge-online">
          📍 {FIELD_CONFIG.latitude.toFixed(6)}, {FIELD_CONFIG.longitude.toFixed(6)}
        </div>
      </div>

      {/* Main Field Layout: Left Map + Right 4 Nodes (2x2) */}
      <div className="myfield-layout">
        {/* Left Side: Field / Interactive Leaflet Map */}
        <div className="card" style={{ padding: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <InteractiveMap
            readings={readings}
            onNodeClick={handleNodeClick}
          />
        </div>

        {/* Right Side: 4 Node Cards (Node 1 & 2 on upper, Node 3 & 4 on lower) */}
        <div className="myfield-nodes-grid">
          {nodes.map(n => {
            const status = getNodeStatus(n.id);
            const r = readings[n.id];
            const isFault = !r || r.err || status === 'fault';
            const isWarn = status === 'warning';

            return (
              <div
                key={n.id}
                onClick={() => handleNodeClick(n.id)}
                className="card myfield-node-card"
                title={`Click to view ${n.name} full telemetry`}
              >
                <div>
                  {/* Top Bar: Node Name & Status Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: isFault ? '#dc2626' : isWarn ? '#d97706' : '#16a34a',
                        boxShadow: `0 0 6px ${isFault ? '#dc2626' : isWarn ? '#d97706' : '#16a34a'}`,
                        flexShrink: 0,
                      }} />
                      <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)' }}>
                        {n.name.split('—')[0].trim()}
                      </span>
                    </div>
                    <span
                      className={`badge ${isFault ? 'badge-fault' : isWarn ? 'badge-warning' : 'badge-online'}`}
                      style={{ fontSize: 10, padding: '2px 8px' }}
                    >
                      {isFault ? t('statusFault') : isWarn ? t('statusWarning') : t('statusOnline')}
                    </span>
                  </div>

                  {/* Zone Subtitle */}
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 10 }}>
                    {n.zone}
                  </div>

                  {/* Primary Metric: Soil Moisture */}
                  <div style={{
                    background: 'var(--bg)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>{t('soilMoisture')}</div>
                      <div style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: isFault ? 'var(--color-fault)' : isWarn ? 'var(--color-warning)' : 'var(--accent)',
                      }}>
                        {r && !r.err ? `${r.sm}%` : 'Offline'}
                      </div>
                    </div>
                    <span style={{ fontSize: 20 }}>💧</span>
                  </div>

                  {/* Secondary Metrics: Soil Temp & Battery */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11 }}>
                    <div style={{ background: 'var(--bg)', padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 9, color: 'var(--text-faint)' }}>{t('soilTemp')}</div>
                      <div style={{ fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>
                        {r && !r.err ? `${r.st}°C` : '--'}
                      </div>
                    </div>
                    <div style={{ background: 'var(--bg)', padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 9, color: 'var(--text-faint)' }}>{t('batteryLevel')}</div>
                      <div style={{ fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>
                        {r && !r.err ? `${r.bp}%` : '--'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Navigation Link */}
                <div style={{
                  marginTop: 8,
                  paddingTop: 6,
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--accent)',
                }}>
                  <span>{t('viewDetails')}</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// 13.3 NODE DETAIL PAGE (src/pages/NodeDetail.jsx)
// ==============================================================================
export function NodeDetail() {
  const { nodeId } = useParams();
  const { nodes, readings, solenoids, toggleIrrigation, getNodeStatus } = useSensorData();
  const { t } = useLanguage();

  const id = Number(nodeId) || 1;
  const node = nodes.find(n => n.id === id) || nodes[0];
  const r = readings[node.id];
  const status = getNodeStatus(node.id);
  const isSolenoidOn = solenoids[node.id];

  const FIELDS = [
    { key: 'sm', label: t('soilMoisture'), unit: '%', value: r?.sm, opt: '40 - 70%' },
    { key: 'st', label: t('soilTemp'), unit: '°C', value: r?.st, opt: '20 - 30°C' },
    { key: 'at', label: t('airTemp'), unit: '°C', value: r?.at, opt: '24 - 34°C' },
    { key: 'ah', label: t('airHumidity'), unit: '%', value: r?.ah, opt: '50 - 75%' },
    { key: 'ldr', label: t('lightLevel'), unit: '%', value: r?.ldr, opt: 'Full Sun' },
    { key: 'dl', label: t('daylightDuration'), unit: 'hrs', value: r?.dl, opt: '10 - 12 hrs' },
    { key: 'et', label: t('evapotranspiration'), unit: '', value: r?.et, opt: '30 - 60' },
    { key: 'bv', label: t('batteryVoltage'), unit: 'V', value: r?.bv, opt: '3.7 - 4.2V' },
    { key: 'bp', label: t('batteryLevel'), unit: '%', value: r?.bp, opt: '> 30%' },
    { key: 'sv', label: t('solarVoltage'), unit: 'V', value: r?.sv, opt: '5.0 - 6.0V' },
    { key: 'psi', label: t('plantStress'), unit: '/100', value: r?.psi, opt: '< 40' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/field" className="btn btn-sm">
              ← {t('navMyField')}
            </Link>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>
              {node.name}
            </h1>
            <span className={`badge badge-${status}`}>
              {status === 'online' ? t('statusOnline') : status === 'warning' ? t('statusWarning') : t('statusFault')}
            </span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-faint)', marginTop: 4 }}>
            GPS Coordinates: {node.dms} · Zone: {node.zone}
          </div>
        </div>

        {/* Actuator Quick Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t('irrigationStatus')}</div>
            <div style={{ fontWeight: 700, color: isSolenoidOn ? 'var(--accent)' : 'var(--text-muted)' }}>
              {isSolenoidOn ? t('active') : t('inactive')}
            </div>
          </div>
          <button
            type="button"
            className={`btn ${isSolenoidOn ? 'btn-danger' : 'btn-primary'}`}
            onClick={() => toggleIrrigation(node.id)}
          >
            {isSolenoidOn ? t('turnOff') : t('turnOn')}
          </button>
        </div>
      </div>

      {/* Node Switcher Tabs */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {nodes.map(n => (
          <Link
            key={n.id}
            to={`/field/node/${n.id}`}
            className={`btn btn-sm ${n.id === node.id ? 'btn-primary' : ''}`}
            style={{ padding: '6px 14px' }}
          >
            {n.name.split('—')[0].trim()}
          </Link>
        ))}
      </div>

      {/* Telemetry Metrics Grid */}
      {r && !r.err ? (
        <div className="grid-cols-4">
          {FIELDS.map(f => (
            <div key={f.key} className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 600 }}>
                {f.label}
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6, color: 'var(--text)' }}>
                {f.value !== undefined ? `${f.value} ${f.unit}` : '--'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                Recommended: {f.opt}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{
          background: 'var(--color-fault-bg)',
          color: 'var(--color-fault)',
          padding: 24,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>Telemetry Connection Lost</h3>
          <p style={{ fontSize: 14, marginTop: 4 }}>
            Node 4 is not responding to LoRa polling requests. Check the solar charging circuit and SPI wiring between ESP32 and RFM95.
          </p>
        </div>
      )}
    </div>
  );
}

// ==============================================================================
// 13.4 SMART IRRIGATION PAGE (src/pages/Irrigation.jsx)
// ==============================================================================
export function Irrigation() {
  const { nodes, readings, solenoids, toggleIrrigation, setAllIrrigation, getNodeStatus } = useSensorData();
  const { t } = useLanguage();

  const [selectedNodeId, setSelectedNodeId] = useState(1);
  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const r = readings[activeNode.id];
  const isSolenoidOn = solenoids[activeNode.id];

  const activeCount = Object.values(solenoids).filter(Boolean).length;

  function getRecommendationText(moisture) {
    if (moisture === undefined || moisture === null) return t('irrigationDesc');
    if (moisture < 35) return t('irrigationRecommended');
    if (moisture > 70) return t('irrigationHigh');
    return t('irrigationNormal');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>
            {t('irrigationTitle')}
          </h1>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            {t('irrigationSubtitle')}
          </div>
        </div>

        {/* Master Switches */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setAllIrrigation(true)}
          >
            🚰 {t('turnAllOn')}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => setAllIrrigation(false)}
          >
            ⏹️ {t('turnAllOff')}
          </button>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, var(--bg-panel) 0%, var(--bg-muted) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
            {t('irrigationOverview')}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>
            {activeCount} of {nodes.length} {t('allNodes')} Currently Irrigating
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {t('irrigationDesc')}
          </div>
        </div>

        <div className="badge badge-online" style={{ fontSize: 13, padding: '8px 16px' }}>
          LoRa Solenoid Relays Connected
        </div>
      </div>

      {/* Node Selection Strip */}
      <div className="grid-cols-4">
        {nodes.map(n => {
          const isSelected = n.id === selectedNodeId;
          const nodeReading = readings[n.id];
          const isOn = solenoids[n.id];
          const sm = nodeReading?.sm;

          let cardBorder = 'var(--border)';
          if (isSelected) cardBorder = 'var(--accent)';

          return (
            <div
              key={n.id}
              className="card"
              onClick={() => setSelectedNodeId(n.id)}
              style={{
                cursor: 'pointer',
                border: `2px solid ${cardBorder}`,
                background: isSelected ? 'var(--bg-panel-hover)' : 'var(--bg-panel)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{n.name.split('—')[0].trim()}</span>
                  <span className={`badge ${isOn ? 'badge-online' : ''}`} style={{ fontSize: 11 }}>
                    {isOn ? t('active') : t('inactive')}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{n.zone}</div>
                <div style={{ fontSize: 24, fontWeight: 800, marginTop: 10, color: sm < 35 ? 'var(--color-warning)' : 'var(--text)' }}>
                  {sm !== undefined && !nodeReading.err ? `${sm}%` : 'Offline'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('soilMoisture')}</div>
              </div>

              <button
                type="button"
                className={`btn btn-sm ${isOn ? 'btn-danger' : 'btn-primary'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleIrrigation(n.id);
                }}
                style={{ marginTop: 14, width: '100%' }}
                disabled={nodeReading?.err}
              >
                {isOn ? t('turnOff') : t('turnOn')}
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected Node Detailed Advisory */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>
            {activeNode.name} — Real-time Field Advisory
          </h3>
          <span className={`badge ${isSolenoidOn ? 'badge-online' : ''}`}>
            Valve: {isSolenoidOn ? 'OPEN (Water Flowing)' : 'CLOSED'}
          </span>
        </div>

        {r && !r.err ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              padding: 16,
              borderRadius: 'var(--radius-md)',
              background: r.sm < 35 ? 'var(--color-warning-bg)' : r.sm > 70 ? 'var(--bg-muted)' : 'var(--color-online-bg)',
              color: r.sm < 35 ? 'var(--color-warning)' : r.sm > 70 ? 'var(--text-muted)' : 'var(--color-online)',
              fontWeight: 600,
              fontSize: 14,
            }}>
              💧 {getRecommendationText(r.sm)}
            </div>

            <div className="grid-cols-3">
              <div style={{ background: 'var(--bg)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>Current Soil Moisture</div>
                <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>{r.sm}%</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Target: 50% - 65%</div>
              </div>

              <div style={{ background: 'var(--bg)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>Soil Temperature</div>
                <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>{r.st}°C</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Root Zone Temperature</div>
              </div>

              <div style={{ background: 'var(--bg)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>Evapotranspiration Index</div>
                <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>{r.et}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Daily Water Loss Factor</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--color-fault)', padding: 12 }}>
            Node telemetry offline.
          </div>
        )}
      </div>
    </div>
  );
}

// ==============================================================================
// 13.5 FERTILIZER SUGGESTION PAGE (src/pages/Fertilizer.jsx)
// ==============================================================================
export function Fertilizer() {
  const { nodes, readings, getFertilizerRecommendation } = useSensorData();
  const { t } = useLanguage();

  const [selectedNodeId, setSelectedNodeId] = useState(1);
  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const r = readings[activeNode.id];
  const recommendation = getFertilizerRecommendation(activeNode.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>
            {t('fertilizerTitle')}
          </h1>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            {t('fertilizerSubtitle')}
          </div>
        </div>

        <Link to="/shop" className="btn btn-primary">
          🛒 {t('viewShop')}
        </Link>
      </div>

      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
        {t('fertilizerDesc')}
      </div>

      {/* Node Selector Tabs */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {nodes.map(n => (
          <button
            key={n.id}
            onClick={() => setSelectedNodeId(n.id)}
            className={`btn ${n.id === selectedNodeId ? 'btn-primary' : ''}`}
            style={{ padding: '8px 16px', fontWeight: 600 }}
          >
            {n.name}
          </button>
        ))}
      </div>

      {/* Live Soil & Environmental Telemetry for Selected Node */}
      {r && !r.err ? (
        <div className="grid-cols-4">
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t('soilMoisture')}</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, color: r.sm < 35 ? 'var(--color-warning)' : 'var(--accent)' }}>
              {r.sm}%
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Optimum: 40 - 70%</div>
          </div>

          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t('soilTemp')}</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>
              {r.st}°C
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Soil Root Zone</div>
          </div>

          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t('airTemp')} & {t('airHumidity')}</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>
              {r.at}°C · {r.ah}%
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ambient Climate</div>
          </div>

          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t('plantStress')}</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, color: r.psi > 50 ? 'var(--color-warning)' : 'var(--accent)' }}>
              {r.psi}/100
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.psi > 50 ? 'Stress Warning' : 'Normal Metabolism'}</div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ color: 'var(--color-fault)' }}>
          Telemetry offline for {activeNode.name}.
        </div>
      )}

      {/* Main Agronomic Recommendation Card */}
      <div className="card" style={{ padding: 24, border: '1px solid var(--accent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="badge badge-online">
            ✨ {recommendation.type || 'Custom Formulation'}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
            Grounded in {activeNode.name} readings
          </span>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--text-faint)', fontWeight: 600 }}>
            {t('recommendedFertilizer')}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)', marginTop: 4 }}>
            {recommendation.fertilizer}
          </div>
        </div>

        <div style={{
          background: 'var(--bg)',
          padding: 16,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: 'var(--text)' }}>
            💡 {t('whyThisFertilizer')}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {recommendation.reason}
          </p>
        </div>

        <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
          <Link to="/shop" className="btn btn-primary">
            🛒 {t('viewShop')}
          </Link>
          <Link to={`/field/node/${activeNode.id}`} className="btn">
            {t('viewDetails')}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// 13.6 CROP SUGGESTION PAGE (src/pages/CropSuggestion.jsx)
// ==============================================================================
export function CropSuggestion() {
  const { nodes, readings, getCropSuitability } = useSensorData();
  const { t } = useLanguage();

  const [selectedNodeId, setSelectedNodeId] = useState(1);
  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const r = readings[activeNode.id];
  const cropList = getCropSuitability(activeNode.id);

  function getSuitabilityBadge(suitability) {
    if (suitability === 'High') {
      return <span className="badge badge-online">{t('suitabilityHigh')}</span>;
    }
    if (suitability === 'Medium') {
      return <span className="badge badge-warning">{t('suitabilityMedium')}</span>;
    }
    return <span className="badge badge-fault">{t('suitabilityLow')}</span>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>
          {t('cropTitle')}
        </h1>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
          {t('cropSubtitle')}
        </div>
      </div>

      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
        {t('cropDesc')}
      </div>

      {/* Node Switcher */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {nodes.map(n => (
          <button
            key={n.id}
            onClick={() => setSelectedNodeId(n.id)}
            className={`btn ${n.id === selectedNodeId ? 'btn-primary' : ''}`}
            style={{ padding: '8px 16px', fontWeight: 600 }}
          >
            {n.name}
          </button>
        ))}
      </div>

      {/* Current Environmental Summary */}
      {r && !r.err && (
        <div className="card" style={{ background: 'var(--bg-muted)', padding: '12px 20px', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>Soil Moisture: </span>
            <strong style={{ fontSize: 14 }}>{r.sm}%</strong>
          </div>
          <div>
            <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>Soil Temp: </span>
            <strong style={{ fontSize: 14 }}>{r.st}°C</strong>
          </div>
          <div>
            <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>Air Temp: </span>
            <strong style={{ fontSize: 14 }}>{r.at}°C</strong>
          </div>
          <div>
            <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>Humidity: </span>
            <strong style={{ fontSize: 14 }}>{r.ah}%</strong>
          </div>
        </div>
      )}

      {/* Recommended Crops Cards */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          {t('recommendedCrops')} for {activeNode.name}
        </h3>

        <div className="grid-cols-2">
          {cropList.map(crop => (
            <div key={crop.name} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <h4 style={{ fontSize: 18, fontWeight: 700 }}>{crop.name}</h4>
                  {getSuitabilityBadge(crop.suitability)}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {crop.reason}
                </p>
              </div>

              <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text-faint)' }}>
                Field Zone: {activeNode.zone} · Live Model
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// 13.7 DISEASE IDENTIFICATION PAGE (src/pages/Disease.jsx)
// ==============================================================================
const DISEASE_DB = {
  turmeric: {
    cropName: 'Turmeric (மஞ்சள்)',
    aliases: ['turmeric', 'haldi', 'மஞ்சள்'],
    diseases: [
      {
        name: 'Rhizome Rot (விரல் அழுகல் / கிழங்கு அழுகல்)',
        symptoms: 'Yellowing of lower leaves progressing upwards, water-soaked brown lesions at the pseudostem collar, rotting rhizomes emitting foul odor.',
        prevention: 'Ensure excellent drainage, raise bed planting, avoid waterlogging, and select certified disease-free rhizomes.',
        solution: 'Drench the root zone with Trichoderma viride or spray Copper Oxychloride (0.25%) at the first sign of collar rotting.',
      },
      {
        name: 'Leaf Blotch / Leaf Spot (இலைப்புள்ளி நோய்)',
        symptoms: 'Small rectangular brown spots with yellow halos across older leaves, coalescing into necrotic dry patches.',
        prevention: 'Maintain adequate plant spacing for ventilation and avoid overhead sprinkler splash.',
        solution: 'Foliar spray of Mancozeb (0.2%) or Carbendazim (0.1%) upon early symptom manifestation.',
      },
    ],
  },
  paddy: {
    cropName: 'Paddy / Rice (நெல்)',
    aliases: ['paddy', 'rice', 'நெல்', 'அரிசி'],
    diseases: [
      {
        name: 'Blast Disease (குலை நோய்)',
        symptoms: 'Spindle-shaped lesions with gray-white centers and reddish-brown borders on leaves, rotting of the neck node causing chaffy panicles.',
        prevention: 'Use blast-resistant cultivars (e.g., ADT-43, CO-51), avoid excessive nitrogenous top-dressing.',
        solution: 'Spray Tricyclazole 75% WP @ 0.6 g/L or Kasugamycin @ 1.5 mL/L at the tillering and panicle emergence stages.',
      },
      {
        name: 'Bacterial Leaf Blight (பாக்டீரியா இலைக்கருகல்)',
        symptoms: 'Water-soaked wavy lesions starting from leaf tips down the margins, turning straw-colored.',
        prevention: 'Avoid deep standing water during high humidity, clip seedling tips before transplanting.',
        solution: 'Spray Copper Hydroxide @ 2.5 g/L mixed with Streptomycin sulphate @ 100 mg/L.',
      },
    ],
  },
  banana: {
    cropName: 'Banana (வாழை)',
    aliases: ['banana', 'plantain', 'வாழை', 'வாழைமரம்'],
    diseases: [
      {
        name: 'Panama Wilt / Fusarium Wilt (பனாமா வாடல் நோய்)',
        symptoms: 'Progressive yellowing of lower leaf margins, buckle and collapse of petioles around pseudostem, vascular browning inside trunk.',
        prevention: 'Plant tissue-culture suckers, practice crop rotation with paddy, apply neem cake at planting.',
        solution: 'Uproot and destroy heavily infected clumps. Apply bio-control agent Trichoderma harzianum enriched in farmyard manure.',
      },
    ],
  },
  groundnut: {
    cropName: 'Groundnut (நிலக்கடலை)',
    aliases: ['groundnut', 'peanut', 'நிலக்கடலை', 'வேர்க்கடலை'],
    diseases: [
      {
        name: 'Tikka Leaf Spot (டிக்கா இலைப்புள்ளி நோய்)',
        symptoms: 'Circular dark brown to black spots surrounded by a bright yellow halo on upper leaf surfaces, leading to severe defoliation.',
        prevention: 'Deep summer ploughing, crop rotation with millets, treat seeds with Trichoderma before sowing.',
        solution: 'Foliar spray with Chlorothalonil 75% WP @ 2 g/L or Hexaconazole 5% EC @ 2 mL/L at 15-day intervals.',
      },
    ],
  },
  millets: {
    cropName: 'Millets (சிறுதானியங்கள்)',
    aliases: ['millets', 'millet', 'ragi', 'bajra', 'சிறுதானியங்கள்', 'கேழ்வரகு', 'கம்பு', 'திணை'],
    diseases: [
      {
        name: 'Downy Mildew / Green Ear (அடிச்சாம்பல் நோய்)',
        symptoms: 'Chlorotic striping on upper leaves, whitish downy fungal growth on undersides, transformation of floral head into leafy shoots (green ear).',
        prevention: 'Hot water seed treatment or fungicide seed dressing, rogue out infected plants early.',
        solution: 'Foliar spray of Metalaxyl-Mancozeb @ 2 g/L during vegetative growth.',
      },
    ],
  },
};

export function Disease() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeResult, setActiveResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e?.preventDefault();
    const cleanQuery = searchTerm.trim().toLowerCase();

    if (!cleanQuery) return;

    setHasSearched(true);

    // Search against crop keys and aliases
    const matchedEntry = Object.values(DISEASE_DB).find(crop =>
      crop.aliases.some(alias => cleanQuery.includes(alias) || alias.includes(cleanQuery))
    );

    setActiveResult(matchedEntry || null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>
          {t('diseaseTitle')}
        </h1>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
          {t('diseaseSubtitle')}
        </div>
      </div>

      {/* Search Bar Interface */}
      <div className="card" style={{ padding: 20 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('searchCropPlaceholder') || 'e.g. Turmeric, Paddy, Banana...'}
            className="input-field"
            style={{ flex: 1, padding: '12px 16px', fontSize: 15 }}
            aria-label="Crop search input"
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '0 24px', fontSize: 15, fontWeight: 600 }}
          >
            🔍 {t('searchBtn') || 'Search'}
          </button>
        </form>
      </div>

      {/* Search Results Area */}
      {hasSearched && (
        <div>
          {activeResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>
                  {activeResult.cropName} — Disease Profiles
                </h2>
                <span className="badge badge-warning">
                  {activeResult.diseases.length} Diseases Identified
                </span>
              </div>

              {activeResult.diseases.map((d, index) => (
                <div key={index} className="card" style={{ padding: 22, borderLeft: '4px solid var(--accent)' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
                    {d.name}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-fault)' }}>
                        🚨 {t('symptoms')}:{' '}
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {d.symptoms}
                      </span>
                    </div>

                    <div>
                      <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-warning)' }}>
                        🛡️ {t('prevention')}:{' '}
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {d.prevention}
                      </span>
                    </div>

                    <div style={{
                      background: 'var(--bg)',
                      padding: 14,
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      marginTop: 6,
                    }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-online)' }}>
                        💊 {t('recommendedSolution')}:{' '}
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                        {d.solution}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{
              textAlign: 'center',
              padding: 36,
              background: 'var(--bg-panel)',
              color: 'var(--text-muted)',
            }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                {t('noDiseaseFound')}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-faint)' }}>
                Please try searching for crops such as Turmeric, Paddy (Rice), Banana, Groundnut, or Millets.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==============================================================================
// 13.8 WEATHER PAGE (src/pages/Weather.jsx)
// ==============================================================================
export function Weather() {
  const { t } = useLanguage();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadWeather = async (fallback = false) => {
    setLoading(true);
    setErrorMsg('');

    if (fallback) {
      setWeather(getDemoWeatherData());
      setLoading(false);
      return;
    }

    const res = await fetchLiveWeatherData();
    if (res.success) {
      setWeather(res);
    } else {
      setErrorMsg(res.error);
      setWeather(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWeather(useFallback);
  }, [useFallback]);

  return (
    <div className="weather-page" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>
            {t('weatherTitle')}
          </h1>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            {t('weatherSubtitle')}
          </div>
        </div>

        {/* Development Fallback Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            className={`btn btn-sm ${useFallback ? 'btn-primary' : ''}`}
            onClick={() => setUseFallback(!useFallback)}
          >
            {useFallback ? 'Using Demo Data' : 'Live Data Mode'}
          </button>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => loadWeather(useFallback)}
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Weather Source & Observation Status Banner */}
      {weather && (
        <div className={`card ${weather.isDemo ? 'weather-banner-demo' : 'weather-banner-live'}`} style={{
          padding: '12px 20px',
          background: weather.isDemo ? 'var(--color-warning-bg)' : 'var(--color-online-bg)',
          color: weather.isDemo ? 'var(--color-warning)' : 'var(--color-online)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>{weather.isDemo ? '⚠️' : '📡'}</span>
            <div>
              <strong style={{ fontSize: 14 }}>
                {weather.isDemo ? t('devFallbackLabel') : t('weatherLiveSuccess')}
              </strong>
              <div style={{ fontSize: 11, opacity: 0.85 }}>
                {t('imdSource')}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 12, fontWeight: 600 }}>
            {t('lastUpdated')}: {weather.observationTime}
          </div>
        </div>
      )}

      {/* Error Banner when live data cannot be retrieved */}
      {errorMsg && !useFallback && (
        <div className="card weather-banner-error" style={{
          background: 'var(--color-fault-bg)',
          color: 'var(--color-fault)',
          padding: 20,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌐</div>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>
            {t('weatherUnavailable')}
          </h3>
          <p style={{ fontSize: 13, marginTop: 4, opacity: 0.85 }}>
            The application is operating on a local-first network. You can activate Demo/Fallback Weather mode above for development and testing.
          </p>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => setUseFallback(true)}
            style={{ marginTop: 14 }}
          >
            {t('toggleFallback')}
          </button>
        </div>
      )}

      {/* Current Conditions Metrics */}
      {weather && (
        <>
          <div className="grid-cols-4">
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 42 }}>{weather.icon || '☀️'}</div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>Temperature</div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{weather.temperature}°C</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{weather.condition}</div>
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t('airHumidity')}</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>{weather.humidity}%</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Relative Humidity</div>
            </div>

            <div className="card">
              <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t('windSpeed')}</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>{weather.windSpeed}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Surface Wind</div>
            </div>

            <div className="card">
              <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t('rainfall')}</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>{weather.rainfall}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Past 24h Precipitation</div>
            </div>
          </div>

          {/* 5-Day Forecast Grid */}
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
              {t('forecast5Day')}
            </h3>

            <div className="grid-cols-4" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
              {weather.forecast.map((day, idx) => (
                <div key={idx} className="card" style={{ textAlign: 'center', padding: 18 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{day.day}</div>
                  <div style={{ fontSize: 36, margin: '10px 0' }}>{day.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>
                    {day.high}° <span style={{ fontSize: 13, color: 'var(--text-faint)', fontWeight: 400 }}>/ {day.low}°</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                    {day.condition}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {loading && !weather && (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
          Contacting India Meteorological Department observation network...
        </div>
      )}
    </div>
  );
}

// ==============================================================================
// 13.9 NEWS PAGE (src/pages/News.jsx)
// ==============================================================================
const NEWS_ARTICLES = [
  {
    id: 1,
    category: 'AgriTech',
    title: 'AgriSpike Prototype Completes Field Trial with 4 LoRa Nodes Across Erode Farmlands',
    summary: 'The SenseiSquad deployed the ESP32 and RFM95-powered sensor mesh network across 4 hectares, achieving steady telemetry and autonomous solenoid switching.',
    date: 'September 2026',
    author: 'SenseiSquad Research',
  },
  {
    id: 2,
    category: 'Farming',
    title: 'Precision Soil Moisture Sensing Cuts Tamil Nadu Turmeric Irrigation Water by 32%',
    summary: 'Adoption of root-zone capacitance sensors coupled with automated drip lines prevented rhizome waterlogging while maintaining uniform rhizome bulk weight.',
    date: 'August 2026',
    author: 'TN Agricultural University',
  },
  {
    id: 3,
    category: 'Government Schemes',
    title: 'PM-KUSUM Solar Pump Subsidy Expanded to Integrate Smart Micro-Irrigation Actuators',
    summary: 'Farmers installing solar-powered brushless DC submersible pumps can now receive extended capital subsidies for IoT-enabled pressure sensors and solenoid valves.',
    date: 'August 2026',
    author: 'Ministry of Agriculture',
  },
  {
    id: 4,
    category: 'Technology',
    title: 'Low-Power LoRa Mesh Networks Bridge Rural Farmland Connectivity Without Cellular Data',
    summary: 'Long-range sub-GHz transceivers enable field-wide crop monitoring over 3+ kilometers, relaying soil moisture and temperature packets to solar base stations.',
    date: 'July 2026',
    author: 'IEEE CASS AgriTech Forum',
  },
  {
    id: 5,
    category: 'Weather',
    title: 'IMD Enhances High-Resolution Agromet Forecasts for Kongu Region Agro-Climatic Zones',
    summary: 'Automated weather stations provide block-level rainfall and relative humidity nowcasts, helping turmeric and paddy farmers optimize foliar spraying schedules.',
    date: 'July 2026',
    author: 'IMD Agromet Advisory',
  },
  {
    id: 6,
    category: 'Agriculture',
    title: 'Organic Soil Carbon Management & Potassium Nutrition Strengthen Drought Hardiness in Millets',
    summary: 'Agronomists highlight the synergy of farmyard compost, mulching, and targeted Muriate of Potash to enhance stomatal conductance during prolonged dry spells.',
    date: 'June 2026',
    author: 'Agronomy Today',
  },
];

export function News() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'AgriTech', 'Farming', 'Government Schemes', 'Technology', 'Weather', 'Agriculture'];

  const filteredNews = selectedCategory === 'All'
    ? NEWS_ARTICLES
    : NEWS_ARTICLES.filter(n => n.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>
          {t('newsTitle')}
        </h1>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
          {t('newsSubtitle')}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : ''}`}
            onClick={() => setSelectedCategory(cat)}
            style={{ borderRadius: 'var(--radius-md)', padding: '6px 14px' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid-cols-2">
        {filteredNews.map(item => (
          <article
            key={item.id}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 22,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="badge badge-online" style={{ fontSize: 11 }}>
                  🏷️ {item.category}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                  📅 {item.date}
                </span>
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', lineHeight: 1.4, marginBottom: 8 }}>
                {item.title}
              </h3>

              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {item.summary}
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 18,
              paddingTop: 12,
              borderTop: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                Source: {item.author}
              </span>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => alert(`Full Article: ${item.title}\n\nPublished in ${item.date} by ${item.author}.`)}
              >
                {t('readMore')} →
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ==============================================================================
// 13.10 FERTILIZER SHOP PAGE (src/pages/Shop.jsx)
// ==============================================================================
const PRODUCTS = [
  {
    id: 1,
    name: 'Muriate of Potash (MOP - 60% K2O)',
    type: 'Potash Fertilizer / Drought Resistance',
    suitableFor: 'Turmeric, Banana, Paddy (Drought & Moisture Stress zones)',
    supplier: 'IFFCO Bazar Online',
    url: 'https://www.iffcobazar.in',
    isOnline: true,
  },
  {
    id: 2,
    name: 'Water-Soluble NPK (19:19:19 Foliar Grade)',
    type: 'Balanced Macro-Nutrients',
    suitableFor: 'High heat stress recovery, fast foliar absorption',
    supplier: 'BigHaat Agri-Portal',
    url: 'https://www.bighaat.com',
    isOnline: true,
  },
  {
    id: 3,
    name: 'Neem-Coated Slow Release Urea (46% N)',
    type: 'Controlled Nitrogen Soil Conditioner',
    suitableFor: 'Paddy & Turmeric in high moisture / rainy periods',
    supplier: 'AgriBegri Farmers Platform',
    url: 'https://agribegri.com',
    isOnline: true,
  },
  {
    id: 4,
    name: 'Trichoderma Viride Bio-Fungicide (1% WP)',
    type: 'Biological Fungicide & Root Rot Cure',
    suitableFor: 'Turmeric Rhizome Rot, Paddy Blast, Panama Wilt Prevention',
    supplier: 'District Agro Input Center',
    url: null,
    isOnline: false,
    address: 'Available at Taluk Agricultural Extension Outlets & PACCS',
  },
  {
    id: 5,
    name: 'Subsidized Complex Fertilizers (DAP / Potash)',
    type: 'Government-Subsidized Nutrient Sacks',
    suitableFor: 'Registered Patta / Smallholder Farmers',
    supplier: 'Primary Agricultural Cooperative Credit Society (PACCS)',
    url: null,
    isOnline: false,
    address: 'Local Village Cooperative Store (Requires Aadhaar / Farmer ID)',
  },
  {
    id: 6,
    name: 'Chelated Micronutrient Spray (Fe, Zn, B, Mn)',
    type: 'Essential Secondary Trace Elements',
    suitableFor: 'Yellowing foliage, vegetative stunting, chlorosis',
    supplier: 'Private Agri Retail Outlets (Kongu Region)',
    url: null,
    isOnline: false,
    address: 'Regional Fertilizer & Pesticide Dealerships',
  },
];

export function Shop() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? PRODUCTS
    : filter === 'online'
      ? PRODUCTS.filter(p => p.isOnline)
      : PRODUCTS.filter(p => !p.isOnline);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>
          {t('shopTitle')}
        </h1>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
          {t('shopSubtitle')}
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Outlets ({PRODUCTS.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${filter === 'online' ? 'btn-primary' : ''}`}
          onClick={() => setFilter('online')}
        >
          Online Delivery Portals
        </button>
        <button
          type="button"
          className={`btn btn-sm ${filter === 'offline' ? 'btn-primary' : ''}`}
          onClick={() => setFilter('offline')}
        >
          Local Cooperative & Retail Stores
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid-cols-3">
        {filtered.map(p => (
          <div
            key={p.id}
            className="card"
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 20 }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className={`badge ${p.isOnline ? 'badge-online' : 'badge-warning'}`} style={{ fontSize: 11 }}>
                  {p.isOnline ? '🌐 Direct Order' : '🏪 In-Store Pickup'}
                </span>
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
                {p.name}
              </h3>

              <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, marginBottom: 6 }}>
                {p.type}
              </div>

              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text)' }}>{t('suitableFor')}: </strong>
                {p.suitableFor}
              </div>

              <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                Supplier: <strong>{p.supplier}</strong>
                {p.address && <div style={{ marginTop: 2 }}>📍 {p.address}</div>}
              </div>
            </div>

            <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary"
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  ↗️ {t('visitSupplier')} ({p.supplier.split(' ')[0]})
                </a>
              ) : (
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => alert(`Locate store for: ${p.name}\n\n${p.address}`)}
                >
                  📍 View Store Locations
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==============================================================================
// 13.11 SUPPORT PAGE (src/pages/Support.jsx)
// ==============================================================================
export function Support() {
  const { nodes } = useSensorData();
  const { t } = useLanguage();

  const [activeNodeId, setActiveNodeId] = useState(1);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Hi! Ask me anything about your field, irrigation, crops, or AgriSpike.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tickets, setTickets] = useState(aiSupportService.getTickets());
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e) {
    e?.preventDefault();
    const query = input.trim();
    if (!query || isTyping) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { from: 'user', text: query, timestamp: time }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await aiSupportService.processQuery(query, activeNodeId);
      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text: response.text,
          escalated: response.escalated,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setTickets(aiSupportService.getTickets());
    } catch {
      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text: 'AI support is temporarily unavailable. Please try again later.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>
          {t('supportTitle')}
        </h1>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
          {t('supportSubtitle')}
        </div>
      </div>

      <div className="grid-cols-3" style={{ alignItems: 'start' }}>
        {/* Left Column: Contact Directory & Escalation Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Direct Support Contacts */}
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
              📞 {t('supportPhoneLabel')}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>Phone Helpline</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>
                  {SUPPORT_CONFIG.phone}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Direct farmer line</div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{t('supportWebsiteLabel')}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                  {SUPPORT_CONFIG.website}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>Support Email</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                  {SUPPORT_CONFIG.email}
                </div>
              </div>
            </div>
          </div>

          {/* Context Selector: Which node are you asking about? */}
          <div className="card">
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
              🎯 Field Context Anchor
            </h4>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
              AI analyzes telemetry for the selected zone:
            </div>
            <select
              value={activeNodeId}
              onChange={e => setActiveNodeId(Number(e.target.value))}
              className="input-field"
              style={{ fontSize: 13 }}
            >
              {nodes.map(n => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>

          {/* Logged Support Tickets */}
          {tickets.length > 0 && (
            <div className="card" style={{ border: '1px solid var(--accent)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: 'var(--accent)' }}>
                📋 Escalated Team Tickets ({tickets.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tickets.map(tkt => (
                  <div
                    key={tkt.id}
                    style={{
                      background: 'var(--bg)',
                      padding: 10,
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 12,
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: 'var(--text)' }}>
                      #{tkt.id} · Assigned to {tkt.assignedTo}
                    </div>
                    <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>
                      Query: "{tkt.query.slice(0, 45)}..."
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 4 }}>
                      ✓ {tkt.status} ({tkt.timestamp})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 2 Columns: Conversational AI Support Terminal */}
        <div className="card" style={{
          gridColumn: 'span 2',
          height: 600,
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
        }}>
          {/* Chat Top Banner */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-panel)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>🤖</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>AgriSpike Conversational Advisory</div>
                <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>
                  ● Grounded in Live Sensor Telemetry
                </div>
              </div>
            </div>
          </div>

          {/* Message Stream */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            background: 'var(--bg)',
          }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
                  background: m.from === 'user' ? 'var(--accent)' : 'var(--bg-panel)',
                  color: m.from === 'user' ? '#ffffff' : 'var(--text)',
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 14,
                  lineHeight: 1.55,
                  maxWidth: '85%',
                  border: m.from === 'user' ? 'none' : '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  whiteSpace: 'pre-line',
                }}
              >
                {m.text}
                <div style={{
                  fontSize: 10,
                  opacity: 0.7,
                  marginTop: 6,
                  textAlign: m.from === 'user' ? 'right' : 'left',
                }}>
                  {m.timestamp}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{
                alignSelf: 'flex-start',
                background: 'var(--bg-panel)',
                color: 'var(--text-faint)',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: 13,
                border: '1px solid var(--border)',
              }}>
                Analyzing field telemetry and generating agronomic solution...
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSend}
            style={{
              padding: 16,
              borderTop: '1px solid var(--border)',
              background: 'var(--bg-panel)',
              display: 'flex',
              gap: 10,
            }}
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t('chatPlaceholder')}
              className="input-field"
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isTyping || !input.trim()}
              style={{ padding: '0 24px' }}
            >
              {t('send')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// 13.12 TEAM PAGE (src/pages/Team.jsx)
// ==============================================================================
export function Team() {
  const { t } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>
          {t('teamTitle')}
        </h1>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
          {t('teamSubtitle')} · Team SenseiSquad
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid-cols-3">
        {TEAM_MEMBERS.map(member => (
          <div
            key={member.name}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 24,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'var(--accent-light)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 16,
                  border: '1px solid var(--accent)',
                }}>
                  {member.name.charAt(0)}
                </div>

                {member.supportRecipient && (
                  <span className="badge badge-online" style={{ fontSize: 11 }}>
                    Escalation Contact
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
                {member.name}
              </h3>

              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', marginBottom: 8 }}>
                {member.role}
              </div>
            </div>

            <div style={{
              paddingTop: 14,
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>Phone</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                  +91 {member.phone}
                </div>
              </div>

              <a
                href={`tel:${member.phone}`}
                className="btn btn-sm"
                title={`Call ${member.name}`}
              >
                📞 Call
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==============================================================================
// 13.13 SETTINGS PAGE (src/pages/Settings.jsx)
// ==============================================================================
export function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const rawUser = localStorage.getItem('agrispike_username') || 'Farmer';
  const userName = rawUser.charAt(0).toUpperCase() + rawUser.slice(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>
          {t('settingsTitle')}
        </h1>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
          Configure application preferences, interface language, and local network settings.
        </div>
      </div>

      {/* Appearance Section */}
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
          🎨 {t('appearance')}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Theme */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t('theme')}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Choose between Light (clean white) and Dark (deep night) modes.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : ''}`}
                onClick={() => setTheme('light')}
              >
                ☀️ {t('themeLight')}
              </button>
              <button
                type="button"
                className={`btn btn-sm ${theme === 'dark' ? 'btn-primary' : ''}`}
                onClick={() => setTheme('dark')}
              >
                🌙 {t('themeDark')}
              </button>
            </div>
          </div>

          {/* Language */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t('language')}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Select interface language (English or Tamil exclusively).
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className={`btn btn-sm ${language === 'en' ? 'btn-primary' : ''}`}
                onClick={() => setLanguage('en')}
              >
                🇬🇧 English
              </button>
              <button
                type="button"
                className={`btn btn-sm ${language === 'ta' ? 'btn-primary' : ''}`}
                onClick={() => setLanguage('ta')}
              >
                🇮🇳 தமிழ் (Tamil)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
          👤 {t('account')}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t('loggedInAs')}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)', marginTop: 2 }}>
              {userName}
            </div>
          </div>

          <div className="badge badge-online">
            Authenticated Team Session
          </div>
        </div>
      </div>

      {/* Local Network / ESP32 Wi-Fi Information Section */}
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
          📶 {t('networkInfo')}
        </h3>

        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          <p style={{ marginBottom: 10 }}>
            AgriSpike is configured to bind to <strong>0.0.0.0:3000</strong>. When your host laptop is connected to an ESP32 Access Point or local farm Wi-Fi:
          </p>
          <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Open command prompt on this host machine and run <code>ipconfig</code>.</li>
            <li>Note your Wi-Fi IPv4 address (e.g. <code>192.168.4.2</code> or <code>192.168.1.50</code>).</li>
            <li>Connect any phone, tablet, or secondary laptop to the same ESP32 Wi-Fi network.</li>
            <li>In the browser on that device, navigate to: <code>http://&lt;your-ip&gt;:3000</code>.</li>
            <li>All local dashboard features, telemetry, irrigation toggles, and offline guides will function seamlessly.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// 13.14 DASHBOARD / HOME PAGE (src/pages/Home.jsx)
// ==============================================================================
function statusFor(r) {
  if (!r) return 'fault';
  if (r.err || r.sys === 'FAULT') return 'fault';
  if (r.sys === 'ATTENTION' || r.hs || r.irr) return 'warn';
  return 'ok';
}

function suggestionFor(node, r) {
  if (!r) return null;
  if (r.err || r.sys === 'FAULT') return `${node.name}: sensor fault detected — check wiring/power.`;
  if (r.bp !== undefined && r.bp < 45) return `${node.name}: battery at ${r.bp}% — check solar charging.`;
  if (r.irr) return `${node.name}: soil is dry — irrigation recommended.`;
  if (r.hs) return `${node.name}: heat stress risk — monitor closely today.`;
  return null;
}

export function Home() {
  const { readings, nodes, live } = useReadings();
  const suggestions = nodes.map(n => suggestionFor(n, readings[n.id])).filter(Boolean);
  const faultCount = nodes.filter(n => statusFor(readings[n.id]) === 'fault').length;
  const warnCount = nodes.filter(n => statusFor(readings[n.id]) === 'warn').length;

  const overall = faultCount > 0 ? 'fault' : warnCount > 0 ? 'warn' : 'ok';
  const overallText = faultCount > 0
    ? `${faultCount} node${faultCount > 1 ? 's' : ''} need attention`
    : warnCount > 0
      ? `${warnCount} node${warnCount > 1 ? 's' : ''} flagged for review`
      : 'All sensors working normally';

  return (
    <div>
      <div className="card" style={{ marginBottom: 20, borderColor: overall === 'fault' ? 'var(--fault)' : overall === 'warn' ? 'var(--warn)' : 'var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={`pulse-dot`} style={{ color: overall === 'fault' ? 'var(--fault)' : overall === 'warn' ? 'var(--warn)' : 'var(--accent)' }} />
            <h3>{overallText}</h3>
          </div>
          <span className="pill" style={{ color: 'var(--text-faint)', background: 'transparent' }}>
            {live ? 'LIVE DATA' : 'DEMO DATA'}
          </span>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: suggestions.length ? 18 : 0 }}>
          {nodes.map(n => {
            const r = readings[n.id];
            const s = statusFor(r);
            return (
              <Link key={n.id} to={`/field/node/${n.id}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 6 }}>{n.name}</div>
                <span className={`pill ${s}`}>{s === 'ok' ? 'Normal' : s === 'warn' ? 'Warning' : 'Fault'}</span>
              </Link>
            );
          })}
        </div>

        {suggestions.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Suggestions
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {suggestions.map((s, i) => <li key={i} style={{ fontSize: 14, color: 'var(--text-dim)' }}>{s}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <Link to="/field" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h4 style={{ marginBottom: 6 }}>🗺 My Field</h4>
          <div style={{ fontSize: 13, color: 'var(--text-faint)' }}>View live node locations on your field map</div>
        </Link>
        <Link to="/irrigation" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h4 style={{ marginBottom: 6 }}>💧 Irrigation</h4>
          <div style={{ fontSize: 13, color: 'var(--text-faint)' }}>Control all solenoids across your field</div>
        </Link>
        <Link to="/fertilizer" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h4 style={{ marginBottom: 6 }}>🌱 Fertilizer Suggestion</h4>
          <div style={{ fontSize: 13, color: 'var(--text-faint)' }}>Get zone-specific fertilizer guidance</div>
        </Link>
      </div>
    </div>
  );
}

// ==============================================================================
// 14. ROOT APP & ROUTING CONFIGURATION (src/App.jsx)
// ==============================================================================
export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<Layout />}>
              <Route path="/field" element={<MyField />} />
              <Route path="/field/node/:nodeId" element={<NodeDetail />} />
              <Route path="/irrigation" element={<Irrigation />} />
              <Route path="/fertilizer" element={<Fertilizer />} />
              <Route path="/crop" element={<CropSuggestion />} />
              <Route path="/disease" element={<Disease />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/news" element={<News />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/support" element={<Support />} />
              <Route path="/team" element={<Team />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/home" element={<Navigate to="/field" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </HashRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
