/**
 * Notification Context - Unified Notification Hub
 * 
 * Provides a single React context to manage all notification channels:
 * - In-App Toasts
 * - Notification Center (sidebar panel)
 * - Web Push Notifications
 * - WhatsApp Business Alerts (mock)
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [toasts, setToasts] = useState([]); // For transient toast alerts

    // Initialize and subscribe
    useEffect(() => {
        // Load initial
        let initialNotifs = notificationService.getNotifications({ limit: 50 });

        // Seed demo data if empty (for MVP show)
        if (initialNotifs.length === 0) {
            seedDemoNotifications();
            initialNotifs = notificationService.getNotifications({ limit: 50 });
        }

        setNotifications(initialNotifs);
        setUnreadCount(notificationService.getUnreadCount());

        // Subscribe to live updates
        const unsubscribe = notificationService.subscribe((newNotif) => {
            setNotifications(prev => [newNotif, ...prev.slice(0, 49)]);
            setUnreadCount(prev => prev + 1);

            // Auto-show a toast for high-priority items
            if (newNotif.priority === 'high' || newNotif.priority === 'critical') {
                showToast(newNotif);
            }
        });

        return () => unsubscribe();
    }, []);

    const seedDemoNotifications = () => {
        notificationService.createNotification({
            type: 'ORDER_DELIVERED',
            title: 'Order Delivered',
            message: 'BW-9901 delivered to Mumbai successfully',
            data: { orderId: 'BW-9901' },
            priority: 'low'
        });
        notificationService.createNotification({
            type: 'ORDER_SHIPPED',
            title: 'Order Shipped',
            message: 'BW-9902 picked up by BlueDart. AWB: BD987654321',
            data: { orderId: 'BW-9902', awb: 'BD987654321' },
            priority: 'normal'
        });
        notificationService.createNotification({
            type: 'CARRIER_ISSUE',
            title: 'Carrier Delay Alert',
            message: 'Delhivery shipments delayed in North Zone due to weather',
            data: { carrier: 'Delhivery', zone: 'NORTH' },
            priority: 'critical'
        });
        notificationService.createNotification({
            type: 'LOW_STOCK',
            title: 'Low Stock Alert',
            message: 'BL-DESK-01 is below reorder level (8/15 units)',
            data: { sku: 'BL-DESK-01', currentStock: 8, reorderLevel: 15 },
            priority: 'high'
        });
    };

    /**
     * Show a transient toast notification
     */
    const showToast = useCallback((notification) => {
        const toastId = `toast-${Date.now()}`;
        const toast = { ...notification, toastId };

        setToasts(prev => [...prev, toast]);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.toastId !== toastId));
        }, 5000);
    }, []);

    /**
     * Dismiss a specific toast
     */
    const dismissToast = useCallback((toastId) => {
        setToasts(prev => prev.filter(t => t.toastId !== toastId));
    }, []);

    /**
     * Mark a notification as read
     */
    const markRead = useCallback((notificationId) => {
        notificationService.markAsRead(notificationId);
        setNotifications(prev => prev.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
        ));
        setUnreadCount(notificationService.getUnreadCount());
    }, []);

    /**
     * Mark all as read
     */
    const markAllRead = useCallback(() => {
        notificationService.markAllAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    }, []);

    /**
     * Push a custom notification (from UI)
     */
    const pushNotification = useCallback((type, title, message, data = {}) => {
        return notificationService.createNotification({ type, title, message, data });
    }, []);

    const value = {
        notifications,
        unreadCount,
        toasts,

        showToast,
        dismissToast,
        markRead,
        markAllRead,
        pushNotification
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            {/* Toast Container */}
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </NotificationContext.Provider>
    );
};

/**
 * Toast Container Component
 */
const ToastContainer = ({ toasts, onDismiss }) => {
    if (toasts.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '380px'
        }}>
            {toasts.map(toast => (
                <div
                    key={toast.toastId}
                    className="glass animate-fade"
                    style={{
                        padding: '16px 20px',
                        borderLeft: `4px solid ${toast.color || 'var(--primary)'}`,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                    }}
                >
                    <span style={{ fontSize: '1.4rem' }}>{toast.icon || '🔔'}</span>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 700, marginBottom: '4px' }}>{toast.title}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{toast.message}</p>
                    </div>
                    <button
                        onClick={() => onDismiss(toast.toastId)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export default NotificationContext;
