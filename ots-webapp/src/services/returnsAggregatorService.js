/**
 * Returns Aggregator Service
 * Centralizes return requests from Shopify, Amazon, Flipkart, and Manual entries.
 * Normalizes data into a single schema for the Returns Dashboard.
 */

class ReturnsAggregatorService {
    constructor() {
        this.returns = [];
    }

    /**
     * Fetch pending returns from all sources
     * @returns {Promise<Array>} Normalized returns
     */
    async fetchPendingReturns() {
        // Simulate fetching from different sources
        const mockAmazonReturns = this._generateMockReturns('Amazon', 2);
        const mockFlipkartReturns = this._generateMockReturns('Flipkart', 1);
        const mockShopifyReturns = this._generateMockReturns('Shopify', 3);

        const allReturns = [
            ...mockAmazonReturns,
            ...mockFlipkartReturns,
            ...mockShopifyReturns
        ];

        return allReturns.map(r => this.normalizeReturn(r, r.source));
    }

    /**
     * Normalize return data to standard schema
     * @param {object} rawData 
     * @param {string} source 
     */
    normalizeReturn(rawData, source) {
        return {
            id: rawData.id,
            orderId: rawData.orderId,
            customerName: rawData.customerName,
            sku: rawData.sku,
            productName: rawData.productName,
            returnDate: rawData.returnDate,
            reason: rawData.reason,
            condition: rawData.condition || 'Unknown',
            status: rawData.status || 'Pending', // Pending, Approved, Rejected, Refunded
            refundAmount: rawData.refundAmount,
            source: source,
            riskScore: Math.floor(Math.random() * 100), // Integrated Risk Score (Mock)
            images: rawData.images || []
        };
    }

    /**
     * Process Refund Logic
     * @param {string} returnId 
     * @param {number} amount 
     */
    async processRefund(returnId, amount) {
        console.log(`Processing refund of ₹${amount} for Return ID: ${returnId}`);
        // In real scenario: Call Payment Gateway Refund API
        await new Promise(r => setTimeout(r, 1000));
        return { success: true, transactionId: `REF-${Date.now()}` };
    }

    /**
     * Auto-Approval Logic
     * @param {object} returnRequest 
     */
    checkAutoApproval(returnRequest) {
        // Example Rule: Auto-approve if value < 500 and low risk
        if (returnRequest.refundAmount < 500 && returnRequest.riskScore < 30) {
            return { approved: true, reason: 'Low Value & Low Risk' };
        }
        return { approved: false };
    }

    // --- MOCK GENERATOR ---
    _generateMockReturns(source, count) {
        const returns = [];
        for (let i = 0; i < count; i++) {
            returns.push({
                id: `RET-${source.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 10000)}`,
                orderId: `ORD-${Math.floor(Math.random() * 100000)}`,
                customerName: `Customer ${source} ${i + 1}`,
                sku: `SKU-${Math.floor(Math.random() * 100)}`,
                productName: `Furniture Item ${i + 1}`,
                returnDate: new Date().toISOString(),
                reason: ['Damaged', 'Wrong Item', 'Changed Mind'][Math.floor(Math.random() * 3)],
                refundAmount: Math.floor(Math.random() * 2000) + 100,
                source: source,
                status: 'Pending'
            });
        }
        return returns;
    }
}

export const returnsAggregatorService = new ReturnsAggregatorService();
export default returnsAggregatorService;
