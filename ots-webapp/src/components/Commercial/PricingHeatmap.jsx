import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { useData } from '../../context/DataContext';

const PricingHeatmap = () => {
    const { skuMaster, getSKUProfitability } = useData();

    const data = skuMaster
        .filter(s => !s.isParent)
        .map(child => {
            const prof = getSKUProfitability(child.sku);
            return {
                name: child.sku,
                netRealization: prof?.netRealization || 0,
                landingCost: prof?.landingCost || 0,
                margin: prof?.marginPercent || 0
            };
        });

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass" style={{ padding: '12px', border: '1px solid var(--glass-border)' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>{label}</p>
                    <p style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>Net Realization: ₹{payload[0].value}</p>
                    <p style={{ color: 'var(--warning)', fontSize: '0.8rem' }}>Landing Cost: ₹{payload[1].value}</p>
                    <p style={{ color: 'var(--success)', fontWeight: 'bold', marginTop: '4px' }}>Margin: {payload[0].payload.margin}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} />
                    <YAxis stroke="var(--text-muted)" fontSize={10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="netRealization" name="Net Realization" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={'var(--primary)'} fillOpacity={0.8} />
                        ))}
                    </Bar>
                    <Bar dataKey="landingCost" name="Landing Cost" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={'var(--warning)'} fillOpacity={0.8} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PricingHeatmap;
