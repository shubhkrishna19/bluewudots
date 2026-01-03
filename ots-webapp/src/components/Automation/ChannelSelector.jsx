import React, { useState } from 'react'

const CHANNELS = [
  { id: 'amazon', name: 'Amazon IN', icon: '📦', color: '#FF9900', apiReady: true },
  { id: 'flipkart', name: 'Flipkart', icon: '🛒', color: '#2874F0', apiReady: false },
  { id: 'shopify', name: 'Shopify', icon: '🛍️', color: '#96BF48', apiReady: false },
  { id: 'urban_ladder', name: 'Urban Ladder', icon: '🪑', color: '#F5A623', apiReady: false },
  { id: 'pepperfry', name: 'Pepperfry', icon: '🏠', color: '#E85D04', apiReady: false },
  { id: 'indiamart', name: 'IndiaMART', icon: '🏭', color: '#1C75BC', apiReady: false },
  { id: 'local_shop', name: 'Local Shop', icon: '🏪', color: '#10B981', apiReady: true },
  { id: 'dealer', name: 'Dealer Order', icon: '🤝', color: '#8B5CF6', apiReady: false },
]

const ChannelSelector = ({ onSelect, selectedChannel }) => {
  return (
    <div className="channel-selector">
      <h3>Select Sales Channel</h3>
      <p className="text-muted" style={{ marginBottom: '20px' }}>
        Choose the source for order import
      </p>

      <div
        className="channel-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '12px',
        }}
      >
        {CHANNELS.map((channel) => (
          <div
            key={channel.id}
            className={`channel-card glass glass-hover ${selectedChannel === channel.id ? 'selected' : ''}`}
            style={{
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              borderLeft: selectedChannel === channel.id ? `4px solid ${channel.color}` : 'none',
              position: 'relative',
            }}
            onClick={() => onSelect(channel.id)}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{channel.icon}</div>
            <p style={{ fontWeight: '600', fontSize: '0.85rem' }}>{channel.name}</p>

            {channel.apiReady ? (
              <span
                style={{
                  fontSize: '0.6rem',
                  background: 'var(--success)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                }}
              >
                READY
              </span>
            ) : (
              <span
                style={{
                  fontSize: '0.6rem',
                  background: 'var(--glass-border)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                }}
              >
                CSV
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChannelSelector
