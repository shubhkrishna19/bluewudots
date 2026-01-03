/**
 * Activity Logger Enhanced Service
 * Comprehensive audit trail and activity logging for production environments
 * Persists logs to Zoho Catalyst backend
 */

const ACTIVITY_LOG_KEY = 'activity-logs'
const LOG_BATCH_SIZE = 50
const SYNC_INTERVAL = 60000 // 1 minute
const LOG_RETENTION_DAYS = 90

let syncTimer = null
let logQueue = []

/**
 * Log an activity to the local queue and Catalyst
 * @param {Object} activity Activity details
 * @param {string} activity.action Action type (CREATE, UPDATE, DELETE, VIEW, etc.)
 * @param {string} activity.module Module affected (Orders, Inventory, etc.)
 * @param {Object} activity.data Activity data/payload
 * @param {string} activity.userId User ID performing the action
 * @param {string} activity.userEmail User email
 * @param {string} activity.ipAddress IP address (optional)
 * @param {number} activity.duration Duration in ms (optional)
 * @returns {Promise<void>}
 */
export const logActivity = async (activity = {}) => {
  const {
    action = 'UNKNOWN',
    module = 'GENERAL',
    data = {},
    userId = 'system',
    userEmail = 'system@bluewud.com',
    ipAddress = 'unknown',
    duration = 0,
  } = activity

  const log = {
    id: generateLogId(),
    timestamp: new Date().toISOString(),
    action,
    module,
    userId,
    userEmail,
    ipAddress,
    duration,
    data,
    status: 'pending',
  }

  // Add to local queue
  logQueue.push(log)
  await saveLogLocally(log)

  // Sync if batch size reached
  if (logQueue.length >= LOG_BATCH_SIZE) {
    await syncLogsToBackend()
  }

  return log
}

/**
 * Log an order-related activity
 * @param {Object} order Order object
 * @param {string} action Action type
 * @param {string} userId User ID
 * @returns {Promise<void>}
 */
export const logOrderActivity = async (order, action, userId) => {
  return logActivity({
    action,
    module: 'ORDERS',
    data: {
      orderId: order.id,
      orderStatus: order.status,
      previousStatus: order.previousStatus,
      amount: order.amount,
      summary: `Order ${order.id} - ${action}`,
    },
    userId,
  })
}

/**
 * Log an inventory-related activity
 * @param {Object} inventory Inventory item
 * @param {string} action Action type
 * @param {number} quantityChange Change in quantity
 * @param {string} userId User ID
 * @returns {Promise<void>}
 */
export const logInventoryActivity = async (inventory, action, quantityChange, userId) => {
  return logActivity({
    action,
    module: 'INVENTORY',
    data: {
      skuId: inventory.skuId,
      skuName: inventory.skuName,
      previousQuantity: inventory.quantity,
      newQuantity: inventory.quantity + quantityChange,
      quantityChange,
      warehouse: inventory.warehouse,
      summary: `Inventory ${action}: ${inventory.skuName}`,
    },
    userId,
  })
}

/**
 * Log a user authentication activity
 * @param {string} action Action type (LOGIN, LOGOUT, FAILED_LOGIN)
 * @param {string} userId User ID
 * @param {string} userEmail User email
 * @param {boolean} success Success status
 * @param {string} reason Reason for failure (optional)
 * @returns {Promise<void>}
 */
export const logAuthActivity = async (action, userId, userEmail, success, reason) => {
  return logActivity({
    action,
    module: 'AUTHENTICATION',
    data: {
      userId,
      userEmail,
      success,
      reason: reason || '',
      timestamp: new Date().toISOString(),
    },
    userId,
    userEmail,
  })
}

/**
 * Log a report or data export activity
 * @param {string} reportName Report name
 * @param {Object} filters Report filters
 * @param {number} recordCount Number of records
 * @param {string} userId User ID
 * @returns {Promise<void>}
 */
export const logReportActivity = async (reportName, filters, recordCount, userId) => {
  return logActivity({
    action: 'EXPORT',
    module: 'REPORTS',
    data: {
      reportName,
      filters,
      recordCount,
      summary: `Report exported: ${reportName} (${recordCount} records)`,
    },
    userId,
  })
}

/**
 * Save activity log locally to IndexedDB or localStorage
 * @param {Object} log Activity log object
 * @returns {Promise<void>}
 */
const saveLogLocally = async (log) => {
  try {
    const logs = JSON.parse(localStorage.getItem(ACTIVITY_LOG_KEY) || '[]')
    logs.push(log)

    // Keep only last 1000 logs locally
    if (logs.length > 1000) {
      logs.shift()
    }

    localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(logs))
  } catch (error) {
    console.warn('Failed to save log locally:', error)
  }
}

/**
 * Sync pending logs to Catalyst backend
 * @returns {Promise<void>}
 */
