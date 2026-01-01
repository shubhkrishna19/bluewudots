import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { getShortagePredictions } from '../../services/supplyChainService';

const ShortageAlerts = () => {
    const { skuMaster, inventoryLevels, orders } = useData();

    const alerts = useMemo(() => {
        const inventory = skuMaster
            .filter(s => !s.isParent)
            .map(sku => ({
                ...sku,
                ...(inventoryLevels[sku.sku] || { inStock: 0, reserved: 0 })
            }));

        return getShortagePredictions(inventory, orders);
    }, [skuMaster, inventoryLevels, orders]);

    return (
        <div className="shortage-alerts animate-fade" style={{ marginTop: '24px' }}>
            <div className="glass" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>🚨 Material Shortage Warnings</h3>
                    <span className="badge" style={{ background: alerts.some(a => a.urgency === 'CRITICAL') ? 'var(--danger)' : 'var(--warning)' }}>
                        {alerts.length} Potential Shortages
                    </span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', opacity: 0.6, fontSize: '0.8rem' }}>
                                <th style={{ padding: '12px' }}>SKU / ITEM</th>
                                <th style={{ padding: '12px' }}>AVAIL. STOCK</th>
                                <th style={{ padding: '12px' }}>30-DAY FCST</th>
                                <th style={{ padding: '12px' }}>DEFICIT</th>
                                <th style={{ padding: '12px' }}>URGENCY</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alerts.map((alert, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '12px' }}>
                                        <p style={{ fontWeight: '600', color: 'var(--primary)' }}>{alert.sku}</p>
                                        <p className="text-muted" style={{ fontSize: '0.75rem' }}>{alert.name}</p>
                                    </td>
                                    <td style={{ padding: '12px' }}>{alert.currentStock}</td>
                                    <td style={{ padding: '12px' }}>{alert.monthlyDemand}</td>
                                    <td style={{ padding: '12px', color: 'var(--danger)', fontWeight: '700' }}>-{alert.deficit}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span className="badge" style={{
                                            background: alert.urgency === 'CRITICAL' ? 'var(--danger)' : 'rgba(245, 158, 11, 0.2)',
                                            color: alert.urgency === 'CRITICAL' ? '#fff' : 'var(--warning)',
                                            border: alert.urgency === 'CRITICAL' ? 'none' : '1px solid var(--warning)'
                                        }}>
                                            {alert.urgency}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        <button className="btn-pill" style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.75rem', padding: '6px 12px' }}>
                                            Order {alert.reorderQty}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {alerts.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--success)' }}>
                                        ✅ All stock levels healthy based on consumption trends.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShortageAlerts;
