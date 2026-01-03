/**
 * Offline Cache Service
<<<<<<< HEAD
 * 
 * Simple IndexedDB wrapper for persisting operational data offline.
 */

const DB_NAME = 'BluewudOTSCache';
const DB_VERSION = 2;

/**
 * Initialize / Open the IndexedDB
 */
const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // Store for orders, skuMaster, and activity logs
            if (!db.objectStoreNames.contains('orders')) db.createObjectStore('orders', { keyPath: 'id' });
            if (!db.objectStoreNames.contains('skuMaster')) db.createObjectStore('skuMaster', { keyPath: 'sku' });
            if (!db.objectStoreNames.contains('customers')) db.createObjectStore('customers', { keyPath: 'phone' });
            if (!db.objectStoreNames.contains('activityLog')) db.createObjectStore('activityLog', { keyPath: 'timestamp' });
            if (!db.objectStoreNames.contains('metadata')) db.createObjectStore('metadata', { keyPath: 'key' });
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

/**
 * Save data to a store
 */
export const cacheData = async (storeName, data) => {
    try {
        const db = await openDB();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);

        if (Array.isArray(data)) {
            data.forEach(item => store.put(item));
        } else {
            store.put(data);
        }

        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => reject(tx.error);
        });
    } catch (error) {
        console.error(`Cache write error [${storeName}]:`, error);
        return false;
    }
};

/**
 * Retrieve all data from a store
 */
export const retrieveCachedData = async (storeName) => {
    try {
        const db = await openDB();
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.getAll();

        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error(`Cache read error [${storeName}]:`, error);
        return [];
    }
};

/**
 * Clear a specific store
 */
export const clearCache = async (storeName) => {
    try {
        const db = await openDB();
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).clear();
        return true;
    } catch (error) {
        return false;
    }
};

export default {
    cacheData,
    retrieveCachedData,
    clearCache
};
=======
 * IndexedDB wrapper for offline-first data persistence
 * 
 * Features:
 * - Simple key-value storage
 * - Automatic schema initialization
 * - TTL support for data expiration
 * - Batch operations
 * - Sync state tracking
 */

class OfflineCacheService {
  constructor(dbName = 'bluewud_ots', version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
    this.stores = {
      'orders': { keyPath: 'id', indexes: ['status', 'createdAt', 'syncStatus'] },
      'customers': { keyPath: 'id', indexes: ['email', 'phone'] },
      'products': { keyPath: 'id', indexes: ['category', 'sku'] },
      'cache': { keyPath: 'key' },
      'syncQueue': { keyPath: 'id', indexes: ['type', 'timestamp'] },
      'whatsappMessages': { keyPath: 'id', indexes: ['orderId', 'status'] }
    };
  }

