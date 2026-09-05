import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PandaMascot from '../components/PandaMascot';
import { ALLOWED_USERS, DEMO_PASSWORD } from '../constants/agriConfig';

export default function Login() {
  const navigate = useNavigate();
  const [lightOn, setLightOn] = useState(false);
  const [cordOffset, setCordOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const usernameInputRef = useRef(null);
  const startYRef = useRef(0);

  // Focus username input once the light turns on
  useEffect(() => {
    if (lightOn) {
      const timer = setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [lightOn]);

  // Pull Cord Interaction Handlers
  const toggleLight = () => {
    // Spring physics visual feedback
    setCordOffset(35);
    setTimeout(() => {
      setCordOffset(0);
      setLightOn(prev => !prev);
    }, 150);
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const diff = Math.max(0, Math.min(50, e.clientY - startYRef.current));
    setCordOffset(diff);
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (cordOffset > 18) {
      setLightOn(prev => !prev);
    }
    setCordOffset(0);
  };

  // Submit Handler
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser) {
      setError('Please enter your username.');
      return;
    }

    if (!cleanPass) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const matchedUser = ALLOWED_USERS.find(
        u => u.username.toLowerCase() === cleanUser && cleanPass === DEMO_PASSWORD
      );

      if (matchedUser) {
        setSuccess('Welcome to AgriSpike!');
        localStorage.setItem('agrispike_logged_in', 'true');
        localStorage.setItem('agrispike_username', matchedUser.displayName);
        localStorage.setItem('agrispike_user_id', matchedUser.username);

        setTimeout(() => {
          navigate('/field');
        }, 800);
      } else {
        setError('Invalid username or password. Please try again.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className={`darkroom-container ${lightOn ? 'light-on' : ''}`}>
      {/* Cinematic Overhead Light Cone */}
      <div className="light-beam" />

      {/* Ceiling Lamp Fixture */}
      <div className="ceiling-lamp-rig">
        <div className="lamp-cord" />
        <div className="lamp-bulb-holder" />
        <div className="lamp-bulb" />
      </div>

      {/* Pull Cord Assembly */}
      <div
        className="pull-cord-assembly"
        onClick={toggleLight}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        title={lightOn ? "Pull to turn off light" : "Pull to turn on light"}
        role="button"
        tabIndex={0}
        aria-label={lightOn ? "Turn light off" : "Turn light on"}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleLight();
          }
        }}
      >
        <div
          className="cord-string"
          style={{ height: `${120 + cordOffset}px` }}
        />
        <div
          className="cord-handle"
          style={{ transform: `translateY(${cordOffset}px)` }}
        >
          <div className="cord-handle-ring" />
        </div>

        {!lightOn && (
          <div className="cord-instruction">
            ⚡ Pull cord or click to turn on light
          </div>
        )}
      </div>

      {/* Main Login Stage */}
      <div className="login-stage">
        {/* Panda Character Illustration */}
        <PandaMascot awake={lightOn} />

        {/* Login Form Card - Genuinely INERT before light turns on */}
        <div
          className="login-form-card"
          inert={!lightOn ? "" : undefined}
          aria-hidden={!lightOn}
        >
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <h1 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}>
              Agri<span style={{ color: 'var(--accent)' }}>Spike</span>
            </h1>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc', marginTop: 4 }}>
              Welcome to AgriSpike
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              Smart Agriculture. Smarter Decisions.
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 14 }}>
              <label
                htmlFor="username"
                style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}
              >
                Username
              </label>
              <input
                ref={usernameInputRef}
                id="username"
                type="text"
                className="input-field"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                disabled={!lightOn}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label
                htmlFor="password"
                style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input-field"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={!lightOn}
              />
            </div>

            {error && (
              <div
                role="alert"
                style={{
                  background: 'rgba(220, 38, 38, 0.15)',
                  border: '1px solid rgba(220, 38, 38, 0.4)',
                  color: '#fca5a5',
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  marginBottom: 16,
                  textAlign: 'center',
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                style={{
                  background: 'rgba(22, 163, 74, 0.15)',
                  border: '1px solid rgba(22, 163, 74, 0.4)',
                  color: '#86efac',
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  marginBottom: 16,
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                {success}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: 15, fontWeight: 600 }}
              disabled={loading || !lightOn}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
