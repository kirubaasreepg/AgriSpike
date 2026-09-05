import React, { useState, useRef, useEffect } from 'react';
import { aiSupportService } from '../services/aiSupportService';
import { useSensorData } from '../services/sensorDataService';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORT_CONFIG, TEAM_MEMBERS } from '../constants/agriConfig';

export default function Support() {
  const { nodes } = useSensorData();
  const { t } = useLanguage();

  const [activeNodeId, setActiveNodeId] = useState(1);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Hi! Ask me anything about your field, irrigation, crops, or AgriSpike.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tickets, setTickets] = useState(aiSupportService.getTickets());
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e) {
    e?.preventDefault();
    const query = input.trim();
    if (!query || isTyping) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { from: 'user', text: query, timestamp: time }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await aiSupportService.processQuery(query, activeNodeId);
      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text: response.text,
          escalated: response.escalated,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setTickets(aiSupportService.getTickets());
    } catch {
      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text: 'AI support is temporarily unavailable. Please try again later.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>
          {t('supportTitle')}
        </h1>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
          {t('supportSubtitle')}
        </div>
      </div>

      <div className="grid-cols-3" style={{ alignItems: 'start' }}>
        {/* Left Column: Contact Directory & Escalation Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Direct Support Contacts */}
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
              📞 {t('supportPhoneLabel')}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>Phone Helpline</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>
                  {SUPPORT_CONFIG.phone}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Direct farmer line</div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{t('supportWebsiteLabel')}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                  {SUPPORT_CONFIG.website}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>Support Email</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                  {SUPPORT_CONFIG.email}
                </div>
              </div>
            </div>
          </div>

          {/* Context Selector: Which node are you asking about? */}
          <div className="card">
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
              🎯 Field Context Anchor
            </h4>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
              AI analyzes telemetry for the selected zone:
            </div>
            <select
              value={activeNodeId}
              onChange={e => setActiveNodeId(Number(e.target.value))}
              className="input-field"
              style={{ fontSize: 13 }}
            >
              {nodes.map(n => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>

          {/* Logged Support Tickets */}
          {tickets.length > 0 && (
            <div className="card" style={{ border: '1px solid var(--accent)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: 'var(--accent)' }}>
                📋 Escalated Team Tickets ({tickets.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tickets.map(tkt => (
                  <div
                    key={tkt.id}
                    style={{
                      background: 'var(--bg)',
                      padding: 10,
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 12,
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: 'var(--text)' }}>
                      #{tkt.id} · Assigned to {tkt.assignedTo}
                    </div>
                    <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>
                      Query: "{tkt.query.slice(0, 45)}..."
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 4 }}>
                      ✓ {tkt.status} ({tkt.timestamp})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 2 Columns: Conversational AI Support Terminal */}
        <div className="card" style={{
          gridColumn: 'span 2',
          height: 600,
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
        }}>
          {/* Chat Top Banner */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-panel)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>🤖</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>AgriSpike Conversational Advisory</div>
                <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>
                  ● Grounded in Live Sensor Telemetry
                </div>
              </div>
            </div>
          </div>

          {/* Message Stream */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            background: 'var(--bg)',
          }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
                  background: m.from === 'user' ? 'var(--accent)' : 'var(--bg-panel)',
                  color: m.from === 'user' ? '#ffffff' : 'var(--text)',
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 14,
                  lineHeight: 1.55,
                  maxWidth: '85%',
                  border: m.from === 'user' ? 'none' : '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  whiteSpace: 'pre-line',
                }}
              >
                {m.text}
                <div style={{
                  fontSize: 10,
                  opacity: 0.7,
                  marginTop: 6,
                  textAlign: m.from === 'user' ? 'right' : 'left',
                }}>
                  {m.timestamp}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{
                alignSelf: 'flex-start',
                background: 'var(--bg-panel)',
                color: 'var(--text-faint)',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: 13,
                border: '1px solid var(--border)',
              }}>
                Analyzing field telemetry and generating agronomic solution...
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSend}
            style={{
              padding: 16,
              borderTop: '1px solid var(--border)',
              background: 'var(--bg-panel)',
              display: 'flex',
              gap: 10,
            }}
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t('chatPlaceholder')}
              className="input-field"
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isTyping || !input.trim()}
              style={{ padding: '0 24px' }}
            >
              {t('send')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
