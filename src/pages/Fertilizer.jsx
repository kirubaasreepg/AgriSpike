import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSensorData } from '../services/sensorDataService';
import { useLanguage } from '../context/LanguageContext';

export default function Fertilizer() {
  const { nodes, readings, getFertilizerRecommendation } = useSensorData();
  const { t } = useLanguage();

  const [selectedNodeId, setSelectedNodeId] = useState(1);
  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const r = readings[activeNode.id];
  const recommendation = getFertilizerRecommendation(activeNode.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>
            {t('fertilizerTitle')}
          </h1>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            {t('fertilizerSubtitle')}
          </div>
        </div>

        <Link to="/shop" className="btn btn-primary">
          🛒 {t('viewShop')}
        </Link>
      </div>

      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
        {t('fertilizerDesc')}
      </div>

      {/* Node Selector Tabs */}
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

      {/* Live Soil & Environmental Telemetry for Selected Node */}
      {r && !r.err ? (
        <div className="grid-cols-4">
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t('soilMoisture')}</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, color: r.sm < 35 ? 'var(--color-warning)' : 'var(--accent)' }}>
              {r.sm}%
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Optimum: 40 - 70%</div>
          </div>

          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t('soilTemp')}</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>
              {r.st}°C
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Soil Root Zone</div>
          </div>

          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t('airTemp')} & {t('airHumidity')}</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>
              {r.at}°C · {r.ah}%
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ambient Climate</div>
          </div>

          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t('plantStress')}</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, color: r.psi > 50 ? 'var(--color-warning)' : 'var(--accent)' }}>
              {r.psi}/100
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.psi > 50 ? 'Stress Warning' : 'Normal Metabolism'}</div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ color: 'var(--color-fault)' }}>
          Telemetry offline for {activeNode.name}.
        </div>
      )}

      {/* Main Agronomic Recommendation Card */}
      <div className="card" style={{ padding: 24, border: '1px solid var(--accent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="badge badge-online">
            ✨ {recommendation.type || 'Custom Formulation'}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
            Grounded in {activeNode.name} readings
          </span>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--text-faint)', fontWeight: 600 }}>
            {t('recommendedFertilizer')}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)', marginTop: 4 }}>
            {recommendation.fertilizer}
          </div>
        </div>

        <div style={{
          background: 'var(--bg)',
          padding: 16,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: 'var(--text)' }}>
            💡 {t('whyThisFertilizer')}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {recommendation.reason}
          </p>
        </div>

        <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
          <Link to="/shop" className="btn btn-primary">
            🛒 {t('viewShop')}
          </Link>
          <Link to={`/field/node/${activeNode.id}`} className="btn">
            {t('viewDetails')}
          </Link>
        </div>
      </div>
    </div>
  );
}
