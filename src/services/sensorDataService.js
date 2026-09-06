// AgriSpike Firebase Sensor Data Service
// Firebase -> Website real-time telemetry

import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { SENSOR_NODES } from '../constants/agriConfig';


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
// Kept local for now.
// Firebase irrigation control will be added later.
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
  // IRRIGATION - LOCAL FOR NOW
  // ==========================================================

  toggleIrrigation(nodeId) {

    const nextState =
      !this.solenoids[nodeId];


    this.solenoids = {

      ...this.solenoids,

      [nodeId]: nextState,
    };


    // Temporary local simulation
    if (
      this.readings[nodeId] &&
      !this.readings[nodeId].err
    ) {

      const currentSm =
        this.readings[nodeId].sm;


      const currentPsi =
        this.readings[nodeId].psi;


      if (
        currentSm !== undefined &&
        currentPsi !== undefined
      ) {

        const newSm = nextState
          ? Math.min(80, currentSm + 15)
          : currentSm;


        const newPsi = nextState
          ? Math.max(10, currentPsi - 20)
          : currentPsi;


        const newSys =
          newSm >= 35 &&
          newSm <= 70
            ? 'OK'
            : this.readings[nodeId].sys;


        this.readings[nodeId] = {

          ...this.readings[nodeId],

          sm: newSm,

          psi: newPsi,

          sys: newSys,

          lastUpdated:
            new Date().toLocaleTimeString(),
        };
      }
    }


    this.notify();


    return nextState;
  }


  // ==========================================================
  // MASTER IRRIGATION SWITCH
  // ==========================================================

  setAllIrrigation(state) {

    const next = {};


    this.nodes.forEach(node => {

      next[node.id] = state;


      if (
        this.readings[node.id] &&
        !this.readings[node.id].err
      ) {

        const currentSm =
          this.readings[node.id].sm;


        if (currentSm !== undefined) {

          const newSm = state
            ? Math.min(80, currentSm + 10)
            : currentSm;


          this.readings[node.id] = {

            ...this.readings[node.id],

            sm: newSm,

            lastUpdated:
              new Date().toLocaleTimeString(),
          };
        }
      }
    });


    this.solenoids = next;


    this.notify();
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