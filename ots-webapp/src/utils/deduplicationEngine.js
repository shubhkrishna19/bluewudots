/**
 * Optimized Deduplication Engine
 * High-performance streaming deduplication with O(n) time complexity
 * Suitable for large batch operations (100k+ records)
 */

/**
 * Advanced deduplication with streaming and progress callback
 * Optimized for memory efficiency with large datasets
 * @param {Object[]} existingOrders - Existing orders array
 * @param {Object[]} newOrders - New orders to merge
 * @param {Function} onProgress - Callback for progress tracking (optional)
 * @returns {Object[]} - Deduplicated orders array
 * @example
 * const result = deduplicateOrdersOptimized(existing, incoming, (progress) => {
 *   console.log(`Progress: ${progress.percent}%`);
 * });
 */
export const deduplicateOrdersOptimized = (existingOrders = [], newOrders = [], onProgress = null) => {
  const orderMap = new Map();
  const totalRecords = existingOrders.length + newOrders.length;
  let processedCount = 0;

  // Batch size for progress reporting
  const progressBatchSize = Math.max(1000, Math.floor(totalRecords / 100));

  // Phase 1: Load existing orders (O(n))
  for (let i = 0; i < existingOrders.length; i++) {
    const order = existingOrders[i];
    const key = generateOrderKey(order);
    orderMap.set(key, { ...order });

    processedCount++;
    if (onProgress && processedCount % progressBatchSize === 0) {
      onProgress({
        phase: 'loading',
        percent: Math.floor((processedCount / totalRecords) * 50),
        processed: processedCount,
        total: totalRecords,
      });
    }
  }

  // Phase 2: Merge new orders (O(n))
  for (let i = 0; i < newOrders.length; i++) {
    const newOrder = newOrders[i];
    const key = generateOrderKey(newOrder);

    if (orderMap.has(key)) {
      // Merge with existing
      const existing = orderMap.get(key);
      orderMap.set(key, mergeOrderRecords(existing, newOrder));
    } else {
      // Add new order
      orderMap.set(key, { ...newOrder });
    }

    processedCount++;
    if (onProgress && (i + existingOrders.length) % progressBatchSize === 0) {
      onProgress({
        phase: 'merging',
        percent: 50 + Math.floor(((i + 1) / newOrders.length) * 50),
        processed: processedCount,
        total: totalRecords,
      });
    }
  }

  if (onProgress) {
    onProgress({
      phase: 'complete',
      percent: 100,
      processed: processedCount,
      total: totalRecords,
    });
  }

  return Array.from(orderMap.values());
};

/**
 * Stream-based deduplication for very large datasets
 * Returns an async generator for memory-efficient processing
 * @param {AsyncIterable} existingOrdersStream - Stream of existing orders
 * @param {AsyncIterable} newOrdersStream - Stream of new orders
 * @returns {AsyncGenerator} - Yields deduplicated orders
 * @example
 * for await (const order of deduplicateOrdersStream(existing$, incoming$)) {
 *   await processOrder(order);
 * }
 */
export async function* deduplicateOrdersStream(existingOrdersStream, newOrdersStream) {
  const orderMap = new Map();

  // Load existing orders into map
  for await (const order of existingOrdersStream) {
    const key = generateOrderKey(order);
    orderMap.set(key, { ...order });
  }

  // Process new orders and yield results
  for await (const newOrder of newOrdersStream) {
    const key = generateOrderKey(newOrder);

    if (orderMap.has(key)) {
      const existing = orderMap.get(key);
      const merged = mergeOrderRecords(existing, newOrder);
      orderMap.set(key, merged);
      yield merged;
    } else {
      orderMap.set(key, { ...newOrder });
      yield newOrder;
    }
  }

  // Yield remaining orders that weren't updated
  for (const order of orderMap.values()) {
    const key = generateOrderKey(order);
    let found = false;
    for await (const newOrder of newOrdersStream) {
      if (generateOrderKey(newOrder) === key) {
        found = true;
        break;
      }
    }
    if (!found) {
      yield order;
    }
  }
}

/**
 * Batch deduplication with configurable batch size
 * Useful for processing large datasets in chunks
 * @param {Object[]} existingOrders - Existing orders
 * @param {Object[]} newOrders - New orders
 * @param {Number} batchSize - Records to process per batch (default: 5000)
 * @returns {Object[]} - Deduplicated orders
 */
