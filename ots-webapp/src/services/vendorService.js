/**
 * Vendor Service
 * Manages supply chain partners and tracks historical lead-time performance.
 */

const VENDORS = [
    { id: 'V001', name: 'Zhejiang Furniture Co.', category: 'Import', country: 'China', avgLeadTime: 45 },
    { id: 'V002', name: 'Rajasthan Craftsmen', category: 'Local', country: 'India', avgLeadTime: 12 },
    { id: 'V003', name: 'Vietnam Industrial Designs', category: 'Import', country: 'Vietnam', avgLeadTime: 38 },
];

class VendorService {
    getVendors() {
        return VENDORS;
    }

    getVendorById(id) {
        return VENDORS.find(v => v.id === id);
    }

    /**
     * Calculates reliability score based on historical vs. promised delivery dates.
     * @param {string} vendorId 
     * @returns {number} Score from 0 to 100
     */
    getVendorReliability(vendorId) {
        // Simulated: In production, this would query historical GRN records.
        const stats = {
            'V001': 88,
            'V002': 94,
            'V003': 82
        };
        return stats[vendorId] || 75;
    }
}

export default new VendorService();