  /**
   * Initializes IndexedDB
   * @returns {Promise<void>}
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log(`IndexedDB initialized: ${this.dbName}`);
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores
        Object.entries(this.stores).forEach(([storeName, config]) => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: config.keyPath });
            
            // Create indexes
            (config.indexes || []).forEach(indexName => {
              store.createIndex(indexName, indexName, { unique: false });
            });
          }
        });
      };
    });
  }

  /**
   * Caches data in IndexedDB
   * @param {string} storeName - Object store name
   * @param {string} key - Data key
   * @param {*} data - Data to cache
   * @param {number} ttl - Time to live in milliseconds (optional)
   * @returns {Promise<boolean>}
   */
  async cacheData(storeName, key, data, ttl = null) {
    try {
      if (!this.db) await this.initialize();

      const tx = this.db.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);

      const cacheEntry = {
        key,
        data,
        timestamp: Date.now(),
        ttl,
        expiresAt: ttl ? Date.now() + ttl : null
      };

      return new Promise((resolve, reject) => {
        const request = store.put(cacheEntry);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Cache data failed:', error);
      return false;
    }
  }

  /**
   * Retrieves cached data
   * @param {string} storeName - Object store name
   * @param {string} key - Data key
   * @returns {Promise<*|null>}
   */
  async retrieveCachedData(storeName, key) {
    try {
      if (!this.db) await this.initialize();

      const tx = this.db.transaction([storeName], 'readonly');
      const store = tx.objectStore(storeName);

      return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => {
          const entry = request.result;
          
          if (!entry) {
            resolve(null);
            return;
          }

          // Check if expired
          if (entry.expiresAt && Date.now() > entry.expiresAt) {
            this.removeData(storeName, key);
            resolve(null);
            return;
          }

          resolve(entry.data);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Retrieve cached data failed:', error);
      return null;
    }
  }

  /**
   * Retrieves all data from a store
   * @param {string} storeName - Object store name
   * @returns {Promise<array>}
   */
  async getAllData(storeName) {
    try {
      if (!this.db) await this.initialize();

      const tx = this.db.transaction([storeName], 'readonly');
      const store = tx.objectStore(storeName);

      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Get all data failed:', error);
      return [];
    }
  }

  /**
   * Removes cached data
   * @param {string} storeName - Object store name
   * @param {string} key - Data key
   * @returns {Promise<boolean>}
   */
  async removeData(storeName, key) {
    try {
      if (!this.db) await this.initialize();

      const tx = this.db.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);

      return new Promise((resolve, reject) => {
        const request = store.delete(key);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Remove data failed:', error);
      return false;
    }
  }

  /**
   * Clears entire object store
   * @param {string} storeName - Object store name
   * @returns {Promise<boolean>}
   */
  async clearStore(storeName) {
    try {
      if (!this.db) await this.initialize();

      const tx = this.db.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);

      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Clear store failed:', error);
      return false;
    }
  }

  /**
   * Gets data count in store
   * @param {string} storeName - Object store name
   * @returns {Promise<number>}
   */
  async getStoreSize(storeName) {
    try {
      if (!this.db) await this.initialize();

      const tx = this.db.transaction([storeName], 'readonly');
      const store = tx.objectStore(storeName);

      return new Promise((resolve, reject) => {
        const request = store.count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Get store size failed:', error);
      return 0;
    }
  }

  /**
   * Syncs data with backend
   * @param {string} storeName - Object store name
   * @param {string} endpoint - API endpoint
   * @returns {Promise<object>}
   */
  async syncWithBackend(storeName, endpoint) {
    try {
      const unsyncedData = await this.getAllData(storeName);
      const syncResults = { success: 0, failed: 0, errors: [] };

      for (const item of unsyncedData) {
        if (item.syncStatus === 'pending' || !item.syncStatus) {
          try {
            const response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item.data)
            });

            if (response.ok) {
              // Mark as synced
              await this.cacheData(storeName, item.key, {
                ...item.data,
                syncStatus: 'synced',
                syncedAt: Date.now()
              });
              syncResults.success++;
            } else {
              syncResults.failed++;
              syncResults.errors.push({ key: item.key, error: response.statusText });
            }
          } catch (error) {
            syncResults.failed++;
            syncResults.errors.push({ key: item.key, error: error.message });
          }
        }
      }

      return syncResults;
    } catch (error) {
      console.error('Sync failed:', error);
      return { success: 0, failed: 0, errors: [{ error: error.message }] };
    }
  }

  /**
   * Clears expired data from all stores
   * @returns {Promise<void>}
   */
  async clearExpiredData() {
    try {
      for (const storeName of Object.keys(this.stores)) {
        const allData = await this.getAllData(storeName);
        const now = Date.now();

        for (const entry of allData) {
          if (entry.expiresAt && now > entry.expiresAt) {
            await this.removeData(storeName, entry.key);
          }
        }
      }
    } catch (error) {
      console.error('Clear expired data failed:', error);
    }
  }
}

// Export as singleton
let cacheInstance = null;

export const initOfflineCacheService = () => {
  cacheInstance = new OfflineCacheService();
  return cacheInstance;
};

export const getOfflineCacheService = () => {
  if (!cacheInstance) {
    throw new Error('Offline Cache Service not initialized. Call initOfflineCacheService first.');
  }
  return cacheInstance;
};

// Usage Examples:
// ============
// 1. Initialize
// import { initOfflineCacheService } from './services/08_OfflineCacheService';
// const cache = initOfflineCacheService();
// await cache.initialize();

// 2. Cache data
// await cache.cacheData('orders', 'ORD-123', orderData, 3600000); // 1 hour TTL

// 3. Retrieve data
// const orderData = await cache.retrieveCachedData('orders', 'ORD-123');

// 4. Sync with backend
// const results = await cache.syncWithBackend('orders', '/api/orders/sync');

export default OfflineCacheService;
>>>>>>> 4be53487f72a2bfacf3cde5d60b2e7a7e0ec3174
