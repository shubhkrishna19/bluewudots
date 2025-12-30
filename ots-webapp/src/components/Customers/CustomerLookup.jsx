import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const CustomerLookup = () => {
    const { orders } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Extract unique customers from orders
    const customers = [...new Map(orders.map(o => [o.customer, {
        name: o.customer,
        city: o.city,
        state: o.state,
        orderCount: orders.filter(ord => ord.customer === o.customer).length,
        totalWeight: orders.filter(ord => ord.customer === o.customer).reduce((sum, ord) => sum + (ord.weight || 0), 0),
        lastOrder: o.id,
        sources: [...new Set(orders.filter(ord => ord.customer === o.customer).map(ord => ord.source))]
    }])).values()];

    const filteredCustomers = customers.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    {filteredCustomers.map((customer, idx) => (
                        <div
                            key={idx}
                            className={`customer-card glass glass-hover ${selectedCustomer?.name === customer.name ? 'selected' : ''}`}
                            style={{
                                padding: '20px',
                                cursor: 'pointer',
                                borderLeft: selectedCustomer?.name === customer.name ? '4px solid var(--primary)' : 'none'
                            }}
                            onClick={() => setSelectedCustomer(customer)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h4>{customer.name}</h4>
                                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>{customer.city}, {customer.state}</p>
                                </div>
                                <span className="badge" style={{ background: 'var(--primary)' }}>{customer.orderCount} orders</span>
                            </div>
                            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {customer.sources.map((s, i) => (
                                    <span key={i} style={{
                                        padding: '4px 10px',
                                        background: 'var(--bg-accent)',
                                        borderRadius: '12px',
                                        fontSize: '0.7rem'
                                    }}>{s}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {selectedCustomer && (
                    <div className="customer-detail glass animate-fade" style={{ padding: '28px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>CUSTOMER PROFILE</span>
                                <h3>{selectedCustomer.name}</h3>
                            </div>
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
                            >×</button>
                        </div>

                        <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            <div className="glass" style={{ padding: '16px', textAlign: 'center' }}>
                                <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>{selectedCustomer.orderCount}</p>
                                <span className="text-muted">Total Orders</span>
                            </div>
                            <div className="glass" style={{ padding: '16px', textAlign: 'center' }}>
                                <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>{selectedCustomer.totalWeight.toFixed(1)}</p>
                                <span className="text-muted">Total Weight (kg)</span>
                            </div>
                        </div>

                        <h4 style={{ marginBottom: '16px' }}>Order History</h4>
                        <div className="order-history" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {orders.filter(o => o.customer === selectedCustomer.name).map(order => (
                                <div key={order.id} className="glass" style={{ padding: '14px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontWeight: '700', color: 'var(--primary)' }}>{order.id}</p>
                                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>{order.sku}</p>
                                    </div>
                                    <span className="badge" style={{
                                        background: order.status === 'Delivered' ? 'var(--success)' :
                                            order.status === 'In-Transit' ? 'var(--info)' : 'var(--glass-border)'
                                    }}>{order.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerLookup;
