import React, { useState, useRef, useEffect } from 'react';
import { aiSupportService } from '../services/aiSupportService';
import { useLanguage } from '../context/LanguageContext';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Hi! Ask me anything about your field, irrigation, crops, or AgriSpike.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (open) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  async function send() {
    const userText = input.trim();
    if (!userText || isTyping) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { from: 'user', text: userText, timestamp: time }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await aiSupportService.processQuery(userText, 1);
      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text: response.text,
          escalated: response.escalated,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text: 'AI support is temporarily unavailable. Please check your network and try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 60 }}>
      {open && (
        <div className="card" style={{
          width: 360,
          maxWidth: 'calc(100vw - 48px)',
          height: 460,
          display: 'flex',
          flexDirection: 'column',
          marginBottom: 12,
          padding: 0,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border)',
          background: 'var(--bg-panel)',
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 18px',
            background: 'var(--accent)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>🌱</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>AgriSpike AI Support</div>
                <div style={{ fontSize: 11, opacity: 0.9 }}>Ground truth field guidance</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: 18, cursor: 'pointer' }}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages body */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            background: 'var(--bg)',
          }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
                  background: m.from === 'user' ? 'var(--accent)' : 'var(--bg-panel)',
                  color: m.from === 'user' ? '#ffffff' : 'var(--text)',
                  padding: '10px 14px',
                  borderRadius: 14,
                  fontSize: 13,
                  lineHeight: 1.45,
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
                  marginTop: 4,
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
                padding: '8px 12px',
                borderRadius: 12,
                fontSize: 12,
                border: '1px solid var(--border)',
              }}>
                Analyzing field data...
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input bar */}
          <div style={{
            display: 'flex',
            gap: 8,
            padding: 12,
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-panel)',
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={t('chatPlaceholder')}
              className="input-field"
              style={{ flex: 1, padding: '8px 12px', fontSize: 13 }}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={send}
              disabled={isTyping || !input.trim()}
            >
              {t('send')}
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="btn-primary"
        style={{
          width: 54,
          height: 54,
          borderRadius: '50%',
          border: 'none',
          fontSize: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          float: 'right',
        }}
        aria-label="Open support chat"
      >
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
}
