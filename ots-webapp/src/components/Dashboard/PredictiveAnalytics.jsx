import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';

const PredictiveAnalytics = () => {
    const { getTrend, getRevenueProjection, orders } = useData();

    const trend = useMemo(() => getTrend(30), [getTrend]);
    const revenueProjection = useMemo(() => getRevenueProjection(30), [getRevenueProjection]);

    if (!orders || orders.length === 0) {
        return (
            <div className="analytics-placeholder glass" style={{ padding: '24px', textAlign: 'center' }}>
                <p className="text-muted">Insufficient data for predictive analytics</p>
            </div>
        );
    }

    const trendLineValue = trend.trendLine?.[0]?.value || 1;
    const growthRate = (trend.slope * 30 / trendLineValue * 100).toFixed(1);

    return (
        <div className="predictive-analytics">
            <div className="projection-card" style={{ marginBottom: '24px' }}>
                <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>30-DAY REVENUE PROJECTION</p>
                <h2 style={{ color: 'var(--success)', fontSize: '2rem' }}>₹{revenueProjection.toLocaleString()}</h2>
                <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                    <span style={{ color: trend.slope >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {trend.slope >= 0 ? '↗' : '↘'} {Math.abs(growthRate)}%
                    </span>
                    <span className="text-muted"> vs last 30 days</span>
                </p>
            </div>

            <div className="trend-insights">
                <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '12px' }}>AI INSIGHTS</p>
                <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderLeft: '3px solid var(--primary)', borderRadius: '4px' }}>
                    <p style={{ fontSize: '0.85rem' }}>
                        {trend.slope > 0
                            ? "Order volume is trending upwards. Consider increasing warehouse staff for the upcoming week."
                            : "Order volume is currently stable. Optimal time for inventory audits or maintenance."
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PredictiveAnalytics;
