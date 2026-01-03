import vrpSolverService from './vrpSolverService'

class PickingRouteService {
    /**
     * Calculate an optimized route for a list of bin locations
     * @param {Array} bins - Array of objects containing { location, zone, x, y }
     * @param {string} strategy - 'SNAKE' | 'Z_SHAPE' | 'OPTIMAL'
     * @returns {Array} Sorted bins in picking order
     */
    calculateRoute(bins, strategy = 'SNAKE') {
        if (!bins || bins.length === 0) return []

        switch (strategy) {
            case 'OPTIMAL':
                return this.calculateNearestNeighbor(bins)
            case 'Z_SHAPE':
                return this.calculateZShape(bins)
            case 'SNAKE':
            default:
                return this.calculateSnakePath(bins)
        }
    }

    /**
     * Snake Path (S-Shape): Back and forth through aisles
     * Assumes location format like 'A-1-01' (Aisle-Rack-Shelf)
     */
    calculateSnakePath(bins) {
        return [...bins].sort((a, b) => {
            const locA = this.parseLocation(a.location)
            const locB = this.parseLocation(b.location)

            // Sort by Aisle first
            if (locA.aisle !== locB.aisle) {
                return locA.aisle.localeCompare(locB.aisle)
            }

            // In even aisles, go in reverse shelf order (Snake behavior)
            const aisleNum = locA.aisle.charCodeAt(0) - 65
            if (aisleNum % 2 !== 0) {
                return locB.shelf - locA.shelf
            }

            // In odd aisles, go in normal shelf order
            return locA.shelf - locB.shelf
        })
    }

    /**
     * Nearest Neighbor: Simple TSP heuristic
     */
    calculateNearestNeighbor(bins) {
        const result = []
        let remaining = [...bins]
        let currentPos = { x: 0, y: 0 } // Starting from packing station

        while (remaining.length > 0) {
            let nearestIdx = 0
            let minDist = Infinity

            remaining.forEach((bin, idx) => {
                const bPos = { x: bin.x || 0, y: bin.y || 0 }
                const dist = this.getDistance(currentPos, bPos)
                if (dist < minDist) {
                    minDist = dist
                    nearestIdx = idx
                }
            })

            const nextBin = remaining.splice(nearestIdx, 1)[0]
            result.push(nextBin)
            currentPos = { x: nextBin.x || 0, y: nextBin.y || 0 }
        }

        return result
    }

    /**
     * Z-Shape: One-way traversal
     */
    calculateZShape(bins) {
        return [...bins].sort((a, b) => {
            const locA = this.parseLocation(a.location)
            const locB = this.parseLocation(b.location)

            if (locA.aisle !== locB.aisle) {
                return locA.aisle.localeCompare(locB.aisle)
            }
            return locA.shelf - locB.shelf
        })
    }

    /**
     * Helper to parse location strings like 'A-1-01'
     */
    parseLocation(locStr) {
        if (!locStr || typeof locStr !== 'string') return { aisle: 'Z', rack: 0, shelf: 0 }
        const parts = locStr.split('-')
        return {
            aisle: parts[0] || 'A',
            rack: parseInt(parts[1]) || 0,
            shelf: parseInt(parts[2]) || 0,
        }
    }

    /**
     * Simple Euclidean Distance
     */
    getDistance(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
    }
}

export const pickingRouteService = new PickingRouteService()
export default pickingRouteService
