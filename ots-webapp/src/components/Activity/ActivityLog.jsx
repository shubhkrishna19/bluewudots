import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const ActivityLog = () => {
    const { orders } = useData();
    const [filter, setFilter] = useState('all');

    // Generate activity from orders
    const generateActivities = () => {
        const activities = [];

        orders.forEach(order => {
            activities.push({
                id: `act-${order.id}-create`,
                type: 'order_created',
                icon: '📦',
                title: 'Order Created',
                description: `${order.id} from ${order.source || 'Manual'}`,
                entity: order.id,
                user: 'System',
                timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString()
            });

            if (order.status === 'Carrier-Assigned' || order.status === 'In-Transit' || order.status === 'Delivered') {
                activities.push({
                    id: `act-${order.id}-carrier`,
                    type: 'carrier_assigned',
                    icon: '🚚',
                    title: 'Carrier Assigned',
                    description: `${order.id} assigned to Delhivery`,
                    entity: order.id,
                    user: 'Auto-Assign',
                    timestamp: new Date(Date.now() - Math.random() * 86400000 * 5).toISOString()
                });
            }

            if (order.status === 'In-Transit' || order.status === 'Delivered') {
                activities.push({
                    id: `act-${order.id}-dispatch`,
                    type: 'dispatched',
                    icon: '📤',
                    title: 'Order Dispatched',
                    description: `${order.id} picked up from warehouse`,
                    entity: order.id,
                    user: 'Warehouse Team',
                    timestamp: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString()
                });
            }

            if (order.status === 'Delivered') {
                activities.push({
                    id: `act-${order.id}-deliver`,
                    type: 'delivered',
                    icon: '✅',
                    title: 'Order Delivered',
                    description: `${order.id} delivered to ${order.city}`,
                    entity: order.id,
                    user: 'Carrier',
                    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
                });
            }
        });

        // Sort by timestamp (newest first)
        return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    };

    const activities = generateActivities();

    const filteredActivities = activities.filter(a => {
        if (filter === 'all') return true;
        return a.type === filter;
    });

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 3600000) return `${Math.floor(diff / 60000)} mins ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="activity-log animate-fade">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2>Activity Log</h2>
                    <p className="text-muted">System-wide audit trail</p>
                </div>
                <span className="badge" style={{ background: 'var(--primary)' }}>{activities.length} events</span>
            </div>

            <div className="activity-filters glass" style={{ padding: '16px 20px', marginTop: '24px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                    { key: 'all', label: 'All Activities' },
                    { key: 'order_created', label: '📦 Created' },
                    { key: 'carrier_assigned', label: '🚚 Assigned' },
                    { key: 'dispatched', label: '📤 Dispatched' },
                    { key: 'delivered', label: '✅ Delivered' }
                ].map(f => (
                    <button
                        key={f.key}
                        className="btn-secondary glass-hover"
                        style={{
                            padding: '8px 16px',
                            fontSize: '0.8rem',
                            background: filter === f.key ? 'var(--primary)' : 'transparent'
                        }}
                        onClick={() => setFilter(f.key)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="activity-timeline glass" style={{ marginTop: '24px', padding: '24px' }}>
                {filteredActivities.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <p className="text-muted">No activities found</p>
                    </div>
                ) : (
                    <div className="timeline" style={{ position: 'relative', paddingLeft: '40px' }}>
                        {/* Timeline Line */}
                        <div style={{
                            position: 'absolute',
                            left: '15px',
                            top: '20px',
                            bottom: '20px',
                            width: '2px',
                            background: 'var(--glass-border)'
                        }}></div>

                        {filteredActivities.slice(0, 50).map((activity, idx) => (
                            <div
                                key={activity.id}
                                className="timeline-item glass-hover"
                                style={{
                                    position: 'relative',
                                    padding: '16px 20px',
                                    marginBottom: '16px',
                                    borderRadius: '8px',
                                    marginLeft: '20px'
                                }}
                            >
                                {/* Timeline Dot */}
                                <div style={{
                                    position: 'absolute',
                                    left: '-32px',
                                    top: '20px',
                                    width: '24px',
                                    height: '24px',
                                    background: 'var(--bg-accent)',
                                    border: '2px solid var(--primary)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem'
                                }}>
                                    {activity.icon}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <p style={{ fontWeight: '700' }}>{activity.title}</p>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{activity.description}</p>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--primary)', marginTop: '8px' }}>By: {activity.user}</p>
                                    </div>
                                    <span className="text-muted" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{formatTime(activity.timestamp)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityLog;
