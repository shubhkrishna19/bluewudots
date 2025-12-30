import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { generatePackingSlip, generateShippingLabel } from '../../utils/labelGenerator';

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
    const [showLabelMenu, setShowLabelMenu] = useState(false);

    if (!order) return null;

    const currentStageIndex = STAGES.findIndex(s => s.key === order.status);

    const handleGenerateLabel = (type) => {
        if (type === 'packing') {
            generatePackingSlip(order);
        } else {
            generateShippingLabel(order);
        }
        setShowLabelMenu(false);
    };

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

            <div className="journey-actions" style={{ marginTop: '32px', display: 'flex', gap: '12px', position: 'relative' }}>
                <button className="btn-secondary glass-hover" style={{ flex: 1, fontSize: '0.8rem' }}>View Log</button>
                <div style={{ flex: 1, position: 'relative' }}>
                    <button
                        className="btn-primary glass-hover"
                        style={{ width: '100%', fontSize: '0.8rem' }}
                        onClick={() => setShowLabelMenu(!showLabelMenu)}
                    >
                        Generate Label ▾
                    </button>
                    {showLabelMenu && (
                        <div className="label-menu glass" style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            marginTop: '8px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            zIndex: 10
                        }}>
                            <button
                                onClick={() => handleGenerateLabel('packing')}
                                style={{ width: '100%', padding: '12px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', textAlign: 'left' }}
                            >
                                📄 Packing Slip (PDF)
                            </button>
                            <button
                                onClick={() => handleGenerateLabel('thermal')}
                                style={{ width: '100%', padding: '12px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', textAlign: 'left', borderTop: '1px solid var(--glass-border)' }}
                            >
                                🏷️ Thermal Label (4x6)
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderJourney;
