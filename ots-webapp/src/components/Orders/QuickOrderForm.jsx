import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const QuickOrderForm = ({ onClose }) => {
    const { setOrders } = useData();
    const [formData, setFormData] = useState({
        customer: '',
        city: '',
        state: '',
        sku: '',
        weight: '',
        source: 'Local Shop'
    });

    const STATES = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
        'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
        'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const newOrder = {
            id: `BW-${Date.now().toString().slice(-6)}`,
            ...formData,
            weight: parseFloat(formData.weight) || 2.0,
            status: 'Imported',
            createdAt: new Date().toISOString()
        };
        setOrders(prev => [newOrder, ...prev]);
        console.log('Quick Order Created:', newOrder);
        onClose?.();
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="quick-order-form glass animate-fade" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2>Create Quick Order</h2>
                    <p className="text-muted">Add a new order to the system</p>
                </div>
                {onClose && (
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                )}
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                        <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>CUSTOMER NAME *</label>
                        <input
                            type="text"
                            required
                            value={formData.customer}
                            onChange={(e) => handleChange('customer', e.target.value)}
                            placeholder="Enter customer name"
                            style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>SKU CODE *</label>
                        <input
                            type="text"
                            required
                            value={formData.sku}
                            onChange={(e) => handleChange('sku', e.target.value)}
                            placeholder="e.g. BL-DESK-01"
                            style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>CITY *</label>
                        <input
                            type="text"
                            required
                            value={formData.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            placeholder="Enter city"
                            style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>STATE *</label>
                        <select
                            required
                            value={formData.state}
                            onChange={(e) => handleChange('state', e.target.value)}
                            style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                        >
                            <option value="">Select State</option>
                            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>WEIGHT (KG)</label>
                        <input
                            type="number"
                            step="0.5"
                            value={formData.weight}
                            onChange={(e) => handleChange('weight', e.target.value)}
                            placeholder="2.0"
                            style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                        />
                    </div>

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
                        </select>
                    </div>
                </div>

                <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn-primary glass-hover" style={{ flex: 1, padding: '14px' }}>
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
