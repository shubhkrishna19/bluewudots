/**
 * Activity Logger with Backend Persistence
 * Comprehensive audit trail for all user actions
 * 
 * Features:
 * - Centralized activity logging
 * - Backend persistence to Zoho Creator
 * - Log rotation and retention
 * - User action tracking (Who, What, When, Where, Why)
 * - Performance monitoring
 */

class ActivityLoggerWithPersistence {
  constructor(config = {}) {
    this.zohoService = config.zohoService || null;
    this.creatorFormId = config.creatorFormId || 'activity_log_form';
    this.maxLocalLogs = config.maxLocalLogs || 1000;
    this.maxDaysRetention = config.maxDaysRetention || 90;
    
    // Local activity log
    this.activityLog = [];
    this.sessionId = this.generateSessionId();
    this.userId = config.userId || 'unknown';
    this.userEmail = config.userEmail || 'unknown@example.com';
    
    // Batching for backend sync
    this.batchSize = config.batchSize || 50;
    this.syncInterval = config.syncInterval || 30000; // 30 seconds
    this.autoSync = config.autoSync !== false;
    
    // Activity categories
    this.categories = {
      ORDER: 'order',
      CRM: 'crm',
      REPORT: 'report',
      SETTINGS: 'settings',
      AUTHENTICATION: 'auth',
      DATA: 'data',
      EXPORT: 'export',
      IMPORT: 'import',
      NOTIFICATION: 'notification'
    };
    
    if (this.autoSync) {
      this.startAutoSync();
    }
  }

