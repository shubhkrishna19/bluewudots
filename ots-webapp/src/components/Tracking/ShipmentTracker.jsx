import React from 'react';
import { useData } from '../../context/DataContext';

const ShipmentTracker = () => {
    const { orders } = useData();

    // Mock shipments with tracking events
    const activeShipments = [
        {
            orderId: 'BW-9902',
            customer: 'Priya Sharma',
            origin: 'Bangalore Warehouse',
            destination: 'Delhi',
            carrier: 'Delhivery',
            awb: 'DEL789456123',
            eta: '2024-12-31',
            currentLocation: 'Lucknow Hub',
            events: [
                { time: '2024-12-29 09:00', status: 'Picked Up', location: 'Bangalore Warehouse' },
                { time: '2024-12-29 18:00', status: 'In Transit', location: 'Hyderabad Hub' },
                { time: '2024-12-30 06:00', status: 'In Transit', location: 'Nagpur Hub' },
                { time: '2024-12-30 16:00', status: 'In Transit', location: 'Lucknow Hub' }
            ]
        },
        {
            orderId: 'BW-9907',
            customer: 'Arjun Nair',
            origin: 'Bangalore Warehouse',
            destination: 'Kochi',
            carrier: 'BlueDart',
            awb: 'BD456123789',
            eta: '2025-01-01',
            currentLocation: 'Chennai Hub',
            events: [
                { time: '2024-12-30 10:00', status: 'Picked Up', location: 'Bangalore Warehouse' },
                { time: '2024-12-30 18:00', status: 'In Transit', location: 'Chennai Hub' }
            ]
        }
    ];

    return (
        <div className="shipment-tracker animate-fade">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2>Live Shipment Tracker</h2>
                    <p className="text-muted">Real-time tracking for in-transit orders</p>
                </div>
                <span className="badge" style={{ background: 'var(--info)', fontSize: '1rem', padding: '8px 16px' }}>
                    {activeShipments.length} In Transit
                </span>
            </div>

            <div className="shipments-list" style={{ marginTop: '32px' }}>
                {activeShipments.map(shipment => (
                    <div key={shipment.orderId} className="shipment-card glass" style={{ padding: '28px', marginBottom: '24px' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <h3 style={{ color: 'var(--primary)' }}>{shipment.orderId}</h3>
                                    <span className="badge" style={{ background: 'var(--info)' }}>🚚 In Transit</span>
                                </div>
                                <p style={{ marginTop: '6px' }}>{shipment.customer}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontWeight: '700' }}>{shipment.carrier}</p>
                                <p className="text-muted" style={{ fontSize: '0.85rem' }}>AWB: {shipment.awb}</p>
                            </div>
                        </div>

                        {/* Route Visualization */}
                        <div className="route-visual glass" style={{ padding: '20px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ fontSize: '1.5rem' }}>📦</span>
                                    <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>{shipment.origin.split(' ')[0]}</p>
                                </div>
                                <div style={{ flex: 1, height: '4px', background: 'var(--glass-border)', margin: '0 16px', position: 'relative' }}>
                                    <div style={{
                                        width: `${(shipment.events.length / 6) * 100}%`,
                                        height: '100%',
                                        background: 'var(--primary)',
                                        borderRadius: '2px'
                                    }}></div>
                                    <div style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        left: `${(shipment.events.length / 6) * 100}%`,
                                        transform: 'translateX(-50%)',
                                        fontSize: '1.2rem'
                                    }}>🚚</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ fontSize: '1.5rem' }}>🏠</span>
                                    <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>{shipment.destination}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Currently at: <strong>{shipment.currentLocation}</strong></span>
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>ETA: <strong>{shipment.eta}</strong></span>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="tracking-timeline">
                            <h4 style={{ marginBottom: '16px' }}>Tracking History</h4>
                            <div style={{ position: 'relative', paddingLeft: '24px' }}>
                                <div style={{ position: 'absolute', left: '6px', top: '8px', bottom: '8px', width: '2px', background: 'var(--glass-border)' }}></div>
                                {shipment.events.map((event, idx) => (
                                    <div key={idx} style={{ position: 'relative', marginBottom: '16px', paddingLeft: '20px' }}>
                                        <div style={{
                                            position: 'absolute',
                                            left: '-18px',
                                            top: '4px',
                                            width: '14px',
                                            height: '14px',
                                            borderRadius: '50%',
                                            background: idx === shipment.events.length - 1 ? 'var(--primary)' : 'var(--glass-border)',
                                            border: '2px solid var(--bg-main)'
                                        }}></div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <p style={{ fontWeight: '700' }}>{event.status}</p>
                                                <p className="text-muted" style={{ fontSize: '0.85rem' }}>{event.location}</p>
                                            </div>
                                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>{event.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {activeShipments.length === 0 && (
                <div className="glass" style={{ padding: '60px', textAlign: 'center', marginTop: '24px' }}>
                    <p style={{ fontSize: '2rem', marginBottom: '12px' }}>📭</p>
                    <p className="text-muted">No shipments currently in transit</p>
                </div>
            )}
        </div>
    );
};

export default ShipmentTracker;
