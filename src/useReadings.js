import { useSensorData } from './services/sensorDataService';

// Wraps useSensorData to provide unified live Firebase readings
// to any components expecting { readings, nodes, live }
export function useReadings() {
  const { readings, nodes, isLiveBackend } = useSensorData();
  return { readings, nodes, live: isLiveBackend };
}
