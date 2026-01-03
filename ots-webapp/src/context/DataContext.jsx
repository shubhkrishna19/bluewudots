import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { transitionOrder, bulkTransition, ORDER_STATUSES, getValidNextStatuses } from '../services/orderStateMachine';
import { getAllRates, getRecommendation } from '../services/carrierRateEngine';
import { logOrderCreate, logOrderStatusChange, logBulkUpdate, logCarrierAssign, logImportComplete, initializeActivityLog as loadActivityCache, getActivityLog, logActivity } from '../services/activityLogger';
import { notifyOrderCreated, notifyOrderShipped, notifyOrderDelivered, notifyOrderRTO, notifyBulkImport, notifyLowStock } from '../services/notificationService';
import { validateOrder, normalizeOrder, generateOrderId, deduplicateOrders, deduplicateCustomers, exportOrdersCSV, exportJSON } from '../utils/dataUtils';
import { calculateSMAForecast, predictSKUDemand } from '../services/forecastService';
import { getOrderTrend, projectRevenue, calculateSKUProfitability } from '../services/analyticsService';
import { fetchSKUMaster, pushOrderToZoho } from '../services/zohoBridgeService';
import marketplaceService from '../services/marketplaceService';
import searchService from '../services/searchService';
import marginProtectionService from '../services/marginProtectionService';
import cacheService from '../services/offlineCacheService';

import { SKU_MASTER, SKU_ALIASES } from '../data/skuMasterData';


