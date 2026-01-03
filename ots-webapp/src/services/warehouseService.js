import warehouseOptimizer from './warehouseOptimizer'

/**
 * Warehouse Service Adapter
 * Bridges WarehouseManager.jsx requirements with WarehouseOptimizer logic.
 */

export const getWarehouses = () => {
  return warehouseOptimizer.getWarehouses()
}

export const routeOrderToWarehouse = (pincode) => {
  // Use the optimizer's pincode lookup directly for the UI demo
  return warehouseOptimizer.getWarehouseByPincode(pincode)
}

export default {
  getWarehouses,
  routeOrderToWarehouse,
}
