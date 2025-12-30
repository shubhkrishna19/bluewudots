import React, { createContext, useContext, useState, useEffect } from 'react';

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
                // Mocking some data for the UI
                setOrders([
                    { id: 'BW-9901', customer: 'John Doe', status: 'Ordered', city: 'Mumbai', sku: 'DESK-01' },
                    { id: 'BW-9902', customer: 'Alice Smith', status: 'Processing', city: 'Delhi', sku: 'CAB-05' }
                ]);
                setLogistics([
                    { carrier: 'Delhivery', zone: 'North', baseRate: 80 },
                    { carrier: 'BlueDart', zone: 'Metro', baseRate: 120 }
                ]);
                setSkuMaster([
                    { code: 'DESK-01', name: 'Work Desk Pro', cost: 4500 },
                    { code: 'CAB-05', name: 'Elite Storage', cost: 12000 }
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
        // Unified Action: Auto Carrier Recommendation
        getRecommendation: (pincode, weight) => {
            console.log('Ranking carriers for:', pincode, weight);
            return logistics.sort((a, b) => a.baseRate - b.baseRate)[0];
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
