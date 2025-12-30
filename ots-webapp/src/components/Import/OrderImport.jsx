import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { normalizeOrder, validateOrder } from '../../utils/dataUtils';
import { logImportComplete } from '../../services/activityLogger';
import { notifyBulkImport } from '../../services/notificationService';

const OrderImport = () => {
    const { importOrders, orders } = useData();
    const fileInputRef = useRef(null);

    const [importMode, setImportMode] = useState('csv');
    const [selectedSource, setSelectedSource] = useState('amazon');
    const [previewData, setPreviewData] = useState([]);
    const [importStatus, setImportStatus] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState([]);

    const sources = [
        { id: 'amazon', name: 'Amazon', icon: '📦', format: 'Amazon Order Report CSV' },
        { id: 'flipkart', name: 'Flipkart', icon: '🛒', format: 'Flipkart Seller CSV' },
        { id: 'shopify', name: 'Shopify', icon: '🏪', format: 'Shopify Orders Export' },
        { id: 'generic', name: 'Generic CSV', icon: '📄', format: 'Standard OTS Format' }
    ];

    // Parse CSV content
    const parseCSV = (content) => {
        const lines = content.trim().split('\n');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
        const records = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
            const record = {};
            headers.forEach((header, idx) => {
                record[header] = values[idx] || '';
            });
            records.push(record);
        }

        return records;
    };

    // Handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const records = parseCSV(content);

                // Normalize based on source
                const normalized = records.map(raw => normalizeOrder(raw, selectedSource));

                // Validate each record
                const validationResults = normalized.map(order => ({
                    order,
                    validation: validateOrder(order)
                }));

                setPreviewData(validationResults);
                setErrors([]);
                setImportStatus({ type: 'preview', count: records.length });
            } catch (error) {
                setErrors([`Failed to parse file: ${error.message}`]);
            }
        };
        reader.readAsText(file);
    };

    // Execute import
    const executeImport = async () => {
        const validOrders = previewData
            .filter(r => r.validation.valid)
            .map(r => r.order);

        if (validOrders.length === 0) {
            setErrors(['No valid orders to import']);
            return;
        }

        setIsProcessing(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing

            const result = importOrders(validOrders, selectedSource);

            setImportStatus({
                type: 'success',
                imported: result.count,
                failed: previewData.length - validOrders.length
            });
            setPreviewData([]);

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            setErrors([`Import failed: ${error.message}`]);
        } finally {
            setIsProcessing(false);
        }
    };

    // Generate sample template
    const downloadTemplate = () => {
        const templates = {
            amazon: 'order-id,buyer-name,buyer-phone-number,ship-address-1,ship-city,ship-state,ship-postal-code,sku,quantity-purchased,item-price\nAMZ-001,John Doe,9876543210,123 Main St,Mumbai,Maharashtra,400001,SKU-001,1,1500',
            flipkart: 'order_item_id,buyer_name,buyer_phone,ship_address,ship_city,ship_state,ship_pincode,sku,quantity,selling_price\nFKT-001,Jane Doe,9876543211,456 Oak Ave,Delhi,Delhi,110001,SKU-002,2,2500',
            shopify: 'order_number,first_name,last_name,phone,address1,city,province,zip,sku,quantity,total_price\n1001,Bob,Smith,9876543212,789 Pine Rd,Bangalore,Karnataka,560001,SKU-003,1,3000',
            generic: 'customerName,phone,address,city,state,pincode,sku,quantity,weight,amount\nCustomer Name,9876543213,Address Line,City,State,123456,SKU-004,1,2.5,2000'
        };

        const content = templates[selectedSource];
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedSource}_import_template.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="order-import animate-fade">
            <div className="section-header">
                <h2>Order Import</h2>
                <p className="text-muted">Import orders from marketplaces and CSV files</p>
            </div>

            {/* Import Status */}
            {importStatus && importStatus.type === 'success' && (
                <div className="success-banner glass animate-fade" style={{
                    padding: '20px',
                    marginTop: '20px',
                    borderLeft: '4px solid var(--success)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <p style={{ fontWeight: '700', color: 'var(--success)' }}>
                            ✅ Import Successful!
                        </p>
                        <p className="text-muted">
                            {importStatus.imported} orders imported
                            {importStatus.failed > 0 && `, ${importStatus.failed} skipped`}
                        </p>
                    </div>
                    <button
                        className="btn-secondary"
                        onClick={() => setImportStatus(null)}
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Errors */}
            {errors.length > 0 && (
                <div className="error-banner glass animate-fade" style={{
                    padding: '16px 20px',
                    marginTop: '20px',
                    borderLeft: '4px solid var(--danger)'
                }}>
                    {errors.map((err, i) => (
                        <p key={i} style={{ color: 'var(--danger)' }}>⚠️ {err}</p>
                    ))}
                </div>
            )}

            {/* Source Selection */}
            <div className="import-sources glass" style={{ padding: '24px', marginTop: '24px' }}>
                <h4 style={{ marginBottom: '16px' }}>📥 Select Import Source</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {sources.map(source => (
                        <div
                            key={source.id}
                            className={`glass glass-hover ${selectedSource === source.id ? 'selected' : ''}`}
                            style={{
                                padding: '20px',
                                cursor: 'pointer',
                                borderLeft: selectedSource === source.id ? '4px solid var(--primary)' : 'none',
                                background: selectedSource === source.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent'
                            }}
                            onClick={() => setSelectedSource(source.id)}
                        >
                            <span style={{ fontSize: '2rem' }}>{source.icon}</span>
                            <h4 style={{ marginTop: '8px' }}>{source.name}</h4>
                            <p className="text-muted" style={{ fontSize: '0.8rem' }}>{source.format}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* File Upload */}
            <div className="upload-section glass" style={{ padding: '24px', marginTop: '24px' }}>
                <h4 style={{ marginBottom: '16px' }}>📄 Upload File</h4>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.txt"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="btn-primary glass-hover"
                        style={{ padding: '14px 28px', cursor: 'pointer' }}
                    >
                        📂 Choose CSV File
                    </label>

                    <button
                        className="btn-secondary glass-hover"
                        style={{ padding: '14px 24px' }}
                        onClick={downloadTemplate}
                    >
                        📥 Download Template
                    </button>

                    {previewData.length > 0 && (
                        <span className="badge" style={{ background: 'var(--primary)', padding: '8px 16px' }}>
                            {previewData.length} records loaded
                        </span>
                    )}
                </div>

                <p className="text-muted" style={{ marginTop: '12px', fontSize: '0.85rem' }}>
                    Supported formats: CSV, TXT. Max 1000 records per import.
                </p>
            </div>

            {/* Preview Table */}
            {previewData.length > 0 && (
                <div className="preview-section glass" style={{ padding: '24px', marginTop: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4>📋 Preview ({previewData.filter(r => r.validation.valid).length} valid / {previewData.length} total)</h4>
                        <button
                            className="btn-primary glass-hover"
                            style={{ padding: '12px 28px' }}
                            onClick={executeImport}
                            disabled={isProcessing || previewData.filter(r => r.validation.valid).length === 0}
                        >
                            {isProcessing ? '⏳ Importing...' : `✅ Import ${previewData.filter(r => r.validation.valid).length} Orders`}
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem' }}>STATUS</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem' }}>CUSTOMER</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem' }}>PHONE</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem' }}>CITY</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem' }}>STATE</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem' }}>SKU</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem' }}>ERRORS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.slice(0, 20).map((row, idx) => (
                                    <tr
                                        key={idx}
                                        style={{
                                            borderBottom: '1px solid var(--glass-border)',
                                            background: row.validation.valid ? 'transparent' : 'rgba(239,68,68,0.1)'
                                        }}
                                    >
                                        <td style={{ padding: '12px' }}>
                                            {row.validation.valid ? (
                                                <span style={{ color: 'var(--success)' }}>✅</span>
                                            ) : (
                                                <span style={{ color: 'var(--danger)' }}>❌</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '12px' }}>{row.order.customerName}</td>
                                        <td style={{ padding: '12px' }}>{row.order.phone}</td>
                                        <td style={{ padding: '12px' }}>{row.order.city}</td>
                                        <td style={{ padding: '12px' }}>{row.order.state}</td>
                                        <td style={{ padding: '12px' }}>{row.order.sku}</td>
                                        <td style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--danger)' }}>
                                            {row.validation.errors?.join(', ') || '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {previewData.length > 20 && (
                            <p className="text-muted" style={{ padding: '12px' }}>
                                Showing 20 of {previewData.length} records
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Quick Stats */}
            <div className="import-stats glass" style={{ padding: '24px', marginTop: '24px' }}>
                <h4 style={{ marginBottom: '16px' }}>📊 Import History</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', textAlign: 'center' }}>
                    <div>
                        <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>{orders.length}</p>
                        <span className="text-muted">Total Orders</span>
                    </div>
                    <div>
                        <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--info)' }}>
                            {orders.filter(o => o.source === 'Amazon').length}
                        </p>
                        <span className="text-muted">From Amazon</span>
                    </div>
                    <div>
                        <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--warning)' }}>
                            {orders.filter(o => o.source === 'Flipkart').length}
                        </p>
                        <span className="text-muted">From Flipkart</span>
                    </div>
                    <div>
                        <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent)' }}>
                            {orders.filter(o => !['Amazon', 'Flipkart', 'Shopify'].includes(o.source)).length}
                        </p>
                        <span className="text-muted">Other Sources</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderImport;
