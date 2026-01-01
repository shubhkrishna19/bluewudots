// src/services/offlineCacheService.js

const DB_NAME = 'bluewud_ots_cache';
const DB_VERSION = 1;
const STORE_NAME = 'cache';

// Open (or upgrade) IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      return reject(new Error('IndexedDB not supported'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        store.createIndex('namespace', 'namespace', { unique: false });
        store.createIndex('expiresAt', 'expiresAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function withStore(mode, fn) {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, mode);
      const store = tx.objectStore(STORE_NAME);
      let requestResult;

      try {
        requestResult = fn(store, resolve, reject);
      } catch (e) {
        reject(e);
      }

      tx.oncomplete = () => {
        if (requestResult instanceof Promise) {
          requestResult.then(resolve).catch(reject);
        }
      };
      tx.onerror = () => reject(tx.error);
    });
  });
}

/**
 * Parse "namespace:key" into { namespace, key }
 */
function parseKey(rawKey) {
  if (!rawKey) return { namespace: 'default', key: 'default' };
  const [ns, ...rest] = rawKey.split(':');
  if (rest.length === 0) {
    return { namespace: 'default', key: ns };
  }
  return { namespace: ns, key: rest.join(':') };
}

/**
 * Cache data with optional TTL (ms)
 */
export async function cacheData(rawKey, data, ttlMs = null) {
  const { namespace, key } = parseKey(rawKey);
  const now = Date.now();
  const expiresAt = ttlMs ? now + ttlMs : null;

  const record = {
    key: `${namespace}:${key}`,
    namespace,
    data,
    createdAt: now,
    updatedAt: now,
    expiresAt
  };

  return withStore('readwrite', (store, resolve, reject) => {
    const req = store.put(record);
    req.onsuccess = () => resolve(record);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Retrieve cached data, returning null if missing or expired
 */
export async function retrieveCachedData(rawKey) {
  const { namespace, key } = parseKey(rawKey);
  const fullKey = `${namespace}:${key}`;

  return withStore('readonly', (store, resolve, reject) => {
    const req = store.get(fullKey);
    req.onsuccess = () => {
      const record = req.result;
      if (!record) {
        return resolve(null);
      }
      if (record.expiresAt && record.expiresAt < Date.now()) {
        // Expired – clean up asynchronously
        withStore('readwrite', (s) => s.delete(fullKey));
        return resolve(null);
      }
      resolve(record.data);
    };
    req.onerror = () => reject(req.error);
  });
}

/**
 * Remove a single cached entry
 */
export async function removeCachedData(rawKey) {
  const { namespace, key } = parseKey(rawKey);
  const fullKey = `${namespace}:${key}`;

  return withStore('readwrite', (store, resolve, reject) => {
    const req = store.delete(fullKey);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Clear all cached data under a namespace (e.g. "orders", "sku")
 */
export async function clearNamespace(namespace = 'default') {
  return withStore('readwrite', (store, resolve, reject) => {
    const index = store.index('namespace');
    const range = IDBKeyRange.only(namespace);
    const req = index.openCursor(range);

    req.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      } else {
        resolve(true);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

/**
 * Clear *everything* (e.g. on logout or environment change)
 */
export async function clearAllCache() {
  return withStore('readwrite', (store, resolve, reject) => {
    const req = store.clear();
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

export default {
  cacheData,
  retrieveCachedData,
  removeCachedData,
  clearNamespace,
  clearAllCache
};
