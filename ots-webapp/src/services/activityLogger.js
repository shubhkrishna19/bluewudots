import { cacheData } from './offlineCacheService';

/**
 * Activity Logger - Audit trail for all system actions
 * Integrates with UI components and will sync to backend
 */

// Activity types
export const ACTIVITY_TYPES = {
    // Order activities
    ORDER_CREATE: 'order.create',
    ORDER_UPDATE: 'order.update',
    ORDER_STATUS_CHANGE: 'order.status_change',
    ORDER_BULK_UPDATE: 'order.bulk_update',
    ORDER_DELETE: 'order.delete',

    // Import/Export
    IMPORT_START: 'import.start',
    IMPORT_COMPLETE: 'import.complete',
    IMPORT_ERROR: 'import.error',
    EXPORT_DATA: 'export.data',

    // Carrier activities
    CARRIER_ASSIGN: 'carrier.assign',
    LABEL_GENERATE: 'carrier.label_generate',
    AWB_CREATE: 'carrier.awb_create',

    // Inventory
    STOCK_UPDATE: 'inventory.update',
    STOCK_ALERT: 'inventory.alert',

    // User activities
    USER_LOGIN: 'user.login',
    USER_LOGOUT: 'user.logout',
    USER_SETTINGS_CHANGE: 'user.settings_change',

    // System
    SYSTEM_ERROR: 'system.error',
    API_CALL: 'system.api_call'
};

// In-memory activity log (will be replaced by backend)
let activityLog = [];
const MAX_LOG_SIZE = 500;

/**
 * Log an activity
 * @param {object} params 
 * @returns {object} - Activity record
 */
export const logActivity = ({
    type,
    action,
    entityType = null,
    entityId = null,
    details = {},
    user = null,
    previousValue = null,
    newValue = null
}) => {
    const activity = {
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        action,
        entityType,
        entityId,
        details,
        user: user || getCurrentUser(),
        previousValue,
        newValue,
        timestamp: new Date().toISOString(),
        ip: null, // Would be set server-side
        userAgent: navigator.userAgent
    };

    activityLog.unshift(activity);

    // Trim log size
    if (activityLog.length > MAX_LOG_SIZE) {
        activityLog = activityLog.slice(0, MAX_LOG_SIZE);
    }

    // Async sync to backend (fire and forget)
    syncToBackend(activity);

    return activity;
};

/**
 * Get current user from localStorage (simplified)
 */
const getCurrentUser = () => {
    try {
        const user = JSON.parse(localStorage.getItem('bluewud_user') || '{}');
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
    } catch {
        return { id: null, name: 'System', email: null, role: 'system' };
    }
};

/**
 * Sync activity to backend and local cache
 * @param {object} activity 
 */
const syncToBackend = async (activity) => {
    // 1. Persist to high-speed local cache (IndexedDB)
    cacheData('activityLog', activity);

    // 2. Future: Sync with Zoho Catalyst
    // try {
    //     await fetch('/server/activity', { ... });
    // } catch (e) { ... }
};

/**
 * Get activity log with filters
 * @param {object} filters 
 * @returns {object[]}
 */
export const getActivityLog = (filters = {}) => {
    let result = [...activityLog];

    if (filters.type) {
        result = result.filter(a => a.type === filters.type);
    }
    if (filters.entityType) {
        result = result.filter(a => a.entityType === filters.entityType);
    }
    if (filters.entityId) {
        result = result.filter(a => a.entityId === filters.entityId);
    }
    if (filters.userId) {
        result = result.filter(a => a.user?.id === filters.userId);
    }
    if (filters.startDate) {
        result = result.filter(a => new Date(a.timestamp) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
        result = result.filter(a => new Date(a.timestamp) <= new Date(filters.endDate));
    }
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(a =>
            a.action.toLowerCase().includes(searchLower) ||
            a.entityId?.toLowerCase().includes(searchLower) ||
            JSON.stringify(a.details).toLowerCase().includes(searchLower)
        );
    }
    if (filters.limit) {
        result = result.slice(0, filters.limit);
    }

    return result;
};

/**
 * Get activity for a specific entity
 * @param {string} entityType 
 * @param {string} entityId 
 * @returns {object[]}
 */
export const getEntityHistory = (entityType, entityId) => {
    return getActivityLog({ entityType, entityId });
};

/**
 * Clear activity log (admin only)
 */
export const clearActivityLog = () => {
    activityLog = [];
};

/**
 * Initialize activity log (used on app load)
 */
export const initializeActivityLog = (logs) => {
    activityLog = logs || [];
};

// ============================================
// CONVENIENCE METHODS
// ============================================

export const logOrderCreate = (order) => {
    return logActivity({
        type: ACTIVITY_TYPES.ORDER_CREATE,
        action: `Created order ${order.id}`,
        entityType: 'order',
        entityId: order.id,
        details: {
            customer: order.customerName,
            source: order.source,
            amount: order.amount
        },
        newValue: order
    });
};

export const logOrderStatusChange = (order, previousStatus, newStatus, reason = '') => {
    return logActivity({
        type: ACTIVITY_TYPES.ORDER_STATUS_CHANGE,
        action: `Changed order ${order.id} status: ${previousStatus} → ${newStatus}`,
        entityType: 'order',
        entityId: order.id,
        details: { reason },
        previousValue: previousStatus,
        newValue: newStatus
    });
};

export const logBulkUpdate = (orderIds, status) => {
    return logActivity({
        type: ACTIVITY_TYPES.ORDER_BULK_UPDATE,
        action: `Bulk updated ${orderIds.length} orders to ${status}`,
        entityType: 'order',
        details: { orderIds, status, count: orderIds.length }
    });
};

export const logCarrierAssign = (order, carrier) => {
    return logActivity({
        type: ACTIVITY_TYPES.CARRIER_ASSIGN,
        action: `Assigned ${carrier} to order ${order.id}`,
        entityType: 'order',
        entityId: order.id,
        details: { carrier }
    });
};

export const logLabelGenerate = (order, awb) => {
    return logActivity({
        type: ACTIVITY_TYPES.LABEL_GENERATE,
        action: `Generated label for ${order.id}. AWB: ${awb}`,
        entityType: 'order',
        entityId: order.id,
        details: { awb, carrier: order.carrier }
    });
};

export const logImportComplete = (source, count, errors = 0) => {
    return logActivity({
        type: ACTIVITY_TYPES.IMPORT_COMPLETE,
        action: `Imported ${count} orders from ${source}`,
        details: { source, count, errors }
    });
};

export const logExport = (type, count) => {
    return logActivity({
        type: ACTIVITY_TYPES.EXPORT_DATA,
        action: `Exported ${count} records as ${type}`,
        details: { type, count }
    });
};

export const logUserLogin = (user) => {
    return logActivity({
        type: ACTIVITY_TYPES.USER_LOGIN,
        action: `User ${user.email} logged in`,
        entityType: 'user',
        entityId: user.id,
        details: { email: user.email, role: user.role }
    });
};

export const logUserLogout = (user) => {
    return logActivity({
        type: ACTIVITY_TYPES.USER_LOGOUT,
        action: `User ${user.email} logged out`,
        entityType: 'user',
        entityId: user.id
    });
};

export default {
    ACTIVITY_TYPES,
    logActivity,
    getActivityLog,
    getEntityHistory,
    clearActivityLog,
    logOrderCreate,
    logOrderStatusChange,
    logBulkUpdate,
    logCarrierAssign,
    logLabelGenerate,
    logImportComplete,
    logExport,
    logUserLogin,
    logUserLogout
};
