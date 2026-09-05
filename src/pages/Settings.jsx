import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const rawUser = localStorage.getItem('agrispike_username') || 'Farmer';
  const userName = rawUser.charAt(0).toUpperCase() + rawUser.slice(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>
          {t('settingsTitle')}
        </h1>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
          Configure application preferences, interface language, and local network settings.
        </div>
      </div>

      {/* Appearance Section */}
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
          🎨 {t('appearance')}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Theme */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t('theme')}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Choose between Light (clean white) and Dark (deep night) modes.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : ''}`}
                onClick={() => setTheme('light')}
              >
                ☀️ {t('themeLight')}
              </button>
              <button
                type="button"
                className={`btn btn-sm ${theme === 'dark' ? 'btn-primary' : ''}`}
                onClick={() => setTheme('dark')}
              >
                🌙 {t('themeDark')}
              </button>
            </div>
          </div>

          {/* Language */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t('language')}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Select interface language (English or Tamil exclusively).
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className={`btn btn-sm ${language === 'en' ? 'btn-primary' : ''}`}
                onClick={() => setLanguage('en')}
              >
                🇬🇧 English
              </button>
              <button
                type="button"
                className={`btn btn-sm ${language === 'ta' ? 'btn-primary' : ''}`}
                onClick={() => setLanguage('ta')}
              >
                🇮🇳 தமிழ் (Tamil)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
          👤 {t('account')}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t('loggedInAs')}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)', marginTop: 2 }}>
              {userName}
            </div>
          </div>

          <div className="badge badge-online">
            Authenticated Team Session
          </div>
        </div>
      </div>

      {/* Local Network / ESP32 Wi-Fi Information Section */}
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
          📶 {t('networkInfo')}
        </h3>

        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          <p style={{ marginBottom: 10 }}>
            AgriSpike is configured to bind to <strong>0.0.0.0:3000</strong>. When your host laptop is connected to an ESP32 Access Point or local farm Wi-Fi:
          </p>
          <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Open command prompt on this host machine and run <code>ipconfig</code>.</li>
            <li>Note your Wi-Fi IPv4 address (e.g. <code>192.168.4.2</code> or <code>192.168.1.50</code>).</li>
            <li>Connect any phone, tablet, or secondary laptop to the same ESP32 Wi-Fi network.</li>
            <li>In the browser on that device, navigate to: <code>http://&lt;your-ip&gt;:3000</code>.</li>
            <li>All local dashboard features, telemetry, irrigation toggles, and offline guides will function seamlessly.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
