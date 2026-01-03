/**
 * Storage Utilities
 * Provides abstraction for localStorage, sessionStorage, and IndexedDB operations
 * with automatic serialization/deserialization and error handling
 */

// LocalStorage wrapper
const localStorageUtils = {
  /**
   * Set item in localStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store (auto-serialized)
   * @param {number} expiryMs - Optional expiry time in milliseconds
   */
  set: (key, value, expiryMs = null) => {
    try {
      const item = {
        value,
        timestamp: Date.now(),
        expiry: expiryMs ? Date.now() + expiryMs : null,
      }
      localStorage.setItem(key, JSON.stringify(item))
      return true
    } catch (error) {
      console.error(`Failed to set localStorage key "${key}":`, error)
      return false
    }
  },

  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if not found or expired
   */
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      if (!item) return defaultValue

      const parsed = JSON.parse(item)
      if (parsed.expiry && Date.now() > parsed.expiry) {
        localStorage.removeItem(key)
        return defaultValue
      }
      return parsed.value
    } catch (error) {
      console.error(`Failed to get localStorage key "${key}":`, error)
      return defaultValue
    }
  },

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Failed to remove localStorage key "${key}":`, error)
      return false
    }
  },

  /**
   * Clear all localStorage
   */
  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
      return false
    }
  },

  /**
   * Check if key exists
   * @param {string} key - Storage key
   */
  has: (key) => {
    try {
      const item = localStorage.getItem(key)
      if (!item) return false
      const parsed = JSON.parse(item)
      if (parsed.expiry && Date.now() > parsed.expiry) {
        localStorage.removeItem(key)
        return false
      }
      return true
    } catch (error) {
      return false
    }
  },

  /**
   * Get all keys
   */
  keys: () => {
    try {
      return Object.keys(localStorage).filter((key) => {
        const item = localStorage.getItem(key)
        if (!item) return false
        try {
          const parsed = JSON.parse(item)
          if (parsed.expiry && Date.now() > parsed.expiry) {
            localStorage.removeItem(key)
            return false
          }
          return true
        } catch {
          return true
        }
      })
    } catch (error) {
      console.error('Failed to get localStorage keys:', error)
      return []
    }
  },
}

// SessionStorage wrapper
const sessionStorageUtils = {
  /**
   * Set item in sessionStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   */
  set: (key, value) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Failed to set sessionStorage key "${key}":`, error)
      return false
    }
  },

  /**
   * Get item from sessionStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if not found
   */
  get: (key, defaultValue = null) => {
    try {
      const item = sessionStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Failed to get sessionStorage key "${key}":`, error)
      return defaultValue
    }
  },

  /**
   * Remove item from sessionStorage
   * @param {string} key - Storage key
   */
  remove: (key) => {
    try {
      sessionStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Failed to remove sessionStorage key "${key}":`, error)
      return false
    }
  },

  /**
   * Clear all sessionStorage
   */
  clear: () => {
    try {
      sessionStorage.clear()
      return true
    } catch (error) {
      console.error('Failed to clear sessionStorage:', error)
      return false
    }
  },
}

// IndexedDB wrapper
const indexedDBUtils = {
  db: null,
  dbName: 'bluewudDB',
  version: 1,

  /**
   * Initialize IndexedDB connection
   * @param {Array} stores - Array of store definitions: [{name, keyPath, indexes}]
   */
  init: async (stores = []) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(indexedDBUtils.dbName, indexedDBUtils.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        indexedDBUtils.db = request.result
        resolve(indexedDBUtils.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        stores.forEach((store) => {
          if (!db.objectStoreNames.contains(store.name)) {
            const objectStore = db.createObjectStore(store.name, {
              keyPath: store.keyPath || 'id',
            })
            if (store.indexes) {
              store.indexes.forEach((index) => {
                objectStore.createIndex(index.name, index.keyPath, index.options || {})
              })
            }
          }
        })
      }
    })
  },

  /**
   * Add item to IndexedDB
   * @param {string} storeName - Store name
   * @param {*} value - Value to store
   */
  add: async (storeName, value) => {
    try {
      const transaction = indexedDBUtils.db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      return new Promise((resolve, reject) => {
        const request = store.add(value)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
      })
    } catch (error) {
      console.error(`Failed to add to IndexedDB store "${storeName}":`, error)
      throw error
    }
  },

  /**
   * Put item in IndexedDB (upsert)
   * @param {string} storeName - Store name
   * @param {*} value - Value to store
   */
  put: async (storeName, value) => {
    try {
      const transaction = indexedDBUtils.db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      return new Promise((resolve, reject) => {
        const request = store.put(value)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
      })
    } catch (error) {
      console.error(`Failed to put in IndexedDB store "${storeName}":`, error)
      throw error
    }
  },

  /**
   * Get item from IndexedDB
   * @param {string} storeName - Store name
   * @param {*} key - Key to retrieve
   */
  get: async (storeName, key) => {
    try {
      const transaction = indexedDBUtils.db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      return new Promise((resolve, reject) => {
        const request = store.get(key)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
      })
    } catch (error) {
      console.error(`Failed to get from IndexedDB store "${storeName}":`, error)
      throw error
    }
  },

  /**
   * Get all items from IndexedDB store
   * @param {string} storeName - Store name
   */
  getAll: async (storeName) => {
    try {
      const transaction = indexedDBUtils.db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      return new Promise((resolve, reject) => {
        const request = store.getAll()
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
      })
    } catch (error) {
      console.error(`Failed to get all from IndexedDB store "${storeName}":`, error)
      throw error
    }
  },

  /**
   * Delete item from IndexedDB
   * @param {string} storeName - Store name
   * @param {*} key - Key to delete
   */
  delete: async (storeName, key) => {
    try {
      const transaction = indexedDBUtils.db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      return new Promise((resolve, reject) => {
        const request = store.delete(key)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
      })
    } catch (error) {
      console.error(`Failed to delete from IndexedDB store "${storeName}":`, error)
      throw error
    }
  },

  /**
   * Clear entire store
   * @param {string} storeName - Store name
   */
  clear: async (storeName) => {
    try {
      const transaction = indexedDBUtils.db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      return new Promise((resolve, reject) => {
        const request = store.clear()
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
      })
    } catch (error) {
      console.error(`Failed to clear IndexedDB store "${storeName}":`, error)
      throw error
    }
  },
}

export default {
  localStorageUtils,
  sessionStorageUtils,
  indexedDBUtils,
}

export { localStorageUtils, sessionStorageUtils, indexedDBUtils }
