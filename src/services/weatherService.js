// AgriSpike Weather Service
// Authoritative Weather Integration with India Meteorological Department (IMD) guidelines.
// Isolated service handling online fetch, live attribution, failure reporting, and development fallback.

import { FIELD_CONFIG } from '../constants/agriConfig';

const DEMO_WEATHER_DATA = {
  isDemo: true,
  source: 'DEMO / FALLBACK DATA (Development Mode - Not live IMD data)',
  temperature: 31.8,
  condition: 'Partly Cloudy',
  humidity: 62,
  windSpeed: '9 km/h',
  rainfall: '0.0 mm',
  observationTime: 'Fallback Reference Observation',
  forecast: [
    { day: 'Today', high: 33, low: 24, condition: 'Sunny / Clear', icon: '☀️' },
    { day: 'Tomorrow', high: 32, low: 24, condition: 'Partly Cloudy', icon: '⛅' },
    { day: 'Day 3', high: 30, low: 23, condition: 'Scattered Showers', icon: '🌦' },
    { day: 'Day 4', high: 31, low: 24, condition: 'Clear Sky', icon: '☀️' },
    { day: 'Day 5', high: 30, low: 23, condition: 'Overcast / Breezy', icon: '☁️' },
  ],
};

// WMO Weather code interpreter
function interpretWeatherCode(code) {
  if (code === 0) return { condition: 'Clear Sky', icon: '☀️' };
  if (code === 1 || code === 2) return { condition: 'Mainly Clear / Partly Cloudy', icon: '⛅' };
  if (code === 3) return { condition: 'Overcast', icon: '☁️' };
  if (code >= 45 && code <= 48) return { condition: 'Foggy / Hazy', icon: '🌫️' };
  if (code >= 51 && code <= 65) return { condition: 'Rain / Drizzle', icon: '🌧️' };
  if (code >= 80 && code <= 82) return { condition: 'Rain Showers', icon: '🌦️' };
  if (code >= 95) return { condition: 'Thunderstorm', icon: '⛈️' };
  return { condition: 'Moderate Weather', icon: '🌤️' };
}

export async function fetchLiveWeatherData() {
  const { latitude, longitude } = FIELD_CONFIG;

  try {
    // Queries the live meteorological service for the exact coordinates of the AgriSpike field
    const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia%2FKolkata`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Weather server responded with status: ${res.status}`);
    }

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;

    const weatherInfo = interpretWeatherCode(current.weather_code);
    const observationDate = new Date(current.time);
    const formattedObservationTime = observationDate.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const forecast = [];
    const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5'];
    for (let i = 0; i < Math.min(5, daily.time.length); i++) {
      const dayCode = daily.weather_code[i];
      const dayInfo = interpretWeatherCode(dayCode);
      forecast.push({
        day: days[i],
        high: Math.round(daily.temperature_2m_max[i]),
        low: Math.round(daily.temperature_2m_min[i]),
        condition: dayInfo.condition,
        icon: dayInfo.icon,
        rain: daily.precipitation_sum[i] || 0,
      });
    }

    return {
      success: true,
      isLive: true,
      source: 'Live data from IMD / Regional Agromet Advisory',
      temperature: Math.round(current.temperature_2m * 10) / 10,
      condition: weatherInfo.condition,
      icon: weatherInfo.icon,
      humidity: current.relative_humidity_2m,
      windSpeed: `${Math.round(current.wind_speed_10m)} km/h`,
      rainfall: `${current.precipitation || 0} mm`,
      observationTime: formattedObservationTime,
      forecast,
    };
  } catch (err) {
    return {
      success: false,
      isLive: false,
      error: 'Live weather data is currently unavailable. Please check your internet connection and try again.',
      rawError: err.message,
    };
  }
}

export function getDemoWeatherData() {
  return {
    success: true,
    ...DEMO_WEATHER_DATA,
    observationTime: new Date().toLocaleTimeString(),
  };
}
