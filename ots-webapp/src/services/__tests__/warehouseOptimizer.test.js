import { describe, it, expect } from 'vitest';
import warehouseOptimizer from '../warehouseOptimizer';

describe('WarehouseOptimizer', () => {
    const mockOrderNorth = { pincode: '110001', state: 'Delhi' };
    const mockOrderSouth = { pincode: '560001', state: 'Karnataka' };

    it('should route to North Hub for Delhi pincode', () => {
        const result = warehouseOptimizer.selectOptimalWarehouse(mockOrderNorth, {});
        expect(result.warehouse.id).toBe('WH-NORTH');
        expect(result.reason).toContain('pincode');
    });

    it('should route to South Hub for Karnataka pincode', () => {
        const result = warehouseOptimizer.selectOptimalWarehouse(mockOrderSouth, {});
        expect(result.warehouse.id).toBe('WH-SOUTH');
        expect(result.reason).toContain('pincode');
    });

    it('should failover to closest hub when primary is full', () => {
        // Mocking WH-NORTH at 95% capacity
        const loads = {
            'WH-NORTH': 4800, // Capacity is 5000, 4800 is 96%
            'WH-WEST': 100,
            'WH-SOUTH': 100,
            'WH-EAST': 100
        };

        const result = warehouseOptimizer.selectOptimalWarehouse(mockOrderNorth, loads);

        // Should NOT be WH-NORTH
        expect(result.warehouse.id).not.toBe('WH-NORTH');
        expect(result.reason).toContain('Failover');
    });

    it('should use global load balancing if all regional hubs are busy', () => {
        const loads = {
            'WH-NORTH': 4900,
            'WH-WEST': 5900,
            'WH-SOUTH': 5400,
            'WH-EAST': 3900 // Over 95% (3800)
        };

        const result = warehouseOptimizer.selectOptimalWarehouse(mockOrderNorth, loads);
        expect(result.warehouse.id).toBe('WH-EAST'); // Still EAST as it's the "least busy" percentage-wise (3900/4000 = 97.5%, others are closer to 100%)
        expect(result.reason).toContain('load balancing');
    });

    it('should calculate utilization metrics correctly', () => {
        const loads = { 'WH-NORTH': 2500 }; // 50%
        const metrics = warehouseOptimizer.getUtilizationMetrics(loads);
        const north = metrics.find(m => m.id === 'WH-NORTH');

        expect(north.utilization).toBe(50);
        expect(north.status).toBe('HEALTHY');
    });
});
