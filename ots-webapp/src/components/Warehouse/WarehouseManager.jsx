import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { routeOrderToWarehouse, getWarehouses } from '../../services/warehouseService';

const WarehouseManager = () => {
    const { skuMaster = [], inventoryLevels = [], batches = [], adjustStock, setStockLocation } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedWh, setSelectedWh] = useState(null);
    const [routingPincode, setRoutingPincode] = useState('');
    const [routedWarehouse, setRoutedWarehouse] = useState(null);

    const warehouses = getWarehouses();

    // Link real-time inventory levels with SKU Master data
    const inventory = useMemo(() => {
        return (skuMaster || [])
            .filter(sku => !sku.isParent)
            .map(sku => ({
                ...sku,
                ...(inventoryLevels[sku.sku] || { inStock: 0, reserved: 0, location: 'UNKNOWN' }),
                available: (inventoryLevels[sku.sku]?.inStock || 0) - (inventoryLevels[sku.sku]?.reserved || 0)
            }));
    }, [skuMaster, inventoryLevels]);

    const categories = useMemo(() => ['All', ...new Set(inventory.map(i => i.category))], [inventory]);

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const totalUnits = inventory.reduce((sum, i) => sum + i.inStock, 0);
    const lowStockItems = inventory.filter(i => i.available <= (i.reorderLevel || 15));

    return (
        <div className="warehouse-manager animate-fade">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2>Warehouse Fidelity</h2>
                    <p className="text-muted">Linked to SSOT SKU Master • Real-time Sync</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {lowStockItems.length > 0 && (
                        <span className="badge" style={{ background: 'var(--danger)', padding: '8px 16px' }}>
                            ⚠️ {lowStockItems.length} Low Stock
                        </span>
                    )}
                    <button className="btn-primary glass-hover" style={{ padding: '10px 20px' }}>
                        + Add Incoming SKU
                    </button>
                </div>
            </div>

            {/* Routing Demo Section */}
            <div className="glass" style={{ padding: '24px', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))' }}>
                <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>🚀 Smart Multi-Node Routing</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                        type="text"
                        placeholder="Enter Delivery Pincode (e.g., 560102)"
                        className="glass"
                        style={{ padding: '10px 16px', flex: 1, border: '1px solid rgba(255,255,255,0.1)' }}
                        value={routingPincode}
                        onChange={(e) => setRoutingPincode(e.target.value)}
                    />
                    <button
                        className="btn-primary"
                        onClick={() => setRoutedWarehouse(routeOrderToWarehouse(routingPincode))}
                    >
                        Route Order
                    </button>
                </div>
                {routedWarehouse && (
                    <div className="animate-fade" style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '4px solid #6366F1' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Assigned Fulfillment Node:</p>
                        <p style={{ fontWeight: '600' }}>{routedWarehouse.name} ({routedWarehouse.city})</p>
                    </div>
                )}
            </div>

            {/* Global Stats */}
            <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px' }}>
                <div className="stat-card glass" style={{ padding: '20px', textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--primary)' }}>{totalUnits}</h2>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>TOTAL UNITS</span>
                </div>
                <div className="stat-card glass" style={{ padding: '20px', textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--accent)' }}>{inventory.length}</h2>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>ACTIVE SKUS</span>
                </div>
                <div className="stat-card glass" style={{ padding: '20px', textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--info)' }}>{categories.length - 1}</h2>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>CATEGORIES</span>
                </div>
                <div className="stat-card glass" style={{ padding: '20px', textAlign: 'center' }}>
                    <h2 style={{ color: lowStockItems.length > 0 ? 'var(--danger)' : 'var(--success)' }}>{lowStockItems.length}</h2>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>LOW STOCK</span>
                </div>
            </div>

            {/* Filters */}
            <div className="filter-bar glass" style={{ marginTop: '24px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="🔍 Search SKU or Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 2, padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

            {/* Inventory Table */}
            <div className="inventory-table-container glass" style={{ marginTop: '24px', padding: '20px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', opacity: 0.6, fontSize: '0.8rem' }}>
                            <th style={{ padding: '12px' }}>SKU IDENTITY</th>
                            <th style={{ padding: '12px' }}>BIN LOCATION</th>
                            <th style={{ padding: '12px' }}>IN STOCK</th>
                            <th style={{ padding: '12px' }}>RESERVED</th>
                            <th style={{ padding: '12px' }}>AVAILABLE</th>
                            <th style={{ padding: '12px' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInventory.map(item => (
                            <tr key={item.sku} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{item.sku}</span><br />
                                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>{item.name}</span>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <span className="badge" style={{ background: 'var(--bg-accent)' }}>📍 {item.location}</span>
                                </td>
                                <td style={{ padding: '12px' }}>{item.inStock}</td>
                                <td style={{ padding: '12px' }}>{item.reserved}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{
                                        fontWeight: '700',
                                        color: item.available <= (item.reorderLevel || 15) ? 'var(--danger)' : 'var(--success)'
                                    }}>
                                        {item.available}
                                    </span>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            className="btn-pill"
                                            onClick={() => adjustStock(item.sku, 1)}
                                            style={{ padding: '4px 10px', background: 'var(--success)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            +
                                        </button>
                                        <button
                                            className="btn-pill"
                                            onClick={() => adjustStock(item.sku, -1)}
                                            style={{ padding: '4px 10px', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            -
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* FIFO Batch List */}
            <div className="batch-inventory-section glass" style={{ marginTop: '32px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>🕒 FIFO Batch Inventory</h3>
                    <span className="badge" style={{ background: 'var(--accent)' }}>{batches.length} Batches Active</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {batches.slice(-6).reverse().map(batch => (
                        <div key={batch.id} className="glass glass-hover" style={{ padding: '16px', borderLeft: '4px solid var(--primary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: '800', color: 'var(--primary)' }}>{batch.sku}</span>
                                <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.65rem' }}>#{batch.id.slice(-6)}</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>Vendor: {batch.vendor}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>{batch.quantity}</span>
                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>Received: {new Date(batch.receivedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WarehouseManager;
