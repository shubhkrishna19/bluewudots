import { describe, it, expect } from 'vitest'
import reverseLogisticsService from '../reverseLogisticsService'

describe('Reverse Logistics Service', () => {
  it('should create a return request with valid status', () => {
    const request = reverseLogisticsService.createReturnRequest('ORD-123', 'Damaged', [
      { sku: 'SKU-1', qty: 1 },
    ])

    expect(request.id).toBeDefined()
    expect(request.status).toBe('REQUESTED')
    expect(request.orderId).toBe('ORD-123')
    expect(request.items).toHaveLength(1)
  })

  it('should throw error if order ID is missing', () => {
    expect(() => reverseLogisticsService.createReturnRequest(null, 'Reason')).toThrow(
      'Order ID is required'
    )
  })

  it('should approve a return request', () => {
    const request = {
      id: 'RET-001',
      status: 'REQUESTED',
      logs: [],
    }

    const approved = reverseLogisticsService.approveReturn(request, 'Looks good')
    expect(approved.status).toBe('APPROVED')
    expect(approved.logs).toHaveLength(1)
    expect(approved.logs[0].status).toBe('APPROVED')
    expect(approved.logs[0].note).toBe('Looks good')
  })

  it('should reject a return request', () => {
    const request = {
      id: 'RET-001',
      status: 'REQUESTED',
      logs: [],
    }

    const rejected = reverseLogisticsService.rejectReturn(request, 'Policy violation')
    expect(rejected.status).toBe('REJECTED')
    expect(rejected.logs[0].note).toBe('Policy violation')
  })

  it('should calculate refund amount', () => {
    const originalOrder = { amount: 5000 }
    const refund = reverseLogisticsService.calculateRefundAmount(originalOrder, [])
    expect(refund).toBe(5000)
  })
})
