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
