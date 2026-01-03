import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import mlForecastService from '../../services/mlForecastService';
import InventoryOptimizer from '../../services/InventoryOptimizer';
import { AlertTriangle, TrendingUp, Truck, Package, RefreshCw } from 'lucide-react';

const StockOptix = () => {
    const { skuMaster, orders, warehouses } = useData();
    const [selectedSKU, setSelectedSKU] = useState(null);

    // 1. Calculate Inventory Health for all SKUs
    const inventoryHealth = useMemo(() => {
        return skuMaster.map(sku => {
            // Mock forecast data if not available
            const forecast = mlForecastService.predictDemand(orders, sku.sku, 30);
            const rop = mlForecastService.calculateReorderPoint(forecast, 7); // 7-day lead time default
            const dailyVelocity = parseFloat(forecast?.metrics?.avgDemand) || 0;
            const daysOfSupply = dailyVelocity > 0 ? (sku.stock / dailyVelocity).toFixed(1) : 999;

            return {
                ...sku,
                rop,
                dailyVelocity,
                daysOfSupply: Number(daysOfSupply),
                status: sku.stock <= 0 ? 'STOCKOUT' : sku.stock < rop ? 'CRITICAL' : daysOfSupply < 15 ? 'LOW' : 'HEALTHY'
            };
        }).sort((a, b) => a.daysOfSupply - b.daysOfSupply);
    }, [skuMaster, orders]);

    // 2. Generate Transfer Suggestions
    const transferSuggestions = useMemo(() => {
        if (!selectedSKU) return [];
        // Mock demand map for demo
        const demandMap = { '400001': 50, '110001': 80, '560001': 20 };
        return InventoryOptimizer.suggestTransfers(selectedSKU.sku, demandMap, warehouses);
    }, [selectedSKU, warehouses]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'STOCKOUT': return 'var(--danger)';
            case 'CRITICAL': return 'var(--warning)';
            case 'LOW': return 'var(--info)';
            default: return 'var(--success)';
        }
    };

    return (
        <div className="stock-optix animate-fade">
            <div className="section-header">
                <div>
                    <h2>StockOptix™ Intelligence</h2>
                    <p className="text-muted">AI-Driven Inventory Balancing & Reorder Alerts</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p className="text-muted">Total SKUs Tracked</p>
                    <span className="badge" style={{ background: 'var(--accent)', fontSize: '1.2rem' }}>{skuMaster.length}</span>
                </div>
            </div>

            {/* Health Overview Cards */}
            <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px' }}>
                <div className="glass p-4 text-center border-l-4 border-red-500">
                    <h3 className="text-2xl font-bold text-red-400">{inventoryHealth.filter(i => i.status === 'STOCKOUT').length}</h3>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Stockouts</p>
                </div>
                <div className="glass p-4 text-center border-l-4 border-yellow-500">
                    <h3 className="text-2xl font-bold text-yellow-400">{inventoryHealth.filter(i => i.status === 'CRITICAL').length}</h3>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Critical (Below ROP)</p>
                </div>
                <div className="glass p-4 text-center border-l-4 border-blue-500">
                    <h3 className="text-2xl font-bold text-blue-400">{inventoryHealth.filter(i => i.status === 'LOW').length}</h3>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Low Supply ({'<'}15 Days)</p>
                </div>
                <div className="glass p-4 text-center border-l-4 border-green-500">
                    <h3 className="text-2xl font-bold text-green-400">{inventoryHealth.filter(i => i.status === 'HEALTHY').length}</h3>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Healthy</p>
                </div>
            </div>

            <div className="main-content" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '32px' }}>

                {/* Inventory Heatmap / List */}
                <div className="glass p-6">
                    <h3 className="mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-accent" /> Global Inventory Health
                    </h3>
                    <div className="overflow-auto max-h-[600px]">
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                            <thead>
                                <tr className="text-left text-xs text-slate-500 uppercase">
                                    <th className="pb-2 pl-2">SKU</th>
                                    <th className="pb-2">Stock</th>
                                    <th className="pb-2">Velocity (Daily)</th>
                                    <th className="pb-2">Days Supply</th>
                                    <th className="pb-2">Status</th>
                                    <th className="pb-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventoryHealth.map(item => (
                                    <tr
                                        key={item.sku}
                                        className={`glass-hover cursor-pointer transition-colors ${selectedSKU?.sku === item.sku ? 'bg-white/5' : ''}`}
                                        onClick={() => setSelectedSKU(item)}
                                    >
                                        <td className="p-3 rounded-l-lg font-bold text-white">{item.sku}</td>
                                        <td className="p-3">{item.stock}</td>
                                        <td className="p-3 text-slate-400">{item.dailyVelocity.toFixed(1)}</td>
                                        <td className="p-3">
                                            <span className="font-mono">{item.daysOfSupply}d</span>
                                        </td>
                                        <td className="p-3">
                                            <span className="px-2 py-1 rounded text-[10px] font-bold border border-current" style={{ color: getStatusColor(item.status) }}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-3 rounded-r-lg">
                                            <button className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded transition-colors text-white border border-white/5">Analyze</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Analysis Panel */}
                <div className="analysis-panel space-y-6">
                    {selectedSKU ? (
                        <>
                            {/* SKU Details */}
                            <div className="glass p-6 border-t-4" style={{ borderColor: getStatusColor(selectedSKU.status) }}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-xl font-bold text-white">{selectedSKU.name}</h4>
                                        <p className="text-sm text-slate-400">{selectedSKU.sku}</p>
                                    </div>
                                    <span className="text-2xl font-bold">{selectedSKU.stock} units</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-slate-900/50 p-3 rounded">
                                        <p className="text-[10px] text-slate-500 uppercase">Reorder Point</p>
                                        <p className="text-lg font-mono text-accent">{selectedSKU.rop} units</p>
                                    </div>
                                    <div className="bg-slate-900/50 p-3 rounded">
                                        <p className="text-[10px] text-slate-500 uppercase">Est. Stockout</p>
                                        <p className="text-lg font-mono text-red-400">
                                            {selectedSKU.daysOfSupply < 99 ? `in ${selectedSKU.daysOfSupply} days` : 'Stable'}
                                        </p>
                                    </div>
                                </div>

                                {selectedSKU.status === 'CRITICAL' || selectedSKU.status === 'STOCKOUT' ? (
                                    <button className="w-full py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2">
                                        <RefreshCw className="w-4 h-4" /> Generate PO
                                    </button>
                                ) : null}
                            </div>

                            {/* Transfer Suggestions */}
                            <div className="glass p-6">
                                <h4 className="mb-4 flex items-center gap-2 font-bold text-sm uppercase text-slate-400">
                                    <Truck className="w-4 h-4" /> Warehouse Rebalancing
                                </h4>
                                {transferSuggestions.length > 0 ? (
                                    <div className="space-y-3">
                                        {transferSuggestions.map((t, idx) => (
                                            <div key={idx} className="bg-slate-900/40 p-3 rounded border border-white/5 flex justify-between items-center group hover:border-accent/50 transition-colors">
                                                <div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="text-slate-400">{t.from}</span>
                                                        <span className="text-slate-600">➔</span>
                                                        <span className="text-accent font-bold">{t.to}</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 mt-1">{t.reason}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-white">{t.quantity} qty</p>
                                                    <button className="text-[10px] text-accent underline mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Approve</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-sm text-slate-500 py-4">No transfers needed.</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="glass p-12 text-center flex flex-col items-center justify-center h-full opacity-50">
                            <TrendingUp className="w-12 h-12 mb-4 text-slate-600" />
                            <p className="text-slate-400">Select an SKU to view analysis</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StockOptix;
