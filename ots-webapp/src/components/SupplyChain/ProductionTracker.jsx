import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { getVendors } from '../../services/supplyChainService';
import { predictVendorArrival } from '../../services/forecastService';
import qcService from '../../services/qcService';
import ShortageAlerts from './ShortageAlerts';

const ProductionTracker = () => {
    const { skuMaster, batches, receiveStock } = useData();
    const vendors = getVendors();

    const [selectedSku, setSelectedSku] = useState('');
    const [selectedVendor, setSelectedVendor] = useState(vendors[0].name);
    const [quantity, setQuantity] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [qcReport, setQcReport] = useState(null);
    const [prediction, setPrediction] = useState(null);

    const activeSkus = useMemo(() => skuMaster.filter(s => !s.isParent), [skuMaster]);

    // Handle SKU selection to trigger predictions
    const handleSkuChange = (sku) => {
        setSelectedSku(sku);
        if (sku) {
            const pred = predictVendorArrival(selectedVendor === 'Local' ? 'V002' : 'V001', sku);
            setPrediction(pred);
        }
    };

    const handleAIScan = async () => {
        setIsProcessing(true);
        const report = await qcService.simulateAIScan();
        setQcReport(report);
        setIsProcessing(false);
    };

    const handleReceive = () => {
        if (!selectedSku || quantity <= 0) return;

        setIsProcessing(true);
        setTimeout(() => {
            receiveStock(selectedSku, selectedVendor, quantity);
            if (qcReport?.status === 'DAMAGED') {
                const dispute = qcService.generateVendorDispute('B-' + Date.now(), qcReport);
                console.log('Vendor Dispute Generated:', dispute);
                alert(`⚠️ DAMAGED GOODS DETECTED.\nDispute ID: ${dispute.disputeId}\nRecommended Action: ${dispute.recommendedAction}`);
            }
            setIsProcessing(false);
            setQuantity(0);
            setQcReport(null);
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

                    {prediction && (
                        <div className="glass animate-fade" style={{ padding: '12px', marginBottom: '20px', background: prediction.riskLevel === 'HIGH' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--glass-border)' }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                                AI Prediction: Arrival expected by {new Date(prediction.date).toLocaleDateString()}
                            </p>
                            <span style={{ fontSize: '0.7rem', color: prediction.riskLevel === 'HIGH' ? 'var(--danger)' : 'var(--success)' }}>
                                {prediction.riskLevel === 'HIGH' ? '⚠️ High Risk of Delay' : '✅ Low Risk'}
                            </span>
                        </div>
                    )}

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>SELECT PRODUCT (SKU)</label>
                        <select
                            className="glass"
                            style={{ width: '100%', padding: '12px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', color: '#fff' }}
                            value={selectedSku}
                            onChange={(e) => handleSkuChange(e.target.value)}
                        >
                            <option value="">Select SKU...</option>
                            {activeSkus.map(sku => (
                                <option key={sku.sku} value={sku.sku}>{sku.sku} - {sku.name}</option>
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

                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                        <button
                            className="btn-secondary"
                            style={{ flex: 1, padding: '10px' }}
                            onClick={handleAIScan}
                            disabled={isProcessing || !selectedSku}
                        >
                            🔍 AI Scan Package
                        </button>
                        {qcReport && (
                            <div className="glass" style={{ flex: 2, padding: '10px', fontSize: '0.75rem', border: `1px solid ${qcReport.status === 'VERIFIED' ? 'var(--success)' : 'var(--danger)'}` }}>
                                <strong>Result:</strong> {qcReport.status} <br />
                                <strong>Notes:</strong> {qcReport.notes}
                            </div>
                        )}
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
