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

export default {
    allocateFIFO,
    getVendors
};
