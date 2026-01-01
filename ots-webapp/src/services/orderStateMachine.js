/**
 * Order State Machine - Manages valid order status transitions
 * Ensures business logic is enforced for order lifecycle
 */

// Valid order statuses
export const ORDER_STATUSES = {
    PENDING: 'Pending',
    MTP_APPLIED: 'MTP-Applied',
    CARRIER_ASSIGNED: 'Carrier-Assigned',
    LABEL_GENERATED: 'Label-Generated',
    QA_PASSED: 'QA-Passed',
    PICKED_UP: 'Picked-Up',
    IN_TRANSIT: 'In-Transit',
    OUT_FOR_DELIVERY: 'Out-for-Delivery',
    DELIVERED: 'Delivered',
    RTO_INITIATED: 'RTO-Initiated',
    RTO_IN_TRANSIT: 'RTO-In-Transit',
    RTO_DELIVERED: 'RTO-Delivered',
    CANCELLED: 'Cancelled',
    ON_HOLD: 'On-Hold'
};

// Valid transitions from each status
const VALID_TRANSITIONS = {
    [ORDER_STATUSES.PENDING]: [
        ORDER_STATUSES.MTP_APPLIED,
        ORDER_STATUSES.QA_PASSED,
        ORDER_STATUSES.CARRIER_ASSIGNED,
        ORDER_STATUSES.CANCELLED,
        ORDER_STATUSES.ON_HOLD
    ],
    [ORDER_STATUSES.MTP_APPLIED]: [
        ORDER_STATUSES.QA_PASSED,
        ORDER_STATUSES.CARRIER_ASSIGNED,
        ORDER_STATUSES.CANCELLED,
        ORDER_STATUSES.ON_HOLD
    ],
    [ORDER_STATUSES.QA_PASSED]: [
        ORDER_STATUSES.CARRIER_ASSIGNED,
        ORDER_STATUSES.CANCELLED
    ],
    [ORDER_STATUSES.CARRIER_ASSIGNED]: [
        ORDER_STATUSES.LABEL_GENERATED,
        ORDER_STATUSES.PENDING, // Unassign
        ORDER_STATUSES.CANCELLED
    ],
    [ORDER_STATUSES.LABEL_GENERATED]: [
        ORDER_STATUSES.PICKED_UP,
        ORDER_STATUSES.CARRIER_ASSIGNED, // Re-generate
        ORDER_STATUSES.CANCELLED
    ],
    [ORDER_STATUSES.PICKED_UP]: [
        ORDER_STATUSES.IN_TRANSIT,
        ORDER_STATUSES.RTO_INITIATED
    ],
    [ORDER_STATUSES.IN_TRANSIT]: [
        ORDER_STATUSES.OUT_FOR_DELIVERY,
        ORDER_STATUSES.RTO_INITIATED
    ],
    [ORDER_STATUSES.OUT_FOR_DELIVERY]: [
        ORDER_STATUSES.DELIVERED,
        ORDER_STATUSES.RTO_INITIATED
    ],
    [ORDER_STATUSES.DELIVERED]: [], // Terminal state
    [ORDER_STATUSES.RTO_INITIATED]: [
        ORDER_STATUSES.RTO_IN_TRANSIT
    ],
    [ORDER_STATUSES.RTO_IN_TRANSIT]: [
        ORDER_STATUSES.RTO_DELIVERED
    ],
    [ORDER_STATUSES.RTO_DELIVERED]: [
        ORDER_STATUSES.PENDING // Re-ship
    ],
    [ORDER_STATUSES.CANCELLED]: [], // Terminal state
    [ORDER_STATUSES.ON_HOLD]: [
        ORDER_STATUSES.PENDING,
        ORDER_STATUSES.CANCELLED
    ]
};

// Status metadata
export const STATUS_META = {
    [ORDER_STATUSES.PENDING]: { color: '#F59E0B', icon: '⏳', category: 'pending' },
    [ORDER_STATUSES.MTP_APPLIED]: { color: '#8B5CF6', icon: '📋', category: 'pending' },
    [ORDER_STATUSES.CARRIER_ASSIGNED]: { color: '#6366F1', icon: '🚚', category: 'processing' },
    [ORDER_STATUSES.LABEL_GENERATED]: { color: '#3B82F6', icon: '🏷️', category: 'processing' },
    [ORDER_STATUSES.QA_PASSED]: { color: '#10B981', icon: '💎', category: 'processing' },
    [ORDER_STATUSES.PICKED_UP]: { color: '#0EA5E9', icon: '📦', category: 'transit' },
    [ORDER_STATUSES.IN_TRANSIT]: { color: '#14B8A6', icon: '🛣️', category: 'transit' },
    [ORDER_STATUSES.OUT_FOR_DELIVERY]: { color: '#22C55E', icon: '🏃', category: 'transit' },
    [ORDER_STATUSES.DELIVERED]: { color: '#10B981', icon: '✅', category: 'completed' },
    [ORDER_STATUSES.RTO_INITIATED]: { color: '#EF4444', icon: '↩️', category: 'rto' },
    [ORDER_STATUSES.RTO_IN_TRANSIT]: { color: '#DC2626', icon: '🔙', category: 'rto' },
    [ORDER_STATUSES.RTO_DELIVERED]: { color: '#B91C1C', icon: '📍', category: 'rto' },
    [ORDER_STATUSES.CANCELLED]: { color: '#6B7280', icon: '❌', category: 'cancelled' },
    [ORDER_STATUSES.ON_HOLD]: { color: '#9CA3AF', icon: '⏸️', category: 'hold' }
};

