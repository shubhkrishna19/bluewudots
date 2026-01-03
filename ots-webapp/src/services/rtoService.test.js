import { describe, it, expect } from 'vitest'
import { calculateRtoRisk, RTORiskLevels } from '../services/rtoService'

describe('rtoService', () => {
  it('should score COD orders higher', () => {
    const order = {
      paymentMethod: 'COD',
      totalAmount: 500,
      shippingAddress: { state: 'Maharashtra' },
    }
    const risk = calculateRtoRisk(order)
    expect(risk.score).toBeGreaterThanOrEqual(40)
  })

  it('should score High Value COD orders as medium/high risk', () => {
    const order = {
      paymentMethod: 'COD',
      totalAmount: 16000,
      shippingAddress: { state: 'Maharashtra' },
    }
    const risk = calculateRtoRisk(order)
    expect(risk.score).toBeGreaterThanOrEqual(60) // 40 (COD) + 20 (High Val)
    expect(risk.level).not.toBe(RTORiskLevels.LOW)
  })

  it('should score Prepaid orders as low risk', () => {
    const order = {
      paymentMethod: 'Prepaid',
      totalAmount: 5000,
      shippingAddress: { state: 'Karnataka' },
    }
    const risk = calculateRtoRisk(order)
    expect(risk.score).toBeLessThan(30)
    expect(risk.level).toBe(RTORiskLevels.LOW)
  })

  it('should flag high risk states', () => {
    const order = {
      paymentMethod: 'Prepaid',
      totalAmount: 500,
      shippingAddress: { state: 'Bihar' },
    }
    const risk = calculateRtoRisk(order)
    expect(risk.reasons).toContain('High-risk State: Bihar') // Note: Updated expectation based on service logic
  })
})
