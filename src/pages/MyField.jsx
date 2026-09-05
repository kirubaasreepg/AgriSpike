import React from 'react';
import { useNavigate } from 'react-router-dom';
import InteractiveMap from '../components/InteractiveMap';
import { useSensorData } from '../services/sensorDataService';
import { useLanguage } from '../context/LanguageContext';
import { FIELD_CONFIG } from '../constants/agriConfig';

export default function MyField() {
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
