// AgriSpike Centralized Sensor Data Service
// Architecture: Single source of truth for telemetry, irrigation state, and agronomy computations.
// Prepared for future ESP32 integration via pluggable data provider without UI changes.

import { useState, useEffect } from 'react';
import { SENSOR_NODES } from '../constants/agriConfig';

// Initial realistic demo readings for the 4 nodes
const INITIAL_READINGS = {
  1: {
    node_id: 1,
    at: 28.6, // Air Temp (°C)
    ah: 67.2, // Air Humidity (%)
    st: 25.8, // Soil Temp (°C)
    sm: 58.0, // Soil Moisture (%)
    ldr: 82.0, // Light Level (%)
    dl: 11.6, // Daylight Duration (hrs)
    et: 46.4, // Evapotranspiration Index
    bv: 4.05, // Battery Voltage (V)
    bp: 81,   // Battery %
    sv: 5.78, // Solar Voltage (V)
    psi: 18,  // Plant Stress Index (/100)
    sys: 'OK', // 'OK' | 'ATTENTION' | 'FAULT'
    mode: 'NORMAL',
    err: false,
    lastUpdated: new Date().toLocaleTimeString(),
  },
  2: {
    node_id: 2,
    at: 33.4,
    ah: 38.5,
    st: 29.2,
    sm: 24.0, // Low soil moisture
    ldr: 94.0,
    dl: 11.6,
    et: 68.9,
    bv: 3.72,
    bp: 42,
    sv: 5.15,
    psi: 72,  // High plant stress
    sys: 'ATTENTION',
    mode: 'FAST_SAMPLING',
    err: false,
    lastUpdated: new Date().toLocaleTimeString(),
  },
  3: {
    node_id: 3,
    at: 29.0,
    ah: 61.0,
    st: 26.0,
    sm: 64.0,
    ldr: 72.0,
    dl: 11.6,
    et: 41.2,
    bv: 4.12,
    bp: 88,
    sv: 5.92,
    psi: 12,
    sys: 'OK',
    mode: 'NORMAL',
    err: false,
    lastUpdated: new Date().toLocaleTimeString(),
  },
  4: {
    node_id: 4,
    at: 0,
    ah: 0,
    st: 0,
    sm: 0,
    ldr: 0,
    dl: 0,
    et: 0,
    bv: 0,
    bp: 0,
    sv: 0,
    psi: 0,
    sys: 'FAULT',
    mode: 'FAULT_DIAGNOSTIC',
    err: true,
    lastUpdated: new Date().toLocaleTimeString(),
  },
};

const INITIAL_SOLENOIDS = {
  1: false,
  2: true,  // Node 2 is irrigating because moisture was low
  3: false,
  4: false,
};

class SensorDataService {
  constructor() {
    this.nodes = SENSOR_NODES;
    this.readings = { ...INITIAL_READINGS };
    this.solenoids = { ...INITIAL_SOLENOIDS };
    this.listeners = new Set();
    this.isLiveBackend = false;
    this.externalProvider = null;
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(cb => cb(this.getState()));
  }

  getState() {
    return {
      nodes: this.nodes,
      readings: { ...this.readings },
      solenoids: { ...this.solenoids },
      isLiveBackend: this.isLiveBackend,
      stats: this.getStats(),
    };
  }

