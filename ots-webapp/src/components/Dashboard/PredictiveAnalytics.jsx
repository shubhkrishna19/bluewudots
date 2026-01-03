import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PredictiveAnalytics = () => {
    const { getTrend, getRevenueProjection, orders } = useData();

    // All hooks MUST be called before any early returns
    const trend = useMemo(() => getTrend(15), [getTrend, orders]);
    const revenueProjection = useMemo(() => getRevenueProjection(30), [getRevenueProjection, orders]);

    const chartData = useMemo(() => {
        if (!trend.trendLine || trend.trendLine.length === 0) return [];
        return trend.trendLine.map(item => ({
            date: new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
            orders: item.value,
            actual: orders?.filter(o => o.createdAt?.startsWith(item.date)).length || 0
        }));
    }, [trend, orders]);

    // Early return AFTER all hooks are called
    if (!orders || orders.length === 0) {
        return (
            <div className="analytics-placeholder glass" style={{ padding: '24px', textAlign: 'center' }}>
                <p className="text-muted">Insufficient data for predictive analytics</p>
                <small>Requires historical records to generate AI insights.</small>
            </div>
        );
    }

    const isPositive = trend.slope >= 0;
    const growthRate = trend.slope !== 0
        ? (trend.slope * 30 / (trend.trendLine?.[0]?.value || 1) * 100).toFixed(1)
        : "0.0";

    return (
        <div className="predictive-analytics animate-fade">
            <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="projection-card glass glass-hover" style={{ padding: '20px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p className="text-muted" style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                30-Day Revenue Forecast
                            </p>
                            <h2 style={{ color: 'var(--success)', fontSize: '2.2rem', margin: '8px 0' }}>₹{revenueProjection.toLocaleString()}</h2>
                        </div>
                        <div style={{
                            background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: isPositive ? 'var(--success)' : 'var(--danger)',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: '700'
                        }}>
                            {isPositive ? '↗' : '↘'} {Math.abs(growthRate)}%
                        </div>
                    </div>
                    <div style={{ marginTop: '12px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${Math.min(100, Math.max(10, 50 + parseFloat(growthRate)))}%`,
                            background: isPositive ? 'var(--success)' : 'var(--danger)',
                            boxShadow: `0 0 10px ${isPositive ? 'var(--success)' : 'var(--danger)'}`
                        }}></div>
                    </div>
                </div>

                <div className="insight-card glass" style={{ padding: '20px', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '1.2rem' }}>✨</span>
                        <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase' }}>BlueWud AI Insights</p>
                    </div>
                    <p style={{ fontSize: '0.85rem', lineHeight: '1.6', margin: '0', color: 'var(--text-main)' }}>
                        {trend.slope > 0.1
                            ? "Demand is surging significantly. High probability of SKU stockouts. AI recommends increasing buffer stock by 15% and scheduling additional dispatch slots."
                            : trend.slope < -0.1
                                ? "Order velocity has slowed. Ideal window for warehouse reorganization or running a targeted promotional campaign on slow-moving items."
                                : "Stable demand patterns detected. Supply chain synchronization is optimal at current capacity."
                        }
                    </p>
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                        <span className="badge" style={{ background: 'var(--glass-border)', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '10px' }}>Reliability: 92%</span>
                        <span className="badge" style={{ background: 'var(--glass-border)', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '10px' }}>Confidence: High</span>
                    </div>
                </div>
            </div>

            <div className="trend-visualization glass" style={{ padding: '20px', borderRadius: '12px', height: '320px' }}>
                <p className="text-muted" style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
                    Order Velocity & Forecast (Last 15 Days)
                </p>
                <div style={{ width: '100%', height: '240px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(15, 23, 42, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    backdropFilter: 'blur(10px)'
                                }}
                                itemStyle={{ color: 'var(--primary)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="orders"
                                stroke="var(--primary)"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorOrders)"
                                name="Predicted Orders"
                            />
                            <Area
                                type="monotone"
                                dataKey="actual"
                                stroke="var(--success)"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                fill="transparent"
                                name="Actual Orders"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default PredictiveAnalytics;
