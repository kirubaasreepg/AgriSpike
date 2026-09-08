import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSensorData } from '../services/sensorDataService';
import { useLanguage } from '../context/LanguageContext';

export default function NodeDetail() {
  const { nodeId } = useParams();
  const { nodes, readings, solenoids, toggleIrrigation, getNodeStatus } = useSensorData();
  const { t } = useLanguage();

  const id = Number(nodeId) || 1;
  const node = nodes.find(n => n.id === id) || nodes[0];
  const r = readings[node.id];
  const status = getNodeStatus(node.id);
  const isSolenoidOn = solenoids[node.id];

  const FIELDS = [
    { key: 'sm', label: t('soilMoisture'), unit: '%', value: r?.sm, opt: '40 - 70%' },
    { key: 'st', label: t('soilTemp'), unit: '°C', value: r?.st, opt: '20 - 30°C' },
    { key: 'at', label: t('airTemp'), unit: '°C', value: r?.at, opt: '24 - 34°C' },
    { key: 'ah', label: t('airHumidity'), unit: '%', value: r?.ah, opt: '50 - 75%' },
    { key: 'ldr', label: t('lightLevel'), unit: '%', value: r?.ldr, opt: 'Full Sun' },
    { key: 'dl', label: t('daylightDuration'), unit: 'hrs', value: r?.dl, opt: '10 - 12 hrs' },
    { key: 'et', label: t('evapotranspiration'), unit: '', value: r?.et, opt: '30 - 60' },
    { key: 'bv', label: t('batteryVoltage'), unit: 'V', value: r?.bv, opt: '3.7 - 4.2V' },
    { key: 'bp', label: t('batteryLevel'), unit: '%', value: r?.bp, opt: '> 30%' },
    { key: 'sv', label: t('solarVoltage'), unit: 'V', value: r?.sv, opt: '5.0 - 6.0V' },
    { key: 'psi', label: t('plantStress'), unit: '/100', value: r?.psi, opt: '< 40' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/field" className="btn btn-sm">
              ← {t('navMyField')}
            </Link>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>
              {node.name}
            </h1>
            <span className={`badge badge-${status}`}>
              {status === 'online' ? t('statusOnline') : status === 'warning' ? t('statusWarning') : t('statusFault')}
            </span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-faint)', marginTop: 4 }}>
            GPS Coordinates: {node.dms} · Zone: {node.zone}
          </div>
        </div>

        {/* Actuator Quick Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t('irrigationStatus')}</div>
            <div style={{ fontWeight: 700, color: isSolenoidOn ? 'var(--accent)' : 'var(--text-muted)' }}>
              {isSolenoidOn ? t('active') : t('inactive')}
            </div>
          </div>
          <button
            type="button"
            className={`btn ${isSolenoidOn ? 'btn-danger' : 'btn-primary'}`}
            onClick={() => toggleIrrigation(node.id)}
          >
            {isSolenoidOn ? t('turnOff') : t('turnOn')}
          </button>
        </div>
      </div>

      {/* Node Switcher Tabs */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {nodes.map(n => (
          <Link
            key={n.id}
            to={`/field/node/${n.id}`}
            className={`btn btn-sm ${n.id === node.id ? 'btn-primary' : ''}`}
            style={{ padding: '6px 14px' }}
          >
            {n.name.split('—')[0].trim()}
          </Link>
        ))}
      </div>

      {/* Telemetry Metrics Grid */}
      {r && !r.err ? (
        <div className="grid-cols-4">
          {FIELDS.map(f => (
            <div key={f.key} className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 600 }}>
                {f.label}
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6, color: 'var(--text)' }}>
                {f.value !== undefined ? `${f.value} ${f.unit}` : '--'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                Recommended: {f.opt}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{
          background: 'var(--color-fault-bg)',
          color: 'var(--color-fault)',
          padding: 24,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>Telemetry Connection Lost</h3>
          <p style={{ fontSize: 14, marginTop: 4 }}>
            {node.name} is not responding to LoRa polling requests. Check the solar charging circuit and SPI wiring between ESP32 and RFM95.
          </p>
        </div>
      )}
    </div>
  );
}
