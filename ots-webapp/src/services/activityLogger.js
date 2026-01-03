/**
 * Activity Logger Service
 * Comprehensive audit trail and activity logging for Bluewud OTS.
 * Persists logs locally to IndexedDB/LocalStorage and syncs with backend.
 */

import { cacheData, retrieveCachedData } from './offlineCacheService';

const LOG_BATCH_SIZE = 50;
const SYNC_INTERVAL = 300000; // 5 mins
const LOG_RETENTION_DAYS = 90;

export const ACTIVITY_TYPES = {
    ORDER_CREATE: 'order_create',
    ORDER_UPDATE: 'order_update',
    STATUS_CHANGE: 'status_change',
    BULK_UPDATE: 'bulk_update',
    CARRIER_ASSIGN: 'carrier_assign',
    LABEL_GENERATE: 'label_generate',
    IMPORT_COMPLETE: 'import_complete',
    EXPORT: 'export',
    USER_LOGIN: 'user_login',
    USER_LOGOUT: 'user_logout',
    INVENTORY_ADJUST: 'inventory_adjust',
    STOCK_TRANSFER: 'stock_transfer'
};

class ActivityLogger {
    constructor() {
        this.queue = [];
        this.syncTimer = null;
        this.isInitialized = false;
        this.localLogs = [];
    }

    async initialize(initialLogs = null) {
        if (this.isInitialized && !initialLogs) return;
        if (initialLogs) {
            this.localLogs = initialLogs;
        } else {
            this.localLogs = (await retrieveCachedData('activityLog')) || [];
        }
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
            entityId = null,
            entityType = null,
            userId = 'system',
            userEmail = 'system@bluewud.com'
        } = activity;

        const log = {
            id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            timestamp: new Date().toISOString(),
            type,
            action,
            module,
            entityId,
            entityType,
            userId,
            userEmail,
            data,
            status: 'pending'
        };

        // Store in local persistence
        try {
            this.localLogs.push(log);
            if (this.localLogs.length > 2000) this.localLogs.shift();
            await cacheData('activityLog', this.localLogs);

            this.queue.push(log);
            if (this.queue.length >= LOG_BATCH_SIZE) {
                this.syncToBackend();
            }
        } catch (e) {
            console.warn('[ActivityLogger] Failed to save log:', e);
        }

        return log;
    }

    // Specialized Helpers
    async logOrderActivity(order, action, userId = 'user') {
        return this.logActivity({
            type: ACTIVITY_TYPES.ORDER_UPDATE,
            action,
            module: 'ORDERS',
            entityId: order.id,
            entityType: 'order',
            data: { status: order.status, amount: order.amount },
            userId
        });
    }

    async logInventoryActivity(sku, action, delta, userId = 'user') {
        return this.logActivity({
            type: ACTIVITY_TYPES.INVENTORY_ADJUST,
            action,
            module: 'WAREHOUSE',
            entityId: sku,
            entityType: 'sku',
            data: { delta },
            userId
        });
    }

    /**
     * Sync pending logs to backend
     */
    async syncToBackend() {
        const pending = this.localLogs.filter(l => l.status === 'pending');
        if (pending.length === 0) return;

        try {
            // Mock API Sync
            // await fetch('/api/logs/sync', { ... });

            pending.forEach(l => l.status = 'synced');
            await cacheData('activityLog', this.localLogs);
            this.queue = [];
            console.log(`[ActivityLogger] Synced ${pending.length} activities.`);
        } catch (e) {
            console.error('[ActivityLogger] Sync failed:', e);
        }
    }

    startAutoSync() {
        if (this.syncTimer) clearInterval(this.syncTimer);
        this.syncTimer = setInterval(() => this.syncToBackend(), SYNC_INTERVAL);
    }

    async getActivityLogs(filters = {}) {
        let result = [...this.localLogs];
        if (filters.type) result = result.filter(a => a.type === filters.type);
        if (filters.entityId) result = result.filter(a => a.entityId === filters.entityId);
        if (filters.limit) result = result.slice(-filters.limit);
        return result.reverse();
    }
}

const instance = new ActivityLogger();
instance.initialize();

// Functional Exports
export const logActivity = (a) => instance.logActivity(a);
export const getActivityLog = (f) => instance.getActivityLogs(f);
export const logOrderCreate = (o) => instance.logOrderActivity(o, 'Order Created');
export const logOrderStatusChange = (o, prev, next) => instance.logOrderActivity(o, `Status Change: ${prev} -> ${next}`);
export const logBulkUpdate = (ids, status) => instance.logActivity({ type: ACTIVITY_TYPES.BULK_UPDATE, action: `Bulk status ${status} for ${ids.length} orders` });
export const logCarrierAssign = (o, c) => instance.logOrderActivity(o, `Carrier Assigned: ${c}`);
export const logLabelGenerate = (o, type) => instance.logOrderActivity(o, `Label Generated: ${type}`);
export const logImportComplete = (s, c) => instance.logActivity({ type: ACTIVITY_TYPES.IMPORT_COMPLETE, action: `Imported ${c} orders from ${s}` });
export const logUserLogin = (u) => instance.logActivity({ type: ACTIVITY_TYPES.USER_LOGIN, action: `Login: ${u.email}`, entityId: u.id, entityType: 'user' });
export const logUserLogout = (u) => instance.logActivity({ type: ACTIVITY_TYPES.USER_LOGOUT, action: `Logout: ${u?.email}`, entityId: u?.id, entityType: 'user' });
export const initializeActivityLog = (l) => instance.initialize(l);
export const getActivityLogInstance = () => instance;

export default {
    ACTIVITY_TYPES,
    logActivity,
    getActivityLog,
    logOrderCreate,
    logOrderStatusChange,
    logBulkUpdate,
    logCarrierAssign,
    logLabelGenerate,
    logImportComplete,
    logUserLogin,
    logUserLogout,
    initializeActivityLog
};
