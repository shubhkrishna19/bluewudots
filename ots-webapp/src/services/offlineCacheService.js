/**
 * Offline Cache Service
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
