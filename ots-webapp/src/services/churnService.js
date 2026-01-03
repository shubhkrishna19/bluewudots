/**
 * Churn Service (Retention AI)
 * Simulates AI-driven customer retention scoring and identification.
 */

class ChurnService {
  /**
   * Calculate churn risk score for a customer based on activity.
   * @param {Object} customer - Customer data
   * @param {Array} orders - Customer's order history
   * @returns {Object} { score, riskLevel, daysSinceLastOrder }
   */
  calculateChurnRisk(customer, orders = []) {
    const customerOrders = orders.filter((o) => o.customerPhone === customer.phone)
    const today = new Date()

    if (customerOrders.length === 0) {
      return { score: 95, riskLevel: 'CRITICAL', daysSinceLastOrder: Infinity }
    }

    // Find most recent order date
    const lastOrderDate = customerOrders.reduce((latest, order) => {
      const orderDate = new Date(order.createdAt)
      return orderDate > latest ? orderDate : latest
    }, new Date(0))

    const daysSinceLastOrder = Math.floor((today - lastOrderDate) / (1000 * 60 * 60 * 24))

    let score
    let riskLevel

    if (daysSinceLastOrder <= 30) {
      score = 10
      riskLevel = 'HEALTHY'
    } else if (daysSinceLastOrder <= 60) {
      score = 40
      riskLevel = 'LOW'
    } else if (daysSinceLastOrder <= 90) {
      score = 65
      riskLevel = 'MEDIUM'
    } else if (daysSinceLastOrder <= 180) {
      score = 85
      riskLevel = 'HIGH'
    } else {
      score = 95
      riskLevel = 'CRITICAL'
    }

    return { score, riskLevel, daysSinceLastOrder }
  }

  /**
   * Get all "At Risk" customers for outreach.
   * @param {Array} customers
   * @param {Array} orders
   * @returns {Array} Customers with HIGH or CRITICAL churn risk
   */
  getAtRiskCustomers(customers, orders) {
    return customers
      .map((customer) => ({
        ...customer,
        churn: this.calculateChurnRisk(customer, orders),
      }))
      .filter((c) => c.churn.riskLevel === 'HIGH' || c.churn.riskLevel === 'CRITICAL')
      .sort((a, b) => b.churn.score - a.churn.score)
  }

  /**
   * Generate personalized outreach message.
   * @param {Object} customer
   * @returns {string} WhatsApp-ready message
   */
  generateOutreachMessage(customer) {
    const templates = {
      HIGH: `Hi ${customer.name || 'Valued Customer'}! 👋 We miss you at Bluewud. It's been a while since your last order. Here's an exclusive 10% discount just for you! Use code: COMEBACK10 🛋️`,
      CRITICAL: `Hi ${customer.name || 'Valued Customer'}! 🔔 We noticed you haven't ordered in a long time. As a special gesture, here's 15% off your next order! Code: VIP15. We'd love to have you back. 💼`,
    }
    return templates[customer.churn?.riskLevel] || templates.HIGH
  }
}

export default new ChurnService()
