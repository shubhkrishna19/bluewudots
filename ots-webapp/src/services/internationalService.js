/**
 * International Operations Service
 * 
 * Handles multi-currency conversion, international shipping calculations,
 * and cross-border compliance (HSN/VAT/Duty).
 */

export const CURRENCY_DATABASE = {
    INR: { symbol: '₹', rate: 1, name: 'Indian Rupee' },
    USD: { symbol: '$', rate: 0.012, name: 'US Dollar' },
    EUR: { symbol: '€', rate: 0.011, name: 'Euro' },
    GBP: { symbol: '£', rate: 0.009, name: 'British Pound' },
    AED: { symbol: 'د.إ', rate: 0.044, name: 'UAE Dirham' }
};

/**
 * Convert amount from INR to target currency
 * @param {number} amount - Amount in INR
 * @param {string} targetCurrency - Target currency code
 * @returns {object} - { value, symbol, formatted }
 */
export const convertFromINR = (amount, targetCurrency = 'USD') => {
    const currency = CURRENCY_DATABASE[targetCurrency] || CURRENCY_DATABASE.USD;
    const convertedValue = amount * currency.rate;

    return {
        value: convertedValue,
        symbol: currency.symbol,
        formatted: `${currency.symbol}${convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    };
};

/**
 * Get International Shipping Estimate
 * @param {string} country - Destination country
 * @param {number} weight - Weight in KG
 * @returns {number} - Estimated shipping cost in INR
 */
export const getInternationalShippingEstimate = (country, weight) => {
    // Basic zone-based pricing logic
    const zones = {
        'USA': 2500,
        'UK': 2200,
        'UAE': 1200,
        'Germany': 2300,
        'Australia': 2800
    };

    const baseRate = zones[country] || 3500; // Rest of world
    return baseRate * weight;
};

/**
 * Calculate Cross-Border Duties & Taxes (Placeholder)
 * @param {number} productValue - Value in INR
 * @param {string} destinationCountry 
 * @returns {object} - Duty breakdown
 */
export const calculateCrossBorderDuty = (productValue, destinationCountry) => {
    const dutyRates = {
        'USA': 0.05,
        'UK': 0.20, // VAT
        'UAE': 0.05,
        'Germany': 0.19
    };

    const rate = dutyRates[destinationCountry] || 0.10;
    const dutyAmount = productValue * rate;

    return {
        rate: rate * 100,
        amount: dutyAmount,
        totalWithDuty: productValue + dutyAmount
    };
};

export default {
    convertFromINR,
    getInternationalShippingEstimate,
    calculateCrossBorderDuty,
    CURRENCY_DATABASE
};
