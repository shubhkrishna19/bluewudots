/**
 * Deduplication Utilities
 * Optimized for processing large batches of orders (10k+)
 *
 * Features:
 * - Streaming deduplication
 * - Multiple deduplication strategies
 * - Performance metrics
 * - Memory-efficient processing
 */

/**
 * Deduplicates orders using a Set-based approach
 * Optimized for large datasets
 * @param {array} orders - Array of order objects
 * @param {string} key - Field to deduplicate by (default: 'id')
 * @returns {array} Deduplicated orders
 */
export const deduplicateOrders = (orders, key = 'id') => {
  const seen = new Set()
  const deduplicated = []

  for (const order of orders) {
    const identifier = order[key]
    if (!seen.has(identifier)) {
      seen.add(identifier)
      deduplicated.push(order)
    }
  }

  return deduplicated
}

/**
 * Streaming deduplication for memory efficiency
 * Processes orders in chunks
 * @param {array} orders - Array of order objects
 * @param {number} chunkSize - Chunk size (default: 1000)
 * @param {string} key - Field to deduplicate by
 * @returns {Generator} Generator yielding deduplicated batches
 */
export function* streamDeduplicateOrders(orders, chunkSize = 1000, key = 'id') {
  const seen = new Set()
  let chunk = []

  for (const order of orders) {
    const identifier = order[key]

    if (!seen.has(identifier)) {
      seen.add(identifier)
      chunk.push(order)

      if (chunk.length >= chunkSize) {
        yield chunk
        chunk = []
      }
    }
  }

  if (chunk.length > 0) {
    yield chunk
  }
}

/**
 * Advanced deduplication with multiple field matching
 * @param {array} orders - Array of order objects
 * @param {array} keys - Fields to match for deduplication
 * @returns {array} Deduplicated orders
 */
export const deduplicateByMultipleFields = (orders, keys = ['id', 'email']) => {
  const seen = new Map()
  const deduplicated = []

  for (const order of orders) {
    const composite = keys.map((k) => order[k]).join('|')

    if (!seen.has(composite)) {
      seen.set(composite, order)
      deduplicated.push(order)
    }
  }

  return deduplicated
}

/**
 * Deduplication with similarity detection
 * Finds similar orders based on customer email/phone
 * @param {array} orders - Array of order objects
 * @param {number} timeWindowMs - Time window for considering duplicates
 * @returns {array} Deduplicated orders with merge info
 */
export const deduplicateWithMerge = (orders, timeWindowMs = 3600000) => {
  // 1 hour default
  const grouped = new Map()
  const timestamp = Date.now()

  for (const order of orders) {
    // Use email as primary key for grouping
    const primaryKey = order.customer?.email || order.email

    if (!primaryKey) continue

    if (!grouped.has(primaryKey)) {
      grouped.set(primaryKey, [])
    }

    const group = grouped.get(primaryKey)
    const orderTime = new Date(order.createdAt).getTime()

    // Check if within time window
    if (timestamp - orderTime <= timeWindowMs) {
      group.push(order)
    }
  }

  // Merge duplicate orders
  const result = []
  for (const [email, orderGroup] of grouped.entries()) {
    if (orderGroup.length === 0) continue

    // Keep the most recent order
    const merged = orderGroup.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]

    // Merge quantities if applicable
    if (orderGroup.length > 1) {
      merged.isDuplicate = true
      merged.duplicateCount = orderGroup.length
      merged.totalQuantity = orderGroup.reduce((sum, o) => sum + (o.quantity || 1), 0)
    }

    result.push(merged)
  }

  return result
}

/**
 * Performance metrics for deduplication
 * @param {array} original - Original orders array
 * @param {array} deduplicated - Deduplicated orders array
 * @returns {object} Performance metrics
 */
