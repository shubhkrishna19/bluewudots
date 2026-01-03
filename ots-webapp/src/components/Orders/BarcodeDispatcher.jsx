import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useData } from '../../context/DataContext';
import labelGenerator from '../../services/labelGeneratorEnhanced';

const BarcodeDispatcher = () => {
    const { orders, updateOrderStatus } = useData();
    const [scanLog, setScanLog] = useState([]);
    const [lastScan, setLastScan] = useState(null);
    const [selectedCarrier, setSelectedCarrier] = useState('delhivery');
    const [autoPrint, setAutoPrint] = useState(false);
    const [printFormat, setPrintFormat] = useState('pdf');

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        const onScanSuccess = async (decodedText) => {
            // Check if scanned ID exists in our Data Lake
            // Can be Order ID or SKU Code
            const order = orders.find(o => o.id === decodedText || o.orderId === decodedText);

            if (order) {
                updateOrderStatus(order.id, 'In-Transit');
                setLastScan({ id: order.id, status: 'SUCCESS', message: 'Order Dispatched' });
                setScanLog(prev => [{ id: order.id, time: new Date().toLocaleTimeString(), status: 'OK' }, ...prev]);

                if (autoPrint) {
                    handlePrint(order);
                }
            } else {
                setLastScan({ id: decodedText, status: 'ERROR', message: 'Unknown Order ID' });
            }
        };

        scanner.render(onScanSuccess, (err) => {
            // Silently handle scan errors
        });

        return () => {
            scanner.clear().catch(error => console.error("Scanner Cleanup Failed:", error));
        };
    }, [orders, updateOrderStatus, autoPrint, selectedCarrier]);

    const handlePrint = async (order) => {
        try {
            const labelData = await labelGenerator.generateLabel(order, selectedCarrier);
            if (printFormat === 'zpl') {
                const zpl = labelGenerator.generateZPL(labelData);
                console.log("Sending ZPL to thermal printer:", zpl);
                alert(`ZPL Generated for ${order.id}. Check console for raw code.`);
            } else {
                await labelGenerator.exportLabelAsPDF(labelData);
                alert(`PDF Label Generated for ${order.id}`);
            }
        } catch (error) {
            console.error("Print failed:", error);
            alert("Label generation failed. Check data.");
        }
    };

    return (
        <div className="dispatcher-view animate-fade">
            <div className="section-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                        <h2>Barcode Dispatch Hub</h2>
                        <p className="text-muted">High-Speed Order Handover & Tracking Activation</p>
                    </div>
                    <div className="hub-controls glass" style={{ padding: '12px 20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div className="control-group">
                            <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>CARRIER</label>
                            <select
                                value={selectedCarrier}
                                onChange={(e) => setSelectedCarrier(e.target.value)}
                                className="glass-select"
                                style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--glass-border)', borderRadius: '4px', padding: '4px' }}
                            >
                                <option value="delhivery">Delhivery</option>
                                <option value="bluedart">BlueDart</option>
                                <option value="xpressbees">XpressBees</option>
                            </select>
                        </div>
                        <div className="control-group">
                            <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>FORMAT</label>
                            <select
                                value={printFormat}
                                onChange={(e) => setPrintFormat(e.target.value)}
                                className="glass-select"
                                style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--glass-border)', borderRadius: '4px', padding: '4px' }}
                            >
                                <option value="pdf">Standard (PDF)</option>
                                <option value="zpl">Thermal (ZPL)</option>
                            </select>
                        </div>
                        <div className="control-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '15px' }}>
                            <input
                                type="checkbox"
                                id="autoprint"
                                checked={autoPrint}
                                onChange={(e) => setAutoPrint(e.target.checked)}
                            />
                            <label htmlFor="autoprint" style={{ fontSize: '0.85rem' }}>Auto-Print</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dispatcher-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginTop: '32px' }}>
                <div className="scanner-container glass" style={{ padding: '32px', textAlign: 'center' }}>
                    <div id="reader" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden' }}></div>

                    {lastScan && (
                        <div className={`scan-feedback animate-fade ${lastScan.status === 'SUCCESS' ? 'success' : 'danger'}`}
                            style={{
                                marginTop: '24px',
                                padding: '20px',
                                borderRadius: '12px',
                                background: lastScan.status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                border: `1px solid ${lastScan.status === 'SUCCESS' ? 'var(--success)' : 'var(--danger)'}`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                            <div>
                                <strong>{lastScan.id}</strong>: {lastScan.message}
                            </div>
                            {lastScan.status === 'SUCCESS' && (
                                <button
                                    className="btn-primary glass-hover"
                                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                    onClick={() => handlePrint(orders.find(o => o.id === lastScan.id))}
                                >
                                    🖨️ Re-Print
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="scan-history glass" style={{ padding: '24px', maxHeight: '500px', overflowY: 'auto' }}>
                    <h3>Live Dispatch Stream</h3>
                    <div className="history-list" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {scanLog.map((log, idx) => (
                            <div key={idx} className="glass-hover" style={{ padding: '12px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontWeight: '600' }}>{log.id}</span>
                                    <p className="text-muted" style={{ fontSize: '0.75rem', margin: 0 }}>{log.time}</p>
                                </div>
                                <span className={`badge ${log.status === 'OK' ? 'badge-success' : 'badge-danger'}`} style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>
                                    {log.status}
                                </span>
                            </div>
                        ))}
                        {scanLog.length === 0 && <p className="text-muted">Waiting for first scan...</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BarcodeDispatcher;