const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [logistics, setLogistics] = useState([]);
    const [skuMaster, setSkuMaster] = useState(SKU_MASTER);
    const [skuAliases, setSkuAliases] = useState(SKU_ALIASES);
    const [inventory, setInventory] = useState([]);
    const [customerMaster, setCustomerMaster] = useState([]);
    const [inventoryLevels, setInventoryLevels] = useState({}); // { skuId: { inStock, reserved, location } }
    const [batches, setBatches] = useState([]); // Array of { id, sku, vendor, quantity, allocated, receivedAt }
    const [flaggedOrders, setFlaggedOrders] = useState([]); // Orders requiring financial review


    const [activityLog, setActivityLog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncStatus, setSyncStatus] = useState('offline'); // offline | online | syncing | error
    const [lastSyncTime, setLastSyncTime] = useState(null);

    // ============================================
    // INITIAL DATA LOAD
    // ============================================
    useEffect(() => {
        const initializeData = async () => {
            try {
                console.log('🔄 Synchronizing with Bluewud India Nodes...');
                setSyncStatus('syncing');

                // 1. Load from Offline Cache first (Highest Priority for Speed)
                const cachedOrders = await cacheService.retrieveCachedData('orders');
                const cachedSkuMaster = await cacheService.retrieveCachedData('skuMaster');
                const cachedCustomers = await cacheService.retrieveCachedData('customers');
                const cachedActivityLog = await cacheService.retrieveCachedData('activityLog');
                const cachedInventoryLevels = await cacheService.retrieveCachedData('metadata'); // Will find key='inventoryLevels'
                const cachedBatches = await cacheService.retrieveCachedData('metadata'); // Will find key='batches'

                if (cachedOrders && cachedOrders.length > 0) {
                    console.log(`📦 Loaded ${cachedOrders.length} orders from local cache`);
                    setOrders(cachedOrders);
                } else {
                    // Seed Mock Orders only if cache is empty
                    const mockOrders = [
                        ...Array(6).fill(0).map((_, i) => ({
                            id: `BWD-${1000 + i}`,
                            customerName: 'Sameer Malhotra',
                            phone: '9876543210',
                            amount: 15000 + (i * 1000),
                            status: 'Delivered',
                            sku: 'SR-CLM-TM',
                            createdAt: new Date(Date.now() - (i * 2) * 24 * 60 * 60 * 1000).toISOString()
                        })),
                        { id: 'BWD-2001', customerName: 'Anjali Sharma', phone: '9123456789', amount: 8500, status: 'In-Transit', sku: 'SR-CLM-TM', createdAt: new Date().toISOString() },
                        { id: 'BWD-2002', customerName: 'Anjali Sharma', phone: '9123456789', amount: 3200, status: 'Delivered', sku: 'SR-CLM-TM', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
                        { id: 'BWD-3001', customerName: 'Priya Verma', phone: '7766554433', amount: 12000, status: 'Delivered', sku: 'SR-CLM-TM', createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString() }
                    ];
                    setOrders(mockOrders);
                }

                if (cachedSkuMaster && cachedSkuMaster.length > 0) {
                    setSkuMaster(cachedSkuMaster);
                }

                if (cachedCustomers && cachedCustomers.length > 0) {
                    setCustomerMaster(cachedCustomers);
                } else {
                    // Seed Mock Customers
                    setCustomerMaster([
                        { name: 'Sameer Malhotra', phone: '9876543210', email: 'sameer@example.com', city: 'Delhi', state: 'Delhi', address: 'GK-II', pincode: '110048' },
                        { name: 'Anjali Sharma', phone: '9123456789', email: 'anjali@example.com', city: 'Mumbai', state: 'Maharashtra', address: 'Andheri West', pincode: '400053' },
                        { name: 'Karthik Rao', phone: '8877665544', email: 'karthik@example.com', city: 'Bangalore', state: 'Karnataka', address: 'HSR Layout', pincode: '560102' },
                        { name: 'Priya Verma', phone: '7766554433', email: 'priya@example.com', city: 'Chandigarh', state: 'Punjab', address: 'Sector 17', pincode: '160017' }
                    ]);
                }

                if (cachedActivityLog && cachedActivityLog.length > 0) {
                    loadActivityCache(cachedActivityLog);
                    setActivityLog(cachedActivityLog);
                }

                const invEntry = cachedInventoryLevels?.find(m => m.key === 'inventoryLevels');
                if (invEntry) {
                    setInventoryLevels(invEntry.data);
                } else {
                    // Seed Mock Inventory
                    const initialInventory = {};
                    SKU_MASTER.filter(s => !s.isParent).forEach(child => {
                        initialInventory[child.sku] = {
                            inStock: child.initialStock || Math.floor(Math.random() * 50) + 10,
                            reserved: 0,
                            location: child.defaultLocation || `WH-A${Math.floor(Math.random() * 9) + 1}`
                        };
                    });
                    setInventoryLevels(initialInventory);
                }

                const batchEntry = cachedBatches?.find(m => m.key === 'batches');
                if (batchEntry) {
                    setBatches(batchEntry.data);
                } else {
                    // Seed Mock Batches
                    const mockBatches = [];
                    SKU_MASTER.filter(s => !s.isParent).forEach(sku => {
                        mockBatches.push({
                            id: `BATCH-${sku.sku}-001`,
                            sku: sku.sku,
                            vendor: 'Elite Woods',
                            quantity: 20,
                            allocated: 0,
                            receivedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
                        });
                    });
                    setBatches(mockBatches);
                }

                // 2. Network Check / Remote Sync
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

    // --- AUTO-CACHE SYNC ---
    useEffect(() => {
        if (!loading && orders.length > 0) {
            cacheService.cacheData('orders', orders);
        }
    }, [orders, loading]);

    useEffect(() => {
        if (!loading && skuMaster.length > 0) {
            cacheService.cacheData('skuMaster', skuMaster);
        }
    }, [skuMaster, loading]);

    useEffect(() => {
        if (!loading && customerMaster.length > 0) {
            cacheService.cacheData('customers', customerMaster);
        }
    }, [customerMaster, loading]);

    useEffect(() => {
        if (!loading) {
            cacheService.cacheData('metadata', { key: 'inventoryLevels', data: inventoryLevels });
        }
    }, [inventoryLevels, loading]);

    useEffect(() => {
        if (!loading) {
            cacheService.cacheData('metadata', { key: 'batches', data: batches });
        }
    }, [batches, loading]);

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

        // --- MARGIN PROTECTION CHECK ---
        const skuData = skuMaster.find(s => s.sku === newOrder.sku);
        const marginCheck = marginProtectionService.validateMargin(newOrder, skuData);

        if (marginCheck.shouldBlock) {
            console.error('Order Blocked:', marginCheck.alert);
            return {
                success: false,
                error: 'MARGIN_BLOCK',
                message: marginCheck.alert
            };
        }

        if (!marginCheck.isProtected) {
            newOrder.financialFlag = true;
            newOrder.marginAlert = marginCheck.alert;
            setFlaggedOrders(prev => [...prev, newOrder]);
        }

        setOrders(prev => deduplicateOrders(prev, [newOrder]));

        // --- GLOBAL SYNC: Inventory Reservation ---
        if (newOrder.sku) {
            setInventoryLevels(prev => ({
                ...prev,
                [newOrder.sku]: {
                    ...prev[newOrder.sku],
                    reserved: (prev[newOrder.sku]?.reserved || 0) + 1
                }
            }));
        }

        // --- GLOBAL SYNC: Customer Unification ---
        const customer = {
            name: newOrder.customerName,
            phone: newOrder.phone,
            email: newOrder.email || '',
            address: newOrder.address,
            city: newOrder.city,
            state: newOrder.state,
            pincode: newOrder.pincode,
            lastSeen: newOrder.createdAt
        };
        setCustomerMaster(prev => deduplicateCustomers([...prev, customer]));

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
                const oldStatus = order.status;
                const transitionResult = transitionOrder(order, newStatus, metadata);
                result = transitionResult;

                if (transitionResult.success) {
                    logOrderStatusChange(order, oldStatus, newStatus, metadata.reason);

                    // --- GLOBAL SYNC: Inventory Deduction / Restock ---
                    if (newStatus === 'Delivered' || newStatus === 'In-Transit') {
                        // Deduct from Stock when Shipped/Delivered (for demo, we deduct 1 from inStock and 1 from reserved)
                        setInventoryLevels(p => ({
                            ...p,
                            [order.sku]: {
                                ...p[order.sku],
                                inStock: Math.max(0, (p[order.sku]?.inStock || 0) - 1),
                                reserved: Math.max(0, (p[order.sku]?.reserved || 0) - 1)
                            }
                        }));
                    } else if (newStatus === 'Cancelled' || newStatus === 'RTO-Delivered') {
                        // Return to stock if cancelled before delivery
                        setInventoryLevels(p => ({
                            ...p,
                            [order.sku]: {
                                ...p[order.sku],
                                reserved: Math.max(0, (p[order.sku]?.reserved || 0) - 1)
                                // Note: In a real system, RTO-Delivered would involve a QA step before adding back to inStock
                            }
                        }));
                    }

                    // Trigger notifications for key statuses
                    if (newStatus === ORDER_STATUSES.IN_TRANSIT || newStatus === ORDER_STATUSES.PICKED_UP) {
                        notifyOrderShipped(transitionResult.order);
                    } else if (newStatus === ORDER_STATUSES.DELIVERED) {
                        notifyOrderDelivered(transitionResult.order);
                    } else if (newStatus.startsWith('RTO')) {
                        notifyOrderRTO(transitionResult.order, metadata.reason || 'Shipment returned');
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

        setOrders(prev => deduplicateOrders(prev, imported));

        // Unify customers from imported orders
        const newCustomers = imported.map(o => ({
            name: o.customerName,
            phone: o.phone,
            email: o.email || '',
            address: o.address,
            city: o.city,
            state: o.state,
            pincode: o.pincode,
            lastSeen: o.importedAt
        }));
        setCustomerMaster(prev => deduplicateCustomers([...prev, ...newCustomers]));

        logImportComplete(source, imported.length);
        notifyBulkImport(imported.length, source);

        return { success: true, count: imported.length };
    }, []);

    /**
     * Sync SKU Master from Zoho CRM
     */
    const syncSKUMaster = useCallback(async () => {
        try {
            setSyncStatus('syncing');
            const freshSkus = await fetchSKUMaster();
            setSkuMaster(freshSkus);
            setLastSyncTime(new Date().toISOString());
            setSyncStatus('online');
            return { success: true };
        } catch (error) {
            setSyncStatus('error');
            return { success: false, error: error.message };
        }
    }, []);

    /**
     * Sync Order to Zoho CRM
     */
    const syncOrderToZoho = useCallback(async (order) => {
        try {
            const result = await pushOrderToZoho(order);
            // Update order with Zoho ID if needed
            setOrders(prev => prev.map(o => o.id === order.id ? { ...o, zoho_id: result.zoho_id } : o));
            return { success: true, result };
        } catch (error) {
            console.error('Zoho Order Sync failed:', error);
            return { success: false, error: error.message };
        }
    }, []);

    /**
     * Warehouse: Adjust stock levels
     */
    const adjustStock = useCallback((skuId, adjustment) => {
        setInventoryLevels(prev => ({
            ...prev,
            [skuId]: {
                ...prev[skuId],
                inStock: Math.max(0, (prev[skuId]?.inStock || 0) + adjustment)
            }
        }));
    }, []);

    /**
     * Warehouse: Set location
     */
    const setStockLocation = useCallback((skuId, location) => {
        setInventoryLevels(prev => ({
            ...prev,
            [skuId]: {
                ...prev[skuId],
                location
            }
        }));
    }, []);

    /**
     * Supply Chain: Receive new stock batch
     */
    const receiveStock = useCallback((skuId, vendor, quantity) => {
        const newBatch = {
            id: `BATCH-${skuId}-${Date.now()}`,
            sku: skuId,
            vendor,
            quantity,
            allocated: 0,
            receivedAt: new Date().toISOString()
        };

        setBatches(prev => [...prev, newBatch]);
        setInventoryLevels(prev => ({
            ...prev,
            [skuId]: {
                ...prev[skuId],
                inStock: (prev[skuId]?.inStock || 0) + quantity
            }
        }));

        return { success: true, batchId: newBatch.id };
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
        return getValidNextStatuses(order?.status);
    }, [orders]);

    /**
     * Multi-Channel: Sync all marketplaces
     */
    const syncAllMarketplaces = useCallback(async () => {
        try {
            setSyncStatus('syncing');
            await marketplaceService.fetchAmazonOrders();
            await marketplaceService.fetchFlipkartOrders();
            await marketplaceService.syncInventoryToMarketplaces(inventoryLevels);
            setSyncStatus('online');
            setLastSyncTime(new Date().toISOString());

            // Notify completion
            notifyBulkImport(0, 'Multi-Channel Sync');

            return { success: true };
        } catch (error) {
            setSyncStatus('error');
            return { success: false, error: error.message };
        }
    }, [inventoryLevels]);

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

    /**
     * Customer Intelligence: Get LTV and Stats
     */
    const getCustomerMetrics = useCallback((phone) => {
        const cleanPhone = phone?.replace(/\D/g, '').slice(-10);
        const customerOrders = orders.filter(o =>
            o.phone?.replace(/\D/g, '').slice(-10) === cleanPhone ||
            (o.customerPhone && o.customerPhone.replace(/\D/g, '').slice(-10) === cleanPhone)
        );

        const totalSpend = customerOrders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);
        const avgOrderValue = customerOrders.length > 0 ? totalSpend / customerOrders.length : 0;

        let segment = 'New';
        if (customerOrders.length >= 5) segment = 'VIP';
        else if (customerOrders.length >= 2) segment = 'Regular';

        // At Risk logic: If last order was > 90 days ago
        const lastOrderDate = customerOrders.length > 0
            ? new Date(Math.max(...customerOrders.map(o => new Date(o.createdAt || Date.now()))))
            : null;

        if (lastOrderDate && (new Date() - lastOrderDate) > 90 * 24 * 60 * 60 * 1000) {
            segment = 'At Risk';
        }

        return {
            totalSpend,
            orderCount: customerOrders.length,
            avgOrderValue,
            segment,
            lastOrder: lastOrderDate,
            orders: customerOrders
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
        skuAliases,
        inventory,
        customerMaster,


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
        getCustomerMetrics,

        // Intelligence & Forecasting
        getDemandForecast: (days, forecastDays) => calculateSMAForecast(orders, days, forecastDays),
        getSKUPrediction: (sku, days) => predictSKUDemand(orders, sku, days),
        getTrend: (days) => getOrderTrend(orders, days),
        getRevenueProjection: (nextDays) => projectRevenue(orders, nextDays),
        getSKUProfitability: (skuId, price) => {
            const sku = skuMaster.find(s => s.sku === skuId);
            return calculateSKUProfitability(sku, price);
        },

        // Warehouse
        inventoryLevels,
        adjustStock,
        setStockLocation,
        syncAllMarketplaces,

        // Supply Chain
        batches,
        receiveStock,

        // Search
        universalSearch: (query) => searchService.universalSearch({ orders, skuMaster }, query),
        quickLookup: (id) => searchService.quickLookup(orders, id),

        // Activity Log
        activityLog: getActivityLog(),
        logActivity: logActivity,

        // Phase 13: Financial Intelligence
        flaggedOrders,
        resolveFlag: (orderId) => setFlaggedOrders(prev => prev.filter(o => o.id !== orderId)),

        // Zoho Sync
        syncSKUMaster,
        syncOrderToZoho,
        lastSyncTime,

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
