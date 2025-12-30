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
                    { id: 'BW-9901', customer: 'John Doe', status: 'Ordered', city: 'Mumbai', state: 'Maharashtra', sku: 'DESK-01', weight: 12.5 },
                    { id: 'BW-9902', customer: 'Alice Smith', status: 'Processing', city: 'Delhi', state: 'Delhi', sku: 'CAB-05', weight: 8.0 }
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
