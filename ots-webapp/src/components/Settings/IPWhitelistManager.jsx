/**
 * IPWhitelistManager.jsx
 * IP whitelist management component for restricted access
 * Add, remove, and manage allowed IP addresses
 */

import React, { useState, useEffect } from 'react'

const IPWhitelistManager = ({ onIpListUpdate }) => {
  const [ipList, setIpList] = useState([])
  const [newIp, setNewIp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('')

  // Load whitelist
  useEffect(() => {
    fetchWhitelist()
  }, [])

  const fetchWhitelist = async () => {
    try {
      const response = await fetch('/api/security/whitelist')
      const data = await response.json()
      setIpList(data || [])
    } catch (err) {
      setError('Failed to load whitelist')
    }
  }

  // Validate IP
  const validateIp = (ip) => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$|^[a-f0-9:]+:[a-f0-9:]+$/i
    if (!ipv4Regex.test(ip)) return false
    const parts = ip.split('.')
    return parts.every((p) => parseInt(p) <= 255)
  }

  // Add IP
  const handleAddIp = async () => {
    setError('')
    if (!newIp.trim()) {
      setError('Please enter an IP address')
      return
    }
    if (!validateIp(newIp)) {
      setError('Invalid IP address format')
      return
    }
    if (ipList.includes(newIp)) {
      setError('IP already in whitelist')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/security/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip: newIp }),
      })
      if (response.ok) {
        setIpList([...ipList, newIp])
        setNewIp('')
        setMessage('IP added successfully')
        onIpListUpdate?.([...ipList, newIp])
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      setError('Failed to add IP')
    } finally {
      setIsLoading(false)
    }
  }

  // Remove IP
  const handleRemoveIp = async (ip) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/security/whitelist/${ip}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        const updated = ipList.filter((i) => i !== ip)
        setIpList(updated)
        setMessage('IP removed')
        onIpListUpdate?.(updated)
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      setError('Failed to remove IP')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredIps = ipList.filter((ip) => ip.includes(filter))

  return (
    <div className="ip-whitelist-manager glass">
      <h2>🔐 IP Whitelist Manager</h2>

      <div className="add-ip-section">
        <div className="input-group">
          <input
            type="text"
            value={newIp}
            onChange={(e) => setNewIp(e.target.value)}
            placeholder="Enter IP address (e.g., 192.168.1.1)"
            onKeyPress={(e) => e.key === 'Enter' && handleAddIp()}
          />
          <button onClick={handleAddIp} disabled={isLoading}>
            {isLoading ? '⌛' : '+ Add'}
          </button>
        </div>
      </div>

      {error && <div className="error-msg">⚠️ {error}</div>}
      {message && <div className="success-msg">✔️ {message}</div>}

      <div className="whitelist-section">
        <div className="filter-input">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter IPs..."
          />
        </div>

        <div className="ip-list">
          {filteredIps.length === 0 ? (
            <p className="empty-msg">No IPs in whitelist</p>
          ) : (
            filteredIps.map((ip) => (
              <div key={ip} className="ip-item glass-hover">
                <span className="ip-text">{ip}</span>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveIp(ip)}
                  disabled={isLoading}
                  title="Remove IP"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
        <p className="count-info">{filteredIps.length} IP(s) whitelisted</p>
      </div>

      <style>{`
        .ip-whitelist-manager {
          padding: 2rem;
          border-radius: 12px;
        }

        .ip-whitelist-manager h2 {
          margin-top: 0;
          color: white;
        }

        .add-ip-section {
          margin: 1.5rem 0;
        }

        .input-group {
          display: flex;
          gap: 0.5rem;
        }

        .input-group input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          background: rgba(0, 0, 0, 0.2);
          color: white;
        }

        .input-group button {
          padding: 0.75rem 1rem;
          background: #4a90e2;
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          font-weight: 600;
        }

        .input-group button:hover:not(:disabled) {
          background: #357abd;
        }

        .error-msg {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
          padding: 0.75rem;
          border-radius: 6px;
          margin: 1rem 0;
        }

        .success-msg {
          background: rgba(74, 222, 128, 0.2);
          border: 1px solid rgba(74, 222, 128, 0.4);
          color: #86efac;
          padding: 0.75rem;
          border-radius: 6px;
          margin: 1rem 0;
        }

        .whitelist-section {
          margin-top: 2rem;
        }

        .filter-input {
          margin-bottom: 1rem;
        }

        .filter-input input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          background: rgba(0, 0, 0, 0.2);
          color: white;
        }

        .ip-list {
          max-height: 400px;
          overflow-y: auto;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 0.5rem;
        }

        .ip-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          margin: 0.5rem 0;
          border-radius: 6px;
          background: rgba(0, 0, 0, 0.2);
        }

        .ip-text {
          color: #a8dadc;
          font-family: monospace;
          font-weight: 600;
        }

        .remove-btn {
          background: rgba(239, 68, 68, 0.3);
          border: none;
          color: #fca5a5;
          width: 28px;
          height: 28px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1.2rem;
        }

        .remove-btn:hover {
          background: rgba(239, 68, 68, 0.5);
        }

        .empty-msg {
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          padding: 2rem;
        }

        .count-info {
          text-align: right;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  )
}

export default IPWhitelistManager
