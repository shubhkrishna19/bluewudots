import React, { useState, useEffect } from 'react';

const MOCK_NOTIFICATIONS = [
    { id: 1, type: 'success', title: 'Order Delivered', message: 'BW-9901 delivered to Mumbai', time: '2 mins ago', read: false },
    { id: 2, type: 'warning', title: 'Carrier Delay', message: 'Delhivery shipments delayed by 24hrs in North Zone', time: '15 mins ago', read: false },
    { id: 3, type: 'info', title: 'New Import', message: '12 orders synced from Amazon', time: '1 hour ago', read: true },
    { id: 4, type: 'success', title: 'Dispatch Complete', message: 'Batch #45 dispatched via BlueDart', time: '2 hours ago', read: true },
    { id: 5, type: 'danger', title: 'RTO Alert', message: 'BW-9856 returned - Address incomplete', time: '3 hours ago', read: false }
];

const NotificationCenter = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [filter, setFilter] = useState('all');

    const unreadCount = notifications.filter(n => !n.read).length;

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !n.read;
        return n.type === filter;
    });

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'danger': return '🚨';
            case 'info': return 'ℹ️';
            default: return '📬';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'success': return 'var(--success)';
            case 'warning': return 'var(--warning)';
            case 'danger': return 'var(--danger)';
            case 'info': return 'var(--info)';
            default: return 'var(--primary)';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="notification-overlay" style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '400px',
            background: 'var(--bg-main)',
            borderLeft: '1px solid var(--glass-border)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div className="notification-header glass" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3>Notifications</h3>
                    {unreadCount > 0 && <span className="badge" style={{ background: 'var(--danger)', marginLeft: '8px' }}>{unreadCount} new</span>}
                </div>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>

            <div className="notification-filters" style={{ padding: '12px 20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['all', 'unread', 'success', 'warning', 'danger'].map(f => (
                    <button
                        key={f}
                        className={`btn-secondary glass-hover ${filter === f ? 'active' : ''}`}
                        style={{
                            padding: '6px 12px',
                            fontSize: '0.75rem',
                            background: filter === f ? 'var(--primary)' : 'transparent'
                        }}
                        onClick={() => setFilter(f)}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            <div className="notification-list" style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                {filteredNotifications.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <p className="text-muted">No notifications</p>
                    </div>
                ) : (
                    filteredNotifications.map(notif => (
                        <div
                            key={notif.id}
                            className={`notification-item glass glass-hover ${!notif.read ? 'unread' : ''}`}
                            style={{
                                padding: '16px',
                                marginBottom: '8px',
                                borderRadius: '8px',
                                borderLeft: `4px solid ${getTypeColor(notif.type)}`,
                                opacity: notif.read ? 0.7 : 1,
                                cursor: 'pointer'
                            }}
                            onClick={() => markAsRead(notif.id)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <span style={{ fontSize: '1.2rem' }}>{getTypeIcon(notif.type)}</span>
                                    <div>
                                        <p style={{ fontWeight: '700', marginBottom: '4px' }}>{notif.title}</p>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{notif.message}</p>
                                    </div>
                                </div>
                                {!notif.read && <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></div>}
                            </div>
                            <p className="text-muted" style={{ fontSize: '0.7rem', marginTop: '8px' }}>{notif.time}</p>
                        </div>
                    ))
                )}
            </div>

            <div className="notification-footer glass" style={{ padding: '16px 20px' }}>
                <button className="btn-secondary glass-hover" style={{ width: '100%' }} onClick={markAllRead}>
                    Mark All as Read
                </button>
            </div>
        </div>
    );
};

export default NotificationCenter;
