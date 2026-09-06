import React from 'react';
import { TEAM_MEMBERS } from '../constants/agriConfig';
import { useLanguage } from '../context/LanguageContext';

export default function Team() {
  const { t } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>
          {t('teamTitle')}
        </h1>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
          {t('teamSubtitle')} · Team SenseiSquad
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid-cols-3">
        {TEAM_MEMBERS.map(member => (
          <div
            key={member.name}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 24,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'var(--accent-light)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 16,
                  border: '1px solid var(--accent)',
                }}>
                  {member.name.charAt(0)}
                </div>

                {member.supportRecipient && (
                  <span className="badge badge-online" style={{ fontSize: 11 }}>
                    Escalation Contact
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
                {member.name}
              </h3>

              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', marginBottom: 8 }}>
                {member.role}
              </div>
            </div>

            <div style={{
              paddingTop: 14,
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>Phone</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                  +91 {member.phone}
                </div>
              </div>

              <a
                href={`tel:${member.phone}`}
                className="btn btn-sm"
                title={`Call ${member.name}`}
              >
                📞 Call
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
