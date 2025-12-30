import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const CarrierSelection = () => {
    const { getRecommendations } = useData();

    // State for interactive logic
    const [testWeight, setTestWeight] = useState(5);
    const [testState, setTestState] = useState('Maharashtra');
    const [testCity, setTestCity] = useState('Mumbai');

    const recommendations = getRecommendations(testState, testCity, testWeight);
    const optimal = recommendations[0];

    return (
        <div className="carrier-view animate-fade">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <h2>Domestic Carrier Orchestration</h2>
                    <p className="text-muted">Dynamic Node Selection for Pan-India Routes</p>
                </div>

                <div className="test-controls glass" style={{ padding: '12px 20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div className="input-group">
                        <label style={{ fontSize: '0.7rem', display: 'block', marginBottom: '4px' }}>WEIGHT (KG)</label>
                        <input
                            type="number"
                            value={testWeight}
                            onChange={(e) => setTestWeight(parseFloat(e.target.value) || 0)}
                            style={{ background: 'transparent', border: 'none', color: '#fff', width: '50px', fontWeight: 'bold' }}
                        />
                    </div>
                    <div className="input-group">
                        <label style={{ fontSize: '0.7rem', display: 'block', marginBottom: '4px' }}>DESTINATION</label>
                        <select
                            value={testState}
                            onChange={(e) => setTestState(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: '#fff', fontWeight: 'bold' }}
                        >
                            <option value="Maharashtra">Maharashtra (Mumbai)</option>
                            <option value="Delhi">Delhi (NCR)</option>
                            <option value="Karnataka">Karnataka (Bengaluru)</option>
                            <option value="West Bengal">West Bengal (Kolkata)</option>
                            <option value="Assam">Assam (Guwahati)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="optimal-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="recommendation-hero glass animate-fade" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '0', right: '0', background: 'var(--primary)', padding: '4px 12px', fontSize: '0.7rem' }}>RANK #1</div>
                    <span className="badge">MOST COST-EFFECTIVE</span>
                    <h3 style={{ fontSize: '1.8rem', margin: '8px 0' }}>{optimal?.carrier}</h3>
                    <p className="text-muted">{optimal?.service}</p>

                    <div className="rate-info">
                        <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ESTIMATED COST</span>
                            <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>₹{optimal?.estimatedCost.toFixed(2)}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SERVICE SLA</span>
                            <p style={{ fontWeight: '600' }}>{optimal?.sla}</p>
                        </div>
                    </div>
                    <button className="btn-primary glass-hover" style={{ width: '100%', marginTop: '24px' }}>Assign to Active Queue</button>
                </div>

                <div className="alternatives glass" style={{ padding: '32px' }}>
                    <h3>Alternative Route Nodes</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                        {recommendations.slice(1).map((carrier, idx) => (
                            <div key={idx} className="glass glass-hover" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong>{carrier.carrier}</strong>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{carrier.service} • {carrier.sla}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 'bold' }}>₹{carrier.estimatedCost.toFixed(0)}</p>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+{((carrier.estimatedCost / (optimal?.estimatedCost || 1) - 1) * 100).toFixed(0)}% Price Delta</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarrierSelection;
