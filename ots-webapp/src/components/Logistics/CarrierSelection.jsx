import React from 'react';
import { useData } from '../../context/DataContext';

const CarrierSelection = () => {
    const { logistics, getRecommendation } = useData();
    const recommended = getRecommendation('400001', 5); // Example Mumbai pincode, 5kg

    return (
        <div className="carrier-view animate-fade">
            <h2>Domestic Carrier Orchestration</h2>
            <p className="text-muted">India Wide Logistics Node Selection</p>

            <div className="recommendation-hero glass animate-fade" style={{ marginTop: '24px', padding: '32px' }}>
                <span className="badge">OPTIMAL CHOICE</span>
                <h3>{recommended?.carrier}</h3>
                <p>Recommended for current route and weight profile.</p>
                <div className="rate-info">
                    <span>Base Rate: ₹{recommended?.baseRate}</span>
                    <button className="btn-primary glass-hover">Select Carrier</button>
                </div>
            </div>

            <div className="carrier-list" style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3>All Available Nodes</h3>
                {logistics.map((item, idx) => (
                    <div key={idx} className="glass glass-hover" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <strong>{item.carrier}</strong>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Coverage: {item.zone}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p>₹{item.baseRate}</p>
                            <span style={{ fontSize: '0.7rem', color: 'var(--success)' }}>Active</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarrierSelection;
