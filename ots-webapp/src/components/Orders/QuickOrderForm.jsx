import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { STATE_CODES } from '../../utils/dataUtils';

const QuickOrderForm = ({ onClose }) => {
    const { addOrder, skuMaster, getCarrierRates, getCarrierRecommendation, syncOrderToZoho } = useData();
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        sku: '',
        quantity: 1,
        weight: '',
        amount: '',
        source: 'Local Shop',
        isCOD: false,
        codAmount: '',
        carrierId: '',
        carrierName: ''
    });
    const [recommendedCarrier, setRecommendedCarrier] = useState(null);
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState(null);
    const [shippingRates, setShippingRates] = useState(null);
    const [zohoSyncing, setZohoSyncing] = useState(false);
    const [zohoStatus, setZohoStatus] = useState(null);

    const STATES = Object.keys(STATE_CODES);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);

        const result = addOrder({
            ...formData,
            weight: parseFloat(formData.weight) || 2.0,
            quantity: parseInt(formData.quantity) || 1,
            amount: parseFloat(formData.amount) || 0,
            codAmount: formData.isCOD ? parseFloat(formData.codAmount || formData.amount) : 0
        });

        if (result.success) {
            setSuccess(result.order.id);

            // Sync to Zoho CRM
            setZohoSyncing(true);
            syncOrderToZoho(result.order).then(res => {
                setZohoSyncing(false);
                setZohoStatus(res.success ? 'synced' : 'error');
            });

            setTimeout(() => {
                onClose?.();
            }, 3000); // Wait a bit longer to show sync status
        } else {
            setErrors(result.errors);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear errors on change
        if (errors.length > 0) setErrors([]);
        if (success) setSuccess(null);

        // Auto-populate from SKU master
        if (field === 'sku') {
            const sku = skuMaster.find(s => s.code === value);
            if (sku) {
                setFormData(prev => ({
                    ...prev,
                    sku: value,
                    weight: sku.weight?.toString() || prev.weight,
                    amount: sku.mrp?.toString() || prev.amount
                }));
            }
        }
    };

    const calculateRates = () => {
        if (formData.state && formData.weight) {
            const rates = getCarrierRates({
                state: formData.state,
                city: formData.city,
                weight: parseFloat(formData.weight),
                isCOD: formData.isCOD,
                codAmount: parseFloat(formData.codAmount || formData.amount || 0)
            });
            setShippingRates(rates.slice(0, 3)); // Top 3 carriers

            // Get recommendation
            const recommendation = getCarrierRecommendation({
                state: formData.state,
                city: formData.city,
                weight: parseFloat(formData.weight),
                isCOD: formData.isCOD,
                codAmount: parseFloat(formData.codAmount || formData.amount || 0)
            }, 'smart');

            setRecommendedCarrier(recommendation);
            if (recommendation && !formData.carrierId) {
                setFormData(prev => ({
                    ...prev,
                    carrierId: recommendation.carrierId,
                    carrierName: recommendation.carrierName
                }));
            }
        }
    };

    return (
        <div className="quick-order-form glass animate-fade" style={{ padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2>Create Quick Order</h2>
                    <p className="text-muted">Add a new order with validation</p>
                </div>
                {onClose && (
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                )}
            </div>

            <div className="success-banner animate-fade" style={{
                padding: '16px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid var(--success)',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center'
            }}>
                <p>✅ Order <strong>{success}</strong> created successfully!</p>
                <div style={{ marginTop: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {zohoSyncing ? (
                        <span className="text-muted">🔄 Syncing to Zoho CRM...</span>
                    ) : zohoStatus === 'synced' ? (
                        <span style={{ color: 'var(--success)' }}>☁️ Synced to Zoho CRM</span>
                    ) : zohoStatus === 'error' ? (
                        <span style={{ color: 'var(--danger)' }}>⚠️ Zoho CRM sync failed (cached locally)</span>
                    ) : null}
                </div>
            </div>

            {/* Error Messages */}
            {errors.length > 0 && (
                <div className="error-banner animate-fade" style={{
                    padding: '16px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid var(--danger)',
                    borderRadius: '8px',
                    marginBottom: '20px'
                }}>
                    <p style={{ fontWeight: '700', marginBottom: '8px', color: 'var(--danger)' }}>⚠️ Please fix the following:</p>
                    {errors.map((err, i) => (
                        <p key={i} style={{ fontSize: '0.85rem', color: 'var(--danger)' }}>• {err}</p>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Customer Section */}
                <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ marginBottom: '16px', color: 'var(--primary)' }}>👤 Customer Details</h4>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>CUSTOMER NAME *</label>
                            <input
                                type="text"
                                required
                                value={formData.customerName}
                                onChange={(e) => handleChange('customerName', e.target.value)}
                                placeholder="Enter customer name"
                                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                            />
                        </div>

                        <div className="form-group">
                            <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>PHONE *</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                placeholder="10-digit mobile"
                                maxLength={10}
                                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Address Section */}
                <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ marginBottom: '16px', color: 'var(--primary)' }}>📍 Shipping Address</h4>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>ADDRESS</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                placeholder="Street address, building, etc."
                                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                            />
                        </div>
                    </div>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '16px' }}>
                        <div className="form-group">
                            <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>CITY *</label>
                            <input
                                type="text"
                                required
                                value={formData.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                                placeholder="City"
                                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                            />
                        </div>

                        <div className="form-group">
                            <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>STATE *</label>
                            <select
                                required
                                value={formData.state}
                                onChange={(e) => handleChange('state', e.target.value)}
                                onBlur={calculateRates}
                                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                            >
                                <option value="">Select State</option>
                                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>PINCODE *</label>
                            <input
                                type="text"
                                required
                                value={formData.pincode}
                                onChange={(e) => handleChange('pincode', e.target.value)}
                                placeholder="6-digit"
                                maxLength={6}
                                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Product Section */}
                <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ marginBottom: '16px', color: 'var(--primary)' }}>📦 Product Details</h4>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>SKU CODE *</label>
                            <select
                                value={formData.sku}
                                onChange={(e) => handleChange('sku', e.target.value)}
                                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                            >
                                <option value="">Select or type SKU</option>
                                {skuMaster.map(s => (
                                    <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>QTY</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.quantity}
                                onChange={(e) => handleChange('quantity', e.target.value)}
                                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                            />
                        </div>

                        <div className="form-group">
                            <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>WEIGHT (KG) *</label>
                            <input
                                type="number"
                                step="0.5"
                                required
                                value={formData.weight}
                                onChange={(e) => handleChange('weight', e.target.value)}
                                onBlur={calculateRates}
                                placeholder="2.0"
                                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                            />
                        </div>

                        <div className="form-group">
                            <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>AMOUNT (₹)</label>
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => handleChange('amount', e.target.value)}
                                placeholder="0"
                                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Payment & Source */}
                <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ marginBottom: '16px', color: 'var(--primary)' }}>💰 Payment & Source</h4>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>SOURCE CHANNEL</label>
                            <select
                                value={formData.source}
                                onChange={(e) => handleChange('source', e.target.value)}
                                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                            >
                                <option value="Local Shop">Local Shop</option>
                                <option value="Dealer">Dealer</option>
                                <option value="IndiaMART">IndiaMART</option>
                                <option value="Manual">Manual Entry</option>
                                <option value="Phone Order">Phone Order</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>PAYMENT MODE</label>
                            <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        checked={!formData.isCOD}
                                        onChange={() => handleChange('isCOD', false)}
                                    />
                                    Prepaid
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        checked={formData.isCOD}
                                        onChange={() => handleChange('isCOD', true)}
                                    />
                                    COD
                                </label>
                            </div>
                        </div>

                        {formData.isCOD && (
                            <div className="form-group">
                                <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>COD AMOUNT</label>
                                <input
                                    type="number"
                                    value={formData.codAmount || formData.amount}
                                    onChange={(e) => handleChange('codAmount', e.target.value)}
                                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Shipping Rates Preview */}
                {(shippingRates || recommendedCarrier) && (
                    <div className="glass" style={{ padding: '16px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <p className="text-muted" style={{ fontSize: '0.75rem' }}>📊 SHIPPING OPTIONS</p>
                            {recommendedCarrier && (
                                <span className="badge" style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px' }}>
                                    ✨ {recommendedCarrier.recommendation}
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {shippingRates?.map((rate, i) => (
                                <div
                                    key={i}
                                    onClick={() => setFormData(prev => ({ ...prev, carrierId: rate.carrierId, carrierName: rate.carrierName }))}
                                    style={{
                                        padding: '12px',
                                        background: formData.carrierId === rate.carrierId ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-accent)',
                                        border: formData.carrierId === rate.carrierId ? '1px solid var(--primary)' : '1px solid transparent',
                                        borderRadius: '8px',
                                        minWidth: '140px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <p style={{ fontWeight: '700' }}>{rate.carrierLogo} {rate.carrierName}</p>
                                    <p style={{ fontSize: '1.1rem', color: 'var(--success)' }}>₹{rate.total}</p>
                                    <p className="text-muted" style={{ fontSize: '0.75rem' }}>{rate.estimatedDelivery[0]}-{rate.estimatedDelivery[1]} days</p>
                                    {recommendedCarrier?.carrierId === rate.carrierId && (
                                        <p style={{ fontSize: '0.6rem', color: 'var(--primary)', marginTop: '4px' }}>{recommendedCarrier.reason}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn-primary glass-hover" style={{ flex: 1, padding: '14px', fontWeight: '700' }}>
                        ✓ Create Order
                    </button>
                    {onClose && (
                        <button type="button" className="btn-secondary glass-hover" style={{ flex: 1, padding: '14px' }} onClick={onClose}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default QuickOrderForm;
