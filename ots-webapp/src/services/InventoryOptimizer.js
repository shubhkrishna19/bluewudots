/**
 * Inventory Optimizer
 * Bridges ML Forecasts with Inventory Management to automate reordering.
 */
import mlForecastService from './mlForecastService'

class InventoryOptimizer {
  /**
   * Analyze all SKUs and generate reorder alerts
   * @param {Array} orders - Order history
   * @param {Object} inventoryMap - { "SKU-A": { inStock: 10, leadTime: 7, ... } }
   * @returns {Array} List of alerts
   */
  async generateReorderAlerts(orders, inventoryMap) {
    const alerts = []
    const skus = Object.keys(inventoryMap)

    // Batch processing could be added here for performance if SKU count > 1000
    for (const sku of skus) {
      const item = inventoryMap[sku]
      if (!item) continue

      const stockOutPrediction = mlForecastService.predictStockOutDate(orders, sku, item.inStock)

      // Logic: If days until stockout < vendor lead time (plus buffer 2 days)
      const leadTime = item.leadTime || 7 // Default 7 days
      const buffer = 2
      const threshold = leadTime + buffer

      if (stockOutPrediction.days <= threshold && stockOutPrediction.days >= 0) {
        const forecast = mlForecastService.predictDemand(orders, sku)
        const rrq = mlForecastService.calculateRRQ(forecast, leadTime)

        alerts.push({
          sku,
          currentStock: item.inStock,
          daysRemaining: stockOutPrediction.days,
          stockOutDate: stockOutPrediction.date,
          leadTime,
          recommendedReorder: rrq,
          urgency: stockOutPrediction.days < leadTime ? 'CRITICAL' : 'HIGH',
        })
      }
    }

    return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining)
  }

  /**
   * Calculate optimal reorder quantity for a single SKU
   */
  calculateOptimalReorderQuantity(orders, sku, leadTime = 7) {
    const forecast = mlForecastService.predictDemand(orders, sku)
    return mlForecastService.calculateRRQ(forecast, leadTime)
  }

  /**
   * Suggest stock transfers between warehouses to balance inventory based on demand.
   * @param {string} sku - SKU ID
   * @param {Object} demandMap - { warehouseId: predictedDemand }
   * @param {Array} warehouses - List of warehouse objects with current stock
   * @returns {Array} List of suggested transfers
   */
  suggestTransfers(sku, demandMap, warehouses = []) {
    const suggestions = []
    if (!warehouses || warehouses.length === 0) return []

    // 1. Identify Surpluses and Deficits
    const status = warehouses.map(wh => {
      const stock = wh.inventory?.[sku] || 0
      const demand = demandMap[wh.id] || 0
      const balance = stock - demand
      return { id: wh.id, name: wh.name, balance, stock }
    })

    const deficits = status.filter(s => s.balance < 0).sort((a, b) => a.balance - b.balance)
    const surpluses = status.filter(s => s.balance > 0).sort((a, b) => b.balance - a.balance)

    // 2. Pair Deficits with Surpluses
    deficits.forEach(def => {
      let needed = Math.abs(def.balance)
      for (const sur of surpluses) {
        if (needed <= 0) break
        if (sur.balance <= 0) continue

        const transferQty = Math.min(needed, sur.balance)
        suggestions.push({
          from: sur.name,
          to: def.name,
          quantity: transferQty,
          sku,
          reason: `High predicted demand in ${def.name}`
        })

        sur.balance -= transferQty
        needed -= transferQty
      }
    })

    return suggestions
  }
}

export default new InventoryOptimizer()