export const syncLogsToBackend = async () => {
  const pendingLogs = logQueue.filter((log) => log.status === 'pending')

  if (pendingLogs.length === 0) return

  try {
    // This should call your Catalyst cloud function
    // Example endpoint: /api/activity-logs/bulk
    const response = await fetch('/api/activity-logs/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
      },
      body: JSON.stringify({
        logs: pendingLogs.map((log) => ({
          ...log,
          status: 'synced',
        })),
      }),
    })

    if (response.ok) {
      // Mark logs as synced
      logQueue = logQueue.map((log) =>
        pendingLogs.some((p) => p.id === log.id) ? { ...log, status: 'synced' } : log
      )
      console.log(`Synced ${pendingLogs.length} activity logs to backend`)
    } else {
      console.warn('Failed to sync activity logs:', response.statusText)
    }
  } catch (error) {
    console.error('Error syncing activity logs:', error)
  }
}

/**
 * Get activity logs with optional filters
 * @param {Object} filters Filter options
 * @param {string} filters.module Filter by module
 * @param {string} filters.action Filter by action
 * @param {string} filters.userId Filter by user ID
 * @param {number} filters.limit Limit number of results
 * @returns {Array} Filtered activity logs
 */
export const getActivityLogs = (filters = {}) => {
  const { module = null, action = null, userId = null, limit = 100 } = filters

  try {
    let logs = JSON.parse(localStorage.getItem(ACTIVITY_LOG_KEY) || '[]')

    // Apply filters
    if (module) logs = logs.filter((log) => log.module === module)
    if (action) logs = logs.filter((log) => log.action === action)
    if (userId) logs = logs.filter((log) => log.userId === userId)

    // Return most recent first
    return logs.reverse().slice(0, limit)
  } catch (error) {
    console.warn('Failed to get activity logs:', error)
    return []
  }
}

/**
 * Get activity summary statistics
 * @returns {Object} Summary statistics
 */
export const getActivitySummary = () => {
  const logs = JSON.parse(localStorage.getItem(ACTIVITY_LOG_KEY) || '[]')

  const summary = {
    totalLogs: logs.length,
    byModule: {},
    byAction: {},
    byUser: {},
    today: 0,
    thisWeek: 0,
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  logs.forEach((log) => {
    const logTime = new Date(log.timestamp)

    // Count by module
    summary.byModule[log.module] = (summary.byModule[log.module] || 0) + 1

    // Count by action
    summary.byAction[log.action] = (summary.byAction[log.action] || 0) + 1

    // Count by user
    summary.byUser[log.userId] = (summary.byUser[log.userId] || 0) + 1

    // Count today and this week
    if (logTime >= today) summary.today += 1
    if (logTime >= weekAgo) summary.thisWeek += 1
  })

  return summary
}

/**
 * Clean up old logs older than retention period
 * @returns {Promise<void>}
 */
export const cleanupOldLogs = async () => {
  try {
    const logs = JSON.parse(localStorage.getItem(ACTIVITY_LOG_KEY) || '[]')
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - LOG_RETENTION_DAYS)

    const filteredLogs = logs.filter((log) => new Date(log.timestamp) >= cutoffDate)

    localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(filteredLogs))
    console.log(`Cleaned up ${logs.length - filteredLogs.length} old activity logs`)
  } catch (error) {
    console.warn('Failed to cleanup old logs:', error)
  }
}

/**
 * Start automatic sync timer
 * @param {number} interval Sync interval in ms
 * @returns {void}
 */
export const startAutoSync = (interval = SYNC_INTERVAL) => {
  if (syncTimer) clearInterval(syncTimer)

  syncTimer = setInterval(() => {
    syncLogsToBackend()
    cleanupOldLogs()
  }, interval)

  console.log(`Activity logger auto-sync started (interval: ${interval}ms)`)
}

/**
 * Stop automatic sync timer
 * @returns {void}
 */
export const stopAutoSync = () => {
  if (syncTimer) {
    clearInterval(syncTimer)
    syncTimer = null
    console.log('Activity logger auto-sync stopped')
  }
}

/**
 * Generate unique log ID
 * @returns {string} Unique log ID
 */
const generateLogId = () => {
  return `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Clear all activity logs (use with caution)
 * @returns {Promise<void>}
 */
export const clearAllLogs = async () => {
  try {
    localStorage.removeItem(ACTIVITY_LOG_KEY)
    logQueue = []
    console.warn('All activity logs cleared')
  } catch (error) {
    console.error('Failed to clear activity logs:', error)
  }
}

/**
 * Usage Example:
 *
 * // 1. Initialize auto-sync on app load
 * startAutoSync();
 *
 * // 2. Log activities
 * await logOrderActivity(order, 'CREATE', userId);
 * await logInventoryActivity(inventory, 'UPDATE', -5, userId);
 * await logAuthActivity('LOGIN', userId, userEmail, true);
 *
 * // 3. Get logs
 * const orderLogs = getActivityLogs({ module: 'ORDERS', limit: 50 });
 * const summary = getActivitySummary();
 *
 * // 4. Cleanup on app unload
 * window.addEventListener('beforeunload', () => {
 *   syncLogsToBackend(); // Final sync
 *   stopAutoSync();
 * });
 */

export default {
  logActivity,
  logOrderActivity,
  logInventoryActivity,
  logAuthActivity,
  logReportActivity,
  syncLogsToBackend,
  getActivityLogs,
  getActivitySummary,
  cleanupOldLogs,
  startAutoSync,
  stopAutoSync,
  clearAllLogs,
}
