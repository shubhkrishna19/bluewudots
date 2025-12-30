import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const BulkActions = () => {
    const { orders, setOrders, updateOrderStatus } = useData();
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [bulkAction, setBulkAction] = useState('');

    const pendingOrders = orders.filter(o => o.status !== 'Delivered');

    const toggleSelect = (orderId) => {
        setSelectedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const selectAll = () => {
        if (selectedOrders.length === pendingOrders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(pendingOrders.map(o => o.id));
        }
    };

    const executeBulkAction = () => {
        if (!bulkAction || selectedOrders.length === 0) return;

        selectedOrders.forEach(orderId => {
            updateOrderStatus(orderId, bulkAction);
        });

        console.log(`Bulk action "${bulkAction}" applied to ${selectedOrders.length} orders`);
        setSelectedOrders([]);
        setBulkAction('');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Imported': return 'var(--text-muted)';
            case 'MTP-Applied': return 'var(--accent)';
            case 'Carrier-Assigned': return 'var(--primary)';
            case 'In-Transit': return 'var(--info)';
            case 'Delivered': return 'var(--success)';
            default: return 'var(--glass-border)';
        }
    };

    return (
        <div className="bulk-actions animate-fade">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2>Bulk Operations</h2>
                    <p className="text-muted">Mass update order statuses</p>
                </div>
                <span className="badge" style={{ background: 'var(--warning)' }}>{pendingOrders.length} Pending</span>
            </div>

            {/* Bulk Action Bar */}
            <div className="bulk-bar glass" style={{ padding: '20px', marginTop: '24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                    className="btn-secondary glass-hover"
                    style={{ padding: '10px 20px' }}
                    onClick={selectAll}
                >
                    {selectedOrders.length === pendingOrders.length ? 'Deselect All' : 'Select All'}
                </button>

                <div style={{ flex: 1, display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span className="badge" style={{ background: 'var(--primary)', fontSize: '0.9rem', padding: '8px 16px' }}>
                        {selectedOrders.length} selected
                    </span>
                </div>

                <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    style={{ padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff', minWidth: '200px' }}
                >
                    <option value="">Select Action...</option>
                    <option value="MTP-Applied">Apply MTP</option>
                    <option value="Carrier-Assigned">Assign Carrier</option>
                    <option value="In-Transit">Mark In Transit</option>
                    <option value="Delivered">Mark Delivered</option>
                </select>

                <button
                    className="btn-primary glass-hover"
                    style={{ padding: '12px 24px' }}
                    onClick={executeBulkAction}
                    disabled={!bulkAction || selectedOrders.length === 0}
                >
                    Execute ({selectedOrders.length})
                </button>
            </div>

            {/* Order Selection Grid */}
            <div className="orders-select-grid" style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {pendingOrders.map(order => (
                    <div
                        key={order.id}
                        className={`order-select-card glass glass-hover ${selectedOrders.includes(order.id) ? 'selected' : ''}`}
                        style={{
                            padding: '20px',
                            cursor: 'pointer',
                            borderLeft: selectedOrders.includes(order.id) ? '4px solid var(--primary)' : 'none',
                            background: selectedOrders.includes(order.id) ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                        }}
                        onClick={() => toggleSelect(order.id)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h4 style={{ color: 'var(--primary)' }}>{order.id}</h4>
                                <p className="text-muted" style={{ fontSize: '0.85rem' }}>{order.customer}</p>
                            </div>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '4px',
                                border: '2px solid var(--primary)',
                                background: selectedOrders.includes(order.id) ? 'var(--primary)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '0.8rem'
                            }}>
                                {selectedOrders.includes(order.id) && '✓'}
                            </div>
                        </div>
                        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="badge" style={{ background: getStatusColor(order.status), fontSize: '0.65rem' }}>{order.status}</span>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>{order.city}</span>
                        </div>
                    </div>
                ))}
            </div>

            {pendingOrders.length === 0 && (
                <div className="glass" style={{ padding: '60px', textAlign: 'center', marginTop: '24px' }}>
                    <p style={{ fontSize: '2rem', marginBottom: '12px' }}>🎉</p>
                    <p className="text-muted">All orders have been delivered!</p>
                </div>
            )}
        </div>
    );
};

export default BulkActions;