  /**
   * Logs user activity
   * @param {string} action - Action name
   * @param {string} category - Activity category
   * @param {object} details - Additional details
   * @returns {object} Log entry
   */
  log(action, category = 'data', details = {}) {
    const entry = {
      id: this.generateLogId(),
      sessionId: this.sessionId,
      userId: this.userId,
      userEmail: this.userEmail,
      action,
      category,
      timestamp: new Date().toISOString(),
      details,
      status: 'pending_sync',
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent
    };

    this.activityLog.push(entry);
    this.enforceMaxLogs();
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`[${category.toUpperCase()}] ${action}`, details);
    }

    return entry;
  }

  /**
   * Logs order-related activity
   * @param {string} action - Action name
   * @param {string} orderId - Order ID
   * @param {object} details - Additional details
   */
  logOrderActivity(action, orderId, details = {}) {
    return this.log(action, this.categories.ORDER, {
      orderId,
      ...details
    });
  }

  /**
   * Logs CRM activity
   * @param {string} action - Action name
   * @param {string} module - CRM module
   * @param {string} recordId - Record ID
   * @param {object} details - Additional details
   */
  logCRMActivity(action, module, recordId, details = {}) {
    return this.log(action, this.categories.CRM, {
      module,
      recordId,
      ...details
    });
  }

  /**
   * Logs data import/export activity
   * @param {string} type - 'import' or 'export'
   * @param {string} dataType - Type of data (orders, contacts, etc.)
   * @param {number} count - Number of records
   * @param {object} details - Additional details
   */
  logDataActivity(type, dataType, count, details = {}) {
    const category = type === 'import' ? this.categories.IMPORT : this.categories.EXPORT;
    return this.log(`${type}_${dataType}`, category, {
      dataType,
      count,
      ...details
    });
  }

  /**
   * Syncs pending logs to backend
   * @returns {Promise<object>} Sync result
   */
  async syncToBackend() {
    try {
      if (!this.zohoService) {
        console.warn('Zoho service not configured, logs remain local');
        return { synced: 0, failed: 0 };
      }

      const pendingLogs = this.activityLog.filter(log => log.status === 'pending_sync');
      if (pendingLogs.length === 0) {
        return { synced: 0, failed: 0 };
      }

      let synced = 0;
      let failed = 0;

      // Sync in batches
      for (let i = 0; i < pendingLogs.length; i += this.batchSize) {
        const batch = pendingLogs.slice(i, i + this.batchSize);
        
        try {
          await this.zohoService.addCreatorRecords(this.creatorFormId, batch);
          
          // Mark as synced
          batch.forEach(log => {
            log.status = 'synced';
            synced++;
          });
        } catch (error) {
          console.error('Batch sync failed:', error);
          failed += batch.length;
        }
      }

      return { synced, failed };
    } catch (error) {
      console.error('Backend sync error:', error);
      return { synced: 0, failed: this.activityLog.filter(l => l.status === 'pending_sync').length };
    }
  }

  /**
   * Starts auto-sync timer
   */
  startAutoSync() {
    this.syncTimer = setInterval(() => {
      this.syncToBackend().catch(error => console.error('Auto sync error:', error));
    }, this.syncInterval);
  }

  /**
   * Stops auto-sync timer
   */
  stopAutoSync() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  /**
   * Gets activity logs with filtering
   * @param {object} filters - Filter criteria
   * @returns {array} Filtered logs
   */
  getLogs(filters = {}) {
    let filtered = [...this.activityLog];

    if (filters.category) {
      filtered = filtered.filter(log => log.category === filters.category);
    }

    if (filters.action) {
      filtered = filtered.filter(log => log.action === filters.action);
    }

    if (filters.status) {
      filtered = filtered.filter(log => log.status === filters.status);
    }

    if (filters.startDate) {
      const start = new Date(filters.startDate).getTime();
      filtered = filtered.filter(log => new Date(log.timestamp).getTime() >= start);
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate).getTime();
      filtered = filtered.filter(log => new Date(log.timestamp).getTime() <= end);
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return filtered;
  }

  /**
   * Gets activity statistics
   * @returns {object} Statistics
   */
  getStatistics() {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);
    const last7d = now - (7 * 24 * 60 * 60 * 1000);

    return {
      totalLogs: this.activityLog.length,
      pendingSync: this.activityLog.filter(l => l.status === 'pending_sync').length,
      synced: this.activityLog.filter(l => l.status === 'synced').length,
      last24Hours: this.activityLog.filter(l => new Date(l.timestamp).getTime() > last24h).length,
      last7Days: this.activityLog.filter(l => new Date(l.timestamp).getTime() > last7d).length,
      byCategory: this.getCountByCategory(),
      byStatus: this.getCountByStatus()
    };
  }

  /**
   * Gets log count by category
   * @returns {object} Category counts
   */
  getCountByCategory() {
    const counts = {};
    this.activityLog.forEach(log => {
      counts[log.category] = (counts[log.category] || 0) + 1;
    });
    return counts;
  }

  /**
   * Gets log count by status
   * @returns {object} Status counts
   */
  getCountByStatus() {
    const counts = {};
    this.activityLog.forEach(log => {
      counts[log.status] = (counts[log.status] || 0) + 1;
    });
    return counts;
  }

  /**
   * Enforces maximum log count
   */
  enforceMaxLogs() {
    if (this.activityLog.length > this.maxLocalLogs) {
      this.activityLog = this.activityLog.slice(-this.maxLocalLogs);
    }
  }

  /**
   * Clears old logs based on retention policy
   * @returns {number} Number of logs cleared
   */
  clearOldLogs() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.maxDaysRetention);
    cutoffDate.setHours(0, 0, 0, 0);

    const initialLength = this.activityLog.length;
    this.activityLog = this.activityLog.filter(log => {
      return new Date(log.timestamp) >= cutoffDate;
    });

    return initialLength - this.activityLog.length;
  }

  /**
   * Exports logs as CSV
   * @param {object} filters - Filter criteria
   * @returns {string} CSV content
   */
  exportAsCSV(filters = {}) {
    const logs = this.getLogs(filters);
    const headers = ['Timestamp', 'User', 'Action', 'Category', 'Details', 'Status'];
    
    let csv = headers.join(',') + '\n';
    logs.forEach(log => {
      csv += `"${log.timestamp}","${log.userEmail}","${log.action}","${log.category}","${JSON.stringify(log.details).replace(/"/g, '""')}","${log.status}"\n`;
    });

    return csv;
  }

  /**
   * Generates unique log ID
   * @returns {string} Log ID
   */
  generateLogId() {
    return `log_${this.sessionId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generates session ID
   * @returns {string} Session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Gets client IP (placeholder - requires server to provide)
   * @returns {string} IP address or 'unknown'
   */
  getClientIP() {
    // In production, this should be obtained from server
    return 'unknown';
  }
}

// Export as singleton
let loggerInstance = null;

export const initActivityLogger = (config) => {
  loggerInstance = new ActivityLoggerWithPersistence(config);
  return loggerInstance;
};

export const getActivityLogger = () => {
  if (!loggerInstance) {
    throw new Error('Activity Logger not initialized. Call initActivityLogger first.');
  }
  return loggerInstance;
};

// Usage Examples:
// ============
// 1. Initialize with Zoho service
// import { initActivityLogger } from './services/10_ActivityLoggerWithPersistence';
// const logger = initActivityLogger({
//   zohoService: oauth,
//   userId: 'user-123',
//   userEmail: 'user@example.com'
// });

// 2. Log activities
// logger.logOrderActivity('order_created', 'ORD-12345', { total: 5000 });
// logger.logCRMActivity('contact_updated', 'Contacts', 'CNT-456', { field: 'email' });
// logger.logDataActivity('export', 'orders', 1000);

// 3. Get logs and sync
// const logs = logger.getLogs({ category: 'order' });
// const stats = logger.getStatistics();
// await logger.syncToBackend();

export default ActivityLoggerWithPersistence;
