// AgriSpike Firebase Sensor Data Service
// Firebase -> Website real-time telemetry

import { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../firebase';
import { SENSOR_NODES } from '../constants/agriConfig';


// ============================================================
// INITIAL FALLBACK DATA
// Used only until Firebase sends the first real value.
// ============================================================

const INITIAL_READINGS = {
  1: {
    node_id: 1,
    id: 1,
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
    errorCode: 0,
    errCode: 0,
    lastUpdated: '--',
  },

  2: {
    node_id: 2,
    id: 2,
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
    errorCode: 0,
    errCode: 0,
    lastUpdated: '--',
  },

  3: {
    node_id: 3,
    id: 3,
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
    errorCode: 0,
    errCode: 0,
    lastUpdated: '--',
  },

  4: {
    node_id: 4,
    id: 4,
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
    errorCode: 0,
    errCode: 0,
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
  // MAP FIREBASE REALTIME RECORD TO SENSOR MODEL
  // ==========================================================

  mapFirebaseReading(data, nodeId) {
    if (!data || typeof data !== 'object') return null;

    const num = (v) => (v !== undefined && v !== null && !isNaN(Number(v)) ? Number(v) : undefined);
    const bool = (v) => v === true || v === 1 || v === '1';

    const rawId = num(data.ID) ?? nodeId;
    const at = num(data.AT);
    const ah = num(data.AH);
    const st = num(data.ST);
    const sm = num(data.SM);
    const ldr = num(data.LDR);
    const dl = num(data.DL);
    const et = num(data.ET);
    const bv = num(data.BV);
    const bp = num(data.BP);
    const sv = num(data.SV);
    const psi = num(data.PSI) ?? num(data.PS);
    const day = data.DAY !== undefined ? bool(data.DAY) : true;
    const irr = data.IRR !== undefined ? (num(data.IRR) === 1 || bool(data.IRR)) : false;
    const hs = data.HS !== undefined ? (num(data.HS) === 1 || bool(data.HS)) : false;
    const pir = data.PIR !== undefined ? (num(data.PIR) === 1 || bool(data.PIR)) : false;
    const errorCode = num(data.ERR) ?? 0;
    const sys = typeof data.SYS === 'string' ? data.SYS : 'OK';
    const mode = typeof data.MODE === 'string' ? data.MODE : 'NORMAL';
    const ss = typeof data.SS === 'string' ? data.SS : 'ACTIVE';

    // The website checks !reading.err to determine if telemetry data is available.
    // When a valid payload is received from Firebase (has valid telemetry fields),
    // err is FALSE because telemetry communication is active and alive.
    // Diagnostic hardware error codes (such as ERR: 3) are preserved in errorCode.
    const hasTelemetry = at !== undefined || ah !== undefined || st !== undefined || sm !== undefined || bv !== undefined;
    const isOffline = !hasTelemetry || sys === 'DISCONNECTED' || sys === 'OFFLINE';

    return {
      // Primary website identifiers & values
      node_id: rawId,
      id: rawId,
      at,
      ah,
      st,
      sm,
      ldr,
      day,
      dl,
      et,
      bv,
      bp,
      sv,
      ss,
      irr,
      hs,
      psi,
      ps: psi,
      sys,
      mode,
      pir,
      errorCode,
      errCode: errorCode,

      // Telemetry status flag: false when live packet is received
      err: isOffline,

      // Descriptive property aliases for compatibility
      airTemperature: at,
      airHumidity: ah,
      soilTemperature: st,
      soilMoisture: sm,
      lightLevel: ldr,
      isDay: day,
      daylightDuration: dl,
      evapotranspiration: et,
      batteryVoltage: bv,
      batteryPercentage: bp,
      batteryLevel: bp,
      solarVoltage: sv,
      solarStatus: ss,
      plantStress: psi,
      systemStatus: sys,
      operatingMode: mode,
      irrigation: irr,
      heatStress: hs,

      // Timestamp metadata
      lastUpdated: new Date().toLocaleTimeString(),
      timestamp: data.timestamp || (data.timestamp_ms ? new Date(data.timestamp_ms).toLocaleTimeString() : new Date().toLocaleTimeString()),
    };
  }


  // ==========================================================
  // FIREBASE REAL-TIME LISTENERS
  // ==========================================================

  startFirebaseListeners() {
    console.log('AgriSpike Firebase connection starting...');

    for (let nodeId = 1; nodeId <= 4; nodeId++) {
      // Primary path: AgriSpike/Node${nodeId}
      const primaryPath = `AgriSpike/Node${nodeId}`;
      const primaryRef = ref(database, primaryPath);

      const handleSnapshot = (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          console.warn(`No Firebase data found at ${primaryPath}`);
          this.readings[nodeId] = {
            node_id: nodeId,
            id: nodeId,
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
            sys: 'FAULT',
            mode: 'NORMAL',
            err: true,
            errorCode: 0,
            errCode: 0,
            lastUpdated: '--',
          };
          this.notify();
          return;
        }

        const mapped = this.mapFirebaseReading(data, nodeId);
        if (!mapped) return;

        this.readings[nodeId] = {
          ...this.readings[nodeId],
          ...mapped,
        };

        this.isLiveBackend = true;
        this.isLoading = false;
        this.notify();

        console.log(`Firebase live data received for Node${nodeId}:`, {
          AT: mapped.at,
          AH: mapped.ah,
          ST: mapped.st,
          SM: mapped.sm,
          BV: mapped.bv,
          BP: mapped.bp,
          SYS: mapped.sys,
          ERR: mapped.errorCode,
        });
      };

      const handleError = (error) => {
        console.error(`Firebase error for ${primaryPath}:`, error);
        this.firebaseError = error;
        this.notify();
      };

      const unsubPrimary = onValue(primaryRef, handleSnapshot, handleError);
      this.firebaseUnsubscribers.push(unsubPrimary);

      // Fallback listener for root Node${nodeId} in case master ESP32 writes to /Node${nodeId}
      const rootPath = `Node${nodeId}`;
      const rootRef = ref(database, rootPath);
      const unsubRoot = onValue(
        rootRef,
        (snapshot) => {
          if (snapshot.exists() && snapshot.val()) {
            handleSnapshot(snapshot);
          }
        },
        () => {
          // Silently ignore root path error if root path isn't used
        }
      );
      this.firebaseUnsubscribers.push(unsubRoot);
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
                : (zoneData.state !== undefined ? Number(zoneData.state) : 0);
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