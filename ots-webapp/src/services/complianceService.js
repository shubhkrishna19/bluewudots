/**
 * Compliance Service
 * Handles HSN/SAC code mapping, GST calculations, E-way bill generation,
 * and international shipping requirements.
 */

// Domestic HSN & GST
const HSN_MAP = {
    'STUDY_TABLE': '94035090',
    'OFFICE_CHAIR': '94013000',
    'BOOKSHELF': '94036000',
    'SOFA': '94016100',
    'BED': '94042100',
    'DEFAULT': '94039000'
};

const GST_RATES = {
    'FURNITURE': 18,
    'HARDWARE': 12,
    'FABRIC': 5
};

// International Compliance
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

class ComplianceService {
    /**
     * Get HSN code for a given SKU
     */
    getHSNCode(sku) {
        if (!sku) return HSN_MAP.DEFAULT;
        const skuUpper = sku.toUpperCase();
        for (const [key, code] of Object.entries(HSN_MAP)) {
            if (skuUpper.includes(key)) return code;
        }
        return HSN_MAP.DEFAULT;
    }

    /**
     * Get applicable GST rate
     */
    getGSTRate(sku) {
        if (!sku) return GST_RATES.FURNITURE;
        const skuUpper = sku.toUpperCase();
        if (skuUpper.includes('CHAIR') || skuUpper.includes('TABLE') || skuUpper.includes('SHELF')) return GST_RATES.FURNITURE;
        if (skuUpper.includes('HINGE') || skuUpper.includes('SCREW')) return GST_RATES.HARDWARE;
        return GST_RATES.FURNITURE;
    }

    /**
     * International Doc Requirements
     */
    getRequiredDocuments(country) {
        return EXPORT_DOCUMENTATION[country] || ['Commercial Invoice', 'Packing List'];
    }

    /**
     * E-way Bill logic
     */
    isEwayBillRequired(invoiceValue, originState, destState) {
        return invoiceValue > 50000 || originState !== destState;
    }

    generateEwayBill(order) {
        const ewayNumber = `EWB${Date.now().toString(36).toUpperCase()}`;
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 3);

        return {
            ewayNumber,
            generatedAt: new Date().toISOString(),
            validUntil: validUntil.toISOString(),
            orderId: order.id,
            originState: 'Maharashtra',
            destState: order.state || order.destinationState || 'N/A',
            invoiceValue: order.total || order.amount || 0,
            hsnCode: this.getHSNCode(order.sku),
            gstRate: this.getGSTRate(order.sku),
            transporterName: order.carrier || 'Bluewud Logistics'
        };
    }

    /**
     * Global Compliance Summary
     */
    generateComplianceSummary(order) {
        const country = order.destinationCountry || 'India';
        const isInternational = country !== 'India';

        if (isInternational) {
            const hsnPrefix = this.getHSNCode(order.sku).substring(0, 4);
            const hsnData = HSN_DATABASE[hsnPrefix];
            return {
                type: 'International',
                destination: country,
                hsnCode: this.getHSNCode(order.sku),
                requiredDocuments: this.getRequiredDocuments(country),
                complianceStatus: hsnData ? 'Compliant' : 'Review Required'
            };
        }

        return {
            type: 'Domestic',
            ewayBillRequired: this.isEwayBillRequired(order.amount || 0, 'Maharashtra', order.state),
            hsnCode: this.getHSNCode(order.sku),
            gstRate: this.getGSTRate(order.sku),
            complianceStatus: 'Compliant'
        };
    }
}

export const complianceService = new ComplianceService();
export default complianceService;
