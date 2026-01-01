/**
 * supplyChainService.js
 * Logic for batch-level inventory tracking and vendor management.
 */

const VENDORS = [
    { id: 'VND-001', name: 'Elite Woods', rating: 4.8, category: 'Lumber' },
    { id: 'VND-002', name: 'Precision Fittings', rating: 4.5, category: 'Hardware' },
    { id: 'VND-003', name: 'Eco-Fab Panels', rating: 4.9, category: 'MDF' }
];

/**
 * Allocate stock using FIFO (First-In, First-Out)
 * @param {Array} batches - Current batches for a SKU
 * @param {number} quantity - Quantity needed
 * @returns {Object} { allocatedBatches, remainingQuantity }
 */
export const allocateFIFO = (batches, quantity) => {
    // Sort batches by arrival date (oldest first)
    const sortedBatches = [...batches].sort((a, b) => new Date(a.receivedAt) - new Date(b.receivedAt));

    let needed = quantity;
    const allocated = [];

    for (const batch of sortedBatches) {
        if (needed <= 0) break;

        const available = batch.quantity - (batch.allocated || 0);
        if (available > 0) {
            const take = Math.min(available, needed);
            allocated.push({ batchId: batch.id, quantity: take });
            needed -= take;
        }
    }

    return {
        allocatedBatches: allocated,
        remainingQuantity: needed,
        success: needed === 0
    };
};

/**
 * Get all active vendors
 */
export const getVendors = () => VENDORS;

/**
 * Predict shortages based on inventory levels, forecast demand and lead times
 * @param {Array} inventory - Consolidated inventory list
 * @param {Array} orders - Historical orders for forecasting
 * @returns {Array} List of shortage alerts
 */
export const getShortagePredictions = (inventory, orders) => {
    const alerts = [];

    inventory.forEach(item => {
        // Calculate 30-day demand forecast
        const skuOrders = orders.filter(o => o.sku === item.sku);
        const totalQty = skuOrders.reduce((sum, o) => sum + (parseInt(o.quantity) || 1), 0);
        const monthlyDemand = Math.ceil((totalQty / 30) * 30 * 1.2); // 20% buffer

        const currentStock = item.inStock || 0;
        const available = item.inStock - (item.reserved || 0);

        if (available < monthlyDemand) {
            alerts.push({
                sku: item.sku,
                name: item.name,
                currentStock: available,
                monthlyDemand,
                deficit: monthlyDemand - available,
                urgency: available <= (monthlyDemand * 0.2) ? 'CRITICAL' : 'WARNING',
                reorderQty: Math.max(monthlyDemand * 2, item.reorderLevel || 50)
            });
        }
    });

    return alerts.sort((a, b) => (a.urgency === 'CRITICAL' ? -1 : 1));
};

export default {
    allocateFIFO,
    getVendors,
    getShortagePredictions
};