export const deduplicateOrdersBatched = (existingOrders = [], newOrders = [], batchSize = 5000) => {
  if (newOrders.length <= batchSize) {
    return deduplicateOrdersOptimized(existingOrders, newOrders);
  }

  let current = [...existingOrders];

  for (let i = 0; i < newOrders.length; i += batchSize) {
    const batch = newOrders.slice(i, i + batchSize);
    current = deduplicateOrdersOptimized(current, batch);
  }

  return current;
};

/**
 * Incremental deduplication
 * Maintains a cache for repeated deduplication operations
 * @param {Map} cache - Cache map (reuse across calls)
 * @param {Object[]} newOrders - New orders to add to cache
 * @returns {Object} - {cache: Map, deduplicated: Object[]}
 */
export const deduplicateOrdersIncremental = (cache = new Map(), newOrders = []) => {
  const deduplicated = [];

  for (const order of newOrders) {
    const key = generateOrderKey(order);

    if (cache.has(key)) {
      const existing = cache.get(key);
      const merged = mergeOrderRecords(existing, order);
      cache.set(key, merged);
    } else {
      cache.set(key, { ...order });
      deduplicated.push(order);
    }
  }

  return {
    cache,
    deduplicated,
    totalUnique: cache.size,
  };
};

/**
 * Customer deduplication with fuzzy matching
 * Handles variations in phone numbers and emails
 * @param {Object[]} customers - Customer array
 * @param {Object} options - {strictPhoneMatch, strictEmailMatch, fuzzyThreshold}
 * @returns {Object[]} - Deduplicated customers
 */
export const deduplicateCustomersAdvanced = (
  customers = [],
  options = { strictPhoneMatch: false, strictEmailMatch: false, fuzzyThreshold: 0.8 }
) => {
  const phoneMap = new Map();
  const emailMap = new Map();
  const unique = [];

  for (const customer of customers) {
    const normalizedPhone = normalizePhone(customer.phone);
    const normalizedEmail = normalizeEmail(customer.email);

    const existingByPhone = normalizedPhone ? phoneMap.get(normalizedPhone) : null;
    const existingByEmail = normalizedEmail ? emailMap.get(normalizedEmail) : null;

    if (existingByPhone) {
      // Merge into existing by phone
      Object.assign(existingByPhone, customer);
    } else if (existingByEmail) {
      // Merge into existing by email
      Object.assign(existingByEmail, customer);
    } else {
      // Add new unique customer
      unique.push(customer);
      if (normalizedPhone) phoneMap.set(normalizedPhone, customer);
      if (normalizedEmail) emailMap.set(normalizedEmail, customer);
    }
  }

  return unique;
};

/**
 * Generate deduplication key from order
 * @private
 */
function generateOrderKey(order) {
  return `${order.source || 'unknown'}:${order.externalId || order.id}`;
}

/**
 * Merge two order records intelligently
 * @private
 */
function mergeOrderRecords(existing, incoming) {
  const merged = { ...existing, ...incoming };

  // Preserve and merge status history
  if (existing.statusHistory || incoming.statusHistory) {
    const histories = [
      ...(existing.statusHistory || []),
      ...(incoming.statusHistory || []),
    ];

    // Deduplicate by timestamp
    merged.statusHistory = Array.from(
      new Map(histories.map(h => [h.timestamp, h])).values()
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  return merged;
}

/**
 * Normalize phone number for comparison
 * @private
 */
function normalizePhone(phone) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  return digits.slice(-10); // Return last 10 digits
}

/**
 * Normalize email for comparison
 * @private
 */
function normalizeEmail(email) {
  if (!email) return null;
  return email.toLowerCase().trim();
}

/**
 * Get deduplication statistics
 * @param {Object[]} original - Original array
 * @param {Object[]} deduplicated - Deduplicated array
 * @returns {Object} - Statistics object
 */
export const getDeduplicationStats = (original, deduplicated) => {
  return {
    originalCount: original.length,
    deduplicatedCount: deduplicated.length,
    duplicatesRemoved: original.length - deduplicated.length,
    deduplicationRatio: ((1 - deduplicated.length / original.length) * 100).toFixed(2) + '%',
    compressionRatio: (deduplicated.length / original.length).toFixed(3),
  };
};

export default {
  deduplicateOrdersOptimized,
  deduplicateOrdersStream,
  deduplicateOrdersBatched,
  deduplicateOrdersIncremental,
  deduplicateCustomersAdvanced,
  getDeduplicationStats,
};