  getStats() {
    let online = 0;
    let warning = 0;
    let fault = 0;

    this.nodes.forEach(n => {
      const r = this.readings[n.id];
      if (!r || r.err || r.sys === 'FAULT') {
        fault += 1;
      } else if (r.sys === 'ATTENTION' || r.psi > 50 || r.sm < 30) {
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

  getNodeStatus(nodeId) {
    const r = this.readings[nodeId];
    if (!r || r.err || r.sys === 'FAULT') return 'fault';
    if (r.sys === 'ATTENTION' || r.psi > 50 || r.sm < 30) return 'warning';
    return 'online';
  }

  // Actuator control: Toggle single solenoid
  toggleIrrigation(nodeId) {
    const nextState = !this.solenoids[nodeId];
    this.solenoids = {
      ...this.solenoids,
      [nodeId]: nextState,
    };

    // Simulate soil moisture changes when solenoid is toggled
    if (this.readings[nodeId] && !this.readings[nodeId].err) {
      const currentSm = this.readings[nodeId].sm;
      const newSm = nextState ? Math.min(80, currentSm + 15) : currentSm;
      const newPsi = nextState ? Math.max(10, this.readings[nodeId].psi - 20) : this.readings[nodeId].psi;
      const newSys = newSm >= 35 && newSm <= 70 ? 'OK' : this.readings[nodeId].sys;

      this.readings[nodeId] = {
        ...this.readings[nodeId],
        sm: newSm,
        psi: newPsi,
        sys: newSys,
        lastUpdated: new Date().toLocaleTimeString(),
      };
    }

    this.notify();
    return nextState;
  }

  // Actuator control: Master switch
  setAllIrrigation(state) {
    const next = {};
    this.nodes.forEach(n => {
      next[n.id] = state;
      if (this.readings[n.id] && !this.readings[n.id].err) {
        const currentSm = this.readings[n.id].sm;
        const newSm = state ? Math.min(80, currentSm + 10) : currentSm;
        this.readings[n.id] = {
          ...this.readings[n.id],
          sm: newSm,
          lastUpdated: new Date().toLocaleTimeString(),
        };
      }
    });
    this.solenoids = next;
    this.notify();
  }

  // Future ESP32 integration hook
  updateFromEsp32(nodeId, telemetry) {
    if (this.readings[nodeId]) {
      this.readings[nodeId] = {
        ...this.readings[nodeId],
        ...telemetry,
        lastUpdated: new Date().toLocaleTimeString(),
      };
      this.isLiveBackend = true;
      this.notify();
    }
  }

  // Agronomic Recommendation Engine for Fertilizer
  getFertilizerRecommendation(nodeId) {
    const r = this.readings[nodeId];
    if (!r || r.err || r.sys === 'FAULT') {
      return {
        fertilizer: 'Sensor Fault / No Data',
        reason: 'Unable to evaluate node telemetry due to sensor fault or connection timeout. Check wiring.',
        type: 'Inspection Required',
      };
    }

    if (r.sm < 35 && r.psi > 40) {
      return {
        fertilizer: 'Potassium-rich fertilizer (Muriate of Potash / MOP) + Organic Mulching',
        reason: `Soil moisture is critically low (${r.sm}%) and plant stress index is elevated (${r.psi}/100). Potassium optimizes stomatal conductance and improves drought resistance.`,
        type: 'Potash / Moisture Retention',
      };
    }

    if (r.ah < 45 && r.at > 32) {
      return {
        fertilizer: 'Balanced NPK (19:19:19) with Water-Soluble Foliar Spray',
        reason: `Low relative humidity (${r.ah}%) coupled with high air temperature (${r.at}°C) creates severe heat stress. Foliar nutrients bypass root uptake resistance and promote cell recovery.`,
        type: 'Foliar NPK 19:19:19',
      };
    }

    if (r.sm > 70) {
      return {
        fertilizer: 'Slow-Release Nitrogen (Neem-Coated Urea) in Reduced Doses',
        reason: `Soil moisture is high (${r.sm}%). Normal irrigation or rain risks leaching conventional urea; slow-release forms protect water quality and root zones.`,
        type: 'Slow-Release Nitrogen',
      };
    }

    return {
      fertilizer: 'Standard Organic Compost & Balanced Micronutrient Mix',
      reason: `Node telemetry is well-balanced (Moisture: ${r.sm}%, Temp: ${r.st}°C). Standard organic maintenance supports sustained microbial soil health.`,
      type: 'Organic Soil Conditioner',
    };
  }

  // Agronomic Crop Suitability Engine
  getCropSuitability(nodeId) {
    const r = this.readings[nodeId];
    if (!r || r.err || r.sys === 'FAULT') {
      return [];
    }

    const crops = [];

    // Turmeric
    if (r.sm >= 50 && r.ah >= 55) {
      crops.push({
        name: 'Turmeric',
        suitability: 'High',
        reason: 'Thrives in warm, humid climates with adequate consistent moisture and good loamy soil drainage.',
      });
    } else if (r.sm >= 35) {
      crops.push({
        name: 'Turmeric',
        suitability: 'Medium',
        reason: 'Moderate fit; requires supplementary drip irrigation to maintain optimal rhizome development.',
      });
    } else {
      crops.push({
        name: 'Turmeric',
        suitability: 'Low',
        reason: 'Insufficient soil moisture for turmeric rhizome expansion.',
      });
    }

    // Paddy (Rice)
    if (r.st >= 22 && r.st <= 32 && r.sm >= 55) {
      crops.push({
        name: 'Paddy (Rice)',
        suitability: 'High',
        reason: 'Optimal soil temperature (22-32°C) and high moisture levels support vigorous tillering and grain filling.',
      });
    } else if (r.sm >= 40) {
      crops.push({
        name: 'Paddy (Rice)',
        suitability: 'Medium',
        reason: 'Suitable with systematic alternate wetting and drying (AWD) irrigation.',
      });
    } else {
      crops.push({
        name: 'Paddy (Rice)',
        suitability: 'Low',
        reason: 'Moisture deficit will trigger spikelet sterility.',
      });
    }

    // Millets
    if (r.sm < 50 && r.at > 26) {
      crops.push({
        name: 'Millets (Ragi / Pearl Millet)',
        suitability: 'High',
        reason: 'High heat tolerance and exceptional drought hardiness; excels in low-to-medium moisture conditions.',
      });
    } else {
      crops.push({
        name: 'Millets (Ragi / Pearl Millet)',
        suitability: 'Medium',
        reason: 'Will grow adequately, but excess moisture may encourage fungal grain discoloration.',
      });
    }

    // Groundnut
    if (r.ah < 65 && r.sm >= 35 && r.sm <= 60) {
      crops.push({
        name: 'Groundnut',
        suitability: 'High',
        reason: 'Optimal sandy-loam conditions with moderate moisture for pod penetration.',
      });
    } else {
      crops.push({
        name: 'Groundnut',
        suitability: 'Medium',
        reason: 'Moderate fit; ensure soil is loose and friable for pegging.',
      });
    }

    // Banana
    if (r.sm > 50 && r.at >= 25 && r.at <= 35) {
      crops.push({
        name: 'Banana',
        suitability: 'High',
        reason: 'High water requirement and warm climate provide ideal vegetative growth.',
      });
    } else {
      crops.push({
        name: 'Banana',
        suitability: 'Low',
        reason: 'Prone to pseudostem dehydration under moisture or temperature stress.',
      });
    }

    return crops;
  }
}

export const sensorDataService = new SensorDataService();

// Custom React hook for consuming sensor data
export function useSensorData() {
  const [state, setState] = useState(sensorDataService.getState());

  useEffect(() => {
    const unsubscribe = sensorDataService.subscribe(newState => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  return {
    ...state,
    getNodeStatus: id => sensorDataService.getNodeStatus(id),
    toggleIrrigation: id => sensorDataService.toggleIrrigation(id),
    setAllIrrigation: s => sensorDataService.setAllIrrigation(s),
    getFertilizerRecommendation: id => sensorDataService.getFertilizerRecommendation(id),
    getCropSuitability: id => sensorDataService.getCropSuitability(id),
  };
}
