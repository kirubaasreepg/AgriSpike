import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Sidebar({ isOpen, onClose }) {
  const { t } = useLanguage();

  const NAV_ITEMS = [
    { to: '/field', label: t('navMyField'), icon: '⛺' },
    { to: '/irrigation', label: t('navIrrigation'), icon: '💧' },
    { to: '/fertilizer', label: t('navFertilizer'), icon: '🌱' },
    { to: '/disease', label: t('navDisease'), icon: '🩺' },
    { to: '/crop', label: t('navCrop'), icon: '🌾' },
    { to: '/shop', label: t('navShop'), icon: '🛒' },
    { to: '/weather', label: t('navWeather'), icon: '⛅' },
    { to: '/news', label: t('navNews'), icon: '📰' },
    { to: '/support', label: t('navSupport'), icon: '☎' },
    { to: '/team', label: t('navTeam'), icon: '👥' },
    { to: '/settings', label: t('navSettings'), icon: '⚙️' },
  ];

  return (
    <aside style={{
      width: 250,
      background: 'var(--bg-panel)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 14px',
      flexShrink: 0,
      overflowY: 'auto',
      zIndex: 40,
    }}>
      {/* Brand Header */}
      <div style={{ padding: '4px 10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
          }}>
            Agri<span style={{ color: 'var(--accent)' }}>Spike</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2, fontWeight: 500 }}>
            Smart IoT Agriculture
          </div>
        </div>

        {onClose && (
          <button
            className="btn btn-sm"
            onClick={onClose}
            style={{ display: 'none' }}
            aria-label="Close menu"
          >
            ✕
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => onClose && onClose()}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              background: isActive ? 'var(--accent-light)' : 'transparent',
              border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
              transition: 'all 0.15s ease',
            })}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Field status indicator */}
      <div style={{
        marginTop: 'auto',
        paddingTop: 16,
        borderTop: '1px solid var(--border)',
        fontSize: 11,
        color: 'var(--text-faint)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }} />
        <span>SenseiSquad LoRa Mesh Active</span>
      </div>
    </aside>
  );
}
