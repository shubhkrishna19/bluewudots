import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import mlForecastService from '../../services/mlForecastService';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, Calendar, Target } from 'lucide-react';

const DemandForecast = () => {
    const { orders, skuMaster } = useData();
    const [selectedSKU, setSelectedSKU] = useState('');
    const [forecastDays, setForecastDays] = useState(30);
    const [viewMode, setViewMode] = useState('FORECAST'); // FORECAST | DECOMPOSITION | BATCH

    // Generate forecast for selected SKU
    const forecastData = useMemo(() => {
        if (!selectedSKU || !orders.length) return null;
        return mlForecastService.predictDemand(orders, selectedSKU, forecastDays);
    }, [selectedSKU, orders, forecastDays]);

    // Batch forecast for top SKUs
    const batchData = useMemo(() => {
        if (viewMode !== 'BATCH' || !orders.length) return null;
        const topSKUs = [...new Set(orders.map(o => o.sku))].slice(0, 10);
        return mlForecastService.batchForecast(orders, topSKUs, 7);
    }, [orders, viewMode]);

    // Prepare chart data
    const chartData = useMemo(() => {
        if (!forecastData || forecastData.error) return [];

        const historical = forecastData.history.map(h => ({
            date: h.date,
            actual: h.quantity,
            forecast: null,
            low95: null,
            high95: null
        }));

        const predicted = forecastData.forecast.map(f => ({
            date: f.date,
            actual: null,
            forecast: f.quantity,
            low95: f.low95,
            high95: f.high95,
            holidayEffect: f.holidayEffect
        }));

        return [...historical, ...predicted];
    }, [forecastData]);

    // Decomposition chart data
    const decompositionData = useMemo(() => {
        if (!forecastData || forecastData.error) return [];
        return forecastData.forecast.slice(0, 14).map(f => ({
            date: f.date,
            trend: f.trend,
            seasonal: f.seasonal,
            total: f.quantity
        }));
    }, [forecastData]);

    return (
        <div className="demand-forecast animate-fade">
            {/* Header */}
            <div className="section-header">
                <div>
                    <h2>📈 ML Demand Forecast</h2>
                    <p className="text-muted">Prophet-inspired forecasting with holiday effects & changepoint detection</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        className={`btn-${viewMode === 'FORECAST' ? 'primary' : 'secondary'} glass-hover`}
                        onClick={() => setViewMode('FORECAST')}
                    >
                        📊 Forecast
                    </button>
                    <button
                        className={`btn-${viewMode === 'DECOMPOSITION' ? 'primary' : 'secondary'} glass-hover`}
                        onClick={() => setViewMode('DECOMPOSITION')}
                    >
                        🔬 Decomposition
                    </button>
                    <button
                        className={`btn-${viewMode === 'BATCH' ? 'primary' : 'secondary'} glass-hover`}
                        onClick={() => setViewMode('BATCH')}
                    >
                        ⚡ Batch Analysis
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="glass" style={{ padding: '20px', marginTop: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                    <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>SELECT SKU</label>
                    <select
                        value={selectedSKU}
                        onChange={(e) => setSelectedSKU(e.target.value)}
                        style={{ width: '100%', padding: '12px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                    >
                        <option value="">-- Choose SKU --</option>
                        {skuMaster.map(sku => (
                            <option key={sku.sku} value={sku.sku}>{sku.sku} - {sku.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>FORECAST DAYS</label>
                    <select
                        value={forecastDays}
                        onChange={(e) => setForecastDays(Number(e.target.value))}
                        style={{ padding: '12px 20px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                    >
                        <option value={7}>7 Days</option>
                        <option value={14}>14 Days</option>
                        <option value={30}>30 Days</option>
                        <option value={60}>60 Days</option>
                    </select>
                </div>
            </div>

            {/* Metrics Cards */}
            {forecastData && !forecastData.error && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px' }}>
                    <div className="glass" style={{ padding: '20px', borderLeft: '4px solid var(--primary)' }}>
                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>GROWTH RATE</span>
                        <h3 style={{ marginTop: '8px', color: forecastData.metrics.growthRate > 0 ? 'var(--success)' : 'var(--danger)' }}>
                            {forecastData.metrics.growthRate > 0 ? '+' : ''}{forecastData.metrics.growthRate}%
                        </h3>
                    </div>
                    <div className="glass" style={{ padding: '20px', borderLeft: '4px solid var(--accent)' }}>
                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>AVG DEMAND</span>
                        <h3 style={{ marginTop: '8px' }}>{forecastData.metrics.avgDemand} units/day</h3>
                    </div>
                    <div className="glass" style={{ padding: '20px', borderLeft: '4px solid var(--warning)' }}>
                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>VOLATILITY</span>
                        <h3 style={{ marginTop: '8px' }}>{forecastData.metrics.volatility}</h3>
                    </div>
                    <div className="glass" style={{ padding: '20px', borderLeft: '4px solid var(--info)' }}>
                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>CHANGEPOINTS</span>
                        <h3 style={{ marginTop: '8px' }}>{forecastData.metrics.changepointCount}</h3>
                    </div>
                </div>
            )}

            {/* Main Chart */}
            {viewMode === 'FORECAST' && (
                <div className="glass" style={{ padding: '24px', marginTop: '24px' }}>
                    {!selectedSKU ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                            <Calendar className="mx-auto mb-4" size={48} style={{ opacity: 0.3 }} />
                            <p>Select a SKU to view demand forecast</p>
                        </div>
                    ) : forecastData?.error ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--warning)' }}>
                            <AlertTriangle className="mx-auto mb-4" size={48} />
                            <p>{forecastData.error}</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={400}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                                <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 10 }} />
                                <YAxis stroke="var(--text-muted)" />
                                <Tooltip
                                    contentStyle={{ background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                                    labelStyle={{ color: 'var(--text-muted)' }}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="high95" stroke="none" fill="var(--glass-border)" fillOpacity={0.2} name="95% Confidence" />
                                <Area type="monotone" dataKey="low95" stroke="none" fill="transparent" />
                                <Line type="monotone" dataKey="actual" stroke="var(--success)" strokeWidth={2} dot={{ r: 3 }} name="Actual Demand" />
                                <Line type="monotone" dataKey="forecast" stroke="var(--primary)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} fill="url(#colorForecast)" name="Predicted Demand" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            )}

            {/* Decomposition View */}
            {viewMode === 'DECOMPOSITION' && forecastData && !forecastData.error && (
                <div className="glass" style={{ padding: '24px', marginTop: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Trend-Seasonal Decomposition</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={decompositionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                            <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 10 }} />
                            <YAxis stroke="var(--text-muted)" />
                            <Tooltip
                                contentStyle={{ background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="trend" stroke="var(--primary)" strokeWidth={2} name="Trend Component" />
                            <Line type="monotone" dataKey="seasonal" stroke="var(--accent)" strokeWidth={2} name="Seasonal Component" />
                            <Line type="monotone" dataKey="total" stroke="var(--success)" strokeWidth={3} name="Total Forecast" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Batch Analysis */}
            {viewMode === 'BATCH' && batchData && (
                <div className="glass" style={{ padding: '24px', marginTop: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3>Top 10 SKUs - 7-Day Forecast</h3>
                        <span className="badge" style={{ background: 'var(--success)' }}>
                            {batchData.performance.durationMs}ms ({batchData.performance.avgTimePerSku}ms/SKU)
                        </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {Object.entries(batchData.forecasts).map(([sku, data]) => (
                            <div key={sku} className="glass-hover" style={{ padding: '16px', cursor: 'pointer' }} onClick={() => setSelectedSKU(sku)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{sku}</span>
                                    {!data.error && (
                                        <span className={`badge ${data.metrics.growthRate > 0 ? 'success' : 'danger'}`}>
                                            {data.metrics.growthRate > 0 ? '↗' : '↘'} {data.metrics.growthRate}%
                                        </span>
                                    )}
                                </div>
                                {data.error ? (
                                    <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '8px' }}>{data.error}</p>
                                ) : (
                                    <div style={{ marginTop: '12px' }}>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>7-DAY FORECAST</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                                            {data.forecast.reduce((sum, d) => sum + d.quantity, 0)} units
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DemandForecast;
