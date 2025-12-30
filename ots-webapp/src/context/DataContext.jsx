import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { transitionOrder, bulkTransition, ORDER_STATUSES, getValidNextStatuses } from '../services/orderStateMachine';
import { getAllRates, getRecommendation } from '../services/carrierRateEngine';
import { logOrderCreate, logOrderStatusChange, logBulkUpdate, logCarrierAssign, logImportComplete } from '../services/activityLogger';
import { notifyOrderCreated, notifyOrderShipped, notifyBulkImport, notifyLowStock } from '../services/notificationService';
import { validateOrder, normalizeOrder, generateOrderId, exportOrdersCSV, exportJSON } from '../utils/dataUtils';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [logistics, setLogistics] = useState([]);
    const [skuMaster, setSkuMaster] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [activityLog, setActivityLog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncStatus, setSyncStatus] = useState('offline');

    // ============================================
    // INITIAL DATA LOAD
    // ============================================
    useEffect(() => {
        const initializeData = async () => {
            try {
                console.log('🔄 Synchronizing with Bluewud India Nodes...');
                setSyncStatus('syncing');

                // Comprehensive sample orders with full data
                setOrders([
                    { id: 'BW-9901', externalId: 'AMZ-123456', source: 'Amazon', customerName: 'Rajesh Kumar', phone: '9876543210', address: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', sku: 'BL-DESK-01', quantity: 1, weight: 12.5, amount: 14500, status: 'Delivered', carrier: 'Delhivery', awb: 'DEL123456789', statusHistory: [], createdAt: '2024-12-25T10:00:00Z' },
                    { id: 'BW-9902', externalId: 'FLK-789012', source: 'Flipkart', customerName: 'Priya Sharma', phone: '9988776655', address: '45 Janpath', city: 'Delhi', state: 'Delhi', pincode: '110001', sku: 'BL-CAB-05', quantity: 1, weight: 8.0, amount: 8900, status: 'In-Transit', carrier: 'BlueDart', awb: 'BD987654321', statusHistory: [], createdAt: '2024-12-27T14:30:00Z' },
                    { id: 'BW-9903', externalId: null, source: 'Local Shop', customerName: 'Amit Patel', phone: '9123456789', address: '78 Brigade Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001', sku: 'BL-SHELF-02', quantity: 2, weight: 15.0, amount: 12000, status: 'Carrier-Assigned', carrier: 'XpressBees', awb: null, statusHistory: [], createdAt: '2024-12-28T09:15:00Z' },
                    { id: 'BW-9904', externalId: 'SHP-345678', source: 'Shopify', customerName: 'Sneha Reddy', phone: '9234567890', address: '12 Banjara Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500034', sku: 'BL-TABLE-03', quantity: 1, weight: 20.0, amount: 25000, status: 'MTP-Applied', carrier: null, awb: null, statusHistory: [], createdAt: '2024-12-29T11:00:00Z' },
                    { id: 'BW-9905', externalId: null, source: 'Dealer', customerName: 'Vikram Singh', phone: '9345678901', address: '56 MI Road', city: 'Jaipur', state: 'Rajasthan', pincode: '302001', sku: 'BL-CHAIR-01', quantity: 10, weight: 50.0, amount: 45000, status: 'Pending', carrier: null, awb: null, statusHistory: [], createdAt: '2024-12-30T08:00:00Z' },
                    { id: 'BW-9906', externalId: 'AMZ-654321', source: 'Amazon', customerName: 'Meera Iyer', phone: '9456789012', address: '89 Anna Salai', city: 'Chennai', state: 'Tamil Nadu', pincode: '600002', sku: 'BL-DESK-02', quantity: 1, weight: 14.0, amount: 18000, status: 'Delivered', carrier: 'Delhivery', awb: 'DEL111222333', statusHistory: [], createdAt: '2024-12-24T16:45:00Z' },
                    { id: 'BW-9907', externalId: null, source: 'Pepperfry', customerName: 'Arjun Nair', phone: '9567890123', address: '34 MG Road', city: 'Kochi', state: 'Kerala', pincode: '682016', sku: 'BL-RACK-01', quantity: 1, weight: 18.0, amount: 9500, status: 'In-Transit', carrier: 'Ecom Express', awb: 'ECM444555666', statusHistory: [], createdAt: '2024-12-28T13:20:00Z' },
                    { id: 'BW-9908', externalId: null, source: 'Dealer', customerName: 'Furniture World', phone: '9678901234', address: '100 Industrial Area', city: 'Bangalore', state: 'Karnataka', pincode: '560058', sku: 'BL-BULK-SET', quantity: 5, weight: 45.0, amount: 85000, status: 'Pending', carrier: null, awb: null, statusHistory: [], createdAt: '2024-12-30T10:30:00Z' },
                    { id: 'BW-9909', externalId: null, source: 'Local Shop', customerName: 'Local Customer', phone: '9789012345', address: '22 FC Road', city: 'Pune', state: 'Maharashtra', pincode: '411004', sku: 'BL-STOOL-01', quantity: 2, weight: 3.5, amount: 3200, status: 'Carrier-Assigned', carrier: 'Delhivery', awb: 'DEL777888999', statusHistory: [], createdAt: '2024-12-29T15:00:00Z' },
                    { id: 'BW-9910', externalId: null, source: 'Dealer', customerName: 'Home Decor Hub', phone: '9890123456', address: '67 CG Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380009', sku: 'BL-COMBO-01', quantity: 3, weight: 25.0, amount: 35000, status: 'Delivered', carrier: 'BlueDart', awb: 'BD222333444', statusHistory: [], createdAt: '2024-12-23T12:00:00Z' }
                ]);

                // SKU Master with comprehensive data
                setSkuMaster([
                    { code: 'BL-DESK-01', name: 'Executive Office Desk', category: 'Desks', cost: 8500, mrp: 14500, weight: 12.5, dimensions: '150x75x75', hsnCode: '9403', gstRate: 18, inStock: 45 },
                    { code: 'BL-DESK-02', name: 'Modern Workstation', category: 'Desks', cost: 11000, mrp: 18000, weight: 14.0, dimensions: '160x80x75', hsnCode: '9403', gstRate: 18, inStock: 28 },
                    { code: 'BL-CAB-05', name: 'Elite Storage Cabinet', category: 'Cabinets', cost: 5500, mrp: 8900, weight: 8.0, dimensions: '80x45x180', hsnCode: '9403', gstRate: 18, inStock: 62 },
                    { code: 'BL-SHELF-02', name: 'Wall Shelf Unit', category: 'Shelves', cost: 3500, mrp: 6000, weight: 7.5, dimensions: '120x30x20', hsnCode: '9403', gstRate: 18, inStock: 85 },
                    { code: 'BL-TABLE-03', name: 'Dining Table 6-Seater', category: 'Tables', cost: 15000, mrp: 25000, weight: 20.0, dimensions: '180x90x75', hsnCode: '9403', gstRate: 18, inStock: 18 },
                    { code: 'BL-CHAIR-01', name: 'Ergonomic Office Chair', category: 'Chairs', cost: 2800, mrp: 4500, weight: 5.0, dimensions: '60x60x110', hsnCode: '9401', gstRate: 18, inStock: 120 },
                    { code: 'BL-RACK-01', name: 'Industrial Display Rack', category: 'Racks', cost: 5800, mrp: 9500, weight: 18.0, dimensions: '100x40x200', hsnCode: '9403', gstRate: 18, inStock: 52 },
                    { code: 'BL-STOOL-01', name: 'Bar Stool Premium', category: 'Stools', cost: 1000, mrp: 1600, weight: 3.5, dimensions: '40x40x75', hsnCode: '9401', gstRate: 18, inStock: 35 },
                    { code: 'BL-BULK-SET', name: 'Office Furniture Set', category: 'Combos', cost: 12000, mrp: 17000, weight: 45.0, dimensions: 'Various', hsnCode: '9403', gstRate: 18, inStock: 10 },
                    { code: 'BL-COMBO-01', name: 'Home Office Combo', category: 'Combos', cost: 8500, mrp: 12000, weight: 25.0, dimensions: 'Various', hsnCode: '9403', gstRate: 18, inStock: 22 }
                ]);

                // Warehouse inventory
                setInventory([
                    { sku: 'BL-DESK-01', warehouse: 'Bangalore', inStock: 45, reserved: 12, available: 33, reorderLevel: 15, location: 'A-01' },
                    { sku: 'BL-DESK-02', warehouse: 'Bangalore', inStock: 28, reserved: 8, available: 20, reorderLevel: 10, location: 'A-02' },
                    { sku: 'BL-CAB-05', warehouse: 'Bangalore', inStock: 62, reserved: 15, available: 47, reorderLevel: 20, location: 'B-01' },
                    { sku: 'BL-SHELF-02', warehouse: 'Bangalore', inStock: 85, reserved: 22, available: 63, reorderLevel: 25, location: 'C-01' },
                    { sku: 'BL-TABLE-03', warehouse: 'Bangalore', inStock: 18, reserved: 6, available: 12, reorderLevel: 10, location: 'D-01' }
                ]);

                // Check for low stock and notify
                inventory.forEach(item => {
                    if (item.available <= item.reorderLevel) {
                        notifyLowStock(item.sku, item.available, item.reorderLevel);
                    }
                });

                setSyncStatus('online');
                setLoading(false);
                console.log('✅ Data sync complete');
            } catch (error) {
                console.error('❌ Data Sync Failed:', error);
                setSyncStatus('error');
                setLoading(false);
            }
        };
        initializeData();
    }, []);

    // ============================================
    // ORDER MANAGEMENT
    // ============================================

    /**
     * Add a new order
     */
    const addOrder = useCallback((orderData) => {
        const validation = validateOrder(orderData);
        if (!validation.valid) {
            return { success: false, errors: validation.errors };
        }

        const newOrder = {
            ...orderData,
            id: generateOrderId(),
            status: ORDER_STATUSES.PENDING,
            statusHistory: [{
                from: null,
                to: ORDER_STATUSES.PENDING,
                timestamp: new Date().toISOString(),
                user: 'system'
            }],
            createdAt: new Date().toISOString()
        };

        setOrders(prev => [newOrder, ...prev]);
        logOrderCreate(newOrder);
        notifyOrderCreated(newOrder);

        return { success: true, order: newOrder };
    }, []);

    /**
     * Update order status with state machine validation
     */
    const updateOrderStatus = useCallback((orderId, newStatus, metadata = {}) => {
        let result = null;

        setOrders(prev => prev.map(order => {
            if (order.id === orderId) {
                const transitionResult = transitionOrder(order, newStatus, metadata);
                result = transitionResult;

                if (transitionResult.success) {
                    logOrderStatusChange(order, order.status, newStatus, metadata.reason);

                    // Trigger notifications for key statuses
                    if (newStatus === ORDER_STATUSES.IN_TRANSIT || newStatus === ORDER_STATUSES.PICKED_UP) {
                        notifyOrderShipped(transitionResult.order);
                    }

                    return transitionResult.order;
                }
            }
            return order;
        }));

        return result || { success: false, error: 'Order not found' };
    }, []);

    /**
     * Bulk update order statuses
     */
    const bulkUpdateStatus = useCallback((orderIds, newStatus, metadata = {}) => {
        const ordersToUpdate = orders.filter(o => orderIds.includes(o.id));
        const results = bulkTransition(ordersToUpdate, newStatus, metadata);

        if (results.successful.length > 0) {
            setOrders(prev => {
                const successIds = results.successful.map(o => o.id);
                return prev.map(order =>
                    successIds.includes(order.id)
                        ? results.successful.find(o => o.id === order.id)
                        : order
                );
            });

            logBulkUpdate(orderIds, newStatus);
            notifyBulkImport(results.successful.length, `Bulk ${newStatus}`);
        }

        return results;
    }, [orders]);

    /**
     * Assign carrier to order
     */
    const assignCarrier = useCallback((orderId, carrierId, carrierName) => {
        setOrders(prev => prev.map(order => {
            if (order.id === orderId) {
                const updated = {
                    ...order,
                    carrier: carrierName,
                    carrierId: carrierId
                };
                logCarrierAssign(order, carrierName);
                return updated;
            }
            return order;
        }));
    }, []);

    /**
     * Import orders from external source
     */
    const importOrders = useCallback((rawOrders, source) => {
        const imported = rawOrders.map(raw => {
            const normalized = normalizeOrder(raw, source);
            return {
                ...normalized,
                status: ORDER_STATUSES.PENDING,
                statusHistory: [{
                    from: null,
                    to: ORDER_STATUSES.PENDING,
                    timestamp: new Date().toISOString(),
                    user: 'import'
                }],
                createdAt: new Date().toISOString()
            };
        });

        setOrders(prev => [...imported, ...prev]);
        logImportComplete(source, imported.length);
        notifyBulkImport(imported.length, source);

        return { success: true, count: imported.length };
    }, []);

    // ============================================
    // CARRIER & RATE FUNCTIONS
    // ============================================

    /**
     * Get carrier rates for a shipment
     */
    const getCarrierRates = useCallback((shipment) => {
        return getAllRates(shipment);
    }, []);

    /**
     * Get recommended carrier
     */
    const getCarrierRecommendation = useCallback((shipment, priority = 'cost') => {
        return getRecommendation(shipment, priority);
    }, []);

    /**
     * Get valid next statuses for an order
     */
    const getOrderNextStatuses = useCallback((orderId) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return [];
        return getValidNextStatuses(order.status);
    }, [orders]);

    // ============================================
    // EXPORT FUNCTIONS
    // ============================================

    const exportOrders = useCallback((format = 'csv', filter = {}) => {
        let data = [...orders];

        if (filter.status) {
            data = data.filter(o => o.status === filter.status);
        }
        if (filter.source) {
            data = data.filter(o => o.source === filter.source);
        }

        if (format === 'csv') {
            exportOrdersCSV(data, `orders_export_${Date.now()}.csv`);
        } else {
            exportJSON(data, `orders_export_${Date.now()}.json`);
        }

        return { success: true, count: data.length };
    }, [orders]);

    // ============================================
    // ANALYTICS HELPERS
    // ============================================

    const getOrderStats = useCallback(() => {
        const total = orders.length;
        const delivered = orders.filter(o => o.status === 'Delivered').length;
        const inTransit = orders.filter(o => ['In-Transit', 'Out-for-Delivery', 'Picked-Up'].includes(o.status)).length;
        const pending = orders.filter(o => ['Pending', 'MTP-Applied', 'Carrier-Assigned'].includes(o.status)).length;
        const rto = orders.filter(o => o.status.startsWith('RTO')).length;

        return {
            total,
            delivered,
            inTransit,
            pending,
            rto,
            deliveryRate: total > 0 ? ((delivered / total) * 100).toFixed(1) : 0
        };
    }, [orders]);

    // ============================================
    // CONTEXT VALUE
    // ============================================

    const value = {
        // State
        orders,
        logistics,
        skuMaster,
        inventory,
        loading,
        syncStatus,

        // Order Management
        addOrder,
        updateOrderStatus,
        bulkUpdateStatus,
        assignCarrier,
        importOrders,
        getOrderNextStatuses,
        setOrders,

        // Carrier Functions
        getCarrierRates,
        getCarrierRecommendation,

        // Export
        exportOrders,

        // Analytics
        getOrderStats,

        // Legacy compatibility
        setLogistics,
        setSkuMaster,
        getRecommendations: (state, city, weight) => getAllRates({ state, city, weight })
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export default DataContext;
