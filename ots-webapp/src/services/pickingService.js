/**
 * Picking Optimization Service
 * Optimizes warehouse pick paths using Snake Algorithm.
 */

class PickingService {
  /**
   * Generate an optimized pick list for a batch of orders.
   * @param {Array} orders - List of orders to pick
   * @param {Array} inventory - Inventory with bin locations [{sku, bin, qty}]
   */
  generatePickList(orders, inventory) {
    // 1. Aggregate SKUs from all orders
    const pickItems = {}
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        if (!pickItems[item.sku]) {
          pickItems[item.sku] = { sku: item.sku, qty: 0, bins: [] }
        }
        pickItems[item.sku].qty += parseInt(item.quantity) || 1
      })
    })

    // 2. Assign Bin Locations (Mock logic: assume 1 bin per SKU for simplicity)
    // In prod, this would handle detailed bin allocation logic
    const pickList = Object.values(pickItems).map((item) => {
      const stockInfo = inventory.find((i) => i.sku === item.sku)
      return {
        ...item,
        location: stockInfo?.location || 'UNKNOWN',
        zone: stockInfo?.location?.charAt(0) || 'X',
      }
    })

    // 3. Optimize Route
    return this.optimizePickPath(pickList)
  }

  /**
   * optimizePickPath - Sorts locations to minimize travel distance.
   * Implements basic "Snake" path for standard rack layouts.
   * Assumes bins are labeled like Rank-Shelf-Bin (e.g., A-01-01)
   */
  optimizePickPath(items) {
    return items.sort((a, b) => {
      const locA = a.location || 'ZZZ'
      const locB = b.location || 'ZZZ'

      // Parse Rank (A, B, C...)
      const rackA = locA.charAt(0)
      const rackB = locB.charAt(0)

      if (rackA !== rackB) return rackA.localeCompare(rackB)

      // If same rack, check shelf/bin
      // For rack A, C, E (Odd indexes): Ascending
      // For rack B, D, F (Even indexes): Descending (Snake path)
      const isReverseDir = rackA.charCodeAt(0) % 2 === 0

      if (isReverseDir) {
        return locB.localeCompare(locA)
      }
      return locA.localeCompare(locB)
    })
  }
}

export default new PickingService()
