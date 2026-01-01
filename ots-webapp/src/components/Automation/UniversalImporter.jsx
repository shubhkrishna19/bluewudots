import React, { useState } from 'react';
import Papa from 'papaparse';
import { useData } from '../../context/DataContext';
import OrderJourney from '../Orders/OrderJourney';
import ChannelSelector from './ChannelSelector';
import { resolveSkuAlias } from '../../utils/dataUtils';


const CHANNEL_CONFIGS = {
    amazon: { name: 'Amazon IN', idField: 'order-id', customerField: 'buyer-name', cityField: 'ship-city', stateField: 'ship-state', skuField: 'sku' },
    flipkart: { name: 'Flipkart', idField: 'order_id', customerField: 'customer_name', cityField: 'city', stateField: 'state', skuField: 'seller_sku' },
    shopify: { name: 'Shopify', idField: 'Name', customerField: 'Billing Name', cityField: 'Shipping City', stateField: 'Shipping Province', skuField: 'Lineitem sku' },
    urban_ladder: { name: 'Urban Ladder', idField: 'order_id', customerField: 'customer', cityField: 'city', stateField: 'state', skuField: 'sku' },
    pepperfry: { name: 'Pepperfry', idField: 'order_id', customerField: 'customer_name', cityField: 'city', stateField: 'state', skuField: 'product_code' },
    indiamart: { name: 'IndiaMART', idField: 'enquiry_id', customerField: 'company_name', cityField: 'city', stateField: 'state', skuField: 'product' },
    local_shop: { name: 'Local Shop', idField: 'order_id', customerField: 'customer', cityField: 'city', stateField: 'state', skuField: 'sku' },
    dealer: { name: 'Dealer', idField: 'order_id', customerField: 'dealer_name', cityField: 'city', stateField: 'state', skuField: 'sku' }
};

const UniversalImporter = () => {
    const { orders, setOrders, skuAliases } = useData();

    const [selectedChannel, setSelectedChannel] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [stats, setStats] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file || !selectedChannel) return;

        const config = CHANNEL_CONFIGS[selectedChannel];
        setIsUploading(true);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const rawData = results.data;

                const transformed = rawData.map(row => ({
                    id: row[config.idField] || `BW-${selectedChannel.toUpperCase().slice(0, 3)}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
                    customer: row[config.customerField] || 'Customer',
                    city: row[config.cityField] || 'Unknown',
                    state: row[config.stateField] || 'Unknown',
                    sku: resolveSkuAlias(row[config.skuField] || 'SKU-UNKNOWN', skuAliases),
                    weight: parseFloat(row['weight']) || 2.0,

                    status: 'Imported',
                    source: config.name
                }));

                setOrders(prev => [...transformed, ...prev]);
                setStats({ count: transformed.length, channel: config.name });
                setIsUploading(false);
            },
            error: (err) => {
                console.error('Import Error:', err);
                setIsUploading(false);
            }
        });
    };

    const importedOrders = orders.filter(o => o.status === 'Imported' || o.source);

    return (
        <div className="importer-view animate-fade">
            <div className="section-header">
                <h2>Universal Order Import</h2>
                <p className="text-muted">Multi-Channel OMS Bridge</p>
            </div>

            {!selectedChannel ? (
                <div style={{ marginTop: '32px' }}>
                    <ChannelSelector onSelect={setSelectedChannel} selectedChannel={selectedChannel} />
                </div>
            ) : (
                <div className="import-workspace" style={{ marginTop: '32px' }}>
                    <div className="channel-header glass" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span className="text-muted" style={{ fontSize: '0.7rem' }}>ACTIVE CHANNEL</span>
                            <h3>{CHANNEL_CONFIGS[selectedChannel].name}</h3>
                        </div>
                        <button
                            className="btn-secondary glass-hover"
                            style={{ fontSize: '0.8rem' }}
                            onClick={() => { setSelectedChannel(null); setStats(null); }}
                        >
                            Change Channel
                        </button>
                    </div>

                    <div className="import-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                        <div className="upload-zone glass glass-hover" style={{ padding: '40px', textAlign: 'center', border: '2px dashed var(--glass-border)' }}>
                            {isUploading ? (
                                <div className="loader">PROCESSING...</div>
                            ) : (
                                <label style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                                    <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
                                    <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📤</div>
                                    <p>Upload {CHANNEL_CONFIGS[selectedChannel].name} Order Export</p>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>CSV format required</span>
                                </label>
                            )}
                        </div>

                        <div className="import-stats glass" style={{ padding: '24px' }}>
                            <h3>Import Status</h3>
                            {stats ? (
                                <div className="animate-fade" style={{ marginTop: '20px' }}>
                                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--success)' }}>{stats.count}</p>
                                    <p className="text-muted">Orders from {stats.channel}</p>
                                </div>
                            ) : (
                                <p className="text-muted" style={{ marginTop: '20px' }}>Waiting for upload...</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {importedOrders.length > 0 && (
                <div className="imported-orders" style={{ marginTop: '40px' }}>
                    <h3>Imported Orders Queue</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '20px', marginTop: '20px' }}>
                        {importedOrders.slice(0, 6).map(order => (
                            <OrderJourney key={order.id} orderId={order.id} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UniversalImporter;
