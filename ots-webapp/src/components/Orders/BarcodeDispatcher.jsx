import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useData } from '../../context/DataContext';

const BarcodeDispatcher = () => {
    const { orders, updateOrderStatus } = useData();
    const [scanLog, setScanLog] = useState([]);
    const [lastScan, setLastScan] = useState(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        const onScanSuccess = (decodedText) => {
            // Check if scanned ID exists in our Data Lake
            const order = orders.find(o => o.id === decodedText);

            if (order) {
                updateOrderStatus(decodedText, 'In-Transit');
                setLastScan({ id: decodedText, status: 'SUCCESS', message: 'Order Dispatched' });
                setScanLog(prev => [{ id: decodedText, time: new Date().toLocaleTimeString(), status: 'OK' }, ...prev]);
            } else {
                setLastScan({ id: decodedText, status: 'ERROR', message: 'Unknown Order ID' });
            }
        };

        scanner.render(onScanSuccess, (err) => {
            // Silently handle scan errors (standard for barcode frames)
        });

        return () => {
            scanner.clear().catch(error => console.error("Scanner Cleanup Failed:", error));
        };
    }, [orders, updateOrderStatus]);

    return (
        <div className="dispatcher-view animate-fade">
            <div className="section-header">
                <h2>Barcode Dispatch Hub</h2>
                <p className="text-muted">High-Speed Order Handover & Tracking Activation</p>
            </div>

            <div className="dispatcher-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginTop: '32px' }}>
                <div className="scanner-container glass" style={{ padding: '32px', textAlign: 'center' }}>
                    <div id="reader" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden' }}></div>

                    {lastScan && (
                        <div className={`scan-feedback animate-fade ${lastScan.status === 'SUCCESS' ? 'success' : 'danger'}`}
                            style={{
                                marginTop: '24px',
                                padding: '16px',
                                borderRadius: '8px',
                                background: lastScan.status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                border: `1px solid ${lastScan.status === 'SUCCESS' ? 'var(--success)' : 'var(--danger)'}`
                            }}>
                            <strong>{lastScan.id}</strong>: {lastScan.message}
                        </div>
                    )}
                </div>

                <div className="scan-history glass" style={{ padding: '24px', maxHeight: '500px', overflowY: 'auto' }}>
                    <h3>Live Dispatch Stream</h3>
                    <div className="history-list" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {scanLog.map((log, idx) => (
                            <div key={idx} className="glass-hover" style={{ padding: '12px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
                                <span>{log.id}</span>
                                <span className="text-muted">{log.time}</span>
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
