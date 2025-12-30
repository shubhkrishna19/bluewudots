import React, { createContext, useContext, useState, useEffect } from 'react';
import * as LogisticsLib from '../utils/logisticsUtils';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [logistics, setLogistics] = useState([]);
    const [skuMaster, setSkuMaster] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial Data Fetch Logic (Mock for now)
    useEffect(() => {
        const initializeData = async () => {
            try {
                console.log('Synchronizing with Bluewud India Nodes...');
                setOrders([
                    { id: 'BW-9901', customer: 'Rajesh Kumar', status: 'Delivered', city: 'Mumbai', state: 'Maharashtra', sku: 'BL-DESK-01', weight: 12.5, source: 'Amazon' },
                    { id: 'BW-9902', customer: 'Priya Sharma', status: 'In-Transit', city: 'Delhi', state: 'Delhi', sku: 'BL-CAB-05', weight: 8.0, source: 'Flipkart' },
                    { id: 'BW-9903', customer: 'Amit Patel', status: 'Carrier-Assigned', city: 'Bangalore', state: 'Karnataka', sku: 'BL-SHELF-02', weight: 15.0, source: 'Amazon' },
                    { id: 'BW-9904', customer: 'Sneha Reddy', status: 'MTP-Applied', city: 'Hyderabad', state: 'Telangana', sku: 'BL-TABLE-03', weight: 20.0, source: 'Shopify' },
                    { id: 'BW-9905', customer: 'Vikram Singh', status: 'Imported', city: 'Jaipur', state: 'Rajasthan', sku: 'BL-CHAIR-01', weight: 5.0, source: 'Urban Ladder' },
                    { id: 'BW-9906', customer: 'Meera Iyer', status: 'Delivered', city: 'Chennai', state: 'Tamil Nadu', sku: 'BL-DESK-02', weight: 14.0, source: 'Pepperfry' },
                    { id: 'BW-9907', customer: 'Arjun Nair', status: 'In-Transit', city: 'Kochi', state: 'Kerala', sku: 'BL-RACK-01', weight: 18.0, source: 'Amazon' },
                    { id: 'BW-9908', customer: 'Furniture World', status: 'Imported', city: 'Bangalore', state: 'Karnataka', sku: 'BL-BULK-SET', weight: 45.0, source: 'Dealer' },
                    { id: 'BW-9909', customer: 'Local Customer', status: 'Carrier-Assigned', city: 'Pune', state: 'Maharashtra', sku: 'BL-STOOL-01', weight: 3.5, source: 'Local Shop' },
                    { id: 'BW-9910', customer: 'Home Decor Hub', status: 'Delivered', city: 'Ahmedabad', state: 'Gujarat', sku: 'BL-COMBO-01', weight: 25.0, source: 'Dealer' }
                ]);

                // Comprehensive Carrier Configurations
                setLogistics([
                    {
                        id: 'carrier-1',
                        carrier: 'Delhivery',
                        service: 'Surface',
                        baseRate: 45, // First 0.5kg
                        addRate: 35,  // Addl 0.5kg
                        fuelSurcharge: 18,
                        awbFee: 15,
                        active: true
                    },
                    {
                        id: 'carrier-2',
                        carrier: 'BlueDart',
                        service: 'Premium Air',
                        baseRate: 120,
                        addRate: 85,
                        fuelSurcharge: 25,
                        awbFee: 25,
                        active: true
                    },
                    {
                        id: 'carrier-3',
                        carrier: 'XpressBees',
                        service: 'Surface High-Volume',
                        baseRate: 38,
                        addRate: 32,
                        fuelSurcharge: 15,
                        awbFee: 10,
                        active: true
                    }
                ]);

                setSkuMaster([
                    { code: 'DESK-01', name: 'Work Desk Pro', cost: 4500, weight: 15 },
                    { code: 'CAB-05', name: 'Elite Storage', cost: 12000, weight: 25 }
                ]);
                setLoading(false);
            } catch (error) {
                console.error('Data Sync Failed:', error);
            }
        };
        initializeData();
    }, []);

    const value = {
        orders,
        logistics,
        skuMaster,
        loading,
        setOrders,
        setLogistics,
        setSkuMaster,

        // Transition Engine: Update State Workflow
        updateOrderStatus: (orderId, newStatus) => {
            setOrders(prev => prev.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
            console.log(`ORCHESTRATION: Order ${orderId} moved to ${newStatus}`);
        },

        // Industrial Logic: Rank Carriers by Cost for a specific order
        getRecommendations: (state, city, weight) => {
            const zone = LogisticsLib.getZoneFromLocation(state, city);
            const ranked = logistics
                .filter(c => c.active)
                .map(carrier => ({
                    ...carrier,
                    estimatedCost: LogisticsLib.estimateRate(carrier, weight, zone),
                    sla: LogisticsLib.getSLA(zone),
                    zone
                }))
                .sort((a, b) => a.estimatedCost - b.estimatedCost);

            return ranked;
        }
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
