/**
 * Warehouse Metadata
 * Unified source of truth for the Bluewud warehouse network.
 */

export const WAREHOUSES = {
    'WH-NORTH': {
        id: 'WH-NORTH',
        name: 'North Hub (Delhi NCR)',
        city: 'Delhi',
        location: { lat: 28.6139, lng: 77.2090 },
        states: ['Delhi', 'Haryana', 'Punjab', 'Uttar Pradesh', 'Uttarakhand', 'Himachal Pradesh', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Rajasthan'],
        pincodeRanges: [[110000, 119999], [120000, 139999], [140000, 149999], [200000, 289999], [300000, 349999]],
        capacity: 5000,
        priority: 1,
        color: '#F59E0B' // Amber
    },
    'WH-WEST': {
        id: 'WH-WEST',
        name: 'West Hub (Mumbai)',
        city: 'Mumbai',
        location: { lat: 19.0760, lng: 72.8777 },
        states: ['Maharashtra', 'Gujarat', 'Goa', 'Madhya Pradesh', 'Chhattisgarh', 'Daman and Diu', 'Dadra and Nagar Haveli'],
        pincodeRanges: [[400000, 449999], [360000, 399999], [450000, 499999]],
        capacity: 6000,
        priority: 2,
        color: '#8B5CF6' // Violet
    },
    'WH-SOUTH': {
        id: 'WH-SOUTH',
        name: 'South Hub (Bangalore)',
        city: 'Bangalore',
        location: { lat: 12.9716, lng: 77.5946 },
        states: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Telangana', 'Puducherry', 'Lakshadweep', 'Andaman and Nicobar Islands'],
        pincodeRanges: [[500000, 539999], [560000, 599999], [600000, 699999]],
        capacity: 5500,
        priority: 3,
        color: '#10B981' // Emerald
    },
    'WH-EAST': {
        id: 'WH-EAST',
        name: 'East HUB (Kolkata)',
        city: 'Kolkata',
        location: { lat: 22.5726, lng: 88.3639 },
        states: ['West Bengal', 'Bihar', 'Jharkhand', 'Odisha', 'Assam', 'Sikkim', 'Meghalaya', 'Mizoram', 'Manipur', 'Nagaland', 'Arunachal Pradesh', 'Tripura'],
        pincodeRanges: [[700000, 749999], [750000, 799999], [800000, 859999]],
        capacity: 4000,
        priority: 4,
        color: '#3B82F6' // Blue
    }
};

export default WAREHOUSES;
