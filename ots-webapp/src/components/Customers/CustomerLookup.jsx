import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const CustomerLookup = () => {
    const { orders, customerMaster } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Filter unified customer master
    const filteredCustomers = customerMaster?.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm)
    ) || [];

    // Use centralized customer metrics from context
    const { getCustomerMetrics } = useData();


    return (
        <div className="customer-lookup animate-fade">
            <div className="section-header">
                <h2>Customer Directory</h2>
                <p className="text-muted">Order history by customer</p>
            </div>

            <div className="search-bar glass" style={{ padding: '16px', marginTop: '24px' }}>
                <input
                    type="text"
                    placeholder="🔍 Search customers by name or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '14px 20px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: '#fff', fontSize: '1rem' }}
                />
            </div>

            <div className="customer-grid" style={{ display: 'grid', gridTemplateColumns: selectedCustomer ? '1fr 1fr' : '1fr', gap: '24px', marginTop: '24px' }}>
                <div className="customer-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {filteredCustomers.map((customer, idx) => {
                        const metrics = getCustomerMetrics(customer.phone);
                        return (
                            <div
                                key={idx}
                                className={`customer-card glass glass-hover ${selectedCustomer?.phone === customer.phone ? 'selected' : ''}`}
                                style={{
                                    padding: '20px',
                                    cursor: 'pointer',
                                    borderLeft: selectedCustomer?.phone === customer.phone ? '4px solid var(--primary)' : 'none'
                                }}
                                onClick={() => setSelectedCustomer(customer)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h4>{customer.name}</h4>
                                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>{customer.city}, {customer.state}</p>
                                        <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
                                            <span className="badge" style={{
                                                background: metrics.segment === 'VIP' ? 'var(--warning)' :
                                                    metrics.segment === 'At Risk' ? 'var(--danger)' : 'var(--primary)',
                                                fontSize: '0.65rem'
                                            }}>{metrics.segment}</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>₹{metrics.totalSpend.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{metrics.orderCount} orders</span>
                                </div>
                            </div>
                        );
                    })}
                </div>


                {selectedCustomer && (() => {
                    const metrics = getCustomerMetrics(selectedCustomer.phone);
                    return (
                        <div className="customer-detail glass animate-fade" style={{ padding: '28px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                <div>
                                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>UNIFIED CUSTOMER PROFILE</span>
                                    <h3>{selectedCustomer.name}</h3>
                                    <p className="text-muted">🏠 {selectedCustomer.address}, {selectedCustomer.pincode}</p>
                                    <p className="text-muted">📞 {selectedCustomer.phone} | ✉️ {selectedCustomer.email}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedCustomer(null)}
                                    style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
                                >×</button>
                            </div>

                            <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                                <div className="glass" style={{ padding: '16px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>{metrics.orderCount}</p>
                                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>Orders</span>
                                </div>
                                <div className="glass" style={{ padding: '16px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--success)' }}>₹{metrics.totalSpend.toLocaleString()}</p>
                                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>Lifetime Spend</span>
                                </div>
                                <div className="glass" style={{ padding: '16px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--warning)' }}>{metrics.segment}</p>
                                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>Segment</span>
                                </div>
                            </div>

                            <h4 style={{ marginBottom: '16px' }}>Order History</h4>
                            <div className="order-history" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {metrics.orders.map(order => (
                                    <div key={order.id} className="glass" style={{ padding: '14px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ fontWeight: '700', color: 'var(--primary)' }}>{order.id}</p>
                                            <p className="text-muted" style={{ fontSize: '0.8rem' }}>{order.sku} | ₹{order.amount}</p>
                                        </div>
                                        <span className="badge" style={{
                                            background: order.status === 'Delivered' ? 'var(--success)' :
                                                order.status === 'In-Transit' ? 'var(--info)' : 'var(--glass-border)'
                                        }}>{order.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })()}

            </div>
        </div>
    );
};

export default CustomerLookup;