/**
 * Check if a status transition is valid
 * @param {string} currentStatus 
 * @param {string} newStatus 
 * @returns {boolean}
 */
export const isValidTransition = (currentStatus, newStatus) => {
    const validNextStatuses = VALID_TRANSITIONS[currentStatus] || [];
    return validNextStatuses.includes(newStatus);
};

/**
 * Get all valid next statuses for a given status
 * @param {string} currentStatus 
 * @returns {string[]}
 */
export const getValidNextStatuses = (currentStatus) => {
    return VALID_TRANSITIONS[currentStatus] || [];
};

/**
 * Transition an order to a new status with validation
 * @param {object} order - Current order object
 * @param {string} newStatus - Target status
 * @param {object} metadata - Additional metadata (reason, user, etc.)
 * @returns {object} - Updated order or error
 */
export const transitionOrder = (order, newStatus, metadata = {}) => {
    const currentStatus = order.status;

    // Validate transition
    if (!isValidTransition(currentStatus, newStatus)) {
        return {
            success: false,
            error: `Invalid transition from ${currentStatus} to ${newStatus}`,
            validOptions: getValidNextStatuses(currentStatus)
        };
    }

    // Create transition record
    const transition = {
        from: currentStatus,
        to: newStatus,
        timestamp: new Date().toISOString(),
        user: metadata.user || 'system',
        reason: metadata.reason || '',
        notes: metadata.notes || ''
    };

    // Update order
    const updatedOrder = {
        ...order,
        status: newStatus,
        lastUpdated: transition.timestamp,
        statusHistory: [...(order.statusHistory || []), transition]
    };

    // Add status-specific fields
    if (newStatus === ORDER_STATUSES.CARRIER_ASSIGNED && metadata.carrier) {
        updatedOrder.carrier = metadata.carrier;
    }
    if (newStatus === ORDER_STATUSES.LABEL_GENERATED && metadata.awb) {
        updatedOrder.awb = metadata.awb;
    }
    if (newStatus === ORDER_STATUSES.DELIVERED && metadata.deliveryDate) {
        updatedOrder.deliveryDate = metadata.deliveryDate;
    }
    if (newStatus.startsWith('RTO') && metadata.rtoReason) {
        updatedOrder.rtoReason = metadata.rtoReason;
    }

    return {
        success: true,
        order: updatedOrder,
        transition
    };
};

/**
 * Bulk transition multiple orders
 * @param {object[]} orders - Array of orders
 * @param {string} newStatus - Target status
 * @param {object} metadata - Additional metadata
 * @returns {object} - Results with success/failure counts
 */
export const bulkTransition = (orders, newStatus, metadata = {}) => {
    const results = {
        successful: [],
        failed: [],
        totalAttempted: orders.length
    };

    orders.forEach(order => {
        const result = transitionOrder(order, newStatus, metadata);
        if (result.success) {
            results.successful.push(result.order);
        } else {
            results.failed.push({
                orderId: order.id,
                error: result.error,
                validOptions: result.validOptions
            });
        }
    });

    return results;
};

/**
 * Calculate order metrics from status history
 * @param {object} order 
 * @returns {object} - Metrics like processing time, transit time, etc.
 */
export const calculateOrderMetrics = (order) => {
    const history = order.statusHistory || [];
    if (history.length === 0) return {};

    const metrics = {};

    // Find specific timestamps
    const createdAt = history.find(h => h.to === ORDER_STATUSES.PENDING)?.timestamp;
    const pickedAt = history.find(h => h.to === ORDER_STATUSES.PICKED_UP)?.timestamp;
    const deliveredAt = history.find(h => h.to === ORDER_STATUSES.DELIVERED)?.timestamp;

    if (createdAt && pickedAt) {
        metrics.processingTime = Math.round((new Date(pickedAt) - new Date(createdAt)) / (1000 * 60 * 60)); // hours
    }

    if (pickedAt && deliveredAt) {
        metrics.transitTime = Math.round((new Date(deliveredAt) - new Date(pickedAt)) / (1000 * 60 * 60 * 24)); // days
    }

    if (createdAt && deliveredAt) {
        metrics.totalTime = Math.round((new Date(deliveredAt) - new Date(createdAt)) / (1000 * 60 * 60 * 24)); // days
    }

    metrics.transitionCount = history.length;

    return metrics;
};

export default {
    ORDER_STATUSES,
    STATUS_META,
    isValidTransition,
    getValidNextStatuses,
    transitionOrder,
    bulkTransition,
    calculateOrderMetrics
};
