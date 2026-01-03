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

const DB_NAME = 'BluewudOTSCache'
const DB_VERSION = 2

class OfflineCacheService {
  constructor(dbName = DB_NAME, version = DB_VERSION) {
    this.dbName = dbName
    this.version = version
    this.db = null
    this.stores = {
      orders: { keyPath: 'id', indexes: ['status', 'createdAt', 'syncStatus'] },
      customers: { keyPath: 'id', indexes: ['email', 'phone'] },
      products: { keyPath: 'id', indexes: ['category', 'sku'] },
      skuMaster: { keyPath: 'sku' },
      activityLog: { keyPath: 'timestamp' },
      cache: { keyPath: 'key' },
      syncQueue: { keyPath: 'id', indexes: ['type', 'timestamp'] },
      whatsappMessages: { keyPath: 'id', indexes: ['orderId', 'status'] },
      metadata: { keyPath: 'key' },
    }
  }

  /**
   * Initializes IndexedDB
   * @returns {Promise<void>}
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        console.log(`IndexedDB initialized: ${this.dbName}`)
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // Create object stores
        Object.entries(this.stores).forEach(([storeName, config]) => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: config.keyPath })

            // Create indexes
            ;(config.indexes || []).forEach((indexName) => {
              store.createIndex(indexName, indexName, { unique: false })
            })
          }
        })
      }
    })
  }

  /**
   * Caches data in IndexedDB
   * @param {string} storeName - Object store name
   * @param {string} key - Data key (optional for auto-increment or keyPath based)
   * @param {*} data - Data to cache
   * @param {number} ttl - Time to live in milliseconds (optional)
   * @returns {Promise<boolean>}
   */
  async cacheData(storeName, key, data, ttl = null) {
    // Overload handling: if data is null, assume key is data (legacy support if needed, but strict here)
    // Actually, if store has keyPath, 'key' arg might be ignored or used as index.
    // But let's support flexible usage.

    let actualData = data
    if (data === undefined && typeof key === 'object') {
      actualData = key
    }

    try {
      if (!this.db) await this.initialize()

      const tx = this.db.transaction([storeName], 'readwrite')
      const store = tx.objectStore(storeName)

      const cacheEntry = {
        ...actualData,
        // If the store is 'cache' (key/value), we wrap it. If it's 'orders', we store as is.
        // But the class logic below wraps everything?
        // Let's adapt. If it's a generic store, we might not want wrapper.
        // HACK: for 'cache' store, wrap. For others, store direct.
      }

      if (storeName === 'cache') {
        cacheEntry.key = key
        cacheEntry.data = data
        cacheEntry.timestamp = Date.now()
        cacheEntry.ttl = ttl
        cacheEntry.expiresAt = ttl ? Date.now() + ttl : null
      }

      return new Promise((resolve, reject) => {
        const request = store.put(storeName === 'cache' ? cacheEntry : actualData)
        request.onsuccess = () => resolve(true)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Cache data failed:', error)
      return false
    }
  }

  /**
   * Retrieves cached data
   */
  async retrieveCachedData(storeName, key) {
    try {
      if (!this.db) await this.initialize()

      const tx = this.db.transaction([storeName], 'readonly')
      const store = tx.objectStore(storeName)

      return new Promise((resolve, reject) => {
        const request = store.get(key)
        request.onsuccess = () => {
          const entry = request.result

          if (!entry) {
            resolve(null)
            return
          }

          if (storeName === 'cache') {
            // Check if expired
            if (entry.expiresAt && Date.now() > entry.expiresAt) {
              this.removeData(storeName, key)
              resolve(null)
              return
            }
            resolve(entry.data)
          } else {
            resolve(entry)
          }
        }
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Retrieve cached data failed:', error)
      return null
    }
  }

  async getAllData(storeName) {
    try {
      if (!this.db) await this.initialize()
      const tx = this.db.transaction([storeName], 'readonly')
      const store = tx.objectStore(storeName)
      return new Promise((resolve, reject) => {
        const request = store.getAll()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Get all data failed:', error)
      return []
    }
  }

  async removeData(storeName, key) {
    try {
      if (!this.db) await this.initialize()
      const tx = this.db.transaction([storeName], 'readwrite')
      const store = tx.objectStore(storeName)
      return new Promise((resolve, reject) => {
        const request = store.delete(key)
        request.onsuccess = () => resolve(true)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Remove data failed:', error)
      return false
    }
  }

  async clearStore(storeName) {
    try {
      if (!this.db) await this.initialize()
      const tx = this.db.transaction([storeName], 'readwrite')
      const store = tx.objectStore(storeName)
      return new Promise((resolve, reject) => {
        const request = store.clear()
        request.onsuccess = () => resolve(true)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Clear store failed:', error)
      return false
    }
  }
}

// Export as singleton
let cacheInstance = null

export const initOfflineCacheService = () => {
  if (!cacheInstance) cacheInstance = new OfflineCacheService()
  return cacheInstance
}

// Auto-init for ease of use
cacheInstance = new OfflineCacheService()

export const cacheData = (store, key, data) => cacheInstance.cacheData(store, key, data)
export const retrieveCachedData = (store, key) => cacheInstance.retrieveCachedData(store, key)
export const clearCache = (store) => cacheInstance.clearStore(store)
export const getOfflineCacheService = () => cacheInstance

export default cacheInstance
