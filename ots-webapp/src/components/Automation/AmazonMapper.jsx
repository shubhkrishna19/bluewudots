import React, { useState } from 'react';
import Papa from 'papaparse';
import { useData } from '../../context/DataContext';
import OrderJourney from '../Orders/OrderJourney';
import marketplaceSyncService from '../../services/marketplaceService';
import { RefreshCw, Upload, CheckCircle, AlertTriangle } from 'lucide-react';

const AmazonMapper = () => {
    const { orders, setOrders, skuMaster } = useData();
    const [activeTab, setActiveTab] = useState('import');
    const [isUploading, setIsUploading] = useState(false);
    const [syncStatus, setSyncStatus] = useState({}); // { sku: 'success' | 'error' }
    const [stats, setStats] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const rawData = results.data;
                const transformed = rawData.map(row => ({
                    id: row['order-id'] || `BW-IMP-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
                    customer: row['buyer-name'] || 'Marketplace Customer',
                    city: row['ship-city'] || 'Unknown',
                    state: row['ship-state'] || 'Unknown',
                    sku: row['sku'] || 'SKU-UNKNOWN',
                    weight: parseFloat(row['weight']) || 2.0,
                    status: 'Imported',
                    source: 'Amazon'
                }));
                setOrders(prev => [...transformed, ...prev]);
                setStats({ count: transformed.length });
                setIsUploading(false);
            },
            error: (err) => {
                console.error('Mapper Engine Error:', err);
                setIsUploading(false);
            }
        });
    };

    const handleOrderSync = async () => {
        setIsUploading(true);
        try {
            // Fetch Order Batch via Service (Real or Mock)
            const newOrders = await marketplaceSyncService.fetchOrders('amazon');

            setOrders(prev => {
                // Avoid duplicates based on Order ID
                const existingIds = new Set(prev.map(o => o.id));
                const uniqueNew = newOrders.filter(o => !existingIds.has(o.id));
                return [...uniqueNew, ...prev];
            });

            setStats({ count: newOrders.length });
        } catch (err) {
            console.error('Order Sync Failed:', err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleBulkSync = async () => {
        setIsUploading(true);
        const newStatus = {};

        // Simulate syncing top 5 SKUs
        for (const item of skuMaster.slice(0, 5)) {
            try {
                // Use the new service method
                await marketplaceSyncService.syncInventory(item.sku, item.stock, 'amazon');
                newStatus[item.sku] = 'success';
            } catch (err) {
                newStatus[item.sku] = 'error';
            }
        }
        setSyncStatus(newStatus);
        setIsUploading(false);
    };

    return (
        <div className="mapper-container animate-fade">
            <div className="section-header">
                <h2>Universal Import Pipeline</h2>
                <p className="text-muted">Amazon IN Node Connector</p>
            </div>

            <div className="flex gap-4 mb-6 border-b border-white/10">
                <button
                    className={`px-4 py-2 ${activeTab === 'import' ? 'text-accent border-b-2 border-accent' : 'text-slate-400'}`}
                    onClick={() => setActiveTab('import')}
                >
                    Order Import
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'sync' ? 'text-accent border-b-2 border-accent' : 'text-slate-400'}`}
                    onClick={() => setActiveTab('sync')}
                >
                    Inventory Sync (Outbound)
                </button>
            </div>

            {activeTab === 'import' ? (
                <>
                    <div className="mapping-dashboard grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                        <div className="upload-zone glass glass-hover" style={{ padding: '40px', textAlign: 'center', border: '2px dashed var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            {isUploading ? (
                                <div className="loader">TRANSMITTING DATA...</div>
                            ) : (
                                <label style={{ cursor: 'pointer', width: '100%' }}>
                                    <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
                                    <div style={{ fontSize: '2rem', marginBottom: '16px' }}><Upload className="w-8 h-8 mx-auto" /></div>
                                    <p>Drop Amazon Order CSV here or <strong>Browse</strong></p>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Sync directly into Bluewud Data Lake</span>
                                </label>
                            )}
                        </div>

                        <div className="pipeline-stats glass" style={{ padding: '24px' }}>
                            <h3>Active Stream</h3>
                            {stats ? (
                                <div className="animate-fade">
                                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--success)', margin: '12px 0' }}>{stats.count}</p>
                                    <p className="text-muted">Orders Synced Successfully</p>
                                    <button className="btn-primary glass-hover" style={{ marginTop: '20px', width: '100%' }}>View Records</button>
                                </div>
                            ) : (
                                <div className="text-muted" style={{ marginTop: '20px' }}>
                                    <p>Waiting for data stream...</p>
                                    <button
                                        className="btn-secondary glass-hover"
                                        style={{ marginTop: '16px', width: '100%', borderColor: 'var(--accent)', color: 'var(--accent)' }}
                                        onClick={handleOrderSync}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? 'Connecting...' : '🔌 Sync via SP-API'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mapping-rules glass" style={{ marginTop: '24px', padding: '24px' }}>
                        <h3>Transformation Matrix</h3>
                        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
                            <div className="rule-card glass-hover" style={{ padding: '12px', borderRadius: '4px' }}>
                                <code style={{ color: 'var(--secondary)' }}>order-id</code> ➔ <code>CoreID</code>
                            </div>
                            <div className="rule-card glass-hover" style={{ padding: '12px', borderRadius: '4px' }}>
                                <code style={{ color: 'var(--secondary)' }}>ship-city</code> ➔ <code>ZoneMap</code>
                            </div>
                            <div className="rule-card glass-hover" style={{ padding: '12px', borderRadius: '4px' }}>
                                <code style={{ color: 'var(--secondary)' }}>sku</code> ➔ <code>MTP_Ref</code>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="sync-dashboard glass p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3>Inventory Sync Status (Amazon IN)</h3>
                        <button
                            onClick={handleBulkSync}
                            disabled={isUploading}
                            className={`btn-primary flex items-center gap-2 ${isUploading ? 'opacity-50' : ''}`}
                        >
                            <RefreshCw className={`w-4 h-4 ${isUploading ? 'animate-spin' : ''}`} />
                            {isUploading ? 'Syncing...' : 'Sync All Inventory'}
                        </button>
                    </div>

                    <div className="overflow-auto max-h-[400px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-slate-500 uppercase border-b border-white/10">
                                    <th className="p-3">SKU</th>
                                    <th className="p-3">Local Stock</th>
                                    <th className="p-3">Amazon Status</th>
                                    <th className="p-3">Last Sync</th>
                                </tr>
                            </thead>
                            <tbody>
                                {skuMaster.map((item, idx) => (
                                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="p-3 font-mono text-sm">{item.sku}</td>
                                        <td className="p-3 font-bold">{item.stock}</td>
                                        <td className="p-3">
                                            {syncStatus[item.sku] === 'success' && <span className="text-green-400 flex items-center gap-1 text-xs"><CheckCircle className="w-3 h-3" /> Synced</span>}
                                            {syncStatus[item.sku] === 'error' && <span className="text-red-400 flex items-center gap-1 text-xs"><AlertTriangle className="w-3 h-3" /> Failed</span>}
                                            {!syncStatus[item.sku] && <span className="text-slate-500 text-xs">Pending</span>}
                                        </td>
                                        <td className="p-3 text-xs text-slate-400">
                                            {syncStatus[item.sku] ? 'Just now' : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default AmazonMapper;
