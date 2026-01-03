import { describe, it, expect } from 'vitest'
import { rtoService } from '../rtoService'

describe('RTOService', () => {
  describe('predictRisk', () => {
    it('should assign high risk for COD payments in high-risk zones', () => {
      const order = {
        paymentMethod: 'COD',
        pincode: '800001', // Patna (High Risk)
        amount: 5000,
        customerType: 'NEW',
      }
      const result = rtoService.predictRisk(order)

      // COD (40) + High Risk Zone (30) + New Customer (15) = 85 -> clamped to 100? No, 85.
      // Wait, logic:
      // 1. Payment: COD -> +40
      // 2. Location: 800001 -> risk 0.65 > 0.5 -> +30
      // 3. Amount: 5000 -> < 15000 -> +0
      // 4. Customer: NEW -> +15
      // Total: 85

      expect(result.score).toBeGreaterThanOrEqual(85)
      expect(result.riskLevel).toBe('CRITICAL')
      expect(result.reasons).toContain('COD Payment Factor')
      expect(result.reasons).toContain('High-risk zone: Patna')
    })

    it('should assign low risk for Prepaid orders in safe zones', () => {
      const order = {
        paymentMethod: 'prepaid',
        pincode: '560001', // Bangalore (Low Risk)
        amount: 2000,
        customerType: 'RETURNING',
      }
      const result = rtoService.predictRisk(order)

      // 1. Payment: prepaid -> 0
      // 2. Location: 560001 -> risk 0.10 < 0.2 -> -10
      // 3. Amount: 2000 -> +0
      // 4. Customer: RETURNING -> -20
      // Total: -30 -> clamped to 0

      expect(result.score).toBe(0)
      expect(result.riskLevel).toBe('LOW')
    })

    it('should flag high value critical orders', () => {
      const order = {
        paymentMethod: 'COD',
        pincode: '110001', // Delhi (Low Risk)
        amount: 60000, // Critical > 50k
        customerType: 'EXISTING',
      }
      const result = rtoService.predictRisk(order)

      // 1. COD -> +40
      // 2. Location: Delhi -> 0.15 < 0.2 -> -10
      // 3. Amount: > 50k -> +25
      // 4. Customer: Existing (undefined handling in simplified check, assumes 0 if not NEW/RETURNING) -> let's check code
      // Code checks NEW (+15) or RETURNING (-20). Else 0.

      // Total: 40 - 10 + 25 = 55

      expect(result.score).toBe(55)
      expect(result.riskLevel).toBe('HIGH')
      expect(result.reasons).toContain('Critical Order Value (>50k)')
    })

    it('should penalize duplicate candidates', () => {
      const order = {
        paymentMethod: 'prepaid',
        pincode: '110001',
        amount: 5000,
        isDuplicateCandidate: true,
      }
      const result = rtoService.predictRisk(order)

      // 1. Prepaid -> 0
      // 2. Delhi -> -10
      // 3. Amount -> 0
      // 4. Duplicate -> +50
      // Total: 40

      expect(result.score).toBe(40)
      expect(result.reasons).toContain('Potential Duplicate Order')
    })
  })

  describe('calculatePotentialLoss', () => {
    it('should calculate correct loss for standard order', () => {
      const order = { amount: 10000 }
      const loss = rtoService.calculatePotentialLoss(order, 50)

      // Shipping: max(200, 10000 * 0.02 = 200) = 200
      // Reverse: 200 * 1.5 = 300
      // Handling: 50
      // Opp Cost: 10000 * 0.015 = 150
      // Total: 200 + 300 + 50 + 150 = 700

      expect(loss).toBe(700)
    })
  })

  describe('requiresVerification', () => {
    it('should return true for scores >= 55', () => {
      const highRiskOrder = {
        paymentMethod: 'COD',
        pincode: '800001', // Patna (+30 location)
        amount: 5000,
        customerType: 'NEW',
      }
      // COD(40) + Loc(30) + New(15) = 85
      expect(rtoService.requiresVerification(highRiskOrder)).toBe(true)
    })

    it('should return false for low scores', () => {
      const lowRiskOrder = {
        paymentMethod: 'prepaid',
        pincode: '560001',
      }
      // Prepaid(0) + Blr(-10) = 0
      expect(rtoService.requiresVerification(lowRiskOrder)).toBe(false)
    })
  })
})
