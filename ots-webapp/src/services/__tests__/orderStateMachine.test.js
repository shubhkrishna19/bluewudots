import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  ORDER_STATUSES,
  isValidTransition,
  getValidNextStatuses,
  transitionOrder,
  bulkTransition,
  calculateOrderMetrics,
} from '../orderStateMachine'
import * as zohoBridge from '../zohoBridgeService'

// Mock Zoho Bridge
vi.mock('../zohoBridgeService', () => ({
  pushOrderToZoho: vi.fn(() => Promise.resolve({ success: true, zohoId: 'Z123' })),
}))

describe('Order State Machine', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Validation Logic', () => {
    it('should allow valid transitions', () => {
      expect(isValidTransition(ORDER_STATUSES.PENDING, ORDER_STATUSES.QA_PASSED)).toBe(true)
      expect(isValidTransition(ORDER_STATUSES.IN_TRANSIT, ORDER_STATUSES.DELIVERED)).toBe(false) // Must go through OFD
    })

    it('should return correct next statuses', () => {
      const next = getValidNextStatuses(ORDER_STATUSES.PICKED_UP)
      expect(next).toContain(ORDER_STATUSES.IN_TRANSIT)
      expect(next).toContain(ORDER_STATUSES.RTO_INITIATED)
    })
  })

  describe('transitionOrder', () => {
    it('should update status and record history', async () => {
      const order = { id: 1, status: ORDER_STATUSES.PENDING, statusHistory: [] }
      const result = await transitionOrder(order, ORDER_STATUSES.QA_PASSED, { user: 'tester' })

      expect(result.success).toBe(true)
      expect(result.order.status).toBe(ORDER_STATUSES.QA_PASSED)
      expect(result.order.statusHistory).toHaveLength(1)
      expect(result.order.statusHistory[0].from).toBe(ORDER_STATUSES.PENDING)
    })

    it('should throw error for invalid transitions', async () => {
      const order = { id: 1, status: ORDER_STATUSES.DELIVERED }
      await expect(transitionOrder(order, ORDER_STATUSES.PENDING)).rejects.toThrow(
        /Invalid transition/
      )
    })

    it('should handle carrier assignment metadata', async () => {
      const order = { id: 1, status: ORDER_STATUSES.PENDING }
      const result = await transitionOrder(order, ORDER_STATUSES.CARRIER_ASSIGNED, {
        carrier: 'Delhivery',
      })
      expect(result.order.carrier).toBe('Delhivery')
    })
  })

  describe('bulkTransition', () => {
    it('should process multiple orders successfully (Async Fix)', async () => {
      const orders = [
        { id: 1, status: ORDER_STATUSES.PENDING },
        { id: 2, status: ORDER_STATUSES.PENDING },
      ]

      const results = await bulkTransition(orders, ORDER_STATUSES.QA_PASSED)
      expect(results.successful).toHaveLength(2)
      expect(results.totalAttempted).toBe(2)
    })

    it('should track failures correctly', async () => {
      const orders = [
        { id: 1, status: ORDER_STATUSES.PENDING },
        { id: 2, status: ORDER_STATUSES.DELIVERED }, // Invalid
      ]

      const results = await bulkTransition(orders, ORDER_STATUSES.QA_PASSED)
      expect(results.successful).toHaveLength(1)
      expect(results.failed).toHaveLength(1)
    })
  })

  describe('Metrics Calculation', () => {
    it('should calculate processing time correctly', () => {
      const order = {
        statusHistory: [
          { to: ORDER_STATUSES.PENDING, timestamp: '2026-01-01T10:00:00Z' },
          { to: ORDER_STATUSES.PICKED_UP, timestamp: '2026-01-01T14:00:00Z' },
        ],
      }
      const metrics = calculateOrderMetrics(order)
      expect(metrics.processingTime).toBe(4) // 4 hours
    })
  })
})
