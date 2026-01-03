/**
 * Offline Cache Service
 * IndexedDB wrapper for offline-first data persistence
 * 
 * Features:
 * - Simple key-value storage
 * - Automatic schema initialization
 * - TTL support for data expiration
 * - Batch operations
 * - Sync state tracking
 */

const DB_NAME = 'BluewudOTSCache';
const DB_VERSION = 2;

class OfflineCacheService {
  constructor(dbName = DB_NAME, version = DB_VERSION) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
    this.stores = {
      'orders': { keyPath: 'id', indexes: ['status', 'createdAt', 'syncStatus'] },
      'skuMaster': { keyPath: 'sku' },
      'customers': { keyPath: 'phone', indexes: ['email'] },
      'activityLog': { keyPath: 'timestamp' },
      'metadata': { keyPath: 'key' },
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
   * @param {string|object} keyOrData - Data key or data object (if array-like)
   * @param {*} data - Data to cache (optional if keyOrData is full object)
   * @param {number} ttl - Time to live in milliseconds (optional)
   * @returns {Promise<boolean>}
   */
  async cacheData(storeName, keyOrData, data = null, ttl = null) {
    try {
      if (!this.db) await this.initialize();

      const tx = this.db.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);

      if (Array.isArray(keyOrData)) {
        keyOrData.forEach(item => store.put(item));
      } else if (data === null) {
        // If only one arg (besides storeName), assume it's the data object with keyPath included
        store.put(keyOrData);
      } else {
        // Wrap with metadata if needed
        const cacheEntry = {
          key: keyOrData,
          data,
          timestamp: Date.now(),
          ttl,
          expiresAt: ttl ? Date.now() + ttl : null
        };
        store.put(cacheEntry);
      }

      return new Promise((resolve) => {
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch (error) {
      console.error('Cache data failed:', error);
      return false;
    }
  }

  /**
   * Retrieves cached data
   * @param {string} storeName - Object store name
   * @param {string} key - Data key (optional)
   * @returns {Promise<*|null>}
   */
  async retrieveCachedData(storeName, key = null) {
    try {
      if (!this.db) await this.initialize();

      const tx = this.db.transaction([storeName], 'readonly');
      const store = tx.objectStore(storeName);

      if (key === null) {
        return new Promise((resolve) => {
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => resolve([]);
        });
      }

      return new Promise((resolve) => {
        const request = store.get(key);
        request.onsuccess = () => {
          const entry = request.result;
          if (!entry) return resolve(null);

          // Check if it's a wrapped entry with TTL
          if (entry.expiresAt && Date.now() > entry.expiresAt) {
            this.removeData(storeName, key);
            return resolve(null);
          }

          // Return raw data if it wasn't wrapped, or the data property if it was
          resolve(entry.data !== undefined ? entry.data : entry);
        };
        request.onerror = () => resolve(null);
      });
    } catch (error) {
      console.error('Retrieve cached data failed:', error);
      return null;
    }
  }

  /**
   * Retrieves all data from a store
   */
  async getAllData(storeName) {
    return this.retrieveCachedData(storeName);
  }

  /**
   * Removes cached data
   */
  async removeData(storeName, key) {
    try {
      if (!this.db) await this.initialize();
      const tx = this.db.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);
      return new Promise((resolve) => {
        const request = store.delete(key);
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      });
    } catch (error) {
      return false;
    }
  }

  /**
   * Clears entire object store
   */
  async clearStore(storeName) {
    try {
      if (!this.db) await this.initialize();
      const tx = this.db.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);
      return new Promise((resolve) => {
        const request = store.clear();
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      });
    } catch (error) {
      return false;
    }
  }
}

// Singleton Instance
let cacheInstance = null;

export const initOfflineCacheService = () => {
  if (!cacheInstance) cacheInstance = new OfflineCacheService();
  return cacheInstance;
};

export const getOfflineCacheService = () => {
  if (!cacheInstance) return initOfflineCacheService();
  return cacheInstance;
};

// Functional Wrappers for backward compatibility
export const cacheData = (storeName, data) => getOfflineCacheService().cacheData(storeName, data);
export const retrieveCachedData = (storeName, key = null) => getOfflineCacheService().retrieveCachedData(storeName, key);
export const clearCache = (storeName) => getOfflineCacheService().clearStore(storeName);

export default {
  initOfflineCacheService,
  getOfflineCacheService,
  cacheData,
  retrieveCachedData,
  clearCache
};
