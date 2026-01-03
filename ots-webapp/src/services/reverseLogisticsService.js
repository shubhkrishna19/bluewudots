/**
 * Reverse Logistics Service
 * Manages the lifecycle of returned orders including approvals, pickup scheduling, and refunds.
 */

import { generateOrderId } from '../utils/dataUtils';

import { jsPDF } from "jspdf";

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
     * Generate a Real Return Label PDF
     * @param {string} returnId 
     * @param {Object} orderDetails
     */
    generateReturnLabel(returnId, orderDetails = {}) {
        try {
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [100, 150] // Standard label size
            });

            // Header
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text("RETURN LABEL", 50, 15, { align: 'center' });

            // Barcode Placeholder
            doc.setLineWidth(0.5);
            doc.rect(10, 25, 80, 20);
            doc.setFontSize(10);
            doc.text(`*${returnId}*`, 50, 38, { align: 'center' });

            // From Address
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text("FROM:", 10, 55);
            doc.setFont('helvetica', 'bold');
            doc.text(orderDetails.customer || "Customer Name", 10, 60);
            doc.setFont('helvetica', 'normal');
            doc.text(orderDetails.city || "City, State", 10, 65);
            doc.text(`Ph: ${orderDetails.phone || 'N/A'}`, 10, 70);

            // To Address
            doc.text("TO:", 10, 85);
            doc.setFont('helvetica', 'bold');
            doc.text("BLUEWUD RETURNS CENTRE", 10, 90);
            doc.setFont('helvetica', 'normal');
            doc.text("Plot No 88, Udyog Vihar", 10, 95);
            doc.text("Gurgaon, Haryana, 122016", 10, 100);

            // RMA Details
            doc.setDrawColor(0);
            doc.line(10, 110, 90, 110);
            doc.setFontSize(9);
            doc.text(`RMA #: ${returnId}`, 10, 120);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 60, 120);
            doc.text(`Reason: ${orderDetails.reason || 'Return'}`, 10, 130);

            return {
                success: true,
                url: doc.output('bloburl'),
                trackingNumber: `RET-TRK-${Math.floor(Math.random() * 100000)}`
            };
        } catch (error) {
            console.error("PDF Generation Failed", error);
            return { success: false, error: "Failed to generate label" };
        }
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

    /**
     * Initiate RMA (Return Merchandise Authorization)
     * @param {Object} order - Order object
     * @param {Object} options - RMA options (type, reason, etc.)
     * @returns {Object} RMA result
     */
    initiateRMA(order, options = {}) {
        // Validate order status
        if (order.status !== 'Delivered') {
            return {
                success: false,
                message: 'Only delivered orders can be returned'
            };
        }

        // Check return window (7 days)
        const deliveryDate = new Date(order.deliveryDate);
        const now = new Date();
        const daysSinceDelivery = Math.floor((now - deliveryDate) / (1000 * 60 * 60 * 24));

        if (daysSinceDelivery > 7) {
            return {
                success: false,
                message: 'Return window has expired (7 days from delivery)'
            };
        }

        // Create RMA
        const rmaId = `RMA-${Date.now().toString().slice(-6)}`;
        return {
            success: true,
            rmaId,
            status: 'RMA_INITIATED',
            orderId: order.id,
            type: options.type || 'Return',
            createdAt: new Date().toISOString()
        };
    }

    /**
     * Update RMA status
     * @param {string} rmaId - RMA ID
     * @param {string} newStatus - New status
     * @returns {Object} Updated RMA
     */
    updateRMAStatus(rmaId, newStatus) {
        const validStatuses = ['Pending', 'Approved', 'Rejected', 'Completed'];

        if (!validStatuses.includes(newStatus)) {
            throw new Error(`Invalid RMA status: ${newStatus}`);
        }

        return {
            rmaId,
            status: newStatus,
            updatedAt: new Date().toISOString()
        };
    }
}

const reverseLogisticsService = new ReverseLogisticsService();
export { reverseLogisticsService };
export default reverseLogisticsService;
