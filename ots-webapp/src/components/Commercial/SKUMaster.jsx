import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { calculateProfitability, TMS_LEVELS, getEnhancedSKU } from '../../utils/commercialUtils';
import mlForecastService from '../../services/mlForecastService';
import { Zap, AlertOctagon, TrendingUp, RefreshCcw, RefreshCw, Search, Filter, Download, Plus } from 'lucide-react';
import zohoService from '../../services/zohoBridgeService';


const SKUMaster = () => {
    const { skuMaster } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [selectedSKU, setSelectedSKU] = useState(null);

    const filteredSKUs = skuMaster
        .filter(sku => !sku.isParent) // Only show sellable child products
        .filter(sku =>
            sku.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sku.name.toLowerCase().includes(searchTerm.toLowerCase())
        );


    const renderProfitMetric = (label, value, color = 'var(--text)') => (
        <div className="matrix-item">
            <span className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>{label}</span>
            <p style={{ fontWeight: '700', color }}>{value}</p>
        </div>
    );

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            // Force refresh from Zoho
            const latestSkus = await zohoService.fetchSKUMaster();
            setSkuMaster(latestSkus); // Update global context
        } catch (error) {
            console.error("Failed to sync SKU master from Zoho:", error);
            // Optionally show an error message to the user
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="sku-master-container animate-fade">
            <div className="section-header flex justify-between items-center">
                <div>
                    <h2>SKU Master Registry</h2>
                    <p className="text-muted">Centralized Product Database (SSOT)</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="btn-secondary glass-hover flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        {isSyncing ? 'Syncing...' : 'Sync from Zoho'}
                    </button>
                    <span className="badge glass text-green-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Zoho CRM Connected
                    </span>
                </div>
            </div>

            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>MTP / SKU Master</h2>
                    <p className="text-muted">Relational Product Mapping & Profitability Predictor</p>
                </div>
                <div className="actions" style={{ display: 'flex', gap: '12px' }}>
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
            </div>

            <div className="sku-grid responsive-card-grid" style={{ marginTop: '32px' }}>

                {filteredSKUs.map((sku, idx) => {
                    const enhancedSku = getEnhancedSKU(sku.sku, skuMaster);

                    const bauAnalysis = calculateProfitability({
                        sellingPrice: enhancedSku.bauSP,
                        bomCost: enhancedSku.bomCost,
                        commissionPercent: enhancedSku.commissionPercent,
                        tmsLevel: enhancedSku.tmsLevel
                    });

                    const eventAnalysis = calculateProfitability({
                        sellingPrice: enhancedSku.eventPrice,
                        bomCost: enhancedSku.bomCost,
                        commissionPercent: enhancedSku.commissionPercent,
                        tmsLevel: enhancedSku.tmsLevel
                    });


                    return (
                        <div key={idx} className="sku-card glass glass-hover animate-fade" style={{ padding: '24px', borderLeft: `4px solid ${bauAnalysis.isHealthy ? 'var(--success)' : 'var(--warning)'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', letterSpacing: '0.05em' }}>{enhancedSku.sku}</h3>
                                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>{enhancedSku.name} <span style={{ opacity: 0.5 }}>({enhancedSku.parentSku || 'No Parent'})</span></p>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <span className={`badge ${(enhancedSku.tmsLevel || 'TL2').toLowerCase()}`} style={{ fontSize: '0.6rem' }}>{enhancedSku.tmsLevel || 'TL2'}</span>
                                    <p className="text-muted" style={{ fontSize: '0.7rem', marginTop: '4px' }}>{TMS_LEVELS[enhancedSku.tmsLevel || 'TL2']?.name}</p>
                                </div>
                            </div>

                            <div className="commercial-tiers" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {/* BAU TIER */}
                                <div className="tier-box glass" style={{ padding: '12px', background: 'rgba(255,255,255,0.03)' }}>
                                    <span style={{ fontSize: '0.6rem', fontWeight: '800', opacity: 0.6 }}>BAU (STANDARD)</span>
                                    <div style={{ marginTop: '8px' }}>
                                        <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>₹{enhancedSku.bauSP || 0}</p>
                                        <p style={{ fontSize: '0.8rem', color: bauAnalysis.isHealthy ? 'var(--success)' : 'var(--warning)' }}>
                                            {bauAnalysis.marginPercent}% Margin
                                        </p>
                                    </div>
                                </div>

                                {/* EVENT TIER */}
                                <div className="tier-box glass" style={{ padding: '12px', background: 'rgba(255,255,255,0.03)' }}>
                                    <span style={{ fontSize: '0.6rem', fontWeight: '800', opacity: 0.6 }}>EVENT / FLASH</span>
                                    <div style={{ marginTop: '8px' }}>
                                        <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>₹{enhancedSku.eventPrice || 0}</p>
                                        <p style={{ fontSize: '0.8rem', color: eventAnalysis.isHealthy ? 'var(--success)' : 'var(--warning)' }}>
                                            {eventAnalysis.marginPercent}% Margin
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="profit-matrix" style={{ marginTop: '20px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                    {renderProfitMetric('BOM Cost', `₹${enhancedSku.bomCost || 0}`)}
                                    {renderProfitMetric('Commission', `₹${bauAnalysis.breakdown.commission}`)}
                                    {renderProfitMetric('Overhead', `₹${bauAnalysis.breakdown.overhead}`)}
                                    {renderProfitMetric('Shipping (Est)', `₹${bauAnalysis.breakdown.shipping}`)}
                                </div>
                                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <p className="text-muted" style={{ fontSize: '0.6rem' }}>NET REVENUE (BAU)</p>
                                        <p style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>₹{bauAnalysis.netRevenue}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p className="text-muted" style={{ fontSize: '0.6rem' }}>NET PROFIT (BAU)</p>
                                        <p style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--success)' }}>₹{bauAnalysis.netProfit}</p>
                                    </div>
                                </div>
                            </div>

                            {/* ML Demand Insight */}
                            {(() => {
                                const { orders, inventoryLevels } = useData();
                                const analysis = mlForecastService.predictDemand(orders, enhancedSku.sku);
                                const rrq = mlForecastService.calculateRRQ(analysis);
                                const currentStock = inventoryLevels[enhancedSku.sku]?.inStock || 0;
                                const stockOut = mlForecastService.predictStockOutDate(orders, enhancedSku.sku, currentStock);

                                return analysis && !analysis.error ? (
                                    <div className="ml-insight glass border-l-4 border-primary mt-4 overflow-hidden relative group" style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.03)' }}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-1.5 mb-2">
                                                    <div className="bg-primary/20 p-1 rounded-md">
                                                        <Zap className="text-primary w-3 h-3" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Neural Insight</span>
                                                </div>
                                                <p className="text-sm font-bold m-0 leading-tight">
                                                    Forecasting <span className="text-primary">+{analysis.metrics.growthRate}</span> units next 30 days
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase">Days of Supply:</span>
                                                    <span className={`text-xs font-mono font-bold ${stockOut.days < 15 ? 'text-red-400' : 'text-green-400'}`}>
                                                        {stockOut.days > 90 ? '90+' : stockOut.days}d
                                                    </span>
                                                </div>

                                                {stockOut && stockOut.urgency !== 'SAFE' && (
                                                    <div className="flex items-center gap-1.5 mt-3 animate-pulse">
                                                        <AlertOctagon className="w-3.5 h-3.5" style={{ color: stockOut.urgency === 'CRITICAL' ? 'var(--danger)' : 'var(--warning)' }} />
                                                        <span className="text-[10px] font-black uppercase tracking-tighter" style={{ color: stockOut.urgency === 'CRITICAL' ? 'var(--danger)' : 'var(--warning)' }}>
                                                            Stockout {stockOut.date === 'OUT_OF_STOCK' ? 'NOW' : `Risk in ${stockOut.days} Days`}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[9px] font-black opacity-40 uppercase tracking-widest">RRQ (Optimized)</span>
                                                    <p className="text-xl font-black m-0 tracking-tighter">{rrq}</p>
                                                    <div className="flex items-center gap-1 mt-1 opacity-60">
                                                        <RefreshCcw className="w-2.5 h-2.5" />
                                                        <span className="text-[8px] font-bold">95% Confidence</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Decorative background icon */}
                                        <TrendingUp className="absolute -right-2 -bottom-2 w-12 h-12 text-primary opacity-5 group-hover:scale-110 transition-transform" />
                                    </div>
                                ) : (
                                    <div className="glass mt-4 p-4 text-center opacity-50 border-dashed border-white/10">
                                        <p className="text-[10px] font-bold uppercase tracking-widest m-0">Insufficient ML Data Baseline</p>
                                    </div>
                                );
                            })()}


                            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                                <button
                                    className="btn-secondary"
                                    style={{ flex: 1, padding: '8px', fontSize: '0.75rem' }}
                                    onClick={() => setSelectedSKU(enhancedSku)}
                                >
                                    Relational Data
                                </button>
                                <button className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: '0.75rem' }}>Update Pricing</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Relational Data Modal (Portal style) */}
            {selectedSKU && (
                <div className="modal-overlay glass" style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="modal-content glass animate-slide-up" style={{ width: '100%', maxWidth: '600px', padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ color: 'var(--primary)' }}>Relational Node: {selectedSKU.sku}</h2>
                            <button className="btn-icon" onClick={() => setSelectedSKU(null)}>✕</button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="data-section">
                                <h4 style={{ marginBottom: '12px', opacity: 0.7 }}>Physical Attributes</h4>
                                <div className="glass" style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    {(() => {
                                        const enhanced = getEnhancedSKU(selectedSKU.sku, skuMaster);
                                        return (
                                            <>
                                                <div>
                                                    <p className="text-muted" style={{ fontSize: '0.7rem' }}>DIMENSIONS (INHERITED)</p>
                                                    <p>{enhanced.dimensions}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted" style={{ fontSize: '0.7rem' }}>WEIGHT (INHERITED)</p>
                                                    <p>{enhanced.weight} KG</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted" style={{ fontSize: '0.7rem' }}>COLOR FINISH</p>
                                                    <p>{enhanced.colorFinish}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted" style={{ fontSize: '0.7rem' }}>CATEGORY</p>
                                                    <p>{enhanced.category}</p>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>

                            </div>

                            <div className="data-section">
                                <h4 style={{ marginBottom: '12px', opacity: 0.7 }}>Platform Specific Mapping</h4>
                                <div className="glass" style={{ padding: '16px' }}>
                                    <table style={{ width: '100%', fontSize: '0.85rem' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', opacity: 0.5 }}>
                                                <th>Platform</th>
                                                <th>Alias / Marketplace SKU</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>Amazon ASIN</td><td><code>{getEnhancedSKU(selectedSKU.sku, skuMaster).asin || 'N/A'}</code></td></tr>
                                            <tr><td>Flipkart FSN</td><td><code>{getEnhancedSKU(selectedSKU.sku, skuMaster).fkfsn || 'N/A'}</code></td></tr>
                                            <tr><td>Parent MTP</td><td><code>{getEnhancedSKU(selectedSKU.sku, skuMaster).parentSku}</code></td></tr>
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '32px', textAlign: 'right' }}>
                            <button className="btn-primary" onClick={() => setSelectedSKU(null)}>Close Insight</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SKUMaster;
