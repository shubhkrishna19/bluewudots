import React from 'react';
import { useData } from '../../context/DataContext';

const STAGES = [
    { key: 'Imported', label: 'IMPORTED', color: 'var(--text-muted)' },
    { key: 'MTP-Applied', label: 'COMMERCIALS APPLIED', color: 'var(--accent)' },
    { key: 'Carrier-Assigned', label: 'READY FOR DISPATCH', color: 'var(--primary)' },
    { key: 'In-Transit', label: 'IN TRANSIT', color: 'var(--info)' },
    { key: 'Delivered', label: 'DELIVERED', color: 'var(--success)' }
];

const OrderJourney = ({ orderId }) => {
    const { orders, updateOrderStatus } = useData();
    const order = orders.find(o => o.id === orderId);

    if (!order) return null;

    const currentStageIndex = STAGES.findIndex(s => s.key === order.status);

    return (
        <div className="order-journey-card glass animate-fade" style={{ padding: '24px', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>TRACKING ORDER</span>
                    <h4 style={{ fontSize: '1.2rem' }}>{order.id}</h4>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span className="badge" style={{ background: STAGES[currentStageIndex]?.color || 'var(--glass-border)' }}>
                        {order.status.toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="journey-track" style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: '40px' }}>
                {/* Connecting Line */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '5%',
                    right: '5%',
                    height: '2px',
                    background: 'var(--glass-border)',
                    zIndex: 0
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '5%',
                    width: `${(currentStageIndex / (STAGES.length - 1)) * 90}%`,
                    height: '2px',
                    background: 'var(--primary)',
                    boxShadow: '0 0 10px var(--primary-glow)',
                    zIndex: 0,
                    transition: 'width 0.5s ease'
                }}></div>

                {STAGES.map((stage, idx) => {
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                        <div key={stage.key} style={{ zIndex: 1, textAlign: 'center', width: '20%' }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: isCompleted ? 'var(--primary)' : 'var(--bg-accent)',
                                border: isCurrent ? '4px solid var(--primary-glow)' : '2px solid var(--glass-border)',
                                margin: '0 auto',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                                onClick={() => updateOrderStatus(orderId, stage.key)}
                                title={`Transition to ${stage.label}`}
                            ></div>
                            <span style={{
                                display: 'block',
                                fontSize: '0.6rem',
                                marginTop: '12px',
                                color: isCompleted ? 'var(--text-main)' : 'var(--text-muted)',
                                fontWeight: isCompleted ? '700' : '400'
                            }}>
                                {stage.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="journey-actions" style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                <button className="btn-secondary glass-hover" style={{ flex: 1, fontSize: '0.8rem' }}>View Log</button>
                <button className="btn-primary glass-hover" style={{ flex: 1, fontSize: '0.8rem' }}>Generate Label</button>
            </div>
        </div>
    );
};

export default OrderJourney;
