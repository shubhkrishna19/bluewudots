import React from 'react';
import { useData } from '../../context/DataContext';

const ExportTools = () => {
    const { orders, skuMaster, logistics } = useData();

    const exportToCSV = (data, filename) => {
        if (!data.length) return alert('No data to export');

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const exportToJSON = (data, filename) => {
        if (!data.length) return alert('No data to export');

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const reports = [
        {
            name: 'Orders Report',
            icon: '📦',
            data: orders,
            count: orders.length,
            description: 'All orders with status and customer info'
        },
        {
            name: 'SKU Master',
            icon: '🏷️',
            data: skuMaster,
            count: skuMaster.length,
            description: 'Product catalog with BOM costs'
        },
        {
            name: 'Carrier Rates',
            icon: '🚚',
            data: logistics,
            count: logistics.length,
            description: 'Logistics rates and configurations'
        },
        {
            name: 'Pending Orders',
            icon: '⏳',
            data: orders.filter(o => o.status !== 'Delivered'),
            count: orders.filter(o => o.status !== 'Delivered').length,
            description: 'Orders not yet delivered'
        },
        {
            name: 'Delivered Orders',
            icon: '✅',
            data: orders.filter(o => o.status === 'Delivered'),
            count: orders.filter(o => o.status === 'Delivered').length,
            description: 'Successfully delivered orders'
        }
    ];

    return (
        <div className="export-tools animate-fade">
            <div className="section-header">
                <h2>Export & Reports</h2>
                <p className="text-muted">Download data for offline analysis</p>
            </div>

            <div className="export-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '32px' }}>
                {reports.map((report, idx) => (
                    <div key={idx} className="export-card glass glass-hover" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                                <span style={{ fontSize: '2rem' }}>{report.icon}</span>
                                <h3 style={{ marginTop: '8px' }}>{report.name}</h3>
                            </div>
                            <span className="badge" style={{ background: 'var(--primary)' }}>{report.count} records</span>
                        </div>
                        <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '20px' }}>{report.description}</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                className="btn-primary glass-hover"
                                style={{ flex: 1, fontSize: '0.8rem' }}
                                onClick={() => exportToCSV(report.data, report.name.replace(/\s/g, '_'))}
                            >
                                📄 CSV
                            </button>
                            <button
                                className="btn-secondary glass-hover"
                                style={{ flex: 1, fontSize: '0.8rem' }}
                                onClick={() => exportToJSON(report.data, report.name.replace(/\s/g, '_'))}
                            >
                                📋 JSON
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="quick-stats glass" style={{ marginTop: '32px', padding: '24px' }}>
                <h3>Data Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>{orders.length}</p>
                        <span className="text-muted">Total Orders</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>{orders.filter(o => o.status === 'Delivered').length}</p>
                        <span className="text-muted">Delivered</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent)' }}>{skuMaster.length}</p>
                        <span className="text-muted">SKUs</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--info)' }}>{logistics.length}</p>
                        <span className="text-muted">Carriers</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportTools;
