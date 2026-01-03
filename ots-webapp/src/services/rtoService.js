/**
 * RTO Risk Prediction Service
 * Analyzes order patterns to predict Return-To-Origin (RTO) probability
 */

export const RTORiskLevels = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
}

const HIGH_RISK_PINCODES = ['800001', '800002']
const SAFE_PINCODES = ['560001', '110001']
const HIGH_RISK_STATES = ['Bihar', 'Uttar Pradesh', 'Jharkhand']

class RTOService {
  predictRisk(order, history = []) {
    let score = 0
    const reasons = []

    // 1. Payment Method
    if (order.paymentMethod === 'COD' || order.paymentMode === 'COD') {
      score += 40
      reasons.push('COD Payment Factor')
    }

    // 2. Location Analysis
    if (HIGH_RISK_PINCODES.includes(order.pincode)) {
      score += 30
      reasons.push('High-risk zone: Patna')
    } else if (SAFE_PINCODES.includes(order.pincode)) {
      score -= 10 // Safe zone deduction
    } else if (order.state && HIGH_RISK_STATES.includes(order.state)) {
      score += 25
      reasons.push(`High-risk State: ${order.state}`)
    } else if (order.shippingAddress?.state && HIGH_RISK_STATES.includes(order.shippingAddress.state)) {
      score += 25
      reasons.push(`High-risk State: ${order.shippingAddress.state}`)
    }

    // 3. Customer History
    if (order.customerType === 'NEW') {
      score += 15
      reasons.push('New Customer')
    } else if (order.customerType === 'RETURNING') {
      score -= 20
    }

    const customerReturns = history.filter((h) => h.status === 'RTO').length
    if (customerReturns > 0) {
      score += 20
      reasons.push(`${customerReturns} Previous RTOs`)
    }

    // 4. Order Value
    if (order.amount > 50000) {
      score += 25
      reasons.push('Critical Order Value (>50k)')
    } else if (order.amount > 15000 || order.totalAmount > 15000) {
      score += 20
      reasons.push('High Ticket Value (>10k)')
    }

    // 5. Short Address / Keywords
    if (order.address && typeof order.address === 'string') {
      if (order.address.length > 0 && order.address.length < 10) {
        score += 15
        reasons.push('Incomplete or short address')
      }
      if (order.address.toLowerCase().includes('test') || order.address.toLowerCase().includes('fake')) {
        score += 40
        reasons.push('Suspicious address keywords')
      }
    }

    // 6. Duplicate Detection
    if (order.isDuplicateCandidate) {
      score += 50
      reasons.push('Potential Duplicate Order')
    }

    // Final clamping
    score = Math.max(0, Math.min(score, 100))

    return {
      score,
      riskLevel: this.getRiskLevel(score),
      reasons,
    }
  }

  getRiskLevel(score) {
    if (score >= 80) return RTORiskLevels.CRITICAL
    if (score >= 55) return RTORiskLevels.HIGH
    if (score >= 30) return RTORiskLevels.MEDIUM
    return RTORiskLevels.LOW
  }

  calculatePotentialLoss(order, riskScore) {
    const amount = order.amount || 10000
    const shipping = Math.max(200, amount * 0.02)
    const reverse = shipping * 1.5
    const handling = 50
    const oppCost = amount * 0.015
    return Math.round(shipping + reverse + handling + oppCost)
  }

  requiresVerification(order) {
    const risk = this.predictRisk(order)
    return risk.score >= 55
  }

  getRiskMetrics(orders) {
    const total = (orders || []).length
    if (total === 0) return { avgRiskScore: 0, rtoRate: '0%' }

    const risks = orders.map((o) => this.predictRisk(o))
    const highRiskCount = risks.filter((r) => r.score >= 55).length
    const avgScore = risks.reduce((sum, r) => sum + r.score, 0) / total

    return {
      avgRiskScore: Math.round(avgScore),
      rtoRate: ((highRiskCount / total) * 100).toFixed(1) + '%',
      highRiskCount,
    }
  }
}

const rtoServiceInstance = new RTOService()

export const calculateRtoRisk = (order, history = []) => {
  const analysis = rtoServiceInstance.predictRisk(order, history)
  return {
    ...analysis,
    isHighRisk: analysis.score >= 55,
    recommendation: analysis.score >= 70 ? 'HOLD' : analysis.score >= 40 ? 'VERIFY' : 'PROCEED',
    level: analysis.riskLevel
  }
}

export const analyzeRiskFactors = (order) => {
  return {
    isHighValue: (order.amount || order.totalAmount || 0) > 10000,
    isCOD: order.paymentMode === 'COD' || order.paymentMethod === 'COD',
    isBulk: (order.quantity || 1) > 5,
    hasSuspiciousAddress: order.address && order.address.length < 10,
  }
}

export const predictRisk = (o, h) => rtoServiceInstance.predictRisk(o, h)
export const calculatePotentialLoss = (o, s) => rtoServiceInstance.calculatePotentialLoss(o, s)
export const requiresVerification = (o) => rtoServiceInstance.requiresVerification(o)
export const getRiskMetrics = (o) => rtoServiceInstance.getRiskMetrics(o)

export default {
  predictRisk,
  calculatePotentialLoss,
  requiresVerification,
  calculateRtoRisk,
  getRiskMetrics,
  analyzeRiskFactors,
  RTORiskLevels,
}
