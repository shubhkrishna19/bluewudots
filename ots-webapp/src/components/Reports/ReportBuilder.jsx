import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import reportingService from '../../services/reportingService';

const ReportBuilder = () => {
    const { orders, skuMaster, inventoryLevels } = useData();
    const [selectedDataType, setSelectedDataType] = useState('orders');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [exportFormat, setExportFormat] = useState('csv');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isGenerating, setIsGenerating] = useState(false);

    const getData = () => {
        let data = [];
        if (selectedDataType === 'orders') {
            data = orders;
            if (statusFilter !== 'all') {
                data = data.filter(o => o.status === statusFilter);
            }
            if (dateRange.start || dateRange.end) {
                data = data.filter(o => {
                    const d = new Date(o.createdAt);
                    if (dateRange.start && d < new Date(dateRange.start)) return false;
                    if (dateRange.end && d > new Date(dateRange.end)) return false;
                    return true;
                });
            }
        } else if (selectedDataType === 'inventory') {
            data = skuMaster.map(sku => ({
                ...sku,
                ...inventoryLevels[sku.code]
            }));
        }
        return data;
    };

    const handleExport = () => {
        setIsGenerating(true);
        const data = getData();
        const filename = `${selectedDataType}_report_${new Date().toISOString().split('T')[0]}`;

        setTimeout(() => {
            try {
                if (exportFormat === 'csv') {
                    reportingService.exportToCSV(data, `${filename}.csv`);
                } else if (exportFormat === 'xlsx') {
                    reportingService.exportToExcel(data, `${filename}.xlsx`);
                } else if (exportFormat === 'pdf') {
                    reportingService.exportToPDF(data, `${filename}.pdf`, `${selectedDataType.toUpperCase()} REPORT`);
                }
            } catch (error) {
                console.error('Export failed:', error);
            }
            setIsGenerating(false);
        }, 800);
    };

    return (
        <div className="report-builder animate-fade">
            <div className="section-header">
                <h2>Custom Report Builder</h2>
                <p className="text-muted">Generate and export tailored operational data</p>
            </div>

            <div className="builder-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
                <div className="setup-panel glass" style={{ padding: '24px' }}>
                    <h3>1. Data Selection</h3>
                    <div className="field-group" style={{ marginTop: '20px' }}>
                        <label>Report Type</label>
                        <select value={selectedDataType} onChange={(e) => setSelectedDataType(e.target.value)} className="glass-input">
                            <option value="orders">Orders & Logistics</option>
                            <option value="inventory">Inventory & Stock</option>
                            <option value="returns">Returns Analytics</option>
                        </select>
                    </div>

                    {selectedDataType === 'orders' && (
                        <div className="field-group" style={{ marginTop: '20px' }}>
                            <label>Order Status</label>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="glass-input">
                                <option value="all">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="In-Transit">In-Transit</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="On-Hold">On-Hold (Risk)</option>
                            </select>
                        </div>
                    )}

                    <div className="date-group" style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                        <div className="field-group" style={{ flex: 1 }}>
                            <label>Start Date</label>
                            <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} className="glass-input" />
                        </div>
                        <div className="field-group" style={{ flex: 1 }}>
                            <label>End Date</label>
                            <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} className="glass-input" />
                        </div>
                    </div>
                </div>

                <div className="export-panel glass" style={{ padding: '24px' }}>
                    <h3>2. Export Settings</h3>
                    <div className="format-selection" style={{ marginTop: '20px' }}>
                        <label>Output Format</label>
                        <div className="format-options" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button className={`format-btn glass ${exportFormat === 'csv' ? 'selected' : ''}`} onClick={() => setExportFormat('csv')}>CSV</button>
                            <button className={`format-btn glass ${exportFormat === 'xlsx' ? 'selected' : ''}`} onClick={() => setExportFormat('xlsx')}>Excel</button>
                            <button className={`format-btn glass ${exportFormat === 'pdf' ? 'selected' : ''}`} onClick={() => setExportFormat('pdf')}>PDF</button>
                        </div>
                    </div>

                    <div className="preview-summary glass" style={{ marginTop: '30px', padding: '15px', background: 'rgba(255,255,255,0.03)' }}>
                        <p style={{ fontSize: '13px', color: '#94a3b8' }}>Preview Summary:</p>
                        <h4 style={{ margin: '10px 0' }}>{getData().length} Records Identified</h4>
                        <p style={{ fontSize: '12px' }}>Filters: {statusFilter !== 'all' ? statusFilter : 'None'} • {dateRange.start || 'Start'} to {dateRange.end || 'End'}</p>
                    </div>

                    <button
                        className="btn-primary"
                        style={{ width: '100%', marginTop: '30px', padding: '15px', fontSize: '16px' }}
                        onClick={handleExport}
                        disabled={isGenerating || getData().length === 0}
                    >
                        {isGenerating ? 'Generating...' : `Generate ${exportFormat.toUpperCase()} Report`}
                    </button>
                </div>
            </div>

            <style jsx>{`
                .glass-input {
                    width: 100%;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 12px;
                    border-radius: 8px;
                    margin-top: 5px;
                }
                label {
                    font-size: 12px;
                    color: #94a3b8;
                    text-transform: uppercase;
                }
                .format-btn {
                    flex: 1;
                    padding: 10px;
                    border-radius: 8px;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .format-btn.selected {
                    background: var(--primary);
                    border-color: var(--primary);
                }
            `}</style>
        </div>
    );
};

export default ReportBuilder;
