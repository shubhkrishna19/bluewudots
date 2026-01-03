import React from 'react';
import { useData } from '../../context/DataContext';

const MarginGuard = () => {
    const { flaggedOrders, resolveFlag } = useData();

    const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

    return (
        <div className="margin-guard-view animate-fade">
            <div className="section-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="alert-icon" style={{ fontSize: '2rem' }}>🛡️</div>
                    <div>
                        <h2>AI Margin Protection</h2>
                        <p className="text-muted">Phase 13: Financial Integrity & Fraud Detection</p>
                    </div>
                </div>
                {flaggedOrders.length > 0 && (
                    <span className="badge" style={{ background: 'var(--danger)', padding: '8px 16px', animation: 'pulse 2s infinite' }}>
                        {flaggedOrders.length} Flagged Orders
                    </span>
                )}
            </div>

            <div className="guard-grid" style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: flaggedOrders.length > 0 ? '1fr 1fr' : '1fr', gap: '24px' }}>
                <div className="flagged-list">
                    <h3>Review Queue</h3>
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {flaggedOrders.length === 0 ? (
                            <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>🛡️</div>
                                <h4>All Margins Protected</h4>
                                <p className="text-muted">No orders currently fall below profit thresholds.</p>
                            </div>
                        ) : (
                            flaggedOrders.map(order => (
                                <div key={order.id} className="glass highlight-border" style={{ padding: '24px', borderLeft: '4px solid var(--danger)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h4 style={{ color: 'var(--danger)' }}>{order.id}</h4>
                                            <p style={{ marginTop: '4px' }}>{order.customerName}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontWeight: '700' }}>{formatINR(order.amount)}</p>
                                            <p className="text-muted" style={{ fontSize: '0.8rem' }}>{order.sku}</p>
                                        </div>
                                    </div>

                                    <div className="alert-box" style={{ marginTop: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid var(--danger)' }}>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--danger)' }}>
                                            <strong>{order.marginAlert || 'Low Margin Detection'}</strong>
                                        </p>
                                    </div>

                                    <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                                        <button className="btn-primary" style={{ flex: 1, padding: '10px' }}>Adjust Pricing</button>
                                        <button className="btn-secondary" style={{ flex: 1, padding: '10px' }} onClick={() => resolveFlag(order.id)}>Approve Exception</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {flaggedOrders.length > 0 && (
                    <div className="guard-insights glass" style={{ padding: '32px' }}>
                        <h3>Margin Leakage Insights</h3>
                        <div style={{ marginTop: '24px' }}>
                            <div className="stat-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
                                <span>Total Revenue at Risk</span>
                                <span style={{ fontWeight: '700', color: 'var(--danger)' }}>
                                    {formatINR(flaggedOrders.reduce((sum, o) => sum + o.amount, 0))}
                                </span>
                            </div>
                            <div className="stat-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
                                <span>Risk Level</span>
                                <span style={{ color: 'var(--warning)', fontWeight: '700' }}>MEDIUM</span>
                            </div>

                            <div style={{ marginTop: '32px' }}>
                                <h4>Common Root Causes</h4>
                                <ul style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ color: 'var(--danger)' }}>●</span> Marketplace Discount Overlay
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ color: 'var(--warning)' }}>●</span> Unexpected Shipping Surcharge (Zone E)
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ color: 'var(--primary)' }}>●</span> BOM Cost Mismatch in Parent SKU
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarginGuard;
