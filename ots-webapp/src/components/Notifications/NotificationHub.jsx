import React, { useState, useEffect, useMemo } from 'react'
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  subscribe,
  createNotification,
} from '../../services/notificationService'
import { getRelativeTime } from '../../utils/dataUtils'

/**
 * NotificationHub - Unified Notification Center
 * Consolidates WhatsApp, Push, and System alerts in one premium UI.
 */

const CHANNELS = {
  ALL: { key: 'all', label: 'All', icon: '📋' },
  SYSTEM: { key: 'system', label: 'System', icon: '🔔' },
  ORDERS: { key: 'orders', label: 'Orders', icon: '📦' },
  ALERTS: { key: 'alerts', label: 'Alerts', icon: '🚨' },
  WHATSAPP: { key: 'whatsapp', label: 'WhatsApp', icon: '💬' },
}

const NotificationHub = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([])
  const [activeChannel, setActiveChannel] = useState('all')
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch notifications and subscribe to updates
  useEffect(() => {
    const refreshNotifications = () => {
      setIsLoading(true)
      let notifs = getNotifications({ limit: 50 })

      // If no notifications, seed with demo data
      if (notifs.length === 0) {
        seedDemoNotifications()
        notifs = getNotifications({ limit: 50 })
      }

      setNotifications(notifs)
      setUnreadCount(getUnreadCount())
      setIsLoading(false)
    }

    refreshNotifications()

    // Subscribe to new notifications
    const unsubscribe = subscribe((newNotif) => {
      setNotifications((prev) => [newNotif, ...prev.slice(0, 49)])
      setUnreadCount(getUnreadCount())
    })

    return () => unsubscribe()
  }, [])

  // Seed demo notifications
  const seedDemoNotifications = () => {
    createNotification({
      type: 'ORDER_DELIVERED',
      title: 'Order Delivered',
      message: 'BW-9901 delivered to Mumbai',
      data: { orderId: 'BW-9901', channel: 'orders' },
    })
    createNotification({
      type: 'ORDER_SHIPPED',
      title: 'Order Shipped',
      message: 'BW-9902 picked up by BlueDart. AWB: BD987654321',
      data: { orderId: 'BW-9902', channel: 'orders' },
    })
    createNotification({
      type: 'CARRIER_ISSUE',
      title: 'Carrier Delay',
      message: 'Delhivery shipments delayed in North Zone',
      data: { carrier: 'Delhivery', channel: 'alerts' },
    })
    createNotification({
      type: 'BULK_IMPORT',
      title: 'Bulk Import Complete',
      message: '12 orders from Amazon',
      data: { count: 12, channel: 'system' },
    })
    createNotification({
      type: 'COD_PENDING',
      title: 'COD Remittance',
      message: '5 COD orders pending (₹45,000)',
      data: { count: 5, channel: 'alerts' },
    })
    createNotification({
      type: 'ORDER_RTO',
      title: 'RTO Initiated',
      message: 'BW-9856 returned',
      data: { orderId: 'BW-9856', channel: 'orders' },
    })
    createNotification({
      type: 'LOW_STOCK',
      title: 'Low Stock Alert',
      message: 'BL-DESK-01 below reorder level',
      data: { sku: 'BL-DESK-01', channel: 'alerts' },
    })
    createNotification({
      type: 'SYSTEM_ALERT',
      title: 'WhatsApp Sent',
      message: 'Order confirmation sent to +91 9876543210',
      data: { channel: 'whatsapp' },
    })
  }

  const handleMarkAsRead = (id) => {
    markAsRead(id)
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setUnreadCount(getUnreadCount())
  }

  const handleMarkAllRead = () => {
    markAllAsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeChannel === 'all') return true
      if (activeChannel === 'orders')
        return n.type?.includes('order') || n.data?.channel === 'orders'
      if (activeChannel === 'alerts')
        return n.priority === 'critical' || n.priority === 'high' || n.data?.channel === 'alerts'
      if (activeChannel === 'whatsapp') return n.data?.channel === 'whatsapp'
      return n.data?.channel === activeChannel || n.type === `${activeChannel}_alert`
    })
  }, [notifications, activeChannel])

  const getTypeColor = (type, priority) => {
    if (priority === 'critical') return 'var(--danger)'
    if (priority === 'high') return 'var(--warning)'
    const typeColors = {
      order_created: 'var(--primary)',
      order_shipped: 'var(--info)',
      order_delivered: 'var(--success)',
      order_rto: 'var(--danger)',
      low_stock: 'var(--warning)',
      carrier_issue: 'var(--danger)',
      cod_pending: 'var(--warning)',
      bulk_import: 'var(--success)',
      system_alert: 'var(--primary)',
    }
    return typeColors[type] || 'var(--glass-border)'
  }

  if (!isOpen) return null

  return (
    <div
      className="notification-hub-overlay animate-fade"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'min(100vw, 450px)',
        background: 'linear-gradient(180deg, #0d0d12 0%, #0a0a0c 100%)',
        borderLeft: '1px solid var(--glass-border)',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%)',
          borderBottom: '1px solid var(--glass-border)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.5rem' }}>🔔</span>
              Notification Hub
              {unreadCount > 0 && (
                <span
                  style={{
                    background: 'linear-gradient(135deg, var(--danger) 0%, #c53030 100%)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </h3>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>
              WhatsApp • Push • System Alerts
            </p>
          </div>
          <button
            onClick={onClose}
            className="glass-hover"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--glass-border)',
              color: '#fff',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {/* Channel Tabs */}
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}
        >
          {Object.values(CHANNELS).map((channel) => (
            <button
              key={channel.key}
              onClick={() => setActiveChannel(channel.key)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: activeChannel === channel.key ? 'none' : '1px solid var(--glass-border)',
                background:
                  activeChannel === channel.key
                    ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)'
                    : 'transparent',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                boxShadow:
                  activeChannel === channel.key ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none',
              }}
            >
              <span>{channel.icon}</span>
              {channel.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {isLoading ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div
              className="spinner"
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid var(--glass-border)',
                borderTop: '3px solid var(--primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px',
              }}
            ></div>
            <p className="text-muted">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div
              style={{
                fontSize: '3rem',
                marginBottom: '16px',
                opacity: 0.5,
                filter: 'grayscale(100%)',
              }}
            >
              🔕
            </div>
            <h4>No notifications</h4>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '8px' }}>
              You're all caught up!
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleMarkAsRead(notif.id)}
              style={{
                padding: '16px',
                marginBottom: '12px',
                borderRadius: '12px',
                background: !notif.read
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)'
                  : 'rgba(255,255,255,0.02)',
                border: `1px solid ${!notif.read ? 'rgba(99, 102, 241, 0.2)' : 'var(--glass-border)'}`,
                borderLeft: `4px solid ${getTypeColor(notif.type, notif.priority)}`,
                cursor: 'pointer',
                opacity: notif.read ? 0.7 : 1,
                transition: 'all 0.2s ease',
                transform: 'translateX(0)',
              }}
              className="notification-item"
            >
              <div style={{ display: 'flex', gap: '14px' }}>
                <span
                  style={{
                    fontSize: '1.5rem',
                    filter: notif.read ? 'grayscale(50%)' : 'none',
                  }}
                >
                  {notif.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '6px',
                    }}
                  >
                    <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>{notif.title}</p>
                    {notif.priority === 'critical' && (
                      <span
                        style={{
                          background: 'var(--danger)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.6rem',
                          fontWeight: '700',
                        }}
                      >
                        CRITICAL
                      </span>
                    )}
                    {!notif.read && (
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          background: 'var(--primary)',
                          borderRadius: '50%',
                          boxShadow: '0 0 8px var(--primary)',
                        }}
                      ></div>
                    )}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {notif.message}
                  </p>
                  <p
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      marginTop: '10px',
                      opacity: 0.7,
                    }}
                  >
                    {getRelativeTime(notif.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--glass-border)',
          display: 'flex',
          gap: '12px',
        }}
      >
        <button
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid var(--glass-border)',
            background: 'transparent',
            color: unreadCount === 0 ? 'var(--text-muted)' : '#fff',
            fontWeight: '600',
            cursor: unreadCount === 0 ? 'not-allowed' : 'pointer',
            opacity: unreadCount === 0 ? 0.5 : 1,
            transition: 'all 0.2s ease',
          }}
        >
          ✓ Mark All Read
        </button>
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          }}
        >
          Close
        </button>
      </div>

      <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .notification-item:hover {
                    transform: translateX(4px) !important;
                    background: rgba(99, 102, 241, 0.1) !important;
                }
            `}</style>
    </div>
  )
}

export default NotificationHub
