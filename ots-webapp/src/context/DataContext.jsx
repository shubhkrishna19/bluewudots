import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { transitionOrder, bulkTransition, ORDER_STATUSES, getValidNextStatuses } from '../services/orderStateMachine';
import { getAllRates, getRecommendation } from '../services/carrierRateEngine';
import { logOrderCreate, logOrderStatusChange, logBulkUpdate, logCarrierAssign, logImportComplete, logActivity } from '../services/activityLogger';
import { notifyOrderCreated, notifyOrderShipped, notifyOrderDelivered, notifyOrderRTO, notifyBulkImport } from '../services/notificationService';
import { validateOrder, normalizeOrder, generateOrderId, deduplicateOrders, deduplicateCustomers, exportOrdersCSV, exportJSON } from '../utils/dataUtils';
import { fetchSKUMaster, pushOrderToZoho, syncDeltaOrders } from '../services/zohoBridgeService';
import marketplaceService from '../services/marketplaceService';
import searchService from '../services/searchService';
import marginProtectionService from '../services/marginProtectionService';
import { initOfflineCacheService, getOfflineCacheService } from '../services/offlineCacheService';
import { sendWhatsAppMessage } from '../services/whatsappService';
import warehouseOptimizer from '../services/warehouseOptimizer';
import webhookService from '../services/zohoWebhookService';
import { getOrderTrend, getKPIs } from '../services/analyticsService';

import { SKU_MASTER, SKU_ALIASES } from '../data/skuMasterData';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [skuMaster, setSkuMaster] = useState(SKU_MASTER);
    const [skuAliases, setSkuAliases] = useState(SKU_ALIASES);
    const [inventoryLevels, setInventoryLevels] = useState({});
    const [customerMaster, setCustomerMaster] = useState([]);
    const [batches, setBatches] = useState([]);
    const [flaggedOrders, setFlaggedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncStatus, setSyncStatus] = useState('offline');

    // Initialize Cache & Load Data
    useEffect(() => {
        const initialize = async () => {
            setSyncStatus('syncing');
            const cache = initOfflineCacheService();
            await cache.initialize();

            const cachedOrders = await cache.getAllData('orders');
            if (cachedOrders?.length > 0) setOrders(cachedOrders.map(c => c.data || c));

            const cachedSkus = await cache.getAllData('skuMaster');
            if (cachedSkus?.length > 0) setSkuMaster(cachedSkus.map(c => c.data || c));

            setLoading(false);
            setSyncStatus('online');
        };
        initialize();
    }, []);

    // Auto-save orders to cache
    useEffect(() => {
        if (!loading) {
            const cache = getOfflineCacheService();
            orders.forEach(order => cache.cacheData('orders', order.id, order));
        }
    }, [orders, loading]);

    // Zoho Sync Logic (Delta)
    useEffect(() => {
        if (!loading && orders.length > 0) {
            const syncInterval = setInterval(() => {
                syncDeltaOrders(orders).catch(console.error);
            }, 300000); // 5 mins
            return () => clearInterval(syncInterval);
        }
    }, [orders, loading]);

    const addOrder = useCallback((orderData) => {
        const validation = validateOrder(orderData);
        if (!validation.valid) return { success: false, errors: validation.errors };

        const newOrder = {
            ...orderData,
            id: orderData.id || generateOrderId(),
            status: orderData.status || ORDER_STATUSES.PENDING,
            createdAt: orderData.createdAt || new Date().toISOString(),
            warehouse: orderData.warehouse || warehouseOptimizer.selectOptimalWarehouse({ pincode: orderData.pincode, state: orderData.state }).warehouse.id
        };

        const marginCheck = marginProtectionService.validateMargin(newOrder, skuMaster.find(s => s.sku === newOrder.sku));
        if (marginCheck.shouldBlock) {
            setFlaggedOrders(prev => [...prev, newOrder]);
            return { success: false, error: 'MARGIN_BLOCK', message: marginCheck.alert };
        }

        setOrders(prev => [...prev, newOrder]);
        notifyOrderCreated(newOrder);

        sendWhatsAppMessage(newOrder.phone, 'ORDER_CONFIRMED', { orderId: newOrder.id, amount: newOrder.amount });

        return { success: true, order: newOrder };
    }, [skuMaster]);

    const updateOrder = useCallback((orderId, updates) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
    }, []);

    const updateOrderStatus = useCallback((orderId, newStatus, metadata = {}) => {
        let result = null;
        setOrders(prev => prev.map(order => {
            if (order.id === orderId) {
                const transitionResult = transitionOrder(order, newStatus, metadata);
                if (transitionResult.success) {
                    result = transitionResult;
                    logOrderStatusChange(order, order.status, newStatus, metadata.reason);

                    // WhatsApp Notifications
                    if (newStatus === ORDER_STATUSES.SHIPPED || newStatus === 'Carrier-Assigned') {
                        sendWhatsAppMessage(order.phone, 'ORDER_SHIPPED', { orderId: order.id, awb: order.awb || 'N/A', carrier: order.carrier || 'N/A' });
                    } else if (newStatus === ORDER_STATUSES.DELIVERED) {
                        sendWhatsAppMessage(order.phone, 'ORDER_DELIVERED', { orderId: order.id });
                    }

                    return transitionResult.order;
                }
            }
            return order;
        }));
        return result || { success: false, error: 'Transition failed' };
    }, []);

    const adjustStock = useCallback((sku, delta) => {
        setInventoryLevels(prev => {
            const current = prev[sku] || { inStock: 0, reserved: 0, location: 'UNKNOWN' };
            return {
                ...prev,
                [sku]: { ...current, inStock: Math.max(0, current.inStock + delta) }
            };
        });
    }, []);

    const transferStock = useCallback((sku, from, to, qty) => {
        adjustStock(sku, -qty);
        // In a real app we'd add to the 'to' warehouse inventory
        logActivity({ type: 'inventory.transfer', action: `Transferred ${qty} of ${sku} from ${from} to ${to}` });
    }, [adjustStock]);

    const syncSKUMaster = useCallback(async () => {
        setSyncStatus('syncing');
        try {
            const freshSkus = await fetchSKUMaster();
            setSkuMaster(freshSkus);
            setSyncStatus('online');
            return { success: true };
        } catch (e) {
            setSyncStatus('error');
            return { success: false, error: e.message };
        }
    }, []);

    // Analytics Helpers for UI
    const getTrend = useCallback((days) => {
        const result = getOrderTrend(orders, days);
        // Map service result to component expectations if needed
        return {
            slope: result.slope,
            trendLine: result.trendLine || [], // Ensure trendLine exists
            status: result.trend
        };
    }, [orders]);

    const getRevenueProjection = useCallback((days) => {
        const kpis = getKPIs(orders, new Date(Date.now() - 30 * 86400000), new Date());
        const dailyAvg = kpis.totalRevenue / 30;
        return Math.round(dailyAvg * days);
    }, [orders]);

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
        addOrder,
        updateOrder,
        updateOrderStatus,
        syncSKUMaster,
        adjustStock,
        transferStock,
        getTrend,
        getRevenueProjection,
        getCarrierRates: (s) => getAllRates(s),
        getCarrierRecommendation: (s, p) => getRecommendation(s, p)
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
export default DataContext;
