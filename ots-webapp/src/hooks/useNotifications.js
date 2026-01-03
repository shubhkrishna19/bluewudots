import { useState, useCallback } from 'react'
import { pushNotificationService } from '../../src/services/pushNotificationService'
import { offlineCacheService } from '../../src/services/offlineCacheService'

/**
 * useNotifications Hook
 * Manages notification state and lifecycle
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const addNotification = useCallback(
    (notification) => {
      const newNotif = {
        id: Date.now(),
        ...notification,
        read: false,
        createdAt: new Date(),
      }
      setNotifications((prev) => [newNotif, ...prev])
      setUnreadCount((prev) => prev + 1)
      offlineCacheService.cacheData('notifications', [newNotif, ...notifications])
    },
    [notifications]
  )

  const markAsRead = useCallback((id) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      offlineCacheService.cacheData('notifications', updated)
      return updated
    })
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
    setUnreadCount(0)
  }, [])

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    removeNotification,
    clearAll,
  }
}

export default useNotifications
