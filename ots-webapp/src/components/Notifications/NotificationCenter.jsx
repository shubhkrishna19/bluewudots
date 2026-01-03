import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { getRelativeTime } from '../../utils/dataUtils';
import { NOTIFICATION_TYPES } from '../../services/notificationService';

const NotificationCenter = ({ isOpen, onClose }) => {
    const {
        notifications,
        unreadCount,
        markRead,
        markAllRead,
        pushNotification
    } = useNotifications();

    const [filter, setFilter] = useState('all');

    const handleMarkAsRead = (id) => {
        markRead(id);
    };

    const handleMarkAllRead = () => {
        markAllRead();
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !n.read;
        if (filter === 'critical') return n.priority === 'critical' || n.priority === 'high';
        return n.type === filter;
    });

    const getTypeColor = (type, priority) => {
        if (priority === 'critical') return 'var(--danger)';
        if (priority === 'high') return 'var(--warning)';

        const typeColors = {
            'order_created': 'var(--primary)',
            'order_shipped': 'var(--info)',
            'order_delivered': 'var(--success)',
            'order_rto': 'var(--danger)',
            'low_stock': 'var(--warning)',
            'carrier_issue': 'var(--danger)',
            'cod_pending': 'var(--warning)',
            'bulk_import': 'var(--success)',
            'system_alert': 'var(--primary)'
        };
        return typeColors[type] || 'var(--glass-border)';
    };

    if (!isOpen) return null;

    return (
        <div className="notification-overlay animate-fade" style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '420px',
            background: 'var(--bg-main)',
            borderLeft: '1px solid var(--glass-border)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-5px 0 30px rgba(0,0,0,0.3)'
        }}>
            {/* Header */}
            <div className="notification-header glass" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        🔔 Notifications
                        {unreadCount > 0 && (
                            <span className="badge" style={{
                                background: 'var(--danger)',
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                animation: 'pulse 2s infinite'
                            }}>
                                {unreadCount} new
                            </span>
                        )}
                    </h3>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        padding: '4px 10px',
                        borderRadius: '4px'
                    }}
                    className="glass-hover"
                >
                    ×
                </button>
            </div>

            {/* Filters */}
            <div className="notification-filters" style={{ padding: '12px 20px', display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid var(--glass-border)' }}>
                {[
                    { key: 'all', label: 'All', icon: '📋' },
                    { key: 'unread', label: 'Unread', icon: '🔵' },
                    { key: 'critical', label: 'Critical', icon: '🚨' },
                    { key: 'order_delivered', label: 'Delivered', icon: '✅' },
                    { key: 'order_rto', label: 'RTO', icon: '↩️' }
                ].map(f => (
                    <button
                        key={f.key}
                        className="btn-secondary glass-hover"
                        style={{
                            padding: '6px 12px',
                            fontSize: '0.75rem',
                            background: filter === f.key ? 'var(--primary)' : 'transparent'
                        }}
                        onClick={() => setFilter(f.key)}
                    >
                        {f.icon} {f.label}
                    </button>
                ))}
            </div>

            {/* Notification List */}
            <div className="notification-list" style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                {filteredNotifications.length === 0 ? (
                    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                        <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔕</p>
                        <p className="text-muted">No notifications to show</p>
                    </div>
                ) : (
                    filteredNotifications.map(notif => (
                        <div
                            key={notif.id}
                            className={`notification-item glass glass-hover ${!notif.read ? 'unread' : ''}`}
                            style={{
                                padding: '16px',
                                marginBottom: '10px',
                                borderRadius: '10px',
                                borderLeft: `4px solid ${getTypeColor(notif.type, notif.priority)}`,
                                opacity: notif.read ? 0.7 : 1,
                                cursor: 'pointer',
                                background: !notif.read ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => handleMarkAsRead(notif.id)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                                    <span style={{ fontSize: '1.4rem' }}>{notif.icon}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <p style={{ fontWeight: '700' }}>{notif.title}</p>
                                            {notif.priority === 'critical' && (
                                                <span className="badge" style={{ background: 'var(--danger)', fontSize: '0.6rem', padding: '2px 6px' }}>
                                                    CRITICAL
                                                </span>
                                            )}
                                            {notif.priority === 'high' && (
                                                <span className="badge" style={{ background: 'var(--warning)', fontSize: '0.6rem', padding: '2px 6px' }}>
                                                    HIGH
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{notif.message}</p>

                                        {/* Action buttons for specific types */}
                                        {notif.data?.orderId && (
                                            <button
                                                className="btn-secondary glass-hover"
                                                style={{ marginTop: '10px', padding: '6px 12px', fontSize: '0.75rem' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log('View order:', notif.data.orderId);
                                                }}
                                            >
                                                View Order →
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {!notif.read && (
                                    <div style={{
                                        width: '10px',
                                        height: '10px',
                                        background: 'var(--primary)',
                                        borderRadius: '50%',
                                        flexShrink: 0
                                    }}></div>
                                )}
                            </div>
                            <p className="text-muted" style={{ fontSize: '0.7rem', marginTop: '10px' }}>
                                {getRelativeTime(notif.createdAt)}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="notification-footer glass" style={{ padding: '16px 20px', display: 'flex', gap: '10px' }}>
                <button
                    className="btn-secondary glass-hover"
                    style={{ flex: 1 }}
                    onClick={handleMarkAllRead}
                    disabled={unreadCount === 0}
                >
                    ✓ Mark All Read
                </button>
                <button
                    className="btn-primary glass-hover"
                    style={{ flex: 1 }}
                    onClick={() => {
                        // Demo notification via context
                        pushNotification(
                            'SYSTEM_ALERT',
                            'Test Notification',
                            'This is a test notification created via context',
                            {}
                        );
                    }}
                >
                    🧪 Test
                </button>
            </div>
        </div>
    );
};

export default NotificationCenter;
