import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
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

    const highRiskOrder = {
      customer: 'Risk User',
      amount: 5000,
      paymentMethod: 'COD',
      pincode: '800001',
      items: [],
    }

    await act(async () => {
      await result.current.addOrder(highRiskOrder)
    })

    const createdOrder = result.current.orders.find((o) => o.customer === 'Risk User')
    expect(createdOrder).toBeDefined()
    expect(createdOrder.status).toBe('On-Hold')
    expect(createdOrder.holdReason).toContain('High RTO Risk')
    expect(createdOrder.rtoRiskScore).toBe(85)
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

    const lowRiskOrder = {
      customer: 'Safe User',
      amount: 500,
      paymentMethod: 'COD',
      pincode: '400001',
      items: [],
    }

    await act(async () => {
      await result.current.addOrder(lowRiskOrder)
    })

    const createdOrder = result.current.orders.find((o) => o.customer === 'Safe User')
    expect(createdOrder).toBeDefined()
    expect(createdOrder.status).toBe('Pending')
  })

  it('should map external RTO webhook events correctly', () => {
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

    webhookService.processWebhook(payload)

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
