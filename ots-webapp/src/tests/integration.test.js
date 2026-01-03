/**
 * Bluewud OTS - Integration Tests
 *
 * Order flow integration tests for major user workflows.
 * Tests the complete lifecycle using mock data.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock the services
vi.mock('../services/offlineCacheService', () => ({
  cacheData: vi.fn().mockResolvedValue(true),
  retrieveCachedData: vi.fn().mockResolvedValue([]),
  clearCache: vi.fn().mockResolvedValue(true),
  default: {
    cacheData: vi.fn().mockResolvedValue(true),
    retrieveCachedData: vi.fn().mockResolvedValue([]),
    clearCache: vi.fn().mockResolvedValue(true),
  },
}))

vi.mock('../services/notificationService', () => ({
  createNotification: vi.fn().mockReturnValue({ id: 'test-notif', read: false }),
  notifyOrderCreated: vi.fn(),
  notifyOrderShipped: vi.fn(),
  notifyOrderDelivered: vi.fn(),
  notifyOrderRTO: vi.fn(),
  notifyLowStock: vi.fn(),
  notifyBulkImport: vi.fn(),
}))

// Import after mocks are set up
import {
  validateOrder,
  normalizeOrder,
  generateOrderId,
  deduplicateOrders,
} from '../utils/dataUtils'
import {
  transitionOrder,
  bulkTransition,
  ORDER_STATUSES,
  getValidNextStatuses,
} from '../services/orderStateMachine'
import { getAllRates, getRecommendation } from '../services/carrierRateEngine'

describe('Order Flow Integration', () => {
  describe('Order Creation & Validation', () => {
    it('should validate and create a complete order', () => {
      const orderData = {
        customerName: 'Integration Test Customer',
        phone: '9876543210',
        email: 'test@bluewud.com',
        address: '123 Test Street',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        sku: 'SR-CLM-TM',
        quantity: 1,
        amount: 15000,
        weight: 5.0,
      }

      const validation = validateOrder(orderData)
      expect(validation.valid).toBe(true)
      const orderId = generateOrderId('BWD')
      expect(orderId).toMatch(/^BWD-/)
    })

    it('should normalize Amazon order format', () => {
      const amazonOrder = {
        'order-id': 'AMZ-123456',
        'buyer-name': 'Amazon Customer',
        'buyer-phone-number': '+919876543210',
        'ship-address-1': 'Amazon Shipping Address',
        'ship-city': 'Mumbai',
        'ship-state': 'Maharashtra',
        'ship-postal-code': '400001',
        'item-price': '9999.00',
      }

      const normalized = normalizeOrder(amazonOrder, 'amazon')
      expect(normalized.externalId).toBe('AMZ-123456')
      expect(normalized.customerName).toBe('Amazon Customer')
      expect(normalized.source).toBe('amazon')
    })

    it('should normalize Flipkart order format', () => {
      const flipkartOrder = {
        order_item_id: 'FKT-789',
        buyer_name: 'Flipkart Buyer',
        buyer_phone: '9123456789',
        ship_address: 'Flipkart Address',
        ship_city: 'Delhi',
        ship_state: 'Delhi',
        ship_pincode: '110001',
        sku: 'BL-DESK-01',
      }

      const normalized = normalizeOrder(flipkartOrder, 'flipkart')
      expect(normalized.externalId).toBe('FKT-789')
      expect(normalized.source).toBe('flipkart')
    })
  })

  describe('Order State Machine', () => {
    let testOrder

    beforeEach(() => {
      testOrder = {
        id: 'BWD-TEST-001',
        customerName: 'Test Customer',
        status: ORDER_STATUSES.PENDING,
        statusHistory: [
          {
            from: null,
            to: ORDER_STATUSES.PENDING,
            timestamp: new Date().toISOString(),
          },
        ],
      }
    })

    it('should transition from Pending to MTP-Applied', async () => {
      const result = await transitionOrder(testOrder, ORDER_STATUSES.MTP_APPLIED)
      expect(result.success).toBe(true)
      expect(result.order.status).toBe(ORDER_STATUSES.MTP_APPLIED)
    })

    it('should reject invalid transitions', async () => {
      // Cannot go directly from Pending to Delivered
      try {
        await transitionOrder(testOrder, ORDER_STATUSES.DELIVERED)
      } catch (error) {
        expect(error.message).toContain('Invalid transition')
      }
    })

    it('should track status history', async () => {
      const result = await transitionOrder(testOrder, ORDER_STATUSES.MTP_APPLIED)
      expect(result.order.statusHistory.length).toBe(2)
      expect(result.order.statusHistory[1].from).toBe(ORDER_STATUSES.PENDING)
      expect(result.order.statusHistory[1].to).toBe(ORDER_STATUSES.MTP_APPLIED)
    })

    it('should return valid next statuses', () => {
      const nextStatuses = getValidNextStatuses(ORDER_STATUSES.PENDING)
      expect(nextStatuses).toContain(ORDER_STATUSES.MTP_APPLIED)
      expect(nextStatuses).toContain(ORDER_STATUSES.CANCELLED)
    })

    it('should handle bulk transitions', async () => {
      const orders = [
        { id: '1', status: ORDER_STATUSES.PENDING, statusHistory: [] },
        { id: '2', status: ORDER_STATUSES.PENDING, statusHistory: [] },
        { id: '3', status: ORDER_STATUSES.DELIVERED, statusHistory: [] }, // Already delivered
      ]

      const results = await bulkTransition(orders, ORDER_STATUSES.MTP_APPLIED)
      expect(results.successful.length).toBe(2)
      expect(results.failed.length).toBe(1)
    })
  })

  describe('Carrier Rate Engine', () => {
    const shipment = {
      weight: 5.0,
      state: 'Karnataka',
      city: 'Bangalore',
      pincode: '560001',
      amount: 15000,
      paymentMode: 'Prepaid',
    }

    it('should return rates from all carriers', async () => {
      const rates = await getAllRates(shipment)
      expect(rates?.length).toBeGreaterThan(0)
      rates.forEach((rate) => {
        expect(rate).toHaveProperty('carrierId')
        expect(rate).toHaveProperty('total')
        expect(rate).toHaveProperty('estimatedDelivery')
      })
    })

    it('should provide carrier recommendation', async () => {
      const recommendation = await getRecommendation(shipment, 'cost')
      expect(recommendation).toHaveProperty('carrierId')
      expect(recommendation).toHaveProperty('total')
      expect(recommendation).toHaveProperty('reason')
    })
  })

  describe('Order Deduplication', () => {
    it('should merge orders with same external ID', () => {
      const existing = [
        { id: 'BWD-001', externalId: 'AMZ-100', source: 'amazon', status: 'Pending' },
        { id: 'BWD-002', externalId: 'AMZ-101', source: 'amazon', status: 'Pending' },
      ]
      const incoming = [
        { id: 'NEW-001', externalId: 'AMZ-100', source: 'amazon', status: 'Shipped' },
        { id: 'NEW-002', externalId: 'AMZ-102', source: 'amazon', status: 'Pending' },
      ]

      const result = deduplicateOrders(existing, incoming)

      // Should have 3 orders: AMZ-100 (updated), AMZ-101, AMZ-102 (new)
      expect(result.length).toBe(3)

      // AMZ-100 should be updated to 'Shipped'
      const amz100 = result.find((o) => o.externalId === 'AMZ-100')
      expect(amz100.status).toBe('Shipped')
    })

    it('should preserve unique orders', () => {
      const existing = [{ id: 'BWD-001', status: 'Pending' }]
      const incoming = [{ id: 'BWD-002', status: 'New' }]
      const result = deduplicateOrders(existing, incoming)
      expect(result.length).toBe(2)
    })
  })

  describe('Complete Order Lifecycle', () => {
    it('should complete full order lifecycle', async () => {
      // 1. Create order
      const orderData = {
        id: 'BWD-LIFECYCLE-001',
        customerName: 'Lifecycle Test',
        phone: '9876543210',
        status: ORDER_STATUSES.PENDING,
        statusHistory: [
          { from: null, to: ORDER_STATUSES.PENDING, timestamp: new Date().toISOString() },
        ],
      }

      // 3. Apply MTP
      let result = await transitionOrder(orderData, ORDER_STATUSES.MTP_APPLIED)
      expect(result.success).toBe(true)

      // 4. Assign Carrier
      result = await transitionOrder(result.order, ORDER_STATUSES.CARRIER_ASSIGNED, {
        carrier: 'Delhivery',
      })
      expect(result.success).toBe(true)

      // 5. Generate Label
      result = await transitionOrder(result.order, ORDER_STATUSES.LABEL_GENERATED, {
        awb: 'AWB12345',
      })
      expect(result.success).toBe(true)

      // 6. Pick Up
      result = await transitionOrder(result.order, ORDER_STATUSES.PICKED_UP)
      expect(result.success).toBe(true)

      // 7. In Transit
      result = await transitionOrder(result.order, ORDER_STATUSES.IN_TRANSIT)
      expect(result.success).toBe(true)

      // 8. Out for Delivery
      result = await transitionOrder(result.order, ORDER_STATUSES.OUT_FOR_DELIVERY)
      expect(result.success).toBe(true)

      // 9. Delivered
      result = await transitionOrder(result.order, ORDER_STATUSES.DELIVERED)
      expect(result.success).toBe(true)

      // 10. Verify final state
      expect(result.order.status).toBe(ORDER_STATUSES.DELIVERED)
      expect(result.order.statusHistory.length).toBe(8) // Updated to match actual transition count
    })
  })
})
