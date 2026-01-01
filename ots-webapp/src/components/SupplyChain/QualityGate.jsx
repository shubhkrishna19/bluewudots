import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { ORDER_STATUSES } from '../../services/orderStateMachine';

const QualityGate = () => {
    const { orders, updateOrderStatus } = useData();
    const [scanInput, setScanInput] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [checklist, setChecklist] = useState({
        itemCorrect: false,
        hardwareCount: false,
        polishCheck: false,
        packagingIntact: false
    });

    const pendingQA = useMemo(() =>
        orders.filter(o => o.status === ORDER_STATUSES.PENDING || o.status === ORDER_STATUSES.MTP_APPLIED),
        [orders]);

    const handleScan = (e) => {
        e.preventDefault();
        const order = pendingQA.find(o => o.id === scanInput || o.awb === scanInput);
        if (order) {
            setSelectedOrder(order);
            setScanInput('');
        } else {
            alert('Order not found or not eligible for QA');
        }
    };

    const toggleCheck = (key) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const isPassed = Object.values(checklist).every(v => v);

    const handlePass = () => {
        if (!selectedOrder) return;
        updateOrderStatus(selectedOrder.id, ORDER_STATUSES.QA_PASSED, { reason: 'QA Checklist Verified' });
        setSelectedOrder(null);
        setChecklist({ itemCorrect: false, hardwareCount: false, polishCheck: false, packagingIntact: false });
        alert('Order Marked QA PASSED');
    };

    return (
        <div className="quality-gate animate-fade">
            <div className="section-header">
                <h2>QA Mobile Gate</h2>
                <p className="text-muted">Final Quality Control before Dispatch</p>
            </div>

            <div style={{ maxWidth: '600px', margin: '32px auto' }}>
                {!selectedOrder ? (
                    <div className="glass" style={{ padding: '32px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                        <h3>Scan Order ID or AWB</h3>
                        <form onSubmit={handleScan} style={{ marginTop: '24px' }}>
                            <input
                                type="text"
                                className="glass"
                                placeholder="Scan Barcode..."
                                style={{ width: '100%', padding: '16px', fontSize: '1.2rem', textAlign: 'center', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', color: '#fff' }}
                                value={scanInput}
                                onChange={(e) => setScanInput(e.target.value)}
                                autoFocus
                            />
                            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px', padding: '14px' }}>
                                Locate Shipment
                            </button>
                        </form>

                        <div style={{ marginTop: '32px', textAlign: 'left' }}>
                            <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '12px' }}>PENDING QA ({pendingQA.length})</p>
                            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                                {pendingQA.slice(0, 5).map(o => (
                                    <div
                                        key={o.id}
                                        className="glass glass-hover"
                                        style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                                        onClick={() => setSelectedOrder(o)}
                                    >
                                        {o.id}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="glass animate-slide-up" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div>
                                <h3 style={{ color: 'var(--primary)' }}>{selectedOrder.id}</h3>
                                <p className="text-muted">{selectedOrder.customerName}</p>
                            </div>
                            <button className="btn-pill" onClick={() => setSelectedOrder(null)} style={{ background: 'rgba(255,255,255,0.05)' }}>Cancel</button>
                        </div>

                        <div className="qa-checklist" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {Object.keys(checklist).map(key => (
                                <div
                                    key={key}
                                    className="glass glass-hover"
                                    style={{
                                        padding: '16px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        borderLeft: checklist[key] ? '4px solid var(--success)' : '4px solid var(--glass-border)'
                                    }}
                                    onClick={() => toggleCheck(key)}
                                >
                                    <span style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <input type="checkbox" checked={checklist[key]} onChange={() => { }} />
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
                            <button
                                className="btn-primary"
                                style={{ flex: 2, padding: '16px', background: isPassed ? 'var(--success)' : 'var(--bg-accent)', opacity: isPassed ? 1 : 0.5 }}
                                disabled={!isPassed}
                                onClick={handlePass}
                            >
                                ✅ QA PASSED - READY TO SHIP
                            </button>
                            <button
                                className="btn-primary"
                                style={{ flex: 1, padding: '16px', background: 'var(--danger)' }}
                                onClick={() => { updateOrderStatus(selectedOrder.id, ORDER_STATUSES.ON_HOLD, { reason: 'QA Failed' }); setSelectedOrder(null); alert('Order Marked ON HOLD (QA Failed)'); }}
                            >
                                ❌ FAIL
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QualityGate;
