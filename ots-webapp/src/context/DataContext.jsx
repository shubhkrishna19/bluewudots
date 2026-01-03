import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  transitionOrder,
  bulkTransition,
  ORDER_STATUSES,
  getValidNextStatuses,
} from '../services/orderStateMachine'
import { getAllRates, getRecommendation } from '../services/carrierRateEngine'
import {
  logOrderCreate,
  logOrderStatusChange,
  logBulkUpdate,
  logCarrierAssign,
  logImportComplete,
  initializeActivityLog as loadActivityCache,
  getActivityLog,
  logActivity,
} from '../services/activityLogger'
import {
  notifyOrderCreated,
  notifyOrderShipped,
  notifyOrderDelivered,
  notifyOrderRTO,
  notifyBulkImport,
  notifyLowStock,
} from '../services/notificationService'
import {
  validateOrder,
  normalizeOrder,
  generateOrderId,
  deduplicateOrders,
  deduplicateCustomers,
  exportOrdersCSV,
  exportJSON,
} from '../utils/dataUtils'
import { calculateSMAForecast, predictSKUDemand } from '../services/forecastService'
import {
  getOrderTrend,
  projectRevenue,
  calculateSKUProfitability,
} from '../services/analyticsService'
import { fetchSKUMaster, pushOrderToZoho } from '../services/zohoBridgeService'
import marketplaceService from '../services/marketplaceService'
import searchService from '../services/searchService'
import marginProtectionService from '../services/marginProtectionService'
import { getWhatsAppService } from '../services/whatsappService'
import webhookService from '../services/zohoWebhookService'
import { syncDeltaOrders } from '../services/zohoBridgeService'
import cacheService, { initOfflineCacheService } from '../services/offlineCacheService'
import warehouseOptimizer from '../services/warehouseOptimizer'
import mlForecastService from '../services/mlForecastService'
import dealerService from '../services/dealerService'
import rtoService from '../services/rtoService'
import reverseLogisticsService from '../services/reverseLogisticsService'
import visionService from '../services/visionService'
import { ROLES, PERMISSIONS, can } from '../services/rbacMiddleware'

import { SKU_MASTER, SKU_ALIASES } from '../data/skuMasterData'

const DataContext = createContext()

