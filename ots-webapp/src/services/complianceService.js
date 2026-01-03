/**
 * Compliance Service
 * 
 * Handles HSN/SAC code validation, cross-border duty calculations,
 * and documentation requirements for international shipments.
 */

const HSN_DATABASE = {
    '9403': { description: 'Furniture & Bedding', gstRate: 18, exportDuty: 0 },
    '9401': { description: 'Seats and Chairs', gstRate: 18, exportDuty: 0 },
    '8302': { description: 'Base Metal Fittings', gstRate: 18, exportDuty: 0 },
    '7309': { description: 'Iron/Steel Containers', gstRate: 18, exportDuty: 0 }
};

const EXPORT_DOCUMENTATION = {
    'USA': ['Commercial Invoice', 'Packing List', 'Bill of Lading', 'Certificate of Origin'],
    'UK': ['Commercial Invoice', 'Packing List', 'EUR.1 Certificate', 'UKCA Declaration'],
    'UAE': ['Commercial Invoice', 'Packing List', 'COO', 'HS Code Declaration'],
    'Germany': ['Commercial Invoice', 'Packing List', 'EUR.1 Certificate', 'REACH Compliance']
};

/**
 * Validate HSN Code
 * @param {string} hsnCode 
 * @returns {object|null}
 */
export const validateHSN = (hsnCode) => {
    const prefix = hsnCode?.substring(0, 4);
    return HSN_DATABASE[prefix] || null;
};

/**
 * Get required documentation for destination country
 * @param {string} country 
 * @returns {string[]}
 */
export const getRequiredDocuments = (country) => {
    return EXPORT_DOCUMENTATION[country] || ['Commercial Invoice', 'Packing List'];
};

/**
 * Calculate export duty (placeholder)
 * @param {number} value - Product value in INR
 * @param {string} destinationCountry 
 * @param {string} hsnCode 
 * @returns {number}
 */
export const calculateExportDuty = (value, destinationCountry, hsnCode) => {
    const hsnData = validateHSN(hsnCode);
    const dutyRate = hsnData?.exportDuty || 0;

    // Add estimated import duty based on destination (rough estimates)
    const importDutyRates = {
        'USA': 0.05,
        'UK': 0.15,
        'UAE': 0.05,
        'Germany': 0.12
    };

    const importDuty = importDutyRates[destinationCountry] || 0.10;

    return value * (dutyRate + importDuty);
};

/**
 * Generate compliance summary for an order
 * @param {object} order 
 * @returns {object}
 */
export const generateComplianceSummary = (order) => {
    const country = order.destinationCountry || 'India';
    const hsnData = validateHSN(order.hsnCode || '9403');
    const docs = getRequiredDocuments(country);
    const duty = calculateExportDuty(order.amount || 0, country, order.hsnCode);

    return {
        destination: country,
        hsnValid: !!hsnData,
        gstRate: hsnData?.gstRate || 18,
        requiredDocuments: docs,
        estimatedDuty: duty,
        complianceStatus: hsnData ? 'Compliant' : 'Review Required'
    };
};

export default {
    validateHSN,
    getRequiredDocuments,
    calculateExportDuty,
    generateComplianceSummary,
    HSN_DATABASE
};
