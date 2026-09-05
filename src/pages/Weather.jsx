import React, { useState, useEffect } from 'react';
import { fetchLiveWeatherData, getDemoWeatherData } from '../services/weatherService';
import { useLanguage } from '../context/LanguageContext';

export default function Weather() {
  const { t } = useLanguage();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadWeather = async (fallback = false) => {
    setLoading(true);
    setErrorMsg('');

    if (fallback) {
      setWeather(getDemoWeatherData());
      setLoading(false);
      return;
    }

    const res = await fetchLiveWeatherData();
    if (res.success) {
      setWeather(res);
    } else {
      setErrorMsg(res.error);
      setWeather(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWeather(useFallback);
  }, [useFallback]);

  return (
    <div className="weather-page" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>
            {t('weatherTitle')}
          </h1>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            {t('weatherSubtitle')}
          </div>
        </div>

        {/* Development Fallback Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            className={`btn btn-sm ${useFallback ? 'btn-primary' : ''}`}
            onClick={() => setUseFallback(!useFallback)}
          >
            {useFallback ? 'Using Demo Data' : 'Live Data Mode'}
          </button>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => loadWeather(useFallback)}
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Weather Source & Observation Status Banner */}
      {weather && (
        <div className={`card ${weather.isDemo ? 'weather-banner-demo' : 'weather-banner-live'}`} style={{
          padding: '12px 20px',
          background: weather.isDemo ? 'var(--color-warning-bg)' : 'var(--color-online-bg)',
          color: weather.isDemo ? 'var(--color-warning)' : 'var(--color-online)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>{weather.isDemo ? '⚠️' : '📡'}</span>
            <div>
              <strong style={{ fontSize: 14 }}>
                {weather.isDemo ? t('devFallbackLabel') : t('weatherLiveSuccess')}
              </strong>
              <div style={{ fontSize: 11, opacity: 0.85 }}>
                {t('imdSource')}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 12, fontWeight: 600 }}>
            {t('lastUpdated')}: {weather.observationTime}
          </div>
        </div>
      )}

      {/* Error Banner when live data cannot be retrieved */}
      {errorMsg && !useFallback && (
        <div className="card weather-banner-error" style={{
          background: 'var(--color-fault-bg)',
          color: 'var(--color-fault)',
          padding: 20,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌐</div>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>
            {t('weatherUnavailable')}
          </h3>
          <p style={{ fontSize: 13, marginTop: 4, opacity: 0.85 }}>
            The application is operating on a local-first network. You can activate Demo/Fallback Weather mode above for development and testing.
          </p>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => setUseFallback(true)}
            style={{ marginTop: 14 }}
          >
            {t('toggleFallback')}
          </button>
        </div>
      )}

      {/* Current Conditions Metrics */}
      {weather && (
        <>
          <div className="grid-cols-4">
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 42 }}>{weather.icon || '☀️'}</div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>Temperature</div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{weather.temperature}°C</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{weather.condition}</div>
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t('airHumidity')}</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>{weather.humidity}%</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Relative Humidity</div>
            </div>

            <div className="card">
              <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t('windSpeed')}</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>{weather.windSpeed}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Surface Wind</div>
            </div>

            <div className="card">
              <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t('rainfall')}</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>{weather.rainfall}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Past 24h Precipitation</div>
            </div>
          </div>

          {/* 5-Day Forecast Grid */}
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
              {t('forecast5Day')}
            </h3>

            <div className="grid-cols-4" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
              {weather.forecast.map((day, idx) => (
                <div key={idx} className="card" style={{ textAlign: 'center', padding: 18 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{day.day}</div>
                  <div style={{ fontSize: 36, margin: '10px 0' }}>{day.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>
                    {day.high}° <span style={{ fontSize: 13, color: 'var(--text-faint)', fontWeight: 400 }}>/ {day.low}°</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                    {day.condition}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {loading && !weather && (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
          Contacting India Meteorological Department observation network...
        </div>
      )}
    </div>
  );
}
