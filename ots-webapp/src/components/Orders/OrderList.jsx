import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import OrderJourney from './OrderJourney';
<<<<<<< HEAD
import { generatePackingSlip, generateShippingLabel } from '../../utils/labelGenerator';
=======
import labelPrintService from '../../services/labelPrintService';
import { getOptimalCarrier } from '../../services/carrierOptimizer';
>>>>>>> 4be53487f72a2bfacf3cde5d60b2e7a7e0ec3174

const OrderList = () => {
    const { orders, updateOrderStatus } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sourceFilter, setSourceFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [isOptimizing, setIsOptimizing] = useState(false);

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.sku?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesSource = sourceFilter === 'all' || order.source === sourceFilter;
        return matchesSearch && matchesStatus && matchesSource;
    });

    const uniqueSources = [...new Set(orders.map(o => o.source).filter(Boolean))];
    const uniqueStatuses = [...new Set(orders.map(o => o.status).filter(Boolean))];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Imported': return 'var(--text-muted)';
            case 'MTP-Applied': return 'var(--accent)';
            case 'Carrier-Assigned': return 'var(--primary)';
            case 'In-Transit': return 'var(--info)';
            case 'Delivered': return 'var(--success)';
            default: return 'var(--glass-border)';
        }
    };

    const toggleOrderSelection = (id) => {
        setSelectedOrders(prev =>
            prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
        );
    };

    const handleSmartAssign = async () => {
        setIsOptimizing(true);
        try {
            for (const orderId of selectedOrders) {
                const order = orders.find(o => o.id === orderId);
                // In a real app, we'd fetch zone/weight details. Using defaults for demo.
                const recommendation = await getOptimalCarrier({
                    pincode: order.pincode || '400001',
                    weight: order.weight || 0.5,
                    amount: order.amount || 0,
                    zone: order.state === 'Maharashtra' ? 'metro' : 'tier2',
                    cod_required: order.paymentMethod === 'cod'
                });

                if (recommendation) {
                    updateOrder(orderId, {
                        carrier: recommendation.carrier.name,
                        shippingCost: recommendation.cost
                    });
                    updateOrderStatus(orderId, 'Carrier-Assigned');
                }
            }
            alert(`Successfully optimized ${selectedOrders.length} orders!`);
            setSelectedOrders([]);
        } catch (error) {
            console.error('Optimization failed:', error);
            alert('Carrier optimization failed. See logs.');
        } finally {
            setIsOptimizing(false);
        }
    };

    return (
        <div className="order-list-view animate-fade">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2>Order Management</h2>
                    <p className="text-muted">Track, Search & Manage All Orders</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <span className="badge" style={{ background: 'var(--primary)' }}>{orders.length} Total</span>
                    <span className="badge" style={{ background: 'var(--success)' }}>{orders.filter(o => o.status === 'Delivered').length} Delivered</span>
                    <button
                        className="btn-secondary glass-hover"
                        style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => labelPrintService.printManifest(filteredOrders.filter(o => o.status === 'Ready-to-Ship'), 'Filtered Batch')}
                    >
                        📋 Batch Manifest
                    </button>
                    <button
                        className="btn-primary glass-hover"
                        style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        disabled={selectedOrders.length === 0 || isOptimizing}
                        onClick={handleSmartAssign}
                    >
                        {isOptimizing ? '🤖 Optimizing...' : `🧠 Smart Assign (${selectedOrders.length})`}
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="filters-bar glass" style={{ padding: '16px 20px', marginTop: '24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 2, minWidth: '250px' }}>
                    <input
                        type="text"
                        placeholder="🔍 Search by Order ID, Customer, or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff', minWidth: '150px' }}
                >
                    <option value="all">All Statuses</option>
                    {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    style={{ padding: '12px 16px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff', minWidth: '150px' }}
                >
                    <option value="all">All Channels</option>
                    {uniqueSources.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="btn-secondary glass-hover" style={{ padding: '12px 20px' }} onClick={() => { setSearchTerm(''); setStatusFilter('all'); setSourceFilter('all'); }}>
                    Clear
                </button>
            </div>

            {/* Orders Table */}
            <div className="orders-table glass" style={{ marginTop: '24px', overflow: 'hidden', borderRadius: '12px' }}>
                <div className="table-header" style={{ display: 'grid', gridTemplateColumns: '40px 1.5fr 2fr 1fr 1fr 1fr 1fr', padding: '16px 20px', background: 'var(--bg-accent)', fontWeight: '700', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    <input
                        type="checkbox"
                        onChange={(e) => setSelectedOrders(e.target.checked ? filteredOrders.map(o => o.id) : [])}
                        checked={selectedOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                    />
                    <span>Order ID</span>
                    <span>Customer</span>
                    <span>SKU</span>
                    <span>Source</span>
                    <span>Status</span>
                    <span>Actions</span>
                </div>

                <div className="table-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {filteredOrders.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center' }}>
                            <p className="text-muted">No orders found matching your criteria</p>
                        </div>
                    ) : (
                        filteredOrders.map((order, idx) => (
                            <div
                                key={order.id}
                                className="table-row glass-hover"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '40px 1.5fr 2fr 1fr 1fr 1fr 1fr',
                                    padding: '16px 20px',
                                    alignItems: 'center',
                                    borderBottom: '1px solid var(--glass-border)',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setSelectedOrder(order)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedOrders.includes(order.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={() => toggleOrderSelection(order.id)}
                                />
                                <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{order.id}</span>
                                <span>{order.customer || 'N/A'}</span>
                                <span style={{ fontSize: '0.85rem' }}>{order.sku || 'N/A'}</span>
                                <span className="badge" style={{ background: 'var(--glass-border)', fontSize: '0.65rem', justifySelf: 'start' }}>{order.source || 'Manual'}</span>
                                <span className="badge" style={{ background: getStatusColor(order.status), fontSize: '0.65rem', justifySelf: 'start' }}>{order.status}</span>
                                <button
                                    className="btn-secondary glass-hover"
                                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                    onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                                >
                                    View
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }} onClick={() => setSelectedOrder(null)}>
                    <div className="modal-content glass animate-fade" style={{
                        width: '90%',
                        maxWidth: '700px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '32px',
                        borderRadius: '16px'
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>ORDER DETAILS</span>
                                <h2>{selectedOrder.id}</h2>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
                            >×</button>
                        </div>

                        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                            <div className="detail-item glass" style={{ padding: '16px' }}>
                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>CUSTOMER</span>
                                <p style={{ fontWeight: '700' }}>{selectedOrder.customer || 'N/A'}</p>
                            </div>
                            <div className="detail-item glass" style={{ padding: '16px' }}>
                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>LOCATION</span>
                                <p>{selectedOrder.city}, {selectedOrder.state}</p>
                            </div>
                            <div className="detail-item glass" style={{ padding: '16px' }}>
                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>SKU</span>
                                <p style={{ fontWeight: '700' }}>{selectedOrder.sku || 'N/A'}</p>
                            </div>
                            <div className="detail-item glass" style={{ padding: '16px' }}>
                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>WEIGHT</span>
                                <p>{selectedOrder.weight || '2.0'} kg</p>
                            </div>
                            <div className="detail-item glass" style={{ padding: '16px' }}>
                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>SOURCE</span>
                                <p>{selectedOrder.source || 'Manual'}</p>
                            </div>
                            <div className="detail-item glass" style={{ padding: '16px' }}>
                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>WAREHOUSE</span>
                                <p style={{ fontWeight: '700', color: 'var(--accent)' }}>{selectedOrder.warehouse || 'CENTRAL-WH'}</p>
                            </div>
                            <div className="detail-item glass" style={{ padding: '16px' }}>
                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>STATUS</span>
                                <span className="badge" style={{ background: getStatusColor(selectedOrder.status) }}>{selectedOrder.status}</span>
                            </div>
                        </div>

                        <OrderJourney orderId={selectedOrder.id} />

                        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
<<<<<<< HEAD
                            <button
                                className="btn-primary glass-hover"
                                style={{ flex: 1, minWidth: '150px' }}
                                onClick={() => {/* Future: Process logic */ }}
                            >
                                Process Order
                            </button>
                            <button
                                className="btn-secondary glass-hover"
                                style={{ flex: 1, minWidth: '150px' }}
                                onClick={() => generatePackingSlip(selectedOrder)}
                            >
                                📄 Packing Slip
                            </button>
                            <button
                                className="btn-secondary glass-hover"
                                style={{ flex: 1, minWidth: '150px' }}
                                onClick={() => generateShippingLabel(selectedOrder)}
                            >
                                🏷️ Shipping Label
                            </button>
                            <button
                                className="btn-secondary glass-hover"
                                style={{ flex: 1, minWidth: '150px' }}
                                onClick={() => setSelectedOrder(null)}
                            >
                                Close
                            </button>
=======
                            <button className="btn-primary glass-hover" style={{ flex: 1 }}>Process Order</button>
                            <button
                                className="btn-secondary glass-hover"
                                style={{ flex: 1 }}
                                onClick={() => labelPrintService.printLabel(selectedOrder)}
                            >
                                🏷️ Print Label
                            </button>
                            <button
                                className="btn-secondary glass-hover"
                                style={{ flex: 1 }}
                                onClick={() => {
                                    const html = labelPrintService.generatePackingSlipHTML(selectedOrder);
                                    const printWindow = window.open('', '_blank');
                                    printWindow.document.write(html);
                                    printWindow.document.close();
                                    printWindow.onload = () => printWindow.print();
                                }}
                            >
                                📄 Packing Slip
                            </button>
                            <button className="btn-secondary glass-hover" style={{ flex: 1 }} onClick={() => setSelectedOrder(null)}>Close</button>
>>>>>>> 4be53487f72a2bfacf3cde5d60b2e7a7e0ec3174
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;
