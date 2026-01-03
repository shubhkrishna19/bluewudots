import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const CODReconciliation = () => {
    const { orders } = useData();
    const [filter, setFilter] = useState('all');

    // Deriving COD Remittances from live orders
    const codRemittances = orders
        .filter(order => order.amount > 0) // Simplified filter for COD orders (in reality would check payment_mode)
        .map(order => {
            const isDelivered = order.status === 'Delivered';
            const isRTO = order.status.startsWith('RTO');

            let status = 'Pending';
            if (isDelivered) status = 'Collected';
            if (isRTO) status = 'Overdue'; // RTOs are considered overhead/overdue for cash reconciliation

            // Simulating days elapsed from createdAt
            const daysElapsed = Math.floor((new Date() - new Date(order.createdAt)) / (1000 * 60 * 60 * 24));
            if (daysElapsed > 5 && status !== 'Remitted') status = 'Overdue';

            return {
                id: `COD-${order.id}`,
                orderId: order.id,
                customer: order.customerName,
                carrier: order.carrier || 'Pending',
                codAmount: parseFloat(order.amount) || 0,
                collectedDate: isDelivered ? new Date(order.lastUpdated || order.createdAt).toLocaleDateString() : null,
                remittanceDate: null,
                status: status,
                daysElapsed: daysElapsed
            };
        });

    const totalCollected = codRemittances.reduce((sum, c) => sum + c.codAmount, 0);
    const pendingAmount = codRemittances.filter(c => c.status !== 'Remitted').reduce((sum, c) => sum + c.codAmount, 0);
    const overdueAmount = codRemittances.filter(c => c.status === 'Overdue').reduce((sum, c) => sum + c.codAmount, 0);

    const filteredRemittances = codRemittances.filter(c => {
        if (filter === 'all') return true;
        return c.status.toLowerCase() === filter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Remitted': return 'var(--success)';
            case 'Pending': return 'var(--warning)';
            case 'Collected': return 'var(--info)';
            case 'Overdue': return 'var(--danger)';
            default: return 'var(--glass-border)';
        }
    };

    return (
        <div className="cod-reconciliation animate-fade">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2>COD Reconciliation</h2>
                    <p className="text-muted">Cash on Delivery cash flow tracking</p>
                </div>
                <span className="badge" style={{ background: overdueAmount > 0 ? 'var(--danger)' : 'var(--success)', padding: '8px 16px', fontSize: '0.9rem' }}>
                    {overdueAmount > 0 ? `₹${overdueAmount.toLocaleString('en-IN')} Overdue` : '✓ All Clear'}
                </span>
            </div>

            {/* COD Summary */}
            <div className="cod-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px' }}>
                <div className="glass" style={{ padding: '24px', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
                        ₹{totalCollected.toLocaleString('en-IN')}
                    </p>
                    <span className="text-muted">Total COD Value</span>
                </div>
                <div className="glass" style={{ padding: '24px', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--success)' }}>
                        ₹{(totalCollected - pendingAmount).toLocaleString('en-IN')}
                    </p>
                    <span className="text-muted">Remitted</span>
                </div>
                <div className="glass" style={{ padding: '24px', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--warning)' }}>
                        ₹{pendingAmount.toLocaleString('en-IN')}
                    </p>
                    <span className="text-muted">Pending</span>
                </div>
                <div className="glass" style={{ padding: '24px', textAlign: 'center', borderTop: overdueAmount > 0 ? '4px solid var(--danger)' : 'none' }}>
                    <p style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--danger)' }}>
                        ₹{overdueAmount.toLocaleString('en-IN')}
                    </p>
                    <span className="text-muted">Overdue (&gt;5 days)</span>
                </div>
            </div>

            {/* Filters */}
            <div className="cod-filters glass" style={{ padding: '16px 20px', marginTop: '24px', display: 'flex', gap: '10px' }}>
                {['all', 'collected', 'pending', 'remitted', 'overdue'].map(f => (
                    <button
                        key={f}
                        className="btn-secondary glass-hover"
                        style={{
                            padding: '8px 16px',
                            fontSize: '0.85rem',
                            background: filter === f ? 'var(--primary)' : 'transparent'
                        }}
                        onClick={() => setFilter(f)}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* COD List */}
            <div className="cod-list" style={{ marginTop: '24px' }}>
                {filteredRemittances.map(cod => (
                    <div
                        key={cod.id}
                        className="cod-card glass glass-hover"
                        style={{
                            padding: '24px',
                            marginBottom: '16px',
                            borderLeft: `4px solid ${getStatusColor(cod.status)}`
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <h3 style={{ color: 'var(--primary)' }}>{cod.orderId}</h3>
                                    <span className="badge" style={{ background: getStatusColor(cod.status), fontSize: '0.65rem' }}>
                                        {cod.status}
                                    </span>
                                    {cod.daysElapsed > 5 && (
                                        <span className="badge" style={{ background: 'var(--danger)', fontSize: '0.65rem' }}>
                                            ⚠️ {cod.daysElapsed} days
                                        </span>
                                    )}
                                </div>
                                <p style={{ marginTop: '8px' }}>{cod.customer}</p>
                                <p className="text-muted" style={{ fontSize: '0.85rem' }}>via {cod.carrier}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontWeight: '800', fontSize: '1.5rem', color: 'var(--primary)' }}>
                                    ₹{cod.codAmount.toLocaleString('en-IN')}
                                </p>
                                <p className="text-muted" style={{ fontSize: '0.75rem' }}>Collected: {cod.collectedDate}</p>
                                {cod.remittanceDate && (
                                    <p className="text-muted" style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
                                        Remitted: {cod.remittanceDate}
                                    </p>
                                )}
                            </div>
                        </div>

                        {cod.status === 'Overdue' && (
                            <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                                <button className="btn-primary glass-hover" style={{ flex: 1 }}>
                                    📞 Follow Up with Carrier
                                </button>
                                <button className="btn-secondary glass-hover" style={{ flex: 1 }}>
                                    📧 Send Reminder
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CODReconciliation;
