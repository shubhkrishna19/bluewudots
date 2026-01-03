import { describe, it, expect } from 'vitest';
import { pickingRouteService } from '../pickingRouteService';

describe('PickingRouteService', () => {
    const mockBins = [
        { id: 1, location: 'A-1-01', x: 10, y: 10 },
        { id: 2, location: 'A-1-20', x: 10, y: 50 },
        { id: 3, location: 'B-1-05', x: 20, y: 15 },
        { id: 4, location: 'B-1-15', x: 20, y: 40 }
    ];

    it('should calculate a Snake Path correctly (even aisles reversed)', () => {
        const route = pickingRouteService.calculateRoute(mockBins, 'SNAKE');

        // Aisle A (Odd index in 0-based char code if A=0) -> Normal
        // Wait, charCode A=65. 65-65=0 (Even Index). 
        // 0 is Even -> Normal Shelf Order.
        // 1 is Odd (B) -> Reverse Shelf Order.

        expect(route[0].location).toBe('A-1-01');
        expect(route[1].location).toBe('A-1-20');

        // Aisle B (Index 1 - Odd) -> Shelf Order Reversed
        expect(route[2].location).toBe('B-1-15');
        expect(route[3].location).toBe('B-1-05');
    });

    it('should calculate an Optimal Route using Nearest Neighbor', () => {
        const route = pickingRouteService.calculateRoute(mockBins, 'OPTIMAL');

        // Should start with nearest to 0,0
        expect(route[0].id).toBe(1); // closest to 0,0 (10,10)
        expect(route[1].id).toBe(3); // next closest (20,15)
        expect(route[2].id).toBe(4); // (20,40)
        expect(route[3].id).toBe(2); // (10,50)
    });

    it('should fallback to Snake if strategy is unknown', () => {
        const route = pickingRouteService.calculateRoute(mockBins, 'UNKNOWN');
        expect(route[0].location).toBe('A-1-01');
    });
});
