import React, { useState } from 'react';
import Papa from 'papaparse';
import { useData } from '../../context/DataContext';
import OrderJourney from '../Orders/OrderJourney';

const AmazonMapper = () => {
    const { orders, setOrders } = useData();
    const [isUploading, setIsUploading] = useState(false);
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

                // Bluewud Node Transformation Logic
                const transformed = rawData.map(row => ({
                    id: row['order-id'] || `BW-IMP-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
                    customer: row['buyer-name'] || 'Marketplace Customer',
                    city: row['ship-city'] || 'Unknown',
                    state: row['ship-state'] || 'Unknown',
                    sku: row['sku'] || 'SKU-UNKNOWN',
                    weight: parseFloat(row['weight']) || 2.0, // Default for estimation
                    status: 'Imported',
                    source: 'Amazon'
                }));

                setOrders(prev => [...transformed, ...prev]);
                setStats({ count: transformed.length });
                setIsUploading(false);
                console.log('Orchestrated Amazon Sync:', transformed);
            },
            error: (err) => {
                console.error('Mapper Engine Error:', err);
                setIsUploading(false);
            }
        });
    };

    return (
        <div className="mapper-container animate-fade">
            <div className="section-header">
                <h2>Universal Import Pipeline</h2>
                <p className="text-muted">Amazon IN Node Connector</p>
            </div>

            <div className="mapping-dashboard grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '32px' }}>
                <div className="upload-zone glass glass-hover" style={{ padding: '40px', textAlign: 'center', border: '2px dashed var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {isUploading ? (
                        <div className="loader">TRANSMITTING DATA...</div>
                    ) : (
                        <label style={{ cursor: 'pointer', width: '100%' }}>
                            <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
                            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>📦</div>
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
                            Waiting for data stream...
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
            <div className="synced-orders-list" style={{ marginTop: '40px' }}>
                <h3>Synced Lifecycle Stream</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    {orders.filter(o => o.source === 'Amazon' || o.status === 'Imported').map(order => (
                        <OrderJourney key={order.id} orderId={order.id} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AmazonMapper;
