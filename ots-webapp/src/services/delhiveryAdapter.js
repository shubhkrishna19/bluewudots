/**
 * Delhivery API Adapter
 * Handles communication with Delhivery's API for booking and tracking.
 */

const BASE_URL = 'https://track.delhivery.com/api';

/**
 * Fetch shipping rates from Delhivery
 * @param {object} params - { pickupPincode, deliveryPincode, weight, paymentType }
 * @param {string} token - API Token
 */
export const fetchRates = async (params, token) => {
    try {
        const query = new URLSearchParams({
            origin: params.pickupPincode,
            destination: params.deliveryPincode,
            weight: params.weight,
            md: 'S', // Small/Surface
            ss: 'Delivered'
        });

        const response = await fetch(`${BASE_URL}/kkg/service/rate-calculator?${query}`, {
            headers: { 'Authorization': `Token ${token}` }
        });

        if (!response.ok) throw new Error('Delhivery Rate API Failed');
        return await response.json();
    } catch (error) {
        console.error('Delhivery Rate Fetch Error:', error);
        throw error;
    }
};

/**
 * Create a shipment (Forward Booking)
 * @param {object} order - Order details
 * @param {string} token - API Token
 */
export const createShipment = async (order, token) => {
    try {
        const payload = {
            "format": "json",
            "data": {
                "shipments": [{
                    "waybill": "", // Empty for auto-generate
                    "name": order.customer,
                    "order": order.id,
                    "products_desc": order.items.map(i => i.name).join(', '),
                    "order_date": order.orderDate,
                    "payment_mode": order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
                    "total_amount": order.totalAmount,
                    "cod_amount": order.paymentMethod === 'COD' ? order.totalAmount : 0,
                    "add": order.address,
                    "city": order.city,
                    "state": order.state,
                    "country": "India",
                    "phone": order.phone,
                    "pin": order.pincode,
                    "return_add": "BlueWud Returns, Udyog Vihar, Gurgaon",
                    "supplier": "BlueWud"
                }],
                "pickup_location": {
                    "name": "BlueWud Warehouse",
                    "add": "Plot 88, Udyog Vihar",
                    "city": "Gurgaon",
                    "pin_code": "122016",
                    "country": "India",
                    "phone": "9876543210"
                }
            }
        };

        const response = await fetch(`${BASE_URL}/cmu/create.json`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!data.success && !data.packages) throw new Error(data.error || 'Booking Failed');

        // Extract AWB from response (structure varies by API verification)
        const awb = data.packages?.[0]?.waybill || data.upload_wbn;

        return {
            success: true,
            awb,
            shippingId: data.ref_id || `SHIP-${order.id}`,
            carrier: 'Delhivery',
            labelUrl: `https://track.delhivery.com/api/p/packing_slip?wbns=${awb}` // Direct PDF link if authorized
        };

    } catch (error) {
        console.error('Delhivery Booking Error:', error);
        throw error;
    }
};

/**
 * Track a shipment
 * @param {string} awb 
 * @param {string} token 
 */
export const trackShipment = async (awb, token) => {
    try {
        const response = await fetch(`${BASE_URL}/v1/packages/json/?waybill=${awb}&token=${token}`);
        const data = await response.json();

        if (!data.ShipmentData) throw new Error('Tracking Not Found');

        const shipment = data.ShipmentData[0].Shipment;
        return {
            currentStatus: shipment.Status.Status,
            history: shipment.Scans.map(s => ({
                status: s.ScanDetail.Scan,
                location: s.ScanDetail.ScannedLocation,
                timestamp: s.ScanDetail.ScanDateTime
            })),
            estimatedDelivery: shipment.ExpectedDeliveryDate
        };
    } catch (error) {
        console.error('Delhivery Tracking Error:', error);
        throw error;
    }
};

export default { fetchRates, createShipment, trackShipment };