export const getDeduplicationMetrics = (original, deduplicated) => {
  const startTime = performance.now()

  const metrics = {
    originalCount: original.length,
    deduplicatedCount: deduplicated.length,
    duplicatesRemoved: original.length - deduplicated.length,
    reductionPercentage: (
      ((original.length - deduplicated.length) / original.length) *
      100
    ).toFixed(2),
    processingTimeMs: (performance.now() - startTime).toFixed(2),
  }

  return metrics
}

/**
 * Batch deduplication with progress callback
 * @param {array} orders - Array of order objects
 * @param {function} onProgress - Progress callback
 * @param {string} key - Field to deduplicate by
 * @returns {Promise<array>} Deduplicated orders
 */
export const batchDeduplicateOrders = async (orders, onProgress = null, key = 'id') => {
  const batchSize = 1000
  const seen = new Set()
  const deduplicated = []
  const totalBatches = Math.ceil(orders.length / batchSize)

  for (let i = 0; i < orders.length; i += batchSize) {
    const batch = orders.slice(i, i + batchSize)

    for (const order of batch) {
      const identifier = order[key]
      if (!seen.has(identifier)) {
        seen.add(identifier)
        deduplicated.push(order)
      }
    }

    // Call progress callback
    if (onProgress) {
      const currentBatch = Math.floor(i / batchSize) + 1
      onProgress({
        currentBatch,
        totalBatches,
        percentage: ((currentBatch / totalBatches) * 100).toFixed(1),
        itemsProcessed: i + batch.length,
        itemsDeduped: deduplicated.length,
      })
    }

    // Yield to event loop every batch
    await new Promise((resolve) => setTimeout(resolve, 0))
  }

  return deduplicated
}

/**
 * Deduplicates and indexes orders for fast lookup
 * @param {array} orders - Array of order objects
 * @param {array} indexKeys - Fields to create indexes for
 * @returns {object} Deduplicated orders and indexes
 */
export const deduplicateWithIndexes = (orders, indexKeys = ['id', 'email', 'phone']) => {
  const seen = new Set()
  const deduplicated = []
  const indexes = {}

  // Initialize indexes
  indexKeys.forEach((key) => {
    indexes[key] = new Map()
  })

  for (const order of orders) {
    if (!seen.has(order.id)) {
      seen.add(order.id)
      deduplicated.push(order)

      // Add to indexes
      indexKeys.forEach((key) => {
        const value = order[key] || order.customer?.[key]
        if (value) {
          if (!indexes[key].has(value)) {
            indexes[key].set(value, [])
          }
          indexes[key].get(value).push(order)
        }
      })
    }
  }

  return {
    orders: deduplicated,
    indexes,
    findByEmail: (email) => indexes.email?.get(email) || [],
    findByPhone: (phone) => indexes.phone?.get(phone) || [],
    findById: (id) => indexes.id?.get(id)?.[0],
  }
}

/**
 * WebWorker-ready deduplication for heavy lifting
 * @param {array} orders - Array of order objects
 * @param {string} key - Field to deduplicate by
 * @returns {object} Deduplication result
 */
export const deduplicateWorkerFunction = (orders, key = 'id') => {
  const seen = new Set()
  const deduplicated = []
  const duplicates = []

  for (const order of orders) {
    const identifier = order[key]
    if (seen.has(identifier)) {
      duplicates.push(order)
    } else {
      seen.add(identifier)
      deduplicated.push(order)
    }
  }

  return {
    success: true,
    deduplicated,
    duplicates,
    stats: {
      original: orders.length,
      unique: deduplicated.length,
      duplicateCount: duplicates.length,
      reductionPercentage: ((duplicates.length / orders.length) * 100).toFixed(2),
    },
  }
}

// Export all functions
export default {
  deduplicateOrders,
  streamDeduplicateOrders,
  deduplicateByMultipleFields,
  deduplicateWithMerge,
  getDeduplicationMetrics,
  batchDeduplicateOrders,
  deduplicateWithIndexes,
  deduplicateWorkerFunction,
}
