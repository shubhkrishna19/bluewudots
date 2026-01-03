import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { toCSV, downloadFile, formatDateIN, calculateGST } from '../../utils/dataUtils';
import { toCSV, downloadFile, formatDateIN, calculateGST } from '../../utils/dataUtils';
import { useSecurity } from '../../context/SecurityContext'; // Use new security context

const ExportTools = () => {
    const { orders, skuMaster, inventory, getOrderStats } = useData();
    const { logActivity } = useSecurity();
    const [exportStatus, setExportStatus] = useState(null);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const stats = getOrderStats();

    const exportToCSV = (data, filename, columns = null) => {
        if (!data.length) {
            setExportStatus({ type: 'error', message: 'No data to export' });
            return;
        }

        const csv = toCSV(data, columns);
        downloadFile(csv, `${filename}_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');

        downloadFile(csv, `${filename}_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');

        logActivity('EXPORT', `CSV: ${filename}`, { count: data.length });
        setExportStatus({ type: 'success', message: `Exported ${data.length} records to CSV` });
        setTimeout(() => setExportStatus(null), 3000);
    };

    const exportToJSON = (data, filename) => {
        if (!data.length) {
            setExportStatus({ type: 'error', message: 'No data to export' });
            return;
        }

        downloadFile(JSON.stringify(data, null, 2), `${filename}_${new Date().toISOString().split('T')[0]}.json`, 'application/json');

        downloadFile(JSON.stringify(data, null, 2), `${filename}_${new Date().toISOString().split('T')[0]}.json`, 'application/json');

        logActivity('EXPORT', `JSON: ${filename}`, { count: data.length });
        setExportStatus({ type: 'success', message: `Exported ${data.length} records to JSON` });
        setTimeout(() => setExportStatus(null), 3000);
    };

    // Filter orders by date range
    const filterByDate = (data) => {
        if (!dateRange.start && !dateRange.end) return data;
        return data.filter(item => {
            const date = new Date(item.createdAt);
            if (dateRange.start && date < new Date(dateRange.start)) return false;
            if (dateRange.end && date > new Date(dateRange.end)) return false;
            return true;
        });
    };

    // Generate invoice summary report
    const generateInvoiceReport = () => {
        const invoiceData = orders
            .filter(o => o.status === 'Delivered')
            .map(o => {
                const gst = calculateGST(o.amount || 0);
                return {
                    orderId: o.id,
                    customer: o.customerName,
                    state: o.state,
                    sku: o.sku,
                    quantity: o.quantity,
                    baseAmount: gst.baseAmount,
                    cgst: gst.cgst.toFixed(2),
                    sgst: gst.sgst.toFixed(2),
                    totalWithGST: gst.totalWithGst.toFixed(2),
                    deliveryDate: o.deliveryDate || 'N/A'
                };
            });

        exportToCSV(invoiceData, 'Invoice_Report', ['orderId', 'customer', 'state', 'sku', 'quantity', 'baseAmount', 'cgst', 'sgst', 'totalWithGST', 'deliveryDate']);
    };

    // Generate carrier performance report
    const generateCarrierReport = () => {
        const carrierStats = {};
        orders.forEach(o => {
            if (o.carrier) {
                if (!carrierStats[o.carrier]) {
                    carrierStats[o.carrier] = { total: 0, delivered: 0, rto: 0, inTransit: 0 };
                }
                carrierStats[o.carrier].total++;
                if (o.status === 'Delivered') carrierStats[o.carrier].delivered++;
                if (o.status.startsWith('RTO')) carrierStats[o.carrier].rto++;
                if (['In-Transit', 'Out-for-Delivery', 'Picked-Up'].includes(o.status)) carrierStats[o.carrier].inTransit++;
            }
        });

        const reportData = Object.entries(carrierStats).map(([carrier, stats]) => ({
            carrier,
            totalShipments: stats.total,
            delivered: stats.delivered,
            inTransit: stats.inTransit,
            rto: stats.rto,
            deliveryRate: ((stats.delivered / stats.total) * 100).toFixed(1) + '%',
            rtoRate: ((stats.rto / stats.total) * 100).toFixed(1) + '%'
        }));

        exportToCSV(reportData, 'Carrier_Performance');
    };

    // Generate inventory report
    const generateInventoryReport = () => {
        const invData = skuMaster.map(sku => {
            const inv = inventory.find(i => i.sku === sku.code) || {};
            return {
                sku: sku.code,
                name: sku.name,
                category: sku.category,
                mrp: sku.mrp,
                cost: sku.cost,
                profit: sku.mrp - sku.cost,
                inStock: inv.inStock || 0,
                reserved: inv.reserved || 0,
                available: inv.available || 0,
                reorderLevel: inv.reorderLevel || 0,
                lowStock: (inv.available || 0) <= (inv.reorderLevel || 0) ? 'YES' : 'NO'
            };
        });
        exportToCSV(invData, 'Inventory_Report');
    };

    const reports = [
        {
            name: 'All Orders',
            icon: '📦',
            data: filterByDate(orders),
            count: filterByDate(orders).length,
            description: 'Complete order data with all fields',
            columns: ['id', 'externalId', 'source', 'customerName', 'phone', 'city', 'state', 'pincode', 'sku', 'quantity', 'amount', 'weight', 'status', 'carrier', 'awb', 'createdAt']
        },
        {
            name: 'Pending Orders',
            icon: '⏳',
            data: orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status) && !o.status.startsWith('RTO')),
            count: orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status) && !o.status.startsWith('RTO')).length,
            description: 'Orders requiring action',
            columns: ['id', 'source', 'customerName', 'city', 'state', 'sku', 'status', 'carrier', 'createdAt']
        },
        {
            name: 'Delivered Orders',
            icon: '✅',
            data: orders.filter(o => o.status === 'Delivered'),
            count: orders.filter(o => o.status === 'Delivered').length,
            description: 'Successfully delivered orders',
            columns: ['id', 'customerName', 'city', 'state', 'sku', 'amount', 'carrier', 'awb', 'createdAt']
        },
        {
            name: 'RTO Orders',
            icon: '↩️',
            data: orders.filter(o => o.status.startsWith('RTO')),
            count: orders.filter(o => o.status.startsWith('RTO')).length,
            description: 'Return to origin orders',
            columns: ['id', 'customerName', 'city', 'state', 'status', 'carrier', 'awb', 'rtoReason']
        },
        {
            name: 'SKU Master',
            icon: '🏷️',
            data: skuMaster,
            count: skuMaster.length,
            description: 'Product catalog with pricing and HSN',
            columns: ['code', 'name', 'category', 'cost', 'mrp', 'weight', 'hsnCode', 'gstRate', 'inStock']
        }
    ];

    const specialReports = [
        { name: 'Invoice Summary', icon: '🧾', action: generateInvoiceReport, description: 'GST-compliant invoice data' },
        { name: 'Carrier Performance', icon: '📊', action: generateCarrierReport, description: 'Delivery rate by carrier' },
        { name: 'Inventory Status', icon: '📦', action: generateInventoryReport, description: 'Stock levels with low-stock flags' }
    ];

    return (
        <div className="export-tools animate-fade">
            <div className="section-header">
                <h2>Export & Reports</h2>
                <p className="text-muted">Download data for offline analysis and compliance</p>
            </div>

            {/* Status Banner */}
            {exportStatus && (
                <div className={`status-banner animate-fade glass`} style={{
                    padding: '12px 20px',
                    marginTop: '16px',
                    borderLeft: `4px solid ${exportStatus.type === 'success' ? 'var(--success)' : 'var(--danger)'}`
                }}>
                    {exportStatus.type === 'success' ? '✅' : '⚠️'} {exportStatus.message}
                </div>
            )}

            {/* Date Filter */}
            <div className="glass" style={{ padding: '20px', marginTop: '24px' }}>
                <h4 style={{ marginBottom: '12px' }}>📅 Date Range Filter (for Orders)</h4>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                        <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>FROM</label>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            style={{ padding: '10px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: '#fff' }}
                        />
                    </div>
                    <div>
                        <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>TO</label>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            style={{ padding: '10px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: '#fff' }}
                        />
                    </div>
                    <button
                        className="btn-secondary"
                        style={{ padding: '10px 16px', marginTop: '18px' }}
                        onClick={() => setDateRange({ start: '', end: '' })}
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Standard Reports */}
            <h3 style={{ marginTop: '32px', marginBottom: '16px' }}>📄 Standard Reports</h3>
            <div className="export-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
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
                                onClick={() => exportToCSV(report.data, report.name.replace(/\s/g, '_'), report.columns)}
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

            {/* Special Reports */}
            <h3 style={{ marginTop: '32px', marginBottom: '16px' }}>📊 Analytics Reports</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {specialReports.map((report, idx) => (
                    <div key={idx} className="glass glass-hover" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <span style={{ fontSize: '1.5rem' }}>{report.icon}</span>
                            <div>
                                <h4>{report.name}</h4>
                                <p className="text-muted" style={{ fontSize: '0.8rem' }}>{report.description}</p>
                            </div>
                        </div>
                        <button
                            className="btn-primary glass-hover"
                            style={{ width: '100%', padding: '10px' }}
                            onClick={report.action}
                        >
                            Generate Report
                        </button>
                    </div>
                ))}
            </div>

            {/* Quick Stats */}
            <div className="quick-stats glass" style={{ marginTop: '32px', padding: '24px' }}>
                <h3>📈 Data Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>{stats.total}</p>
                        <span className="text-muted">Total Orders</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>{stats.delivered}</p>
                        <span className="text-muted">Delivered</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--info)' }}>{stats.inTransit}</p>
                        <span className="text-muted">In Transit</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--warning)' }}>{stats.pending}</p>
                        <span className="text-muted">Pending</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--danger)' }}>{stats.rto}</p>
                        <span className="text-muted">RTO</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent)' }}>{stats.deliveryRate}%</p>
                        <span className="text-muted">Delivery Rate</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportTools;
