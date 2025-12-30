/**
 * Data Utilities - Common data transformation and validation functions
 */

// ============================================
// INDIAN GST UTILITIES
// ============================================

const GST_RATES = {
    standard: 18,
    reduced: 12,
    low: 5,
    exempt: 0
};

const STATE_CODES = {
    'Andhra Pradesh': '37',
    'Arunachal Pradesh': '12',
    'Assam': '18',
    'Bihar': '10',
    'Chhattisgarh': '22',
    'Goa': '30',
    'Gujarat': '24',
    'Haryana': '06',
    'Himachal Pradesh': '02',
    'Jharkhand': '20',
    'Karnataka': '29',
    'Kerala': '32',
    'Madhya Pradesh': '23',
    'Maharashtra': '27',
    'Manipur': '14',
    'Meghalaya': '17',
    'Mizoram': '15',
    'Nagaland': '13',
    'Odisha': '21',
    'Punjab': '03',
    'Rajasthan': '08',
    'Sikkim': '11',
    'Tamil Nadu': '33',
    'Telangana': '36',
    'Tripura': '16',
    'Uttar Pradesh': '09',
    'Uttarakhand': '05',
    'West Bengal': '19',
    'Delhi': '07'
};

/**
 * Calculate GST for an amount
 * @param {number} amount - Base amount
 * @param {string} gstType - Type of GST rate
 * @returns {object} - Breakdown of GST
 */
export const calculateGST = (amount, gstType = 'standard') => {
    const rate = GST_RATES[gstType] || 18;
    const gstAmount = (amount * rate) / 100;
    const halfGst = gstAmount / 2;

    return {
        baseAmount: amount,
        gstRate: rate,
        cgst: halfGst,
        sgst: halfGst,
        igst: gstAmount,
        totalWithGst: amount + gstAmount
    };
};

/**
 * Determine if IGST or CGST+SGST applies
 * @param {string} sellerState 
 * @param {string} buyerState 
 * @returns {string} - 'IGST' or 'CGST+SGST'
 */
export const getGSTType = (sellerState, buyerState) => {
    return sellerState === buyerState ? 'CGST+SGST' : 'IGST';
};

/**
 * Get state code for GST
 * @param {string} stateName 
 * @returns {string}
 */
export const getStateCode = (stateName) => {
    return STATE_CODES[stateName] || '00';
};

// ============================================
// ORDER DATA UTILITIES
// ============================================

/**
 * Generate a unique order ID
 * @param {string} prefix 
 * @returns {string}
 */
