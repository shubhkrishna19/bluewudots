import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';

const DemandForecast = () => {
    const { getDemandForecast } = useData();

    const data = useMemo(() => {
        // Fetch last 30 days and forecast next 7 days
        return getDemandForecast(30, 7);
    }, [getDemandForecast]);

    if (!data || data.length === 0) {
        return (
            <div className="forecast-placeholder glass" style={{ padding: '24px', textAlign: 'center' }}>
                <p className="text-muted">Insufficient data for demand forecasting</p>
                <small>Requires historical order data to generate predictions.</small>
            </div>
        );
    }

    // Find the split point between actual and forecast
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="forecast-container">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="date"
                        stroke="var(--text-muted)"
                        tickFormatter={(str) => {
                            const d = new Date(str);
                            return `${d.getDate()}/${d.getMonth() + 1}`;
                        }}
                    />
                    <YAxis stroke="var(--text-muted)" />
                    <Tooltip
                        contentStyle={{ background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                        labelStyle={{ color: 'var(--text-main)' }}
                    />
                    <Legend />
                    <ReferenceLine x={today} stroke="var(--warning)" label={{ value: 'Today', fill: 'var(--warning)', position: 'insideTopRight' }} />

                    <Line
                        type="monotone"
                        dataKey="actual"
                        name="Actual Orders"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        dot={false}
                        connectNulls
                    />
                    <Line
                        type="monotone"
                        dataKey="forecast"
                        name="AI Forecast"
                        stroke="var(--accent)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DemandForecast;
