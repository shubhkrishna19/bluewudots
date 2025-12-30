import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ORDER_STATUSES, STATUS_META } from '../../services/orderStateMachine';

const BulkActions = () => {
    const { orders, bulkUpdateStatus } = useData();
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [bulkAction, setBulkAction] = useState('');
    const [actionReason, setActionReason] = useState('');
    const [results, setResults] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const pendingOrders = orders.filter(o => o.status !== 'Delivered' && !o.status.startsWith('RTO') && o.status !== 'Cancelled');

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

    const selectByStatus = (status) => {
        const filtered = pendingOrders.filter(o => o.status === status).map(o => o.id);
        setSelectedOrders(filtered);
    };

    const executeBulkAction = async () => {
        if (!bulkAction || selectedOrders.length === 0) return;

        setIsProcessing(true);
        setResults(null);

        // Simulate processing delay for UX
        await new Promise(resolve => setTimeout(resolve, 500));

        const result = bulkUpdateStatus(selectedOrders, bulkAction, {
            reason: actionReason,
            user: 'admin'
        });

        setResults(result);
        setIsProcessing(false);

        // Clear selection on success
        if (result.successful.length > 0) {
            setSelectedOrders(result.failed.map(f => f.orderId)); // Keep failed ones selected
            setBulkAction('');
            setActionReason('');
        }
    };

    const getStatusColor = (status) => {
        return STATUS_META[status]?.color || 'var(--glass-border)';
    };

    const getStatusIcon = (status) => {
        return STATUS_META[status]?.icon || '📦';
    };

    // Get available bulk actions based on common valid transitions
    const availableActions = [
        { value: ORDER_STATUSES.MTP_APPLIED, label: '📋 Apply MTP' },
        { value: ORDER_STATUSES.CARRIER_ASSIGNED, label: '🚚 Assign Carrier' },
        { value: ORDER_STATUSES.LABEL_GENERATED, label: '🏷️ Generate Label' },
        { value: ORDER_STATUSES.PICKED_UP, label: '📦 Mark Picked Up' },
        { value: ORDER_STATUSES.IN_TRANSIT, label: '🛣️ Mark In Transit' },
        { value: ORDER_STATUSES.DELIVERED, label: '✅ Mark Delivered' },
        { value: ORDER_STATUSES.ON_HOLD, label: '⏸️ Put On Hold' },
        { value: ORDER_STATUSES.CANCELLED, label: '❌ Cancel Orders' }
    ];

    return (
        <div className="bulk-actions animate-fade">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2>Bulk Operations</h2>
                    <p className="text-muted">Mass update order statuses with validation</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <span className="badge" style={{ background: 'var(--warning)', padding: '8px 16px' }}>
                        {pendingOrders.length} Actionable
                    </span>
                    <span className="badge" style={{ background: 'var(--primary)', padding: '8px 16px' }}>
                        {selectedOrders.length} Selected
                    </span>
                </div>
            </div>

            {/* Results Banner */}
            {results && (
                <div className="results-banner glass animate-fade" style={{
                    padding: '16px 20px',
                    marginTop: '20px',
                    borderLeft: `4px solid ${results.failed.length > 0 ? 'var(--warning)' : 'var(--success)'}`
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ color: 'var(--success)', fontWeight: '700' }}>
                                ✅ {results.successful.length} updated
                            </span>
                            {results.failed.length > 0 && (
                                <span style={{ color: 'var(--danger)', fontWeight: '700', marginLeft: '16px' }}>
                                    ⚠️ {results.failed.length} failed
                                </span>
                            )}
                        </div>
                        <button
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            onClick={() => setResults(null)}
                        >
                            Dismiss
                        </button>
                    </div>
                    {results.failed.length > 0 && (
                        <div style={{ marginTop: '12px', fontSize: '0.85rem' }}>
                            <p className="text-muted">Failed transitions:</p>
                            {results.failed.slice(0, 3).map(f => (
                                <p key={f.orderId} style={{ color: 'var(--danger)' }}>
                                    {f.orderId}: {f.error}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Bulk Action Bar */}
            <div className="bulk-bar glass" style={{ padding: '20px', marginTop: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                        className="btn-secondary glass-hover"
                        style={{ padding: '10px 20px' }}
                        onClick={selectAll}
                    >
                        {selectedOrders.length === pendingOrders.length ? '☐ Deselect All' : '☑ Select All'}
                    </button>

                    {/* Quick filters */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            className="btn-secondary glass-hover"
                            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                            onClick={() => selectByStatus('Pending')}
                        >
                            Pending
                        </button>
                        <button
                            className="btn-secondary glass-hover"
                            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                            onClick={() => selectByStatus('MTP-Applied')}
                        >
                            MTP
                        </button>
                        <button
                            className="btn-secondary glass-hover"
                            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                            onClick={() => selectByStatus('Carrier-Assigned')}
                        >
                            Assigned
                        </button>
                    </div>

                    <div style={{ flex: 1 }}></div>

                    <select
                        value={bulkAction}
                        onChange={(e) => setBulkAction(e.target.value)}
                        style={{
                            padding: '12px 16px',
                            background: 'var(--bg-accent)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            color: '#fff',
                            minWidth: '220px'
                        }}
                    >
                        <option value="">Select Action...</option>
                        {availableActions.map(action => (
                            <option key={action.value} value={action.value}>{action.label}</option>
                        ))}
                    </select>

                    <button
                        className="btn-primary glass-hover"
                        style={{ padding: '12px 28px', minWidth: '140px' }}
                        onClick={executeBulkAction}
                        disabled={!bulkAction || selectedOrders.length === 0 || isProcessing}
                    >
                        {isProcessing ? '⏳ Processing...' : `Execute (${selectedOrders.length})`}
                    </button>
                </div>

                {/* Optional reason input */}
                {bulkAction && (
                    <div style={{ marginTop: '16px' }}>
                        <input
                            type="text"
                            placeholder="Add reason/notes (optional)"
                            value={actionReason}
                            onChange={(e) => setActionReason(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: 'var(--bg-accent)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Order Selection Grid */}
            <div className="orders-select-grid" style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {pendingOrders.map(order => (
                    <div
                        key={order.id}
                        className={`order-select-card glass glass-hover ${selectedOrders.includes(order.id) ? 'selected' : ''}`}
                        style={{
                            padding: '20px',
                            cursor: 'pointer',
                            borderLeft: selectedOrders.includes(order.id) ? '4px solid var(--primary)' : `4px solid ${getStatusColor(order.status)}`,
                            background: selectedOrders.includes(order.id) ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                            transition: 'all 0.2s ease'
                        }}
                        onClick={() => toggleSelect(order.id)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h4 style={{ color: 'var(--primary)' }}>{order.id}</h4>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>via {order.source}</span>
                                </div>
                                <p style={{ marginTop: '4px' }}>{order.customerName || order.customer}</p>
                            </div>
                            <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                border: '2px solid var(--primary)',
                                background: selectedOrders.includes(order.id) ? 'var(--primary)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '1rem',
                                transition: 'all 0.2s ease'
                            }}>
                                {selectedOrders.includes(order.id) && '✓'}
                            </div>
                        </div>
                        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="badge" style={{ background: getStatusColor(order.status), fontSize: '0.7rem' }}>
                                {getStatusIcon(order.status)} {order.status}
                            </span>
                            <span className="text-muted" style={{ fontSize: '0.8rem' }}>{order.city}, {order.state}</span>
                        </div>
                        {order.carrier && (
                            <div style={{ marginTop: '8px' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    🚚 {order.carrier} {order.awb && `• ${order.awb}`}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {pendingOrders.length === 0 && (
                <div className="glass" style={{ padding: '60px', textAlign: 'center', marginTop: '24px' }}>
                    <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🎉</p>
                    <h3>All Clear!</h3>
                    <p className="text-muted">All orders have been processed</p>
                </div>
            )}
        </div>
    );
};

export default BulkActions;
