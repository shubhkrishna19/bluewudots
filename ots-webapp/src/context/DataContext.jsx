import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { transitionOrder, bulkTransition, ORDER_STATUSES, getValidNextStatuses } from '../services/orderStateMachine';
import { getAllRates, getRecommendation } from '../services/carrierRateEngine';
import { logOrderCreate, logOrderStatusChange, logBulkUpdate, logCarrierAssign, logImportComplete, initializeActivityLog as loadActivityCache, getActivityLog, logActivity } from '../services/activityLogger';
import { notifyOrderCreated, notifyOrderShipped, notifyOrderDelivered, notifyOrderRTO, notifyBulkImport, notifyLowStock } from '../services/notificationService';
import { validateOrder, normalizeOrder, generateOrderId, deduplicateOrders, deduplicateCustomers, exportOrdersCSV, exportJSON } from '../utils/dataUtils';
import { calculateSMAForecast, predictSKUDemand } from '../services/forecastService';
import { getOrderTrend, projectRevenue, calculateSKUProfitability, getKPIs } from '../services/analyticsService';
import { fetchSKUMaster, pushOrderToZoho, syncDeltaOrders } from '../services/zohoBridgeService';
import marketplaceService from '../services/marketplaceService';
import searchService from '../services/searchService';
import marginProtectionService from '../services/marginProtectionService';
import { getWhatsAppService } from '../services/whatsappService';
import webhookService from '../services/zohoWebhookService';
import cacheService, { initOfflineCacheService } from '../services/offlineCacheService';
import warehouseOptimizer from '../services/warehouseOptimizer';
import mlForecastService from '../services/mlForecastService';
import dealerService from '../services/dealerService';
import rtoService from '../services/rtoService';
import reverseLogisticsService from '../services/reverseLogisticsService';
import visionService from '../services/visionService';
import { SKU_MASTER, SKU_ALIASES } from '../data/skuMasterData';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    // --- STATE ---
    const [orders, setOrders] = useState([]);
    const [logistics, setLogistics] = useState([]);
    const [skuMaster, setSkuMaster] = useState(SKU_MASTER);
    const [skuAliases, setSkuAliases] = useState(SKU_ALIASES);
    const [inventoryLevels, setInventoryLevels] = useState({}); // { skuId: { inStock, reserved, location } }
    const [customerMaster, setCustomerMaster] = useState([]);
    const [batches, setBatches] = useState([]); // Array of { id, sku, vendor, quantity, allocated, receivedAt }
    const [flaggedOrders, setFlaggedOrders] = useState([]); // Orders requiring financial review
    const [warehouseLoads, setWarehouseLoads] = useState({}); // { warehouseId: currentOrderCount }
    const [dealerCredits, setDealerCredits] = useState({}); // { dealerId: usedCredit }
    const [returns, setReturns] = useState([]); // Active return requests
    const [packingSessions, setPackingSessions] = useState({}); // { orderId: { status, verifiedItems: [] } }
    const [activityLog, setActivityLog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncStatus, setSyncStatus] = useState('offline'); // offline | online | syncing | error
    const [lastSyncTime, setLastSyncTime] = useState(null);
    const [pushEnabled, setPushEnabled] = useState(false);
    const [offlineQueue, setOfflineQueue] = useState([]);

    // --- INITIALIZATION ---
    useEffect(() => {
        const initializeData = async () => {
            try {
                console.log('[Bluewud-AI] 🔄 Synchronizing systems...');
                setSyncStatus('syncing');
                const cache = initOfflineCacheService();
                await cache.initialize();

                // Load from Cache
                const cachedOrders = await cacheService.retrieveCachedData('orders');
                const cachedSkuMaster = await cacheService.retrieveCachedData('skuMaster');
                const cachedCustomers = await cacheService.retrieveCachedData('customers');
                const cachedActivityLog = await cacheService.retrieveCachedData('activityLog');
                const cachedMetadata = await cacheService.retrieveCachedData('metadata');

                if (cachedOrders && cachedOrders.length > 0) {
                    setOrders(cachedOrders);
                } else {
                    // Seed Mock Orders
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

                if (cachedSkuMaster) setSkuMaster(cachedSkuMaster);
                if (cachedCustomers) setCustomerMaster(cachedCustomers);
                else {
                    setCustomerMaster([
                        { name: 'Sameer Malhotra', phone: '9876543210', email: 'sameer@example.com', city: 'Delhi', state: 'Delhi', address: 'GK-II', pincode: '110048' },
                        { name: 'Anjali Sharma', phone: '9123456789', email: 'anjali@example.com', city: 'Mumbai', state: 'Maharashtra', address: 'Andheri West', pincode: '400053' },
                        { name: 'Karthik Rao', phone: '8877665544', email: 'karthik@example.com', city: 'Bangalore', state: 'Karnataka', address: 'HSR Layout', pincode: '560102' }
                    ]);
                }

                if (cachedActivityLog) {
                    loadActivityCache(cachedActivityLog);
                    setActivityLog(cachedActivityLog);
                }

                const invEntry = cachedMetadata?.find(m => m.key === 'inventoryLevels');
                if (invEntry) setInventoryLevels(invEntry.data);
                else {
                    const initialInventory = {};
                    SKU_MASTER.filter(s => !s.isParent).forEach(child => {
                        initialInventory[child.sku] = {
                            inStock: child.initialStock || 25,
                            reserved: 0,
                            location: child.defaultLocation || `WH-A1`
                        };
                    });
                    setInventoryLevels(initialInventory);
                }

                setSyncStatus('online');
                setLoading(false);
            } catch (error) {
                console.error('❌ Initialization Failed:', error);
                setSyncStatus('error');
                setLoading(false);
            }
        };
        initializeData();
    }, []);

    // --- AUTO-CACHE SYNC ---
    useEffect(() => {
        if (!loading) {
            cacheService.cacheData('orders', orders);
            cacheService.cacheData('skuMaster', skuMaster);
            cacheService.cacheData('customers', customerMaster);
            cacheService.cacheData('metadata', [
                { key: 'inventoryLevels', data: inventoryLevels },
                { key: 'warehouseLoads', data: warehouseLoads },
                { key: 'dealerCredits', data: dealerCredits }
            ]);
        }
    }, [orders, skuMaster, customerMaster, inventoryLevels, warehouseLoads, dealerCredits, loading]);

    // --- SMART ROUTING & WAREHOUSE ---
    const smartRouteOrder = useCallback((pincode, state) => {
        const result = warehouseOptimizer.selectOptimalWarehouse({ pincode, state }, warehouseLoads);
        return result.warehouse.id;
    }, [warehouseLoads]);

    useEffect(() => {
        const loads = {};
        orders.forEach(o => {
            if (o.warehouse && !['Delivered', 'Cancelled', 'RTO-Delivered'].includes(o.status)) {
                loads[o.warehouse] = (loads[o.warehouse] || 0) + 1;
            }
        });
        setWarehouseLoads(loads);
    }, [orders]);

    // --- ANALYTICS & INTELLIGENCE ---
    const getTrend = useCallback((days) => {
        const result = getOrderTrend(orders, days);
        return {
            slope: result.slope,
            trendLine: result.trendLine || [],
            status: result.trend
        };
    }, [orders]);

    const getRevenueProjection = useCallback((days) => {
        const kpis = getKPIs(orders, new Date(Date.now() - 30 * 86400000), new Date());
        const dailyAvg = kpis.totalRevenue / 30;
        return Math.round(dailyAvg * days);
    }, [orders]);

    const getDemandForecast = useCallback((historyDays = 30, futureDays = 7) => {
        const now = new Date();
        const history = [];
        for (let i = historyDays - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const actual = orders.filter(o => o.createdAt?.startsWith(dateStr)).length;
            history.push({ date: dateStr, actual });
        }
        const trend = getOrderTrend(orders, 90);
        const { slope, intercept } = trend;
        const baselineDay = 90;
        const forecast = [];
        for (let i = 1; i <= futureDays; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const predicted = Math.max(0, Math.round(slope * (baselineDay + i) + intercept));
            forecast.push({ date: dateStr, forecast: predicted });
        }
        return [...history, ...forecast];
    }, [orders]);

    const getOrderStats = useCallback(() => {
        const total = orders.length;
        const delivered = orders.filter(o => o.status === 'Delivered').length;
        const inTransit = orders.filter(o => ['In-Transit', 'Picked-Up'].includes(o.status)).length;
        return {
            total,
            delivered,
            inTransit,
            deliveryRate: total > 0 ? ((delivered / total) * 100).toFixed(1) : 0
        };
    }, [orders]);

    const getCustomerMetrics = useCallback((phone) => {
        const cleanPhone = phone?.replace(/\D/g, '').slice(-10);
        const customerOrders = orders.filter(o => o.phone?.replace(/\D/g, '').slice(-10) === cleanPhone);
        const totalSpend = customerOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
        return {
            totalSpend,
            orderCount: customerOrders.length,
            avgOrderValue: customerOrders.length > 0 ? totalSpend / customerOrders.length : 0,
            orders: customerOrders
        };
    }, [orders]);

    // --- ORDER ACTIONS ---
    const addOrder = useCallback((orderData) => {
        const validation = validateOrder(orderData);
        if (!validation.valid) return { success: false, errors: validation.errors };

        const newOrder = {
            ...orderData,
            id: generateOrderId(),
            status: ORDER_STATUSES.PENDING,
            createdAt: new Date().toISOString(),
            warehouse: smartRouteOrder(orderData.pincode, orderData.state)
        };

        const rtoAnalysis = rtoService.calculateRtoRisk(newOrder, getCustomerMetrics(newOrder.phone));
        newOrder.rtoScore = rtoAnalysis.score;
        newOrder.rtoRisk = rtoAnalysis.riskLevel;

        setOrders(prev => deduplicateOrders(prev, [newOrder]));
        logOrderCreate(newOrder);
        notifyOrderCreated(newOrder);
        return { success: true, order: newOrder };
    }, [smartRouteOrder, getCustomerMetrics]);

    const updateOrder = useCallback((orderId, updates) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates, lastUpdated: new Date().toISOString() } : o));
    }, []);

    const updateOrderStatus = useCallback((orderId, newStatus, metadata = {}) => {
        let result = null;
        setOrders(prev => prev.map(order => {
            if (order.id === orderId) {
                const oldStatus = order.status;
                const transitionResult = transitionOrder(order, newStatus, metadata);
                result = transitionResult;
                if (transitionResult.success) {
                    logOrderStatusChange(order, oldStatus, newStatus, metadata.reason);
                    if (newStatus === 'Delivered') notifyOrderDelivered(transitionResult.order);
                    return transitionResult.order;
                }
            }
            return order;
        }));
        return result || { success: false, error: 'Order not found' };
    }, []);

    const importOrders = useCallback((rawOrders, source) => {
        const imported = rawOrders.map(raw => {
            const normalized = normalizeOrder(raw, source);
            return {
                ...normalized,
                status: ORDER_STATUSES.PENDING,
                createdAt: new Date().toISOString(),
                warehouse: smartRouteOrder(normalized.pincode, normalized.state)
            };
        });
        setOrders(prev => deduplicateOrders(prev, imported));
        notifyBulkImport(imported.length, source);
        return { success: true, count: imported.length };
    }, [smartRouteOrder]);

    const adjustStock = useCallback((sku, adjustment) => {
        setInventoryLevels(prev => ({
            ...prev,
            [sku]: { ...prev[sku], inStock: Math.max(0, (prev[sku]?.inStock || 0) + adjustment) }
        }));
    }, []);

    const transferStock = useCallback((sku, fromBin, toBin, qty) => {
        setInventoryLevels(prev => ({
            ...prev,
            [sku]: { ...prev[sku], location: toBin }
        }));
        logActivity('STOCK_TRANSFER', `${qty} of ${sku} moved to ${toBin}`);
    }, []);

    const syncSKUMaster = useCallback(async () => {
        try {
            setSyncStatus('syncing');
            const fresh = await fetchSKUMaster();
            setSkuMaster(fresh);
            setSyncStatus('online');
            return { success: true };
        } catch (e) {
            setSyncStatus('error');
            return { success: false };
        }
    }, []);

    const syncOrderToZoho = useCallback(async (order) => {
        try {
            const res = await pushOrderToZoho(order);
            setOrders(prev => prev.map(o => o.id === order.id ? { ...o, zoho_id: res.zoho_id } : o));
            return { success: true };
        } catch (e) { return { success: false }; }
    }, []);

    // --- CONTEXT VALUE ---
    const value = {
        orders,
        skuMaster,
        skuAliases,
        inventoryLevels,
        customerMaster,
        batches,
        flaggedOrders,
        loading,
        syncStatus,
        lastSyncTime,
        addOrder,
        updateOrder,
        updateOrderStatus,
        importOrders,
        syncSKUMaster,
        syncOrderToZoho,
        adjustStock,
        transferStock,
        getTrend,
        getRevenueProjection,
        getDemandForecast,
        getOrderStats,
        getCustomerMetrics,
        getCarrierRates: (s) => getAllRates(s),
        getCarrierRecommendation: (s, p) => getRecommendation(s, p),
        universalSearch: (q) => searchService.universalSearch({ orders, skuMaster }, q),
        activityLog: getActivityLog(),
        logActivity
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within a DataProvider');
    return context;
};

export default DataContext;
