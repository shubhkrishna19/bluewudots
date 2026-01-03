import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const RTOManager = () => {
    const { orders, updateOrderStatus } = useData();
    const [selectedRTO, setSelectedRTO] = useState(null);

    // Filter live orders for RTO statuses
    const rtoOrders = orders.filter(o => o.status.startsWith('RTO'));

    const getReasonColor = (reason) => {
        switch (reason) {
            case 'Customer Refused': return 'var(--warning)';
            case 'Incorrect Address': return 'var(--danger)';
            case 'Damaged in Transit': return 'var(--info)';
            default: return 'var(--glass-border)';
        }
    };

    const totalRTOValue = rtoOrders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);

    const handleAction = (orderId, action) => {
        if (action === 'reattempt') {
            updateOrderStatus(orderId, 'Pending', { reason: 'Customer Re-attempt Requested' });
        } else if (action === 'refund') {
            updateOrderStatus(orderId, 'Cancelled', { reason: 'Refund Processed' });
        } else if (action === 'writeoff') {
            updateOrderStatus(orderId, 'Cancelled', { reason: 'RTO Write-off' });
        }
        setSelectedRTO(null);
    };

    return (
        <div className="rto-manager animate-fade">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2>RTO Management</h2>
                    <p className="text-muted">Return to Origin - Failed Deliveries</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span className="badge" style={{ background: 'var(--danger)', fontSize: '1rem', padding: '8px 16px' }}>
                        {rtoOrders.length} RTOs
                    </span>
                    <p className="text-muted" style={{ marginTop: '8px' }}>₹{totalRTOValue.toLocaleString('en-IN')} at risk</p>
                </div>
            </div>

            {/* RTO Stats */}
            <div className="rto-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px' }}>
                <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--warning)' }}>
                        {rtoOrders.filter(o => o.reason === 'Customer Refused').length}
                    </p>
                    <span className="text-muted">Customer Refused</span>
                </div>
                <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--danger)' }}>
                        {rtoOrders.filter(o => o.reason === 'Incorrect Address').length}
                    </p>
                    <span className="text-muted">Bad Address</span>
                </div>
                <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--info)' }}>
                        {rtoOrders.filter(o => o.reason === 'Damaged in Transit').length}
                    </p>
                    <span className="text-muted">Damaged</span>
                </div>
                <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>
                        {rtoOrders.reduce((sum, o) => sum + o.attemptCount, 0)}
                    </p>
                    <span className="text-muted">Total Attempts</span>
                </div>
            </div>

            {/* RTO List */}
            <div className="rto-list" style={{ marginTop: '32px' }}>
                {rtoOrders.map(rto => (
                    <div
                        key={rto.id}
                        className="rto-card glass glass-hover"
                        style={{
                            padding: '24px',
                            marginBottom: '16px',
                            borderLeft: `4px solid ${getReasonColor(rto.reason)}`,
                            cursor: 'pointer'
                        }}
                        onClick={() => setSelectedRTO(selectedRTO?.id === rto.id ? null : rto)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <h3 style={{ color: 'var(--primary)' }}>{rto.id}</h3>
                                    <span className="badge" style={{ background: getReasonColor(rto.reason), fontSize: '0.65rem' }}>
                                        {rto.reason}
                                    </span>
                                </div>
                                <p style={{ marginTop: '8px' }}>{rto.customer}</p>
                                <p className="text-muted" style={{ fontSize: '0.85rem' }}>{rto.city}, {rto.state}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>₹{parseFloat(rto.amount || 0).toLocaleString('en-IN')}</p>
                                <p className="text-muted" style={{ fontSize: '0.75rem' }}>RTO: {rto.lastUpdated ? new Date(rto.lastUpdated).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>

                        {selectedRTO?.id === rto.id && (
                            <div className="rto-details animate-fade" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
                                <div className="glass" style={{ padding: '16px', marginBottom: '16px' }}>
                                    <p className="text-muted" style={{ fontSize: '0.75rem' }}>CARRIER NOTES</p>
                                    <p style={{ marginTop: '4px' }}>{rto.carrierNotes}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button className="btn-primary glass-hover" style={{ flex: 1 }} onClick={(e) => { e.stopPropagation(); handleAction(rto.id, 'reattempt'); }}>
                                        🔄 Re-attempt Delivery
                                    </button>
                                    <button className="btn-secondary glass-hover" style={{ flex: 1 }} onClick={(e) => { e.stopPropagation(); handleAction(rto.id, 'refund'); }}>
                                        💰 Process Refund
                                    </button>
                                    <button className="btn-secondary glass-hover" style={{ padding: '0 16px' }} onClick={(e) => { e.stopPropagation(); handleAction(rto.id, 'writeoff'); }}>
                                        ❌
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {rtoOrders.length === 0 && (
                <div className="glass" style={{ padding: '60px', textAlign: 'center', marginTop: '24px' }}>
                    <p style={{ fontSize: '2rem', marginBottom: '12px' }}>🎉</p>
                    <p className="text-muted">No RTO orders - great job!</p>
                </div>
            )}
        </div>
    );
};

export default RTOManager;
