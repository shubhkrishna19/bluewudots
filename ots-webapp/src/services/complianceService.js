/**
 * Compliance Service
<<<<<<< HEAD
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
=======
 * Handles HSN/SAC code mapping, GST calculations, and E-way bill generation.
 */

// HSN Code Mapping (Furniture-specific)
const HSN_MAP = {
    'STUDY_TABLE': '94035090',
    'OFFICE_CHAIR': '94013000',
    'BOOKSHELF': '94036000',
    'SOFA': '94016100',
    'BED': '94042100',
    'DEFAULT': '94039000'
};

// GST Rates by Category
const GST_RATES = {
    'FURNITURE': 18,
    'HARDWARE': 12,
    'FABRIC': 5
};

class ComplianceService {
    /**
     * Get HSN code for a given SKU.
     * @param {string} sku - Product SKU
     * @returns {string} HSN Code
     */
    getHSNCode(sku) {
        const skuUpper = sku?.toUpperCase() || '';
        for (const [key, code] of Object.entries(HSN_MAP)) {
            if (skuUpper.includes(key)) return code;
        }
        return HSN_MAP.DEFAULT;
    }

    /**
     * Get applicable GST rate based on SKU category.
     * @param {string} sku
     * @returns {number} GST percentage
     */
    getGSTRate(sku) {
        const skuUpper = sku?.toUpperCase() || '';
        if (skuUpper.includes('CHAIR') || skuUpper.includes('TABLE') || skuUpper.includes('SHELF')) {
            return GST_RATES.FURNITURE;
        }
        if (skuUpper.includes('HINGE') || skuUpper.includes('SCREW')) {
            return GST_RATES.HARDWARE;
        }
        return GST_RATES.FURNITURE; // Default
    }

    /**
     * Determine if E-way bill is required.
     * @param {number} invoiceValue
     * @param {string} originState
     * @param {string} destState
     * @returns {boolean}
     */
    isEwayBillRequired(invoiceValue, originState, destState) {
        // E-way bill required for goods > ₹50,000 or inter-state movement
        return invoiceValue > 50000 || originState !== destState;
    }

    /**
     * Generate E-way bill data structure.
     * @param {Object} order
     * @returns {Object} E-way bill details
     */
    generateEwayBill(order) {
        const ewayNumber = `EWB${Date.now().toString(36).toUpperCase()}`;
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 3); // 3-day validity

        return {
            ewayNumber,
            generatedAt: new Date().toISOString(),
            validUntil: validUntil.toISOString(),
            orderId: order.id,
            originState: 'Maharashtra',
            destState: order.state || 'N/A',
            invoiceValue: order.total || 0,
            hsnCode: this.getHSNCode(order.sku),
            gstRate: this.getGSTRate(order.sku),
            vehicleNumber: 'MH-02-XX-1234',
            transporterName: order.carrier || 'Bluewud Logistics'
        };
    }
}

export default new ComplianceService();
>>>>>>> 4be53487f72a2bfacf3cde5d60b2e7a7e0ec3174
