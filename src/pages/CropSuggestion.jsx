import React, { useState } from 'react';
import { useSensorData } from '../services/sensorDataService';
import { useLanguage } from '../context/LanguageContext';

export default function CropSuggestion() {
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
