import { WAREHOUSES } from '../data/warehouseData';

/**
 * Warehouse Optimizer Service
 * Intelligent multi-warehouse routing and fulfillment optimization.
 */

class WarehouseOptimizer {
    constructor() {
        this.warehouses = { ...WAREHOUSES };
        // currentLoad will be injected/synced from DataContext in production
    }

    /**
     * Get all available warehouses.
     */
    getWarehouses() {
        return Object.values(this.warehouses);
    }

    /**
     * Calculate distance between two coordinates (Simplified Haversine)
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /**
     * Find optimal warehouse based on pincode.
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
        return null;
    }

    /**
     * Find optimal warehouse based on state.
     */
    getWarehouseByState(state) {
        for (const wh of Object.values(this.warehouses)) {
            if (wh.states.includes(state)) {
                return wh;
            }
        }
        return null;
    }

    /**
     * Smart warehouse selection considering load balancing and proximity.
     */
    selectOptimalWarehouse(order, currentLoads = {}) {
        const pincodeMatch = this.getWarehouseByPincode(order.pincode);
        const stateMatch = this.getWarehouseByState(order.state);

        // Primary Target
        let primaryWh = pincodeMatch || stateMatch || this.warehouses['WH-NORTH'];
        const load = currentLoads[primaryWh.id] || 0;

        // 1. Check if Primary Hub has capacity
        if (load < primaryWh.capacity * 0.9) {
            return {
                warehouse: primaryWh,
                reason: pincodeMatch ? `Closest hub by pincode (${primaryWh.name})` : `Regional hub (${primaryWh.name})`
            };
        }

        // 2. Failover: Find closest warehouse with capacity
        const available = Object.values(this.warehouses)
            .filter(wh => (currentLoads[wh.id] || 0) < wh.capacity * 0.95)
            .map(wh => ({
                ...wh,
                distance: order.location ?
                    this.calculateDistance(order.location.lat, order.location.lng, wh.location.lat, wh.location.lng) :
                    9999 // Fallback if order has no lat/lng
            }))
            .sort((a, b) => a.distance - b.distance);

        if (available.length > 0) {
            const bestAlternative = available[0];
            return {
                warehouse: bestAlternative,
                reason: `Failover to ${bestAlternative.name} (Primary hub at capacity)`
            };
        }

        // 3. Last Resort: Global load balancing
        const leastBusy = Object.values(this.warehouses)
            .sort((a, b) => {
                const loadA = (currentLoads[a.id] || 0) / a.capacity;
                const loadB = (currentLoads[b.id] || 0) / b.capacity;
                return loadA - loadB;
            })[0];

        return {
            warehouse: leastBusy,
            reason: 'Critical load balancing - assigned to least busy hub'
        };
    }

    /**
     * Get warehouse utilization metrics.
     */
    getUtilizationMetrics(currentLoads = {}) {
        return Object.values(this.warehouses).map(wh => {
            const load = currentLoads[wh.id] || 0;
            return {
                id: wh.id,
                name: wh.name,
                utilization: Math.round((load / wh.capacity) * 100),
                available: wh.capacity - load,
                status: (load / wh.capacity) < 0.7 ? 'HEALTHY' :
                    (load / wh.capacity) < 0.9 ? 'MODERATE' : 'HIGH',
                color: wh.color
            };
        });
    }
}

export default new WarehouseOptimizer();
