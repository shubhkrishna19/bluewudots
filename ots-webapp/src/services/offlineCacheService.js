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
 * - In-memory fallback for test/non-supported environments
 */

const DB_NAME = 'BluewudOTSCache'
const DB_VERSION = 2

class OfflineCacheService {
  constructor(dbName = DB_NAME, version = DB_VERSION) {
    this.dbName = dbName
    this.version = version
    this.db = null
    this.isAvailable = true
    this.memoryStorage = {}
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
    if (typeof indexedDB === 'undefined') {
      console.warn('[OfflineCache] indexedDB not available. Falling back to in-memory storage.')
      this.isAvailable = false
      return true
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error)
        this.isAvailable = false
        resolve() // Resolve anyway to allow fallback
      }

      request.onsuccess = () => {
        this.db = request.result
        console.log(`IndexedDB initialized: ${this.dbName}`)
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        Object.entries(this.stores).forEach(([storeName, config]) => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: config.keyPath })
              ; (config.indexes || []).forEach((indexName) => {
                store.createIndex(indexName, indexName, { unique: false })
              })
          }
        })
      }
    })
  }

  /**
   * Caches data
   */
  async cacheData(storeName, key, data, ttl = null) {
    if (!this.isAvailable || !this.db) {
      if (!this.memoryStorage[storeName]) this.memoryStorage[storeName] = {}
      const actualKey = typeof key === 'string' || typeof key === 'number' ? key : data?.id || data?.key || 'default'
      this.memoryStorage[storeName][actualKey] = data || key
      return true
    }

    let actualData = data
    if (data === undefined && typeof key === 'object') {
      actualData = key
    }

    try {
      const tx = this.db.transaction([storeName], 'readwrite')
      const store = tx.objectStore(storeName)

      if (storeName === 'cache') {
        const cacheEntry = {
          key,
          data: actualData,
          timestamp: Date.now(),
          ttl,
          expiresAt: ttl ? Date.now() + ttl : null,
        }
        return new Promise((resolve, reject) => {
          const request = store.put(cacheEntry)
          request.onsuccess = () => resolve(true)
          request.onerror = () => reject(request.error)
        })
      }

      return new Promise((resolve, reject) => {
        const request = store.put(actualData)
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
    if (!this.isAvailable || !this.db) {
      return this.memoryStorage[storeName]?.[key] || null
    }

    try {
      const tx = this.db.transaction([storeName], 'readonly')
      const store = tx.objectStore(storeName)

      return new Promise((resolve, reject) => {
        const request = store.get(key)
        request.onsuccess = () => {
          const entry = request.result
          if (!entry) return resolve(null)

          if (storeName === 'cache') {
            if (entry.expiresAt && Date.now() > entry.expiresAt) {
              this.removeData(storeName, key)
              return resolve(null)
            }
            return resolve(entry.data)
          }
          resolve(entry)
        }
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Retrieve cached data failed:', error)
      return null
    }
  }

  /**
   * Gets all data from a store
   */
  async getAllData(storeName) {
    if (!this.isAvailable || !this.db) {
      return Object.values(this.memoryStorage[storeName] || {})
    }

    try {
      const tx = this.db.transaction([storeName], 'readonly')
      const store = tx.objectStore(storeName)
      return new Promise((resolve, reject) => {
        const request = store.getAll()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Get all data failed:', error)
      return Object.values(this.memoryStorage[storeName] || {})
    }
  }

  /**
   * Removes data
   */
  async removeData(storeName, key) {
    if (!this.isAvailable || !this.db) {
      if (this.memoryStorage[storeName]) {
        delete this.memoryStorage[storeName][key]
      }
      return true
    }

    try {
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

  /**
   * Clears a store
   */
  async clearStore(storeName) {
    if (!this.isAvailable || !this.db) {
      this.memoryStorage[storeName] = {}
      return true
    }

    try {
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
