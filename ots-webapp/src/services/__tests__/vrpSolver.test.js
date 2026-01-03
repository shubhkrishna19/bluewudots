import { describe, it, expect } from 'vitest'
import vrpSolverService from '../vrpSolverService'

describe('vrpSolverService (TSP & VRP)', () => {
    const points = [
        { id: 'Start', x: 0, y: 0 },
        { id: 'Point A', x: 10, y: 10 },
        { id: 'Point B', x: 2, y: 2 }, // Very close to Start
        { id: 'Point C', x: 11, y: 11 }, // Very close to Point A
    ]

    it('should calculate distance correctly', () => {
        const p1 = { x: 0, y: 0 }
        const p2 = { x: 3, y: 4 }
        expect(vrpSolverService.getDistance(p1, p2)).toBe(5)
    })

    it('should solve TSP with 2-Opt refinement reducing distance', () => {
        // A very un-optimized path: Start -> A -> B -> C
        // distance: dist(0,0->10,10) + dist(10,10->2,2) + dist(2,2->11,11)
        // optimized should be: Start -> B -> A -> C or similar

        const result = vrpSolverService.solveTSP(points)
        const totalDist = vrpSolverService.getTotalDistance(result)

        expect(result.length).toBe(4)
        expect(totalDist).toBeLessThan(vrpSolverService.getTotalDistance(points))
    })

    it('should solve VRP for multiple vehicles', () => {
        const k = 2
        const result = vrpSolverService.solveVRP(points, k)

        expect(result.length).toBe(k)
        expect(result[0].length + result[1].length).toBe(points.length)
    })
})
