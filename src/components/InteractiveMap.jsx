import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FIELD_CONFIG, SENSOR_NODES } from '../constants/agriConfig';
import { useLanguage } from '../context/LanguageContext';

export default function InteractiveMap({ readings = {}, onNodeClick }) {
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
