/**
 * Reverse Logistics Service
 * Manages the lifecycle of returned orders including approvals, pickup scheduling, and refunds.
 */

import { generateOrderId } from '../utils/dataUtils';

export class ReverseLogisticsService {

    constructor() {
        this.RETURN_REASONS = [
            'Damaged Product',
            'Wrong Item Sent',
            'Did Not Like Quality',
            'Size/Fit Issue',
            'Defective',
            'Other'
        ];
    }

    /**
     * Create a new return request.
     * @param {string} orderId 
     * @param {string} reason 
     * @param {Array} items - List of items to return
     * @returns {Object} New return request object
     */
    createReturnRequest(orderId, reason, items = []) {
        if (!orderId) throw new Error('Order ID is required');

        const returnRequest = {
            id: `RET-${Date.now().toString().slice(-6)}`,
            orderId,
            reason,
            items,
            status: 'REQUESTED', // REQUESTED, APPROVED, PICKUP_SCHEDULED, PICKED_UP, RECEIVED, REFUNDED, REJECTED
            createdAt: new Date().toISOString(),
            logs: [{
                status: 'REQUESTED',
                timestamp: new Date().toISOString(),
                note: `Return requested for reason: ${reason}`
            }]
        };

        return returnRequest;
    }

    /**
     * Approve a return request.
     * @param {Object} returnRequest 
     * @param {string} note 
     */
    approveReturn(returnRequest, note = 'Return approved by admin') {
        return {
            ...returnRequest,
            status: 'APPROVED',
            logs: [...returnRequest.logs, {
                status: 'APPROVED',
                timestamp: new Date().toISOString(),
                note
            }]
        };
    }

    /**
     * Reject a return request.
     * @param {Object} returnRequest 
     * @param {string} reason 
     */
    rejectReturn(returnRequest, reason) {
        return {
            ...returnRequest,
            status: 'REJECTED',
            logs: [...returnRequest.logs, {
                status: 'REJECTED',
                timestamp: new Date().toISOString(),
                note: reason
            }]
        };
    }

    /**
     * Generate a Mock Return Label (PDF logic would be in labelGenerator)
     * @param {string} returnId 
     */
    generateReturnLabel(returnId) {
        // In a real app, this would call a PDF generator
        console.log(`Generating return label for ${returnId}`);
        return {
            success: true,
            url: `/mock-labels/return-${returnId}.pdf`,
            trackingNumber: `RET-TRK-${Math.floor(Math.random() * 100000)}`
        };
    }

    /**
     * Calculate estimated refund amount (simplified)
     * @param {Object} originalOrder 
     * @param {Array} returnedItems 
     */
    calculateRefundAmount(originalOrder, returnedItems) {
        // Simplified: assuming full refund for now
        return parseFloat(originalOrder.amount) || 0;
    }
}

const reverseLogisticsService = new ReverseLogisticsService();
export { reverseLogisticsService };
export default reverseLogisticsService;
