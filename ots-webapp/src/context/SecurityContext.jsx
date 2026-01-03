import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { validateIP } from '../utils/securityUtils'

const SecurityContext = createContext(null)

export const useSecurity = () => useContext(SecurityContext)

export const SecurityProvider = ({ children }) => {
  const { user } = useAuth()
  const [activityLog, setActivityLog] = useState([])
  const [whitelistedIPs, setWhitelistedIPs] = useState(['127.0.0.1', '192.168.1.1'])
  const [blockedIPs, setBlockedIPs] = useState([])
  const [securityAlerts, setSecurityAlerts] = useState([])

  // Forensic Logging
  const logActivity = (action, resource, details = {}) => {
    const newLog = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      user: user?.name || 'Anonymous',
      role: user?.role || 'Guest',
      action,
      resource,
      details,
      ip: 'Simulated-IP', // In prod, get from headers if possible or backend
    }

    setActivityLog((prev) => [newLog, ...prev].slice(0, 1000)) // Keep last 1000 logs

    // Simple Threat Detection
    detectThreats(newLog)
  }

  const detectThreats = (log) => {
    // Detect rapid exports
    if (log.action === 'EXPORT') {
      const recentExports = activityLog.filter(
        (l) =>
          l.user === log.user && l.action === 'EXPORT' && new Date() - new Date(l.timestamp) < 60000 // 1 min window
      )

      if (recentExports.length >= 3) {
        const alert = {
          id: `ALERT-${Date.now()}`,
          severity: 'HIGH',
          message: `Rapid Data Export detected by ${log.user}`,
          timestamp: new Date().toISOString(),
        }
        setSecurityAlerts((prev) => [alert, ...prev])
      }
    }
  }

  const addToWhitelist = (ip) => {
    if (validateIP(ip)) {
      setWhitelistedIPs((prev) => [...new Set([...prev, ip])])
      logActivity('SECURITY_UPDATE', 'Whitelist', { addedIp: ip })
      return true
    }
    return false
  }

  const value = {
    activityLog,
    logActivity,
    whitelistedIPs,
    addToWhitelist,
    securityAlerts,
    clearAlerts: () => setSecurityAlerts([]),
  }

  return <SecurityContext.Provider value={value}>{children}</SecurityContext.Provider>
}
