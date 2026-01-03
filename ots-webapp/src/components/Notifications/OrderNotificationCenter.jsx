import React, { useState, useEffect } from 'react'
import { Bell, X, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { pushNotificationService } from '../../src/services/pushNotificationService'
import { offlineCacheService } from '../../src/services/offlineCacheService'

/**
 * OrderNotificationCenter Component
 * Displays order notifications and integrates with push notification and offline cache services
 * Shows toast-like notifications with support for multiple notification types
 */
const OrderNotificationCenter = () => {
  const [notifications, setNotifications] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Load cached notifications
    const loadNotifications = async () => {
      try {
        const cached = await offlineCacheService.retrieveCachedData('notifications')
        if (cached) {
          setNotifications(cached)
        }
      } catch (error) {
        console.error('Error loading notifications:', error)
      }
    }

    loadNotifications()
  }, [])

  const handleNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])
    setIsVisible(true)

    // Cache notification
    offlineCacheService.cacheData('notifications', [newNotification, ...notifications])

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      dismissNotification(newNotification.id)
    }, 5000)

    return () => clearTimeout(timer)
  }

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    if (notifications.length <= 1) {
      setIsVisible(false)
    }
  }

  const getIcon = (type) => {
    const iconProps = { className: 'w-5 h-5' }
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} className="w-5 h-5 text-green-400" />
      case 'error':
        return <AlertCircle {...iconProps} className="w-5 h-5 text-red-400" />
      case 'info':
      default:
        return <Info {...iconProps} className="w-5 h-5 text-blue-400" />
    }
  }

  const getTypeStyles = (type) => {
    const baseStyles = 'bg-slate-800/50 border'
    switch (type) {
      case 'success':
        return `${baseStyles} border-green-500/20`
      case 'error':
        return `${baseStyles} border-red-500/20`
      case 'info':
      default:
        return `${baseStyles} border-blue-500/20`
    }
  }

  return (
    <>
      {/* Notification Bell Icon */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="relative p-2 text-slate-300 hover:text-white transition-colors duration-200"
      >
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Notifications Panel */}
      {isVisible && (
        <div className="fixed top-16 right-4 w-96 max-h-96 overflow-y-auto rounded-xl bg-slate-900/95 backdrop-blur-xl border border-purple-500/20 shadow-2xl z-50">
          <div className="sticky top-0 bg-slate-900/95 p-4 border-b border-purple-500/10 flex justify-between items-center">
            <h3 className="font-semibold text-white">Notifications</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-sm">No notifications</div>
          ) : (
            <div className="divide-y divide-slate-700/30">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-4 ${getTypeStyles(notification.type)}`}>
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{notification.title}</p>
                      <p className="text-xs text-slate-400 mt-1">{notification.message}</p>
                      {notification.action && (
                        <button className="mt-2 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded transition-colors">
                          {notification.action.label}
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className="text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default OrderNotificationCenter