export const generateOrderId = (prefix = 'BW') => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}${random}`;
};

/**
 * Validate order data
 * @param {object} order 
 * @returns {object} - { valid: boolean, errors: string[] }
 */
export const validateOrder = (order) => {
    const errors = [];

    if (!order.customerName || order.customerName.trim().length < 2) {
        errors.push('Customer name is required (min 2 characters)');
    }
    if (!order.phone || !/^[6-9]\d{9}$/.test(order.phone)) {
        errors.push('Valid 10-digit Indian phone number required');
    }
    if (!order.pincode || !/^\d{6}$/.test(order.pincode)) {
        errors.push('Valid 6-digit pincode required');
    }
    if (!order.state || !STATE_CODES[order.state]) {
        errors.push('Valid Indian state required');
    }
    if (!order.sku || order.sku.trim().length < 3) {
        errors.push('SKU is required (min 3 characters)');
    }
    if (!order.weight || order.weight <= 0) {
        errors.push('Weight must be greater than 0');
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

/**
 * Normalize order data from different sources
 * @param {object} rawOrder - Raw order from Amazon/Flipkart/etc
 * @param {string} source - Source platform
 * @returns {object} - Normalized order
 */
export const normalizeOrder = (rawOrder, source) => {
    const base = {
        id: generateOrderId(),
        source: source,
        importedAt: new Date().toISOString(),
        status: 'Pending',
        statusHistory: []
    };

    switch (source) {
        case 'amazon':
            return {
                ...base,
                externalId: rawOrder.AmazonOrderId || rawOrder['order-id'],
                customerName: rawOrder.BuyerName || rawOrder['buyer-name'] || 'Amazon Customer',
                phone: rawOrder.BuyerPhone || rawOrder['buyer-phone-number'] || '',
                address: rawOrder.ShippingAddress?.AddressLine1 || rawOrder['ship-address-1'] || '',
                city: rawOrder.ShippingAddress?.City || rawOrder['ship-city'] || '',
                state: rawOrder.ShippingAddress?.StateOrRegion || rawOrder['ship-state'] || '',
                pincode: rawOrder.ShippingAddress?.PostalCode || rawOrder['ship-postal-code'] || '',
                sku: rawOrder.SellerSKU || rawOrder['sku'] || '',
                quantity: parseInt(rawOrder.QuantityOrdered || rawOrder['quantity-purchased'] || 1),
                amount: parseFloat(rawOrder.ItemPrice?.Amount || rawOrder['item-price'] || 0),
                weight: parseFloat(rawOrder.Weight || 0.5)
            };

        case 'flipkart':
            return {
                ...base,
                externalId: rawOrder.order_item_id || rawOrder.orderId,
                customerName: rawOrder.buyer_name || 'Flipkart Customer',
                phone: rawOrder.buyer_phone || '',
                address: rawOrder.ship_address || '',
                city: rawOrder.ship_city || '',
                state: rawOrder.ship_state || '',
                pincode: rawOrder.ship_pincode || '',
                sku: rawOrder.sku || rawOrder.seller_sku || '',
                quantity: parseInt(rawOrder.quantity || 1),
                amount: parseFloat(rawOrder.selling_price || 0),
                weight: parseFloat(rawOrder.weight || 0.5)
            };

        case 'shopify':
            return {
                ...base,
                externalId: rawOrder.order_number || rawOrder.id,
                customerName: `${rawOrder.shipping_address?.first_name || ''} ${rawOrder.shipping_address?.last_name || ''}`.trim() || 'Shopify Customer',
                phone: rawOrder.shipping_address?.phone || '',
                address: rawOrder.shipping_address?.address1 || '',
                city: rawOrder.shipping_address?.city || '',
                state: rawOrder.shipping_address?.province || '',
                pincode: rawOrder.shipping_address?.zip || '',
                sku: rawOrder.line_items?.[0]?.sku || '',
                quantity: rawOrder.line_items?.reduce((sum, item) => sum + item.quantity, 0) || 1,
                amount: parseFloat(rawOrder.total_price || 0),
                weight: parseFloat(rawOrder.total_weight || 500) / 1000 // Shopify uses grams
            };

        default:
            return {
                ...base,
                ...rawOrder
            };
    }
};

// ============================================
// EXPORT UTILITIES
// ============================================

/**
 * Convert array of objects to CSV string
 * @param {object[]} data 
 * @param {string[]} columns - Optional column order
 * @returns {string}
 */
export const toCSV = (data, columns = null) => {
    if (!data || data.length === 0) return '';

    const cols = columns || Object.keys(data[0]);
    const header = cols.join(',');
    const rows = data.map(row =>
        cols.map(col => {
            const val = row[col];
            if (val === null || val === undefined) return '';
            if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
                return `"${val.replace(/"/g, '""')}"`;
            }
            return val;
        }).join(',')
    );

    return [header, ...rows].join('\n');
};

/**
 * Download data as file
 * @param {string} content - File content
 * @param {string} filename 
 * @param {string} mimeType 
 */
export const downloadFile = (content, filename, mimeType = 'text/csv') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Export orders to CSV
 * @param {object[]} orders 
 * @param {string} filename 
 */
export const exportOrdersCSV = (orders, filename = 'orders_export.csv') => {
    const columns = ['id', 'externalId', 'source', 'customerName', 'phone', 'city', 'state', 'pincode', 'sku', 'quantity', 'amount', 'weight', 'status', 'carrier', 'awb'];
    const csv = toCSV(orders, columns);
    downloadFile(csv, filename);
};

/**
 * Export data to JSON
 * @param {any} data 
 * @param {string} filename 
 */
export const exportJSON = (data, filename = 'export.json') => {
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, filename, 'application/json');
};

// ============================================
// DATE UTILITIES
// ============================================

/**
 * Format date to Indian format
 * @param {string|Date} date 
 * @returns {string}
 */
export const formatDateIN = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

/**
 * Format date with time
 * @param {string|Date} date 
 * @returns {string}
 */
export const formatDateTimeIN = (date) => {
    return new Date(date).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {string|Date} date 
 * @returns {string}
 */
export const getRelativeTime = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDateIN(date);
};

export default {
    calculateGST,
    getGSTType,
    getStateCode,
    generateOrderId,
    validateOrder,
    normalizeOrder,
    toCSV,
    downloadFile,
    exportOrdersCSV,
    exportJSON,
    formatDateIN,
    formatDateTimeIN,
    getRelativeTime,
    STATE_CODES
};
