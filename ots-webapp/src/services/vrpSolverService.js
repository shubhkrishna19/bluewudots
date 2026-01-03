/**
 * VRP Solver Service
 * Provides advanced algorithms for solving Traveling Salesperson (TSP)
 * and Vehicle Routing Problems (VRP).
 */

class VRPSolverService {
  /**
   * Solve Traveling Salesperson Problem (TSP)
   * Uses Nearest Neighbor followed by 2-Opt refinement.
   * @param {Array} points - Array of {id, x, y}
   * @returns {Array} Optimized order of points
   */
  solveTSP(points) {
    if (!points || points.length <= 2) return points

    // 1. Initial Solution: Nearest Neighbor
    let path = this.getNearestNeighborPath(points)

    // 2. Refinement: 2-Opt
    path = this.apply2Opt(path)

    return path
  }

  /**
   * Nearest Neighbor Heuristic
   */
  getNearestNeighborPath(points) {
    const remaining = [...points]
    const path = [remaining.shift()] // Start with the first point

    while (remaining.length > 0) {
      const lastPoint = path[path.length - 1]
      let nearestIdx = 0
      let minDist = Infinity

      for (let i = 0; i < remaining.length; i++) {
        const d = this.getDistance(lastPoint, remaining[i])
        if (d < minDist) {
          minDist = d
          nearestIdx = i
        }
      }

      path.push(remaining.splice(nearestIdx, 1)[0])
    }

    return path
  }

  /**
   * 2-Opt Refinement Algorithm
   * Swaps edges to eliminate crossings and reduce total distance.
   */
  apply2Opt(path) {
    let improved = true
    let bestPath = [...path]
    let bestDist = this.getTotalDistance(bestPath)

    while (improved) {
      improved = false
      for (let i = 1; i < bestPath.length - 1; i++) {
        for (let j = i + 1; j < bestPath.length; j++) {
          const newPath = this.twoOptSwap(bestPath, i, j)
          const newDist = this.getTotalDistance(newPath)

          if (newDist < bestDist) {
            bestDist = newDist
            bestPath = newPath
            improved = true
          }
        }
      }
    }
    return bestPath
  }

  /**
   * 2-Opt Swap helper
   */
  twoOptSwap(path, i, j) {
    const newPath = path.slice(0, i)
    const middle = path.slice(i, j + 1).reverse()
    const end = path.slice(j + 1)
    return [...newPath, ...middle, ...end]
  }

  /**
   * Solve VRP (Multi-picker / Multi-vehicle)
   * Splits a set of points among K vehicles.
   */
  solveVRP(points, k = 1) {
    if (k <= 1) return [this.solveTSP(points)]

    // Simple clustering based on coordinates (Quadrant/K-Means lite)
    const clusters = Array.from({ length: k }, () => [])

    // Distribute points based on simple logic (could be improved with K-Means)
    points.forEach((p, idx) => {
      clusters[idx % k].push(p)
    })

    return clusters.map((cluster) => this.solveTSP(cluster))
  }

  /**
   * Distance between two points
   */
  getDistance(p1, p2) {
    const x = (p1.x || 0) - (p2.x || 0)
    const y = (p1.y || 0) - (p2.y || 0)
    return Math.sqrt(x * x + y * y)
  }

  /**
   * Total path distance
   */
  getTotalDistance(path) {
    let dist = 0
    for (let i = 0; i < path.length - 1; i++) {
      dist += this.getDistance(path[i], path[i + 1])
    }
    return dist
  }
}

export const vrpSolverService = new VRPSolverService()
export default vrpSolverService
