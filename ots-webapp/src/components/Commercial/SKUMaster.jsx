import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { formatINR, calculateProfitability } from '../../utils/commercialUtils';

const SKUMaster = () => {
    const { skuMaster } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSKUs = skuMaster.filter(sku =>
        sku.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sku.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="sku-master-view animate-fade">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>Commercial MTP Master</h2>
                    <p className="text-muted">High-Fidelity Profitability Nodes (GST Compliant)</p>
                </div>
                <div className="search-box glass" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '8px', opacity: 0.5 }}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search SKU or Parent Code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '250px' }}
                    />
                </div>
            </div>

            <div className="sku-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px', marginTop: '32px' }}>
                {filteredSKUs.map((sku, idx) => {
                    const analysis = calculateProfitability({
                        bauSp: sku.cost * 1.85, // Bluewud Business Rule: 1.85x Multiplier for BAU
                        bomCost: sku.cost,
                        commissionArf: 18 // Marketplace Std
                    }, 550); // Weighted Avg Shipping

                    return (
                        <div key={idx} className="sku-card glass glass-hover animate-fade" style={{ padding: '28px', borderLeft: `4px solid ${analysis.status === 'HEALTHY' ? 'var(--success)' : 'var(--warning)'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.4rem', letterSpacing: '0.05em' }}>{sku.code}</h3>
                                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>{sku.name}</p>
                                </div>
                                <span className={`badge ${analysis.status.toLowerCase()}`}>
                                    {analysis.status}
                                </span>
                            </div>

                            <div className="commercial-matrix" style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="matrix-item">
                                    <span className="text-muted">BOM COST</span>
                                    <p style={{ fontWeight: '700' }}>{formatINR(sku.cost)}</p>
                                </div>
                                <div className="matrix-item">
                                    <span className="text-muted">EST. BAU SP</span>
                                    <p style={{ fontWeight: '700' }}>{formatINR(sku.cost * 1.85)}</p>
                                </div>
                                <div className="matrix-item">
                                    <span className="text-muted">NET REVENUE</span>
                                    <p style={{ fontWeight: '700', color: 'var(--primary)' }}>{formatINR(analysis.netRevenue)}</p>
                                </div>
                                <div className="matrix-item">
                                    <span className="text-muted">PROFIT MARGIN</span>
                                    <p style={{ fontWeight: '700', color: analysis.status === 'HEALTHY' ? 'var(--success)' : 'var(--warning)' }}>
                                        {analysis.marginPercent}%
                                    </p>
                                </div>
                            </div>

                            <div className="margin-track" style={{ height: '6px', background: 'var(--glass-border)', marginTop: '20px', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${Math.min(100, Math.max(0, analysis.marginPercent * 2))}%`,
                                    height: '100%',
                                    background: analysis.status === 'HEALTHY' ? 'var(--success)' : 'var(--warning)',
                                    boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                                }}></div>
                            </div>

                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                <button className="btn-secondary glass-hover" style={{ flex: 1, fontSize: '0.75rem', padding: '8px' }}>P&L Details</button>
                                <button className="btn-primary glass-hover" style={{ flex: 1, fontSize: '0.75rem', padding: '8px' }}>Edit MTP</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredSKUs.length === 0 && (
                <div className="placeholder-view glass" style={{ marginTop: '40px' }}>
                    <p>No SKU matching "{searchTerm}" found in the Data Lake.</p>
                </div>
            )}
        </div>
    );
};

export default SKUMaster;
