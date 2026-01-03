import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { transitionOrder, bulkTransition, ORDER_STATUSES, getValidNextStatuses } from '../services/orderStateMachine';
import { getAllRates, getRecommendation } from '../services/carrierRateEngine';
import { logOrderCreate, logOrderStatusChange, logBulkUpdate, logCarrierAssign, logImportComplete, initializeActivityLog as loadActivityCache, logActivity } from '../services/activityLogger';
import { notifyOrderCreated, notifyOrderShipped, notifyOrderDelivered, notifyOrderRTO, notifyBulkImport } from '../services/notificationService';
import { validateOrder, normalizeOrder, generateOrderId, deduplicateOrders, deduplicateCustomers, exportOrdersCSV, exportJSON } from '../utils/dataUtils';
import { fetchSKUMaster, pushOrderToZoho, syncDeltaOrders } from '../services/zohoBridgeService';
import marketplaceService from '../services/marketplaceService';
import searchService from '../services/searchService';
import marginProtectionService from '../services/marginProtectionService';
import { initOfflineCacheService, getOfflineCacheService } from '../services/offlineCacheService';
import { getWhatsAppService, initWhatsAppService } from '../services/whatsappServiceEnhanced';
import warehouseOptimizer from '../services/warehouseOptimizer';
import webhookService from '../services/zohoWebhookService';

import { SKU_MASTER, SKU_ALIASES } from '../data/skuMasterData';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [skuMaster, setSkuMaster] = useState(SKU_MASTER);
    const [skuAliases, setSkuAliases] = useState(SKU_ALIASES);
    const [inventoryLevels, setInventoryLevels] = useState({});
    const [customerMaster, setCustomerMaster] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncStatus, setSyncStatus] = useState('offline');

    // Initialize Cache & Load Data
    useEffect(() => {
        const initialize = async () => {
            setSyncStatus('syncing');
            const cache = initOfflineCacheService();
            await cache.initialize();

            const cachedOrders = await cache.getAllData('orders');
            if (cachedOrders?.length > 0) setOrders(cachedOrders.map(c => c.data));

            const cachedSkus = await cache.getAllData('skuMaster');
            if (cachedSkus?.length > 0) setSkuMaster(cachedSkus.map(c => c.data));

            setLoading(false);
            setSyncStatus('online');
        };
        initialize();
    }, []);

    // Zoho Sync Logic
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
            id: generateOrderId(),
            status: ORDER_STATUSES.PENDING,
            createdAt: new Date().toISOString(),
            warehouse: warehouseOptimizer.selectOptimalWarehouse({ pincode: orderData.pincode, state: orderData.state }).warehouse.id
        };

        const marginCheck = marginProtectionService.validateMargin(newOrder, skuMaster.find(s => s.sku === newOrder.sku));
        if (marginCheck.shouldBlock) return { success: false, error: 'MARGIN_BLOCK', message: marginCheck.alert };

        setOrders(prev => [...prev, newOrder]);

        // Persistence
        const cache = getOfflineCacheService();
        cache.cacheData('orders', newOrder.id, newOrder);

        // Notifications
        notifyOrderCreated(newOrder);
        try {
            getWhatsAppService().sendWhatsAppMessage(newOrder.id, 'order_confirmation', newOrder.phone, { orderId: newOrder.id });
        } catch (e) { }

        return { success: true, order: newOrder };
    }, [skuMaster]);

    const updateOrderStatus = useCallback((orderId, newStatus, metadata = {}) => {
        let result = null;
        setOrders(prev => prev.map(order => {
            if (order.id === orderId) {
                const transitionResult = transitionOrder(order, newStatus, metadata);
                if (transitionResult.success) {
                    result = transitionResult;
                    logOrderStatusChange(order, order.status, newStatus, metadata.reason);

                    // WhatsApp Integration
                    try {
                        const whatsapp = getWhatsAppService();
                        if (newStatus === ORDER_STATUSES.DELIVERED) {
                            whatsapp.sendWhatsAppMessage(orderId, 'delivery_confirmation', order.phone, { orderId });
                        } else if (newStatus.startsWith('RTO')) {
                            whatsapp.sendWhatsAppMessage(orderId, 'rto_alert', order.phone, { orderId, reason: metadata.reason });
                        }
                    } catch (e) { }

                    return transitionResult.order;
                }
            }
            return order;
        }));
        return result || { success: false, error: 'Transition failed' };
    }, []);

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

    const value = {
        orders,
        skuMaster,
        skuAliases,
        inventoryLevels,
        customerMaster,
        batches,
        loading,
        syncStatus,
        addOrder,
        updateOrderStatus,
        syncSKUMaster,
        getCarrierRates: (s) => getAllRates(s),
        getCarrierRecommendation: (s, p) => getRecommendation(s, p)
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
