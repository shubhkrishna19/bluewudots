import { describe, it, expect } from 'vitest'
import reverseLogisticsService from '../reverseLogisticsService'

describe('ReverseLogisticsService', () => {
  it('should create RMA for delivered orders within window', () => {
    const order = {
      id: 'ORD-123',
      status: 'Delivered',
      deliveryDate: new Date().toISOString(),
      amount: 1000,
    }
    const rma = reverseLogisticsService.initiateRMA(order, { type: 'Defect' })
    expect(rma.success).toBe(true)
    expect(rma.status).toBe('RMA_INITIATED')
    expect(rma.rmaId).toBeDefined()
  })

  it('should reject RMA for non-delivered orders', () => {
    const order = {
      id: 'ORD-456',
      status: 'In-Transit',
    }
    const rma = reverseLogisticsService.initiateRMA(order, { type: 'Defect' })
    expect(rma.success).toBe(false)
    expect(rma.message).toContain('Only delivered orders')
  })

  it('should reject RMA if return window expired', () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 10) // 10 days ago

    const order = {
      id: 'ORD-789',
      status: 'Delivered',
      deliveryDate: pastDate.toISOString(),
    }
    const rma = reverseLogisticsService.initiateRMA(order, { type: 'Defect' })
    expect(rma.success).toBe(false)
    expect(rma.message).toContain('window has expired')
  })

  it('should validate status transitions', () => {
    const status = reverseLogisticsService.updateRMAStatus('RMA-001', 'Approved')
    expect(status.status).toBe('Approved')

    expect(() => {
      reverseLogisticsService.updateRMAStatus('RMA-001', 'INVALID_STATUS')
    }).toThrow()
  })
})
