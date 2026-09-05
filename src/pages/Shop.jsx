import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const PRODUCTS = [
  {
    id: 1,
    name: 'Muriate of Potash (MOP - 60% K2O)',
    type: 'Potash Fertilizer / Drought Resistance',
    suitableFor: 'Turmeric, Banana, Paddy (Drought & Moisture Stress zones)',
    supplier: 'IFFCO Bazar Online',
    url: 'https://www.iffcobazar.in',
    isOnline: true,
  },
  {
    id: 2,
    name: 'Water-Soluble NPK (19:19:19 Foliar Grade)',
    type: 'Balanced Macro-Nutrients',
    suitableFor: 'High heat stress recovery, fast foliar absorption',
    supplier: 'BigHaat Agri-Portal',
    url: 'https://www.bighaat.com',
    isOnline: true,
  },
  {
    id: 3,
    name: 'Neem-Coated Slow Release Urea (46% N)',
    type: 'Controlled Nitrogen Soil Conditioner',
    suitableFor: 'Paddy & Turmeric in high moisture / rainy periods',
    supplier: 'AgriBegri Farmers Platform',
    url: 'https://agribegri.com',
    isOnline: true,
  },
  {
    id: 4,
    name: 'Trichoderma Viride Bio-Fungicide (1% WP)',
    type: 'Biological Fungicide & Root Rot Cure',
    suitableFor: 'Turmeric Rhizome Rot, Paddy Blast, Panama Wilt Prevention',
    supplier: 'District Agro Input Center',
    url: null,
    isOnline: false,
    address: 'Available at Taluk Agricultural Extension Outlets & PACCS',
  },
  {
    id: 5,
    name: 'Subsidized Complex Fertilizers (DAP / Potash)',
    type: 'Government-Subsidized Nutrient Sacks',
    suitableFor: 'Registered Patta / Smallholder Farmers',
    supplier: 'Primary Agricultural Cooperative Credit Society (PACCS)',
    url: null,
    isOnline: false,
    address: 'Local Village Cooperative Store (Requires Aadhaar / Farmer ID)',
  },
  {
    id: 6,
    name: 'Chelated Micronutrient Spray (Fe, Zn, B, Mn)',
    type: 'Essential Secondary Trace Elements',
    suitableFor: 'Yellowing foliage, vegetative stunting, chlorosis',
    supplier: 'Private Agri Retail Outlets (Kongu Region)',
    url: null,
    isOnline: false,
    address: 'Regional Fertilizer & Pesticide Dealerships',
  },
];

export default function Shop() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? PRODUCTS
    : filter === 'online'
      ? PRODUCTS.filter(p => p.isOnline)
      : PRODUCTS.filter(p => !p.isOnline);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>
          {t('shopTitle')}
        </h1>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
          {t('shopSubtitle')}
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Outlets ({PRODUCTS.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${filter === 'online' ? 'btn-primary' : ''}`}
          onClick={() => setFilter('online')}
        >
          Online Delivery Portals
        </button>
        <button
          type="button"
          className={`btn btn-sm ${filter === 'offline' ? 'btn-primary' : ''}`}
          onClick={() => setFilter('offline')}
        >
          Local Cooperative & Retail Stores
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid-cols-3">
        {filtered.map(p => (
          <div
            key={p.id}
            className="card"
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 20 }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className={`badge ${p.isOnline ? 'badge-online' : 'badge-warning'}`} style={{ fontSize: 11 }}>
                  {p.isOnline ? '🌐 Direct Order' : '🏪 In-Store Pickup'}
                </span>
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
                {p.name}
              </h3>

              <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, marginBottom: 6 }}>
                {p.type}
              </div>

              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text)' }}>{t('suitableFor')}: </strong>
                {p.suitableFor}
              </div>

              <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                Supplier: <strong>{p.supplier}</strong>
                {p.address && <div style={{ marginTop: 2 }}>📍 {p.address}</div>}
              </div>
            </div>

            <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary"
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  ↗️ {t('visitSupplier')} ({p.supplier.split(' ')[0]})
                </a>
              ) : (
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => alert(`Locate store for: ${p.name}\n\n${p.address}`)}
                >
                  📍 View Store Locations
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
