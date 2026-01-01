/**
 * warehouseService.js
 * Logic for multi-node fulfillment and inventory management.
 */

const WAREHOUSES = [
    { id: 'WH-DEL-01', name: 'Delhi Main Hub', city: 'Delhi', region: 'North', pincodes: ['110', '122', '201'] },
    { id: 'WH-BLR-01', name: 'Bangalore Tech Park', city: 'Bangalore', region: 'South', pincodes: ['560', '570'] },
    { id: 'WH-MUM-01', name: 'Mumbai Port Hub', city: 'Mumbai', region: 'West', pincodes: ['400', '410'] },
    { id: 'WH-KOL-01', name: 'Kolkata East Depot', city: 'Kolkata', region: 'East', pincodes: ['700', '711'] }
];

/**
 * Find the best warehouse for an order based on pincode.
 * @param {string} pincode - Order destination pincode
 * @returns {Object} Selected warehouse
 */
export const routeOrderToWarehouse = (pincode) => {
    const prefix = pincode.substring(0, 3);

    // Simple routing based on pincode prefix
    const assigned = WAREHOUSES.find(wh => wh.pincodes.some(p => pincode.startsWith(p)));

    // Fallback to Delhi Hub
    return assigned || WAREHOUSES[0];
};

/**
 * Get all available warehouses
 */
export const getWarehouses = () => WAREHOUSES;

export default {
    routeOrderToWarehouse,
    getWarehouses
};