export const DataProvider = ({ children }) => {
  const [orders, setOrders] = useState([])
  const [logistics, setLogistics] = useState([])
  const [skuMaster, setSkuMaster] = useState(SKU_MASTER)
  const [skuAliases, setSkuAliases] = useState(SKU_ALIASES)
  const [inventory, setInventory] = useState([])
  const [customerMaster, setCustomerMaster] = useState([])
  const [inventoryLevels, setInventoryLevels] = useState({}) // { skuId: { inStock, reserved, location } }
  const [batches, setBatches] = useState([]) // Array of { id, sku, vendor, quantity, allocated, receivedAt }
  const [flaggedOrders, setFlaggedOrders] = useState([]) // Orders requiring financial review
  const [warehouseLoads, setWarehouseLoads] = useState({}) // { warehouseId: currentOrderCount }
  const [dealerCredits, setDealerCredits] = useState({}) // { dealerId: usedCredit }
  const [returns, setReturns] = useState([]) // Active return requests
  const [packingSessions, setPackingSessions] = useState({}) // { orderId: { status, verifiedItems: [] } }

  const [activityLog, setActivityLog] = useState([])
  const [agentMetadata, setAgentMetadata] = useState({
    lastAgent: 'Antigravity',
    sessionStart: new Date().toISOString(),
    mutations: 0,
  })
  const [loading, setLoading] = useState(true)

  // Initialize Cache
  useEffect(() => {
    const cache = initOfflineCacheService()
    cache.initialize().then(async () => {
      const cachedOrders = await cache.getAllData('orders')
      if (cachedOrders.length > 0 && orders.length === 0) {
        setOrders(cachedOrders.map((c) => c.data))
      }
    })
  }, [])

  // Zoho Webhook & Delta Sync
  useEffect(() => {
    const unsubscribe = webhookService.subscribe(({ type, data }) => {
      if (type === 'ORDER_UPDATED') {
        setOrders((prev) => {
          const updatedOrders = prev.map((o) => (o.id === data.id ? { ...o, ...data } : o))
          setAgentMetadata((m) => ({ ...m, mutations: m.mutations + 1 }))
          return updatedOrders
        })
      } else if (type === 'INVENTORY_SYNC') {
        setInventoryLevels((prev) => ({ ...prev, [data.sku]: data.levels }))
      }
    })

    // Persist orders to cache
    if (orders.length > 0) {
      orders.forEach((o) => cacheService.cacheData('orders', o.id, o))
    }

    const syncInterval = setInterval(() => {
      if (orders.length > 0) {
        syncDeltaOrders(orders).catch((err) => console.error('Delta Sync Failed:', err))
      }
    }, 300000) // 5 mins

    return () => {
      unsubscribe()
      clearInterval(syncInterval)
    }
  }, [orders.length])
  const [syncStatus, setSyncStatus] = useState('offline') // offline | online | syncing | error
  const [lastSyncTime, setLastSyncTime] = useState(null)
  const [pushEnabled, setPushEnabled] = useState(false)
  const [offlineQueue, setOfflineQueue] = useState([])

  // ============================================
  // INITIAL DATA LOAD
  // ============================================
  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log('[Bluewud-AI] 🔄 Synchronizing with Global Nodes...')
        setSyncStatus('syncing')

        // 1. Load from Offline Cache first (Highest Priority for Speed)
        const cachedOrders = await cacheService.retrieveCachedData('orders')
        const cachedSkuMaster = await cacheService.retrieveCachedData('skuMaster')
        const cachedCustomers = await cacheService.retrieveCachedData('customers')
        const cachedActivityLog = await cacheService.retrieveCachedData('activityLog')
        const cachedMetadata = await cacheService.retrieveCachedData('metadata')

        if (cachedOrders && cachedOrders.length > 0) {
          console.log(`[Bluewud-AI] 📦 Loaded ${cachedOrders.length} orders from cache`)
          setOrders(cachedOrders)
        } else {
          // Seed Mock Orders only if cache is empty
          const mockOrders = [
            ...Array(6)
              .fill(0)
              .map((_, i) => ({
                id: `BWD-${1000 + i}`,
                customerName: 'Sameer Malhotra',
                phone: '9876543210',
                amount: 15000 + i * 1000,
                status: 'Delivered',
                sku: 'SR-CLM-TM',
                createdAt: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toISOString(),
              })),
            {
              id: 'BWD-2001',
              customerName: 'Anjali Sharma',
              phone: '9123456789',
              amount: 8500,
              status: 'In-Transit',
              sku: 'SR-CLM-TM',
              createdAt: new Date().toISOString(),
            },
            {
              id: 'BWD-2002',
              customerName: 'Anjali Sharma',
              phone: '9123456789',
              amount: 3200,
              status: 'Delivered',
              sku: 'SR-CLM-TM',
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'BWD-3001',
              customerName: 'Priya Verma',
              phone: '7766554433',
              amount: 12000,
              status: 'Delivered',
              sku: 'SR-CLM-TM',
              createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ]
          setOrders(mockOrders)
        }

        if (cachedSkuMaster && cachedSkuMaster.length > 0) {
          setSkuMaster(cachedSkuMaster)
        }

        if (cachedCustomers && cachedCustomers.length > 0) {
          setCustomerMaster(cachedCustomers)
        } else {
          // Seed Mock Customers
          setCustomerMaster([
            {
              name: 'Sameer Malhotra',
              phone: '9876543210',
              email: 'sameer@example.com',
              city: 'Delhi',
              state: 'Delhi',
              address: 'GK-II',
              pincode: '110048',
            },
            {
              name: 'Anjali Sharma',
              phone: '9123456789',
              email: 'anjali@example.com',
              city: 'Mumbai',
              state: 'Maharashtra',
              address: 'Andheri West',
              pincode: '400053',
            },
            {
              name: 'Karthik Rao',
              phone: '8877665544',
              email: 'karthik@example.com',
              city: 'Bangalore',
              state: 'Karnataka',
              address: 'HSR Layout',
              pincode: '560102',
            },
            {
              name: 'Priya Verma',
              phone: '7766554433',
              email: 'priya@example.com',
              city: 'Chandigarh',
              state: 'Punjab',
              address: 'Sector 17',
              pincode: '160017',
            },
          ])
        }

        if (cachedActivityLog && cachedActivityLog.length > 0) {
          loadActivityCache(cachedActivityLog)
          setActivityLog(cachedActivityLog)
        }

        const invEntry = cachedMetadata?.find((m) => m.key === 'inventoryLevels')
        if (invEntry) {
          setInventoryLevels(invEntry.data)
        }
        const loadEntry = cachedMetadata?.find((m) => m.key === 'warehouseLoads')
        if (loadEntry) setWarehouseLoads(loadEntry.data)

        const creditEntry = cachedMetadata?.find((m) => m.key === 'dealerCredits')
        if (creditEntry) setDealerCredits(creditEntry.data)
        else {
          // Seed Mock Inventory
          const initialInventory = {}
          SKU_MASTER.filter((s) => !s.isParent).forEach((child) => {
            initialInventory[child.sku] = {
              inStock: child.initialStock || Math.floor(Math.random() * 50) + 10,
              reserved: 0,
              location: child.defaultLocation || `WH-A${Math.floor(Math.random() * 9) + 1}`,
            }
          })
          setInventoryLevels(initialInventory)
        }

        const batchEntry = cachedBatches?.find((m) => m.key === 'batches')
        if (batchEntry) {
          setBatches(batchEntry.data)
        } else {
          // Seed Mock Batches
          const mockBatches = []
          SKU_MASTER.filter((s) => !s.isParent).forEach((sku) => {
            mockBatches.push({
              id: `BATCH-${sku.sku}-001`,
              sku: sku.sku,
              vendor: 'Elite Woods',
              quantity: 20,
              allocated: 0,
              receivedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            })
          })
          setBatches(mockBatches)
        }

        // 2. Network Check / Remote Sync
        setSyncStatus('online')
        setLoading(false)
        console.log('[Bluewud-AI] ✅ Core systems ready')
      } catch (error) {
        console.error('❌ Data Sync Failed:', error)
        setSyncStatus('error')
        setLoading(false)
      }
    }
    initializeData()

    // Initial Load from Zoho SSOT
    fetchSKUMaster().then((skus) => {
      if (skus && skus.length > 0) {
        setSkuMaster(skus)
      }
    })
  }, [])

  // --- AUTO-CACHE SYNC ---
  useEffect(() => {
    if (!loading && orders.length > 0) {
      cacheService.cacheData('orders', orders)
    }
  }, [orders, loading])

  useEffect(() => {
    if (!loading && skuMaster.length > 0) {
      cacheService.cacheData('skuMaster', skuMaster)
    }
  }, [skuMaster, loading])

  useEffect(() => {
    if (!loading && customerMaster.length > 0) {
      cacheService.cacheData('customers', customerMaster)
    }
  }, [customerMaster, loading])

  useEffect(() => {
    if (!loading) {
      cacheService.cacheData('metadata', { key: 'inventoryLevels', data: inventoryLevels })
    }
  }, [inventoryLevels, loading])

  useEffect(() => {
    if (!loading) {
      cacheService.cacheData('metadata', { key: 'batches', data: batches })
      cacheService.cacheData('metadata', { key: 'warehouseLoads', data: warehouseLoads })
      cacheService.cacheData('metadata', { key: 'dealerCredits', data: dealerCredits })
    }
  }, [batches, warehouseLoads, dealerCredits, loading])

  // ============================================
  // LIVE TRACKING SIMULATOR
  // ============================================
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) =>
        prev.map((order) => {
          if (order.status === 'In-Transit' && Math.random() > 0.8) {
            const hubs = [
              'Mumbai Gateway',
              'Delhi Sorting Hub',
              'Nagpur Logistics Park',
              'Ambala Center',
              'Kolkata Hub',
            ]
            const randomHub = hubs[Math.floor(Math.random() * hubs.length)]
            return {
              ...order,
              lastUpdated: new Date().toISOString(),
              statusHistory: [
                ...(order.statusHistory || []),
                {
                  from: 'In-Transit',
                  to: 'In-Transit',
                  timestamp: new Date().toISOString(),
                  location: randomHub,
                  user: 'carrier-service',
                },
              ],
            }
          }
          return order
        })
      )
    }, 30000) // Check every 30s
    return () => clearInterval(interval)
  }, [])

  // ============================================
  // VISION AI PACKING
  // ============================================

  const updatePackingStatus = useCallback((orderId, itemsPacked) => {
    setPackingSessions((prev) => ({
      ...prev,
      [orderId]: {
        status: itemsPacked.length > 0 ? 'Packing' : 'Pending',
        verifiedItems: itemsPacked,
        lastUpdated: new Date().toISOString(),
      },
    }))
  }, [])

  // ============================================
  // SMART ROUTING LOGIC
  // ============================================

  /**
   * Smart routing for regional warehouse selection with real-time load balancing
   */
  const smartRouteOrder = useCallback(
    (pincode, state) => {
      const result = warehouseOptimizer.selectOptimalWarehouse({ pincode, state }, warehouseLoads)
      return result.warehouse.id
    },
    [warehouseLoads]
  )

  // Update warehouse loads when orders change
  useEffect(() => {
    const loads = {}
    orders.forEach((o) => {
      if (o.warehouse && !['Delivered', 'Cancelled', 'RTO-Delivered'].includes(o.status)) {
        loads[o.warehouse] = (loads[o.warehouse] || 0) + 1
      }
    })
    setWarehouseLoads(loads)
  }, [orders])

  // ============================================
  // ORDER MANAGEMENT
  // ============================================

  /**
   * Add a new order
   */
  const addOrder = useCallback((orderData) => {
    const validation = validateOrder(orderData)
    if (!validation.valid) {
      return { success: false, errors: validation.errors }
    }

    const newOrder = {
      ...orderData,
      id: generateOrderId(),
      status: ORDER_STATUSES.PENDING,
      statusHistory: [
        {
          from: null,
          to: ORDER_STATUSES.PENDING,
          timestamp: new Date().toISOString(),
          user: 'system',
        },
      ],
      createdAt: new Date().toISOString(),
      warehouse: smartRouteOrder(orderData.pincode, orderData.state),
    }

    // --- RTO PREDICTION ---
    const rtoAnalysis = rtoService.calculateRtoRisk(newOrder, getCustomerMetrics(newOrder.phone))
    newOrder.rtoScore = rtoAnalysis.score
    newOrder.rtoRisk = rtoAnalysis.riskLevel
    newOrder.rtoReasons = rtoAnalysis.reasons

    // --- B2B DEALER LOGIC ---
    if (orderData.dealerId) {
      const dealer = {
        id: orderData.dealerId,
        tier: orderData.dealerTier || 'SILVER',
        usedCredit: dealerCredits[orderData.dealerId] || 0,
      }

      // Calculate Hybrid Wholesale Price
      if (!orderData.isWholesaleApplied) {
        const qty = orderData.quantity || 1
        const retailUnitPrice = newOrder.amount / qty

        // 1. Apply Quantity-based discount from wholesaleService
        const qtyDiscountedPrice = wholesaleService.calculateTieredPrice(retailUnitPrice, qty)

        // 2. Apply Tier-based discount from dealerService (on top of or as an alternative)
        // For Bluewud, we'll take the better of the two or a combined approach.
        // Let's use the Dealer Tier discount as it's typically higher (25%+)
        const tierDiscountedPrice = dealerService.calculateWholesalePrice(
          retailUnitPrice,
          dealer.tier
        )

        // Take the lowest price (highest discount)
        const finalUnitPrice = Math.min(qtyDiscountedPrice, tierDiscountedPrice)

        newOrder.amount = finalUnitPrice * qty
        newOrder.isWholesaleApplied = true
        newOrder.unitPrice = finalUnitPrice
      }

      const creditCheck = dealerService.checkCreditLimit(
        newOrder.amount,
        dealer.usedCredit,
        dealer.tier
      )
      if (!creditCheck.allowed) {
        return { success: false, errors: [creditCheck.reason] }
      }

      // Update credit usage
      setDealerCredits((prev) => ({
        ...prev,
        [dealer.id]: (prev[dealer.id] || 0) + newOrder.amount,
      }))
    }

    // --- 🤖 RTO AUTO-BLOCKER ---
    // Automatically hold high-risk COD orders (Risk Score > 60)
    if (newOrder.paymentMethod === 'COD' || newOrder.paymentMode === 'COD') {
      const risk = rtoService.predictRisk(newOrder)
      newOrder.rtoRiskScore = risk.score
      newOrder.rtoRiskLevel = risk.riskLevel
      newOrder.rtoReasons = risk.reasons

      if (risk.score >= 60) {
        newOrder.status = ORDER_STATUSES.ON_HOLD
        newOrder.holdReason = `High RTO Risk (${risk.score}%): ${risk.reasons.join(', ')}`

        // Add blocking entry to history
        newOrder.statusHistory.push({
          from: ORDER_STATUSES.PENDING,
          to: ORDER_STATUSES.ON_HOLD,
          timestamp: new Date().toISOString(),
          user: 'RTO_BOT',
          reason: newOrder.holdReason,
        })
      }
    }

    // --- MARGIN PROTECTION CHECK ---
    const skuData = skuMaster.find((s) => s.sku === newOrder.sku)
    const marginCheck = marginProtectionService.validateMargin(newOrder, skuData)

    if (marginCheck.shouldBlock) {
      console.error('Order Blocked:', marginCheck.alert)
      return {
        success: false,
        error: 'MARGIN_BLOCK',
        message: marginCheck.alert,
      }
    }

    if (!marginCheck.isProtected) {
      newOrder.financialFlag = true
      newOrder.marginAlert = marginCheck.alert
      setFlaggedOrders((prev) => [...prev, newOrder])
    }

    setOrders((prev) => deduplicateOrders(prev, [newOrder]))

    // --- GLOBAL SYNC: Inventory Reservation ---
    if (newOrder.sku) {
      setInventoryLevels((prev) => ({
        ...prev,
        [newOrder.sku]: {
          ...prev[newOrder.sku],
          reserved: (prev[newOrder.sku]?.reserved || 0) + 1,
        },
      }))
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
      lastSeen: newOrder.createdAt,
    }
    setCustomerMaster((prev) => deduplicateCustomers([...prev, customer]))

    logOrderCreate(newOrder)
    notifyOrderCreated(newOrder)
    try {
      const whatsapp = getWhatsAppService()
      whatsapp.sendWhatsAppMessage(newOrder.id, 'order_confirmation', newOrder.phone, {
        orderId: newOrder.id,
        customer: newOrder.customerName,
      })
    } catch (e) {
      console.warn('WhatsApp not initialized')
    }

    return { success: true, order: newOrder }
  }, [])

  /**
   * Update order status with state machine validation
   */
  const updateOrderStatus = useCallback(async (orderId, newStatus, metadata = {}) => {
    let result = { success: false }

    setOrders((prev) => {
      const orderIndex = prev.findIndex((o) => o.id === orderId)
      if (orderIndex === -1) return prev

      const currentOrder = prev[orderIndex]

      // 1. Validate Transition
      const transitionResult = transitionOrder(currentOrder, newStatus, {
        ...metadata,
        user: agentMetadata.lastAgent,
      })

      if (!transitionResult.success) {
        console.warn(`Invalid transition for ${orderId}: ${currentOrder.status} -> ${newStatus}`)
        result = { success: false, error: transitionResult.error }
        return prev
      }

      const updatedOrder = transitionResult.order
      const newOrders = [...prev]
      newOrders[orderIndex] = updatedOrder

      // 2. Log Activity
      logOrderStatusChange(orderId, currentOrder.status, newStatus, agentMetadata.lastAgent)
      setAgentMetadata((m) => ({ ...m, mutations: m.mutations + 1 }))

      // 3. Inventory Updates
      if (newStatus === 'Delivered' || newStatus === 'In-Transit') {
        setInventoryLevels((p) => ({
          ...p,
          [updatedOrder.sku]: {
            ...p[updatedOrder.sku],
            inStock: Math.max(0, (p[updatedOrder.sku]?.inStock || 0) - 1),
            reserved: Math.max(0, (p[updatedOrder.sku]?.reserved || 0) - 1),
          },
        }))
      } else if (newStatus === 'Cancelled' || newStatus === 'RTO-Delivered') {
        setInventoryLevels((p) => ({
          ...p,
          [updatedOrder.sku]: {
            ...p[updatedOrder.sku],
            reserved: Math.max(0, (p[updatedOrder.sku]?.reserved || 0) - 1),
          },
        }))
      }

      // 4. Notifications (Async Handlers)
      try {
        const whatsapp = getWhatsAppService()
        if (newStatus === 'In-Transit' || newStatus === 'Picked Up') {
          notifyOrderShipped(updatedOrder)
          whatsapp.sendWhatsAppMessage(orderId, 'shipping_update', updatedOrder.phone, {
            orderId,
            status: newStatus,
          })
        } else if (newStatus === 'Delivered') {
          notifyOrderDelivered(updatedOrder)
          whatsapp.sendWhatsAppMessage(orderId, 'delivery_confirmation', updatedOrder.phone, {
            orderId,
          })
        } else if (newStatus.startsWith('RTO')) {
          const reason = metadata.reason || 'Shipment returned'
          notifyOrderRTO(updatedOrder, reason)
          whatsapp.sendWhatsAppMessage(orderId, 'rto_alert', updatedOrder.phone, {
            orderId,
            reason,
          })
        }
      } catch (e) {
        console.warn('Notification error:', e)
      }

      result = { success: true, order: updatedOrder }
      return newOrders
    })

    return result
  }, [])
  /**
   * Bulk update order statuses
   */
  const bulkUpdateStatus = useCallback(
    (orderIds, newStatus, metadata = {}) => {
      const ordersToUpdate = orders.filter((o) => orderIds.includes(o.id))
      const results = bulkTransition(ordersToUpdate, newStatus, metadata)

      if (results.successful.length > 0) {
        setOrders((prev) => {
          const successIds = results.successful.map((o) => o.id)
          return prev.map((order) =>
            successIds.includes(order.id)
              ? results.successful.find((o) => o.id === order.id)
              : order
          )
        })

        logBulkUpdate(orderIds, newStatus)
        notifyBulkImport(results.successful.length, `Bulk ${newStatus}`)
      }

      return results
    },
    [orders]
  )

  /**
   * Assign carrier to order
   */
  const assignCarrier = useCallback((orderId, carrierId, carrierName) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updated = {
            ...order,
            carrier: carrierName,
            carrierId: carrierId,
          }
          logCarrierAssign(order, carrierName)
          return updated
        }
        return order
      })
    )
  }, [])

  /**
   * Import orders from external source
   */
  const importOrders = useCallback((rawOrders, source) => {
    const imported = rawOrders.map((raw) => {
      const normalized = normalizeOrder(raw, source)
      return {
        ...normalized,
        status: ORDER_STATUSES.PENDING,
        statusHistory: [
          {
            from: null,
            to: ORDER_STATUSES.PENDING,
            timestamp: new Date().toISOString(),
            user: 'import',
          },
        ],
        createdAt: new Date().toISOString(),
        warehouse: smartRouteOrder(normalized.pincode, normalized.state),
      }
    })

    setOrders((prev) => deduplicateOrders(prev, imported))

    // Unify customers from imported orders
    const newCustomers = imported.map((o) => ({
      name: o.customerName,
      phone: o.phone,
      email: o.email || '',
      address: o.address,
      city: o.city,
      state: o.state,
      pincode: o.pincode,
      lastSeen: o.importedAt,
    }))
    setCustomerMaster((prev) => deduplicateCustomers([...prev, ...newCustomers]))

    logImportComplete(source, imported.length)
    notifyBulkImport(imported.length, source)

    return { success: true, count: imported.length }
  }, [])

  /**
   * Sync SKU Master from Zoho CRM
   */
  const syncSKUMaster = useCallback(async () => {
    try {
      setSyncStatus('syncing')
      const freshSkus = await fetchSKUMaster()
      setSkuMaster(freshSkus)
      setLastSyncTime(new Date().toISOString())
      setSyncStatus('online')
      return { success: true }
    } catch (error) {
      setSyncStatus('error')
      return { success: false, error: error.message }
    }
  }, [])

  /**
   * Sync Order to Zoho CRM
   */
  const syncOrderToZoho = useCallback(async (order) => {
    try {
      const result = await pushOrderToZoho(order)
      // Update order with Zoho ID if needed
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, zoho_id: result.zoho_id } : o))
      )
      return { success: true, result }
    } catch (error) {
      console.error('Zoho Order Sync failed:', error)
      return { success: false, error: error.message }
    }
  }, [])

  /**
   * Warehouse: Adjust stock levels
   */
  const adjustStock = useCallback((skuId, adjustment) => {
    setInventoryLevels((prev) => ({
      ...prev,
      [skuId]: {
        ...prev[skuId],
        inStock: Math.max(0, (prev[skuId]?.inStock || 0) + adjustment),
      },
    }))
  }, [])

  /**
   * Warehouse: Set location
   */
  const setStockLocation = useCallback((skuId, location) => {
    setInventoryLevels((prev) => ({
      ...prev,
      [skuId]: {
        ...prev[skuId],
        location,
      },
    }))
  }, [])

  /**
   * Warehouse: Transfer stock between locations/bins
   */
  const transferStock = useCallback((sku, fromBin, toBin, qty) => {
    console.log(`📦 Transferring ${qty} of ${sku} from ${fromBin} to ${toBin}`)
    setInventoryLevels((prev) => {
      const current = prev[sku] || { inStock: 0, reserved: 0, location: 'UNKNOWN' }
      return {
        ...prev,
        [sku]: {
          ...current,
          location: toBin, // Simplified: moves the SKU to the new bin
        },
      }
    })

    setActivityLog((prev) => [
      {
        id: Date.now(),
        action: 'STOCK_TRANSFER',
        sku,
        details: `${qty} units moved: ${fromBin} -> ${toBin}`,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ])
  }, [])

  /**
   * Supply Chain: Receive new stock batch
   */
  const receiveStock = useCallback((skuId, vendor, quantity) => {
    const newBatch = {
      id: `BATCH - ${skuId} - ${Date.now()}`,
      sku: skuId,
      vendor,
      quantity,
      allocated: 0,
      receivedAt: new Date().toISOString(),
    }

    setBatches((prev) => [...prev, newBatch])
    setInventoryLevels((prev) => ({
      ...prev,
      [skuId]: {
        ...prev[skuId],
        inStock: (prev[skuId]?.inStock || 0) + quantity,
      },
    }))

    return { success: true, batchId: newBatch.id }
  }, [])

  // ============================================
  // CARRIER & RATE FUNCTIONS
  // ============================================

  /**
   * Get carrier rates for a shipment
   */
  const getCarrierRates = useCallback((shipment) => {
    return getAllRates(shipment)
  }, [])

  /**
   * Get recommended carrier
   */
  const getCarrierRecommendation = useCallback((shipment, priority = 'cost') => {
    return getRecommendation(shipment, priority)
  }, [])

  /**
   * Get valid next statuses for an order
   */
  const getOrderNextStatuses = useCallback(
    (orderId) => {
      const order = orders.find((o) => o.id === orderId)
      return getValidNextStatuses(order?.status)
    },
    [orders]
  )

  /**
   * Multi-Channel: Sync all marketplaces
   */
  const syncAllMarketplaces = useCallback(async () => {
    try {
      setSyncStatus('syncing')
      await marketplaceService.fetchAmazonOrders()
      await marketplaceService.fetchFlipkartOrders()
      await marketplaceService.syncInventoryToMarketplaces(inventoryLevels)
      setSyncStatus('online')
      setLastSyncTime(new Date().toISOString())

      // Notify completion
      notifyBulkImport(0, 'Multi-Channel Sync')

      return { success: true }
    } catch (error) {
      setSyncStatus('error')
      return { success: false, error: error.message }
    }
  }, [inventoryLevels])

  // ============================================
  // REVERSE LOGISTICS
  // ============================================

  /**
   * Initiate a return request
   */
  const initiateReturn = useCallback((orderId, reason, items) => {
    try {
      const returnRequest = reverseLogisticsService.createReturnRequest(orderId, reason, items)
      setReturns((prev) => [returnRequest, ...prev])

      // Link return to order
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, returnId: returnRequest.id, status: 'Return-Requested' } : o
        )
      )

      return { success: true, returnRequest }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }, [])

  /**
   * Update return status (Approve/Reject/Complete)
   */
  const updateReturnStatus = useCallback((returnId, status, note) => {
    setReturns((prev) =>
      prev.map((ret) => {
        if (ret.id === returnId) {
          let updated
          if (status === 'APPROVED') updated = reverseLogisticsService.approveReturn(ret, note)
          else if (status === 'REJECTED') updated = reverseLogisticsService.rejectReturn(ret, note)
          else
            updated = {
              ...ret,
              status,
              logs: [...ret.logs, { status, timestamp: new Date().toISOString(), note }],
            }

          return updated
        }
        return ret
      })
    )
  }, [])

  // ============================================
  // EXPORT FUNCTIONS
  // ============================================

  const exportOrders = useCallback(
    (format = 'csv', filter = {}) => {
      let data = [...orders]

      if (filter.status) {
        data = data.filter((o) => o.status === filter.status)
      }
      if (filter.source) {
        data = data.filter((o) => o.source === filter.source)
      }

      if (format === 'csv') {
        exportOrdersCSV(data, `orders_export_${Date.now()}.csv`)
      } else {
        exportJSON(data, `orders_export_${Date.now()}.json`)
      }

      return { success: true, count: data.length }
    },
    [orders]
  )

  // ============================================
  // ANALYTICS HELPERS
  // ============================================

  const getOrderStats = useCallback(() => {
    const total = orders.length
    const delivered = orders.filter((o) => o.status === 'Delivered').length
    const inTransit = orders.filter((o) =>
      ['In-Transit', 'Out-for-Delivery', 'Picked-Up'].includes(o.status)
    ).length
    const pending = orders.filter((o) =>
      ['Pending', 'MTP-Applied', 'Carrier-Assigned'].includes(o.status)
    ).length
    const rto = orders.filter((o) => o.status.startsWith('RTO')).length

    return {
      total,
      delivered,
      inTransit,
      pending,
      rto,
      deliveryRate: total > 0 ? ((delivered / total) * 100).toFixed(1) : 0,
    }
  }, [orders])

  /**
   * Customer Intelligence: Get LTV and Stats
   */
  const getCustomerMetrics = useCallback(
    (phone) => {
      const cleanPhone = phone?.replace(/\D/g, '').slice(-10)
      const customerOrders = orders.filter(
        (o) =>
          o.phone?.replace(/\D/g, '').slice(-10) === cleanPhone ||
          (o.customerPhone && o.customerPhone.replace(/\D/g, '').slice(-10) === cleanPhone)
      )

      const totalSpend = customerOrders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0)
      const avgOrderValue = customerOrders.length > 0 ? totalSpend / customerOrders.length : 0

      let segment = 'New'
      if (customerOrders.length >= 5) segment = 'VIP'
      else if (customerOrders.length >= 2) segment = 'Regular'

      // At Risk logic: If last order was > 90 days ago
      const lastOrderDate =
        customerOrders.length > 0
          ? new Date(Math.max(...customerOrders.map((o) => new Date(o.createdAt || Date.now()))))
          : null

      if (lastOrderDate && new Date() - lastOrderDate > 90 * 24 * 60 * 60 * 1000) {
        segment = 'At Risk'
      }

      return {
        totalSpend,
        orderCount: customerOrders.length,
        avgOrderValue,
        segment,
        lastOrder: lastOrderDate,
        orders: customerOrders,
      }
    },
    [orders]
  )

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
    updateOrder,
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

    // Warehouse Functions
    smartRouteOrder,
    warehouseLoads,

    // Intelligence & Forecasting
    getDemandForecast: (days, forecastDays) => calculateSMAForecast(orders, days, forecastDays),
    getSKUPrediction: (sku, days) => predictSKUDemand(orders, sku, days),
    getTrend: (days) => getOrderTrend(orders, days),
    getRevenueProjection: (nextDays) => projectRevenue(orders, nextDays),
    getSKUProfitability: (skuId, price) => {
      const sku = skuMaster.find((s) => s.sku === skuId)
      return calculateSKUProfitability(sku, price)
    },
    getMLDemandForecast: (skuId) => mlForecastService.predictDemand(orders, skuId),

    // Warehouse
    inventoryLevels,
    adjustStock,
    transferStock,
    setStockLocation,
    syncAllMarketplaces,

    // Supply Chain
    batches,
    receiveStock,

    // Reverse Logistics
    returns,
    initiateReturn,
    updateReturnStatus,

    // Vision AI Packing
    packingSessions,
    updatePackingStatus,

    // Search
    universalSearch: (query) => searchService.universalSearch({ orders, skuMaster }, query),
    quickLookup: (id) => searchService.quickLookup(orders, id),

    // Activity Log
    activityLog: getActivityLog(),
    logActivity: logActivity,

    // Phase 13: Financial Intelligence
    flaggedOrders,
    resolveFlag: (orderId) => setFlaggedOrders((prev) => prev.filter((o) => o.id !== orderId)),

    // Zoho Sync
    syncSKUMaster,
    syncOrderToZoho,
    lastSyncTime,

    // Legacy compatibility
    setLogistics,
    setSkuMaster,
    getRecommendations: (state, city, weight) => getAllRates({ state, city, weight }),

    // Push Notifications & Offline Support
    pushEnabled,
    enablePushNotifications: initializePushNotifications,
    queueOrderOffline,
    syncOfflineOrders,
  }

  // ============================================
  // PUSH NOTIFICATIONS & OFFLINE SUPPORT
  // ============================================
  /**
   * Initialize push notifications on app load
   */
  const initializePushNotifications = useCallback(async () => {
    try {
      const enabled = await isPushEnabled()
      setPushEnabled(enabled)
      if (enabled) {
        // Process any queued notifications
        await processQueuedNotifications()
        console.log('[Push] Notifications enabled and initialized')
      }
    } catch (err) {
      console.error('[Push] Initialization failed:', err)
    }
  }, [])

  /**
   * Register for push notifications
   */
  const enablePushNotifications = useCallback(async () => {
    try {
      const subscription = await registerPushSubscription()
      if (subscription) {
        setPushEnabled(true)
        return { success: true, subscription }
      }
      return { success: false, error: 'Push registration returned null' }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  /**
   * Add order to offline queue
   */
  const queueOrderOffline = useCallback(
    (order) => {
      setOfflineQueue((prev) => [...prev, { ...order, queuedAt: new Date().toISOString() }])
      cacheData('orders:offline-queue', offlineQueue)
    },
    [offlineQueue]
  )

  /**
   * Sync offline orders when coming online
   */
  const syncOfflineOrders = useCallback(async () => {
    if (offlineQueue.length === 0) return { success: true, synced: 0 }
    try {
      const results = await Promise.all(
        offlineQueue.map((order) => importOrders([order], 'offline-sync'))
      )
      const synced = results.reduce((sum, r) => sum + (r.count || 0), 0)
      setOfflineQueue([])
      await removeCachedData('orders:offline-queue')
      return { success: true, synced }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [offlineQueue, importOrders])

  // Initialize push notifications on mount
  useEffect(() => {
    initializePushNotifications()
  }, [initializePushNotifications])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export default DataContext
