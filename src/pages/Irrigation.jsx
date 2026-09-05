import React, { useState } from 'react';
import { useSensorData } from '../services/sensorDataService';
import { useLanguage } from '../context/LanguageContext';

export default function Irrigation() {
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
