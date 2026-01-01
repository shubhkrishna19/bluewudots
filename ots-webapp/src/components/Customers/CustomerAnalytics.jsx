import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const CustomerAnalytics = () => {
    const { customerMaster, getCustomerMetrics } = useData();

    const analysis = useMemo(() => {
        const segments = { VIP: 0, Regular: 0, New: 0, 'At Risk': 0 };
        const ltvBySegment = { VIP: 0, Regular: 0, New: 0, 'At Risk': 0 };
        const topCustomers = [];

        customerMaster.forEach(c => {
            const metrics = getCustomerMetrics(c.phone);
            segments[metrics.segment]++;
            ltvBySegment[metrics.segment] += metrics.totalSpend;
            topCustomers.push({ name: c.name, ltv: metrics.totalSpend, segment: metrics.segment });
        });

        const segmentData = Object.keys(segments).map(name => ({ name, value: segments[name] }));
        const ltvData = Object.keys(ltvBySegment).map(name => ({ name, ltv: Math.round(ltvBySegment[name]) }));
        topCustomers.sort((a, b) => b.ltv - a.ltv);

        return { segmentData, ltvData, top5: topCustomers.slice(0, 5) };
    }, [customerMaster, getCustomerMetrics]);

    const COLORS = ['#F59E0B', '#6366F1', '#10B981', '#EF4444'];

    return (
        <div className="customer-analytics animate-fade">
            <div className="section-header">
                <h2>Customer Intelligence</h2>
                <p className="text-muted">Enterprise LTV & Cohort Analytics</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '32px' }}>
                {/* Segment Distribution */}
                <div className="glass" style={{ padding: '24px', minHeight: '400px' }}>
                    <h3 style={{ marginBottom: '24px' }}>Segment Distribution</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analysis.segmentData}
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {analysis.segmentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: 'rgba(30, 41, 59, 0.9)', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* LTV by Segment */}
                <div className="glass" style={{ padding: '24px', minHeight: '400px' }}>
                    <h3 style={{ marginBottom: '24px' }}>Total LTV by Segment (₹)</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analysis.ltvData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ background: 'rgba(30, 41, 59, 0.9)', border: 'none', borderRadius: '8px' }}
                                />
                                <Bar dataKey="ltv" radius={[4, 4, 0, 0]}>
                                    {analysis.ltvData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Customers Table */}
            <div className="glass" style={{ marginTop: '24px', padding: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>Top 5 Enterprise Customers (LTV)</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', opacity: 0.6, fontSize: '0.8rem' }}>
                                <th style={{ padding: '12px' }}>CUSTOMER NAME</th>
                                <th style={{ padding: '12px' }}>SEGMENT</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>LIFETIME VALUE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analysis.top5.map((c, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '12px', fontWeight: '600' }}>{c.name}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span className="badge" style={{
                                            background: c.segment === 'VIP' ? 'var(--warning)' :
                                                c.segment === 'At Risk' ? 'var(--danger)' : 'var(--primary)',
                                            fontSize: '0.7rem'
                                        }}>{c.segment}</span>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700', color: 'var(--success)' }}>
                                        ₹{c.ltv.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CustomerAnalytics;
