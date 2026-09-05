import { Link } from 'react-router-dom';
import { useReadings } from '../useReadings';

function statusFor(r) {
  if (!r) return 'fault';
  if (r.err || r.sys === 'FAULT') return 'fault';
  if (r.sys === 'ATTENTION' || r.hs || r.irr) return 'warn';
  return 'ok';
}

function suggestionFor(node, r) {
  if (!r) return null;
  if (r.err || r.sys === 'FAULT') return `${node.name}: sensor fault detected — check wiring/power.`;
  if (r.bp !== undefined && r.bp < 45) return `${node.name}: battery at ${r.bp}% — check solar charging.`;
  if (r.irr) return `${node.name}: soil is dry — irrigation recommended.`;
  if (r.hs) return `${node.name}: heat stress risk — monitor closely today.`;
  return null;
}

export default function Home() {
  const { readings, nodes, live } = useReadings();
  const suggestions = nodes.map(n => suggestionFor(n, readings[n.id])).filter(Boolean);
  const faultCount = nodes.filter(n => statusFor(readings[n.id]) === 'fault').length;
  const warnCount = nodes.filter(n => statusFor(readings[n.id]) === 'warn').length;

  const overall = faultCount > 0 ? 'fault' : warnCount > 0 ? 'warn' : 'ok';
  const overallText = faultCount > 0
    ? `${faultCount} node${faultCount > 1 ? 's' : ''} need attention`
    : warnCount > 0
      ? `${warnCount} node${warnCount > 1 ? 's' : ''} flagged for review`
      : 'All sensors working normally';

  return (
    <div>
      <div className="card" style={{ marginBottom: 20, borderColor: overall === 'fault' ? 'var(--fault)' : overall === 'warn' ? 'var(--warn)' : 'var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={`pulse-dot`} style={{ color: overall === 'fault' ? 'var(--fault)' : overall === 'warn' ? 'var(--warn)' : 'var(--accent)' }} />
            <h3>{overallText}</h3>
          </div>
          <span className="pill" style={{ color: 'var(--text-faint)', background: 'transparent' }}>
            {live ? 'LIVE DATA' : 'DEMO DATA'}
          </span>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: suggestions.length ? 18 : 0 }}>
          {nodes.map(n => {
            const r = readings[n.id];
            const s = statusFor(r);
            return (
              <Link key={n.id} to={`/field/node/${n.id}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 6 }}>{n.name}</div>
                <span className={`pill ${s}`}>{s === 'ok' ? 'Normal' : s === 'warn' ? 'Warning' : 'Fault'}</span>
              </Link>
            );
          })}
        </div>

        {suggestions.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Suggestions
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {suggestions.map((s, i) => <li key={i} style={{ fontSize: 14, color: 'var(--text-dim)' }}>{s}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <Link to="/field" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h4 style={{ marginBottom: 6 }}>🗺 My Field</h4>
          <div style={{ fontSize: 13, color: 'var(--text-faint)' }}>View live node locations on your field map</div>
        </Link>
        <Link to="/irrigation" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h4 style={{ marginBottom: 6 }}>💧 Irrigation</h4>
          <div style={{ fontSize: 13, color: 'var(--text-faint)' }}>Control all solenoids across your field</div>
        </Link>
        <Link to="/fertilizer" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h4 style={{ marginBottom: 6 }}>🌱 Fertilizer Suggestion</h4>
          <div style={{ fontSize: 13, color: 'var(--text-faint)' }}>Get zone-specific fertilizer guidance</div>
        </Link>
      </div>
    </div>
  );
}
