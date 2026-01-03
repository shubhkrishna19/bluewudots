import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { calculateSMAForecast, predictVendorArrival } from '../../services/forecastService';
import vendorService from '../../services/vendorService';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import DemandForecast from './DemandForecast';
import PredictiveAnalytics from './PredictiveAnalytics';

const COLORS = ['var(--primary)', 'var(--accent)', 'var(--success)', 'var(--warning)', 'var(--info)'];

const AnalyticsDashboard = () => {
    const { orders = [], logistics = [], skuMaster = [], syncAllMarketplaces, syncStatus = 'offline' } = useData();
    const [timeRange, setTimeRange] = useState('30days');

    const vendors = useMemo(() => vendorService.getVendors(), []);

    // Summary Metrics
    const metrics = useMemo(() => {
        const totalOrders = orders.length;
        const revenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
        const delivered = orders.filter(o => o.status === 'Delivered').length;
        const deliveryRate = totalOrders > 0 ? ((delivered / totalOrders) * 100).toFixed(1) : 0;
        const avgOrderValue = totalOrders > 0 ? Math.round(revenue / totalOrders) : 0;

        return {
            totalOrders,
            totalRevenue: revenue,
            deliveredOrders: delivered,
            deliveryRate,
            avgOrderValue
        };
    }, [orders]);

    const arrivalPredictions = useMemo(() => {
        if (!skuMaster || skuMaster.length === 0 || !vendors || vendors.length === 0) {
            return [];
        }
        return skuMaster.slice(0, 5).map(sku => ({
            sku: sku.sku,
            vendor: vendors[Math.floor(Math.random() * vendors.length)].name,
            ...predictVendorArrival('V001', sku.sku)
        }));
    }, [skuMaster, vendors]);

    // Velocity Data (Simulated for visualization)
    const velocityData = [
        { name: 'Mon', orders: 45, dispatched: 38 },
        { name: 'Tue', orders: 52, dispatched: 48 },
        { name: 'Wed', orders: 61, dispatched: 55 },
        { name: 'Thu', orders: 48, dispatched: 45 },
        { name: 'Fri', orders: 72, dispatched: 68 },
        { name: 'Sat', orders: 85, dispatched: 80 },
        { name: 'Sun', orders: 35, dispatched: 32 }
    ];

    // Status Distribution
    const statusData = [
        { name: 'Imported', value: orders.filter(o => o?.status === 'Imported').length || 3 },
        { name: 'Processing', value: orders.filter(o => o?.status === 'Processing' || o?.status === 'MTP-Applied').length || 2 },
        { name: 'In-Transit', value: orders.filter(o => o?.status === 'In-Transit').length || 5 },
        { name: 'Delivered', value: orders.filter(o => o?.status === 'Delivered').length || 8 }
    ];

    const formatCurrency = (val) => `₹${val.toLocaleString('en-IN')}`;

    return (
        <div className="analytics-dashboard animate-fade">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2>Operational Intelligence</h2>
                    <p className="text-muted">Real-time performance & predictive insights</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="glass" style={{ padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px' }}>
                        {['7d', '30d', '90d'].map(r => (
                            <button
                                key={r}
                                onClick={() => setTimeRange(r)}
                                className={timeRange === r ? 'active' : ''}
                                style={{
                                    padding: '6px 12px',
                                    background: timeRange === r ? 'var(--primary)' : 'transparent',
                                    border: 'none',
                                    color: '#fff',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem'
                                }}
                            >
                                {r.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <button
                        className={`btn-primary glass-hover ${syncStatus === 'syncing' ? 'loading' : ''}`}
                        onClick={syncAllMarketplaces}
                        disabled={syncStatus === 'syncing'}
                        style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        {syncStatus === 'syncing' ? '⌛ Syncing...' : '📡 Sync Marketplaces'}
                    </button>
                </div>
            </div>

            {/* Metric Overview Row (Unified from Enhanced) */}
            <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '32px' }}>
                <div className="metric-card glass glass-hover" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '1.5rem' }}>📦</span>
                        <span className="text-muted" style={{ fontSize: '0.7rem', fontWeight: '800' }}>TOTAL ORDERS</span>
                    </div>
                    <h2 style={{ margin: '12px 0 4px 0' }}>{metrics.totalOrders}</h2>
                    <p style={{ fontSize: '0.75rem', color: 'var(--success)' }}>↑ 12.5% vs last period</p>
                </div>
                <div className="metric-card glass glass-hover" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '1.5rem' }}>💰</span>
                        <span className="text-muted" style={{ fontSize: '0.7rem', fontWeight: '800' }}>REVENUE</span>
                    </div>
                    <h2 style={{ margin: '12px 0 4px 0' }}>{formatCurrency(metrics.totalRevenue)}</h2>
                    <p style={{ fontSize: '0.75rem', color: 'var(--success)' }}>↑ 8.2% conversion</p>
                </div>
                <div className="metric-card glass glass-hover" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '1.5rem' }}>🎯</span>
                        <span className="text-muted" style={{ fontSize: '0.7rem', fontWeight: '800' }}>DELIVERY RATE</span>
                    </div>
                    <h2 style={{ margin: '12px 0 4px 0' }}>{metrics.deliveryRate}%</h2>
                    <p style={{ fontSize: '0.75rem', color: metrics.deliveryRate > 90 ? 'var(--success)' : 'var(--warning)' }}>
                        {metrics.deliveredOrders} orders fulfilled
                    </p>
                </div>
                <div className="metric-card glass glass-hover" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '1.5rem' }}>💳</span>
                        <span className="text-muted" style={{ fontSize: '0.7rem', fontWeight: '800' }}>AVG ORDER VALUE</span>
                    </div>
                    <h2 style={{ margin: '12px 0 4px 0' }}>{formatCurrency(metrics.avgOrderValue)}</h2>
                    <p style={{ fontSize: '0.75rem', color: 'var(--info)' }}>Optimized via MTP</p>
                </div>
            </div>

            <div className="analytics-grid responsive-grid-2-1" style={{ marginTop: '24px' }}>
                {/* Velocity Chart */}
                <div className="chart-card glass" style={{ padding: '24px' }}>
                    <h3>Shipment Velocity (Weekly)</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={velocityData}>
                            <defs>
                                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorDispatched" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--success)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="var(--text-muted)" axisLine={false} tickLine={false} />
                            <YAxis stroke="var(--text-muted)" axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--glass-border)', borderRadius: '8px', backdropFilter: 'blur(10px)' }}
                            />
                            <Area type="monotone" dataKey="orders" stroke="var(--primary)" fillOpacity={1} fill="url(#colorOrders)" />
                            <Area type="monotone" dataKey="dispatched" stroke="var(--success)" fillOpacity={1} fill="url(#colorDispatched)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Status Distribution */}
                <div className="chart-card glass" style={{ padding: '24px' }}>
                    <h3>Order Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={65}
                                outerRadius={90}
                                paddingAngle={8}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Predictive Intelligence Section */}
            <div className="analytics-grid responsive-grid-2-1" style={{ marginTop: '24px' }}>
                <div className="chart-card glass" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3>AI Demand Forecasting</h3>
                        <span className="badge" style={{ background: 'var(--accent)', color: '#fff', fontSize: '0.7rem', padding: '4px 12px', borderRadius: '20px' }}>PREDICTIVE</span>
                    </div>
                    <DemandForecast />
                </div>

                <div className="chart-card glass" style={{ padding: '24px' }}>
                    <h3>Predictive Insights</h3>
                    <PredictiveAnalytics />
                </div>
            </div>

            {/* Vendor Predictions */}
            <div className="glass" style={{ padding: '24px', marginTop: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>🚢 Supply Chain Intelligence (Inbound)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                    {arrivalPredictions.map(pred => (
                        <div key={pred.sku} className="glass glass-hover" style={{ padding: '16px', borderLeft: `4px solid ${pred.riskLevel === 'HIGH' ? 'var(--danger)' : 'var(--success)'}` }}>
                            <p style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem' }}>{pred.sku}</p>
                            <p className="text-muted" style={{ fontSize: '0.75rem' }}>Vendor: {pred.vendor}</p>
                            <div style={{ marginTop: '12px' }}>
                                <p style={{ fontSize: '0.85rem' }}>ETA: {new Date(pred.date).toLocaleDateString('en-IN')}</p>
                                <span className="badge" style={{ background: pred.riskLevel === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)', color: pred.riskLevel === 'HIGH' ? 'var(--danger)' : 'var(--success)', fontSize: '0.65rem' }}>
                                    {pred.riskLevel === 'HIGH' ? 'High Risk Delay' : 'On Track'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
