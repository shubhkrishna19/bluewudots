import React, { useMemo, useState } from 'react';
import { useData } from '@/context/DataContext';
import { useLocalization } from '@/context/LocalizationContext';
import { calculateSMAForecast, predictVendorArrival } from '../../services/forecastService';
import vendorService from '../../services/vendorService';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import DemandForecast from '../Analytics/DemandForecast';
import PredictiveAnalytics from './PredictiveAnalytics';

const COLORS = ['var(--primary)', 'var(--accent)', 'var(--success)', 'var(--warning)', 'var(--info)'];

const AnalyticsDashboard = () => {
    const { t } = useLocalization();
    const { orders = [], sales = [], logistics = [], skuMaster = [], syncAllMarketplaces, syncStatus = 'offline', recentEvents = [], kpiGoals = {} } = useData();
    const [timeRange, setTimeRange] = useState('30days');

    const vendors = useMemo(() => vendorService.getVendors(), []);

    // Summary Metrics
    const metrics = useMemo(() => {
        const totalOrders = orders.length;
        // Map revenue from Sales data
        const revenue = sales.reduce((sum, s) => sum + (s.amount || 0), 0);
        const delivered = orders.filter(o => o.status === 'Delivered').length;
        const deliveryRate = totalOrders > 0 ? ((delivered / totalOrders) * 100).toFixed(1) : 0;

        // Count unique order IDs in sales file for true AOV if possible, or just use count
        const avgOrderValue = sales.length > 0 ? Math.round(revenue / sales.length) : 0;

        return {
            totalOrders,
            totalRevenue: revenue,
            deliveredOrders: delivered,
            deliveryRate,
            avgOrderValue
        };
    }, [orders, sales]);

    const kpiProgress = useMemo(() => {
        return {
            revenue: (metrics.totalRevenue / (kpiGoals.revenue || 1000000)) * 100,
            orders: (metrics.totalOrders / (kpiGoals.orders || 100)) * 100
        };
    }, [metrics, kpiGoals]);

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

    // Status Distribution based on Real Data
    const statusData = useMemo(() => {
        const statuses = ['Pending', 'Processing', 'In-Transit', 'Delivered', 'Cancelled', 'Returned'];
        return statuses.map(s => ({
            name: s,
            value: orders.filter(o => o.status === s).length
        })).filter(s => s.value > 0);
    }, [orders]);

    const formatCurrency = (val) => `₹${val.toLocaleString('en-IN')}`;

    return (
        <div className="analytics-dashboard animate-fade">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2>{t('dashboard.operational_intelligence', 'Operational Intelligence')}</h2>
                    <p className="text-muted">{t('dashboard.subtitle', 'Real-time performance & predictive insights')}</p>
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
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(kpiProgress.orders, 100)}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.5s' }}></div>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '8px' }}>Target: {kpiGoals.orders} orders</p>
                </div>

                <div className="metric-card glass glass-hover" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '1.5rem' }}>💰</span>
                        <span className="text-muted" style={{ fontSize: '0.7rem', fontWeight: '800' }}>REVENUE</span>
                    </div>
                    <h2 style={{ margin: '12px 0 4px 0' }}>{formatCurrency(metrics.totalRevenue)}</h2>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(kpiProgress.revenue, 100)}%`, height: '100%', background: 'var(--success)', transition: 'width 0.5s' }}></div>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '8px' }}>Target: {formatCurrency(kpiGoals.revenue)}</p>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-muted" style={{ fontSize: '0.7rem', fontWeight: '800' }}>LIVE PULSE</span>
                        <span className="pulse-dot"></span>
                    </div>
                    <div className="event-scroller" style={{ marginTop: '10px', maxHeight: '60px', overflow: 'hidden' }}>
                        {recentEvents.length > 0 ? (
                            <div className="event-item" key={recentEvents[0].id} style={{ animation: 'slideIn 0.3s ease-out' }}>
                                <p style={{ fontSize: '0.8rem', color: '#fff' }}>{recentEvents[0].payload.message}</p>
                                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{new Date(recentEvents[0].timestamp).toLocaleTimeString()}</span>
                            </div>
                        ) : (
                            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Awaiting data streams...</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="analytics-grid responsive-grid-2-1" style={{ marginTop: '24px' }}>
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

                <div className="activity-feed glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                    <h3>Live Activity Feed</h3>
                    <div className="feed-items" style={{ marginTop: '15px', overflowY: 'auto', flex: 1 }}>
                        {recentEvents.map(event => (
                            <div key={event.id} className="feed-item" style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <span className={`severity-dot ${event.severity}`}></span>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', margin: 0 }}>{event.payload.message}</p>
                                        <div style={{ display: 'flex', gap: '10px', fontSize: '0.65rem', color: '#64748b', marginTop: '4px' }}>
                                            <span>{event.source}</span>
                                            <span>•</span>
                                            <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {recentEvents.length === 0 && <p className="text-muted" style={{ textAlign: 'center', marginTop: '40px' }}>No live activity yet.</p>}
                    </div>
                </div>
            </div>

            <div className="analytics-grid responsive-grid-2-1" style={{ marginTop: '24px' }}>
                <div className="chart-card glass" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3>AI Demand Forecasting</h3>
                        <span className="badge" style={{ background: 'var(--accent)', color: '#fff', fontSize: '0.7rem', padding: '4px 12px', borderRadius: '20px' }}>PREDICTIVE</span>
                    </div>
                    <DemandForecast />
                </div>

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

            <style jsx>{`
                .pulse-dot {
                    width: 8px;
                    height: 8px;
                    background: var(--primary);
                    border-radius: 50%;
                    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7);
                    animation: pulse 2s infinite;
                }
                .severity-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-top: 5px;
                }
                .severity-dot.success { background: var(--success); }
                .severity-dot.warning { background: var(--warning); }
                .severity-dot.info { background: var(--info); }
                
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(79, 70, 229, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default AnalyticsDashboard;
