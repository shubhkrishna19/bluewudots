import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { getActivityLog, ACTIVITY_TYPES, clearActivityLog } from '../../services/activityLogger';
import { getRelativeTime, formatDateTimeIN } from '../../utils/dataUtils';

const ActivityLog = () => {
    const { orders } = useData();
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [activities, setActivities] = useState([]);

    // Fetch activities on mount and when filters change
    useEffect(() => {
        const fetchActivities = () => {
            let log = getActivityLog({
                type: filter !== 'all' ? filter : undefined,
                search: searchQuery || undefined,
                startDate: dateRange.start || undefined,
                endDate: dateRange.end || undefined,
                limit: 100
            });

            // If no logged activities, generate from orders for demo
            if (log.length === 0) {
                log = generateFromOrders();
            }

            setActivities(log);
        };

        fetchActivities();
    }, [filter, searchQuery, dateRange, orders]);

    // Generate activity from orders (fallback for demo)
    const generateFromOrders = () => {
        const generated = [];
        orders.forEach(order => {
            generated.push({
                id: `gen-${order.id}-create`,
                type: ACTIVITY_TYPES.ORDER_CREATE,
                action: `Created order ${order.id}`,
                entityType: 'order',
                entityId: order.id,
                details: { source: order.source, customer: order.customerName },
                user: { name: 'System', role: 'system' },
                timestamp: order.createdAt || new Date(Date.now() - Math.random() * 604800000).toISOString()
            });

            if (['Carrier-Assigned', 'In-Transit', 'Delivered'].includes(order.status) && order.carrier) {
                generated.push({
                    id: `gen-${order.id}-carrier`,
                    type: ACTIVITY_TYPES.CARRIER_ASSIGN,
                    action: `Assigned ${order.carrier} to ${order.id}`,
                    entityType: 'order',
                    entityId: order.id,
                    details: { carrier: order.carrier },
                    user: { name: 'Auto-Assign', role: 'system' },
                    timestamp: new Date(new Date(order.createdAt).getTime() + 3600000).toISOString()
                });
            }

            if (['In-Transit', 'Delivered'].includes(order.status) && order.awb) {
                generated.push({
                    id: `gen-${order.id}-label`,
                    type: ACTIVITY_TYPES.LABEL_GENERATE,
                    action: `Generated label for ${order.id}. AWB: ${order.awb}`,
                    entityType: 'order',
                    entityId: order.id,
                    details: { awb: order.awb },
                    user: { name: 'Warehouse', role: 'operator' },
                    timestamp: new Date(new Date(order.createdAt).getTime() + 7200000).toISOString()
                });
            }

            if (order.status === 'Delivered') {
                generated.push({
                    id: `gen-${order.id}-deliver`,
                    type: ACTIVITY_TYPES.ORDER_STATUS_CHANGE,
                    action: `Order ${order.id} delivered to ${order.city}`,
                    entityType: 'order',
                    entityId: order.id,
                    details: { status: 'Delivered' },
                    user: { name: 'Carrier', role: 'carrier' },
                    timestamp: new Date(new Date(order.createdAt).getTime() + 259200000).toISOString()
                });
            }
        });

        return generated.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    };

    const getActivityIcon = (type) => {
        const icons = {
            [ACTIVITY_TYPES.ORDER_CREATE]: '📦',
            [ACTIVITY_TYPES.ORDER_UPDATE]: '✏️',
            [ACTIVITY_TYPES.ORDER_STATUS_CHANGE]: '🔄',
            [ACTIVITY_TYPES.ORDER_BULK_UPDATE]: '📋',
            [ACTIVITY_TYPES.CARRIER_ASSIGN]: '🚚',
            [ACTIVITY_TYPES.LABEL_GENERATE]: '🏷️',
            [ACTIVITY_TYPES.AWB_CREATE]: '📄',
            [ACTIVITY_TYPES.IMPORT_COMPLETE]: '📥',
            [ACTIVITY_TYPES.EXPORT_DATA]: '📤',
            [ACTIVITY_TYPES.USER_LOGIN]: '👤',
            [ACTIVITY_TYPES.USER_LOGOUT]: '🚪',
            [ACTIVITY_TYPES.STOCK_UPDATE]: '📊',
            [ACTIVITY_TYPES.STOCK_ALERT]: '⚠️',
            [ACTIVITY_TYPES.SYSTEM_ERROR]: '❌'
        };
        return icons[type] || '📝';
    };

    const getActivityColor = (type) => {
        if (type?.includes('error')) return 'var(--danger)';
        if (type?.includes('create') || type?.includes('import')) return 'var(--success)';
        if (type?.includes('carrier') || type?.includes('label')) return 'var(--primary)';
        if (type?.includes('status')) return 'var(--info)';
        return 'var(--glass-border)';
    };

    const filterOptions = [
        { key: 'all', label: 'All Activities', icon: '📋' },
        { key: ACTIVITY_TYPES.ORDER_CREATE, label: 'Created', icon: '📦' },
        { key: ACTIVITY_TYPES.CARRIER_ASSIGN, label: 'Carrier', icon: '🚚' },
        { key: ACTIVITY_TYPES.LABEL_GENERATE, label: 'Labels', icon: '🏷️' },
        { key: ACTIVITY_TYPES.ORDER_STATUS_CHANGE, label: 'Status', icon: '🔄' },
        { key: ACTIVITY_TYPES.IMPORT_COMPLETE, label: 'Imports', icon: '📥' },
        { key: ACTIVITY_TYPES.EXPORT_DATA, label: 'Exports', icon: '📤' }
    ];

    return (
        <div className="activity-log animate-fade">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2>Activity Log</h2>
                    <p className="text-muted">Complete audit trail of all system actions</p>
                </div>
                <span className="badge" style={{ background: 'var(--primary)', padding: '8px 16px' }}>
                    {activities.length} events
                </span>
            </div>

            {/* Search and Filters */}
            <div className="activity-controls glass" style={{ padding: '20px', marginTop: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    {/* Search */}
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}>SEARCH</label>
                        <input
                            type="text"
                            placeholder="Search orders, users, actions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: '#fff' }}
                        />
                    </div>

                    {/* Date Range */}
                    <div>
                        <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}>FROM</label>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            style={{ padding: '10px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: '#fff' }}
                        />
                    </div>
                    <div>
                        <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}>TO</label>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            style={{ padding: '10px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: '#fff' }}
                        />
                    </div>

                    {/* Clear Button */}
                    <button
                        className="btn-secondary"
                        style={{ padding: '10px 16px' }}
                        onClick={() => {
                            setSearchQuery('');
                            setDateRange({ start: '', end: '' });
                            setFilter('all');
                        }}
                    >
                        Clear
                    </button>
                </div>

                {/* Type Filters */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                    {filterOptions.map(f => (
                        <button
                            key={f.key}
                            className="btn-secondary glass-hover"
                            style={{
                                padding: '8px 14px',
                                fontSize: '0.8rem',
                                background: filter === f.key ? 'var(--primary)' : 'transparent',
                                borderColor: filter === f.key ? 'var(--primary)' : 'var(--glass-border)'
                            }}
                            onClick={() => setFilter(f.key)}
                        >
                            {f.icon} {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Activity Timeline */}
            <div className="activity-timeline glass" style={{ marginTop: '24px', padding: '24px' }}>
                {activities.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                        <p style={{ fontSize: '2rem', marginBottom: '12px' }}>📋</p>
                        <p className="text-muted">No activities found matching your criteria</p>
                    </div>
                ) : (
                    <div className="timeline" style={{ position: 'relative', paddingLeft: '50px' }}>
                        {/* Timeline Line */}
                        <div style={{
                            position: 'absolute',
                            left: '20px',
                            top: '30px',
                            bottom: '30px',
                            width: '2px',
                            background: 'linear-gradient(to bottom, var(--primary), var(--glass-border))'
                        }}></div>

                        {activities.slice(0, 50).map((activity, idx) => (
                            <div
                                key={activity.id}
                                className="timeline-item glass-hover"
                                style={{
                                    position: 'relative',
                                    padding: '16px 20px',
                                    marginBottom: '16px',
                                    borderRadius: '10px',
                                    borderLeft: `3px solid ${getActivityColor(activity.type)}`,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {/* Timeline Dot */}
                                <div style={{
                                    position: 'absolute',
                                    left: '-42px',
                                    top: '20px',
                                    width: '28px',
                                    height: '28px',
                                    background: 'var(--bg-main)',
                                    border: `2px solid ${getActivityColor(activity.type)}`,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.9rem'
                                }}>
                                    {getActivityIcon(activity.type)}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: '700', marginBottom: '4px' }}>{activity.action}</p>
                                        {activity.entityId && (
                                            <span className="badge" style={{ background: 'var(--bg-accent)', fontSize: '0.7rem', marginRight: '8px' }}>
                                                {activity.entityType}: {activity.entityId}
                                            </span>
                                        )}
                                        {activity.details && Object.keys(activity.details).length > 0 && (
                                            <div style={{ marginTop: '8px' }}>
                                                {Object.entries(activity.details).slice(0, 3).map(([key, value]) => (
                                                    <span key={key} className="text-muted" style={{ fontSize: '0.8rem', marginRight: '12px' }}>
                                                        {key}: <strong>{String(value)}</strong>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <p style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '8px' }}>
                                            👤 {activity.user?.name || 'System'} ({activity.user?.role || 'system'})
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                                            {getRelativeTime(activity.timestamp)}
                                        </span>
                                        <p className="text-muted" style={{ fontSize: '0.7rem', marginTop: '4px' }}>
                                            {formatDateTimeIN(activity.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {activities.length > 50 && (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <p className="text-muted">Showing 50 of {activities.length} activities</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Stats Summary */}
            <div className="activity-stats glass" style={{ marginTop: '24px', padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '20px', textAlign: 'center' }}>
                    <div>
                        <p style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--success)' }}>
                            {activities.filter(a => a.type === ACTIVITY_TYPES.ORDER_CREATE).length}
                        </p>
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>Orders Created</span>
                    </div>
                    <div>
                        <p style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
                            {activities.filter(a => a.type === ACTIVITY_TYPES.CARRIER_ASSIGN).length}
                        </p>
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>Carriers Assigned</span>
                    </div>
                    <div>
                        <p style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--info)' }}>
                            {activities.filter(a => a.type === ACTIVITY_TYPES.LABEL_GENERATE).length}
                        </p>
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>Labels Generated</span>
                    </div>
                    <div>
                        <p style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent)' }}>
                            {activities.filter(a => a.type === ACTIVITY_TYPES.ORDER_STATUS_CHANGE).length}
                        </p>
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>Status Changes</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityLog;
