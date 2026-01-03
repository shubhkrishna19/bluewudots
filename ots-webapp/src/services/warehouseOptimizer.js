/**
 * Warehouse Optimizer Service
 * Intelligent multi-warehouse routing and fulfillment optimization.
 */

// Warehouse definitions with capacity and coverage
const WAREHOUSES = {
    'WH-NORTH': {
        id: 'WH-NORTH',
        name: 'North Hub (Delhi NCR)',
        location: { lat: 28.6139, lng: 77.2090 },
        states: ['Delhi', 'Haryana', 'Punjab', 'Uttar Pradesh', 'Uttarakhand', 'Himachal Pradesh', 'Jammu & Kashmir'],
        pincodeRanges: [[110000, 119999], [120000, 139999], [140000, 149999], [200000, 299999]],
        capacity: 5000,
        currentLoad: 0,
        priority: 1
    },
    'WH-WEST': {
        id: 'WH-WEST',
        name: 'West Hub (Mumbai)',
        location: { lat: 19.0760, lng: 72.8777 },
        states: ['Maharashtra', 'Gujarat', 'Goa', 'Madhya Pradesh'],
        pincodeRanges: [[400000, 449999], [360000, 399999], [450000, 499999]],
        capacity: 6000,
        currentLoad: 0,
        priority: 2
    },
    'WH-SOUTH': {
        id: 'WH-SOUTH',
        name: 'South Hub (Bangalore)',
        location: { lat: 12.9716, lng: 77.5946 },
        states: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Telangana'],
        pincodeRanges: [[500000, 539999], [560000, 599999], [600000, 699999]],
        capacity: 5500,
        currentLoad: 0,
        priority: 3
    },
    'WH-EAST': {
        id: 'WH-EAST',
        name: 'East Hub (Kolkata)',
        location: { lat: 22.5726, lng: 88.3639 },
        states: ['West Bengal', 'Bihar', 'Jharkhand', 'Odisha', 'Assam', 'Sikkim'],
        pincodeRanges: [[700000, 749999], [750000, 799999], [800000, 859999]],
        capacity: 4000,
        currentLoad: 0,
        priority: 4
    }
};

class WarehouseOptimizer {
    constructor() {
        this.warehouses = { ...WAREHOUSES };
    }

    /**
     * Get all available warehouses.
     * @returns {Array}
     */
    getWarehouses() {
        return Object.values(this.warehouses);
    }

    /**
     * Find optimal warehouse based on pincode.
     * @param {string} pincode
     * @returns {Object} Selected warehouse
     */
    getWarehouseByPincode(pincode) {
        const pin = parseInt(pincode, 10);

        for (const wh of Object.values(this.warehouses)) {
            for (const [min, max] of wh.pincodeRanges) {
                if (pin >= min && pin <= max) {
                    return wh;
                }
            }
        }

        // Default to lowest priority warehouse if no match
        return this.warehouses['WH-NORTH'];
    }

    /**
     * Find optimal warehouse based on state.
     * @param {string} state
     * @returns {Object} Selected warehouse
     */
    getWarehouseByState(state) {
        for (const wh of Object.values(this.warehouses)) {
            if (wh.states.includes(state)) {
                return wh;
            }
        }
        return this.warehouses['WH-NORTH'];
    }

    /**
     * Smart warehouse selection considering load balancing.
     * @param {Object} order - Order with pincode, state, and weight
     * @returns {Object} { warehouse, reason }
     */
    selectOptimalWarehouse(order) {
        const pincodeMatch = this.getWarehouseByPincode(order.pincode);
        const stateMatch = this.getWarehouseByState(order.state);

        // Check if pincode warehouse has capacity
        if (pincodeMatch.currentLoad < pincodeMatch.capacity * 0.9) {
            return {
                warehouse: pincodeMatch,
                reason: `Closest hub by pincode (${pincodeMatch.name})`
            };
        }

        // Fallback to state match if pincode warehouse is at capacity
        if (stateMatch && stateMatch.currentLoad < stateMatch.capacity * 0.95) {
            return {
                warehouse: stateMatch,
                reason: `Regional hub (${stateMatch.name}) - Primary hub at capacity`
            };
        }

        // Find any warehouse with lowest load
        const available = Object.values(this.warehouses)
            .filter(wh => wh.currentLoad < wh.capacity)
            .sort((a, b) => (a.currentLoad / a.capacity) - (b.currentLoad / b.capacity));

        if (available.length > 0) {
            return {
                warehouse: available[0],
                reason: `Load-balanced assignment to ${available[0].name}`
            };
        }

        // All warehouses full - return primary anyway
        return {
            warehouse: pincodeMatch,
            reason: 'All hubs at capacity - assigned to nearest'
        };
    }

    /**
     * Update warehouse load after order assignment.
     * @param {string} warehouseId
     * @param {number} units
     */
    incrementLoad(warehouseId, units = 1) {
        if (this.warehouses[warehouseId]) {
            this.warehouses[warehouseId].currentLoad += units;
        }
    }

    /**
     * Decrease warehouse load after order fulfillment.
     * @param {string} warehouseId
     * @param {number} units
     */
    decrementLoad(warehouseId, units = 1) {
        if (this.warehouses[warehouseId]) {
            this.warehouses[warehouseId].currentLoad = Math.max(0, this.warehouses[warehouseId].currentLoad - units);
        }
    }

    /**
     * Get warehouse utilization metrics.
     * @returns {Array}
     */
    getUtilizationMetrics() {
        return Object.values(this.warehouses).map(wh => ({
            id: wh.id,
            name: wh.name,
            utilization: Math.round((wh.currentLoad / wh.capacity) * 100),
            available: wh.capacity - wh.currentLoad,
            status: wh.currentLoad < wh.capacity * 0.7 ? 'HEALTHY' :
                wh.currentLoad < wh.capacity * 0.9 ? 'MODERATE' : 'HIGH'
        }));
    }
}

export default new WarehouseOptimizer();
