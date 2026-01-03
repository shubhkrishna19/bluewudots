import React, { useMemo } from 'react';
import warehouseOptimizer from '../../services/warehouseOptimizer';

/**
 * Warehouse Selector Component
 * Displays warehouse utilization and allows manual override of warehouse selection.
 */
const WarehouseSelector = ({ selectedWarehouse, onSelect, order = null }) => {
    const utilization = useMemo(() => warehouseOptimizer.getUtilizationMetrics(), []);

    const recommendation = useMemo(() => {
        if (order?.pincode || order?.state) {
            return warehouseOptimizer.selectOptimalWarehouse(order);
        }
        return null;
    }, [order]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'HEALTHY': return 'var(--success)';
            case 'MODERATE': return 'var(--warning)';
            case 'HIGH': return 'var(--danger)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div className="warehouse-selector">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ margin: 0 }}>🏭 Select Fulfillment Hub</h4>
                {recommendation && (
                    <span className="badge" style={{ background: 'var(--primary)', fontSize: '0.65rem' }}>
                        AI: {recommendation.warehouse.id}
                    </span>
                )}
            </div>

            {recommendation && (
                <div className="glass" style={{ padding: '12px', marginBottom: '16px', borderLeft: '4px solid var(--primary)' }}>
                    <p style={{ fontSize: '0.8rem', margin: 0 }}>
                        <strong>AI Recommendation:</strong> {recommendation.reason}
                    </p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {utilization.map(wh => (
                    <div
                        key={wh.id}
                        className={`glass glass-hover ${selectedWarehouse === wh.id ? 'selected' : ''}`}
                        style={{
                            padding: '16px',
                            cursor: 'pointer',
                            border: selectedWarehouse === wh.id ? '2px solid var(--primary)' : '1px solid transparent',
                            borderRadius: '8px'
                        }}
                        onClick={() => onSelect?.(wh.id)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontWeight: '700', margin: 0 }}>{wh.id}</p>
                                <p className="text-muted" style={{ fontSize: '0.75rem', margin: '4px 0' }}>{wh.name}</p>
                            </div>
                            <span className="badge" style={{ background: getStatusColor(wh.status), fontSize: '0.6rem' }}>
                                {wh.status}
                            </span>
                        </div>
                        <div style={{ marginTop: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '0.7rem' }}>Utilization</span>
                                <span style={{ fontSize: '0.7rem', fontWeight: '700' }}>{wh.utilization}%</span>
                            </div>
                            <div style={{ height: '6px', background: 'var(--bg-accent)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${wh.utilization}%`, height: '100%', background: getStatusColor(wh.status) }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WarehouseSelector;
