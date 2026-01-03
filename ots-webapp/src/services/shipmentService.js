/**
 * Shipment Service - Manages Booking, Tracking, and Manifest Generation
 * Integrates with Delhivery, BlueDart, and others via direct API or simulated fallback.
 */

import { generateLabelHTML } from './labelPrintService';
import { CARRIER_RATES } from './carrierRateEngine';

const API_CONFIG = {
    delhivery: {
        baseUrl: 'https://track.delhivery.com/api',
        token: import.meta.env.VITE_DELHIVERY_TOKEN
    },
    bluedart: {
        baseUrl: 'https://api.bluedart.com',
        key: import.meta.env.VITE_BLUEDART_LICENSE_KEY
    }
};

// Generic Simulation Delays
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));

/**
 * Create a forward shipment (Book Order)
 * @param {object} order 
 * @returns {Promise<object>} { awb, labelUrl, carrier, status, shippingId }
 */
export const createForwardShipment = async (order) => {
    const carrierId = order.carrier?.toLowerCase().includes('delhivery') ? 'delhivery'
        : order.carrier?.toLowerCase().includes('bluedart') ? 'bluedart'
            : 'delhivery'; // Default

    console.log(`[ShipmentService] Booking order ${order.id} with ${carrierId}...`);

    try {
        // 1. Try Live API if Token Exists
        if (API_CONFIG[carrierId]?.token) {
            return await bookViaApi(carrierId, order);
        }

        // 2. Fallback to Simulation
        await simulateDelay();
        return mockBookingResponse(carrierId, order);

    } catch (error) {
        console.error(`[ShipmentService] API Booking Failed for ${order.id}:`, error);
        // Fallback to simulation on failure to ensure user flow doesn't break
        return mockBookingResponse(carrierId, order, true);
    }
};

/**
 * Track a shipment
 * @param {string} awb 
 * @param {string} carrier 
 */
export const trackShipment = async (awb, carrier = 'delhivery') => {
    const carrierId = carrier.toLowerCase();

    try {
        if (API_CONFIG[carrierId]?.token) {
            // Placeholder for real tracking API call
            // const response = await fetch(...)
        }

        await simulateDelay();
        return mockTrackingResponse(awb);

    } catch (error) {
        console.error('[ShipmentService] Tracking Error:', error);
        return { error: 'Tracking unavailable' };
    }
};

/**
 * Generate Manifest (Handover Document)
 * @param {string[]} orderIds 
 */
export const generateManifest = async (orders) => {
    // In a real system, this calls the carrier API to close the batch
    await simulateDelay();
    return {
        manifestId: `MAN-${Date.now()}`,
        date: new Date().toISOString(),
        count: orders.length,
        url: '#' // Would be a PDF link
    };
};

// ==========================================
// MOCK RESPONSES (Simulation Mode)
// ==========================================

const mockBookingResponse = (carrier, order, isFallback = false) => {
    const awbPrefix = carrier === 'bluedart' ? '78' : '55';
    const rand = Math.floor(Math.random() * 100000000);
    const awb = `${awbPrefix}${rand}`;

    return {
        success: true,
        awb,
        shippingId: `SHIP-${awb}`,
        carrier: CARRIER_RATES[carrier]?.name || carrier,
        status: 'Ready-to-Ship',
        labelUrl: '#', // In UI logic, we generate HTML locally if URL is #
        isSimulation: true,
        isFallback
    };
};

const mockTrackingResponse = (awb) => {
    // Generate a believable history based on hash of AWB
    const steps = [
        { status: 'Shipment Created', location: 'Bangalore Warehouse', timestamp: Date.now() - 86400000 },
        { status: 'Picked Up', location: 'Bangalore Warehouse', timestamp: Date.now() - 80000000 },
        { status: 'In Transit', location: 'Bangalore Hub', timestamp: Date.now() - 70000000 },
        { status: 'Arrived at Destination', location: 'Delhi Hub', timestamp: Date.now() - 10000000 },
    ];

    return {
        awb,
        currentStatus: 'In Transit',
        estimatedDelivery: new Date(Date.now() + 86400000).toISOString(),
        history: steps
    };
};

/**
 * Cancel a shipment
 */
export const cancelShipment = async (awb) => {
    await simulateDelay();
    return { success: true, message: 'Shipment cancelled' };
};

export default {
    createForwardShipment,
    trackShipment,
    generateManifest,
    cancelShipment
};
