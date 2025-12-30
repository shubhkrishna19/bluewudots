/**
 * India Logistics Utility Engine
 * Handles Pan-India Zone Mapping, Rate Estimation, and Delivery Time Calculation.
 */

export const INDIA_ZONES = {
    METRO: ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'],
    NORTH: ['Jammu & Kashmir', 'Himachal Pradesh', 'Punjab', 'Uttarakhand', 'Haryana', 'Delhi', 'Uttar Pradesh'],
    SOUTH: ['Karnataka', 'Andhra Pradesh', 'Telangana', 'Tamil Nadu', 'Kerala', 'Puducherry'],
    WEST: ['Rajasthan', 'Gujarat', 'Maharashtra', 'Goa'],
    EAST: ['Bihar', 'Jharkhand', 'West Bengal', 'Odisha'],
    NORTH_EAST: ['Arunachal Pradesh', 'Assam', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura'],
    CENTRAL: ['Madhya Pradesh', 'Chhattisgarh']
};

/**
 * Maps a state/city to a logistic zone.
 */
export const getZoneFromLocation = (state, city) => {
    if (INDIA_ZONES.METRO.includes(city)) return 'METRO';

    for (const [zone, states] of Object.entries(INDIA_ZONES)) {
        if (states.includes(state)) return zone;
    }
    return 'ROI'; // Rest of India
};

/**
 * Industrial-grade Rate Estimator
 * Based on legacy Bluewud pricing models.
 */
export const estimateRate = (config, weight, zone) => {
    const { baseRate, addRate, fuelSurcharge, awbFee } = config;

    // Base logic: 1st 0.5kg/1kg has a flat rate, every additional 0.5kg/1kg adds addRate.
    // Weight normalization (assuming 0.5kg steps)
    const steps = Math.ceil(weight / 0.5);
    const totalBase = baseRate + (Math.max(0, steps - 1) * addRate);

    const surchargeAmt = (totalBase * fuelSurcharge) / 100;
    return totalBase + surchargeAmt + awbFee;
};

/**
 * Delivery Time Estimator (SLA)
 */
export const getSLA = (zone) => {
    switch (zone) {
        case 'METRO': return '2-3 Days';
        case 'NORTH': return '3-5 Days';
        case 'SOUTH': return '5-7 Days';
        case 'NORTH_EAST': return '7-10 Days';
        default: return '4-6 Days';
    }
};
