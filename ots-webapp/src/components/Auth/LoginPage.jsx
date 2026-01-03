import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const LoginPage = () => {
  const { login, isLoading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
  }

  const demoAccounts = [
    { email: 'admin@bluewud.com', password: 'admin123', role: 'Admin' },
    { email: 'manager@bluewud.com', password: 'manager123', role: 'Manager' },
    { email: 'operator@bluewud.com', password: 'operator123', role: 'Operator' },
  ]

  const fillDemo = (account) => {
    setEmail(account.email)
    setPassword(account.password)
  }

  return (
    <div
      className="login-page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)',
        padding: '20px',
      }}
    >
      {/* Animated background elements */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
            animation: 'pulse 5s ease-in-out infinite',
          }}
        ></div>
      </div>

      <div
        className="login-container"
        style={{
          width: '100%',
          maxWidth: '440px',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#fff',
              boxShadow: '0 10px 40px rgba(99,102,241,0.4)',
            }}
          >
            B
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
            Bluewud<span style={{ color: '#6366F1' }}>OTS</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Order Tracking System</p>
        </div>

        {/* Login Form */}
        <div className="login-card glass" style={{ padding: '40px', borderRadius: '20px' }}>
          <h2 style={{ marginBottom: '8px' }}>Welcome back</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
            Sign in to your account
          </p>

          {error && (
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid var(--danger)',
                borderRadius: '8px',
                marginBottom: '20px',
                color: 'var(--danger)',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                }}
              >
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@bluewud.com"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'var(--bg-accent)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '1rem',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                }}
              >
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    paddingRight: '50px',
                    background: 'var(--bg-accent)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '1rem',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: isLoading ? 'wait' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.3s ease',
              }}
            >
              {isLoading ? '⏳ Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div style={{ marginTop: '24px' }}>
          <p
            style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              marginBottom: '16px',
              fontSize: '0.85rem',
            }}
          >
            Quick demo access:
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                onClick={() => fillDemo(acc)}
                className="glass glass-hover"
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {acc.role}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            marginTop: '32px',
            fontSize: '0.8rem',
          }}
        >
          © 2024 Bluewud Industries • v1.0
        </p>
      </div>

      <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
            `}</style>
    </div>
  )
}

export default LoginPage
