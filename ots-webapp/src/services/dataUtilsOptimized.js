/**
 * DataUtilsOptimized.js
 * Optimized data processing utilities for order management
 * Includes deduplication, merging, validation, and transformation functions
 */

class DataUtilsOptimized {
  /**
   * Deduplicate orders by removing duplicate entries
   * Keeps the most recent version of each order
   */
  static deduplicateOrders(orders) {
    const seen = new Map()
    return orders
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .filter((order) => {
        const key = `${order.orderId}-${order.source}`
        if (seen.has(key)) return false
        seen.set(key, true)
        return true
      })
  }

  /**
   * Merge orders from multiple sources intelligently
   * Resolves conflicts by prioritizing recent updates
   */
  static mergeOrders(localOrders, remoteOrders) {
    const merged = new Map()

    // Add all local orders
    localOrders.forEach((order) => {
      const key = order.orderId
      merged.set(key, { ...order, source: 'local' })
    })

    // Merge with remote orders
    remoteOrders.forEach((remoteOrder) => {
      const key = remoteOrder.orderId
      const localOrder = merged.get(key)

      if (!localOrder) {
        merged.set(key, { ...remoteOrder, source: 'remote' })
      } else {
        // Keep the more recently updated version
        const localTime = new Date(localOrder.updatedAt).getTime()
        const remoteTime = new Date(remoteOrder.updatedAt).getTime()
        if (remoteTime > localTime) {
          merged.set(key, remoteOrder)
        }
      }
    })

    return Array.from(merged.values())
  }

  /**
   * Validate order data structure
   */
  static validateOrder(order) {
    const required = ['orderId', 'customerName', 'orderDate', 'amount', 'status', 'source']
    const missing = required.filter((field) => !order[field])

    if (missing.length > 0) {
      return {
        valid: false,
        errors: [`Missing required fields: ${missing.join(', ')}`],
      }
    }

    const errors = []

    if (typeof order.amount !== 'number' || order.amount < 0) {
      errors.push('Amount must be a positive number')
    }

    if (isNaN(new Date(order.orderDate).getTime())) {
      errors.push('Invalid order date format')
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']
    if (!validStatuses.includes(order.status)) {
      errors.push(`Invalid status. Must be one of: ${validStatuses.join(', ')}`)
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * Filter orders by multiple criteria
   */
  static filterOrders(orders, criteria = {}) {
    return orders.filter((order) => {
      if (criteria.status && order.status !== criteria.status) return false
      if (criteria.source && order.source !== criteria.source) return false
      if (criteria.minAmount && order.amount < criteria.minAmount) return false
      if (criteria.maxAmount && order.amount > criteria.maxAmount) return false
      if (criteria.startDate && new Date(order.orderDate) < new Date(criteria.startDate))
        return false
      if (criteria.endDate && new Date(order.orderDate) > new Date(criteria.endDate)) return false
      if (criteria.searchTerm) {
        const term = criteria.searchTerm.toLowerCase()
        if (
          !(
            order.orderId.toLowerCase().includes(term) ||
            order.customerName.toLowerCase().includes(term) ||
            (order.email && order.email.toLowerCase().includes(term))
          )
        )
          return false
      }
      return true
    })
  }

  /**
   * Group orders by a specific field
   */
  static groupOrders(orders, groupBy) {
    const grouped = {}
    orders.forEach((order) => {
      const key = order[groupBy] || 'undefined'
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(order)
    })
    return grouped
  }

  /**
   * Sort orders by field and direction
   */
  static sortOrders(orders, sortBy = 'orderDate', direction = 'desc') {
    const sorted = [...orders]
    sorted.sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]

      // Handle date fields
      if (sortBy.includes('Date') && typeof aVal === 'string') {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      }

      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
    return sorted
  }

  /**
   * Calculate summary statistics for orders
   */
  static calculateStats(orders) {
    if (orders.length === 0) {
      return {
        totalOrders: 0,
        totalAmount: 0,
        averageAmount: 0,
        statusBreakdown: {},
      }
    }

    const totalAmount = orders.reduce((sum, order) => sum + (order.amount || 0), 0)
    const statusBreakdown = {}

    orders.forEach((order) => {
      statusBreakdown[order.status] = (statusBreakdown[order.status] || 0) + 1
    })

    return {
      totalOrders: orders.length,
      totalAmount: Math.round(totalAmount * 100) / 100,
      averageAmount: Math.round((totalAmount / orders.length) * 100) / 100,
      statusBreakdown,
      bySource: this.groupOrders(orders, 'source'),
    }
  }

  /**
   * Transform order fields to standard format
   */
  static normalizeOrder(order) {
    return {
      orderId: String(order.orderId || order.id || '').trim(),
      customerName: String(order.customerName || order.name || '').trim(),
      email: String(order.email || '')
        .toLowerCase()
        .trim(),
      phone: String(order.phone || '').replace(/\D/g, ''),
      amount: parseFloat(order.amount) || 0,
      orderDate: new Date(order.orderDate).toISOString(),
      updatedAt: new Date(order.updatedAt || Date.now()).toISOString(),
      status: (order.status || 'pending').toLowerCase(),
      source: String(order.source || 'unknown').toLowerCase(),
      items: Array.isArray(order.items) ? order.items : [],
      shippingAddress: order.shippingAddress || {},
      notes: String(order.notes || '').trim(),
    }
  }

  /**
   * Batch normalize multiple orders
   */
  static normalizeOrders(orders) {
    return orders.map((order) => this.normalizeOrder(order))
  }

  /**
   * Export orders to CSV format
   */
  static ordersToCSV(orders) {
    if (orders.length === 0) return 'No data'

    const headers = [
      'Order ID',
      'Customer Name',
      'Email',
      'Amount',
      'Order Date',
      'Status',
      'Source',
    ]
    const rows = orders.map((order) => [
      order.orderId,
      order.customerName,
      order.email || '',
      order.amount,
      new Date(order.orderDate).toLocaleDateString(),
      order.status,
      order.source,
    ])

    return [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join(
      '\n'
    )
  }

  /**
   * Hash order for change detection
   */
  static hashOrder(order) {
    const str = JSON.stringify({
      id: order.orderId,
      customer: order.customerName,
      amount: order.amount,
      status: order.status,
      updated: order.updatedAt,
    })

    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16)
  }
}

export default DataUtilsOptimized
