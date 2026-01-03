import whatsappService from './whatsappService';
import { sendLocalNotification } from './pushNotificationService';

/**
 * Notification Service - Centralized notification management
 * Handles in-app notifications, with hooks for future email/SMS/WhatsApp
 */

// Notification types with metadata
export const NOTIFICATION_TYPES = {
    ORDER_CREATED: {
        type: 'order_created',
        icon: '📦',
        color: 'var(--primary)',
        priority: 'normal'
    },
    ORDER_SHIPPED: {
        type: 'order_shipped',
        icon: '🚚',
        color: 'var(--info)',
        priority: 'normal'
    },
    ORDER_DELIVERED: {
        type: 'order_delivered',
        icon: '✅',
        color: 'var(--success)',
        priority: 'low'
    },
    ORDER_RTO: {
        type: 'order_rto',
        icon: '↩️',
        color: 'var(--danger)',
        priority: 'high'
    },
    LOW_STOCK: {
        type: 'low_stock',
        icon: '⚠️',
        color: 'var(--warning)',
        priority: 'high'
    },
    CARRIER_ISSUE: {
        type: 'carrier_issue',
        icon: '🔴',
        color: 'var(--danger)',
        priority: 'critical'
    },
    COD_PENDING: {
        type: 'cod_pending',
        icon: '💰',
        color: 'var(--warning)',
        priority: 'high'
    },
    SYSTEM_ALERT: {
        type: 'system_alert',
        icon: '🔔',
        color: 'var(--primary)',
        priority: 'normal'
    },
    BULK_IMPORT: {
        type: 'bulk_import',
        icon: '📥',
        color: 'var(--success)',
        priority: 'normal'
    }
};

// In-memory notification store (will be replaced by context/backend)
let notifications = [];
let listeners = [];

/**
 * Create a notification
 * @param {object} params 
 * @returns {object} - Created notification
 */
export const createNotification = ({
    type,
    title,
    message,
    data = {},
    userId = null
}) => {
    const typeInfo = NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.SYSTEM_ALERT;

    const notification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: typeInfo.type,
        icon: typeInfo.icon,
        color: typeInfo.color,
        priority: typeInfo.priority,
        title,
        message,
        data,
        userId,
        createdAt: new Date().toISOString(),
        read: false
    };

    notifications.unshift(notification);

    // Keep only last 100 notifications
    if (notifications.length > 100) {
        notifications = notifications.slice(0, 100);
    }

    // Notify listeners
    listeners.forEach(callback => callback(notification));

    return notification;
};

/**
 * Get all notifications
 * @param {object} filters 
 * @returns {object[]}
 */
export const getNotifications = (filters = {}) => {
    let result = [...notifications];

    if (filters.unreadOnly) {
        result = result.filter(n => !n.read);
    }
    if (filters.type) {
        result = result.filter(n => n.type === filters.type);
    }
    if (filters.priority) {
        result = result.filter(n => n.priority === filters.priority);
    }
    if (filters.limit) {
        result = result.slice(0, filters.limit);
    }

    return result;
};

/**
 * Mark notification as read
 * @param {string} notificationId 
 */
export const markAsRead = (notificationId) => {
    const notif = notifications.find(n => n.id === notificationId);
    if (notif) {
        notif.read = true;
        notif.readAt = new Date().toISOString();
    }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = () => {
    const now = new Date().toISOString();
    notifications.forEach(n => {
        n.read = true;
        n.readAt = now;
    });
};

/**
 * Get unread count
 * @returns {number}
 */
export const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
};

/**
 * Subscribe to new notifications
 * @param {function} callback 
 * @returns {function} - Unsubscribe function
 */
export const subscribe = (callback) => {
    listeners.push(callback);
    return () => {
        listeners = listeners.filter(l => l !== callback);
    };
};

/**
 * Clear all notifications
 */
export const clearAll = () => {
    notifications = [];
};

// ============================================
// CONVENIENCE METHODS - Order Notifications
// ============================================

export const notifyOrderCreated = (order) => {
    const notif = createNotification({
        type: 'ORDER_CREATED',
        title: 'New Order',
        message: `Order ${order.id} created for ${order.customerName}`,
        data: { orderId: order.id }
    });

    // Send WhatsApp Confirmation
    whatsappService.sendOrderConfirmation(order);

    // Browser Push
    sendLocalNotification(`New Order: ${order.id}`, { body: `For ${order.customerName}` });

    return notif;
};

export const notifyOrderShipped = (order) => {
    const notif = createNotification({
        type: 'ORDER_SHIPPED',
        title: 'Order Shipped',
        message: `Order ${order.id} shipped via ${order.carrier}. AWB: ${order.awb}`,
        data: { orderId: order.id, awb: order.awb }
    });

    // WhatsApp Update
    whatsappService.sendShippingUpdate(order);

    // Browser Push
    sendLocalNotification(`Order Shipped: ${order.id}`, { body: `Carrier: ${order.carrier} | AWB: ${order.awb}` });

    return notif;
};

export const notifyOrderDelivered = (order) => {
    const notif = createNotification({
        type: 'ORDER_DELIVERED',
        title: 'Order Delivered',
        message: `Order ${order.id} delivered to ${order.city}`,
        data: { orderId: order.id }
    });

    // WhatsApp Update
    whatsappService.sendDeliveryConfirmation(order);

    // Browser Push
    sendLocalNotification(`Order Delivered: ${order.id}`, { body: `Successfully delivered to ${order.city}` });

    return notif;
};

export const notifyOrderRTO = (order, reason) => {
    const notif = createNotification({
        type: 'ORDER_RTO',
        title: 'RTO Initiated',
        message: `Order ${order.id} RTO: ${reason}`,
        data: { orderId: order.id, reason }
    });

    // WhatsApp Update
    whatsappService.sendRTOAlert(order);

    // Browser Push
    sendLocalNotification(`RTO Alert: ${order.id}`, { body: `Reason: ${reason}` });

    return notif;
};

export const notifyLowStock = (sku, currentStock, reorderLevel) => {
    return createNotification({
        type: 'LOW_STOCK',
        title: 'Low Stock Alert',
        message: `${sku} is below reorder level (${currentStock}/${reorderLevel})`,
        data: { sku, currentStock, reorderLevel }
    });
};

export const notifyBulkImport = (count, source) => {
    return createNotification({
        type: 'BULK_IMPORT',
        title: 'Bulk Import Complete',
        message: `${count} orders imported from ${source}`,
        data: { count, source }
    });
};

export const notifyCODPending = (count, amount) => {
    return createNotification({
        type: 'COD_PENDING',
        title: 'COD Pending',
        message: `${count} COD remittances pending (₹${amount.toLocaleString('en-IN')})`,
        data: { count, amount }
    });
};

export default {
    NOTIFICATION_TYPES,
    createNotification,
    getNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    subscribe,
    clearAll,
    notifyOrderCreated,
    notifyOrderShipped,
    notifyOrderDelivered,
    notifyOrderRTO,
    notifyLowStock,
    notifyBulkImport,
    notifyCODPending
};
