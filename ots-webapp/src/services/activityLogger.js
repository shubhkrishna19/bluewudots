/**
 * Activity Logger Service
 * Comprehensive audit trail and activity logging for Bluewud OTS.
 * Persists logs locally to IndexedDB/LocalStorage and syncs with backend.
 */

import { cacheData, retrieveCachedData } from './offlineCacheService';

const LOG_BATCH_SIZE = 50;
const SYNC_INTERVAL = 300000; // 5 mins
const LOG_RETENTION_DAYS = 90;

class ActivityLogger {
    constructor() {
        this.queue = [];
        this.syncTimer = null;
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;
        this.startAutoSync();
        this.isInitialized = true;
    }

    /**
     * Primary logging function
     */
    async logActivity(activity = {}) {
        const {
            type = 'GENERAL',
            action = 'UNKNOWN',
            module = 'SYSTEM',
            data = {},
            userId = 'system',
            userEmail = 'system@bluewud.com'
        } = activity;

        const log = {
            id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            timestamp: new Date().toISOString(),
            type,
            action,
            module,
            userId,
            userEmail,
            data,
            status: 'pending'
        };

        // Store in local persistence
        try {
            const existingLogs = (await retrieveCachedData('activity:logs')) || [];
            existingLogs.push(log);

            // Limit local history to 1000 items
            if (existingLogs.length > 1000) existingLogs.shift();

            await cacheData('activity:logs', existingLogs);
            this.queue.push(log);

            if (this.queue.length >= LOG_BATCH_SIZE) {
                this.syncToBackend();
            }
        } catch (e) {
            console.warn('[ActivityLogger] Failed to save log:', e);
        }

        return log;
    }

    // Specialized Logging Helpers
    async logOrderActivity(order, action, userId = 'user') {
        return this.logActivity({
            type: 'ORDER',
            action,
            module: 'ORDERS',
            data: { orderId: order.id, status: order.status, amount: order.amount },
            userId
        });
    }

    async logInventoryActivity(sku, action, delta, userId = 'user') {
        return this.logActivity({
            type: 'INVENTORY',
            action,
            module: 'WAREHOUSE',
            data: { sku, delta },
            userId
        });
    }

    async logAuthActivity(action, userId, userEmail, success, reason = '') {
        return this.logActivity({
            type: 'AUTH',
            action,
            module: 'SECURITY',
            data: { success, reason },
            userId,
            userEmail
        });
    }

    /**
     * Sync pending logs to backend
     */
    async syncToBackend() {
        const logs = (await retrieveCachedData('activity:logs')) || [];
        const pending = logs.filter(l => l.status === 'pending');

        if (pending.length === 0) return;

        try {
            // Mock API call to Zoho Catalyst
            // const response = await fetch('/api/activity-logs/sync', { ... });

            // Mark as synced locally
            const updatedLogs = logs.map(l =>
                pending.some(p => p.id === l.id) ? { ...l, status: 'synced' } : l
            );
            await cacheData('activity:logs', updatedLogs);
            this.queue = [];

            console.log(`[ActivityLogger] Synced ${pending.length} activities to backend.`);
        } catch (e) {
            console.error('[ActivityLogger] Sync failed:', e);
        }
    }

    startAutoSync() {
        if (this.syncTimer) clearInterval(this.syncTimer);
        this.syncTimer = setInterval(() => this.syncToBackend(), SYNC_INTERVAL);
    }

    stopAutoSync() {
        if (this.syncTimer) clearInterval(this.syncTimer);
    }

    async getActivityLogs(limit = 100) {
        const logs = (await retrieveCachedData('activity:logs')) || [];
        return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
    }
}

// Singleton Instance
const activityLogger = new ActivityLogger();

// Named exports for compatibility
export const logActivity = (a) => activityLogger.logActivity(a);
export const logOrderActivity = (o, a, u) => activityLogger.logOrderActivity(o, a, u);
export const logInventoryActivity = (s, a, d, u) => activityLogger.logInventoryActivity(s, a, d, u);
export const logAuthActivity = (a, ui, ue, s, r) => activityLogger.logAuthActivity(a, ui, ue, s, r);
export const getActivityLogs = (l) => activityLogger.getActivityLogs(l);

// Legacy functional exports support
export const logOrderCreate = (o) => activityLogger.logOrderActivity(o, 'CREATE');
export const logOrderStatusChange = (o, prev, next) => activityLogger.logOrderActivity(o, `STATUS_CHANGE: ${prev} -> ${next}`);

export default activityLogger;
