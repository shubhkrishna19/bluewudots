import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import React from 'react'
import { DataProvider, useData } from '../../context/DataContext'
import rtoService from '../rtoService'
import webhookService from '../zohoWebhookService'
import dealerService from '../dealerService'
import activityLogger from '../activityLogger'

// Mock rtoService
vi.mock('../rtoService', () => ({
  default: {
    predictRisk: vi.fn(),
    calculateRtoRisk: vi.fn(() => ({ score: 10, riskLevel: 'LOW', reasons: [] })),
    getRiskMetrics: vi.fn(() => ({ avgRiskScore: 30, rtoRate: '5%' })),
  },
}))

// Mock other services to prevent errors during context init
vi.mock('../dealerService', () => ({
  default: {
    checkCreditLimit: vi.fn(() => ({ allowed: true })),
    calculateWholesalePrice: vi.fn((price) => price),
    determineTier: vi.fn(() => 'SILVER'),
  },
}))

vi.mock('../activityLogger', () => ({
  initializeActivityLog: vi.fn(),
  logOrderCreate: vi.fn(),
  logOrderStatusChange: vi.fn(),
  logActivity: vi.fn(),
  getActivityLog: vi.fn(() => []),
}))

describe('RTO Automation & Webhooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should auto-hold HIGH risk COD orders', async () => {
    // Setup High Risk Mock
    rtoService.predictRisk.mockReturnValue({
      score: 85,
      riskLevel: 'CRITICAL',
      reasons: ['High Risk Pincode'],
    })

    const wrapper = ({ children }) => <DataProvider>{children}</DataProvider>
    const { result } = renderHook(() => useData(), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))

    const highRiskOrder = {
      customerName: 'Risk User',
      phone: '9888888888',
      state: 'Bihar',
      sku: 'SR-CLM-TM',
      weight: 5.0,
      amount: 5000,
      paymentMethod: 'COD',
      pincode: '800001',
      items: [],
    }

    await act(async () => {
      await result.current.addOrder(highRiskOrder)
    })

    await waitFor(() => {
      const createdOrder = result.current.orders.find((o) => o && o.customerName === 'Risk User')
      expect(createdOrder).toBeDefined()
      expect(createdOrder.status).toBe('On-Hold')
    })
  })

  it('should allow LOW risk COD orders to be Pending', async () => {
    // Setup Low Risk Mock
    rtoService.predictRisk.mockReturnValue({
      score: 10,
      riskLevel: 'LOW',
      reasons: [],
    })

    const wrapper = ({ children }) => <DataProvider>{children}</DataProvider>
    const { result } = renderHook(() => useData(), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))

    const lowRiskOrder = {
      customerName: 'Safe User',
      phone: '9777777777',
      state: 'Karnataka',
      sku: 'SR-CLM-TM',
      weight: 5.0,
      amount: 500,
      paymentMethod: 'COD',
      pincode: '400001',
      items: [],
    }

    await act(async () => {
      await result.current.addOrder(lowRiskOrder)
    })

    await waitFor(() => {
      const createdOrder = result.current.orders.find((o) => o && o.customerName === 'Safe User')
      expect(createdOrder).toBeDefined()
      expect(createdOrder.status).toBe('Pending')
    })
  })

  it('should map external RTO webhook events correctly', async () => {
    const listener = vi.fn()
    const unsubscribe = webhookService.subscribe(listener)

    const payload = {
      entity: 'shipment',
      action: 'update',
      details: {
        status: 'undelivered',
        reason: 'Customer cancelled order at doorstep',
      },
    }

    await webhookService.processWebhook(payload)

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'RTO_INITIATED',
        data: expect.objectContaining({
          rtoReason: 'Customer Refused',
        }),
      })
    )

    unsubscribe()
  })
})
