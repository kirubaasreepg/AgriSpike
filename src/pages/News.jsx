import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const NEWS_ARTICLES = [
  {
    id: 1,
    category: 'AgriTech',
    title: 'AgriSpike Prototype Completes Field Trial with 4 LoRa Nodes Across Erode Farmlands',
    summary: 'The SenseiSquad deployed the ESP32 and RFM95-powered sensor mesh network across 4 hectares, achieving steady telemetry and autonomous solenoid switching.',
    date: 'September 2026',
    author: 'SenseiSquad Research',
  },
  {
    id: 2,
    category: 'Farming',
    title: 'Precision Soil Moisture Sensing Cuts Tamil Nadu Turmeric Irrigation Water by 32%',
    summary: 'Adoption of root-zone capacitance sensors coupled with automated drip lines prevented rhizome waterlogging while maintaining uniform rhizome bulk weight.',
    date: 'August 2026',
    author: 'TN Agricultural University',
  },
  {
    id: 3,
    category: 'Government Schemes',
    title: 'PM-KUSUM Solar Pump Subsidy Expanded to Integrate Smart Micro-Irrigation Actuators',
    summary: 'Farmers installing solar-powered brushless DC submersible pumps can now receive extended capital subsidies for IoT-enabled pressure sensors and solenoid valves.',
    date: 'August 2026',
    author: 'Ministry of Agriculture',
  },
  {
    id: 4,
    category: 'Technology',
    title: 'Low-Power LoRa Mesh Networks Bridge Rural Farmland Connectivity Without Cellular Data',
    summary: 'Long-range sub-GHz transceivers enable field-wide crop monitoring over 3+ kilometers, relaying soil moisture and temperature packets to solar base stations.',
    date: 'July 2026',
    author: 'IEEE CASS AgriTech Forum',
  },
  {
    id: 5,
    category: 'Weather',
    title: 'IMD Enhances High-Resolution Agromet Forecasts for Kongu Region Agro-Climatic Zones',
    summary: 'Automated weather stations provide block-level rainfall and relative humidity nowcasts, helping turmeric and paddy farmers optimize foliar spraying schedules.',
    date: 'July 2026',
    author: 'IMD Agromet Advisory',
  },
  {
    id: 6,
    category: 'Agriculture',
    title: 'Organic Soil Carbon Management & Potassium Nutrition Strengthen Drought Hardiness in Millets',
    summary: 'Agronomists highlight the synergy of farmyard compost, mulching, and targeted Muriate of Potash to enhance stomatal conductance during prolonged dry spells.',
    date: 'June 2026',
    author: 'Agronomy Today',
  },
];

export default function News() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'AgriTech', 'Farming', 'Government Schemes', 'Technology', 'Weather', 'Agriculture'];

  const filteredNews = selectedCategory === 'All'
    ? NEWS_ARTICLES
    : NEWS_ARTICLES.filter(n => n.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>
          {t('newsTitle')}
        </h1>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
          {t('newsSubtitle')}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : ''}`}
            onClick={() => setSelectedCategory(cat)}
            style={{ borderRadius: 'var(--radius-md)', padding: '6px 14px' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid-cols-2">
        {filteredNews.map(item => (
          <article
            key={item.id}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 22,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="badge badge-online" style={{ fontSize: 11 }}>
                  🏷️ {item.category}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                  📅 {item.date}
                </span>
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', lineHeight: 1.4, marginBottom: 8 }}>
                {item.title}
              </h3>

              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {item.summary}
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 18,
              paddingTop: 12,
              borderTop: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                Source: {item.author}
              </span>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => alert(`Full Article: ${item.title}\n\nPublished in ${item.date} by ${item.author}.`)}
              >
                {t('readMore')} →
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
