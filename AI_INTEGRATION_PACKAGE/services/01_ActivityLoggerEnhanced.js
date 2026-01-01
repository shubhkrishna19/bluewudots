/**
 * ActivityLoggerEnhanced.js
 * Enhanced activity logging service integrated with Zoho Creator and offline queue
 * Tracks user actions, API calls, and system events with advanced filtering and replay
 */

class ActivityLoggerEnhanced {
  constructor() {
    this.dbName = 'BluewudActivityDB';
    this.storeName = 'activities';
    this.maxLogs = 10000;
    this.flushInterval = 30000; // 30 seconds
    this.queue = [];
    this.isInitialized = false;
    this.isOnline = navigator.onLine;
    this.filters = {};
    this.initDB();
    this.startFlusher();
    this.attachNetworkListener();
  }

  // Initialize IndexedDB
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        resolve();
      };
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('userId', 'userId', { unique: false });
          store.createIndex('actionType', 'actionType', { unique: false });
          store.createIndex('status', 'status', { unique: false });
        }
      };
    });
  }

  // Log user actions with context
  logAction(actionType, metadata = {}) {
    const activity = {
      timestamp: Date.now(),
      actionType,
      metadata,
      userId: metadata.userId || 'anonymous',
      status: 'local',
      synced: false,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    this.queue.push(activity);
    if (this.isOnline) {
      this.storeActivity(activity);
    }
  }

  // Log API calls
  logAPICall(endpoint, method, status, duration, metadata = {}) {
    this.logAction('API_CALL', {
      endpoint,
      method,
      status,
      duration,
      ...metadata
    });
  }

  // Log errors with context
  logError(errorMessage, stack = '', context = {}) {
    this.logAction('ERROR', {
      message: errorMessage,
      stack,
      context
    });
  }

  // Store activity in IndexedDB
  async storeActivity(activity) {
    if (!this.isInitialized) return;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(activity);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // Flush logs to Zoho Creator
  async flushLogs() {
    if (!this.isOnline || this.queue.length === 0) return;
    
    const batch = this.queue.splice(0, 100);
    try {
      const response = await fetch('/api/zoho/activity-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activities: batch })
      });
      
      if (response.ok) {
        batch.forEach(activity => {
          activity.synced = true;
          activity.status = 'synced';
          this.storeActivity(activity);
        });
      } else {
        // Put batch back in queue on failure
        this.queue.unshift(...batch);
      }
    } catch (error) {
      this.logError('Flush failed: ' + error.message);
      this.queue.unshift(...batch);
    }
  }

  // Start periodic log flusher
  startFlusher() {
    setInterval(() => this.flushLogs(), this.flushInterval);
  }

  // Attach network status listener
  attachNetworkListener() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushLogs();
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Query activities with filtering
  async queryActivities(filters = {}, limit = 100) {
    if (!this.isInitialized) return [];
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const allRequest = store.getAll();
      
      allRequest.onsuccess = () => {
        let results = allRequest.result;
        if (filters.actionType) {
          results = results.filter(a => a.actionType === filters.actionType);
        }
        if (filters.userId) {
          results = results.filter(a => a.userId === filters.userId);
        }
        if (filters.startTime) {
          results = results.filter(a => a.timestamp >= filters.startTime);
        }
        if (filters.endTime) {
          results = results.filter(a => a.timestamp <= filters.endTime);
        }
        resolve(results.slice(-limit).reverse());
      };
      allRequest.onerror = () => reject(allRequest.error);
    });
  }

  // Clear old logs (retention policy)
  async clearOldLogs(daysToKeep = 30) {
    if (!this.isInitialized) return;
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    const index = store.index('timestamp');
    const range = IDBKeyRange.upperBound(cutoffTime);
    index.openCursor(range).onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        store.delete(cursor.primaryKey);
        cursor.continue();
      }
    };
  }

  // Export logs for reporting
  async exportLogs(format = 'json') {
    const activities = await this.queryActivities({}, this.maxLogs);
    if (format === 'csv') {
      return this.convertToCSV(activities);
    }
    return JSON.stringify(activities, null, 2);
  }

  // Convert to CSV format
  convertToCSV(activities) {
    const headers = ['Timestamp', 'ActionType', 'UserId', 'Status', 'Metadata'];
    const rows = activities.map(a => [
      new Date(a.timestamp).toISOString(),
      a.actionType,
      a.userId,
      a.status,
      JSON.stringify(a.metadata)
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

// Export singleton instance
const activityLogger = new ActivityLoggerEnhanced();
export default activityLogger;
