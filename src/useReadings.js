import { useEffect, useState } from 'react';
import { API_BASE } from './config';
import { NODES, DEMO_READINGS } from './demoData';

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
