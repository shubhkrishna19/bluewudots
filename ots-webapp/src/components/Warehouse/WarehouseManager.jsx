import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const WarehouseManager = () => {
    const { skuMaster } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    // Mock warehouse inventory
    const inventory = [
        { sku: 'BL-DESK-01', name: 'Executive Office Desk', category: 'Desks', inStock: 45, reserved: 12, available: 33, reorderLevel: 15, location: 'A-01' },
        { sku: 'BL-DESK-02', name: 'Modern Workstation', category: 'Desks', inStock: 28, reserved: 8, available: 20, reorderLevel: 10, location: 'A-02' },
        { sku: 'BL-CAB-05', name: 'Storage Cabinet', category: 'Cabinets', inStock: 62, reserved: 15, available: 47, reorderLevel: 20, location: 'B-01' },
        { sku: 'BL-SHELF-02', name: 'Wall Shelf Unit', category: 'Shelves', inStock: 85, reserved: 22, available: 63, reorderLevel: 25, location: 'C-01' },
        { sku: 'BL-TABLE-03', name: 'Dining Table Set', category: 'Tables', inStock: 18, reserved: 6, available: 12, reorderLevel: 10, location: 'D-01' },
        { sku: 'BL-CHAIR-01', name: 'Ergonomic Chair', category: 'Chairs', inStock: 120, reserved: 35, available: 85, reorderLevel: 40, location: 'E-01' },
        { sku: 'BL-RACK-01', name: 'Display Rack', category: 'Racks', inStock: 52, reserved: 10, available: 42, reorderLevel: 15, location: 'F-01' },
        { sku: 'BL-STOOL-01', name: 'Bar Stool', category: 'Stools', inStock: 35, reserved: 5, available: 30, reorderLevel: 12, location: 'G-01' }
    ];

    const filteredInventory = inventory.filter(item =>
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalItems = inventory.reduce((sum, i) => sum + i.inStock, 0);
    const lowStockItems = inventory.filter(i => i.available <= i.reorderLevel);
    const categories = [...new Set(inventory.map(i => i.category))];

    return (
        <div className="warehouse-manager animate-fade">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2>Warehouse Inventory</h2>
                    <p className="text-muted">Real-time stock levels and locations</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {lowStockItems.length > 0 && (
                        <span className="badge" style={{ background: 'var(--danger)', padding: '8px 16px' }}>
                            ⚠️ {lowStockItems.length} Low Stock
                        </span>
                    )}
                    <button className="btn-primary glass-hover" style={{ padding: '10px 20px' }}>
                        + Add Stock
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="warehouse-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px' }}>
                <div className="glass" style={{ padding: '24px', textAlign: 'center' }}>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>{totalItems}</p>
                    <span className="text-muted">Total Units</span>
                </div>
                <div className="glass" style={{ padding: '24px', textAlign: 'center' }}>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent)' }}>{inventory.length}</p>
                    <span className="text-muted">SKUs</span>
                </div>
                <div className="glass" style={{ padding: '24px', textAlign: 'center' }}>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--info)' }}>{categories.length}</p>
                    <span className="text-muted">Categories</span>
                </div>
                <div className="glass" style={{ padding: '24px', textAlign: 'center', borderTop: lowStockItems.length > 0 ? '4px solid var(--danger)' : 'none' }}>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: lowStockItems.length > 0 ? 'var(--danger)' : 'var(--success)' }}>
                        {lowStockItems.length}
                    </p>
                    <span className="text-muted">Low Stock Alerts</span>
                </div>
            </div>

            {/* Search */}
            <div className="search-section glass" style={{ padding: '16px 20px', marginTop: '24px' }}>
                <input
                    type="text"
                    placeholder="🔍 Search by SKU, name, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '14px 20px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: '#fff', fontSize: '1rem' }}
                />
            </div>

            {/* Inventory Grid */}
            <div className="inventory-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '24px' }}>
                {filteredInventory.map(item => (
                    <div
                        key={item.sku}
                        className="inventory-card glass glass-hover"
                        style={{
                            padding: '24px',
                            borderLeft: item.available <= item.reorderLevel ? '4px solid var(--danger)' : '4px solid var(--success)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <span className="badge" style={{ background: 'var(--bg-accent)', fontSize: '0.7rem' }}>{item.category}</span>
                                <h4 style={{ marginTop: '8px' }}>{item.name}</h4>
                                <p className="text-muted" style={{ fontSize: '0.85rem' }}>{item.sku}</p>
                            </div>
                            <span style={{
                                padding: '6px 12px',
                                background: 'var(--glass-border)',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: '700'
                            }}>📍 {item.location}</span>
                        </div>

                        <div className="stock-bars" style={{ marginTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Stock Level</span>
                                <span style={{ fontWeight: '700' }}>{item.available} / {item.inStock}</span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--bg-accent)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${(item.available / item.inStock) * 100}%`,
                                    height: '100%',
                                    background: item.available <= item.reorderLevel ? 'var(--danger)' : 'var(--success)',
                                    borderRadius: '4px'
                                }}></div>
                            </div>
                        </div>

                        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
                            <div>
                                <p style={{ fontWeight: '700', color: 'var(--primary)' }}>{item.inStock}</p>
                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>In Stock</span>
                            </div>
                            <div>
                                <p style={{ fontWeight: '700', color: 'var(--warning)' }}>{item.reserved}</p>
                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>Reserved</span>
                            </div>
                            <div>
                                <p style={{ fontWeight: '700', color: 'var(--success)' }}>{item.available}</p>
                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>Available</span>
                            </div>
                        </div>

                        {item.available <= item.reorderLevel && (
                            <button className="btn-primary glass-hover" style={{ width: '100%', marginTop: '16px', padding: '10px' }}>
                                ⚠️ Reorder Now
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WarehouseManager;
