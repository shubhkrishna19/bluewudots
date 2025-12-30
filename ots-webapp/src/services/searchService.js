/**
 * Search Service - Unified search across orders, customers, and SKUs
 * Supports fuzzy matching, filters, and recent searches
 */

// Search history storage
const SEARCH_HISTORY_KEY = 'bluewud_search_history';
const MAX_HISTORY = 10;

/**
 * Get search history from localStorage
 */
export const getSearchHistory = () => {
    try {
        return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]');
    } catch {
        return [];
    }
};

/**
 * Add to search history
 * @param {string} query 
 * @param {string} type 
 */
export const addToHistory = (query, type = 'general') => {
    if (!query || query.length < 2) return;

    const history = getSearchHistory();
    const entry = { query, type, timestamp: new Date().toISOString() };

    // Remove duplicate
    const filtered = history.filter(h => h.query.toLowerCase() !== query.toLowerCase());

    // Add to front and limit size
    const updated = [entry, ...filtered].slice(0, MAX_HISTORY);

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
};

/**
 * Clear search history
 */
export const clearHistory = () => {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
};

/**
 * Fuzzy match score (simple implementation)
 * @param {string} text 
 * @param {string} query 
 * @returns {number} - Score 0-100
 */
const fuzzyScore = (text, query) => {
    if (!text || !query) return 0;

    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();

    // Exact match
    if (textLower === queryLower) return 100;

    // Starts with
    if (textLower.startsWith(queryLower)) return 90;

    // Contains
    if (textLower.includes(queryLower)) return 70;

    // Fuzzy: count matching characters in order
    let score = 0;
    let queryIdx = 0;
    for (let i = 0; i < textLower.length && queryIdx < queryLower.length; i++) {
        if (textLower[i] === queryLower[queryIdx]) {
            score += 10;
            queryIdx++;
        }
    }
    return Math.min(score, 60);
};

/**
 * Search orders
 * @param {object[]} orders 
 * @param {string} query 
 * @param {object} filters 
 * @returns {object[]}
 */
export const searchOrders = (orders, query, filters = {}) => {
    if (!query || query.length < 2) return [];

    let results = orders.map(order => {
        // Calculate relevance score across multiple fields
        const scores = [
            fuzzyScore(order.id, query) * 1.5, // Boost order ID
            fuzzyScore(order.awb, query) * 1.5, // Boost AWB
            fuzzyScore(order.customerName, query),
            fuzzyScore(order.phone, query),
            fuzzyScore(order.city, query),
            fuzzyScore(order.sku, query),
            fuzzyScore(order.externalId, query)
        ];

        const maxScore = Math.max(...scores);

        return {
            ...order,
            _searchScore: maxScore,
            _matchField: scores.indexOf(maxScore)
        };
    }).filter(order => order._searchScore > 20);

    // Apply filters
    if (filters.status) {
        results = results.filter(o => o.status === filters.status);
    }
    if (filters.source) {
        results = results.filter(o => o.source === filters.source);
    }
    if (filters.carrier) {
        results = results.filter(o => o.carrier === filters.carrier);
    }
    if (filters.dateFrom) {
        results = results.filter(o => new Date(o.createdAt) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
        results = results.filter(o => new Date(o.createdAt) <= new Date(filters.dateTo));
    }

    // Sort by relevance
    return results.sort((a, b) => b._searchScore - a._searchScore);
};

/**
 * Search customers (extract unique from orders)
 * @param {object[]} orders 
 * @param {string} query 
 * @returns {object[]}
 */
export const searchCustomers = (orders, query) => {
    if (!query || query.length < 2) return [];

    // Build unique customer list
    const customerMap = new Map();
    orders.forEach(order => {
        const key = order.phone || order.customerName;
        if (!customerMap.has(key)) {
            customerMap.set(key, {
                name: order.customerName,
                phone: order.phone,
                city: order.city,
                state: order.state,
                orderCount: 1,
                lastOrderId: order.id
            });
        } else {
            customerMap.get(key).orderCount++;
        }
    });

    const customers = Array.from(customerMap.values());

    return customers.map(customer => {
        const score = Math.max(
            fuzzyScore(customer.name, query),
            fuzzyScore(customer.phone, query),
            fuzzyScore(customer.city, query)
        );
        return { ...customer, _searchScore: score };
    }).filter(c => c._searchScore > 20)
        .sort((a, b) => b._searchScore - a._searchScore);
};

/**
 * Search SKUs
 * @param {object[]} skuMaster 
 * @param {string} query 
 * @returns {object[]}
 */
export const searchSKUs = (skuMaster, query) => {
    if (!query || query.length < 2) return [];

    return skuMaster.map(sku => {
        const score = Math.max(
            fuzzyScore(sku.code, query) * 1.5,
            fuzzyScore(sku.name, query),
            fuzzyScore(sku.category, query)
        );
        return { ...sku, _searchScore: score };
    }).filter(s => s._searchScore > 20)
        .sort((a, b) => b._searchScore - a._searchScore);
};

/**
 * Universal search across all entities
 * @param {object} data - { orders, skuMaster }
 * @param {string} query 
 * @returns {object} - Grouped results
 */
export const universalSearch = (data, query) => {
    addToHistory(query);

    const results = {
        orders: searchOrders(data.orders || [], query).slice(0, 10),
        customers: searchCustomers(data.orders || [], query).slice(0, 5),
        skus: searchSKUs(data.skuMaster || [], query).slice(0, 5),
        totalResults: 0
    };

    results.totalResults = results.orders.length + results.customers.length + results.skus.length;

    return results;
};

/**
 * Quick lookup by exact ID
 * @param {object[]} orders 
 * @param {string} id - Order ID or AWB
 * @returns {object|null}
 */
export const quickLookup = (orders, id) => {
    const idUpper = id.toUpperCase();
    return orders.find(o =>
        o.id === idUpper ||
        o.id.toUpperCase() === idUpper ||
        o.awb === idUpper ||
        o.externalId === id
    ) || null;
};

export default {
    getSearchHistory,
    addToHistory,
    clearHistory,
    searchOrders,
    searchCustomers,
    searchSKUs,
    universalSearch,
    quickLookup
};
