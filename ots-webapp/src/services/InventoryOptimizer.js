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
}

export default new InventoryOptimizer()
