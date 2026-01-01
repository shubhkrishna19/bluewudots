import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { getVendors } from '../../services/supplyChainService';
import ShortageAlerts from './ShortageAlerts';

const ProductionTracker = () => {
    const { skuMaster, batches, receiveStock } = useData();
    const vendors = getVendors();

    const [selectedSku, setSelectedSku] = useState('');
    const [selectedVendor, setSelectedVendor] = useState(vendors[0].name);
    const [quantity, setQuantity] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const activeSkus = useMemo(() => skuMaster.filter(s => !s.isParent), [skuMaster]);

    const handleReceive = () => {
        if (!selectedSku || quantity <= 0) return;

        setIsProcessing(true);
        setTimeout(() => {
            receiveStock(selectedSku, selectedVendor, quantity);
            setIsProcessing(false);
            setQuantity(0);
            alert('Stock Received & Batch Created (FIFO Active)');
        }, 800);
    };

    return (
        <div className="production-tracker animate-fade">
            <div className="section-header">
                <h2>Supply Chain: Production Tracking</h2>
                <p className="text-muted">Goods Received Note (GRN) & Batch Management</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '32px' }}>
                {/* GRN Entry Form */}
                <div className="glass" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '24px' }}>📦 New Stock Receipt (GRN)</h3>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>SELECT PRODUCT (SKU)</label>
                        <select
                            className="glass"
                            style={{ width: '100%', padding: '12px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', color: '#fff' }}
                            value={selectedSku}
                            onChange={(e) => setSelectedSku(e.target.value)}
                        >
                            <option value="">Select SKU...</option>
                            {activeSkus.map(sku => (
                                <option key={sku.sku} value={sku.sku}>{sku.sku} - {sku.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>VENDOR</label>
                        <select
                            className="glass"
                            style={{ width: '100%', padding: '12px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', color: '#fff' }}
                            value={selectedVendor}
                            onChange={(e) => setSelectedVendor(e.target.value)}
                        >
                            {vendors.map(v => (
                                <option key={v.id} value={v.name}>{v.name} ({v.category})</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>QUANTITY RECEIVED</label>
                        <input
                            type="number"
                            className="glass"
                            style={{ width: '100%', padding: '12px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', color: '#fff' }}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                        />
                    </div>

                    <button
                        className="btn-primary"
                        style={{ width: '100%', padding: '14px' }}
                        onClick={handleReceive}
                        disabled={isProcessing || !selectedSku || quantity <= 0}
                    >
                        {isProcessing ? '🔄 Registering GRN...' : '✅ Confirm Receipt'}
                    </button>
                </div>

                {/* Recent Batches List */}
                <div className="glass" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '24px' }}>🕒 Recent Production Batches</h3>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {batches.slice().reverse().slice(0, 8).map(batch => (
                            <div key={batch.id} className="glass" style={{ padding: '16px', marginBottom: '12px', borderLeft: '4px solid var(--primary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <p style={{ fontWeight: '700', color: 'var(--primary)' }}>{batch.sku}</p>
                                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>Vendor: {batch.vendor}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span className="badge" style={{ background: 'var(--success)' }}>{batch.quantity} Units</span>
                                        <p className="text-muted" style={{ fontSize: '0.7rem', marginTop: '4px' }}>
                                            {new Date(batch.receivedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ marginTop: '12px' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FIFO Batch ID: {batch.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ShortageAlerts />
        </div>
    );
};

export default ProductionTracker;
