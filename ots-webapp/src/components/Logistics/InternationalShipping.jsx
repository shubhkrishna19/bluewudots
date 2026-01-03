import React, { useState } from 'react';
import { compareInternationalRates, createInternationalShipment } from '../../services/internationalShippingService';

const InternationalShipping = () => {
    const [country, setCountry] = useState('USA');
    const [weight, setWeight] = useState(5);
    const [rates, setRates] = useState([]);
    const [selectedRate, setSelectedRate] = useState(null);
    const [bookingStatus, setBookingStatus] = useState(null);

    const countries = ['USA', 'UK', 'Germany', 'UAE', 'Singapore', 'Australia', 'Canada', 'France'];

    const fetchRates = () => {
        const results = compareInternationalRates(country, weight);
        setRates(results);
        setSelectedRate(null);
        setBookingStatus(null);
    };

    const handleBooking = async () => {
        if (!selectedRate) return;

        setBookingStatus({ loading: true });

        const result = await createInternationalShipment(
            { id: 'DEMO-' + Date.now(), weight, country },
            selectedRate.carrierId
        );

        setBookingStatus(result);
    };

    return (
        <div className="international-shipping animate-fade">
            <div className="section-header">
                <h2>🌍 International Shipping</h2>
                <p className="text-muted">Compare DHL, FedEx, and Aramex rates for global exports</p>
            </div>

            <div className="rate-finder glass" style={{ padding: '24px', marginTop: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>Rate Calculator</h3>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}>DESTINATION</label>
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            style={{ width: '100%', padding: '12px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                        >
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}>WEIGHT (KG)</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(parseFloat(e.target.value) || 1)}
                            style={{ width: '100%', padding: '12px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                        />
                    </div>
                    <button
                        className="btn-primary glass-hover"
                        style={{ padding: '12px 28px' }}
                        onClick={fetchRates}
                    >
                        Get Rates
                    </button>
                </div>
            </div>

            {rates.length > 0 && (
                <div className="rates-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '32px' }}>
                    {rates.map((rate, idx) => (
                        <div
                            key={rate.carrierId}
                            className={`rate-card glass glass-hover ${selectedRate?.carrierId === rate.carrierId ? 'selected' : ''}`}
                            style={{
                                padding: '24px',
                                cursor: 'pointer',
                                borderLeft: selectedRate?.carrierId === rate.carrierId ? '4px solid var(--primary)' : '4px solid transparent',
                                background: selectedRate?.carrierId === rate.carrierId ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                            }}
                            onClick={() => setSelectedRate(rate)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '2rem' }}>{rate.logo}</span>
                                    <div>
                                        <h4>{rate.carrier}</h4>
                                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>{rate.zone}</span>
                                    </div>
                                </div>
                                {idx === 0 && (
                                    <span className="badge" style={{ background: 'var(--success)', fontSize: '0.65rem' }}>CHEAPEST</span>
                                )}
                            </div>

                            <div style={{ marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span className="text-muted">Base Rate</span>
                                    <span>₹{rate.baseRate.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span className="text-muted">Fuel Surcharge</span>
                                    <span>₹{rate.fuelSurcharge.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '12px', marginTop: '8px' }}>
                                    <span>Total</span>
                                    <span style={{ color: 'var(--primary)' }}>₹{rate.total.toLocaleString()}</span>
                                </div>
                            </div>

                            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>⏱️ Delivery:</span>
                                <span style={{ fontWeight: '600' }}>{rate.estimatedDays} days</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedRate && (
                <div className="booking-section glass" style={{ marginTop: '32px', padding: '24px', borderTop: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3>Book Shipment</h3>
                            <p className="text-muted" style={{ marginTop: '4px' }}>
                                {selectedRate.carrier} to {country} • {weight}kg • ₹{selectedRate.total.toLocaleString()}
                            </p>
                        </div>
                        <button
                            className="btn-primary glass-hover"
                            style={{ padding: '14px 36px' }}
                            onClick={handleBooking}
                            disabled={bookingStatus?.loading}
                        >
                            {bookingStatus?.loading ? '⏳ Creating...' : '🚀 Create Shipment'}
                        </button>
                    </div>

                    {bookingStatus?.success && (
                        <div className="booking-success animate-fade" style={{ marginTop: '20px', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', borderLeft: '4px solid var(--success)' }}>
                            <p style={{ fontWeight: '700', color: 'var(--success)' }}>✅ Shipment Created Successfully!</p>
                            <p style={{ marginTop: '8px' }}>
                                <strong>Tracking #:</strong> {bookingStatus.trackingNumber}
                            </p>
                            <p>
                                <strong>Est. Delivery:</strong> {new Date(bookingStatus.estimatedDelivery).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {rates.length === 0 && (
                <div className="glass" style={{ padding: '60px', textAlign: 'center', marginTop: '32px' }}>
                    <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🌐</p>
                    <h3>Enter destination and weight</h3>
                    <p className="text-muted">We'll compare rates from DHL, FedEx, and Aramex</p>
                </div>
            )}
        </div>
    );
};

export default InternationalShipping;
