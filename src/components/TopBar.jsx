import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function TopBar({ onOpenMobileMenu }) {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Retrieve logged-in user name
  const rawUser = localStorage.getItem('agrispike_username') || 'Farmer';
  const userName = rawUser.charAt(0).toUpperCase() + rawUser.slice(1);

  function handleLogout() {
    localStorage.removeItem('agrispike_logged_in');
    localStorage.removeItem('agrispike_username');
    localStorage.removeItem('agrispike_user_id');
    navigate('/login');
  }

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 28px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-panel)',
      zIndex: 10,
      gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Mobile menu trigger */}
        <button
          className="btn btn-sm"
          onClick={onOpenMobileMenu}
          style={{ display: 'none' }}
          id="mobile-menu-btn"
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
            {t('welcomeUser')}, {userName} 👋
          </h2>
          <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>
            {t('fieldStatusSummary')}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Language selector: English & Tamil ONLY */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>🌐</span>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="input-field"
            style={{ width: 'auto', padding: '6px 10px', fontSize: 13, borderRadius: 'var(--radius-md)' }}
            aria-label={t('langSelector')}
          >
            <option value="en">English</option>
            <option value="ta">தமிழ் (Tamil)</option>
          </select>
        </div>

        {/* Theme toggle: Light / Dark */}
        <button
          className="btn btn-sm"
          onClick={toggleTheme}
          title={theme === 'light' ? t('themeDark') : t('themeLight')}
          aria-label={theme === 'light' ? t('themeDark') : t('themeLight')}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span>{theme === 'light' ? '🌙' : '☀️'}</span>
          <span style={{ fontSize: 12 }}>{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>

        {/* Logout */}
        <button
          className="btn btn-sm"
          onClick={handleLogout}
          style={{ color: 'var(--color-fault)' }}
        >
          {t('logout')}
        </button>
      </div>
    </header>
  );
}
