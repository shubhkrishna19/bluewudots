import React from 'react'
import { useAuth } from '../../context/AuthContext'

const UserProfile = ({ onClose }) => {
  const { user, logout } = useAuth()

  if (!user) return null

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'var(--danger)'
      case 'manager':
        return 'var(--primary)'
      case 'operator':
        return 'var(--success)'
      default:
        return 'var(--glass-border)'
    }
  }

  const permissionsList = Object.entries(user.permissions || {})
    .filter(([key, value]) => value === true)
    .map(([key]) =>
      key
        .replace('can', '')
        .replace(/([A-Z])/g, ' $1')
        .trim()
    )

  return (
    <div
      className="user-profile-panel animate-fade"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '350px',
        background: 'var(--bg-main)',
        borderLeft: '1px solid var(--glass-border)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="profile-header glass" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3>My Profile</h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '1.5rem',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#fff',
            }}
          >
            {user.avatar}
          </div>
          <h2>{user.name}</h2>
          <p className="text-muted">{user.email}</p>
          <span
            className="badge"
            style={{
              background: getRoleBadgeColor(user.role),
              marginTop: '12px',
              padding: '6px 16px',
              fontSize: '0.85rem',
            }}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        </div>

        {/* Session Info */}
        <div className="glass" style={{ padding: '16px', marginBottom: '20px' }}>
          <p className="text-muted" style={{ fontSize: '0.75rem' }}>
            SESSION INFO
          </p>
          <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
            Logged in: {new Date(user.loginTime).toLocaleString('en-IN')}
          </p>
        </div>

        {/* Permissions */}
        <div className="glass" style={{ padding: '16px' }}>
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '12px' }}>
            PERMISSIONS
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {permissionsList.map((perm) => (
              <span
                key={perm}
                style={{
                  padding: '6px 12px',
                  background: 'var(--bg-accent)',
                  borderRadius: '16px',
                  fontSize: '0.75rem',
                }}
              >
                ✓ {perm}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="profile-footer glass" style={{ padding: '20px' }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, var(--danger), #DC2626)',
            border: 'none',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          🚪 Sign Out
        </button>
      </div>
    </div>
  )
}

export default UserProfile
