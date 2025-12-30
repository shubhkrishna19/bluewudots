import React from 'react';
import { useData } from '../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CarrierPerformance = () => {
    const { logistics, orders } = useData();

    // Mock performance data - in production from carrier API webhooks
    const carrierData = [
        {
            name: 'Delhivery',
            deliveryRate: 94.2,
            avgDays: 4.2,
            rtoRate: 3.1,
            totalShipments: 450,
            onTime: 89,
            rating: 4.5
        },
        {
            name: 'BlueDart',
            deliveryRate: 97.8,
            avgDays: 2.1,
            rtoRate: 1.2,
            totalShipments: 180,
            onTime: 95,
            rating: 4.8
        },
        {
            name: 'XpressBees',
            deliveryRate: 91.5,
            avgDays: 5.3,
            rtoRate: 4.5,
            totalShipments: 320,
            onTime: 82,
            rating: 4.1
        },
        {
            name: 'Ecom Express',
            deliveryRate: 89.3,
            avgDays: 5.8,
            rtoRate: 5.2,
            totalShipments: 210,
            onTime: 78,
            rating: 3.9
        }
    ];

    const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444'];

    const pieData = carrierData.map(c => ({ name: c.name, value: c.totalShipments }));

    return (
        <div className="carrier-performance animate-fade">
            <div className="section-header">
                <h2>Carrier Performance</h2>
                <p className="text-muted">Compare carrier metrics and optimize logistics</p>
            </div>

            {/* Summary Cards */}
            <div className="perf-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px' }}>
                {carrierData.map((carrier, idx) => (
                    <div key={carrier.name} className="carrier-card glass glass-hover" style={{ padding: '24px', borderTop: `4px solid ${COLORS[idx]}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h3>{carrier.name}</h3>
                            <span style={{ fontSize: '1.2rem' }}>{'⭐'.repeat(Math.floor(carrier.rating))}</span>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span className="text-muted">Delivery Rate</span>
                                <span style={{ fontWeight: '700', color: carrier.deliveryRate > 95 ? 'var(--success)' : carrier.deliveryRate > 90 ? 'var(--warning)' : 'var(--danger)' }}>
                                    {carrier.deliveryRate}%
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span className="text-muted">Avg. Days</span>
                                <span style={{ fontWeight: '700' }}>{carrier.avgDays}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span className="text-muted">RTO Rate</span>
                                <span style={{ fontWeight: '700', color: carrier.rtoRate < 2 ? 'var(--success)' : carrier.rtoRate < 4 ? 'var(--warning)' : 'var(--danger)' }}>
                                    {carrier.rtoRate}%
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-muted">Shipments</span>
                                <span style={{ fontWeight: '700' }}>{carrier.totalShipments}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '32px' }}>
                {/* Delivery Rate Chart */}
                <div className="glass" style={{ padding: '24px' }}>
                    <h3>On-Time Delivery Rate (%)</h3>
                    <div style={{ height: '300px', marginTop: '20px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={carrierData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#888" />
                                <YAxis stroke="#888" domain={[75, 100]} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--bg-accent)', border: 'none', borderRadius: '8px' }}
                                />
                                <Bar dataKey="onTime" fill="#6366F1" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Shipment Distribution */}
                <div className="glass" style={{ padding: '24px' }}>
                    <h3>Shipment Distribution</h3>
                    <div style={{ height: '300px', marginTop: '20px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
                        {carrierData.map((c, idx) => (
                            <span key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                                <span style={{ width: '12px', height: '12px', background: COLORS[idx], borderRadius: '3px' }}></span>
                                {c.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div className="glass" style={{ marginTop: '24px', padding: '24px' }}>
                <h3>💡 Recommendations</h3>
                <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="glass" style={{ padding: '16px', borderLeft: '4px solid var(--success)' }}>
                        <p style={{ fontWeight: '700' }}>Best for Premium</p>
                        <p className="text-muted">Use BlueDart for high-value orders - 97.8% delivery rate</p>
                    </div>
                    <div className="glass" style={{ padding: '16px', borderLeft: '4px solid var(--primary)' }}>
                        <p style={{ fontWeight: '700' }}>Best for Volume</p>
                        <p className="text-muted">Use Delhivery for bulk shipments - best cost-delivery balance</p>
                    </div>
                    <div className="glass" style={{ padding: '16px', borderLeft: '4px solid var(--warning)' }}>
                        <p style={{ fontWeight: '700' }}>Watch: XpressBees</p>
                        <p className="text-muted">RTO rate trending up - review Northeast zone performance</p>
                    </div>
                    <div className="glass" style={{ padding: '16px', borderLeft: '4px solid var(--danger)' }}>
                        <p style={{ fontWeight: '700' }}>Action Needed</p>
                        <p className="text-muted">Ecom Express below 90% - consider reducing allocation</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarrierPerformance;
