/**
 * Inventory Optimizer Service
 * Suggests stock transfers between warehouses to balance inventory and prevent stock-outs.
 */

class InventoryOptimizer {
    constructor() {
        this.TRANSFER_COST_PER_UNIT_KM = 0.5; // Cost heuristic
    }

    /**
     * Suggest warehouse transfers to balance stock.
     * @param {Object} demandByRegion - Predicted demand { 'pincode': quantity }
     * @param {Array} warehouses - List of warehouse objects with current stock { id, location, stock, capacity }
     * @returns {Array} List of suggested transfers
     */
    suggestTransfers(sku, demandByRegion, warehouses) {
        const transfers = [];
        const deficits = [];
        const surpluses = [];

        // 1. Identify Deficits and Surpluses
        warehouses.forEach(wh => {
            const localDemand = this._calculateLocalDemand(wh.pincode, demandByRegion);
            const coverDays = wh.stock / (localDemand || 1); // Avoid division by zero

            if (coverDays < 5) {
                deficits.push({ ...wh, shortfall: (5 - coverDays) * localDemand });
            } else if (coverDays > 30) {
                surpluses.push({ ...wh, excess: (coverDays - 30) * localDemand });
            }
        });

        // 2. Match Surpluses to Deficits (Greedy Approach)
        deficits.sort((a, b) => b.shortfall - a.shortfall); // Handle biggest deficit first

        deficits.forEach(target => {
            let needed = target.shortfall;

            // Find closest surplus warehouse
            surpluses.sort((a, b) => this._distance(target, a) - this._distance(target, b));

            for (const source of surpluses) {
                if (needed <= 0) break;
                if (source.excess <= 0) continue;

                const transferQty = Math.min(needed, source.excess);
                const distance = this._distance(target, source);

                // Only suggest if "worth it" (e.g., specific logic could go here)
                if (transferQty > 10) {
                    transfers.push({
                        sku,
                        from: source.id,
                        to: target.id,
                        quantity: Math.floor(transferQty),
                        reason: `Rebalance: ${target.name} low stock`,
                        priority: target.stock === 0 ? 'CRITICAL' : 'MEDIUM',
                        estimatedCost: (distance * this.TRANSFER_COST_PER_UNIT_KM * transferQty).toFixed(2)
                    });

                    source.excess -= transferQty;
                    needed -= transferQty;
                }
            }
        });

        return transfers;
    }

    _calculateLocalDemand(whPincode, demandMap) {
        // Mock logic: aggregate demand near warehouse pincode
        // In prod, this would use a proper geo-query
        const regionPrefix = whPincode.substring(0, 2);
        return Object.entries(demandMap)
            .filter(([pin, qty]) => pin.startsWith(regionPrefix))
            .reduce((sum, [_, qty]) => sum + qty, 0) || 5; // Default velocity
    }

    _distance(wh1, wh2) {
        // Mock distance calculation (Manhattan distance on coords if available, or random mock)
        if (wh1.lat && wh2.lat) {
            return Math.sqrt(Math.pow(wh1.lat - wh2.lat, 2) + Math.pow(wh1.lng - wh2.lng, 2)) * 111; // Rough km
        }
        return 500; // Default mock distance (km)
    }
}

export default new InventoryOptimizer();
